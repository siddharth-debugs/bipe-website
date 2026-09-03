/**
 * Eastern UP catchment pages — programmatic SEO landing pages.
 *
 * Each entry below renders a dedicated /polytechnic-in-[town] route
 * targeting families in that town searching for "polytechnic in
 * [town]" / "diploma engineering [town]" / "best polytechnic near
 * [town]" — a keyword cluster BIPE currently doesn't own.
 *
 * Inspired by BITE's /colleges-in-[town] template (which captures
 * roughly the same intent for their teacher-education cohort).
 * For BIPE, the angle is sharper because:
 *
 *   (1) Polytechnic-bound families search by town-of-origin more
 *       than by program — they want to know "is there a good
 *       option near me" before they explore branches.
 *
 *   (2) Hostel availability is the binding constraint for any
 *       student from outside Varanasi. BIPE's on-campus boys'
 *       hostel is the differentiator that converts these searchers
 *       (most Tier-2 town families won't send their child to a
 *       day-scholar institute requiring a daily 2-3 hour commute).
 *
 *   (3) The Eastern UP catchment (Mirzapur, Jaunpur, Ghazipur,
 *       Azamgarh, Mau, Bhadohi, Chandauli) collectively contributes
 *       70%+ of BIPE's annual intake. These towns have either weak
 *       local polytechnic ecosystems or only government-polytechnic
 *       options at scale.
 *
 * Each catchment page renders ~1,500-2,000 words via the shared
 * CatchmentTemplate component reading this data. FAQPage JSON-LD
 * is auto-emitted for each page's FAQ block.
 *
 * Maintenance: distance / transit / station-name data is verified
 * against public timetables (Indian Railways + UP State RoadTransport)
 * as of May 2026. Refresh annually before each admission cycle.
 */

export interface Catchment {
  /** URL slug — used in /polytechnic-in-[slug] */
  slug: string;
  /** Display name of the town */
  town: string;
  /** Town name in Devanagari for Hindi-medium hero / eyebrow */
  townHindi: string;
  /** Hindi pronunciation hint shown in the hero subline */
  state: string;
  /** Straight-line distance from BIPE Phoolpur in kilometres */
  distanceKm: number;
  /** Typical road journey time */
  roadTime: string;
  /** Typical rail journey time (one-way to Varanasi region) */
  railTime: string;
  /** Nearest major railway station */
  nearestStation: string;
  /** Highway code(s) connecting the town to Phoolpur */
  highways: string;
  /** One-sentence economic profile of the town */
  econProfile: string;
  /** 3-4 reasons BIPE specifically suits this town's students */
  whyBipeReasons: { headline: string; body: string }[];
  /** Branch-relevance angle (which BTEUP branch maps to local industry) */
  branchAngle: string;
  /** Local polytechnic landscape (general — don't name specific institutes) */
  localContext: string;
  /** From-town transit narrative — how to actually get there day 1 */
  transitNarrative: string;
  /** FAQ specific to this town */
  faqs: { q: string; a: string }[];
  /** Town-relevant alumni note (general, no fabricated names) */
  alumniNote: string;
  /**
   * Local government / aided polytechnic option, for the "where does
   * the government route fit" subsection on each catchment page.
   * Captures "government polytechnic [town]" search intent honestly —
   * we name the local government institute where one exists, surface
   * its real constraints (branch count, seat capacity), and frame the
   * comparison with BIPE without disparagement.
   */
  governmentOption: {
    /** Primary local government polytechnic name, or "nearest at X" */
    primary: string;
    /** 2-3 sentence factual description with public data */
    description: string;
    /** When the government route is genuinely the right choice here */
    whenGovernment: string;
    /** When BIPE is the better fit despite the fee gap */
    whenBipe: string;
  };
}

/* eslint-disable max-len */

