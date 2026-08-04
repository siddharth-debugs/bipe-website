# BIPE Website — Work Report

**Site:** bipevns.org (Next.js 16, App Router) · **Repo:** `siddharth-debugs/bipe-website`
**Period:** 9–14 June 2026 · **Branch:** `main` — every item below is committed, build-verified, and deployed.

---

## Executive summary

13 commits shipped across four areas — conversion CTAs, SEO / Search Console, Core Web Vitals, and the Meta marketing stack (domain verification + Conversions API) — plus several diagnostic investigations and two advisory write-ups. Every change passed a green production build and was verified (preview, prerendered HTML, or a local prod server) before pushing. The only material open items are **Meta-side configuration** (one env token + Test Events) and a **deliberately deferred DPDP / consent decision**.

---

## 1. Conversion CTA & copy

| What | Detail | Commit |
|---|---|---|
| Bottom-bar headline | "Admissions 2026-27 — Open" (JEECUP pages: "JEECUP 2026 seats — Open"); verified one-line fit at 375px | `b4ed44e` |
| Bottom-bar subtext | "Freeze branch + Get ₹1,200 PET scholarship" — replaced the vague, button-duplicating "Register free · preferred branch…" | `d8630e2` |
| Enquiry popup fix | Was redirecting to WhatsApp instead of saving the lead; made it **submission-only** (lead → Inbox), de-greened the CTA, and changed the cap from a 7-day lock to **once-per-session** so it returns on the next visit | `d26fdad` |
| Early-Registration success screen | Made it **bilingual** (English + Hindi) to match the rest of the ESR page | `40c8ba6` |

*(Earlier in the same bottom-bar effort: `b39d6d9` → `b5e7803` — built the persistent bar, redesigned it as a banner, made it permanent, removed "Chat with admissions" from /apply, and added an Early-Registration badge + Inbox filter chip.)*

---

## 2. SEO & Google Search Console

Several rounds of GSC exports were analysed. Most flagged issues were **benign or stale** and needed no code change — I verified each on production before concluding:

