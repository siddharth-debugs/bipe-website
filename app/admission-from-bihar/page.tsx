import type { Metadata } from "next";
import Link from "next/link";
import { metadataFor } from "@/lib/seo";
import { PageHeader } from "@/components/ui/PageHeader";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("admissionFromBihar"); }

const DOCS: { n: string; name: string; note: string }[] = [
  {
    n: "01",
    name: "JEECUP rank card",
    note: "Print three copies. The rank card is the single document that drives counselling and seat allotment.",
  },
  {
    n: "02",
    name: "Class 10 marksheet — BSEB or CBSE",
    note: "Bihar School Examination Board marksheets are accepted exactly like CBSE / ICSE / UP Board. Original + two self-attested copies.",
  },
  {
    n: "03",
    name: "Class 10 passing / transfer certificate",
    note: "TC from your last school. If your school has not issued it, request it during board-result week — it takes 7–14 days.",
  },
  {
    n: "04",
    name: "Photo identity — Aadhaar",
    note: "Aadhaar card with the candidate's name spelt as it appears on the JEECUP application.",
  },
  {
    n: "05",
    name: "Caste / EBC / EWS certificate (if applicable)",
    note: "Bihar-issued caste certificates are accepted for the central reservation category. UP-state reservation does not transfer — that is a JEECUP / counselling detail, not a BIPE-side restriction.",
  },
  {
    n: "06",
    name: "Income certificate (for scholarship)",
    note: "Required only if you intend to apply for UP Government Post-Matric Scholarship after admission. Bihar applicants are eligible under their home-state portal — we help with both.",
  },
  {
    n: "07",
    name: "Migration / character certificate",
    note: "Migration from BSEB or your previous board. Character certificate from the last school's principal. Both are submitted at the time of admission, not at counselling.",
  },
  {
    n: "08",
    name: "Passport photographs",
    note: "Eight to ten recent passport-size photographs. Same sitting, white background.",
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Is Bihar Board (BSEB) considered equivalent to UP Board / CBSE?",
    a: "Yes. BSEB Class 10 is recognised as equivalent by AICTE and BTEUP. You do not need any separate equivalency certificate to take admission at BIPE.",
  },
  {
    q: "Do I need a UP residence certificate?",
    a: "No. BIPE does not require a UP residence certificate. Bihar applicants are admitted in the all-India / open category under JEECUP and the home address remains your permanent address.",
  },
  {
    q: "Can I keep my Bihar Aadhaar address?",
    a: "Yes. Aadhaar address is not required to match the campus address. Update bank details, scholarship and hostel records with the campus address only as needed — Aadhaar stays as-is.",
  },
  {
    q: "Is hostel available for Bihar students?",
    a: "Yes. BIPE has a boys' hostel on the Phoolpur campus. Out-of-state applicants are prioritised in hostel allotment. Confirm the hostel slot at the time of fee payment.",
  },
  {
    q: "Can my parents pay fees from a Bihar bank account?",
    a: "Yes. Fees can be paid online from any bank — Bihar or otherwise. We accept UPI, net banking and IMPS / NEFT.",
  },
  {
    q: "Are scholarships open to Bihar students?",
    a: "UP Government Post-Matric is available only to UP-domicile candidates. Bihar candidates apply through the Bihar e-Kalyan portal for the central/state scholarship — we help with the form during the first semester.",
  },
  {
    q: "Travel — how do I get to BIPE from Bihar?",
    a: "Train to Varanasi Junction (Cantt) or Banaras (Manduadih). BIPE runs a campus shuttle from the Cantt station and Phoolpur is about 35 minutes by road. Patna, Ara and Buxar all have multiple daily express trains.",
  },
];

export default function Page() {
  return (
    <div className="page-enter">
      <PageHeader
        eyebrow="Admission from Bihar"
        title={<>Documents, hostel and the <span className="serif">practical bits.</span></>}
        lead="Bihar candidates take admission at BIPE through JEECUP under the all-India category. Bihar Board (BSEB) marksheets are accepted exactly the same as CBSE. The list below is everything a family from Patna, Ara, Buxar, Gaya or Bhagalpur needs to know before the counselling window opens."
      />

      <section className="section">
        <div className="container" style={{ maxWidth: 980 }}>
          <div className="eyebrow">The full document checklist</div>
          <h2 className="bipe-h2" style={{ marginTop: 14, marginBottom: 24 }}>Eight documents, in order.</h2>
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {DOCS.map((d) => (
              <div key={d.n} className="card" style={{ padding: 24 }}>
                <div className="eyebrow" style={{ color: "var(--brand)" }}>{d.n}</div>
                <h3 className="bipe-h3" style={{ marginTop: 8, fontSize: 18 }}>{d.name}</h3>
                <p style={{ marginTop: 10, fontSize: 14, color: "var(--ink-2)", lineHeight: 1.7 }}>{d.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--ink-bg-soft, #f7f4ee)" }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="eyebrow">Questions Bihar families actually ask</div>
          <h2 className="bipe-h2" style={{ marginTop: 14, marginBottom: 24 }}>Plain answers, no hedging.</h2>
          {FAQ.map((f) => (
            <div key={f.q} style={{ borderTop: "1px solid var(--line)", padding: "18px 0" }}>
              <h3 className="bipe-h3" style={{ fontSize: 18 }}>{f.q}</h3>
              <p style={{ marginTop: 8, color: "var(--ink-2)", lineHeight: 1.7 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 820, textAlign: "center" }}>
          <h2 className="bipe-h2">Need help in Hindi?</h2>
          <p style={{ marginTop: 12, color: "var(--ink-2)", lineHeight: 1.7 }}>
            Call +91-9198646464 or WhatsApp the same number. Our counsellors handle Bihar admissions every season and can talk you through documents, hostel timing, and the JEECUP counselling rounds in Hindi or English.
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/apply" className="btn btn-primary">Start application</Link>
            <Link href="/jeecup-from-bihar" className="btn btn-ghost">JEECUP from Bihar</Link>
            <Link href="/jeecup-vs-bcece" className="btn btn-ghost">JEECUP vs BCECE</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
