import { DATA, BRANCH_CLOSURES, admittingOf, seatsOf } from "@/lib/data";
import { ROUTES, SITE_URL } from "@/lib/routes";
import { PLACEMENT_STATS, formatPlacements } from "@/lib/placement-stats";
import {
  DIRECTOR,
  DIRECTOR_STATS,
  DIRECTOR_EDUCATION,
  CHAIRMAN,
  PRINCIPAL,
} from "@/lib/leadership";
import { BLOG_POSTS } from "@/lib/blogPosts";
import { BRANCH_DETAIL } from "@/lib/branchContent";
import { getBranchesMapped, getContact, OFFICE_HOURS } from "@/lib/content";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

/**
 * /llms.txt — generated from the SAME data path the site renders from.
 *
 * Why a route and not a static file: the previous public/llms.txt went
 * a month stale (retired phone numbers, 2021-era placement figures,
 * pre-correction director credentials) because nothing regenerated it.
 * The 2 Sep 2026 audit fixed the content; this route fixes the CLASS of
 * bug. Branches are read CMS-first via lib/content.ts — exactly like
 * /courses — so an admin CMS edit reaches llms.txt the same way it
 * reaches the pages (the content:public fetch tag joins this route's
 * cache tags; the admin proxy's revalidateTag regenerates it).
 * Seed-only facts (EoA reference, placement stats, leadership, blog)
 * update at the next build like every other surface.
 *
 * Contact flows through getContact() like every other surface. That is
 * safe against the stale-CMS-record class of bug found 2 Sep 2026
 * (retired 9198646464 / bipevns@gmail.com outranking the audited seed)
 * because getContact() itself now enforces the seed for identity-
 * critical NAP fields — see the overlay in lib/content.ts. Fields with
 * no CMS column (whatsappPhone, AICTE EoA ref/date) stay seed literals.
 *
 * Drift protection (enforced at prerender, so `next build` fails):
 *   - page()/blogPost() throw if a linked path/slug no longer exists or
 *     a linked route was flipped to noindex.
 *   - EXTRA_PATHS (sub-pages outside ROUTES) are validated against
 *     app/sitemap.ts — a whitelisted path the sitemap stopped claiming
 *     fails the build.
 *   - assertCoverage() uses the SITEMAP as its universe: every URL the
 *     sitemap advertises (except individual blog posts, which are
 *     deliberately curated below the linked hub) must be linked here or
 *     sit in EXCLUDED_PATHS with a reason.
 *   - Every branch slug must have a BRANCH_DETAIL entry — without one
 *     app/courses/[branch] renders notFound(), which does NOT fail the
 *     build on its own; this assert makes it fail loudly here.
 *   - The Crawler Policy list comes from app/robots.ts, taken from the
 *     "*" rule and asserted identical across all per-bot rules.
 *   - One flat fee across branches is asserted, not assumed.
 *
 * Facts that remain MANUAL literals (verified in the 2 Sep 2026 audit;
 * no code source exists for them). When one changes on its page, change
 * it here in the same commit: campus size (6 acres) · faculty count and
 * mentor ratio (40, 1:20, home visits) · hostel costs and the
 * girls'-hostel status · Eastern-UP and Bihar catchment lists · Bihar
 * road distances · founded 2010 / Purwanchal Educational Trust ·
 * director "appointed August 2026" and tenure years "1981-2019" ·
 * 2,200+ alumni network · the government- and dairy-pathway company
 * lists · programme duration and
 * eligibility wording · grievance 7-working-day SLA · flagship-guide
 * labels/descriptions and section descriptions (curated copy).
 */

// Route handlers are dynamic by default in Next 15+; this content is
// data-derived, so force static prerender (served like a file, with
// tag-based revalidation via the content:public fetch inside).
export const dynamic = "force-static";

/* ─────────────────────────── curated links ───────────────────────── */

