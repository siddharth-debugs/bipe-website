import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metaFor } from "@/lib/routes";
import { DATA } from "@/lib/data";
import { BIPE_IMG } from "@/lib/images";
import { Img } from "@/components/ui/Img";
import { ArrowIcon, WhatsAppIcon, PhoneIcon } from "@/components/shell/Icons";
import { EventsGallery } from "@/components/events/EventsGallery";
import { EVENT_PHOTOS, EVENT_YEARS } from "@/lib/events-gallery";

export const metadata: Metadata = metaFor("events");

type Flagship = {
  hi: string;
  en: string;
  eyebrow: string;
  headline: React.ReactNode;
  body: React.ReactNode;
  date: string;
  pillTone: "brand" | "accent";
  img: string;
  imgLabel: string;
  side: "left" | "right";
  tags: string[];
};

const FLAGSHIPS: Flagship[] = [
  {
    hi: "उत्कर्ष",
    en: "Utkarsh",
    eyebrow: "UTKARSH · उत्कर्ष",
    headline: <>An <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>annual function.</span></>,
    body: <>Speech, dance, drama and music. Parents and the wider community are invited; this is the evening when the institution and the family sit in the same hall. Closing performance from the senior batch.</>,
    date: "February",
    pillTone: "brand",
    img: BIPE_IMG.culturalDance,
    imgLabel: "UTKARSH · CULTURAL EVENING",
    side: "left",
    tags: ["Speech", "Classical dance", "Drama", "Music"],
  },
  {
    hi: "टेक्नोफेस्ट",
    en: "Technofest",
    eyebrow: "TECHNOFEST · टेक्नोफेस्ट",
    headline: <>A <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>technical project fair.</span></>,
    body: <>Two days of live demonstrations &mdash; civil scale-models, electrical control panels, mechanical CAD outputs, dairy processing setups. Open to schools, parents and visitors.</>,
    date: "21–22 February",
    pillTone: "accent",
    img: BIPE_IMG.projectFair,
    imgLabel: "TECHNOFEST · PROJECT FAIR",
    side: "right",
    tags: ["Civil models", "Electrical", "CAD", "Dairy"],
  },
  {
    hi: "स्पर्धा",
    en: "Spardha",
    eyebrow: "SPARDHA · स्पर्धा",
    headline: <>A <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>sports meet.</span></>,
    body: <>Five days of inter-branch, inter-batch and inter-institute competition &mdash; track &amp; field, volleyball, basketball, kabaddi, table tennis. Closing ceremony with the principal&rsquo;s address.</>,
    date: "15–19 February",
    pillTone: "brand",
    img: BIPE_IMG.trackField,
    imgLabel: "SPARDHA · SPORTS MEET",
    side: "left",
    tags: ["Track & field", "Volleyball", "Basketball", "Kabaddi", "Table tennis"],
  },
];

