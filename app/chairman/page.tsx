import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { metadataFor } from "@/lib/seo";
import { DATA } from "@/lib/data";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";
import { SITE_URL } from "@/lib/routes";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("chairman"); }

/**
 * Schema.org ProfilePage + Person for the Chairman.
 *
 * Mirrors the /principal page schema (commit 58ab9d4) so Google sees
 * consistent ProfilePage shape across BIPE's two biographical surfaces.
 *
 * Why hardcoded here, not sourced from lib/faculty.ts:
 *
 *   The Chairman is not academic faculty — he's the founder and trust
 *   chairman, a separate role from any FACULTY designation. Adding a
 *   "Chairman" or "Trust" department to lib/faculty.ts would muddy the
 *   academic-roster invariant (every entry there has a teaching role
 *   and qualifications). Keeping the chairman's schema inline on his
 *   own page is cleaner.
 *
 * Knowledge-graph triangle:
 *
 *   Person (Dr. Chandrika Rai)
 *     ── worksFor ─→ Purwanchal Educational Trust (Organization)
 *     ── alumniOf ─→ G. B. Pant University of Agriculture & Technology
 *                    (Pantnagar) — EducationalOrganization
 *
 *   The Trust → BIPE relationship is already established in
 *   app/layout.tsx via Organization.founder. So a search for
 *   "Chairman BIPE" → ProfilePage → Person → worksFor Trust →
 *   founder of → BIPE. Strong identity chain.
 */
const CHAIRMAN_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/chairman`,
  url: `${SITE_URL}/chairman`,
  name: "Chairman's Message · Dr. Chandrika Rai, IPS (Retd.) · BIPE",
  description:
    "Dr. Chandrika Rai, IPS (Retd.) — Chairman of Purwanchal Educational Trust and founder of Banaras Institute of Polytechnic & Engineering. From Pantnagar Agriculture University to the Indian Police Service to founding a polytechnic for Eastern UP.",
  mainEntity: {
    "@type": "Person",
    "@id": `${SITE_URL}/chairman#chandrika-rai`,
    name: "Dr. Chandrika Rai",
    honorificPrefix: "Dr.",
    jobTitle: "Chairman, Purwanchal Educational Trust",
    description:
      "Founder of Purwanchal Educational Trust and Banaras Institute of Polytechnic & Engineering (BIPE). Career arc: Assistant Professor of Soil Chemistry at Pantnagar Agriculture University (1970s); Indian Police Service (1980s–2000s); founded Purwanchal Educational Trust to bring engineering education to Eastern UP families; established BIPE in 2010 on a six-acre Phoolpur campus.",
    image: `${SITE_URL}/faculty/chairman-dr-chandrika-rai.png`,
    worksFor: {
      "@type": "Organization",
      "@id": `${SITE_URL}#purwanchal-trust`,
      name: "Purwanchal Educational Trust",
      description:
        "Registered charitable trust based in Varanasi, founded by Dr. Chandrika Rai. Sponsoring institution of Banaras Institute of Polytechnic & Engineering (BIPE).",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      // The institution is now formally "G. B. Pant University of
      // Agriculture & Technology, Pantnagar"; "Pantnagar Agriculture
      // University" is the colloquial name used on the page body.
      // Including both via name + alternateName helps Google match
      // either form.
      name: "G. B. Pant University of Agriculture & Technology, Pantnagar",
      alternateName: "Pantnagar Agriculture University",
    },
    hasOccupation: [
      {
        "@type": "Occupation",
        name: "Chairman, Purwanchal Educational Trust",
        occupationLocation: {
          "@type": "Place",
          name: "Varanasi, Uttar Pradesh, India",
        },
      },
      {
        "@type": "Occupation",
        name: "Indian Police Service (Retd.)",
      },
      {
        "@type": "Occupation",
        name: "Assistant Professor, Soil Chemistry",
        occupationLocation: {
          "@type": "Place",
          name: "Pantnagar, Uttarakhand, India",
        },
      },
    ],
  },
};