// Sub-pages that are real and indexable but live outside ROUTES.
// Validated against app/sitemap.ts at prerender — see buildBody().
const EXTRA_PATHS = new Set(["/campus/phoolpur"]);

// Sitemap-advertised paths deliberately NOT linked from llms.txt: the
// homepage (it's the H1 subject), the bare conversion form, and legal
// boilerplate an AI assistant never needs to cite.
const EXCLUDED_PATHS = new Set(["/", "/apply", "/privacy", "/terms"]);

type Entry = { path: string; label: string; desc: string };

const KEY_PAGES: Entry[] = [
  { path: "/about", label: "About", desc: "Institutional history, vision, AICTE approval details" },
  { path: "/about/affiliations", label: "Affiliations", desc: "AICTE, BTEUP, AISHE affiliation records" },
  { path: "/courses", label: "Courses", desc: "All programmes with BTEUP codes + seat matrix" },
  { path: "/admission", label: "Admission", desc: "Step-by-step JEECUP counselling guide" },
  { path: "/why-bipe", label: "Why BIPE", desc: "Mentorship model, outcomes, workshop and lab capacity, verified placements" },
  { path: "/fees", label: "Fees", desc: "Fee structure, scholarships, AFRC approval" },
  { path: "/scholarships", label: "Scholarships", desc: "UP post-matric, EWS, BIPE merit waivers" },
  { path: "/placements", label: "Placements", desc: "Recruiter list + TPO-verified outcomes" },
  { path: "/alumni", label: "Alumni", desc: "Placement records filterable by branch/year" },
  { path: "/hostel", label: "Hostel", desc: "Boys' on-campus hostel, mess, facilities" },
  { path: "/documents", label: "Documents", desc: "Reporting-day checklist — ten mandatory documents, plus conditional and optional ones" },
  { path: "/faq", label: "FAQ", desc: "Q&As on eligibility, fees, hostel, branches, JEECUP" },
  { path: "/approvals", label: "Approvals", desc: "AICTE EoA letter, BTEUP affiliation, AISHE" },
  { path: "/mandatory-disclosure", label: "Mandatory Disclosure", desc: "AICTE Annexure-18" },
  { path: "/contact", label: "Contact", desc: "Phone, email, address, embedded map, social handles" },
  { path: "/faculty", label: "Faculty", desc: "Named faculty roster with qualifications" },
  { path: "/chairman", label: "Chairman", desc: `${CHAIRMAN.name}, ${CHAIRMAN.postNominal} — Chairman, Purwanchal Educational Trust` },
  { path: "/director", label: "Director", desc: `${DIRECTOR.name}, ${DIRECTOR.postNominal.replaceAll(" · ", ", ")} — Director` },
  { path: "/principal", label: "Principal", desc: `${PRINCIPAL.name}, ${PRINCIPAL.postNominal} — Principal` },
  { path: "/teaching", label: "Teaching", desc: "Outcome-based pedagogy and assessment model" },
  { path: "/ai-policy", label: "AI Policy", desc: "How BIPE uses AI in teaching — principles + parent FAQ" },
  { path: "/anti-ragging", label: "Anti-Ragging", desc: "Committee, helplines, UGC/AICTE compliance" },
  { path: "/grievance", label: "Grievance", desc: "Grievance redressal process and contacts" },
];

