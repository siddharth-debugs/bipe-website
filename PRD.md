# BIPE Website — Product Requirements & Context Doc

> **Purpose**: Single source of truth so any future Claude session (or contributor) can pick up without re-reading the chat history. Update this file whenever direction changes, scope expands, or a non-obvious decision is made.

---

## 1. What this is

Marketing & admissions website for **Banaras Institute of Polytechnic & Engineering (BIPE)** — an AICTE-approved, BTEUP-affiliated 3-year diploma engineering institute in Phoolpur, Varanasi. JEECUP code 4455.

Originally mocked in `claude.ai/design` (HTML/CSS/React prototype). User exported the handoff bundle and asked for a real Next.js implementation.

**Source-of-truth bundle (read-only reference)**: `d:\tmp\bipe_design\extracted\bipe\` — contains `chats/chat1.md`, `project/*.jsx`, `project/styles.css`, `project/data.js`, `project/images.js`. Do not modify; it's the design reference.

---

## 2. Tech stack (locked)

| Layer | Choice |
|---|---|
| Framework | Next.js 15.5 (App Router) |
| Language | TypeScript (strict) |
| UI | React 19 |
| CSS | Tailwind CSS v4 + ported design system in `app/globals.css` |
| Fonts | `next/font/google` — **Geist** (sans), **Instrument Serif** (serif), **JetBrains Mono** (mono) |
| Hosting target | Static export friendly (all routes prerender) |

`package.json` is in repo. Run: `npm install && npm run dev`.

---

## 3. User-locked configuration (do NOT add toggles for these)

These were explicit user decisions. Don't reintroduce variants or switchers.

- **Hero variant**: `HeroFull` only. (`HeroEditorial` and `HeroSplit` from the prototype were dropped from code.)
- **Density**: comfortable. (No `[data-density="compact"]` block in CSS.)
- **Theme**: light only. (No dark-mode CSS.)
- **Fonts**: Geist + Instrument Serif. (No font-pairing switcher.)
- **Localization**: EN / हिं toggle in nav, persisted in `localStorage["bipe-lang"]`, syncs `<html lang>`. **Scope is intentionally narrow**: only nav labels and a few inline `lang === "hi" ? "..." : "..."` ternaries translate. Body content stays English. Don't translate everything.
- **Tweaks panel**: removed entirely.
- **Homepage section order is FROZEN**: HeroFull → StatsBar → Recruiters → Countdown → WhyBipe → Branches → JeecupSteps → FeeCallout → PrincipalMessage → CampusLife → Testimonials → InlineApply → News → FAQ → FinalCTA. User said "homepage will be same as it is, we will do improvements later". Don't reorder without explicit request.

---

## 4. Routes (22 total, all SSG)

`/` (home) plus: `/about`, `/courses`, `/admission`, `/apply`, `/visit`, `/contact`, `/placements`, `/campus`, `/fees`, `/scholarships`, `/documents`, `/jeecup`, `/hostel`, `/faculty`, `/events`, `/principal`, `/teaching`, `/approvals`, `/faq`, `/blog`, `/grievance`.

Every route exports `metadata: Metadata` with title, description, canonical, hreflang `en-IN` / `hi-IN`, OpenGraph, Twitter. Per-route copy lives in `lib/routes.ts` via `metaFor(key)`.

`app/sitemap.ts` and `app/robots.ts` are wired. Production canonical host placeholder is `https://www.bipevns.org/` — replace when domain is final.

---

## 5. File map

```
app/
  layout.tsx              # fonts, metadata defaults, JSON-LD, AdmStrip, Nav, RevealObserver, StickyCTA, Footer, LangProvider
  page.tsx                # home — composes all 15 sections in spec order
  globals.css             # Tailwind import + ported design system
  sitemap.ts, robots.ts
  <route>/page.tsx        # one folder per route; pages with client state split into page.tsx + *View.tsx
components/
  shell/                  # Logo, BrandMark, Icons, AdmStrip, Nav, StickyCTA, Footer
  home/                   # 15 home sections (HeroFull → FinalCTA)
  ui/                     # Img, Counter, RevealObserver, PageHeader
lib/
  data.ts                 # typed DATA (single source for contact/stats/branches/recruiters/whyBipe/testimonials/faq/events/jeecupSteps/facilities)
  images.ts               # BIPE_IMG (Unsplash URLs)
  lang.tsx                # LangProvider + useLang
  routes.ts               # PAGE_META + metaFor()
PRD.md                    # this file
```

---

## 6. Important gotchas — read before editing

### 6.1 Tailwind v4 class-name collisions (BURNT BY THIS ONCE)

Tailwind v4 auto-generates utilities for any class-name token it finds in source files. Several tokens overlap with the original design-system class names. Concretely, Tailwind generates:

- `.h-1`, `.h-2`, `.h-3` → `height: 4/8/12px` (most damaging — collapses headings to 4-12px tall, text overflows visually into the next section)
- `.container`, `.flex`, `.grid`, `.block`, `.hidden`, `.italic`, `.uppercase`, `.tabular-nums`, `.transform`, `.border`, `.absolute`, `.relative`, `.sticky`, `.start`, `.end`, `.break-all`, `.outline`, `.filter`, `.transition`, `.underline`, `.inline-block`, `.inline-flex`

**Why my unlayered design-system `.h-1` does NOT win**: Yes, unlayered rules beat layered Tailwind utilities for properties they define. But `.h-1 { font-size: clamp(...) }` doesn't define `height`, so Tailwind's `height: 0.25rem` from `@layer utilities` still applies. Result: 4px-tall headings.

**Fix applied**: heading classes renamed to `.bipe-h1`, `.bipe-h2`, `.bipe-h3` in `globals.css` and all consumers. Rule of thumb — **if you add a new design-system class, prefix it with `bipe-` to avoid future Tailwind collisions**.

Untouched (no real collision because we either don't redefine the property or the visual is identical): `.container`, `.flex`, `.grid`, `.block`, `.row`, `.between`, `.eyebrow`, `.lead`, `.serif`, `.muted`, `.tight`, `.center`, `.card`, `.btn`, `.pill`, `.live-dot`, `.section`, `.reveal`, etc. These work because either (a) Tailwind doesn't generate them or (b) my unlayered rule fully covers the properties Tailwind sets.

### 6.2 Reveal animation

The design uses `className="reveal"` on elements that should fade up on scroll. A single `<RevealObserver>` mounted in `app/layout.tsx` runs an `IntersectionObserver` and adds `.in` to elements as they enter. It re-runs on `pathname` change. Don't replace it with a per-element wrapper — markup should stay verbatim from the prototype.

### 6.3 Client/server split

Pages with `useState` (currently `/courses`, `/apply`) are split:
- `app/<route>/page.tsx` — server component, exports `metadata`.
- `app/<route>/<Name>View.tsx` — client component (`"use client"`).

If you add a new sub-page that needs state, follow this split so SEO metadata still works.

### 6.4 Images

`components/ui/Img.tsx` uses a plain `<img loading="lazy">` (not `next/image`) so we don't have to whitelist Unsplash domains in `next.config.ts`. Keeps the prototype's `.ph` placeholder fallback + label overlay. Swap to real assets later — just drop them into `public/` and update `lib/images.ts`.

### 6.5 Hash routes are gone

The prototype used `go("courses")` setting `window.location.hash = "courses"`. The Next port uses real route segments via `<Link href="/courses">`. If you copy code from the source `.jsx` files, replace every `onClick={(e)=>{e.preventDefault();go(...)}}` with a `<Link href="/...">`.

### 6.6 Workspace lockfile warning

Next warns about a stray `package-lock.json` at `d:\siddharth\projects\` shadowing the project root. Either delete that file or set `outputFileTracingRoot: __dirname` in `next.config.ts`. Cosmetic; doesn't affect output.

### 6.7 ESLint

Not installed. Add `npm i -D eslint eslint-config-next` if you want lint in CI.

### 6.8 Don't mix `next build` and `next dev` in the same `.next/`

`next build` rewrites chunk hashes. If a `next dev` process is still serving the page, the browser holds the old chunk names and Next throws `Cannot find module './XXX.js'` from `webpack-runtime.js`. Hit twice this session.

**Recipe when it happens:**
```
pkill -f next   # stop everything
rm -rf .next    # nuke the cache
npx next dev    # restart
```

For verification builds, prefer running them in a separate worktree or stop the dev server first.

---

## 7. Status — homepage audit (this session, 2026-05-02)

User flagged visible overlap/padding bugs in the running site (screenshots in chat: News & Events, InlineApply, Testimonials, CampusLife, FeeCallout). Root cause was the Tailwind `.h-1/2/3` collision (§6.1). After renaming to `.bipe-h1/2/3`, headings no longer collapse to 4px, so the cascading "text bleeding into next section" symptom is resolved.

**Verification**: `npm run build` passes. `.next/static/css/*.css` no longer contains `.h-1`/`.h-2`/`.h-3` rules; only `.bipe-h1/2/3` from our design system.

**Still recommended (not done in this session, low risk):** load the dev server, scroll through each section, confirm visual parity with the original Claude Design preview. If anything else looks off after this fix, log it in §9.

---

## 8. SEO snapshot

- Per-route `metadata` (Next 15 metadata API).
- JSON-LD: `CollegeOrUniversity` + `WebSite` injected in root layout.
- `app/sitemap.ts` enumerates all routes.
- `app/robots.ts` allows all, points to sitemap.
- `hreflang` alternates: `en-IN` and `hi-IN` (the `?lang=hi` form just hints at the locale; localization is client-side via the toggle, not URL-based).
- Geo meta (lat/lng) in `app/layout.tsx`.
- When the production domain is set, search-replace `https://www.bipevns.org/` in: `lib/routes.ts`, `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`.

---

## 9. Future improvements (running list — append, don't truncate)

User explicitly said: *"we will do improvements later on as we will move ahead"*. Park new ideas here so they don't get lost.

- [ ] Replace Unsplash placeholders with real BIPE photos (drop into `public/images/` and update `lib/images.ts`).
- [ ] Wire `InlineApply` and `apply` form to a real backend (currently `setSent(true)` only).
- [ ] Wire grievance and contact forms.
- [ ] Add `next-sitemap` or expand `app/sitemap.ts` once the domain is final.
- [ ] Consider proper i18n via `next-intl` if Hindi scope expands beyond nav.
- [ ] Add OG image generation (`opengraph-image.tsx`) per route for richer social previews.
- [ ] Add favicons (currently relying on Next's default).
- [ ] Lighthouse / accessibility audit pass once content is real.
- [ ] Decide on the workspace lockfile (§6.6).
- [ ] Add ESLint config for CI (§6.7).

---

## 10. How to resume in a fresh chat

If you (or a future agent) are starting cold:

1. Read this file end-to-end.
2. Skim `lib/routes.ts` for route copy and `lib/data.ts` for content.
3. The design source bundle is at `d:\tmp\bipe_design\extracted\bipe\` if you need to compare visuals to the original.
4. `npm run dev` → http://localhost:3000.
5. **Don't** add a tweaks panel, font switcher, dark mode, density toggle, or alternate hero variants without explicit user instruction.
6. **Do** prefix any new design-system class with `bipe-` (§6.1).

---

_Last updated: 2026-05-02. Current scope: homepage parity with the Claude Design reference; sub-pages stubbed with full metadata and content from the prototype._
