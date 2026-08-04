import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { metadataFor } from "@/lib/seo";
import { ArrowIcon } from "@/components/shell/Icons";
import { SITE_URL } from "@/lib/routes";
import {
  DIRECTOR,
  DIRECTOR_CAREER,
  DIRECTOR_EDUCATION,
  DIRECTOR_HONOURS,
  DIRECTOR_MESSAGE,
  DIRECTOR_NATIONAL_ROLES,
  DIRECTOR_QUOTE,
  DIRECTOR_STATS,
} from "@/lib/leadership";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("director");
}

/**
 * ProfilePage + Person JSON-LD.
 *
 * Mirrors the CHAIRMAN_JSON_LD shape in app/chairman/page.tsx (the
 * Director is not a lib/faculty.ts record — he is institutional
 * leadership rather than teaching faculty, the same call made for the
 * Chairman).
 *
 * `alumniOf` and `worksFor` are the entity-binding properties that let
 * Google connect this person to IIT (BHU) and to BIPE's own #org node.
 * `knowsAbout` carries his research fields, which is what AI answer
 * engines read when asked "who leads BIPE".
 */
const DIRECTOR_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    "@id": `${SITE_URL}/director#person`,
    name: DIRECTOR.name,
    givenName: "S. P.",
    familyName: "Tewari",
    honorificPrefix: "Prof. (Dr.)",
    jobTitle: "Director",
    description:
      "Director of Banaras Institute of Polytechnic & Engineering (BIPE), Varanasi. Formerly Professor of Mechanical Engineering at IIT (BHU) Varanasi, where he taught for 38 years. Ph.D. in Welding; Fellow of the Institution of Engineers (India).",
    image: `${SITE_URL}${DIRECTOR.photo}`,
    url: `${SITE_URL}/director`,
    worksFor: { "@id": `${SITE_URL}#org` },
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Indian Institute of Technology (BHU) Varanasi",
        url: "https://www.iitbhu.ac.in/",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "Motilal Nehru National Institute of Technology Allahabad",
        url: "https://www.mnnit.ac.in/",
      },
    ],
    knowsAbout: [
      "Welding technology",
      "Foundry and casting",
      "Production engineering",
      "Manufacturing science",
      "Technical education",
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Ph.D. (Welding), IT-BHU Varanasi",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Fellow, Institution of Engineers (India) — FIE",
      },
    ],
    award: [
      "Best Paper Award medal, ICSET 2018, New York",
      "ISTE-GSFC National Award (First Prize, 2004) for guiding the best M.Tech thesis in Mechanical Engineering",
      "ISTE-GSFC National Award (Second Prize, 2003 and 2006)",
    ],
  },
};

/* ────────────────────────────────────────────────────────────── */

