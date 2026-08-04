# BIPE — Keyword SEO Audit

May 2026 · Audit conducted directly against `lib/routes.ts`, branch metadata, blog posts, and production HTML at <https://www.bipevns.org>. Companion to `BIPE_Keyword_Strategy.xlsx`.

---

## Executive summary

Out of **64 target keywords** mapped across 8 tiers:

| Status | Count | % |
|---|---|---|
| ✅ Good (already well-targeted) | 30 | 47% |
| 🟡 Partial (page exists, not fully optimized) | 23 | 36% |
| 🟠 Missing (page exists, target keyword absent from key fields) | 4 | 6% |
| 🔴 No page yet (keyword has no canonical surface) | 7 | 11% |

**Headline finding:** the keyword foundation is significantly stronger than typical institutional sites. Brand, branch, BTEUP-code, AICTE-trust, comparison, and Bihar-outreach queries are all well-defended. The fixable gap is concentrated in **year-modifier coverage** (no "2026" in /jeecup title) and **head-term capture** (homepage doesn't explicitly target "polytechnic in Varanasi" in H1).

---

## What the site does well

### 1. BTEUP-code targeting is textbook-good
Every branch page bakes its BTEUP code into the title — `BTEUP 327` for dairy, `BTEUP 343` for mechanical, etc. These long-tail queries are zero-effort to rank for and convert directly (anyone searching by BTEUP code is a current applicant comparing institute codes).

### 2. JEECUP institute code 4455 used as a brand handle
The code 4455 appears in titles, descriptions, body copy, and structured data. Prospects who hear "4455" from a counsellor and Google the number land on BIPE. This is rare to see done so consistently.

### 3. Comparison + decision content is unusually deep
Three blog posts already own:
- "diploma vs ITI vs B.Tech"
- "diploma to B.Tech lateral entry UP / AKTU"
- "JEECUP application 2026 step-by-step"

Plus `/jeecup-vs-bcece` and `/jeecup-from-bihar` for Bihar outreach. These are mid-funnel pages most polytechnic sites lack entirely.

### 4. Trust-signal pages own their queries
`/approvals`, `/mandatory-disclosure`, `/grievance` all target sophisticated verification queries and rank for them because the content is genuinely AICTE-aligned (not boilerplate).

### 5. Dairy Engineering as a strategic moat
Only 4 UP institutes offer it. `/courses/dairy-engineering` owns "BTEUP 327 dairy" and "Dairy Engineering diploma UP" with no real competition.

---

## What needs fixing — by priority

### 🔴 P0 — Do this week

| # | Fix | Where | Effort | Why it matters |
|---|---|---|---|---|
| 1 | Add **"2026"** to `/jeecup` page title | `lib/routes.ts` line 80 | 30 sec | The query "JEECUP 2026" is the primary admissions search of the year and the title currently omits the year. Costs one word. |
| 2 | Add **"polytechnic in Varanasi"** explicitly to homepage H1 or hero strapline | `app/page.tsx` H1 area | 5 min | Homepage targets via "Phoolpur, Varanasi" but doesn't use the exact head-term phrasing prospects type. |

### 🟠 P1 — Do this month

| # | Fix | Where | Effort |
|---|---|---|---|
| 3 | Add **JEECUP rank vs college / cutoff for 4455** post | new `app/blog/jeecup-rank-vs-bipe-4455/page.tsx` | 1-2 days · **blocked** on you sharing 2023-25 historical cutoff data |
| 4 | Optimize `/placements` for "polytechnic placements UP" | `lib/routes.ts` description + body H2 | 10 min |
| 5 | Optimize `/hostel` for "polytechnic with hostel UP" | `lib/routes.ts` description | 5 min |
| 6 | Add "AICTE-approved polytechnic in Varanasi" as anchored H2 on `/about` | `app/about/page.tsx` | 5 min |
| 7 | Audit H1 on every "Partial" status page | various | 1-2 hr |
| 8 | Year-modifier sweep: ensure "2026" / "2026-27" appears in title or meta for `/admission`, `/jeecup`, `/fees`, `/approvals` | `lib/routes.ts` | 15 min |

### 🟡 P2 — Do this quarter

| # | Fix | Where | Effort |
|---|---|---|---|
| 9 | Add a "Typical first salaries by branch" section to `/placements` (anonymized real data) | `app/placements/page.tsx` | 1 day |
| 10 | Add Hindi-script keyword phrases as section eyebrows | `app/admission/page.tsx`, `app/jeecup/page.tsx`, key blog posts | 30 min |
| 11 | Add synonym mentions: "dairy technology" alongside "dairy engineering", "diploma engineering" alongside "polytechnic course" | branch pages | 15 min |
| 12 | Add "polytechnic 14 km from Varanasi station" to `/visit` meta | `lib/routes.ts` | 2 min |

### ⚪ P3 — Optional / strategic bets

| # | Fix | Where | Effort |
|---|---|---|---|
| 13 | Replicate the `/admission-from-bihar` pattern for Mau / Ghazipur / Azamgarh / Mirzapur | 4 new pages | 1-2 weeks |
| 14 | Comparison pages: "BIPE vs RJIT Lucknow" / "BIPE vs IERT Allahabad" | 1-2 blog posts | 2-3 days each |
| 15 | Split "diploma vs ITI" out of the combined blog post into a dedicated post for the ITI-specific query | new `app/blog/diploma-vs-iti/page.tsx` | 1 day |
| 16 | Schema.org `keywords` field on every page (Next metadata API supports it) | `lib/seo.ts` | 30 min |

---

## Cannibalization risks

Five pages share a query with another page. Most are fine — distinct intents — but two need attention:

### Medium risk: "polytechnic admission"
Three pages own this query: `/admission`, `/apply`, `/jeecup`. They all target the same searcher at different funnel stages. Action: keep all three, but consider `noindex`-ing `/apply` if it's the form-only conversion endpoint (often these don't need to rank — they need to convert).

