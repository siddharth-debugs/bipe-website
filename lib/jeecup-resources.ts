/**
 * JEECUP 2026 Resources hub — typed content for 6 procedural pages.
 *
 * Phase 2 of the JEECUP/BTEUP content sprint. These pages target the
 * high-volume procedural keyword cluster around JEECUP 2026:
 *
 *   /jeecup-registration-2026               registration / online registration
 *   /jeecup-admit-card-2026                 admit card download + troubleshoot
 *   /jeecup-result-2026                     result + rank card check
 *   /jeecup-seat-allotment-2026             round-wise allotment
 *   /jeecup-document-verification-checklist document checklist
 *   /jeecup-helpline-contact                contacts + emergency support
 *
 * Each renders ~1,200-1,500 words via the shared JeecupResourceTemplate
 * component, with FAQPage + BreadcrumbList JSON-LD baked in.
 *
 * Why a shared template + data file:
 *   - All 6 pages share the same procedural-page DNA (hero with date
 *     markers → step-by-step process → checklist → FAQ → CTA)
 *   - Updating the JEECUP 2026 schedule (e.g., if dates shift again)
 *     means editing this one file, not 6 page files
 *   - The catchment-pages pattern (lib/catchments.ts +
 *     components/catchment/CatchmentTemplate.tsx) proved this works
 *
 * Editorial stance:
 *   - Every claim about JEECUP dates / process verified against the
 *     official portal (jeecup.admissions.nic.in) and Careers360 /
 *     Shiksha / CollegeDunia announcements (May 2026)
 *   - BIPE-specific advice (institute code 4455, hostel availability,
 *     etc.) is honest and verifiable
 *   - Every page links back to BIPE's /apply and the broader /jeecup
 *     hub so qualified traffic converts
 */

