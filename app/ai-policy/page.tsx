import type { Metadata } from "next";
import Link from "next/link";
import { metaFor } from "@/lib/routes";
import { DATA } from "@/lib/data";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";

export const metadata: Metadata = metaFor("aiPolicy");

const PRINCIPLES: { n: string; t: string; b: string }[] = [
  {
    n: "01",
    t: "AI augments teaching; it does not replace our faculty.",
    b: "Every BIPE student is taught by a human teacher and mentored by a human faculty member. AI is a tool the teacher uses — never a substitute for the teacher in the room.",
  },
  {
    n: "02",
    t: "Privacy first.",
    b: "No personally-identifiable student data is shared with external AI providers without informed consent. Faculty use sandboxed, anonymised workflows for any assessment-adjacent task.",
  },
  {
    n: "03",
    t: "AI literacy is itself a learning outcome.",
    b: "We teach our students both with AI tools and about the strengths and limitations of those tools. Spotting an AI error is itself a 21st-century skill our diploma graduates leave with.",
  },
  {
    n: "04",
    t: "Faculty review and validate any AI-generated content.",
    b: "Before AI output is used in the classroom or in assessment, a BIPE faculty member reviews and signs off. The teacher is in the loop; the AI is not.",
  },
  {
    n: "05",
    t: "This policy is reviewed annually.",
    b: "Reviewed by the academic council each year, with the latest version published on this page and version notes preserved. Last reviewed 2026 · next review 2027.",
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Will my child's data be sent to external AI providers?",
    a: "No, except with informed consent and for narrowly-scoped, time-bound purposes. Our default workflows do not share names, contact details, parent details, marks or any identifying information with third-party AI tools. Where AI is used to generate practice problems or feedback, the prompt does not include personally-identifiable data.",
  },
  {
    q: "Will AI grade my child's exams?",
    a: "No. Summative assessments — including BTEUP semester examinations — are graded by human faculty per BTEUP norms. Formative checks (practice quizzes, lab journals, debugging hints) may use AI as a co-pilot for the faculty, but the final mark and feedback are owned by the teacher.",
  },
  {
    q: "Won't AI hallucinate or give wrong answers sometimes?",
    a: "Yes, sometimes. Which is why our faculty review every AI output before it is used in the classroom or with students. We also explicitly teach our students how AI can fail, why it fails, and how to verify outputs against the textbook, the BTEUP syllabus and the faculty member.",
  },
  {
    q: "What about academic integrity? Can students cheat with AI?",
    a: "Our position: students may use AI to learn; AI may not write their summative answers. We have a published academic-integrity expectation that covers AI use in assessments, with clear consequences for misuse. Detection, where applicable, is via the faculty member who knows the student's work — not via a black-box detector tool.",
  },
  {
    q: "What if I don't want my child taught with AI?",
    a: "Talk to us. The core BTEUP curriculum is delivered by faculty regardless of any AI augmentation; students who opt out of optional AI-assisted exercises will still cover the syllabus and sit the same examinations.",
  },
  {
    q: "Which AI tools does BIPE specifically use?",
    a: "We currently use Claude — an AI assistant developed by Anthropic — as part of our pedagogy toolkit, alongside open-source models for offline workloads. The tool list is reviewed each year as the AI landscape evolves; we do not lock the institution into any single provider.",
  },
];

