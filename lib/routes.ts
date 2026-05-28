export type RouteKey =
  | "home" | "about" | "courses" | "admission" | "apply" | "visit"
  | "contact" | "placements" | "alumni" | "campus" | "fees" | "scholarships"
  | "documents" | "jeecup" | "hostel" | "faculty" | "events"
  | "chairman" | "principal" | "teaching" | "approvals" | "faq" | "blog" | "grievance"
  | "mandatoryDisclosure" | "aiPolicy"
  | "privacy" | "terms" | "antiRagging"
  | "jeecupFromBihar" | "jeecupVsBcece" | "admissionFromBihar"
  | "jeecupCounselling" | "whyBipe" | "aboutAffiliations"
  | "privateVsGovernment"
  | "polytechnicInMirzapur" | "polytechnicInJaunpur" | "polytechnicInGhazipur"
  | "polytechnicInAzamgarh" | "polytechnicInMau" | "polytechnicInBhadohi"
  | "polytechnicInChandauli" | "polytechnicInBallia"
  | "polytechnicInSonbhadra" | "polytechnicInSultanpur"
  | "polytechnicInPratapgarh" | "polytechnicInGorakhpur"
  | "governmentPolytechnicEasternUp" | "aidedPolytechnicUp" | "jeecupCutoff2026"
  | "jeecupRegistration" | "jeecupAdmitCard" | "jeecupResult"
  | "jeecupSeatAllotment" | "jeecupDocumentVerification" | "jeecupHelpline"
  | "jeecupSyllabus" | "jeecupPreviousPapers" | "jeecupEligibility"
  | "jeecupExamPattern" | "jeecupAfterResults"
  | "bteupFamilyId" | "bteupAdmitCard" | "bteupExamDates"
  | "bteupResult" | "bteupFees" | "bteupRegistration"
  | "bteupSyllabus" | "bteupBackPaper" | "bteupGrading"
  | "bteupColleges" | "bteupMigration" | "bteupDuplicateMarksheet";

export const SITE_URL = "https://www.bipevns.org";

