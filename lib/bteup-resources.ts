/**
 * BTEUP 2026 Resources hub — typed content for 6 procedural pages.
 *
 * Phase 3 of the JEECUP/BTEUP content sprint. These pages target
 * the procedural keyword cluster around the Board of Technical
 * Education, Uttar Pradesh (BTEUP, bteup.ac.in) — the regulatory
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
  /**
   * Optional "deep-link to specific content" block. Used on the BTEUP
   * syllabus page to surface the per-branch syllabus pages that live at
   * /courses/[branch] — those pages have the actual semester-by-semester
   * subject lists, but were buried (only mentioned in step 06's prose).
   * Adding an explicit linked block right after quickStats so visitors
   * searching "BTEUP syllabus" can jump straight to their branch.
   */
  branchLinks?: {
    eyebrow: string;
    heading: string;
    intro?: string;
    branches: {
      href: string;
      code: string;
      label: string;
      summary?: string;
    }[];
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

// Subject counts are derived from the branch curricula rather than typed
// here — see the note on SUBJECT_COUNTS in lib/branchContent.ts.
import { SUBJECTS_PER_SEMESTER } from "@/lib/branchContent";

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
      { label: "BTEUP linkage", value: "Via student portal", sub: "bteup.ac.in student login" },
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
        body: "Visit bteup.ac.in. Use the Student Login (separate from the institute / faculty login). Your credentials are issued by BIPE after annual registration — if you don't have login details, ask your branch in-charge. First-year students don't have credentials on day one — the roll number and portal login typically reach you roughly 6-10 weeks after the session starts, once BTEUP has processed BIPE's institute-batch registration (see /bteup-student-registration). Family ID linking has to wait until then.",
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
    ctaBody: "Our placement and student-welfare cell helps current BIPE students through the linking flow — returning students at the start of each session, first-years as soon as their BTEUP login is issued. WhatsApp +91-7310077788 with your name + branch + year and we'll walk you through it. Free, EN / हिंदी.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "bteup-admit-card-download",
    shortTitle: "BTEUP Admit Card",
    title: "BTEUP Admit Card 2026 · Semester Exam Download Guide | BIPE 4455",
    description: "Download your BTEUP semester exam admit card from bteup.ac.in — login flow, verification steps, troubleshooting common errors. Released approximately 2 weeks before each exam cycle.",
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
    lead: "BTEUP semester exam admit cards are released on bteup.ac.in approximately 2 weeks before each exam cycle (typically late October for odd-sem theory, April for even-sem theory). This page walks through the download flow, the details to verify against your registration, and what to do if something doesn't match.",
    quickStats: [
      { label: "Released", value: "~2 weeks pre-exam", sub: "Watch bteup.ac.in" },
      { label: "Login", value: "Student portal", sub: "Roll number + password" },
      { label: "Per cycle", value: "Separate card", sub: "Odd / even / practical / supp." },
      { label: "Format", value: "PDF · printable", sub: "Carry hard copy to exam" },
    ],
    steps: [
      {
        n: "01",
        title: "Open the official BTEUP portal",
        body: "Visit bteup.ac.in. On the homepage, look for the 'Student Login' or 'Admit Card' link prominent during the release window. Do NOT use third-party sites that claim to host BTEUP admit cards — these are usually outdated or fraudulent.",
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
        a: "Approximately 2 weeks before each exam cycle begins. Odd-semester theory admit cards typically release in late October, before the November papers; even-semester theory in April, before the papers that run from late April into May. Practical exam admit cards release ~10 days before practicals start (which can be at the institute itself, not a central centre). Watch the bteup.ac.in homepage banner for exact dates.",
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
        a: "JEECUP admit card is for the entrance exam (one-time, before admission). BTEUP admit cards are for the semester exams during your diploma (twice a year, every year of the diploma). Different portals, different login credentials. JEECUP uses jeecup.admissions.nic.in; BTEUP uses bteup.ac.in.",
      },
    ],
    ctaTitle: "Semester exam coming up?",
    ctaBody: "BIPE's exam cell helps every BTEUP-registered student with admit-card download, centre allocation, and any portal issues during exam season. Visit the admin block or WhatsApp +91-7310077788 ahead.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "bteup-semester-exam-dates-2026",
    shortTitle: "BTEUP Semester Exam Dates",
    title: "BTEUP Semester Exam Dates 2026 · Odd + Even Cycle Calendar | BIPE 4455",
    description: "BTEUP semester exam calendar 2026 — odd semester (Nov) and even semester (late Apr-May) windows, practical schedule, supplementary cycle. Verified from bteup.ac.in.",
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
    lead: "BTEUP runs two main exam cycles a year — odd semester (theory typically in November, covering Sem 1, 3, 5) and even semester (theory from late April into May, covering Sem 2, 4, 6). Plus practical exams within each cycle and a supplementary cycle for backlog clearance. Specific 2026 dates are published per cycle by BTEUP — this page lays out the typical calendar pattern + where to find the latest schedule.",
    quickStats: [
      { label: "Odd sem theory", value: "November", sub: "Sem 1, 3, 5 · annual" },
      { label: "Even sem theory", value: "Apr – May", sub: "Sem 2, 4, 6 · annual" },
      { label: "Practical window", value: "Pre-theory · 2 weeks", sub: "At institute · BIPE Phoolpur" },
      { label: "Supplementary", value: "After main result", sub: "January after the December result · July after the June one" },
    ],
    steps: [
      {
        n: "01",
        title: "Check the BTEUP official calendar (the only authoritative source)",
        body: "Visit bteup.ac.in's 'Notice Board' or 'Examination' section. BTEUP publishes the per-cycle calendar approximately 6 weeks before each cycle starts. Specific 2026 dates may shift from year to year. Third-party sites often republish stale or guessed dates — go to the source.",
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
        body: "Most diploma students underestimate the exam-prep crunch. Once you know your first exam date, work backwards in 5-day study blocks per subject. Across BIPE's five branches each semester carries six or seven subjects, theory and lab together, dropping to five in the lightest final semester. Start serious revision 4-6 weeks before Day 1 of the cycle.",
      },
      {
        n: "05",
        title: "Track results + plan for supplementary if needed",
        body: "Results typically release about six weeks after the cycle closes. If you have a backlog (failed subject or shortage of attendance), the supplementary cycle gives you a re-attempt. Supplementary registration is fee-paid and time-bound — usually a 2-week window starting ~1 week after main results.",
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
        a: "Only on bteup.ac.in's official Notice Board or Examination section. The board uploads the per-cycle date sheet about 6 weeks before each cycle starts. Do NOT rely on dates listed on Careers360, Shiksha, or aggregator sites — those frequently lag or guess.",
      },
      {
        q: "Are odd and even semester exams in the same month every year?",
        a: "Roughly. Odd-semester theory usually runs in November (sometimes shifted by a few weeks due to elections, public holidays, or pandemic-style disruptions). Even-semester theory usually runs from late April into May. Exact dates float year to year — always check the current-cycle calendar before planning.",
      },
      {
        q: "What if I have a personal emergency on an exam date?",
        a: "Inform BIPE's exam coordinator IMMEDIATELY — same day, with documentation (medical certificate, family emergency proof). BTEUP allows attempt-shifting in genuine cases via the supplementary cycle. Your fee for the missed paper isn't refundable, but the attempt isn't lost — it's deferred. Without notification + documentation, the missed paper counts as an absent / backlog.",
      },
      {
        q: "When do BTEUP practical exams happen?",
        a: "About 2 weeks BEFORE the theory exam window. Practicals are at YOUR institute (BIPE Phoolpur for BIPE students) under an external BTEUP examiner. Every semester's plan mixes lab and workshop subjects in with the theory papers, and each of those carries its own practical exam. You'll know your practical date 3-4 weeks ahead via BIPE's notice board.",
      },
      {
        q: "What is the BTEUP supplementary exam cycle?",
        a: "A re-attempt window for students who failed a subject (got 'CT' or 'AB' grade) or fell short on attendance. Held twice a year — January, after the December odd-semester result, and July, after the June even-semester result (for even-sem backlogs). Supplementary registration is fee-paid (~₹200-500 per subject), and the window is short (~2 weeks). Track BTEUP notifications carefully.",
      },
    ],
    ctaTitle: "Worried about your exam prep?",
    ctaBody: "BIPE conducts internal pre-board exams 3-4 weeks before each BTEUP cycle, plus revision classes and faculty doubt-clearing sessions in the final fortnight. Drop into the academic office or WhatsApp +91-7310077788 to discuss your specific subject concerns.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "bteup-result-check",
    shortTitle: "BTEUP Result Check",
    title: "BTEUP Result 2026 · Semester Result Check + Grace / Revaluation | BIPE 4455",
    description: "Check your BTEUP semester result at bteup.ac.in — login, marksheet download, understand grades, apply for grace marks or revaluation. Result timeline typically ~6 weeks post-exam.",
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
    lead: "BTEUP semester results follow about six weeks after the exam cycle closes — odd-semester results in December, even-semester results in June. The result includes subject-wise marks, grades, attendance, and pass / fail status per subject. This page walks through the check flow, marksheet download, and what to do if you spot an error.",
    quickStats: [
      { label: "Released", value: "~6 weeks post-exam", sub: "Watch bteup.ac.in" },
      { label: "Where", value: "bteup.ac.in", sub: "Result tab · student portal" },
      { label: "Marksheet", value: "Downloadable PDF", sub: "Hard copy from BIPE later" },
      { label: "Pass mark", value: "40% in each component", sub: "Internal and external counted separately" },
    ],
    steps: [
      {
        n: "01",
        title: "Go to bteup.ac.in on result day",
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
        a: "About six weeks after each cycle closes. Odd-semester theory runs in November and the result declares in December; even-semester theory runs from late April into May and the result declares in June. Exact dates announced on bteup.ac.in. Allow extra time for any cycle disrupted by holidays or special circumstances.",
      },
      {
        q: "What does 'CT' or 'AB' on my BTEUP result mean?",
        a: "CT = 'Carry Trial' (i.e., failed but eligible to re-attempt in supplementary). AB = 'Absent' (you didn't appear; treated as backlog). Both count as backlogs — you need to clear them at the next back-paper sitting to graduate on time. Reach out to your branch in-charge at BIPE to plan the supplementary attempt.",
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
        a: "Yes. Apply via the BTEUP duplicate marksheet form (available at bteup.ac.in or your institute's academic office). Fee ~₹500. Process takes 4-6 weeks. Carry the duplicate to interviews / verification along with an affidavit if requested. Originals can also be re-issued for ~₹1,000 in case of physical damage / loss.",
      },
      {
        q: "What if I have a backlog after the diploma?",
        a: "You CANNOT graduate with active backlogs. Clear them at the back-paper sittings, which run inside the two main exam windows rather than as a third standalone cycle — the January sitting follows the December odd-semester result, the July sitting follows the June even-semester result. BTEUP does not publish a maximum number of back subjects per sitting — its own fee schedule charges a flat fee for up to two and a per-subject fee beyond that. What is capped is TIME: a 3-year diploma must be completed within 6 academic sessions. BIPE's academic office tracks every student's backlog status — talk to your branch in-charge for a personalised supplementary plan.",
      },
    ],
    ctaTitle: "Result not what you hoped?",
    ctaBody: "BIPE's academic mentors review every student's semester result personally. We help you decide between grace marks, revaluation, supplementary, or simply harder prep for next cycle. Drop into the academic office or WhatsApp +91-7310077788 for a confidential consultation.",
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
    lead: "BTEUP exam fees are paid online per cycle through the official portal at bteup.ac.in. The fee covers theory, practical, and administrative components, with a separate fee for supplementary subjects and revaluation requests. This page walks through the payment flow, the typical fee structure, deadlines (including late-fee window), and what to do if a payment fails.",
    quickStats: [
      { label: "Portal", value: "bteup.ac.in", sub: "Student fee section" },
      { label: "Payment methods", value: "UPI · card · netbanking", sub: "Online only" },
      { label: "Per-cycle window", value: "~3 weeks", sub: "Plus a late-fee window" },
      { label: "Receipt", value: "Downloadable PDF", sub: "Keep — print 2 copies" },
    ],
    steps: [
      {
        n: "01",
        title: "Log in to your BTEUP student portal",
        body: "Visit bteup.ac.in and log in with your roll number + password. Same credentials as admit card / result download. If you forgot the password, use 'Forgot Password' — the reset link goes to your registered mobile.",
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
        a: "Fees vary by semester, branch, and number of practical subjects. As a rough indicator: theory fee ~₹100-200 per subject + practical fee ~₹150-250 per subject + central administrative fee ~₹300-500 per cycle. Total per cycle is typically ₹1,200-2,500 depending on subject count. Supplementary fees are per-paper and additional. Check the current cycle's official fee notification at bteup.ac.in for the exact amount.",
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
    ctaBody: "BIPE's academic and accounts office helps current students through any BTEUP fee-payment issue — failed transactions, missing receipts, late-fee disputes. Drop in during 9am-5pm Mon-Sat or WhatsApp +91-7310077788.",
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
        body: "Standard documents: Class 10 marksheet (original + 2 photocopies), Aadhaar (original + 2 self-attested photocopies), JEECUP rank card (original + photocopy), passport-size photographs (4-6 copies), caste certificate (if applicable), domicile certificate (if applicable). The packet specifies exactly what's needed for YOUR student category (new admission vs. second/third year continuation).",
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
        body: "Log in to bteup.ac.in with the credentials BIPE issued. Verify every detail — name spelling, branch, semester. If anything is wrong, raise a correction request immediately through BIPE's academic office; corrections take 4-8 weeks and you DON'T want them lingering. Once verified, link your Family ID (see /bteup-family-id-registration) to unlock state scholarships.",
      },
    ],
    checklist: {
      eyebrow: "Documents BIPE typically needs",
      heading: "What to keep ready for registration",
      intro: "BIPE distributes the exact checklist with the registration packet each session — the list below is the standard set. Have these ready 2 weeks before the session starts.",
      items: [
        "Class 10 marksheet + certificate (original + 2 self-attested photocopies)",
        "Aadhaar card (original + 2 self-attested photocopies)",
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
        a: "Once BIPE issues your roll number + portal credentials, log in to bteup.ac.in. Your profile page shows the current registration status. If it says 'Active' or 'Registered', you're good. If it says 'Pending', talk to the BIPE academic office — sometimes individual documents need clarification with BTEUP.",
      },
    ],
    ctaTitle: "Joining BIPE this session?",
    ctaBody: "BIPE's academic office hand-holds every new student through BTEUP registration in the first 2 weeks. We tell you what to bring, when to submit, and confirm your registration is in BTEUP's system. WhatsApp +91-7310077788 ahead of joining and we'll send the registration checklist for your branch.",
  },

  // ─────────────────────────────────────────────────────────────────
  // Phase 5 expansion · May 2026 · keyword-gap fill
  // Six additional procedural pages targeting BTEUP search clusters
  // that the original Phase 3 batch didn't cover. Highest-volume
  // gaps first (syllabus, back-paper, grading, affiliated colleges,
  // migration, duplicate marksheet).
  // ─────────────────────────────────────────────────────────────────

  {
    slug: "bteup-syllabus-2026",
    shortTitle: "BTEUP Syllabus 2026",
    title: "BTEUP Syllabus 2026 · Branch-wise + Semester-wise Curriculum | BIPE 4455",
    description: "Complete BTEUP 2026 syllabus — branch-by-branch (Mechanical, Electrical, Civil, CSE, Dairy) and semester-by-semester. Download official PDFs, theory + practical breakdown, NEP-aligned changes.",
    keywords: [
      "BTEUP syllabus",
      "BTEUP syllabus 2026",
      "BTEUP polytechnic syllabus",
      "BTEUP curriculum",
      "polytechnic syllabus UP",
      "BTEUP semester syllabus",
      "BTEUP सिलेबस",
      "बीटीईयूपी पाठ्यक्रम",
    ],
    eyebrow: "BTEUP 2026 · SYLLABUS GUIDE",
    headline: "BTEUP 2026 syllabus —",
    headlineAccent: "branch + semester, end-to-end.",
    lead: "BTEUP publishes a 6-semester syllabus for each of its 40+ affiliated diploma branches. This page covers the structural pattern of the syllabus (theory + practical + internal weightage), where to download official PDFs, and the branch-by-branch contour for BIPE's 5 BTEUP-affiliated branches (Mechanical, Electrical, Civil, CSE, Dairy) — the first four of which admit new students in 2026-27, Dairy having taken its last intake in 2025-26.",
    quickStats: [
      { label: "Total semesters", value: "6", sub: "3 years · 2 semesters per year" },
      { label: "Per branch", value: `${SUBJECTS_PER_SEMESTER} subjects`, sub: "Per semester · theory + lab together" },
      { label: "Marking split", value: "60 external + 40 internal", sub: "Per theory subject · practicals inverted" },
      { label: "Official source", value: "bteup.ac.in", sub: "Notice Board · Curriculum tab" },
    ],
    // Branch-specific syllabus content (semester-by-semester subject lists)
    // lives at /courses/[branch]. Surfacing it explicitly here because the
    // earlier version of this page only mentioned it in step 06's prose,
    // and visitors searching "BTEUP syllabus" complained that the page
    // didn't actually have the syllabus.
    branchLinks: {
      eyebrow: "Skip ahead · branch syllabus",
      heading: "Per-branch syllabus on BIPE",
      intro:
        "If you already know your branch, jump straight to its 6-semester subject list. These pages show the theory and lab subjects for each semester — subject names, curated by BIPE's faculty from the official BTEUP gazette. Subject codes and the marks split change with each gazette revision, so every branch page links straight to bteup.ac.in instead.",
      branches: [
        {
          href: "/courses/mechanical-engineering-production",
          code: "343",
          label: "Mechanical Engineering (Production)",
          summary: "Thermodynamics, machining, manufacturing processes, CAD/CAM.",
        },
        {
          href: "/courses/electrical-engineering",
          code: "328",
          label: "Electrical Engineering",
          summary: "Machines, power systems, control, measurement instruments.",
        },
        {
          href: "/courses/civil-engineering",
          code: "322",
          label: "Civil Engineering",
          summary: "Surveying, structural design, materials, hydraulics, transportation.",
        },
        {
          href: "/courses/computer-science-engineering",
          code: "355",
          label: "Computer Science & Engineering",
          summary: "Data structures, OS, networking, web, AI/IoT (NEP additions).",
        },
        {
          href: "/courses/dairy-engineering",
          code: "327",
          label: "Dairy Engineering",
          summary: "Milk processing, plant operations, refrigeration, food safety.",
        },
      ],
    },
    steps: [
      {
        n: "01",
        title: "Open the BTEUP official syllabus index",
        body: "Visit bteup.ac.in. From the navigation, choose 'Curriculum' or 'Syllabus' (the menu label changes year to year). The syllabus index lists all 40+ diploma programmes alphabetically. Use Ctrl+F (or browser search) to find your branch quickly.",
      },
      {
        n: "02",
        title: "Pick your branch + intake year",
        body: "Syllabus follows the intake-year cohort. If you joined in 2024 batch, your 6-semester syllabus is the 2024 syllabus — not the latest. BTEUP locks the syllabus for your cohort at intake time. Pick the matching year carefully.",
      },
      {
        n: "03",
        title: "Download the semester-wise PDFs",
        body: `Each semester is a separate PDF. The first page lists every subject in that semester — ${SUBJECTS_PER_SEMESTER} of them across BIPE's branches, theory and lab together — with subject codes, periods per week, internal + external marks, and pass percentage. The rest of the PDF is the topic-by-topic breakdown for each subject.`,
      },
      {
        n: "04",
        title: "Map the theory + practical weightage per subject",
        body: "On the current BTEUP scheme a 100-mark theory subject is 60 external (a 3-hour board paper) + 40 internal. Practical subjects are the inverse: 40 external + 60 internal. You must clear at least 40% in each component separately — a strong sessional score will not carry a failed board paper, and vice versa. Internal marks come from class tests, assignments and attendance, so practicals are won by lab regularity and theory by exam-week revision.",
      },
      {
        n: "05",
        title: "Check the 2026 NEP-aligned revisions",
        body: "BTEUP began aligning select branches to NEP 2020 from the 2024-25 intake onwards. Changes include: a new 'Multi-disciplinary' elective slot in semester 4, AI / IoT topics in CSE syllabus, sustainable-engineering modules in Civil and Mechanical. If you're a 2025 or 2026 intake, your syllabus reflects these updates.",
      },
      {
        n: "06",
        title: "Cross-reference with BIPE's branch-specific page",
        body: "BIPE publishes a curated semester-by-semester syllabus summary for each of its 5 branches at /courses/[branch] (e.g., /courses/civil-engineering). The summary is shorter than the official BTEUP PDF but easier to scan when you're picking branches at JEECUP counselling — note that four of the five admit in 2026-27; Dairy Engineering took its last intake in 2025-26.",
      },
    ],
    checklist: {
      eyebrow: "Files to save before each semester",
      heading: "What every BTEUP student keeps handy",
      items: [
        "Current semester syllabus PDF (printed copy at home)",
        "Subject code reference sheet (so admit cards and result mappings are unambiguous)",
        "Internal marks tracker (your own spreadsheet — BTEUP doesn't release internals until result day)",
        "Previous-year question papers for current semester subjects (from BTEUP archive or library)",
        "BIPE class teacher's annotated syllabus (covers what's actually emphasised in BTEUP's exam vs what's optional)",
        "List of practical experiments per subject (lab manual reference)",
      ],
    },
    faqs: [
      {
        q: "Where is the official BTEUP syllabus published?",
        a: "Only on bteup.ac.in's 'Curriculum' section. Per-branch, per-semester PDFs. BTEUP doesn't publish syllabus on third-party aggregators — sites like Careers360, Shiksha, etc., usually republish the BTEUP PDF, but their version may lag the official cycle by 1-2 years. For the authoritative current cycle, go to the source.",
      },
      {
        q: "How is BTEUP syllabus different from CBSE / NCERT?",
        a: "BTEUP is application-heavy. Where NCERT focuses on concept depth, BTEUP focuses on workshop / lab / field application. A semester's theory subject typically pairs with a practical subject — for example, 'Strength of Materials' theory in Civil pairs with a 'Materials Testing Lab' practical. The internal component — 40% of a theory subject, 60% of a practical — reflects practical mastery.",
      },
      {
        q: "What if my branch's syllabus changes mid-diploma?",
        a: "BTEUP locks the syllabus at intake. You continue under your intake-year syllabus for all 6 semesters, even if BTEUP revises the curriculum later. Junior batches inherit the new syllabus; you don't switch mid-course. The only exception is if BTEUP issues a 'syllabus continuity notification' for a specific cycle — rare, only for emergencies.",
      },
      {
        q: "Are NCERT books enough for BTEUP exams?",
        a: "For first-year theory (Maths, Physics, Chemistry, English) — NCERT Class 11-12 is largely sufficient. For branch-specific subjects from semester 3 onwards, you need branch-specialised textbooks (the BTEUP syllabus PDF lists recommended texts). BIPE library carries the recommended texts for all 5 branches.",
      },
      {
        q: "How much weightage do BTEUP internal marks carry?",
        a: "You need at least 40% in the internal component and 40% in the external component, counted separately, for both theory and practical subjects. Internal marks come from: class tests (~40%), assignments (~30%), attendance (~20%), behaviour / class participation (~10%). At BIPE, attendance < 75% in a subject can disqualify you from the BTEUP external exam — so attendance is the single biggest factor in internals.",
      },
      {
        q: "Does BIPE provide a simplified BTEUP syllabus per branch?",
        a: "Yes. /courses/[branch] (e.g., /courses/electrical-engineering) summarises the 6-semester syllabus for that branch in a scannable format. We don't replace the official BTEUP PDF — but the BIPE summary is what a Class-10 student / parent can actually read to decide which branch matches the student's interest.",
      },
    ],
    ctaTitle: "Picking the right branch for you?",
    ctaBody: "BIPE's academic mentors walk every prospective student through the BTEUP syllabus for the branches they're considering. Honest read on workload, math content, lab time, and where the diploma leads. WhatsApp +91-7310077788 with your Class 10 marks and we'll map the syllabus to your fit.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "bteup-back-paper-supplementary-process",
    shortTitle: "BTEUP Back Paper · Supplementary",
    title: "BTEUP Back Paper 2026 · Supplementary Exam Process | BIPE 4455",
    description: "BTEUP back paper / supplementary exam guide — eligibility, registration, fees, timeline. How to clear backlogs without losing a year. From the BIPE academic office.",
    keywords: [
      "BTEUP back paper",
      "BTEUP supplementary exam",
      "BTEUP backlog process",
      "BTEUP supply exam 2026",
      "BTEUP fail subject re-exam",
      "BTEUP बैक पेपर",
      "polytechnic supplementary UP",
    ],
    eyebrow: "BTEUP 2026 · BACK PAPER + SUPPLEMENTARY",
    headline: "BTEUP back paper —",
    headlineAccent: "clear it, don't carry it.",
    lead: "A backlog (failed subject) in BTEUP is recoverable — but only if you act in the supplementary cycle window. This page walks through the back-paper / supplementary process: when the cycle runs, how to register, what it costs, and how BIPE's academic office helps students clear backlogs without losing a year of graduation.",
    quickStats: [
      { label: "Cycles per year", value: "2", sub: "January (odd-sem backlogs) + July (even-sem)" },
      { label: "Fee per paper", value: "₹200-500", sub: "Plus admin charges · varies by cycle" },
      { label: "Window", value: "~2 weeks", sub: "Per cycle · strict deadline" },
      { label: "Max backlog", value: "No published cap", sub: "Limit is time — 6 sessions for a 3-year diploma" },
    ],
    steps: [
      {
        n: "01",
        title: "Identify your backlog from the BTEUP result page",
        body: "Log in to bteup.ac.in → Result. Your marksheet flags failed subjects with 'CT' (Carry Trial) or 'F' grade. Note the subject code, subject name, and semester for each backlog. Don't rely on memory — work from the marksheet PDF.",
      },
      {
        n: "02",
        title: "Wait for BTEUP's supplementary cycle notification",
        body: "Supplementary cycles run twice yearly — January, for odd-semester backlogs from the November theory cycle whose result declares in December, and July, for even-semester backlogs from the April-May cycle whose result declares in June. BTEUP publishes the cycle notification ~3 weeks before registration opens. Watch bteup.ac.in's notice board.",
      },
      {
        n: "03",
        title: "Register for the supplementary exam through BIPE",
        body: "Supplementary registration is institute-mediated — you fill the form via BIPE's exam office, not directly online. Visit the BIPE academic block with your roll number, current marksheet, and the list of backlogs you want to clear. The exam coordinator submits the institute-batch to BTEUP.",
      },
      {
        n: "04",
        title: "Pay the per-paper fee within the window",
        body: "Supplementary fee is ₹200-500 per paper plus administrative charges (typically ~₹100). Pay via the BTEUP fee portal or through BIPE's accounts office. Get a receipt. The fee is NON-REFUNDABLE — once you register, you must appear, otherwise it counts as another absent attempt.",
      },
      {
        n: "05",
        title: "Receive supplementary admit card + appear for exam",
        body: "BTEUP releases supplementary admit cards 7-10 days before the cycle starts. Same portal as your main-cycle admit card. The exam is usually held at YOUR institute (BIPE Phoolpur) under external BTEUP supervision — different from main cycle which is often at mixed centres. Reporting time, ID requirements: same as main cycle.",
      },
      {
        n: "06",
        title: "Check supplementary result + plan ahead",
        body: "Results declare about six weeks after the cycle closes. If you cleared the backlog: your main-cycle marksheet now shows the passing grade. If you didn't: another supplementary cycle is available in the next window (6 months later). BTEUP publishes no cap on how many times you may re-attempt a back paper — what is fixed is the time: a 3-year diploma must be completed within 6 academic sessions, so every missed cycle eats into that window.",
      },
    ],
    checklist: {
      eyebrow: "Before you register for supplementary",
      heading: "What every student should bring",
      items: [
        "Current marksheet PDF (showing the backlog flags)",
        "Original BTEUP roll number",
        "Aadhaar (for verification)",
        "Per-paper fee in cash / UPI / DD (₹200-500 + admin)",
        "List of subject codes you want to clear (write them down, don't rely on memory)",
        "Ideally, your previous-cycle answer scripts (BIPE academic office helps retrieve these for revision)",
        "A written supplementary study plan — BIPE mentors help draft this",
      ],
    },
    faqs: [
      {
        q: "Will a back paper show on my final marksheet?",
        a: "Once you clear the supplementary, your final consolidated marksheet shows ONLY the passing grade — the original 'CT' / fail flag is replaced. Future employers / B.Tech lateral-entry recruiters don't see the failed attempt unless they ask for cycle-by-cycle marksheets (rare). So clearing is genuinely a fresh start.",
      },
      {
        q: "Can I appear for supplementary while still attending current semester?",
        a: "Yes. Most BIPE students with backlogs attend their CURRENT semester normally and write supplementary for the PREVIOUS semester's failed subjects in parallel. Manage your time carefully — supplementary prep adds 1-2 hours per day per backlog subject to your study load.",
      },
      {
        q: "What's the difference between back paper, supplementary, and re-exam?",
        a: "In BTEUP terminology: 'back paper' = the subject you failed. 'Supplementary' = the cycle when you re-attempt it. 'Re-exam' is informal — not an official BTEUP term. People also call it 'supply' (slang for supplementary). All refer to the same process.",
      },
      {
        q: "Can I clear a back paper without supplementary by applying for grace marks?",
        a: "If you missed by 1-3 marks, grace marks application may be enough — no supplementary needed. Grace is applied automatically in some cases, or by application within 3 weeks of result. But if you missed by 5+ marks, grace won't bridge the gap — supplementary is the only path. BIPE academic office helps decide which path fits.",
      },
      {
        q: "Does a supplementary delay my graduation?",
        a: "Not necessarily. If you clear the back paper in the FIRST supplementary cycle (January or July, whichever falls immediately after the failed semester's result), graduation timeline isn't affected. If you carry the backlog to multiple supplementary cycles or final-semester subjects fail, then graduation is delayed by ~6 months per failed cycle. The first supplementary is the critical one.",
      },
      {
        q: "What if I have backlogs in several subjects?",
        a: "BTEUP publishes no cap on the number of back subjects you may register for in one sitting, and no rule that a given number of backlogs blocks promotion — the board's own fee schedule explicitly prices more than two. The real constraint is time: a 3-year diploma must be completed within 6 academic sessions. If your backlog list is long, the practical question is whether you can clear it inside that window, which is a conversation to have with the BIPE academic office rather than a number to look up. Rare scenario, but worth knowing.",
      },
    ],
    ctaTitle: "Got a back paper to clear?",
    ctaBody: "BIPE's academic office helps every back-paper student plan supplementary registration, draft a revision schedule, and access previous-year question papers for the failed subjects. Drop into the academic block during 9am-5pm Mon-Sat or WhatsApp +91-7310077788.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "bteup-grading-cgpa-calculation",
    shortTitle: "BTEUP Grading + CGPA",
    title: "BTEUP Grading System 2026 · CGPA Calculation Guide | BIPE 4455",
    description: "BTEUP grading scale, percentage-to-grade mapping, SGPA + CGPA calculation formula. How to read your marksheet and compute your overall diploma percentage for B.Tech lateral entry.",
    keywords: [
      "BTEUP grading",
      "BTEUP CGPA",
      "BTEUP CGPA calculation",
      "BTEUP percentage calculation",
      "BTEUP marksheet grade",
      "BTEUP SGPA",
      "polytechnic CGPA formula",
      "BTEUP ग्रेड",
    ],
    eyebrow: "BTEUP 2026 · GRADING + CGPA",
    headline: "BTEUP grading system —",
    headlineAccent: "marks to grade to CGPA.",
    lead: "BTEUP uses a 10-point grading scale alongside raw marks. Your final diploma marksheet shows subject-wise grades, SGPA (per semester) and CGPA (cumulative across 6 semesters). This page explains the mark-to-grade mapping, the SGPA / CGPA formulas, and how to convert CGPA to percentage for B.Tech lateral-entry forms.",
    quickStats: [
      { label: "Grading scale", value: "10-point", sub: "A+ down to F" },
      { label: "Pass mark", value: "40% in each component", sub: "Internal and external counted separately" },
      { label: "CGPA range", value: "0 to 10", sub: "Higher is better · 6.0+ for placements" },
      { label: "Percentage formula", value: "CGPA × 9.5", sub: "AICTE-prescribed conversion" },
    ],
    steps: [
      {
        n: "01",
        title: "Find your raw marks on the BTEUP marksheet",
        body: "Each subject lists: internal marks (out of 40 for theory / 60 for practical), external marks (out of 60 for theory / 40 for practical), total (out of 100), and grade. The marksheet PDF is available on bteup.ac.in immediately after result declaration.",
      },
      {
        n: "02",
        title: "Map raw marks to grade (the 10-point scale)",
        body: "Standard BTEUP grade band: 90-100 = O (Outstanding, 10 points), 80-89 = A+ (9), 70-79 = A (8), 60-69 = B+ (7), 50-59 = B (6), 40-49 = C (5, the lowest passing band), Below 40 = F (Fail, 0). Pass needs 40% in each component — internal and external counted separately — so a subject where either component falls below 40 is a fail even if the total reaches 40. The grade points are what enter the SGPA / CGPA formulas — not the raw marks.",
      },
      {
        n: "03",
        title: "Compute SGPA (Semester Grade Point Average)",
        body: "SGPA = Σ(Grade Point × Credit Hours) ÷ Σ(Credit Hours). Each subject has assigned credit hours (typically 3-5 for theory, 1-3 for practical). Multiply each subject's grade point by its credits, sum, divide by total credits. Result is between 0 and 10. Most BIPE students fall in the 6.0-8.5 range.",
      },
      {
        n: "04",
        title: "Compute CGPA (cumulative across all 6 semesters)",
        body: "CGPA = Σ(SGPA per semester × Total credits per semester) ÷ Σ(Total credits across all 6 semesters). Or equivalently: average of all subject grade points × credits, across the entire diploma. Your final marksheet at graduation shows CGPA prominently — it's the headline metric.",
      },
      {
        n: "05",
        title: "Convert CGPA to percentage for B.Tech / placement applications",
        body: "AICTE prescribes: Percentage = CGPA × 9.5 (for the AICTE-affiliated polytechnic diploma context). So a 7.5 CGPA ≈ 71.25%. Some institutions use × 10 or × 9.0 — always check the specific application's conversion rule. Carry both the CGPA and the percentage on your resume to avoid ambiguity.",
      },
      {
        n: "06",
        title: "Check class division based on CGPA / percentage",
        body: "Standard BTEUP division: 75%+ (or CGPA 7.9+) = First Division with Distinction, 60-75% (CGPA 6.3-7.9) = First Division, 45-60% (CGPA 4.7-6.3) = Second Division, 40-45% (CGPA 4.2-4.7) = Third Division. Your final marksheet states your division — important for government job applications.",
      },
    ],
    faqs: [
      {
        q: "Why doesn't BTEUP just show percentage instead of CGPA?",
        a: "BTEUP transitioned from pure percentage to CGPA-with-grades in line with AICTE's national standardisation around 2018. Reason: CGPA is portable across institutions (AKTU, IITs, other Indian polytechnics all use CGPA), while pure percentage is institution-specific and harder to compare. Many marksheets still SHOW raw marks alongside the grade — but the official credential is the CGPA.",
      },
      {
        q: "Does BTEUP round CGPA to 2 decimals or more?",
        a: "Officially 2 decimal places — e.g., 7.46 CGPA. Some marksheets round to 1 decimal in summary fields, full precision in detailed sections. For B.Tech lateral entry forms, always use the 2-decimal CGPA from the official marksheet, not a rounded version.",
      },
      {
        q: "What CGPA do I need for AKTU B.Tech lateral entry?",
        a: "AKTU's official cutoff is 45% (CGPA ~4.7) for general category, 40% (CGPA ~4.2) for SC/ST/OBC. But the actual cutoff for placement-quality colleges is much higher — typically 6.0+ CGPA gets you a decent NIRF-ranked college, 7.5+ opens top-tier AKTU colleges. See /blog/diploma-to-btech-lateral-entry-up-aktu for branch-by-branch college-CGPA mapping.",
      },
      {
        q: "Does CGPA include practical subjects?",
        a: "Yes. Practical subjects carry credits and grade points just like theory subjects. They contribute to SGPA and therefore CGPA. Lab marks, drawing, drafting, and project work are all weighted in. Many students wrongly assume only theory matters — that's a costly assumption for placement-relevant CGPA.",
      },
      {
        q: "Can I improve my CGPA by re-attempting passed subjects?",
        a: "No. BTEUP doesn't allow re-attempts of subjects you've already passed (some other boards do, BTEUP doesn't). Supplementary cycles are only for FAILED subjects (back papers). Your CGPA from passing subjects is locked. Focus on doing well first time round — there's no second-chance CGPA improvement built into the system.",
      },
      {
        q: "Where do I see SGPA vs CGPA on the marksheet?",
        a: "SGPA appears at the END of each per-semester marksheet — under your subject-wise breakdown. CGPA appears on the FINAL consolidated marksheet that BTEUP issues after Semester 6. The consolidated marksheet is the official credential document for graduation, B.Tech applications, and government jobs.",
      },
    ],
    ctaTitle: "Need a CGPA-to-college mapping?",
    ctaBody: "BIPE's placement and academic offices help every senior-year student translate their CGPA into realistic next-step options — B.Tech lateral entry colleges, government job eligibility, private placement opportunities. WhatsApp +91-7310077788 with your current CGPA for an honest mapping.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "bteup-affiliated-colleges-up",
    shortTitle: "BTEUP Affiliated Colleges",
    title: "BTEUP Affiliated Colleges in UP 2026 · Full List + How to Verify | BIPE 4455",
    description: "Comprehensive guide to BTEUP-affiliated polytechnic colleges across Uttar Pradesh — government, aided, private. How to verify any college's BTEUP affiliation status and what affiliation actually guarantees.",
    keywords: [
      "BTEUP affiliated colleges",
      "BTEUP college list UP",
      "polytechnic colleges UP",
      "BTEUP recognized colleges",
      "BTEUP polytechnic list",
      "list of BTEUP colleges",
      "BTEUP affiliation verification",
    ],
    eyebrow: "BTEUP 2026 · AFFILIATED COLLEGES",
    headline: "BTEUP-affiliated colleges in UP —",
    headlineAccent: "verify, compare, choose.",
    lead: "BTEUP affiliates ~1,500+ polytechnic colleges across Uttar Pradesh — government, aided, and private. Not every college claiming polytechnic status is BTEUP-affiliated. This page explains the affiliation system, how to verify any college's status, and the three categories you'll encounter during JEECUP counselling.",
    quickStats: [
      { label: "Total colleges", value: "~1,500+", sub: "Across UP · all categories" },
      { label: "Government", value: "~150", sub: "Polytechnic Education Dept., UP" },
      { label: "Government-aided", value: "19", sub: "Hybrid · partial govt funding" },
      { label: "Private (incl. BIPE)", value: "~1,300+", sub: "AICTE-approved + BTEUP-affiliated" },
    ],
    steps: [
      {
        n: "01",
        title: "Understand the three college categories",
        body: "BTEUP affiliates three types of polytechnics. (1) Government polytechnics — fully state-funded, lowest fees, very low seats. (2) Government-aided — private trusts receiving partial state funding, moderate fees, mid-range placement. (3) Private polytechnics (BIPE falls here) — AICTE + BTEUP approved, AFRC-regulated fees, broadest seat availability and most flexible admission timelines.",
      },
      {
        n: "02",
        title: "Verify any college's BTEUP affiliation on bteup.ac.in",
        body: "Visit bteup.ac.in → 'Affiliated Colleges' or 'Institute Directory' (menu label varies by year). Enter the college name or JEECUP institute code. The result shows: affiliation status (Active / Renewal / Withdrawn), AICTE approval reference, sanctioned branches and seat intake per branch, and the date of last inspection. If a college claims BTEUP affiliation but doesn't show here, it's NOT affiliated.",
      },
      {
        n: "03",
        title: "Cross-check AICTE approval at facilities.aicte-india.org",
        body: "AICTE approval is separate from BTEUP affiliation. A legitimate polytechnic needs both. Search by institute name or AICTE Permanent ID on the AICTE public dashboard at facilities.aicte-india.org/dashboard/pages/angulardashboard.php. The result shows current-year EoA (Extension of Approval) status. BIPE's AICTE Permanent ID is 1-488233171 — you can verify ours there as a reference example.",
      },
      {
        n: "04",
        title: "Check the JEECUP institute-code list (most authoritative for admission)",
        body: "JEECUP publishes an official institute-code list every year — every BTEUP-affiliated college accepting JEECUP counselling has a 4-digit code. BIPE's is 4455. If a college isn't on the JEECUP institute-code list, it cannot accept JEECUP counselling admissions — which means even if it's BTEUP-affiliated, the admission path is different (direct, separate exam, etc.).",
      },
      {
        n: "05",
        title: "Compare 3-4 short-listed colleges side-by-side",
        body: "Once you've verified 3-4 short-listed colleges, compare on: distance from home, fee (look up AFRC / govt published rates), branches offered (some colleges only offer 2-3 branches), placement record (ask for verified joining letters, not 'package' claims), hostel availability, last inspection date (recent inspection = up-to-date facilities). BIPE's /placements + /fees + /about/affiliations pages show exactly the data points you should be comparing on.",
      },
      {
        n: "06",
        title: "Avoid colleges with 'BTEUP-affiliation pending' status",
        body: "Some colleges advertise 'BTEUP-affiliation pending' or 'applied for affiliation' — meaning they're not yet affiliated, but processing. Joining such a college risks: your diploma may not be BTEUP-recognised at graduation, government job eligibility may be affected. Stick to colleges with 'Active' affiliation status on the BTEUP portal.",
      },
    ],
    faqs: [
      {
        q: "Where do I find the complete BTEUP-affiliated college list?",
        a: "bteup.ac.in's 'Institute Directory' or 'Affiliated Colleges' section. It's the authoritative source. Third-party sites (Careers360, Shiksha) republish it but often with stale data. For latest verification, go directly to BTEUP.",
      },
      {
        q: "How do I know if a BTEUP-affiliated college is also good?",
        a: "Affiliation guarantees the diploma is BTEUP-recognised — but doesn't guarantee quality. For quality, look at: NIRF ranking (if any), AFRC fee classification (institutional category), recent JEECUP cutoff trends, placement record (verified joining letters not 'package' claims), AICTE EoA history (an institute with continuous EoA for 10+ years has stable operations). BIPE's /why-bipe and /placements pages walk through these signals.",
      },
      {
        q: "Is a private BTEUP-affiliated college as recognised as a government one?",
        a: "Yes, at the diploma-credential level. A BTEUP-affiliated private polytechnic (like BIPE) issues the same BTEUP diploma as a government polytechnic — recognised by the same government, eligible for the same B.Tech lateral entry pathways, eligible for the same RRB JE / SSC JE / UPPCL government job exams. The difference is in fees and facilities, not in diploma value. See /private-vs-government-polytechnic for the detailed comparison.",
      },
      {
        q: "Can a BTEUP-affiliated college lose its affiliation?",
        a: "Yes, if AICTE withdraws EoA, BTEUP finds non-compliance with norms (faculty shortage, infrastructure deficit, etc.), or the college fails inspection. Affiliation withdrawal is rare — typically affects ~1-3 colleges per year out of 1,500+. BTEUP gives advance notice (usually 1 year) so existing students can complete their cycle. Always check current-cycle affiliation status before joining.",
      },
      {
        q: "Why does the list change year to year?",
        a: "New colleges get affiliated, some lose affiliation, some merge or close. The annual JEECUP institute-code list also updates — colleges may be added or dropped based on counselling participation. For 2026-27 cycle, work from the current-year BTEUP list, not last year's.",
      },
      {
        q: "How does BIPE compare to other BTEUP colleges in Eastern UP?",
        a: "BIPE is one of ~25 private BTEUP-affiliated polytechnics in the Eastern UP region. /government-polytechnic-in-eastern-up and /private-vs-government-polytechnic show the comparison framework. Honestly: government polytechnics have lower fees and equivalent academic recognition; BIPE differentiates on placement infrastructure, on-campus hostel, and its workshop and lab capacity. The right choice depends on your priorities.",
      },
    ],
    ctaTitle: "Verifying BIPE before applying?",
    ctaBody: "BIPE's AICTE Permanent ID is 1-488233171 (verify at facilities.aicte-india.org) · JEECUP code 4455 (verify at jeecup.admissions.nic.in) · BTEUP-affiliated (verify at bteup.ac.in). All three are independently checkable. WhatsApp +91-7310077788 if you want help verifying any of them.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "bteup-migration-noc-process",
    shortTitle: "BTEUP Migration · NOC",
    title: "BTEUP Migration NOC 2026 · Transfer Process Guide | BIPE 4455",
    description: "BTEUP migration / NOC (No Objection Certificate) process — how to transfer between BTEUP-affiliated colleges, why students migrate, documents required, timeline, fees. From the BIPE academic office.",
    keywords: [
      "BTEUP migration",
      "BTEUP NOC",
      "BTEUP transfer certificate",
      "polytechnic college transfer",
      "BTEUP college change",
      "BTEUP migration process",
      "BTEUP NOC application",
    ],
    eyebrow: "BTEUP 2026 · MIGRATION + NOC",
    headline: "BTEUP migration —",
    headlineAccent: "transfer without losing a year.",
    lead: "Family relocation, course mismatch, financial circumstances — students sometimes need to transfer between BTEUP-affiliated colleges mid-diploma. BTEUP allows migration with a No Objection Certificate (NOC) from the current college. This page walks through the process, eligibility, and what to expect at BIPE on both ends (students migrating out, or transferring in).",
    quickStats: [
      { label: "Eligibility", value: "After Sem 1 or 2", sub: "Rarely allowed after Sem 3" },
      { label: "Processing time", value: "4-8 weeks", sub: "From NOC to new-college enrollment" },
      { label: "NOC fee", value: "~₹500-2,000", sub: "BIPE waives in genuine hardship cases" },
      { label: "Success rate", value: "~70-80%", sub: "When properly documented" },
    ],
    steps: [
      {
        n: "01",
        title: "Confirm migration is the right choice",
        body: "Migration is disruptive — new institute, new mentors, possibly different syllabus pace (within BTEUP norms but local emphasis varies). Genuine reasons: family relocation to a different city, medical situations, severe institutional issues, family financial change. Less-genuine reasons (just unhappy with one teacher, hoping for easier coursework) usually don't justify the disruption. Talk to BIPE's academic office before deciding.",
      },
      {
        n: "02",
        title: "Apply for NOC from current college (BIPE, in this case)",
        body: "Submit a written application to BIPE's academic office stating: your name, roll number, branch, semester, reason for migration, target college name and BTEUP code (if known), supporting documents (family relocation proof, medical certificate, etc.). BIPE reviews the application — most genuine cases approved within 2 weeks.",
      },
      {
        n: "03",
        title: "Pay NOC processing fee + complete clearance",
        body: "BIPE charges ~₹500-2,000 NOC processing fee (waived in documented hardship cases). You also need 'no-dues' clearance from: accounts office (tuition + hostel fees up to date), library (no overdue books), labs (no equipment pending). Each department signs the clearance form. Total clearance time: 5-10 working days.",
      },
      {
        n: "04",
        title: "Receive NOC + transfer documents from BIPE",
        body: "Once cleared, BIPE issues: the NOC certificate (signed by Principal), your current marksheets (Sem 1 onwards if applicable), conduct certificate, syllabus mapping notes (helpful for the receiving college). Hand-deliver or courier these to the target college.",
      },
      {
        n: "05",
        title: "Target college accepts + applies to BTEUP for transfer",
        body: "Target college reviews your NOC, current marksheets, and assesses whether they have a seat in your branch + semester. If yes, they raise a 'student transfer' application to BTEUP. BTEUP processes (4-6 weeks typically) and updates its registry. Your BTEUP roll number CHANGES — new institute, new roll. Old institute records are archived.",
      },
      {
        n: "06",
        title: "Enroll at target college + verify with BTEUP portal",
        body: "Once BTEUP processes the transfer, you enroll at the new college as a continuing student. Log in to bteup.ac.in with your new credentials (issued by target college) and verify your roll number, branch, semester, and previous-marks history all show correctly. Any discrepancies, flag with the target college's academic office immediately.",
      },
    ],
    checklist: {
      eyebrow: "Documents for migration application",
      heading: "What to gather BEFORE you apply",
      items: [
        "Written application stating reason for migration (1-2 pages)",
        "Aadhaar (yours + parent/guardian for verification)",
        "Current BTEUP marksheet (Semester 1 onwards if applicable)",
        "Fee receipts (showing no pending tuition / hostel / library dues)",
        "Supporting documents for the reason (relocation proof / medical certificate / financial hardship affidavit)",
        "Target college admission letter (if they've conditionally accepted you)",
        "JEECUP rank card (original allotment letter, for reference)",
      ],
    },
    faqs: [
      {
        q: "Can I migrate after Semester 3 or later?",
        a: "BTEUP technically allows it but it's rare. Most migration approvals are for Semester 1 or 2 students. After Semester 3, the syllabus drift between institutes becomes a real factor — even within BTEUP, different colleges may have emphasised different topics in early semesters. Migration after Sem 3 often requires you to repeat some subjects at the new college. BTEUP and target college decide on a case-by-case basis.",
      },
      {
        q: "What if BIPE denies my NOC request?",
        a: "Genuine denials are rare. If denied, the reason is usually: pending fee dues, attendance shortage, disciplinary issue, or insufficient migration justification. Address the specific issue and re-apply. If you believe the denial is unjustified, escalate to BIPE's Principal in writing. As a last resort, BTEUP has a grievance mechanism — but going there is a major step.",
      },
      {
        q: "Does migration affect my CGPA / final marksheet?",
        a: "No. Your previous-semester grades carry forward to the new institute under BTEUP's record. The final consolidated marksheet at graduation shows ALL 6 semesters' results regardless of which institute administered each. Migration is recorded in your file but doesn't appear on the marksheet itself.",
      },
      {
        q: "What if the target college doesn't have my branch?",
        a: "Then migration isn't possible to that college — you can only migrate within the same branch and same semester. You'd need to either choose a different target college that does have your branch, or stay at BIPE. BTEUP doesn't allow branch-change via migration.",
      },
      {
        q: "How much does the whole migration process cost?",
        a: "Rough estimate: ₹500-2,000 NOC fee at current college + ₹500-1,500 admission fees at target college + courier costs + your time for documentation. Total cash outlay is usually ₹2,000-5,000 plus any backlog clearance fees if applicable.",
      },
      {
        q: "Can BIPE accept transfer students into ongoing semesters?",
        a: "Yes, subject to: branch + semester seat availability, valid NOC from the previous BTEUP college, current-cycle BTEUP approval. We've had transfer students join from semesters 2 and 3 in past years. WhatsApp +91-7310077788 with your current college name, branch, semester, and reason — we'll tell you within 48 hours whether we can take you.",
      },
    ],
    ctaTitle: "Considering migration to or from BIPE?",
    ctaBody: "BIPE's academic office handles ~5-10 migration cases per cycle — both directions. We're honest about whether your reason justifies the disruption and what your post-migration prospects look like. WhatsApp +91-7310077788 to schedule a confidential 15-min consultation.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "bteup-duplicate-marksheet-application",
    shortTitle: "BTEUP Duplicate Marksheet",
    title: "BTEUP Duplicate Marksheet 2026 · Application + Reissue Process | BIPE 4455",
    description: "Lost or damaged your BTEUP marksheet? Step-by-step application process for duplicate / reissued marksheet — fees, affidavit, FIR requirement, timeline. From the BIPE academic office.",
    keywords: [
      "BTEUP duplicate marksheet",
      "BTEUP lost marksheet",
      "BTEUP marksheet reissue",
      "duplicate marksheet polytechnic UP",
      "BTEUP marksheet damaged",
      "BTEUP डुप्लीकेट मार्कशीट",
      "BTEUP transcript request",
    ],
    eyebrow: "BTEUP 2026 · DUPLICATE MARKSHEET",
    headline: "BTEUP duplicate marksheet —",
    headlineAccent: "lost, damaged, or just needed extras.",
    lead: "Lost the original marksheet ahead of a B.Tech interview? Damaged by water or fire? Need additional certified copies for a placement application? BTEUP issues duplicate marksheets via the institute (BIPE) — this page walks through the application, fees, affidavit / FIR requirements, and the typical 4-6 week timeline.",
    quickStats: [
      { label: "Issued by", value: "BTEUP · via BIPE", sub: "Institute-mediated application" },
      { label: "Fee", value: "₹500-1,000", sub: "Per marksheet · plus admin charges" },
      { label: "Timeline", value: "4-6 weeks", sub: "From application to delivery" },
      { label: "If lost", value: "Affidavit + FIR", sub: "Mandatory · police complaint required" },
    ],
    steps: [
      {
        n: "01",
        title: "Identify which marksheet you need duplicated",
        body: "BTEUP issues two types: (a) Per-semester marksheets (issued at the end of each semester · 6 total over the diploma), (b) Consolidated marksheet (issued ONCE at graduation, summarising all 6 semesters with final CGPA). Application process is identical for either; specify which semester(s) you need.",
      },
      {
        n: "02",
        title: "Determine the reason — lost, damaged, or extras",
        body: "BTEUP categorises reissue requests by reason. (a) Lost — requires affidavit + FIR (police complaint), additional verification time. (b) Damaged — requires the damaged original to be submitted with the application, no affidavit needed. (c) Additional copies (you have the original but need more) — simplest case, just application + fee.",
      },
      {
        n: "03",
        title: "If LOST — file an FIR at the local police station",
        body: "BTEUP requires an FIR (First Information Report) for lost marksheets — proves you genuinely lost it, not just trying to fraudulently get extras. File at the police station nearest to where you lost the document. Mention: your name, the document name and unique number (if you remember), date and circumstances of loss. The FIR is free — police are obligated to register it. Get a copy stamped by the station officer.",
      },
      {
        n: "04",
        title: "Prepare the affidavit (lost cases only)",
        body: "A non-judicial stamp paper affidavit (₹10-100 stamp) stating you've lost the marksheet, the FIR has been filed (attach copy), and you'll return the duplicate if the original is found. Format is standard — local notary or BIPE's office can provide a template. Notarised by a public notary; cost ~₹100-300 including stamp + notary fees.",
      },
      {
        n: "05",
        title: "Submit the application to BIPE's academic office",
        body: "Visit BIPE academic block with: completed BTEUP duplicate-marksheet application form (BIPE provides), your Aadhaar (verification), the FIR + affidavit (if lost) OR damaged original (if damaged), per-marksheet fee (₹500-1,000 in cash/UPI). BIPE's exam coordinator forwards your application to BTEUP within 7-10 working days.",
      },
      {
        n: "06",
        title: "BTEUP processes + BIPE receives the duplicate",
        body: "BTEUP processing takes 3-5 weeks. The duplicate marksheet is delivered to BIPE (sometimes directly to your address — depends on the cycle). BIPE notifies you to collect. The duplicate is marked 'DUPLICATE' on the face — Government and most employers accept this status; private companies occasionally hesitate but verification via BTEUP's portal clears any doubt.",
      },
    ],
    checklist: {
      eyebrow: "Documents to gather",
      heading: "Before you apply",
      items: [
        "Filled-out BTEUP duplicate-marksheet application form (from BIPE office)",
        "Aadhaar card original + photocopy",
        "Per-marksheet fee in cash / UPI (₹500-1,000)",
        "Specific to LOST case: FIR copy (stamped by police station)",
        "Specific to LOST case: Notarised affidavit on ₹10-100 stamp paper",
        "Specific to DAMAGED case: The damaged original marksheet (don't throw it away)",
        "Two recent passport-size photographs (for verification records)",
        "Mobile number + email (BIPE notifies you when the duplicate is ready)",
      ],
    },
    faqs: [
      {
        q: "Why does BTEUP require an FIR for lost marksheets?",
        a: "Anti-fraud measure. Marksheets are valuable credentials and could be misused if duplicate copies fall into the wrong hands. The FIR + affidavit combination creates a legal record that protects both BTEUP and you — if a found marksheet later surfaces being misused, the FIR record helps clarify which copy is the legitimate one.",
      },
      {
        q: "Will the duplicate marksheet be accepted by employers / colleges?",
        a: "Yes, by virtually all employers, B.Tech lateral-entry colleges, and government recruiters. The DUPLICATE stamp is standard — what matters is the BTEUP issuance and the CGPA / division shown. If a specific employer hesitates, they can verify directly with BTEUP via bteup.ac.in's verification portal using your roll number. The duplicate is functionally equivalent to the original.",
      },
      {
        q: "Can I get a duplicate marksheet if I'm not a BIPE alumnus?",
        a: "Apply through whichever BTEUP-affiliated college you studied at — BIPE handles BIPE alumni only. Any other institute handles their alumni. If your previous college has closed, BTEUP allows direct application to its Lucknow office.",
      },
      {
        q: "How many duplicates can I request?",
        a: "Reasonable number — typically up to 2-3 copies per request. Beyond that, BTEUP may flag for review (genuine reasons get approved). Each copy carries the per-marksheet fee. Most students request 1-2 copies; rarely more.",
      },
      {
        q: "Does the duplicate marksheet show the original issue date?",
        a: "Yes. The duplicate carries the ORIGINAL date of result declaration (so it accurately reflects when you graduated) plus a separate 'Duplicate issued on' date stamp. Both dates are present — no confusion possible.",
      },
      {
        q: "What if my marksheet was lost more than 5 years ago?",
        a: "BTEUP archives extend back 20+ years. Even old marksheets are reissuable. Process is identical but verification time may extend by 2-3 weeks (BTEUP retrieves the older record). Older alumni (1990s-2000s) sometimes find that records are partially digitised — in those edge cases, BIPE's academic office helps liaise with BTEUP for manual record retrieval.",
      },
    ],
    ctaTitle: "Lost or damaged your BIPE marksheet?",
    ctaBody: "BIPE's academic office handles all duplicate-marksheet applications for BIPE alumni. We provide the application form, walk you through the FIR / affidavit (if needed), and forward to BTEUP within 10 days of complete submission. Visit Mon-Sat 9am-5pm or WhatsApp +91-7310077788.",
  },
];

export function bteupResourceBySlug(slug: string): BteupResource | undefined {
  return BTEUP_RESOURCES.find((r) => r.slug === slug);
}

export function otherBteupResources(currentSlug: string): BteupResource[] {
  return BTEUP_RESOURCES.filter((r) => r.slug !== currentSlug);
}
