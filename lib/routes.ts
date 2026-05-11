export type RouteKey =
  | "home" | "about" | "courses" | "admission" | "apply" | "visit"
  | "contact" | "placements" | "alumni" | "campus" | "fees" | "scholarships"
  | "documents" | "jeecup" | "hostel" | "faculty" | "events"
  | "chairman" | "principal" | "teaching" | "approvals" | "faq" | "blog" | "grievance"
  | "mandatoryDisclosure" | "aiPolicy"
  | "privacy" | "terms" | "antiRagging";

export const SITE_URL = "https://bipevns.org";

export const ROUTES: Record<RouteKey, { path: string; title: string; description: string }> = {
  home: {
    path: "/",
    title: "BIPE Varanasi — AICTE Polytechnic · JEECUP Code 4455",
    description: "AICTE-approved diploma engineering in Phoolpur, Varanasi. 5 BTEUP branches including rare Dairy Engineering. JEECUP code 4455. Apply for 2026-27.",
  },
  about: {
    path: "/about",
    title: "About BIPE — Sixteen years of polytechnic education in Eastern UP",
    description: "Established 2010. Six-acre campus in Phoolpur, Varanasi. AICTE, BTEUP, ISO 9001:2015. 1,000+ alumni placed at Mahindra, Tata, BEL, Indian Railways.",
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
  },
  apply: {
    path: "/apply",
    title: "Apply for 2026-27 · 4-step form | BIPE",
    description: "Start your BIPE application — 5 minutes. Personal guidance call within 24 hours. EN / हिंदी support on WhatsApp.",
  },
  visit: {
    path: "/visit",
    title: "Visit the Phoolpur campus · Free shuttle | BIPE",
    description: "Book a free campus visit. Shuttle from Varanasi Cantt. Meet faculty, see the 120-computer lab, dairy pilot plant, hostels.",
  },
  contact: {
    path: "/contact",
    title: "Contact BIPE Varanasi · Phone, Email, Address",
    description: "Call +91-9198646464 · admissions@bipevns.org · Village Gajokhar, Post Parsara, Phoolpur, Varanasi 221206.",
  },
  placements: {
    path: "/placements",
    title: "Placements · 1,000+ alumni placed | BIPE",
    description: "Alumni at Mahindra, Tata Steel, BEL, Indian Railways, Tata Motors, Amul, Mother Dairy, UPPCL, Ola Electric, Ather and more.",
  },
  alumni: {
    path: "/alumni",
    title: "Alumni · 915 placements · 871 joined | BIPE",
    description: "Browse 915 BIPE placements across 16 recruiter drives (2016–2021): 871 joined, 44 offered but moved on. Filter by branch, year, recruiter or status.",
  },
  campus: {
    path: "/campus",
    title: "Campus & Facilities · Six acres in Phoolpur | BIPE",
    description: "120-computer lab, mechanical workshop, dairy pilot plant, electrical lab, civil survey yard, library with 12,000+ titles, hostels, sports ground.",
  },
  fees: {
    path: "/fees",
    title: "Fees · ₹30,150/year AFRC-approved | BIPE",
    description: "Transparent, AFRC-approved fees. No capitation, no hidden charges. Receipts for every payment. Hostel & mess separate.",
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
    title: "JEECUP guidance · 6-step counselling | BIPE",
    description: "From application to first day of class — JEECUP application, entrance, rank, counselling, seat allotment, reporting at BIPE 4455.",
  },
  hostel: {
    path: "/hostel",
    title: "Hostel · Boys' on-campus block | BIPE",
    description: "Boys' hostel on the Phoolpur campus — furnished rooms, on-campus mess, Wi-Fi, study halls, resident warden, 24×7 security.",
  },
  faculty: {
    path: "/faculty",
    title: "Faculty · 33 BTEUP-recognised mentors · 1:20 ratio | BIPE",
    description: "33 BTEUP-recognised faculty across 7 departments. 1:20 mentor ratio with periodic home visits. AICTE FDP-trained, OBE-aligned pedagogy.",
  },
  events: {
    path: "/events",
    title: "News & Events on campus | BIPE",
    description: "Tech fest, placement drives, open house for Class 10 students, faculty workshops, JEECUP guidance sessions.",
  },
  chairman: {
    path: "/chairman",
    title: "Chairman's Message — Dr. Chandrika Rai, IPS (Retd.) | BIPE",
    description: "A vision rooted in service. From Pantnagar Agriculture University to the Indian Police Service to founding Purwanchal Educational Trust — a personal note from BIPE's Chairman to every family considering us.",
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
    title: "Approvals · AICTE, BTEUP, ISO 9001:2015, AISHE | BIPE",
    description: "AICTE permanent ID 1-488233171 · EoA 2026-27 dated 16 Mar 2026. BTEUP-affiliated under JEECUP 4455. ISO 9001:2015 certified. AISHE registered.",
  },
  faq: {
    path: "/faq",
    title: "FAQ · Admissions, Fees, Career, Campus | BIPE",
    description: "Common questions about admission, fees, scholarships, hostels, mentorship and life at BIPE.",
  },
  blog: {
    path: "/blog",
    title: "Blog | BIPE Varanasi",
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
    title: "Terms of Use | BIPE",
    description: "Terms governing the use of bipevns.org and BIPE digital services. Includes IT Rules 2021 grievance officer details.",
  },
  antiRagging: {
    path: "/anti-ragging",
    title: "Anti-Ragging Pledge & Committee | BIPE",
    description: "Zero-tolerance anti-ragging at BIPE. Committee composition, complaint flow, UGC anti-ragging portal link and Supreme-Court-mandated undertaking.",
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