export interface ResourceStep {
  /** Two-digit step number, displayed as a serif italic accent */
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

export interface JeecupResource {
  slug: string;
  /** Used in route metadata + breadcrumb */
  shortTitle: string;
  /** SEO title for <title> */
  title: string;
  /** SEO meta description */
  description: string;
  /** EN/Hindi keyword array for routes metadata */
  keywords: string[];
  /** Hero eyebrow line */
  eyebrow: string;
  /** Hero H1, pre-accent */
  headline: string;
  /** Hero H1, italic serif accent */
  headlineAccent: string;
  /** Hero lead paragraph */
  lead: string;
  /** Optional prominent banner pinned to the very top of the hero — for
   *  time-sensitive states like "result declared". Most pages omit it. */
  heroAlert?: {
    badge: string;
    text: string;
    primary: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
  /** 3-4 stat cards under hero */
  quickStats: ResourceQuickStat[];
  /** Optional data tables (e.g. rank-band → outcome, real cutoffs). Rendered
   *  as styled, horizontally-scrollable tables after the quick-stats. Most
   *  pages omit this. */
  tables?: {
    eyebrow: string;
    heading: string;
    intro?: string;
    columns: string[];
    rows: string[][];
    note?: string;
    noteLink?: { label: string; href: string };
  }[];
  /** Main process steps (5-7 entries) */
  steps: ResourceStep[];
  /** Optional checklist block (rendered as bullet list) */
  checklist?: {
    eyebrow: string;
    heading: string;
    intro?: string;
    items: string[];
  };
  /** Optional contact / helpline block */
  contacts?: {
    eyebrow: string;
    heading: string;
    items: { label: string; value: string; href?: string }[];
  };
  /** FAQ section (5-7 entries) */
  faqs: ResourceFaq[];
  /** CTA block — what to do next at BIPE */
  ctaTitle: string;
  ctaBody: string;
}

/* eslint-disable max-len */

export const JEECUP_RESOURCES: JeecupResource[] = [
  // ─────────────────────────────────────────────────────────────────
  // JEECUP Round 4 (Phase 2) — the strategic re-opening. Placed first so it
  // leads the cross-link grid on every resource page while it's the live round.
  // Dates for Round 4/5 release progressively on the portal, so the copy avoids
  // hard dates and points to jeecup.admissions.nic.in. Verified July 2026:
  // Phase 1 (Rounds 1–3) is UP-domicile only; Phase 2 (Round 4+) opens to all
  // states in the open/general category (no UP reservation for other-state).
  {
    slug: "jeecup-round-4-2026",
    shortTitle: "JEECUP Round 4 · Phase 2",
    title: "JEECUP Round 4 2026 · Phase 2 Opens for ALL States (Bihar too) | BIPE 4455",
    description: "JEECUP 2026 Round 4 (Phase 2) — the big re-opening after Round 1. Now open to other-state candidates (Bihar, Jharkhand, MP) and anyone who missed Rounds 1–3. Round-by-round eligibility, dates and how to lock a BIPE seat — code 4455.",
    keywords: [
      "JEECUP round 4",
      "JEECUP round 4 2026",
      "JEECUP round 4 eligibility",
      "JEECUP round 4 other state",
      "JEECUP phase 2 counselling",
      "JEECUP round 4 choice filling",
      "JEECUP counselling for Bihar students",
      "JEECUP round 4 me kaun apply kar sakta hai",
    ],
    eyebrow: "JEECUP 2026 · ROUND 4 · PHASE 2",
    headline: "JEECUP Round 4 is the big re-opening —",
    headlineAccent: "and this time, every state is in.",
    heroAlert: {
      badge: "Round 4 · all states",
      text: "Phase 1 (Rounds 1–3) was UP-domicile only. Round 4 opens Phase 2 — other-state candidates and anyone who missed the first rounds can finally join. Reserve your BIPE branch (code 4455) now.",
      primary: { label: "Reserve your branch — free →", href: "/early-registration" },
      secondary: { label: "Open JEECUP portal →", href: "https://jeecup.admissions.nic.in" },
    },
    lead: "JEECUP 2026 counselling runs in two phases. Rounds 1–3 (Phase 1) were open only to Uttar Pradesh domicile candidates. Round 4 begins Phase 2 — the single biggest opening after Round 1 — because two large groups become eligible at once: candidates from other states (Bihar, Jharkhand, MP and beyond), and UP candidates who did not register, were not allotted, or missed Rounds 1–3. Other-state candidates are admitted in the open / general category (no UP reservation), and those open seats concentrate in private polytechnics — which is exactly what BIPE is (code 4455). Exact Round-4 dates release progressively on jeecup.admissions.nic.in, so lock your branch at BIPE first and fill 4455 the moment choice-filling opens.",
    quickStats: [
      { label: "Who's eligible now", value: "All states", sub: "Bihar, Jharkhand, MP + missed R1–3" },
      { label: "Category", value: "Open / General", sub: "no UP domicile certificate needed" },
      { label: "BIPE code", value: "4455", sub: "5 BTEUP branches" },
      { label: "Classes begin", value: "1 August", sub: "reserve your seat before then" },
    ],
    tables: [
      {
        eyebrow: "The full round map",
        heading: "Every JEECUP 2026 round, explained",
        intro: "JEECUP 2026 has two phases across its main rounds. This is who each round is for — and why Round 4 is the one to watch if you're from another state or missed the earlier rounds.",
        columns: ["Round", "Phase & window", "Who can participate", "At BIPE (4455)"],
        rows: [
          ["Round 1", "Phase 1 · 25–30 Jun (done)", "UP-domicile candidates — the first, largest round", "Seats moved fast"],
          ["Round 2", "Phase 1 · 7–9 Jul (done)", "UP-domicile · upgrade / fresh allotment", "160+ admitted so far this season"],
          ["Round 3", "Phase 1 · 16–19 Jul · allotment 20 Jul", "UP-domicile · last Phase-1 round", "Allottees report by ~25 Jul"],
          ["Round 4", "Phase 2 · dates on the portal (expected late Jul)", "ALL STATES now eligible — Bihar, Jharkhand, MP — plus anyone who missed Rounds 1–3", "Reserve now, fill 4455 when it opens"],
          ["Round 5", "Phase 2 · expected early Aug", "All states · final counselling round", "Last seats before classes begin"],
        ],
        note: "Round-4 and Round-5 choice-filling/allotment dates are released step by step on the official portal — check it daily during your active round, and keep your branch reserved at BIPE so a late-published date never costs you a seat:",
        noteLink: { label: "From Bihar? See the state-by-state guide", href: "/jeecup-from-bihar" },
      },
      {
        eyebrow: "Can you join Round 4?",
        heading: "Round 4 eligibility, situation by situation",
        intro: "If any of these is you, Round 4 (Phase 2) is your round.",
        columns: ["Your situation", "Round 4?"],
        rows: [
          ["From UP but missed Rounds 1–3", "Yes — Round 4 is your entry point back in"],
          ["From UP, applied but not allotted a seat yet", "Yes — fresh choice-filling in Round 4"],
          ["From Bihar / Jharkhand / MP / any other state", "Yes — Phase 2 (Round 4+) is the FIRST round you're eligible for"],
          ["Already accepted and froze a seat in Rounds 1–3", "No — your seat is locked (upgrade only if you chose to float)"],
          ["Want a private polytechnic like BIPE", "Yes — other-state / open seats concentrate in private colleges"],
        ],
        note: "Other-state candidates compete in the open / general category and don't get UP's reserved-category seats — that's the one rule to know. Everything else works exactly like Rounds 1–3.",
      },
    ],
    steps: [
      {
        n: "01",
        title: "Check whether a fresh registration is needed",
        body: "Round 4 (Phase 2) may require candidates who didn't register earlier — especially other-state candidates — to register/re-register on jeecup.admissions.nic.in. The portal publishes the exact Phase-2 registration window step by step, so log in and check the notice for your case. If you already registered in Phase 1, your login usually carries forward.",
      },
      {
        n: "02",
        title: "Reserve your branch at BIPE first — free",
        body: "Don't wait for the portal to publish the choice-filling date to decide. Do your Pre-Counselling Registration at BIPE now: it holds your preferred branch (code 4455) and gets you free choice-filling guidance, so the moment Round 4 opens you already know exactly which branches to list. It complements JEECUP counselling — you still fill 4455 in the official round.",
      },
      {
        n: "03",
        title: "Fill your choices — add code 4455",
        body: "When Round-4 choice-filling opens, search for BIPE Phoolpur, Varanasi or enter institute code 4455 directly, and list it against every branch you'd accept — CSE, Mechanical (Production), Electrical, Civil, Dairy. Single-choice filling is the most common reason candidates miss a seat; list generously.",
      },
      {
        n: "04",
        title: "Seat allotment and acceptance",
        body: "After choice-filling closes, JEECUP publishes the Round-4 allotment. If BIPE 4455 is allotted, accept the seat and pay the seat-acceptance fee within the round window (typically 3–5 days). The counselling fee for the cycle is ₹3,250; keep it ready.",
      },
      {
        n: "05",
        title: "Report to campus + document verification",
        body: "Report to BIPE within the published window with originals plus two self-attested copies — Class 10 marksheet, rank card, ID, and (for reserved-category claims) a valid certificate. Other-state candidates do NOT need a UP domicile certificate. Our team handles Bihar and other-state admissions every season.",
      },
      {
        n: "06",
        title: "Confirm before 1 August",
        body: "Classes begin 1 August. Confirm your seat and hostel slot at the time of fee payment — out-of-state applicants are prioritised for hostel allotment. If Round 4 doesn't land your branch, keep 4455 in your Round-5 list; the final round often still has BIPE seats.",
      },
    ],
    faqs: [
      {
        q: "Can Bihar / other-state students join JEECUP Round 4?",
        a: "Yes — and Round 4 is the first round you can join. Phase 1 (Rounds 1–3) is reserved for UP-domicile candidates; Phase 2 begins at Round 4 and opens to candidates from every state (Bihar, Jharkhand, MP and others). You're admitted in the open / general category — no UP domicile certificate needed — and BIPE, being a private polytechnic (code 4455), is exactly where those open seats sit. See our /jeecup-from-bihar guide for the state-specific steps.",
      },
      {
        q: "I missed Rounds 1–3 — can I still get in through Round 4?",
        a: "Yes. Round 4 is the big re-opening. Whether you didn't register in time, weren't allotted a seat, or simply sat the earlier rounds out, Round 4 lets you fill fresh choices. Check the portal for whether you need to (re)register for Phase 2, reserve your branch at BIPE now, and add code 4455 when choice-filling opens.",
      },
      {
        q: "Do I need to register again for Round 4?",
        a: "It depends on your Phase-1 status. Candidates who never registered — often other-state candidates — usually need to register in the Phase-2 window that JEECUP publishes on the portal. Candidates already registered in Phase 1 normally continue with the same login. The official Round-4 notice on jeecup.admissions.nic.in spells out your exact case; check it daily during the round.",
      },
      {
        q: "What are the exact JEECUP Round 4 dates?",
        a: "JEECUP releases Round-4 (and Round-5) choice-filling and allotment dates progressively on the official portal rather than all at once, so we don't publish a fixed date here — a wrong date could cost you a seat. Round 4 is expected to open in the days after Round-3 reporting (late July). Watch jeecup.admissions.nic.in, and keep your branch reserved at BIPE so you're ready the moment it opens.",
      },
      {
        q: "Do other-state candidates get UP reservation in Round 4?",
        a: "No — and that's the only real difference. Other-state candidates are admitted in the open / general category and are not eligible for UP's SC/ST/OBC/EWS reserved-category seats or UP state scholarships. Everything else — choice-filling, allotment, the ₹3,250 counselling fee, reporting — works the same as for UP candidates.",
      },
      {
        q: "Which BIPE branches are open in Round 4?",
        a: "All five BTEUP diploma branches at BIPE (code 4455) — Computer Science & Engineering, Mechanical (Production), Electrical, Civil, and Dairy Engineering — participate through JEECUP counselling. Availability by branch depends on how Phase-1 seats filled; WhatsApp your JEECUP rank to +91-7310077788 and we'll give you an honest, branch-by-branch read for Round 4.",
      },
      {
        q: "Round 4 me kaun apply kar sakta hai?",
        a: "Round 4 (Phase 2) me sabhi state ke candidates apply kar sakte hain — Bihar, Jharkhand, MP sab. Jo UP se hain lekin Rounds 1–3 me register nahi kar paye ya seat nahi mili, wo bhi Round 4 me fresh choices bhar sakte hain. Other-state candidates open / general category me admit hote hain (UP domicile certificate zaroori nahi). BIPE (code 4455) me abhi apni branch reserve karein — jaise hi choice-filling khule, 4455 add kar dein.",
      },
    ],
    ctaTitle: "Round 4 is open to you — lock your BIPE seat",
    ctaBody: "Reserve your preferred branch at BIPE (code 4455) now, before Round-4 choice-filling opens — free, two minutes. Admissions will call you back in Hindi or English to guide your Phase-2 choices, whichever state you're from.",
  },
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "jeecup-registration-2026",
    shortTitle: "JEECUP Registration 2026",
    title: "JEECUP Registration 2026 · Step-by-step Online Application Guide | BIPE 4455",
    description: "Complete JEECUP 2026 registration guide — online application at jeecup.admissions.nic.in, fee structure, documents needed, deadline (closed 20 May), common errors. Apply to BIPE under code 4455.",
    keywords: [
      "JEECUP registration",
      "JEECUP online registration",
      "JEECUP 2026 application form",
      "JEECUP form fill kaise kare",
      "JEECUP application status",
      "UPJEE Polytechnic registration",
      "JEECUP रजिस्ट्रेशन 2026",
      "JEECUP फॉर्म कैसे भरें",
    ],
    eyebrow: "JEECUP 2026 · ONLINE REGISTRATION GUIDE",
    headline: "JEECUP 2026 registration —",
    headlineAccent: "step-by-step from form to fee.",
    lead: "JEECUP 2026 registration ran from 15 January to 20 May 2026 at jeecup.admissions.nic.in (extended once from the original 30 April deadline). This page walks through the full application flow — eligibility, form sections, document upload, fee payment, what to do if you hit errors — for the 2026 cycle and as a reference template for future years.",
    quickStats: [
      { label: "Portal", value: "jeecup.admissions.nic.in", sub: "Official · UPJEE" },
      { label: "Window", value: "15 Jan – 20 May 2026", sub: "Closed for 2026 cycle" },
      { label: "Fee · General", value: "₹300", sub: "Online · UPI / card / netbanking" },
      { label: "Fee · SC/ST/PH", value: "₹200", sub: "Same payment methods" },
    ],
    steps: [
      {
        n: "01",
        title: "Visit the JEECUP portal and start a new registration",
        body: "Go to jeecup.admissions.nic.in. Click the 'New Registration' link. You will enter your name (matching your Class 10 marksheet exactly), date of birth, mobile number, email address, and create a password. Save the application number that the portal generates — you will need it for the admit card download and every subsequent step.",
      },
      {
        n: "02",
        title: "Fill the personal details and academic information",
        body: "Enter your father's name, mother's name, address, category (General / SC / ST / OBC / EWS / Minority), nationality, domicile state. Then add your Class 10 details: school name, board (UP Board / CBSE / ICSE / others), passing year, total marks, percentage. Lateral-entry candidates (Group K) add their Class 12 / ITI / diploma details too.",
      },
      {
        n: "03",
        title: "Choose your exam group correctly",
        body: "BIPE's 3-year diploma engineering uses Group A — Class-10-pass candidates. Other groups (B, C, D, E, F, G, H, I, K, L) are for different diploma types (Pharmacy, Lateral Entry, etc.). Selecting the wrong group means re-applying entirely. Double-check before you proceed.",
      },
      {
        n: "04",
        title: "Pick exam centre preferences",
        body: "JEECUP lets you pick 3 exam-centre preferences. Pick centres realistic for your travel logistics — preferably your home district or a major adjacent district. Eastern UP centres include Varanasi, Jaunpur, Mau, Ghazipur, Azamgarh, Mirzapur, Sonbhadra. Bihar and other out-of-state applicants can choose Patna, Gaya, Bhagalpur, Muzaffarpur.",
      },
      {
        n: "05",
        title: "Upload documents and photograph",
        body: "Required: passport-size colour photograph (JPG, 10-300 KB, white background, recent), signature (10-50 KB), Class 10 marksheet (PDF, under 2 MB). Most rejected applications fail here — verify size, format and clarity before clicking upload. The portal sometimes shows 'upload failed' for files just outside spec.",
      },
      {
        n: "06",
        title: "Pay the application fee online",
        body: "Pay ₹300 (General / OBC) or ₹200 (SC / ST / Physically Handicapped) via UPI, debit / credit card, or net banking. Save the payment receipt. If your fee shows 'pending' for more than 24 hours, raise a ticket via the JEECUP helpline — do not pay twice (the portal will record the double payment but refund processing takes weeks).",
      },
      {
        n: "07",
        title: "Lock the form and download the application copy",
        body: "Review every detail one final time — names, date of birth, category, exam group, centres, document uploads. Once you click 'Final Submit' the form cannot be edited (a correction window opens later for limited fields). Download the application PDF and print 2 copies for your records and for counselling document verification.",
      },
    ],
    checklist: {
      eyebrow: "Documents to keep handy",
      heading: "What you'll need before starting the form",
      intro: "Many applications stall because a required document is missing or in the wrong format. Gather these BEFORE you open the registration form:",
      items: [
        "Class 10 marksheet (PDF, under 2 MB, all pages clearly legible)",
        "Aadhaar number (the number itself, no PDF needed for registration — only for counselling)",
        "Passport-size colour photograph (JPG, 10-300 KB, white background, taken in the last 6 months)",
        "Signature on white paper (JPG, 10-50 KB, black or blue ink only)",
        "Caste certificate scan (if claiming SC / ST / OBC reservation) — even if not required at registration, you'll need it within 48 hours of allotment",
        "Income certificate (if claiming EWS or scholarship)",
        "Active mobile number that you control (OTPs go here)",
        "Active email address (login + future notifications)",
        "UPI ID or debit / credit card for fee payment",
      ],
    },
    faqs: [
      {
        q: "I missed the 20 May 2026 deadline — can I still register?",
        a: "No. JEECUP 2026 registration closed on 20 May after an extension from the original 30 April deadline. The next opportunity is JEECUP 2027 (typically opens January 2027). In the meantime, BIPE accepts direct applications outside JEECUP for vacant seats — apply via /apply or call +91-9415202879 to discuss your options.",
      },
      {
        q: "I made an error in my form. Can I correct it?",
        a: "JEECUP usually opens a correction window for limited fields (name spelling, photograph, signature) approximately 1 week after registration closes. Major fields like date of birth, category, and exam group are typically NOT correctable. Watch the jeecup.admissions.nic.in homepage for the correction-window dates.",
      },
      {
        q: "Can I apply for BIPE without sitting JEECUP?",
        a: "Yes, but with caveats. JEECUP-route admission is the standard path and gets you a guaranteed allotment through the counselling rounds. BIPE also accepts direct applications for vacant seats after the JEECUP counselling concludes (typically late July / August). Direct admission is rank-independent but seat-limited. WhatsApp +91-7310077788 to ask about current vacancy.",
      },
      {
        q: "What is the JEECUP application fee?",
        a: "₹300 for General / OBC / Minority candidates and ₹200 for SC / ST / Physically Handicapped candidates. Payable online via UPI, debit / credit card, or net banking. The portal accepts payment in INR only.",
      },
      {
        q: "I'm a Bihar resident — can I apply via JEECUP for BIPE?",
        a: "Yes. JEECUP is open to candidates from any state. Bihar residents are admitted in the open / general category — UP-domicile candidates hold the state-reserved seats, while other-state candidates are placed largely in private polytechnics, which is exactly what BIPE is. See our /jeecup-from-bihar and /admission-from-bihar pages for the Bihar-specific transit + documents context.",
      },
      {
        q: "Does BIPE help with the JEECUP form?",
        a: "Yes. WhatsApp +91-7310077788 with your specific question — common ones include exam-centre choice, group selection, category certificate format, and fee payment troubleshooting. We don't charge for application counselling; the conversation is free and we'll answer in English or Hindi.",
      },
    ],
    ctaTitle: "Registration closed for 2026?",
    ctaBody: "BIPE accepts direct applications for vacant seats after JEECUP counselling concludes. WhatsApp the admissions office to check current vacancy or apply directly via the BIPE application form.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "jeecup-admit-card-2026",
    shortTitle: "JEECUP Admit Card 2026",
    title: "JEECUP Admit Card 2026 · Download Guide + Troubleshooting | BIPE 4455",
    description: "Download your JEECUP 2026 admit card from jeecup.admissions.nic.in — step-by-step guide, login process, troubleshooting common errors (missing photo, wrong centre, password issues). Exam window 02–09 June 2026.",
    keywords: [
      "JEECUP admit card",
      "JEECUP admit card 2026",
      "JEECUP admit card download",
      "JEECUP hall ticket",
      "UPJEE admit card",
      "JEECUP एडमिट कार्ड",
      "JEECUP admit card login",
      "JEECUP admit card kaise download kare",
    ],
    eyebrow: "JEECUP 2026 · ADMIT CARD DOWNLOAD GUIDE",
    headline: "JEECUP 2026 admit card —",
    headlineAccent: "download, verify, troubleshoot.",
    lead: "JEECUP 2026 admit cards are released on the JEECUP portal approximately 10 days before the exam window (02–09 June 2026). You'll need your application number and password to download. This page covers the download flow, the details to verify, and what to do if something looks wrong.",
    quickStats: [
      { label: "Released", value: "~10 days pre-exam", sub: "Watch jeecup.admissions.nic.in" },
      { label: "Exam window", value: "02–09 June 2026", sub: "Multiple shifts" },
      { label: "Login fields", value: "Application no. + password", sub: "From registration" },
      { label: "Format", value: "PDF · printable", sub: "Take 2 hard copies" },
    ],
    steps: [
      {
        n: "01",
        title: "Open the official JEECUP portal",
        body: "Visit jeecup.admissions.nic.in. The 'Admit Card / Hall Ticket Download' link is prominent on the homepage during the release window. Do NOT use third-party sites that claim to host admit cards — JEECUP only distributes them via the official portal.",
      },
      {
        n: "02",
        title: "Log in with your application credentials",
        body: "Enter your application number (the 8-digit number you got at registration) and your password. If you forgot the password, use the 'Forgot Password' link — it sends a reset link to your registered email/mobile.",
      },
      {
        n: "03",
        title: "Download and verify every detail on the admit card",
        body: "The admit card shows: your name, date of birth, exam group, exam centre name + full address, reporting time, exam shift timing, photograph, signature, and roll number. Verify EVERY field against your original application. The reporting time is usually 60-90 minutes before the exam shift.",
      },
      {
        n: "04",
        title: "Print 2 hard copies on plain A4 paper",
        body: "Take TWO printouts (in case one is damaged or confiscated at the centre). Black-and-white is acceptable; colour is not required. Keep one in your bag and one with a parent / guardian who'll travel with you to the centre. Carry your ORIGINAL Aadhaar (or another photo ID) along.",
      },
      {
        n: "05",
        title: "Locate your exam centre 1-2 days before the exam",
        body: "If your centre is in a city you don't know well, visit it 1 day before the exam. Note the exact entry gate (some centres have multiple), the parking spot if driving, and confirm public-transport options. JEECUP does NOT allow latecomers — even a 5-minute delay can mean disqualification.",
      },
      {
        n: "06",
        title: "What to bring to the exam centre on test day",
        body: "Printed admit card (2 copies), original Aadhaar or alternate photo ID (PAN / driving licence / passport), 2 blue/black ballpoint pens, transparent water bottle (most centres allow). Mobile phones, smart watches, calculators, papers, and notes are PROHIBITED inside the exam hall.",
      },
    ],
    checklist: {
      eyebrow: "Pre-exam checklist · 24 hours before",
      heading: "What to verify, print, and pack",
      items: [
        "Admit card printed in 2 copies — verified against application details",
        "Original Aadhaar (or alternate photo ID — PAN / passport / driving licence)",
        "2 blue or black ballpoint pens (no gel, no pencil)",
        "Transparent water bottle (filled at home)",
        "Exact route to the exam centre confirmed (Google Maps + ground truth)",
        "Phone fully charged in case you need to reach a parent (must be SUBMITTED at the centre entrance — not carried in)",
        "Mask + sanitiser (some centres still require)",
        "Breakfast / light meal 2 hours before the shift",
        "Bus / cab booked the night before for centres outside your city",
      ],
    },
    faqs: [
      {
        q: "When will the JEECUP 2026 admit card be released?",
        a: "Approximately 10 days before the exam window opens. The 2026 exam window is 02–09 June, so admit cards typically release around 22–25 May. Watch the jeecup.admissions.nic.in homepage banner for the official release announcement, or follow JEECUP's social handles.",
      },
      {
        q: "I forgot my application password — how do I get my admit card?",
        a: "Use the 'Forgot Password' link on the JEECUP login page. Enter your application number — a reset link will be sent to the email and mobile number you registered with. If both are unreachable (e.g., you changed your number), call the JEECUP helpline (see our /jeecup-helpline-contact page) with your application number and identity proof.",
      },
      {
        q: "My photograph on the admit card looks different from what I uploaded — what do I do?",
        a: "Don't panic. Carry your ORIGINAL Aadhaar / photo ID to the exam centre. The invigilator verifies you against the original photo, not the uploaded one. If the printed photo is genuinely unrecognisable (printer issue), download a fresh copy and reprint. Photo quality differences alone don't disqualify you.",
      },
      {
        q: "My exam centre is far from home — can I change it?",
        a: "JEECUP does not allow exam-centre changes after the admit card is released. You picked your 3 preferences during registration, and the system allocates based on availability. Plan to travel and stay overnight near the centre the night before. Do NOT skip the exam over distance — it's a 1-year setback to re-apply.",
      },
      {
        q: "What if I lose my admit card on exam day?",
        a: "This is why you printed 2 copies. If you genuinely lost both, contact the JEECUP helpline immediately — they can sometimes verify your identity at the centre with the application number + photo ID. But this is messy and stressful. Always carry the second copy with a parent.",
      },
      {
        q: "Can BIPE help if I face an admit-card download issue?",
        a: "BIPE doesn't have admin access to the JEECUP portal — only JEECUP's helpline can resolve portal-side issues. But our admissions counsellors can walk you through the download steps and help you escalate to the JEECUP helpline if needed. WhatsApp +91-7310077788.",
      },
    ],
    ctaTitle: "After your JEECUP exam",
    ctaBody: "Once you have your rank card, fill the choice-filling form with BIPE Varanasi (code 4455) as a priority. Read our 7-round counselling guide and book a campus visit to lock in your branch before allotment.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "jeecup-result-2026",
    shortTitle: "JEECUP Result 2026",
    title: "JEECUP Result 2026 · Rank Card Check + What to Do Next | BIPE 4455",
    description: "JEECUP 2026 result is OUT — check your rank at jeecup.admissions.nic.in, download the rank card, understand your category rank and plan counselling. Appeared in JEECUP 2026? Reserve your branch at BIPE (code 4455) before choice-filling.",
    keywords: [
      "JEECUP result",
      "JEECUP result 2026",
      "JEECUP rank card download",
      "JEECUP 2026 marks",
      "JEECUP merit list",
      "UPJEE Polytechnic result",
      "JEECUP रिजल्ट 2026",
      "JEECUP result kaise check kare",
    ],
    eyebrow: "JEECUP 2026 · RESULT IS OUT",
    headline: "JEECUP 2026 result is out —",
    headlineAccent: "check your rank card now.",
    heroAlert: {
      badge: "Result declared",
      text: "JEECUP 2026 results are out. Check your rank on the official portal, then reserve your branch at BIPE (code 4455) before you fill your counselling choices.",
      primary: { label: "Check on JEECUP portal →", href: "https://jeecup.admissions.nic.in" },
      secondary: { label: "Pre-Counselling Registration →", href: "/early-registration" },
    },
    lead: "JEECUP 2026 results are out. Log in at jeecup.admissions.nic.in to see your raw marks, percentile, all-India rank, category rank (if applicable), and to download your rank card. This page walks through the check process and explains what each number means for counselling — and how to reserve your branch at BIPE while the counselling rounds run.",
    quickStats: [
      { label: "Status", value: "Result declared", sub: "Out now — check the portal" },
      { label: "Where", value: "jeecup.admissions.nic.in", sub: "Result tab" },
      { label: "What you get", value: "Marks · Rank · Card", sub: "Downloadable PDF" },
      { label: "Counselling", value: "Begins shortly", sub: "7 rounds through August" },
    ],
    steps: [
      {
        n: "01",
        title: "Go to the JEECUP portal on result day",
        body: "Visit jeecup.admissions.nic.in. Look for the prominent 'Result 2026' link on the homepage. The portal often crashes for the first 2-4 hours on result day due to traffic — be patient and try off-peak (late evening / very early morning).",
      },
      {
        n: "02",
        title: "Log in with your application number and password",
        body: "Same credentials as admit card download. If you've lost them, use 'Forgot Password' or contact the JEECUP helpline.",
      },
      {
        n: "03",
        title: "View your raw marks, percentile, and rank",
        body: "Your result page shows: total marks (out of the exam total), section-wise breakdown (Maths / Physics / Chemistry for Group A), percentile, all-India rank, and category rank (if SC/ST/OBC/EWS). Save a PDF copy. The rank card is what counselling uses, not the marks.",
      },
      {
        n: "04",
        title: "Download the rank card PDF — print 2 copies",
        body: "The rank card is the SINGLE most important document for the rest of the admission process. Print 2 copies. Save the PDF to your phone, a Pendrive, and email it to yourself. Losing the rank card is recoverable (re-login to portal) but slow during peak counselling traffic.",
      },
      {
        n: "05",
        title: "Cross-check your rank against last year's cutoffs",
        body: "Open our /jeecup-cutoff-2026-bipe-vs-government page for the cutoff context. If your rank is below 5,000 — top-tier government polytechnics open. 5,000-20,000 — Eastern UP government polytechnics open. 20,000+ — BIPE's wider rank band is your structural fit. The right strategy depends on where you land.",
      },
      {
        n: "06",
        title: "Plan your counselling choices NOW (before rounds open)",
        body: "Counselling Round 1 opens late June. Don't wait until the choice-filling window starts to think about which branches at which institutes you want. Make a ranked list NOW — talk to family, talk to BIPE counsellors (free, +91-9415202879), and have your 10-20 choice combinations ready when the form opens.",
      },
    ],
    faqs: [
      {
        q: "What rank do I need for BIPE?",
        a: "BIPE's wider rank band typically accommodates ranks from below 1,000 up to about 50,000+ depending on branch and counselling round. Popular branches (CSE, Mechanical) at BIPE typically settle in Rounds 1-3. Rarer branches (Dairy Engineering) may open seats in later rounds. See /jeecup-cutoff-2026-bipe-vs-government for the branch-wise framework.",
      },
      {
        q: "I got 0 marks in one section — am I disqualified?",
        a: "JEECUP doesn't disqualify for low section marks. The total rank is what matters for counselling. However, if your total is below the qualifying threshold (typically 35% for General, lower for reserved categories), you'll be 'Not Qualified' on the result page and won't get a rank card. Re-attempt next cycle.",
      },
      {
        q: "My result shows 'Result Withheld' — what does that mean?",
        a: "Most commonly: document discrepancy detected (Class 10 marksheet doesn't match application), category certificate issue, or an open malpractice / unfair-means investigation. JEECUP usually emails you within 48-72 hours with the specific issue. If you receive no email after 5 days, contact the helpline (see /jeecup-helpline-contact).",
      },
      {
        q: "Can I check my answer sheet / question paper to verify the marks?",
        a: "JEECUP typically opens an Answer Key challenge window 2-3 days after the exam (before the result). If you flagged answers during that window, those challenges are factored into the final result. After result day, no further marks revision is possible — the rank is final.",
      },
      {
        q: "When can I start choice filling at JEECUP?",
        a: "Counselling Round 1 choice filling opens approximately 5-7 days after results. Watch the JEECUP portal banner for the exact dates. The 2026 cycle has 7 rounds total (up from 5), so even if you miss the Round 1 window, Rounds 2-6 provide further opportunities. See /jeecup-counselling for the full round-by-round strategy.",
      },
      {
        q: "Where can I get my BIPE seat-allotment confirmation help?",
        a: "WhatsApp +91-7310077788 with your rank and preferred branch — our counsellors will walk you through the choice-filling order that maximises your odds at BIPE. The conversation is free and we'll answer in English or Hindi. We don't charge for guidance.",
      },
    ],
    ctaTitle: "Got your JEECUP rank?",
    ctaBody: "Talk to BIPE before you fill choices. We'll review your rank, your preferred branch, your home district and give you an honest read on whether government or BIPE fits best — and how to order your choices to maximise the right outcome.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "jeecup-rank-predictor-2026",
    shortTitle: "JEECUP Rank Predictor 2026",
    title: "JEECUP Rank Predictor 2026 · What Your Rank Opens + BIPE Cutoffs | 4455",
    description: "JEECUP 2026 rank guide — what each rank band realistically opens, and BIPE 4455's actual filed closing ranks by branch. Honest rank reading — no fake marks-to-rank calculator.",
    keywords: [
      "JEECUP rank predictor",
      "JEECUP rank predictor 2026",
      "JEECUP rank wise college",
      "JEECUP marks vs rank",
      "JEECUP college predictor",
      "JEECUP rank for BIPE",
      "JEECUP rank list 2026",
      "JEECUP rank kitni honi chahiye",
    ],
    eyebrow: "JEECUP 2026 · RANK PREDICTOR",
    headline: "JEECUP 2026 rank predictor —",
    headlineAccent: "what your rank actually opens.",
    heroAlert: {
      badge: "Result declared",
      text: "JEECUP 2026 results are out. See what your rank realistically opens — then lock your branch at BIPE (code 4455).",
      primary: { label: "Check your rank card →", href: "https://jeecup.admissions.nic.in" },
      secondary: { label: "Pre-Counselling Registration →", href: "/early-registration" },
    },
    lead: "There is no honest way to convert raw marks into an exact JEECUP rank — your rank depends on each year's normalisation (how many candidates sat the exam and how hard the paper was). What we CAN show you, from BIPE's actual filed admission rank lists, is the part that matters: what each rank band realistically opens, and the real closing ranks for every branch at BIPE 4455. Use it to read your rank card — not to guess a number off a calculator.",
    quickStats: [
      { label: "Your real rank", value: "On the rank card", sub: "jeecup.admissions.nic.in" },
      { label: "BIPE Group A closes", value: "~1,69,000", sub: "2025-26 · CSE, the toughest" },
      { label: "Real shot under", value: "1,30,000", sub: "every branch in range" },
      { label: "Pick by interest", value: "Under 50,000", sub: "not rank-constrained" },
    ],
    tables: [
      {
        eyebrow: "Rank-wise outcome",
        heading: "Your Group A rank → what opens",
        intro: "Indicative bands for the 2026 cycle, based on Eastern UP government closing ranks and BIPE's filed cutoffs. Government cutoffs vary by district, branch and category — treat these as direction, not a guarantee.",
        columns: ["Your Group A All-India rank", "What typically opens", "BIPE 4455"],
        rows: [
          ["Under 5,000", "Top-tier government polytechnics (Lucknow / Kanpur band)", "Any branch — well inside"],
          ["5,000 – 20,000", "Eastern UP government polytechnics (Jaunpur ~16k, Mirzapur band)", "Any branch — comfortable"],
          ["20,000 – 50,000", "Mixed government availability; popular branches tighten", "Any branch — pick by interest"],
          ["50,000 – 1,00,000", "Government seats thin out in popular branches", "Real margin, even in later rounds"],
          ["1,00,000 – 1,30,000", "Government options narrow sharply", "Strong chance at every branch"],
          ["1,30,000 – 1,69,000", "Few government seats left", "Still in range — apply early, rounds matter"],
        ],
        note: "Bands are All-India Group A ranks — the same numbers apply whether you're from UP, Bihar or any other state (other-state candidates are admitted in the open / general category). Reserved-category (SC/ST/OBC/EWS) ranks open seats at higher numbers, so your effective reach is wider. WhatsApp your exact rank to +91-7310077788 for a branch-by-branch read.",
        noteLink: { label: "From Bihar? See the JEECUP-from-Bihar guide", href: "/jeecup-from-bihar" },
      },
      {
        eyebrow: "Real cutoffs · not projections",
        heading: "BIPE 4455 real closing ranks",
        intro: "Actual closing ranks from BIPE's Student Admission Rank Lists as filed with JEECUP (Group A · regular) — admitted students, not marketing math. Ranks rose from 2024-25 to 2025-26 as UP's candidate pool grew.",
        columns: ["Branch (BTEUP code)", "2024-25 closing", "2025-26 closing"],
        rows: [
          ["Computer Science & Engg (118)", "1,48,127", "1,68,929"],
          ["Mechanical · Production (113)", "1,58,221", "1,68,298"],
          ["Electrical Engineering (105)", "1,57,754", "1,66,491"],
          ["Civil Engineering (102)", "1,57,313", "1,66,030"],
          ["Dairy Engineering (123)", "— (new branch)", "1,47,826"],
        ],
        note: "Lateral entry (Group K) closes far tighter — roughly 1,750–2,850 in recent years. Full branch + lateral breakdown with admission counts:",
        noteLink: { label: "See the JEECUP rank-list analysis", href: "/blog/jeecup-rank-vs-bipe-4455-cutoffs-2024-2025" },
      },
    ],
    steps: [
      {
        n: "01",
        title: "Get your rank from the rank card — not a calculator",
        body: "Log in at jeecup.admissions.nic.in and download your rank card. It shows your All-India rank and (if applicable) your category rank. That is your real, official rank — no third-party 'predictor' is more accurate than the rank card itself.",
      },
      {
        n: "02",
        title: "Use your All-India Group A rank",
        body: "Read the All-India Group A rank against the bands above. If you have a category rank (SC/ST/OBC/EWS), remember reserved seats open at higher rank numbers — your effective reach is wider than the General band suggests.",
      },
      {
        n: "03",
        title: "Match your rank to what opens",
        body: "Find your band. Below ~50,000 you can choose by interest. Between 50,000 and ~1,30,000 you have real margin at BIPE across branches. Up to ~1,69,000 you are still in range — but apply early, because branch availability tightens in the later counselling rounds.",
      },
      {
        n: "04",
        title: "Shortlist branches before choice-filling opens",
        body: "Don't wait for the window to decide. Make a ranked branch list now, and add BIPE (code 4455) against every branch you'd accept — many applicants list 4455 for all five branches so a lower rank still lands a seat. See our 7-round counselling guide at /jeecup-counselling for the ordering strategy.",
      },
      {
        n: "05",
        title: "Lock your seat early",
        body: "Pre-Counselling Registration reserves your preferred branch at BIPE while the counselling rounds run. It complements JEECUP counselling — you still fill 4455 in the official rounds. Register free, then visit campus within 7 days to confirm.",
      },
    ],
    faqs: [
      {
        q: "Is there a JEECUP marks vs rank formula?",
        a: "No reliable one. JEECUP doesn't publish a fixed marks-to-rank table, because rank depends on each year's normalisation — the number of candidates and the difficulty of the paper both move it. Any site claiming an exact 'marks to rank' conversion is guessing. The only accurate rank is the one on your official rank card.",
      },
      {
        q: "What rank do I need for BIPE?",
        a: "In 2025-26 every Group A branch at BIPE 4455 closed between roughly 1,47,000 and 1,69,000. So if your Group A All-India rank is under ~1,30,000 you have a real shot at any branch; under ~1,00,000 you have margin even in later rounds; under 50,000 you can choose purely by interest. Lateral entry (Group K) is far tighter — roughly 1,750–2,850.",
      },
      {
        q: "I'm from Bihar or another state — do these rank bands apply to me?",
        a: "Yes. JEECUP issues one All-India Group A rank, and the bands above apply to every candidate regardless of home state. As an other-state candidate you're admitted in the open / general category — no UP domicile certificate is needed for a private polytechnic like BIPE. See the step-by-step at /jeecup-from-bihar and the documents list at /admission-from-bihar.",
      },
      {
        q: "What rank do I need for Computer Science at BIPE?",
        a: "CSE (BTEUP 118) is BIPE's most competitive branch and still closed at rank 1,68,929 in 2025-26 (up from 1,48,127 the year before). A Group A rank under ~1,40,000 gives a comfortable shot at CSE; closer to the closing rank, secure it in an early counselling round rather than waiting.",
      },
      {
        q: "My rank is above 1,50,000 — do I still have options?",
        a: "Yes. BIPE's 2025-26 closing ranks ran up to ~1,69,000, so ranks in the 1,50,000s were admitted last cycle. Apply early and keep BIPE 4455 in your choice list across rounds. WhatsApp +91-7310077788 with your rank and we'll give you an honest, branch-by-branch read.",
      },
      {
        q: "Are these the official cutoffs?",
        a: "These are BIPE's actual filed Student Admission Rank Lists (real admitted students for 2024-25 and 2025-26), not projections. JEECUP itself doesn't publish a single 'cutoff' before counselling — closing ranks are only known after each round. Use these as a realistic guide; your final allotment depends on the live counselling rounds.",
      },
      {
        q: "Rank kitni honi chahiye BIPE ke liye?",
        a: "Group A me agar aapki All-India rank 1,30,000 se kam hai to BIPE ki kisi bhi branch me achhi chance hai; 1,00,000 se kam hai to baad ke rounds me bhi margin hai; 50,000 se kam hai to apni pasand ki branch chun sakte hain. 2025-26 me sabhi branches 1,47,000–1,69,000 ke beech band hui thi. Apni exact rank +91-7310077788 par WhatsApp karein.",
      },
    ],
    ctaTitle: "Know your rank — now place it right.",
    ctaBody: "Send us your JEECUP rank and we'll tell you, honestly, which branches are realistic at BIPE and how to order your counselling choices to land one. Free, in English or Hindi — and we'll hold your preferred branch with Early Seat Registration while the rounds run.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "jeecup-seat-allotment-2026",
    shortTitle: "JEECUP Seat Allotment 2026",
    title: "JEECUP Seat Allotment 2026 · 7-Round Cycle + How to Check | BIPE 4455",
    description: "JEECUP 2026 seat allotment guide — 7 counselling rounds (expanded from 5), how to check allotment, what 'freeze / float / withdraw' means, when to switch to spot round. BIPE participates under code 4455.",
    keywords: [
      "JEECUP seat allotment",
      "JEECUP seat allotment result",
      "JEECUP allotment 2026",
      "JEECUP online counselling",
      "JEECUP round 1 allotment",
      "JEECUP seat allotment kaise check kare",
      "JEECUP seat allotment result 2026",
      "JEECUP काउंसलिंग सीट अलॉटमेंट",
    ],
    eyebrow: "JEECUP 2026 · SEAT ALLOTMENT GUIDE",
    headline: "JEECUP 2026 seat allotment —",
    headlineAccent: "round-wise · freeze, float, or withdraw.",
    lead: "JEECUP 2026 introduced 7 counselling rounds (expanded from 5 in previous years), running from late June through August 2026. This page covers how seat allotment works at each round, when to freeze your seat, when to float for an upgrade, and how the institute-level spot round (Round 7) works at BIPE.",
    quickStats: [
      { label: "Total rounds", value: "7 (was 5)", sub: "Expanded for 2026 cycle" },
      { label: "Counselling opens", value: "Late June 2026", sub: "After JEECUP results" },
      { label: "Spot round", value: "Round 7 · August", sub: "Institute-level at BIPE" },
      { label: "BIPE code", value: "4455", sub: "Single institute code · 5 branches" },
    ],
    steps: [
      {
        n: "01",
        title: "Round 1 · First-merit allotment",
        body: "After choice filling closes, JEECUP processes ranks against your choice list and the cascading-preference algorithm. Top-rank holders get their first choice; lower ranks fill cascading. Allotment shows on the portal under 'Seat Allotment Result Round 1'. You have a fixed window (usually 3-5 days) to confirm with seat-acceptance fee.",
      },
      {
        n: "02",
        title: "Round 2 · Upgrade + fresh allotment",
        body: "Seats that Round-1 candidates declined or didn't confirm reopen. You can FREEZE your Round-1 seat (keep it permanently, exit counselling), FLOAT for an upgrade (try for a better branch/institute while keeping current seat as floor), or WITHDRAW (exit entirely). Float is safe — if no upgrade, you keep your Round-1 seat.",
      },
      {
        n: "03",
        title: "Rounds 3, 4, 5 · Further upgrade windows",
        body: "Same freeze/float/withdraw logic across each subsequent round. Most BIPE choice-holders settle by Round 3. The expanded 2026 cycle (Rounds 5-6) gives more late-stage upgrade opportunities — useful if your preferred branch had a sharp cutoff in earlier rounds.",
      },
      {
        n: "04",
        title: "Round 6 · Final main-round allotment",
        body: "Last centrally-administered round. After this, the only path to a JEECUP-allotted seat is the institute-level spot round (Round 7). Most candidates have settled by now. If you're still floating, this is your last chance to upgrade via the central portal.",
      },
      {
        n: "05",
        title: "Round 7 · Institute-level spot round",
        body: "Vacant seats after Round 6 are filled by institutes (BIPE) directly under JEECUP supervision. You apply ON-CAMPUS at BIPE, not through the central portal. BIPE's spot round typically has 10-30 vacancies across branches each year — direct application, less competitive than central rounds, but you must visit Phoolpur in person.",
      },
      {
        n: "06",
        title: "After allotment · pay fees + report to BIPE",
        body: "Once you confirm a seat (in any round), pay the seat-acceptance fee through the JEECUP portal within the round's window (usually 3-5 days). Then physically report to BIPE Phoolpur for document verification — bring originals + 2 self-attested copies of everything on our /documents page. The seat is provisional until verification clears.",
      },
    ],
    faqs: [
      {
        q: "How do I check my JEECUP seat allotment result?",
        a: "Log in to jeecup.admissions.nic.in with your application number and password. Click 'Seat Allotment Result' for the current round. Your allotted institute and branch (or 'Not Allotted') will display. Download the provisional allotment letter — you'll need it for fee payment and reporting.",
      },
      {
        q: "What does 'Freeze / Float / Withdraw' mean in JEECUP counselling?",
        a: "FREEZE: keep your current seat permanently; you exit counselling. FLOAT: keep your current seat as the floor while trying for an upgrade in the next round; if no upgrade, you retain the current seat. WITHDRAW: exit counselling entirely; your seat is released. Use Freeze if you're happy with the allotment. Use Float if you genuinely prefer the upgrade. Avoid Withdraw unless you're choosing a non-JEECUP path.",
      },
      {
        q: "What if I'm not allotted any seat in Round 1?",
        a: "You stay in the system for Round 2. The counselling algorithm processes you against new vacancies (seats that Round-1 allottees declined). Your choice list carries forward. Don't panic — many candidates allotted at BIPE settled in Rounds 2 or 3, not Round 1.",
      },
      {
        q: "Can I add new institutes / branches to my choice list across rounds?",
        a: "Generally no — choice filling happens once before Round 1 opens. However, some rounds may briefly reopen the choice form for new candidates or for updates. Your best strategy is to list 15-25 choices upfront, ordered by genuine preference, so you don't need mid-cycle edits.",
      },
      {
        q: "How does BIPE's spot round work?",
        a: "BIPE's spot round opens after Round 6 closes — typically late July / early August 2026. You visit BIPE Phoolpur in person with your JEECUP rank card and documents. The placement-cell desk reviews your rank against current vacancies and offers a seat if you qualify. Spot-round students join the same orientation as Round-1-6 students. WhatsApp +91-7310077788 to confirm spot-round dates before travelling.",
      },
      {
        q: "What if I'm allotted BIPE but I want to upgrade?",
        a: "Float in the next round. Your BIPE seat is held as your floor; if no upgrade comes through, you keep it. The risk is small. Floating once or twice for a meaningful upgrade is rational — floating indefinitely chasing marginal upgrades risks missing reporting deadlines. Most BIPE choice-holders float once at most.",
      },
    ],
    ctaTitle: "Allotted BIPE — what's next?",
    ctaBody: "Once your seat is allotted and confirmed, the next step is document verification at our Phoolpur campus within the JEECUP deadline. Bring originals + 2 self-attested copies. Our placement cell helps you settle in and review your branch curriculum.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "jeecup-document-verification-checklist",
    shortTitle: "JEECUP Document Verification",
    title: "JEECUP Document Verification Checklist 2026 · Complete List | BIPE 4455",
    description: "Complete document checklist for JEECUP 2026 seat allotment + reporting at BIPE Phoolpur — originals, photocopies, certificates, what to do if a document is delayed.",
    keywords: [
      "JEECUP document",
      "JEECUP document verification",
      "JEECUP documents required",
      "JEECUP reporting documents",
      "JEECUP काउंसलिंग के लिए डॉक्यूमेंट",
      "JEECUP seat reporting checklist",
      "JEECUP document list 2026",
    ],
    eyebrow: "JEECUP 2026 · DOCUMENT CHECKLIST",
    headline: "JEECUP 2026 document checklist —",
    headlineAccent: "originals, copies, and the timeline.",
    lead: "Document verification is the final step between allotment and a confirmed BIPE seat. Most rejected candidates fail not on rank but on missing or incorrect documents at reporting. This page lists every document you'll need, when you'll need it, and what to do if any are delayed.",
    quickStats: [
      { label: "When you need them", value: "At BIPE reporting", sub: "Within JEECUP's window" },
      { label: "Where", value: "BIPE Phoolpur", sub: "In person · originals required" },
      { label: "Copies needed", value: "2 self-attested", sub: "Per document" },
      { label: "Most-failed step", value: "Caste / income cert", sub: "Often delayed at tehsil" },
    ],
    steps: [
      {
        n: "01",
        title: "Identity + JEECUP-linked documents (required)",
        body: "Class 10 marksheet + certificate (original + 2 photocopies), Aadhaar card (original + photocopy), JEECUP application form printout, JEECUP rank card / allotment letter (printout). These four are mandatory for every candidate at every round of reporting.",
      },
      {
        n: "02",
        title: "Class 12 / ITI / B.Sc certificate (for Group K only)",
        body: "Lateral-entry candidates (Group K, joining 2nd year directly) need their Class 12 / ITI / B.Sc / equivalent certificate plus all-year marksheets. Group A candidates (3-year diploma from Class 10) don't need this.",
      },
      {
        n: "03",
        title: "Domicile / residence certificate (UP-quota claimants)",
        body: "If you're claiming UP state quota (most BIPE allottees), bring your UP-issued domicile or residence certificate. Bihar / other-state candidates admitted in the open / general category don't need this. Issued by your tehsil office — start the application 2-3 weeks before reporting.",
      },
      {
        n: "04",
        title: "Caste certificate (SC / ST / OBC claimants)",
        body: "If you claimed SC / ST / OBC reservation in your JEECUP application, you MUST produce a valid caste certificate (issued in the last 3 years, your name + father's name matching the marksheet) at reporting. Without it, your reservation lapses and your seat may shift to general category — losing your branch.",
      },
      {
        n: "05",
        title: "Income certificate (EWS / scholarship claimants)",
        body: "EWS reservation needs an income certificate showing family income below ₹8 lakh/year. UP Post-Matric Scholarship requires income below ₹2 lakh/year. Both are issued by the tehsil office — typically 1-2 weeks to process. Apply EARLY.",
      },
      {
        n: "06",
        title: "Character certificate + Transfer certificate from your school",
        body: "Both issued by your Class 10 (or Class 12, for Group K) school. Often forgotten until the last minute. Visit your school 1 week before reporting to collect both — they're usually free or have a nominal fee.",
      },
      {
        n: "07",
        title: "Passport-size photographs (8-10 copies)",
        body: "Recent colour photographs with white background. Most candidates underestimate the count — institute records, ID card, hostel registration, library card, exam roll number, branch records, photo album for the placement file, etc. 8-10 keeps you covered.",
      },
      {
        n: "08",
        title: "Medical fitness certificate (carry one to be safe)",
        body: "Some institutes ask for a basic medical fitness certificate from a registered MBBS doctor. BIPE doesn't require it for diploma admission, but it's cheap and quick to get (~₹100-300) and saves last-minute panic if some round / institute does ask.",
      },
    ],
    checklist: {
      eyebrow: "Quick-reference packing list",
      heading: "What goes in your folder",
      items: [
        "Class 10 marksheet — original + 2 self-attested photocopies",
        "Class 10 passing certificate — original + 2 copies",
        "JEECUP application form printout (the PDF saved after registration)",
        "JEECUP rank card / Allotment letter (downloaded from portal)",
        "Aadhaar card — original + photocopy",
        "Domicile / residence certificate (UP-quota only)",
        "Caste certificate (if reservation claimed) — issued within 3 years",
        "Income certificate (if EWS / scholarship claimed)",
        "Character certificate from Class 10 school",
        "Transfer certificate (TC) from Class 10 school",
        "Class 12 / ITI / B.Sc certificate (Group K lateral-entry only)",
        "8-10 recent passport-size colour photographs",
        "Medical fitness certificate (precautionary)",
        "Demand draft / fee receipt (per round's instructions)",
      ],
    },
    faqs: [
      {
        q: "What if my caste certificate isn't ready by the reporting deadline?",
        a: "Inform BIPE's admissions office immediately — WhatsApp +91-7310077788. We can often hold a provisional admission for 7-14 days while you complete the certificate at the tehsil. But you MUST flag this proactively; we can't help if you arrive on reporting day with no certificate and no notice.",
      },
      {
        q: "Do I need original documents or do photocopies work?",
        a: "Originals are required at the reporting desk for verification. Photocopies (2 self-attested per document) are also required and stay with BIPE's records. The originals are returned after verification. Carry both — don't show up with only one or the other.",
      },
      {
        q: "What is 'self-attestation'?",
        a: "Sign each photocopy with the words 'Attested by self' or 'Self-attested' followed by your signature. No gazetted-officer signature needed. This is the standard format for JEECUP / BTE UP document submission.",
      },
      {
        q: "I lost my Class 10 marksheet — what do I do?",
        a: "Contact your Class 10 board (UP Board / CBSE / etc.) for a duplicate marksheet. The process takes 2-4 weeks. If your reporting deadline is sooner, contact BIPE's admissions office — we can sometimes accept the provisional duplicate certificate while the original is being re-issued. Don't skip reporting.",
      },
      {
        q: "Do I need to bring documents for the JEECUP exam itself?",
        a: "For the exam: only your admit card + photo ID (Aadhaar / passport / driving licence). All the documents above are for AFTER allotment, at the reporting / verification stage. See /jeecup-admit-card-2026 for the exam-day packing list.",
      },
    ],
    ctaTitle: "Documents in order — ready to report?",
    ctaBody: "BIPE's admissions office is open Monday-Saturday 9am-5pm for reporting. We provide a checklist re-verification at the desk so you can catch any missing item before the JEECUP deadline. WhatsApp ahead to confirm your reporting day.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "jeecup-helpline-contact",
    shortTitle: "JEECUP Helpline",
    title: "JEECUP Helpline 2026 · Official Contact, Email, Support | BIPE 4455",
    description: "JEECUP 2026 helpline contacts — official phone numbers, email IDs, support windows for registration, admit card, result, and counselling issues. Plus BIPE counsellor support.",
    keywords: [
      "JEECUP helpline",
      "JEECUP helpline number",
      "JEECUP contact",
      "JEECUP customer care",
      "JEECUP support",
      "JEECUP helpline 2026",
      "JEECUP हेल्पलाइन नंबर",
      "UPJEE Polytechnic helpline",
    ],
    eyebrow: "JEECUP 2026 · OFFICIAL HELPLINE + SUPPORT",
    headline: "JEECUP 2026 helpline —",
    headlineAccent: "where to call when something breaks.",
    lead: "Most JEECUP 2026 issues — payment failures, admit-card download errors, result-portal crashes, allotment confusion — resolve via the official JEECUP helpline. This page lists the verified contact channels, expected response times, and an honest assessment of when to call which channel. BIPE counsellor support is also listed at the bottom for issues that need institute-side help.",
    quickStats: [
      { label: "Official portal", value: "jeecup.admissions.nic.in", sub: "All official notices" },
      { label: "Helpline hours", value: "Mon-Sat · 10am-5pm", sub: "Closed Sundays + holidays" },
      { label: "Response time", value: "Same day for portal issues", sub: "Slower for fee/marks disputes" },
      { label: "BIPE counsellor", value: "+91-9415202879 · call · +91-9415202879 · WhatsApp", sub: "EN / हिंदी" },
    ],
    contacts: {
      eyebrow: "Official JEECUP helpline channels",
      heading: "Direct contacts (verified)",
      items: [
        { label: "Official portal banner", value: "jeecup.admissions.nic.in (helpline number changes annually — always verify on the homepage banner at result time)", href: "https://jeecup.admissions.nic.in" },
        { label: "Official email (general)", value: "Contact via the 'Help / Contact' form on the JEECUP portal — direct email IDs are published per cycle" },
        { label: "Office address", value: "Joint Entrance Examination Council (UP), Director's Office at the Board of Technical Education building, Lucknow" },
        { label: "BIPE counsellor (institute-side issues)", value: "+91-9415202879 (call) · +91-7310077788 (WhatsApp) · EN / हिंदी", href: "https://wa.me/917310077788" },
        { label: "BIPE email (admissions support)", value: "info@bipe.ac.in", href: "mailto:info@bipe.ac.in" },
      ],
    },
    steps: [
      {
        n: "01",
        title: "First — search the official portal for your specific issue",
        body: "Many issues are documented in JEECUP's FAQ + Notice section. Specifically: payment failures, password reset, admit card download issues, and allotment letter problems usually have dedicated notice-board entries. Search before calling.",
      },
      {
        n: "02",
        title: "Use the portal's 'Contact / Help' form for written issues",
        body: "Better than phone for issues that need investigation (payment not credited, marks mismatch, certificate validation). Submit with your application number, the specific issue, screenshots if possible. Response typically same-day to 48 hours.",
      },
      {
        n: "03",
        title: "Call the helpline number listed on the portal homepage",
        body: "The official helpline number is published on jeecup.admissions.nic.in homepage during the live cycle (registration, admit-card, result, counselling). It changes year to year — always verify, don't rely on old numbers from third-party sites. Mon-Sat 10am-5pm, IST.",
      },
      {
        n: "04",
        title: "Visit the JEECUP office in Lucknow only for serious issues",
        body: "For document disputes that the helpline can't resolve remotely (e.g., name correction after final submission), in-person visits to the JEECUP / BTE UP office in Lucknow are the last resort. Plan an overnight trip — same-day resolution is rare.",
      },
      {
        n: "05",
        title: "BIPE counsellor support — for institute-side guidance",
        body: "If your issue is about BIPE specifically (where to fit in your choice list, when to report, what documents BIPE needs, whether to wait for an upgrade), call our admissions counsellor at +91-9415202879. We don't have access to your JEECUP portal but we can advise on the BIPE-side decisions.",
      },
    ],
    faqs: [
      {
        q: "What is the official JEECUP helpline number?",
        a: "The official JEECUP helpline number is published on jeecup.admissions.nic.in homepage during each live cycle (registration, admit-card, result, counselling). It changes year to year. Always verify the current number from the official portal banner — do NOT use numbers from third-party aggregator sites, as those are often outdated or fraudulent.",
      },
      {
        q: "JEECUP didn't credit my fee payment — what do I do?",
        a: "Wait 24 hours first (banking delays are common). After 24 hours: log in to the JEECUP portal, go to 'Payment Status' → if it shows 'Pending', raise a ticket via the Help form. Include your payment transaction number, bank, date, amount. JEECUP usually reconciles within 5-7 working days. Do NOT pay twice — the second payment will be flagged and refunds take weeks.",
      },
      {
        q: "I can't log in to the JEECUP portal — what should I try?",
        a: "Standard fixes: clear browser cache, try a different browser (Chrome works most reliably with JEECUP), check if your application number is correct (8 digits), reset password via the 'Forgot Password' link. If none work, the portal may be under maintenance — try after 2 hours. If the issue persists, contact the helpline.",
      },
      {
        q: "I missed a counselling round deadline — can BIPE help?",
        a: "BIPE doesn't control JEECUP's counselling timelines, but missed deadlines are often recoverable if you contact the helpline within 24-48 hours. If you missed the seat-confirmation window, your allotment is released — you re-enter for the next round. If you missed the institute reporting window, contact BIPE directly to discuss provisional reporting under extenuating circumstances.",
      },
      {
        q: "Where can I read JEECUP's official notifications?",
        a: "Only on jeecup.admissions.nic.in's notice board. Third-party sites (Careers360, Shiksha, CollegeDunia) often summarise these but can lag by 1-3 days and sometimes have transcription errors. For dates, fees, and policy decisions, go directly to the JEECUP portal.",
      },
    ],
    ctaTitle: "BIPE admissions counsellor on WhatsApp",
    ctaBody: "For BIPE-specific questions — choice-filling strategy, document checklists, branch-by-branch fit, when to visit — WhatsApp +91-7310077788. Free, no enrolment pressure, EN / हिंदी.",
  },

