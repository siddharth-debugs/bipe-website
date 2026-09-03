import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import dynamic from "next/dynamic";
import { metadataFor } from "@/lib/seo";
import { DATA } from "@/lib/data";
import { ArrowIcon, PhoneIcon, WhatsAppIcon } from "@/components/shell/Icons";
import { FAQ } from "@/components/home/FAQ";
import { SITE_URL } from "@/lib/routes";

// Dynamic import keeps zod + react-hook-form (~73 KB combined) in a
// chunk that is only fetched when this route is actually visited,
// rather than the shared bundle that every page paid for. Phase 1.5
// audit P2 fix. SSR stays on (Next 16 server components don't allow
// ssr:false anyway) — the form still server-renders its shell; only
// the validation library load is deferred.
// 28 May 2026 — migrated from the local ./ContactForm to the shared
// <EnquiryForm /> component (one of 3 canonical form formats site-wide
// per user direction: Enquiry / Apply / WhatsApp). /contact uses the
// default context="contact" copy variant.
const EnquiryForm = dynamic(
  () => import("@/components/forms/EnquiryForm").then((m) => m.EnquiryForm)
);

export async function generateMetadata(): Promise<Metadata> { return metadataFor("contact"); }

const DIRECTIONS = "https://www.google.com/maps/search/?api=1&query=BIPE+Phoolpur+Varanasi";

/**
 * Schema.org Organization + ContactPoint[] for /contact.
 *
 * BIPE has 7 specialized contact channels (admissions, principal,
 * grievance, anti-ragging, IC, SC/ST cell, PwD cell) — each with
 * its own email per AICTE compliance. Without ContactPoint schema,
 * Google had no way to know which inbox handles which kind of
 * query, so all email surfacing in SERPs defaulted to admissions@.
 *
 * Why this matters for SEO:
 *
 *   1. Knowledge Graph contact-card. With ContactPoint[], Google can
 *      surface specific channels in its institution panel
 *      ("Contact" → "Grievance redressal" → grievance@…) instead of
 *      a single generic email line.
 *
 *   2. AICTE compliance is machine-readable. The mandatory disclosure
 *      already publishes the same emails; ContactPoint[] makes them
 *      crawlable in a structured way, reinforcing BIPE as a regulated
 *      institution that publishes the required redressal channels.
 *
 *   3. SiteLinks contact box. For branded-name searches ("BIPE
 *      contact"), Google can surface a contact-channel sub-block
 *      directly under the main SERP result.
 *
 * The `@id` on the Organization node matches the one declared in
 * app/layout.tsx (`${SITE_URL}#org`), so Google dedupes this
 * Organization against the canonical LocalBusiness node and merges
 * the ContactPoint[] array onto it rather than treating them as two
 * separate institutions.
 */
