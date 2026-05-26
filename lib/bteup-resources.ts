/**
 * BTEUP 2026 Resources hub — typed content for 6 procedural pages.
 *
 * Phase 3 of the JEECUP/BTEUP content sprint. These pages target
 * the procedural keyword cluster around the Board of Technical
 * Education, Uttar Pradesh (BTEUP, bteup.org.in) — the regulatory
 * body that affiliates BIPE under code 4455 and conducts all
 * semester exams, result declaration, and student registration
 * for UP-state diploma programs:
 *
 *   /bteup-family-id-registration         the new May 2026 Family-ID
 *                                          mandate (highest priority)
 *   /bteup-admit-card-download             semester exam admit card
 *   /bteup-semester-exam-dates-2026        odd / even sem windows
 *   /bteup-result-check                    result + grace + supplementary
 *   /bteup-exam-fees-payment               per-semester payment portal
 *   /bteup-student-registration            annual student registration
 *
 * Each renders via the dedicated BteupResourceTemplate component
 * with FAQPage + BreadcrumbList JSON-LD baked in.
 *
 * Editorial stance:
 *   - BTEUP semester-specific dates / fees are published per cycle;
 *     this content directs readers to the official BTEUP calendar
 *     rather than inventing specific 2026 dates we can't verify
 *   - BIPE-specific context (institute code 4455, the practical
 *     mechanics of how BIPE handles registration on behalf of
 *     students) is honest and verifiable
 *   - Every page links back to /about/affiliations (which carries
 *     the BIPE-BTEUP relationship in detail) and to /apply
 *
 * Note: the data shape mirrors lib/jeecup-resources.ts JeecupResource
 * intentionally — both hubs share the same procedural-page DNA. The
 * BteupResource interface is defined here independently so the two
 * hubs can evolve separately if needed.
 */

export interface ResourceStep {
  n: string;
  title: string;
  body: string;
}

export interface ResourceFaq {
  q: string;
  a: string;
}

export interface ResourceQuickStat {
  label: string;
  value: string;
  sub?: string;
}

export interface BteupResource {
  slug: string;
  shortTitle: string;
  title: string;
  description: string;
  keywords: string[];
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  lead: string;
  quickStats: ResourceQuickStat[];
  steps: ResourceStep[];
  checklist?: {
    eyebrow: string;
    heading: string;
    intro?: string;
    items: string[];
  };
  contacts?: {
    eyebrow: string;
    heading: string;
    items: { label: string; value: string; href?: string }[];
  };
  faqs: ResourceFaq[];
  ctaTitle: string;
  ctaBody: string;
}

/* eslint-disable max-len */