export const ROUTES: Record<RouteKey, {
  path: string;
  title: string;
  description: string;
  /**
   * Optional Hindi + English keyword array. Emitted as
   * `<meta name="keywords">` via lib/seo.ts > metadataFor(). Google
   * ignores the keywords tag for ranking, but Yandex, Baidu and
   * some long-tail engines still parse it — and it's free signal for
   * the few routes where mixing Devanagari into the description would
   * clutter the SERP snippet. Reserved for /home, /admission, /jeecup
   * as of May 2026; other routes can stay undefined.
   */
  keywords?: string[];
}> = {
  home: {
    path: "/",
    // Title rewritten May 2026 from "BIPE Varanasi — AICTE Polytechnic
    // · JEECUP Code 4455" to lead with the verbatim search-intent
    // phrase. We rank #12 for the keyword today; the title is the
    // single highest-weight ranking factor for the head query.
    // Phase 1.5 (also May 2026): added "BTE UP" alongside AICTE per
    // the trust-signal strategy — BTE UP keywords themselves are
    // 823k/mo but owned by bteup.org.in, so the affiliation is used
    // as a CTR / conversion lever, not a traffic chase.
    title: "Polytechnic College in Varanasi · BTE UP & AICTE Approved · BIPE 4455",
    // Exact phrases "polytechnic college in Varanasi" + "polytechnic
    // in Varanasi" both included — Semrush data shows BIPE ranks #12
    // for "polytechnic college in varanasi" (590/mo), so adding the
    // verbatim phrase to title + description should push to page 1.
    // Compact form keeps the description under 160 chars for the SERP.
    description: "AICTE-approved polytechnic college in Varanasi — diploma engineering across 5 BTEUP branches including rare Dairy Engineering. JEECUP 4455. Apply for 2026-27.",
    keywords: [
      "BIPE Varanasi",
      "polytechnic in Varanasi",
      "AICTE polytechnic Varanasi",
      "diploma engineering UP",
      "JEECUP code 4455",
      "BTEUP polytechnic",
      "बीआईपीई वाराणसी",
      "वाराणसी पॉलिटेक्निक",
      "JEECUP 2026",
    ],
  },
  about: {
    path: "/about",
    // CTR rewrite 26 May 2026 · numbers in title (key CTR signal for
    // institutional queries). Specifics > "sixteen years of education"
    // generic prose. Updated to 1,200+/2,200+ post commit 065693f.
    title: "About BIPE Varanasi · Since 2010 · 1,200+ Placements · BTEUP 4455",
    description: "BIPE Varanasi — est. 2010 · 6-acre Phoolpur campus · AICTE 1-488233171 · BTEUP 4455 · 1,200+ alumni at Mahindra, Tata, BEL, Indian Railways.",
  },
  courses: {
    path: "/courses",
    // CTR rewrite 26 May 2026 · "Academics" is not a search query.
    // "Diploma Courses" + "Dairy Engineering" (the rare moat branch)
    // are the click magnets here.
    title: "Diploma Courses · 5 BTEUP Branches incl. Dairy Engineering | BIPE 4455",
    description: "5 BTEUP diploma branches at BIPE Varanasi: Civil, CSE, Electrical, Mechanical, rare Dairy Engineering. AICTE · ₹30,150/year · JEECUP 4455.",
  },
  admission: {
    path: "/admission",
    title: "Admission 2026-27 · JEECUP code 4455 · Exam 02-09 June | BIPE",
    description: "Apply via JEECUP (UPJEE Polytechnic) — code 4455. Exam 02-09 June 2026, 7-round counselling late June to August, classes begin 15 July 2026.",
    keywords: [
      "JEECUP 2026 admission",
      "polytechnic admission Varanasi",
      "BIPE admission 2026",
      "UPJEE Polytechnic 4455",
      "JEECUP काउंसलिंग 2026",
      "बीआईपीई एडमिशन 2026",
      "JEECUP फॉर्म कैसे भरें",
      "वाराणसी पॉलिटेक्निक एडमिशन",
    ],
  },
  apply: {
    path: "/apply",
    // CTR rewrite 26 May 2026 · "4-step form" stale (Siddharth flattened
    // to single-step in commit cedbe1a). Lead with "Free Application" —
    // power word that lifts CTR on transactional intent. Hindi support
    // signal kept because primary audience is Hindi-medium.
    title: "Apply to BIPE 2026-27 · Free Application · JEECUP 4455 · हिंदी",
    description: "Apply to BIPE Phoolpur 2026-27 free · 5 minutes · JEECUP 4455. Counsellor call within 24 hrs. हिंदी / English WhatsApp +91-9198646464.",
  },
  visit: {
    path: "/visit",
    // CTR rewrite 26 May 2026 · concrete distance + free shuttle as the
    // two strongest signals for "polytechnic visit Varanasi" intent.
    title: "Visit BIPE Phoolpur · Free Shuttle from Varanasi Cantt · 14 km",
    description: "Book a free BIPE campus visit · 14 km from Varanasi Cantt · free Saturday shuttle. Walk the 120-PC lab, dairy plant, hostel, workshops. No pressure.",
  },
  contact: {
    path: "/contact",
    // CTR rewrite 26 May 2026 · lead with phone (most-searched contact
    // signal) instead of generic "Phone, Email, Address" label.
    title: "Contact BIPE · +91-9198646464 · info@bipe.ac.in · Phoolpur Varanasi",
    description: "Call BIPE: +91-9198646464 · info@bipe.ac.in · Village Gajokhar, Post Parsara, Phoolpur, Varanasi 221206. WhatsApp counsellor in हिंदी / English.",
  },
  placements: {
    path: "/placements",
    // CTR rewrite 26 May 2026 · bumped to 1,200+ per Siddharth's content
    // review (commit 065693f). Lead with recruiter names — those are
    // the brand-recognition CTR boosters for "polytechnic placements UP"
    // search intent.
    title: "Polytechnic Placements UP · 1,200+ at Mahindra, Tata Steel, BEL | BIPE",
    description: "1,200+ BIPE alumni placed at Mahindra, Tata Steel, BEL, Indian Railways, Amul, Mother Dairy, UPPCL, Ola Electric. 2,200+ alumni network.",
  },
  alumni: {
    path: "/alumni",
    // CTR rewrite 26 May 2026 · bumped to current published numbers
    // (commit 065693f). "123 with photos" was internal-data styling
    // unsearched by users — replaced with "44 Recruiters" CTR anchor.
    title: "BIPE Alumni · 2,200+ Network · 1,200+ Placed at 44 Recruiters",
    description: "Browse 2,200+ BIPE alumni · 1,200+ verified placements at 44 recruiters (2013–2025). Mahindra, Tata Steel, BEL, Indian Railways. Filter by branch.",
  },
  campus: {
    path: "/campus",
    // CTR rewrite 26 May 2026 · specific facilities in title (120-PC,
    // dairy plant, hostel) outperform generic "Six acres".
    title: "BIPE Campus · 6-Acre Phoolpur · Hostel, 120-PC Lab, Dairy Plant",
    description: "Six-acre BIPE Phoolpur campus: 120-PC lab, mechanical workshop, dairy pilot plant, electrical lab, 12,000+ book library, hostels, sports ground.",
  },
  fees: {
    path: "/fees",
    // Year modifier "2026-27" added to capture the seasonal query —
    // May 2026 keyword audit P1 #8. Fees are per academic year, so
    // "2026-27" matches the cycle better than bare "2026".
    title: "Polytechnic fees 2026-27 · ₹30,150/year AFRC-approved | BIPE",
    description: "BIPE polytechnic fees 2026-27 · ₹30,150/year · AFRC-approved · No capitation, no hidden charges · Receipts for every payment · Hostel & mess separate.",
  },
  scholarships: {
    path: "/scholarships",
    // CTR rewrite 26 May 2026 · "up to ₹19,000/year" is the specific
    // savings anchor that lifts CTR on scholarship intent.
    title: "BIPE Scholarships · UP Post-Matric up to ₹19,000/year · SC/ST/OBC/EWS",
    description: "UP Post-Matric Scholarship covers BIPE tuition for SC/ST/OBC/Minority/EWS (family income <₹2L). Net cost can drop to ₹4-10k/year. Samaj Kalyan portal help.",
  },
  documents: {
    path: "/documents",
    // CTR rewrite 26 May 2026 · "Full Checklist" + year + JEECUP context.
    title: "Documents for BIPE Admission 2026-27 · Full Checklist · JEECUP 4455",
    description: "BIPE admission checklist 2026-27: 10th/12th marksheets, JEECUP rank card, Aadhaar, caste/income/EWS certificates, passport photos, transfer + character.",
  },
  jeecup: {
    path: "/jeecup",
    // Year modifier "2026" in title + description — the May 2026
    // keyword audit caught that the page targeted "JEECUP guidance"
    // but missed the highest-volume query of the year ("JEECUP 2026").
    title: "JEECUP 2026 guidance · 6-step counselling | BIPE",
    description: "From application to first day of class for JEECUP 2026 — application, entrance, rank, counselling, seat allotment, reporting at BIPE 4455.",
    keywords: [
      "JEECUP 2026",
      "JEECUP application 2026",
      "JEECUP counselling 2026",
      "JEECUP institute code 4455",
      "JEECUP eligibility",
      "JEECUP rank",
      "JEECUP काउंसलिंग गाइड",
      "JEECUP फॉर्म कैसे भरें",
      "BIPE 4455 JEECUP",
    ],
  },
  hostel: {
    path: "/hostel",
    // Phase 1.5 (May 2026): added "Hostels in Varanasi" head term —
    // 3,600/mo, currently SHEAT and other competitors rank weakly
    // and BIPE has a real on-campus hostel that's unclaimed by this
    // generic query. Title now captures three nested intents:
    //   - "hostels in Varanasi" (3,600/mo discovery)
    //   - "polytechnic with hostel in UP" (P1 audit, regional intent)
    //   - "BIPE hostel" (validation queries)
    title: "Hostels in Varanasi · Polytechnic Boys' Hostel · BIPE Phoolpur",
    description: "Looking for hostels in Varanasi? BIPE Phoolpur has an on-campus boys' hostel — furnished rooms, mess, Wi-Fi, study halls, resident warden, 24×7 security.",
  },
  faculty: {
    path: "/faculty",
    title: "Faculty · 40 BTEUP-recognised mentors · 1:20 ratio | BIPE",
    description: "40 BTEUP-recognised faculty across 7 departments. 1:20 mentor ratio with periodic home visits. AICTE FDP-trained, OBE-aligned pedagogy.",
  },
  events: {
    path: "/events",
    // CTR rewrite 26 May 2026 · year + category specifics > "News & Events".
    title: "BIPE Events 2026 · Tech Talks, Sports, Cultural, Placement Drives",
    description: "BIPE Phoolpur 2026 calendar: Tech Talk series, placement drives, open-house for Class 10, JEECUP guidance sessions, sports, cultural fests, faculty workshops.",
  },
  chairman: {
    path: "/chairman",
    title: "Chairman's Message — Dr. Chandrika Rai, IPS (Retd.) | BIPE",
    description: "From Pantnagar Agriculture University to the IPS to founding Purwanchal Educational Trust — Dr. Chandrika Rai's note to every BIPE family.",
  },
  principal: {
    path: "/principal",
    // Principal name MUST stay in sync with lib/faculty.ts (where the
    // Principal record's name field is the canonical source). The May
    // 2026 SERP audit caught Google surfacing a stale "Dr. R. K. Sharma"
    // from a previous incarnation of this title — drift between this
    // string and faculty.ts is what created the AI-Overview confusion.
    title: "Principal's Message — Rahul Srivastava | BIPE",
    description: "A note from Rahul Srivastava, BIPE's Principal — M.Tech, 13 years teaching, GATE-qualified — what every family can expect from three years here.",
  },
  teaching: {
    path: "/teaching",
    title: "Teaching & Learning · OBE + AI-augmented pedagogy | BIPE",
    description: "Outcome-Based Education aligned to AICTE 2024-27. Diagnostic, formative, summative assessment. AI-augmented with Claude. Faculty-led, human-first.",
  },
  approvals: {
    path: "/approvals",
    // Year modifier "2026-27" added — May 2026 keyword audit P1 #8.
    // Phase 1.5 (May 2026): title now leads with "BTE UP Affiliated"
    // to capture the validation-intent query cluster (`bte up
    // affiliated polytechnic varanasi`, `bteup affiliated polytechnic`,
    // `polytechnic colleges affiliated to bteup`) — small monthly
    // volumes but every searcher is a hot lead checking affiliation.
    title: "BTE UP Affiliated Polytechnic · Approvals 2026-27 · AICTE · AISHE | BIPE",
    description: "AICTE ID 1-488233171 · EoA 2026-27 dated 16 Mar 2026. BTEUP-affiliated under JEECUP 4455. AISHE-registered with the Department of Higher Education.",
  },
  faq: {
    path: "/faq",
    title: "FAQ · Admissions, Fees, Career, Campus | BIPE",
    description: "Common questions about admission, fees, scholarships, hostels, mentorship and life at BIPE.",
  },
  blog: {
    path: "/blog",
    title: "BIPE Blog — Admissions, Campus & Career Updates | Varanasi",
    description: "Stories, advice, and updates from BIPE — for diploma students and parents in Eastern UP.",
  },
  grievance: {
    path: "/grievance",
    title: "Grievance Redressal · 4 statutory committees | BIPE",
    description: "Anti-Ragging, POSH Internal Committee, SC/ST Committee and PWD Cell. Confidential grievance handling per AICTE, UGC, POSH 2013 and RPWD 2016.",
  },
  mandatoryDisclosure: {
    path: "/mandatory-disclosure",
    title: "Mandatory Disclosure 2026-27 · AICTE Annexure-18 | BIPE",
    description: "AICTE-mandated public disclosure: institute, governance, programmes, faculty, fees, infrastructure, committees and approvals. 2026-27 cycle.",
  },
  aiPolicy: {
    path: "/ai-policy",
    title: "Responsible AI in Teaching · BIPE Policy",
    description: "How BIPE uses Claude and other AI tools to augment — never replace — faculty. Five published principles, reviewed annually by the academic council.",
  },
  privacy: {
    path: "/privacy",
    title: "Privacy Policy · DPDP-aligned | BIPE",
    description: "How BIPE collects, processes, stores and protects personal data of applicants, students, parents and staff. Aligned with the DPDP Act 2023.",
  },
  terms: {
    path: "/terms",
    title: "Terms of Use — bipe.ac.in | BIPE Varanasi",
    description: "Terms governing the use of bipevns.org and BIPE digital services. Includes IT Rules 2021 grievance officer details.",
  },
  antiRagging: {
    path: "/anti-ragging",
    title: "Anti-Ragging Pledge & Committee | BIPE",
    description: "Zero-tolerance anti-ragging at BIPE. Committee composition, complaint flow, UGC anti-ragging portal link and Supreme-Court-mandated undertaking.",
  },
  jeecupFromBihar: {
    path: "/jeecup-from-bihar",
    title: "JEECUP from Bihar · Apply to BIPE Varanasi (code 4455)",
    description: "Bihar students can apply to BIPE Varanasi via JEECUP under the all-India category. Step-by-step for Patna, Gaya, Bhojpur, Buxar, Kaimur applicants.",
  },
  jeecupVsBcece: {
    path: "/jeecup-vs-bcece",
    title: "JEECUP vs BCECE · Bihar polytechnic options compared | BIPE",
    description: "JEECUP (UP) vs BCECE (Bihar) — eligibility, syllabus, counselling, fees, seats. How Bihar students secure a BIPE seat via JEECUP 4455.",
  },
  admissionFromBihar: {
    path: "/admission-from-bihar",
    title: "Admission from Bihar · Documents, equivalency, hostel | BIPE",
    description: "Bihar students applying to BIPE — Bihar Board/CBSE equivalency, residence & caste certificates, hostel, travel from Patna, Ara, Buxar.",
  },
  aboutAffiliations: {
    path: "/about/affiliations",
    // Phase 1.5 (May 2026): consolidated single source for the
    // validation-intent query cluster around institute affiliation:
    //   bte up affiliated polytechnic varanasi          ~20 / mo
    //   bteup affiliated polytechnic                    ~20 / mo
    //   polytechnic colleges affiliated to bteup        ~10 / mo
    //   aicte approved polytechnic varanasi             ~10 / mo
    // Tiny volumes, but every searcher is a high-conversion lead
    // checking affiliation before applying. /approvals exists too,
    // but is structured around verify-on-portal CTAs; this page
    // is a flatter "here's everything we're affiliated with, with
    // names, codes, and portal links" reference.
    title: "Affiliations & Approvals · BTE UP · AICTE · JEECUP 4455 · AISHE | BIPE",
    description: "Full list of BIPE's affiliations — BTE UP, AICTE Permanent ID 1-488233171, JEECUP 4455, AISHE registered, AFRC-approved tuition. Every claim verifiable on gov portals.",
    keywords: [
      "BTE UP affiliated polytechnic Varanasi",
      "BTEUP affiliated polytechnic",
      "polytechnic colleges affiliated to BTEUP",
      "AICTE approved polytechnic Varanasi",
      "BIPE affiliations",
      "JEECUP 4455 institute",
      "बीआईपीई affiliations",
    ],
  },
  whyBipe: {
    path: "/why-bipe",
    // Repositioned 25 May 2026 from "BIPE vs local private polytechnics"
    // (which gave smaller competitors free brand exposure inside BIPE's
    // own funnel) to a category-leader brand page. BIPE has led private
    // polytechnic admissions in Varanasi for 6+ consecutive years; the
    // page now asserts that position via evidence rather than comparing
    // down. The actual competitive set — government & aided polytechnics
    // — lives on /private-vs-government-polytechnic.
    //
    // Keyword cluster targeted here: the "best / top / private polytechnic
    // in Varanasi" head queries (≈110/mo combined per Semrush) plus the
    // long-tail BIPE-brand queries that surface in GSC. Dropped all
    // "BIPE vs [named competitor]" keywords — those compete for a tiny
    // volume cluster and leak SERP exposure to competitors.
    title: "Why BIPE · 16 Years · 1,200+ Placements · AFRC ₹30,150 | Varanasi",
    description: "Why families across Eastern UP choose BIPE since 2010 — BTEUP, AICTE 1-488233171, AFRC ₹30,150/year, on-campus hostel, 1,200+ placements. Eight pillars.",
    keywords: [
      "best polytechnic college in Varanasi",
      "top polytechnic college in Varanasi",
      "private polytechnic college in Varanasi",
      "BIPE Varanasi admission 2026",
      "BIPE Phoolpur polytechnic",
      "polytechnic with hostel in Varanasi",
      "AICTE approved polytechnic Varanasi",
      "JEECUP 4455 polytechnic",
      "वाराणसी का सबसे अच्छा पॉलिटेक्निक",
    ],
  },
  // ─── Eastern UP catchment landing pages (Phase 3 · 26 May 2026) ────
  //
  // Six geo-targeted landing pages capturing "polytechnic in [town]"
  // intent across BIPE's Tier-1/Tier-2 Eastern UP catchment. Inspired
  // by BITE's /colleges-in-[town] programmatic SEO pattern but
  // sharpened for polytechnic-admission decision-stage searchers.
  // Each page renders ~1,500-2,000 words via the shared
  // CatchmentTemplate component reading from lib/catchments.ts.
  // FAQPage + BreadcrumbList JSON-LD emitted per page.
  polytechnicInMirzapur: {
    path: "/polytechnic-in-mirzapur",
    title: "Polytechnic in Mirzapur · BIPE Varanasi · 75 km, JEECUP 4455",
    description: "Polytechnic for Mirzapur students — BIPE Phoolpur is 75 km via NH-19. 5 BTE UP branches including rare Dairy Engineering. On-campus boys' hostel. AFRC ₹30,150/year. JEECUP code 4455.",
    keywords: [
      "polytechnic in Mirzapur",
      "diploma college Mirzapur",
      "BIPE Mirzapur",
      "polytechnic near Mirzapur",
      "best polytechnic for Mirzapur students",
      "मिर्ज़ापुर पॉलिटेक्निक",
    ],
  },
  polytechnicInJaunpur: {
    path: "/polytechnic-in-jaunpur",
    title: "Polytechnic in Jaunpur · BIPE Varanasi · 55 km, JEECUP 4455",
    description: "Polytechnic for Jaunpur students — BIPE Phoolpur is 55 km via NH-19. 5 branches incl. Dairy Engineering. On-campus hostel. AFRC ₹30,150/year. JEECUP institute code 4455.",
    keywords: [
      "polytechnic in Jaunpur",
      "diploma college Jaunpur",
      "BIPE Jaunpur",
      "polytechnic near Jaunpur",
      "best polytechnic Jaunpur",
      "जौनपुर पॉलिटेक्निक",
    ],
  },
  polytechnicInGhazipur: {
    path: "/polytechnic-in-ghazipur",
    title: "Polytechnic in Ghazipur · BIPE Varanasi · 80 km, JEECUP 4455",
    description: "Polytechnic for Ghazipur students — BIPE Phoolpur is 80 km via NH-29. 5 BTE UP branches with Dairy Engineering for the local dairy belt. On-campus hostel. AFRC ₹30,150/year.",
    keywords: [
      "polytechnic in Ghazipur",
      "diploma college Ghazipur",
      "BIPE Ghazipur",
      "polytechnic near Ghazipur",
      "Dairy Engineering Ghazipur",
      "ग़ाज़ीपुर पॉलिटेक्निक",
    ],
  },
  polytechnicInAzamgarh: {
    path: "/polytechnic-in-azamgarh",
    title: "Polytechnic in Azamgarh · BIPE Varanasi · 120 km, JEECUP 4455",
    description: "Polytechnic for Azamgarh students — BIPE Phoolpur is 120 km via NH-233. On-campus boys' hostel essential at this distance. 5 BTE UP branches. AFRC ₹30,150/year. JEECUP 4455.",
    keywords: [
      "polytechnic in Azamgarh",
      "diploma college Azamgarh",
      "BIPE Azamgarh",
      "polytechnic near Azamgarh",
      "hostel polytechnic Eastern UP",
      "आज़मगढ़ पॉलिटेक्निक",
    ],
  },
  polytechnicInMau: {
    path: "/polytechnic-in-mau",
    title: "Polytechnic in Mau · BIPE Varanasi · 95 km, JEECUP 4455",
    description: "Polytechnic for Mau students — BIPE Phoolpur is 95 km via NH-29 / NH-19. 5 BTE UP branches. UP Post-Matric scholarship-eligible. On-campus hostel. AFRC ₹30,150/year.",
    keywords: [
      "polytechnic in Mau",
      "diploma college Mau",
      "BIPE Mau",
      "polytechnic near Mau",
      "Mau pottery diploma",
      "मऊ पॉलिटेक्निक",
    ],
  },
  polytechnicInBhadohi: {
    path: "/polytechnic-in-bhadohi",
    title: "Polytechnic in Bhadohi · BIPE Varanasi · 50 km, JEECUP 4455",
    description: "Polytechnic for Bhadohi students — BIPE Phoolpur is 50 km via NH-19. Mechanical & Dairy Engineering for the carpet-belt + agricultural-overlap households. AFRC ₹30,150/year.",
    keywords: [
      "polytechnic in Bhadohi",
      "diploma college Bhadohi",
      "BIPE Bhadohi",
      "polytechnic near Bhadohi",
      "Mechanical diploma carpet industry",
      "भदोही पॉलिटेक्निक",
    ],
  },
  // ─── Phase 4 catchment expansion · 26 May 2026 ────────────────────
  // Two more Eastern UP catchments added to extend the programmatic-
  // SEO surface across the broader BIPE catchment. Chandauli is the
  // closest neighbour (40 km, DDU-railway-hub culture); Ballia is the
  // far-east defence-recruit district (150 km, hostel-essential).
  polytechnicInChandauli: {
    path: "/polytechnic-in-chandauli",
    title: "Polytechnic in Chandauli · BIPE Varanasi · 40 km, JEECUP 4455",
    description: "Polytechnic for Chandauli students — BIPE Phoolpur is just 40 km via NH-7. DDU Junction makes train-commute easy. 5 BTE UP branches including Mechanical for the Indian Railways RRB JE pipeline. AFRC ₹30,150/year.",
    keywords: [
      "polytechnic in Chandauli",
      "diploma college Chandauli",
      "BIPE Chandauli",
      "polytechnic near Chandauli",
      "RRB JE Chandauli polytechnic",
      "DDU railway polytechnic diploma",
      "चंदौली पॉलिटेक्निक",
    ],
  },
  polytechnicInBallia: {
    path: "/polytechnic-in-ballia",
    title: "Polytechnic in Ballia · BIPE Varanasi · 150 km, JEECUP 4455",
    description: "Polytechnic for Ballia students — BIPE Phoolpur is 150 km via NH-19 + NH-29. On-campus boys' hostel essential at this distance. 5 BTE UP branches — Mechanical for Army TES and RRB JE (Ballia's career heritage). AFRC ₹30,150/year.",
    keywords: [
      "polytechnic in Ballia",
      "diploma college Ballia",
      "BIPE Ballia",
      "polytechnic near Ballia",
      "Army Technical Entry diploma",
      "RRB JE Ballia polytechnic",
      "hostel polytechnic for Ballia students",
      "बलिया पॉलिटेक्निक",
    ],
  },

  // ─── Phase 4b · 4 more catchments (26 May 2026) ────────────────
  // Extends programmatic-SEO coverage to the wider Eastern UP + Awadh
  // belt: Sonbhadra (Vindhya industrial), Sultanpur + Pratapgarh
  // (Awadh region, hostel-dependent), Gorakhpur (far east, large city).
  polytechnicInSonbhadra: {
    path: "/polytechnic-in-sonbhadra",
    title: "Polytechnic in Sonbhadra · BIPE Varanasi · 115 km, JEECUP 4455",
    description: "Polytechnic for Sonbhadra students — BIPE Phoolpur is 115 km via NH-39. 5 branches incl. Electrical for NTPC / UPPCL pipeline (Sonbhadra's industrial belt). On-campus boys' hostel. AFRC ₹30,150/year. JEECUP 4455.",
    keywords: [
      "polytechnic in Sonbhadra",
      "diploma college Sonbhadra",
      "BIPE Sonbhadra",
      "polytechnic near Renukoot Robertsganj",
      "NTPC Sonbhadra polytechnic",
      "UPPCL diploma engineering",
      "सोनभद्र पॉलिटेक्निक",
    ],
  },
  polytechnicInSultanpur: {
    path: "/polytechnic-in-sultanpur",
    title: "Polytechnic in Sultanpur · BIPE Varanasi · 165 km, JEECUP 4455",
    description: "Polytechnic for Sultanpur students (Awadh region) — BIPE Phoolpur is 165 km via NH-128. 5 BTE UP branches incl. rare Dairy Engineering for agricultural-overlap households. On-campus hostel. AFRC ₹30,150/year.",
    keywords: [
      "polytechnic in Sultanpur",
      "diploma college Sultanpur",
      "BIPE Sultanpur",
      "polytechnic near Sultanpur Awadh",
      "Awadh region diploma engineering",
      "Sultanpur Jaunpur polytechnic line",
      "सुल्तानपुर पॉलिटेक्निक",
    ],
  },
  polytechnicInPratapgarh: {
    path: "/polytechnic-in-pratapgarh",
    title: "Polytechnic in Pratapgarh · BIPE Varanasi · 170 km, JEECUP 4455",
    description: "Polytechnic for Pratapgarh students (mango / sugarcane belt) — BIPE Phoolpur is 170 km via NH-128. 5 branches incl. Dairy Engineering for agricultural-overlap households + Mechanical for Army TES / RRB JE. AFRC ₹30,150/year.",
    keywords: [
      "polytechnic in Pratapgarh",
      "diploma college Pratapgarh",
      "BIPE Pratapgarh",
      "polytechnic near Pratapgarh",
      "Pratapgarh mango belt diploma",
      "Awadh region polytechnic",
      "प्रतापगढ़ पॉलिटेक्निक",
    ],
  },
  polytechnicInGorakhpur: {
    path: "/polytechnic-in-gorakhpur",
    title: "Polytechnic in Gorakhpur · BIPE Varanasi · 205 km, JEECUP 4455",
    description: "Polytechnic for Gorakhpur students — BIPE Phoolpur is 205 km via NH-29. 5 BTE UP branches incl. rare Dairy Engineering. On-campus boys' hostel essential at this distance. AFRC ₹30,150/year. JEECUP 4455.",
    keywords: [
      "polytechnic in Gorakhpur",
      "diploma college Gorakhpur",
      "BIPE Gorakhpur",
      "polytechnic near Gorakhpur Junction",
      "Purvanchal polytechnic diploma",
      "RRB JE Gorakhpur polytechnic",
      "गोरखपुर पॉलिटेक्निक",
    ],
  },

  // ─── Government / aided polytechnic comparison cluster (Commit 3) ───
  //
  // Three pages targeting the government-polytechnic search-intent
  // cluster (rural Eastern UP families typically search "government
  // polytechnic [town]" first). BIPE intercepts these searchers with
  // honest comparison content, captures impressions on a high-volume
  // keyword cluster, and routes qualified traffic through the
  // private-vs-government framework.
  governmentPolytechnicEasternUp: {
    path: "/government-polytechnic-in-eastern-up",
    title: "Government Polytechnic in Eastern UP · Complete List 2026 | BIPE",
    description: "Every government polytechnic in Eastern UP — Varanasi (Kuru Pindra, Girls), Jaunpur, Mirzapur, Ghazipur, Azamgarh, Prayagraj. Capacity, branches, JEECUP cutoffs, fees. Honest comparison with BIPE.",
    keywords: [
      "government polytechnic in Eastern UP",
      "government polytechnic Varanasi",
      "government polytechnic Jaunpur",
      "government polytechnic Mirzapur",
      "government polytechnic Ghazipur",
      "government polytechnic Azamgarh",
      "list of government polytechnic UP",
      "BTEUP government college list",
      "Government Polytechnic Kuru Pindra",
      "सरकारी पॉलिटेक्निक पूर्वी UP",
    ],
  },
  aidedPolytechnicUp: {
    path: "/aided-polytechnic-uttar-pradesh",
    title: "Aided Polytechnic in UP · The 19 Institutes Between Government & Private | BIPE",
    description: "Aided polytechnic in UP — 19 institutes, government-funded but privately managed. Lower fees than private, JEECUP-based admission. How aided compares with government and BIPE. 2026 guide.",
    keywords: [
      "aided polytechnic UP",
      "aided polytechnic colleges in UP",
      "aided vs government polytechnic",
      "aided vs private polytechnic",
      "list of aided polytechnic UP",
      "BTEUP aided institute",
      "fee structure aided polytechnic",
      "अनुदानित पॉलिटेक्निक UP",
    ],
  },
  jeecupCutoff2026: {
    path: "/jeecup-cutoff-2026-bipe-vs-government",
    title: "JEECUP 2026 Cutoff · Government vs BIPE · Branch-wise Closing Ranks",
    description: "JEECUP 2026 cutoff guide — branch-wise closing ranks across Eastern UP government polytechnics (Jaunpur ~16k, Mirzapur ~18-25k, Azamgarh ~15-22k) vs BIPE's wider rank band. With honest framework for what your rank actually qualifies for.",
    keywords: [
      "JEECUP cutoff 2026",
      "JEECUP 2026 closing rank",
      "UP polytechnic cutoff government",
      "JEECUP government polytechnic cutoff",
      "BIPE JEECUP rank",
      "JEECUP Eastern UP cutoff",
      "JEECUP Jaunpur cutoff",
      "JEECUP Mirzapur cutoff",
      "JEECUP कटऑफ 2026",
    ],
  },
  privateVsGovernment: {
    path: "/private-vs-government-polytechnic",
    // Phase 2 of the 25 May 2026 repositioning. /why-bipe became a
    // category-leader brand page; this is the comparison surface that
    // addresses the REAL competitive set for BIPE — government and
    // aided polytechnics, not other private institutes. Keyword cluster
    // here is materially larger: "government vs private polytechnic",
    // "is private polytechnic worth the fees", "government polytechnic
    // Varanasi admission" (intercept the comparison searchers), plus
    // Hindi variants. FAQPage schema baked in for rich-result eligibility.
    title: "Private vs Government Polytechnic Varanasi · The Honest Math 2026 | BIPE",
    description: "Government Polytechnic Varanasi (~₹6,000-18,000/year) vs BIPE (AFRC ₹30,150/year) — what's identical (BTEUP diploma, JE eligibility, lateral entry) and where the fee delta goes (hostel, placement infrastructure, Dairy moat). Honest framework for 2026 admissions.",
    keywords: [
      "private vs government polytechnic",
      "government vs private polytechnic",
      "is private polytechnic worth it",
      "private polytechnic worth the fees",
      "government polytechnic Varanasi admission",
      "BIPE vs government polytechnic",
      "BTEUP government college vs private",
      "polytechnic fees government vs private",
      "सरकारी पॉलिटेक्निक vs प्राइवेट",
      "प्राइवेट पॉलिटेक्निक worth the fees",
    ],
  },
  jeecupCounselling: {
    path: "/jeecup-counselling",
    // Highest-volume keyword in BIPE's universe per Semrush —
    // 18,100 monthly searches, competition 0.01, CPC ₹0.43. Not
    // ranking at all today. Dedicated page added May 2026 to
    // capture the head term while /jeecup remains the broader
    // 6-step guidance hub.
    title: "JEECUP Counselling 2026 · 7 rounds · choice filling | BIPE 4455",
    description: "JEECUP counselling 2026 — 7 rounds (expanded from 5), choice filling strategy, documents required, seat allotment, reporting, common mistakes. How BIPE Varanasi (code 4455) fits.",
    keywords: [
      "JEECUP counselling 2026",
      "JEECUP counselling rounds",
      "JEECUP choice filling",
      "JEECUP seat allotment",
      "JEECUP 4455 BIPE",
      "JEECUP काउंसलिंग 2026",
      "JEECUP काउंसलिंग गाइड",
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // Phase 2 · JEECUP 2026 Resources hub (May 2026)
  //
  // Six procedural pages built from a shared template +
  // lib/jeecup-resources.ts data file. Each targets a distinct
  // high-volume procedural keyword cluster around JEECUP 2026 that
  // /jeecup (the 6-step guidance hub) cannot serve at sufficient
  // depth without becoming an unreadable wall of text.
  // ─────────────────────────────────────────────────────────────────
  jeecupRegistration: {
    path: "/jeecup-registration-2026",
    title: "JEECUP Registration 2026 · Step-by-step Online Application | BIPE 4455",
    description: "Complete JEECUP 2026 registration guide — online application at jeecup.admissions.nic.in, fee, documents, deadline, common errors. Apply to BIPE under code 4455.",
    keywords: [
      "JEECUP registration",
      "JEECUP online registration",
      "JEECUP 2026 application form",
      "JEECUP form fill kaise kare",
      "UPJEE Polytechnic registration",
      "JEECUP रजिस्ट्रेशन 2026",
      "JEECUP फॉर्म कैसे भरें",
    ],
  },
  jeecupAdmitCard: {
    path: "/jeecup-admit-card-2026",
    title: "JEECUP Admit Card 2026 · Download Guide + Troubleshooting | BIPE 4455",
    description: "Download JEECUP 2026 admit card from jeecup.admissions.nic.in — login, verify details, troubleshoot common errors. Exam window 02–09 June 2026.",
    keywords: [
      "JEECUP admit card",
      "JEECUP admit card 2026",
      "JEECUP admit card download",
      "JEECUP hall ticket",
      "UPJEE admit card",
      "JEECUP एडमिट कार्ड",
      "JEECUP admit card kaise download kare",
    ],
  },
  jeecupResult: {
    path: "/jeecup-result-2026",
    title: "JEECUP Result 2026 · Rank Card Check + What to Do Next | BIPE 4455",
    description: "Check JEECUP 2026 result at jeecup.admissions.nic.in — login, download rank card, understand category rank, plan counselling. Results expected mid-June 2026.",
    keywords: [
      "JEECUP result",
      "JEECUP result 2026",
      "JEECUP rank card download",
      "JEECUP 2026 marks",
      "JEECUP merit list",
      "JEECUP रिजल्ट 2026",
      "JEECUP result kaise check kare",
    ],
  },
  jeecupSeatAllotment: {
    path: "/jeecup-seat-allotment-2026",
    title: "JEECUP Seat Allotment 2026 · 7-Round Cycle + How to Check | BIPE 4455",
    description: "JEECUP 2026 seat allotment — 7 counselling rounds, how to check allotment, freeze / float / withdraw explained, spot round at BIPE. Institute code 4455.",
    keywords: [
      "JEECUP seat allotment",
      "JEECUP seat allotment result",
      "JEECUP allotment 2026",
      "JEECUP online counselling",
      "JEECUP round 1 allotment",
      "JEECUP काउंसलिंग सीट अलॉटमेंट",
      "JEECUP seat allotment kaise check kare",
    ],
  },
  jeecupDocumentVerification: {
    path: "/jeecup-document-verification-checklist",
    title: "JEECUP Document Verification Checklist 2026 · Complete List | BIPE 4455",
    description: "Complete document checklist for JEECUP 2026 reporting at BIPE Phoolpur — originals, photocopies, certificates, what to do if a document is delayed.",
    keywords: [
      "JEECUP document",
      "JEECUP document verification",
      "JEECUP documents required",
      "JEECUP reporting documents",
      "JEECUP काउंसलिंग के लिए डॉक्यूमेंट",
      "JEECUP seat reporting checklist",
    ],
  },
  jeecupHelpline: {
    path: "/jeecup-helpline-contact",
    title: "JEECUP Helpline 2026 · Official Contact, Email, Support | BIPE 4455",
    description: "JEECUP 2026 helpline — official phone, email, support for registration, admit card, result and counselling issues. Plus BIPE counsellor support.",
    keywords: [
      "JEECUP helpline",
      "JEECUP helpline number",
      "JEECUP contact",
      "JEECUP customer care",
      "JEECUP support",
      "JEECUP हेल्पलाइन नंबर",
      "UPJEE Polytechnic helpline",
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // Phase 5 expansion · May 2026 · JEECUP keyword-gap fill
  // Five additional procedural pages targeting JEECUP search clusters
  // not covered by Phase 2 batch — highest-volume gaps first.
  // ─────────────────────────────────────────────────────────────────
  jeecupSyllabus: {
    path: "/jeecup-syllabus-2026",
    title: "JEECUP Syllabus 2026 · Group A + All Groups Topics | BIPE 4455",
    description: "Complete JEECUP 2026 syllabus — Group A (Class 10 Maths/Physics/Chemistry) plus all 12 groups, topic-by-topic breakdown, weightage, NCERT-mapping. From BIPE.",
    keywords: [
      "JEECUP syllabus",
      "JEECUP syllabus 2026",
      "JEECUP Group A syllabus",
      "UPJEE Polytechnic syllabus",
      "JEECUP topics weightage",
      "JEECUP सिलेबस",
      "JEECUP सिलेबस 2026",
    ],
  },
  jeecupPreviousPapers: {
    path: "/jeecup-previous-year-papers",
    title: "JEECUP Previous Year Papers 2025-2020 · Download + Analysis | BIPE 4455",
    description: "JEECUP previous year question papers (2020-2025) — where to download, topic-wise weightage analysis, repeat patterns. Free BIPE-curated analysis included.",
    keywords: [
      "JEECUP previous year papers",
      "JEECUP question paper download",
      "JEECUP sample papers",
      "JEECUP past year question papers",
      "JEECUP 2025 paper",
      "JEECUP solved papers",
    ],
  },
  jeecupEligibility: {
    path: "/jeecup-eligibility-criteria",
    title: "JEECUP Eligibility Criteria 2026 · Group-wise + Age Limits | BIPE 4455",
    description: "Complete JEECUP 2026 eligibility — Group-by-Group requirements, age limits, domicile, reserved category, minimum marks. Honest guide from BIPE.",
    keywords: [
      "JEECUP eligibility",
      "JEECUP eligibility criteria",
      "JEECUP eligibility 2026",
      "JEECUP age limit",
      "JEECUP Group A eligibility",
      "UPJEE Polytechnic eligibility",
      "JEECUP एलिजिबिलिटी",
    ],
  },
  jeecupExamPattern: {
    path: "/jeecup-exam-pattern-2026",
    title: "JEECUP Exam Pattern 2026 · CBT Format + Marking Scheme | BIPE 4455",
    description: "JEECUP 2026 exam pattern — Computer-Based Test, 100 questions in 150 minutes, marking scheme, negative marking, section weighting, CBT navigation tips.",
    keywords: [
      "JEECUP exam pattern",
      "JEECUP exam pattern 2026",
      "JEECUP question format",
      "JEECUP marking scheme",
      "JEECUP negative marking",
      "UPJEE Polytechnic exam pattern",
      "JEECUP CBT format",
    ],
  },
  jeecupAfterResults: {
    path: "/jeecup-after-results-action-plan",
    title: "After JEECUP Result 2026 · Step-by-step Action Plan | BIPE 4455",
    description: "JEECUP 2026 result aa gaya — what to do next? Rank interpretation, document gathering, counselling choice list, 7 + 30-day action plan from BIPE.",
    keywords: [
      "JEECUP result kya kare",
      "JEECUP after result action",
      "JEECUP counselling preparation",
      "JEECUP rank kya hai",
      "JEECUP result ke baad",
      "JEECUP रिजल्ट के बाद",
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // Phase 3 · BTEUP 2026 Resources hub (May 2026)
  //
  // Six procedural pages built from a shared template +
  // lib/bteup-resources.ts data file. The BTEUP cluster targets
  // post-admission procedural queries (semester exams, results,
  // fees, annual registration) that current and prospective BIPE
  // students search for — distinct from the JEECUP cluster
  // (entrance-exam-side procedures).
  // ─────────────────────────────────────────────────────────────────
  bteupFamilyId: {
    path: "/bteup-family-id-registration",
    title: "BTEUP Family ID Registration 2026 · Linking Guide | BIPE 4455",
    description: "UP's new Family ID mandate for BTEUP students — how to register, link to your BTEUP student record, and unlock state scholarships. Step-by-step guide from BIPE.",
    keywords: [
      "BTEUP Family ID",
      "BTEUP Family ID registration",
      "UP Family ID linking",
      "BTEUP student portal",
      "BTEUP फैमिली आईडी",
      "UP Family ID polytechnic",
    ],
  },
  bteupAdmitCard: {
    path: "/bteup-admit-card-download",
    title: "BTEUP Admit Card 2026 · Semester Exam Download Guide | BIPE 4455",
    description: "Download BTEUP semester exam admit card from bteup.org.in — login, verify, troubleshoot common errors. Released ~2 weeks before each exam cycle.",
    keywords: [
      "BTEUP admit card",
      "BTEUP admit card download",
      "BTEUP semester exam admit card",
      "BTEUP hall ticket",
      "BTEUP एडमिट कार्ड",
      "polytechnic semester admit card UP",
    ],
  },
  bteupExamDates: {
    path: "/bteup-semester-exam-dates-2026",
    title: "BTEUP Semester Exam Dates 2026 · Odd + Even Cycle | BIPE 4455",
    description: "BTEUP exam calendar 2026 — odd semester (Apr-Jun), even semester (Oct-Dec), practical exam window, supplementary cycle. Verified pattern from bteup.org.in.",
    keywords: [
      "BTEUP exam date",
      "BTEUP semester exam dates",
      "BTEUP exam dates 2026",
      "BTEUP exam calendar",
      "BTEUP एग्जाम डेट",
      "polytechnic semester exam UP",
    ],
  },
  bteupResult: {
    path: "/bteup-result-check",
    title: "BTEUP Result 2026 · Semester Result + Grace / Revaluation | BIPE 4455",
    description: "Check BTEUP semester result at bteup.org.in — marksheet download, grade explainer, apply for grace marks or revaluation. Result timeline typically ~2 months post-exam.",
    keywords: [
      "BTEUP result",
      "BTEUP result 2026",
      "BTEUP semester result",
      "BTEUP marksheet download",
      "BTEUP रिजल्ट 2026",
      "polytechnic semester result UP",
    ],
  },
  bteupFees: {
    path: "/bteup-exam-fees-payment",
    title: "BTEUP Exam Fees Payment 2026 · Online Portal Guide | BIPE 4455",
    description: "Pay BTEUP semester exam fees online — portal guide, fee structure, late-fee window, payment-failed troubleshooting. From the BIPE academic office.",
    keywords: [
      "BTEUP exam fees",
      "BTEUP fees payment",
      "BTEUP exam fee online",
      "BTEUP semester fee",
      "BTEUP एग्जाम फीस",
    ],
  },
  bteupRegistration: {
    path: "/bteup-student-registration",
    title: "BTEUP Student Registration 2026 · Annual Process + Documents | BIPE 4455",
    description: "BTEUP annual student registration — what documents you submit, when, and how BIPE coordinates with BTEUP on your behalf. Required for every diploma student every year.",
    keywords: [
      "BTEUP student registration",
      "BTEUP registration 2026",
      "BTEUP annual registration",
      "BTEUP enrollment",
      "BTEUP रजिस्ट्रेशन",
      "polytechnic student registration UP",
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // Phase 5 expansion · May 2026 · BTEUP keyword-gap fill
  // Six additional procedural pages targeting BTEUP search clusters
  // not covered by Phase 3 batch — highest-volume gaps first.
  // ─────────────────────────────────────────────────────────────────
  bteupSyllabus: {
    path: "/bteup-syllabus-2026",
    title: "BTEUP Syllabus 2026 · Branch-wise + Semester Curriculum | BIPE 4455",
    description: "Complete BTEUP 2026 syllabus — branch + semester structure, theory + practical breakdown, NEP-aligned changes, where to download official PDFs. From BIPE.",
    keywords: [
      "BTEUP syllabus",
      "BTEUP syllabus 2026",
      "BTEUP polytechnic syllabus",
      "BTEUP curriculum",
      "polytechnic syllabus UP",
      "BTEUP सिलेबस",
      "बीटीईयूपी पाठ्यक्रम",
    ],
  },
  bteupBackPaper: {
    path: "/bteup-back-paper-supplementary-process",
    title: "BTEUP Back Paper 2026 · Supplementary Exam Process | BIPE 4455",
    description: "BTEUP back paper / supplementary guide — eligibility, registration, fees, timeline. Clear backlogs without losing a year. From the BIPE academic office.",
    keywords: [
      "BTEUP back paper",
      "BTEUP supplementary exam",
      "BTEUP backlog process",
      "BTEUP supply exam",
      "BTEUP fail subject re-exam",
      "BTEUP बैक पेपर",
    ],
  },
  bteupGrading: {
    path: "/bteup-grading-cgpa-calculation",
    title: "BTEUP Grading System 2026 · CGPA + Percentage Calculation | BIPE 4455",
    description: "BTEUP grading scale, mark-to-grade mapping, SGPA + CGPA formula, percentage conversion for B.Tech lateral entry. Complete guide from BIPE.",
    keywords: [
      "BTEUP grading",
      "BTEUP CGPA",
      "BTEUP CGPA calculation",
      "BTEUP percentage calculation",
      "BTEUP SGPA",
      "BTEUP marksheet grade",
      "polytechnic CGPA formula",
    ],
  },
  bteupColleges: {
    path: "/bteup-affiliated-colleges-up",
    title: "BTEUP Affiliated Colleges in UP 2026 · Verify + Compare | BIPE 4455",
    description: "BTEUP-affiliated polytechnic colleges across Uttar Pradesh — government, aided, private categories. How to verify any college's BTEUP affiliation. BIPE's place in the system.",
    keywords: [
      "BTEUP affiliated colleges",
      "BTEUP college list UP",
      "polytechnic colleges UP",
      "BTEUP recognized colleges",
      "BTEUP polytechnic list",
      "BTEUP affiliation verification",
    ],
  },
  bteupMigration: {
    path: "/bteup-migration-noc-process",
    title: "BTEUP Migration NOC 2026 · Transfer Between Colleges | BIPE 4455",
    description: "BTEUP migration + No Objection Certificate process — transfer between affiliated colleges, documents required, timeline, fees. From the BIPE academic office.",
    keywords: [
      "BTEUP migration",
      "BTEUP NOC",
      "BTEUP transfer certificate",
      "polytechnic college transfer",
      "BTEUP college change",
      "BTEUP migration process",
    ],
  },
  bteupDuplicateMarksheet: {
    path: "/bteup-duplicate-marksheet-application",
    title: "BTEUP Duplicate Marksheet 2026 · Application + Reissue | BIPE 4455",
    description: "Lost or damaged your BTEUP marksheet? Application process, fees, affidavit / FIR requirements, 4-6 week timeline. Step-by-step from BIPE.",
    keywords: [
      "BTEUP duplicate marksheet",
      "BTEUP lost marksheet",
      "BTEUP marksheet reissue",
      "duplicate marksheet polytechnic UP",
      "BTEUP marksheet damaged",
      "BTEUP डुप्लीकेट मार्कशीट",
    ],
  },
};

import type { Metadata } from "next";

export function metaFor(key: RouteKey): Metadata {
  const r = ROUTES[key];
  return {
    title: r.title,
    description: r.description,
    alternates: {
      canonical: r.path,
      languages: {
        "en-IN": r.path,
        "hi-IN": `${r.path}${r.path.includes("?") ? "&" : "?"}lang=hi`,
      },
    },
    openGraph: {
      title: r.title,
      description: r.description,
      url: `${SITE_URL}${r.path}`,
      siteName: "BIPE",
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: r.title,
      description: r.description,
    },
  };
}
