import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metadataFor } from "@/lib/seo";
import { BIPE_IMG } from "@/lib/images";
import { Img } from "@/components/ui/Img";
import { ArrowIcon } from "@/components/shell/Icons";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("teaching"); }

const PILLARS: { num: string; eyebrow: string; title: string; body: string }[] = [
  {
    num: "01",
    eyebrow: "LAYER ONE · STATE BOARD",
    title: "BTEUP semester examinations",
    body: "Externally set and externally evaluated by the Board of Technical Education, UP. The unbiased anchor that keeps every diploma comparable across the state.",
  },
  {
    num: "02",
    eyebrow: "LAYER TWO · CONTINUOUS",
    title: "Formative assessment",
    body: "Class tests, weekly assignments, lab journals, viva-voce. Calibrated against published Program Outcomes — every quiz is mapped to a PO, not invented for the day.",
  },
  {
    num: "03",
    eyebrow: "LAYER THREE · APPLIED",
    title: "Project & lab work",
    body: "Real industry briefs from regional employers. Faculty mentor + external panel review at end of every semester. The tier where employability gets built.",
  },
];

const AI_PRINCIPLES: { n: string; t: string; b: string }[] = [
  { n: "01", t: "Faculty First", b: "Faculty are the primary teachers. AI is a supplement, never a substitute. The teacher in the room is the responsible adult." },
  { n: "02", t: "Privacy by Default", b: "No student data is entered into third-party AI tools without consent. Faculty use sandboxed workflows for assessment-related work." },
  { n: "03", t: "AI Literacy", b: "Students learn how AI works, where it fails, and how to verify outputs. We teach the limits, not just the prompts." },
  { n: "04", t: "Faculty Review", b: "Any AI-assisted submission is reviewed by faculty before grading. AI never bypasses the teacher in the loop." },
  { n: "05", t: "Annual Review", b: "Policy reviewed annually — last reviewed 2026, next 2027. Updates published on this page with version notes." },
];

const LAB_TILES: { src: string; label: string; caption: string }[] = [
  { src: BIPE_IMG.civil, label: "Civil survey yard", caption: "Total stations · theodolites" },
  { src: BIPE_IMG.electrical, label: "Electrical machines", caption: "12 benches · controls" },
  { src: BIPE_IMG.workshop, label: "Mechanical shops", caption: "Welding · fitting · foundry" },
  { src: BIPE_IMG.automobile, label: "Automobile lab", caption: "EV battery · motor controllers" },
  { src: BIPE_IMG.cncLab, label: "CNC workshop", caption: "Programming · operation" },
];