  // ─────────────────────────────────────────────────────────────────
  // Phase 5 expansion · May 2026 · JEECUP keyword-gap fill
  // Five additional procedural pages targeting JEECUP search clusters
  // not covered by Phase 2 batch — highest-volume gaps first.
  // ─────────────────────────────────────────────────────────────────

  {
    slug: "jeecup-syllabus-2026",
    shortTitle: "JEECUP Syllabus 2026",
    title: "JEECUP Syllabus 2026 · Group-wise Topics + Weightage | BIPE 4455",
    description: "Complete JEECUP 2026 syllabus — Group A (Class 10 Maths/Physics/Chemistry) and all other groups, topic-by-topic breakdown, weightage, recommended books, NCERT-mapping. From BIPE.",
    keywords: [
      "JEECUP syllabus",
      "JEECUP syllabus 2026",
      "JEECUP Group A syllabus",
      "UPJEE Polytechnic syllabus",
      "JEECUP topics weightage",
      "JEECUP सिलेबस",
      "JEECUP सिलेबस 2026",
    ],
    eyebrow: "JEECUP 2026 · SYLLABUS BREAKDOWN",
    headline: "JEECUP 2026 syllabus —",
    headlineAccent: "topic-by-topic, group-by-group.",
    lead: "JEECUP 2026 is conducted across 12 groups (A through L) — each with a distinct syllabus. BIPE's 3-year diploma uses Group A — Class 10 Maths, Physics, Chemistry. This page covers Group A in full detail, plus a brief on the other 11 groups so you can pick the right one if you're considering a non-diploma path.",
    quickStats: [
      { label: "Total groups", value: "12 (A–L)", sub: "Different syllabi per group" },
      { label: "Group A · BIPE", value: "Class 10 syllabus", sub: "Maths · Physics · Chemistry" },
      { label: "Questions", value: "100", sub: "Multiple-choice · CBT format" },
      { label: "Duration", value: "2.5 hours", sub: "150 minutes · single shift" },
    ],
    steps: [
      {
        n: "01",
        title: "Identify your group — Group A for BIPE's 3-year diploma",
        body: "JEECUP's 12 groups serve different programmes. Group A: 3-year diploma engineering (BIPE's path · open to Class 10 pass students). Group B: Agriculture Engineering. Group C: Fashion Design + Home Science. Group D: Modern Office Management. Group E: Pharmacy. Group F: Bio-tech Diploma. Group G: PG Diploma (Class 12 pass). Group H: Hotel Mgmt + Tourism. Group I: Aircraft Maintenance. Group J: Information Tech (lateral). Group K: Lateral Entry to 2nd-year diploma (for ITI / Class 12 candidates). Group L: Diploma in Pharmacy (D.Pharm).",
      },
      {
        n: "02",
        title: "Group A · Mathematics syllabus (50 questions, 50% weightage)",
        body: "Algebra (sets, real numbers, polynomials, linear equations), Quadratic equations + progressions, Trigonometry (ratios, identities, heights and distances), Co-ordinate geometry (straight lines, circles), Mensuration (areas + volumes), Statistics (mean, median, mode, probability basics), Number system + commercial mathematics. All from Class 10 NCERT (or equivalent state board).",
      },
      {
        n: "03",
        title: "Group A · Physics syllabus (25 questions, 25% weightage)",
        body: "Motion + Newton's laws, Work-Energy-Power, Gravitation + fluid mechanics, Heat + thermodynamics basics, Light (reflection + refraction), Electricity + magnetism (basic circuits), Current electricity, Sound + waves. Class 10 level — NCERT Class 9 + 10 Science chapters are the canonical source.",
      },
      {
        n: "04",
        title: "Group A · Chemistry syllabus (25 questions, 25% weightage)",
        body: "Matter (states, classification, atomic structure), Periodic table + chemical bonding basics, Chemical reactions (types, balancing, stoichiometry), Acids/bases/salts, Metals + non-metals, Carbon compounds (intro to organic chemistry), Environmental chemistry. Same NCERT Class 9 + 10 Science source.",
      },
      {
        n: "05",
        title: "Recommended books beyond NCERT",
        body: "For Group A: NCERT Class 9 + 10 (mandatory baseline) + R.D. Sharma Class 10 Mathematics (for problem variety) + Arihant JEECUP Solved Papers (last 5 years) + S. Chand objective Chemistry / Physics (optional, for additional practice). BIPE library carries these — students can borrow before joining.",
      },
      {
        n: "06",
        title: "How to prepare a 3-month syllabus schedule",
        body: "Month 1: Concept revision · NCERT thoroughly · 2 chapters per week per subject (3 subjects = 6 chapters/week). Month 2: Topic-wise problem solving · 50+ problems per topic · identify weak areas. Month 3: Mock tests + previous-year papers · 1 full test every 3 days · review wrong answers in detail. Last 2 weeks: Speed-and-strategy · focus only on weak topics + time management drills.",
      },
    ],
    faqs: [
      {
        q: "Is JEECUP syllabus the same every year?",
        a: "Structurally yes — Class 10 NCERT-based for Group A — but JEECUP authority publishes the official syllabus PDF each cycle (sometimes with minor topic-emphasis updates). For 2026, the syllabus is broadly identical to 2025 and 2024. Always cross-check the current-cycle official PDF on jeecup.admissions.nic.in before deep prep.",
      },
      {
        q: "Where can I download the official JEECUP syllabus PDF?",
        a: "Only on jeecup.admissions.nic.in → 'Information Bulletin' or 'Syllabus' tab during the active cycle (Jan-May for 2026). Third-party sites republish it but can lag. For authoritative current cycle, go to the source.",
      },
      {
        q: "How much weightage does each subject carry in Group A?",
        a: "Mathematics 50 questions (50%), Physics 25 questions (25%), Chemistry 25 questions (25%). Total 100 questions, 100 marks (1 mark per question). Negative marking applies — typically -0.25 to -0.33 per wrong answer depending on the cycle's policy.",
      },
      {
        q: "Do I need to study Class 11-12 Maths/Physics/Chemistry for JEECUP Group A?",
        a: "No. Group A is strictly Class 10 syllabus. Class 11-12 topics aren't tested for Group A. (Groups G, J, K — the lateral entry / Class 12 pass routes — have Class 11-12 syllabus.)",
      },
      {
        q: "Are NCERT books enough to crack JEECUP Group A?",
        a: "For most students at 90+ percentile rank — yes. Class 9 + 10 NCERT thoroughly + previous 5 years JEECUP papers gets you to a competitive rank. Beyond that, reference books help with problem-solving stamina but aren't strictly required.",
      },
      {
        q: "Where can I find topic-wise weightage from past JEECUP papers?",
        a: "Available on /jeecup-previous-year-papers (BIPE's analysis page) — we break down each past year's paper by topic and identify high-yield areas. Concept-level depth analysis isn't on the official syllabus PDF, which only lists topics.",
      },
    ],
    ctaTitle: "Need a study plan for JEECUP Group A?",
    ctaBody: "BIPE's admissions team has helped 1,000+ students through JEECUP prep. WhatsApp +91-7310077788 with your current preparation level (started · midway · pre-exam) and we'll send a free 30/60/90-day study plan tailored to your timeline.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "jeecup-previous-year-papers",
    shortTitle: "JEECUP Previous Year Papers",
    title: "JEECUP Previous Year Papers 2025-2020 · Download + Analysis | BIPE 4455",
    description: "JEECUP previous year question papers (2020-2025) — where to download, topic-wise weightage analysis, what repeats year-on-year, sample paper approach. From BIPE.",
    keywords: [
      "JEECUP previous year papers",
      "JEECUP question paper download",
      "JEECUP sample papers",
      "JEECUP past year question papers",
      "JEECUP 2025 paper",
      "JEECUP solved papers",
      "JEECUP previous year question paper",
    ],
    eyebrow: "JEECUP 2026 · PAST PAPERS",
    headline: "JEECUP previous year papers —",
    headlineAccent: "what repeats, what shifts.",
    lead: "Previous-year question papers are the single most reliable JEECUP prep tool. They show you topic weightage, question difficulty patterns, and the specific subtopics JEECUP favours year after year. This page covers where to download official JEECUP past papers (2020-2025), how to use them, and the patterns BIPE's mentors have noticed across cycles.",
    quickStats: [
      { label: "Years available", value: "2020-2025", sub: "Last 6 cycles · all groups" },
      { label: "Question repeat rate", value: "~15-20%", sub: "Concepts repeat · exact ?s rare" },
      { label: "Best use", value: "Last 3 months", sub: "After NCERT concept revision" },
      { label: "Free sources", value: "JEECUP portal + BIPE archive", sub: "Official + curated" },
    ],
    steps: [
      {
        n: "01",
        title: "Download from the JEECUP portal — the authoritative source",
        body: "Visit jeecup.admissions.nic.in → 'Question Papers' or 'Information Bulletin' archive (menu label varies). Each year's PDFs include the question paper + the official answer key (released ~1 week after the exam). Past papers are free to download · no login required for archived years.",
      },
      {
        n: "02",
        title: "Identify the years that matter for your prep",
        body: "Most recent 3 years (2023, 2024, 2025) reflect the current question style and topic emphasis. Years 2020-2022 show longer-term patterns. Prioritise the most recent 3 — solve all 3 thoroughly. The older 3 are for additional practice if time permits, but don't over-invest there.",
      },
      {
        n: "03",
        title: "Solve in test conditions — 2.5 hours, no breaks",
        body: "Set a timer for 150 minutes. Sit in a quiet room. No breaks, no phone, no notes. Treat it as a real exam. After completing, score using the official answer key. This tells you your CURRENT level — not your potential. Don't fool yourself with 'I would have done better with X' — the score is the score.",
      },
      {
        n: "04",
        title: "Review wrong answers in DETAIL — not just check-and-move",
        body: "For every wrong answer: (a) identify the topic, (b) re-read the related NCERT chapter, (c) solve 3-5 similar problems from R.D. Sharma or another reference, (d) write a short note on what you missed. This is what separates students who improve cycle-over-cycle from those who plateau. The wrong-answer review is the prep — the solving was just diagnostic.",
      },
      {
        n: "05",
        title: "Track topic-wise weightage across the 3 most-recent papers",
        body: "Make a simple spreadsheet: rows = topics from the syllabus, columns = 2023/2024/2025 question counts. Fill it from your solved papers. The pattern that emerges: typically ~30% of the syllabus produces ~70% of the questions year after year. Prioritise that 30% in the final 4 weeks of prep.",
      },
      {
        n: "06",
        title: "Use BIPE's curated topic-weightage chart for confirmation",
        body: "BIPE's academic mentors have analysed all JEECUP papers from 2020-2025 and published a topic-weightage chart for Group A. Cross-check your own spreadsheet against ours. Ask via WhatsApp — we share the PDF chart for free with anyone considering BIPE.",
      },
    ],
    faqs: [
      {
        q: "Do questions repeat exactly in JEECUP year after year?",
        a: "Rarely. Exact-question repeats are ~5% at most. CONCEPT-level repeats are much more common — typically 60-80% of topics tested in one year reappear (possibly with different question framing) in the next. So past papers train you on concepts, not on memorising specific questions.",
      },
      {
        q: "Where can I find solved JEECUP papers (with explanations)?",
        a: "Arihant + Disha Publications publish solved papers with detailed explanations (typically ₹150-300 per book covering 5-10 years). For BIPE students, our academic mentors have curated free PDF solutions for the last 3 years — WhatsApp us to request. Free online sources (Careers360, BYJU's blog) have partial solutions but quality varies.",
      },
      {
        q: "How many past papers should I solve before the actual JEECUP exam?",
        a: "Minimum: last 3 cycles (2023, 2024, 2025). Ideal: last 5 cycles. Beyond that, diminishing returns kick in — older papers reflect older topic emphases that may not apply anymore. Most JEECUP toppers solve 4-5 full past papers + several topic-focused sub-papers in the last 6 weeks.",
      },
      {
        q: "Should I solve past papers in chronological order or shuffled?",
        a: "Recommended order: start with the MOST RECENT paper first (2025) — shows you current standard. Then work backwards. Reason: you want to gauge your current performance against the most recent benchmark before doing older papers. Reverse-chronological order also keeps motivation up (modern questions feel more 'real').",
      },
      {
        q: "Are JEECUP mock tests as good as previous year papers?",
        a: "Past papers are gold-standard — they're real JEECUP language and difficulty. Mock tests (published by coaching institutes) are useful for additional practice but vary in quality. If you have time for both: do 4-5 past papers first, then add 2-3 mock tests in the last 2 weeks. Don't substitute mocks for past papers.",
      },
      {
        q: "Can I rely only on past papers without studying NCERT?",
        a: "No. Past papers TEST what you know — they don't TEACH the concepts. If you can't solve a problem after looking at the answer key, the gap is in NCERT-level conceptual understanding. Always do NCERT first, then past papers. Both are needed.",
      },
    ],
    ctaTitle: "Want BIPE's curated past-paper analysis?",
    ctaBody: "Our academic mentors have analysed JEECUP papers 2020-2025 and produced a topic-weightage chart + sample answer sheets. WhatsApp +91-7310077788 and we'll share the PDF — free, no enrolment pressure, no email gate.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "jeecup-eligibility-criteria",
    shortTitle: "JEECUP Eligibility 2026",
    title: "JEECUP Eligibility Criteria 2026 · Group-wise + Age Limits | BIPE 4455",
    description: "Complete JEECUP 2026 eligibility — Group-by-Group requirements (Class 10 pass for diploma, Class 12 / ITI for others), age limits, domicile, reserved category. Honest from BIPE.",
    keywords: [
      "JEECUP eligibility",
      "JEECUP eligibility criteria",
      "JEECUP eligibility 2026",
      "JEECUP age limit",
      "JEECUP Group A eligibility",
      "UPJEE Polytechnic eligibility",
      "JEECUP एलिजिबिलिटी",
      "JEECUP कौन apply कर सकता है",
    ],
    eyebrow: "JEECUP 2026 · ELIGIBILITY GUIDE",
    headline: "JEECUP 2026 eligibility —",
    headlineAccent: "kaun apply kar sakta hai.",
    lead: "JEECUP 2026 is open to candidates from any state (not just UP), with different eligibility criteria for each of the 12 groups. This page covers Group A (BIPE's 3-year diploma · Class 10 pass) in full detail plus a quick summary of the other 11 groups, age limits, domicile rules, and reserved-category considerations.",
    quickStats: [
      { label: "Group A eligibility", value: "Class 10 pass", sub: "Maths + Science compulsory" },
      { label: "Minimum marks", value: "35% aggregate", sub: "General · lower for reserved" },
      { label: "Age limit", value: "No upper bound", sub: "Many groups · check per group" },
      { label: "Open to", value: "All states", sub: "UP-domicile + other-state" },
    ],
    steps: [
      {
        n: "01",
        title: "Identify your target Group — BIPE uses Group A",
        body: "Group A (3-year diploma engineering) is BIPE's path. Eligibility: passed Class 10 (or equivalent) with Mathematics and Science. Other groups serve different programmes — Group K (lateral entry to 2nd-year diploma) requires Class 12 / ITI; Group G (PG Diploma) requires Class 12; Group L (D.Pharm) requires Class 12 with Physics + Chemistry. Always confirm which group matches your target programme BEFORE applying.",
      },
      {
        n: "02",
        title: "Verify your Class 10 marksheet meets the minimum threshold",
        body: "General category: minimum 35% aggregate in Class 10 (UP-norm; check current-cycle JEECUP notification for exact figure). Reserved categories (SC / ST / OBC / EWS / PwD): typically 30% or as per the cycle's specific notification. Some boards (UP Board / CBSE / ICSE / state boards) are accepted equivalently — JEECUP doesn't discriminate by board.",
      },
      {
        n: "03",
        title: "Confirm subject requirements — Maths + Science non-negotiable",
        body: "For Group A: you MUST have studied Mathematics AND Science (Physics + Chemistry combined, or General Science) in Class 10. Arts-stream-only Class 10 students aren't eligible. Some state boards bundle Science as a single subject — that's accepted. The marksheet must explicitly list both Maths and Science subjects with passing grades.",
      },
      {
        n: "04",
        title: "Age limit — there isn't one for most groups",
        body: "Group A (and most JEECUP groups): NO upper age limit. You can be 17 or 47 — JEECUP doesn't restrict. Lower bound: you must have completed Class 10 (so typically 14-15 minimum). Exception: a few specific groups (Aviation, Hotel Management) may have age limits — check the cycle's notification for those specifically.",
      },
      {
        n: "05",
        title: "State domicile — UP-quota vs other-state (open)",
        body: "JEECUP separates seats two ways: UP-domicile (priority for UP residents — the large majority of seats and the state's reserved categories) and open / general (candidates from any state). BIPE participates in both. If you're a UP resident with a domicile certificate, you're eligible for the UP-quota reserved seats (larger pool). If you're from Bihar, MP, Delhi, etc., you compete in the open / general category — fewer seats, oriented toward private polytechnics like BIPE, but a real opportunity, and no UP domicile certificate is needed. See /jeecup-from-bihar for Bihar-specific guidance.",
      },
      {
        n: "06",
        title: "Reserved category eligibility (SC/ST/OBC/EWS/PwD)",
        body: "Reserved-category candidates apply with valid certificates issued within 3 years. SC/ST: caste certificate from tehsil. OBC: OBC-NCL (Non-Creamy Layer) certificate. EWS: EWS certificate showing family income < ₹8 lakh/year. PwD: disability certificate. Reservation reduces the minimum-marks threshold AND opens reserved seat pools at counselling. Don't skip certificate gathering even if you 'might not need it' — it costs nothing to have, and saves a year if you do need it.",
      },
    ],
    faqs: [
      {
        q: "I'm in Class 10 right now — can I apply for JEECUP 2026?",
        a: "Yes IF you're appearing for Class 10 board exam in 2026 (results expected May-June 2026). You can apply for JEECUP 2026 (registration Jan-May 2026) with provisional eligibility. Your final eligibility confirms only after you pass Class 10. If you fail Class 10, your JEECUP rank is voided. So make sure your Class 10 prep is solid alongside JEECUP prep.",
      },
      {
        q: "Can I apply for JEECUP from outside Uttar Pradesh?",
        a: "Absolutely. JEECUP is open to candidates from any Indian state. Bihar, Madhya Pradesh, Delhi, Jharkhand, Haryana — all eligible. You're admitted in the open / general category (no UP domicile certificate is needed for a private polytechnic like BIPE). A domicile certificate from your home state isn't required for JEECUP itself (only for reserved-category claims). See /jeecup-from-bihar for Bihar-specific details.",
      },
      {
        q: "What if my Class 10 marksheet hasn't arrived yet?",
        a: "JEECUP allows provisional application with school-issued provisional marksheet or the result-card downloaded from the board's website. The original Marksheet + Passing Certificate must be produced at counselling time (typically July-August). Don't skip applying because you don't have the original — apply provisionally and complete documentation later.",
      },
      {
        q: "Is there a JEECUP age limit I should know about?",
        a: "For Group A (BIPE's path) — no upper age limit. JEECUP is open to candidates who completed Class 10, regardless of age. Working adults, late-starters, gap-year students are all eligible. The 'JEECUP age limit' rumour usually confuses JEECUP with JEE Main (a different exam with age constraints) — they're not the same.",
      },
      {
        q: "Can I apply if I have a backlog / failed subject in Class 10?",
        a: "Class 10 must be PASSED (all subjects). If you have a backlog, you need to clear it first (via supplementary or re-attempt) and then apply for JEECUP. Provisional Class 10 result-card downloads showing 'Passed in all subjects' is acceptable. A pending backlog disqualifies the JEECUP application.",
      },
      {
        q: "What documents do I need to prove eligibility?",
        a: "For Group A: Class 10 marksheet + Passing Certificate (original + 2 copies for counselling). Domicile certificate (UP residents claiming UP quota). Caste / category certificate (reserved categories). Income certificate (EWS / scholarship claimants). PwD certificate (if applicable). See /jeecup-document-verification-checklist for the complete checklist.",
      },
    ],
    ctaTitle: "Unsure if you're eligible for JEECUP?",
    ctaBody: "WhatsApp +91-7310077788 with your Class 10 status (cleared / appearing / pending) and your state of residence — BIPE's admissions team will confirm eligibility within 10 minutes. Free, no enrolment pressure, EN / हिंदी.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "jeecup-exam-pattern-2026",
    shortTitle: "JEECUP Exam Pattern",
    title: "JEECUP Exam Pattern 2026 · CBT Format + Marking Scheme | BIPE 4455",
    description: "JEECUP 2026 exam pattern — Computer-Based Test format, 100 questions in 150 minutes, marking scheme, negative marking, section weighting, navigation interface tips.",
    keywords: [
      "JEECUP exam pattern",
      "JEECUP exam pattern 2026",
      "JEECUP question format",
      "JEECUP marking scheme",
      "JEECUP negative marking",
      "UPJEE Polytechnic exam pattern",
      "JEECUP CBT format",
    ],
    eyebrow: "JEECUP 2026 · EXAM PATTERN",
    headline: "JEECUP 2026 exam pattern —",
    headlineAccent: "format, timing, marking.",
    lead: "JEECUP 2026 is a Computer-Based Test (CBT) — multiple-choice questions across Maths, Physics and Chemistry for Group A. 100 questions, 150 minutes, negative marking. This page covers the exam format, marking scheme, what the CBT interface actually looks like, and tips for navigating it efficiently.",
    quickStats: [
      { label: "Format", value: "Computer-Based Test", sub: "All questions on screen · click-to-answer" },
      { label: "Questions", value: "100", sub: "Multiple-choice · 4 options each" },
      { label: "Duration", value: "150 min", sub: "2.5 hours · no break" },
      { label: "Marking", value: "+1 / -0.25", sub: "Per correct / wrong · varies by cycle" },
    ],
    steps: [
      {
        n: "01",
        title: "Question count + section breakdown (Group A)",
        body: "100 total questions. Mathematics: 50 questions. Physics: 25 questions. Chemistry: 25 questions. Each question = 4 multiple-choice options. You pick ONE correct answer per question. Section weighting matches question count — Maths is the heaviest section by far. Plan your time accordingly.",
      },
      {
        n: "02",
        title: "Marking scheme — positive vs negative",
        body: "Correct answer: +1 mark (some cycles +4 for harder questions — confirm current cycle). Wrong answer: -0.25 mark (negative marking · standard JEECUP rule). Unattempted: 0 marks. Total possible: 100. Total possible loss from negatives: -25 if you got everything wrong (rare). Practical strategy: skip questions you're <50% sure about — negative marking penalises guessing.",
      },
      {
        n: "03",
        title: "Time allocation — 150 minutes for 100 questions",
        body: "Average 1.5 minutes per question. But topic-level strategy: Maths questions take longer (~2 min each for problem solving). Physics + Chemistry questions are often quicker (~1 min each). Realistic split: Maths 90 min · Physics 30 min · Chemistry 30 min. Last 10-15 min reserved for review of marked-for-review questions.",
      },
      {
        n: "04",
        title: "CBT interface — what you'll actually see on screen",
        body: "Top bar: timer (countdown from 2:30:00) and section navigator (jump between Maths / Physics / Chemistry). Middle: current question + 4 options as radio buttons. Bottom right: 'Save and Next', 'Save and Mark for Review', 'Clear Response'. Bottom left: question palette (grid of all 100 questions, colour-coded by status — answered / unanswered / marked-for-review / not-visited). Familiarise yourself with this layout before exam day · practice on mock CBT platforms.",
      },
      {
        n: "05",
        title: "Question palette strategy — use the colour codes",
        body: "Green: answered. Red: unanswered (visited but skipped). Purple: marked-for-review (you answered AND flagged for re-check). Grey: not-visited. Strategy: first pass · answer easy questions only, mark moderately-hard ones for review, skip impossible ones. Second pass · review the marked ones. Third pass · attempt the impossible ones if time permits. The palette is your time-management dashboard.",
      },
      {
        n: "06",
        title: "Submission and result generation",
        body: "Submit happens automatically at 150-minute mark. You can submit early via the 'Final Submit' button (irreversible · only do this if you've thoroughly reviewed). On submission, the system generates a response sheet (downloadable later for review). The official answer key + score are typically released within 2-3 days. Rank card releases ~10 days after the exam window closes.",
      },
    ],
    faqs: [
      {
        q: "Is JEECUP exam in computer-based test (CBT) mode only?",
        a: "Yes. Since 2017, JEECUP has been entirely CBT. No pen-and-paper option exists. If you're not comfortable with computers, practice the CBT format using mock tests on simulators (NTA mocks are free) — by exam day, the interface should feel natural.",
      },
      {
        q: "What is the exact negative marking policy?",
        a: "JEECUP applies -0.25 marks for each wrong answer (this is the standard rule, but always verify with the current-cycle notification). Some questions in harder groups may have different ratios, but Group A consistently follows the -0.25 standard. Unanswered questions are 0 — no negative marking for skipping.",
      },
      {
        q: "Can I use a calculator during the exam?",
        a: "No. Calculators, scientific or otherwise, are NOT permitted in JEECUP. All calculations must be done mentally or on the rough sheet provided. The questions are designed to be solvable without a calculator — they test conceptual understanding, not raw computational speed.",
      },
      {
        q: "What language is the exam available in?",
        a: "Both English and Hindi. You can toggle between languages question-by-question via a button at the top of the screen. The Hindi translation is the official version (not auto-translate). If you're more comfortable in Hindi, use it without hesitation — the language choice doesn't affect your rank.",
      },
      {
        q: "How many sections must I attempt to be 'qualified'?",
        a: "All three sections count toward your total. There's no section-wise minimum cutoff (unlike some other exams). You're qualified based on TOTAL marks, not section-wise. So if you're strong in Maths and weak in Chemistry, score maximum in Maths and don't worry about a low Chemistry section as long as total is competitive.",
      },
      {
        q: "What happens if my computer crashes during the exam?",
        a: "JEECUP centres have backup systems. Inform the invigilator IMMEDIATELY — they'll move you to a working computer and your answers + time are preserved (the system saves answers continuously). You won't lose progress for a tech glitch. Don't panic; the centre staff are trained for this.",
      },
    ],
    ctaTitle: "Want a CBT practice test?",
    ctaBody: "BIPE shares 2 mock JEECUP CBT tests (Group A) free via WhatsApp ahead of every cycle. Simulates the real interface · 100 questions · 150 minutes · answer key included. WhatsApp +91-7310077788 to request — no enrolment pressure.",
  },

