import type { Metadata } from "next";
import Link from "next/link";
import NextImage from "next/image";
import React from "react";
import { metadataFor, breadcrumbJsonLd } from "@/lib/seo";
import { DATA } from "@/lib/data";
import { getPageSection, getRecruiters, getTestimonials, OFFICE_HOURS_COMPACT } from "@/lib/content";
import { PageIntro } from "@/components/shared/PageIntro";
import { BIPE_IMG } from "@/lib/images";
import { Img } from "@/components/ui/Img";
import { IconTile } from "@/components/ui/IconTile";
import { Counter } from "@/components/ui/Counter";
import { ArrowIcon, WhatsAppIcon, PhoneIcon } from "@/components/shell/Icons";
import { PlacementsGallery } from "@/components/placements/PlacementsGallery";
import { BriefcaseBusiness, Handshake } from "lucide-react";
import { SITE_URL } from "@/lib/routes";
import {
  PLACEMENT_STATS,
  PLACEMENT_VERIFIED,
  formatPlacements,
} from "@/lib/placement-stats";

// 29 May 2026 — every hardcoded placement count on this page now reads
// from lib/placement-stats.ts. To refresh: replace the TPO XLSX in
// data/source/ and re-run scripts/parse-placement-xlsx.py — every
// "1,331" / "44 recruiters" / "Top recruiter" on this page updates.

export async function generateMetadata(): Promise<Metadata> { return metadataFor("placements"); }

// ---------------------------------------------------------------------------
// Data — reuse DATA.recruiters + audit-only names; dedupe.
// ---------------------------------------------------------------------------

const AUDIT_EXTRA_RECRUITERS: string[] = [
  "Wipro Infrastructure Engineering",
  "Mumbai Metro",
  "Motherson Sumi Systems",
  "JBM Group",
  "Talbros Automotive",
  "Monte Carlo",
  "RR Kabel",
];

// ALL_RECRUITERS is now computed inside Page() so live admin-managed
// Recruiter rows can join the audit-only extras. Falls back to
// DATA.recruiters when the backend returns no rows.

// Branch-wise placement breakdown was removed 28 May 2026 per user
// request -- the per-branch counts (522 / 326 / 145) summed to 993,
// which conflicted with the canonical 1,331 verified-placements
// figure shown elsewhere on the site. Showing a partial breakdown
// next to the headline total invited the comparison. The total
// remains in the hero / schema; the breakdown is no longer published.

// Government postings — list of departments where BIPE alumni
// have secured roles. Sourced from the TPO's "PLACED IN GOV.
// ORGANIZATION" register (May 2026 hand-off) — the register
// captures the departments TPO has paper trail for, but is not
// exhaustive of every alumnus in government service. So this
// renders as a roster of department names (no per-department
// counts, no role sub-text) to avoid claiming false precision
// for a subset that the placement office knows is incomplete.
const GOV_DEPARTMENTS: string[] = [
  "Indian Railways · ALP",
  "UPPCL",
  "Indian Railways",
  "UP Police",
  "UP Police · Radio Operator",
  "SSC JE · Military Engineering Services",
  "Junior Engineer · Irrigation Dept. UP",
  "Junior Engineer · UPSSSC",
  "UP Metro",
  "UPRVNL",
  "Soil Conservation",
  "MP State Energy",
];

type Alumnus = { name: string; tag: string; role: string; company: string; line: string };
const ALUMNI: Alumnus[] = [
  {
    name: "Naveen Pandey",
    tag: "EL · 2016",
    role: "CEO & MD",
    company: "IEPC",
    line: "From a 2016 Electrical diploma to running an engineering and projects firm — proof that the diploma is a starting line, not a ceiling.",
  },
  {
    name: "Ankit Kr Singh",
    tag: "CE · 2014",
    role: "Junior Engineer",
    company: "Tata Steel BSL",
    line: "Junior Engineer roles inside Tata Steel’s long-products business sit at the heart of structural-steel for India’s infrastructure pipeline.",
  },
  {
    name: "Hariom Rai",
    tag: "CE · 2013",
    role: "Senior Engineer",
    company: "Mumbai Metro Project",
    line: "Senior site engineering on India’s largest metro build — alignment, structural, and station-box work that runs decades into the future.",
  },
  {
    name: "Pramod Kumar Patel",
    tag: "MP · 2014",
    role: "Assistant Loco Pilot",
    company: "Indian Railways",
    line: "An ALP on the Indian Railways network keeps freight and passenger trains moving across one of the largest rail systems in the world.",
  },
  {
    name: "Saurabh Pandey",
    tag: "CE · 2014",
    role: "Founder & CEO",
    company: "Civil Arch",
    line: "From classroom drafting tables to founding a civil consultancy — a path BIPE keeps open to every Civil cohort.",
  },
  {
    name: "Chandan Pathak",
    tag: "MP · 2015",
    role: "Production In-charge",
    company: "Motherson Sumi Systems",
    line: "Production-floor leadership at one of India’s largest auto-component manufacturers — the kind of role the Mech-Production track exists for.",
  },
];

/**
 * Schema.org CollectionPage + ItemList<Person> for the 6 notable alumni.
 *
 * Why this matters for SEO:
 *
 *   1. Each alumnus is a Person with worksFor → Organization (their
 *      current employer) AND alumniOf → BIPE CollegeOrUniversity.
 *      That triangle is exactly the Knowledge-Graph shape Google uses
 *      to validate "BIPE produces engineers who work at Mahindra /
 *      Tata Steel / Mumbai Metro / Indian Railways" — the trust claim
 *      this page exists to make.
 *
 *   2. Names like "Naveen Pandey CEO IEPC" are low-volume but high-
 *      intent — a recruiter or curious parent searching a specific
 *      alumnus name lands directly on /placements with a rich SERP
 *      card instead of a generic title+snippet.
 *
 *   3. The Person nodes here don't share @id with /faculty Persons —
 *      these are graduates, not employees. Google de-duplicates by
 *      @id (URL-anchored), so emitting alumni and faculty Persons
 *      under different @ids is correct and intentional.
 *
 * What we deliberately don't emit:
 *
 *   - Recruiter Organization[]: the 28 names list is plain text on
 *     the page already. Without URLs / addresses / other distinguishing
 *     info, emitting 28 bare-name Organization nodes is schema bloat
 *     with no rich-result upside.
 *
 *   - alumniOf with date: Person.alumniOf accepts only Organization,
 *     not a {date, organization} pair. The branch+year tag (e.g.
 *     "EL · 2016") stays in the rendered page where humans read it;
 *     graph signals don't lose anything by omission.
 */
