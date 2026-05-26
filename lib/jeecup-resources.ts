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
  /** 3-4 stat cards under hero */
  quickStats: ResourceQuickStat[];
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
        body: "JEECUP lets you pick 3 exam-centre preferences. Pick centres realistic for your travel logistics — preferably your home district or a major adjacent district. Eastern UP centres include Varanasi, Jaunpur, Mau, Ghazipur, Azamgarh, Mirzapur, Sonbhadra. Bihar applicants choose Patna, Gaya, Bhagalpur, Muzaffarpur via the all-India category.",
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
        a: "No. JEECUP 2026 registration closed on 20 May after an extension from the original 30 April deadline. The next opportunity is JEECUP 2027 (typically opens January 2027). In the meantime, BIPE accepts direct applications outside JEECUP for vacant seats — apply via /apply or call +91-9198646464 to discuss your options.",
      },
      {
        q: "I made an error in my form. Can I correct it?",
        a: "JEECUP usually opens a correction window for limited fields (name spelling, photograph, signature) approximately 1 week after registration closes. Major fields like date of birth, category, and exam group are typically NOT correctable. Watch the jeecup.admissions.nic.in homepage for the correction-window dates.",
      },
      {
        q: "Can I apply for BIPE without sitting JEECUP?",
        a: "Yes, but with caveats. JEECUP-route admission is the standard path and gets you a guaranteed allotment through the counselling rounds. BIPE also accepts direct applications for vacant seats after the JEECUP counselling concludes (typically late July / August). Direct admission is rank-independent but seat-limited. WhatsApp +91-9198646464 to ask about current vacancy.",
      },
      {
        q: "What is the JEECUP application fee?",
        a: "₹300 for General / OBC / Minority candidates and ₹200 for SC / ST / Physically Handicapped candidates. Payable online via UPI, debit / credit card, or net banking. The portal accepts payment in INR only.",
      },
      {
        q: "I'm a Bihar resident — can I apply via JEECUP for BIPE?",
        a: "Yes. JEECUP is open to candidates from any state. Bihar residents fall under the all-India category for JEECUP-allotted seats. BIPE participates fully in this category — see our /jeecup-from-bihar and /admission-from-bihar pages for the Bihar-specific transit + documents context.",
      },
      {
        q: "Does BIPE help with the JEECUP form?",
        a: "Yes. WhatsApp +91-9198646464 with your specific question — common ones include exam-centre choice, group selection, category certificate format, and fee payment troubleshooting. We don't charge for application counselling; the conversation is free and we'll answer in English or Hindi.",
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
        a: "BIPE doesn't have admin access to the JEECUP portal — only JEECUP's helpline can resolve portal-side issues. But our admissions counsellors can walk you through the download steps and help you escalate to the JEECUP helpline if needed. WhatsApp +91-9198646464.",
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
    description: "Check JEECUP 2026 result at jeecup.admissions.nic.in — login, download rank card, understand category rank, plan counselling. Results expected mid-June 2026 (within ~10 days of the 9 June exam).",
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
    eyebrow: "JEECUP 2026 · RESULT + RANK CARD",
    headline: "JEECUP 2026 result —",
    headlineAccent: "from result page to rank card.",
    lead: "JEECUP 2026 results are expected mid-June 2026 — within roughly 10 days of the final exam shift on 9 June. The result includes your raw marks, percentile, all-India rank, category rank (if applicable), and a downloadable rank card. This page walks through the check process and explains what each number means for counselling.",
    quickStats: [
      { label: "Expected", value: "Mid-June 2026", sub: "~10 days post-exam" },
      { label: "Where", value: "jeecup.admissions.nic.in", sub: "Result tab" },
      { label: "What you get", value: "Marks · Rank · Card", sub: "Downloadable PDF" },
      { label: "Counselling opens", value: "Late June 2026", sub: "7 rounds through August" },
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
        body: "Counselling Round 1 opens late June. Don't wait until the choice-filling window starts to think about which branches at which institutes you want. Make a ranked list NOW — talk to family, talk to BIPE counsellors (free, +91-9198646464), and have your 10-20 choice combinations ready when the form opens.",
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
        a: "WhatsApp +91-9198646464 with your rank and preferred branch — our counsellors will walk you through the choice-filling order that maximises your odds at BIPE. The conversation is free and we'll answer in English or Hindi. We don't charge for guidance.",
      },
    ],
    ctaTitle: "Got your JEECUP rank?",
    ctaBody: "Talk to BIPE before you fill choices. We'll review your rank, your preferred branch, your home district and give you an honest read on whether government or BIPE fits best — and how to order your choices to maximise the right outcome.",
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
        a: "BIPE's spot round opens after Round 6 closes — typically late July / early August 2026. You visit BIPE Phoolpur in person with your JEECUP rank card and documents. The placement-cell desk reviews your rank against current vacancies and offers a seat if you qualify. Spot-round students join the same orientation as Round-1-6 students. WhatsApp +91-9198646464 to confirm spot-round dates before travelling.",
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
        body: "If you're claiming UP state quota (most BIPE allottees), bring your UP-issued domicile or residence certificate. Bihar / other-state candidates applying under the all-India quota don't need this. Issued by your tehsil office — start the application 2-3 weeks before reporting.",
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
        a: "Inform BIPE's admissions office immediately — WhatsApp +91-9198646464. We can often hold a provisional admission for 7-14 days while you complete the certificate at the tehsil. But you MUST flag this proactively; we can't help if you arrive on reporting day with no certificate and no notice.",
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
      { label: "BIPE counsellor", value: "+91-9198646464", sub: "EN / हिंदी · WhatsApp" },
    ],
    contacts: {
      eyebrow: "Official JEECUP helpline channels",
      heading: "Direct contacts (verified)",
      items: [
        { label: "Official portal banner", value: "jeecup.admissions.nic.in (helpline number changes annually — always verify on the homepage banner at result time)", href: "https://jeecup.admissions.nic.in" },
        { label: "Official email (general)", value: "Contact via the 'Help / Contact' form on the JEECUP portal — direct email IDs are published per cycle" },
        { label: "Office address", value: "Joint Entrance Examination Council (UP), Director's Office at the Board of Technical Education building, Lucknow" },
        { label: "BIPE counsellor (institute-side issues)", value: "+91-9198646464 · WhatsApp / call · EN / हिंदी", href: "https://wa.me/919198646464" },
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
        body: "If your issue is about BIPE specifically (where to fit in your choice list, when to report, what documents BIPE needs, whether to wait for an upgrade), call our admissions counsellor at +91-9198646464. We don't have access to your JEECUP portal but we can advise on the BIPE-side decisions.",
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
    ctaBody: "For BIPE-specific questions — choice-filling strategy, document checklists, branch-by-branch fit, when to visit — WhatsApp +91-9198646464. Free, no enrolment pressure, EN / हिंदी.",
  },
];

export function jeecupResourceBySlug(slug: string): JeecupResource | undefined {
  return JEECUP_RESOURCES.find((r) => r.slug === slug);
}

export function otherJeecupResources(currentSlug: string): JeecupResource[] {
  return JEECUP_RESOURCES.filter((r) => r.slug !== currentSlug);
}
