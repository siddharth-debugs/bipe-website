import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metaFor } from "@/lib/routes";
import { DATA } from "@/lib/data";
import { BIPE_IMG } from "@/lib/images";
import { Img } from "@/components/ui/Img";
import { ArrowIcon, WhatsAppIcon, PhoneIcon } from "@/components/shell/Icons";

export const metadata: Metadata = metaFor("jeecup");

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Register on JEECUP portal",
    body: "Visit jeecup.admissions.nic.in and create a candidate profile with a personal email and a working mobile number. Keep both accessible — every notification lands there.",
  },
  {
    n: "02",
    title: "Pay application fee",
    body: "Roughly ₹300–500 depending on category — paid online during registration. SC/ST candidates pay the lower slab.",
  },
  {
    n: "03",
    title: "Sit the entrance exam",
    body: "Computer-based test in May 2026, multiple shifts. BIPE&rsquo;s 3-year diploma uses Group A — Class-10-pass with Maths and Science. Syllabus is Class-10 Maths and Science.",
  },
  {
    n: "04",
    title: "Get your rank card",
    body: "Results are expected on 30 May 2026. Save the rank card — it is the single document that decides everything that follows in counselling.",
  },
  {
    n: "05",
    title: "Choose code 4455",
    body: "During online choice-filling, add BIPE (institute code 4455) and your branch preferences in priority order. Listing more branches improves seat odds.",
  },
  {
    n: "06",
    title: "Verification at BIPE",
    body: "Once a seat is allotted, report to BIPE for document verification within the deadline. Originals plus 2 self-attested copies — the Documents page lists everything.",
  },
];

const PITFALLS: { roman: string; title: string; body: string }[] = [
  {
    roman: "i",
    title: "Listing only one branch",
    body: "JEECUP allotment depends on rank, seats and how flexibly you fill choices. Listing a single branch can leave you without a seat even when better-ranked branches were open. List five to ten in order of preference.",
  },
  {
    roman: "ii",
    title: "Missing document deadlines",
    body: "Migration certificates, caste certificates and income certificates take days at the tehsil. Begin paperwork the day you sit the exam — not the day you get the rank card.",
  },
  {
    roman: "iii",
    title: "Skipping verification",
    body: "An allotted seat is not a confirmed seat. You must physically report to BIPE with originals within the published window or the seat lapses to the next round.",
  },
  {
    roman: "iv",
    title: "Confusing JEECUP with JEE / CUET",
    body: "JEE Main is for B.Tech engineering. CUET is for central universities. JEECUP is the only route into a UP polytechnic — different exam, different syllabus, different calendar.",
  },
];

const PREP: { num: string; doc: string; sub: string }[] = [
  { num: "01", doc: "JEECUP rank card", sub: "Downloaded · printed × 3" },
  { num: "02", doc: "Class 10 marksheet", sub: "Original + 2 self-attested copies" },
  { num: "03", doc: "Photo ID — Aadhaar", sub: "Original + 2 self-attested copies" },
  { num: "04", doc: "Category certificate", sub: "If applicable · SC/ST/OBC/EWS" },
  { num: "05", doc: "Passport photographs", sub: "8 copies · same recent sitting" },
  { num: "06", doc: "Anti-ragging undertaking", sub: "Signed by student & parent" },
];