const JEECUP_GUIDES: Entry[] = [
  { path: "/jeecup", label: "JEECUP at BIPE", desc: "JEECUP institute code, process, common pitfalls" },
  { path: "/jeecup-counselling", label: "JEECUP Counselling", desc: "Round-by-round counselling walkthrough" },
  { path: "/jeecup-registration-2026", label: "JEECUP Registration 2026", desc: "How to fill the application form" },
  { path: "/jeecup-eligibility-criteria", label: "JEECUP Eligibility", desc: "Group A eligibility rules" },
  { path: "/jeecup-exam-pattern-2026", label: "JEECUP Exam Pattern 2026", desc: "Paper structure and marking" },
  { path: "/jeecup-syllabus-2026", label: "JEECUP Syllabus 2026", desc: "Topic-wise syllabus" },
  { path: "/jeecup-previous-year-papers", label: "JEECUP Previous Year Papers", desc: "Past papers for practice" },
  { path: "/jeecup-admit-card-2026", label: "JEECUP Admit Card 2026", desc: "Download steps + troubleshooting" },
  { path: "/jeecup-result-2026", label: "JEECUP Result 2026", desc: "How to check rank and score" },
  { path: "/jeecup-rank-predictor-2026", label: "JEECUP Rank Predictor", desc: "Estimate rank from marks" },
  { path: "/jeecup-after-results-action-plan", label: "After Results Action Plan", desc: "What to do once the rank is out" },
  { path: "/jeecup-cutoff-2026-bipe-vs-government", label: "JEECUP Cutoff — BIPE vs Government", desc: "Cutoff comparison" },
  { path: "/jeecup-seat-allotment-2026", label: "Seat Allotment 2026", desc: "Allotment, freeze/float, fee confirmation" },
  { path: "/jeecup-round-4-2026", label: "Round 4 2026", desc: "Late-round counselling guide" },
  { path: "/jeecup-document-verification-checklist", label: "Document Verification Checklist", desc: "Papers needed at DV" },
  { path: "/jeecup-helpline-contact", label: "JEECUP Helpline", desc: "Official helpline + BIPE guidance desk" },
];

const BTEUP_SERVICES: Entry[] = [
  { path: "/bteup-result-check", label: "BTEUP Result Check", desc: "Semester result lookup steps" },
  { path: "/bteup-admit-card-download", label: "BTEUP Admit Card", desc: "Exam admit card download" },
  { path: "/bteup-semester-exam-dates-2026", label: "Semester Exam Dates 2026", desc: "BTEUP exam calendar" },
  { path: "/bteup-syllabus-2026", label: "BTEUP Syllabus 2026", desc: "Branch-wise diploma syllabus" },
  { path: "/bteup-grading-cgpa-calculation", label: "Grading & CGPA", desc: "How BTEUP grades and CGPA work" },
  { path: "/bteup-back-paper-supplementary-process", label: "Back Paper Process", desc: "Supplementary exam process" },
  { path: "/bteup-student-registration", label: "Student Registration", desc: "First-year BTEUP enrolment" },
  { path: "/bteup-family-id-registration", label: "Family ID Registration", desc: "UP Family ID for scholarships" },
  { path: "/bteup-exam-fees-payment", label: "Exam Fees Payment", desc: "Paying BTEUP exam fees online" },
  { path: "/bteup-migration-noc-process", label: "Migration & NOC", desc: "Migration certificate + NOC steps" },
  { path: "/bteup-duplicate-marksheet-application", label: "Duplicate Marksheet", desc: "Reissue of lost marksheets" },
  { path: "/bteup-affiliated-colleges-up", label: "BTEUP Affiliated Colleges", desc: "Directory of affiliated institutes" },
];

const CHOOSING: Entry[] = [
  { path: "/private-vs-government-polytechnic", label: "Private vs Government Polytechnic", desc: "Honest comparison for UP students" },
  { path: "/government-polytechnic-in-eastern-up", label: "Government Polytechnics in Eastern UP", desc: "Region directory + how BIPE compares" },
  { path: "/aided-polytechnic-uttar-pradesh", label: "Aided Polytechnics in UP", desc: "Aided-institute landscape" },
  { path: "/jeecup-vs-bcece", label: "JEECUP vs BCECE", desc: "For Bihar students weighing both exams" },
  { path: "/admission-from-bihar", label: "Admission from Bihar", desc: "Bihar-student route to BIPE via JEECUP" },
  { path: "/jeecup-from-bihar", label: "JEECUP from Bihar", desc: "Eligibility + logistics for Bihar candidates" },
];

