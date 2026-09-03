# BIPE Google Business Profile — Setup & Operations Playbook

**For:** the BIPE operator / admissions team / digital-marketing lead.

**Goal:** earn the right-side Knowledge Panel + map pack entry that
BITE already has (see the screenshot evidence from 29 May 2026:
4.3 stars · 257 reviews · 1,920 enrolment · Founded 2003 · full
hours/phone/address card on the SERP).

**Why this matters more than another title rewrite:**

For brand and local queries — "BIPE Varanasi", "polytechnic in
Phoolpur", "polytechnic college near Varanasi" — the **Knowledge
Panel is roughly half of Google's first-screen real estate**. It's
what triggers Call buttons, Directions taps, and Save-to-Maps
actions. None of those count as website clicks in GSC — they convert
directly. Today BIPE's panel is partial or missing because the
Google Business Profile (GBP) hasn't been claimed / verified /
populated.

The site-side work is done. The remaining ~30% of the institutional
SERP win is an operational task in the GBP dashboard, not the
codebase.

---

## Schema.org side — what BIPE already emits (audit complete)

The `Organization` JSON-LD in `app/layout.tsx` (lines 44-256) emits
a comprehensive multi-typed schema. As of 29 May 2026 it carries:

| Property | Status |
|---|---|
| `@type` (multi-typed) | ✅ CollegeOrUniversity + LocalBusiness + EducationalOrganization |
| `name` + `alternateName` | ✅ Full + 3 aliases including "BIPE" |
| `description` | ✅ Includes "private", "AICTE", "BTEUP" — disambiguates from government polytechnic |
| `url` / `logo` / `image` | ✅ logo as ImageObject (600×600), image as campus hero (1600×900) — both Knowledge-Panel-ready |
| `foundingDate` / `founder` | ✅ 2010 / Purwanchal Educational Trust |
| `address` (PostalAddress) | ✅ Full Gajokhar Phoolpur 221206 |
| `geo` (GeoCoordinates) | ✅ Sub-metre precision (25.53217, 82.84376) |
| `hasMap` | ✅ Google Maps query URL |
| `telephone` + `email` | ✅ Live numbers |
| `contactPoint` | ✅ Explicit Admissions desk with availableLanguage |
| `openingHoursSpecification` | ✅ Mon-Sat 9-5 |
| `priceRange` | ✅ ₹30,150 / academic year |
| `numberOfStudents` | ✅ 550 enrolled · 2,200 alumni · 1,331 placements |
| `hasCredential` | ✅ AICTE + BTEUP + AISHE |
| `accreditedBy` | ✅ BTEUP + AICTE |
| `identifier` | ✅ AICTE Permanent ID + JEECUP + BTEUP + AISHE + Wikidata Q139892164 |
| `department` | ✅ Per-branch nodes |
| `sameAs` | ✅ Social URLs from backend → DATA.social fallback |
| `aggregateRating` | ⚠️ Conditional — present only when reviews.json populated |
| `SearchAction` (sitelinks searchbox) | ✅ Already shipped (Task #50) |

**Bottom line: schema isn't the blocker.** Google has everything it
needs to build a Knowledge Panel — it just needs a verified GBP to
trust the data + start the panel.

---

## Step 1 — Claim or create the GBP (15 minutes)

1. Go to **[business.google.com](https://business.google.com)** and sign in
   with the BIPE Google account (recommend: a shared
   admissions@bipe.ac.in mailbox so access doesn't depend on one person).

2. **Search for BIPE Varanasi first.** Google may already have an
   unclaimed Business Profile created from public data. If you see:

   - **"This business is already claimed"** → click the listing →
     "Request access" → another step in this guide.
   - **No matching listing** → click "Add your business to Google" →
     enter "Banaras Institute of Polytechnic & Engineering".
   - **Listing exists but unclaimed** → click "Manage this listing"
     → "Claim".

3. Choose **business category** → "College" (primary). Add secondary
   categories during step 3 below.

4. **Verification.** Google will offer one of:

   - **Postcard by post** (most common for educational institutions):
     they mail a PIN to the Phoolpur address. 7-14 days.
   - **Video verification:** record a short walk-around showing the
     campus sign, address signboard, classroom, and the inside of the
     office. Reviewed by Google staff. 2-7 days.
   - **Phone / email** (rare for institutions).

   Video verification is faster — pick this if available.

5. Once verified, the Knowledge Panel slot becomes editable. It can
   still take 2-4 weeks for the panel to appear on SERPs after
   verification, while Google's Knowledge Graph cross-references the
   GBP against the website schema (which BIPE has — that's why the
   schema audit above matters).

---

## Step 2 — Populate every field (45 minutes one-time + ongoing)

The fields below mirror what BITE has populated in its GBP. Google
ranks completeness as a Knowledge Panel quality signal — half-filled
profiles get smaller panels than fully filled ones.

### Identity

| Field | Value |
|---|---|
| **Business name** | Banaras Institute of Polytechnic & Engineering |
| **Category** | College (primary) |
| **Additional categories** | Polytechnic College · Educational Institution · Engineering School |
| **Description** | (250 chars) "AICTE-approved private polytechnic in Varanasi since 2010. Five BTEUP diploma branches incl. rare Dairy Engineering. JEECUP code 4455. 1,331 TPO-verified placements. AFRC tuition ₹30,150/year." |

### Location

| Field | Value |
|---|---|
| **Address** | Banaras Institute of Polytechnic & Engineering, Village Gajokhar, Post Parsara, Phoolpur, Varanasi 221206, Uttar Pradesh, India |
| **Service area** | Eastern Uttar Pradesh + Bihar (optional — leave off if you want the local-pack to stay tight around Varanasi) |
| **Pin on map** | 25.53216622968947, 82.84376279985777 (same as schema `geo`) |

### Hours

| Day | Hours |
|---|---|
| Monday – Saturday | 9:00 AM – 5:00 PM |
| Sunday | Closed |
| Special hours | Mark holidays (Holi, Independence Day, etc.) as Closed in advance — Google reads "Special hours" as a freshness signal |

### Contact

| Field | Value |
|---|---|
| **Phone** | +91-9415202879 (the call line, per `lib/data.ts`) |
| **Additional phone** | +91-7310077788 (WhatsApp — but label as "Secondary" so panel users tap call on the primary) |
| **Website** | https://www.bipevns.org |
| **Email** | info@bipe.ac.in (will not display in panel but feeds the "Send Message" action when enabled) |

### Photos (the biggest single CTR lever)

GBP rewards photo richness more than any other content. Aim for
**40-60 photos** spread across these categories:

| Category | Count target | Notes |
|---|---|---|
| Logo | 1 | The `public/bipe-logo.svg` mark, converted to 250×250 PNG |
| Cover photo | 1 | Hero campus photo (1080×608, same crop as `public/hero-campus.jpg`) |
| Exterior | 8-12 | Campus gate, main building, signboard, side views, parking |
| Interior | 12-15 | Classroom, lab benches, library, computer lab, hostel rooms, mess |
| At work | 8-10 | Faculty teaching, students in labs, workshop sessions, sports |
| Team | 5-8 | Principal, HoDs, TPO, lab staff (one photo per face) |
| Events | unlimited | Industrial visits, drives, tech talks — keep adding |

**Naming:** add an alt-text/title to each photo when uploading.
`BIPE-CSE-Programming-Lab.jpg` is better than `IMG_2839.jpg`.

**Cadence:** upload 2-3 fresh photos per month to keep the "Updated"
signal active. Stagnant photo sets get downranked in Maps.

### Posts

GBP Posts are 100-1500 char updates that appear in the Knowledge
Panel for ~7 days. Use them for:

- **Admissions cycle** — every JEECUP milestone (registration open,
  exam window, result, counselling rounds). One post per milestone.
- **Events** — major drives, open houses, results
- **Offers** — early-bird application, Class 10 topper scholarship

Cadence: ~1 post / week during admission cycle (April-August),
1 post / fortnight off-season.

### Services / Programs

Add each diploma branch as a "Service":

1. Diploma in Civil Engineering (BTEUP 322)
2. Diploma in Computer Science & Engineering (BTEUP 355)
3. Diploma in Electrical Engineering (BTEUP 328)
4. Diploma in Mechanical Engineering (Production) (BTEUP 343)
5. Diploma in Dairy Engineering (BTEUP 327)

For each: 1-2 sentence description, mention "BTEUP-affiliated · JEECUP
code 4455 · AFRC ₹30,150/year".

### Attributes

Tick the relevant attributes:

- ✅ Accessibility — "Wheelchair accessible entrance" (if true)
- ✅ Crowd — "Family-friendly"
- ✅ Service options — "On-site services"
- ✅ Planning — "Appointment required" (campus visits)

### Q&A

GBP shows a Questions & Answers section in the panel. Seed it with
5-7 common questions answered by you (the verified owner):

1. **"Is BIPE Varanasi a government or private polytechnic?"** →
   "BIPE is a privately funded, AICTE-approved polytechnic
   established in 2010. It's affiliated with BTEUP (the UP state
   board) so the diploma is identical to government polytechnic
   diplomas — same code 4455, same syllabus. Fee is AFRC-approved
   at ₹30,150/year."

2. **"What JEECUP rank gets admission?"** → "BIPE accepts all
   JEECUP-qualified candidates against available seats. There's no
   single rank cutoff — branches fill in priority order during the
   5 counselling rounds. Apply on [bipevns.org/apply](https://bipevns.org/apply)
   for branch-specific guidance."

3. **"Is the hostel available?"** → "Yes — on-campus boys' hostel
   with mess, 24×7 water, Wi-Fi, study halls, resident warden, 24×7
   security. Walk-through bookings at [bipevns.org/hostel](https://bipevns.org/hostel)."

4. **"What documents are needed for admission?"** → "10th + 12th
   marksheets, JEECUP rank card, Aadhaar, caste/income/EWS
   certificates (if applicable), passport photos, transfer + character
   certificates. Full list at [bipevns.org/documents](https://bipevns.org/documents)."

5. **"Where can I see the placement record?"** → "1,331 TPO-verified
   placements between 2016 and 2025 at Mahindra, Tata Steel, BEL,
   Indian Railways, UPPCL and 44 recruiters total. Named directory
   at [bipevns.org/alumni](https://bipevns.org/alumni)."

Adding owner-answered Q&A pre-empts random user-submitted questions
(which often go unanswered for months and look stale).

---

## Step 3 — Reviews (the rating star is the single biggest CTR lift)

BITE has 4.3 stars on 257 reviews. That gold-star rating in the
SERP lifts CTR 30-50% **on its own** (more than any title rewrite).

### How to ethically get reviews

You can't pay for reviews. You CAN:

1. **Ask every current student and parent at scheduled touchpoints:**
   - End of orientation week (Year 1)
   - End of placement-call follow-up (Year 3)
   - Mid-year parent-teacher meetings

2. **Print short-code stickers at the admissions office:** GBP gives
   you a short URL for direct review submission
   (typically `https://g.page/r/...`). Print 100 small QR-code stickers
   pointing at it; place near the office desk, reception, mess wall.

3. **Add a one-line ask in the WhatsApp confirmation message** that
   fires post-form-submit (the Double Tick template — see
   `lib/doubleTick.ts`). Append "If we've helped, a Google review at
   [short URL] takes 30 seconds." once the visitor has actually
   converted (not for inbound enquiries).

4. **Always respond** — every review, positive or negative, gets a
   reply from the verified owner. Response rate is a ranking signal.
   Aim for response within 48 hours.

### Reasonable timeline

| Milestone | Target |
|---|---|
| First 10 reviews | Month 1 (ask the current Year 3 cohort + their parents) |
| 25 reviews + 4.0+ avg | Month 3 |
| 50 reviews + 4.2+ avg | Month 6 (rating star appears reliably in SERP from here) |
| 100 reviews | Year 1 |
| Match BITE's 257 reviews | Year 2-3 |

Don't fake-spike. Google's review-spam detection downranks
properties that get 20+ reviews in a 48-hour window without a
plausible cause. Steady 1-2 / week is the right rhythm.

---

## Step 4 — Connect GBP to the website

After verification, two cross-links matter:

1. **GBP → website** — make sure the GBP's "Website" field is
   exactly `https://www.bipevns.org` (with the www, matching the
   canonical in `lib/routes.ts:36`). A mismatch makes the Knowledge
   Panel link to a different URL than the SERP click does, which
   confuses Google's confidence.

2. **Website → GBP** — already happens via the schema (the `sameAs`
   array in `app/layout.tsx` pulls from `DATA.social`). When BITE's
   GBP becomes verified, copy the GBP URL into `DATA.social` so the
   schema can reference it.

   To add the GBP URL after verification:
   ```typescript
   // lib/data.ts → DATA.social → add an entry
   { name: "Google", url: "https://g.page/r/..." },
   ```

---

## Step 5 — Operating cadence (long-term)

Treat GBP like a social channel, not a one-time setup:

| Frequency | Action |
|---|---|
| Weekly during admission cycle (Apr-Aug) | One GBP Post — admission milestone, event, scholarship deadline |
| Fortnightly off-season | One GBP Post — placement story, faculty publication, blog post |
| Weekly | Reply to every new review within 48 hours |
| Monthly | Upload 2-3 fresh photos (event, lab work, class moment) |
| Monthly | Check Q&A for new user-submitted questions; answer / pin |
| Quarterly | Audit hours, phone, address for accuracy. Update if changed |
| Annually | Review the description for currency (placement count, recruiter list) |

---

## Common pitfalls (and how to avoid them)

1. **Verification PIN goes missing.** The postcard takes 7-14 days
   and sometimes never arrives. Ask Google for video verification
   instead — much faster.

2. **Address mismatch.** GBP, schema, and the footer must show the
   identical address string. Even "Phoolpur" vs "Phulpur" is enough
   to confuse Google's Knowledge Graph. Current canonical in
   `lib/data.ts → DATA.contact.address`: "Gajokhar, Phoolpur,
   Varanasi 221206, UP" — match exactly in GBP.

3. **Multiple GBP listings for the same business.** Happens when
   someone creates a duplicate. Search Google Maps for "BIPE
   Varanasi" before claiming — if 2+ entries appear, request a
   merge through GBP support.

4. **Wrong primary category.** "College" is the right primary.
   "Educational institution" as primary makes the Knowledge Panel
   weaker because it's too generic. Add "Educational institution"
   as a secondary.

5. **Photo quality.** Selfies and over-filtered photos look amateur
   and hurt trust. Hire a local photographer for one solid 4-hour
   campus shoot — costs ~₹5,000-10,000 and the photo library lasts
   2-3 years.

6. **Suspended listing.** Google sometimes auto-suspends GBP
   listings if their algorithm flags any inconsistency (multiple
   phone numbers, address format mismatch, fake review signal).
   Don't panic — Google offers a reinstatement form. Ship a
   detailed appeal with proof of operations.

---

## Expected timeline + CTR lift

| Stage | Timing | Effect |
|---|---|---|
| GBP claimed + verified | Today + 2 weeks | Panel slot becomes editable |
| Profile populated (steps 2-3) | + 1 hour of work | Google starts building Knowledge Panel |
| Knowledge Panel appears on SERP | + 2-4 weeks post-verification | Brand-query CTR doubles roughly overnight |
| First 25 reviews + 4.0 avg | + 3 months | Gold-star rating starts displaying in panel |
| GBP-driven calls + Maps clicks | Continuous from week 3 | These don't show in GSC — track in GBP Insights tab |

The Insights tab inside GBP itself shows: search impressions,
direction requests, phone calls (split by hour-of-day), website
clicks, and photo views — independent of GSC.

---

## Cross-reference

- BITE evidence screenshot (29 May 2026): SERP for "banaras
  institute of teacher's education" shows full Knowledge Panel
  with 4.3 stars × 257 reviews, photos, address, hours, phone,
  founded year, total enrolment. Exactly the target state for BIPE.
- Site schema audit covered in `app/layout.tsx:44-256`.
- Sister doc: `BITE_SEO_FIXES.md` — what to forward to the BITE
  operator.

For questions: the schema half is already shipped — see
commit history for the Organization JSON-LD evolution. The GBP
half is operational and lives in `business.google.com`, not in
this repo.
