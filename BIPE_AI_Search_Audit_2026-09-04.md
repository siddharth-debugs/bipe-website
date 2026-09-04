# BIPE — AI-search readiness audit, 4 September 2026

**For:** the other Claude account working on this Mac (the "Praveen Trustee" sessions).
**From:** the session that closed PR #2, wired the alumni-intro WhatsApp templates, retired the Meta-lead admin ping and moved the footer Alumni link.
**This file:** `BIPE_AI_Search_Audit_2026-09-04.md` at the repo root, committed to `main` — you have it via `git pull`.
**Repo state when this was written:** `content/dairy-closure` at `e738730`, level with `origin/main`, working tree clean.

---

## Read this first

**Do not apply anything in this document without reading the HARD RULES section below.** Several findings look like "restore the missing branch" or "remove the stale company name" to a fresh reader. Applying them that way would undo owner decisions and, in one case, publicly announce something the owner explicitly said to handle silently. Two sessions already lost a day to exactly that failure mode on 2–3 September.

**How this was produced.** Seven audit agents, one per dimension, each required to verify its own claims against a `file:line` read *and* a live `curl` before returning anything. The critical and high findings then went to an adversarial verifier instructed to refute by default and to re-derive the evidence from scratch rather than trust it. One finding was refuted and is recorded below with its reasoning, because the reasoning matters. A completeness critic then looked for what the seven dimensions missed.

**Verification status — three tiers, do not confuse them:**

| Tier | Count | What it means |
|---|---|---|
| Confirmed | 8 | Found, independently re-derived, adversarially survived, and hand-checked against repo + live site. Safe to act on. |
| Critic gaps | 8 | Found by the completeness pass. Verified by that agent, but not put through the adversarial pass. Check before acting. |
| Unverified | 36 | Medium/low finder output. **No verification pass ran on these.** Treat as leads, confirm each against source before touching anything. |

---

## HARD RULES — violating these makes a "fix" a regression

These come from owner rulings recorded in the shared project memory at
`~/.claude/projects/-Users-praveenrai-BIPE-WEBSITE-SSS/memory/`. Read those files if anything below is unclear.

1. **Never announce the Dairy Engineering closure.** Owner, 3 Sep 2026, verbatim: *"don't announce or advertise dairy-closure. remove content silently."* No banner, no FAQ entry, no news item, no "of which four admit" phrasing, no "discontinued" label. The correct treatment is absence. Every fix below is a bare count correction for exactly this reason.
2. **"Mother Dairy" stays.** It is a recruiter/employer name, not the branch. So do dairy-industry career destinations (Amul, Parag, NDDB, Nestlé) framed as pathway claims. Removing the branch is not removing the industry.
3. **Never remove recruiter names.** Owner ruling 3 Sep: the alumni manifest is a PARTIAL record, so a company's absence from it proves nothing. Two sessions spent a day deleting names on the opposite theory and had to revert.
4. **Do not "reconcile" the placement numbers.** 1,363 counts drive selections, not distinct people (1,016 distinct) — intentional. The 46 recruiter figure is a marketing count that deliberately exceeds the manifest-derived 32 — intentional. Both gaps are owner-endorsed.
5. **Do not restore static/ISR rendering.** The whole site renders dynamically on purpose so the root layout can set a per-route `<html lang>` for the Hindi hreflang pairs via `proxy.ts`.
6. **The Director's name differs by script by design:** English "Tewari", Hindi "तिवारी". Do not harmonise them.
7. **Do not revert the `getContact()` seed overlay** in `lib/content.ts`. It seed-enforces identity NAP fields over a stale CMS row; reverting reintroduces the retired phone and email into every page's footer and JSON-LD.
8. **The CMS overrides the repo.** `getPageSection("home", …)` and `getBranchesMapped()` are CMS-first, so a repo fix can be invisible in production and a production defect can have no repo cause. Read the live bundle at `https://bipevns.org/api/admin/content/public/` before concluding anything. Say which side a fix belongs to.

---

## The headline: the site tells crawlers two different branch counts

Every canonical surface — homepage hero, `/courses`, `/about`, `/campus`, `llms.txt`, and all JSON-LD — says **four** branches. Eighteen blog pages, which are the most-crawled content on the domain, say **five**. One Hindi guide says five "of which four admit", which is simultaneously the five-branch claim and the closure disclosure the owner ruled out.

Asked "how many branches does BIPE offer?", a model reading this domain sees both numbers and either hedges or answers five — and then names the fifth, because `/approvals` supplies Dairy Engineering with code 327 and 60 seats. Fixing the blog CTA alone removes most of the wrong signal.

---

## Confirmed defects (8)

> **CORRECTION, 4 Sep 2026 — finding 7 is WITHDRAWN.** It claimed the homepage's
> "480 sanctioned seats" contradicted the four-branch 420-seat grid and should read 420.
> The owner ruled otherwise: *"Intake strength will remain 480, dairy seats will be
> adjusted in some other branch."* The sanctioned intake is **unchanged** by the Dairy
> closure — the 60 seats are being reallocated to another branch, not surrendered.
> The homepage figure has been reverted to 480 and the reasoning recorded in the
> component. **Do NOT change it to 420** — that understates approved capacity.
>
> **What this opens instead:** once the owner names the branch that absorbs the 60 seats,
> `DATA.branches` seat counts change, `PUBLIC_SEATS` becomes 480, and every public
> "420 seats across four branches" claim needs updating in the same pass —
> `app/campus/page.tsx:32`, `app/private-vs-government-polytechnic/page.tsx:104`
> (which also lists the per-branch split), `app/aided-polytechnic-uttar-pradesh/page.tsx:50,227`,
> `app/government-polytechnic-in-eastern-up/page.tsx:357`, `app/courses/page.tsx:76`,
> `lib/blogPosts.ts:2474` (Hindi "चार branches, 420 सीटें"), and the doc block at
> `lib/data.ts:530-531`. That is a blocked task, not a defect: it needs the allocation first.


All are repo-side. All are count or tense corrections. None names a branch or announces anything.

| # | File | Says now | Should say |
|---|---|---|---|
| 1 | `app/blog/[slug]/page.tsx` :92, :99, :548 | five diploma branches / View all 5 | four |
| 2 | `lib/blogPosts.ts` :2463 | 5 branches, 4 of which admit | four |
| 3 | `lib/jeecup-resources.ts` :685 | we'll hold your branch while rounds run | rounds concluded |
| 4 | `components/home/Countdown.tsx` :65, :76 | what is open before you travel / Apply now | closed / Enquire for 2027-28 |
| 5 | `app/placements/page.tsx` :1303 | 44 recruiters | 46, read from the module |
| 6 | `app/mandatory-disclosure/page.tsx` :124 | 40 faculty across five departments | four departments |
| 7 | `components/home/Branches.tsx` :265 | ~~480 sanctioned seats~~ | **WITHDRAWN — see below** |
| 8 | `lib/jeecup-resources.ts` :490, :494 | talk to us about a seat | about session 2027-28 |

### 1. Every blog post (18 indexed pages) tells crawlers BIPE has FIVE diploma branches

**Severity:** critical · **Fix side:** repo · **Dimension:** dairy-closure

