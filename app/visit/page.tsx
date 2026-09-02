import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import dynamic from "next/dynamic";
import { metadataFor, breadcrumbJsonLd } from "@/lib/seo";
import { DATA } from "@/lib/data";
import { BIPE_IMG } from "@/lib/images";
import { Img } from "@/components/ui/Img";
import { ArrowIcon, PhoneIcon, WhatsAppIcon } from "@/components/shell/Icons";

// Dynamic import keeps zod + react-hook-form out of the global
// shared chunk. See companion comment on /contact and /apply pages.
// 28 May 2026 — migrated from the local ./VisitForm to the shared
// <EnquiryForm /> component (one of 3 canonical form formats site-wide
// per user direction). The dedicated date / slot / party / shuttle
// pickers were dropped at the same direction — admissions calls back
// within one working day to lock the date conversationally. Visitors
// can suggest a date in the free-text Message field. The surrounding
// copy below is updated to reflect that flow.
const EnquiryForm = dynamic(
  () => import("@/components/forms/EnquiryForm").then((m) => m.EnquiryForm)
);

export async function generateMetadata(): Promise<Metadata> { return metadataFor("visit"); }

type Step = { num: string; title: string; body: string };
type Channel = { num: string; eyebrow: string; title: string; body: string; cta: React.ReactNode; tone: "wa" | "brand" | "neutral" };
type Mode = { num: string; mode: string; place: string; distance: string; body: string };
type Bring = { who: string; title: string; body: string };

const STEPS: Step[] = [
  { num: "01", title: "Welcome at the gate", body: "Security signs you in, prints a visitor pass, and walks your family to the admissions cell. Free water, washrooms, and a quiet waiting room — no rush." },
  { num: "02", title: "Principal's overview", body: "Ten to fifteen minutes with the Principal or admissions head — pedagogy, AFRC fees, the placement record, and what makes a BIPE diploma different from the seven other polytechnics in the district." },
  { num: "03", title: "Lab & workshop tour", body: "Walk the spaces that match your branch interest — the 120-computer lab, the dairy chemistry and hydraulics labs, the welding-and-fitting workshop, the electrical machines bench. Touch the equipment. Ask the lab assistant questions." },
  { num: "04", title: "Hostel + mess walkthrough", body: "Visit the boys' hostel block — current room layout, mess hall and study commons. Meet the warden if available. Look at a real room. Eat lunch with current students if you're around at noon." },
  { num: "05", title: "Q&A — Hindi or English", body: "Sit down with the admissions team. Ask anything — fees, scholarships, JEECUP counselling strategy, hostel curfew, mess menu. We answer in your language, with no salesman script." },
];

const MODES: Mode[] = [
  { num: "01", mode: "By air", place: "Lal Bahadur Shastri International Airport", distance: "14.1 km", body: "Direct flights from Delhi, Mumbai, Bengaluru and Kolkata. Pre-paid taxis and autos from arrivals run straight to Phoolpur — about 35 minutes off-peak." },
  { num: "02", mode: "By rail", place: "Khalishpur Railway Station", distance: "1.8 km", body: "The closest stop to campus. Walk in fifteen minutes, or take an auto in five. For long-distance trains, get down at Varanasi Junction or Cantt — autos and app-cabs to Phoolpur are ~₹300-500 / ~35 min off-peak. Ping us on WhatsApp before you set out and we'll guide you on the cheapest route." },
  { num: "03", mode: "By road", place: "NH-56 · Varanasi → Phoolpur", distance: "Highway access", body: "NH-56 connects directly to Phoolpur, with the campus on the Parsara approach road. Easiest from Varanasi Cantt is an app-cab (Ola / Uber) or pre-paid auto from the station auto-stand — about 35 minutes off-peak. Confirm your visit on WhatsApp and we'll send the campus pin to your driver." },
];

