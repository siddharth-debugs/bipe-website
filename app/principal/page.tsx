import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metaFor } from "@/lib/routes";
import { DATA } from "@/lib/data";
import { BIPE_IMG } from "@/lib/images";
import { Img } from "@/components/ui/Img";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";

export const metadata: Metadata = metaFor("principal");

const PROMISES: { roman: string; title: string; sub: string; body: string }[] = [
  {
    roman: "i",
    title: "Fee transparency",
    sub: "AFRC-approved tuition · published in writing",
    body:
      "Annual tuition is ₹30,150 — the AFRC-approved figure, identical for all 5 branches. Every component (admission fee, exam fee, library, caution money) is itemised on the Fees page. Receipts are issued for every rupee.",
  },
  {
    roman: "ii",
    title: "Verifiable approvals",
    sub: "AICTE · BTEUP · ISO · AISHE",
    body:
      "AICTE Permanent ID 1-488233171, EoA F.No. Northern/1-46216893240/2026/EOA dated 16 March 2026. BTEUP/JEECUP code 4455. ISO 9001:2015 certified. AISHE registered. Documents are public; copies on request.",
  },
  {
    roman: "iii",
    title: "Grievance mechanisms",
    sub: "Acknowledged within 7 working days",
    body:
      "Four statutory committees — Anti-Ragging, Internal (POSH), SC/ST and PWD Cell — each with a public point of contact. Email grievance@bipevns.org or write to the Principal's office; complaints are confidential.",
  },
  {
    roman: "iv",
    title: "Outcome accountability",
    sub: "1,000+ verified placements · 16-year record",
    body:
      "We publish placement records, not just photographs. Alumni now serve at Mahindra, Tata Steel, BEL, Indian Railways, Mumbai Metro and dozens more. Government-job admits — SSC JE, RRB JE, UPPCL — are tracked too.",
  },
];

