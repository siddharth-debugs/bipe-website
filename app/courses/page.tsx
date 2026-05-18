import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metadataFor } from "@/lib/seo";
import { DATA } from "@/lib/data";
import { ArrowIcon, WhatsAppIcon, PhoneIcon } from "@/components/shell/Icons";
import { CoursesView } from "./CoursesView";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("courses"); }

const PATHWAY_TIPS: { num: string; title: string; body: string }[] = [
  {
    num: "01",
    title: "Follow what you build, not what you score.",
    body: "Dairy and Civil don't pull the highest cut-offs but offer some of the strongest recruiter pipelines in Eastern UP. Pick the workshop you want to live in for three years.",
  },
  {
    num: "02",
    title: "Read the seat count.",
    body: "Civil 120, Electrical 120, Mechanical Engineering (Production) 120 — bigger cohorts mean wider alumni networks and stronger cross-batch mentorship. Smaller branches like CS&E and Dairy run more intimate cohorts.",
  },
  {
    num: "03",
    title: "Look at the workshop, not the cut-off.",
    body: "Walk through the lab the branch lives in. Three years on a CNC, behind a survey instrument or beside a pasteuriser shape the engineer you become — far more than where you ranked at 16.",
  },
  {
    num: "04",
    title: "Talk to a current student.",
    body: "Admissions can introduce you to a branch alum on WhatsApp before counselling — hear the workshop, the lab, the mess and the placement story unfiltered, in your own language.",
  },
];

const CAREER_TILES: { tag: string; title: string; body: string; chips: string[] }[] = [
  {
    tag: "INDUSTRY",
    title: "Diploma engineers on the floor.",
    body: "Recruiters return to BIPE year after year for shop-floor and field-engineer hires across automotive, infrastructure, electrical and dairy.",
    chips: [
      "Mahindra",
      "Tata Steel",
      "Tata Motors",
      "BEL",
      "Wipro",
      "Mumbai Metro",
      "Asian Paints",
      "JCB",
      "Amul",
      "Mother Dairy",
    ],
  },
  {
    tag: "GOVERNMENT",
    title: "Diploma-eligible technical exams.",
    body: "A BTEUP diploma is the eligibility for Junior Engineer cadres in Indian Railways, UPPCL and the State Dairy Boards — every year, BIPE alumni clear them.",
    chips: ["SSC JE", "RRB JE", "UPPCL", "Indian Railways", "Loco Pilot", "NDDB", "State Dairy Boards"],
  },
  {
    tag: "B.TECH PATHWAY",
    title: "Continue to a B.Tech, your call.",
    body: "BIPE diploma holders are eligible for AKTU and other UP B.Tech entrances. A diploma plus three further years of engineering — same destination, two well-paid pathways instead of one.",
    chips: ["BBDU", "MMMUT", "UP B.Tech colleges", "AKTU"],
  },
];

