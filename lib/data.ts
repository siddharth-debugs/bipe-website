import { PLACEMENT_STATS, formatPlacements } from "@/lib/placement-stats";

// 29 May 2026 — placement-count and recruiter literals scattered
// across this module are interpolated from PLACEMENT_STATS so a TPO
// XLSX refresh updates DATA.stats, DATA.whyBipe, DATA.faq etc.
// automatically.
const _placed = formatPlacements(PLACEMENT_STATS.totalPlacements);
const _endYear = PLACEMENT_STATS.endYear;

export type BranchImage = { src: string; alt: string };

export type Branch = {
  code: string;
  slug: string;
  name: string;
  hi: string;
  seats: number;
  fee: string;
  desc: string;
  tag: string | null;
  color: number;
  // Card / list thumbnail — single landscape (16:9) image.
  thumbnail: BranchImage;
  // Slider images shown on the branch detail card. Ordered
  // "establishing → people → detail" so the cycle feels intentional.
  // All entries MUST be landscape (ratio ≥ 1.3); the crossfade slider
  // crops to 16:9 and portrait shots show an awful centre-strip.
  slides: BranchImage[];
};

export type Stat = { num: string; label: string; sub: string };
export type WhyItem = {
  num: string;
  metric: string;
  metricLabel: string;
  title: string;
  body: string;
  icon: string;
};
export type Testimonial = { name: string; role: string; quote: string };
export type FAQItem = { cat: string; q: string; a: string };
export type EventItem = { date: string; tag: string; title: string; body: string };
export type JeecupStep = { step: string; title: string; body: string };
export type Facility = { name: string; count: string; body: string };

export type ContactInfo = {
  phone: string;
  email: string;
  emailPlacement: string;
  phonePlacement: string;
  emailGrievance: string;
  emailPrincipal: string;
  emailAntiRagging: string;
  emailIC: string;
  emailScSt: string;
  emailPwd: string;
  whatsapp: string;
  /** Display string for the WhatsApp Business number (the line that
   *  RECEIVES messages and FROM-sends DT confirmations). Distinct from
   *  `phone` since 29 May 2026's split-routing — `phone` is the call
   *  line, `whatsappPhone` is the WhatsApp line. The two are different
   *  per BIPE's operator setup. */
  whatsappPhone: string;
  address: string;
  jeecup: string;
  aicte: string;
  aicteEoaRef: string;
  aicteEoaDate: string;
  bteup: string;
  aishe: string;
};

export type SocialLink = {
  name: string;
  handle: string;
  url: string;
};

export type Regulator = {
  name: string;
  full: string;
  url: string;
};

export type DataShape = {
  contact: ContactInfo;
  social: SocialLink[];
  regulators: Regulator[];
  stats: Stat[];
  branches: Branch[];
  recruiters: string[];
  whyBipe: WhyItem[];
  testimonials: Testimonial[];
  faq: FAQItem[];
  events: EventItem[];
  jeecupSteps: JeecupStep[];
  facilities: Facility[];
};

