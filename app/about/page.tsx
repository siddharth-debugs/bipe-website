import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metaFor } from "@/lib/routes";
import { DATA } from "@/lib/data";
import { BIPE_IMG } from "@/lib/images";
import { Img } from "@/components/ui/Img";
import { Counter } from "@/components/ui/Counter";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";

export const metadata: Metadata = metaFor("about");

type Stat = { num: string; label: string; suffix?: string };
const STATS: Stat[] = [
  { num: "2010", label: "Founded" },
  { num: "6", label: "Acres" },
  { num: "5", label: "Branches" },
  { num: "550", label: "Students", suffix: "+" },
  { num: "33", label: "Faculty" },
  { num: "1:20", label: "Mentor ratio" },
];

const FEATURES: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "1:20 mentorship with home visits",
    body: "Each faculty mentor takes responsibility for 20 students through their entire diploma — including periodic home visits to parents in Mau, Ghazipur and beyond. Institution, parent and student bonded as one family.",
  },
  {
    n: "02",
    title: "Book Bank from ₹600 / sem",
    body: "Full-semester sets of textbooks and reference materials borrowable for the semester from ₹600. No student goes without books because of family budget.",
  },
  {
    n: "03",
    title: "Positive campus culture",
    body: "We do not run on fines or penalty-driven discipline. Mentor conversations and parent calls do the work. The campus is warm, safe and academically serious at the same time.",
  },
  {
    n: "04",
    title: "PMKVY · Make in India · Swachh Bharat",
    body: "Curriculum, skilling pathways and student projects align with national missions. Our diploma equips students for the India that is being built today.",
  },
];

type District = { name: string; hi: string; top: string; left: string; tag: string };
const DISTRICTS: District[] = [
  { name: "Varanasi",  hi: "वाराणसी",  top: "58%", left: "38%", tag: "HOME" },
  { name: "Mau",       hi: "मऊ",       top: "30%", left: "62%", tag: "MAJOR" },
  { name: "Ghazipur",  hi: "गाज़ीपुर",  top: "44%", left: "70%", tag: "MAJOR" },
  { name: "Azamgarh",  hi: "आज़मगढ़",  top: "20%", left: "44%", tag: "ACTIVE" },
  { name: "Chandauli", hi: "चंदौली",   top: "72%", left: "55%", tag: "ACTIVE" },
  { name: "Mirzapur",  hi: "मिर्ज़ापुर", top: "78%", left: "26%", tag: "ACTIVE" },
];

