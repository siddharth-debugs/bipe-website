import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metaFor } from "@/lib/routes";
import { DATA } from "@/lib/data";
import { ArrowIcon, WhatsAppIcon, PhoneIcon } from "@/components/shell/Icons";

export const metadata: Metadata = metaFor("fees");

// TODO: confirm exact admission / examination / library / caution / ID-card fees
// with Accounts Office once 2026-27 AFRC notification is published.
const COMPONENTS: { k: string; v: string; note: string }[] = [
  { k: "Tuition", v: "₹30,150", note: "AFRC-approved · same for all 10 branches · per year" },
  { k: "Admission fee", v: "TBD", note: "Year 1 only · payable at reporting" },
  { k: "Examination fee", v: "TBD", note: "BTEUP norms · pass-through · per semester" },
  { k: "Library fee", v: "TBD", note: "Annual" },
  { k: "Caution money", v: "TBD", note: "Refundable on completion" },
  { k: "ID card", v: "TBD", note: "One-time" },
];

const REFUND: { window: string; amount: string; note: string }[] = [
  { window: "15+ days before classes start", amount: "100%", note: "Less ₹1,000 administrative" },
  { window: "Less than 15 days before classes", amount: "90%", note: "Standard window" },
  { window: "Within 15 days of classes starting", amount: "80%", note: "If vacancy is filled" },
  { window: "After 15 days of classes", amount: "50%", note: "If vacancy is filled" },
  { window: "After 30 days of classes", amount: "—", note: "No refund" },
];