const PILLARS: { roman: string; title: string; sub: string; body: string }[] = [
  {
    roman: "i",
    title: "Education first, always",
    sub: "A vocation, not a business",
    body:
      "Purwanchal Educational Trust was founded for a single reason — to give the families of Eastern UP an institution they could trust with the future of their children. Every rupee that comes in goes back into classrooms, laboratories, scholarships and the welfare of our students.",
  },
  {
    roman: "ii",
    title: "Safe, accessible, affordable",
    sub: "The three commitments behind every decision",
    body:
      "A campus where a daughter feels as safe as a son. Fees that a working family can plan around. Branches that lead to real jobs. We test every decision against these three words before we make it — and we publish what we decide so you can hold us to it.",
  },
  {
    roman: "iii",
    title: "Hands as well as books",
    sub: "Diploma engineers who can work on day one",
    body:
      "An engineering diploma is a promise to a young person — that the three years they spend here will translate into a livelihood. We honour that promise by teaching with tools, not slides. Our students leave knowing how machines actually behave, not just how textbooks describe them.",
  },
  {
    roman: "iv",
    title: "Doors that stay open",
    sub: "Reach the Chairman directly",
    body:
      "If something at BIPE is not as it should be, I want to know. Write to chairman@bipevns.org or to the Principal's office, and I will see your note personally. The trust between a family and an institution is built on listening, not on press releases.",
  },
];

const JOURNEY = [
  { year: "1970s", label: "Pantnagar Agriculture University · Asst. Professor in Soil Chemistry" },
  { year: "1980s–2000s", label: "Indian Police Service · Decades of public service across UP" },
  { year: "2000s", label: "Founded Purwanchal Educational Trust" },
  { year: "2010", label: "BIPE established · Six acres in Phoolpur, Varanasi" },
  { year: "Today", label: "Chairman, Purwanchal Educational Trust" },
];