const CONTACT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}#org`,
  name: "Banaras Institute of Polytechnic & Engineering",
  url: SITE_URL,
  // The canonical NAP details live in layout.tsx's LocalBusiness node;
  // included here only so the ContactPoint[] reads as a coherent unit
  // for any crawler that parses /contact in isolation.
  telephone: DATA.contact.phone,
  email: DATA.contact.email,
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "admissions",
      telephone: DATA.contact.phone,
      email: DATA.contact.email,
      areaServed: ["IN-UP", "IN-BR", "IN-JH"],
      availableLanguage: ["en", "hi"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "17:00",
      },
    },
    {
      "@type": "ContactPoint",
      contactType: "principal's office",
      email: DATA.contact.emailPrincipal,
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
    {
      "@type": "ContactPoint",
      contactType: "grievance redressal",
      email: DATA.contact.emailGrievance,
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
    {
      "@type": "ContactPoint",
      contactType: "anti-ragging cell",
      email: DATA.contact.emailAntiRagging,
      telephone: DATA.contact.phone,
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
    {
      "@type": "ContactPoint",
      contactType: "internal complaints committee",
      email: DATA.contact.emailIC,
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
    {
      "@type": "ContactPoint",
      contactType: "SC/ST cell",
      email: DATA.contact.emailScSt,
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
    {
      "@type": "ContactPoint",
      contactType: "disability support",
      email: DATA.contact.emailPwd,
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
  ],
};

export default function Page() {
  const C = DATA.contact;

  // Single source of truth lives in lib/data.ts > DATA.social. The
  // page previously hardcoded a different handle set ("@bipevaranasi"
  // / "@bipe.varanasi") that diverged from the schema.org `sameAs`
  // emitted by app/layout.tsx — Google saw conflicting entity
  // signals. May 2026 audit fix.
  //
  // Wikidata is filtered out of the user-facing social grid (added
  // for sameAs schema purposes only — not a follow-able channel).
  const SOCIALS = DATA.social.filter((s) => !s.url.includes("wikidata.org"));

  return (
    <div className="page-enter">
      {/* Organization + ContactPoint[] JSON-LD — see CONTACT_JSON_LD
          for the 7 specialised channels (admissions, principal,
          grievance, anti-ragging, IC, SC/ST, PwD). Anchored at
          ${SITE_URL}#org so Google dedupes against layout.tsx. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_JSON_LD) }}
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
        <div aria-hidden="true" style={{
          position: "absolute", right: -160, bottom: -160, width: 380, height: 380, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 28%, transparent)",
          filter: "blur(130px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div className="eyebrow">Contact</div>
              <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "20ch" }}>
                Talk to us.{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  Hindi or English.
                </span>
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "56ch" }}>
                WhatsApp, phone, email — any channel that suits you. We answer within 24 hours, Monday to Saturday, in either language. No call-tree, no IVR, no robo-replies.
              </p>
              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                {/* Bilingual hero CTAs. */}
                <a href={C.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-lg">
                  <WhatsAppIcon /> WhatsApp now
                  <span lang="hi" style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.88, marginTop: 2 }}>
                    अभी WhatsApp करें
                  </span>
                </a>
                <a href={`tel:${C.phone}`} className="btn btn-ghost btn-lg">
                  <PhoneIcon /> {C.phone}
                  <span lang="hi" style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.85, marginTop: 2 }}>
                    फ़ोन पर बात करें
                  </span>
                </a>
              </div>
              <div className="bipe-stats" style={{ marginTop: 36, paddingTop: 22, borderTop: "1px solid var(--line)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
                {[
                  { num: "<24h", l: "response · all channels" },
                  { num: "Mon–Sat", l: "9 am – 5 pm IST" },
                  { num: "EN / हिं", l: "WhatsApp + voice" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 32, lineHeight: 0.9, color: "var(--brand)" }}>{s.num}</div>
                    <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-3)" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stat pill cluster */}
            <div style={{
              position: "relative",
              borderRadius: 18, border: "1px solid var(--line)",
              background: "var(--white)",
              padding: 28,
              boxShadow: "0 24px 60px -24px rgba(10,26,63,0.18)",
            }}>
              <div className="eyebrow" style={{ color: "var(--brand)" }}>BIPE · ADMISSIONS DESK</div>
              <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 38, marginTop: 12, lineHeight: 1.1, color: "var(--ink)" }}>
                A real human, on the other end.
              </div>

              <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["PHONE", C.phone],
                  ["EMAIL", C.email],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 8, borderBottom: "1px dashed var(--line-2)" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", color: "var(--ink-3)" }}>{k}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--brand)", fontSize: 14 }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 8 }}>
                <span className="pill">MON–SAT 9–5</span>
                <span className="pill pill-accent">&lt;24h response</span>
                <span className="pill">EN / हिं</span>
                <span className="pill">WhatsApp + voice</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. THREE PRIMARY CHANNELS (LIGHT)                                       */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 40, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">Three primary channels</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                Pick what&apos;s{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  comfortable.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Each route reaches the same admissions team. WhatsApp is fastest. Phone suits parents who prefer voice. Email is best when you want a written trail.
            </p>
          </div>

          <div className="bipe-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {/* WhatsApp */}
            <article className="card" style={{ padding: 32, background: "color-mix(in oklab, #25D366 8%, var(--white))", position: "relative", overflow: "hidden" }}>
              <div aria-hidden="true" style={{
                position: "absolute", right: -40, top: -40, width: 160, height: 160, borderRadius: "50%",
                background: "color-mix(in oklab, #25D366 18%, transparent)",
                pointerEvents: "none",
              }} />
              <div style={{ position: "relative" }}>
                <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 56, color: "#1eaf55", lineHeight: 0.85 }}>
                  01
                </div>
                <div className="eyebrow" style={{ marginTop: 12, color: "#1eaf55" }}>Fastest</div>
                <div style={{ marginTop: 6, fontWeight: 700, fontSize: 22, lineHeight: 1.2 }}>WhatsApp</div>
                <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.6 }}>
                  Replies in minutes during office hours. Best for quick questions, photos of mark sheets, voice notes in your dialect.
                </p>
                <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px dashed var(--line-2)" }}>
                  <div className="eyebrow" style={{ color: "var(--ink-3)" }}>NUMBER</div>
                  {/* 29 May 2026 — split routing per user direction
                      "call will remain with 9415202879 / WhatsApp and
                      message number will be done on +917310077788".
                      The WhatsApp card now shows C.whatsappPhone
                      (the WABA-approved sender that receives messages
                      and originates DT confirmations), distinct from
                      the Phone card below which still shows C.phone
                      (the call line families have long had saved).
                      Earlier "phone consolidation" comment from 28 May
                      retired by this routing change. */}
                  <div style={{ marginTop: 4, fontFamily: "var(--font-mono)", fontWeight: 700, color: "#1eaf55", fontSize: 18 }}>{C.whatsappPhone}</div>
                </div>
                <a href={C.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa" style={{ marginTop: 18, width: "100%", justifyContent: "center" }}>
                  <WhatsAppIcon /> Open chat
                </a>
                <div className="muted" style={{ marginTop: 12, fontSize: 12 }}>
                  Best for: quick replies · attachments · voice notes
                </div>
              </div>
            </article>

            {/* Phone */}
            <article className="card" style={{ padding: 32, background: "color-mix(in oklab, var(--brand) 7%, var(--white))", position: "relative", overflow: "hidden" }}>
              <div aria-hidden="true" style={{
                position: "absolute", right: -40, top: -40, width: 160, height: 160, borderRadius: "50%",
                background: "color-mix(in oklab, var(--brand) 18%, transparent)",
                pointerEvents: "none",
              }} />
              <div style={{ position: "relative" }}>
                <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 56, color: "var(--brand)", lineHeight: 0.85 }}>
                  02
                </div>
                <div className="eyebrow" style={{ marginTop: 12, color: "var(--brand)" }}>For voice-first families</div>
                <div style={{ marginTop: 6, fontWeight: 700, fontSize: 22, lineHeight: 1.2 }}>Phone</div>
                <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.6 }}>
                  For parents who&apos;d rather talk than type. Direct line to the admissions cell — no IVR.
                </p>
                <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px dashed var(--line-2)", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div>
                    <div className="eyebrow" style={{ color: "var(--ink-3)" }}>ADMISSIONS</div>
                    <div style={{ marginTop: 4, fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--brand)", fontSize: 18 }}>{C.phone}</div>
                  </div>
                  {/* 28 May 2026 — "ALT" phone row dropped. The single
                      admissions handset (9415202879) now serves both
                      voice and WhatsApp. */}
                </div>
                <a href={`tel:${C.phone}`} className="btn btn-primary" style={{ marginTop: 18, width: "100%", justifyContent: "center" }}>
                  <PhoneIcon /> Call now
                </a>
                <div className="muted" style={{ marginTop: 12, fontSize: 12 }}>
                  Best for: parents · long conversations · counselling
                </div>
              </div>
            </article>

            {/* Email */}
            <article className="card" style={{ padding: 32, background: "var(--white)", position: "relative", overflow: "hidden" }}>
              <div aria-hidden="true" style={{
                position: "absolute", right: -40, top: -40, width: 160, height: 160, borderRadius: "50%",
                background: "color-mix(in oklab, var(--ink) 8%, transparent)",
                pointerEvents: "none",
              }} />
              <div style={{ position: "relative" }}>
                <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 56, color: "var(--ink)", lineHeight: 0.85 }}>
                  03
                </div>
                <div className="eyebrow" style={{ marginTop: 12, color: "var(--ink-2)" }}>For paper trails</div>
                <div style={{ marginTop: 6, fontWeight: 700, fontSize: 22, lineHeight: 1.2 }}>Email</div>
                <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.6 }}>
                  Long-form questions, document attachments, official correspondence. Replies within one working day.
                </p>
                <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px dashed var(--line-2)" }}>
                  <div className="eyebrow" style={{ color: "var(--ink-3)" }}>ADDRESS</div>
                  <div style={{ marginTop: 4, fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--ink)", fontSize: 16, wordBreak: "break-all" }}>{C.email}</div>
                </div>
                <a href={`mailto:${C.email}`} className="btn btn-accent" style={{ marginTop: 18, width: "100%", justifyContent: "center" }}>
                  Compose mail <ArrowIcon size={14} />
                </a>
                <div className="muted" style={{ marginTop: 12, fontSize: 12 }}>
                  Best for: documents · formal queries · written record
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. ADDRESS & DIRECTIONS (LIGHT)                                         */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 32, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">Address & directions</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "18ch" }}>
                How to{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  reach.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              On the Phoolpur–Parsara road, off NH-56, in the Gajokhar village limits. Eighteen minutes from the airport, a five-minute auto from Khalishpur railway station.
            </p>
          </div>

          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 22 }}>
            <article className="card" style={{ padding: 36, background: "var(--paper-2)" }}>
              <div className="eyebrow">Postal address</div>
              <div className="serif" style={{ marginTop: 14, fontStyle: "italic", fontWeight: 400, fontSize: 30, lineHeight: 1.2, color: "var(--ink)" }}>
                {C.address}
              </div>
              <div className="bipe-form-row" style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--line)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <div>
                  <div className="eyebrow">JEECUP code</div>
                  <div style={{ marginTop: 4, fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--brand)", fontSize: 18 }}>{C.jeecup}</div>
                </div>
                <div>
                  <div className="eyebrow">AICTE id</div>
                  <div style={{ marginTop: 4, fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--brand)", fontSize: 18 }}>{C.aicte}</div>
                </div>
              </div>
              <div style={{ marginTop: 22, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href={DIRECTIONS} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Get directions <ArrowIcon size={14} />
                </a>
                <Link href="/visit" className="btn btn-ghost">
                  Plan a visit <ArrowIcon size={14} />
                </Link>
              </div>
            </article>

            <article className="card" style={{ padding: 36, background: "var(--white)" }}>
              <div className="eyebrow">Transport</div>
              <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.7 }}>
                Quick note for first-time visitors. The full transport breakdown — air, rail, road, auto / app-cab from Cantt — sits on the visit page.
              </p>
              <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  ["AIR", "Lal Bahadur Shastri Intl.", "14.1 km"],
                  ["RAIL", "Khalishpur Station", "1.8 km"],
                  ["ROAD", "NH-56 · Phoolpur exit", "—"],
                ].map(([k, v, d]) => (
                  <div key={k} style={{ display: "grid", gridTemplateColumns: "70px 1fr auto", gap: 12, padding: "12px 0", borderTop: "1px solid var(--line)", alignItems: "center" }}>
                    <span className="eyebrow">{k}</span>
                    <span style={{ fontSize: 14, color: "var(--ink-2)" }}>{v}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--brand)", fontWeight: 700 }}>{d}</span>
                  </div>
                ))}
              </div>
              <Link href="/visit" className="btn btn-accent" style={{ marginTop: 22 }}>
                Full transport details <ArrowIcon size={14} />
              </Link>
            </article>
          </div>

          {/* Location card — replaced the embedded iframe (first
              Google's deprecated maps.google.com/maps?q=...&output=
              embed, then OpenStreetMap's static embed). Both blanked
              silently in Safari + some mobile browsers (user-reported
              twice — 30 May screenshots). A styled card that links
              out to the verified GBP map for directions is more
              reliable AND more useful: every browser renders it,
              and tapping it opens the visitor's native Maps app
              with directions pre-loaded. The campus coordinates +
              landmark distances communicate location at a glance
              without depending on a third-party iframe. */}
          <a
            href="https://maps.app.goo.gl/fa1zNXmZuRg7Si139"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop: 22,
              display: "block",
              padding: "26px 28px",
              borderRadius: 18,
              border: "1px solid var(--line)",
              background: "linear-gradient(135deg, color-mix(in oklab, var(--brand) 6%, var(--white)) 0%, color-mix(in oklab, var(--accent) 4%, var(--white)) 100%)",
              color: "var(--ink)",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gap: 18,
                alignItems: "center",
              }}
            >
              {/* Pin icon */}
              <div
                aria-hidden="true"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "var(--brand)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>

              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10.5,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--ink-3)",
                  }}
                >
                  BIPE Phoolpur · Verified on Google Maps
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontWeight: 700,
                    fontSize: 16,
                    color: "var(--ink)",
                    lineHeight: 1.35,
                  }}
                >
                  Gajokhar, Phoolpur, Varanasi, Uttar Pradesh 221206
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--ink-2)",
                  }}
                >
                  25.5322°N · 82.8438°E
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 13,
                    color: "var(--ink-2)",
                    lineHeight: 1.5,
                  }}
                >
                  ~14 km from Varanasi Cantt · 35 min by app-cab or auto · 1.8 km from Khalishpur Station
                </div>
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 16px",
                  borderRadius: 999,
                  background: "var(--brand)",
                  color: "#fff",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Get Directions <ArrowIcon size={12} />
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. QUICK QUESTION FORM (BRAND-TINTED)                                   */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "color-mix(in oklab, var(--brand) 8%, var(--paper))", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", left: -160, top: -100, width: 380, height: 380, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 24%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -180, bottom: -140, width: 420, height: 420, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 22%, transparent)",
          filter: "blur(130px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 56, alignItems: "start" }}>
            <div style={{ position: "sticky", top: 100 }}>
              <div className="eyebrow" style={{ color: "var(--brand)" }}>Quick question</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "14ch" }}>
                Send one,{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  we&apos;ll call back.
                </span>
              </h2>
              <p style={{ marginTop: 18, color: "var(--ink-2)", fontSize: 15.5, lineHeight: 1.7, maxWidth: "44ch" }}>
                Drop us a note — we&apos;ll call your mobile within 24 hours, in the language you&apos;re comfortable with. One call from a real human.
              </p>
              <ul style={{ marginTop: 22, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {["EN / हिंदी on call", "We answer within 24 hours, Mon–Sat"].map((p) => (
                  <li key={p} style={{ display: "flex", gap: 10, alignItems: "baseline", fontSize: 14, color: "var(--ink-2)" }}>
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--brand)", flexShrink: 0, marginTop: 7 }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card" style={{ padding: 36, background: "var(--white)", boxShadow: "0 24px 60px -28px rgba(10,26,63,0.18)" }}>
              <EnquiryForm context="contact" />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5b. FAQ — moved from the homepage to keep contact-related questions     */}
      {/* together with the contact form.                                         */}
      {/* ====================================================================== */}
      <FAQ />

      {/* ====================================================================== */}
      {/* 6. OFFICE HOURS & SOCIAL (DARK)                                         */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--ink)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
          backgroundSize: "72px 72px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -180, top: -180, width: 480, height: 480, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 40%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 56, alignItems: "stretch" }}>
            <div style={{
              padding: 36,
              borderRadius: 18,
              background: "color-mix(in oklab, var(--paper) 6%, transparent)",
              border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
            }}>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>Office hours</div>
              <div className="serif" style={{ marginTop: 14, fontStyle: "italic", fontWeight: 400, fontSize: 44, lineHeight: 1.05, color: "var(--paper)" }}>
                Mon–Sat<br /><span style={{ color: "var(--accent)" }}>9 — 5</span>
              </div>
              <p style={{ marginTop: 18, color: "color-mix(in oklab, var(--paper) 78%, transparent)", fontSize: 14.5, lineHeight: 1.7 }}>
                WhatsApp messages received outside hours are answered first thing the next working morning.
              </p>
              <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", color: "color-mix(in oklab, var(--paper) 60%, transparent)" }}>MON–SAT</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--paper)", fontSize: 13 }}>9:00 AM – 5:00 PM</span>
              </div>
            </div>

            <div>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>On the socials</div>
              <h3 className="bipe-h2" style={{ marginTop: 14, color: "var(--paper)", maxWidth: "20ch" }}>
                Or follow along where you{" "}
                <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                  already scroll.
                </span>
              </h3>
              <p style={{ marginTop: 14, color: "color-mix(in oklab, var(--paper) 78%, transparent)", fontSize: 15, lineHeight: 1.7, maxWidth: "52ch" }}>
                Campus moments, placement announcements, JEECUP timelines. Posts in Hindi and English.
              </p>

              <div className="bipe-form-row" style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {SOCIALS.map((s, i) => (
                  <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" style={{
                    padding: "20px 24px",
                    borderRadius: 14,
                    background: "color-mix(in oklab, var(--paper) 5%, transparent)",
                    border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
                    color: "var(--paper)",
                    display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                    transition: "background .25s, border-color .25s",
                  }}>
                    <span className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 28, color: "var(--accent)", lineHeight: 0.85 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "var(--paper)" }}>{s.name}</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "color-mix(in oklab, var(--paper) 65%, transparent)", marginTop: 2 }}>@{s.handle}</div>
                    </div>
                    <ArrowIcon size={14} />
                  </a>
                ))}
              </div>
              <div style={{ marginTop: 18, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", color: "color-mix(in oklab, var(--paper) 55%, transparent)" }}>
                Handles confirmed by marketing — last updated this season.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 7. FINAL CTA STRIP                                                      */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div style={{
            position: "relative", overflow: "hidden",
            borderRadius: 28, border: "1px solid var(--line)",
            background: "var(--white)",
            padding: "56px 48px",
          }}>
            <div aria-hidden="true" style={{
              position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
              width: 720, height: 720, borderRadius: "50%",
              background: "color-mix(in oklab, var(--brand) 16%, transparent)",
              filter: "blur(160px)", pointerEvents: "none",
            }} />
            <div className="bipe-split" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.2fr auto", gap: 40, alignItems: "center" }}>
              <div>
                <div className="eyebrow">Two next steps</div>
                <p className="serif" style={{
                  marginTop: 16,
                  fontStyle: "italic", fontWeight: 400,
                  fontSize: "clamp(34px, 4.4vw, 60px)",
                  lineHeight: 1.05, letterSpacing: "-0.02em",
                  maxWidth: "20ch",
                }}>
                  Come{" "}
                  <span style={{ color: "var(--brand)" }}>walk the campus</span>{" "}
                  — or start the application.
                </p>
                <p style={{ marginTop: 14, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.7, maxWidth: "56ch" }}>
                  Most families do both. The visit answers the questions a phone call can&apos;t. The application keeps your seat moving while you decide.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Bilingual final CTAs — Hindi sub-label under each. */}
                <Link href="/visit" className="btn btn-primary btn-lg" style={{ justifyContent: "center" }}>
                  Book a visit <ArrowIcon size={14} />
                  <span lang="hi" style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.88, marginTop: 2 }}>
                    कैंपस विज़िट बुक करें
                  </span>
                </Link>
                <Link href="/apply" className="btn btn-accent btn-lg" style={{ justifyContent: "center" }}>
                  Start application <ArrowIcon size={14} />
                  <span lang="hi" style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.85, marginTop: 2 }}>
                    आवेदन शुरू करें
                  </span>
                </Link>
                <a href={C.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa" style={{ justifyContent: "center" }}>
                  <WhatsAppIcon /> WhatsApp now
                  <span lang="hi" style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.88, marginTop: 2 }}>
                    अभी WhatsApp करें
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
