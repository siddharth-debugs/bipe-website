import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metaFor } from "@/lib/routes";
import { DATA } from "@/lib/data";
import { BIPE_IMG } from "@/lib/images";
import { Img } from "@/components/ui/Img";
import { Counter } from "@/components/ui/Counter";
import { ArrowIcon, WhatsAppIcon, PhoneIcon } from "@/components/shell/Icons";

export const metadata: Metadata = metaFor("faculty");

const DEPARTMENTS: { name: string; count: number; note: string }[] = [
  { name: "Computer Science Engineering", count: 6, note: "Headed by HOD — CS · 120-PC lab" },
  { name: "Civil Engineering", count: 5, note: "Survey yard, soil and concrete labs" },
  { name: "Electrical Engineering", count: 5, note: "Machines, PLC, renewables" },
  { name: "Mechanical Engineering", count: 6, note: "Production + Automobile streams" },
  { name: "Dairy Engineering", count: 3, note: "Rare faculty cluster — pilot plant" },
  { name: "Applied Sciences & Humanities", count: 5, note: "Maths, Physics, Chemistry, English" },
  { name: "Workshop & Practical Training", count: 3, note: "Welding, foundry, machining" },
];
const TOTAL = DEPARTMENTS.reduce((a, d) => a + d.count, 0);

const DEV: { eyebrow: string; title: string; body: string }[] = [
  {
    eyebrow: "AICTE FDP",
    title: "Faculty Development Programmes",
    body: "Faculty regularly attend AICTE-sponsored FDPs in pedagogy, outcome-based education and emerging technologies. Certificates and content flow back into BIPE classrooms each semester.",
  },
  {
    eyebrow: "INDUSTRY",
    title: "Industry training & visits",
    body: "CII workshops, Engineers&rsquo; Day participation, manufacturing-floor exposure visits. Faculty teach what they have seen running, not only what is on the page.",
  },
  {
    eyebrow: "RESEARCH",
    title: "Research & publications",
    body: "Conference proceedings, journal contributions, BTEUP committee work. Departmental research is folded into student project guidance and final-year submissions.",
  },
];

const PHOTOS: { img: string; eyebrow: string; caption: string }[] = [
  { img: BIPE_IMG.industryVisit, eyebrow: "CII INDUSTRY VISIT · 2019", caption: "Faculty cohort at the regional CII workshop." },
  { img: BIPE_IMG.engineersDay, eyebrow: "ENGINEERS&rsquo; DAY · 2019", caption: "Engineers&rsquo; Day · annual technical observance." },
  { img: BIPE_IMG.facultyMeet, eyebrow: "INDUSTRY-READY WORKSHOP · 2025", caption: "Industry-Ready Workshop, 2025 · pedagogy refresh." },
];

