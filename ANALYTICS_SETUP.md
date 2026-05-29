# GA4 Analytics — events + admin dashboard setup

This document covers two things:

1. **The first-party gtag events the site fires** — what's tracked, where it's wired, how to verify in GA4
2. **How to wire up the `/admin/dashboard/analytics` page** to surface counts inside the admin without requiring operators to log into Google Analytics

## 1 · Events the site fires

All events are shipped via `lib/analytics.ts` (the `track()` helper) and dispatched from two places:

- **`components/shell/OutboundTracker.tsx`** — a delegated `document`-level click listener mounted in `app/layout.tsx`. Catches every `tel:` / `wa.me/` / `mailto:` link on the site, current and future, without per-link wiring.
- **`components/forms/*.tsx`** — explicit `track()` calls in the success path of each form (`apply`, `contact`, `visit`, `enquiry`).

The canonical event list is exported as `BIPE_TRACKED_EVENTS` in `lib/ga4.ts`. Don't add new events without updating that array — the admin dashboard reads from it.

| Event name | Fires on | Parameters |
|---|---|---|
| `call_click` | Any `<a href="tel:...">` tap | `phone`, `link_url`, `link_text` |
| `whatsapp_click` | Any `wa.me/` or `whatsapp:` link tap | `link_url`, `link_text` |
| `mailto_click` | Any `mailto:` tap | `email`, `link_url`, `link_text` |
| `apply_submit` | `/apply` form success | `branch` |
| `contact_submit` | `/contact` form success | `branch` |
| `visit_submit` | `/visit` form success | `branch` |
| `enquiry_submit` | Inquiry popup + homepage inline form success | `branch` |

### Why the explicit events even though GA4 Enhanced Measurement auto-tracks outbound clicks

Audit done May 2026: across 160 sessions, Enhanced Measurement captured **10** `wa.me/` clicks and **zero** `tel:` clicks. Mobile Safari fires the `tel:` handoff before GA4's auto-interceptor reads the click, so the event never makes it to GA. The delegated listener with `capture: true` runs earlier in the event flow and reliably catches the click before the handoff. Without this, BIPE's call-event data would be unusable.

### How to verify in GA4

1. Set `NEXT_PUBLIC_GA_ID` in Vercel (e.g. `G-BRMGGQMXP8`) and redeploy
2. Open the live site, then in another tab go to `analytics.google.com` → **Realtime**
3. Tap a phone number or WhatsApp button on the site
4. The event appears in **Event count by Event name** within ~10 seconds

If you see nothing in Realtime, the most likely cause is `NEXT_PUBLIC_GA_ID` is unset, wrong, or the deployment didn't pick it up. Check `view-source:bipevns.org` for the `googletagmanager.com/gtag/js` script tag.

### Mark events as Key Events (conversions)

GA4 renamed "conversions" to "Key Events" in 2024. Mark these to surface them on the standard reports:

- **Admin → Events** → toggle **Mark as key event** for:
  - `call_click`
  - `whatsapp_click`
  - `apply_submit`
  - `enquiry_submit`

Note: events don't appear in this list until they've fired at least once. Wait ~24 hours after the first real visitor click before configuring.

### Register custom dimensions

Event parameters (`branch`, `phone`, `link_text`, etc.) aren't filterable in reports until they're registered as **custom dimensions**:

**Admin → Custom definitions → Custom dimensions → Create**

| Dimension name | Scope | Event parameter |
|---|---|---|
| Branch | Event | `branch` |
| Phone | Event | `phone` |
| Link text | Event | `link_text` |
| Link URL | Event | `link_url` |

After ~24 hours these become filterable in any report.

---

## 2 · Admin dashboard setup (~10 minutes)

`/admin/dashboard/analytics` shows last-7-day counts for every event in `BIPE_TRACKED_EVENTS`. It calls the GA4 Data API server-side at render time using a service-account JWT signed by `lib/ga4.ts`. No new npm dependencies — uses Node's built-in `crypto` module.

### Step 1 — Find the numeric Property ID

GA4 → **Admin** (gear icon) → **Property Settings** → "Property ID". This is a 9-digit number like `501234567`. **NOT** the `G-XXXX` measurement ID.

### Step 2 — Create a service account in Google Cloud