const CAMPUS: Entry[] = [
  { path: "/campus", label: "Campus", desc: "Labs, workshops, library, sports facilities" },
  { path: "/campus/phoolpur", label: "Phoolpur Campus", desc: "Location, how to reach, distances from Varanasi" },
  { path: "/visit", label: "Visit", desc: "Book a campus visit" },
  { path: "/events", label: "Events", desc: "Academic, sports, cultural and placement events" },
];

const FLAGSHIP_GUIDES: { slug: string; label: string; desc: string }[] = [
  { slug: "diploma-vs-iti-vs-btech-after-class-10", label: "Diploma vs ITI vs B.Tech", desc: "Which route after Class 10" },
  { slug: "diploma-to-btech-lateral-entry-up-aktu", label: "Lateral Entry to B.Tech (AKTU)", desc: "Diploma → 2nd-year B.Tech in UP" },
  { slug: "how-to-fill-jeecup-2026-application-form-step-by-step", label: "How to Fill the JEECUP 2026 Form", desc: "Step-by-step application guide" },
  { slug: "jeecup-form-kaise-bharein-2026-step-by-step", label: "JEECUP फॉर्म कैसे भरें 2026", desc: "Hindi version of the form guide" },
  { slug: "jeecup-rank-vs-bipe-4455-cutoffs-2024-2025", label: "JEECUP Rank vs BIPE 4455 Cutoffs", desc: "Real 2024-25 closing ranks" },
  { slug: "government-jobs-after-polytechnic-diploma-2026", label: "Government Jobs After Diploma", desc: "JE, RRB, SSC and UPPCL routes" },
  { slug: "polytechnic-salary-in-india-2026", label: "Polytechnic Salary in India 2026", desc: "Branch-wise first salaries" },
  { slug: "why-dairy-engineering-bipe-rare-bteup-327", label: "Why Dairy Engineering at BIPE", desc: "Background on BTEUP 327 — the branch closed to new admissions from 2026-27" },
  { slug: "polytechnic-kya-hai-aur-kaise-kare", label: "पॉलिटेक्निक क्या है?", desc: "Hindi explainer for first-generation families" },
];

// Only the rare branch carries an annotation; keyed by slug so a
// branch rename surfaces here as a build diff.
// 3 Sep 2026 — the Dairy note used to sell the branch ("rare: only ~4
// institutes in UP offer this; careers at Amul, Mother Dairy, Parag,
// Nestlé, NDDB"). That is a recruitment pitch, and this file is the one
// an assistant quotes verbatim to a family asking what BIPE offers. The
// branch closed to new admissions from 2026-27, so the pitch is gone;
// the closure sentence is appended automatically from `b.admissions`
// in branchLines below, which is why there is no dairy entry here now.
const BRANCH_NOTES: Record<string, string> = {};

/* ─────────────────────────── rendering ───────────────────────────── */

/** Director résumé figure by its DIRECTOR_STATS label — throws if the
 *  label is edited in lib/leadership.ts so the two can't drift apart. */
function directorStat(label: string): string {
  const stat = DIRECTOR_STATS.find((s) => s.label === label);
  if (!stat) throw new Error(`llms.txt needs DIRECTOR_STATS label "${label}" (edited in lib/leadership.ts?)`);
  return stat.value;
}

