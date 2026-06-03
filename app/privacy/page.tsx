import type { Metadata } from "next";
import Link from "next/link";
import { metadataFor } from "@/lib/seo";
import { DATA } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("privacy"); }

// Compliance audit (§3.3) — DPDP Act 2023 will require institutions to
// publish a Privacy Policy, Notice to Data Principals, consent flow, and a
// Grievance Officer. Compliance audit (§3.4) — IT Rules 2021 also require
// privacy policy + grievance officer details.

export default function Page() {
  return (
    <div className="page-enter">
      <section className="section" style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 56 }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "64px 64px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -160, top: -120, width: 420, height: 420, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 22%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="eyebrow">Privacy Policy · DPDP-aligned</div>
          <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "22ch" }}>
            How we handle{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              your data.
            </span>
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: "62ch" }}>
            BIPE collects, stores and processes personal data only for legitimate educational and administrative purposes. This page explains what we collect, how we use it, who we share it with (almost no one), and the rights you have under the Digital Personal Data Protection Act, 2023.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 880 }}>
          <article style={{ paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <h2 className="bipe-h3" style={{ fontSize: 22 }}>What we collect</h2>
            <ul style={{ marginTop: 10, paddingLeft: 22, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.85 }}>
              <li><strong>Enquiry &amp; application data</strong> — name, parent name, phone, email, branch interest, JEECUP rank, address, category, academic transcripts.</li>
              <li><strong>Admission &amp; academic data</strong> — Aadhaar, transfer / character certificates, marksheets, attendance, semester grades.</li>
              <li><strong>Hostel &amp; campus data</strong> — emergency contact, medical disclosures (where voluntarily shared), gate-entry logs.</li>
              <li><strong>Website analytics</strong> — page views, device type, referral source. Cookies are limited and disclosed via the cookie banner where applicable.</li>
              <li><strong>Behavioural analytics</strong> — to improve the site we use heatmaps and anonymised session recordings (Microsoft Clarity). Recordings are configured to <strong>mask all on-screen text</strong>, so the names, phone numbers, email addresses and documents you enter into forms are never captured — only anonymous interaction patterns (clicks, scrolls, navigation). This data is processed by Microsoft as our processor and is used solely to fix usability problems.</li>
            </ul>
          </article>

          <article style={{ paddingTop: 28, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <h2 className="bipe-h3" style={{ fontSize: 22 }}>What we don&rsquo;t collect</h2>
            <ul style={{ marginTop: 10, paddingLeft: 22, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.85 }}>
              <li>We do not sell, rent or trade your personal data.</li>
              <li>We do not share your data with third-party marketers.</li>
              <li>We do not use your data to train AI models. AI tools used in teaching (see <Link href="/ai-policy">AI Policy</Link>) operate on anonymised, faculty-supervised inputs.</li>
            </ul>
          </article>

          <article style={{ paddingTop: 28, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <h2 className="bipe-h3" style={{ fontSize: 22 }}>Why we collect, and our legal basis</h2>
            <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.7 }}>
              Data is collected for: admission processing, academic delivery, statutory reporting (AICTE, BTEUP, AISHE), hostel and campus safety, and limited communication with applicants and enrolled students. Our legal basis is a combination of legitimate interest, contractual necessity (the offer of admission and the diploma programme), and statutory obligation. Sensitive data such as Aadhaar is handled under UIDAI norms and is not retained beyond regulatory requirements.
            </p>
          </article>

          <article style={{ paddingTop: 28, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <h2 className="bipe-h3" style={{ fontSize: 22 }}>Your rights as a Data Principal</h2>
            <ul style={{ marginTop: 10, paddingLeft: 22, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.85 }}>
              <li>Right to access the personal data we hold about you.</li>
              <li>Right to correction and erasure (subject to retention requirements under AICTE / BTEUP / income-tax / academic-record statutes).</li>
              <li>Right of grievance redressal — escalate first to our Grievance Officer (below), and onward to the Data Protection Board if applicable.</li>
              <li>Right to nominate, in case of incapacity or demise.</li>
              <li>Right to withdraw consent for processing not required by law (e.g., marketing communications).</li>
            </ul>
          </article>

          <article style={{ paddingTop: 28, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <h2 className="bipe-h3" style={{ fontSize: 22 }}>Children &amp; minors</h2>
            <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.7 }}>
              BIPE markets to 10th-pass students (typically aged 15–16). Enquiry forms ask for a parent / guardian phone number and we treat all minor data with extra care: parental consent for marketing communications, no public exposure of minor identifying data, and prompt deletion on request beyond statutory retention. Our admission process is built on parental involvement.
            </p>
          </article>

          <article style={{ paddingTop: 28, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <h2 className="bipe-h3" style={{ fontSize: 22 }}>Third-party processors</h2>
            <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.7 }}>
              Where we use third parties (cloud hosting, email, analytics, AI assistants such as Claude in teaching contexts) we choose providers with adequate security and data-handling commitments, and we do not pass identifying student data into those tools as a default. The list of processors is reviewed annually by the Principal&rsquo;s office.
            </p>
          </article>

          <article style={{ paddingTop: 28, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <h2 className="bipe-h3" style={{ fontSize: 22 }}>Grievance Officer (DPDP / IT Rules 2021)</h2>
            <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.7 }}>
              <strong>Office of the Principal · BIPE</strong><br />
              Email: <a href={`mailto:${DATA.contact.emailGrievance}`} style={{ color: "var(--brand)" }}>{DATA.contact.emailGrievance}</a><br />
              Phone: <a href={`tel:${DATA.contact.phone}`} style={{ color: "var(--brand)" }}>{DATA.contact.phone}</a><br />
              Address: {DATA.contact.address}
            </p>
            <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.7 }}>
              Complaints are acknowledged within 7 working days. The Grievance Officer is responsible for handling privacy queries, data-correction requests and escalation under the DPDP Act and the IT Rules 2021. See also <Link href="/grievance">Grievance Redressal</Link> for non-privacy complaint channels.
            </p>
          </article>

          <article style={{ paddingTop: 28 }}>
            <h2 className="bipe-h3" style={{ fontSize: 22 }}>Updates to this policy</h2>
            <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.7 }}>
              This policy is reviewed annually by the Principal&rsquo;s office. The current version is 2026.1 — last reviewed April 2026. Material changes are announced on the homepage and emailed to enrolled students and parents.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
