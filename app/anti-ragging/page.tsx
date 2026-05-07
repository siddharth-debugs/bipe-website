import type { Metadata } from "next";
import Link from "next/link";
import { metaFor } from "@/lib/routes";
import { DATA } from "@/lib/data";
import { ArrowIcon } from "@/components/shell/Icons";

export const metadata: Metadata = metaFor("antiRagging");

// Compliance audit (§3 / §A): UGC Anti-Ragging Regulations 2009 + Supreme
// Court 2009 ruling require institutions to publish Anti-Ragging Committee
// composition, complaint flow and the UGC anti-ragging portal link.

export default function Page() {
  return (
    <div className="page-enter">
      <section className="section bipe-pad" style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 56 }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "64px 64px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: -140, top: -120, width: 380, height: 380, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 24%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="eyebrow">Anti-Ragging</div>
          <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "22ch" }}>
            BIPE is a{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              zero-tolerance
            </span>{" "}
            ragging-free campus.
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: "62ch" }}>
            Ragging in any form is strictly prohibited at BIPE — and is a punishable offence under the UGC Regulations 2009 and the Supreme Court of India&rsquo;s 2009 directions. Every BIPE student and parent signs the anti-ragging undertaking before enrolment. The campus is monitored, the committee is constituted, and confidentiality is protected.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container" style={{ maxWidth: 980 }}>
          <div className="eyebrow">How to report</div>
          <h2 className="bipe-h2" style={{ marginTop: 14, marginBottom: 28 }}>If you see it. If you experience it.</h2>

          <div className="bipe-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <article className="card" style={{ padding: 28 }}>
              <div className="eyebrow" style={{ color: "var(--brand)" }}>BIPE COMMITTEE</div>
              <h3 className="bipe-h3" style={{ marginTop: 10, fontSize: 22 }}>Anti-Ragging Committee</h3>
              <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.7 }}>
                Chaired by the Principal as ex-officio Chairman, with an 8-member squad drawn from senior faculty, hostel wardens and student representatives. Complaints are confidential and acknowledged within 7 working days.
              </p>
              <div style={{ marginTop: 16, padding: 16, borderRadius: 12, background: "var(--paper-2)", border: "1px solid var(--line)" }}>
                <div className="eyebrow">Email</div>
                <a href={`mailto:${DATA.contact.emailAntiRagging}`} style={{ color: "var(--brand)", fontWeight: 600, fontSize: 15 }}>{DATA.contact.emailAntiRagging}</a>
                <div className="eyebrow" style={{ marginTop: 12 }}>Phone</div>
                <a href={`tel:${DATA.contact.phone}`} style={{ color: "var(--ink)", fontWeight: 600, fontSize: 15 }}>{DATA.contact.phone}</a>
              </div>
            </article>

            <article className="card" style={{ padding: 28 }}>
              <div className="eyebrow" style={{ color: "var(--brand)" }}>NATIONAL HELPLINE</div>
              <h3 className="bipe-h3" style={{ marginTop: 10, fontSize: 22 }}>UGC Anti-Ragging Helpline</h3>
              <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.7 }}>
                The national helpline operates 24×7 and routes complaints to UGC, the institution and the relevant authorities simultaneously. Use it if you don&rsquo;t want to report internally first.
              </p>
              <div style={{ marginTop: 16, padding: 16, borderRadius: 12, background: "var(--paper-2)", border: "1px solid var(--line)" }}>
                <div className="eyebrow">Toll-free</div>
                <a href="tel:18001805522" style={{ color: "var(--ink)", fontWeight: 600, fontSize: 15 }}>1800-180-5522</a>
                <div className="eyebrow" style={{ marginTop: 12 }}>Portal</div>
                <a href="https://www.antiragging.in/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand)", fontWeight: 600, fontSize: 15 }}>antiragging.in</a>
                <div className="eyebrow" style={{ marginTop: 12 }}>Email</div>
                <a href="mailto:helpline@antiragging.in" style={{ color: "var(--brand)", fontWeight: 600, fontSize: 15 }}>helpline@antiragging.in</a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="eyebrow">The undertaking</div>
          <h2 className="bipe-h2" style={{ marginTop: 14 }}>What every BIPE student signs.</h2>
          <p style={{ marginTop: 18, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.8 }}>
            Per UGC Regulations 2009 and the directions of the Supreme Court of India dated 8 May 2009, every student admitted to BIPE — and their parent / guardian — must sign the Anti-Ragging Affidavit at the time of admission. The undertaking confirms understanding of what constitutes ragging, the punishments under law, and a commitment to refrain from any such conduct.
          </p>

          <div className="card" style={{ marginTop: 26, padding: 28, background: "var(--paper-2)" }}>
            <div className="eyebrow">Penalties</div>
            <ul style={{ marginTop: 14, paddingLeft: 22, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.85 }}>
              <li>Suspension from attending classes and academic privileges</li>
              <li>Withholding scholarships and other benefits</li>
              <li>Debarring from appearing in tests / examinations</li>
              <li>Withholding results / cancellation of admission</li>
              <li>Rustication for one to four semesters</li>
              <li>Expulsion and consequential debarment from admission to any other institution</li>
              <li>Collective punishment in cases of inability to identify individual perpetrators</li>
              <li>Criminal prosecution under applicable law</li>
            </ul>
          </div>

          <div style={{ marginTop: 26, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/grievance" className="btn btn-primary">Other grievance committees <ArrowIcon size={14} /></Link>
            <a href="https://www.antiragging.in/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">UGC anti-ragging portal &rarr;</a>
            {/* TODO: link to actual undertaking PDF once uploaded under /downloads/ */}
            <a href="/downloads/anti-ragging-undertaking.pdf" download className="btn btn-ghost">Download undertaking (PDF)</a>
          </div>
        </div>
      </section>
    </div>
  );
}