const METHODS: { name: string; sub: string }[] = [
  { name: "UPI", sub: "GPay · PhonePe · Paytm" },
  { name: "NetBanking", sub: "Any Indian bank" },
  { name: "Credit / Debit", sub: "Visa · Mastercard · RuPay" },
  { name: "Demand Draft", sub: "In favour of the institute" },
  { name: "Cash", sub: "At the Accounts Office" },
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
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div className="eyebrow">§ Fees · 2026-27</div>
              <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "20ch" }}>
                Tuition is{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  ₹30,150
                </span>{" "}
                a year. Every other rupee accounted for.
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "54ch" }}>
                AFRC-approved, identical across all 10 branches. No capitation, no donation, no surprise charge at any semester. Receipts for every transaction — itemised and stamped.
              </p>
              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                <Link href="/apply" className="btn btn-primary btn-lg">Apply for 2026-27 <ArrowIcon size={16} /></Link>
                <Link href="/scholarships" className="btn btn-ghost btn-lg">See scholarships</Link>
              </div>
              <div style={{ marginTop: 36, paddingTop: 22, borderTop: "1px solid var(--line)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
                {[
                  { num: "₹30,150", l: "annual tuition" },
                  { num: "10", l: "branches · same fee" },
                  { num: "0", l: "capitation · donation" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 32, lineHeight: 0.9, color: "var(--brand)" }}>{s.num}</div>
                    <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-3)" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Receipt mock */}
            <div style={{
              position: "relative", overflow: "hidden",
              borderRadius: 18, border: "1px solid var(--line)",
              background: "var(--white)",
              padding: 28,
              boxShadow: "0 24px 60px -24px rgba(10,26,63,0.18)",
              transform: "rotate(-1.2deg)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 14, borderBottom: "1.5px dashed var(--line-2)" }}>
                <div>
                  <div className="eyebrow" style={{ color: "var(--brand)" }}>BIPE · ACCOUNTS</div>
                  <div style={{ marginTop: 4, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>FEE RECEIPT · SAMPLE</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>
                  RC-XXXX
                </div>
              </div>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10, fontFamily: "var(--font-mono)", fontSize: 13 }}>
                {[
                  ["Tuition (annual)", "₹30,150"],
                  ["Admission fee", "TBD"],
                  ["Library", "TBD"],
                  ["Caution (refundable)", "TBD"],
                  ["ID card", "TBD"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", color: "var(--ink-2)" }}>
                    <span>{k}</span>
                    <span style={{ color: v === "TBD" ? "var(--ink-3)" : "var(--ink)", fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1.5px solid var(--ink)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Total · year 1
                </span>
                <span className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 36, color: "var(--brand)" }}>
                  ₹30,150 +
                </span>
              </div>
              <div style={{
                marginTop: 18, padding: "10px 14px",
                border: "1.5px solid var(--accent)",
                borderRadius: 10,
                display: "inline-flex", alignItems: "center", gap: 10,
                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
                color: "var(--accent-deep)",
                transform: "rotate(-3deg)",
              }}>
                ★ AFRC APPROVED · 2026-27
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. ANNUAL FEE COMPONENTS                                                */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 40, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">§ The break-up</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                Every component,{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  itemised.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Several recurring components are still pending the 2026-27 AFRC notification. We mark them <span style={{ fontFamily: "var(--font-mono)", color: "var(--brand)" }}>TBD</span> — never approximate, never bundled silently.
            </p>
          </div>

          <div className="card" style={{ padding: 0, overflow: "hidden", maxWidth: 980, margin: "0 auto" }}>
            <div style={{ padding: 28, background: "var(--brand)", color: "#fff" }}>
              <div className="eyebrow" style={{ color: "color-mix(in oklab, #fff 78%, transparent)" }}>Per Student · Per Year</div>
              <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 72, lineHeight: 1, marginTop: 8, letterSpacing: "-0.02em" }}>
                ₹30,150
              </div>
              <div style={{ marginTop: 8, opacity: 0.88, fontSize: 14 }}>
                Tuition · AFRC-approved · same across all 10 branches
              </div>
            </div>
            <div>
              {COMPONENTS.map((c, i) => (
                <div key={c.k} style={{
                  display: "grid", gridTemplateColumns: "auto 1.5fr 1fr 1.6fr",
                  gap: 18,
                  padding: "20px 26px",
                  borderBottom: i < COMPONENTS.length - 1 ? "1px solid var(--line)" : "none",
                  alignItems: "center",
                  background: i % 2 === 0 ? "var(--white)" : "var(--paper)",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)", width: 24 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{c.k}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: c.v === "TBD" ? "var(--ink-3)" : "var(--brand)", fontSize: 18 }}>
                    {c.v}
                  </div>
                  <div className="muted" style={{ fontSize: 13 }}>{c.note}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="muted" style={{ marginTop: 16, fontSize: 13, textAlign: "center", maxWidth: 720, marginInline: "auto" }}>
            Items marked TBD are pending the AFRC notification for 2026-27. Once published, this page is updated within seven working days. Email <a href="mailto:accounts@bipevns.org" style={{ color: "var(--brand)" }}>accounts@bipevns.org</a> for the latest figures in writing.
          </p>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. PAYMENT SCHEDULE                                                     */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 40, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">§ Payment schedule</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                Three years.{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  Three payments.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Tuition is paid annually, before the relevant academic year. Hostel and mess are charged semester-wise — split into smaller payments to ease the family budget.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
            {[
              {
                year: "Year 1",
                window: "At reporting · Aug 2026",
                items: [
                  "Tuition · ₹30,150",
                  "Admission fee (one-time)",
                  "Recurring components",
                  "Caution money (refundable)",
                ],
                accent: true,
              },
              {
                year: "Year 2",
                window: "Before semester 3 · Aug 2027",
                items: [
                  "Tuition · ₹30,150",
                  "Recurring components",
                  "Examination fee · per sem",
                ],
              },
              {
                year: "Year 3",
                window: "Before semester 5 · Aug 2028",
                items: [
                  "Tuition · ₹30,150",
                  "Recurring components",
                  "Examination fee · per sem",
                  "Caution refunded on completion",
                ],
              },
            ].map((y) => (
              <article key={y.year} className="card" style={{
                padding: 32, position: "relative", overflow: "hidden",
                background: y.accent ? "color-mix(in oklab, var(--brand) 8%, var(--white))" : "var(--white)",
              }}>
                <div aria-hidden="true" style={{
                  position: "absolute", right: -50, top: -50, width: 180, height: 180, borderRadius: "50%",
                  background: y.accent ? "color-mix(in oklab, var(--brand) 14%, transparent)" : "color-mix(in oklab, var(--brand) 6%, transparent)",
                  pointerEvents: "none",
                }} />
                <div style={{ position: "relative" }}>
                  <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 44, color: "var(--brand)", lineHeight: 0.95 }}>
                    {y.year}
                  </div>
                  <div className="eyebrow" style={{ marginTop: 10, color: "var(--brand)" }}>{y.window}</div>
                  <ul style={{ marginTop: 18, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                    {y.items.map((it) => (
                      <li key={it} style={{ display: "flex", gap: 10, alignItems: "baseline", fontSize: 14, color: "var(--ink-2)" }}>
                        <span style={{ width: 5, height: 5, borderRadius: 999, background: "var(--accent)", flexShrink: 0, marginTop: 7 }} />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <div style={{ marginTop: 22, padding: "16px 22px", border: "1px dashed var(--line-2)", borderRadius: 14, fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.06em", color: "var(--ink-3)", textAlign: "center" }}>
            Hostel · ₹36,000 mess + room — paid semester-wise, separate from tuition.
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. METHODS ACCEPTED                                                     */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="eyebrow">§ Payment methods</div>
            <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "20ch", marginInline: "auto" }}>
              Pay how it{" "}
              <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                suits the family.
              </span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, maxWidth: 1080, margin: "0 auto" }}>
            {METHODS.map((m, i) => (
              <div key={m.name} className="card" style={{ padding: "24px 18px", textAlign: "center" }}>
                <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 32, color: "var(--brand)", lineHeight: 0.9 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ marginTop: 14, fontWeight: 700, fontSize: 16 }}>{m.name}</div>
                <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. REFUND POLICY (DARK)                                                 */}
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
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 56, alignItems: "start" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>§ Refund policy</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, color: "var(--paper)", maxWidth: "14ch" }}>
                AICTE-aligned{" "}
                <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                  refund schedule.
                </span>
              </h2>
              <p style={{ color: "color-mix(in oklab, var(--paper) 78%, transparent)", marginTop: 20, fontSize: 15.5, lineHeight: 1.7, maxWidth: "44ch" }}>
                If a student withdraws before or shortly after classes begin, the institute returns fees on a stepped schedule — published in writing, processed in 30 working days.
              </p>
              <div style={{ marginTop: 28, paddingTop: 18, borderTop: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 60%, transparent)" }}>
                  Processed in 30 working days
                </div>
                <a href="mailto:accounts@bipevns.org" style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>
                  accounts@bipevns.org
                </a>
              </div>
            </div>

            <div style={{ borderRadius: 18, overflow: "hidden", border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" }}>
              {REFUND.map((r, i) => (
                <div key={r.window} style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto",
                  gap: 18,
                  padding: "20px 26px",
                  borderBottom: i < REFUND.length - 1 ? "1px solid color-mix(in oklab, var(--paper) 12%, transparent)" : "none",
                  alignItems: "center",
                  background: i % 2 === 0 ? "color-mix(in oklab, var(--paper) 5%, transparent)" : "transparent",
                }}>
                  <span className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 32, color: "var(--accent)", lineHeight: 0.9, width: 60 }}>
                    {r.amount}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14.5, color: "var(--paper)" }}>{r.window}</div>
                    <div style={{ fontSize: 12, marginTop: 2, color: "color-mix(in oklab, var(--paper) 60%, transparent)" }}>{r.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 6. SCHOLARSHIPS BRIDGE                                                  */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <Link href="/scholarships" style={{
            position: "relative", overflow: "hidden",
            display: "block",
            borderRadius: 24, border: "1px solid var(--line)",
            background: "color-mix(in oklab, var(--accent) 14%, var(--white))",
            padding: "48px 56px",
            textDecoration: "none", color: "var(--ink)",
          }}>
            <div aria-hidden="true" style={{
              position: "absolute", right: -120, bottom: -120, width: 320, height: 320, borderRadius: "50%",
              background: "color-mix(in oklab, var(--accent) 36%, transparent)",
              filter: "blur(110px)", pointerEvents: "none",
            }} />
            <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "center" }}>
              <div>
                <div className="eyebrow" style={{ color: "var(--accent-deep)" }}>§ Most students pay much less</div>
                <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "20ch" }}>
                  UP Government post-matric covers tuition for{" "}
                  <span className="serif" style={{ color: "var(--accent-deep)", fontStyle: "italic", fontWeight: 400 }}>
                    SC · ST · OBC · EWS · Minority.
                  </span>
                </h2>
                <p style={{ color: "var(--ink-2)", marginTop: 14, fontSize: 15, lineHeight: 1.7, maxWidth: "48ch" }}>
                  Most BIPE students see most or all of their tuition reimbursed. BIPE merit scholarships stack on top — JEECUP top-rank waivers and 10th-class topper reductions.
                </p>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <span className="btn btn-accent btn-lg" style={{ background: "var(--ink)", color: "var(--paper)" }}>
                  See scholarships <ArrowIcon size={16} />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 7. CTA + TRANSPARENCY                                                   */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div style={{
            position: "relative", overflow: "hidden",
            borderRadius: 28, border: "1px solid var(--line)",
            background: "var(--white)",
            padding: "64px 56px",
            textAlign: "center",
          }}>
            <div aria-hidden="true" style={{
              position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
              width: 720, height: 720, borderRadius: "50%",
              background: "color-mix(in oklab, var(--brand) 18%, transparent)",
              filter: "blur(160px)", pointerEvents: "none",
            }} />
            <div style={{ position: "relative" }}>
              <div className="eyebrow">§ Transparency commitment</div>
              <p className="serif" style={{
                marginTop: 22,
                fontStyle: "italic", fontWeight: 400,
                fontSize: "clamp(40px, 5.4vw, 80px)",
                lineHeight: 1.05, letterSpacing: "-0.02em",
                maxWidth: "16ch", margin: "22px auto 0",
              }}>
                Every rupee,{" "}
                <span style={{ color: "var(--brand)" }}>on the record.</span>
              </p>
              <div style={{ marginTop: 24, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                AFRC · AICTE · BTEUP · ISO 9001
              </div>
              <div className="row" style={{ justifyContent: "center", marginTop: 36, flexWrap: "wrap" }}>
                <Link href="/apply" className="btn btn-primary btn-lg">Apply for 2026-27 <ArrowIcon size={16} /></Link>
                <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-lg">
                  <WhatsAppIcon /> WhatsApp accounts
                </a>
                <a href={`tel:${DATA.contact.phone}`} className="btn btn-ghost btn-lg">
                  <PhoneIcon /> {DATA.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