export default function Page() {
  const upcoming = DATA.events.slice(0, 4);

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
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div className="eyebrow">§ Annual events · February</div>
              <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "20ch" }}>
                Three flagship events.{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  One vibrant campus.
                </span>
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "54ch" }}>
                Every February, the campus opens up &mdash; culture, technology, sport. Parents, siblings and prospective students are invited. The gates stay open through the week.
              </p>
              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                <Link href="/visit" className="btn btn-primary btn-lg">Book a campus visit <ArrowIcon size={16} /></Link>
                <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa"><WhatsAppIcon /> Visitor pass on WhatsApp</a>
              </div>
              <div style={{ marginTop: 36, paddingTop: 20, borderTop: "1px solid var(--line)", display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Three names &rarr;
                </span>
                {[["उत्कर्ष", "Utkarsh"], ["टेक्नोफेस्ट", "Technofest"], ["स्पर्धा", "Spardha"]].map(([hi, en], i) => (
                  <span key={en} style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
                    <span className="serif" style={{ fontStyle: "italic", fontSize: 22, color: "var(--brand)" }}>{hi}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-3)" }}>{en}</span>
                    {i < 2 && <span style={{ width: 4, height: 4, borderRadius: 999, background: "var(--accent)" }} />}
                  </span>
                ))}
              </div>
            </div>

            {/* 3-tile collage */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Img src={BIPE_IMG.culturalDance} label="UTKARSH" style={{ height: 280, borderRadius: 18, gridRow: "span 2" }} />
              <Img src={BIPE_IMG.projectFair} label="TECHNOFEST" style={{ height: 130, borderRadius: 18 }} />
              <Img src={BIPE_IMG.trackField} label="SPARDHA" style={{ height: 138, borderRadius: 18 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2-4. FLAGSHIP EVENTS                                                    */}
      {/* ====================================================================== */}
      {FLAGSHIPS.map((f, idx) => {
        const isLeft = f.side === "left";
        const sectionBg = idx % 2 === 0 ? "var(--paper-2)" : "var(--white)";
        return (
          <section key={f.en} className="section" style={{ background: sectionBg, position: "relative", overflow: "hidden" }}>
            <div aria-hidden="true" style={{
              position: "absolute",
              [isLeft ? "left" : "right"]: -120,
              top: -120, width: 320, height: 320, borderRadius: "50%",
              background: f.pillTone === "accent"
                ? "color-mix(in oklab, var(--accent) 22%, transparent)"
                : "color-mix(in oklab, var(--brand) 18%, transparent)",
              filter: "blur(120px)", pointerEvents: "none",
            }} />
            <div className="container" style={{ position: "relative" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: isLeft ? "1.1fr 1fr" : "1fr 1.1fr",
                gap: 56, alignItems: "center",
              }}>
                <div style={{ order: isLeft ? 0 : 1 }}>
                  <Img src={f.img} label={f.imgLabel} style={{ height: 460, borderRadius: 22 }} />
                </div>
                <div style={{ order: isLeft ? 1 : 0 }}>
                  <span className={f.pillTone === "accent" ? "pill pill-accent" : "pill"}>
                    {f.eyebrow}
                  </span>
                  <div className="serif" style={{
                    marginTop: 14, fontStyle: "italic", fontWeight: 400,
                    fontSize: "clamp(56px, 6vw, 88px)", lineHeight: 0.92,
                    color: f.pillTone === "accent" ? "var(--accent-deep)" : "var(--brand)",
                    letterSpacing: "-0.02em",
                  }}>
                    {f.hi}
                  </div>
                  <h2 className="bipe-h1" style={{ marginTop: 18, maxWidth: "16ch" }}>
                    {f.headline}
                  </h2>
                  <p style={{ marginTop: 18, color: "var(--ink-2)", fontSize: 16, lineHeight: 1.75, maxWidth: "52ch" }}>
                    {f.body}
                  </p>
                  <div style={{ marginTop: 22, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                    <span style={{
                      padding: "8px 16px",
                      background: f.pillTone === "accent" ? "var(--accent)" : "var(--brand)",
                      color: f.pillTone === "accent" ? "var(--ink)" : "#fff",
                      borderRadius: 999,
                      fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
                    }}>
                      {f.date}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                      Phoolpur campus &middot; gates open
                    </span>
                  </div>
                  <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {f.tags.map((t) => <span key={t} className="pill">{t}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ====================================================================== */}
      {/* 4.5 PHOTO GALLERY — Pinterest masonry + lightbox                        */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", left: -180, top: -120, width: 460, height: 460, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 14%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            gap: 32,
            alignItems: "end",
            marginBottom: 32,
            paddingBottom: 22,
            borderBottom: "1px solid var(--line)",
            flexWrap: "wrap",
          }}>
            <div>
              <div className="eyebrow">§ Photo gallery</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "22ch" }}>
                {EVENT_PHOTOS.length} moments,{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  one campus.
                </span>
              </h2>
            </div>
            <div />
            <p style={{
              color: "var(--ink-3)",
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              maxWidth: "32ch",
              lineHeight: 1.6,
              textAlign: "right",
              paddingBottom: 8,
            }}>
              {EVENT_YEARS.length} years on record · click any photo
            </p>
          </div>
          <EventsGallery />
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. OPEN TO FAMILIES — DARK                                              */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--ink)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
          backgroundSize: "72px 72px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: -180, top: -180, width: 460, height: 460, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 50%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -120, bottom: -160, width: 380, height: 380, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 38%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>§ Open all week</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "18ch", color: "var(--paper)" }}>
                <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                  Bring your family.
                </span>{" "}
                Bring your school.
              </h2>
              <p style={{ marginTop: 22, fontSize: 16, lineHeight: 1.75, color: "color-mix(in oklab, var(--paper) 80%, transparent)", maxWidth: "54ch" }}>
                Parents, siblings, prospective students &mdash; everyone is welcome. Gates stay open through the week of February events. School visits are arranged on request; we&rsquo;ll pair your group with a senior student for a guided walk-through.
              </p>
              <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                {[
                  ["Free", "Entry · all events"],
                  ["EN/हिं", "Bilingual hosts"],
                  ["School", "Group visits"],
                ].map(([n, l]) => (
                  <div key={l} style={{
                    padding: "18px 18px",
                    background: "color-mix(in oklab, var(--paper) 6%, transparent)",
                    border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
                    borderRadius: 14,
                  }}>
                    <div className="serif" style={{ fontStyle: "italic", fontSize: 28, color: "var(--accent)", lineHeight: 1 }}>{n}</div>
                    <div style={{ marginTop: 8, fontSize: 12, fontFamily: "var(--font-mono)", letterSpacing: "0.12em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 64%, transparent)" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Logistics card */}
            <div style={{
              padding: "28px 28px",
              background: "color-mix(in oklab, var(--paper) 6%, transparent)",
              border: "1px solid color-mix(in oklab, var(--paper) 16%, transparent)",
              borderRadius: 18,
            }}>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>Logistics</div>
              <div className="serif" style={{ marginTop: 10, fontStyle: "italic", fontSize: 28, color: "var(--paper)", lineHeight: 1.25 }}>
                Getting to Phoolpur.
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0 0", display: "grid", gap: 14 }}>
                {[
                  ["Free shuttle", "Varanasi Cantt &rarr; campus"],
                  ["Admissions desk", "Mon–Sat · 9 AM – 5 PM"],
                  ["Visitor pass", "WhatsApp 24 hrs in advance"],
                  ["Phone", DATA.contact.phone],
                ].map(([k, v]) => (
                  <li key={k} style={{
                    display: "grid", gridTemplateColumns: "auto 1fr", gap: 14,
                    paddingBottom: 14, borderBottom: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
                  }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", minWidth: 110 }}>{k}</span>
                    <span style={{ fontSize: 14, color: "color-mix(in oklab, var(--paper) 84%, transparent)" }} dangerouslySetInnerHTML={{ __html: v }} />
                  </li>
                ))}
              </ul>
              <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" style={{
                marginTop: 14, display: "inline-flex", alignItems: "center", gap: 10,
                color: "var(--accent)", fontWeight: 600, fontSize: 14,
              }}>
                <WhatsAppIcon /> Request a visitor pass <ArrowIcon size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 6. NEWS & ANNOUNCEMENTS                                                 */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 40, paddingBottom: 24, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">§ News &amp; announcements</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "20ch" }}>
                What&rsquo;s on{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  the calendar.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Recent announcements from the campus &mdash; admissions windows, placement drives, faculty workshops, open houses for Class 10 students.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 22 }}>
            {upcoming.map((e) => (
              <article key={e.title} className="card" style={{ padding: 28, position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{
                  position: "absolute", right: -40, top: -40, width: 140, height: 140, borderRadius: "50%",
                  background: "color-mix(in oklab, var(--brand) 8%, transparent)",
                }} />
                <div style={{ position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span className="pill">{e.tag}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "var(--ink-3)", letterSpacing: "0.04em" }}>
                      {e.date}
                    </span>
                  </div>
                  <h3 className="bipe-h3" style={{ marginTop: 14, fontSize: 21 }}>{e.title}</h3>
                  <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.65 }}>{e.body}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{
            marginTop: 36,
            padding: "32px 36px",
            borderRadius: 22,
            background: "var(--paper-2)",
            border: "1px solid var(--line)",
            display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 32, alignItems: "center",
          }}>
            <div>
              <div className="eyebrow">§ Visit us</div>
              <h3 className="bipe-h3" style={{ marginTop: 8, fontSize: 22 }}>
                Walk the campus before the next event.
              </h3>
              <p style={{ marginTop: 8, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.65, maxWidth: "54ch" }}>
                Free shuttle from Varanasi Cantt. Front desk Mon&ndash;Sat. WhatsApp for a visitor pass.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <Link href="/visit" className="btn btn-primary">Book a campus visit <ArrowIcon size={14} /></Link>
              <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa"><WhatsAppIcon /> WhatsApp</a>
              <a href={`tel:${DATA.contact.phone}`} className="btn btn-ghost"><PhoneIcon /> {DATA.contact.phone}</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
