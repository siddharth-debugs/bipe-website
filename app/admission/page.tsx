import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metadataFor, breadcrumbJsonLd } from "@/lib/seo";
import { DATA } from "@/lib/data";
import { getPageSection } from "@/lib/content";
import { PageIntro } from "@/components/shared/PageIntro";
import { BIPE_IMG } from "@/lib/images";
import { Img } from "@/components/ui/Img";
import { Counter } from "@/components/ui/Counter";
import { ArrowIcon, WhatsAppIcon, PhoneIcon } from "@/components/shell/Icons";
import { PLACEMENT_STATS, formatPlacements } from "@/lib/placement-stats";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("admission"); }

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Register on JEECUP",
    body: "Visit jeecup.admissions.nic.in and create your candidate profile. The BIPE college code is 4455 — keep it ready for the choice-filling step.",
  },
  {
    n: "02",
    title: "Take the JEECUP exam",
    body: "Computer-based test on Class-10 Mathematics & Science. Group A is the entrance for the 3-year BTEUP diploma — multiple shifts, results in late May.",
  },
  {
    n: "03",
    title: "Prepare your documents",
    body: "Originals plus 2 self-attested photocopies. JEECUP rank card, 10th marksheet, transfer & character certificates, Aadhaar, photographs, and category proofs.",
  },
  {
    n: "04",
    title: "Attend counselling",
    body: "List BIPE code 4455 with your branch preferences in priority order. Choice-filling decides which seat the system can offer you.",
  },
  {
    n: "05",
    title: "Pay tuition fees",
    body: "Annual tuition ₹30,150 — AFRC-approved, identical for all 5 branches. UPI · NetBanking · DD · or cash at the Accounts Office.",
  },
  {
    n: "06",
    title: "Begin classes — 15 July 2026",
    body: "Orientation, mentor allocation, hostel allotment. Three years that change your career trajectory and your family's expectations.",
  },
];

type CalEntry = { month: string; day?: string; year: string; title: string; sub: string };
const DATES: CalEntry[] = [
  { month: "JAN", year: "2026",                title: "JEECUP application opens",  sub: "Online · jeecup.admissions.nic.in" },
  { month: "MAY", day: "20", year: "2026",     title: "Application closes",        sub: "Extended deadline · no further extension" },
  { month: "JUN", day: "02-09", year: "2026", title: "Entrance exam",             sub: "CBT · multiple shifts across UP" },
  { month: "JUN", year: "2026",                title: "Results + counselling",     sub: "Results mid-June · 7-round counselling opens" },
  { month: "JUL", day: "15", year: "2026",     title: "Session begins",            sub: "Orientation week at BIPE" },
  { month: "AUG", year: "2026",                title: "Final counselling rounds",  sub: "Late admits via Rounds 5-7 · spot round" },
];

const REASONS: { roman: string; title: string; body: string; metric: string; metricLabel: string }[] = [
  {
    roman: "i",
    title: "AFRC-approved fees, no capitation",
    body: "₹30,150 a year, identical for all 5 branches. Every component itemised. Receipts for every rupee. No donation, no surprise charge at any semester.",
    metric: "₹30,150",
    metricLabel: "annual · AFRC",
  },
  {
    roman: "ii",
    title: "1:20 mentorship with home visits",
    body: "Each faculty mentor takes 20 students through the full diploma — including periodic visits to parents in Mau, Ghazipur, Azamgarh and beyond.",
    metric: "1:20",
    metricLabel: "mentor : student",
  },
  {
    roman: "iii",
    title: "Rare Dairy Engineering",
    body: "Offered by fewer than 1.1% of UP polytechnics. Alumni placed at Amul, Mother Dairy, Parag, Nestlé and the NDDB across the country.",
    metric: "<1.1%",
    metricLabel: "of UP polytechnics",
  },
  {
    roman: "iv",
    title: `${formatPlacements(PLACEMENT_STATS.totalPlacements)} alumni placed`,
    body: "Sixteen years in. Mahindra, Tata Steel, BEL, Indian Railways, Mumbai Metro, JCB, Asian Paints — verifiable placement records, not just photographs.",
    metric: formatPlacements(PLACEMENT_STATS.totalPlacements),
    metricLabel: "alumni placed",
  },
];