export default function Page() {
  return (
    <div className="page-enter">
      {/* ====================================================================== */}
      {/* 1. HERO — giant 4455                                                    */}
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
        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div className="eyebrow">JEECUP guidance</div>
              <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "16ch" }}>
                Your{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  map
                </span>{" "}
                through JEECUP.
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "54ch" }}>
                JEECUP — the UP Joint Entrance Examination for Polytechnic — is the single state-wide counselling route to BIPE. Six steps from your kitchen table to a confirmed seat in Phoolpur.
              </p>
              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                <a href="https://jeecup.admissions.nic.in" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                  JEECUP portal <ArrowIcon size={16} />
                </a>
                <Link href="/apply" className="btn btn-ghost btn-lg">Begin application</Link>
              </div>
              <div className="bipe-stats" style={{ marginTop: 36, paddingTop: 22, borderTop: "1px solid var(--line)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
                {[
                  { num: "6", l: "Counselling steps" },
                  { num: "May", l: "Exam window" },
                  { num: "Aug", l: "Classes begin" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 36, lineHeight: 0.9, color: "var(--brand)" }}>{s.num}</div>
                    <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-3)" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Giant 4455 */}
            <div style={{
              position: "relative", overflow: "hidden",
              borderRadius: 24,
              border: "1px solid var(--line)",
              background: "color-mix(in oklab, var(--brand) 8%, var(--white))",
              padding: "48px 36px",
              minHeight: 380,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <div aria-hidden="true" style={{
                position: "absolute", right: -100, bottom: -120, width: 360, height: 360, borderRadius: "50%",
                background: "color-mix(in oklab, var(--brand) 26%, transparent)",
                filter: "blur(100px)", pointerEvents: "none",
              }} />
              <div style={{ position: "relative" }}>
                <div className="eyebrow" style={{ color: "var(--brand)" }}>BIPE JEECUP CODE</div>
                <div className="serif" style={{
                  fontStyle: "italic", fontWeight: 400,
                  fontSize: "clamp(120px, 14vw, 220px)",
                  lineHeight: 0.85,
                  color: "var(--brand)",
                  letterSpacing: "-0.04em",
                  marginTop: 12,
                }}>
                  4455
                </div>
              </div>
              <div style={{ position: "relative", marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  List in choice-filling
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  BTEUP-affiliated · 2010
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. SIX-STEP COUNSELLING PATHWAY                                          */}
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
              <div className="eyebrow">The pathway</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                Six checkpoints from{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  registration
                </span>{" "}
                to seat.
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Each step has its own deadline. Treat them as a timed relay — losing one stage rarely ends a season, but losing two usually does.
            </p>
          </div>

          <div className="bipe-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
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
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. JEECUP GROUP A — single panel (dark editorial)                        */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--ink)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
          backgroundSize: "72px 72px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: "50%", top: -160, width: 520, height: 520, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 50%, transparent)",
          filter: "blur(140px)", pointerEvents: "none", transform: "translateX(-50%)",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="eyebrow" style={{ color: "var(--accent)" }}>JEECUP · Group A</div>
            <h2 className="bipe-h1" style={{ marginTop: 14, color: "var(--paper)", maxWidth: "20ch", marginInline: "auto" }}>
              One group.{" "}
              <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                Five branches.
              </span>
            </h2>
          </div>

          <div style={{ border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)", borderRadius: 24, overflow: "hidden" }}>
            <div style={{ padding: "44px 36px" }}>
              <span className="pill" style={{ background: "var(--accent)", color: "var(--ink)" }}>GROUP A</span>
              <div className="serif" style={{ marginTop: 18, fontSize: 36, lineHeight: 1.05, color: "var(--paper)", fontStyle: "italic", fontWeight: 400 }}>
                10th-pass route
              </div>
              <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 60%, transparent)" }}>
                Three years · five branches
              </div>
              <div className="bipe-form-row" style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  ["Eligibility", "Class 10 pass with Maths & Science"],
                  ["Branches", "CS&E · Civil · Electrical · Mech (Prod.) · Dairy"],
                  ["Duration", "3 years · 6 semesters"],
                  ["Best for", "Students leaving Class 10 in 2026"],
                ].map(([k, v]) => (
                  <div key={k} style={{ paddingBottom: 12, borderBottom: "1px solid color-mix(in oklab, var(--paper) 12%, transparent)" }}>
                    <div className="eyebrow" style={{ color: "var(--accent)" }}>{k}</div>
                    <div style={{ marginTop: 6, fontSize: 15, color: "color-mix(in oklab, var(--paper) 88%, transparent)" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 28, display: "flex", justifyContent: "center" }}>
            <Link href="/courses" className="btn btn-lg" style={{ background: "var(--accent)", color: "var(--ink)" }}>
              See all 5 branches <ArrowIcon size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. WHAT YOU NEED BEFORE COUNSELLING                                      */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 56, alignItems: "start" }}>
            <div>
              <div className="eyebrow">Before counselling</div>
              <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "14ch" }}>
                A six-item{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  pre-flight check.
                </span>
              </h2>
              <p style={{ color: "var(--ink-2)", marginTop: 18, fontSize: 15.5, lineHeight: 1.7 }}>
                The full Documents page lists nineteen items, mandatory plus optional. These six are the ones you cannot show up to counselling without — get them organised before May.
              </p>
              <Link href="/documents" className="btn btn-ghost" style={{ marginTop: 22 }}>
                Full documents checklist <ArrowIcon size={14} />
              </Link>
            </div>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              {PREP.map((p, i) => (
                <div key={p.num} style={{
                  display: "grid", gridTemplateColumns: "auto 1fr",
                  gap: 22,
                  padding: "20px 24px",
                  borderBottom: i < PREP.length - 1 ? "1px solid var(--line)" : "none",
                  alignItems: "center",
                  background: i % 2 === 0 ? "var(--white)" : "var(--paper)",
                }}>
                  <span className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 30, color: "var(--brand)", lineHeight: 0.9, width: 36, textAlign: "right" }}>
                    {p.num}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{p.doc}</div>
                    <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{p.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. COMMON PITFALLS                                                      */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", right: -160, top: -160, width: 380, height: 380, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 22%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 48, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">Four common pitfalls</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                Every year, four{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  avoidable mistakes.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              We see these every counselling cycle. Reading these saves a phone call to admissions in panic — possibly an entire admission cycle.
            </p>
          </div>

          <div className="bipe-form-row" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 22 }}>
            {PITFALLS.map((p) => (
              <article key={p.roman} className="card" style={{ padding: 32 }}>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "start" }}>
                  <div className="serif" style={{
                    fontStyle: "italic", fontWeight: 400,
                    fontSize: 48, lineHeight: 0.85,
                    color: "var(--brand)",
                    width: 56, textAlign: "right",
                  }}>
                    ({p.roman})
                  </div>
                  <div>
                    <h3 className="bipe-h3" style={{ fontSize: 21 }}>{p.title}</h3>
                    <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.7 }}>
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
      {/* 6. RESOURCES & CONTACT CTA                                              */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div style={{
            position: "relative", overflow: "hidden",
            background: "var(--ink)", color: "var(--paper)",
            borderRadius: 28,
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
                <div className="eyebrow" style={{ color: "var(--accent)" }}>Stuck somewhere?</div>
                <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", lineHeight: 1.1, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 14, color: "var(--paper)", maxWidth: "16ch" }}>
                  We have shepherded a thousand families through{" "}
                  <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                    JEECUP.
                  </span>
                </h2>
                <p style={{ marginTop: 14, fontSize: 15, lineHeight: 1.7, color: "color-mix(in oklab, var(--paper) 78%, transparent)", maxWidth: "44ch" }}>
                  Forms confusing? Choice-filling intimidating? Call us. There is no fee for the conversation — we will walk you through your options branch-by-branch.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <a href="https://jeecup.admissions.nic.in" target="_blank" rel="noopener noreferrer" className="btn btn-lg" style={{ background: "var(--accent)", color: "var(--ink)", justifyContent: "space-between" }}>
                  jeecup.admissions.nic.in <ArrowIcon size={16} />
                </a>
                <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-lg btn-wa" style={{ justifyContent: "space-between" }}>
                  Talk on WhatsApp <WhatsAppIcon />
                </a>
                <a href={`tel:${DATA.contact.phone}`} className="btn btn-lg" style={{ background: "color-mix(in oklab, var(--paper) 8%, transparent)", color: "var(--paper)", border: "1px solid color-mix(in oklab, var(--paper) 16%, transparent)", justifyContent: "space-between" }}>
                  <span><PhoneIcon /> {DATA.contact.phone}</span>
                  <ArrowIcon size={16} />
                </a>
              </div>
            </div>
          </div>

          <div className="bipe-img-strip" style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Img src={BIPE_IMG.examHall} label="Exam shift · CBT" style={{ height: 220, borderRadius: 18 }} />
            <Img src={BIPE_IMG.counsellingHall} label="Counselling round · Lucknow" style={{ height: 220, borderRadius: 18 }} />
          </div>
        </div>
      </section>
    </div>
  );
}
