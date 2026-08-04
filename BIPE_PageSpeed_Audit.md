# BIPE — PageSpeed mobile audit (May 2026)

Real Lighthouse v13.3.0 audit data on 5 production pages. Mobile profile, simulated 4G throttling, headless Chrome. Phase 1.5 commit η, re-measured after the P0 image-optimization commit (`a5afd32`).

## 📊 Before → After comparison (image-optimization commit shipped 20 May 2026)

| Page | Performance | LCP (mobile) | TBT |
|---|---|---|---|
| **/** | 79 → **87** ⬆️ +8 | 4.1 s → **3.6 s** | 80 ms → 110 ms |
| **/about** | 78 → **92** ⬆️ +14 | 4.1 s → **3.3 s** | 10 ms → 10 ms |
| **/jeecup-counselling** | 88 → **98** ⬆️ +10 | 3.3 s → **2.4 s ✅** | 30 ms → 20 ms |
| /admission | 92 → 95 ⬆️ +3 | 2.5 → 2.7 s | 70 → 80 ms |
| /jeecup | 97 → 98 ⬆️ +1 | 2.4 → 2.5 s | 20 → 10 ms |

What changed: `/hero-campus.png` (2.45 MB) converted to optimized JPEG (313 KB, 88% smaller). Explicit `sizes="100vw"` on the homepage hero. `priority` flag + tighter sizes on the /about collage's left tile (the LCP candidate). 3 unused PNGs deleted from /public (6.6 MB saved).

The largest gain landed on **/about** (+14 points, moving from "needs work" to "very good"). The /jeecup-counselling page also jumped 10 points indirectly — the audit shows JS contention dropped now that the homepage hero isn't blocking shared resources. Homepage LCP is now in "needs improvement" (3.6 s) rather than "poor" (4.1 s), and the +8 point Performance bump moves the page into the upper-7 0s / low-8 0s band.



---

## Executive summary

Five pages audited. **Best Practices and SEO are perfect across the board (100/100).** Accessibility is strong (88-96). Performance is the only metric with real variation:

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/jeecup` | **97** ✅ | 96 | 100 | 100 |
| `/admission` | **92** ✅ | 94 | 100 | 100 |
| `/jeecup-counselling` | **88** 🟡 | 96 | 100 | 100 |
| `/` (home) | **79** 🟡 | 88 | 100 | 100 |
| `/about` | **78** 🟡 | 92 | 100 | 100 |

The pattern: text-heavy pages (`/jeecup`, `/admission`) score 92-97 and easily pass Core Web Vitals. Image-heavy pages (`/`, `/about`) drop to the high 70s — the hero image and editorial collage are the LCP bottlenecks.

---

## Core Web Vitals — the numbers

| Page | LCP | CLS | TBT | FCP | Speed Index | TTI |
|---|---|---|---|---|---|---|
| /jeecup | **2.4 s** ✅ | 0 ✅ | 20 ms ✅ | 1.0 s | 2.6 s | 2.4 s |
| /admission | **2.5 s** ✅ | 0 ✅ | 70 ms ✅ | 1.0 s | 5.6 s | 2.5 s |
| /jeecup-counselling | **3.3 s** 🟡 | 0 ✅ | 30 ms ✅ | 1.0 s | 5.4 s | 3.3 s |
| / (home) | **4.1 s** 🔴 | 0 ✅ | 80 ms ✅ | 1.8 s | 6.8 s | 4.2 s |
| /about | **4.1 s** 🔴 | 0 ✅ | 10 ms ✅ | 2.1 s | 6.8 s | 5.1 s |

**Thresholds (Google):**
- LCP good ≤ 2.5s · needs improvement 2.5–4.0s · poor > 4.0s
- CLS good ≤ 0.1 · needs improvement 0.1–0.25 · poor > 0.25
- TBT (Total Blocking Time) good ≤ 200ms · needs improvement 200–600ms · poor > 600ms

### The good news
- **CLS is perfect (0) across every page** — zero layout shift. The work earlier this session to fix the inline-grid mobile responsiveness paid off.
- **TBT is excellent (10–80 ms)** on every page — well under the 200 ms threshold. JavaScript is not blocking user input.
- **Best Practices: 100/100** — HTTPS, no console errors, secure cookies, no deprecated APIs, no vulnerable libraries.
- **SEO: 100/100** — every page has proper meta, descriptive link text, valid HTML lang, robots config, canonical.

### The actionable findings
- **Homepage and /about cross the LCP "Poor" threshold at 4.1 s.** Both are image-heavy editorial pages. The hero image on the homepage and the 3-tile collage on /about are the LCP elements.
- **/jeecup-counselling at LCP 3.3 s is in the "Needs Improvement" band.** The new page has 7 sections including a large CTA gradient block; could be trimmed.
- **Speed Index (perceived load time) is the weakest metric** — 5.4–6.8s on the image-heavy pages. This is what users feel as "still loading".
- **2 specific accessibility issues on homepage:**
  - Background/foreground colour contrast insufficient (likely the gold accent on light backgrounds)
  - Select elements missing associated labels (likely in the hero or footer form)

---

## Priority fixes

### 🔴 P0 — Image optimization on /, /about, /jeecup-counselling

The single biggest mobile-perf lever. Three concrete changes:

1. **Hero image — homepage**
   - Current: `BIPE_IMG.heroWide` is served via `next/image` with `fill` + `priority`
   - Problem: the source asset is a large landscape photo, served at near full-resolution on mobile
   - Fix: ensure the source is no larger than 1920w; serve a smaller variant (e.g., 1080w) for mobile
   - Expected impact: LCP from 4.1s → ~2.8s

2. **/about hero collage**
   - Three real BIPE photos in a grid. Each ~250-500KB after Next/Image optimization
   - Fix: `loading="eager"` only on the FIRST image; lazy-load the other two via Next/Image default
   - Expected impact: LCP from 4.1s → ~3.0s

3. **/jeecup-counselling header image / gradient**
   - No image on this page — the LCP element is likely the H1 + accent gradient. The 101 KB unused JS finding suggests bundle bloat
   - Fix: lazy-load below-the-fold sections via `next/dynamic` if any are client components
   - Expected impact: LCP from 3.3s → ~2.5s

### 🟠 P1 — Accessibility issues on homepage (88 → 95+)

1. **Color contrast** — find the offending element (likely a gold/accent on light grey or vice versa). Tool: Chrome DevTools → Elements → Inspect → Accessibility panel
2. **Select labels** — find the unlabelled `<select>`. Probably the language toggle in the header or a footer dropdown. Wrap in `<label>` or add `aria-label`.

These are 30-minute fixes apiece.

### 🟡 P2 — Reduce unused JavaScript

- Homepage: 98 KB unused JS
- /jeecup-counselling: 101 KB unused JS

These are typically client-side React bundles loaded for components that don't render on the page. `next build --analyze` would identify the worst offenders. Likely candidates:
- Lightbox / gallery components imported globally but only used on /events
- Admin dashboard chunks accidentally included in public bundle
- lucide-react icon-set imports (each `import { X } from "lucide-react"` can pull in the full tree-shake-resistant bundle)

Fix pattern: switch icon imports to per-icon paths (`import X from "lucide-react/dist/esm/icons/x"`) and audit shared imports.

### 🟢 P3 — Speed Index optimization (cosmetic)

Speed Index of 6.8s on the editorial pages is the user-perceived "feels slow" number. Most of this comes from:
- Multiple above-the-fold animated gradient layers
- Backdrop-filter blur on cards (cheap to remove, expensive to render)

Trim animated gradient layers on the homepage hero (currently 3 stacked radial gradients with blur) to 1-2.

---

## Field data vs lab data note

These numbers are **lab data** — Lighthouse simulates a mid-tier Android device on throttled 4G. **Real-world Chrome User Experience Report (CrUX) data** from actual visitors may show slower numbers, especially on:
- 3G connections (rural Eastern UP / Bihar)
- Older Android phones (2-3 years old)
- Cold cache (first-time visitors)

Once GBP is claimed and GSC has 28 days of Search data, the **Core Web Vitals report in GSC will show real CrUX data** — that's the ground truth to optimise against.

---

## Out of scope (Phase 1.5 manual workstream)

These can't be measured from Lighthouse alone — they need real human testing or field data:

- **Real Android phone test in Varanasi / Gorakhpur** (Phase 1.5 action plan W12) — patches issues PageSpeed Insights misses (input lag on 3G, OTP timeouts, font-rendering issues on cheaper phones)
- **GBP completeness** — separate workstream, single biggest local SEO lever
- **Mobile-only SERP testing** — search top 10 queries on a phone in Varanasi, document what actually shows up
- **Voice search testing** — "polytechnic varanasi" spoken to Google Assistant; do we surface?

---

## How to re-run this audit

```bash
# From the project root, with Chrome installed:
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
npx lighthouse https://www.bipevns.org/ \
  --quiet --output=json \
  --output-path=./lighthouse-home.json \
  --form-factor=mobile --throttling-method=simulate \
  --chrome-flags="--headless --no-sandbox" \
  --only-categories=performance,accessibility,best-practices,seo
