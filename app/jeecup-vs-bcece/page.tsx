import type { Metadata } from "next";
import Link from "next/link";
import { metadataFor } from "@/lib/seo";
import { PageHeader } from "@/components/ui/PageHeader";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("jeecupVsBcece"); }

const ROWS: { label: string; jeecup: string; bcece: string }[] = [
  { label: "Conducting body", jeecup: "JEEC-UP, Government of Uttar Pradesh", bcece: "BCECE Board, Government of Bihar" },
  { label: "Polytechnic seats covered", jeecup: "All AICTE-approved UP polytechnics — government, government-aided and private (incl. BIPE 4455)", bcece: "Bihar government polytechnics + a handful of private polytechnics in Bihar" },
  { label: "Eligibility for diploma (Group A)", jeecup: "Class 10 pass with Maths and Science. Open to candidates from any state.", bcece: "Class 10 pass with Maths and Science. Bihar residence is preferred but not strictly required for the entrance itself." },
  { label: "Exam pattern", jeecup: "Computer-based · 100 MCQ · 150 minutes · no negative marking · Class-10 Maths + Physics + Chemistry", bcece: "Pen-and-paper or CBT depending on year · Maths + Physics + Chemistry at Class-10 level" },
  { label: "Typical exam window", jeecup: "Application Jan–Apr · Exam May–Jun · Result Jun–Jul", bcece: "Application Feb–Apr · Exam May–Jul · Result Jul" },
  { label: "Counselling", jeecup: "Online choice-filling, multiple rounds Jun–Sep", bcece: "Online choice-filling under DCECE, multiple rounds Jul–Sep" },
  { label: "Hindi medium", jeecup: "Yes — bilingual question paper", bcece: "Yes — bilingual question paper" },
  { label: "Approx. fee", jeecup: "AFRC-approved fee at BIPE: ₹30,150/year · all-inclusive of tuition", bcece: "Bihar govt. polytechnic fee ranges roughly ₹15k–₹50k/year by institution and category" },
];

const WHEN_BCECE: string[] = [
  "You specifically want a Bihar government polytechnic (Patna, Muzaffarpur, Bhagalpur, Darbhanga, Gaya).",
  "You qualify under a Bihar-state reservation slot (state OBC, EBC) that does not transfer to UP.",
  "You are unwilling to relocate outside Bihar for hostel reasons.",
];

const WHEN_JEECUP: string[] = [
  "You want a BTEUP diploma + a campus close to Varanasi (Buxar, Ara, Sasaram, Kaimur are all under 3 hours).",
  "You want a rarer branch — Dairy Engineering and Mechanical Engineering (Production) at BIPE are under-supplied in Bihar polytechnics.",
  "You want a private polytechnic with AICTE permanent ID, AFRC-approved fees and a clear placement record.",
  "You want guaranteed Hindi-medium teaching plus hostel for out-of-state students from day one.",
];

export default function Page() {
  return (
    <div className="page-enter">
      <PageHeader
        eyebrow="JEECUP vs BCECE"
        title={<>Two doors into a <span className="serif">polytechnic seat.</span></>}
        lead="JEECUP is Uttar Pradesh's polytechnic entrance. BCECE is Bihar's. Both are valid for a 3-year diploma, both accept Class-10 marksheets from any state board. The choice usually comes down to where the seat is, which branch you want and which calendar suits your family."
      />

      <section className="section">
        <div className="container" style={{ maxWidth: 980 }}>
          <div className="eyebrow">Side by side</div>
          <h2 className="bipe-h2" style={{ marginTop: 14, marginBottom: 24 }}>The honest comparison.</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--ink)" }}>
                  <th style={{ textAlign: "left", padding: "12px 10px", fontWeight: 600 }}>What</th>
                  <th style={{ textAlign: "left", padding: "12px 10px", fontWeight: 600 }}>JEECUP (UP)</th>
                  <th style={{ textAlign: "left", padding: "12px 10px", fontWeight: 600 }}>BCECE (Bihar)</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.label} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ padding: "12px 10px", fontWeight: 600, color: "var(--ink)" }}>{r.label}</td>
                    <td style={{ padding: "12px 10px", color: "var(--ink-2)", lineHeight: 1.6 }}>{r.jeecup}</td>
                    <td style={{ padding: "12px 10px", color: "var(--ink-2)", lineHeight: 1.6 }}>{r.bcece}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--ink-bg-soft, #f7f4ee)" }}>
        <div className="container" style={{ maxWidth: 980 }}>
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div className="card" style={{ padding: 28 }}>
              <div className="eyebrow">Choose BCECE when</div>
              <ul style={{ marginTop: 14, paddingLeft: 18, color: "var(--ink-2)", lineHeight: 1.8, fontSize: 14 }}>
                {WHEN_BCECE.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
            <div className="card" style={{ padding: 28, borderColor: "var(--brand)" }}>
              <div className="eyebrow" style={{ color: "var(--brand)" }}>Choose JEECUP (and BIPE) when</div>
              <ul style={{ marginTop: 14, paddingLeft: 18, color: "var(--ink-2)", lineHeight: 1.8, fontSize: 14 }}>
                {WHEN_JEECUP.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          </div>

          <p style={{ marginTop: 28, fontSize: 14, color: "var(--ink-2)", lineHeight: 1.8, maxWidth: 760 }}>
            Practical advice: fill both forms. The fees are modest, the exams are weeks apart, and you keep options open right through to counselling. The actual decision can be made after rank cards arrive in June.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 820, textAlign: "center" }}>
          <h2 className="bipe-h2">Want a Bihar-specific walkthrough?</h2>
          <p style={{ marginTop: 12, color: "var(--ink-2)", lineHeight: 1.7 }}>
            We have a dedicated guide for Bihar applicants — documents, equivalency, travel and hostel — that picks up where this comparison ends.
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/jeecup-from-bihar" className="btn btn-primary">JEECUP from Bihar</Link>
            <Link href="/admission-from-bihar" className="btn btn-ghost">Documents from Bihar</Link>
            <Link href="/apply" className="btn btn-ghost">Start application</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
