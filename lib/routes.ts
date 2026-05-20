export type RouteKey =
  | "home" | "about" | "courses" | "admission" | "apply" | "visit"
  | "contact" | "placements" | "alumni" | "campus" | "fees" | "scholarships"
  | "documents" | "jeecup" | "hostel" | "faculty" | "events"
  | "chairman" | "principal" | "teaching" | "approvals" | "faq" | "blog" | "grievance"
  | "mandatoryDisclosure" | "aiPolicy"
  | "privacy" | "terms" | "antiRagging"
  | "jeecupFromBihar" | "jeecupVsBcece" | "admissionFromBihar"
  | "jeecupCounselling";

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
    title: "Polytechnic College in Varanasi · BIPE · AICTE-approved · JEECUP 4455",
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
    title: "About BIPE — Sixteen years of polytechnic education in Eastern UP",
    description: "Established 2010 · 6-acre Phoolpur campus · AICTE-approved · BTEUP-affiliated · AISHE-registered · 1,000+ alumni at Mahindra, Tata, BEL, Indian Railways.",
  },
  courses: {
    path: "/courses",
    title: "Academics · 5 BTEUP-affiliated diploma branches | BIPE",
    description: "CS&E, Civil, Electrical, Mechanical Engineering (Production), Dairy. AICTE-approved · AFRC fees ₹30,150/year · JEECUP 4455.",
  },
  admission: {
    path: "/admission",
    title: "Admission 2026-27 · JEECUP code 4455 | BIPE",
    description: "Apply via JEECUP (UPJEE Polytechnic) — institute code 4455. Counselling May–July, classes begin August 2026.",
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
    title: "Apply for 2026-27 · 4-step form | BIPE",
    description: "Start your BIPE application — 5 minutes. Personal guidance call within 24 hours. EN / हिंदी support on WhatsApp.",
  },
  visit: {
    path: "/visit",
    title: "Visit the Phoolpur campus · Free shuttle | BIPE",
    // Added "14 km from Varanasi Cantt station" — May 2026 keyword
    // audit P2 #12. Captures the "polytechnic near Varanasi station"
    // discovery query without adding length to the snippet.
    description: "Book a free BIPE campus visit — polytechnic 14 km from Varanasi Cantt station, free shuttle. Meet faculty, see the 120-computer lab, dairy pilot plant, hostels.",
  },
  contact: {
    path: "/contact",
    title: "Contact BIPE Varanasi · Phone, Email, Address",
    description: "Call +91-9198646464 · admissions@bipevns.org · Village Gajokhar, Post Parsara, Phoolpur, Varanasi 221206.",
  },
  placements: {
    path: "/placements",
    // "polytechnic placements UP" head term added — May 2026 keyword
    // audit P1 #4. Body of the page lists recruiters; meta now opens
    // with the search-intent phrase prospects actually type.
    title: "Polytechnic placements in UP · 1,000+ alumni placed | BIPE",
    description: "Polytechnic placements in UP — 1,000+ BIPE Varanasi alumni at Mahindra, Tata Steel, BEL, Indian Railways, Tata Motors, Amul, Mother Dairy, UPPCL, Ola Electric, Ather and more.",
  },
  alumni: {
    path: "/alumni",
    title: "Alumni · 997 placements · 123 with photos | BIPE",
    description: "Browse 997 BIPE alumni across 16 recruiter drives (2013–2022). 123 verified placements with photos. Filter by branch, year, recruiter or status.",
  },
  campus: {
    path: "/campus",
    title: "Campus & Facilities · Six acres in Phoolpur | BIPE",
    description: "120-computer lab, mechanical workshop, dairy pilot plant, electrical lab, civil survey yard, library with 12,000+ titles, hostels, sports ground.",
  },
  fees: {
    path: "/fees",
    // Year modifier "2026-27" added to capture the seasonal query —
    // May 2026 keyword audit P1 #8. Fees are per academic year, so
    // "2026-27" matches the cycle better than bare "2026".
    title: "Polytechnic fees 2026-27 · ₹30,150/year AFRC-approved | BIPE",
    description: "BIPE Varanasi polytechnic fees for 2026-27 — ₹30,150/year, AFRC-approved. No capitation, no hidden charges. Receipts for every payment. Hostel & mess separate.",
  },
  scholarships: {
    path: "/scholarships",
    title: "Scholarships · UP Govt. Post-Matric & EWS | BIPE",
    description: "Full UP Government post-matric scholarship for SC/ST/OBC/Minority/EWS. We assist with the Samaj Kalyan portal application.",
  },
  documents: {
    path: "/documents",
    title: "Documents required for admission | BIPE",
    description: "10th & 12th marksheets, JEECUP rank card, Aadhaar, caste/income certificates, passport photos, transfer & character certificates.",
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
    // "polytechnic with hostel UP" head term added — May 2026 keyword
    // audit P1 #5. Prospects from outside Varanasi search for
    // hostel-providing polytechnics specifically; the existing meta
    // was BIPE-specific and missed the discovery query.
    title: "Polytechnic with hostel in UP · Boys' on-campus block | BIPE",
    description: "Polytechnic with on-campus hostel in UP — BIPE Phoolpur's boys' hostel has furnished rooms, on-campus mess, Wi-Fi, study halls, resident warden, 24×7 security.",
  },
  faculty: {
    path: "/faculty",
    title: "Faculty · 40 BTEUP-recognised mentors · 1:20 ratio | BIPE",
    description: "40 BTEUP-recognised faculty across 7 departments. 1:20 mentor ratio with periodic home visits. AICTE FDP-trained, OBE-aligned pedagogy.",
  },
  events: {
    path: "/events",
    title: "News & Events on campus | BIPE",
    description: "Tech fest, placement drives, open house for Class 10 students, faculty workshops, JEECUP guidance sessions.",
  },
  chairman: {
    path: "/chairman",
    title: "Chairman's Message — Dr. Chandrika Rai, IPS (Retd.) | BIPE",
    description: "From Pantnagar Agriculture University to the IPS to founding Purwanchal Educational Trust — Dr. Chandrika Rai's note to every BIPE family.",
  },
  principal: {
    path: "/principal",
    title: "Principal's Message — Dr. R. K. Sharma | BIPE",
    description: "A note from BIPE's principal on what families can expect from three years at the institution.",
  },
  teaching: {
    path: "/teaching",
    title: "Teaching & Learning · OBE + AI-augmented pedagogy | BIPE",
    description: "Outcome-Based Education aligned to AICTE 2024-27. Diagnostic, formative, summative assessment. AI-augmented with Claude. Faculty-led, human-first.",
  },
  approvals: {
    path: "/approvals",
    // Year modifier "2026-27" added — May 2026 keyword audit P1 #8.
    // Compliance docs are annual, the year matters for verification
    // queries.
    title: "Approvals 2026-27 · AICTE, BTEUP, AISHE | BIPE",
    description: "AICTE permanent ID 1-488233171 · EoA 2026-27 dated 16 Mar 2026. BTEUP-affiliated under JEECUP 4455. AISHE-registered with the Department of Higher Education, MoE.",
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
    title: "Terms of Use — bipevns.org | BIPE Varanasi",
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
  jeecupCounselling: {
    path: "/jeecup-counselling",
    // Highest-volume keyword in BIPE's universe per Semrush —
    // 18,100 monthly searches, competition 0.01, CPC ₹0.43. Not
    // ranking at all today. Dedicated page added May 2026 to
    // capture the head term while /jeecup remains the broader
    // 6-step guidance hub.
    title: "JEECUP Counselling 2026 · 5 rounds · choice filling | BIPE 4455",
    description: "JEECUP counselling 2026 — 5 rounds, choice filling strategy, documents required, seat allotment, reporting, common mistakes. How BIPE Varanasi (code 4455) fits.",
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