export default function Page() {
  return (
    <div className="page-enter">
      {/* ====================================================================== */}
      {/* 1. HERO                                                                 */}
      {/* ====================================================================== */}
      <section className="section bipe-pad" style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 64 }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "64px 64px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: -180, top: -120, width: 480, height: 480, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 24%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -160, bottom: -160, width: 420, height: 420, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 30%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="eyebrow">AI Policy · 2026</div>
          <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "20ch" }}>
            AI augments learning.{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              It never replaces faculty.
            </span>
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: "62ch" }}>
            BIPE is among the first polytechnics in Eastern Uttar Pradesh to integrate Outcome-Based Education with AI-augmented teaching tools — including Claude, an AI assistant developed by Anthropic — across our diploma programmes. Our students don&rsquo;t fear AI. They learn with it. This page explains how, and where the lines are drawn.
          </p>
          <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
            <Link href="/teaching" className="btn btn-primary">How we teach <ArrowIcon size={14} /></Link>
            <Link href="/grievance" className="btn btn-ghost">Grievance Redressal</Link>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. FIVE PRINCIPLES                                                      */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div className="container">
          <div className="eyebrow">Five principles</div>
          <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "20ch", marginBottom: 32 }}>
            Our published{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              AI-use principles.
            </span>
          </h2>
          <div style={{ display: "grid", gap: 14 }}>
            {PRINCIPLES.map((p) => (
              <article key={p.n} className="card" style={{ padding: 28, position: "relative", overflow: "hidden", display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "start", background: "var(--white)" }}>
                <div className="serif" style={{
                  fontStyle: "italic", fontWeight: 400,
                  fontSize: 64, lineHeight: 0.85,
                  color: "var(--brand)", letterSpacing: "-0.02em",
                  minWidth: 64,
                }}>
                  {p.n}
                </div>
                <div>
                  <h3 className="bipe-h3" style={{ fontSize: 21, fontWeight: 700 }}>{p.t}</h3>
                  <p style={{ marginTop: 8, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.7 }}>{p.b}</p>
                </div>
              </article>
            ))}
          </div>

          <div style={{
            marginTop: 28, padding: "18px 24px",
            borderRadius: 16, background: "var(--ink)", color: "var(--paper)",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <span className="pill" style={{ background: "var(--accent)", color: "var(--ink)" }}>VERSION 2026.1</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.06em" }}>
                Last reviewed · 2026 · Next review · 2027
              </span>
            </div>
            <Link href="/teaching" style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              See teaching framework &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. WHAT WE USE AI FOR                                                   */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">Concrete use-cases</div>
              <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "20ch" }}>
                What we{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  actually use it for.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Each is reviewed by faculty; none replaces the teacher; all are voluntary for the student.
            </p>
          </div>

          <div className="bipe-form-row" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
            {[
              {
                eyebrow: "DIAGNOSTIC",
                t: "Practice problems calibrated to each student",
                b: "After a diagnostic check at the start of a course, faculty use AI to generate additional practice problems matched to each student&rsquo;s gap profile — so weaker students aren&rsquo;t lost, and stronger students aren&rsquo;t bored.",
              },
              {
                eyebrow: "INCLUSIVITY",
                t: "Inclusive lesson plans with multilingual examples",
                b: "Faculty draft lesson materials with multiple worked examples per concept, multilingual prompts (Hindi where it bridges understanding), and accessibility considerations for students with disabilities — drafted faster, reviewed by humans.",
              },
              {
                eyebrow: "DEBUGGING",
                t: "Code, proofs and reasoning checks as students work",
                b: "In CSE labs, students can ask Claude to walk through a buggy program with them — getting unstuck in 5 minutes instead of waiting for the next class. Faculty supervise; students still own the final code.",
              },
              {
                eyebrow: "FORMATIVE",
                t: "Question banks for continuous assessment",
                b: "AI helps faculty generate variant questions for formative assessments, mapped to specific Course Outcomes — keeping the assessment fresh while the underlying learning outcomes stay constant across cohorts.",
              },
              {
                eyebrow: "SIMULATION",
                t: "Topic-level simulations and worked examples",
                b: "Course-level simulations let students try, fail, retry and understand at their own pace before they touch real lab equipment — they make better mistakes when they get to the floor.",
              },
              {
                eyebrow: "BILINGUAL",
                t: "Hindi-English translation of technical concepts",
                b: "When a Purvanchal student understands a concept better in Hindi, faculty use AI to bridge the language — without losing technical precision. The student then writes the answer in their preferred language.",
              },
            ].map((c) => (
              <article key={c.t} className="card" style={{ padding: 28 }}>
                <div className="eyebrow" style={{ color: "var(--brand)" }}>{c.eyebrow}</div>
                <h3 className="bipe-h3" style={{ marginTop: 10, fontSize: 21 }}>{c.t}</h3>
                <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: c.b }} />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. FAQ                                                                  */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container" style={{ maxWidth: 980 }}>
          <div className="eyebrow">Parent &amp; student FAQ</div>
          <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "20ch", marginBottom: 28 }}>
            Questions{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              parents have asked us.
            </span>
          </h2>

          <div style={{ display: "grid", gap: 12 }}>
            {FAQ.map((f, i) => (
              <details key={f.q} className="card" style={{ padding: 0, overflow: "hidden" }}>
                <summary style={{
                  padding: "20px 24px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 14,
                  listStyle: "none",
                }}>
                  <span style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                    <span className="serif" style={{ fontStyle: "italic", color: "var(--brand)", fontSize: 22, minWidth: 32 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{f.q}</span>
                  </span>
                  <span style={{ color: "var(--ink-3)", fontSize: 22, lineHeight: 1, flexShrink: 0 }}>+</span>
                </summary>
                <div style={{ padding: "0 24px 22px 72px", color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.7 }}>
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. CONTACT / GRIEVANCE                                                  */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div style={{
            position: "relative", overflow: "hidden",
            background: "var(--ink)", color: "var(--paper)",
            borderRadius: 24,
            padding: "44px 48px",
          }}>
            <div aria-hidden="true" style={{
              position: "absolute", inset: 0, opacity: 0.05,
              backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
              backgroundSize: "64px 64px", pointerEvents: "none",
            }} />
            <div aria-hidden="true" style={{
              position: "absolute", left: -120, bottom: -120, width: 380, height: 380, borderRadius: "50%",
              background: "color-mix(in oklab, var(--brand) 50%, transparent)",
              filter: "blur(140px)", pointerEvents: "none",
            }} />
            <div className="bipe-split" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "center" }}>
              <div>
                <div className="eyebrow" style={{ color: "var(--accent)" }}>Concerns or feedback</div>
                <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", lineHeight: 1.08, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 14, color: "var(--paper)", maxWidth: "20ch" }}>
                  Talk to us about{" "}
                  <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                    AI in our classroom.
                  </span>
                </h2>
                <p style={{ marginTop: 14, color: "color-mix(in oklab, var(--paper) 75%, transparent)", fontSize: 15, lineHeight: 1.65, maxWidth: "52ch" }}>
                  If you have a concern about how AI tools are used in a specific course, or want to opt your child out of AI-assisted exercises, write to the Principal&rsquo;s office or use the Grievance channel.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href={`mailto:${DATA.contact.emailPrincipal}`} className="btn btn-lg" style={{ background: "var(--accent)", color: "var(--ink)", justifyContent: "space-between" }}>
                  Email Principal&rsquo;s office <ArrowIcon size={16} />
                </a>
                <Link href="/grievance" className="btn btn-lg" style={{ background: "color-mix(in oklab, var(--paper) 8%, transparent)", color: "var(--paper)", border: "1px solid color-mix(in oklab, var(--paper) 22%, transparent)", justifyContent: "space-between" }}>
                  Grievance Redressal <ArrowIcon size={16} />
                </Link>
                <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-lg" style={{ background: "#25D366", color: "#fff", border: "none", justifyContent: "space-between" }}>
                  <WhatsAppIcon /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