export const DATA: DataShape = {
  contact: {
    // 28 May 2026 — consolidated to a single admissions handset per
    // user direction "Use only one number for call 9415202879, remove
    // 9198646464 and 9198767676". The previous voice/WhatsApp split
    // (9198646464 voice + 9198767676 WhatsApp) is retired. 9415202879
    // is now both the call number AND the WhatsApp handoff target —
    // the BIPE_ADMISSIONS_WA_PHONE constant in lib/whatsappHandoff.ts
    // already used 9415202879 for the wa.me handoffs from
    // InquiryModal + WhatsAppFAB, so that side of the world was
    // already converged.
    phone: "+91-9415202879",
    // PRIMARY OFFICIAL EMAIL — migrated 25 May 2026 from
    // info@bipe.ac.in → info@bipe.ac.in. The .ac.in TLD is
    // restricted to recognised Indian educational institutions; using
    // info@bipe.ac.in as the front-door contact reinforces the
    // institutional credibility on every page that surfaces a mailto.
    //
    // DATA.contact.email cascades to: /contact, /placements (3x),
    // /hostel, /mandatory-disclosure, /courses, /alumni, footer, and
    // the Schema.org Organization contactPoint. Single source of truth.
    //
    // FUNCTIONAL ALIASES below remain on @bipevns.org for now — those
    // are statutory committee / role-specific mailboxes (grievance,
    // POSH IC, anti-ragging, SC/ST, PWD, principal, accounts) that
    // operationally route to specific staff. Migrate per-committee
    // when the corresponding mailbox is set up on the new domain.
    email: "info@bipe.ac.in",
    // 28 May 2026 — email consolidation per user direction "use only
    // info@bipe.ac.in for mail". All non-statutory mailboxes (TPO /
    // bipetpo@gmail.com, principal@bipe.ac.in / principal@bipevns.org,
    // chairman@, accounts@, admissions@, admissions2026@gmail.com,
    // bipeinstitute@gmail.com, jeecuphelp@gmail.com) collapse to
    // info@bipe.ac.in. The emailPlacement / emailPrincipal field NAMES
    // are kept so consumers don't break — both currently alias to the
    // same address. If/when BIPE adds a real placement@bipe.ac.in or
    // principal@bipe.ac.in mailbox, update the constant here.
    //
    // The 5 statutory committee mailboxes BELOW (grievance, anti-
    // ragging, IC POSH, SC/ST cell, PWD cell) STAY on @bipevns.org per
    // UGC Anti-Ragging Regs 2009 + AICTE PG10 disclosure: those
    // committees must be reachable at named, distinct addresses for
    // compliance. The phonePlacement field (TPO line, currently
    // Amit Kumar's handset on 9415202879) is the SAME number as the
    // primary admissions phone after the phone consolidation, but
    // kept for the semantic clarity that "this is the placement cell
    // line" on the /placements CTA blocks.
    emailPlacement: "info@bipe.ac.in",
    phonePlacement: "+91-9415202879",
    emailGrievance: "grievance@bipevns.org",
    emailPrincipal: "info@bipe.ac.in",
    emailAntiRagging: "antiragging@bipevns.org",
    emailIC: "ic@bipevns.org",
    emailScSt: "scst@bipevns.org",
    emailPwd: "pwd@bipevns.org",
    // WhatsApp pre-populated message — switched to Hindi (May 2026).
    // BIPE's primary audience is Hindi-medium families from Eastern UP
    // and Bihar; opening WhatsApp in English implicitly told them this
    // wasn't a site for them. encodeURIComponent() handles the
    // Devanagari + em-dash + ASCII mix without hand-encoded escapes —
    // produces an identical URL string to the previous hand-encoded
    // English version at module-load time.
    //
    // WhatsApp UPDATE 28 May 2026 (later in the day): the prior
    // direction routed WhatsApp to the alt handset (+91-9198767676)
    // and call to the primary (+91-9198646464). Both have now been
    // retired in favour of a single admissions handset
    // (+91-9415202879) per "Use only one number for call 9415202879,
    // remove 9198646464 and 9198767676". The wa.me URL now hits
    // 919415202879 — same destination the InquiryModal + WhatsAppFAB
    // surfaces have always used for their handoffs.
    whatsapp: `https://wa.me/917310077788?text=${encodeURIComponent(
      "नमस्ते BIPE — 2026-27 admission की जानकारी चाहिए",
    )}`,
    // Display string for the WhatsApp Business number — used by the
    // /contact channel cards, the Double Tick template body, etc.
    // Distinct from `phone` since the 29 May 2026 split-routing
    // commit: phone (+91-9415202879) is the long-established call
    // line families have saved; whatsappPhone (+91-7310077788) is
    // the WABA-approved sender that handles all WhatsApp messaging.
    whatsappPhone: "+91-7310077788",
    address:
      "Gajokhar, Phoolpur, Varanasi 221206, UP",
    jeecup: "4455",
    aicte: "1-488233171",
    aicteEoaRef: "Northern/1-46216893240/2026/EOA",
    aicteEoaDate: "16 March 2026",
    bteup: "Affiliated · College Code 4455",
    // ISO 9001:2015 cert expired — removed from public-facing surfaces.
    // Re-add via the SEO admin singleton if the certification is renewed.
    aishe: "Registered · Dept. of Higher Education, MoE",
  },
  social: [
    // Canonical public handles for the institute. This array is the
    // single source of truth: app/layout.tsx emits it as schema.org
    // `sameAs`, components/shell/Footer.tsx renders the "Follow BIPE"
    // strip from it, and app/contact/page.tsx (as of May 2026) reads
    // from it too. Don't fork — add new platforms here, not in
    // consumers.
    //
    // Handles confirmed by Praveen 28 May 2026:
    //   X        → x.com/bipeinstitute (was bipevns; corrected)
    //   Insta    → instagram.com/bipevns (unchanged; the igsh=… form
    //              the user shared is just a share-tracking suffix,
    //              the canonical handle is bipevns)
    //   YouTube  → youtube.com/channel/UCrMRSVL5ugbXLPXVcqLI4Og
    //              (the earlier @bipevns / @bipevaranasi probes both
    //              404'd; this is the actual channel ID. Channel-ID
    //              URLs are stable even if the custom @handle changes
    //              later, so prefer this form.)
    { name: "Facebook",  handle: "bipevns",          url: "https://www.facebook.com/bipevns/" },
    { name: "Instagram", handle: "bipevns",          url: "https://www.instagram.com/bipevns/" },
    { name: "X",         handle: "bipeinstitute",    url: "https://x.com/bipeinstitute" },
    { name: "YouTube",   handle: "BIPE Varanasi",    url: "https://www.youtube.com/channel/UCrMRSVL5ugbXLPXVcqLI4Og" },
    { name: "LinkedIn",  handle: "bipe-varanasi",    url: "https://www.linkedin.com/school/bipe-varanasi/" },
    // Wikidata entity (created May 2026 — Q139892164). Listing the
    // canonical Wikidata URL in schema.org `sameAs` is THE explicit
    // signal to Google/Bing/AI assistants that "this domain IS the
    // entity at this Q-number." Knowledge Panels, AI Overviews,
    // ChatGPT/Perplexity entity binding all hinge on this connection.
    // The Footer's "Follow BIPE" strip filters out non-social URLs
    // (see components/shell/Footer.tsx) so this entry feeds schema
    // without cluttering the UI.
    { name: "Wikidata",  handle: "Q139892164", url: "https://www.wikidata.org/wiki/Q139892164" },
    // Google Business Profile (verified + owned in BGI - Colleges
    // group, screenshot shared 29 May 2026). Listing the GBP short
    // URL in schema.org `sameAs` is the strongest possible identity-
    // binding signal — Google can match its own GBP record back to
    // the website, which is what unlocks the right-side Knowledge
    // Panel + map-pack entry on brand SERPs. See BIPE_GBP_SETUP.md
    // for the full Knowledge Panel playbook. Filtered out of the
    // Footer's "Follow BIPE" strip via the same domain-check pattern
    // as Wikidata above.
    { name: "Google Business Profile", handle: "Banaras Institute of Polytechnic & Engineering", url: "https://maps.app.goo.gl/fa1zNXmZuRg7Si139" },
  ],
  regulators: [
    { name: "AICTE", full: "All India Council for Technical Education", url: "https://www.aicte-india.org/" },
    { name: "AICTE Dashboard", full: "AICTE Approval Dashboard (Public)", url: "https://facilities.aicte-india.org/dashboard/pages/dashboardaa.php" },
    { name: "BTEUP", full: "Board of Technical Education, Uttar Pradesh", url: "https://bteup.ac.in/" },
    { name: "JEECUP", full: "Joint Entrance Examination Council, UP — Polytechnic", url: "https://jeecup.admissions.nic.in/" },
    { name: "AFRC UP", full: "Admission & Fee Regulatory Committee, UP", url: "http://afrcup2018.in/" },
    { name: "IRDT UP", full: "Institute of Research, Development & Training, UP", url: "https://irdtup.in/" },
    { name: "UPTED", full: "UP Department of Technical Education", url: "http://upted.gov.in/" },
    { name: "URISE", full: "URISE — UP Govt. portal · BIPE 4455", url: "https://urise.up.gov.in/poly/4455" },
    { name: "AISHE", full: "All India Survey on Higher Education (MoE)", url: "https://aishe.gov.in/" },
    { name: "UGC Anti-Ragging", full: "UGC Anti-Ragging Portal", url: "https://www.antiragging.in/" },
  ],
  stats: [
    { num: "16", label: "Years on record", sub: "since 2010" },
    // 29 May 2026 — stat priority flipped per user direction:
    // 1,331 placements is the auditable joining-letter-verified
    // trust signal (concrete, TPO-confirmed) and now leads. The
    // 2,200+ alumni-network figure is a softer total-headcount
    // claim that demotes to the sub-line. The 1,331 number reads
    // from lib/placement-stats.ts so a TPO XLSX refresh ripples
    // through automatically.
    { num: _placed, label: "Placements · TPO-verified", sub: "Across the 2,200+ alumni network since 2010" },
    { num: "5", label: "BTEUP-affiliated branches", sub: "incl. rare Dairy" },
    { num: "1:20", label: "Mentor : student ratio", sub: "with home visits" },
    { num: "6", label: "Acre Phoolpur campus", sub: "hostel & labs" },
  ],
  branches: [
    {
      code: "355", slug: "computer-science-engineering",
      name: "Computer Science & Engineering", hi: "कंप्यूटर साइंस एंड इंजीनियरिंग",
      seats: 60, fee: "30,150",
      desc: "Programming, data structures, networks, AI/ML — taught with our 120-computer lab. Strong B.Tech CSE pathway.",
      tag: "Popular", color: 1,
      thumbnail: {
        src: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778150980/bipe/labs/cse/programming-lab-4",
        alt: "BIPE programming lab — rows of computer-science workstations",
      },
      slides: [
        { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778150980/bipe/labs/cse/programming-lab-4", alt: "BIPE programming lab — rows of computer-science workstations" },
        { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778150939/bipe/labs/cse/networking-iot-lab2", alt: "BIPE networking & IoT lab — switches, routers and rack equipment" },
        { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778150999/bipe/labs/cse/project-expo-3rd-year", alt: "Third-year project expo — student-built CSE projects on display" },
      ],
    },
    {
      code: "327", slug: "dairy-engineering",
      name: "Dairy Engineering", hi: "डेयरी इंजीनियरिंग",
      seats: 60, fee: "30,150",
      desc: "Rare diploma — offered by only 4 institutes including BIPE across all UP polytechnics. Careers at Amul, Mother Dairy, Parag, Nestlé, NDDB.",
      tag: "Rare", color: 2,
      // Dairy photography update 2026-05-28: replaced the Drive-synced
      // Cloudinary placeholder + two SVG illustration fallbacks with
      // real BIPE lab photos (hydraulics, chemistry — both used by
      // Dairy Engineering students for process fluid mechanics and
      // milk-quality testing) and three industrial-visit frames from
      // a BIPE student visit to Banas Dairy Plant Varanasi.
      //
      // Important: BIPE does NOT operate its own pilot dairy plant.
      // The earlier "pilot plant equipment" alt text was misleading
      // and has been removed. Industrial-visit photos are honestly
      // labelled as such — the convention matches the Electrical
      // branch (industrial-visit-220-kb-substation).
      thumbnail: {
        src: "/labs/dairy/hydraulics-lab.jpg",
        alt: "BIPE hydraulics lab — pumps and flow rigs (BIPEHYD/201 asset tags visible) used by Dairy students for process fluid mechanics",
      },
      slides: [
        { src: "/labs/dairy/hydraulics-lab.jpg", alt: "BIPE hydraulics lab — pumps and flow rigs (BIPEHYD/201 asset tags visible) used by Dairy students for process fluid mechanics" },
        { src: "/labs/dairy/chemistry-lab.jpg", alt: "BIPE chemistry lab — used by Dairy students for milk-quality and biochemistry testing" },
        { src: "/labs/dairy/industrial-visit-banas-dairy-processing-floor.jpg", alt: "BIPE Dairy students at Banas Dairy Plant Varanasi — automated FILLPACK processing floor" },
        { src: "/labs/dairy/industrial-visit-banas-dairy-storage-tanks.jpg", alt: "BIPE Dairy students at Banas Dairy Plant Varanasi — bulk milk storage silos" },
        { src: "/labs/dairy/industrial-visit-banas-dairy-capping-line.jpg", alt: "BIPE Dairy students at Banas Dairy Plant Varanasi — automated capping and conveyor line" },
        { src: "/labs/dairy/mechanics-of-solids-lab.jpg", alt: "BIPE Mechanics of Solids lab — UTM and materials testing used by Dairy students for processing-equipment fundamentals" },
      ],
    },
    {
      code: "322", slug: "civil-engineering",
      name: "Civil Engineering", hi: "सिविल इंजीनियरिंग",
      seats: 120, fee: "30,150",
      desc: "Smart Cities, Bharatmala, Kashi Vishwanath corridor — India's infra boom needs civil diploma holders. SSC JE / RRB JE eligible.",
      tag: null, color: 3,
      thumbnail: {
        src: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778151196/bipe/labs/civil/survey-camp",
        alt: "BIPE survey camp — students with field theodolites",
      },
      slides: [
        { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778151196/bipe/labs/civil/survey-camp", alt: "BIPE survey camp — students with field theodolites" },
        { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778151174/bipe/labs/civil/construction-site-visit", alt: "BIPE civil students on a construction site visit" },
        { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778151184/bipe/labs/civil/r-c-c-drawing", alt: "Hand-drafted R.C.C. drawings on the civil drawing board" },
      ],
    },
    {
      code: "328", slug: "electrical-engineering",
      name: "Electrical Engineering", hi: "इलेक्ट्रिकल इंजीनियरिंग",
      seats: 120, fee: "30,150",
      desc: "Power, distribution, renewables, EV. Strong RRB JE / SSC JE pathway. UPPCL, Tata Power, Adani Solar recruit our graduates.",
      tag: null, color: 4,
      thumbnail: {
        src: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778151049/bipe/labs/ee/ee-machin",
        alt: "BIPE EE machine bay — rotating-machine and motor test setups",
      },
      slides: [
        { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778151049/bipe/labs/ee/ee-machin", alt: "BIPE EE machine bay — rotating-machine and motor test setups" },
        { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778151083/bipe/labs/ee/industrial-visit-220-kb", alt: "Industrial visit to a 220 kV substation — power-systems site exposure" },
        { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778151075/bipe/labs/ee/industrial-visit-220-kb-1", alt: "Industrial visit (220 kV substation) — students at the switchyard" },
      ],
    },
    {
      code: "343", slug: "mechanical-engineering-production",
      name: "Mechanical Engineering (Production)", hi: "मैकेनिकल इंजीनियरिंग (प्रोडक्शन)",
      seats: 120, fee: "30,150",
      desc: "Hands-on workshop — welding, fitting, foundry, machining, CNC. Mahindra, JCB, BHEL apprentice pathways.",
      tag: null, color: 5,
      thumbnail: {
        src: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778151561/bipe/labs/mechanical/machin-shop-3",
        alt: "BIPE machine shop — full production floor view",
      },
      slides: [
        { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778151561/bipe/labs/mechanical/machin-shop-3", alt: "BIPE machine shop — full production floor view" },
        { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778151121/bipe/labs/mechanical/auto-mobile", alt: "Automobile lab on the mech production floor — engine teardown station" },
        { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778151143/bipe/labs/mechanical/pt-shop-1", alt: "Production-technology (PT) shop — fitting and assembly bays" },
      ],
    },
  ],
  // Recruiter marquee — curated May 2026 per the Overall.docx review.
  // Names that don't have a current/recent hiring relationship were
  // removed (Tata Steel, BEL, Indian Railways, Tata Motors, BHEL,
  // UPPCL, Tata Power, Amul, Mother Dairy, Parag, Nestlé, NDDB, Bajaj,
  // Ather, Hero MotoCorp). Four new recruiters added: RR Parkon,
  // Knorr Bremse, BD Group Campa, Amber.
  recruiters: [
    // 29 May 2026 — "Hollister" added per user direction. The
    // surgical-and-medical-device manufacturer (Stuart, FL · Indian
    // ops in Pune) has been recruiting BIPE diploma graduates; the
    // earlier curated list missed it.
    "Mahindra", "Krishna Maruti", "JCB", "Asian Paints", "Adani Solar",
    "Ola Electric", "RR Parkon", "Knorr Bremse", "BD Group Campa", "Amber",
    "Hollister",
  ],
  whyBipe: [
    { num: "01", metric: "1:20", metricLabel: "mentor ratio", title: "One mentor. Twenty students. Home visits.", body: "Every BIPE faculty member personally mentors 20 students, with periodic home visits to parents. Institution, parent, and student — bonded as a family.", icon: "M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0" },
    { num: "02", metric: "3-layer", metricLabel: "assessment", title: "Outcome-based pedagogy.", body: "Semester exam + continuous assessment + project work, calibrated against published Program Outcomes. We measure progress, not attendance.", icon: "M3 17l6-6 4 4 8-8" },
    { num: "03", metric: "4 only", metricLabel: "institutes in UP offer this", title: "Rare Dairy Engineering diploma.", body: "BTEUP-affiliated Dairy Engineering (Code 327) — offered by only four institutes including BIPE across all UP polytechnics. Careers at Amul, Mother Dairy, Parag, Nestlé and NDDB.", icon: "M9 3h6l1 4-1 14H9L8 7l1-4z" },
    { num: "04", metric: _placed, metricLabel: "TPO-verified placements", title: "Sixteen years on record.", body: `${_placed} TPO-verified placements (${PLACEMENT_STATS.startYear}-${_endYear}) at Mahindra, Tata Steel, Krishna Maruti, JCB, Asian Paints — incl. government posts (Indian Railways ALP, UPPCL, SSC JE, UP Police). AFRC-approved fees, no hidden charges.`, icon: "M3 21V10l9-6 9 6v11M9 21V12h6v9" },
  ],
  testimonials: [
    // Drawn from genuine BIPE Facebook feedback (2017–2025) — translated /
    // tightened for the website but kept close to the original voice.
    { name: "Aman Pratap", role: "Mech (2020) → RR · campus hire", quote: "I was the first boy from my college to get picked up by RR. The company has been coming back every year since for campus selection. To every junior selected this year — you're going to do well. It's a great company." },
    { name: "Ravi Kumar", role: "Civil (2020) → Indian Railways, Group C", quote: "BIPE batch 2017–2020. Joined Indian Railways in the Operating Department. Forever grateful to this college — the placement cell got me here." },
    { name: "Faisal Ahmad", role: "Mech Prod (2018) → placed via campus drive", quote: "BIPE is the best institute for engineering. Companies come here for placement drives — packages start above ₹2 lakhs with TA, DA and PF. Anyone who joins, builds a real career." },
    { name: "Mr. Mishra", role: "Parent · Dairy '20 batch", quote: "ऐसा प्लेसमेंट मैंने देखा ही नहीं था — सोचा भी नहीं था। बच्चों और मार्गदर्शकों ने एक साथ अथक परिश्रम किया है। एक्स्ट्राऑर्डिनरी।" },
    { name: "Shivam Solanki", role: "Alumnus · Jafrabad, Jaunpur", quote: "Sir के आने के बाद BIPE एक नया BIPE बन गया। Thank God. मेरा कॉलेज और आगे जाए — यही दुआ है।" },
    { name: "Anand Bandhu", role: "Alumnus → working engineer", quote: "Thanks to the entire BIPE team — and to our mentor Dilshad Shah Sir especially. He keeps pushing us to do something big with our lives, to make our parents and teachers proud. That's why this place is different." },
    { name: "Sunita Devi", role: "Parent of Electrical '24 batch", quote: "Fees पूरी तरह transparent — हर rupee का receipt मिला। Hostel secure है, mess अच्छी है। बेटी के भाई के लिए यही सही choice थी।" },
    { name: "Indresh Yadav", role: "CSE (2022) — placed first attempt", quote: "This is the best college in UP for both education and placement. Career banana ho to Banaras Institute of Polytechnic & Engineering — best option hai." },
    { name: "Manager's note", role: "Posted on placement day · 2019", quote: "हमारे campus placement में चयनित सभी छात्रों को बहुत-बहुत शुभकामना। और जिनका इस बार नहीं हुआ — निराश मत होना। मैं आपको और भी बड़ा सफल होते देखना चाहता हूँ। बधाई और आशीर्वाद।" },
    { name: "Chandraprakash student", role: "Alumnus", quote: "Chandraprakash Mishra Sir is the best teacher I've ever had. कॉलेज में मेरा कोई भी काम कभी नहीं रुका — क्योंकि उन्होंने हमेशा मेरा साथ दिया। मैं अपने महान गुरु को नमन करता हूँ।" },
    { name: "Visiting parent", role: "Open-house feedback · 2018", quote: "सुन्दर संस्थान, सुन्दर व्यवस्था, सुन्दर प्रबन्धन। यहाँ पढ़ने का मौका मिलना भाग्य की बात है।" },
    { name: "Aman Yadav", role: "Civil (2021) → Bharatmala project", quote: "Survey camp in 4th sem put me on a real highway alignment crew. That experience got me my first site engineer role on a Bharatmala stretch." },
  ],
  faq: [
    { cat: "Admission", q: "How do I apply to BIPE?", a: "Admissions are exclusively through JEECUP counselling under college code 4455. Register at jeecup.admissions.nic.in, take the entrance, and choose BIPE 4455 during counselling. You can also fill our Apply form for personal guidance from our admissions team." },
    { cat: "Admission", q: "What is the eligibility?", a: "For the 3-year diploma you need a Class 10 pass with Mathematics and Science. Admission is through JEECUP Group A (UPJEE Polytechnic), with BIPE listed as institute code 4455 during counselling." },
    { cat: "Admission", q: "What documents do I need?", a: "Mandatory: JEECUP rank card / allotment letter, Class 10 marksheet, school transfer & character certificate, Aadhaar, 8 passport photos, bank passbook front page and an anti-ragging undertaking. Category and scholarship documents are optional. See the Documents page for the full list." },
    { cat: "Fees", q: "What is the annual tuition?", a: "Annual tuition is ₹30,150 — AFRC-approved and the same for all 5 branches. Other components (admission fee, exam fee, library, caution money, ID card) are listed on the Fees page; some are still being finalised. Hostel and mess are separate." },
    { cat: "Fees", q: "What scholarships are available?", a: "UP Government post-matric scholarships cover full or partial tuition for SC, ST, OBC, EWS and Minority categories. BIPE also offers merit-based waivers of 25–50% for high JEECUP ranks and 10–25% for Class 10 toppers. Many BIPE students pay much less than the published fee." },
    { cat: "Fees", q: "What is the refund policy?", a: "Refunds follow AICTE norms: 100% (less ₹1,000) if you withdraw 15+ days before classes start, 90% within 15 days, 80% within the first 15 days of classes (if the seat is filled), 50% after that, and no refund after 30 days. Refunds are processed within 30 working days." },
    { cat: "Hostel & Campus", q: "Is hostel available?", a: "Yes — for boys. BIPE currently runs a boys' hostel block on campus with a resident warden, staffed gates, visitor registration, fire safety, anti-ragging measures and a 9:30 PM curfew (extendable on parental authorisation). A girls' hostel is on the trust's roadmap; for now, girl students attend as day-scholars or with their own local arrangements — talk to admissions if you need help finding safe accommodation in the area." },
    { cat: "Hostel & Campus", q: "Is the mess vegetarian?", a: "The mess serves three meals a day with both vegetarian and non-vegetarian options. Annual mess fee is ₹36,000." },
    { cat: "Placements & Career", q: "Where do graduates work?", a: `Alumni work at Mahindra, Krishna Maruti, JCB, Asian Paints, Adani Solar, Ola Electric, RR Parkon, Knorr Bremse, BD Group Campa, Amber and others — ${_placed} placements through ${_endYear}.` },
    { cat: "Placements & Career", q: "Can I get a government job after a diploma?", a: "Yes — diploma engineers from BIPE qualify for SSC JE, RRB JE, UPPCL, NDDB, State Dairy Boards, Indian Army Technical and similar central and state recruitment. Several BIPE alumni work as Junior Engineers and Assistant Loco Pilots in Indian Railways and Mumbai Metro." },
    { cat: "Approvals & Trust", q: "Is BIPE AICTE-approved?", a: "Yes. BIPE holds AICTE Permanent ID 1-488233171 and the EoA letter for 2026-27 (F.No. Northern/1-46216893240/2026/EOA, dated 16 March 2026). It is BTEUP-affiliated under JEECUP code 4455 and AISHE-registered with the Department of Higher Education, MoE." },
    { cat: "Approvals & Trust", q: "How do I file a grievance?", a: "Email grievance@bipevns.org or write to the Principal's office. Complaints are treated as confidential and acknowledged within 7 working days. Four statutory committees handle different categories — Anti-Ragging, Internal (POSH), SC/ST and PWD Cell." },
  ],
  events: [
    // Curated 28 May 2026 per the audit:
    //   - "Tata Motors campus drive — 14 selected" REMOVED. The user
    //     confirmed there is no Tata Motors campus drive at BIPE;
    //     the event was fabricated and the "14 selected" figure
    //     can't be substantiated.
    //   - "Open House for Class 10 students (11 Apr 2026)" REMOVED.
    //     Past event, no replacement on the calendar; surfacing a
    //     2-month-old event as "upcoming" was stale-data theatre.
    // The "JEECUP 2026 results declared (May 24)" card seen on the
    // live homepage is backend-supplied (admin record) — Recruiters
    // pattern applies. components/home/News.tsx is pinned to this
    // static array as of 28 May 2026 so the wrong backend card stops
    // overriding.
    { date: "May 18, 2026", tag: "Placement", title: "Knorr-Bremse AG, Munich — pool campus drive", body: "Pool campus placement drive with Knorr-Bremse AG (Munich, Germany). Open to eligible final-year branches." },
    { date: "June 9, 2026", tag: "Admission", title: "JEECUP 2026 exam concludes", body: "Computer-based test ran 02–09 June (rescheduled from May). Results expected mid-June; 7-round counselling opens shortly after. Book your campus visit now to lock in your branch preferences." },
    { date: "Apr 24, 2026", tag: "Campus", title: "Industrial visit — Mechanical Engineering students", body: "Industrial visit organised for Mechanical Engineering (Production) students. Plant tour and hands-on shop-floor exposure." },
    { date: "Apr 17, 2026", tag: "Faculty", title: "Workshop: Spring Boot (Java Framework)", body: "One-day hands-on workshop on Spring Boot for Computer Science & Engineering students and faculty." },
  ],
  jeecupSteps: [
    { step: "01", title: "Apply on JEECUP portal", body: "Register at jeecup.admissions.nic.in. Application opens January, closed 20 May for the 2026 cycle. Fee ₹300 (₹200 for SC/ST)." },
    { step: "02", title: "Sit for the entrance", body: "Computer-based test 02–09 June 2026 (rescheduled from the original May window). Diploma engineering is Group A — Maths, Physics, Chemistry from Class 10 syllabus." },
    { step: "03", title: "Get your rank card", body: "Result expected mid-June 2026. Note your Group A rank — it determines counselling slot." },
    { step: "04", title: "Counselling — choose BIPE 4455", body: "Online choice-filling across 7 rounds (expanded from 5 this cycle). Add BIPE Varanasi (institute code 4455) and your branch preferences in priority order." },
    { step: "05", title: "Seat allotment & report", body: "Seat allotted based on rank + choices. Pay the seat-confirmation fee online, then report to BIPE with documents within the deadline." },
    { step: "06", title: "Classes begin · 15 July 2026", body: "Session 2026-27 begins 15 July. Orientation, mentor allocation, hostel allotment. Three years that change your career." },
  ],
  facilities: [
    { name: "Computer Lab", count: "120 systems", body: "Latest specs, dual monitors. Open 8am–10pm. Programming, simulation, GIS." },
    { name: "Mechanical Workshop", count: "8 sections", body: "Fitting, welding, foundry, machining, CNC, sheet metal — every diploma student gets hands-on hours." },
    { name: "Dairy Pilot Plant", count: "Rare in UP", body: "Pasteurization, cream separation, packaging — mirrors what Amul, Parag floor processes look like." },
    { name: "Electrical Lab", count: "12 benches", body: "Machines, electronics, control systems, renewables, EV battery & motor lab." },
    { name: "Civil Survey Yard", count: "6 acres", body: "Total stations, theodolites, level instruments. On-site survey camp every 4th semester." },
    { name: "Library", count: "12,000+ titles", body: "Print + digital. Subscription to e-resources, IEEE digital library, NPTEL." },
    { name: "Hostels", count: "Boys + Girls", body: "Separate blocks, on-campus mess, Wi-Fi, study halls, 24×7 security." },
    { name: "Sports & Ground", count: "On-campus", body: "Cricket, football, volleyball, indoor games. Annual sports week in February." },
  ],
};