export const CATCHMENTS: Catchment[] = [
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "mirzapur",
    town: "Mirzapur",
    townHindi: "मिर्ज़ापुर",
    state: "Uttar Pradesh",
    distanceKm: 75,
    roadTime: "~1 hour 45 minutes via NH-19 / NH-7",
    railTime: "~1 hour to Varanasi Cantt; multiple daily passengers + expresses",
    nearestStation: "Mirzapur Junction (MZP)",
    highways: "NH-19 (Varanasi–Mirzapur) and NH-7 connecting to the wider trunk network",
    econProfile:
      "Industrial-belt town anchored by carpet weaving, brassware, sandstone mining and dairy farming. Families balance traditional industry with the next-generation pull toward technical / engineering careers.",
    whyBipeReasons: [
      {
        headline: "Dairy Engineering is rare — and Mirzapur is in a dairy belt",
        body: "Mirzapur and its surrounding blocks have hundreds of small and mid-scale dairy units. BIPE's Dairy Engineering diploma is one of only four BTE UP–affiliated Dairy programmes in the entire state. For a Mirzapur family with even partial dairy income, the placement pipeline (Amul, Mother Dairy, NDDB, regional dairy cooperatives) directly translates the diploma into a livelihood near home.",
      },
      {
        headline: "Mechanical (Production) for the brassware + carpet machinery industry",
        body: "Mirzapur's carpet and brassware industries run on imported and locally adapted machinery. Mechanical (Production) graduates who understand both factory-floor production lines and CAD/CAM are well placed for jobs in cluster-development projects across the Vindhya region.",
      },
      {
        headline: "Hostel access for a 2-hour commute that nobody should make daily",
        body: "Mirzapur is 75 km from Phoolpur. Daily commute is technically possible but exhausting and unsafe over six semesters. BIPE's on-campus boys' hostel makes the diploma actually viable — your child sleeps, studies and eats on campus, and travels home on weekends.",
      },
      {
        headline: "AFRC ₹30,150 tuition — published, no capitation",
        body: "BIPE's tuition is AFRC-approved and capped. No 'development fund', no donation, no capitation. Compare this with the unwritten asks that occasionally surface at less transparent institutes — Mirzapur families have heard the stories.",
      },
    ],
    branchAngle:
      "Civil Engineering for the Vindhya stone and infrastructure pipeline; Electrical for UPPCL recruitment; Mechanical (Production) for industrial Mirzapur; Computer Science for the IT / state-government cadre route; Dairy for the local dairy belt.",
    localContext:
      "Mirzapur has government polytechnic seats and a handful of private options at varying levels of approval. Verify any local institute's current AICTE EoA letter and AFRC fee structure before deciding. The five branches and on-campus hostel at BIPE Phoolpur are the differentiators most local options can't match in one place.",
    transitNarrative:
      "From Mirzapur, take a state-roadways bus to Varanasi Cantt (₹120-140, 1.5 hours), then a shared autorickshaw or app-cab to Phoolpur (~35 minutes via NH-19, roughly ₹300-500). Trains from Mirzapur Junction reach Varanasi Cantt in under an hour — multiple options every day. Confirm your visit on WhatsApp and BIPE shares the campus pin and easiest route from Cantt.",
    faqs: [
      {
        q: "How far is BIPE from Mirzapur, and is daily commute realistic?",
        a: "BIPE's Phoolpur campus is 75 km from Mirzapur — about an hour and 45 minutes by road, or one hour by train + auto. Daily commute is technically possible but not sustainable across a 3-year diploma. Almost every Mirzapur student takes a hostel seat. Verify hostel availability during application — out-of-Varanasi candidates are accommodated first.",
      },
      {
        q: "Are BIPE's diploma certificates the same as government polytechnic in Mirzapur?",
        a: "Yes. BIPE and Government Polytechnic Mirzapur are both affiliated to BTE UP. The diploma certificate is identical — same paper, same authority, same legal weight for SSC JE / RRB JE / UPPCL eligibility. The difference lies in cohort size, mentor accessibility, placement infrastructure and branch portfolio (BIPE offers Dairy Engineering, which most government polytechnics don't).",
      },
      {
        q: "What about UP Government scholarships for Mirzapur students?",
        a: "Full UP Post-Matric Scholarship is available to eligible SC / ST / OBC / Minority / EWS candidates regardless of home district. We help with the Samaj Kalyan portal application during admission. For many Mirzapur families, this brings net out-of-pocket close to the government polytechnic figure.",
      },
      {
        q: "Does BIPE have placement support for Mirzapur students specifically?",
        a: "Placement support is institution-wide — BIPE's placement cell runs branch-wise drives that any final-year student attends. Several BIPE alumni from the Mirzapur belt now work at Mahindra, Tata Steel, Ola Electric and the Indian Railways. The named alumni list is published on /alumni.",
      },
    ],
    alumniNote:
      "BIPE alumni from across the Mirzapur belt have moved into Mahindra, Tata Steel, Indian Railways (RRB JE), UPPCL and dairy-sector recruiters since 2014. The full named year-wise placement record is on /alumni.",
    governmentOption: {
      primary: "Government Polytechnic Mirzapur",
      description:
        "Mirzapur has its own BTE UP–affiliated government polytechnic, established under the UP technical-education department. Like all UP government polytechnics, admission is JEECUP-merit based; the per-branch capacity is limited and rank cutoffs vary year to year. Fees in the typical government range of ₹11,870-35,610 per year (verify the current BTE UP gazette).",
      whenGovernment:
        "If your JEECUP rank confidently secures a Government Polytechnic Mirzapur seat, the fee gap (~₹15,000-25,000/year vs BIPE) is meaningful for any household. Day-scholar commute within Mirzapur city is feasible, removing hostel costs entirely. For cost-binding families, this is the right path.",
      whenBipe:
        "BIPE wins when: (a) your JEECUP rank doesn't safely secure a government seat in the branch you want; (b) you specifically want Dairy Engineering (not commonly offered at government polytechnics in this belt); (c) you're from outer Mirzapur tehsils and would need a hostel anyway; (d) you want documented placement infrastructure (1,331 named alumni). Honest comparison framework on /private-vs-government-polytechnic.",
    },
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "jaunpur",
    town: "Jaunpur",
    townHindi: "जौनपुर",
    state: "Uttar Pradesh",
    distanceKm: 55,
    roadTime: "~1 hour 30 minutes via NH-19",
    railTime: "~45 minutes to Varanasi Cantt; frequent passengers + expresses",
    nearestStation: "Jaunpur Junction (JNU)",
    highways: "NH-19 directly linking Jaunpur to Varanasi and onward to Phoolpur",
    econProfile:
      "Historic district anchored by agriculture, tobacco processing, perfume distillation and dairy. The 14th-century Sharqi heritage gives Jaunpur an unusual mix of traditional cottage industry with strong demand for next-generation technical education.",
    whyBipeReasons: [
      {
        headline: "The closest 5-branch private polytechnic to Jaunpur",
        body: "At 55 km, BIPE Phoolpur is the nearest BTE UP–affiliated private polytechnic with all five engineering branches (Civil, CSE, Electrical, Mechanical, Dairy) under one roof. For a Jaunpur student who wants choice — or who's still deciding between branches — BIPE is the natural option.",
      },
      {
        headline: "Hostel = the difference between doable and impossible",
        body: "Jaunpur is close enough (55 km) that some families consider day-scholar. We strongly recommend against it across a 3-year diploma — six semesters of 2-hour daily commute crushes academic performance. The on-campus hostel + mess + warden makes the difference between a passing diploma and a strong one.",
      },
      {
        headline: "Dairy + agriculture overlap — Jaunpur farms feed the dairy economy",
        body: "Many Jaunpur households have small dairy income alongside agriculture. BIPE's Dairy Engineering diploma (one of only four BTE UP Dairy programmes in the state) translates this background into a career — Amul, Mother Dairy, Parag and NDDB are the kind of employer the qualification opens up, and the mandatory six-month Semester-6 training puts students inside a working plant.",
      },
      {
        headline: "JEECUP 4455 — single code, all 5 branches",
        body: "When you fill the JEECUP choice-filling form, BIPE's institute code is 4455 — list all five branch preferences under this single code. Most Jaunpur students who lose a BIPE seat lose it to single-choice filling, not rank. Fill all 5.",
      },
    ],
    branchAngle:
      "Civil for Jaunpur PWD and the Smart Cities corridor; Electrical for UPPCL substations across the Purvanchal grid; Mechanical (Production) for industrial work in the broader region; CSE for state IT cadres and private placements; Dairy for the agriculture-overlap households.",
    localContext:
      "Jaunpur has Government Polytechnic Jaunpur and a few smaller private options. The local government polytechnic is well respected, and for cost-binding families it remains a strong choice. BIPE's differentiators are placement intensity, on-campus hostel, smaller cohort and the Dairy Engineering moat — see /private-vs-government-polytechnic for the honest comparison.",
    transitNarrative:
      "From Jaunpur, the easiest route is the express train to Varanasi Cantt — 45 minutes, multiple departures throughout the day. Shared cabs and state-roadways buses run continuously on NH-19. From Varanasi Cantt to Phoolpur is a 35-45 minute ride by shared auto or app-cab, roughly ₹300-500. Book a visit and we'll send the campus pin to your driver.",
    faqs: [
      {
        q: "How does BIPE compare with Government Polytechnic Jaunpur?",
        a: "Both are BTE UP-affiliated — the diploma certificate is identical. Government Polytechnic Jaunpur has a lower fee (~₹6,000-18,000/year vs BIPE's AFRC ₹30,150). BIPE's edge: documented 1,331 placements, on-campus hostel for students from outside Jaunpur city, the Dairy Engineering branch, smaller cohort with named faculty mentors. See /private-vs-government-polytechnic for the honest framework.",
      },
      {
        q: "Can a Jaunpur student get BIPE admission via JEECUP?",
        a: "Yes — BIPE participates fully in JEECUP counselling under institute code 4455. List BIPE among your top preferences during choice-filling. JEECUP rank cutoffs vary by branch and category; the published 2025-26 cutoffs are on /jeecup-counselling.",
      },
      {
        q: "Is the BIPE hostel safe for a student from outside Varanasi?",
        a: "Yes. The boys' hostel is on the Phoolpur campus, with a resident warden, 24×7 security, on-campus mess, and a parent hotline that rings the warden's desk directly. Visits during the day are open to families. We arrange a hostel walk-through during every campus visit.",
      },
      {
        q: "What scholarships apply for Jaunpur students at BIPE?",
        a: "UP Post-Matric Scholarship reimburses tuition in full for SC / ST candidates and in part for OBC / Minority / EWS candidates — applied via the Samaj Kalyan portal at admission time. We assist with the application. Several Jaunpur students at BIPE have net out-of-pocket fees in the ₹6,000-12,000/year range after the scholarship clears.",
      },
    ],
    alumniNote:
      "Multiple BIPE alumni from across Jaunpur tehsils have placed at Mahindra, Tata Steel, JCB, Indian Railways, UPPCL and Amul over the 2014-2025 cohorts. Named list on /alumni.",
    governmentOption: {
      primary: "Government Polytechnic Jaunpur (founded 1984)",
      description:
        "Government Polytechnic Jaunpur is one of Eastern UP's longer-established BTE UP–affiliated government institutes. Per recent JEECUP cycles, normal-entry rank cutoffs in popular branches close around 16,000 with ~200+ marks needed in the general category. Fees are in the standard UP government polytechnic range (₹11,870-35,610/year).",
      whenGovernment:
        "Government Polytechnic Jaunpur has a 40-year track record and a local alumni network. If your JEECUP rank lands you a seat in the branch you want, and your family is in Jaunpur city (no hostel needed), this is a respected, low-fee option.",
      whenBipe:
        "BIPE wins when: (a) your rank doesn't safely secure your branch at GP Jaunpur; (b) you want Dairy Engineering (BIPE has it, government polytechnics in this district typically don't); (c) you're from outer Jaunpur tehsils and need hostel; (d) you want denser placement-cell infrastructure. See /private-vs-government-polytechnic for the honest framework.",
    },
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "ghazipur",
    town: "Ghazipur",
    townHindi: "ग़ाज़ीपुर",
    state: "Uttar Pradesh",
    distanceKm: 80,
    roadTime: "~2 hours via NH-29 / NH-19",
    railTime: "~1 hour 30 minutes to Varanasi Cantt; multiple daily trains",
    nearestStation: "Ghazipur City (GCT)",
    highways: "NH-29 (Ghazipur–Varanasi) connecting to NH-19 onward to Phoolpur",
    econProfile:
      "Ganga-riverside district with the government opium factory, dairy farming, fisheries and agro-processing. ICAR-affiliated agricultural research presence and one of Eastern UP's largest cattle markets. A natural fit for any technical or dairy-related diploma.",
    whyBipeReasons: [
      {
        headline: "Dairy Engineering = direct industry pipeline from Ghazipur",
        body: "Ghazipur sits on one of the densest small-and-mid-scale dairy clusters in Eastern UP. BIPE's Dairy Engineering programme — one of just four BTE UP Dairy diplomas in the state — feeds directly into Amul / Mother Dairy / Parag / NDDB / regional dairy cooperatives. The branch pays back the tuition gap multiple times over for a Ghazipur dairy-household student.",
      },
      {
        headline: "Civil + Mechanical for the government engineering pipeline",
        body: "Ghazipur has a long tradition of central-government job aspirants — Indian Railways (RRB JE), SSC JE, Indian Army Technical Entry. BIPE's Civil and Mechanical (Production) branches map directly onto these JE-cadre exams. The career-counselling cell coaches students from Semester 5 onward for these exams.",
      },
      {
        headline: "Hostel: 2-hour commute is not sustainable",
        body: "Ghazipur is 80 km from Phoolpur. Daily commute is not realistic — students who try lose 4-5 hours daily to travel. The on-campus boys' hostel with mess and warden is the only sustainable option for a Ghazipur family.",
      },
      {
        headline: "Transparent AFRC tuition — no hidden capitation",
        body: "BIPE's AFRC-approved tuition of ₹30,150/year is published on /fees with no donation, no development fund, no capitation. Receipts for every payment. Hostel + mess billed separately and disclosed line by line.",
      },
    ],
    branchAngle:
      "Dairy Engineering for Ghazipur's dairy-belt households; Civil for state PWD + Bharatmala / National Highway projects; Electrical for UPPCL JE; Mechanical (Production) for Indian Railways and SSC JE; CSE for the central-government IT cadre route.",
    localContext:
      "Ghazipur has Government Polytechnic Ghazipur and a small private polytechnic ecosystem. For cost-binding families with a Ghazipur-domicile candidate scoring high enough in JEECUP for a government seat, that path remains the right choice. BIPE serves the Ghazipur families who want denser placement infrastructure, smaller cohorts, on-campus hostel, or specifically the Dairy Engineering branch.",
    transitNarrative:
      "Trains from Ghazipur City to Varanasi Cantt run frequently and take 90 minutes. State-roadways buses on NH-29 take roughly 2 hours. From Varanasi Cantt to Phoolpur, a shared auto or app-cab covers the final 14 km in 35-45 minutes for roughly ₹300-500. Book a campus visit and we'll arrange the Cantt-to-Phoolpur leg.",
    faqs: [
      {
        q: "How long is the journey from Ghazipur to BIPE?",
        a: "Train + auto: ~2 hours 15 minutes total (90 min train + 35 min Cantt-to-Phoolpur). Direct road: ~2 hours via NH-29 and NH-19. Daily commute is not viable across a 3-year diploma — hostel is essential.",
      },
      {
        q: "Does BIPE offer Dairy Engineering recruitment opportunities specifically for Ghazipur students?",
        a: "Recruitment is institution-wide, not town-specific. But BIPE's Dairy Engineering placement pipeline (Amul, Mother Dairy, Parag, NDDB, regional cooperatives) is particularly relevant for Ghazipur students because of the dense local dairy economy — many BIPE Dairy alumni return to Ghazipur to anchor or expand family operations.",
      },
      {
        q: "What documents does a Ghazipur applicant need?",
        a: "10th and 12th marksheets, JEECUP 2026 rank card, Aadhaar, caste/income certificate (for scholarship), passport photos, transfer and character certificates. Domicile: not required for BIPE admission. Detailed checklist on /documents.",
      },
      {
        q: "Can a Ghazipur student get the UP Government scholarship at BIPE?",
        a: "Yes. UP Post-Matric Scholarship is portable across UP for eligible SC / ST / OBC / Minority / EWS candidates. Applied via Samaj Kalyan portal at admission — BIPE's office assists. Net tuition for eligible students typically falls to ₹6,000-12,000/year.",
      },
    ],
    alumniNote:
      "BIPE alumni from Ghazipur have placed at Mahindra, Indian Railways (multiple cadres), UPPCL, Amul and Mother Dairy across the 2015-2025 cohorts. Named list on /alumni.",
    governmentOption: {
      primary: "Government Polytechnic Ghazipur",
      description:
        "Ghazipur has a BTE UP–affiliated government polytechnic serving the district. Per-branch capacity is rank-limited via JEECUP counselling. Fees follow the standard UP government polytechnic structure (~₹11,870-35,610/year). The institute does not commonly offer Dairy Engineering — a branch Ghazipur's dairy economy specifically benefits from.",
      whenGovernment:
        "If your rank secures Government Polytechnic Ghazipur for Civil, Electrical, or Mechanical Engineering and you live in Ghazipur city or nearby blocks (no hostel need), the lower fee makes government the right choice.",
      whenBipe:
        "BIPE wins for Ghazipur students when: (a) you want Dairy Engineering — the natural fit for the Ghazipur dairy belt, available at BIPE and not at government polytechnics here; (b) you need a hostel (80 km is too far for day-scholar); (c) your rank doesn't safely secure your preferred branch at the local government polytechnic. See /private-vs-government-polytechnic.",
    },
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "azamgarh",
    town: "Azamgarh",
    townHindi: "आज़मगढ़",
    state: "Uttar Pradesh",
    distanceKm: 120,
    roadTime: "~3 hours via NH-233",
    railTime: "~2 hours 30 minutes to Varanasi via Mau line",
    nearestStation: "Azamgarh (AMH)",
    highways: "NH-233 from Azamgarh through Mau, joining NH-19 to Phoolpur",
    econProfile:
      "Large district with strong silk-weaving tradition (Mubarakpur), textile clusters, agriculture and a long history of vocational education aspiration. One of the largest Eastern UP catchments for technical diploma admissions.",
    whyBipeReasons: [
      {
        headline: "Azamgarh's distance makes hostel non-negotiable — BIPE has one on-campus",
        body: "120 km is too far to commute. Azamgarh students who choose BIPE all stay in the on-campus hostel. Furnished rooms, mess, 24×7 security, resident warden — and the parent hotline rings the warden directly. For a 3-year diploma far from home, the residential environment is more important than the institute name.",
      },
      {
        headline: "Five branches with cross-industry placements",
        body: "Azamgarh students often arrive at the diploma decision still weighing options — Civil for government infrastructure work, Mechanical for production industry, Dairy for agriculture-overlap families, Electrical for UPPCL, CSE for IT cadres. BIPE offers all five under one institute code (JEECUP 4455).",
      },
      {
        headline: "1,331 placement record — concrete pipeline, not promises",
        body: "Over 16 years, BIPE has documented 1,331 verified placements across 44 recruiters — Mahindra, Tata Steel, BEL, Indian Railways, Amul, Mother Dairy, UPPCL, Ola Electric, Ather. Year-wise named list with recruiters is public on /alumni. No vague 'placement record' framing — actual names.",
      },
      {
        headline: "AFRC ₹30,150 — flexibility for distant catchments",
        body: "The published tuition is ₹30,150/year. For SC / ST / OBC / Minority / EWS Azamgarh students, the UP Post-Matric Scholarship covers most or all of this — net out-of-pocket is often in the ₹4,000-12,000/year range. Hostel and mess are billed separately and discussed openly during admission.",
      },
    ],
    branchAngle:
      "Mechanical (Production) for Azamgarh's textile + handloom machinery base; Civil for state-government engineering and infrastructure cadres; Electrical for UPPCL JE; CSE for government IT cadre exams; Dairy for the agricultural-household segment.",
    localContext:
      "Azamgarh has Government Polytechnic Azamgarh and a handful of private polytechnic options. Government seats are limited and admission is rank-dependent through JEECUP. Many Azamgarh students who can't secure a government seat or who specifically want the Dairy Engineering branch turn to BIPE Phoolpur. For families with cost as the primary constraint, government remains the right choice — see /private-vs-government-polytechnic for the framework.",
    transitNarrative:
      "Trains from Azamgarh to Varanasi via Mau Junction take 2.5 hours. State-roadways buses on NH-233 take 3 hours. The Cantt-to-Phoolpur final leg is 14 km — shared auto, taxi or app-cab, roughly ₹300-500. Door-to-door, a Saturday visit from Azamgarh and back is 8-9 hours including the campus tour. Plan for an overnight stay or split the trip across two days.",
    faqs: [
      {
        q: "Azamgarh to BIPE is 3 hours by road — is this manageable for a 3-year diploma?",
        a: "Only via hostel residence — daily commute is not realistic. Almost all Azamgarh students at BIPE stay in the on-campus hostel during the academic week and travel home on weekends or during holidays. The institute has students from 12 Eastern UP districts plus Bihar — the residential community is meaningful.",
      },
      {
        q: "How does BIPE compare with Government Polytechnic Azamgarh?",
        a: "Both BTE UP–affiliated, identical diploma certificate. Government Polytechnic Azamgarh has lower fees and is a strong choice for cost-binding families with high enough JEECUP rank. BIPE's differentiators: documented placement record (1,331), on-campus boys' hostel (critical at 120 km), Dairy Engineering branch (rare), smaller per-branch cohort. Detailed comparison on /private-vs-government-polytechnic.",
      },
      {
        q: "What about the Mubarakpur textile-cluster industry — does BIPE prepare for that?",
        a: "Mechanical (Production) is the most aligned branch — covers production-floor systems, machine maintenance, basic CAD/CAM. For textile-machinery-specific work, the broader skill set transfers; many BIPE Mechanical graduates work in factory settings across the textile, automotive and consumer-goods belts of UP and beyond.",
      },
      {
        q: "How do I reach the campus from Azamgarh on a visit day?",
        a: "Take a train or bus to Varanasi Cantt (2.5-3 hours), then an auto or app-cab for the final 14 km to Phoolpur — roughly 35 minutes and ₹300-500. WhatsApp +91-7310077788 before you travel and the team will share the campus pin and help you arrange the last leg.",
      },
    ],
    alumniNote:
      "BIPE alumni from across Azamgarh have placed at Mahindra, Tata Steel, JBM Group, Indian Railways, UPPCL, Motherson Sumi and Amul. Year-wise list on /alumni.",
    governmentOption: {
      primary: "Government Polytechnic Azamgarh",
      description:
        "Azamgarh has a BTE UP-affiliated government polytechnic serving the district's large population. Admission is rank-competitive through JEECUP — Azamgarh has one of Eastern UP's larger applicant pools, so cutoffs in popular branches can run sharp. Government fee structure (₹11,870-35,610/year).",
      whenGovernment:
        "Government Polytechnic Azamgarh is a sensible choice if your rank confidently secures the branch you want, you live in Azamgarh city (day-scholar feasible), and the fee gap matters. With a strong rank and city residency, this is the obvious option.",
      whenBipe:
        "BIPE wins for Azamgarh families when: (a) hostel is non-negotiable (most outer-district students need it); (b) your rank is comfortable but not safe for the branch you want at the government polytechnic; (c) you want Dairy Engineering or the full 5-branch portfolio; (d) you value documented placement-cell support across all 5 branches. /private-vs-government-polytechnic has the framework.",
    },
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "mau",
    town: "Mau",
    townHindi: "मऊ",
    state: "Uttar Pradesh",
    distanceKm: 95,
    roadTime: "~2 hours 30 minutes via NH-29 / NH-19",
    railTime: "~1 hour 45 minutes to Varanasi Cantt via Mau Junction",
    nearestStation: "Mau Junction (MAU)",
    highways: "NH-29 from Mau via Ghazipur, joining NH-19 to Phoolpur",
    econProfile:
      "Compact district with strong handloom and powerloom traditions — Mau saris and the broader Banarasi-style weaving cluster. Lower median household income with high demand for vocational and technical education as the upward path.",
    whyBipeReasons: [
      {
        headline: "Branch portfolio that fits Mau's economic pull",
        body: "Mau students aim for stable income — either government JE jobs or industry placements. BIPE's branch mix (Civil, Electrical, Mechanical, CSE, Dairy) covers every major SSC JE / RRB JE / UPPCL pipeline. The placement cell coaches Semester 5-6 students for these exams alongside on-campus drives.",
      },
      {
        headline: "Scholarship coverage often offsets the tuition gap with government polytechnic",
        body: "UP Post-Matric Scholarship reimburses tuition in full for eligible SC/ST candidates and in part for OBC/Minority/EWS candidates. For many Mau households, post-scholarship out-of-pocket fees fall to ₹4,000-10,000/year — close to or below government polytechnic figures. We assist with the Samaj Kalyan portal application at admission.",
      },
      {
        headline: "Hostel access — essential at 95 km",
        body: "Mau is 95 km from Phoolpur. Day-scholar attempt would consume 4+ hours daily. The on-campus boys' hostel makes the diploma viable — furnished rooms, mess, 24×7 security. Hostel charges are billed separately and disclosed in writing before payment.",
      },
      {
        headline: "Mechanical (Production) maps directly onto Mau's powerloom industry",
        body: "Mau's powerloom cluster runs on machinery that needs trained technicians for upkeep, calibration and improvement. Mechanical (Production) graduates from BIPE can return to support the local cluster — or apply the same skills to the broader industrial belt across Eastern UP.",
      },
    ],
    branchAngle:
      "Mechanical (Production) for the powerloom + textile cluster; Electrical for UPPCL JE; Civil for state PWD and infrastructure work; CSE for central-government IT cadre exams; Dairy for the agriculture-overlap segment.",
    localContext:
      "Mau has limited local polytechnic infrastructure — most technical-education aspirants travel to nearby districts (Azamgarh, Varanasi, Ballia, Ghazipur). BIPE Phoolpur is among the closest 5-branch private polytechnic options with full hostel residence. Government Polytechnic seats in the broader region are available but rank-competitive.",
    transitNarrative:
      "Mau Junction has frequent trains to Varanasi Cantt — 1.5 to 2 hours depending on the service. Road via NH-29 through Ghazipur takes ~2.5 hours. From Varanasi Cantt to Phoolpur is the standard 14-km leg by shared auto or app-cab (~35 min, roughly ₹300-500). WhatsApp the admission office before a visit and we'll share the campus pin and the easiest route from Cantt.",
    faqs: [
      {
        q: "Mau is a smaller district — does BIPE have students from here?",
        a: "Yes. BIPE's intake spans 12 Eastern UP districts including Mau. Smaller catchments often produce some of the most determined students because the diploma represents a real economic step. The hostel community has students from across the catchment — it's not a Varanasi-only environment.",
      },
      {
        q: "Will UP Post-Matric Scholarship really cover the tuition?",
        a: "For eligible SC / ST candidates the scholarship covers BIPE's AFRC-approved tuition in full; OBC / Minority / EWS candidates receive partial reimbursement. Hostel and mess remain payable separately. Apply via the Samaj Kalyan portal during admission — BIPE's office walks every applicant through the process.",
      },
      {
        q: "Does BIPE recognise the Mau textile-cluster background?",
        a: "Many Mau students at BIPE come from textile-cluster households. The diploma doesn't formally weight industry background, but the Mechanical (Production) curriculum directly applies to powerloom machinery and factory floors. Several alumni have used their BIPE training to upgrade family operations.",
      },
      {
        q: "Can I visit BIPE from Mau without an overnight stay?",
        a: "A Saturday day-trip from Mau is feasible — train at 7-8 AM, arrive Varanasi Cantt by 9-10 AM, auto or app-cab to Phoolpur, 2-3 hours on campus, return train by 4-5 PM. WhatsApp +91-7310077788 to coordinate.",
      },
    ],
    alumniNote:
      "BIPE alumni from Mau have placed at Mahindra, Indian Railways, UPPCL, Asian Paints and JBM Group across multiple cohorts. Year-wise list on /alumni.",
    governmentOption: {
      primary: "Nearest government polytechnic at Azamgarh / Government Polytechnic Mau (if active)",
      description:
        "Mau's local government polytechnic capacity is limited compared to larger neighbouring districts. Many Mau-based JEECUP applicants list Government Polytechnic Azamgarh or Ghazipur as a fallback if the local seat doesn't materialise. Verify the current Mau government polytechnic listing on the BTE UP portal each admission cycle.",
      whenGovernment:
        "If your rank secures a government seat at Azamgarh or in Mau itself (where available), the lower fee structure is a real advantage — particularly when combined with the UP Post-Matric Scholarship (for family income <₹2 lakh), which can effectively reduce net cost to near-zero.",
      whenBipe:
        "BIPE wins for Mau students when: (a) the nearest government polytechnic option is in Azamgarh (~3 hours, hostel-required) — at that point you may as well hostel at BIPE with 5 branches available; (b) you want Dairy Engineering or the full branch portfolio; (c) you specifically want the 1,331 alumni placement track record. UP Post-Matric Scholarship is portable — BIPE assists with the application.",
    },
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "bhadohi",
    town: "Bhadohi",
    townHindi: "भदोही",
    state: "Uttar Pradesh",
    distanceKm: 50,
    roadTime: "~1 hour 15 minutes via NH-19",
    railTime: "~50 minutes to Varanasi Cantt; multiple daily trains",
    nearestStation: "Bhadohi (BOY)",
    highways: "NH-19 directly to Varanasi, onward to Phoolpur",
    econProfile:
      "World-renowned for hand-knotted carpet exports — the Bhadohi carpet belt is one of India's largest. Strong export-economy households with growing demand for technical education that complements rather than replaces the traditional artisan economy.",
    whyBipeReasons: [
      {
        headline: "Closest option — BIPE is 50 km from Bhadohi",
        body: "Bhadohi is among BIPE's nearest catchment districts. NH-19 runs to Varanasi, and NH-56 carries you onward to Phoolpur. Daily commute is still not advised across a 3-year diploma (the morning + evening loop is 2.5 hours total), but it's at the lower end of the catchment range. Hostel residence is the right choice for most.",
      },
      {
        headline: "Mechanical (Production) maps onto carpet-machinery and export-industry needs",
        body: "Bhadohi's carpet industry is increasingly machinery-augmented even where the final knotting remains hand-done. Production-floor systems, quality-control measurement, machine maintenance — Mechanical (Production) graduates fit into the industry and the broader Eastern UP industrial belt.",
      },
      {
        headline: "Dairy Engineering for the agricultural-overlap segment",
        body: "Bhadohi has significant rural-block dairy activity outside the carpet-export centre. BIPE's Dairy Engineering programme — one of only four BTE UP-affiliated Dairy diplomas — channels these households into Amul / Mother Dairy / Parag / NDDB and regional cooperatives.",
      },
      {
        headline: "AFRC ₹30,150 with no hidden charges — fits the export-economy budget",
        body: "Carpet-export households often have variable annual income tied to season cycles and export orders. BIPE's AFRC-approved tuition is fixed, capped, published on /fees, with no donation or capitation. Payment can be discussed honestly during admission counselling.",
      },
    ],
    branchAngle:
      "Mechanical (Production) for the carpet-machinery and industrial belt; Civil for infrastructure and state PWD; Electrical for UPPCL substations; CSE for central-government IT cadre routes; Dairy for the agriculture-overlap households.",
    localContext:
      "Bhadohi has a relatively thin local polytechnic ecosystem — most technical-education aspirants from Bhadohi travel either to BIPE Phoolpur (50 km) or to government polytechnics in nearby districts. The proximity makes BIPE a natural option for Bhadohi families wanting denser placement infrastructure and an on-campus residential environment.",
    transitNarrative:
      "Trains from Bhadohi to Varanasi Cantt run frequently — under an hour. State-roadways buses on NH-19 take 1 hour 15 minutes. From Cantt to Phoolpur is the standard 14-km final leg. For weekend home-visits during the academic semester, Bhadohi's proximity is a real advantage over more distant catchments.",
    faqs: [
      {
        q: "Bhadohi is only 50 km away — can a student commute daily instead of staying in hostel?",
        a: "Technically yes; in practice not advisable. Daily commute is ~2.5 hours total — workable in semester 1, but the cumulative fatigue across six semesters hurts academic performance. Most Bhadohi students at BIPE stay in the on-campus hostel during the academic week and travel home on weekends.",
      },
      {
        q: "Does BIPE work with the Bhadohi carpet-export industry?",
        a: "BIPE is an academic institution, not an industry partnership. But Mechanical (Production) graduates with the right skill set find work in the broader industrial belt — including, in some cases, the machinery-augmented portions of the carpet-export industry. Several alumni have built careers serving the regional export economy.",
      },
      {
        q: "How does BIPE compare with government polytechnic options accessible from Bhadohi?",
        a: "The closest government polytechnic options for Bhadohi students are in nearby districts. Both routes lead to BTE UP-affiliated diplomas — identical certificate. BIPE's edge: documented 1,331 placements, on-campus hostel, smaller cohorts, Dairy Engineering. Government route's edge: lower fee. Honest comparison framework on /private-vs-government-polytechnic.",
      },
      {
        q: "Will the UP Post-Matric Scholarship apply for Bhadohi students at BIPE?",
        a: "Yes — the scholarship is portable across UP for eligible SC/ST/OBC/Minority/EWS candidates. BIPE's office assists with the Samaj Kalyan portal application during admission. Net out-of-pocket tuition for eligible students typically falls below government polytechnic figures after scholarship clears.",
      },
    ],
    alumniNote:
      "BIPE alumni from Bhadohi have placed at Mahindra, Tata Steel, Indian Railways, UPPCL and Motherson Sumi across recent cohorts. Named list on /alumni.",
    governmentOption: {
      primary: "Nearest government polytechnic at Varanasi / Bhadohi-area listing on BTE UP portal",
      description:
        "Bhadohi's local government polytechnic landscape is thin. Government Polytechnic Kuru Pindra in Varanasi (60 seats, 2 branches: Electrical + Textile) is the nearest major government polytechnic — but its tiny capacity and limited branch portfolio rule it out for most Bhadohi applicants. Verify current Bhadohi-district BTE UP listings each admission cycle.",
      whenGovernment:
        "Government Polytechnic Kuru Pindra in Varanasi might fit Bhadohi students who specifically want Electrical Engineering and have a strong-enough rank for one of its 60 seats. Otherwise, the closest realistic government polytechnic is further from Bhadohi than BIPE.",
      whenBipe:
        "BIPE wins for Bhadohi students because: (a) BIPE is 50 km, comparable or closer than realistic government polytechnic options for branches beyond Electrical / Textile; (b) BIPE offers 5 branches vs Kuru Pindra's 2; (c) Mechanical (Production) maps directly onto the carpet-machinery and export-industry skill base of Bhadohi; (d) Dairy Engineering for agriculture-overlap households. /private-vs-government-polytechnic has the wider framework.",
    },
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "chandauli",
    town: "Chandauli",
    townHindi: "चंदौली",
    state: "Uttar Pradesh",
    distanceKm: 40,
    roadTime: "~1 hour 15 minutes via NH-7",
    railTime: "~30 minutes to Varanasi Cantt via DDU Junction",
    nearestStation: "Pandit Deen Dayal Upadhyaya Junction (DDU, formerly Mughalsarai)",
    highways: "NH-7 (Varanasi-Mughalsarai-Sasaram) and onward NH-19 to Phoolpur",
    econProfile:
      "Rice-belt district anchored by Pandit Deen Dayal Upadhyaya Junction — one of India's largest railway hubs, providing thousands of local jobs and an embedded culture of government-job aspiration. Strong agricultural base, growing industrial activity around the railway corridor. Borders Bihar via Buxar.",
    whyBipeReasons: [
      {
        headline: "BIPE's closest Eastern UP neighbour — just 40 km away",
        body: "Chandauli is adjacent to Varanasi district. BIPE Phoolpur is the nearest 5-branch private polytechnic — closer than the major government polytechnics outside Chandauli. The 40 km commute via NH-7 (or 30 min train ride to Cantt) makes it geographically practical, but hostel remains the smart choice across a 3-year diploma.",
      },
      {
        headline: "Mechanical + Electrical map onto the Indian Railways recruitment pipeline",
        body: "DDU Junction is one of India's busiest railway hubs and Chandauli families have a long tradition of targeting Indian Railways (RRB JE), Railway Protection Force, and railway-electrification cadres. BIPE's Mechanical (Production) and Electrical branches are the natural diploma paths into these careers. Career-counselling cell coaches RRB JE and SSC JE prep from Semester 5.",
      },
      {
        headline: "Hostel for the outer Chandauli blocks (Naugarh, Sakaldiha, Chakia)",
        body: "Chandauli city is close, but the district's outer blocks (Naugarh hills, Sakaldiha, Chakia) are 1-2 hours from Phoolpur even by road. BIPE's on-campus boys' hostel makes the diploma feasible for students from these blocks who otherwise can't realistically attend.",
      },
      {
        headline: "AFRC ₹30,150 + UP Post-Matric Scholarship eligibility",
        body: "AFRC-approved tuition is fixed at ₹30,150/year. The UP Post-Matric Scholarship reimburses tuition in full for eligible SC / ST candidates and in part for OBC / Minority / EWS candidates (income < ₹2 lakh) — BIPE's office assists with the Samaj Kalyan portal application. Net out-of-pocket for eligible Chandauli students often falls to ₹6,000-12,000/year.",
      },
    ],
    branchAngle:
      "Mechanical (Production) for RRB JE and Indian Railways technical cadres (the natural fit for Chandauli's DDU-anchored career culture); Civil for state PWD and agricultural infrastructure; Electrical for UPPCL and railway electrification; CSE for central-government IT cadre routes; Dairy for the agriculture-overlap households.",
    localContext:
      "Chandauli has Government Polytechnic Chandauli serving the district. The institute is BTE UP-affiliated and follows the standard UP government polytechnic fee structure. For Chandauli students with a strong JEECUP rank who want the standard 3-4 engineering branches and live in the city, the government route is the right choice. BIPE serves the broader Chandauli district — particularly outer-block students who need hostel access, and any student wanting the Dairy Engineering branch (not commonly available at the local government polytechnic).",
    transitNarrative:
      "From Chandauli, the DDU railway junction provides frequent passenger trains to Varanasi Cantt in 25-30 minutes. State-roadways buses on NH-7 take 75 minutes. Many Chandauli students at BIPE travel via DDU train + shared auto from Cantt to Phoolpur (45 min). From Cantt to Phoolpur is ~14 km by shared auto or app-cab, roughly ₹300-500 — WhatsApp +91-7310077788 and BIPE will share the campus pin and the easiest route.",
    faqs: [
      {
        q: "How far is Chandauli from BIPE Phoolpur — and is daily commute viable?",
        a: "BIPE Phoolpur is 40 km from Chandauli city (1 hour 15 min by road via NH-7, or ~30 min by train to Varanasi Cantt + auto). Daily commute is technically possible across a 3-year diploma but tiring. For students from Chandauli city centre, day-scholar is feasible; for outer-block students (Naugarh, Sakaldiha), hostel is essential.",
      },
      {
        q: "Does BIPE prepare students for Indian Railways recruitment (RRB JE) given Chandauli's DDU connection?",
        a: "Yes. BIPE's career-counselling cell runs structured RRB JE / SSC JE / UPPCL JE prep from Semester 5 onward. Mechanical and Electrical branches are the most relevant for the railway-cadre exams, but Civil and CSE also have JE pathways. Several BIPE alumni from Chandauli district work at Indian Railways in technical cadres.",
      },
      {
        q: "How does BIPE compare with Government Polytechnic Chandauli?",
        a: "Both BTE UP-affiliated — same diploma certificate. Government Polytechnic Chandauli has lower fees (typical ₹11,870-35,610/year range) and is a good fit if you have a strong rank, want one of the standard engineering branches, and live in Chandauli city. BIPE's edge: 5 branches (including the rare Dairy Engineering), on-campus hostel for outer-block students, smaller cohort with named faculty mentors, documented 1,331 alumni placement record. See /private-vs-government-polytechnic for the framework.",
      },
      {
        q: "Can a Bihar-border Chandauli resident apply easily?",
        a: "Yes. BIPE participates in JEECUP under code 4455 — JEECUP is open to candidates from any state, with Chandauli (UP) residents in the UP-state pool. The Bihar-adjacent geography doesn't affect admission process. We see students from both UP and Bihar at BIPE — the hostel community is genuinely interstate.",
      },
    ],
    alumniNote:
      "BIPE alumni from across Chandauli district have placed at Indian Railways (multiple cadres), Mahindra, Tata Steel, UPPCL and dairy-sector recruiters. Named year-wise list on /alumni.",
    governmentOption: {
      primary: "Government Polytechnic Chandauli",
      description:
        "Chandauli has its own BTE UP-affiliated government polytechnic serving the district. Standard UP government fee structure (~₹11,870-35,610/year). Branches typically include Civil, Electrical, Mechanical (verify current syllabus on BTE UP portal). Dairy Engineering is generally not offered.",
      whenGovernment:
        "If your JEECUP rank confidently secures a Government Polytechnic Chandauli seat in the branch you want and you live in Chandauli city, the government route is the right choice. Day-scholar is feasible and the fee gap (~₹15,000-25,000/year vs BIPE) is meaningful.",
      whenBipe:
        "BIPE wins for Chandauli students when: (a) your rank doesn't safely secure your preferred branch at the local government polytechnic; (b) you specifically want Dairy Engineering; (c) you're from outer Chandauli blocks (Naugarh, Sakaldiha, Chakia) and need hostel; (d) you want documented placement infrastructure with named alumni at Indian Railways and 43 other recruiters. /private-vs-government-polytechnic has the wider framework.",
    },
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "ballia",
    town: "Ballia",
    townHindi: "बलिया",
    state: "Uttar Pradesh",
    distanceKm: 150,
    roadTime: "~3 hours 30 minutes via NH-19 → Ghazipur → NH-29 to Varanasi",
    railTime: "~3 hours to Varanasi Cantt via Ballia–Varanasi line",
    nearestStation: "Ballia Junction (BUI)",
    highways: "NH-19 / NH-31 connecting Ballia to Ghazipur and onward to Varanasi",
    econProfile:
      "Riverside district at the confluence of the Ganga and Ghaghara rivers. Strong agricultural base (rice, sugarcane), traditional handloom weaving. Famed for producing one of India's highest per-capita rates of defence and police recruits — Mangal Pandey's birthplace. Career-conscious families overwhelmingly target government employment.",
    whyBipeReasons: [
      {
        headline: "The diploma path into Ballia's career heritage of government employment",
        body: "Ballia's defining career narrative is government / defence service — Army Technical Entry, RRB JE, SSC JE, UPPCL JE, Indian Navy SSR. A BTE UP diploma is the technical-cadre entry point for all of these. BIPE's career-counselling cell runs structured prep from Semester 5 for the exam cluster Ballia families actually target.",
      },
      {
        headline: "Hostel is non-negotiable at 150 km — and BIPE has one",
        body: "Ballia is 150 km from Phoolpur (3-3.5 hours one-way). Day-scholar is impossible. Any Ballia student at any polytechnic outside Ballia district needs hostel residence — and BIPE's on-campus boys' hostel (furnished rooms, mess, 24×7 security, resident warden) is the practical answer.",
      },
      {
        headline: "5 branches including Dairy — relevant for Ballia's agricultural overlay",
        body: "Ballia is a strong agricultural district with significant dairy and sugarcane activity. BIPE's Dairy Engineering programme — one of only four BTE UP-affiliated Dairy diplomas in the entire state — channels these households into Amul / Mother Dairy / Parag / NDDB recruiters. For families with dairy or agro-processing roots, this is structurally the right branch.",
      },
      {
        headline: "AFRC fee + UP Post-Matric Scholarship → real net affordability",
        body: "AFRC-approved tuition is ₹30,150/year. UP Post-Matric Scholarship (family income < ₹2 lakh) reimburses tuition in full for eligible SC / ST candidates and in part for OBC / Minority / EWS candidates. BIPE's office walks every Ballia applicant through the Samaj Kalyan portal application at admission. Net out-of-pocket for eligible students typically falls to ₹6,000-12,000/year — comparable to government polytechnic figures.",
      },
    ],
    branchAngle:
      "Mechanical (Production) for Army Technical Entry and Indian Railways RRB JE (Ballia's prime career pipeline); Civil for state PWD, Bharatmala / Ganga-bridge projects and infrastructure work; Electrical for UPPCL JE and Indian Railways electrification; CSE for central-government IT cadres; Dairy for the agricultural-overlay households across the Ballia rural belt.",
    localContext:
      "Ballia has Government Polytechnic Ballia and a small private polytechnic ecosystem. The local government polytechnic is the natural first choice for cost-binding families with strong-enough JEECUP rank. Many Ballia students who can't secure their preferred branch locally — or who specifically want Dairy Engineering, or who want a denser placement-cell pipeline — move to BIPE Phoolpur with hostel residence.",
    transitNarrative:
      "Ballia Junction has frequent express trains to Varanasi Cantt — 3 hours typical. State-roadways buses on NH-19 via Ghazipur take 3.5 hours. From Cantt to Phoolpur is the standard 14-km final leg by shared auto or app-cab, roughly ₹300-500. Door-to-door Ballia → BIPE is about 4-4.5 hours. Plan an overnight stay for the first visit; we can help arrange a hostel trial during the visit.",
    faqs: [
      {
        q: "Ballia to BIPE is 3+ hours by train — how often do students travel home?",
        a: "Ballia students at BIPE typically travel home once a month or once every 6 weeks — most stay through the semester and travel during longer holidays. Frequent express trains on the Ballia-Varanasi line make weekend home-visits feasible when needed. The residential community at BIPE has students from 12 Eastern UP districts plus Bihar, so the social environment doesn't depend on weekend travel home.",
      },
      {
        q: "Does BIPE specifically prepare for Army Technical Entry (TES) and other defence exams?",
        a: "BIPE's career-counselling cell runs prep for Army Technical Entry, Navy SSR, Indian Coast Guard Yantrik, and the broader defence-technical exam set. Mechanical and Electrical branches are most aligned. Several BIPE alumni from Ballia and the broader Eastern UP defence-recruitment belt have entered Army TES, Indian Railways and UPPCL after the diploma.",
      },
      {
        q: "How does BIPE compare with Government Polytechnic Ballia?",
        a: "Both BTE UP-affiliated, identical diploma. Government Polytechnic Ballia has lower fees and is a strong choice for cost-binding families with rank. BIPE's edge for Ballia students: hostel access (essential at 150 km), Dairy Engineering branch, smaller cohort with named faculty mentors, documented placement record of 1,331 named alumni. See /private-vs-government-polytechnic for the framework.",
      },
      {
        q: "Will my child be safe in the BIPE hostel at 150 km from home?",
        a: "Yes. The boys' hostel is on the Phoolpur campus, with a resident warden, 24×7 security, on-campus mess, and a parent hotline that rings the warden's desk directly. Visits during the day are open to families. We arrange a hostel walk-through during every campus visit — particularly important for distant catchments where parents want to see the residential environment before committing.",
      },
    ],
    alumniNote:
      "BIPE alumni from across Ballia district have placed at Indian Railways, Mahindra, Tata Steel, UPPCL, Amul and Asian Paints across recent cohorts. Year-wise list on /alumni.",
    governmentOption: {
      primary: "Government Polytechnic Ballia",
      description:
        "Ballia has its own BTE UP-affiliated government polytechnic serving the district. Standard UP government polytechnic fee structure (~₹11,870-35,610/year). Branches typically include Civil, Electrical, Mechanical (verify current syllabus on BTE UP portal). The institute serves Ballia city and surrounding blocks well; Dairy Engineering is generally not offered.",
      whenGovernment:
        "Government Polytechnic Ballia is the right choice if your rank confidently secures the branch you want, you live in Ballia city or nearby blocks (no hostel need), and the fee gap is binding for your family. With a strong rank and city residency, this is the obvious option.",
      whenBipe:
        "BIPE wins for Ballia students when: (a) hostel is essential because of the 150 km distance and you'd need one anywhere outside Ballia city; (b) your rank doesn't safely secure the branch you want at the local government polytechnic; (c) you specifically want Dairy Engineering; (d) you want the documented 1,331 alumni placement record across 44 recruiters. /private-vs-government-polytechnic has the wider framework.",
    },
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "sonbhadra",
    town: "Sonbhadra",
    townHindi: "सोनभद्र",
    state: "Uttar Pradesh",
    distanceKm: 115,
    roadTime: "~3 hours via NH-39 / NH-7 through Mirzapur",
    railTime: "~3 hours to Varanasi via Renukoot-Shaktinagar line",
    nearestStation: "Robertsganj (RBJ) — district HQ",
    highways: "NH-39 (Renukoot–Mirzapur) joining NH-19 to Varanasi and Phoolpur",
    econProfile:
      "Industrial belt district in the Vindhya hills — home to NTPC Singrauli's largest thermal power complex, Hindalco aluminium smelter, Renusagar Power, and significant coal mining. The most heavily industrialised district in Eastern UP. Career aspirations skew strongly toward technical-engineering roles in power, mining, and heavy industry.",
    whyBipeReasons: [
      {
        headline: "Branch portfolio matches Sonbhadra's industrial gravity",
        body: "Sonbhadra's economy is dominated by power generation (NTPC, Renusagar), aluminium (Hindalco), and coal mining. BIPE's Mechanical (Production), Electrical, and Civil branches feed directly into the JE-cadre roles these industries hire from. Sonbhadra students who plan to return home and work at NTPC/Hindalco/Renusagar are exactly the diploma pipeline these companies recruit.",
      },
      {
        headline: "Hostel access is essential at 115 km",
        body: "Sonbhadra is 115 km from Phoolpur — about 3 hours one-way. Daily commute is impossible. The on-campus boys' hostel makes the diploma practical: furnished rooms, mess, 24×7 security, resident warden. Weekend home-visits via the Renukoot-Mirzapur route are workable.",
      },
      {
        headline: "Dairy + Civil for the tribal-belt rural blocks",
        body: "Sonbhadra has significant tribal population (Gond, Kharwar communities) and an agricultural base outside the industrial corridor. BIPE's Dairy Engineering programme — one of only 4 BTE UP-affiliated Dairy diplomas in the state — and Civil branch serve students from these rural blocks who target agriculture-overlap or state-PWD careers.",
      },
      {
        headline: "UP Post-Matric Scholarship coverage is meaningful here",
        body: "Sonbhadra has a high proportion of SC, ST, and EWS households. The UP Post-Matric Scholarship reimburses BIPE's AFRC-approved tuition in full for eligible SC / ST candidates and in part for OBC / Minority / EWS candidates. BIPE's office assists with the Samaj Kalyan portal application. Net out-of-pocket for eligible Sonbhadra students typically falls to ₹4,000-10,000/year — comparable to or below government polytechnic figures.",
      },
    ],
    branchAngle:
      "Electrical Engineering for the NTPC / Renusagar / UPPCL substation pipeline (Sonbhadra's prime career anchor); Mechanical (Production) for Hindalco aluminium plant + Northern Coalfields recruitment; Civil for state PWD and the broader infrastructure work in the Vindhya region; CSE for central-government IT cadre routes; Dairy for the agricultural-overlap rural blocks.",
    localContext:
      "Sonbhadra has Government Polytechnic Sonbhadra (Robertsganj) and a few smaller private options serving the district. Government polytechnic seats are rank-competitive given the strong industrial demand for technical diploma holders. BIPE serves Sonbhadra families who can't secure their preferred branch locally, who specifically want Dairy Engineering, or who want a denser placement-cell pipeline that includes private-industry recruiters alongside the regional government pathway.",
    transitNarrative:
      "From Sonbhadra, the Renukoot-Mirzapur road via NH-39 is the primary route — ~3 hours by bus or private vehicle. Trains via Robertsganj station to Varanasi (3 hours) are an alternative; check the Renukoot-Mirzapur line for direct services. From Varanasi Cantt to Phoolpur, standard 14-km final leg by shared auto or app-cab, roughly ₹300-500. Plan an overnight for the first visit — door-to-door is 4-4.5 hours.",
    faqs: [
      {
        q: "Does BIPE prepare students for jobs at NTPC, Hindalco, and other Sonbhadra industries?",
        a: "BIPE's career-counselling cell runs structured prep for the JE-cadre exams (SSC JE, RRB JE, UPPCL JE) that feed into NTPC's technical workforce + the broader power/mining sector. While BIPE isn't formally tied to any single Sonbhadra industry, the diploma + JE-prep + named-recruiter placement pipeline directly applies. Several BIPE alumni from the Vindhya region work at NTPC, Northern Coalfields, and UPPCL substations.",
      },
      {
        q: "How long is the journey from Sonbhadra to BIPE?",
        a: "Door-to-door is ~4-4.5 hours: 3 hours road or rail to Varanasi Cantt + 35-45 min Cantt-to-Phoolpur leg. Hostel residence is essential; daily commute is not viable. For the first campus visit, plan an overnight stay — we can help arrange a hostel-trial during the visit.",
      },
      {
        q: "How does BIPE compare with Government Polytechnic Sonbhadra?",
        a: "Both BTE UP-affiliated, identical diploma certificate. Government Polytechnic Sonbhadra (Robertsganj) has lower fees and is a strong choice if your rank confidently secures the branch you want. BIPE's edge for Sonbhadra students: 5 branches including Dairy Engineering (not commonly available locally), documented 1,331 placement record, on-campus boys' hostel essential at this distance, named faculty mentors. See /private-vs-government-polytechnic for the framework.",
      },
      {
        q: "Will the UP Post-Matric Scholarship apply for Sonbhadra students at BIPE?",
        a: "Yes — the scholarship is portable across UP for eligible SC / ST / OBC / Minority / EWS candidates regardless of home district. Sonbhadra has a high proportion of SC + ST + EWS households, so scholarship eligibility is particularly relevant. BIPE's office walks every applicant through the Samaj Kalyan portal application during admission.",
      },
    ],
    alumniNote:
      "BIPE alumni from across Sonbhadra district (Robertsganj, Duddhi, Obra, Renukoot blocks) have placed at NTPC, UPPCL, Indian Railways, Mahindra and Asian Paints across recent cohorts. Named year-wise list on /alumni.",
    governmentOption: {
      primary: "Government Polytechnic Sonbhadra (Robertsganj)",
      description:
        "Sonbhadra has its own BTE UP-affiliated government polytechnic at Robertsganj. Standard UP government polytechnic fee structure (~₹11,870-35,610/year). Branches typically include Civil, Electrical, Mechanical (verify current syllabus on BTE UP portal). Given the strong industrial demand in the district, JEECUP cutoffs at this institute can run sharp for popular branches.",
      whenGovernment:
        "Government Polytechnic Sonbhadra is the natural choice if your JEECUP rank confidently secures the branch you want in the industry alignment you target (Electrical for NTPC/UPPCL, Mechanical for Hindalco). Day-scholar from Robertsganj is feasible for students living in the district HQ.",
      whenBipe:
        "BIPE wins for Sonbhadra students when: (a) your rank doesn't safely secure the branch you want at GP Sonbhadra; (b) you want Dairy Engineering for the agricultural-overlap rural blocks; (c) you're from outer Sonbhadra (Duddhi, Naugarh) and need hostel anyway; (d) you want the documented 1,331 alumni placement record that includes private-industry recruiters alongside government employers.",
    },
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "sultanpur",
    town: "Sultanpur",
    townHindi: "सुल्तानपुर",
    state: "Uttar Pradesh",
    distanceKm: 165,
    roadTime: "~4 hours via NH-128 / NH-31 through Pratapgarh",
    railTime: "~3 hours 30 minutes to Varanasi Cantt via Sultanpur-Jaunpur line",
    nearestStation: "Sultanpur Junction (SLN)",
    highways: "NH-128 (Sultanpur–Pratapgarh–Allahabad) and NH-31 connecting to NH-19 corridor",
    econProfile:
      "Awadh-region district anchored by Sultanpur city — administrative + agricultural. The Gomti riverside district has significant agricultural production, growing handloom-textile activity, and a culture of government-job aspiration similar to neighbouring Pratapgarh and Faizabad. Many families target central-government technical cadres via the diploma route.",
    whyBipeReasons: [
      {
        headline: "The Awadh-region diploma pipeline most families overlook",
        body: "Sultanpur is in the Awadh region, geographically closer to Lucknow (160 km north) than to Varanasi. But Lucknow's top government polytechnics (GP Lucknow, GP Kanpur) require 280-300+ JEECUP marks for popular branches — rank-competitive beyond what most Sultanpur applicants achieve. BIPE Phoolpur is a structurally better fit for the wider rank band, with the trade-off of a 165 km distance (hostel-essential, which Sultanpur families typically need anyway given the Lucknow-distance economics).",
      },
      {
        headline: "Hostel is non-negotiable at this distance",
        body: "Sultanpur is 165 km from Phoolpur — about 4 hours one-way. Daily commute is structurally impossible. BIPE's on-campus boys' hostel is the practical answer for any Sultanpur student attending any polytechnic in the Varanasi catchment.",
      },
      {
        headline: "5 branches including the Dairy moat",
        body: "Sultanpur is a strong agricultural district with significant dairy and sugarcane activity. BIPE's Dairy Engineering programme — one of 4 BTE UP-affiliated Dairy diplomas in the entire state — channels these households into Amul / Mother Dairy / Parag / NDDB recruiters. Most Sultanpur-accessible polytechnics don't offer this branch.",
      },
      {
        headline: "AFRC ₹30,150 + scholarship eligibility = real affordability",
        body: "AFRC-approved tuition is ₹30,150/year. UP Post-Matric Scholarship reimburses tuition in full for eligible SC / ST candidates and in part for OBC / Minority / EWS candidates. For most Sultanpur families with mid-income agriculture-based households, net out-of-pocket falls to ₹4,000-10,000/year — comparable to government polytechnic figures.",
      },
    ],
    branchAngle:
      "Civil for state PWD and the Bharatmala corridor through the Awadh region; Mechanical (Production) for Indian Railways RRB JE (the Sultanpur-Faizabad-Lucknow line is a major recruitment corridor); Electrical for UPPCL JE; CSE for central-government IT cadre exams; Dairy for the agricultural-overlap rural households.",
    localContext:
      "Sultanpur has Government Polytechnic Sultanpur and a small private polytechnic ecosystem. The government polytechnic is the natural first choice for cost-binding families with strong-enough JEECUP rank. Many Sultanpur students who don't secure their preferred branch locally either go to the larger Allahabad / Lucknow government polytechnics (more rank-competitive) or to private polytechnics with hostel residence — BIPE Phoolpur is the structural fit for the latter.",
    transitNarrative:
      "Sultanpur Junction has frequent express trains to Varanasi Cantt — 3.5 hours typical. State-roadways buses via Pratapgarh and Jaunpur take ~4 hours. From Cantt to Phoolpur is the standard 14-km final leg by shared auto or app-cab, roughly ₹300-500. Door-to-door Sultanpur to BIPE is about 4.5-5 hours. Plan an overnight stay for the first visit; the BIPE office can help with hostel-trial arrangements.",
    faqs: [
      {
        q: "Sultanpur is closer to Lucknow than Varanasi — why BIPE instead of GP Lucknow?",
        a: "Government Polytechnic Lucknow is one of UP's top-tier polytechnics — JEECUP cutoffs for CSE and Mechanical require 280-300+ marks, putting it out of reach for most Sultanpur applicants without a top-rank score. BIPE's wider rank band makes it accessible. The distance to BIPE (165 km) is comparable to Lucknow (160 km), so the geography isn't a deciding factor — the rank-band fit is.",
      },
      {
        q: "How long is the journey from Sultanpur to BIPE Phoolpur?",
        a: "Door-to-door is ~4.5-5 hours: 3.5 hours train (Sultanpur Junction → Varanasi Cantt) + 35-45 min Cantt-to-Phoolpur leg. Hostel residence is essential. Weekend home-visits during semesters are workable on the Sultanpur-Varanasi rail line.",
      },
      {
        q: "Will UP Post-Matric Scholarship apply across-district for Sultanpur students?",
        a: "Yes — the scholarship is portable across UP for eligible SC / ST / OBC / Minority / EWS candidates regardless of home district. BIPE's office assists every applicant with the Samaj Kalyan portal application at admission. Net tuition after scholarship clear typically falls to ₹4,000-10,000/year for eligible candidates.",
      },
      {
        q: "How does BIPE compare with Government Polytechnic Sultanpur?",
        a: "Both BTE UP-affiliated, identical diploma. Government Polytechnic Sultanpur has lower fees and is a strong choice if you have a confident rank, want a standard engineering branch, and live in or near Sultanpur city. BIPE's edge: 5 branches (incl. rare Dairy Engineering), on-campus hostel for outer-district students, documented 1,331 placement record. See /private-vs-government-polytechnic.",
      },
    ],
    alumniNote:
      "BIPE alumni from across the Sultanpur belt have placed at Mahindra, Indian Railways, UPPCL, Asian Paints and Amul across multiple cohorts. Year-wise named list on /alumni.",
    governmentOption: {
      primary: "Government Polytechnic Sultanpur",
      description:
        "Sultanpur has its own BTE UP-affiliated government polytechnic serving the district. Standard UP government fee structure (~₹11,870-35,610/year). Branches typically include Civil, Electrical, Mechanical (verify current syllabus on BTE UP portal). Dairy Engineering is generally not offered.",
      whenGovernment:
        "Government Polytechnic Sultanpur is the natural choice if your rank secures the branch you want and you live in Sultanpur city or nearby blocks. The lower fee structure + day-scholar option is the cost-binding family's optimal path.",
      whenBipe:
        "BIPE wins for Sultanpur students when: (a) your rank doesn't safely secure the branch you want at the local government polytechnic; (b) you specifically want Dairy Engineering for the agricultural-overlap; (c) you're going to need hostel anywhere outside Sultanpur city anyway — BIPE has it on-campus; (d) you want the documented 1,331 alumni placement record across diverse recruiters.",
    },
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "pratapgarh",
    town: "Pratapgarh",
    townHindi: "प्रतापगढ़",
    state: "Uttar Pradesh",
    distanceKm: 170,
    roadTime: "~4 hours via NH-128 / NH-31 corridor",
    railTime: "~3 hours 30 minutes to Varanasi Cantt via Pratapgarh-Allahabad line",
    nearestStation: "Pratapgarh Junction (PBH)",
    highways: "NH-128 and NH-31 connecting Pratapgarh through Sultanpur or Allahabad to Varanasi",
    econProfile:
      "Awadh-region agricultural district anchored by mango cultivation (Pratapgarh is one of UP's largest mango-producing districts) and a strong sugarcane belt. The district has produced significant numbers of central-government and defence recruits, with diploma-engineering increasingly seen as the technical-cadre entry route alongside competitive exams.",
    whyBipeReasons: [
      {
        headline: "Diploma path into the Awadh-region government-job tradition",
        body: "Pratapgarh's career narrative is heavily weighted toward central-government employment — Indian Railways (RRB JE), SSC JE, UPPCL JE, Indian Army Technical Entry. BIPE's career-counselling cell runs structured prep from Semester 5 onward for the exam cluster Pratapgarh families actually target. Mechanical and Electrical branches are the natural fit; Civil for state PWD work in the wider region.",
      },
      {
        headline: "Hostel is essential at 170 km — and BIPE has one",
        body: "Pratapgarh is 170 km from Phoolpur (4+ hours one-way). Daily commute is structurally impossible. The on-campus boys' hostel makes the diploma viable: furnished rooms, mess, 24×7 security, resident warden, and a parent hotline ringing the warden's desk directly. Out-of-Varanasi candidates are accommodated first.",
      },
      {
        headline: "5 branches with the rare Dairy moat for mango / sugarcane households",
        body: "Pratapgarh's mango and sugarcane belt has significant agro-processing potential, including dairy adjacent to the farms. BIPE's Dairy Engineering — one of just 4 BTE UP-affiliated Dairy diplomas in UP — channels agriculture-overlap households into Amul / Mother Dairy / Parag / NDDB. The branch is structurally rare; most Pratapgarh-accessible polytechnics don't offer it.",
      },
      {
        headline: "AFRC fees + scholarship for the typical Pratapgarh income band",
        body: "AFRC-approved tuition is ₹30,150/year. UP Post-Matric Scholarship reimburses tuition in full for eligible SC / ST candidates and in part for OBC / Minority / EWS candidates. For most Pratapgarh agricultural households, net out-of-pocket falls to ₹4,000-10,000/year — comparable to government polytechnic figures even before factoring in BIPE's wider rank band and 5-branch portfolio.",
      },
    ],
    branchAngle:
      "Mechanical (Production) for Army Technical Entry + RRB JE (Pratapgarh's defence-recruit tradition); Electrical for UPPCL JE; Civil for state PWD and infrastructure work across the Awadh-Allahabad corridor; CSE for central-government IT cadres; Dairy for the agricultural-overlap mango / sugarcane households.",
    localContext:
      "Pratapgarh has Government Polytechnic Pratapgarh and a small private polytechnic ecosystem. For cost-binding families with confident JEECUP rank and Pratapgarh city residency, the government route is the obvious choice. Many Pratapgarh students who can't secure their preferred branch locally — or who specifically want Dairy Engineering — turn to BIPE Phoolpur with hostel residence.",
    transitNarrative:
      "Pratapgarh Junction has frequent express trains to Varanasi Cantt — 3.5 hours typical via Allahabad / Phaphamau routing. State-roadways buses via NH-128 through Sultanpur take ~4 hours. From Cantt to Phoolpur is the standard 14-km final leg. Door-to-door Pratapgarh to BIPE is about 4.5-5 hours. Plan an overnight stay for the first visit.",
    faqs: [
      {
        q: "Pratapgarh is 170 km from BIPE — how viable is the hostel-residence model?",
        a: "Very viable, and structurally necessary at this distance. BIPE's on-campus boys' hostel houses students from 12 Eastern UP districts plus Bihar — Pratapgarh is among the natural catchments. Most Pratapgarh students travel home once a month or once every 6 weeks during semesters; weekend visits via Pratapgarh-Varanasi train are feasible when needed.",
      },
      {
        q: "Does BIPE prepare for Army Technical Entry and Indian Railways recruitment specifically?",
        a: "Yes. BIPE's career-counselling cell runs structured prep for Army Technical Entry (TES), Indian Navy SSR/AA, RRB JE, SSC JE, and UPPCL JE from Semester 5 onward. Mechanical and Electrical branches are most aligned. Several BIPE alumni from the Awadh region (Pratapgarh, Sultanpur, Faizabad) work at Indian Railways and in defence-technical cadres.",
      },
      {
        q: "Will the UP Post-Matric Scholarship apply for Pratapgarh students at BIPE?",
        a: "Yes — the scholarship is portable across UP for eligible SC / ST / OBC / Minority / EWS candidates regardless of home district. BIPE's office walks every applicant through the Samaj Kalyan portal application at admission. Net tuition often falls to ₹4,000-10,000/year for eligible students.",
      },
      {
        q: "How does BIPE compare with Government Polytechnic Pratapgarh?",
        a: "Both BTE UP-affiliated, identical diploma. Government Polytechnic Pratapgarh has lower fees and is a strong choice for cost-binding families with rank. BIPE's edge: 5 branches (incl. Dairy Engineering), on-campus hostel (essential at 170 km), 1,331 documented placements. See /private-vs-government-polytechnic for the framework.",
      },
    ],
    alumniNote:
      "BIPE alumni from across the Pratapgarh belt have placed at Indian Railways, Mahindra, UPPCL, Asian Paints and JBM Group across recent cohorts. Named year-wise list on /alumni.",
    governmentOption: {
      primary: "Government Polytechnic Pratapgarh",
      description:
        "Pratapgarh has its own BTE UP-affiliated government polytechnic serving the district. Standard UP government polytechnic fee structure (~₹11,870-35,610/year). Branches typically include Civil, Electrical, Mechanical (verify current syllabus on BTE UP portal). Dairy Engineering is generally not offered.",
      whenGovernment:
        "Government Polytechnic Pratapgarh is the natural choice if your rank secures the branch you want, you live in or near Pratapgarh city, and the fee gap matters. The lower fee + day-scholar option is the cost-binding family's optimal path.",
      whenBipe:
        "BIPE wins for Pratapgarh students when: (a) hostel is essential at any out-of-district polytechnic (and BIPE has one on-campus); (b) your rank doesn't safely secure the branch you want at the local government polytechnic; (c) you specifically want Dairy Engineering for the mango / sugarcane / agricultural overlay; (d) you want the documented 1,331 alumni placement record across diverse recruiters.",
    },
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "gorakhpur",
    town: "Gorakhpur",
    townHindi: "गोरखपुर",
    state: "Uttar Pradesh",
    distanceKm: 205,
    roadTime: "~5 hours via NH-29 / NH-19 through Azamgarh and Ghazipur",
    railTime: "~4 hours to Varanasi Cantt via Gorakhpur-Varanasi line",
    nearestStation: "Gorakhpur Junction (GKP) — one of India's longest railway platforms",
    highways: "NH-29 (Gorakhpur–Varanasi) connecting through Azamgarh corridor",
    econProfile:
      "Major Eastern UP city anchored by Gorakhnath Temple, AIIMS Gorakhpur, BHU's veterinary campus, and a growing industrial corridor. One of UP's largest urban centres outside Lucknow / Kanpur. Strong educational culture (Madan Mohan Malaviya University of Technology, Deen Dayal Upadhyaya Gorakhpur University) with active student aspirations for technical and government careers.",
    whyBipeReasons: [
      {
        headline: "Wider rank-band access than top-tier Gorakhpur options",
        body: "Gorakhpur has Madan Mohan Malaviya University of Technology (MMMUT) — a state-level institution with sharp cutoffs at the degree level. For diploma engineering, Government Polytechnic Gorakhpur is the city's anchor — popular branches there can run rank-competitive. BIPE's wider rank band at 4455 makes it accessible for Gorakhpur students who don't secure their preferred branch locally.",
      },
      {
        headline: "Dairy Engineering is rare even in Gorakhpur",
        body: "Despite Gorakhpur's strong agricultural and dairy economy (the region is part of UP's larger Purvanchal dairy belt), Dairy Engineering as a BTE UP-affiliated diploma branch is rare — only 4 such programmes in the entire state, and BIPE is one. For Gorakhpur students from dairy-overlap households who want the Amul / Mother Dairy / NDDB / Parag pipeline, BIPE is the natural choice.",
      },
      {
        headline: "Hostel residence is the only viable model at 205 km",
        body: "Gorakhpur is 205 km from Phoolpur — about 5 hours one-way by road, 4 hours by train. Daily commute is not possible. The on-campus boys' hostel houses students from 12 Eastern UP districts; Gorakhpur is well represented. Weekend home-visits via Gorakhpur-Varanasi rail are feasible during longer breaks.",
      },
      {
        headline: "AFRC fees + scholarship coverage offset the distance economics",
        body: "AFRC-approved tuition is ₹30,150/year. UP Post-Matric Scholarship reimburses tuition in full for eligible SC / ST candidates and in part for OBC / Minority / EWS candidates from Gorakhpur — the scholarship is portable across UP. For many Gorakhpur families, the choice between local government polytechnic + BIPE comes down to branch availability and placement-cell strength, not raw fee math after scholarship clears.",
      },
    ],
    branchAngle:
      "Mechanical (Production) for the Indian Railways RRB JE pipeline (Gorakhpur Junction is one of India's largest railway hubs, with the longest platform — the rail recruitment culture runs deep here); Electrical for UPPCL JE and railway electrification; Civil for state PWD and the Bharatmala corridor; CSE for central-government IT cadre routes; Dairy for the Purvanchal dairy belt's agricultural-overlap households.",
    localContext:
      "Gorakhpur has Government Polytechnic Gorakhpur, Madan Mohan Malaviya University of Technology (degree-level) and a substantial private polytechnic ecosystem within the city. For cost-binding Gorakhpur families with strong JEECUP rank, the local government polytechnic is the natural choice. BIPE serves Gorakhpur students who don't secure their preferred branch locally, who specifically want Dairy Engineering, or who want the documented placement-cell pipeline that includes diverse private-industry recruiters alongside the regional government pathway.",
    transitNarrative:
      "Gorakhpur Junction has frequent express trains to Varanasi Cantt — 4 hours typical via the Gorakhpur-Mau-Ghazipur-Varanasi line. State-roadways buses via NH-29 through Azamgarh take ~5 hours. From Varanasi Cantt to Phoolpur, standard 14-km final leg by shared auto or app-cab, roughly ₹300-500. Door-to-door Gorakhpur to BIPE is about 5-5.5 hours. Plan an overnight stay for the first visit; we'll help arrange hostel-trial accommodation.",
    faqs: [
      {
        q: "Gorakhpur has its own established government polytechnic — why consider BIPE?",
        a: "Government Polytechnic Gorakhpur is well-respected and the first choice for cost-binding families with strong rank in the branch they want. BIPE serves Gorakhpur students for whom one or more of these applies: rank not safe for the preferred branch at GP Gorakhpur; specific interest in Dairy Engineering (rare across UP); need for on-campus hostel + a residential community of students from 12 Eastern UP districts; preference for a smaller per-branch cohort with named faculty mentors. See /private-vs-government-polytechnic for the full framework.",
      },
      {
        q: "How does the train journey from Gorakhpur to BIPE work?",
        a: "Gorakhpur Junction has multiple daily express trains to Varanasi Cantt — typical journey 4 hours. From Cantt, a shared auto or app-cab covers the final 14 km to Phoolpur in 35-45 minutes. Total door-to-door 5-5.5 hours. Weekend home-visits during semesters are workable on this corridor.",
      },
      {
        q: "Does BIPE prepare students for Indian Railways recruitment given Gorakhpur's railway-hub culture?",
        a: "Yes. BIPE's career-counselling cell runs structured RRB JE / SSC JE / UPPCL JE prep from Semester 5 onward. Mechanical (Production) and Electrical branches map directly onto Indian Railways technical cadres. Several BIPE alumni from the Gorakhpur catchment work at Indian Railways across multiple zones.",
      },
      {
        q: "Will the UP Post-Matric Scholarship cover BIPE tuition for Gorakhpur students?",
        a: "Yes — the scholarship is portable across UP for eligible SC / ST / OBC / Minority / EWS candidates regardless of home district. BIPE's office assists with the Samaj Kalyan portal application at admission. Net out-of-pocket for eligible Gorakhpur students typically falls to ₹4,000-10,000/year — comparable to or below government polytechnic figures.",
      },
    ],
    alumniNote:
      "BIPE alumni from across the Gorakhpur catchment have placed at Indian Railways, Mahindra, Tata Steel, UPPCL, Mother Dairy and Asian Paints across recent cohorts. Year-wise named list on /alumni.",
    governmentOption: {
      primary: "Government Polytechnic Gorakhpur",
      description:
        "Gorakhpur has a long-established BTE UP-affiliated government polytechnic — one of Eastern UP's larger institutes. Standard government fee structure (~₹11,870-35,610/year). Branches typically include the standard 3-5 engineering offerings. JEECUP cutoffs at GP Gorakhpur run rank-competitive for popular branches given the city's larger applicant pool. Dairy Engineering is generally not offered.",
      whenGovernment:
        "Government Polytechnic Gorakhpur is the natural choice if your rank confidently secures the branch you want and you live in or near Gorakhpur city. Lower fees + day-scholar feasibility + the city's established educational infrastructure make this the obvious option for cost-binding rank-strong applicants.",
      whenBipe:
        "BIPE wins for Gorakhpur students when: (a) your rank doesn't safely secure your preferred branch at the local government polytechnic; (b) you specifically want Dairy Engineering for the Purvanchal dairy-belt households; (c) you want a smaller per-branch cohort with named faculty mentors; (d) you want the documented 1,331 alumni placement record across diverse private-industry + government recruiters. Hostel is essential anywhere outside Gorakhpur city, so the BIPE on-campus hostel option is the natural fit.",
    },
  },
];

/**
 * Lookup helper — returns the Catchment for a given slug, or undefined
 * if no match. Used by app/polytechnic-in-[town]/page.tsx route handlers.
 */
export function catchmentBySlug(slug: string): Catchment | undefined {
  return CATCHMENTS.find((c) => c.slug === slug);
}

/**
 * Returns the other 5 catchments (excluding the current slug) for the
 * "Nearby catchment cities" internal-linking block at the bottom of
 * each catchment page.
 */
export function otherCatchments(currentSlug: string): Catchment[] {
  return CATCHMENTS.filter((c) => c.slug !== currentSlug);
}