export default function Page() {
  const totalSeats = DATA.branches.reduce((s, b) => s + b.seats, 0);

  return (
    <div className="page-enter">
      {/* ====================================================================== */}
      {/* 1. EDITORIAL HERO                                                       */}
      {/* ====================================================================== */}
      <section
        className="section bipe-pad"
        style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 72 }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: -180,
            top: -120,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "color-mix(in oklab, var(--brand) 26%, transparent)",
            filter: "blur(120px)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: -160,
            bottom: -160,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "color-mix(in oklab, var(--accent) 28%, transparent)",
            filter: "blur(140px)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div className="eyebrow">Academics · 2026-27</div>
              <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "20ch" }}>
                <span
                  className="serif"
                  style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
                >
                  Five
                </span>{" "}
                BTEUP polytechnic branches in Varanasi. Three years to a career.
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "56ch" }}>
                AICTE-approved diploma courses, AFRC-published tuition of ₹30,150 a year, {totalSeats} seats across 2026-27 — including Dairy Engineering, offered by under 1.1% of UP polytechnics. Every branch listed here is BTEUP-affiliated, taught on the same Phoolpur campus, under the same mentor structure.
              </p>
              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                <Link href="/apply" className="btn btn-primary btn-lg">
                  Apply for 2026-27 <ArrowIcon size={16} />
                </Link>
                <Link href="/campus" className="btn btn-ghost btn-lg">
                  Visit campus
                </Link>
              </div>
              <div
                className="bipe-stats"
                style={{
                  marginTop: 36,
                  paddingTop: 22,
                  borderTop: "1px solid var(--line)",
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 18,
                }}
              >
                {[
                  { num: "5", l: "BTEUP branches" },
                  { num: `${totalSeats}`, l: "seats · 2026-27" },
                  { num: "₹30,150", l: "tuition · per year" },
                ].map((s) => (
                  <div key={s.l}>
                    <div
                      className="serif"
                      style={{
                        fontStyle: "italic",
                        fontWeight: 400,
                        fontSize: 32,
                        lineHeight: 0.9,
                        color: "var(--brand)",
                      }}
                    >
                      {s.num}
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "var(--ink-3)",
                      }}
                    >
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Catalogue card — editorial info sheet */}
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 22,
                background: "var(--ink)",
                color: "var(--paper)",
                padding: "32px 32px 28px",
                boxShadow: "0 30px 70px -28px rgba(10,26,63,0.45)",
              }}
            >
              {/* Decorative grid */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.06,
                  backgroundImage:
                    "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                  pointerEvents: "none",
                }}
              />
              {/* Brand glow */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  right: -120,
                  top: -120,
                  width: 280,
                  height: 280,
                  borderRadius: "50%",
                  background: "color-mix(in oklab, var(--accent) 45%, transparent)",
                  filter: "blur(100px)",
                  pointerEvents: "none",
                }}
              />
              {/* Corner crop marks — printer-style accent */}
              {([
                { left: 14, top: 14, borders: "border-top: 1.5px solid; border-left: 1.5px solid;" },
                { right: 14, top: 14, borders: "border-top: 1.5px solid; border-right: 1.5px solid;" },
                { left: 14, bottom: 14, borders: "border-bottom: 1.5px solid; border-left: 1.5px solid;" },
                { right: 14, bottom: 14, borders: "border-bottom: 1.5px solid; border-right: 1.5px solid;" },
              ] as const).map((c, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    width: 12,
                    height: 12,
                    borderColor: "color-mix(in oklab, var(--accent) 60%, transparent)",
                    borderStyle: "solid",
                    borderWidth: 0,
                    borderTopWidth: c.borders.includes("border-top") ? 1.5 : 0,
                    borderRightWidth: c.borders.includes("border-right") ? 1.5 : 0,
                    borderBottomWidth: c.borders.includes("border-bottom") ? 1.5 : 0,
                    borderLeftWidth: c.borders.includes("border-left") ? 1.5 : 0,
                    ...("left" in c ? { left: c.left } : {}),
                    ...("right" in c ? { right: c.right } : {}),
                    ...("top" in c ? { top: c.top } : {}),
                    ...("bottom" in c ? { bottom: c.bottom } : {}),
                  }}
                />
              ))}

              <div style={{ position: "relative" }}>
                {/* Top eyebrow row */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  paddingBottom: 14,
                  borderBottom: "1px dashed color-mix(in oklab, var(--paper) 22%, transparent)",
                }}>
                  <span style={{ color: "var(--accent)", fontWeight: 600 }}>BIPE Catalogue</span>
                  <span style={{ color: "color-mix(in oklab, var(--paper) 50%, transparent)" }}>
                    Vol. 16 · 2026-27
                  </span>
                </div>

                {/* Hero numeral + tagline */}
                <div style={{ paddingTop: 22, display: "flex", alignItems: "flex-start", gap: 18 }}>
                  <div style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "clamp(96px, 11vw, 156px)",
                    lineHeight: 0.85,
                    color: "var(--accent)",
                    letterSpacing: "-0.04em",
                  }}>
                    5
                  </div>
                  <div style={{ paddingTop: 14, flex: 1 }}>
                    <div style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9.5,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "color-mix(in oklab, var(--paper) 55%, transparent)",
                    }}>
                      BTEUP-affiliated
                    </div>
                    <div style={{
                      marginTop: 4,
                      fontSize: 22,
                      lineHeight: 1.15,
                      fontWeight: 600,
                      color: "var(--paper)",
                      letterSpacing: "-0.01em",
                    }}>
                      Diploma branches.
                    </div>
                    <div className="serif" style={{
                      marginTop: 6,
                      fontStyle: "italic",
                      fontSize: 18,
                      color: "color-mix(in oklab, var(--paper) 75%, transparent)",
                    }}>
                      Three years each.
                    </div>
                  </div>
                </div>

                {/* Branch list — mono caps */}
                <div style={{
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: "1px dashed color-mix(in oklab, var(--paper) 18%, transparent)",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px 18px",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "color-mix(in oklab, var(--paper) 78%, transparent)",
                }}>
                  {[
                    "01 · Computer Science & Engg.",
                    "02 · Dairy Engg.",
                    "03 · Civil Engg.",
                    "04 · Electrical Engg.",
                    "05 · Mech Engg. (Prod.)",
                  ].map((b) => (
                    <span key={b} style={{ display: "block" }}>
                      {b}
                    </span>
                  ))}
                </div>

                {/* Metadata strip — three stamped facts */}
                <div className="bipe-grid-3" style={{
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: "1px dashed color-mix(in oklab, var(--paper) 22%, transparent)",
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 0,
                }}>
                  {[
                    { l: "Seats", v: `${totalSeats}` },
                    { l: "Tuition", v: "₹30,150/yr" },
                    { l: "Branches", v: "5" },
                  ].map((m, i, arr) => (
                    <div key={m.l} style={{
                      paddingLeft: i === 0 ? 0 : 14,
                      paddingRight: i === arr.length - 1 ? 0 : 14,
                      borderRight: i < arr.length - 1
                        ? "1px solid color-mix(in oklab, var(--paper) 14%, transparent)"
                        : "none",
                    }}>
                      <div style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "color-mix(in oklab, var(--paper) 50%, transparent)",
                      }}>
                        {m.l}
                      </div>
                      <div style={{
                        marginTop: 4,
                        fontFamily: "var(--font-mono)",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "var(--paper)",
                      }}>
                        {m.v}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom approvals row */}
                <div style={{
                  marginTop: 20,
                  paddingTop: 14,
                  borderTop: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 9.5,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "color-mix(in oklab, var(--paper) 55%, transparent)",
                  flexWrap: "wrap",
                  gap: 8,
                }}>
                  <span>JEECUP 4455 · BTEUP</span>
                  <span>AICTE 1-488233171</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. THE PATH                                                             */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div className="container" style={{ position: "relative" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: 32,
              alignItems: "end",
              marginBottom: 40,
              paddingBottom: 28,
              borderBottom: "1px solid var(--line)",
            }}
          >
            <div>
              <div className="eyebrow">Eligibility</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                One path.{" "}
                <span
                  className="serif"
                  style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
                >
                  Class 10, JEECUP, BIPE.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "48ch", justifySelf: "end", textAlign: "right" }}>
              Every BIPE diploma is a 3-year, 6-semester BTEUP programme. Eligibility is a Class 10 pass with Mathematics and Science. JEECUP Group A is the entrance — choose institute code 4455 in counselling.
            </p>
          </div>

          <article
            className="card"
            style={{
              padding: 32,
              position: "relative",
              overflow: "hidden",
              background: "color-mix(in oklab, var(--brand) 8%, var(--white))",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                right: -50,
                top: -50,
                width: 220,
                height: 220,
                borderRadius: "50%",
                background: "color-mix(in oklab, var(--brand) 18%, transparent)",
                pointerEvents: "none",
              }}
            />
            <div className="bipe-split" style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }}>
              <div>
                <div className="row" style={{ gap: 8, marginBottom: 14 }}>
                  <span className="pill" style={{ background: "var(--brand)", color: "#fff" }}>
                    JEECUP Group A
                  </span>
                  <span className="pill">3 years · 6 sem</span>
                </div>
                <div
                  className="serif"
                  style={{
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: 56,
                    lineHeight: 0.95,
                    color: "var(--brand)",
                  }}
                >
                  After 10th
                </div>
                <p style={{ marginTop: 16, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.7 }}>
                  Open to anyone with a Class 10 pass that includes Mathematics and Science. JEECUP Group A is a Class-10-syllabus paper in Maths, Physics and Chemistry. Counselling places you in the branch of your choice subject to your rank.
                </p>
              </div>
              <div
                style={{
                  paddingLeft: 32,
                  borderLeft: "1px solid var(--line)",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 18,
                }}
              >
                {[
                  { num: `${totalSeats}`, l: "Seats · 5 branches" },
                  { num: "10th", l: "Maths · Science pass" },
                  { num: "4455", l: "JEECUP code · BIPE" },
                  { num: "₹30,150", l: "Tuition · per year" },
                ].map((s) => (
                  <div key={s.l}>
                    <div
                      className="serif"
                      style={{
                        fontStyle: "italic",
                        fontWeight: 400,
                        fontSize: 28,
                        color: "var(--brand)",
                        lineHeight: 0.95,
                      }}
                    >
                      {s.num}
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--ink-3)",
                      }}
                    >
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <div
            style={{
              marginTop: 26,
              padding: "18px 24px",
              borderRadius: 14,
              border: "1px dashed var(--line-2)",
              background: "var(--white)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 14,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.08em",
                color: "var(--ink-2)",
              }}
            >
              <span style={{ color: "var(--brand)", fontWeight: 700 }}>JEECUP code 4455</span> — apply once, choose any branch in counselling.
            </div>
            <Link href="/jeecup" className="btn btn-ghost btn-sm">
              How JEECUP works <ArrowIcon size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. INTERACTIVE BRANCH INDEX (CLIENT)                                    */}
      {/* ====================================================================== */}
      <CoursesView />

      {/* ====================================================================== */}
      {/* 5. CAREER PATHWAYS (DARK)                                               */}
      {/* ====================================================================== */}
      <section
        className="section"
        style={{ background: "var(--ink)", color: "var(--paper)", position: "relative", overflow: "hidden" }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            backgroundImage:
              "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: -200,
            bottom: -200,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "color-mix(in oklab, var(--brand) 50%, transparent)",
            filter: "blur(140px)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: -160,
            top: -160,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "color-mix(in oklab, var(--accent) 32%, transparent)",
            filter: "blur(120px)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 56, alignItems: "start" }}>
            <div style={{ position: "sticky", top: 100 }}>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>
                / What alumni do
              </div>
              <h2 className="bipe-h1" style={{ marginTop: 14, color: "var(--paper)", maxWidth: "14ch" }}>
                <span
                  className="serif"
                  style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}
                >
                  Where it leads.
                </span>
              </h2>
              <p
                style={{
                  color: "color-mix(in oklab, var(--paper) 78%, transparent)",
                  marginTop: 22,
                  fontSize: 15.5,
                  lineHeight: 1.7,
                  maxWidth: "44ch",
                }}
              >
                A BTEUP diploma is not a lesser degree — it is a faster one. It opens three independent doors: a job in industry the year you graduate, eligibility for diploma-only government technical exams, and direct entry into the second year of a B.Tech if you want to keep studying.
              </p>
              <div
                style={{
                  marginTop: 30,
                  paddingTop: 22,
                  borderTop: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "color-mix(in oklab, var(--paper) 60%, transparent)",
                  }}
                >
                  {DATA.recruiters.length}+ verified recruiters
                </div>
                <Link
                  href="/placements"
                  className="btn"
                  style={{
                    color: "var(--paper)",
                    border: "1px solid color-mix(in oklab, var(--paper) 25%, transparent)",
                    width: "fit-content",
                  }}
                >
                  See placements <ArrowIcon size={14} />
                </Link>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {CAREER_TILES.map((t, i) => (
                <article
                  key={t.tag}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 18,
                    border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
                    background: "color-mix(in oklab, var(--paper) 5%, transparent)",
                    padding: 32,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: 18,
                      paddingBottom: 14,
                      borderBottom: "1px solid color-mix(in oklab, var(--paper) 12%, transparent)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--accent)",
                        fontWeight: 700,
                      }}
                    >
                      {t.tag}
                    </div>
                    <div
                      className="serif"
                      style={{
                        fontStyle: "italic",
                        fontWeight: 400,
                        fontSize: 22,
                        color: "color-mix(in oklab, var(--paper) 40%, transparent)",
                      }}
                    >
                      0{i + 1}
                    </div>
                  </div>
                  <h3
                    style={{
                      fontSize: 24,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      color: "var(--paper)",
                    }}
                  >
                    {t.title}
                  </h3>
                  <p
                    style={{
                      marginTop: 12,
                      fontSize: 14.5,
                      lineHeight: 1.7,
                      color: "color-mix(in oklab, var(--paper) 72%, transparent)",
                    }}
                  >
                    {t.body}
                  </p>
                  <div className="row" style={{ marginTop: 18, gap: 6, flexWrap: "wrap" }}>
                    {t.chips.map((c) => (
                      <span
                        key={c}
                        style={{
                          padding: "6px 12px",
                          fontSize: 11.5,
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "0.06em",
                          color: "color-mix(in oklab, var(--paper) 88%, transparent)",
                          border: "1px solid color-mix(in oklab, var(--paper) 18%, transparent)",
                          borderRadius: 999,
                          background: "color-mix(in oklab, var(--paper) 4%, transparent)",
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 6. HOW TO CHOOSE                                                        */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: 32,
              alignItems: "end",
              marginBottom: 40,
              paddingBottom: 28,
              borderBottom: "1px solid var(--line)",
            }}
          >
            <div>
              <div className="eyebrow">How to choose</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                Pick the branch{" "}
                <span
                  className="serif"
                  style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
                >
                  that fits the life.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              The cut-off doesn't decide your branch — your hands do. Four small rules our admissions counsellors share with every family that walks in.
            </p>
          </div>

          <div className="bipe-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
            {PATHWAY_TIPS.map((t) => (
              <article
                key={t.num}
                className="card"
                style={{ padding: 28, position: "relative", overflow: "hidden", background: "var(--white)" }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: -40,
                    top: -40,
                    width: 160,
                    height: 160,
                    borderRadius: "50%",
                    background: "color-mix(in oklab, var(--brand) 6%, transparent)",
                    pointerEvents: "none",
                  }}
                />
                <div style={{ position: "relative" }}>
                  <div
                    className="serif"
                    style={{
                      fontStyle: "italic",
                      fontWeight: 400,
                      fontSize: 56,
                      lineHeight: 0.9,
                      color: "var(--brand)",
                    }}
                  >
                    {t.num}
                  </div>
                  <h3
                    style={{
                      marginTop: 16,
                      fontSize: 17,
                      fontWeight: 700,
                      lineHeight: 1.3,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {t.title}
                  </h3>
                  <p
                    style={{
                      marginTop: 10,
                      color: "var(--ink-2)",
                      fontSize: 13.5,
                      lineHeight: 1.65,
                    }}
                  >
                    {t.body}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div
            style={{
              marginTop: 26,
              padding: "20px 26px",
              borderRadius: 16,
              border: "1px solid var(--line)",
              background: "var(--white)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 18,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--ink-3)",
                }}
              >
                Still unsure?
              </div>
              <div style={{ marginTop: 4, fontWeight: 700, fontSize: 17 }}>
                Talk to a counsellor in your language.
              </div>
            </div>
            <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
              <a
                href={DATA.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa"
              >
                <WhatsAppIcon /> WhatsApp now
              </a>
              <Link href="/campus" className="btn btn-ghost">
                Book a campus visit <ArrowIcon size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 7. FINAL CTA                                                            */}
      {/* ====================================================================== */}
      <section className="section" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <div className="container">
          <div
            style={{
              position: "relative",
              background: "var(--ink)",
              color: "var(--paper)",
              borderRadius: 28,
              overflow: "hidden",
              minHeight: 520,
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.05,
                backgroundImage:
                  "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
                backgroundSize: "72px 72px",
                pointerEvents: "none",
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: -160,
                bottom: -160,
                width: 520,
                height: 520,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, color-mix(in oklab, var(--brand) 55%, transparent), transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                right: -120,
                top: -120,
                width: 380,
                height: 380,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, color-mix(in oklab, var(--accent) 45%, transparent), transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "relative",
                padding: "22px 40px",
                borderBottom: "1px solid color-mix(in oklab, var(--paper) 12%, transparent)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div className="row" style={{ gap: 14, alignItems: "center" }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    boxShadow: "0 0 0 4px color-mix(in oklab, var(--accent) 25%, transparent)",
                    animation: "pulse 2s infinite",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "color-mix(in oklab, var(--paper) 75%, transparent)",
                  }}
                >
                  Branch counselling open · Session 2026-27
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  color: "color-mix(in oklab, var(--paper) 55%, transparent)",
                }}
              >
                BIPE / COURSES · 07
              </div>
            </div>

            <div
              className="bipe-split"
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr",
                gap: 0,
                minHeight: 420,
              }}
            >
              <div
                style={{
                  padding: "64px 56px 56px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                    }}
                  >
                    Pick your branch
                  </div>
                  <h2
                    style={{
                      fontSize: "clamp(48px, 5.4vw, 84px)",
                      lineHeight: 0.96,
                      fontWeight: 600,
                      letterSpacing: "-0.03em",
                      marginTop: 22,
                      color: "var(--paper)",
                    }}
                  >
                    Pick a branch.
                    <br />
                    <span
                      className="serif"
                      style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}
                    >
                      Build
                    </span>{" "}
                    a life.
                  </h2>
                  <p
                    style={{
                      marginTop: 24,
                      fontSize: 18,
                      lineHeight: 1.55,
                      color: "color-mix(in oklab, var(--paper) 72%, transparent)",
                      maxWidth: "44ch",
                    }}
                  >
                    Apply once on JEECUP, choose any of the five branches in counselling, and start the diploma in August. We'll meet you wherever you are in the decision.
                  </p>
                </div>

                <div
                  className="row"
                  style={{ marginTop: 48, gap: 24, flexWrap: "wrap", alignItems: "center" }}
                >
                  {[
                    { num: "16", l: "years" },
                    { num: "1,000+", l: "alumni" },
                    { num: "5", l: "branches" },
                    { num: "1:20", l: "mentor ratio" },
                  ].map((s, i) => (
                    <React.Fragment key={s.l}>
                      <div>
                        <div
                          style={{
                            fontFamily: "var(--font-display, var(--font-serif))",
                            fontStyle: "italic",
                            fontSize: 30,
                            lineHeight: 1,
                            color: "var(--paper)",
                          }}
                        >
                          {s.num}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "color-mix(in oklab, var(--paper) 55%, transparent)",
                            marginTop: 4,
                          }}
                        >
                          {s.l}
                        </div>
                      </div>
                      {i < 3 && (
                        <span
                          style={{
                            width: 1,
                            height: 36,
                            background: "color-mix(in oklab, var(--paper) 14%, transparent)",
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div
                style={{
                  padding: "64px 56px 56px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  justifyContent: "center",
                  borderLeft: "1px solid color-mix(in oklab, var(--paper) 10%, transparent)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "color-mix(in oklab, var(--paper) 55%, transparent)",
                    marginBottom: 8,
                  }}
                >
                  Three ways forward
                </div>

                <Link
                  href="/apply"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 16,
                    alignItems: "center",
                    padding: "22px 24px",
                    borderRadius: 14,
                    background: "var(--paper)",
                    color: "var(--ink)",
                    textDecoration: "none",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>
                    01
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 17 }}>Apply for 2026-27</div>
                    <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
                      4-step form · 5 minutes
                    </div>
                  </div>
                  <ArrowIcon size={18} />
                </Link>

                <a
                  href={DATA.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 16,
                    alignItems: "center",
                    padding: "22px 24px",
                    borderRadius: 14,
                    background: "color-mix(in oklab, var(--paper) 8%, transparent)",
                    border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
                    color: "var(--paper)",
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "color-mix(in oklab, var(--paper) 55%, transparent)",
                    }}
                  >
                    02
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 17 }}>Talk on WhatsApp</div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "color-mix(in oklab, var(--paper) 55%, transparent)",
                        marginTop: 2,
                      }}
                    >
                      Same-day reply · EN / हिं
                    </div>
                  </div>
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "#25D366",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <WhatsAppIcon />
                  </span>
                </a>

                <Link
                  href="/campus"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 16,
                    alignItems: "center",
                    padding: "22px 24px",
                    borderRadius: 14,
                    background: "color-mix(in oklab, var(--paper) 8%, transparent)",
                    border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
                    color: "var(--paper)",
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "color-mix(in oklab, var(--paper) 55%, transparent)",
                    }}
                  >
                    03
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 17 }}>Visit campus</div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "color-mix(in oklab, var(--paper) 55%, transparent)",
                        marginTop: 2,
                      }}
                    >
                      Free shuttle · Varanasi Cantt
                    </div>
                  </div>
                  <ArrowIcon size={18} />
                </Link>

                <div
                  style={{
                    marginTop: 18,
                    paddingTop: 18,
                    borderTop: "1px solid color-mix(in oklab, var(--paper) 10%, transparent)",
                    fontSize: 12,
                    color: "color-mix(in oklab, var(--paper) 55%, transparent)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    Or call{" "}
                    <a
                      href={`tel:${DATA.contact.phone}`}
                      style={{ color: "var(--paper)", textDecoration: "none", fontWeight: 600 }}
                    >
                      <PhoneIcon /> {DATA.contact.phone}
                    </a>
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em" }}>
                    MON–SAT · 9–6
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
