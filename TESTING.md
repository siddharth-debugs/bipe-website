# Testing

Two suites, both in CI:

| Command | What it is | Speed |
| --- | --- | --- |
| `npm test` | Unit tests (Vitest) over pure logic in `lib/` | ~0.5s |
| `npm run test:e2e` | Browser tests (Playwright) driving the two lead forms | ~25s incl. build |

```bash
npm test                              # unit, run once
npx vitest                            # unit, watch mode
npm run test:e2e                      # browser: builds, then drives Chromium
npx playwright test --ui              # browser: pick and watch individual specs
npx playwright test e2e/apply.spec.ts
```

**Always reach for `npm run test:e2e`, not a bare `npx playwright test`.** The
config reuses an already-running dev server locally, so a bare run can silently
test the PREVIOUS build. That is not hypothetical — it produced a clean pass on
deliberately broken code while this suite was being written.

## What is covered today

Pure logic in `lib/` — functions that take inputs and return outputs, with no
network, no browser and no React. That is deliberate: it is where this repo's
expensive bugs have actually lived, and it runs in under a second, so nobody
is tempted to skip it.

| File | Why it is tested |
| --- | --- |
| `lib/crm-forward.test.ts` | The phone rule that **silently dropped real leads**. `.replace(/^91/, "")` was applied unconditionally, so a valid 10-digit mobile beginning 91 (the 9174 / 9198 / 9199 series are live) was cut to 8 digits and rejected. The CRM forward fires the visitor's WhatsApp acknowledgement, so those students saw a success screen and were then never contacted. |
| `lib/admin/leads.test.ts` | Inbox grouping. Submissions from one person must merge even when the phone is typed differently, and phone-less submissions must NOT collapse into one fake prospect. |
| `lib/validation.test.ts` | The gate on every enquiry the site takes. Too strict loses a real prospect, too loose lets junk into the inbox — both fail quietly. |
| `lib/jeecupBannerRounds.test.ts` | The homepage counselling banner rolls on fixed IST dates and hides itself after the last round. Clock-driven, so a wrong threshold shows the wrong thing to everyone. |

## Browser tests (`e2e/`)

Five specs driving a real Chromium against a production build, covering the
two forms that take money-path enquiries.

| Spec | Covers |
| --- | --- |
| `e2e/apply.spec.ts` | Submitting the admissions form and being greeted by first name; an invalid phone keeping you on the form and sending nothing; a 10-digit mobile beginning 91 being accepted end to end. |
| `e2e/alumni.spec.ts` | Choosing a purpose in the introduction modal reveals the note field; reopening always starts from a clean form. |
| `e2e/admin-shell.spec.ts` | The dashboard sidebar is on screen while `/auth/me/` is still in flight; the permission-gated links stay hidden until it answers. |

### Nothing here can create a real lead

Every spec calls `blockSubmissions()` from `e2e/support/`, which:

1. fulfils `/api/submit` locally with the success shape the forms expect, so
   the success path is still exercised, and
2. **aborts every non-local request**, so the backend, the Sampark CRM, the
   WhatsApp sender and analytics are unreachable from a test even if a future
   change adds a call.

This matters more than it sounds: a real submission writes to the backend,
creates a CRM lead and sends the visitor a WhatsApp message. A careless test
would manufacture fake prospects in the admissions inbox.

### These were checked against deliberate breakage

Each was confirmed to actually fail when the behaviour it names is broken, by
introducing the regression and watching it go red. One did not, and that is
recorded in the spec: `reopening the modal always starts from a clean form`
passes today because `AlumniView` unmounts the modal on close, so React
discards the state whatever the component does. It is kept as a guard on that
wiring, not on the reset code, and says so in a comment.

`draws the sidebar while the permission check is still in flight` was checked
the same way: reverting `app/admin/dashboard/layout.tsx` to the version that
waited for `/auth/me/` turns it red, and restoring the fix turns it green.

Its sibling, `reveals the permission-gated links only once the check returns`,
passes against both versions — the old layout revealed everything at once, so
"hidden, then visible" was trivially true there. It is kept because it guards
the new layout against the opposite mistake: showing gated links before the
permissions are known.

### The admin response cache was checked the same way

`lib/admin/responseCache.ts` and its wiring in `lib/admin/api.ts` are the one
place where a bug costs an operator a saved edit rather than a slow page, so
each rule was verified by breaking it and watching the right test go red:

| Break | Test that caught it |
|---|---|
| Writes no longer empty the cache | goes back to the network after a write (+2 more) |
| Signing out no longer empties it | drops everything when the operator signs out |
| Failed reads get stored | never stores a failed read |
| The cache is never consulted | asks the network once for two identical GETs |
| Reads hand out the stored object | does not hand out the object it is holding |
| Writes keep the caller's object | does not keep a reference to what the caller stored |

`lib/admin/api.cache.test.ts` stubs `fetch`, `window` and `localStorage` to
reach the browser-only path from Node. That is deliberate: the cache is gated
on `isBrowser()` so a module-level `Map` can never be shared between two
people's requests on the server, and the wiring is what the tests need to
reach.

A trap worth knowing if you extend the admin-shell spec. Playwright checks the
**most recently registered** route first, so broad handlers must be registered
before narrow ones. The first draft registered the catch-all `**/api/admin/**` last;
it answered `/auth/me/` instantly with the wrong shape, the deliberate delay
never happened, and the test passed against the very layout it was written to
catch. Registration order is now commented in the spec.

## What is still NOT covered

Worth knowing before trusting a green run:

- **No component tests.** Nothing renders a component in isolation; the
  browser suite covers only the two forms, through the whole app.
- **No other pages.** Beyond the dashboard shell above, nothing exercises the
  admin panel's screens — the inbox, the content editors, the user and role
  management — nor the blog or any of the 40+ marketing routes, beyond the
  fact that they build.
- **Analytics gating is not tested.** `PublicTelemetry` renders no tracker on
  `/admin`, and `lib/adminPath.test.ts` covers the path rule it uses, but no
  test asserts the browser makes no request to Google or Meta from a dashboard
  page. That check needs network assertions against a build with the analytics
  IDs set; it was verified by hand (Sep 2026) and is not automated.
- **No API route tests.** `app/api/submit` is untested; it needs request
  mocking and the backend/CRM calls stubbed. The browser suite deliberately
  fakes this boundary rather than crossing it.
- **No mobile viewport or cross-browser runs.** Chromium at desktop size only.
- **No accessibility or visual-regression checks.**
- **No coverage gate.** Coverage is not measured, on purpose — a percentage
  target invites tests written to raise the number.

## Adding a test

Put it next to the code as `*.test.ts` under `lib/` or `app/`. Prefer testing
a function over a component while there is no DOM environment configured.

If the thing you want to test is buried inside a React component or an async
network call, extract the decision into a plain function first and test that.
`normaliseCrmPhone()` in `lib/crm-forward.ts` was extracted for exactly this
reason — the regression that lost those leads is one line of arithmetic.