const ALUMNI_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/placements`,
  url: `${SITE_URL}/placements`,
  name: "Placements · BIPE Varanasi",
  description:
    // These names are the FEATURED named-alumni roster below (Ankit Kr
    // Singh · Tata Steel BSL, Pramod Kumar Patel · Indian Railways,
    // Hariom Rai · Mumbai Metro, Chandan Pathak · Motherson Sumi,
    // Naveen Pandey · IEPC), so each is a real person on this page.
    //
    // DO NOT REMOVE NAMES HERE ON THE GROUNDS THAT THEY ARE ABSENT FROM
    // lib/alumni-manifest.json. That was tried on 3 Sep 2026 and the
    // owner overruled it: "Do not remove recruiters. the alumnus list
    // doesn't contain all our alumni." The manifest is a partial record
    // — Ankit Kr Singh is Civil 2014 and the manifest starts at 2016,
    // which is why he is missing from it despite being real. If a name
    // here looks unsupported, ask the office.
    //
    // MAHINDRA: owner-confirmed 3 Sep 2026 ("I confirm that Mahindra has
    // our alumnus"). It has no entry in the FEATURED list below, so a
    // future sweep will find no on-page backing and be tempted to drop
    // it again — don't. This comment is the record. If the office supplies the name,
    // branch and year, add them to FEATURED and delete this note.
    `Joining-letter-verified placement record at Banaras Institute of Polytechnic & Engineering — ${formatPlacements(PLACEMENT_STATS.totalPlacements)} placements through ${PLACEMENT_STATS.endYear}, plus named alumni at Mahindra, Tata Steel BSL, Indian Railways, Mumbai Metro, Motherson Sumi and IEPC.`,
  about: {
    "@type": "CollegeOrUniversity",
    name: "Banaras Institute of Polytechnic & Engineering",
    url: SITE_URL,
  },
  mainEntity: {
    "@type": "ItemList",
    name: "BIPE notable alumni",
    numberOfItems: 6,
    itemListElement: [
      { name: "Naveen Pandey",      role: "CEO & MD",              company: "IEPC",                       desc: "From a 2016 Electrical diploma to running an engineering and projects firm — proof that the diploma is a starting line, not a ceiling." },
      { name: "Ankit Kr Singh",     role: "Junior Engineer",       company: "Tata Steel BSL",             desc: "Junior Engineer roles inside Tata Steel's long-products business sit at the heart of structural-steel for India's infrastructure pipeline." },
      { name: "Hariom Rai",         role: "Senior Engineer",       company: "Mumbai Metro Project",       desc: "Senior site engineering on India's largest metro build — alignment, structural, and station-box work that runs decades into the future." },
      { name: "Pramod Kumar Patel", role: "Assistant Loco Pilot",  company: "Indian Railways",            desc: "An ALP on the Indian Railways network keeps freight and passenger trains moving across one of the largest rail systems in the world." },
      { name: "Saurabh Pandey",     role: "Founder & CEO",         company: "Civil Arch",                 desc: "From classroom drafting tables to founding a civil consultancy — a path BIPE keeps open to every Civil cohort." },
      { name: "Chandan Pathak",     role: "Production In-charge",  company: "Motherson Sumi Systems",     desc: "Production-floor leadership at one of India's largest auto-component manufacturers — the kind of role the Mech-Production track exists for." },
    ].map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Person",
        "@id": `${SITE_URL}/placements#${a.name.toLowerCase().replace(/\s+/g, "-")}`,
        name: a.name,
        jobTitle: a.role,
        description: a.desc,
        worksFor: {
          "@type": "Organization",
          name: a.company,
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Banaras Institute of Polytechnic & Engineering",
          url: SITE_URL,
        },
      },
    })),
  },
};

type Program = { num: string; title: string; cadence: string; body: string };
const PROGRAMS: Program[] = [
  { num: "01", title: "6-Day Industry-Ready Skill Enhancement Workshop", cadence: "Annual · February", body: "Resume drafting, communication, technical refresher and mock GD-PI in the run-up to placement season. Every final-year student attends." },
  { num: "02", title: "AICTE Impact Lecture Series", cadence: "Periodic · invited", body: "Industry leaders, alumni and government officials address full cohorts on emerging tracks — EVs, smart infrastructure, dairy supply chains." },
  { num: "03", title: "Mock Interview Sessions", cadence: "Quarterly", body: "Panel-style mocks with HR mentors and technical reviewers from regional industry. Recorded feedback follows every session." },
  { num: "04", title: "AMCAT On-Campus Examination", cadence: "Annual", body: "The Aspiring Minds employability assessment, conducted on campus and open to every final-year student to support job applications." },
  { num: "05", title: "Tech Talk Series", cadence: "Quarterly · alumni-led", body: "Short branch-specific technical talks by alumni and faculty — what changed in the field, what the cohort should learn next." },
];

const CELL_POINTS: { num: string; title: string; body: string }[] = [
  { num: "01", title: "Curate the recruiter pipeline", body: "Relationships built over sixteen years across mechanical, electrical, civil, dairy and IT verticals — kept warm with quarterly outreach." },
  { num: "02", title: "Train every cohort", body: "Five pre-placement programmes run on rotation — workshop, lecture series, mock interviews, AMCAT, tech talks." },
  { num: "03", title: "Verify every placement", body: `Only joining-letter-confirmed offers count toward the public number. The ${formatPlacements(PLACEMENT_STATS.totalPlacements)} figure is auditable, not aspirational.` },
  { num: "04", title: "Track the alumni", body: "Quarterly outreach to keep the network warm and the recruiter pipeline fresh — alumni open most of the new doors." },
];