### Medium risk: "Phoolpur campus"
Three pages: `/campus/phoolpur`, `/campus`, `/visit`. Each should target a distinct keyword:
- `/campus/phoolpur` → "Phoolpur polytechnic" / "BIPE Phoolpur"
- `/campus` → "BIPE campus facilities" / "polytechnic labs Varanasi"
- `/visit` → "visit BIPE campus" / "BIPE campus tour"

Current titles are correctly distinct; just monitor in GSC after the property starts reporting data.

---

## Gaps

13 gaps identified — full list in `BIPE_Keyword_Strategy.xlsx > Gap Summary`. The highest-value six:

1. **JEECUP rank vs college / cutoff** — no canonical surface (audit's 6th blog post, blocked on you).
2. **Polytechnic salary by branch** — first-year compensation data not surfaced. Adds to `/placements`, doesn't need a new page.
3. **Year modifier missing on `/jeecup`** — title omits "2026". One-word fix.
4. **Hindi keyword phrases absent** — "JEECUP फॉर्म कैसे भरें" and similar Hindi queries don't appear anywhere despite the audience being significantly Hindi-first.
5. **"dairy technology"** synonym absent from `/courses/dairy-engineering` — costs one sentence.
6. **Geographic expansion for Mau / Ghazipur / Azamgarh / Mirzapur** — same pattern as Bihar pages would catch ~25-30% more Eastern UP catchment.

---

## What I deliberately didn't measure

A real keyword audit usually includes:
- **Search volume** per keyword (requires Semrush / Ahrefs / Google Keyword Planner — paid)
- **Keyword difficulty** scores (paid)
- **Competitor SERP analysis** (requires paid tools or careful manual work)

I rated each keyword qualitatively (High / Med / Low) based on my model of the Indian polytechnic vertical and BIPE's positioning. When you get a Semrush / Ahrefs trial, the spreadsheet's structure can absorb actual volume + difficulty numbers without redesign.

---

## How to use the spreadsheet

`BIPE_Keyword_Strategy.xlsx` has 4 sheets:

1. **Keyword Map** — 64 target keywords with intent, value, difficulty, canonical page, current optimization status, and recommended action. Filter by "Status" (Missing / Partial / Good) to see what to fix.
2. **Cannibalization** — pages competing for the same query, with resolution notes.
3. **Gap Summary** — keywords without a page, pages without a clear target, and Hindi/synonym gaps.
4. **Tier Legend** — what each tier (A through H) covers.

**Suggested cadence:**
- Sort Keyword Map by Status → "Missing" first, then "Partial".
- Pick 3-5 fixes per week.
- After every fix, update the spreadsheet's Status column.
- Once GSC starts reporting data, paste actual rank + clicks into a new column next to "Status".

---

## File locations

```
/Users/praveenrai/BIPE WEBSITE SSS/BIPE_Keyword_Strategy.xlsx
/Users/praveenrai/BIPE WEBSITE SSS/BIPE_Keyword_SEO_Report.md  (this file)
```

Both files are untracked. Move out of the project root or commit them based on whether you treat them as project artifacts vs personal working docs.
