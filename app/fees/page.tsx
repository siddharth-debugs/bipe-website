import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metadataFor, breadcrumbJsonLd } from "@/lib/seo";
import { DATA } from "@/lib/data";
import { ArrowIcon, WhatsAppIcon, PhoneIcon } from "@/components/shell/Icons";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("fees"); }

// TODO: confirm exact admission / examination / library / caution / ID-card fees
// with Accounts Office once 2026-27 AFRC notification is published.
const COMPONENTS: { k: string; v: string; note: string }[] = [
  { k: "Tuition", v: "₹30,150", note: "AFRC-approved · same for all 5 branches · per year" },
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

/**
 * Net-fee scenarios — three representative cases (down from four,
 * 28 May 2026). The OBC + 25% merit card was dropped because BIPE
 * does not add a merit slab on top of OBC reimbursement; the OBC
 * story is just the UP Govt post-matric one, and stacking it with a
 * fake "25% BIPE merit" was misrepresenting the actual aid. The
 * JEECUP-merit card was also re-anchored to the actual published
 * Trust policy: top 2,000 JEECUP rank → 50% tuition waiver (was
 * loosely worded as "25-50% for strong rank", which let the band
 * drift in conversation).
 */
const SCENARIOS: { tag: string; title: string; calc: string; net: string; note: string }[] = [
  {
    tag: "01 · No aid",
    title: "General category, no merit slab",
    calc: "₹30,150 tuition",
    net: "₹30,150 / year",
    note: "Sticker price. AFRC-set, the same for every branch at BIPE. Hostel + mess separate.",
  },
  {
    tag: "02 · JEECUP merit",
    title: "Top 2,000 JEECUP 2026 rank · 50% BIPE scholarship",
    calc: "₹30,150 − 50% BIPE merit waiver",
    net: "₹15,075 / year",
    note: "Applied at the time of fee deposit on production of the JEECUP rank card. Open to candidates with a JEECUP 2026 All-India rank within the top 2,000. Stackable with UP Govt post-matric reimbursement.",
  },
  {
    tag: "03 · SC / ST",
    title: "SC / ST under income limit",
    calc: "₹30,150 reimbursed under UP Govt post-matric",
    net: "Effectively reimbursed",
    note: "Family pays at reporting, then receives reimbursement from scholarship.up.gov.in. Most BIPE SC/ST students see full tuition recovered.",
  },
];

/**
 * Fees-specific FAQs. The first three are aligned with the
 * site-wide /faq entries (lib/data.ts) so we don't contradict
 * ourselves; the last two are new and address what visitors
 * search for that the existing /faq doesn't cover.
 */
const FAQS: { q: string; a: string }[] = [
  {
    q: "What is the annual tuition at BIPE?",
    a: "Annual tuition is ₹30,150 — AFRC-approved and the same for all 5 BTEUP branches. Other components (admission fee, exam fee, library, caution money, ID card) are listed on the page above and follow AICTE/BTEUP norms. Hostel and mess are charged separately.",
  },
  {
    q: "What scholarships are available?",
    a: "UP Government post-matric scholarships cover full or partial tuition for SC, ST, OBC, EWS and Minority students under the year's income notification (scholarship.up.gov.in). BIPE also offers a 50% tuition waiver for any candidate within the top 2,000 JEECUP 2026 All-India rank, and a 10% waiver for Class 10 toppers (90%+ aggregate). The two stack with the UP Govt reimbursement — many BIPE students pay materially less than the published ₹30,150.",
  },
  {
    q: "What is the refund policy if I cancel after paying?",
    a: "Refunds follow AICTE norms: 100% (less ₹1,000 administrative) if you withdraw 15+ days before classes start, 90% if within 15 days, 80% within the first 15 days of classes (provided the seat is filled), 50% after that, and no refund after 30 days of classes. Caution money is refundable on completion of the diploma. Refunds are processed within 30 working days.",
  },
  {
    q: "What is the total cost of the full 3-year diploma?",
    a: "Tuition alone is ₹30,150 × 3 = ₹90,450 over the diploma. Recurring components (exam fee, library, ID, etc.) are AICTE/BTEUP norms and add a small recurring amount each semester — published once finalised for each cycle. For on-campus boys' residents, accommodation is ₹12,000/year (one-time, non-refundable) and mess is ₹4,000/month, paid in advance — both separate from tuition. Scholarships and merit waivers (including the 50% BIPE waiver for top 2,000 JEECUP rank) usually bring the net cash outflow well below the headline.",
  },
  {
    q: "Are there any hidden charges or capitation fees?",
    a: "No. BIPE is AFRC-approved and AICTE-monitored — every component is published on this page or on /mandatory-disclosure. There is no capitation fee, no \"donation\", no off-the-record cash payment ever. Every payment is receipted, and the receipts are documents you should keep for scholarship reimbursement and future verification.",
  },
  // ─── Hindi vernacular Q&As (May 2026 — for Hindi-medium families ───
  // searching "BIPE की fees कितनी है" / "polytechnic fees in hindi"
  // / "पॉलिटेक्निक फीस वाराणसी" — questions in the audience's first
  // language, answers in the colloquial code-switched register the
  // existing Hindi blog posts use.
  {
    q: "BIPE की annual fees कितनी है?",
    a: "AFRC-approved tuition fee ₹30,150 per year है — सभी 5 branches के लिए same। Plus exam fee, library, caution money आदि छोटे components — पूरा breakdown इसी page पर ऊपर है। Hostel और mess अलग billed होते हैं (accommodation ₹12,000/year + mess ₹4,000/month)।",
  },
  {
    q: "फीस कब और कैसे जमा करनी होती है?",
    a: "Admission के समय 1st installment, फिर हर साल July तक उस साल की tuition। UP government post-matric scholarship वाले students को reimbursement के बाद residual amount देना होता है। Cash, cheque, online — तीनों accepted हैं। हर payment की receipt मिलती है जो scholarship claim के लिए ज़रूरी है।",
  },
  {
    q: "क्या fees में कोई hidden charges या donation है?",
    a: "बिल्कुल नहीं। BIPE AFRC-approved और AICTE-monitored है — पूरी fee structure इस page पर public है। कोई capitation fee, कोई \"donation\", कोई off-the-record cash payment नहीं। हर rupee receipted है। Admission के समय एक written breakdown मिलता है जो हर साल same रहता है।",
  },
];

const FEE_FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Page() {
  return (
    <div className="page-enter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Admission", path: "/admission" },
              { name: "Fees", path: "/fees" },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FEE_FAQ_JSON_LD) }}
      />
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
        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div className="eyebrow">Fees · 2026-27</div>
              <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "20ch" }}>
                Tuition is{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  ₹30,150
                </span>{" "}
                a year. Every other rupee accounted for.
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "54ch" }}>
                Polytechnic fees in UP — BIPE&rsquo;s tuition is AFRC-approved, identical across all 5 branches. No capitation, no donation, no surprise charge at any semester. Receipts for every transaction — itemised and stamped.
              </p>
              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                <Link href="/apply" className="btn btn-primary btn-lg">Apply for 2026-27 <ArrowIcon size={16} /></Link>
                <Link href="/scholarships" className="btn btn-ghost btn-lg">See scholarships</Link>
              </div>
              <div className="bipe-stats" style={{ marginTop: 36, paddingTop: 22, borderTop: "1px solid var(--line)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
                {[
                  { num: "₹30,150", l: "annual tuition" },
                  { num: "5", l: "branches · same fee" },
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
              <div className="eyebrow">The break-up</div>
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
                Tuition · AFRC-approved · same across all 5 branches
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
            Items marked TBD are pending the AFRC notification for 2026-27. Once published, this page is updated within seven working days. Email <a href="mailto:info@bipe.ac.in" style={{ color: "var(--brand)" }}>info@bipe.ac.in</a> for the latest figures in writing.
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
              <div className="eyebrow">Payment schedule</div>
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

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 18, maxWidth: 880, margin: "0 auto" }}>
            {[
              {
                year: "Year 1",
                window: "At reporting · Jul 2026",
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
                window: "Before semester 3 · Jul 2027",
                items: [
                  "Tuition · ₹30,150",
                  "Recurring components",
                  "Examination fee · per sem",
                ],
              },
              {
                year: "Year 3",
                window: "Before semester 5 · Jul 2028",
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
            On-campus boys&rsquo; hostel · accommodation ₹12,000/year (one-time, non-refundable) + mess ₹4,000/month (paid in advance) — separate from tuition. Full break-up on <Link href="/hostel" style={{ color: "var(--brand)" }}>/hostel</Link>.
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. METHODS ACCEPTED                                                     */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="eyebrow">Payment methods</div>
            <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "20ch", marginInline: "auto" }}>
              Pay how it{" "}
              <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                suits the family.
              </span>
            </h2>
          </div>

          <div className="bipe-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, maxWidth: 1080, margin: "0 auto" }}>
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
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 56, alignItems: "start" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>Refund policy</div>
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
                <a href="mailto:info@bipe.ac.in" style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>
                  info@bipe.ac.in
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
            <div className="bipe-split" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "center" }}>
              <div>
                <div className="eyebrow" style={{ color: "var(--accent-deep)" }}>Most students pay much less</div>
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
      {/* 6b. SCHOLARSHIP MATH — what students actually pay                       */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 36, paddingBottom: 24, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">Scholarship math</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "18ch" }}>
                What students{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  actually pay.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "46ch", justifySelf: "end", textAlign: "right", lineHeight: 1.7 }}>
              The headline tuition is ₹30,150, but most BIPE students pay materially less. Four representative scenarios below. Exact eligibility is verified at admission — talk to accounts before reporting.
            </p>
          </div>

          {/* 28 May 2026 — grid switched 2-col → 3-col to fit the curated
              3-card lineup cleanly (was 4 cards in a 2×2 grid; OBC card
              dropped, JEECUP-merit card re-anchored to top-2,000-rank). */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 18, maxWidth: 880, margin: "0 auto" }}>
            {SCENARIOS.map((s) => (
              <article key={s.tag} className="card" style={{ padding: 26 }}>
                <div className="eyebrow" style={{ color: "var(--brand)" }}>{s.tag}</div>
                <div style={{ marginTop: 12, fontWeight: 600, fontSize: 16, lineHeight: 1.45 }}>{s.title}</div>
                <div style={{ marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.04em", color: "var(--ink-3)" }}>
                  {s.calc}
                </div>
                <div
                  className="serif"
                  style={{
                    marginTop: 8,
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: 30,
                    lineHeight: 1.05,
                    color: "var(--brand)",
                  }}
                >
                  {s.net}
                </div>
                <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 13.5, lineHeight: 1.6 }}>
                  {s.note}
                </p>
              </article>
            ))}
          </div>

          <div style={{ marginTop: 22, padding: "16px 22px", border: "1px dashed var(--line-2)", borderRadius: 14, fontSize: 13, lineHeight: 1.6, color: "var(--ink-3)", maxWidth: "82ch" }}>
            Figures above are illustrative. The exact net depends on the UP Govt scholarship notification in your year and the merit slab you qualify for at counselling. For a personalised estimate, share your JEECUP rank, Class 10 percentage and category with admissions on WhatsApp.
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 6c. FAQ — fees, scholarships, total cost                                */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">FAQ · Fees</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "20ch" }}>
            Asked{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              & answered.
            </span>
          </h2>
          <div style={{ marginTop: 32, maxWidth: 800 }}>
            {FAQS.map((f) => (
              <details key={f.q} style={{ borderTop: "1px solid var(--line)", padding: "20px 0" }}>
                <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: 16, listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {f.q}
                  <span style={{ marginLeft: 12, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--brand)" }}>+</span>
                </summary>
                <p style={{ marginTop: 12, color: "var(--ink-2)", lineHeight: 1.7 }}>{f.a}</p>
              </details>
            ))}
          </div>
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
              <div className="eyebrow">Transparency commitment</div>
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
                AFRC · AICTE · BTEUP · AISHE
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