export default function Page() {
  return (
    <div className="page-enter">
      {/* ====================================================================== */}
      {/* 1. HERO                                                                 */}
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
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div className="eyebrow">§ Faculty</div>
              <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "20ch" }}>
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  Thirty-three
                </span>{" "}
                mentors. One ratio: 1:20.
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "54ch" }}>
                Every faculty member at BIPE personally mentors twenty students through the full diploma — with periodic home visits to parents in Mau, Ghazipur, Azamgarh and beyond. All thirty-three are BTEUP-recognised.
              </p>
              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                <Link href="/visit" className="btn btn-primary btn-lg">Visit on a teaching day <ArrowIcon size={16} /></Link>
                <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa"><WhatsAppIcon /> WhatsApp admissions</a>
              </div>
              <div style={{ marginTop: 36, paddingTop: 20, borderTop: "1px solid var(--line)", display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Across &rarr;
                </span>
                {["7 departments", "BTEUP-recognised", "AICTE FDP-trained"].map((t, i) => (
                  <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 14, fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 17, color: "var(--ink-2)" }}>
                    {t}
                    {i < 2 && <span style={{ width: 4, height: 4, borderRadius: 999, background: "var(--accent)" }} />}
                  </span>
                ))}
              </div>
            </div>

            {/* Vertical stat stack */}
            <div style={{ display: "grid", gap: 14 }}>
              {[
                { num: "33", suffix: "", lbl: "Faculty", sub: "All BTEUP-recognised" },
                { num: "1", suffix: ":20", lbl: "Mentor : student", sub: "Across the diploma" },
                { num: "2", suffix: "", lbl: "Home visits", sub: "Per semester · per cohort" },
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
                      fontStyle: "italic", fontWeight: 400,
                      fontSize: 64, lineHeight: 0.9, color: "var(--brand)",
                    }}>
                      <Counter to={s.num} />{s.suffix}
                    </span>
                  </div>
                  <div style={{ position: "relative" }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{s.lbl}</div>
                    <div className="muted" style={{ fontSize: 12.5, marginTop: 4, fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. DEPARTMENT BREAKDOWN                                                 */}
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
              <div className="eyebrow">§ Seven departments</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                Where the{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  thirty-three
                </span>{" "}
                sit.
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Department headcounts as of the 2026 Mandatory Disclosure. Individual faculty roster lives in Annexure-18 of that PDF.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {DEPARTMENTS.map((d) => (
              <article key={d.name} className="card" style={{ padding: 24, position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{
                  position: "absolute", right: -40, top: -40, width: 140, height: 140, borderRadius: "50%",
                  background: "color-mix(in oklab, var(--brand) 8%, transparent)",
                }} />
                <div style={{ position: "relative" }}>
                  <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 56, lineHeight: 0.9, color: "var(--brand)" }}>
                    {String(d.count).padStart(2, "0")}
                  </div>
                  <div className="eyebrow" style={{ marginTop: 12, color: "var(--brand)" }}>Faculty</div>
                  <h3 className="bipe-h3" style={{ marginTop: 6, fontSize: 17 }}>{d.name}</h3>
                  <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 13, lineHeight: 1.6 }}>{d.note}</p>
                </div>
              </article>
            ))}
            {/* Total card */}
            <article style={{ padding: 24, borderRadius: 18, background: "var(--ink)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
              <div aria-hidden="true" style={{
                position: "absolute", right: -50, top: -50, width: 180, height: 180, borderRadius: "50%",
                background: "color-mix(in oklab, var(--accent) 36%, transparent)",
                filter: "blur(50px)",
              }} />
              <div style={{ position: "relative" }}>
                <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 72, lineHeight: 0.9, color: "var(--accent)" }}>
                  <Counter to={String(TOTAL)} />
                </div>
                <div className="eyebrow" style={{ marginTop: 12, color: "var(--accent)" }}>Total</div>
                <h3 className="bipe-h3" style={{ marginTop: 6, fontSize: 17, color: "var(--paper)" }}>BIPE faculty</h3>
                <p style={{ marginTop: 10, color: "color-mix(in oklab, var(--paper) 70%, transparent)", fontSize: 13, lineHeight: 1.6 }}>
                  Across seven departments — see Annexure-18 for names, qualifications and years of experience.
                </p>
              </div>
            </article>
          </div>

          {/* TODO: Individual faculty roster — names, qualifications, years of experience — lives in the AICTE Mandatory Disclosure (Annexure-18). Pull once the disclosure PDF is digitised into structured rows. */}
          <p className="muted" style={{ marginTop: 22, fontSize: 13, maxWidth: "70ch" }}>
            The individual faculty roster — names, qualifications and years of experience — is published in Annexure-18 of the AICTE Mandatory Disclosure.
            {" "}
            <Link href="/approvals" style={{ color: "var(--brand)", fontWeight: 600 }}>See Approvals &amp; downloads &rarr;</Link>
          </p>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. WHAT 1:20 MEANS — DARK EDITORIAL                                     */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--ink)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
          backgroundSize: "72px 72px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -180, top: -120, width: 460, height: 460, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 50%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: -120, bottom: -160, width: 380, height: 380, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 38%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 56, alignItems: "center" }}>
            {/* Rotated label */}
            <div style={{
              writingMode: "vertical-rl", transform: "rotate(180deg)",
              fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase",
              color: "color-mix(in oklab, var(--paper) 55%, transparent)",
            }}>
              Mentorship · BIPE
            </div>

            {/* Center — huge ratio */}
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>§ The 1:20 promise</div>
              <div className="serif" style={{
                marginTop: 14, fontStyle: "italic", fontWeight: 400,
                fontSize: "clamp(120px, 13vw, 200px)", lineHeight: 0.85,
                color: "var(--paper)", letterSpacing: "-0.04em",
              }}>
                1<span style={{ color: "var(--accent)" }}>:</span>20
              </div>
              <div style={{ marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 60%, transparent)" }}>
                Mentor : student
              </div>
              <p style={{ marginTop: 22, fontSize: 16, lineHeight: 1.7, color: "color-mix(in oklab, var(--paper) 80%, transparent)", maxWidth: "44ch" }}>
                Each mentor sits with the same twenty students for the full diploma — coursework support, project guidance, parent meetings off-campus, and a phone that does not stop ringing in the week before exams.
              </p>
            </div>

            {/* Right column — three small stats */}
            <div style={{ display: "grid", gap: 14 }}>
              {[
                { n: "2", lbl: "Home visits / sem", sub: "Off-campus, with parents" },
                { n: "60", lbl: "Cohort average", sub: "3 mentors per branch" },
                { n: "45+", lbl: "Years combined exp.", sub: "HOD-level seniority" },
              ].map((s) => (
                <div key={s.lbl} style={{
                  padding: "18px 20px",
                  background: "color-mix(in oklab, var(--paper) 6%, transparent)",
                  border: "1px solid color-mix(in oklab, var(--paper) 16%, transparent)",
                  borderRadius: 14,
                }}>
                  <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 40, lineHeight: 0.9, color: "var(--accent)" }}>{s.n}</div>
                  <div style={{ marginTop: 10, fontWeight: 600, fontSize: 14, color: "var(--paper)" }}>{s.lbl}</div>
                  <div style={{ marginTop: 4, fontSize: 12, color: "color-mix(in oklab, var(--paper) 64%, transparent)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. FACULTY DEVELOPMENT                                                  */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 48, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">§ Faculty development</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "18ch" }}>
                The classroom{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  refreshes itself.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Three streams keep the faculty current — pedagogy, industry, research. Each shows up in the next semester&rsquo;s lesson plans.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
            {DEV.map((d) => (
              <article key={d.title} className="card" style={{ padding: 28, position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{
                  position: "absolute", right: -40, top: -40, width: 140, height: 140, borderRadius: "50%",
                  background: "color-mix(in oklab, var(--brand) 8%, transparent)",
                }} />
                <div style={{ position: "relative" }}>
                  <div className="eyebrow" style={{ color: "var(--brand)" }}>{d.eyebrow}</div>
                  <h3 className="bipe-h3" style={{ marginTop: 8, fontSize: 21 }}>{d.title}</h3>
                  <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: d.body }} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. PHOTOS IN LIEU OF ROSTER                                             */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">§ In the field</div>
          <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "20ch", marginBottom: 36 }}>
            Faculty,{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              outside the classroom.
            </span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {PHOTOS.map((p) => (
              <figure key={p.eyebrow} style={{ margin: 0 }}>
                <Img src={p.img} label={p.eyebrow.replace("&rsquo;", "'")} style={{ height: 280, borderRadius: 16 }} />
                <figcaption style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", color: "var(--ink-3)", textTransform: "uppercase" }} dangerouslySetInnerHTML={{ __html: p.caption }} />
              </figure>
            ))}
          </div>
          <div style={{
            marginTop: 28, padding: "20px 24px",
            background: "var(--white)", border: "1px solid var(--line)", borderRadius: 14,
            display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ fontSize: 14, color: "var(--ink-2)", maxWidth: "60ch" }}>
              The full faculty roster — names, qualifications and years of experience — is published in Annexure-18 of the AICTE Mandatory Disclosure.
            </div>
            <Link href="/approvals" className="btn btn-ghost btn-sm">
              See Approvals & downloads <ArrowIcon size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 6. CTA                                                                  */}
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
            <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, alignItems: "center" }}>
              <div>
                <div className="eyebrow">§ Meet a mentor</div>
                <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                  Visit on a{" "}
                  <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                    teaching day.
                  </span>
                </h2>
                <p className="lead" style={{ marginTop: 18, maxWidth: "44ch" }}>
                  We will pair you with a mentor from the branch you are considering. Sit in on a class. Ask the questions a brochure cannot answer.
                </p>
                <div style={{ marginTop: 22, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
                  <a href={`tel:${DATA.contact.phone}`} className="btn btn-ghost btn-sm">
                    <PhoneIcon /> {DATA.contact.phone}
                  </a>
                  <a href={`tel:${DATA.contact.phone2}`} className="btn btn-ghost btn-sm">
                    <PhoneIcon /> {DATA.contact.phone2}
                  </a>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Link href="/visit" style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                  padding: "20px 22px", borderRadius: 14,
                  background: "var(--brand)", color: "#fff", textDecoration: "none",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "color-mix(in oklab, #fff 65%, transparent)" }}>01</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Visit on a teaching day</div>
                    <div style={{ fontSize: 12, color: "color-mix(in oklab, #fff 70%, transparent)", marginTop: 2 }}>Mon–Sat · paired with a mentor</div>
                  </div>
                  <ArrowIcon size={16} />
                </Link>
                <Link href="/courses" style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                  padding: "20px 22px", borderRadius: 14,
                  background: "var(--ink)", color: "var(--paper)", textDecoration: "none",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "color-mix(in oklab, var(--paper) 55%, transparent)" }}>02</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Explore departments</div>
                    <div style={{ fontSize: 12, color: "color-mix(in oklab, var(--paper) 60%, transparent)", marginTop: 2 }}>10 BTEUP-licensed branches</div>
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
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Ask about a department</div>
                    <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>WhatsApp · same-day reply</div>
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