export default async function Page() {
  const intro = await getPageSection("admission", "intro");
  return (
    <div className="page-enter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Admission", path: "/admission" },
            ]),
          ),
        }}
      />
      <PageIntro section={intro} />
      {/* ====================================================================== */}
      {/* 1. EDITORIAL HERO                                                       */}
      {/* ====================================================================== */}
      <section className="section bipe-pad" style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 72 }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "64px 64px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: -180, top: -120, width: 460, height: 460, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 26%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -160, bottom: -160, width: 420, height: 420, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 30%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div className="eyebrow">Admission · Session 2026-27</div>
              <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "18ch" }}>
                Admission is{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  single-track.
                </span>{" "}
                JEECUP code 4455.
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "54ch" }}>
                BIPE is an AICTE-approved polytechnic in Varanasi, BTEUP-affiliated. Polytechnic admissions in Varanasi are exclusively through JEECUP counselling under college code <strong style={{ color: "var(--brand)" }}>4455</strong>. AFRC-published tuition from <strong>₹30,150 / year</strong> — identical for all 5 branches.
              </p>
              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                {/* Bilingual CTAs — Hindi sub-label under English action.
                    Hindi-medium families see "this site is for me" at
                    the exact moment they're about to act. */}
                <Link href="/apply" className="btn btn-primary btn-lg">
                  Begin application <ArrowIcon size={16} />
                  <span lang="hi" style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.88, marginTop: 2 }}>
                    आवेदन शुरू करें
                  </span>
                </Link>
                <Link href="/visit" className="btn btn-ghost btn-lg">
                  Book a campus visit
                  <span lang="hi" style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.85, marginTop: 2 }}>
                    कैंपस विज़िट बुक करें
                  </span>
                </Link>
                <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                  <WhatsAppIcon /> WhatsApp
                  <span lang="hi" style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.88, marginTop: 2 }}>
                    व्हाट्सऐप पर बात करें
                  </span>
                </a>
              </div>

              <div style={{ marginTop: 36, paddingTop: 20, borderTop: "1px solid var(--line)", display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Trust marks &rarr;
                </span>
                {["AICTE", "BTEUP 4455", "AFRC", "AISHE"].map((t, i) => (
                  <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 14, fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 17, color: "var(--ink-2)" }}>
                    {t}
                    {i < 3 && <span style={{ width: 4, height: 4, borderRadius: 999, background: "var(--accent)" }} />}
                  </span>
                ))}
              </div>
            </div>

            {/* Key dates cluster */}
            <div style={{
              position: "relative",
              borderRadius: 24, overflow: "hidden",
              border: "1px solid var(--line)",
              background: "color-mix(in oklab, var(--brand) 8%, var(--white))",
              padding: 28,
            }}>
              <div aria-hidden="true" style={{
                position: "absolute", right: -80, top: -80, width: 220, height: 220, borderRadius: "50%",
                background: "color-mix(in oklab, var(--brand) 26%, transparent)",
                filter: "blur(80px)", pointerEvents: "none",
              }} />
              <div style={{ position: "relative" }}>
                <div className="eyebrow" style={{ color: "var(--brand)" }}>Three dates · 2026-27</div>
                <h3 className="bipe-h3" style={{ marginTop: 8, fontSize: 20 }}>Plan around these.</h3>
                <div style={{ marginTop: 22, display: "grid", gap: 14 }}>
                  {[
                    ["01", "Jan 2026", "Application opens", "Registration · closed 20 May"],
                    ["02", "Jun 2026", "Entrance exam", "02–09 June · JEECUP Group A · CBT"],
                    ["03", "15 Jul", "Classes begin", "Session start · 2026-27"],
                  ].map(([n, d, t, sub]) => (
                    <div key={n} style={{
                      display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                      padding: "16px 18px",
                      background: "var(--white)",
                      border: "1px solid var(--line)", borderRadius: 14,
                    }}>
                      <span className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 32, color: "var(--brand)", lineHeight: 1, width: 32, textAlign: "center" }}>
                        {n}
                      </span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{t}</div>
                        <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{sub}</div>
                      </div>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "var(--brand)", letterSpacing: "0.04em" }}>
                        {d}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  <span>Code 4455 · BIPE</span>
                  <span>Phoolpur · Varanasi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. SIX-STEP PROCESS                                                     */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", left: -120, top: -120, width: 320, height: 320, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 18%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 48, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">The path</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                Six steps from{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  registration
                </span>{" "}
                to first day.
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              The state-wide JEECUP route is the only legitimate way into a BTEUP polytechnic. We have broken it into six checkpoints — none of them surprising.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 18, maxWidth: 880, margin: "0 auto" }}>
            {STEPS.map((s) => (
              <article key={s.n} className="card" style={{ padding: 28, position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{
                  position: "absolute", right: -40, top: -40, width: 140, height: 140, borderRadius: "50%",
                  background: "color-mix(in oklab, var(--brand) 8%, transparent)",
                  pointerEvents: "none",
                }} />
                <div style={{ position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                    <span className="serif" style={{
                      fontStyle: "italic", fontWeight: 400,
                      fontSize: 64, lineHeight: 0.85,
                      color: "var(--brand)", letterSpacing: "-0.02em",
                    }}>
                      {s.n}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                      Step {s.n}
                    </span>
                  </div>
                  <h3 className="bipe-h3" style={{ marginTop: 12, fontSize: 19 }}>{s.title}</h3>
                  <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.65 }}>{s.body}</p>
                </div>
              </article>
            ))}
          </div>

          <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-end" }}>
            <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "12px 18px", borderRadius: 999,
              background: "var(--ink)", color: "var(--paper)",
              fontSize: 13, fontWeight: 600,
            }}>
              <WhatsAppIcon /> Talk to admissions on WhatsApp <ArrowIcon size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. KEY DATES TABLE                                                      */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container" style={{ maxWidth: 980 }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 56, alignItems: "start" }}>
            <div>
              <div className="eyebrow">Calendar · 2026-27</div>
              <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "14ch" }}>
                Mark these{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  six dates.
                </span>
              </h2>
              <p style={{ color: "var(--ink-2)", marginTop: 18, fontSize: 15.5, lineHeight: 1.7 }}>
                JEECUP publishes its calendar in January. The dates below are the typical window — confirm exact days on the JEECUP portal closer to February 2026.
              </p>
              <a href={`https://${DATA.contact.jeecup === "4455" ? "jeecup.admissions.nic.in" : "jeecup.admissions.nic.in"}`} target="_blank" rel="noopener noreferrer" style={{
                marginTop: 22, display: "inline-flex", alignItems: "center", gap: 8,
                fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.04em",
                color: "var(--brand)", fontWeight: 600,
              }}>
                jeecup.admissions.nic.in <ArrowIcon size={12} />
              </a>
            </div>
            <ol className="card" style={{
              listStyle: "none",
              padding: "8px 0",
              margin: 0,
              overflow: "hidden",
              position: "relative",
            }}>
              {/* Vertical guide line */}
              <span aria-hidden="true" style={{
                position: "absolute",
                left: 86,
                top: 24,
                bottom: 24,
                width: 1,
                background: "var(--line)",
              }} />
              {DATES.map((d, i) => (
                <li key={`${d.month}-${i}`} style={{
                  display: "grid",
                  gridTemplateColumns: "70px 32px 1fr",
                  gap: 16,
                  padding: "16px 22px",
                  alignItems: "center",
                  position: "relative",
                }}>
                  {/* Month / day chip */}
                  <div style={{
                    width: 70, height: 70,
                    borderRadius: 12,
                    border: "1px solid var(--line)",
                    background: "var(--paper-2)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    overflow: "hidden",
                  }}>
                    <div style={{
                      width: "100%",
                      background: "var(--brand)",
                      color: "#fff",
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.16em",
                      fontWeight: 700,
                      textAlign: "center",
                      padding: "3px 0",
                    }}>{d.month}</div>
                    <div className="serif" style={{
                      fontStyle: "italic",
                      fontWeight: 400,
                      fontSize: d.day ? 28 : 18,
                      lineHeight: 1,
                      color: "var(--ink)",
                      marginTop: d.day ? 4 : 6,
                      letterSpacing: "-0.01em",
                    }}>
                      {d.day ?? d.year}
                    </div>
                    {d.day && <div style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      letterSpacing: "0.1em",
                      color: "var(--ink-3)",
                      marginTop: 2,
                    }}>{d.year}</div>}
                  </div>

                  {/* Timeline dot */}
                  <span aria-hidden="true" style={{
                    width: 14, height: 14,
                    borderRadius: 999,
                    background: "var(--accent)",
                    border: "3px solid var(--white)",
                    boxShadow: "0 0 0 1px var(--line)",
                    justifySelf: "center",
                  }} />

                  {/* Body */}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15.5, color: "var(--ink)", letterSpacing: "-0.005em" }}>
                      {d.title}
                    </div>
                    <div style={{ marginTop: 4, color: "var(--ink-3)", fontSize: 13, lineHeight: 1.5 }}>
                      {d.sub}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. ELIGIBILITY & PATHS                                                  */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--ink)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
          backgroundSize: "72px 72px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -180, top: -180, width: 480, height: 480, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 50%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: -120, bottom: -160, width: 380, height: 380, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 40%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 48, paddingBottom: 28, borderBottom: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>Eligibility · The route</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "18ch", color: "var(--paper)" }}>
                One college.{" "}
                <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                  One straight path.
                </span>
              </h2>
            </div>
            <p style={{ color: "color-mix(in oklab, var(--paper) 72%, transparent)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              JEECUP Group A is the only entrance for BIPE&rsquo;s 3-year diploma. Pass Class 10 with Mathematics and Science, sit the test, and choose code 4455 in counselling.
            </p>
          </div>

          <div style={{ border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)", borderRadius: 24, overflow: "hidden" }}>
            <div className="bipe-split bipe-pad-box" style={{ padding: "44px 36px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "center" }}>
              <div>
                <span className="pill" style={{ background: "var(--accent)", color: "var(--ink)" }}>JEECUP GROUP A</span>
                <div className="serif" style={{ marginTop: 18, fontSize: 44, lineHeight: 1, color: "var(--paper)", fontStyle: "italic", fontWeight: 400 }}>
                  3-year diploma
                </div>
                <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 60%, transparent)" }}>
                  After Class 10 · Maths & Science
                </div>
                <p style={{ marginTop: 22, fontSize: 15, lineHeight: 1.7, color: "color-mix(in oklab, var(--paper) 78%, transparent)", maxWidth: "44ch" }}>
                  The single route into BIPE. Three years, six semesters, five BTEUP branches open to you —{" "}
                  <Link href="/courses/computer-science-engineering" style={{ color: "var(--accent)", textDecoration: "underline" }}>Computer Science &amp; Engineering</Link>,{" "}
                  <Link href="/courses/civil-engineering" style={{ color: "var(--accent)", textDecoration: "underline" }}>Civil</Link>,{" "}
                  <Link href="/courses/electrical-engineering" style={{ color: "var(--accent)", textDecoration: "underline" }}>Electrical</Link>,{" "}
                  <Link href="/courses/mechanical-engineering-production" style={{ color: "var(--accent)", textDecoration: "underline" }}>Mechanical Engineering (Production)</Link>, and the rare{" "}
                  <Link href="/courses/dairy-engineering" style={{ color: "var(--accent)", textDecoration: "underline" }}>Dairy Engineering</Link>.
                </p>
                <Link href="/courses" style={{ marginTop: 22, display: "inline-flex", alignItems: "center", gap: 8, color: "var(--accent)", fontWeight: 600, fontSize: 14 }}>
                  View all 5 BTEUP polytechnic branches <ArrowIcon size={14} />
                </Link>
              </div>
              <div style={{ paddingLeft: 36, borderLeft: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)", display: "flex", flexDirection: "column", gap: 22 }}>
                <div>
                  <span className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 64, color: "var(--accent)", lineHeight: 0.9 }}>
                    <Counter to="480" />
                  </span>
                  <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 60%, transparent)" }}>
                    Total seats · 5 branches
                  </div>
                </div>
                <div>
                  <span className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 40, color: "var(--paper)", lineHeight: 0.95 }}>
                    4455
                  </span>
                  <div style={{ marginTop: 6, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 60%, transparent)" }}>
                    JEECUP code · BIPE
                  </div>
                </div>
                <div>
                  <span className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 40, color: "var(--paper)", lineHeight: 0.95 }}>
                    ₹30,150
                  </span>
                  <div style={{ marginTop: 6, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 60%, transparent)" }}>
                    Tuition · per year · AFRC
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. WHY APPLY NOW                                                        */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", right: -120, bottom: -160, width: 380, height: 380, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 22%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 48, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">Four reasons</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                Why apply{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  this cycle.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "42ch", justifySelf: "end", textAlign: "right" }}>
              Each claim is something a parent can verify on a Saturday tour — ask the front desk for a current student to walk you through.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 18, maxWidth: 880, margin: "0 auto" }}>
            {REASONS.map((r) => (
              <article key={r.roman} className="card" style={{ padding: 32, position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{
                  position: "absolute", right: -50, top: -50, width: 180, height: 180, borderRadius: "50%",
                  background: "color-mix(in oklab, var(--brand) 8%, transparent)",
                  pointerEvents: "none",
                }} />
                <div style={{ position: "relative" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "start" }}>
                    <div className="serif" style={{
                      fontStyle: "italic", fontWeight: 400,
                      fontSize: 48, lineHeight: 0.85,
                      color: "var(--brand)",
                      width: 56, textAlign: "right",
                    }}>
                      ({r.roman})
                    </div>
                    <div>
                      <h3 className="bipe-h3" style={{ fontSize: 21 }}>{r.title}</h3>
                      <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.65 }}>
                        {r.body}
                      </p>
                      <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--line)", display: "flex", alignItems: "baseline", gap: 14 }}>
                        <span className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 32, lineHeight: 0.9, color: "var(--brand)" }}>
                          {r.metric}
                        </span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                          {r.metricLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 6. CTA PAIR                                                             */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div style={{
            position: "relative", overflow: "hidden",
            borderRadius: 28, border: "1px solid var(--line)",
            background: "var(--white)",
            padding: "56px 56px",
          }}>
            <div aria-hidden="true" style={{
              position: "absolute", left: -160, top: -120, width: 360, height: 360, borderRadius: "50%",
              background: "color-mix(in oklab, var(--brand) 22%, transparent)",
              filter: "blur(110px)", pointerEvents: "none",
            }} />
            <div aria-hidden="true" style={{
              position: "absolute", right: -120, bottom: -120, width: 320, height: 320, borderRadius: "50%",
              background: "color-mix(in oklab, var(--accent) 32%, transparent)",
              filter: "blur(110px)", pointerEvents: "none",
            }} />
            <div className="bipe-split" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, alignItems: "center" }}>
              <div>
                <div className="eyebrow">Three pathways</div>
                <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                  Apply. Visit.{" "}
                  <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                    Or talk first.
                  </span>
                </h2>
                <p className="lead" style={{ marginTop: 18, maxWidth: "44ch" }}>
                  Whether you want to send the form, walk the campus, or ask one question on WhatsApp before any of that — we will meet you where you are.
                </p>
                <div style={{ marginTop: 22, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
                  <a href={`tel:${DATA.contact.phone}`} className="btn btn-ghost btn-sm">
                    <PhoneIcon /> {DATA.contact.phone}
                  </a>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Link href="/apply" style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                  padding: "20px 22px", borderRadius: 14,
                  background: "var(--brand)", color: "#fff", textDecoration: "none",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "color-mix(in oklab, #fff 65%, transparent)" }}>01</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Begin application</div>
                    <div style={{ fontSize: 12, color: "color-mix(in oklab, #fff 70%, transparent)", marginTop: 2 }}>Four-step form · 5 minutes</div>
                  </div>
                  <ArrowIcon size={16} />
                </Link>
                <Link href="/visit" style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                  padding: "20px 22px", borderRadius: 14,
                  background: "var(--ink)", color: "var(--paper)", textDecoration: "none",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "color-mix(in oklab, var(--paper) 55%, transparent)" }}>02</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Book a campus visit</div>
                    <div style={{ fontSize: 12, color: "color-mix(in oklab, var(--paper) 60%, transparent)", marginTop: 2 }}>~35 min from Varanasi Cantt by auto</div>
                  </div>
                  <ArrowIcon size={16} />
                </Link>
                <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                  padding: "20px 22px", borderRadius: 14,
                  background: "var(--paper-2)", color: "var(--ink)", textDecoration: "none",
                  border: "1px solid var(--line)",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>03</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Talk on WhatsApp</div>
                    <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>Same-day reply · EN / हिं</div>
                  </div>
                  <span style={{ width: 28, height: 28, borderRadius: 999, background: "#25D366", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <WhatsAppIcon />
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Image strip */}
          <div className="bipe-img-strip" style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <Img src={BIPE_IMG.studentsForms} label="Application desk" style={{ height: 200, borderRadius: 18 }} />
            <Img src={BIPE_IMG.counsellingHall} label="Counselling round" style={{ height: 200, borderRadius: 18 }} />
            <Img src={BIPE_IMG.classroom} label="Classroom · year one" style={{ height: 200, borderRadius: 18 }} />
          </div>
        </div>
      </section>
    </div>
  );
}