**Why an answer engine gets this wrong**
18 of the site's 100 sitemap URLs — the highest-traffic, most-crawled content on the domain — end with "View all 5 polytechnic branches" and an in-article CTA saying "five diploma branches in Phoolpur, Varanasi". Every canonical surface (home hero, /courses, /about, /campus, llms.txt, all JSON-LD) says four. Asked "how many branches does BIPE offer?" a model sees 4 vs 5 across the same domain and either hedges ("four or five, sources differ") or answers 5 and then invents the fifth — Dairy Engineering, which /approvals conveniently supplies with code 327 and 60 seats. This is the single largest source of the five-branch signal on the site.

**Evidence (re-derived independently by a second agent, then spot-checked by hand against the repo and the live site)**
```
REPO app/blog/[slug]/page.tsx:99 — `body: "AICTE-approved · BTEUP code 4455 · five diploma branches in Phoolpur, Varanasi. Admissions for 2026-27 have closed..."`; :92 (Hindi variant) — `"...Phoolpur, Varanasi में 5 diploma branches।"`; :548 — `View all 5 polytechnic branches <ArrowIcon />` (links to /courses, which renders four). The CTA is injected into every post lacking its own cta block (withInlineCta, :84-102); only 3 of 18 posts in lib/blogPosts.ts define their own — and those hand-written ones correctly say "4 branches" (lib/blogPosts.ts:270, :401).
LIVE curl https://bipevns.org/blog/junior-engineer-eligibility-after-diploma → "AICTE-approved · BTEUP code 4455 · five diploma branches
```

**Fix**
app/blog/[slug]/page.tsx: line 99 "five diploma branches" → "four diploma branches"; line 92 "5 diploma branches" → "4 diploma branches"; line 548 "View all 5 polytechnic branches" → "View all 4 polytechnic branches". Pure count correction — names no branch, says nothing about any closure, and brings these pages in line with lib/data.ts's own documented PUBLIC_BRANCHES rule (lib/data.ts:535-541).

### 2. Hindi guide states "5 branches, 4 of which admit" — a five-branch claim AND a de-facto closure disclosure

**Severity:** critical · **Fix side:** repo · **Dimension:** dairy-closure

**Why an answer engine gets this wrong**
One indexed page says in Hindi that BIPE has 5 BTEUP-affiliated branches of which 4 admit for 2026-27. That is (a) an explicit statement that a fifth branch exists, which is exactly the claim the site is meant not to make, and (b) a public disclosure that one branch is not admitting — the announcement the owner ruled out. The same page also says "चार branches, 420 सीटें" twice, so one URL contradicts itself: a model summarising this page produces "BIPE has five branches but only four are taking students," which is both off-message and, since 2026-27 is now fully closed, factually stale.

**Evidence (re-derived independently by a second agent, then spot-checked by hand against the repo and the live site)**
```
REPO lib/blogPosts.ts:2463 — `"...16 साल का track record, 1,363 verified alumni placements, और 5 BTEUP-affiliated branches — जिनमें से 4 में 2026-27 में admission है।"` Same post, lib/blogPosts.ts:2399 — `"बीआईपीई में चार branches हैं"` and :2474 — `"<strong>चार branches, 420 सीटें</strong> — Civil, Electrical, Mechanical (Production), Computer Science"`.
LIVE curl https://bipevns.org/blog/polytechnic-kya-hai-aur-kaise-kare renders all three sentences on the same page: "...5 BTEUP-affiliated branches — जिनमें से 4 में 2026-27 में admission है" and "चार branches, 420 सीटें" and "बीआईपीई में चार branches हैं".
```

**Fix**
lib/blogPosts.ts:2463 — replace "5 BTEUP-affiliated branches — जिनमें से 4 में 2026-27 में admission है" with "4 BTEUP-affiliated branches". Drop the "जिनमें से 4 में...admission है" clause entirely rather than rewording it: any "of which N admit" phrasing is the closure notice the owner ruled out. Matches the post's own two other sentences.

### 3. /jeecup-rank-predictor-2026 still promises to HOLD a branch via "Early Seat Registration while the rounds run"

**Severity:** critical · **Fix side:** repo · **Dimension:** admission-cycle

**Why an answer engine gets this wrong**
A model asked "can I still get a seat at BIPE for 2026-27?" finds a live BIPE page offering to reserve a branch while counselling rounds run, and answers "yes — BIPE will hold your preferred branch through Early Seat Registration." That is false (counselling concluded mid-August, no seats exist) and it is also the exact class of seat-availability/seat-held claim the 3 Sep banner retirement note says the owner forbids.

**Evidence (re-derived independently by a second agent, then spot-checked by hand against the repo and the live site)**
```
lib/jeecup-resources.ts:685 — ctaBody: "Send us your JEECUP rank and we'll tell you, honestly, which branches are realistic at BIPE and how to order your counselling choices to land one. Free, in English or Hindi — and we'll hold your preferred branch with Early Seat Registration while the rounds run."

Live (curl https://bipevns.org/jeecup-rank-predictor-2026, text-stripped): "...Talk to BIPE admissions. Send us your JEECUP rank and we'll tell you, honestly, which branches are realistic at BIPE and how to order your counselling choices to land one. Free, in English or Hindi — and we'll hold your preferred branch with Early Seat Registration while the rounds run. Start application WhatsApp a
```

**Fix**
Rewrite lib/jeecup-resources.ts:685 ctaBody to drop the seat-hold promise and the live-rounds framing, e.g.: "Send us your JEECUP rank and we'll give you an honest read on which branches at BIPE your band reaches. JEECUP 2026 counselling has concluded and admission for session 2026-27 is closed — this is a reference for ordering your choices in the JEECUP 2027 cycle, for session 2027-28. Free, in English or Hindi." Do not reintroduce any 'Early Seat Registration' / seat-holding language for any cycle.

### 4. Homepage countdown panel implies BIPE may still have something open for 2026-27 — "what is open before you travel" + an "Apply now" CTA

**Severity:** medium · **Fix side:** repo · **Dimension:** admission-cycle

**Why an answer engine gets this wrong**
The homepage is the most-crawled page on the site. It tells a seatless candidate to talk to BIPE because admissions "will tell you honestly what is open before you travel" — the natural reading is that something may still be open at BIPE this session. An answer engine reconciling this against /apply and /lp/jeecup ("there is no seat to offer this session") either hedges ("it may still be worth contacting them") or states outright that BIPE has late seats, sending a family on a wasted trip to Phoolpur.

**Evidence (re-derived independently by a second agent, then spot-checked by hand against the repo and the live site)**
```
components/home/Countdown.tsx:65 — "The 2026-27 session started on 1 August, and JEECUP counselling has now concluded — <strong>Round 5 was the final round</strong>, and it closed in mid-August. If you are still without a seat, talk to BIPE admissions (code 4455): they will tell you honestly what is open before you travel."
components/home/Countdown.tsx:76 — <Link href="/apply" className="btn btn-primary">Apply now <ArrowIcon /></Link>

Live (curl https://bipevns.org/, text-stripped): "Session under way Classes have begun. The 2026-27 session started on 1 August, and JEECUP counselling has now concluded — Round 5 was the final round, and it closed in mid-August. If you are still without a se
```