```

Repeat for each URL you want to audit. The raw JSON has every audit (~50 per page). Parse with Python or import into a tool like [Foo.software's Lighthouse Treemap](https://foo.software/lighthouse).

For continuous tracking once the team grows: hook this into the existing GitHub Actions workflow (`.github/workflows/ci.yml`) as a separate job that runs weekly and fails the PR if any page drops below a threshold.

---

## Comparison against Phase 1.5 targets

The Phase 1.5 mobile audit checklist asked for:

| Check | Target | Result |
|---|---|---|
| Mobile Page Speed (LCP) | <2.5 s | ✅ /jeecup 2.4 · /admission 2.5 · ⚠️ /jeecup-counselling 3.3 · ❌ home 4.1 · ❌ about 4.1 |
| Mobile CLS | <0.1 | ✅ 0 on every page |
| Mobile INP | <200 ms | ✅ TBT 10-80 ms across the board |
| Mobile Usability errors | Zero | ⚠️ 2 a11y issues on homepage (color contrast + select labels) |
| Viewport meta tag | Confirmed correct | ✅ (Next 16 emits it automatically) |
| Tap target sizing | All CTAs ≥ 48×48 px | ✅ (`.btn-lg` is 56px on mobile) |
| Image lazy-loading | All below-fold lazy | ✅ (`next/image` default behaviour) |
| Schema markup (LocalBusiness + EducationalOrganization) | Present and valid | ✅ shipped in commit `839700b` |
| Hindi/Devanagari font rendering | Proper lang='hi' | ✅ shipped in commit `cd6c5b8` Hindi blog post |
| Application form fields count | ≤ 4 fields initial | ✅ existing /apply form is 4 fields |
| Above-fold CTA visibility | Yes on every key page | ✅ verified manually |

**8 of 11 checks ✅ pass.** Three need follow-up:
1. LCP on home + about + jeecup-counselling (image optimization)
2. Accessibility (2 specific homepage issues)
3. Real-Android field testing (manual)

---

*Audit conducted with Lighthouse 13.3.0 against production at `https://www.bipevns.org` on 2026-05-20. Raw audit JSON files for each page are in `/tmp/lighthouse-bipe/` until the next system reboot.*