  // ─────────────────────────────────────────────────────────────────
  {
    slug: "jeecup-after-results-action-plan",
    shortTitle: "After JEECUP Results · Action Plan",
    title: "After JEECUP Result 2026 · What to Do Next | BIPE 4455",
    description: "Got your JEECUP 2026 result — what now? Step-by-step action plan: interpret rank, prepare documents, draft choice list, time-sensitive next steps. From BIPE.",
    keywords: [
      "JEECUP result kya kare",
      "JEECUP after result action",
      "JEECUP counselling preparation",
      "JEECUP rank kya hai",
      "JEECUP result ke baad",
      "JEECUP रिजल्ट के बाद",
      "JEECUP next steps after result",
    ],
    eyebrow: "JEECUP 2026 · POST-RESULT ACTION PLAN",
    headline: "Result aa gaya —",
    headlineAccent: "ab kya karein?",
    lead: "JEECUP result declares mid-June 2026. Once you have your rank card, the next 4-6 weeks are time-sensitive — choice filling, document gathering, counselling round 1. This page is the action plan: what to do in the next 7 days, the next 30 days, and how to maximise your odds at BIPE Varanasi (code 4455).",
    quickStats: [
      { label: "Window", value: "Mid-June 2026", sub: "Result declared" },
      { label: "Counselling opens", value: "Late June 2026", sub: "Round 1 of 7" },
      { label: "Total rounds", value: "7", sub: "Late June to August" },
      { label: "Critical decision points", value: "3-5", sub: "Choice filling · seat confirm · float vs freeze" },
    ],
    steps: [
      {
        n: "01",
        title: "Day 1-3 · Download rank card + understand your number",
        body: "Visit jeecup.admissions.nic.in within 24 hours of result declaration. Login → download rank card PDF. Print 2 copies. Email to yourself + parent. Now interpret: total marks, percentile, all-India rank, category rank (if applicable). Cross-check against /jeecup-cutoff-2026-bipe-vs-government to understand where your rank sits: top-tier government, Eastern UP government, BIPE band, or below-cutoff (re-attempt next cycle).",
      },
      {
        n: "02",
        title: "Day 4-7 · Talk to BIPE admissions for honest rank interpretation",
        body: "WhatsApp +91-7310077788 with your rank, branch preferences, and home district. Our admissions counsellors give an honest 10-minute reality check — whether your rank realistically gets you BIPE 4455 in your preferred branch, or whether you should consider government polytechnic options first. We don't oversell — we tell you what's most likely.",
      },
      {
        n: "03",
        title: "Week 2 · Gather all counselling documents",
        body: "Even before counselling opens, gather every document on the /jeecup-document-verification-checklist page: Class 10 marksheet + certificate (originals + 2 copies each), Aadhaar, JEECUP rank card, domicile (UP residents), caste certificate (if applicable), income certificate (EWS / scholarship), passport-size photos (8-10 copies), character + transfer certificate from school. Getting these BEFORE the counselling window opens is critical — late paperwork = missed allotment.",
      },
      {
        n: "04",
        title: "Week 2-3 · Draft your choice list (15-25 entries, ranked)",
        body: "JEECUP counselling Round 1 opens late June. You'll fill a ranked choice list — institute + branch pairs in priority order. Draft your list NOW, before the window opens. Top of list: your dream combinations. Middle: realistic for your rank. Bottom: safety options. BIPE 4455 should appear at the realistic-for-your-rank position with your top-3 preferred branches as separate choices. Talk to your family before locking the list.",
      },
      {
        n: "05",
        title: "Week 3-4 · Counselling Round 1 · choice-filling window opens",
        body: "JEECUP opens the choice-filling form for ~5-7 days. Log in, paste your pre-drafted ranked list, review carefully (an error here is hard to undo), submit. The system runs allotment based on rank + your choice order. Allotment result publishes ~5-7 days after choice filling closes. If you got allotted: pay seat-acceptance fee within 3-5 days and decide freeze / float / withdraw.",
      },
      {
        n: "06",
        title: "Week 4 onwards · Allotment decision + report to BIPE",
        body: "If allotted BIPE 4455: confirm by paying seat-acceptance fee → visit BIPE Phoolpur within JEECUP's reporting window (typically 7-10 days from allotment). Bring all documents + photocopies. BIPE academic office verifies, signs you in. Done — you're a BIPE student. If allotted somewhere else and you prefer BIPE: float into Round 2 (keeps current seat as floor, tries for upgrade in next round). If un-allotted: continue choice-filling in Round 2.",
      },
    ],
    faqs: [
      {
        q: "My JEECUP rank is higher than I expected — what should I aim for?",
        a: "If your rank is below 5,000: top-tier government polytechnics are open. 5,000-20,000: Eastern UP government polytechnics + BIPE for popular branches. 20,000-50,000: BIPE comfortably for most branches. 50,000+: BIPE for rarer branches (Dairy, sometimes Civil); consider direct admission alongside JEECUP. WhatsApp +91-7310077788 for branch-by-branch honest interpretation.",
      },
      {
        q: "My JEECUP rank is lower than I hoped — what are my options?",
        a: "Three paths. (1) Direct admission to BIPE: we accept direct applications for vacant seats after Round 6 of JEECUP counselling. WhatsApp us about current vacancy. (2) Re-attempt JEECUP 2027: 1-year gap, focused prep. (3) Alternate diploma routes: B.Voc, ITI, polytechnic from other states' entrance exams (Bihar BCECE, MP DET, etc.). Don't make a decision under panic — talk to advisors first.",
      },
      {
        q: "How quickly do I need to decide after allotment?",
        a: "JEECUP allotment-acceptance window is typically 3-5 days from allotment notification. Document reporting at BIPE is 7-10 days from allotment confirmation. Total: ~10-15 days from allotment to enrolled BIPE student. Plan accordingly — if you're travelling from outside Varanasi, book transport AHEAD of the JEECUP cycle so the reporting deadline isn't a logistics scramble.",
      },
      {
        q: "What if I miss the seat-acceptance deadline?",
        a: "Allotment lapses. The seat goes back to the JEECUP pool for Round 2. You can apply again in Round 2 with the same rank card, but you might get a worse allotment (or none). Treat the seat-acceptance window as non-negotiable — set 2 phone alarms and a parent-reminder.",
      },
      {
        q: "Can I attend BIPE without going through JEECUP counselling?",
        a: "Yes, via direct admission for vacant seats. BIPE accepts direct applications after JEECUP Round 6 concludes (typically August). Available seats vary by branch + year. WhatsApp +91-7310077788 in August 2026 to check current-cycle vacancy. Direct admission isn't rank-restricted but is seat-limited.",
      },
      {
        q: "Will my parents need to come to BIPE during reporting?",
        a: "Strongly recommended but not strictly required. BIPE's verification process is straightforward — you can do it solo if needed. But for first-time students, parent presence helps with: campus orientation, hostel walk-through (if applicable), face-to-face Q&A with academic + placement office. Most BIPE first-years come with at least one parent.",
      },
    ],
    ctaTitle: "Just got your JEECUP result?",
    ctaBody: "WhatsApp +91-7310077788 with your rank, branch preferences, and home district within 48 hours. BIPE's admissions counsellor gives a free 10-minute honest interpretation — whether BIPE 4455 fits your rank, and how to optimise your counselling choice list to maximise the right outcome.",
  },
];

export function jeecupResourceBySlug(slug: string): JeecupResource | undefined {
  return JEECUP_RESOURCES.find((r) => r.slug === slug);
}

export function otherJeecupResources(currentSlug: string): JeecupResource[] {
  return JEECUP_RESOURCES.filter((r) => r.slug !== currentSlug);
}
