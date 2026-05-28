import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metadataFor } from "@/lib/seo";
import { DATA } from "@/lib/data";
import { BIPE_IMG } from "@/lib/images";
import { Img } from "@/components/ui/Img";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";
import { FACULTY } from "@/lib/faculty";
import { personSchema } from "@/lib/faculty-schema";
import { SITE_URL } from "@/lib/routes";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("principal"); }

/**
 * Schema.org ProfilePage + Person JSON-LD for the Principal.
 *
 * Why ProfilePage (not just CollectionPage as on /faculty):
 *
 *   This page is the canonical bio for one named person — the Principal.
 *   ProfilePage is Google's purpose-built type for that surface and earns
 *   a richer SERP card (name + jobTitle + image, distinct from the plain
 *   title/snippet pair).
 *
 *   The mainEntity Person reuses the same personSchema() helper as
 *   /faculty so the alumniOf and hasCredential nodes stay consistent
 *   across both surfaces. Google de-duplicates Person by @id, so emitting
 *   the same person on two pages is correct and intentional.
 *
 * If the Principal record is ever missing (defensive: nothing depends on
 * a hardcoded "rahul-srivastava" id in the schema layer), we silently
 * skip the schema rather than emit a broken Person node.
 */
const PRINCIPAL_RECORD = FACULTY.find((f) => f.designation === "Principal");

const PRINCIPAL_JSON_LD = PRINCIPAL_RECORD
  ? {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/principal`,
      url: `${SITE_URL}/principal`,
      name: `${PRINCIPAL_RECORD.name} · Principal · BIPE Varanasi`,
      description:
        `Principal's office at Banaras Institute of Polytechnic & Engineering — ${PRINCIPAL_RECORD.name}'s qualifications, experience and message to incoming students.`,
      mainEntity: personSchema(PRINCIPAL_RECORD),
    }
  : null;

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
    sub: "AICTE · BTEUP · AISHE",
    body:
      "AICTE Permanent ID 1-488233171, EoA F.No. Northern/1-46216893240/2026/EOA dated 16 March 2026. BTEUP/JEECUP code 4455. AISHE registered. Documents are public; copies on request.",
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
      {/* ProfilePage + Person JSON-LD — see PRINCIPAL_JSON_LD above for
          why ProfilePage (not CollectionPage) is the right type here.
          Skipped silently if the Principal record is missing from the
          faculty roster — defensive, never broken-shape. */}
      {PRINCIPAL_JSON_LD && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PRINCIPAL_JSON_LD) }}
        />
      )}

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
              <Img src={BIPE_IMG.principal} alt="Rahul Srivastava — Principal, BIPE Varanasi" aspectRatio="4/5" style={{ borderRadius: 18, position: "relative" }} />
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
                <a href="mailto:principal@bipe.ac.in" style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--brand)", fontWeight: 600 }}>
                  principal@bipe.ac.in
                </a>
                <span className="pill pill-accent">CONTACT</span>
                <a href="tel:+919198767676" style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--ink)", fontWeight: 600 }}>
                  +91 91987 67676
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
            fontSize: "clamp(34px, 4.8vw, 72px)",
            lineHeight: 1.1, letterSpacing: "-0.02em",
            color: "var(--paper)",
            maxWidth: "22ch", margin: "0 auto",
          }}>
            We do not prepare students for examinations alone —{" "}
            <span style={{ color: "var(--accent)" }}>we prepare them for work that matters.</span>
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
            {/* Shloka header */}
            <div style={{ textAlign: "center" }}>
              <div className="serif" style={{
                fontStyle: "italic", fontWeight: 400,
                fontSize: "clamp(22px, 2.4vw, 30px)",
                lineHeight: 1.3, color: "var(--brand)",
                letterSpacing: "-0.005em",
              }}>
                ॥&nbsp;न हि ज्ञानेन सदृशं पवित्रमिह विद्यते&nbsp;॥
              </div>
              <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                Bhagavad Gita · 4.38
              </div>
            </div>

            <div className="eyebrow" style={{ textAlign: "center", marginTop: 28 }}>A note from the principal&apos;s desk</div>
            <h2 className="bipe-h2" style={{ marginTop: 14, textAlign: "center", maxWidth: "20ch", marginInline: "auto" }}>
              Welcome to the{" "}
              <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                BIPE family.
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
                  W
                </span>
                elcome to BIPE — an institution where knowledge meets the demands of industry. We believe that skill is the purest form of knowledge, and every programme we offer is built on that belief: <strong style={{ color: "var(--ink)" }}>50% theory to understand the why, and 50% practice to master the how.</strong>
              </p>
              <p style={{ marginTop: 22 }}>
                Our workshops, laboratories and industry partnerships ensure that every BIPE graduate steps into the job market with <strong style={{ color: "var(--ink)" }}>confidence, competence and professional character</strong>. To our students: honour your craft, respect your tools, and take pride in work done right.
              </p>
              <p style={{ marginTop: 22 }}>
                Sixteen years of training students from across Eastern UP into skilled diploma technicians — professionals who can <em>hold a tool, read a drawing and build an independent livelihood</em>.
              </p>
              <p style={{ marginTop: 22 }}>
                To every parent, student and well-wisher — <strong style={{ color: "var(--brand)" }}>welcome to the BIPE family.</strong>
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
              <div className="eyebrow">The four promises</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                What you can{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  hold us to.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Each promise below is verifiable on a single page of this site — or by writing to the Principal's office for documents on letterhead.
            </p>
          </div>

          <div className="bipe-form-row" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {PROMISES.map((p) => (
              <article key={p.roman} className="card" style={{ padding: 32 }}>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 28, alignItems: "start" }}>
                  <div className="serif" style={{
                    fontStyle: "italic", fontWeight: 400,
                    fontSize: 56, lineHeight: 0.85,
                    color: "var(--brand)",
                    // Auto-fit so the italic numeral never clips into the
                    // title column. min-width keeps all four cards visually
                    // aligned even though "(i)" is much narrower than "(iv)".
                    minWidth: 84,
                    textAlign: "left",
                    whiteSpace: "nowrap",
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
                <div className="eyebrow" style={{ color: "var(--accent)" }}>MEET THE PRINCIPAL</div>
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