export default function Page() {
  return (
    <div className="page-enter">
      {/* ====================================================================== */}
      {/* 1. HERO                                                                  */}
      {/* ====================================================================== */}
      <section className="section bipe-pad" style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 72 }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "64px 64px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -160, top: -120, width: 460, height: 460, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 24%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div className="eyebrow">TEACHING · LEARNING</div>
              <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "16ch" }}>
                How we teach.{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  And what students become.
                </span>
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "52ch" }}>
                The pedagogy we use to take a 10th-pass aspirant from rural India and turn them, in three years, into a diploma engineer who can hold a tool, read a drawing, run a small team and walk into an employer's interview without translation.
              </p>
              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                <Link href="/courses" className="btn btn-primary">Explore courses <ArrowIcon size={14} /></Link>
                <Link href="/visit" className="btn btn-ghost">Book a campus visit</Link>
              </div>

              <div className="bipe-stats" style={{
                marginTop: 36, paddingTop: 22, borderTop: "1px solid var(--line)",
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18,
              }}>
                {[
                  { num: "32", l: "labs & workshops" },
                  { num: "1:20", l: "mentor : student" },
                  { num: "3-tier", l: "assessment" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 38, lineHeight: 0.9, color: "var(--brand)" }}>{s.num}</div>
                    <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-3)" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bipe-collage" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 14, height: 540 }}>
              <Img src={BIPE_IMG.weldingHands} label="Workshop · welding" style={{ gridRow: "1 / 3", borderRadius: 18, height: "100%" }} />
              <Img src={BIPE_IMG.computerLab} label="120-PC lab" style={{ borderRadius: 18, height: "100%" }} />
              <Img src={BIPE_IMG.surveying} label="Survey camp" style={{ borderRadius: 18, height: "100%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. OUTCOME-BASED EDUCATION                                              */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", left: -160, bottom: -160, width: 380, height: 380, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 16%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 56, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">Outcome-based education</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                Three layers.{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  One outcome.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Every course module is mapped to a published Program Outcome. Assessment is calibrated against those outcomes — progress is measured, not merely attended.
            </p>
          </div>

          <div className="bipe-grid-3" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {/* Connecting line */}
            <div aria-hidden="true" style={{
              position: "absolute", left: "16.6%", right: "16.6%", top: 92,
              height: 1, background: "var(--line-2)",
              pointerEvents: "none",
            }} />

            {PILLARS.map((p, i) => (
              <article key={p.num} className="card" style={{ padding: 30, position: "relative", background: "var(--white)" }}>
                <div className="serif" style={{
                  fontStyle: "italic", fontWeight: 400,
                  fontSize: 88, lineHeight: 0.85,
                  color: "var(--brand)", letterSpacing: "-0.02em",
                }}>
                  {p.num}
                </div>
                <div className="eyebrow" style={{ marginTop: 14, color: "var(--brand)" }}>{p.eyebrow}</div>
                <h3 className="bipe-h3" style={{ marginTop: 8, fontSize: 22 }}>{p.title}</h3>
                <p style={{ marginTop: 14, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.65 }}>{p.body}</p>

                {/* Pin on connector */}
                {i < PILLARS.length - 1 && (
                  <span aria-hidden="true" style={{
                    position: "absolute", right: -14, top: 84,
                    width: 28, height: 28, borderRadius: "50%",
                    background: "var(--brand)", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 14px color-mix(in oklab, var(--brand) 50%, transparent)",
                    zIndex: 2,
                  }}>
                    <ArrowIcon size={12} />
                  </span>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. MENTORSHIP — featured dark band                                     */}
      {/* ====================================================================== */}
      <section className="section" style={{ position: "relative" }}>
        <div className="container">
          <div style={{
            position: "relative", overflow: "hidden",
            background: "var(--ink)", color: "var(--paper)",
            borderRadius: 24,
            padding: "56px 56px 48px",
          }}>
            <div aria-hidden="true" style={{
              position: "absolute", inset: 0, opacity: 0.06,
              backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
              backgroundSize: "56px 56px", pointerEvents: "none",
            }} />
            <div aria-hidden="true" style={{
              position: "absolute", right: -120, top: -120, width: 380, height: 380, borderRadius: "50%",
              background: "color-mix(in oklab, var(--brand) 50%, transparent)",
              filter: "blur(140px)", pointerEvents: "none",
            }} />

            <div className="bipe-split" style={{ position: "relative", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 48, alignItems: "center" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", color: "var(--accent)", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                SIGNATURE COMMITMENT · MENTORSHIP
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginBottom: 18 }}>
                  <div className="serif" style={{
                    fontStyle: "italic", fontWeight: 400,
                    fontSize: "clamp(72px, 9vw, 132px)",
                    lineHeight: 0.85,
                    color: "var(--accent)",
                    letterSpacing: "-0.02em",
                  }}>
                    1:20
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 60%, transparent)" }}>
                    MENTOR : STUDENT
                  </div>
                </div>
                <h3 style={{ fontSize: 34, lineHeight: 1.1, fontWeight: 600, letterSpacing: "-0.02em", maxWidth: "22ch" }}>
                  One mentor. Twenty students.{" "}
                  <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>Home visits.</span>
                </h3>
                <p style={{ marginTop: 18, color: "color-mix(in oklab, var(--paper) 75%, transparent)", fontSize: 16, lineHeight: 1.65, maxWidth: "58ch" }}>
                  Each faculty member personally mentors a cohort of 20 students for the entire diploma. Mentors make periodic home visits to parents in Mau, Ghazipur, Azamgarh and beyond. Families have asked for this; BIPE delivers it. The institution, the parent and the student function as one unit. No student falls through.
                </p>
                {/* "How mentoring works" button removed 28 May 2026 --
                    it used to link to /about (mismatch — /about is the
                    institute overview, not a mentoring-methodology
                    deep-dive). The mentoring methodology is the
                    paragraph immediately above, so a second button
                    pointing somewhere else is redundant. "Meet our
                    mentors" stays — it leads to the faculty list. */}
                <div className="row" style={{ marginTop: 26, gap: 14 }}>
                  <Link href="/faculty" className="btn" style={{ background: "var(--paper)", color: "var(--ink)" }}>Meet our mentors <ArrowIcon size={14} /></Link>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 32, borderLeft: "1px solid color-mix(in oklab, var(--paper) 18%, transparent)" }}>
                {[
                  { k: "Faculty", v: "40" },
                  { k: "Visits / sem", v: "2" },
                  { k: "Avg cohort", v: "60" },
                ].map((s) => (
                  <div key={s.k} style={{ padding: "14px 0" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", color: "color-mix(in oklab, var(--paper) 55%, transparent)", textTransform: "uppercase" }}>{s.k}</div>
                    <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 32, marginTop: 6, color: "var(--paper)", lineHeight: 1 }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. HANDS-ON TRAINING — image mosaic                                     */}
      {/* ====================================================================== */}
      <section className="section" style={{ position: "relative", overflow: "hidden" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 36 }}>
            <div>
              <div className="eyebrow">Hands-on training</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "20ch" }}>
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>32</span>{" "}
                laboratories and workshops.
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Civil surveying, electrical machines, mechanical shops, automotive bays, dairy pilot plant, the 120-system computer lab. Every diploma student logs lab hours every semester.
            </p>
          </div>

          {/* Mosaic */}
          <div className="bipe-collage" style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr",
            gridTemplateRows: "260px 240px",
            gap: 14,
          }}>
            {/* Tile 1 — wide tall */}
            <div style={{ gridRow: "1 / 3", position: "relative", borderRadius: 18, overflow: "hidden" }}>
              <Img src={LAB_TILES[2].src} label={LAB_TILES[2].label} style={{ position: "absolute", inset: 0, height: "100%", borderRadius: 18 }} />
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0,
                padding: "20px 22px",
                background: "linear-gradient(to top, rgba(10,26,63,0.85), transparent)",
                color: "var(--paper)",
              }}>
                <div className="eyebrow" style={{ color: "var(--accent)" }}>FEATURED · WORKSHOP</div>
                <div style={{ marginTop: 6, fontWeight: 600, fontSize: 22, letterSpacing: "-0.01em" }}>{LAB_TILES[2].label}</div>
                <div style={{ marginTop: 4, fontSize: 13, color: "color-mix(in oklab, var(--paper) 75%, transparent)" }}>{LAB_TILES[2].caption}</div>
              </div>
            </div>
            {/* Tiles 2, 3, 4, 5 */}
            {[LAB_TILES[0], LAB_TILES[1], LAB_TILES[3], LAB_TILES[4]].map((t) => (
              <div key={t.label} style={{ position: "relative", borderRadius: 14, overflow: "hidden" }}>
                <Img src={t.src} label="" alt={t.label} style={{ position: "absolute", inset: 0, height: "100%", borderRadius: 14 }} />
                <div style={{
                  position: "absolute", left: 0, right: 0, bottom: 0,
                  padding: "12px 14px",
                  background: "linear-gradient(to top, rgba(10,26,63,0.85), transparent)",
                  color: "var(--paper)",
                }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{t.label}</div>
                  <div style={{ marginTop: 2, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", color: "color-mix(in oklab, var(--paper) 75%, transparent)", textTransform: "uppercase" }}>{t.caption}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Skill chips */}
          <div style={{ marginTop: 32, padding: "20px 24px", borderRadius: 16, border: "1px solid var(--line)", background: "var(--paper-2)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-3)" }}>
              Skills students leave with &rarr;
            </span>
            {["Welding", "Fitting", "CNC programming", "AutoCAD", "PLC / SCADA", "Surveying", "EV battery service", "Dairy processing", "Power systems"].map((s, i) => (
              <React.Fragment key={s}>
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 16, color: "var(--ink)" }}>{s}</span>
                {i < 8 && <span style={{ width: 4, height: 4, borderRadius: 999, background: "var(--accent)" }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. AI POLICY — 5 principles                                            */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", right: -160, top: -120, width: 380, height: 380, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 22%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 40, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">AI policy</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                AI augments learning.{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  It never replaces faculty.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Five principles, reviewed annually, that govern how AI tools enter the classroom — and how they don't.
            </p>
          </div>

          <div className="bipe-grid-4" style={{
            display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
            border: "1px solid var(--line)", borderRadius: 24, overflow: "hidden",
            background: "var(--white)",
          }}>
            {AI_PRINCIPLES.map((p, i) => (
              <div key={p.n} style={{
                padding: "32px 24px",
                borderRight: i < AI_PRINCIPLES.length - 1 ? "1px solid var(--line)" : "none",
                position: "relative",
              }}>
                <div className="serif" style={{
                  fontStyle: "italic", fontWeight: 400,
                  fontSize: 64, lineHeight: 0.85,
                  color: "var(--brand)", letterSpacing: "-0.02em",
                }}>
                  {p.n}
                </div>
                <h3 style={{ marginTop: 16, fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em" }}>{p.t}</h3>
                <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 13, lineHeight: 1.6 }}>{p.b}</p>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 24, padding: "16px 24px",
            borderRadius: 16, background: "var(--ink)", color: "var(--paper)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span className="pill" style={{ background: "var(--accent)", color: "var(--ink)" }}>COMPLIANT</span>
              <span style={{ fontWeight: 600 }}>AICTE Annexure-18</span>
              <span style={{ color: "color-mix(in oklab, var(--paper) 60%, transparent)", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.06em" }}>· last reviewed 2026 · next 2027</span>
            </div>
            <Link href="/approvals" style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              See full disclosure &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 6. INDUSTRY EXPOSURE                                                   */}
      {/* ====================================================================== */}
      <section className="section" style={{ position: "relative" }}>
        <div className="container">
          <div className="eyebrow">Beyond the classroom</div>
          <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "20ch", marginBottom: 32 }}>
            Industry exposure that makes a{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>resume</span>.
          </h2>
          <div className="bipe-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              {
                eyebrow: "AICTE-MANDATED",
                title: "Internships",
                body: "Every BIPE student completes the AICTE-mandated internship at a regional employer — a manufacturing unit, dairy plant, infra contractor or utility — supervised by a faculty mentor.",
              },
              {
                eyebrow: "FIELD WORK",
                title: "Industry site visits",
                body: "Periodic visits to manufacturing units and dairies — RR, BLW, PHD, Sort String among the regular hosts. Drawings come alive when students stand on the slab.",
              },
              {
                eyebrow: "WRITTEN OUTPUT",
                title: "Faculty research",
                body: "Faculty publish in peer-reviewed venues. Senior students are involved in ongoing projects — an early apprenticeship in technical writing and the engineering literature.",
              },
            ].map((c) => (
              <article key={c.title} className="card" style={{ padding: 28 }}>
                <div className="eyebrow" style={{ color: "var(--brand)" }}>{c.eyebrow}</div>
                <h3 className="bipe-h3" style={{ marginTop: 10, fontSize: 22 }}>{c.title}</h3>
                <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.65 }}>{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 7. CTA                                                                  */}
      {/* ====================================================================== */}
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div style={{
            position: "relative", overflow: "hidden",
            background: "var(--ink)", color: "var(--paper)",
            borderRadius: 28,
            padding: "56px 56px",
          }}>
            <div aria-hidden="true" style={{
              position: "absolute", inset: 0, opacity: 0.05,
              backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
              backgroundSize: "64px 64px", pointerEvents: "none",
            }} />
            <div aria-hidden="true" style={{
              position: "absolute", left: -160, bottom: -160, width: 480, height: 480, borderRadius: "50%",
              background: "color-mix(in oklab, var(--brand) 50%, transparent)",
              filter: "blur(140px)", pointerEvents: "none",
            }} />
            <div className="bipe-split" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "center" }}>
              <div>
                <div className="eyebrow" style={{ color: "var(--accent)" }}>Ready when you are</div>
                <h2 style={{ fontSize: "clamp(34px, 4vw, 56px)", lineHeight: 1.05, fontWeight: 600, letterSpacing: "-0.025em", marginTop: 14, color: "var(--paper)", maxWidth: "16ch" }}>
                  Three years.{" "}
                  <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                    A working engineer.
                  </span>
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Link href="/courses" className="btn btn-lg" style={{ background: "var(--accent)", color: "var(--ink)", justifyContent: "space-between" }}>
                  Explore courses <ArrowIcon size={16} />
                </Link>
                <Link href="/visit" className="btn btn-lg" style={{ background: "color-mix(in oklab, var(--paper) 8%, transparent)", color: "var(--paper)", border: "1px solid color-mix(in oklab, var(--paper) 22%, transparent)", justifyContent: "space-between" }}>
                  Book a campus visit <ArrowIcon size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
