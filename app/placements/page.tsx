import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metadataFor, breadcrumbJsonLd } from "@/lib/seo";
import { DATA } from "@/lib/data";
import { getPageSection, getRecruiters, getTestimonials } from "@/lib/content";
import { PageIntro } from "@/components/shared/PageIntro";
import { BIPE_IMG } from "@/lib/images";
import { Img } from "@/components/ui/Img";
import { IconTile } from "@/components/ui/IconTile";
import { Counter } from "@/components/ui/Counter";
import { ArrowIcon, WhatsAppIcon, PhoneIcon } from "@/components/shell/Icons";
import { PlacementsGallery } from "@/components/placements/PlacementsGallery";
import { BriefcaseBusiness, Handshake } from "lucide-react";

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

type Branch = { code: string; name: string; count: number; note: string };
const BRANCH_COUNTS: Branch[] = [
  { code: "MP", name: "Mechanical Engineering (Production)", count: 522, note: "Largest cohort. Longest pipeline — Mahindra, Tata Steel, JCB, Motherson, JBM." },
  { code: "EE", name: "Electrical Engineering", count: 326, note: "RRB JE / SSC JE pathway · UPPCL, Tata Power, Indian Railways, Mumbai Metro." },
  { code: "CE", name: "Civil Engineering", count: 145, note: "Smart Cities, Bharatmala, Kashi corridor — site engineering and JE roles." },
];
const MAX_BRANCH_COUNT = BRANCH_COUNTS[0].count;
const SUM_TABULATED = BRANCH_COUNTS.reduce((a, b) => a + b.count, 0);

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
  { num: "02", title: "Train every cohort", body: "Six pre-placement programmes run on rotation — workshop, lecture series, mock interviews, AMCAT, tech talks." },
  { num: "03", title: "Verify every placement", body: "Only joining-letter-confirmed offers count toward the public number. The 993+ figure is auditable, not aspirational." },
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
                  One thousand
                </span>{" "}
                careers. Counting.
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "56ch" }}>
                Polytechnic placements out of BIPE Varanasi — 993+ verified through 2024 across 44 recruiters · sixteen years on record · alumni at Mahindra, Tata Steel, BEL, Indian Railways, Mumbai Metro, JCB and beyond.
              </p>
              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                <Link href="/apply" className="btn btn-primary btn-lg">
                  Apply for 2026-27 <ArrowIcon size={16} />
                </Link>
                <a href={`mailto:${DATA.contact.email}?subject=Talk%20to%20the%20placement%20cell`} className="btn btn-ghost btn-lg">
                  Talk to placement cell
                </a>
              </div>
              <div style={{ marginTop: 36, paddingTop: 20, borderTop: "1px solid var(--line)", display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Tracked &rarr;
                </span>
                {["Joining-letter verified", "44 recruiters", "1,000+ alumni"].map((t, i) => (
                  <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 14, fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 17, color: "var(--ink-2)" }}>
                    {t}
                    {i < 2 && <span style={{ width: 4, height: 4, borderRadius: 999, background: "var(--accent)" }} />}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 20 }}>
                <a
                  href="/placement-record-2024.pdf"
                  target="_blank"
                  rel="noopener"
                  download
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 22px",
                    borderRadius: 12,
                    background: "var(--brand)",
                    color: "var(--paper)",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>
                    Download BIPE Placement Record &middot; PDF
                    <span style={{ marginLeft: 10, opacity: 0.7, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Through 2024 &middot; 7 pages
                    </span>
                  </span>
                </a>
              </div>
            </div>

            {/* Vertical stat stack */}
            <div style={{ display: "grid", gap: 14 }}>
              {[
                { num: "993", suffix: "+", lbl: "Placed", sub: "Verified through 2024" },
                { num: "44", suffix: "", lbl: "Recruiters", sub: "Across India" },
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

      {/* ====================================================================== */}
      {/* 2. BRANCH-WISE PLACEMENTS                                               */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", right: -180, top: -120, width: 420, height: 420, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 12%, transparent)",
          filter: "blur(110px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 56, alignItems: "end", marginBottom: 44 }}>
            <div>
              <div className="eyebrow">Branch-wise · verified through 2024</div>
              <h2 className="bipe-h2" style={{ marginTop: 14 }}>
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  Where they came from.
                </span>
              </h2>
            </div>
            <p className="lead" style={{ maxWidth: "60ch" }}>
              Three diploma branches account for the bulk of BIPE&rsquo;s tabulated placements. Mech-Production carries the longest pipeline; Electrical and Civil follow with their own recruiter ecologies. Counts are joining-letter-verified.
            </p>
          </div>

          <div style={{ display: "grid", gap: 18 }}>
            {BRANCH_COUNTS.map((b, i) => {
              const pct = Math.round((b.count / MAX_BRANCH_COUNT) * 100);
              return (
                <div
                  key={b.code}
                  className="card"
                  style={{
                    padding: "28px 32px",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 32,
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14, minWidth: 240 }}>
                    <span className="serif" style={{ fontSize: 32, color: "var(--ink-3)", fontStyle: "italic" }}>
                      0{i + 1}
                    </span>
                    <div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--brand)" }}>
                        {b.code}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 18, marginTop: 4 }}>{b.name}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{
                      position: "relative",
                      height: 14,
                      borderRadius: 999,
                      background: "var(--paper)",
                      border: "1px solid var(--line)",
                      overflow: "hidden",
                    }}>
                      <div style={{
                        position: "absolute", inset: 0,
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, var(--brand), color-mix(in oklab, var(--brand) 70%, var(--accent)))`,
                        borderRadius: 999,
                      }} />
                    </div>
                    <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.5, maxWidth: "70ch" }}>
                      {b.note}
                    </div>
                  </div>

                  <div style={{ textAlign: "right", minWidth: 130 }}>
                    <div className="serif" style={{
                      fontSize: "clamp(48px, 5.4vw, 76px)", lineHeight: 0.95,
                      color: "var(--brand)", fontStyle: "italic", fontWeight: 400,
                    }}>
                      <Counter to={String(b.count)} />
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-3)", marginTop: 4 }}>
                      Placed
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="muted" style={{ marginTop: 22, fontSize: 13, fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
            Tabulated above: {SUM_TABULATED}. Other branches contribute the remaining {Math.max(0, 993 - SUM_TABULATED)}+ — figures verified as records mature.
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
            All names cross-checked against placement-cell records · 2010–2024
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
              Six alumni · five companies · three branches. A small slice of a 1,000+ network — the names below are the ones who allowed us to publish theirs.
            </p>
          </div>

          <div className="bipe-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
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

          <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
            <a
              href={`mailto:${DATA.contact.email}?subject=Alumni%20story%20submission`}
              className="pill"
              style={{
                padding: "12px 22px",
                fontSize: 12,
                background: "var(--ink)",
                color: "var(--paper)",
              }}
            >
              Submit your story <ArrowIcon size={12} />
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
              Photos from real placement drives on the BIPE campus &mdash; recruiter visits, student interviews and offer-letter moments. Filter by branch or year; tap any tile for the full image.
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

          <div className="bipe-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
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

              <div style={{
                marginTop: 28,
                padding: "18px 22px",
                border: "1px solid var(--line)",
                borderRadius: 14,
                background: "var(--white)",
                display: "flex", flexDirection: "column", gap: 10,
              }}>
                <div className="eyebrow" style={{ color: "var(--brand)" }}>Reach the cell</div>
                <a href={`mailto:${DATA.contact.email}`} style={{ display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 600, color: "var(--ink)" }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: "var(--brand-soft)", color: "var(--brand)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700,
                  }}>@</span>
                  {DATA.contact.email}
                </a>
                <a href={`tel:${DATA.contact.phone}`} style={{ display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 600, color: "var(--ink)" }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: "var(--brand-soft)", color: "var(--brand)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <PhoneIcon />
                  </span>
                  {DATA.contact.phone}
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

              {/* Two images below, integrated as one cohesive strip */}
              <div className="bipe-img-strip" style={{
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
                  Placement cell · Open · Mon–Sat 9–6
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
                    993+ alumni walked this floor before you. The placement cell is a continuation of admissions — start the conversation now.
                  </p>
                </div>

                <div className="row" style={{ marginTop: 48, gap: 24, flexWrap: "wrap", alignItems: "center" }}>
                  {[
                    { num: "993+", l: "placed" },
                    { num: "44", l: "recruiters" },
                    { num: "16", l: "years" },
                    { num: "1,000+", l: "alumni" },
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
                    <div style={{ fontWeight: 600, fontSize: 17 }}>Apply for 2026-27</div>
                    <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>4-step form · 5 minutes</div>
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
                      Free shuttle · Varanasi Cantt
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
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em" }}>MON–SAT · 9–6</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