**Fix**
In components/home/Countdown.tsx, replace the last sentence of the `started` paragraph (line 65) with an explicit closure statement, e.g. "...and it closed in mid-August. Admission to BIPE for session 2026-27 is closed — there is no seat to offer this session. If you are planning session 2027-28, BIPE admissions (code 4455) will walk you through JEECUP 2027." Change the line-76 CTA label from "Apply now" to "Enquire for 2027-28" to match the CMS hero CTA on the same page.

### 5. /placements publishes both "46 recruiters" and "44 recruiters" on the same page; llms.txt says 46

**Severity:** high · **Fix side:** repo · **Dimension:** llms-txt

**Why an answer engine gets this wrong**
llms.txt states "1,363 TPO-verified placements 2016-2026 across 51 documented drives and 46 recruiters". The page llms.txt points to for that fact renders 46 in its trust strip and 44 in its closing stat row. A model that reads both hedges ("around 44-46 companies") or picks the lower stale number, which is exactly the figure the owner overruled on 3 Sep. Worse, a parent comparing the AI answer to the page sees the site contradicting itself on its headline placement claim.

**Evidence (re-derived independently by a second agent, then spot-checked by hand against the repo and the live site)**
```
app/llms.txt/route.ts:421 — `${PLACEMENT_STATS.totalRecruiters} recruiters. Current recruiters include: ...` (PLACEMENT_STATS.totalRecruiters = 46, from lib/placement-stats.ts:127 `totalRecruiters: 46` via Math.max at lib/placement-stats.ts:139-142).

app/placements/page.tsx:336 — `{["Joining-letter verified", `${PLACEMENT_STATS.totalRecruiters} recruiters`, "2200+ alumni"]}` → renders 46.
app/placements/page.tsx:1303 — `{ num: "44", l: "recruiters" },` → hardcoded, sits directly beside `{ num: formatPlacements(PLACEMENT_STATS.totalPlacements), l: "placed" }` on line 1302 which DOES read the module.

Live curl of https://bipevns.org/placements (text-extracted):
  "...placement cell Tracked →
```

**Fix**
app/placements/page.tsx:1303 — replace the literal `{ num: "44", l: "recruiters" }` with `{ num: String(PLACEMENT_STATS.totalRecruiters), l: "recruiters" }`, matching line 1302's pattern. This is the last hardcoded recruiter literal in the codebase (grep for `"44"` returns only this line plus a doc comment). Do NOT touch the 46-vs-32 marketing/manifest gap — that divergence is intentional.

### 6. /mandatory-disclosure §07 claims "five departments (… Dairy Engineering)" but the /faculty roster it links has zero Dairy faculty

**Severity:** high · **Fix side:** repo · **Dimension:** llms-txt

**Why an answer engine gets this wrong**
llms.txt asserts "Faculty: 40 (1:20 mentor ratio...)" and "4 BTEUP-affiliated diploma branches". The disclosure page it links as the authoritative AICTE filing says those 40 faculty are spread "across five departments (Computer Science, Civil, Electrical, Mechanical, Dairy Engineering) — one per BTEUP-affiliated branch". Asked "what departments does BIPE have?", a model reading the compliance page answers five and names Dairy Engineering; asked to verify against the named roster on /faculty, it finds four and no Dairy staff. The phrase "one per BTEUP-affiliated branch" turns a department count into an explicit branch count, so this is the single sentence on the site that most directly tells an answer engine BIPE offers five branches today.

**Evidence (re-derived independently by a second agent, then spot-checked by hand against the repo and the live site)**
```
app/mandatory-disclosure/page.tsx:124 — `<p><strong>40 BTEUP-recognised faculty</strong> across five departments (Computer Science, Civil, Electrical, Mechanical, Dairy Engineering) — one per BTEUP-affiliated branch.</p>`

The in-code justification immediately above it is now factually false:
app/mandatory-disclosure/page.tsx:118-119 — `lib/faculty.ts\n carries three named Dairy Engineering lecturers, and the\n /faculty roster renders them.`

lib/faculty.ts no longer carries any: `grep -o 'Lecturer, [A-Za-z &()]*' lib/faculty.ts | sort | uniq -c` returns only
   8 Lecturer, Civil Engineering
   3 Lecturer, Computer Science & Engineering
   5 Lecturer, Electrical Engineering
  12 Lecturer, Me
```

**Fix**
app/mandatory-disclosure/page.tsx:124 — change to "40 BTEUP-recognised faculty across four departments (Computer Science, Civil, Electrical, Mechanical)" and drop "one per BTEUP-affiliated branch". Delete the now-false code comment at :117-123. This is a roster/payroll fact, not a statutory approval figure — it must match /faculty, which is itself the AICTE Annexure-18 §7 roster the same section links to. Leave §06's 480-seat sanctioned-intake filing alone (see the separate finding); no closure notice, no explanatory banner.

### 7. Homepage prints "480 sanctioned seats · 2026-27" directly under a four-branch, 420-seat grid

**Severity:** high · **Fix side:** repo · **Dimension:** dairy-closure

**Why an answer engine gets this wrong**
The homepage lists exactly four branch cards (355/60, 322/120, 328/120, 343/120 = 420) and immediately below them claims 480 sanctioned seats for 2026-27. /about states, in a near-identical sentence, "2026-27 sanctioned intake · 4 BTEUP branches — 420". Two pages give two different answers to the identical question. Worse, 480 minus the four visible branches leaves exactly 60 unexplained seats, which is the arithmetic breadcrumb that leads a reasoning model to conclude a fifth 60-seat branch exists — and /approvals names it. This is the most load-bearing contradiction on the site's most-crawled page.

**Evidence (re-derived independently by a second agent, then spot-checked by hand against the repo and the live site)**
```
REPO components/home/Branches.tsx:265 — `480 sanctioned seats · 2026-27` (hardcoded, inside a Link to /approvals; the block comment at :244-247 still calls the grid above it "the 5-card grid"). This directly violates the rule documented in the same repo, lib/data.ts:539-541: `SANCTIONED_SEATS → 480, the EoA figure. Never print it outside those two pages.`
LIVE curl https://bipevns.org/ → "...|343|Mechanical Engineering (Production)|...|480 sanctioned seats · 2026-27|AICTE-approved · BTEUP-affiliated", with the stats bar on the same page reading "4 | Branches admitting 2026-27".
LIVE curl https://bipevns.org/about → "TOTAL | 2026-27 sanctioned intake · 4 BTEUP branches | 420".
```

