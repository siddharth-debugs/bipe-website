export type RouteKey =
  | "home" | "about" | "courses" | "admission" | "apply" | "visit"
  | "contact" | "placements" | "campus" | "fees" | "scholarships"
  | "documents" | "jeecup" | "hostel" | "faculty" | "events"
  | "principal" | "teaching" | "approvals" | "faq" | "blog" | "grievance";

export const SITE_URL = "https://bipevns.org";

export const ROUTES: Record<RouteKey, { path: string; title: string; description: string }> = {
  home: {
    path: "/",
    title: "BIPE — Banaras Institute of Polytechnic & Engineering · Diploma in Eastern UP",
    description: "AICTE-approved, BTEUP-affiliated 3-year diploma engineering institute in Phoolpur, Varanasi. 10 branches incl. rare Dairy Engineering. JEECUP code 4455.",
  },
  about: {
    path: "/about",
    title: "About BIPE — Sixteen years of polytechnic education in Eastern UP",
    description: "Established 2010. Six-acre campus in Phoolpur, Varanasi. AICTE, BTEUP, ISO 9001:2015. 1,000+ alumni placed at Mahindra, Tata, BEL, Indian Railways.",
  },
  courses: {
    path: "/courses",
    title: "Courses · 10 BTEUP-licensed diploma branches | BIPE",
    description: "Computer Science, Civil, Electrical, Mechanical (Production / Automobile), Dairy Engineering — plus 4 lateral-entry diplomas. AFRC-approved fees ₹30,150/year.",
  },
  admission: {
    path: "/admission",
    title: "Admission 2026-27 · JEECUP code 4455 | BIPE",
    description: "Apply via JEECUP (UPJEE Polytechnic) — institute code 4455. Lateral entry from ITI also supported. Counselling May–July, classes begin August 2026.",
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
    title: "Hostel · Boys' & Girls' blocks | BIPE",
    description: "Separate boys' and girls' hostel blocks on the 6-acre Phoolpur campus. On-campus mess, Wi-Fi, study halls, 24×7 security.",
  },
  faculty: {
    path: "/faculty",
    title: "Faculty · 45+ mentors · 1:20 ratio | BIPE",
    description: "Each faculty member personally mentors 20 students with periodic home visits to parents. Outcome-based pedagogy.",
  },
  events: {
    path: "/events",
    title: "News & Events on campus | BIPE",
    description: "Tech fest, placement drives, open house for Class 10 students, faculty workshops, JEECUP guidance sessions.",
  },
  principal: {
    path: "/principal",
    title: "Principal's Message — Dr. R. K. Sharma | BIPE",
    description: "A note from BIPE's principal on what families can expect from three years at the institution.",
  },
  teaching: {
    path: "/teaching",
    title: "Teaching & Learning · Outcome-based pedagogy | BIPE",
    description: "Semester exam + continuous assessment + project work, calibrated against published Program Outcomes.",
  },
  approvals: {
    path: "/approvals",
    title: "Approvals · AICTE, BTEUP, ISO 9001:2015 | BIPE",
    description: "AICTE approval 1-488233171. BTEUP-affiliated. ISO 9001:2015 certified. AFRC fee approval. JEECUP code 4455.",
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
    title: "Grievance Redressal | BIPE",
    description: "Raise a grievance with the BIPE Grievance Redressal Cell.",
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