export const BTEUP_RESOURCES: BteupResource[] = [
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "bteup-family-id-registration",
    shortTitle: "BTEUP Family-ID Mandate",
    title: "BTEUP Family ID Registration 2026 · Step-by-step Linking Guide | BIPE 4455",
    description: "UP government's new Family ID mandate for BTEUP students — how to register, link to your BTEUP student record, common errors, and how it unlocks state scholarships and UP-specific benefits.",
    keywords: [
      "BTEUP Family ID",
      "BTEUP Family ID registration",
      "UP Family ID linking",
      "BTEUP student portal Family ID",
      "BTEUP फैमिली आईडी",
      "UP Family ID polytechnic",
      "Family ID BTEUP कैसे जोड़ें",
    ],
    eyebrow: "BTEUP 2026 · FAMILY ID MANDATE",
    headline: "BTEUP Family ID linking —",
    headlineAccent: "the new state-scholarship gateway.",
    lead: "Starting the 2026-27 academic session, the UP government requires all BTEUP-affiliated diploma students to link their state-issued Family ID (परिवार पहचान पत्र) to their BTEUP student record. The mandate gates access to state scholarships, UP-only benefit schemes, and certain placement-cell endorsements. This page walks through registration, linking, and the common pitfalls that delay verification.",
    quickStats: [
      { label: "Mandate effective", value: "2026-27 onwards", sub: "All UP diploma students" },
      { label: "Family ID portal", value: "familyid.up.gov.in", sub: "Official UP government" },
      { label: "BTEUP linkage", value: "Via student portal", sub: "bteup.org.in student login" },
      { label: "Unlocks", value: "Scholarships + benefits", sub: "Income-linked + caste-linked" },
    ],
    steps: [
      {
        n: "01",
        title: "Get your UP Family ID (if you don't already have one)",
        body: "Visit familyid.up.gov.in. If your family has a UP ration card, your Family ID is pre-generated — just look it up using your ration card number. If you don't have a ration card, you can register a new Family ID using your Aadhaar, address proof, and household member details. Allow 5-10 working days for verification.",
      },
      {
        n: "02",
        title: "Log in to the BTEUP student portal",
        body: "Visit bteup.org.in. Use the Student Login (separate from the institute / faculty login). Your credentials are issued by BIPE after annual registration — if you don't have login details, ask your branch in-charge. First-year students at BIPE receive credentials within 2 weeks of joining the session.",
      },
      {
        n: "03",
        title: "Navigate to 'Family ID Linking' under Profile / Updates",
        body: "Inside the student portal, look for the 'Family ID' tab under Profile, Settings, or Updates (BTEUP occasionally renames sub-menus). Enter your 12-digit Family ID number exactly as it appears on your Family ID card. The portal cross-verifies the ID against the UP government's familyid.up.gov.in database in real time.",
      },
      {
        n: "04",
        title: "Verify the family-member names auto-populated by the portal",
        body: "Once your Family ID is recognised, the portal displays your full family-member list (parents, siblings, household members as listed in your Family ID). Confirm this matches your actual family. If a member is missing or extra, do NOT proceed — update your Family ID at familyid.up.gov.in first, then return to BTEUP after the update is verified.",
      },
      {
        n: "05",
        title: "Submit linkage and download the confirmation receipt",
        body: "Click 'Submit / Link'. The portal generates a confirmation receipt with a unique BTEUP-FID linkage ID. Download and save this — you'll need it for scholarship applications, certificate disbursement, and any UP government benefit you claim while studying.",
      },
      {
        n: "06",
        title: "Apply for state scholarship using the linked record",
        body: "With Family ID linked, you become eligible to apply for UP Post-Matric Scholarship (PMS), state minority scholarships, and category-specific schemes through the scholarship.up.gov.in portal. Scholarship applications now auto-fetch your income, caste, and household data from the linked Family ID — much less paperwork than the pre-mandate flow.",
      },
    ],
    checklist: {
      eyebrow: "Documents to keep ready",
      heading: "Before you start the linking",
      items: [
        "UP Family ID card (12-digit number) or family ration card",
        "Aadhaar card (yours)",
        "BTEUP student portal login credentials (issued by BIPE)",
        "Active mobile number (registered with Family ID — receives OTPs)",
        "Photograph of all family members listed on the Family ID (for cross-verification)",
        "Income certificate (if applying for scholarships through the linked record)",
        "Caste certificate (if applicable)",
      ],
    },
    faqs: [
      {
        q: "I don't have a UP Family ID — can I still study at BIPE?",
        a: "Yes, absolutely. The Family ID mandate is for scholarship and benefit access, not for admission or attendance. You can study at BIPE without one. However, if you want to claim state scholarships during your diploma, you'll need to register a Family ID at familyid.up.gov.in. Bihar / out-of-state students don't need a UP Family ID — they apply for scholarships through their home-state portals instead.",
      },
      {
        q: "My family name on Family ID doesn't match my Class 10 marksheet — what do I do?",
        a: "Get the Family ID corrected at familyid.up.gov.in BEFORE linking to BTEUP. If the names mismatch at linkage, the BTEUP portal rejects the submission and you can't re-attempt for 7 days. Common mismatches: 'KUMAR' vs 'Kumar' (case), spelling variations (Pandey / Panday), missing middle name. Match exactly to your Class 10 marksheet.",
      },
      {
        q: "Can BIPE link my Family ID on my behalf?",
        a: "No — the student must do this themselves via their personal BTEUP login. BIPE's role is to issue you BTEUP login credentials and to verify the linkage at the institute-side (we see your linked status in our institute dashboard). The actual linking action is in your hands.",
      },
      {
        q: "How long does Family ID linking take to verify?",
        a: "Real-time at the BTEUP portal side — you get the linkage receipt immediately. But the UP government's scholarship system takes 7-14 days to recognise the new BTEUP-FID record. So apply for scholarships about 2 weeks after linking, not the same day.",
      },
      {
        q: "What scholarships does the linked Family ID unlock?",
        a: "UP Post-Matric Scholarship (PMS, for SC/ST/OBC/Minority), UP State Scholarship for General candidates with family income below ₹2 lakh/year, Mukhyamantri Vidyarthi Pratibha Puruskar (CM Merit Award) for high-rank students, and category-specific schemes (Pasmanda Muslim Scholarship, etc.). Each has its own income / caste / merit criteria — your linked Family ID auto-fills the data, but you still need to meet each scheme's threshold.",
      },
      {
        q: "Is the Family ID mandate the same as Aadhaar linking?",
        a: "No. Aadhaar linking (started 2019-20) is per-student. Family ID linking is per-household and tracks all family members + family income for scheme eligibility. You'll need BOTH linked — Aadhaar for identity, Family ID for benefits.",
      },
    ],
    ctaTitle: "Need help with Family ID linkage at BIPE?",
    ctaBody: "Our placement and student-welfare cell helps current BIPE students through the linking flow during the first 2 weeks of each session. WhatsApp +91-9198646464 with your name + branch + year and we'll walk you through it. Free, EN / हिंदी.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "bteup-admit-card-download",
    shortTitle: "BTEUP Admit Card",
    title: "BTEUP Admit Card 2026 · Semester Exam Download Guide | BIPE 4455",
    description: "Download your BTEUP semester exam admit card from bteup.org.in — login flow, verification steps, troubleshooting common errors. Released approximately 2 weeks before each exam cycle.",
    keywords: [
      "BTEUP admit card",
      "BTEUP admit card download",
      "BTEUP semester exam admit card",
      "BTEUP hall ticket",
      "BTEUP 2026 admit card",
      "BTEUP एडमिट कार्ड",
      "polytechnic semester admit card UP",
    ],
    eyebrow: "BTEUP 2026 · ADMIT CARD GUIDE",
    headline: "BTEUP semester admit card —",
    headlineAccent: "download, verify, troubleshoot.",
    lead: "BTEUP semester exam admit cards are released on bteup.org.in approximately 2 weeks before each exam cycle (typically May for odd-sem theory, November for even-sem theory). This page walks through the download flow, the details to verify against your registration, and what to do if something doesn't match.",
    quickStats: [
      { label: "Released", value: "~2 weeks pre-exam", sub: "Watch bteup.org.in" },
      { label: "Login", value: "Student portal", sub: "Roll number + password" },
      { label: "Per cycle", value: "Separate card", sub: "Odd / even / practical / supp." },
      { label: "Format", value: "PDF · printable", sub: "Carry hard copy to exam" },
    ],
    steps: [
      {
        n: "01",
        title: "Open the official BTEUP portal",
        body: "Visit bteup.org.in. On the homepage, look for the 'Student Login' or 'Admit Card' link prominent during the release window. Do NOT use third-party sites that claim to host BTEUP admit cards — these are usually outdated or fraudulent.",
      },
      {
        n: "02",
        title: "Log in with your BTEUP student credentials",
        body: "Enter your BTEUP roll number (assigned at registration — different from JEECUP application number) and your password. If you forgot the password, use 'Forgot Password' — the reset link goes to the email + mobile registered during annual registration. If both are unreachable, ask your branch in-charge at BIPE.",
      },
      {
        n: "03",
        title: "Select the relevant exam cycle and download",
        body: "Pick the current exam cycle from the dropdown — odd semester theory, even semester theory, practical, or supplementary. Each has its own admit card. Download the PDF.",
      },
      {
        n: "04",
        title: "Verify every detail on the admit card",
        body: "The admit card shows: your name, roll number, branch, semester, exam centre name + address, reporting time, list of subjects with subject codes, exam shift timings, photograph. Verify ALL fields against your registration. The most common error is a missing subject (registration glitch) or wrong centre — both need to be flagged to BIPE's exam coordinator immediately if found.",
      },
      {
        n: "05",
        title: "Print 2 hard copies on plain A4 paper",
        body: "Take TWO printouts. Black-and-white is acceptable; colour is not required. Keep one in your bag and one at home. Carry your ORIGINAL Aadhaar or BIPE student ID card along — required as photo proof at the exam centre.",
      },
      {
        n: "06",
        title: "Day before the exam · centre logistics check",
        body: "If your centre is at a different institute (BTEUP sometimes assigns mixed centres for high-volume cycles), travel to it the day before to confirm the route, gate, and parking. Do NOT show up late — BTEUP exam halls close 15 minutes after the reporting time.",
      },
    ],
    faqs: [
      {
        q: "When will the BTEUP 2026 admit card be released?",
        a: "Approximately 2 weeks before each exam cycle begins. Odd-semester theory admit cards typically release in May, even-semester theory in November. Practical exam admit cards release ~10 days before practicals start (which can be at the institute itself, not a central centre). Watch the bteup.org.in homepage banner for exact dates.",
      },
      {
        q: "I forgot my BTEUP password — how do I download my admit card?",
        a: "Use 'Forgot Password' on the BTEUP login page with your roll number. The reset link goes to your registered email / mobile. If both are unreachable (changed number, etc.), contact your branch in-charge at BIPE — we can verify your identity and ask BTEUP to push a manual reset. Allow 24-48 hours.",
      },
      {
        q: "My admit card is missing a subject I'm registered for — what do I do?",
        a: "This is the most common BTEUP admit-card issue. Immediately contact BIPE's exam coordinator (visit the admin block, do NOT wait for email response). The coordinator raises a correction request with BTEUP through the institute portal. Most corrections are resolved within 5-7 working days. If it's the night before the exam, the admit card cannot be amended — you'll attempt only the listed subjects and re-attempt the missing subject in the supplementary cycle.",
      },
      {
        q: "Can I appear for the exam without an admit card?",
        a: "No. BTEUP does NOT permit exam-hall entry without a printed admit card. If you genuinely lose both copies on exam day, contact BIPE's exam cell — they have institute-level access to your admit card and can re-print + sign-verify on the spot if you're early enough. Reach the centre 90 minutes early on exam day so you have time for any emergency re-print.",
      },
      {
        q: "What's the difference between BTEUP and JEECUP admit cards?",
        a: "JEECUP admit card is for the entrance exam (one-time, before admission). BTEUP admit cards are for the semester exams during your diploma (twice a year, every year of the diploma). Different portals, different login credentials. JEECUP uses jeecup.admissions.nic.in; BTEUP uses bteup.org.in.",
      },
    ],
    ctaTitle: "Semester exam coming up?",
    ctaBody: "BIPE's exam cell helps every BTEUP-registered student with admit-card download, centre allocation, and any portal issues during exam season. Visit the admin block or WhatsApp +91-9198646464 ahead.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "bteup-semester-exam-dates-2026",
    shortTitle: "BTEUP Semester Exam Dates",
    title: "BTEUP Semester Exam Dates 2026 · Odd + Even Cycle Calendar | BIPE 4455",
    description: "BTEUP semester exam calendar 2026 — odd semester (Apr-Jun) and even semester (Oct-Dec) windows, practical schedule, supplementary cycle. Verified from bteup.org.in.",
    keywords: [
      "BTEUP exam date",
      "BTEUP semester exam dates",
      "BTEUP exam dates 2026",
      "BTEUP odd semester exam",
      "BTEUP even semester exam",
      "BTEUP exam calendar",
      "BTEUP एग्जाम डेट",
      "polytechnic semester exam UP",
    ],
    eyebrow: "BTEUP 2026 · EXAM CALENDAR",
    headline: "BTEUP semester exams —",
    headlineAccent: "when each cycle runs.",
    lead: "BTEUP runs two main exam cycles a year — odd semester (typically April-June, covering Sem 1, 3, 5) and even semester (typically October-December, covering Sem 2, 4, 6). Plus practical exams within each cycle and a supplementary cycle for backlog clearance. Specific 2026 dates are published per cycle by BTEUP — this page lays out the typical calendar pattern + where to find the latest schedule.",
    quickStats: [
      { label: "Odd sem theory", value: "Apr – Jun", sub: "Sem 1, 3, 5 · annual" },
      { label: "Even sem theory", value: "Oct – Dec", sub: "Sem 2, 4, 6 · annual" },
      { label: "Practical window", value: "Pre-theory · 2 weeks", sub: "At institute · BIPE Phoolpur" },
      { label: "Supplementary", value: "After main result", sub: "Typically July + January" },
    ],
    steps: [
      {
        n: "01",
        title: "Check the BTEUP official calendar (the only authoritative source)",
        body: "Visit bteup.org.in's 'Notice Board' or 'Examination' section. BTEUP publishes the per-cycle calendar approximately 6 weeks before each cycle starts. Specific 2026 dates may shift from year to year. Third-party sites often republish stale or guessed dates — go to the source.",
      },
      {
        n: "02",
        title: "Note the practical exam window first",
        body: "Practicals happen at YOUR institute (BIPE Phoolpur), conducted by your faculty + an external BTEUP examiner. They typically run 2 weeks BEFORE the theory exam window opens. BIPE's exam cell publishes the practical timetable to students about 3 weeks ahead via the notice board and WhatsApp groups.",
      },
      {
        n: "03",
        title: "Note your subject-wise theory exam dates",
        body: "Each branch has different subjects per semester. The BTEUP timetable lists exam dates per subject code. Cross-check against YOUR registered subjects (visible on your admit card or BTEUP student portal). Mark each date in your calendar — missing one is a backlog.",
      },
      {
        n: "04",
        title: "Plan your study schedule backwards from the first exam date",
        body: "Most diploma students underestimate the exam-prep crunch. Once you know your first exam date, work backwards in 5-day study blocks per subject. For most BIPE branches (Mechanical, Electrical, Civil), each semester has 5-7 theory subjects + 4-6 practicals. Start serious revision 4-6 weeks before Day 1 of the cycle.",
      },
      {
        n: "05",
        title: "Track results + plan for supplementary if needed",
        body: "Results typically release 2 months after the cycle closes. If you have a backlog (failed subject or shortage of attendance), the supplementary cycle gives you a re-attempt. Supplementary registration is fee-paid and time-bound — usually a 2-week window starting ~1 week after main results.",
      },
      {
        n: "06",
        title: "Watch for grace marks and revaluation windows",
        body: "BTEUP allows you to apply for grace marks (small mark addition to pass) or revaluation (paid re-check of your answer sheet) within ~3 weeks of result declaration. Grace marks have category-based thresholds; revaluation costs ~₹500 per subject and takes 8-12 weeks. Your branch in-charge at BIPE can advise on whether either is worth pursuing.",
      },
    ],
    faqs: [
      {
        q: "Where can I find the BTEUP 2026 exam date sheet?",
        a: "Only on bteup.org.in's official Notice Board or Examination section. The board uploads the per-cycle date sheet about 6 weeks before each cycle starts. Do NOT rely on dates listed on Careers360, Shiksha, or aggregator sites — those frequently lag or guess.",
      },
      {
        q: "Are odd and even semester exams in the same month every year?",
        a: "Roughly. Odd semester usually runs April-June (sometimes shifted by a few weeks due to elections, public holidays, or pandemic-style disruptions). Even semester usually runs October-December. Exact dates float year to year — always check the current-cycle calendar before planning.",
      },
      {
        q: "What if I have a personal emergency on an exam date?",
        a: "Inform BIPE's exam coordinator IMMEDIATELY — same day, with documentation (medical certificate, family emergency proof). BTEUP allows attempt-shifting in genuine cases via the supplementary cycle. Your fee for the missed paper isn't refundable, but the attempt isn't lost — it's deferred. Without notification + documentation, the missed paper counts as an absent / backlog.",
      },
      {
        q: "When do BTEUP practical exams happen?",
        a: "About 2 weeks BEFORE the theory exam window. Practicals are at YOUR institute (BIPE Phoolpur for BIPE students) under an external BTEUP examiner. Each branch has 4-6 practical subjects per semester. You'll know your practical date 3-4 weeks ahead via BIPE's notice board.",
      },
      {
        q: "What is the BTEUP supplementary exam cycle?",
        a: "A re-attempt window for students who failed a subject (got 'CT' or 'AB' grade) or fell short on attendance. Held twice a year — typically July (for odd-sem backlogs) and January (for even-sem backlogs). Supplementary registration is fee-paid (~₹200-500 per subject), and the window is short (~2 weeks). Track BTEUP notifications carefully.",
      },
    ],
    ctaTitle: "Worried about your exam prep?",
    ctaBody: "BIPE conducts internal pre-board exams 3-4 weeks before each BTEUP cycle, plus revision classes and faculty doubt-clearing sessions in the final fortnight. Drop into the academic office or WhatsApp +91-9198646464 to discuss your specific subject concerns.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "bteup-result-check",
    shortTitle: "BTEUP Result Check",
    title: "BTEUP Result 2026 · Semester Result Check + Grace / Revaluation | BIPE 4455",
    description: "Check your BTEUP semester result at bteup.org.in — login, marksheet download, understand grades, apply for grace marks or revaluation. Result timeline typically ~2 months post-exam.",
    keywords: [
      "BTEUP result",
      "BTEUP result 2026",
      "BTEUP semester result",
      "BTEUP result check",
      "BTEUP marksheet download",
      "BTEUP रिजल्ट 2026",
      "BTEUP result kaise check kare",
      "polytechnic semester result UP",
    ],
    eyebrow: "BTEUP 2026 · RESULT CHECK GUIDE",
    headline: "BTEUP semester result —",
    headlineAccent: "from result page to marksheet.",
    lead: "BTEUP semester results typically release 2 months after the exam cycle closes — odd-semester results in August / September, even-semester results in February / March. The result includes subject-wise marks, grades, attendance, and pass / fail status per subject. This page walks through the check flow, marksheet download, and what to do if you spot an error.",
    quickStats: [
      { label: "Released", value: "~2 months post-exam", sub: "Watch bteup.org.in" },
      { label: "Where", value: "bteup.org.in", sub: "Result tab · student portal" },
      { label: "Marksheet", value: "Downloadable PDF", sub: "Hard copy from BIPE later" },
      { label: "Pass mark", value: "Per subject · varies", sub: "Typically 33% theory, 40% practical" },
    ],
    steps: [
      {
        n: "01",
        title: "Go to bteup.org.in on result day",
        body: "Visit the official BTEUP portal. On result-declaration day, look for the prominent 'Result' link on the homepage. The portal is heavily loaded on the first few hours — try off-peak (late evening / very early morning) if you face timeouts.",
      },
      {
        n: "02",
        title: "Log in with your roll number + password",
        body: "Use your BTEUP student portal credentials (same as admit card download). Some result years also expose a 'Roll Number Only' search where you don't need the password — useful if you forgot login details.",
      },
      {
        n: "03",
        title: "View subject-wise marks and grade",
        body: "Your result shows: each subject with internal marks + external marks + total marks + grade (A+, A, B, C, etc., or pass/fail). Below the subject list, look for the SGPA (semester GPA) and overall pass / re-appear status. Save a PDF copy immediately.",
      },
      {
        n: "04",
        title: "Download the provisional marksheet PDF",
        body: "The portal gives you a provisional digital marksheet — a PDF that's good for showing in interviews, applying for higher studies (lateral entry to B.Tech, etc.), and most administrative use cases. The official paper marksheet comes through BIPE about 4-6 months after results — collect it from the academic office.",
      },
      {
        n: "05",
        title: "Apply for grace marks (if you need 1-3 marks to pass)",
        body: "If you fall just short of passing in 1-2 subjects, you can apply for grace marks within 3 weeks of result declaration. Grace marks rules vary year to year — typically 1-3 marks across not more than 2 subjects. Talk to your branch in-charge at BIPE before applying; we can advise whether grace will save the subject or whether supplementary is the better path.",
      },
      {
        n: "06",
        title: "Apply for revaluation (if you suspect a marking error)",
        body: "Revaluation is a paid re-check of your answer sheet by a different examiner. Costs ~₹500 per subject, takes 8-12 weeks. Apply within 3 weeks of result declaration via the BTEUP portal. Use sparingly — revaluation rarely changes the result by more than 5-7 marks; if you're 15+ marks short, supplementary is the realistic path.",
      },
    ],
    faqs: [
      {
        q: "When will BTEUP 2026 semester results be declared?",
        a: "Approximately 2 months after each cycle closes. Odd-semester results typically declare in August / September 2026; even-semester results in February / March 2027. Exact dates announced on bteup.org.in. Allow extra time for any cycle disrupted by holidays or special circumstances.",
      },
      {
        q: "What does 'CT' or 'AB' on my BTEUP result mean?",
        a: "CT = 'Carry Trial' (i.e., failed but eligible to re-attempt in supplementary). AB = 'Absent' (you didn't appear; treated as backlog). Both count as backlogs — you need to clear them in the next supplementary cycle to graduate on time. Reach out to your branch in-charge at BIPE to plan the supplementary attempt.",
      },
      {
        q: "I think there's an error in my marks — what should I do?",
        a: "First, recount your marks (internal + external + practical) — sometimes the displayed total is wrong but the components are right. If you confirm an error after careful checking, two paths: (a) Re-totalling — a free correction request via your branch in-charge, takes 2-3 weeks, fixes arithmetic errors only. (b) Revaluation — paid full re-check (~₹500/subject), 8-12 weeks, re-evaluates the answer sheet content. Pick (a) for arithmetic, (b) for substantive marks dispute.",
      },
      {
        q: "How do I download the official BTEUP marksheet?",
        a: "Two versions exist: (1) The provisional digital marksheet — PDF download from the student portal immediately on result day. Good for interviews and most administrative needs. (2) The official paper marksheet — issued by BTEUP through your institute (BIPE) about 4-6 months after results. Collect it from BIPE's academic office; it carries the official BTEUP seal and is required for transcript requests, B.Tech lateral-entry verification, and government job applications.",
      },
      {
        q: "Can I get a duplicate marksheet if I lose mine?",
        a: "Yes. Apply via the BTEUP duplicate marksheet form (available at bteup.org.in or your institute's academic office). Fee ~₹500. Process takes 4-6 weeks. Carry the duplicate to interviews / verification along with an affidavit if requested. Originals can also be re-issued for ~₹1,000 in case of physical damage / loss.",
      },
      {
        q: "What if I have a backlog after the diploma?",
        a: "You CANNOT graduate with active backlogs. Clear them through supplementary cycles (held twice a year — July for odd-sem backlogs, January for even-sem backlogs). Up to 2 backlogs per cycle, supplementary fees apply per subject. BIPE's academic office tracks every student's backlog status — talk to your branch in-charge for a personalised supplementary plan.",
      },
    ],
    ctaTitle: "Result not what you hoped?",
    ctaBody: "BIPE's academic mentors review every student's semester result personally. We help you decide between grace marks, revaluation, supplementary, or simply harder prep for next cycle. Drop into the academic office or WhatsApp +91-9198646464 for a confidential consultation.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "bteup-exam-fees-payment",
    shortTitle: "BTEUP Exam Fees Payment",
    title: "BTEUP Exam Fees Payment 2026 · Online Portal Guide | BIPE 4455",
    description: "Pay your BTEUP semester exam fees online — portal guide, fee structure (theory + practical + supplementary), late-fee window, payment-failed troubleshooting.",
    keywords: [
      "BTEUP exam fees",
      "BTEUP fees payment",
      "BTEUP exam fee online",
      "BTEUP semester fee",
      "BTEUP fee receipt download",
      "BTEUP एग्जाम फीस",
      "BTEUP fee payment kaise kare",
    ],
    eyebrow: "BTEUP 2026 · EXAM FEES PAYMENT",
    headline: "BTEUP exam fee payment —",
    headlineAccent: "portal, deadlines, troubleshooting.",
    lead: "BTEUP exam fees are paid online per cycle through the official portal at bteup.org.in. The fee covers theory, practical, and administrative components, with a separate fee for supplementary subjects and revaluation requests. This page walks through the payment flow, the typical fee structure, deadlines (including late-fee window), and what to do if a payment fails.",
    quickStats: [
      { label: "Portal", value: "bteup.org.in", sub: "Student fee section" },
      { label: "Payment methods", value: "UPI · card · netbanking", sub: "Online only" },
      { label: "Per-cycle window", value: "~3 weeks", sub: "Plus a late-fee window" },
      { label: "Receipt", value: "Downloadable PDF", sub: "Keep — print 2 copies" },
    ],
    steps: [
      {
        n: "01",
        title: "Log in to your BTEUP student portal",
        body: "Visit bteup.org.in and log in with your roll number + password. Same credentials as admit card / result download. If you forgot the password, use 'Forgot Password' — the reset link goes to your registered mobile.",
      },
      {
        n: "02",
        title: "Navigate to the 'Examination Fees' or 'Fee Payment' section",
        body: "Inside the portal, look for a sub-menu labelled 'Examination', 'Fee Payment', or 'Pay Fees'. The cycle in question (odd / even / supplementary) is auto-selected based on the active fee window. Confirm you're paying for the right cycle.",
      },
      {
        n: "03",
        title: "Review your fee breakdown",
        body: "The portal shows: theory fee per subject + practical fee per subject + central administrative fee + (for supplementary) per-paper supplementary fee. Verify the subject count matches your registration. If any subject is missing, do NOT pay — first get the registration corrected via your branch in-charge.",
      },
      {
        n: "04",
        title: "Choose a payment method and pay",
        body: "BTEUP accepts UPI (most reliable), debit / credit card, and net banking. UPI is fastest and least likely to fail. Avoid paying during peak hours (last 48 hours of the fee window) — the portal often slows down. Pay 1-2 weeks before deadline to avoid the slow zone.",
      },
      {
        n: "05",
        title: "Download the fee receipt and verify status",
        body: "Once payment succeeds, the portal generates a fee receipt PDF with a unique transaction reference. Download it, print 2 copies, and save the PDF to your phone + email it to yourself. Wait 24 hours, then re-log in and confirm 'Fee Paid' status against the cycle.",
      },
      {
        n: "06",
        title: "If payment fails — raise a refund / re-attempt request",
        body: "If the portal deducted money but shows 'Payment Failed' or 'Pending' for more than 24 hours, do NOT pay again. Raise a ticket via the BTEUP portal's 'Payment Failure' form with your transaction ID, bank, date, amount. BTEUP reconciles within 5-7 working days. Double payments take weeks to refund — avoid the loop.",
      },
    ],
    faqs: [
      {
        q: "What is the BTEUP exam fee for 2026?",
        a: "Fees vary by semester, branch, and number of practical subjects. As a rough indicator: theory fee ~₹100-200 per subject + practical fee ~₹150-250 per subject + central administrative fee ~₹300-500 per cycle. Total per cycle is typically ₹1,200-2,500 depending on subject count. Supplementary fees are per-paper and additional. Check the current cycle's official fee notification at bteup.org.in for the exact amount.",
      },
      {
        q: "When is the BTEUP fee payment deadline?",
        a: "Approximately 4-6 weeks before each exam cycle starts. There's also a LATE-FEE window after the regular deadline — typically 2 weeks long, with an additional ~₹500-1,000 late fee added. After the late-fee window closes, you CANNOT pay or attempt the exam in that cycle. Plan to pay 1-2 weeks before the regular deadline.",
      },
      {
        q: "I missed the BTEUP fee payment deadline — what now?",
        a: "If the late-fee window is still open, pay with the late fee added. If even the late-fee window has closed, you cannot attempt the current cycle — you'll wait for the supplementary cycle (held 2-3 months later). Talk to your branch in-charge at BIPE for personalised guidance.",
      },
      {
        q: "My BTEUP payment failed but money was deducted — what to do?",
        a: "Wait 24 hours first — most reconcile automatically. After 24 hours, log into the portal and check the payment status. If it still shows 'Failed' or 'Pending', raise a ticket via the 'Payment Failure' form with your transaction ID, bank, date, amount, and a screenshot of your bank statement showing the debit. BTEUP reconciles within 5-7 working days. DO NOT pay again — the second payment will be flagged and refund takes weeks.",
      },
      {
        q: "Where do I get my BTEUP fee receipt for office records?",
        a: "Download the PDF receipt from the BTEUP portal immediately after a successful payment. The PDF is your official record — print 2 copies, save to email + cloud storage. BIPE's academic office also keeps an institute-side payment record, so even if you lose your copy, BIPE can confirm payment status for you.",
      },
      {
        q: "Does BIPE pay BTEUP fees on my behalf?",
        a: "No. BTEUP exam fees are paid by the student directly through the student portal. BIPE pays separate institute-side affiliation and registration fees to BTEUP, but YOUR per-cycle exam fee is your responsibility. We provide reminders ahead of each fee window and help you troubleshoot if a payment fails.",
      },
    ],
    ctaTitle: "Payment giving you trouble?",
    ctaBody: "BIPE's academic and accounts office helps current students through any BTEUP fee-payment issue — failed transactions, missing receipts, late-fee disputes. Drop in during 9am-5pm Mon-Sat or WhatsApp +91-9198646464.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "bteup-student-registration",
    shortTitle: "BTEUP Student Registration",
    title: "BTEUP Student Registration 2026 · Annual Process + Documents | BIPE 4455",
    description: "BTEUP annual student registration 2026 — how BIPE handles registration for every diploma student each year, what you need to submit, and how the BTEUP student record links to scholarships and exams.",
    keywords: [
      "BTEUP student registration",
      "BTEUP registration 2026",
      "BTEUP annual registration",
      "BTEUP enrollment",
      "BTEUP roll number registration",
      "BTEUP रजिस्ट्रेशन",
      "polytechnic student registration UP",
    ],
    eyebrow: "BTEUP 2026 · STUDENT REGISTRATION",
    headline: "BTEUP student registration —",
    headlineAccent: "annual, mandatory, BIPE-coordinated.",
    lead: "Every diploma student affiliated with BTEUP must be registered annually at the start of each academic session. At BIPE, the registration is coordinated by the academic office — we collect your documents, submit them to BTEUP, and pass back your student credentials (roll number, login). This page explains what you submit, when, and how the registration unlocks downstream activities like exam attempts and scholarship eligibility.",
    quickStats: [
      { label: "Frequency", value: "Annual", sub: "Every academic session" },
      { label: "Coordinated by", value: "BIPE academic office", sub: "On behalf of students" },
      { label: "Your part", value: "Submit documents", sub: "First 2 weeks of session" },
      { label: "Unlocks", value: "Roll no. + portal login", sub: "Plus exam + scholarship access" },
    ],
    steps: [
      {
        n: "01",
        title: "Receive the registration packet from BIPE's academic office",
        body: "Within the first 2 weeks of each session, the academic office distributes the BTEUP registration packet to all students. It includes: registration form (pre-filled with your basic details from admission records), document checklist, fee notification (if applicable), and a deadline-by-when calendar.",
      },
      {
        n: "02",
        title: "Gather the documents on the checklist",
        body: "Standard documents: Class 10 marksheet (original + 2 photocopies), Aadhaar (original + photocopy), JEECUP rank card (original + photocopy), passport-size photographs (4-6 copies), caste certificate (if applicable), domicile certificate (if applicable). The packet specifies exactly what's needed for YOUR student category (new admission vs. second/third year continuation).",
      },
      {
        n: "03",
        title: "Submit to the academic office within the deadline",
        body: "BIPE typically allows 7-10 days from packet distribution to document submission. The academic office checks each submission against the checklist on the spot — if anything's missing, you go re-fetch it. Don't submit in the last 2 days; rush submissions sometimes have errors that delay the institute-side BTEUP submission.",
      },
      {
        n: "04",
        title: "Wait for BIPE to submit the institute-batch to BTEUP",
        body: "BIPE's academic office consolidates all student documents and submits a batch to BTEUP via the institute portal. This batch submission happens 3-5 weeks after the session starts. BTEUP processes the batch over the following 2-4 weeks — verifying each student's documents and issuing roll numbers.",
      },
      {
        n: "05",
        title: "Collect your BTEUP credentials from BIPE",
        body: "Once BTEUP has issued your roll number + portal login credentials, BIPE distributes them to students — usually via the academic office or class teachers. Your BTEUP roll number is what you'll use for the rest of your diploma: for admit cards, results, fee payment, certificate issuance.",
      },
      {
        n: "06",
        title: "Verify your BTEUP record and link Family ID (if applicable)",
        body: "Log in to bteup.org.in with the credentials BIPE issued. Verify every detail — name spelling, branch, semester. If anything is wrong, raise a correction request immediately through BIPE's academic office; corrections take 4-8 weeks and you DON'T want them lingering. Once verified, link your Family ID (see /bteup-family-id-registration) to unlock state scholarships.",
      },
    ],
    checklist: {
      eyebrow: "Documents BIPE typically needs",
      heading: "What to keep ready for registration",
      intro: "BIPE distributes the exact checklist with the registration packet each session — the list below is the standard set. Have these ready 2 weeks before the session starts.",
      items: [
        "Class 10 marksheet + certificate (original + 2 self-attested photocopies)",
        "Aadhaar card (original + photocopy)",
        "JEECUP rank card / allotment letter (for new admissions)",
        "Last semester's BTEUP marksheet (for second / third year continuation)",
        "4-6 recent passport-size colour photographs (white background)",
        "Caste certificate (if you claim SC / ST / OBC reservation)",
        "Domicile / residence certificate (UP-quota claimants)",
        "Income certificate (if claiming state scholarship)",
        "Family ID (12-digit) — to link in your BTEUP record",
        "Aadhaar-linked active mobile number",
        "Email address (login + future notifications)",
        "Self-declaration of attendance + anti-ragging (BIPE provides format)",
      ],
    },
    faqs: [
      {
        q: "Why does BTEUP registration happen every year?",
        a: "BTEUP registers each student per academic year — this confirms continued enrolment, updates your branch + semester record, and renews your portal access for exam fee payment and result viewing. It's also the gate for the year's state scholarship cycle. Without annual registration, you can't appear for that year's BTEUP exams or claim scholarships through the linked student record.",
      },
      {
        q: "Do I have to do anything on the BTEUP portal myself during registration?",
        a: "For first-year students: no — BIPE handles the institute-side submission. You just submit documents to BIPE's academic office. For second/third year students: BIPE may ask you to update your own profile on the BTEUP student portal as part of continuation (link Family ID, update mobile / address). Either way, BIPE's academic office tells you exactly what's needed each year.",
      },
      {
        q: "What if I miss BIPE's document submission deadline?",
        a: "Talk to the academic office immediately — don't wait. BIPE generally allows late submission for 1-2 weeks past the deadline, possibly with a small administrative fee. But the institute-side BTEUP batch submission has a hard cutoff; once that's gone, your registration is delayed by an entire semester (or you miss the year's exam cycle). Don't drift past the deadline.",
      },
      {
        q: "How long does it take to receive my BTEUP roll number?",
        a: "From session start to roll-number issuance: roughly 6-10 weeks. BIPE distributes registration packets in weeks 1-2, collects documents in week 2-3, submits institute-batch in weeks 4-5, BTEUP processes in weeks 6-8, BIPE distributes credentials in weeks 9-10. You won't have a BTEUP roll number for the first 2 months of your first year — that's normal.",
      },
      {
        q: "Can I switch branches after BTEUP registration?",
        a: "Branch transfers within the first 2 weeks of the session are usually possible (subject to branch capacity and BIPE's discretion). After BTEUP registration is submitted, a branch switch requires BTEUP-side approval and is rarely granted — typically only for documented medical or family reasons. Pick your branch carefully at admission time.",
      },
      {
        q: "Where do I check if my BTEUP registration is complete?",
        a: "Once BIPE issues your roll number + portal credentials, log in to bteup.org.in. Your profile page shows the current registration status. If it says 'Active' or 'Registered', you're good. If it says 'Pending', talk to the BIPE academic office — sometimes individual documents need clarification with BTEUP.",
      },
    ],
    ctaTitle: "Joining BIPE this session?",
    ctaBody: "BIPE's academic office hand-holds every new student through BTEUP registration in the first 2 weeks. We tell you what to bring, when to submit, and confirm your registration is in BTEUP's system. WhatsApp +91-9198646464 ahead of joining and we'll send the registration checklist for your branch.",
  },
];

export function bteupResourceBySlug(slug: string): BteupResource | undefined {
  return BTEUP_RESOURCES.find((r) => r.slug === slug);
}

export function otherBteupResources(currentSlug: string): BteupResource[] {
  return BTEUP_RESOURCES.filter((r) => r.slug !== currentSlug);
}
