import type { Metadata } from "next";
import { metaFor } from "@/lib/routes";
import { DATA } from "@/lib/data";
import { PageHeader } from "@/components/ui/PageHeader";
import { PhoneIcon } from "@/components/shell/Icons";

export const metadata: Metadata = metaFor("grievance");

const COMMITTEES: { name: string; email: string; basis: string; chair: string }[] = [
  {
    name: "Anti-Ragging Committee",
    email: "antiragging@bipevns.org",
    basis: "Anti-Ragging Act, 2009 (UGC Regulations)",
    chair: "Principal as Ex-officio Chairman, supported by an 8-member squad",
  },
  {
    name: "Internal Committee (POSH)",
    email: "ic@bipevns.org",
    basis: "Sexual Harassment of Women at Workplace Act, 2013",
    chair: "Chaired by a senior woman faculty member",
  },
  {
    name: "SC / ST Committee",
    email: "scst@bipevns.org",
    basis: "Scheduled Castes & Scheduled Tribes (Prevention of Atrocities) Act, 1989",
    chair: "Senior faculty representative",
  },
  {
    name: "PWD Cell — Equal Opportunity",
    email: "pwd@bipevns.org",
    basis: "Rights of Persons with Disabilities Act, 2016",
    chair: "Designated Equal Opportunity Officer",
  },
];

export default function Page() {
  return (
    <div className="page-enter">
      <PageHeader
        eyebrow="Grievance Redressal"
        title={<>Safety, dignity, and <span className="serif">equal opportunity.</span></>}
        lead="Every BIPE student has a right to a safe, dignified and equitable campus. Four statutory committees handle different categories of grievance."
      />

      {/* Four committees */}
      <section className="section">
        <div className="container" style={{ maxWidth: 980 }}>
          <div className="eyebrow">Statutory committees</div>
          <h2 className="bipe-h2" style={{ marginTop: 14, marginBottom: 24 }}>Where to write.</h2>
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {COMMITTEES.map((c) => (
              <div key={c.name} className="card" style={{ padding: 24 }}>
                <h3 className="bipe-h3">{c.name}</h3>
                <a href={`mailto:${c.email}`} style={{ display: "inline-block", marginTop: 8, color: "var(--brand)", fontWeight: 600, fontSize: 14 }}>{c.email}</a>
                <div style={{ marginTop: 12, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>
                  <div><span className="eyebrow">Statute</span> · {c.basis}</div>
                  <div style={{ marginTop: 6 }}><span className="eyebrow">Chair</span> · {c.chair}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="eyebrow">How to file a grievance</div>
          <h2 className="bipe-h2" style={{ marginTop: 14 }}>The process.</h2>
          <ol style={{ marginTop: 18, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Email <a href="mailto:grievance@bipevns.org" style={{ color: "var(--brand)" }}>grievance@bipevns.org</a> or submit a written complaint to the Principal&apos;s office.</li>
            <li>The complaint is treated as confidential and acknowledged within 7 working days.</li>
            <li>The relevant committee investigates and recommends action.</li>
            <li>The complainant is informed of the outcome.</li>
          </ol>

          <div className="card" style={{ padding: 22, marginTop: 24 }}>
            <div className="eyebrow">Primary helpline</div>
            <a href={`tel:${DATA.contact.phone}`} className="btn btn-ghost" style={{ marginTop: 10 }}><PhoneIcon /> {DATA.contact.phone}</a>
          </div>
        </div>
      </section>
    </div>
  );
}