export default function Page() {
  return (
    <div className="page-enter">
      {/* ProfilePage + Person JSON-LD — see CHAIRMAN_JSON_LD above. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CHAIRMAN_JSON_LD) }}
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
            <div style={{ position: "relative" }}>
              <div style={{
                position: "absolute", inset: -10, borderRadius: 24,
                border: "1px solid var(--line)",
                background: "color-mix(in oklab, var(--brand) 6%, transparent)",
                pointerEvents: "none",
              }} />
              <div style={{ position: "relative", aspectRatio: "4 / 5", borderRadius: 18, overflow: "hidden", background: "var(--paper-2)" }}>
                <Image
                  src="/faculty/chairman-dr-chandrika-rai.png"
                  alt="Dr. Chandrika Rai, IPS (Retd.) — Chairman, Purwanchal Educational Trust"
                  fill
                  sizes="(max-width: 768px) 100vw, 36vw"
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                  priority
                />
              </div>
              <div style={{
                position: "absolute", left: 16, bottom: 16, right: 16,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
                color: "color-mix(in oklab, var(--paper) 80%, transparent)",
                pointerEvents: "none",
              }}>
                <span>BIPE / CHAIRMAN · 01</span>
                <span>VARANASI · UP</span>
              </div>
            </div>

            <div>
              <div className="eyebrow" style={{ color: "var(--accent-deep)" }}>A VISION ROOTED IN SERVICE</div>
              <h1 className="bipe-h1" style={{ marginTop: 16, fontWeight: 500 }}>
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em" }}>
                  Dr. Chandrika Rai
                </span>
                <span style={{ display: "block", fontSize: "0.6em", marginTop: 8, color: "var(--ink-2)", fontWeight: 500, letterSpacing: "-0.01em" }}>
                  IPS (Retd.)
                </span>
              </h1>
              <p className="lead" style={{ marginTop: 18, maxWidth: "52ch" }}>
                Chairman, Purwanchal Educational Trust. A career that began in agricultural research, served India through the Indian Police Service, and now devotes itself to the education of Eastern UP&apos;s next generation.
              </p>
              <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--ink-3)", marginTop: 8, fontSize: 17 }}>
                अध्यक्ष, पूर्वांचल एजुकेशनल ट्रस्ट
              </p>

              <div style={{ marginTop: 28, display: "grid", gap: 10, gridTemplateColumns: "auto 1fr", alignItems: "center" }}>
                <span className="pill" style={{ background: "var(--brand)", color: "#fff" }}>OFFICE</span>
                <a href="mailto:chairman@bipevns.org" style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--brand)", fontWeight: 600 }}>
                  chairman@bipevns.org
                </a>
                <span className="pill pill-accent">TRUST</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-2)", fontWeight: 600 }}>
                  Purwanchal Educational Trust
                </span>
              </div>

              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                <Link href="/visit" className="btn btn-primary">Visit our campus <ArrowIcon size={14} /></Link>
                <Link href="/about" className="btn btn-ghost">About BIPE</Link>
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
            fontSize: "clamp(36px, 5.4vw, 80px)",
            lineHeight: 1.05, letterSpacing: "-0.02em",
            color: "var(--paper)",
            maxWidth: "22ch", margin: "0 auto",
          }}>
            Education is the{" "}
            <span style={{ color: "var(--accent)" }}>key</span> to a
            nation&rsquo;s progress.
          </p>
          <p className="serif" style={{
            marginTop: 28,
            fontStyle: "italic", fontWeight: 400,
            fontSize: 22, lineHeight: 1.5,
            color: "color-mix(in oklab, var(--paper) 75%, transparent)",
            maxWidth: "44ch", margin: "28px auto 0",
          }}>
            शिक्षा राष्ट्र की प्रगति की कुंजी है। जब आप शिक्षकों में निवेश करते हैं, तो आप पूरे राष्ट्र के भविष्य में निवेश करते हैं।
          </p>
          <div style={{
            marginTop: 44, display: "inline-flex", alignItems: "center", gap: 14,
            fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
            color: "color-mix(in oklab, var(--paper) 65%, transparent)",
            flexWrap: "wrap", justifyContent: "center",
          }}>
            <span style={{ width: 36, height: 1, background: "var(--accent)" }} />
            Dr. Chandrika Rai · IPS (Retd.) · Chairman
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
            <div className="eyebrow" style={{ textAlign: "center" }}>A NOTE FROM THE CHAIRMAN&rsquo;S DESK</div>
            <h2 className="bipe-h2" style={{ marginTop: 14, textAlign: "center", maxWidth: "22ch", marginInline: "auto" }}>
              To every parent who has ever asked,{" "}
              <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                &ldquo;will my child be safe here?&rdquo;
              </span>
            </h2>

            <div style={{ marginTop: 44, fontSize: 17, lineHeight: 1.78, color: "var(--ink-2)" }}>
              <p style={{ position: "relative", paddingTop: 4 }}>
                <span className="serif" style={{
                  float: "left",
                  fontStyle: "italic", fontWeight: 400,
                  fontSize: 86, lineHeight: 0.85,
                  color: "var(--brand)",
                  marginRight: 12, marginTop: 4,
                  letterSpacing: "-0.02em",
                }}>
                  M
                </span>
                y career began far from a school &mdash; in the soil chemistry laboratories of Pantnagar Agriculture University, where I taught young researchers as an Assistant Professor. From there, life called me into the Indian Police Service, where I spent decades watching, very closely, what happens to a young person whose family could not afford the right education at the right age. One truth never moved: <strong style={{ color: "var(--ink)" }}>education is the key to a nation&rsquo;s progress &mdash; and to the dignity of every family within it.</strong>
              </p>

              <p style={{ marginTop: 22 }}>
                That conviction is why we put down the foundation of this trust over two decades ago. Eastern UP &mdash; Mau, Ghazipur, Azamgarh, Chandauli, Mirzapur, Varanasi &mdash; deserved an institution that did not ask its families to choose between a quality education and a manageable fee. We promised three things to every parent who walked through our gate: <strong style={{ color: "var(--ink)" }}>a safe campus, an accessible programme, and an affordable fee.</strong> Sixteen years later, those three words are still the test we put every decision through.
              </p>

              <p style={{ marginTop: 22 }}>
                A polytechnic is not a building. It is a quiet promise made to the family that sends us their child. The promise is that three years from now, that young person will walk out with skills that earn them a livelihood &mdash; and with the self-respect that comes from knowing they did the work themselves. Our faculty take that promise personally. Our placement record &mdash; one thousand alumni now serving at Mahindra, Tata Steel, BEL, Indian Railways, Mumbai Metro, Amul, Mother Dairy and many more &mdash; is the only kind of report card we believe in.
              </p>

              <p style={{ marginTop: 22 }}>
                I want to say something specifically to <strong style={{ color: "var(--brand)" }}>the daughters of Eastern UP and to the parents who hesitate to send them.</strong> A girl student at BIPE is treated with the same expectation, the same respect, and the same opportunity as any other student. We have a working Internal Committee under the POSH Act. We have faculty who answer phones at night when a parent worries. Our on-campus hostel is, at present, for boys only &mdash; a girls&rsquo; block is on the trust&rsquo;s roadmap, and until it opens, our admissions team will personally help any out-of-Varanasi family find safe local accommodation for their daughter. Send your daughters to us. We will return them as engineers.
              </p>

              <p style={{ marginTop: 22 }}>
                I am also keenly aware that the world your children are entering is changing faster than any classroom syllabus can keep up with. Artificial intelligence, automation, electric mobility, dairy automation, smart manufacturing &mdash; these are not abstract concepts; they will be the hands a BIPE diploma engineer will work alongside on day one. So we teach our students to use modern tools well, to question them when they fail, and to never substitute a tool for the discipline of thinking. This is what an honest education looks like in 2026.
              </p>

              <p style={{ marginTop: 22 }}>
                If you are a parent reading this, considering whether to trust BIPE with three of the most important years of your child&rsquo;s life: <strong style={{ color: "var(--ink)" }}>please come and see us.</strong> Walk through the workshops. Talk to current students without our staff in the room. Look at the hostel mess, the toilets, the safety arrangements. Read our fee receipts. We have nothing to hide and a great deal to be proud of. The campus is open Monday to Saturday, and we will arrange a free shuttle from Varanasi Cantt if you write ahead.
              </p>

              <p style={{ marginTop: 22 }}>
                When you invest in a teacher, you invest in the future of an entire nation. When you trust a family with a child, you accept a responsibility that cannot be returned. We accept that responsibility, every admission cycle, with the same seriousness as on the day we opened our gates.
              </p>

              <p style={{ marginTop: 22, fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--ink-3)", fontSize: 16, lineHeight: 1.7 }}>
                — आप हम पर भरोसा रखें। हम आपके बच्चों के भविष्य के लिए हर रोज़ काम करते हैं।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. JOURNEY TIMELINE                                                    */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", right: -160, top: -120, width: 380, height: 380, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 18%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 48, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">Five chapters of one life</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "18ch" }}>
                A career devoted to{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  serving others.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              From the soil-chemistry laboratory to the field, to the Indian Police Service, to founding a trust &mdash; one thread runs through it all: a young person&rsquo;s right to be safe, educated and equipped.
            </p>
          </div>

          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
            {JOURNEY.map((j, i) => (
              <li key={j.year} style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "180px 24px 1fr",
                gap: 24,
                padding: "22px 0",
                borderBottom: i < JOURNEY.length - 1 ? "1px dashed var(--line-2)" : "none",
                alignItems: "center",
              }}>
                <div className="serif" style={{
                  fontStyle: "italic", fontWeight: 400,
                  fontSize: 28, lineHeight: 1,
                  color: "var(--brand)",
                  letterSpacing: "-0.01em",
                }}>
                  {j.year}
                </div>
                <div style={{
                  width: 14, height: 14,
                  borderRadius: 999,
                  background: "var(--accent)",
                  border: "3px solid var(--paper-2)",
                  boxShadow: "0 0 0 1px var(--line)",
                  justifySelf: "center",
                }} />
                <div style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--ink-2)" }}>
                  {j.label}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. PILLARS GRID                                                        */}
      {/* ====================================================================== */}
      <section className="section" style={{ position: "relative", overflow: "hidden" }}>
        <div className="container">
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 48, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">Four pillars</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                What the trust stands{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  on.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Each pillar is a public commitment from the chairman&rsquo;s desk &mdash; and the standard against which our administrative team is measured every academic year.
            </p>
          </div>

          <div className="bipe-form-row" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {PILLARS.map((p) => (
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
                    <p style={{ marginTop: 14, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.7 }}>
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
      {/* 7. CTA PAIR                                                             */}
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
                <div className="eyebrow" style={{ color: "var(--accent)" }}>NEXT STEP</div>
                <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", lineHeight: 1.1, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 14, color: "var(--paper)" }}>
                  Come and see for yourself.{" "}
                  <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                    Bring questions.
                  </span>
                </h2>
                <p style={{ marginTop: 14, color: "color-mix(in oklab, var(--paper) 70%, transparent)", maxWidth: "48ch", fontSize: 15, lineHeight: 1.6 }}>
                  Read the Principal&rsquo;s message next, or book a free campus visit and meet our faculty in person. We answer every parent personally on WhatsApp &mdash; in English or Hindi.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Link href="/principal" className="btn btn-lg" style={{ background: "var(--accent)", color: "var(--ink)", justifyContent: "space-between" }}>
                  Read Principal&rsquo;s Message <ArrowIcon size={16} />
                </Link>
                <Link href="/visit" className="btn btn-lg" style={{ background: "var(--paper)", color: "var(--ink)", justifyContent: "space-between" }}>
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