const BRING: Bring[] = [
  { who: "Students", title: "If you have a JEECUP rank card,", body: "bring it. We'll show you which branches your rank can realistically secure at BIPE 4455, and which to put as backup. A list of branch questions helps too — no question is small." },
  { who: "Parents", title: "If you have fee comparisons,", body: "bring those sheets. We're happy to walk through any line item and explain why ours is set where it is. A list of placement queries — names of companies, salaries, joining locations — saves time." },
  { who: "Anyone", title: "Always bring", body: "a notebook. This is an engineering campus — you'll see things you'll want to write down. And bring curiosity. The campus tells you things a brochure can't." },
];

export default function Page() {
  const C = DATA.contact;
  const directionsUrl = "https://www.google.com/maps/search/?api=1&query=BIPE+Phoolpur+Varanasi";
  // TODO: replace with actual campus coordinates once GPS-confirmed by Estate Office
  // 28 May 2026 — switched from the legacy /maps?q=...&output=embed
  // URL (which Google has been intermittently 403-ing without an API
  // key) to the maps.google.com?q=...&t=&z=15&ie=UTF8&iwloc=&output=embed
  // form, which is the same robust pattern /contact and
  // /campus/phoolpur already use. Also boosted the BIPE-specific
  // anchor in the query so the map centres on the campus pin, not on
  // generic Phoolpur township.
  const mapEmbedUrl =
    "https://maps.google.com/maps?q=BIPE+Phoolpur+Varanasi&t=&z=15&ie=UTF8&iwloc=&output=embed";

  return (
    <div className="page-enter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Visit Campus", path: "/visit" },
            ]),
          ),
        }}
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
          position: "absolute", right: -180, top: -120, width: 460, height: 460, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 26%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: -160, bottom: -160, width: 380, height: 380, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 28%, transparent)",
          filter: "blur(130px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div className="eyebrow">Visit · Mon–Sat</div>
              <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "20ch" }}>
                See BIPE{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  before
                </span>{" "}
                you decide.
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "56ch" }}>
                Sixty to ninety minutes on campus, in Hindi or English, Monday to Saturday, 9am to 5pm. Walk-ins welcome. The campus tells you things a brochure can&apos;t.
              </p>
              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                {/* Primary path → the on-page booking form (anchored #book).
                    Added 6 Jun 2026: Clarity showed visitors landing on this
                    hero and backtracking to the homepage because the form was
                    buried below the fold — this is the immediate path to it. */}
                <a href="#book" className="btn btn-primary btn-lg">
                  Book your visit
                  <span lang="hi" style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.88, marginTop: 2 }}>
                    विज़िट फ़ॉर्म भरें
                  </span>
                </a>
                {/* Bilingual CTA pair — Hindi sub-label under each. */}
                <a href={C.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-lg">
                  <WhatsAppIcon /> Book on WhatsApp
                  <span lang="hi" style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.88, marginTop: 2 }}>
                    WhatsApp पर बुक करें
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
                  { num: "60–90", l: "minutes on campus" },
                  { num: "EN / हिं", l: "your language" },
                  { num: "Mon–Sat", l: "9 am – 5 pm" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 32, lineHeight: 0.9, color: "var(--brand)" }}>{s.num}</div>
                    <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-3)" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Appointment card mock */}
            <div style={{
              position: "relative", overflow: "hidden",
              borderRadius: 18, border: "1px solid var(--line)",
              background: "var(--white)",
              padding: 28,
              boxShadow: "0 24px 60px -24px rgba(10,26,63,0.18)",
              transform: "rotate(1.2deg)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 14, borderBottom: "1.5px dashed var(--line-2)" }}>
                <div>
                  <div className="eyebrow" style={{ color: "var(--brand)" }}>BIPE · ADMISSIONS</div>
                  <div style={{ marginTop: 4, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>CAMPUS VISIT · APPOINTMENT</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>
                  V-XXXX
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <div className="eyebrow" style={{ color: "var(--ink-3)" }}>DATE</div>
                <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 38, color: "var(--ink)", lineHeight: 1, marginTop: 6 }}>
                  __ / __ / 2026
                </div>
              </div>

              <div className="bipe-form-row" style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <div className="eyebrow" style={{ color: "var(--ink-3)" }}>TIME</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--brand)", fontSize: 18, marginTop: 6 }}>
                    10:00 AM
                  </div>
                </div>
                <div>
                  <div className="eyebrow" style={{ color: "var(--ink-3)" }}>DURATION</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--brand)", fontSize: 18, marginTop: 6 }}>
                    60–90 MIN
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 18, padding: "12px 14px", background: "var(--brand-soft)", borderRadius: 10 }}>
                <div className="eyebrow" style={{ color: "var(--brand)" }}>INCLUDES</div>
                <div style={{ marginTop: 6, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>
                  Principal&apos;s overview · lab tours · hostel walkthrough · mess visit · Q&amp;A
                </div>
              </div>

              <div style={{
                marginTop: 18, padding: "10px 14px",
                border: "1.5px solid var(--accent)",
                borderRadius: 10,
                display: "inline-flex", alignItems: "center", gap: 10,
                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
                color: "var(--accent-deep)",
                transform: "rotate(-2deg)",
              }}>
                ★ Cantt → Phoolpur · ~35 min by auto
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. WHAT A VISIT LOOKS LIKE (LIGHT)                                      */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 40, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">The shape of the visit</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                Five moves,{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  ninety minutes.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              The same five-step rhythm for every visiting family. We don&apos;t skip the parts that matter — and we don&apos;t pad the rest with corporate slideware.
            </p>
          </div>

          <div className="bipe-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
            {STEPS.map((s) => (
              <article key={s.num} className="card" style={{ padding: 24, background: "var(--white)" }}>
                <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 56, color: "var(--brand)", lineHeight: 0.85 }}>
                  {s.num}
                </div>
                <div style={{ marginTop: 16, fontWeight: 700, fontSize: 16, lineHeight: 1.25 }}>{s.title}</div>
                <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 13.5, lineHeight: 1.55 }}>
                  {s.body}
                </p>
              </article>
            ))}
          </div>

          <div className="bipe-img-strip" style={{ marginTop: 36, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <Img src={BIPE_IMG.computerLab} label="120-COMPUTER LAB" style={{ height: 220, borderRadius: 14 }} />
            <Img src={BIPE_IMG.workshop} label="WORKSHOP · WELDING" style={{ height: 220, borderRadius: 14 }} />
            <Img src={BIPE_IMG.hostel} label="HOSTEL WALKTHROUGH" style={{ height: 220, borderRadius: 14 }} />
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. BOOKING FORM                                                         */}
      {/* ====================================================================== */}
      <section id="book" className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden", scrollMarginTop: 96 }}>
        <div aria-hidden="true" style={{
          position: "absolute", left: -160, top: -120, width: 380, height: 380, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 18%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -140, bottom: -120, width: 320, height: 320, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 22%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 56, alignItems: "start" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--brand)" }}>Book your visit</div>
              <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "16ch" }}>
                Tell us when.{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  We&rsquo;ll call to confirm.
                </span>
              </h2>
              <p style={{ color: "var(--ink-2)", marginTop: 18, fontSize: 15.5, lineHeight: 1.7 }}>
                Drop your name, mobile and branch interest. Tell us a preferred date and slot in the message field (e.g. <em>&ldquo;Sat 12 Jul, 11 AM with parent&rdquo;</em>) — admissions will call within one working day to lock the date and line up a faculty mentor for that branch.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "22px 0 0", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Confirmation by phone within one working day",
                  "Mon–Sat · 10 AM to 4 PM slots",
                  "Auto / app-cab guidance from Varanasi Cantt",
                  "Talk to actual faculty, not just admissions staff",
                ].map((s) => (
                  <li key={s} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "start", color: "var(--ink-2)", fontSize: 14, lineHeight: 1.55 }}>
                    <span style={{ color: "var(--brand)", fontWeight: 700, marginTop: 1 }}>✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <EnquiryForm context="visit" />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. ALT CHANNELS — BRAND TINTED                                          */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "color-mix(in oklab, var(--brand) 8%, var(--paper))", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", right: -140, top: -100, width: 380, height: 380, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 22%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 36 }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--brand)" }}>Or use another channel</div>
              <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "20ch" }}>
                Don&rsquo;t want a form?{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  Reach us directly.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "40ch", justifySelf: "end", textAlign: "right" }}>
              Walk-ins are welcome too. Use whichever channel feels easiest — we&rsquo;ll have a mentor ready either way.
            </p>
          </div>

          {([
            {
              num: "01",
              eyebrow: "Fastest",
              title: "WhatsApp instant",
              body: "Send your name, branch interest and preferred date. We confirm in under 24 hours, in Hindi or English.",
              cta: <a href={C.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa"><WhatsAppIcon /> Open WhatsApp</a>,
              tone: "wa",
            },
            {
              num: "02",
              eyebrow: "For parents who prefer voice",
              title: "Phone call",
              body: "Talk to admissions directly, Mon–Sat 9am to 5pm. No call-tree, no IVR.",
              cta: <a href={`tel:${C.phone}`} className="btn btn-primary"><PhoneIcon /> {C.phone}</a>,
              tone: "brand",
            },
            {
              num: "03",
              eyebrow: "For larger groups",
              title: "Email request",
              body: "Coming with multiple parents, siblings, or a school group? Email us so we can plan a proper tour and reserve seats with the Principal.",
              cta: <a href={`mailto:${C.email}`} className="btn btn-ghost">{C.email} <ArrowIcon size={14} /></a>,
              tone: "neutral",
            },
          ] as Channel[]).map((ch) => (
            // bipe-channel-row class — see globals.css. The 3-column
            // grid (number · text · CTA) crushes the middle column on
            // mobile, wrapping the title text one letter per line. The
            // safety-net rule at globals.css:1680 explicitly skips
            // class*="card" elements; this class is the explicit
            // opt-in to mobile stacking.
            <article key={ch.num} className="card bipe-channel-row" style={{
              padding: 0, marginBottom: 14, overflow: "hidden",
              display: "grid", gridTemplateColumns: "auto 1fr auto",
              gap: 0, alignItems: "center",
              background: ch.tone === "wa" ? "color-mix(in oklab, #25D366 8%, var(--white))"
                : ch.tone === "brand" ? "color-mix(in oklab, var(--brand) 6%, var(--white))"
                : "var(--white)",
            }}>
              <div style={{ padding: "28px 32px" }}>
                <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 56, color: ch.tone === "wa" ? "#1eaf55" : "var(--brand)", lineHeight: 0.85 }}>
                  {ch.num}
                </div>
              </div>
              <div style={{ padding: "26px 24px" }}>
                <div className="eyebrow" style={{ color: ch.tone === "wa" ? "#1eaf55" : "var(--brand)" }}>{ch.eyebrow}</div>
                <div style={{ marginTop: 6, fontWeight: 700, fontSize: 18 }}>{ch.title}</div>
                <p style={{ marginTop: 8, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.55, maxWidth: "60ch" }}>
                  {ch.body}
                </p>
              </div>
              <div style={{ padding: "26px 32px" }}>
                {ch.cta}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. HOW TO REACH (DARK)                                                  */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--ink)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
          backgroundSize: "72px 72px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: -180, top: -180, width: 480, height: 480, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 50%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -160, bottom: -160, width: 420, height: 420, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 36%, transparent)",
          filter: "blur(130px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 56, alignItems: "start", marginBottom: 40 }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>How to reach</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, color: "var(--paper)", maxWidth: "16ch" }}>
                Phoolpur, Varanasi —{" "}
                <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                  closer than it looks.
                </span>
              </h2>
            </div>
            <p style={{ color: "color-mix(in oklab, var(--paper) 78%, transparent)", marginTop: 8, fontSize: 16, lineHeight: 1.7, maxWidth: "52ch" }}>
              The campus sits along NH-56, eighteen minutes off the airport, ten minutes off Khalishpur railway station. From Varanasi Cantt or BHU it&rsquo;s a 35-minute auto / app-cab ride — ping us on WhatsApp before you set out and we&rsquo;ll send the campus pin straight to your driver.
            </p>
          </div>

          <div className="bipe-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {MODES.map((m) => (
              <article key={m.num} style={{
                padding: 28,
                borderRadius: 18,
                background: "color-mix(in oklab, var(--paper) 5%, transparent)",
                border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
                position: "relative", overflow: "hidden",
              }}>
                <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 56, color: "var(--accent)", lineHeight: 0.85 }}>
                  {m.num}
                </div>
                <div className="eyebrow" style={{ marginTop: 14, color: "var(--accent)" }}>{m.mode}</div>
                <div style={{ marginTop: 6, fontWeight: 700, fontSize: 17, color: "var(--paper)", lineHeight: 1.3 }}>
                  {m.place}
                </div>
                <span className="pill" style={{ marginTop: 12, background: "color-mix(in oklab, var(--accent) 24%, transparent)", color: "var(--accent)" }}>
                  {m.distance}
                </span>
                <p style={{ marginTop: 14, color: "color-mix(in oklab, var(--paper) 78%, transparent)", fontSize: 13.5, lineHeight: 1.6 }}>
                  {m.body}
                </p>
              </article>
            ))}
          </div>

          <div style={{ marginTop: 28, padding: "16px 22px", border: "1px dashed color-mix(in oklab, var(--paper) 24%, transparent)", borderRadius: 14, fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.06em", color: "color-mix(in oklab, var(--paper) 70%, transparent)", textAlign: "center" }}>
            Varanasi Cantt → campus is ~35 min by auto / app-cab — confirm by WhatsApp the evening before and we&rsquo;ll send the campus pin to your driver.
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. MAP & ADDRESS (LIGHT)                                                */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 32, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">Find the gate</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "18ch" }}>
                Six acres,{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  one address.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Drop the address into your maps app and the route will surface NH-56 → Phoolpur → Parsara → Gajokhar. The campus sits behind the secondary school.
            </p>
          </div>

          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 22 }}>
            <div className="card" style={{ padding: 0, overflow: "hidden", minHeight: 420, position: "relative" }}>
              {/* height: 420 (explicit) instead of height: 100% — the
                  100% form collapses to 0 on mobile when the parent
                  card stacks via bipe-split's responsive rule, which
                  left the map slot rendering as an empty white box
                  (28 May 2026 bug report on mobile). */}
              <iframe
                src={mapEmbedUrl}
                title="BIPE campus location · Phoolpur, Varanasi"
                style={{ border: 0, width: "100%", height: 420, minHeight: 420, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            <div className="card" style={{ padding: 36, background: "var(--paper-2)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div className="eyebrow">Campus address</div>
                <div className="serif" style={{ marginTop: 14, fontStyle: "italic", fontWeight: 400, fontSize: 28, lineHeight: 1.2, color: "var(--ink)" }}>
                  {C.address}
                </div>
                <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="eyebrow">JEECUP code</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--brand)" }}>{C.jeecup}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="eyebrow">AICTE id</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--brand)" }}>{C.aicte}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="eyebrow">Visit hours</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--ink)" }}>MON–SAT · 9–5</span>
                  </div>
                </div>
              </div>

              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: 24, alignSelf: "flex-start" }}>
                Get directions <ArrowIcon size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 6. WHAT TO BRING (LIGHT)                                                */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 40, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">Pack the small things</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "18ch" }}>
                What to{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  bring along.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Nothing is required — we&apos;ll have a full visit ready either way. But these few things turn a 90-minute visit into a properly useful one.
            </p>
          </div>

          <div className="bipe-form-row" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
            {BRING.map((b, i) => (
              <article key={b.who} className="card" style={{
                padding: 32,
                background: i % 2 === 0 ? "var(--white)" : "color-mix(in oklab, var(--brand) 4%, var(--white))",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span className="pill" style={{ background: "var(--brand-soft)", color: "var(--brand)" }}>For {b.who}</span>
                  <span className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 32, color: "var(--brand)", lineHeight: 0.85 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="serif" style={{ marginTop: 18, fontStyle: "italic", fontWeight: 400, fontSize: 26, lineHeight: 1.2, color: "var(--ink)" }}>
                  {b.title}
                </div>
                <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.6 }}>
                  {b.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 7. WHY VISIT BEFORE APPLYING — DARK PULL QUOTE                          */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--ink)", color: "var(--paper)", position: "relative", overflow: "hidden", paddingTop: 96, paddingBottom: 96 }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
          backgroundSize: "72px 72px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
          width: 720, height: 720, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 28%, transparent)",
          filter: "blur(160px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative", textAlign: "center" }}>
          <div className="eyebrow" style={{ color: "var(--accent)" }}>Why visit at all</div>
          <p className="serif" style={{
            marginTop: 22,
            fontStyle: "italic", fontWeight: 400,
            fontSize: "clamp(44px, 6.4vw, 96px)",
            lineHeight: 1.05, letterSpacing: "-0.02em",
            maxWidth: "16ch", margin: "22px auto 0",
            color: "var(--paper)",
          }}>
            <span style={{ color: "var(--accent)" }}>Engineering</span> is built by hand.
          </p>
          <p style={{ marginTop: 28, color: "color-mix(in oklab, var(--paper) 80%, transparent)", fontSize: 17, lineHeight: 1.7, maxWidth: "60ch", margin: "28px auto 0" }}>
            We&apos;ve watched hundreds of families decide on the diploma here on a 90-minute walk. The campus tells you things a brochure can&apos;t — the smell of the welding shop, the rhythm of the machine shop, the look on a student&apos;s face when they explain what they&apos;re building. Come and see for yourself.
          </p>
          <div style={{ marginTop: 28, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 60%, transparent)" }}>
            — Admissions cell, BIPE
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 8. FINAL CTA                                                            */}
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
              <div className="eyebrow">Book your visit</div>
              <p className="serif" style={{
                marginTop: 22,
                fontStyle: "italic", fontWeight: 400,
                fontSize: "clamp(40px, 5.4vw, 80px)",
                lineHeight: 1.05, letterSpacing: "-0.02em",
                maxWidth: "16ch", margin: "22px auto 0",
              }}>
                Pick a day.{" "}
                <span style={{ color: "var(--brand)" }}>Walk in.</span>
              </p>
              <div className="row" style={{ justifyContent: "center", marginTop: 36, flexWrap: "wrap" }}>
                <a href={C.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-lg">
                  <WhatsAppIcon /> WhatsApp now
                </a>
                <a href={`tel:${C.phone}`} className="btn btn-primary btn-lg">
                  <PhoneIcon /> Call us
                </a>
                <a href={`mailto:${C.email}`} className="btn btn-ghost btn-lg">
                  Email request <ArrowIcon size={14} />
                </a>
              </div>
              <div style={{ marginTop: 30, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                {C.address} · MON–SAT · 9 AM – 5 PM
              </div>
              <div style={{ marginTop: 22, paddingTop: 22, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                <Link href="/apply" className="btn btn-ghost btn-sm">Or start the application <ArrowIcon size={12} /></Link>
                <Link href="/contact" className="btn btn-ghost btn-sm">Other ways to reach us <ArrowIcon size={12} /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