export default function Page() {
  return (
    <div className="page-enter">
      {/* ====================================================================== */}
      {/* 1. EDITORIAL HERO                                                       */}
      {/* ====================================================================== */}
      <section className="section" style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 72 }}>
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
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div className="eyebrow">EST. 2010 · PHOOLPUR · VARANASI</div>
              <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "16ch" }}>
                Serving Eastern UP since{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  sixteen years.
                </span>
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "52ch" }}>
                A six-acre AICTE-approved diploma institute in Phoolpur, Varanasi. Five BTEUP-affiliated branches, 550+ students drawn from six districts, 33 faculty &mdash; built to make rural Eastern UP a credible address for technical education.
              </p>
              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                <Link href="/apply" className="btn btn-primary btn-lg">Apply for 2026-27 <ArrowIcon size={16} /></Link>
                <Link href="/visit" className="btn btn-ghost btn-lg">Visit campus</Link>
              </div>

              <div style={{ marginTop: 36, paddingTop: 20, borderTop: "1px solid var(--line)", display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Trust marks &rarr;
                </span>
                {["AICTE", "BTEUP", "ISO 9001", "AISHE"].map((t, i) => (
                  <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 14, fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 17, color: "var(--ink-2)" }}>
                    {t}
                    {i < 3 && <span style={{ width: 4, height: 4, borderRadius: 999, background: "var(--accent)" }} />}
                  </span>
                ))}
              </div>
            </div>

            {/* Image collage */}
            <div className="bipe-collage" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gridTemplateRows: "1fr 1fr", gap: 14, height: 540 }}>
              <Img src={BIPE_IMG.campusWide} label="6-acre campus" style={{ gridRow: "1 / 3", borderRadius: 18, height: "100%" }} />
              <Img src={BIPE_IMG.students2024} label="2024 cohort" style={{ borderRadius: 18, height: "100%" }} />
              <Img src={BIPE_IMG.workshop} label="Mech workshop" style={{ borderRadius: 18, height: "100%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. VISION · MISSION · VALUES                                            */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--ink)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
          backgroundSize: "72px 72px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: "30%", top: -160, width: 520, height: 520, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 50%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -120, bottom: -160, width: 380, height: 380, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 40%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 56, paddingBottom: 28, borderBottom: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>Why we exist</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch", color: "var(--paper)" }}>
                Vision. Mission.{" "}
                <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>Values.</span>
              </h2>
            </div>
            <p style={{ color: "color-mix(in oklab, var(--paper) 72%, transparent)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              The three sentences a board can read in a minute and parents can hold us accountable to for a decade.
            </p>
          </div>

          <div className="bipe-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)", borderRadius: 24, overflow: "hidden" }}>
            {/* Vision */}
            <div style={{ padding: "44px 36px", borderRight: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" }}>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>VISION</div>
              <div className="serif" style={{ marginTop: 16, fontSize: 40, lineHeight: 1.05, color: "var(--paper)", fontStyle: "italic", fontWeight: 400 }}>
                Recognised.
              </div>
              <p style={{ marginTop: 18, fontSize: 15, lineHeight: 1.65, color: "color-mix(in oklab, var(--paper) 72%, transparent)" }}>
                Eastern UP recognised &mdash; nationally &mdash; for accountable, hands-on technical education. A region whose diploma engineers are sought after, not apologised for.
              </p>
            </div>

            {/* Mission */}
            <div style={{ padding: "44px 36px", borderRight: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" }}>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>MISSION</div>
              <div className="serif" style={{ marginTop: 16, fontSize: 40, lineHeight: 1.05, color: "var(--paper)", fontStyle: "italic", fontWeight: 400 }}>
                Work-ready.
              </div>
              <p style={{ marginTop: 18, fontSize: 15, lineHeight: 1.65, color: "color-mix(in oklab, var(--paper) 72%, transparent)" }}>
                AICTE-approved diploma courses, industry- and government-aligned. Practical training plus mentorship that prepares students for engineering roles in private industry, central PSUs and state government recruitment.
              </p>
            </div>

            {/* Values */}
            <div style={{ padding: "44px 36px", background: "color-mix(in oklab, var(--brand) 12%, var(--ink))", position: "relative", overflow: "hidden" }}>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>VALUES</div>
              <div className="serif" style={{
                marginTop: 16,
                fontSize: "clamp(28px, 3vw, 44px)",
                lineHeight: 1.1, color: "var(--paper)",
                fontStyle: "italic", fontWeight: 400,
              }}>
                सत्यं शिवं<br />सुन्दरम्
              </div>
              <div style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)" }}>
                truth · goodness · beauty
              </div>
              <p style={{ marginTop: 18, fontSize: 15, lineHeight: 1.65, color: "color-mix(in oklab, var(--paper) 72%, transparent)" }}>
                Transparent fees. Hands-on training. Respect for the family. The student, the institution and the parent &mdash; bonded.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. LONG-FORM STORY                                                      */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", right: -120, top: -120, width: 320, height: 320, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 18%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 80 }}>
            <div>
              <div className="eyebrow">The story</div>
              <p className="serif" style={{
                fontSize: "clamp(34px, 4vw, 56px)",
                lineHeight: 1.05,
                marginTop: 20,
                color: "var(--ink)",
                letterSpacing: "-0.02em",
              }}>
                &ldquo;Built by Eastern UP,
                <br />
                <span style={{ color: "var(--brand)" }}>for Eastern UP.</span>&rdquo;
              </p>
              <div style={{
                marginTop: 28, paddingLeft: 16, borderLeft: "2px solid var(--accent)",
                fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--ink-3)",
              }}>
                Purwanchal Educational Trust<br />Founders, 2010
              </div>
            </div>
            <div style={{ color: "var(--ink-2)", fontSize: 16.5, lineHeight: 1.75, maxWidth: "62ch" }}>
              <p>
                BIPE was founded in 2010 by the <strong style={{ color: "var(--ink)" }}>Purwanchal Educational Trust</strong>, a registered non-profit, with one stated purpose: to bring accountable, hands-on technical education to families across Eastern Uttar Pradesh who could not afford to send their children to Lucknow, Kanpur or further.
              </p>
              <p style={{ marginTop: 18 }}>
                Our catchment is six districts &mdash; <strong style={{ color: "var(--ink)" }}>Mau, Ghazipur, Azamgarh, Chandauli, Mirzapur and Varanasi</strong>. The campus sits on six acres in Phoolpur, off the Varanasi&ndash;Ghazipur axis. Three-quarters of our students are first-generation engineering aspirants. Many arrive shy of English and leave fluent in lathes, theodolites and PLC ladder logic.
              </p>
              <p style={{ marginTop: 18 }}>
                We run <em>five</em> BTEUP-affiliated branches &mdash; including <strong style={{ color: "var(--brand)" }}>Dairy Engineering</strong>, a programme offered by fewer than 1.1% of UP polytechnics. Our dairy alumni work at Amul, Mother Dairy, Parag, Nestl&eacute; and the NDDB. Civil and Mechanical Engineering (Production) alumni work on Smart Cities, Bharatmala alignments and the Kashi Vishwanath corridor. Computer Science &amp; Engineering graduates clear B.Tech entrances; Electrical graduates write SSC JE and RRB JE.
              </p>
              <p style={{ marginTop: 18 }}>
                Sixteen years in, more than a thousand BIPE alumni serve at <strong style={{ color: "var(--ink)" }}>Mahindra, Tata Steel, BEL, Indian Railways, Mumbai Metro</strong> and dozens of other employers. Most of them came from villages within 80 kilometres of our gate. That is the story we are most proud of.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. STATS BAR                                                            */}
      {/* ====================================================================== */}
      <section className="section-tight" style={{ position: "relative" }}>
        <div className="container">
          <div className="bipe-stats" style={{
            border: "1px solid var(--line)", borderRadius: 24, overflow: "hidden",
            background: "var(--white)",
            display: "grid", gridTemplateColumns: `repeat(${STATS.length}, 1fr)`,
          }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                padding: "32px 22px",
                borderRight: i < STATS.length - 1 ? "1px solid var(--line)" : "none",
                position: "relative",
              }}>
                <div className="serif" style={{
                  fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400,
                  fontSize: "clamp(40px, 4.5vw, 72px)",
                  lineHeight: 0.9, color: "var(--brand)", letterSpacing: "-0.02em",
                }}>
                  {s.num.match(/^[0-9,]+$/) ? <Counter to={s.num} suffix={s.suffix ?? ""} /> : s.num}
                </div>
                <div style={{
                  marginTop: 14,
                  fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.16em",
                  textTransform: "uppercase", color: "var(--ink-3)",
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. BRANCH-WISE SEAT ALLOTMENT                                           */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", left: -160, top: -120, width: 380, height: 380, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 16%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 36, paddingBottom: 22, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">Sanctioned intake · 2026-27</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "18ch" }}>
                Branch-wise{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  seat allotment.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              The 2026-27 sanctioned intake under JEECUP college code 4455 &mdash; five 3-year BTEUP-affiliated diploma courses, total {DATA.branches.reduce((s, b) => s + b.seats, 0)} seats.
            </p>
          </div>

          <div className="card" style={{ padding: 0, overflow: "hidden", maxWidth: 980, margin: "0 auto" }}>
            {/* Header row */}
            <div style={{
              display: "grid", gridTemplateColumns: "auto minmax(0, 3fr) 1fr",
              padding: "16px 24px",
              background: "var(--ink)", color: "var(--paper)",
              fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
            }}>
              <div style={{ minWidth: 80 }}>Code</div>
              <div>Branch</div>
              <div style={{ textAlign: "right" }}>Seats</div>
            </div>

            {DATA.branches.map((b, i) => (
              <div key={b.code} style={{
                display: "grid", gridTemplateColumns: "auto minmax(0, 3fr) 1fr",
                padding: "20px 24px",
                background: i % 2 === 0 ? "var(--white)" : "var(--paper)",
                borderBottom: i < DATA.branches.length - 1 ? "1px solid var(--line)" : "none",
                alignItems: "center",
              }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--brand)", minWidth: 80 }}>{b.code}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, color: "var(--ink)" }}>{b.name}</div>
                  <div className="serif" style={{ fontStyle: "italic", color: "var(--ink-3)", fontSize: 14, marginTop: 2 }}>{b.hi}</div>
                </div>
                <div className="serif" style={{
                  fontStyle: "italic", fontWeight: 400, fontSize: 30,
                  color: "var(--ink)", letterSpacing: "-0.01em",
                  textAlign: "right",
                }}>
                  {b.seats}
                </div>
              </div>
            ))}

            {/* Total footer */}
            <div style={{
              display: "grid", gridTemplateColumns: "auto minmax(0, 3fr) 1fr",
              padding: "20px 24px",
              background: "color-mix(in oklab, var(--brand) 8%, var(--paper))",
              borderTop: "2px solid var(--brand)",
              alignItems: "center",
            }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--brand)", minWidth: 80 }}>TOTAL</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>2026-27 sanctioned intake · 5 BTEUP branches</div>
              <div className="serif" style={{
                fontStyle: "italic", fontWeight: 400, fontSize: 36,
                color: "var(--brand)", letterSpacing: "-0.02em",
                textAlign: "right",
              }}>
                {DATA.branches.reduce((s, b) => s + b.seats, 0)}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18, textAlign: "center" }}>
            <Link href="/courses" className="btn btn-ghost btn-sm">
              See branch syllabi <ArrowIcon size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. CATCHMENT MAP                                                        */}
      {/* ====================================================================== */}
      <section className="section" style={{ position: "relative", overflow: "hidden" }}>
        <div className="container">
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div className="eyebrow">Catchment</div>
              <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "18ch" }}>
                Six districts.{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>One campus.</span>
              </h2>
              <p style={{ color: "var(--ink-2)", marginTop: 20, fontSize: 16, lineHeight: 1.7, maxWidth: "52ch" }}>
                BIPE was located in Phoolpur deliberately &mdash; equidistant from the rural belts of Mau, Ghazipur and Azamgarh, and reachable from Varanasi, Mirzapur and Chandauli by daily transport. The intent was that no aspiring student should travel more than 90 minutes to a serious polytechnic.
              </p>

              <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                {DISTRICTS.map((d) => (
                  <div key={d.name} style={{
                    border: "1px solid var(--line)", borderRadius: 12,
                    padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "var(--white)",
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{d.name}</div>
                      <div className="serif" style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 2 }}>{d.hi}</div>
                    </div>
                    <span className="pill" style={{
                      background: d.tag === "HOME" ? "var(--brand)" : d.tag === "MAJOR" ? "color-mix(in oklab, var(--accent) 22%, var(--paper))" : "var(--brand-soft)",
                      color: d.tag === "HOME" ? "#fff" : d.tag === "MAJOR" ? "var(--accent-deep)" : "var(--brand)",
                    }}>{d.tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stylised map */}
            <div style={{
              position: "relative", aspectRatio: "1.15 / 1",
              borderRadius: 24, overflow: "hidden",
              border: "1px solid var(--line)",
              background: "var(--paper-2)",
            }}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.18 }}>
                <Img src={BIPE_IMG.map} label="" style={{ position: "absolute", inset: 0, borderRadius: 0, height: "100%" }} />
              </div>
              <div aria-hidden="true" style={{
                position: "absolute", inset: 0, opacity: 0.08,
                backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
                backgroundSize: "32px 32px", pointerEvents: "none",
              }} />
              <div aria-hidden="true" style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse at 38% 58%, color-mix(in oklab, var(--brand) 22%, transparent), transparent 60%)",
                pointerEvents: "none",
              }} />

              {/* District pins */}
              {DISTRICTS.map((d) => (
                <div key={d.name} style={{
                  position: "absolute", top: d.top, left: d.left,
                  transform: "translate(-50%, -50%)",
                }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%",
                    background: d.tag === "HOME" ? "var(--accent)" : "var(--brand)",
                    border: "3px solid var(--white)",
                    boxShadow: "0 4px 12px rgba(10,26,63,0.25)",
                  }} />
                  <div style={{
                    position: "absolute", left: 22, top: -4,
                    background: "var(--white)", borderRadius: 8,
                    padding: "5px 10px",
                    border: "1px solid var(--line)",
                    fontSize: 12, fontWeight: 600,
                    whiteSpace: "nowrap",
                    boxShadow: "0 2px 8px rgba(10,26,63,0.08)",
                  }}>
                    {d.name}
                    {d.tag === "HOME" && (
                      <span style={{ marginLeft: 8, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em", color: "var(--accent-deep)" }}>BIPE</span>
                    )}
                  </div>
                </div>
              ))}

              <div style={{
                position: "absolute", left: 18, bottom: 18,
                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em",
                textTransform: "uppercase", color: "var(--ink-3)",
                background: "var(--white)", borderRadius: 8,
                padding: "6px 10px", border: "1px solid var(--line)",
              }}>
                Eastern UP · Catchment 2026
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 6. SALIENT FEATURES                                                     */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", left: -120, bottom: -160, width: 360, height: 360, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 18%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 48, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">Salient features</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                Four things you can{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>verify</span>{" "}
                in one campus visit.
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Every claim below is observable on a Saturday tour &mdash; ask the front desk for a current student to walk you through.
            </p>
          </div>

          <div className="bipe-form-row" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
            {FEATURES.map((f) => (
              <article key={f.n} className="card" style={{ padding: 32, position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{
                  position: "absolute", right: -40, top: -40, width: 160, height: 160, borderRadius: "50%",
                  background: "color-mix(in oklab, var(--brand) 8%, transparent)",
                  pointerEvents: "none",
                }} />
                <div style={{ position: "relative", display: "grid", gridTemplateColumns: "auto 1fr", gap: 28, alignItems: "start" }}>
                  <div className="serif" style={{
                    fontStyle: "italic", fontWeight: 400,
                    fontSize: "clamp(56px, 6vw, 92px)",
                    lineHeight: 0.85, color: "var(--brand)",
                    letterSpacing: "-0.02em",
                  }}>
                    {f.n}
                  </div>
                  <div>
                    <h3 className="bipe-h3" style={{ fontSize: 22, lineHeight: 1.25 }}>{f.title}</h3>
                    <p style={{ marginTop: 14, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.65 }}>
                      {f.body}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 7. FINAL CTA                                                            */}
      {/* ====================================================================== */}
      <section className="section" style={{ paddingTop: 56 }}>
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
                  Visit. Apply.{" "}
                  <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                    Talk to us.
                  </span>
                </h2>
                <p className="lead" style={{ marginTop: 18, maxWidth: "44ch" }}>
                  Whether you want to walk the campus, send the form, or ask one question on WhatsApp first &mdash; we will meet you where you are in the decision.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Link href="/visit" style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                  padding: "20px 22px", borderRadius: 14,
                  background: "var(--ink)", color: "var(--paper)", textDecoration: "none",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "color-mix(in oklab, var(--paper) 55%, transparent)" }}>01</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Visit campus</div>
                    <div style={{ fontSize: 12, color: "color-mix(in oklab, var(--paper) 60%, transparent)", marginTop: 2 }}>Free shuttle from Varanasi Cantt</div>
                  </div>
                  <ArrowIcon size={16} />
                </Link>
                <Link href="/apply" style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                  padding: "20px 22px", borderRadius: 14,
                  background: "var(--brand)", color: "#fff", textDecoration: "none",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "color-mix(in oklab, #fff 65%, transparent)" }}>02</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Apply for 2026-27</div>
                    <div style={{ fontSize: 12, color: "color-mix(in oklab, #fff 70%, transparent)", marginTop: 2 }}>Four-step form · 5 minutes</div>
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
        </div>
      </section>
    </div>
  );
}