export default function Page() {
  return (
    <div className="page-enter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(DIRECTOR_JSON_LD) }}
      />

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
          background: "color-mix(in oklab, var(--brand) 28%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: -180, bottom: -160, width: 420, height: 420, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 28%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 64, alignItems: "center" }}>
            {/* LEFT — portrait in an offset outline frame.
                Now a proper 889x1000 studio headshot (supplied 4 Aug
                2026), so the earlier 340px cap that protected the
                low-resolution résumé scan is gone; 4:5 matches the
                chairman page's portrait proportion and crops this
                source almost not at all. */}
            <div style={{ position: "relative", width: "100%", maxWidth: 400, marginInline: "auto" }}>
              <div aria-hidden="true" style={{
                position: "absolute", inset: 0, transform: "translate(16px, 16px)",
                border: "1px solid var(--brand)", borderRadius: 18, pointerEvents: "none",
              }} />
              <div style={{
                position: "relative", overflow: "hidden", borderRadius: 18,
                border: "1px solid var(--line)", background: "var(--white)",
                aspectRatio: "4 / 5",
              }}>
                <Image
                  src={DIRECTOR.photo}
                  alt={`${DIRECTOR.name} — Director, Banaras Institute of Polytechnic & Engineering`}
                  fill
                  sizes="(max-width: 900px) 92vw, 400px"
                  priority
                  style={{ objectFit: "cover", objectPosition: "center 20%" }}
                />
              </div>
            </div>

            {/* RIGHT — identity */}
            <div>
              <div className="eyebrow" style={{ color: "var(--accent-deep)" }}>A new chapter for BIPE</div>
              <h1 className="bipe-h1" style={{ marginTop: 16, fontWeight: 500 }}>
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em" }}>
                  Prof. (Dr.) S. P. Tewari
                </span>
                <span style={{ display: "block", fontSize: "0.6em", marginTop: 8, color: "var(--ink-2)", fontWeight: 500, letterSpacing: "-0.01em" }}>
                  Director
                </span>
              </h1>
              <p className="lead" style={{ marginTop: 18, maxWidth: "52ch" }}>
                For thirty-eight years he taught engineering at <strong>IIT (BHU), Varanasi</strong> — rising from Lecturer in 1981 to Professor of Mechanical Engineering. He now leads BIPE.
              </p>
              <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--ink-3)", marginTop: 8, fontSize: 17 }}>
                {DIRECTOR.roleHi} · पूर्व प्रोफ़ेसर, आई.आई.टी. (बी.एच.यू.) वाराणसी
              </p>

              <div style={{ marginTop: 28, display: "grid", gap: 10, gridTemplateColumns: "auto 1fr", alignItems: "center" }}>
                <span className="pill" style={{ background: "var(--brand)", color: "#fff" }}>DOCTORATE</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-2)", fontWeight: 600 }}>
                  Ph.D. (Welding) · IT-BHU Varanasi
                </span>
                <span className="pill pill-accent">FELLOW</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-2)", fontWeight: 600 }}>
                  Institution of Engineers (India) · FIE
                </span>
              </div>

              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                <Link href="#message" className="btn btn-primary">Read his message <ArrowIcon size={14} /></Link>
                <Link href="/visit" className="btn btn-ghost">Visit our campus</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. CREDENTIAL BAND                                                      */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--brand-tint)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", paddingTop: 44, paddingBottom: 44 }}>
        <div className="container">
          <div style={{
            display: "grid", gap: 20,
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          }}>
            {DIRECTOR_STATS.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 46, lineHeight: 1, color: "var(--brand)" }}>
                  {s.value}
                </div>
                <div style={{ marginTop: 10, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)", lineHeight: 1.5 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. THE MESSAGE                                                          */}
      {/* ====================================================================== */}
      <section id="message" className="section bipe-pad" style={{ paddingTop: 84, paddingBottom: 84 }}>
        <div className="container" style={{ maxWidth: 780 }}>
          <div className="eyebrow" style={{ textAlign: "center" }}>A note from the director&rsquo;s desk</div>
          <h2 className="bipe-h2" style={{ marginTop: 14, textAlign: "center", maxWidth: "20ch", marginInline: "auto" }}>
            Why I came to a{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>polytechnic.</span>
          </h2>

          <div style={{ marginTop: 44, fontSize: 17, lineHeight: 1.8, color: "var(--ink-2)" }}>
            {DIRECTOR_MESSAGE.map((para, i) => (
              <p key={i} style={{ marginTop: i === 0 ? 0 : 22 }}>
                {para}
              </p>
            ))}
          </div>

          {/* Signature block */}
          <div style={{ marginTop: 40, paddingTop: 28, borderTop: "1px solid var(--line)" }}>
            <div className="serif" style={{ fontStyle: "italic", fontSize: 26, color: "var(--brand)", lineHeight: 1.2 }}>
              {DIRECTOR.name}
            </div>
            <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-3)" }}>
              Director · BIPE Varanasi · Former Professor, IIT (BHU)
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. PULL QUOTE — full-bleed dark                                         */}
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
          background: "color-mix(in oklab, var(--accent) 30%, transparent)",
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
            lineHeight: 1.08, letterSpacing: "-0.02em",
            color: "var(--paper)",
            maxWidth: "24ch", margin: "0 auto",
          }}>
            The best engineers I taught were never the ones with the highest marks. They were the ones who were not afraid of the{" "}
            <span style={{ color: "var(--accent)" }}>workshop.</span>
          </p>
          <p className="serif" style={{
            marginTop: 28,
            fontStyle: "italic", fontWeight: 400,
            fontSize: 21, lineHeight: 1.5,
            color: "color-mix(in oklab, var(--paper) 75%, transparent)",
            maxWidth: "46ch", margin: "28px auto 0",
          }}>
            {DIRECTOR_QUOTE.hi}
          </p>
          <div style={{
            marginTop: 44, display: "inline-flex", alignItems: "center", gap: 14,
            fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
            color: "color-mix(in oklab, var(--paper) 65%, transparent)",
            flexWrap: "wrap", justifyContent: "center",
          }}>
            <span style={{ width: 36, height: 1, background: "var(--accent)" }} />
            {DIRECTOR.name} · Director
            <span style={{ width: 36, height: 1, background: "var(--accent)" }} />
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. JOINING MOMENT                                                       */}
      {/* ====================================================================== */}
      <section className="section bipe-pad" style={{ paddingTop: 84, paddingBottom: 40 }}>
        <div className="container">
          <div className="eyebrow" style={{ color: "var(--accent-deep)" }}>August 2026 · Phoolpur campus</div>
          <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "18ch" }}>
            The day he{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>joined us.</span>
          </h2>
          <p className="lead" style={{ marginTop: 16, maxWidth: "58ch" }}>
            Prof. Tewari being welcomed to the BIPE campus as Director.
          </p>

          <div style={{
            marginTop: 36, display: "grid", gap: 20,
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          }}>
            {[
              { src: "/leadership/director-joining-1.jpg", alt: "Prof. S. P. Tewari welcomed as Director at the BIPE Phoolpur campus, August 2026" },
              { src: "/leadership/director-joining-2.jpg", alt: "Prof. S. P. Tewari being presented a bouquet on joining BIPE as Director" },
            ].map((img) => (
              <figure key={img.src} style={{ margin: 0 }}>
                <div style={{
                  position: "relative", overflow: "hidden", borderRadius: 16,
                  border: "1px solid var(--line)", background: "var(--white)",
                  aspectRatio: "16 / 9",
                }}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 900px) 92vw, 560px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 6. CAREER + EDUCATION                                                   */}
      {/* ====================================================================== */}
      <section className="section bipe-pad" style={{ paddingTop: 64, paddingBottom: 84 }}>
        <div className="container">
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56 }}>
            {/* Career */}
            <div>
              <div className="eyebrow">Thirty-eight years, one department</div>
              <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "16ch" }}>
                IIT (BHU){" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>Varanasi.</span>
              </h2>
              <div style={{ marginTop: 28 }}>
                {DIRECTOR_CAREER.map((c) => (
                  <div key={c.years} style={{
                    display: "grid", gridTemplateColumns: "auto 1fr", gap: 18,
                    padding: "16px 0", borderTop: "1px solid var(--line)",
                  }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", color: "var(--accent-deep)", whiteSpace: "nowrap", paddingTop: 3 }}>
                      {c.years}
                    </div>
                    <div style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.6 }}>{c.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="eyebrow">Education</div>
              <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "16ch" }}>
                Where he{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>trained.</span>
              </h2>
              <div style={{ marginTop: 28, display: "grid", gap: 14 }}>
                {DIRECTOR_EDUCATION.map((e) => (
                  <div key={e.degree} style={{
                    padding: "20px 22px", borderRadius: 14,
                    border: "1px solid var(--line)", background: "var(--white)",
                  }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                      <span className="serif" style={{ fontStyle: "italic", fontSize: 24, color: "var(--brand)" }}>{e.degree}</span>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{e.field}</span>
                    </div>
                    <div style={{ marginTop: 8, fontSize: 14, color: "var(--ink-3)", lineHeight: 1.6 }}>
                      {e.institute} · {e.year}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: 22, padding: "20px 22px", borderRadius: 14,
                border: "1px solid color-mix(in oklab, var(--brand) 22%, transparent)",
                background: "var(--brand-tint)",
              }}>
                <div className="eyebrow" style={{ color: "var(--accent-deep)" }}>Research field</div>
                <p style={{ marginTop: 10, fontSize: 15, lineHeight: 1.7, color: "var(--ink-2)" }}>
                  Welding, foundry and production engineering — published in the <em>Welding Journal</em> (AWS, USA), <em>ISIJ International</em> (Japan), <em>Journal of Alloys and Compounds</em> and <em>Sadhana</em> (Indian Academy of Sciences). The same craft that sits at the centre of BIPE&rsquo;s largest branch,{" "}
                  <Link href="/courses/mechanical-engineering-production" style={{ color: "var(--brand)", fontWeight: 600 }}>
                    Mechanical Engineering (Production)
                  </Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 7. NATIONAL ROLES                                                       */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--brand-tint)", borderTop: "1px solid var(--line)", paddingTop: 84, paddingBottom: 84 }}>
        <div className="container">
          <div className="eyebrow" style={{ color: "var(--accent-deep)" }}>Beyond the classroom</div>
          <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "22ch" }}>
            Roles he has held{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>nationally.</span>
          </h2>

          <div style={{
            marginTop: 40, display: "grid", gap: 18,
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          }}>
            {DIRECTOR_NATIONAL_ROLES.map((r) => (
              <div key={r.title} style={{
                padding: "24px 24px 26px", borderRadius: 16,
                border: "1px solid var(--line)", background: "var(--white)",
              }}>
                <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.005em" }}>{r.title}</div>
                <p style={{ marginTop: 12, fontSize: 14.5, lineHeight: 1.7, color: "var(--ink-2)" }}>{r.body}</p>
              </div>
            ))}
          </div>

          {/* Honours */}
          <div style={{ marginTop: 48 }}>
            <div className="eyebrow">Honours</div>
            <div style={{ marginTop: 20, display: "grid", gap: 14 }}>
              {DIRECTOR_HONOURS.map((h) => (
                <div key={h.title} style={{
                  display: "grid", gridTemplateColumns: "auto 1fr", gap: 18, alignItems: "start",
                  padding: "18px 22px", borderRadius: 14,
                  border: "1px solid var(--line)", background: "var(--white)",
                }}>
                  <span aria-hidden="true" style={{
                    width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                    background: "var(--accent)", color: "var(--ink)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700,
                  }}>★</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15.5 }}>{h.title}</div>
                    <p style={{ marginTop: 6, fontSize: 14.5, lineHeight: 1.7, color: "var(--ink-2)" }}>{h.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 8. NEXT STEP                                                            */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--ink)", color: "var(--paper)", paddingTop: 84, paddingBottom: 84 }}>
        <div className="container">
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 48, alignItems: "center" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>Next step</div>
              <h2 className="bipe-h2" style={{ marginTop: 14, color: "var(--paper)", maxWidth: "18ch" }}>
                Meet the rest of our{" "}
                <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>leadership.</span>
              </h2>
              <p style={{ marginTop: 14, color: "color-mix(in oklab, var(--paper) 70%, transparent)", maxWidth: "48ch", fontSize: 15, lineHeight: 1.6 }}>
                Read the Chairman&rsquo;s and Principal&rsquo;s messages, or book a free campus visit and meet our faculty in person. We answer every parent personally on WhatsApp — in English or Hindi.
              </p>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              <Link href="/chairman" className="btn btn-lg" style={{ background: "var(--accent)", color: "var(--ink)", justifyContent: "space-between" }}>
                Chairman&rsquo;s Message <ArrowIcon size={16} />
              </Link>
              <Link href="/principal" className="btn btn-lg btn-ghost" style={{ color: "var(--paper)", borderColor: "color-mix(in oklab, var(--paper) 30%, transparent)", justifyContent: "space-between" }}>
                Principal&rsquo;s Message <ArrowIcon size={16} />
              </Link>
              <Link href="/visit" className="btn btn-lg btn-ghost" style={{ color: "var(--paper)", borderColor: "color-mix(in oklab, var(--paper) 30%, transparent)", justifyContent: "space-between" }}>
                Book a campus visit <ArrowIcon size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