**Fix**
components/home/Branches.tsx:265 — "480 sanctioned seats · 2026-27" → "420 sanctioned seats · 2026-27" (matches the four cards rendered above it and /about's identical callout), and update the stale "5-card grid" wording in the comment at :246. Nothing is announced; a public marketing surface simply stops printing the EoA-letter figure that lib/data.ts already says must never appear outside /approvals and /mandatory-disclosure.

### 8. /jeecup-result-2026 hero and lead tell candidates to "talk to BIPE admissions (code 4455) about a seat"

**Severity:** medium · **Fix side:** repo · **Dimension:** admission-cycle

**Why an answer engine gets this wrong**
The page's own metadata says BIPE cannot admit for 2026-27, but the hero alert and lead — the two blocks a crawler weights most — invite the reader to ask BIPE about a seat now that the session has begun. A model summarising this page tells a student with a 2026 rank card to contact BIPE about a seat for the current session.

**Evidence (re-derived independently by a second agent, then spot-checked by hand against the repo and the live site)**
```
lib/jeecup-resources.ts:490 (heroAlert.text) — "JEECUP 2026 results are out. Check your rank on the official portal — then, with all five counselling rounds closed and classes under way, talk to BIPE admissions (code 4455) about a seat."
lib/jeecup-resources.ts:494 (lead) — "...and how to talk to BIPE about a seat now that the session has begun."

Live (curl https://bipevns.org/jeecup-result-2026, text-stripped): "Result declared JEECUP 2026 results are out. Check your rank on the official portal — then, with all five counselling rounds closed and classes under way, talk to BIPE admissions (code 4455) about a seat."

Contradicts the same page's own description in lib/routes.ts (jeecupResult)
```

**Fix**
Replace "about a seat" with the closure + next-cycle framing in both places: heroAlert.text → "...with all five counselling rounds closed and classes under way, admission to BIPE for session 2026-27 is closed. Talk to admissions (code 4455) about session 2027-28 through JEECUP 2027."; lead → "...and what your rank means for planning the JEECUP 2027 cycle, now that session 2026-27 has closed."

---

## RESOLVED 4 Sep 2026 — the seat question, and why CSE is held at 60

Three owner rulings, in order, all verbatim:

1. *"Intake strength will remain 480, dairy seats will be adjusted in some other branch."*
   The Dairy closure does **not** cut approved capacity — so never publish 420 as the
   sanctioned figure. (This is why audit finding 7 was withdrawn.)
2. *"Computer Science, make it 120."* Applied in `26ad62b` + `fb046ea` — seed, CMS row and
   every public claim in one pass.
3. *"No it is not approved, do not update approvals."* then **"hold CSE at 60 until approval
   comes."** AICTE/BTEUP has not sanctioned the reallocation, and publishing 120 would state
   an intake above the approved figure for that branch. **Rolled back.**

**Current state — everything agrees, there is no divergence:** Computer Science 60,
Civil 120, Electrical 120, Mechanical 120 → 420 published across four branches, against
**480 sanctioned** (the retired branch still holds 60 in the approval record). The homepage
callout correctly prints 480; that gap between 480 sanctioned and 420 published is expected
and documented, not a defect.

**Do NOT "fix" any of this:**
- Never change a 480 sanctioned figure to 420 — it understates approved capacity.
- Never raise the public Computer Science figure to 120 — it is held pending approval.
- Never edit `/approvals` or `/mandatory-disclosure` §06 to match a public number.

When a revised EoA lands, the whole set moves together in one commit: seed (CSE 120, retired
branch 0), the CMS branch row, the nine hardcoded public claims, and only then the seat matrix
and the `/mandatory-disclosure` intake sentence. `lib/data.ts` carries the HOLD note with the
full edit list; `app/approvals/page.tsx` carries the matching note above `SEAT_MATRIX`.
`git show fb046ea 26ad62b` is the exact edit list, already written once.

**CMS gotcha, proven twice today:** `app/llms.txt/route.ts` asserts the CMS branch row against
the seed at build time and *fails the build* on divergence — in both directions. A seat change
must move the CMS row and the seed in the same pass. This session cannot write the CMS (admin
proxy returns 401); route it to the owner.

## One finding was REFUTED — and it needs an owner decision, not a code change

An agent flagged that `/approvals` and `/mandatory-disclosure` §06 still present five branches, 480 sanctioned seats, and a Dairy Engineering row with 60 seats, while the JSON-LD on those same pages emits four.

**The verifier confirmed every fact and rejected the fix.** Those are statutory pages reproducing the AICTE Extension of Approval for 2026-27, and Dairy genuinely *was* sanctioned for that year — the 2025-26 cohort is being taught out to 2028. Editing them to say four would misstate the approval record the pages exist to reproduce.

So the contradiction is real but it is not a bug. It is the gap between an institutional decision taken in September and a statutory filing issued earlier. **Someone needs to ask the owner** whether the approval-record pages should carry a neutral framing (for example, presenting the figures explicitly as the 2026-27 approval record rather than as a present-tense description of what BIPE offers) — without any closure language. Do not resolve this unilaterally in either direction.

Note the distinction that made finding 6 safe: §07's *staffing* claim ("40 faculty across five departments") is a roster fact, and `lib/faculty.ts` now has zero Dairy lecturers, so it contradicts the very roster it links to. That one is fixable. §06's *sanctioned intake* claim is the statutory filing and is deliberately left alone.

---

## Completeness-critic gaps (8) — verified by that agent, not adversarially checked

### C1. /events publishes a stale, future-tense JEECUP 2026 announcement that exists ONLY in the CMS — invisible to every repo grep the audit ran

**Severity:** critical · **Fix side:** cms

The newest-dated card on an indexed page tells a crawler BIPE's JEECUP 2026 results are still pending and "Counselling rounds open from 1st week of July" — in September 2026, six weeks after classes began. Asked "is BIPE admission open?", a model reading /events answers "results are expected in the third week of June and counselling opens in July — book a campus visit to lock in your branch", the exact opposite of the site-wide "2026-27 Admissions Closed / 2027-28 enquiries welcome" header. Worse, the card immediately below it (2026-05-18) says "JEECUP 2026 results declared · Counselling rounds open from May 24" — so the page self-contradicts on the same screen, which is the single most reliable way to make a model hedge or pick the wrong one. The item also carries a grammar error ("will be declare") that degrades the E-E-A-T read of the whole page.

**Fix:** In the CMS events collection, unpublish or delete row id 2 ("JEECUP 2026 results will be declare in 3rd week of June"), which is both stale and a duplicate of row id 10. This is a pure removal — it adds no notice and says nothing about any branch, so it is consistent with the silent-closure rule. While in there, row id 10's body ("Counselling rounds open from May 24") is also spent for the concluded cycle and should be unpublished or past-tensed. No repo change is possible or needed; lib/ contains none of this text.

### C2. The AICTE EOA PDF served from the site is text-extractable, has no X-Robots-Tag, and states "DAIRY 60" for Academic Year 2026-27

**Severity:** high · **Fix side:** repo

Google indexes PDFs and answer engines weight regulator-issued documents above marketing copy. This one is served from bipevns.org's own origin, extracts cleanly to text, and lists DAIRY with intake 60 alongside CIVIL 120 / COMPUTER 60 / ELECTRICAL for 2026-27. A model asked "which branches does BIPE offer?" that reaches this file gets a five-branch answer from what looks like the most authoritative possible source — BIPE's own AICTE approval letter — and will prefer it over the four-branch HTML. It is also the most likely origin of the 480-seat figure now circulating in third-party directories.

**Fix:** Do NOT alter, redact or remove the PDF — it is a genuine AICTE approval scan, Dairy WAS sanctioned for 2026-27, the cohort is being taught out, and it is required mandatory-disclosure evidence. The correct fix is to stop it competing as an indexed answer source while leaving it publicly reachable: add `X-Robots-Tag: noindex` for `/downloads/:path*.pdf` via a headers() rule in next.config.ts. That is silent (no notice, no copy change), keeps the document available to anyone who clicks through from /approvals, and satisfies disclosure. Verify afterwards with `curl -sI` that the header is present.

### C3. THE CEILING — third-party directories and the search index already publish the five-branch / 480-seat / Dairy-60 profile, and no on-site change can retract it

**Severity:** high · **Fix side:** external

This is the honest answer to whether "completely optimised" is achievable: it is not, and the gap is not on the site. A live web search performed during this review returns, as a synthesised answer, that BIPE "offers diploma engineering programs across five major branches including Computer Science & Engineering, Dairy Engineering, Civil Engineering, Electrical Engineering, and Mechanical Engineering (Production)" and that "For 2026-27, there are 480 total sanctioned seats across five 3-year BTEUP-affiliated diploma courses … Dairy Engineering (60 seats)". A parent asking any model today gets a five-branch answer sourced from collegedunia, getmyuni, careers360 and bharateducation.org, none of which BIPE controls. Note also that the synthesised answer reuses BIPE's own distinctive phrasing ("offered by only four institutes", "dairy pilot plant with processing line and pasteuriser") — the site's remaining Dairy copy is actively feeding it. Fixing every on-site defect changes the answer only after those directories and the index re-crawl, which is weeks-to-months and, for the directories, may never happen without a manual correction request.

**Fix:** Treat this as an off-site remediation task, not a code task, and set expectations accordingly. (1) Submit correction/claim requests to collegedunia, getmyuni, careers360 and bharateducation.org to drop Dairy Engineering and restate 4 branches / 420 admitting seats — these are the highest-leverage single actions available and none of them is a repo or CMS edit. (2) Once the on-site fixes land, request re-indexing of /courses, /approvals, /mandatory-disclosure and /about in Search Console so the 1,331 title and any cached five-branch copy refresh. (3) Accept that a residual lag is unavoidable and do not treat a surviving five-branch AI answer as evidence the site is still wrong. No closure announcement anywhere — the correction requests are factual profile edits, not a notice.

### C4. schema.org sameAs silently drops the Wikidata and Google Business Profile URLs — the two strongest entity-binding signals — contradicting the code's own stated intent

**Severity:** high · **Fix side:** repo

sameAs is the primary machine-readable claim that "this domain IS that entity". BIPE has a populated Wikidata item (Q139892164) whose P856 points back at the site, and a verified GBP — but the site never returns the link, so the binding is one-way and weaker than it should be. Entity resolvers in Google AI Overviews, Perplexity and ChatGPT are therefore likelier to fail to fuse bipevns.org with the Knowledge Graph entity, which is exactly what causes a model to answer about BIPE generically, hedge on identity, or conflate it with the sibling BITE (bitevns.ac.in) — a live risk given the near-identical names. The repo comments assert this is fixed; it is not, so nobody is looking.

**Fix:** In app/layout.tsx buildOrgJsonLd, append the non-social identity URLs to sameAs rather than deriving it only from the five contact fields — e.g. build from the five live contact URLs and then concat the DATA.social entries whose host is wikidata.org or maps.app.goo.gl (deduped), so CMS-editable socials still win while the two fixed identity anchors are always emitted. Do not touch the getContact() seed overlay. Separately (external, one edit): Wikidata P856 currently reads https://www.bipevns.org/, which 308s to the apex — retarget it to https://bipevns.org so the reciprocal link points at the canonical host.

### C5. Soft 404: /blog/<any-slug> and /courses/<any-slug> return HTTP 200 for URLs that do not exist

**Severity:** medium · **Fix side:** repo

A crawler or an AI browsing tool that follows a dead or renamed BIPE URL — a stale directory backlink, an old share, or the retired /courses/dairy-engineering pattern guessed by a model — receives HTTP 200 and must parse the body to discover the page is gone. Many retrieval pipelines treat 200 as success and will happily cite a non-existent page, or count it as a valid corroborating source. It also invites Google to crawl unbounded fake /blog/* and /courses/* URLs, diluting crawl budget across ~100 real URLs. The noindex meta limits indexation but does not fix the status code, which is what automated consumers key on.

**Fix:** Keep the dynamic rendering exactly as it is — the per-route <html lang>/hreflang design must not change, and this is not an argument for static or ISR. Resolve the slug before the response can flush: validate the param and call notFound() in generateMetadata (which runs ahead of the stream) or in a small server segment above the streaming boundary, so the 404 status is set before the first byte. Confirm the fix with `curl -s -o /dev/null -w '%{http_code}' https://bipevns.org/blog/nonexistent-slug-xyz` returning 404 while /blog/polytechnic-vs-iti still returns 200.

### C6. CMS home/stats and home/why-bipe still hold five-branch Dairy copy, and app/page.tsx instructs a future maintainer to re-wire them

**Severity:** medium · **Fix side:** both

Not currently rendered — I verified the live homepage contains zero occurrences of "Dairy", "incl. rare" or "BTEUP-affiliated branches". But both sections are fetched on every homepage render and are one CMS-admin action away from live, and the code comments explicitly tell the next maintainer to re-enable them once the backend rows are "brought in line". Whoever cleans up the stale alumni number in the stats row will reasonably conclude the row is now clean and restore the wiring — republishing a "5 · BTEUP-affiliated branches · incl. rare Dairy" stat and a why-bipe card naming Dairy Engineering Code 327, on the highest-authority page on the site. Given that the audit found five-branch claims surviving in 18 blog posts and on /mandatory-disclosure, this is the same failure mode with a loaded trigger.

**Fix:** CMS side: edit the home/stats items to drop the {"num":"5","sub":"incl. rare Dairy"} entry (or restate it as 4 / 420 seats), and delete card 03 from home/why-bipe. Silent data edits, no notice. Repo side: update the two comments at app/page.tsx:138 and :163 so they no longer read as a standing instruction to restore CMS content — state that these sections are pinned to lib/data.ts deliberately and that any re-wire must first be checked against RETIRED_BRANCH_SLUGS.

### C7. Homepage stat bar prints "4 · Branches admitting 2026-27" in the present tense for a closed cycle

**Severity:** medium · **Fix side:** repo

On the site's highest-authority page, a large numeric stat asserts BIPE is admitting for 2026-27. A model extracting the homepage's headline facts reads this as current intake and tells a parent BIPE has four branches admitting for 2026-27 — contradicting the site header two elements above it ("2026-27 Admissions Closed · 2027-28 enquiries welcome") and the "Enquire for 2027-28" CTAs. Stat tiles are exactly the kind of terse, high-confidence assertion retrieval systems lift verbatim. This is adjacent to the already-confirmed countdown-panel finding but is a different component and a stronger, more quotable claim.

**Fix:** Change the label at lib/data.ts:295 to a cycle-neutral or forward-looking form — e.g. label: "Branches admitting 2027-28" (matching the site-wide CTA), or "BTEUP diploma branches" with sub "JEECUP code 4455 · 420 seats". Keep the number 4. Do not add any explanation of why it changed from five.

### C8. /approvals and /about/affiliations link to urise.up.gov.in, whose TLS certificate expired on 19 Aug 2026

**Severity:** medium · **Fix side:** both

The URISE link is presented as third-party government corroboration of BIPE 4455 — one of the few outbound proofs a verification-minded crawler or a diligent parent would follow. It now fails the TLS handshake, so browsers show a full-page security interstitial and most automated fetchers abort. The corroboration silently evaluates to nothing, weakening exactly the regulator-backed citability the /approvals page exists to establish. WebFetch against it during this review returned "certificate has expired".

**Fix:** BIPE cannot fix a UP government certificate, so handle it on the link side. Either add rel="nofollow" and stop presenting URISE as a click-through proof until it is healthy, or swap the primary verification link to a reachable regulator already in lib/data.ts regulators[] — the AICTE public approval dashboard (facilities.aicte-india.org) and bteup.ac.in both resolve — keeping URISE as plain non-linked text. Re-check the certificate periodically and restore the link when it renews; this is monitoring, not a one-time fix.

---

## The ceiling — what cannot be fixed on this site

This is the honest answer to "is the site completely AI optimised?". It cannot be, and the remaining gap is not in the codebase:

- **Third-party directories and the search index already publish the five-branch, Dairy-included profile.** A live web search during the audit returned a synthesised answer describing BIPE as offering five major branches. No on-site change retracts that; it needs correction requests to the directories and time for the index to re-crawl.
- **Your own AICTE approval PDF is served from `bipevns.org`, extracts cleanly to text, and lists DAIRY 60 for 2026-27.** Answer engines weight regulator-issued documents above marketing copy. The document is genuine, is required mandatory-disclosure evidence, and **must not be altered, redacted or removed.** The only legitimate remedy is to stop it competing as an indexed answer source (an `X-Robots-Tag: noindex` header on the PDF route), not to change what it says.

Set expectations accordingly: the site can be made internally consistent. The wider web cannot be made consistent on the same timescale.

---

## Unverified medium/low findings (36) — leads only

**No verification pass ran on these.** A finder proposed each one; nothing re-derived them. Several are likely duplicates of the confirmed list above, and at least one (the `/approvals` five-branch item) is the same claim the adversarial pass already refused. Confirm each against the source of truth before touching anything.

1. **[medium] llms-txt** — /approvals states in present tense that BIPE has five branches and lists a Dairy Engineering seat row, contradicting llms.txt and /courses
   *Proposed fix (repo):* Narrow the /approvals claims to what they actually are — a reproduction of the 2026-27 approval record — without adding any notice or explanation. app/approvals/page.tsx:51: replace "All five BIPE branches are listed under college code 4455 in the JEECUP counselling portal" with a statement about th

2. **[medium] llms-txt** — llms.txt excludes /apply, so it offers no URL for the only action a 2027-28 enquirer can take
   *Proposed fix (repo):* app/llms.txt/route.ts: drop "/apply" from EXCLUDED_PATHS (line 83) and add it to KEY_PAGES, e.g. `{ path: "/apply", label: "Enquire", desc: "Session 2027-28 enquiry form — name, phone, branch of interest" }`, then update the EXCLUDED_PATHS comment at :80-82 which currently justifies the exclusion as

3. **[medium] llms-txt** — llms.txt's manual-literal maintenance inventory undercounts the cycle-bound literals it is the only guard for
   *Proposed fix (repo):* Two options, either acceptable. Minimum: extend the inventory at app/llms.txt/route.ts:64-66 to name all four cycle literals by line role — the Core Facts seat-line parenthetical, the "## Admissions" block, the "## JEECUP 20NN Guides" heading, and the "AICTE EoA 20NN-NN" label. Better: introduce one

4. **[medium] dairy-closure** — /early-registration promises callers a walkthrough of "the five branches"
   *Proposed fix (repo):* app/early-registration/page.tsx:21 — "the five branches" → "the four branches" (or simply "the branches", which also survives any future change). Count correction only.

5. **[medium] dairy-closure** — Published CMS rows still carry Dairy marketing copy, dormant only because two homepage sections are hand-unwired
   *Proposed fix (cms):* CMS-side: edit the two published rows. home/stats items[2] → {"num":"4","sub":"BTEUP-affiliated","label":"Branches admitting"} (mirroring what the seed already renders); home/why-bipe items[2] → replace the Dairy item with a non-Dairy proposition (the seed's DATA.whyBipe item is the obvious source).

6. **[medium] dairy-closure** — /approvals and /mandatory-disclosure §06 answer "how many branches / how many seats" with five and 480, in the same sentence template /about answers with four and 420
   *Proposed fix (both):* Do NOT delete the row or add a closure/last-intake note (owner directive; the row mirrors the EoA letter on file). The resolvable half is the framing: on /approvals:393 and /mandatory-disclosure:102,105, change the label from the catalogue-sounding "the 2026-27 sanctioned intake ... diploma courses"

7. **[medium] admission-cycle** — CMS /events still publishes future-tense JEECUP 2026 admission announcements that contradict each other and invite a visit to "lock in your branch preferences"
   *Proposed fix (cms):* In the CMS events table, unpublish or rewrite events id 2 and id 10. Either set is_published=false on both, or rewrite id 2 to a past-tense record with no invitation (e.g. title "JEECUP 2026 results declared", body "Counselling ran five rounds from late June to mid-August 2026. Session 2026-27 admis

8. **[medium] admission-cycle** — Every JEECUP and BTEUP resource page shows a large "Start application" primary CTA, twice per page, on 25 pages
   *Proposed fix (repo):* Change the label in all four places to "Enquire for 2027-28" (href stays /apply), matching lib/routes.ts apply.quickLink.label and the CMS home/hero cta_primary.label. One-word-per-file edit; no new copy needed.

9. **[medium] admission-cycle** — /courses tells readers to "Apply once on JEECUP... and start the diploma in August" and puts an "Apply for this branch" button on all four branch cards
   *Proposed fix (repo):* app/courses/page.tsx:1105 → "Apply once on JEECUP, choose any of our four branches in counselling, and start the diploma in August. Session 2026-27 is closed and classes are under way — the next intake is 2027-28, through JEECUP 2027." app/courses/CoursesView.tsx:423 → relabel the button "Enquire fo

10. **[medium] placement-figures** — Salary blog reads "46 recruiters (incl. 28 in government posts)" — 28 is an alumni count, not a recruiter count
   *Proposed fix (repo):* Reword both blog occurrences so 28 attaches to alumni, not recruiters: "…across 46 recruiters, with 28 alumni in government posts (Indian Railways ALP, UPPCL, SSC JE, UP Police, UPSSSC)". Keep the 46 and the 28 as-is — only the grammatical attachment changes.

11. **[medium] placement-figures** — 1,363 is labelled "alumni" on /about and four district pages, colliding with the site-wide "2,200+ alumni network" on the same pages
   *Proposed fix (repo):* Change the noun, not the number (the 1,363-vs-1,016 gap stays as-is): about/page.tsx:353 → "1,363 TPO-verified placements put BIPE alumni at Mahindra…"; catchments 161 → "(1,363 named placement records)"; 433/501/621 → "the documented 1,363-placement record". Note this sentence at about/page.tsx:353

12. **[medium] placement-figures** — The live CMS still serves 1,000+/1,400+ alumni figures for the homepage hero, stats and why-BIPE sections
   *Proposed fix (cms):* In the Django admin, update the three home rows to the canonical figures — hero description "Mentor 1:20 · 1,363 placed · since 2010", stats tile "2,200+ / Successful alumni", why-bipe metric "2,200+ / alumni network" — then the repo pins can be lifted deliberately rather than left as landmines. (Th

13. **[medium] structured-data** — Every blog post's Article JSON-LD hardcodes dateModified = datePublished, so 18 posts edited on 3–4 Sep 2026 still declare they were last modified in May/June 2026
   *Proposed fix (repo):* Add an optional `updatedISO` field to the BlogPost type in lib/blogPosts.ts, set it on the posts touched since publication (polytechnic-kya-hai-aur-kaise-kare → 2026-09-04; the posts changed by 6880e82 → 2026-09-03), and change app/blog/[slug]/page.tsx:359 to `dateModified: post.updatedISO ?? post.p

14. **[medium] structured-data** — Course courseSchedule says duration P3Y repeated Yearly × 3, which describes three consecutive three-year blocks, not the 3-year diploma the same node awards
   *Proposed fix (repo):* Change `duration` to "P1Y" in both places (one yearly repetition, repeated 3 times = the 3-year diploma), leaving repeatFrequency/repeatCount as they are. Alternatively drop courseSchedule and use `courseWorkload` — but P1Y × 3 Yearly is the closer match to how BIPE actually runs the cohort.

15. **[medium] structured-data** — /scholarships and /fees structured data lock the 50% merit award to a "JEECUP 2026 All-India rank" that no longer exists as a route, contradicting the cycle-neutral wording in /faq's FAQPage
   *Proposed fix (repo):* Drop the year from the award's eligibility wording in both the visible copy and the JSON-LD it is generated from — "top 2,000 JEECUP All-India rank", matching /faq. Change it in app/scholarships/page.tsx (the MonetaryGrant description, the card subtitle "top 2,000 JEECUP 2026 rank", and the Hindi FA

16. **[medium] structured-data** — /events publishes precise Event startDate/endDate (15/21 Feb 2027) with eventStatus EventScheduled, while the page itself only ever says "February" and the code comment records the dates as estimates
   *Proposed fix (repo):* Make the markup and the page tell the same story. Either (a) render the same date the JSON-LD asserts, visibly, on each flagship card ("February 2027 — dates confirmed nearer the time" is not enough if startDate stays precise), or (b) hold the Event nodes back until the Trust fixes the calendar and 

17. **[medium] crawlability** — /courses renders only the CSE branch panel without JavaScript, and no Course node in any page's structured data carries a seat count
   *Proposed fix (repo):* In app/courses/CoursesView.tsx, render all four detail panels into the DOM and switch visibility with CSS/`hidden` driven by `active`, instead of mounting only `b` — the interaction is unchanged, but all four descriptions, seat counts and fees land in the server HTML. Separately, add `maximumAttende

18. **[medium] crawlability** — Two sitemap URLs are orphans — zero internal <a> links to them anywhere on the site
   *Proposed fix (repo):* Add a real `<Link>` to /jeecup-cutoff-2026-bipe-vs-government from /jeecup, /jeecup-result-2026 and /jeecup-after-results-action-plan (the last two already reference it in prose — see the next finding), and a `<Link>` to /campus/phoolpur from /campus and /visit.

19. **[medium] crawlability** — About two dozen internal page references are rendered as bare unlinked paths in body copy, including inside FAQPage and HowTo JSON-LD answer text
   *Proposed fix (repo):* Convert the visible-copy occurrences to `<Link href="…">` with descriptive anchor text ("branch-wise cutoff comparison", not the raw path). In the JSON-LD Answer/HowToStep strings, where markup is not allowed, replace the bare path with the page's absolute URL or with prose naming the page ("our JEE

20. **[medium] entity-citability** — Every blog post hardwires dateModified to its publish date, so September content edits are invisible as freshness signals
   *Proposed fix (repo):* Add an optional `updatedISO?: string` to the BlogPost type in lib/blogPosts.ts and emit it in app/blog/[slug]/page.tsx:359 as `dateModified: post.updatedISO ?? post.publishedISO` (keeping the existing fallback so untouched posts are unaffected). Then set `updatedISO: "2026-09-04"` on the posts actua

21. **[medium] entity-citability** — Wikidata and Google Business Profile URLs are silently dropped from the live schema.org sameAs by the CMS-first social array
   *Proposed fix (repo):* In app/layout.tsx, stop treating the CMS five as the whole of sameAs. Union them with the non-social identity URLs the seed owns, e.g.: const identityUrls = DATA.social.filter(s => s.url.includes("wikidata.org") || s.url.includes("maps.app.goo.gl")).map(s => s.url); const sameAs = Array.from(new Set

22. **[medium] entity-citability** — The sponsoring trust appears as two unlinked schema nodes and BIPE declares no parentOrganization, weakening the only structural defence against BITE conflation
   *Proposed fix (repo):* Give the trust one identity and state the relationship structurally, without naming the sibling institution anywhere public. In app/layout.tsx:107-110 change the founder node to carry the same @id the chairman page already uses — founder: { "@type": "Organization", "@id": `${SITE_URL}#purwanchal-tru

23. **[low] llms-txt** — Two build-time asserts the header claims are weaker than described: branch links bypass page(), and coverage is one-directional
   *Proposed fix (repo):* app/llms.txt/route.ts:485-487 — add the reverse assert: `const orphaned = [...usedPaths].filter((p) => !sitemapPaths.has(p)); if (orphaned.length) throw ...`. That single line closes both gaps at once, because branch paths are added to usedPaths at :327, so a course page missing from the sitemap wou

24. **[low] admission-cycle** — Nav mega-menu and footer still label the enquiry route "Apply now" / "आवेदन करें" on every page
   *Proposed fix (repo):* Relabel to the site's standing cycle-neutral wording: Nav.tsx:208 title → "Enquire for 2027-28", desc → "Next-session enquiry · callback in 24 hrs"; Nav.tsx:400 label → "Enquire for 2027-28", hi → "2027-28 के लिए पूछताछ"; Footer.tsx:348 item → ["Enquire for 2027-28", "/apply"]; InlineApply.tsx:96 to

25. **[low] admission-cycle** — /jeecup-counselling states "Classes for Session 2026-27 begin 1 August 2026" in the present tense
   *Proposed fix (repo):* app/jeecup-counselling/page.tsx:294 — change to past tense to match the sentence two lines later: "Classes for Session 2026-27 began on 1 August 2026." Consider the same for "The full cycle runs in two phases" → "ran".

26. **[low] placement-figures** — The 1,363 record is attributed to "16 years" / "since 2010" in prose while the register it comes from spans 2016-2026
   *Proposed fix (repo):* Split the two spans in those three sentences: keep "16 years on record" for the institution and attribute the count to the register — catchments.ts:325 → "Sixteen years on campus; 1,363 verified placements documented across 46 recruiters since 2016"; same treatment for blogPosts.ts:295 and :2463. Le

27. **[low] placement-figures** — The paid-ads landing page renders "1,363+ placements" — a plus sign on a figure the site elsewhere calls exact and auditable
   *Proposed fix (repo):* Drop the "+" at app/lp/jeecup/page.tsx:31 so it reads `${formatPlacements(PLACEMENT_STATS.totalPlacements)} placements`. (The "5 diploma branches" chip on the same strip is a branch-closure item, not a placement-figures one.)

28. **[low] placement-figures** — Placement figures in lib/blogPosts.ts and lib/catchments.ts are hand-typed literals, not derived — which is why two of them went stale
   *Proposed fix (repo):* Both modules are plain TS, so convert the affected strings to template literals interpolating `formatPlacements(PLACEMENT_STATS.totalPlacements)`, `PLACEMENT_STATS.totalRecruiters` and `PLACEMENT_STATS.endYear`, starting with the ~22 sentences that carry a bare count. Cheaper interim: extend the exi

29. **[low] structured-data** — Each branch page emits two competing Course entities for the same programme, with different descriptions and separate Offers
   *Proposed fix (repo):* On branch routes, suppress the matching Course node from the layout graph (pass the current branch slug down, or filter the graph in app/courses/[branch]/page.tsx) so the page carries exactly one Course entity for its own programme; or give both nodes the same `@id` so JSON-LD merges them into one e

30. **[low] structured-data** — BreadcrumbList root item is split between "https://bipevns.org/" (56 pages) and "https://bipevns.org" (23 pages), and the homepage canonical is the no-slash form
   *Proposed fix (repo):* Normalise inside lib/seo.ts breadcrumbJsonLd(): when `item.path === "/"` return `base` rather than `${base}/`, matching SITE_URL and the homepage canonical. Then convert the three hand-rolled breadcrumb arrays to call the helper so there is one code path.

31. **[low] structured-data** — The Organization JSON-LD hardcodes "four branches" in prose while department[] and the Course nodes beside it are generated from the CMS branch list — no drift guard, unlike llms.txt
   *Proposed fix (repo):* Generate the branch clause from the same array the department/Course nodes use — e.g. build "BTEUP-affiliated diploma engineering in ${numberWord(branches.length)} branches: ${branches.map(b => b.name).join(', ')}" inside buildOrgJsonLd — or, if the prose must stay hand-written, add the llms.txt-sty

32. **[low] crawlability** — robots.txt explicit AI-crawler allowlist omits CCBot, Meta-ExternalAgent, Diffbot and Timpibot
   *Proposed fix (repo):* Add "CCBot", "Meta-ExternalAgent", "Meta-ExternalFetcher", "Diffbot", "Timpibot" (and optionally "cohere-ai", "YouBot") to the `aiAndSearchBots` array in app/robots.ts:14. They inherit the same Allow / Disallow set automatically via the map at :96.

33. **[low] crawlability** — /campus/phoolpur and every standalone blog post omit the x-default hreflang that all other indexable routes emit
   *Proposed fix (repo):* app/campus/phoolpur/page.tsx:41 → `languages: { "en-IN": PATH, "x-default": PATH }`. app/blog/[slug]/page.tsx:32 → also set `languages["x-default"] = path` for the no-sibling case, so a standalone post declares a complete set. Do not add hi-IN to English-only routes — the lib/seo.ts:73-79 reasoning 

34. **[low] crawlability** — /llms.txt is not discoverable — no robots.txt reference and no link from any page
   *Proposed fix (repo):* Emit a `<link rel="alternate" type="text/plain" href="https://bipevns.org/llms.txt" title="llms.txt">` in app/layout.tsx's head, and/or add a `# LLM-readable summary: https://bipevns.org/llms.txt` comment line beside the Sitemap directive in app/robots.ts (Next.js MetadataRoute.Robots has no comment

35. **[low] crawlability** — Trailing-slash URLs serve HTTP 200 instead of redirecting, duplicating every page at a second URL
   *Proposed fix (repo):* Keep skipTrailingSlashRedirect for the API surface, but add an explicit redirect in next.config.ts's `redirects()` that 308s `/:path((?!api/).*)/ ` to `/:path` — i.e. restore trailing-slash normalisation for content routes only, leaving /api/* untouched. Low priority: the canonical tags already carr

36. **[low] entity-citability** — Principal's Person node fails to bind to the organisation entity, unlike the Director's
   *Proposed fix (repo):* In app/principal/page.tsx replace the inline worksFor object with `worksFor: { "@id": `${SITE_URL}#org` }`, matching app/director/page.tsx. While there, add the top-level `@id`, `name`, `url` and `description` to the Director page's ProfilePage wrapper so all three leadership pages emit the same sha

---

## Already done today — do not redo

- Draft PR #2 closed. Its Hindi hostel-fee fix landed on `main` as `8567f7b`; its footer email pin was superseded by PR #3's `getContact()` seed overlay and deliberately not applied.
- Alumni-introduction WhatsApp flow repaired end to end (`a96c750`): both legs were dark since May. Visitor ack now rides `bipe_alumni_intro_received_v1` (6 slots), admin alert rides `bipe_alumni_intro_admin_v1` (5 slots), both APPROVED · UTILITY on the BIPE WABA 917310077788. `DOUBLETICK_ADMIN_NUMBER=919415202879` set in Vercel production.
- Meta-lead admin WhatsApp ping retired (`e738730`) — it pushed 4 placeholders into a 2-slot template and never delivered; the Sampark CRM alerts consultants itself.
- Footer "Alumni" link moved from About & Campus to Academics, beside Placements (`8275a2a`).
- The 3 Sep WhatsApp handover is **closed with no change needed**: the live ack template `bipe_enquiry_response_v2` is cycle-neutral (no session year, no fee, no branch), so the admission-cycle changes required no template edit. That handover's premise — that the ack was `bipe_enquiry_response` and that the DoubleTick API returns 403 — was wrong on both counts. See the memory file `project_bipe_enquiry_ack_path.md`.

## Still open, not audit findings

- **Live test of the alumni introduction form** — owner action. Submit a request at `/alumni` with a reachable phone; two WhatsApps should arrive. Nothing else proves the templates deliver.
- **RR Parkon drive dating** — owner decision. Five placement records are labelled May 2026 but their photos are dated March 2025. Totals are unaffected and nothing is double-counted; it only moves those records between year buckets in the `/alumni` filter.
- **Leftover worktree** `.claude/worktrees/fact-audit` sits several commits behind `main`. Clean, but stale.
- **The 72-finding site-wide contradiction audit** recovered from the 2 Sep session that hit its usage limit. Two findings were confirmed before it died; the rest were never verified and none were applied. Raw file: `sitewide-fact-audit-findings.md` (delivered to the owner 3 Sep).

## Suggested order of work

1. **Findings 1 and 2 first.** They are three lines plus one sentence and remove most of the wrong branch-count signal from the domain.
2. **Findings 3, 4, 8** — the cycle-tense corrections. A model currently tells students BIPE will hold a seat for them.
3. **Findings 5, 6, 7** — the number contradictions.
4. **Ask the owner about the statutory pages** (the refuted finding).
5. **The CMS items** — the stale `/events` JEECUP 2026 row and the dormant `home/stats` / `home/why-bipe` Dairy copy. These need admin access; route them to whoever holds it.
6. **Off-site** — directory corrections and the PDF `noindex` header.

Verify each fix on the live site after deploying, not just in the repo — see HARD RULE 8.

---

*Raw audit data, if you want the full agent output rather than this summary:*
`~/.claude/projects/-Users-praveenrai-BIPE-WEBSITE-SSS/41b26e3e-2307-439d-94a3-6f3672806325/subagents/workflows/wf_5549da8e-d9b/journal.jsonl` — one JSON line per agent with its complete return value.