1. Go to [Google Cloud Console → IAM → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Choose / create a project (any project — GCP-wise the project is just where the key lives, the GA4 access is separate)
3. **Create Service Account** → name `bipe-ga4-reader` → **Done** (no IAM role needed here)

### Step 3 — Download a JSON key

1. Click the service account you just created → **Keys** tab
2. **Add Key → Create new key → JSON → Create**
3. A JSON file downloads with three fields you'll need:
   - `client_email` — looks like `bipe-ga4-reader@PROJECT.iam.gserviceaccount.com`
   - `private_key` — PEM-formatted, starts with `-----BEGIN PRIVATE KEY-----`
   - (Project ID, key ID — not needed for our use)

Treat this JSON file like a password. Don't commit it. Delete from Downloads after copying the values.

### Step 4 — Grant the service account read access to the GA4 property

GA4 → **Admin** → **Property Access Management** → **+** → **Add users**

- Email: paste the `client_email` from the JSON
- Role: **Viewer**
- **Add**

(The service account doesn't need any IAM role in Google Cloud — only the GA4 property-level Viewer permission.)

### Step 5 — Set three env vars in Vercel

Vercel → Settings → Environment Variables. Set all three to **Production + Preview** (skip Development unless you want local `vercel dev` to hit GA4):

```
GA4_PROPERTY_ID=501234567

GA4_SERVICE_ACCOUNT_EMAIL=bipe-ga4-reader@PROJECT.iam.gserviceaccount.com

GA4_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

The `PRIVATE_KEY` has literal `\n` sequences when copied from the JSON. **Keep them as-is** — Vercel preserves them as the four-character string `\n`, and `lib/ga4.ts` replaces them with real newlines before signing the JWT. Wrap the whole value in double quotes when pasting.

### Step 6 — Redeploy

Vercel auto-redeploys env-var changes on the next push to `main`. Or manually: **Deployments → ⋯ on latest deploy → Redeploy** (uncheck "Use existing Build Cache" so the new env propagates fresh).

### Step 7 — Verify

1. Visit `/admin/dashboard/analytics` after the deploy completes
2. If everything is wired: the page shows two big summary tiles (phone+WhatsApp / form submissions) and a per-event breakdown table for the last 7 days
3. If credentials are wrong, you'll see an error panel with the GA4 API response — common cases (wrong Property ID, service account not added to GA4, malformed PEM) are documented inline

### Common errors

| Error message | Fix |
|---|---|
| `Data API 403: PERMISSION_DENIED` | Service account email not added as Viewer on the GA4 property (Step 4). |
| `Data API 404: property not found` | `GA4_PROPERTY_ID` is the `G-XXXX` measurement ID, not the numeric property ID. Re-check Step 1. |
| `OAuth token exchange 400: invalid_grant` | `GA4_SERVICE_ACCOUNT_PRIVATE_KEY` is malformed. Most often the BEGIN/END PEM markers got stripped, or the `\n` sequences were replaced with real newlines during paste (Vercel needs the literal `\n`). |
| `GA4 env vars not set` | One of the three env vars is missing in Vercel. |

---

## 3 · For the operator — what to read from the page

The dashboard's two summary tiles answer the most common question ("are people reaching out?"):

- **Phone + WhatsApp taps** combines `call_click` + `whatsapp_click`. These are the highest-intent visitor signals — someone actively trying to start a conversation.
- **Form submissions** combines all four form types. These are the lower-friction signals — visitors who gave us their number but may not call.

The per-event table below the tiles lets you check individual channels. Numbers below the column header use the `_count` raw event count; the right column shows unique users (de-duplicated by GA4 client_id).

### Calibration

A few realities to keep in mind:

- **iOS Safari under-reports `call_click`.** Even with `capture: true`, occasional taps slip through. Real call volume is likely 1.3–1.5× what's shown.
- **iOS WhatsApp redirect over-reports slightly.** A tap on a `wa.me/` link from iOS counts as a click even if the user doesn't have WhatsApp installed and gets bounced to the App Store.
- **Ad blockers suppress everything.** Roughly 15–25% of tech-savvy visitors block GA4. The reported numbers are a floor.
- **DPDP consent mode is set to `analytics_storage: granted` / `ad_*: denied`.** Real analytics, no ad-tech. Documented in `components/shell/GoogleAnalyticsBeacon.tsx`.

---

## 4 · For the developer — extending the dashboard

To add a new event to the dashboard:

1. Add `track("new_event_name", { ... })` wherever it fires
2. Append `"new_event_name"` to `BIPE_TRACKED_EVENTS` in `lib/ga4.ts`
3. Add a row to `EVENT_LABELS` in `app/admin/dashboard/analytics/page.tsx` with a human-friendly label and intent description
4. If you want it in the summary tile, update the `callsAndChats` / `formSubmissions` sums in the same file

The Data API call in `lib/ga4.ts` automatically picks up the new event — no API config needed on the Google side.

To change the date range, pass a different number to `getEventCounts(..., daysBack)`. Default is 7. The current page is hardcoded to 7 days for the operator's quick-look use case; adding a date picker would require turning it into a client component.