async function buildBody(): Promise<string> {
  // Branches and contact: CMS-first with seed fallback — the same data
  // path the pages render from (lib/content.ts; identity NAP fields are
  // seed-enforced inside getContact(), see header comment). `seed`
  // remains for fields with no CMS column (whatsappPhone, EoA ref/date).
  const [branches, contact] = await Promise.all([getBranchesMapped(), getContact()]);
  const seed = DATA.contact;

  const sitemapPaths = new Set(
    sitemap().map((e) => e.url.replace(SITE_URL, "") || "/"),
  );
  const usedPaths = new Set<string>();

  const page = (path: string): string => {
    if (EXTRA_PATHS.has(path)) {
      if (!sitemapPaths.has(path)) {
        throw new Error(`llms.txt EXTRA_PATHS entry "${path}" is not in app/sitemap.ts — page gone?`);
      }
      usedPaths.add(path);
      return `${SITE_URL}${path}`;
    }
    const route = Object.values(ROUTES).find((r) => r.path === path);
    if (!route) {
      throw new Error(`llms.txt links "${path}" but no such route exists in lib/routes.ts`);
    }
    if (route.noindex) {
      throw new Error(`llms.txt links "${path}" but that route is noindex — remove the link`);
    }
    usedPaths.add(path);
    return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  };

  const blogPost = (slug: string): string => {
    if (!BLOG_POSTS.some((p) => p.slug === slug)) {
      throw new Error(`llms.txt links blog slug "${slug}" but it is not in lib/blogPosts.ts`);
    }
    return `${SITE_URL}/blog/${slug}`;
  };

  const entryLines = (entries: Entry[]) =>
    entries.map((e) => `- [${e.label}](${page(e.path)}): ${e.desc}`).join("\n");

  // Every branch page 404s without a BRANCH_DETAIL entry (see
  // app/courses/[branch]/page.tsx notFound()) and notFound() alone
  // would NOT fail the build — this assert does.
  for (const b of branches) {
    if (!BRANCH_DETAIL[b.slug]) {
      throw new Error(`llms.txt: branch "${b.slug}" has no BRANCH_DETAIL entry — /courses/${b.slug} would 404`);
    }
  }

  // Branch facts are CMS-first, and getBranchesMapped() has no content
  // guard of its own (unlike getContact(), which seed-enforces identity
  // fields). A 3 Sep 2026 verification sweep found this the one place
  // llms.txt republishes unguarded CMS values as institutional fact:
  // seats, fee and branch name feed the "Total sanctioned seats",
  // tuition and per-branch lines below. The flat-fee check underneath
  // catches a ONE-branch fee edit but not a uniform one, and nothing
  // caught a seats edit at all — so compare against the audited seed.
  // A legitimate change belongs in lib/data.ts and the CMS together,
  // exactly as NAP edits do.
  for (const b of branches) {
    const seed = DATA.branches.find((s) => s.slug === b.slug);
    if (!seed) {
      throw new Error(`llms.txt: branch "${b.slug}" exists in the CMS but not in DATA.branches — add it to the seed before publishing it as fact`);
    }
    for (const [field, cms, expected] of [
      ["seats", String(b.seats), String(seed.seats)],
      ["fee", b.fee, seed.fee],
      ["code", b.code, seed.code],
      ["name", b.name, seed.name],
    ] as const) {
      if (cms !== expected) {
        throw new Error(
          `llms.txt: CMS branch "${b.slug}" ${field} ("${cms}") diverges from the DATA.branches seed ("${expected}") — reconcile both in one pass before deploying`,
        );
      }
    }
  }
  if (branches.length !== DATA.branches.length) {
    throw new Error(`llms.txt: CMS lists ${branches.length} branches, the seed lists ${DATA.branches.length} — the seat total and "N BTEUP-affiliated diploma branches" heading would both be wrong`);
  }

  const totalSeats = branches.reduce((sum, b) => sum + b.seats, 0);

  // Every slug in BRANCH_CLOSURES must actually resolve to a branch. A
  // typo here would silently drop the "closed to admissions" sentence
  // from the branch line and from getBranchesMapped()'s overlay, and the
  // file would go back to advertising an intake that does not exist —
  // failing quietly in the one direction that matters. 3 Sep 2026.
  for (const slug of Object.keys(BRANCH_CLOSURES)) {
    if (!branches.some((b) => b.slug === slug)) {
      throw new Error(
        `llms.txt: BRANCH_CLOSURES names "${slug}" but no branch has that slug — the closure notice would silently vanish and llms.txt would advertise the branch as open`,
      );
    }
  }

  const admitting = admittingOf(branches);
  const admittingSeats = seatsOf(admitting);
  const closedNames = branches.filter((b) => b.admissions).map((b) => b.name);
  const sanctionedNote = closedNames.length
    ? ` across ${branches.length} branches — regulatory figure from the AICTE/BTEUP approval on file. It still` +
      ` counts ${closedNames.join(", ")}, which is closed to new admissions, so it is NOT the number of` +
      ` seats a 2026-27 applicant can compete for.`
    : ` across ${branches.length} branches`;
  if (admitting.length === 0) {
    throw new Error("llms.txt: every branch is closed to admissions — that is almost certainly a data error, not a real state");
  }

  // One flat AFRC fee across branches is a claim, not an assumption —
  // fail the build if the (CMS-first) data ever disagrees.
  const fees = new Set(branches.map((b) => b.fee));
  if (fees.size !== 1) {
    throw new Error("llms.txt assumes one flat fee across branches; the branch data now disagrees — rewrite the fee lines");
  }
  const fee = `₹${branches[0].fee}`;

  const placed = formatPlacements(PLACEMENT_STATS.totalPlacements);
  const years = `${PLACEMENT_STATS.startYear}-${PLACEMENT_STATS.endYear}`;
  const phdField = DIRECTOR_EDUCATION.find((d) => d.degree === "Ph.D.")?.field;
  if (!phdField) throw new Error("llms.txt: no Ph.D. entry in DIRECTOR_EDUCATION");

  const waDigits = seed.whatsappPhone.replace(/\D/g, "");

  // app/robots.ts is the single authority on the disallow list. Take
  // the "*" rule explicitly and assert every per-bot rule matches it,
  // so a future divergence can't silently publish the wrong policy.
  const robotsRules = robots().rules;
  const ruleList = Array.isArray(robotsRules) ? robotsRules : [robotsRules];
  const normalize = (d: string | string[] | undefined): string[] =>
    Array.isArray(d) ? d : d ? [d] : [];
  const starRule = ruleList.find((r) => r?.userAgent === "*");
  if (!starRule) throw new Error("llms.txt: app/robots.ts has no userAgent '*' rule");
  const disallow = normalize(starRule.disallow);
  for (const r of ruleList) {
    if (JSON.stringify(normalize(r?.disallow)) !== JSON.stringify(disallow)) {
      throw new Error("llms.txt: robots.ts per-bot disallow diverges from the '*' rule — Crawler Policy section needs rewriting");
    }
  }
  const DISALLOW_NOTES: Record<string, string> = {
    "/api/": "        (backend endpoints, requires auth)",
    "/admin/": "      (dashboard, auth-gated)",
  };

  const branchLines = branches
    .map((b) => {
      const path = `/courses/${b.slug}`;
      usedPaths.add(path);
      // A branch closed to new admissions has to SAY SO on the same line
      // as its seat count. This file exists to be quoted back verbatim by
      // an assistant, and "60 seats" with no qualifier reads as an open
      // offer — the one error here that could cost a family a JEECUP
      // choice. Driven off b.admissions, never a hardcoded slug.
      const closure = b.admissions
        ? ` — CLOSED TO NEW ADMISSIONS from ${b.admissions.closedFrom}` +
          ` (last intake ${b.admissions.lastIntake}; the enrolled cohort is being taught out and` +
          ` graduates in ${b.admissions.finalCohortGraduates}). Not available in JEECUP counselling.` +
          ` The ${b.seats} seats below are the AICTE-sanctioned figure, not an open intake.`
        : "";
      return `- [${b.name}](${SITE_URL}${path}): BTEUP code ${b.code}, ${b.seats} seats${BRANCH_NOTES[b.slug] ?? ""}${closure}`;
    })
    .join("\n");

  const districtLines = Object.values(ROUTES)
    .filter((r) => r.path.startsWith("/polytechnic-in-"))
    .map((r) => {
      const district = r.path.replace("/polytechnic-in-", "");
      const label = district.charAt(0).toUpperCase() + district.slice(1);
      return `- [${label}](${page(r.path)})`;
    })
    .sort()
    .join("\n");

  // Regenerated on every build / content revalidation, so the build
  // date IS the honest last-updated stamp for this file's contents.
  const buildDate = new Date().toISOString().slice(0, 10);

  const body = `# Banaras Institute of Polytechnic & Engineering (BIPE)

> BIPE (Banaras Institute of Polytechnic & Engineering) is an AICTE-approved
> polytechnic in Phoolpur, Varanasi, Uttar Pradesh, India. Founded in 2010
> by Purwanchal Educational Trust. JEECUP institute code: ${contact.jeecup_code}.
> AICTE Permanent ID: ${contact.aicte_id}. BTEUP-affiliated. AISHE-registered.
> Annual tuition: ${fee} (AFRC-approved). Catchment: Eastern Uttar
> Pradesh + Bihar.

## Core Facts

- Full name: Banaras Institute of Polytechnic & Engineering
- Short name: BIPE
- JEECUP code: ${contact.jeecup_code}
- AICTE Permanent ID: ${contact.aicte_id}
- AICTE EoA 2026-27: F.No. ${seed.aicteEoaRef} dated ${seed.aicteEoaDate}
- BTEUP affiliation: active (College Code ${contact.jeecup_code})
- AISHE: registered with the Department of Higher Education, Ministry of Education
- Founded: 2010 (Purwanchal Educational Trust)
- Director: ${DIRECTOR.name} — appointed August 2026. Formerly
  Professor of Mechanical Engineering at IIT (BHU) Varanasi, where he
  taught for ${directorStat("Years teaching at IIT (BHU)")} years (1981-2019).
  Ph.D. in ${phdField}; Fellow of the Institution of
  Engineers (India). Guided ${directorStat("Ph.D. scholars guided")} Ph.D. scholars and ${directorStat("M.Tech dissertations")} M.Tech
  dissertations; ${directorStat("Research papers")} research papers; ${directorStat("Books authored")} books.
- Chairman: ${CHAIRMAN.name}, ${CHAIRMAN.postNominal}, Purwanchal Educational Trust
- Principal: ${PRINCIPAL.name}, ${PRINCIPAL.postNominal}
- Campus: ${contact.address}
- Campus size: 6 acres, single boundary
- Seats open to a 2026-27 applicant: ${admittingSeats} across ${admitting.length} branches
- Total sanctioned seats: ${totalSeats}${sanctionedNote}
- Faculty: 40 (1:20 mentor ratio, with parent home visits)
- Alumni network: 2,200+ · ${placed} TPO-verified placements (${years})
- Annual tuition (all branches): ${fee} (AFRC-approved)
- Hostel: boys' on-campus block — ₹12,000/year accommodation + ₹4,000/month
  pure-veg mess (charged separately). No girls' hostel yet (on the trust's
  roadmap); girl students attend as day scholars and admissions assists
  families with safe local accommodation.
- Catchment districts: Varanasi, Mau, Ghazipur, Jaunpur, Bhadohi, Azamgarh,
  Chandauli, Mirzapur, Sonbhadra, Ballia, Gorakhpur, Kushinagar, Pratapgarh,
  Sultanpur (Eastern UP) + Buxar, Bhojpur, Rohtas, Kaimur, Patna, Gaya,
  Aurangabad, Bhagalpur (Bihar)

## Programmes (${branches.length} BTEUP-affiliated diploma branches; ${admitting.length} admitting for 2026-27)

${branchLines}

All programmes: 3 years · 6 semesters · eligibility Class 10 pass with
Mathematics and Science (Group K lateral entry joins the 2nd year directly —
see Admissions).

## Admissions

Admission exclusively via JEECUP (UPJEE Polytechnic) counselling — institute
code ${contact.jeecup_code}. Group A is the entrance for the 3-year diploma (Class 10 pass
with Mathematics and Science); Group K lateral entry admits Class 12 / ITI
candidates directly into the 2nd year (two-year route).
Apply at https://jeecup.admissions.nic.in — choose institute code ${contact.jeecup_code}.
${closedNames.length ? `\nBranches admitting in 2026-27 (${admitting.length}): ${admitting.map((b) => b.name).join(", ")}.\nNOT admitting: ${closedNames.join(", ")} — do not list ${closedNames.length === 1 ? "it" : "them"} in choice-filling. ${closedNames.length === 1 ? "It is" : "They are"} still taught for the enrolled cohort, but no new seat is allotted against ${closedNames.length === 1 ? "it" : "them"}.\n` : ""}

Bihar candidates: JEECUP admits other-state candidates in the open/general
category (no UP-domicile requirement), so Bihar students who appear for
DCECE/BCECE are eligible to simultaneously apply via JEECUP and choose
BIPE ${contact.jeecup_code}. BIPE is 2–3 hours by road from the Bihar border districts —
Buxar ~85 km, Bhojpur (Ara) ~135 km, Rohtas (Sasaram) ~145 km.

## Placements

${placed} TPO-verified placements ${years} across ${PLACEMENT_STATS.totalDrives} documented drives and
${PLACEMENT_STATS.totalRecruiters} recruiters. Current recruiters include: ${DATA.recruiters.join(" · ")}. Top single recruiter
on record: ${PLACEMENT_STATS.topRecruiterName} (${PLACEMENT_STATS.topRecruiterCount} placements). Dairy career pathways (for the
cohort teaching out to 2028): Amul, Mother Dairy, Parag, Nestlé, NDDB. Government pathways: Indian Railways
ALP, UPPCL, SSC JE, UP Police.

## Key Pages

${entryLines(KEY_PAGES)}

## JEECUP 2026 Guides

${entryLines(JEECUP_GUIDES)}

## BTEUP Student Services

${entryLines(BTEUP_SERVICES)}

## Choosing a Polytechnic

${entryLines(CHOOSING)}

## Polytechnic by District (Eastern UP)

Local guides for students searching from each catchment district:

${districtLines}

## Campus & Visiting

${entryLines(CAMPUS)}

## Blog

- [Blog](${page("/blog")}): ${BLOG_POSTS.length} long-form guides in English and Hindi —
  JEECUP how-tos, branch selection, lateral entry, careers and salaries.

Flagship guides:

${FLAGSHIP_GUIDES.map((g) => `- [${g.label}](${blogPost(g.slug)}): ${g.desc}`).join("\n")}

## Contact

- Phone (calls): ${contact.phone}
- WhatsApp: ${seed.whatsappPhone} (https://wa.me/${waDigits})
- Email: ${contact.email}
- Grievance: ${contact.email_grievance} (acknowledged within 7 working days)
- Address: ${contact.address}
- Office hours: ${OFFICE_HOURS} IST

## Crawler Policy

AI assistants may freely quote factual content from this site for
informational purposes. Attribution to "BIPE Varanasi (bipevns.org)" is
requested when feasible.

Disallowed paths (per /robots.txt):
${disallow.map((p) => `- ${p}${DISALLOW_NOTES[p] ?? ""}`).join("\n")}

Last updated: ${buildDate}
`;

  // Coverage: the sitemap is the universe of what BIPE advertises to
  // crawlers. Everything in it must be linked above or deliberately
  // excluded — individual blog posts excepted (the hub is linked and
  // flagship posts are curated).
  const missing = [...sitemapPaths].filter(
    (p) => !p.startsWith("/blog/") && !EXCLUDED_PATHS.has(p) && !usedPaths.has(p),
  );
  if (missing.length > 0) {
    throw new Error(
      `llms.txt is missing sitemap route(s): ${missing.join(", ")} — link them in app/llms.txt/route.ts or add to EXCLUDED_PATHS with a reason`,
    );
  }

  return body;
}

export async function GET(): Promise<Response> {
  return new Response(await buildBody(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