- **"Page with redirect" / "Alternate page with proper canonical"** — working as intended (correct 308s; `?lang=hi` + `www` variants correctly deduping). Advised *not* to re-run "Validate Fix" on these (they'll always "fail" because the pages are supposed to redirect).
- **"Redirect error" (www blog URLs)** — stale; all resolve in one clean 308→200 hop now.
- **"Crawled, not indexed" (`/chairman`)** — healthy, well-linked page; just indexing lag.

The **one real issue — "Duplicate, Google chose different canonical" on `/apply`, `/fees`, `/contact`** (spiked when `/early-registration` + the sitewide sticky bar launched) — was fixed:

| What | Detail | Commit |
|---|---|---|
| `noindex` the campaign LP | Added a reusable `noindex` route flag driving both robots + sitemap exclusion; `/early-registration` now `noindex,follow` so it stops out-competing the evergreen pages for the canonical | `58528f1` |
| Hindi language signals | Blog `<article>` now carries its own `lang`; Article-schema `inLanguage` + hreflang now derive from `post.lang` (not a fragile slug regex); set explicit `lang:"hi-IN"` on 3 mislabelled Hindi posts | `58528f1` |
| Dairy blog de-duplication | The two dairy posts were a Hinglish + English pair wrongly tagged as hreflang "translations" → Google merged them. Unpaired them + cross-linked | `58528f1` |

**Verification guidance given:** the GSC "Validation failed" results all predated the fixes (validated 5/23–6/3, fixes deployed ~6/11) — they need a fresh re-validation, and the redirect/alternate buckets should be left alone.

---

## 3. Core Web Vitals / performance (mobile)

GSC flagged blog-template **LCP > 4s** and **INP > 200ms**. Root-caused and fixed:

| Issue | Root cause | Fix | Commit |
|---|---|---|---|
| LCP 4.2–4.4s (text) | `.page-enter` animated the article (incl. the H1, the LCP element) from `opacity:0` — a paint gate | Made the entrance **transform-only** (no opacity gate); H1 now paints immediately. Template-wide | `0267612` |
| INP ~240ms | gtag.js loaded `afterInteractive` — inside the early-tap window | Defer `<GoogleAnalytics>` mount to `requestIdleCallback` (3s cap); events still queue, no data loss | `47cdeb4` |
| INP (JS weight) | **zod (~12KB gz) shipped on every page** — dragged in via the always-mounted FAB → `BRANCH_OPTIONS` sharing a module with the zod schemas | Split options into a zod-free `lib/formOptions.ts`; repointed client forms. **Verified: zero zod in any blog chunk** (was 96 markers) | `ac19418` |

A **bundle deep-dive** (source-map-explorer + live chunk fingerprinting, since PSI quota was exhausted) confirmed the bundle is otherwise lean — no leaked heavy libraries (no Recharts/Framer/Three). zod was the one real reducible weight.

> **Note:** CWV is 28-day rolling field data — these will green-up gradually over ~3–4 weeks, then "Validate Fix" in GSC.

---

## 4. Meta (Facebook) marketing stack

| What | Detail | Commit |
|---|---|---|
| Domain verification | `<meta name="facebook-domain-verification" …>` site-wide via Next metadata; verified live in `<head>` | `7e4c0d2` |
| `fb:app_id` | Cleared the Sharing-Debugger warning; tied to the "BIPE Website Integration" app (`972609782147968`), emitted as raw `property=` in `<head>` (Next metadata can't emit `property=`) | `5fecf91` |
| **Conversions API** | Server-side CAPI alongside the browser Pixel, deduped via a shared `event_id`. `Lead` on **all** form surfaces, `Contact` on every WhatsApp/call tap (one delegated hook). **PII matching ON** (hashed email/phone). Hardened route: event allowlist, rate-limit, graceful no-token, minimal client response | `a16e469`, `2afd795` |
| Privacy note | Added a Meta-Pixel disclosure (`17949fc`), then **removed it** per owner when PII matching was chosen (so we don't ship a now-false statement) — `/privacy` is currently silent on Meta, to be rewritten in the deferred DPDP pass | `a16e469` |

*Context: Siddharth shipped the base Pixel (`b03b85a`, ID `1035125302305497`); I integrated around it without re-initialising.*

**Lead now fires on:** /apply, /early-registration, /visit, /contact, homepage InlineApply, the InquiryModal popup, and the WhatsApp FAB.

---

## 5. Investigations & advisory (no code, or analysis only)

- **"No enquiries in the Inbox"** — investigated end-to-end: writes persist (Django 201 + id), read path healthy, both use the same backend. Conclusion: **the Inbox works** (130 leads); "New = 0" simply meant every lead already had a follow-up logged. No bug.
- **Scroll animations** (vs. tresmarescapital.com) — evaluated; advised the lightweight `RevealObserver` you already have covers ~80% of the effect, and to **skip** the heavy Lenis/WebFGL stack given the budget-Android, mobile-heavy audience.
- **Meta CAPI setup guide** — reviewed Akshat's guide: mechanics correct, but flagged it would (a) contradict the just-shipped privacy promise and (b) raise a DPDP children's-data issue; recommended an events-only default. Owner chose PII matching + deferred DPDP.

---

## Open items / handoffs

**Meta — for you / Akshat (Meta-side, I can't do these):**
1. Set **`META_CAPI_TOKEN`** (the `EAA…` token) in Vercel env + redeploy. *Until then the browser Pixel still fires; the server CAPI no-ops gracefully.*
2. **Test Events** (`META_TEST_EVENT_CODE`) → confirm Browser + Server dedup + Event Match Quality → remove the test code.
3. **Aggregated Event Measurement** → rank **Lead #1**, Contact #2, PageView #3.
4. Click **Verify domain** in Business Suite (tag is live), and **Scrape Again** in the Sharing Debugger to clear the `fb:app_id` warning.

**Compliance — deferred by owner (on record):**
5. **DPDP / consent / minors.** The site now sends applicants' (incl. minors') hashed phone/email to Meta with no consent gate, and `/privacy` is silent on Meta. Needs: privacy-policy rewrite + a consent mechanism. Worth a check with whoever owns DPDP compliance.

**SEO — time-based (no action needed now):**
6. Re-run GSC "Validate Fix" on *Duplicate-canonical*, *Redirect-error*, and *Crawled-not-indexed* once Google re-crawls; leave the redirect/alternate buckets alone.
7. CWV: wait ~3–4 weeks for field data, then validate.

**Housekeeping:**
8. Two test Inbox entries ("Saurabh" #118, "Test Registration" #119) can be deleted.

---

## Collaborator notes

- Shared repo with **Siddharth** + an automated **`github-actions[bot]`** that pushes a daily Google-reviews refresh (`lib/reviews.json`). Every push this period was fetch-first; one rebase integrated Siddharth's Pixel commit cleanly.
- **BIPE ≠ BITE** — `bipevns.org` only; the `bitevns.*` GSC exports seen in Downloads belong to the other institution and were left untouched.

*Report generated 14 June 2026.*