export default function Page() {
  return (
    <div className="page-enter">
      {/* ====================================================================== */}
      {/* 1. HERO PORTRAIT                                                        */}
      {/* ====================================================================== */}
      <section className="section bipe-pad" style={{ position: "relative", overflow: "hidden", paddingTop: 64, paddingBottom: 72 }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "64px 64px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -160, top: -160, width: 460, height: 460, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 26%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 64, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <div style={{
                position: "absolute", inset: -10, borderRadius: 24,
                border: "1px solid var(--line)",
                background: "color-mix(in oklab, var(--brand) 6%, transparent)",
                pointerEvents: "none",
              }} />
              <Img src={BIPE_IMG.principal} label="Rahul Srivastava" aspectRatio="4/5" style={{ borderRadius: 18, position: "relative" }} />
              <div style={{
                position: "absolute", left: 16, bottom: 16, right: 16,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
                color: "color-mix(in oklab, var(--paper) 80%, transparent)",
                pointerEvents: "none",
              }}>
                <span>BIPE / PRINCIPAL · 26</span>
                <span>VARANASI · UP</span>
              </div>
            </div>
            <div>
              <div className="eyebrow">PRINCIPAL · OFFICE OF</div>
              <h1 className="bipe-h1" style={{ marginTop: 16, fontWeight: 500 }}>
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em" }}>
                  Rahul Srivastava.
                </span>
              </h1>
              <p className="lead" style={{ marginTop: 18, maxWidth: "48ch" }}>
                M.Tech · BTEUP-recognised · Principal, BIPE Varanasi. Sixteen years training Eastern UP students into engineers who can hold a tool, read a drawing, and pay for their own life.
              </p>

              <div style={{ marginTop: 28, display: "grid", gap: 10, gridTemplateColumns: "auto 1fr", alignItems: "center" }}>
                <span className="pill" style={{ background: "var(--brand)", color: "#fff" }}>OFFICE</span>
                <a href="mailto:principal@bipevns.org" style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--brand)", fontWeight: 600 }}>
                  principal@bipevns.org
                </a>
                <span className="pill pill-accent">DIRECT</span>
                <a href={`tel:${DATA.contact.phone}`} style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--ink)", fontWeight: 600 }}>
                  {DATA.contact.phone}
                </a>
              </div>

              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                <Link href="/visit" className="btn btn-primary">Book a campus visit <ArrowIcon size={14} /></Link>
                <Link href="/teaching" className="btn btn-ghost">How we teach</Link>
              </div>

              <div className="bipe-stats" style={{ marginTop: 36, paddingTop: 22, borderTop: "1px solid var(--line)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
                {[
                  { num: "16", l: "yrs at BIPE" },
                  { num: "1,000+", l: "placed" },
                  { num: "5", l: "branches" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 36, lineHeight: 0.9, color: "var(--brand)" }}>{s.num}</div>
                    <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-3)" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. PULL QUOTE — full bleed dark                                        */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--ink)", color: "var(--paper)", position: "relative", overflow: "hidden", paddingTop: 96, paddingBottom: 96 }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
          backgroundSize: "72px 72px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
          width: 720, height: 720, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 38%, transparent)",
          filter: "blur(160px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative", textAlign: "center" }}>
          <div className="serif" style={{
            fontStyle: "italic", fontWeight: 400,
            fontSize: 200, lineHeight: 0.7,
            color: "var(--accent)",
            marginBottom: -20,
          }}>
            &ldquo;
          </div>
          <p className="serif" style={{
            fontStyle: "italic", fontWeight: 400,
            fontSize: "clamp(36px, 5.4vw, 80px)",
            lineHeight: 1.05, letterSpacing: "-0.02em",
            color: "var(--paper)",
            maxWidth: "20ch", margin: "0 auto",
          }}>
            AI is not a buzzword &mdash;<br />
            it is the <span style={{ color: "var(--accent)" }}>future</span> of every industry.
          </p>
          <div style={{
            marginTop: 44, display: "inline-flex", alignItems: "center", gap: 14,
            fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
            color: "color-mix(in oklab, var(--paper) 65%, transparent)",
          }}>
            <span style={{ width: 36, height: 1, background: "var(--accent)" }} />
            Rahul Srivastava · Principal · BIPE Varanasi
            <span style={{ width: 36, height: 1, background: "var(--accent)" }} />
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. THE MESSAGE — long form                                             */}
      {/* ====================================================================== */}
      <section className="section" style={{ position: "relative", overflow: "hidden" }}>
        <div className="container">
          <div style={{ maxWidth: "65ch", margin: "0 auto" }}>
            <div className="eyebrow" style={{ textAlign: "center" }}>§ A NOTE FROM THE PRINCIPAL'S DESK</div>
            <h2 className="bipe-h2" style={{ marginTop: 14, textAlign: "center", maxWidth: "20ch", marginInline: "auto" }}>
              To the families of{" "}
              <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                Eastern UP.
              </span>
            </h2>
            <div style={{ marginTop: 44, fontSize: 17, lineHeight: 1.75, color: "var(--ink-2)" }}>
              <p style={{ position: "relative", paddingTop: 4 }}>
                <span className="serif" style={{
                  float: "left",
                  fontStyle: "italic", fontWeight: 400,
                  fontSize: 86, lineHeight: 0.85,
                  color: "var(--brand)",
                  marginRight: 12, marginTop: 4,
                  letterSpacing: "-0.02em",
                }}>
                  S
                </span>
                ixteen years ago, Purwanchal Educational Trust set up BIPE on six acres in Phoolpur with one stated intent &mdash; to build a polytechnic the families of Mau, Ghazipur, Azamgarh, Chandauli, Mirzapur and Varanasi could trust without reservation. We are now in our seventeenth admission cycle. More than a thousand students who once sat in our lecture halls now hold engineering jobs across India.
              </p>
              <p style={{ marginTop: 22 }}>
                When a family in our catchment sends their child to BIPE, they are placing trust in us. We honour that trust with four commitments &mdash; <strong style={{ color: "var(--ink)" }}>fee transparency, verifiable approvals, a working grievance mechanism, and outcome accountability.</strong> Each is enumerated on this site, in writing, and audited annually.
              </p>
              <p style={{ marginTop: 22 }}>
                Our pedagogy is <strong style={{ color: "var(--ink)" }}>Outcome-Based Education</strong>. Every course module is mapped to a Program Outcome; assessment is calibrated against measurable outcomes rather than against attendance alone. We sit our students through BTEUP examinations &mdash; externally evaluated &mdash; and we add continuous formative assessment and panel-reviewed projects on top.
              </p>
              <p style={{ marginTop: 22 }}>
                On <strong style={{ color: "var(--ink)" }}>AI</strong> &mdash; we use it sparingly, under faculty supervision, and we teach our students what it is good for and where it fails. Diploma engineers entering today's workforce will work alongside AI tools in every domain &mdash; from CNC programming to PLC commissioning to dairy plant SCADA. Pretending otherwise is unkind to our students.
              </p>
              <p style={{ marginTop: 22 }}>
                Our students sit in lecture halls, but they also stand at lathes, surveying tripods, dairy pasteurisers and PLC panels. They graduate with a diploma <em>and</em> with hands. Our alumni today work at <strong style={{ color: "var(--ink)" }}>Mahindra, Tata Steel, BEL, Indian Railways, Mumbai Metro, Asian Paints, JCB, Amul, Mother Dairy, Parag and the NDDB</strong>. Several have cleared SSC JE and RRB JE on the first attempt.
              </p>
              <p style={{ marginTop: 22 }}>
                If your family is considering a polytechnic diploma &mdash; whether for industry, for a B.Tech onward, or for SSC JE / RRB JE pathways &mdash; I welcome you to <strong style={{ color: "var(--brand)" }}>visit, talk to current students, and decide for yourself.</strong> The campus is open Monday through Saturday. We will arrange a free shuttle from Varanasi Cantt if you write to us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. PROMISES GRID                                                       */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", left: -160, top: -120, width: 380, height: 380, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 18%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 48, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">§ The four promises</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                What you can{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  hold us to.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Each promise below is verifiable on a single page of this site &mdash; or by writing to the Principal's office for documents on letterhead.
            </p>
          </div>

          <div className="bipe-form-row" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {PROMISES.map((p) => (
              <article key={p.roman} className="card" style={{ padding: 32 }}>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "start" }}>
                  <div className="serif" style={{
                    fontStyle: "italic", fontWeight: 400,
                    fontSize: 56, lineHeight: 0.85,
                    color: "var(--brand)",
                    width: 56, textAlign: "right",
                  }}>
                    ({p.roman})
                  </div>
                  <div>
                    <h3 className="bipe-h3" style={{ fontSize: 22 }}>{p.title}</h3>
                    <div className="eyebrow" style={{ marginTop: 8, color: "var(--brand)" }}>{p.sub}</div>
                    <p style={{ marginTop: 14, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.65 }}>
                      {p.body}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. SIGNATURE CARD                                                       */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div style={{
            position: "relative", overflow: "hidden",
            border: "1px solid var(--line)",
            borderRadius: 24,
            background: "color-mix(in oklab, var(--brand) 6%, var(--paper))",
            padding: "56px 56px",
            maxWidth: 880, margin: "0 auto",
          }}>
            <div aria-hidden="true" style={{
              position: "absolute", right: -120, bottom: -120, width: 320, height: 320, borderRadius: "50%",
              background: "color-mix(in oklab, var(--brand) 22%, transparent)",
              filter: "blur(110px)", pointerEvents: "none",
            }} />
            <div style={{ position: "relative" }}>
              <div className="eyebrow">§ Signed</div>
              <div className="serif" style={{
                fontStyle: "italic", fontWeight: 400,
                fontSize: "clamp(48px, 6vw, 88px)",
                lineHeight: 0.95, letterSpacing: "-0.02em",
                color: "var(--brand)",
                marginTop: 18,
              }}>
                &mdash; Rahul Srivastava
              </div>
              <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Principal · BIPE Varanasi
                </div>
                <a href="mailto:principal@bipevns.org" style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--brand)", fontWeight: 600 }}>
                  principal@bipevns.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 6. CTA PAIR                                                             */}
      {/* ====================================================================== */}
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <div style={{
            position: "relative", overflow: "hidden",
            background: "var(--ink)", color: "var(--paper)",
            borderRadius: 24,
            padding: "48px 56px",
          }}>
            <div aria-hidden="true" style={{
              position: "absolute", inset: 0, opacity: 0.05,
              backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
              backgroundSize: "64px 64px", pointerEvents: "none",
            }} />
            <div aria-hidden="true" style={{
              position: "absolute", right: -120, top: -120, width: 360, height: 360, borderRadius: "50%",
              background: "color-mix(in oklab, var(--accent) 36%, transparent)",
              filter: "blur(120px)", pointerEvents: "none",
            }} />
            <div className="bipe-split" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "center" }}>
              <div>
                <div className="eyebrow" style={{ color: "var(--accent)" }}>§ MEET THE PRINCIPAL</div>
                <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", lineHeight: 1.1, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 14, color: "var(--paper)" }}>
                  Walk in. Ask anything.{" "}
                  <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                    Mon&ndash;Sat, 9&ndash;6.
                  </span>
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Link href="/visit" className="btn btn-lg" style={{ background: "var(--accent)", color: "var(--ink)", justifyContent: "space-between" }}>
                  Book a campus visit <ArrowIcon size={16} />
                </Link>
                <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-wa" style={{ justifyContent: "space-between" }}>
                  Talk on WhatsApp <WhatsAppIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