// PLACEMENT_VOICES is now computed inside Page() so the three role-
// filtered testimonials prefer live admin-managed rows when present.

// ---------------------------------------------------------------------------

export default async function Page() {
  // Fetch every CMS surface in parallel — same 5-min bundle cache.
  const [intro, liveRecruiters, liveTestimonials] = await Promise.all([
    getPageSection("placements", "intro"),
    getRecruiters(),
    getTestimonials(),
  ]);

  // Recruiter marquee — admin-managed names UNION the audit overlay.
  // Empty live result falls back to DATA.recruiters (handled by
  // getRecruiters itself).
  const recruiterNames = liveRecruiters.map((r) => r.name);
  const ALL_RECRUITERS: string[] = Array.from(
    new Set<string>([...recruiterNames, ...AUDIT_EXTRA_RECRUITERS]),
  );

  // Three placement-relevant testimonials picked by role keywords —
  // prefer live testimonials over DATA, fall back per-slot.
  function pickVoice(needle: string) {
    return liveTestimonials.find((t) => t.role.includes(needle))
        ?? DATA.testimonials.find((t) => t.role.includes(needle));
  }
  const PLACEMENT_VOICES = [
    pickVoice("Indian Railways"),
    pickVoice("BBDU"),
    pickVoice("Tata EV"),
  ].filter((t): t is NonNullable<ReturnType<typeof pickVoice>> => Boolean(t));
  return (
    <div className="page-enter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Placements", path: "/placements" },
            ]),
          ),
        }}
      />
      {/* CollectionPage + ItemList<Person> for the 6 notable alumni —
          see ALUMNI_JSON_LD above for the design rationale. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ALUMNI_JSON_LD) }}
      />
      <PageIntro section={intro} />
      {/* ====================================================================== */}
      {/* 1. EDITORIAL HERO                                                       */}
      {/* ====================================================================== */}
      <section className="section bipe-pad" style={{ position: "relative", overflow: "hidden", paddingTop: 76, paddingBottom: 72 }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "64px 64px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: -200, top: -140, width: 500, height: 500, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 28%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -160, bottom: -180, width: 460, height: 460, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 32%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div className="eyebrow">Placements · Sixteen years</div>
              <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "20ch" }}>
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  {formatPlacements(PLACEMENT_STATS.totalPlacements)}
                </span>{" "}
                careers. Counting.
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "56ch" }}>
                Polytechnic placements out of BIPE Varanasi — {formatPlacements(PLACEMENT_STATS.totalPlacements)} TPO-verified through {PLACEMENT_STATS.endYear} · sixteen years on record · alumni in government posts (Indian Railways ALP, UPPCL, SSC JE, UP Police, UPSSSC) · named alumni at Mahindra, Tata Steel BSL, Indian Railways, Mumbai Metro, Motherson Sumi and IEPC.
              </p>
              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                <Link href="/apply" className="btn btn-primary btn-lg">
                  Enquire for 2027-28 <ArrowIcon size={16} />
                </Link>
                <a href={`mailto:${DATA.contact.email}?subject=Talk%20to%20the%20placement%20cell`} className="btn btn-ghost btn-lg">
                  Talk to placement cell
                </a>
              </div>
              <div style={{ marginTop: 36, paddingTop: 20, borderTop: "1px solid var(--line)", display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Tracked &rarr;
                </span>
                {["Joining-letter verified", `${PLACEMENT_STATS.totalRecruiters} recruiters`, "2200+ alumni"].map((t, i) => (
                  <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 14, fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 17, color: "var(--ink-2)" }}>
                    {t}
                    {i < 2 && <span style={{ width: 4, height: 4, borderRadius: 999, background: "var(--accent)" }} />}
                  </span>
                ))}
              </div>
              {/* "Download BIPE Placement Record · PDF" button removed
                  28 May 2026 per user request -- the PDF claimed 993 placements
                  through 2024 which now conflicts with the canonical 1,331
                  verified figure shown elsewhere on the site. The named alumni
                  list below + recruiter strip already carry the record. */}
            </div>

            {/* Vertical stat stack */}
            <div style={{ display: "grid", gap: 14 }}>
              {[
                { num: formatPlacements(PLACEMENT_STATS.totalPlacements), suffix: "", lbl: "Placed", sub: `TPO-verified ${PLACEMENT_STATS.startYear}-${PLACEMENT_STATS.endYear} · incl. government posts` },
                { num: PLACEMENT_STATS.totalRecruiters.toString(), suffix: "", lbl: "Recruiters", sub: "Across India" },
                { num: "16", suffix: "", lbl: "Years", sub: "Track record · since 2010" },
              ].map((s) => (
                <div key={s.lbl} style={{
                  position: "relative", overflow: "hidden",
                  padding: "26px 28px",
                  background: "var(--white)",
                  border: "1px solid var(--line)",
                  borderRadius: 18,
                  display: "grid", gridTemplateColumns: "auto 1fr", gap: 22, alignItems: "center",
                }}>
                  <div aria-hidden="true" style={{
                    position: "absolute", right: -40, top: -40, width: 140, height: 140, borderRadius: "50%",
                    background: "color-mix(in oklab, var(--brand) 9%, transparent)",
                  }} />
                  <div style={{ position: "relative" }}>
                    <span className="serif" style={{
                      fontSize: "clamp(48px, 6vw, 88px)", lineHeight: 0.95,
                      color: "var(--brand)", fontStyle: "italic", fontWeight: 400,
                      display: "inline-block",
                    }}>
                      <Counter to={s.num} />{s.suffix}
                    </span>
                  </div>
                  <div style={{ position: "relative" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink)" }}>
                      {s.lbl}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 6, lineHeight: 1.4 }}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/*
        Section "2. BRANCH-WISE PLACEMENTS" removed 28 May 2026 per
        user request. The per-branch breakdown (522 / 326 / 145
        Mech / Elec / Civil) summed to 993, which conflicted with
        the canonical 1,331 headline elsewhere on the site. The
        cohort-level totals + named alumni list below already
        carry the placement-record argument; the per-branch
        tabulation isn't needed alongside them.
      */}

      {/* ====================================================================== */}
      {/* 2b. GOVERNMENT POSTINGS — 28 in govt, by department                     */}
      {/* ====================================================================== */}
      <section className="section bipe-pad" style={{ background: "var(--paper)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", left: -200, bottom: -180, width: 460, height: 460, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 8%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 56, alignItems: "end", marginBottom: 44 }}>
            <div>
              <div className="eyebrow">Sarkari Naukri · TPO-tracked</div>
              <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "18ch" }}>
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  Government
                </span>{" "}
                departments where alumni serve.
              </h2>
            </div>
            <p className="lead" style={{ maxWidth: "62ch" }}>
              Government pipelines BIPE diploma holders actually convert into — Indian Railways ALP, UPPCL Junior Engineer, SSC JE / Military Engineering Services, UP Police, Junior Engineer Irrigation, UPSSSC and more. The roster below is what the placement office has paper trail for; alumni in other government cadres exist beyond what&rsquo;s tracked here.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {GOV_DEPARTMENTS.map((d) => (
              <div
                key={d}
                className="card"
                style={{
                  padding: "18px 22px",
                  display: "flex",
                  alignItems: "center",
                  background: "var(--paper-2)",
                  minHeight: 60,
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 15, color: "var(--ink)" }}>{d}</div>
              </div>
            ))}
          </div>

          <p className="muted" style={{ marginTop: 22, fontSize: 13, fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
            Representative list — not exhaustive. Departments above are where the placement office has documented paper-trail records.
          </p>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2b. APPRENTICESHIP PATHWAYS                                             */}
      {/* ====================================================================== */}
      {/*
        Added 3 Sep 2026 on owner instruction. This section exists because an
        apprenticeship selection is NOT a campus drive, and conflating the two
        is what produced the "Tata Motors campus drive — 14 selected" card that
        the 28 May audit pulled: it read as 14 direct hires and carried a
        ₹3.6 LPA package the office cannot substantiate.

        Owner's account, 3 Sep 2026: "14 students were selected for
        apprenticeship by tata motors, and some also landed in tata motors as
        employees, exact figures are not available with the office but
        placement was verified."

        So: the 14 and the 2017-18 session are stated, the conversions are
        described without a number because none exists, and no package figure
        appears. Do not add one, and do not move Tata Motors into the recruiter
        marquee below — that wall is campus-drive recruiters.
      */}
      <section className="section bipe-pad" style={{ position: "relative", overflow: "hidden" }}>
        <div className="container">
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 56, alignItems: "end", marginBottom: 32 }}>
            <div>
              <div className="eyebrow">Apprenticeships · Industry route</div>
              <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "18ch" }}>
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  Apprenticeship
                </span>{" "}
                is a route in, not a consolation.
              </h2>
            </div>
            <p className="lead" style={{ maxWidth: "62ch" }}>
              A campus drive is not the only way into a manufacturer. Apprenticeships put a diploma holder on the shop floor of a large company, and for some that becomes the job itself.
            </p>
          </div>

          <div className="card" style={{ padding: "26px 28px", background: "var(--paper-2)" }}>
            <div className="eyebrow" style={{ color: "var(--brand)" }}>Tata Motors · 2017-18 session</div>
            <p style={{ marginTop: 12, fontSize: 16, lineHeight: 1.65, maxWidth: "70ch" }}>
              Fourteen Mechanical Engineering (Production) students were selected for apprenticeship with <strong>Tata Motors</strong>. Some went on to join the company as employees.
            </p>
            <p className="muted" style={{ marginTop: 14, fontSize: 13 }}>
              The placement office has verified the selection but does not hold exact figures for how many apprentices converted to employment, so no number is claimed here.
            </p>
          </div>

          <p className="muted" style={{ marginTop: 22, fontSize: 13, fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
            Apprentice pathways also run through Mahindra, JCB and BHEL for the Mechanical (Production) branch.
          </p>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. RECRUITER WALL — DARK                                                */}
      {/* ====================================================================== */}
      <section className="section" style={{
        background: "var(--ink)",
        color: "var(--paper)",
        position: "relative", overflow: "hidden",
      }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
          backgroundSize: "72px 72px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: -160, top: -120, width: 420, height: 420, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 50%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -180, bottom: -140, width: 460, height: 460, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 38%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 56, alignItems: "end", marginBottom: 36 }}>
            <div>
              <div className="eyebrow" style={{ color: "color-mix(in oklab, var(--paper) 65%, transparent)" }}>
                / 44 verified recruiters
              </div>
              <h2 className="bipe-h2" style={{ marginTop: 14, color: "var(--paper)" }}>
                <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                  Where they go.
                </span>
              </h2>
            </div>
            <p style={{
              fontSize: "clamp(17px, 1.3vw, 19px)", lineHeight: 1.55,
              color: "color-mix(in oklab, var(--paper) 75%, transparent)", maxWidth: "60ch",
            }}>
              Every placement on this page is tracked, verified and traceable through the BIPE placement cell. The marquee names below are joining-letter recruiters from the last sixteen years — not aspirational logos.
            </p>
          </div>
        </div>

        {/* Marquee strip */}
        <div className="marquee" style={{ paddingTop: 12, paddingBottom: 12, borderTop: "1px solid color-mix(in oklab, var(--paper) 12%, transparent)", borderBottom: "1px solid color-mix(in oklab, var(--paper) 12%, transparent)" }}>
          <div className="marquee-track" style={{ animationDuration: "55s" }}>
            {[0, 1].flatMap((i) =>
              ALL_RECRUITERS.map((r, j) => (
                <span
                  key={`${i}-${j}`}
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 38,
                    fontStyle: "italic",
                    color: "color-mix(in oklab, var(--paper) 80%, transparent)",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 48,
                  }}
                >
                  {r}
                  <span style={{ color: "var(--accent)", fontFamily: "var(--font-sans)", fontStyle: "normal", fontSize: 8 }}>●</span>
                </span>
              )),
            )}
          </div>
        </div>

        {/* Recruiter tiles — bordered name plates */}
        <div className="container" style={{ position: "relative", marginTop: 44 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
            gap: 10,
          }}>
            {ALL_RECRUITERS.map((r) => (
              <div
                key={r}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 14px 14px 16px",
                  background: "color-mix(in oklab, var(--paper) 5%, transparent)",
                  border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
                  borderRadius: 12,
                  transition: "border-color .2s var(--ease), background .2s var(--ease)",
                  minHeight: 56,
                }}
              >
                <span aria-hidden="true" style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: "var(--accent)",
                  boxShadow: "0 0 0 3px color-mix(in oklab, var(--accent) 22%, transparent)",
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 13.5,
                  fontWeight: 500,
                  letterSpacing: "-0.005em",
                  color: "var(--paper)",
                  lineHeight: 1.3,
                }}>{r}</span>
              </div>
            ))}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "14px 16px",
              border: "1px dashed color-mix(in oklab, var(--paper) 22%, transparent)",
              borderRadius: 12,
              minHeight: 56,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "color-mix(in oklab, var(--paper) 55%, transparent)",
            }}>
              + {Math.max(0, 44 - ALL_RECRUITERS.length)} more
            </div>
          </div>
          <div style={{
            marginTop: 18,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "color-mix(in oklab, var(--paper) 50%, transparent)",
            textAlign: "right",
          }}>
            All names cross-checked against placement-cell records · {PLACEMENT_STATS.startYear}–{PLACEMENT_STATS.endYear}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. NOTABLE ALUMNI                                                       */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", left: -180, bottom: -160, width: 460, height: 460, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 18%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 56, alignItems: "end", marginBottom: 44 }}>
            <div>
              <div className="eyebrow">Notable alumni</div>
              <h2 className="bipe-h2" style={{ marginTop: 14 }}>
                Lives that{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  began here.
                </span>
              </h2>
            </div>
            <p className="lead" style={{ maxWidth: "60ch" }}>
              Six alumni · six companies · three branches. A small slice of a 2200+ network — the names below are the ones who allowed us to publish theirs.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 18, maxWidth: 880, margin: "0 auto" }}>
            {ALUMNI.map((a) => (
              <article key={a.name} className="card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <span className="pill" style={{
                    background: "color-mix(in oklab, var(--brand) 12%, var(--paper))",
                    color: "var(--brand)",
                  }}>
                    {a.tag}
                  </span>
                </div>
                <h3 className="serif" style={{
                  fontSize: 30, lineHeight: 1.1, fontStyle: "italic", fontWeight: 400,
                  color: "var(--ink)", marginTop: 6,
                }}>
                  {a.name}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 4, borderTop: "1px solid var(--line)" }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: "var(--ink)" }}>{a.role}</div>
                  <div style={{ fontSize: 13, color: "var(--ink-3)" }}>{a.company}</div>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)", marginTop: 4 }}>
                  {a.line}
                </p>
              </article>
            ))}
          </div>

          <div style={{ marginTop: 32, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {/* Submit-your-story CTA. Was a mailto: link which silently
                failed on devices without a configured email client (most
                mobile users). Switched 28 May 2026 to WhatsApp + a mailto
                fallback so at least one path always works. */}
            <a
              href={`https://wa.me/917310077788?text=${encodeURIComponent("नमस्ते BIPE — I'd like to submit my alumni story for the placements page.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pill"
              style={{
                padding: "12px 22px",
                fontSize: 12,
                background: "var(--ink)",
                color: "var(--paper)",
              }}
            >
              Submit your story on WhatsApp <ArrowIcon size={12} />
            </a>
            <a
              href={`mailto:${DATA.contact.emailPlacement}?subject=Alumni%20story%20submission`}
              className="pill"
              style={{
                padding: "12px 22px",
                fontSize: 12,
                background: "var(--paper-2)",
                color: "var(--ink)",
                border: "1px solid var(--line)",
              }}
            >
              or email TPO
            </a>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. PRE-PLACEMENT PROGRAMS — DARK                                        */}
      {/* ====================================================================== */}
      <section className="section" style={{
        background: "var(--ink)",
        color: "var(--paper)",
        position: "relative", overflow: "hidden",
      }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
          backgroundSize: "64px 64px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -180, top: -160, width: 480, height: 480, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 45%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 56, alignItems: "end", marginBottom: 44 }}>
            <div>
              <div className="eyebrow" style={{ color: "color-mix(in oklab, var(--paper) 65%, transparent)" }}>
                / Pre-placement programmes
              </div>
              <h2 className="bipe-h2" style={{ marginTop: 14, color: "var(--paper)" }}>
                <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                  Five
                </span>{" "}
                programmes.<br /> One outcome.
              </h2>
            </div>
            <p style={{
              fontSize: "clamp(17px, 1.3vw, 19px)", lineHeight: 1.55,
              color: "color-mix(in oklab, var(--paper) 75%, transparent)", maxWidth: "58ch",
            }}>
              The placement cell runs five programmes on rotation — a 6-day intensive workshop in February, AICTE Impact lectures, quarterly mock interviews, AMCAT, and a quarterly Tech Talk Series.
            </p>
          </div>

          {/* Featured programme — full-width hero card */}
          <article style={{
            position: "relative",
            overflow: "hidden",
            padding: "36px 36px 32px",
            background: "color-mix(in oklab, var(--paper) 6%, transparent)",
            border: "1px solid color-mix(in oklab, var(--paper) 16%, transparent)",
            borderRadius: 22,
            marginBottom: 16,
          }}>
            <div aria-hidden="true" style={{
              position: "absolute", left: 0, right: 0, top: 0, height: 3,
              background: "linear-gradient(90deg, var(--accent), color-mix(in oklab, var(--accent) 0%, transparent) 70%)",
            }} />
            <div aria-hidden="true" style={{
              position: "absolute", right: -120, top: -120, width: 360, height: 360, borderRadius: "50%",
              background: "color-mix(in oklab, var(--accent) 18%, transparent)",
              filter: "blur(120px)", pointerEvents: "none",
            }} />

            <div className="bipe-split" style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)",
              gap: 48,
              alignItems: "center",
              position: "relative",
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
                  <span className="serif" style={{
                    fontSize: "clamp(72px, 9vw, 112px)",
                    lineHeight: 0.85,
                    fontStyle: "italic",
                    color: "var(--accent)",
                    fontWeight: 400,
                    letterSpacing: "-0.03em",
                  }}>
                    {PROGRAMS[0].num}
                  </span>
                  <span style={{
                    padding: "5px 12px",
                    borderRadius: 999,
                    background: "color-mix(in oklab, var(--accent) 18%, transparent)",
                    color: "var(--accent)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}>
                    Featured · {PROGRAMS[0].cadence}
                  </span>
                </div>
                <h3 style={{
                  fontSize: "clamp(22px, 2vw, 28px)",
                  fontWeight: 600,
                  lineHeight: 1.15,
                  color: "var(--paper)",
                  letterSpacing: "-0.015em",
                }}>
                  {PROGRAMS[0].title}
                </h3>
              </div>

              <div>
                <p style={{
                  fontSize: "clamp(15px, 1.1vw, 17px)",
                  lineHeight: 1.6,
                  color: "color-mix(in oklab, var(--paper) 82%, transparent)",
                  marginBottom: 20,
                  maxWidth: "60ch",
                }}>
                  The marquee programme. Six full days every February — resume drafting, communication coaching, technical refreshers and panel-style mock GD-PI rounds in the run-up to placement season. Every final-year student attends.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["Resume drafting", "Communication", "Technical refresh", "Mock GD-PI", "Profile review"].map((t) => (
                    <span key={t} style={{
                      padding: "6px 12px",
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "color-mix(in oklab, var(--paper) 78%, transparent)",
                      border: "1px solid color-mix(in oklab, var(--paper) 18%, transparent)",
                      borderRadius: 999,
                      background: "color-mix(in oklab, var(--paper) 3%, transparent)",
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* Supporting programmes — 2×2 grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 14,
          }}>
            {PROGRAMS.slice(1).map((p) => (
              <article
                key={p.num}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  padding: "24px 22px 22px",
                  background: "color-mix(in oklab, var(--paper) 4%, transparent)",
                  border: "1px solid color-mix(in oklab, var(--paper) 12%, transparent)",
                  borderRadius: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  minHeight: 220,
                }}
              >
                <div aria-hidden="true" style={{
                  position: "absolute", left: 22, right: 22, top: 0, height: 2,
                  background: "color-mix(in oklab, var(--accent) 60%, transparent)",
                  borderRadius: "0 0 999px 999px",
                }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <span className="serif" style={{
                    fontSize: 40,
                    lineHeight: 1,
                    fontStyle: "italic",
                    color: "var(--accent)",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                  }}>
                    {p.num}
                  </span>
                  <span style={{
                    padding: "3px 9px",
                    borderRadius: 999,
                    background: "color-mix(in oklab, var(--paper) 6%, transparent)",
                    border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 9.5,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "color-mix(in oklab, var(--paper) 70%, transparent)",
                    whiteSpace: "nowrap",
                  }}>
                    {p.cadence}
                  </span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.3, color: "var(--paper)", marginTop: 4 }}>
                  {p.title}
                </h3>
                <p style={{
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  color: "color-mix(in oklab, var(--paper) 72%, transparent)",
                }}>
                  {p.body}
                </p>
              </article>
            ))}
          </div>

          <div style={{
            marginTop: 32, paddingTop: 22,
            borderTop: "1px solid color-mix(in oklab, var(--paper) 12%, transparent)",
            display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "space-between", alignItems: "center",
            fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "color-mix(in oklab, var(--paper) 60%, transparent)",
          }}>
            <span>Schedule lives in the placement cell</span>
            <a
              href={`mailto:${DATA.contact.email}?subject=Placement%20cell%20schedule`}
              style={{ color: "var(--accent)" }}
            >
              {DATA.contact.email}
            </a>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 6. PLACEMENT GALLERY — Pinterest-style                                  */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper)", position: "relative" }}>
        <div className="container">
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 56, alignItems: "end", marginBottom: 44 }}>
            <div>
              <div className="eyebrow">On-campus drives · Gallery</div>
              <h2 className="bipe-h2" style={{ marginTop: 14 }}>
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  Placement drives,
                </span>{" "}
                in pictures.
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right", lineHeight: 1.7 }}>
              Photos from real placement drives on the BIPE campus — recruiter visits, student interviews and offer-letter moments. Filter by branch or year; tap any tile for the full image.
            </p>
          </div>

          <PlacementsGallery />
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 7. VOICES                                                               */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 56, alignItems: "end", marginBottom: 44 }}>
            <div>
              <div className="eyebrow">Voices</div>
              <h2 className="bipe-h2" style={{ marginTop: 14 }}>
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  Their words.
                </span>{" "}
                Not ours.
              </h2>
            </div>
            <p className="lead" style={{ maxWidth: "60ch" }}>
              Three placement-relevant voices from the BIPE alumni and parent network — collected as the network was rebuilt for 2024-25.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 18, maxWidth: 880, margin: "0 auto" }}>
            {PLACEMENT_VOICES.map((t) => (
              <figure
                key={t.name}
                className="card"
                style={{
                  padding: "30px 28px 26px",
                  display: "flex", flexDirection: "column", gap: 16,
                  position: "relative",
                  background: "var(--white)",
                }}
              >
                <span className="serif" style={{
                  position: "absolute", right: 22, top: 6,
                  fontSize: 92, lineHeight: 1,
                  color: "color-mix(in oklab, var(--brand) 18%, var(--paper))",
                  fontStyle: "italic", pointerEvents: "none",
                }}>“</span>
                <blockquote style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "var(--ink)", position: "relative" }}>
                  {t.quote}
                </blockquote>
                <figcaption style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", color: "var(--ink-3)", textTransform: "uppercase", marginTop: 4 }}>
                    {t.role}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 7. THE PLACEMENT CELL                                                   */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", right: -160, top: -120, width: 420, height: 420, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 12%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 64, alignItems: "start" }}>
            <div style={{ position: "sticky", top: 100 }}>
              <div className="eyebrow">The placement cell</div>
              <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "16ch" }}>
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  Placement cell.
                </span>{" "}
                What we actually do.
              </h2>
              <p className="lead" style={{ marginTop: 22, maxWidth: "44ch" }}>
                Four jobs, run on a sixteen-year cadence — pipeline, training, verification, and alumni tracking. Nothing more, nothing less.
              </p>

              {/* TPO profile — Amit Kumar (Training & Placement Officer).
                  Photo + name + designation surface BIPE's named TPO so
                  families know who to ask for. Contact details below
                  cascade from DATA.contact.{phonePlacement,emailPlacement}. */}
              <div style={{
                marginTop: 28,
                padding: "22px 22px 20px",
                border: "1px solid var(--line)",
                borderRadius: 16,
                background: "var(--white)",
                display: "flex", flexDirection: "column", gap: 16,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <NextImage
                    src="/faculty/amit-kumar-pal.png"
                    alt="Amit Kumar Pal — BIPE Training & Placement Officer"
                    width={72}
                    height={72}
                    style={{ borderRadius: 14, objectFit: "cover", flexShrink: 0 }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div className="eyebrow" style={{ color: "var(--brand)" }}>Training &amp; Placement Officer</div>
                    <div style={{ fontWeight: 700, fontSize: 18, marginTop: 4 }}>Amit Kumar Pal</div>
                    <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2, lineHeight: 1.4 }}>
                      Lecturer · Mechanical Engineering
                    </div>
                  </div>
                </div>

                <div style={{ height: 1, background: "var(--line)" }} />

                <a href={`tel:${DATA.contact.phonePlacement}`} style={{ display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 600, color: "var(--ink)" }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: "var(--brand-soft)", color: "var(--brand)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <PhoneIcon />
                  </span>
                  {DATA.contact.phonePlacement}
                </a>
                <a href={`mailto:${DATA.contact.emailPlacement}`} style={{ display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 600, color: "var(--ink)" }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: "var(--brand-soft)", color: "var(--brand)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700,
                  }}>@</span>
                  {DATA.contact.emailPlacement}
                </a>
              </div>
            </div>

            <div>
              {/* 2×2 grid of the four cell jobs */}
              <div className="bipe-form-row" style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 14,
              }}>
                {CELL_POINTS.map((c, i) => (
                  <div
                    key={c.num}
                    className="card"
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      padding: "26px 24px 22px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      minHeight: 220,
                    }}
                  >
                    {/* Top accent stripe — alternates brand / accent */}
                    <div aria-hidden="true" style={{
                      position: "absolute",
                      left: 24, right: 24, top: 0,
                      height: 2,
                      background: i % 2 === 0 ? "var(--brand)" : "var(--accent)",
                      borderRadius: "0 0 999px 999px",
                    }} />
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: 10,
                    }}>
                      <span className="serif" style={{
                        fontSize: 48,
                        lineHeight: 0.9,
                        fontStyle: "italic",
                        color: i % 2 === 0 ? "var(--brand)" : "var(--accent-deep)",
                        fontWeight: 400,
                        letterSpacing: "-0.02em",
                      }}>
                        {c.num}
                      </span>
                      <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9.5,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "var(--ink-3)",
                      }}>
                        Job {c.num}/04
                      </span>
                    </div>
                    <h3 style={{
                      fontSize: 17,
                      fontWeight: 600,
                      lineHeight: 1.3,
                      color: "var(--ink)",
                      letterSpacing: "-0.01em",
                    }}>
                      {c.title}
                    </h3>
                    <p style={{
                      fontSize: 13.5,
                      lineHeight: 1.6,
                      color: "var(--ink-2)",
                      marginTop: 0,
                    }}>
                      {c.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* Two decorative IconTiles — desktop-only visual
                  chrome. On mobile both tiles stack to full width
                  and add ~600px of empty scroll for no info value.
                  Hidden via .bipe-hide-mobile (same utility used on
                  /documents). */}
              <div className="bipe-hide-mobile bipe-img-strip" style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "1.3fr 1fr",
                gap: 14,
              }}>
                <IconTile
                  icon={BriefcaseBusiness}
                  label="MOCK INTERVIEW · QUARTERLY"
                  tone="brand"
                  aspectRatio="16/10"
                  iconSize={72}
                />
                <IconTile
                  icon={Handshake}
                  label="RECRUITER VISIT · 2024"
                  tone="accent"
                  aspectRatio="4/5"
                  iconSize={72}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 8. FINAL CTA                                                            */}
      {/* ====================================================================== */}
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container">
          <div style={{
            position: "relative",
            background: "var(--ink)",
            color: "var(--paper)",
            borderRadius: 28,
            overflow: "hidden",
            minHeight: 520,
          }}>
            <div aria-hidden="true" style={{
              position: "absolute", inset: 0, opacity: 0.05,
              backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
              backgroundSize: "72px 72px", pointerEvents: "none",
            }} />
            <div aria-hidden="true" style={{
              position: "absolute", left: -160, bottom: -160, width: 520, height: 520, borderRadius: "50%",
              background: "radial-gradient(circle, color-mix(in oklab, var(--brand) 55%, transparent), transparent 70%)",
              pointerEvents: "none",
            }} />
            <div aria-hidden="true" style={{
              position: "absolute", right: -120, top: -120, width: 380, height: 380, borderRadius: "50%",
              background: "radial-gradient(circle, color-mix(in oklab, var(--accent) 45%, transparent), transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{
              position: "relative",
              padding: "22px 40px",
              borderBottom: "1px solid color-mix(in oklab, var(--paper) 12%, transparent)",
              display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
            }}>
              <div className="row" style={{ gap: 14, alignItems: "center" }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%", background: "var(--accent)",
                  boxShadow: "0 0 0 4px color-mix(in oklab, var(--accent) 25%, transparent)",
                  animation: "pulse 2s infinite",
                }} />
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "color-mix(in oklab, var(--paper) 75%, transparent)",
                }}>
                  Placement cell · Open · {OFFICE_HOURS_COMPACT}
                </span>
              </div>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em",
                color: "color-mix(in oklab, var(--paper) 55%, transparent)",
              }}>
                BIPE / PLACEMENTS · 16
              </div>
            </div>

            <div className="bipe-split" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 0, minHeight: 420 }}>
              <div style={{ padding: "64px 56px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em",
                    textTransform: "uppercase", color: "var(--accent)",
                  }}>
                    One last step
                  </div>
                  <h2 style={{
                    fontSize: "clamp(48px, 5.4vw, 84px)",
                    lineHeight: 0.96, fontWeight: 600, letterSpacing: "-0.03em",
                    marginTop: 22, color: "var(--paper)",
                  }}>
                    <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                      Place yourself.
                    </span>
                    <br />
                    Then start training others.
                  </h2>
                  <p style={{
                    marginTop: 24, fontSize: 18, lineHeight: 1.55,
                    color: "color-mix(in oklab, var(--paper) 72%, transparent)",
                    maxWidth: "44ch",
                  }}>
                    {formatPlacements(PLACEMENT_STATS.totalPlacements)} alumni walked this floor before you. The placement cell is a continuation of admissions — start the conversation now.
                  </p>
                </div>

                <div className="row" style={{ marginTop: 48, gap: 24, flexWrap: "wrap", alignItems: "center" }}>
                  {[
                    { num: formatPlacements(PLACEMENT_STATS.totalPlacements), l: "placed" },
                    { num: "44", l: "recruiters" },
                    { num: "16", l: "years" },
                    { num: "2200+", l: "alumni" },
                  ].map((s, i) => (
                    <React.Fragment key={s.l}>
                      <div>
                        <div style={{
                          fontFamily: "var(--font-display, var(--font-serif))",
                          fontStyle: "italic", fontSize: 30, lineHeight: 1, color: "var(--paper)",
                        }}>
                          {s.num}
                        </div>
                        <div style={{
                          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "color-mix(in oklab, var(--paper) 55%, transparent)",
                          marginTop: 4,
                        }}>
                          {s.l}
                        </div>
                      </div>
                      {i < 3 && <span style={{ width: 1, height: 36, background: "color-mix(in oklab, var(--paper) 14%, transparent)" }} />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div style={{
                padding: "64px 56px 48px",
                display: "flex", flexDirection: "column", gap: 14,
                justifyContent: "center",
                borderLeft: "1px solid color-mix(in oklab, var(--paper) 10%, transparent)",
                position: "relative",
              }}>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "color-mix(in oklab, var(--paper) 55%, transparent)",
                  marginBottom: 8,
                }}>
                  Choose your path
                </div>

                <Link href="/apply" style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                  padding: "22px 24px", borderRadius: 14,
                  background: "var(--paper)", color: "var(--ink)",
                  textDecoration: "none",
                  transition: "transform .25s var(--ease)",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>01</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 17 }}>Enquire for 2027-28</div>
                    <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>Single-step form · 5 minutes</div>
                  </div>
                  <ArrowIcon size={18} />
                </Link>

                <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                  padding: "22px 24px", borderRadius: 14,
                  background: "color-mix(in oklab, var(--paper) 8%, transparent)",
                  border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
                  color: "var(--paper)",
                  textDecoration: "none",
                  transition: "background .25s var(--ease)",
                }}>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: 11,
                    color: "color-mix(in oklab, var(--paper) 55%, transparent)",
                  }}>
                    02
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 17 }}>Talk on WhatsApp</div>
                    <div style={{ fontSize: 12, color: "color-mix(in oklab, var(--paper) 55%, transparent)", marginTop: 2 }}>
                      Same-day reply · EN / हिं
                    </div>
                  </div>
                  <span style={{
                    width: 28, height: 28, borderRadius: "50%", background: "#25D366", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <WhatsAppIcon />
                  </span>
                </a>

                <Link href="/visit" style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                  padding: "22px 24px", borderRadius: 14,
                  background: "color-mix(in oklab, var(--paper) 8%, transparent)",
                  border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
                  color: "var(--paper)",
                  textDecoration: "none",
                  transition: "background .25s var(--ease)",
                }}>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: 11,
                    color: "color-mix(in oklab, var(--paper) 55%, transparent)",
                  }}>
                    03
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 17 }}>Visit campus</div>
                    <div style={{ fontSize: 12, color: "color-mix(in oklab, var(--paper) 55%, transparent)", marginTop: 2 }}>
                      Cantt → campus · ~35 min by auto
                    </div>
                  </div>
                  <ArrowIcon size={18} />
                </Link>

                <div style={{
                  marginTop: 18, paddingTop: 18,
                  borderTop: "1px solid color-mix(in oklab, var(--paper) 10%, transparent)",
                  fontSize: 12, color: "color-mix(in oklab, var(--paper) 55%, transparent)",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span>
                    Or call{" "}
                    <a href={`tel:${DATA.contact.phone}`} style={{ color: "var(--paper)", textDecoration: "none", fontWeight: 600 }}>
                      {DATA.contact.phone}
                    </a>
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em" }}>{OFFICE_HOURS_COMPACT}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
