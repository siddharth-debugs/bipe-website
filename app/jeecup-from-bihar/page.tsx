import type { Metadata } from "next";
import Link from "next/link";
import { metadataFor } from "@/lib/seo";
import { PageHeader } from "@/components/ui/PageHeader";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("jeecupFromBihar"); }

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Register on the JEECUP portal",
    body: "Visit jeecup.admissions.nic.in and create a candidate profile. Bihar residence is fine — JEECUP is open to candidates from any state, and no UP domicile certificate is needed to apply. Other-state candidates are admitted in the open / general category, and private polytechnics like BIPE (code 4455) are exactly where those seats sit.",
  },
  {
    n: "02",
    title: "Use Bihar Board / CBSE Class 10 marks",
    body: "Bihar School Examination Board (BSEB) and CBSE marksheets are both accepted. Aggregate Class 10 score with Maths and Science is what matters — no separate UP-board pre-requisite.",
  },
  {
    n: "03",
    title: "Sit Group A — the diploma exam",
    body: "Three-year diploma branches at BIPE sit Group A: Class-10 syllabus Maths, Physics, Chemistry. Computer-based test in May/June 2026, exam centres in Patna, Gaya, Bhagalpur and Muzaffarpur.",
  },
  {
    n: "04",
    title: "Choose institute code 4455",
    body: "When choice-filling opens, search for BIPE Phoolpur, Varanasi or enter institute code 4455 directly. List five to ten branch preferences — single-choice filling is the most common reason Bihar applicants miss seats.",
  },
  {
    n: "05",
    title: "Reach Varanasi for verification",
    body: "Once allotted, report to BIPE within the published window with originals plus two self-attested copies. Patna → Varanasi is ~5 hours by train (multiple daily). Buxar and Ara are under 3 hours.",
  },
  {
    n: "06",
    title: "Move into the hostel",
    body: "BIPE has a boys' hostel on the Phoolpur campus — furnished rooms, mess, resident warden. Confirm a hostel seat at the time of fee payment; out-of-state applicants are accommodated first.",
  },
];

const DISTRICTS: { name: string; note: string }[] = [
  { name: "Buxar", note: "~85 km · 2 hours road · daily trains" },
  { name: "Bhojpur (Ara)", note: "~135 km · 3 hours · Patna line" },
  { name: "Rohtas (Sasaram)", note: "~145 km · 3 hours · NH-19" },
  { name: "Kaimur (Bhabua)", note: "~115 km · 2.5 hours road" },
  { name: "Patna", note: "~265 km · 5 hours train · multiple express" },
  { name: "Gaya", note: "~245 km · 5–6 hours rail" },
  { name: "Aurangabad", note: "~205 km · 4 hours road" },
  { name: "Bhagalpur", note: "Express trains via Patna / Varanasi line" },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Can a Bihar resident apply to BIPE via JEECUP?",
    a: "Yes. JEECUP is open to candidates from any state. Bihar applicants are admitted in the open / general category — UP-domicile candidates hold the state-reserved seats, while other-state candidates are placed largely in private polytechnics, which is exactly what BIPE (code 4455) is.",
  },
  {
    q: "Do I need a UP domicile certificate?",
    a: "No domicile certificate is required to apply or to take admission at BIPE. UP-domicile only affects UP's reserved-category seats and state scholarships — Bihar candidates are admitted in the open / general category.",
  },
  {
    q: "Will Bihar Board (BSEB) marks be accepted?",
    a: "Yes. BSEB Class 10 results are accepted exactly like CBSE / ICSE / UP Board. Carry the original marksheet at the time of verification.",
  },
  {
    q: "Is hostel guaranteed for out-of-state students?",
    a: "BIPE prioritises hostel allotment for out-of-state and far-district applicants. Confirm the hostel slot at fee payment — capacity is finite but the queue is shorter for distance applicants.",
  },
  {
    q: "What if I have also written BCECE?",
    a: "Both are valid. JEECUP gives you BIPE Varanasi via code 4455. BCECE gives you Bihar government polytechnics. Many Bihar candidates fill both forms and decide based on rank, branch and location.",
  },
];

export default function Page() {
  return (
    <div className="page-enter">
      <PageHeader
        eyebrow="For Bihar applicants"
        title={<>Apply to BIPE Varanasi <span className="serif">via JEECUP.</span></>}
        lead="JEECUP is the entrance exam for AICTE-approved polytechnics in Uttar Pradesh. Bihar candidates are welcome — admission is in the open / general category, no UP domicile certificate required, and Bihar Board, CBSE and other state-board marksheets are accepted exactly the same way."
      />

      <section className="section">
        <div className="container" style={{ maxWidth: 980 }}>
          <div className="eyebrow">The six steps, end to end</div>
          <h2 className="bipe-h2" style={{ marginTop: 14, marginBottom: 24 }}>From Patna to Phoolpur.</h2>
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {STEPS.map((s) => (
              <div key={s.n} className="card" style={{ padding: 24 }}>
                <div className="eyebrow" style={{ color: "var(--brand)" }}>{s.n}</div>
                <h3 className="bipe-h3" style={{ marginTop: 8 }}>{s.title}</h3>
                <p style={{ marginTop: 10, fontSize: 14, color: "var(--ink-2)", lineHeight: 1.7 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--ink-bg-soft, #f7f4ee)" }}>
        <div className="container" style={{ maxWidth: 980 }}>
          <div className="eyebrow">Distances from Bihar districts</div>
          <h2 className="bipe-h2" style={{ marginTop: 14, marginBottom: 24 }}>Closer than you think.</h2>
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {DISTRICTS.map((d) => (
              <div key={d.name} className="card" style={{ padding: 18 }}>
                <div style={{ fontWeight: 600 }}>{d.name}</div>
                <div style={{ marginTop: 6, fontSize: 13, color: "var(--ink-2)" }}>{d.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="eyebrow">Common questions from Bihar parents</div>
          <h2 className="bipe-h2" style={{ marginTop: 14, marginBottom: 24 }}>Plainly answered.</h2>
          {FAQ.map((f) => (
            <div key={f.q} style={{ borderTop: "1px solid var(--line)", padding: "18px 0" }}>
              <h3 className="bipe-h3" style={{ fontSize: 18 }}>{f.q}</h3>
              <p style={{ marginTop: 8, color: "var(--ink-2)", lineHeight: 1.7 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: "var(--brand)", color: "#fff" }}>
        <div className="container" style={{ maxWidth: 820, textAlign: "center" }}>
          <h2 className="bipe-h2" style={{ color: "#fff" }}>Talk to admissions in Hindi or English.</h2>
          <p style={{ marginTop: 12, opacity: 0.9, lineHeight: 1.7 }}>
            Call +91-9415202879 or WhatsApp +91-7310077788 (separate handset for chat). Our counsellors are familiar with the Bihar Board, JEECUP's open-category admission for other-state students, and the practicalities of moving a child from Patna, Ara, Buxar, Sasaram or Gaya to the BIPE campus.
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/apply" className="btn btn-primary" style={{ background: "#fff", color: "var(--brand)" }}>Start application</Link>
            <Link href="/jeecup-vs-bcece" className="btn btn-ghost" style={{ borderColor: "#fff", color: "#fff" }}>JEECUP vs BCECE</Link>
            <Link href="/admission-from-bihar" className="btn btn-ghost" style={{ borderColor: "#fff", color: "#fff" }}>Documents from Bihar</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
