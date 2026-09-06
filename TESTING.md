# Testing

`npm test` runs the unit suite (Vitest). It is wired into CI alongside
typecheck, lint and build, so a broken test fails the PR check.

```bash
npm test              # run once
npx vitest            # watch mode while working
npx vitest run lib/crm-forward.test.ts
```

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

## What is NOT covered

Worth knowing before trusting a green run:

- **No component tests.** Nothing asserts that a button renders or that a
  dialog opens. `jsdom` + Testing Library would be the next step.
- **No end-to-end tests.** The `/apply` and `/alumni` forms were verified by
  driving a real browser by hand (Playwright against a production build,
  with `/api/submit` intercepted so nothing reached the backend). That check
  is not automated and does not run in CI.
- **No API route tests.** `app/api/submit` is untested; it needs request
  mocking and the backend/CRM calls stubbed.
- **No coverage gate.** Coverage is not measured, on purpose — a percentage
  target invites tests written to raise the number.

## Adding a test

Put it next to the code as `*.test.ts` under `lib/` or `app/`. Prefer testing
a function over a component while there is no DOM environment configured.

If the thing you want to test is buried inside a React component or an async
network call, extract the decision into a plain function first and test that.
`normaliseCrmPhone()` in `lib/crm-forward.ts` was extracted for exactly this
reason — the regression that lost those leads is one line of arithmetic.
