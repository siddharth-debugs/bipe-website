import type { Metadata } from "next";
import Link from "next/link";
import { metaFor } from "@/lib/routes";
import { DATA } from "@/lib/data";

export const metadata: Metadata = metaFor("terms");

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
          position: "absolute", left: -160, top: -120, width: 420, height: 420, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 24%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="eyebrow">§ Terms of Use</div>
          <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "22ch" }}>
            Terms governing{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              the use of bipevns.org.
            </span>
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: "62ch" }}>
            By using this website, you agree to the terms below. They are written to be readable, but where ambiguous, the Indian-law interpretation governs. The IT (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021 grievance officer details appear at the bottom of this page.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 880 }}>
          {[
            {
              h: "Use of the website",
              b: "Information on bipevns.org is provided for general guidance about BIPE’s academic programmes, admission process, fees, campus and approvals. You may not scrape, mirror, or republish substantial portions of the site without written permission from the Principal’s office.",
            },
            {
              h: "Accuracy and currency",
              b: "We make a serious effort to keep this website accurate and current — particularly fees, seat counts, JEECUP / BTEUP codes and AICTE references. Where there is a discrepancy between this website and an official AICTE / BTEUP / JEECUP / AFRC notification, the official notification governs. Material changes are republished promptly.",
            },
            {
              h: "Intellectual property",
              b: "The BIPE name, logo, page layouts, photography and original copy on this website are the property of Banaras Institute of Polytechnic & Engineering. Brand and recruiter logos shown on the site belong to their respective owners and are reproduced only to indicate institutional or recruiter relationships.",
            },
            {
              h: "Third-party links",
              b: "We link to government portals (AICTE, BTEUP, JEECUP, AFRC, IRDT, URISE), regulator dashboards, educational resources and our own social-media handles. BIPE does not control the content of external sites and is not responsible for their availability, accuracy or terms of use.",
            },
            {
              h: "User-submitted content",
              b: "If you submit information via enquiry, application or contact forms, you confirm the information is accurate and that you have authority to submit it. False or fraudulent submissions can affect your admission. See our Privacy Policy for how we handle this data.",
            },
            {
              h: "Prohibited conduct",
              b: "You may not use the website to transmit malware, attempt unauthorised access, harass other users, post defamatory or unlawful content, or impersonate BIPE or its staff. Such conduct will be reported to the appropriate authorities.",
            },
            {
              h: "Disclaimer of warranties",
              b: "The site is provided on an ‘as is’ basis. We disclaim implied warranties of merchantability and fitness for a particular purpose to the extent permitted by Indian law. We do not warrant uninterrupted availability or freedom from errors — though we work to minimise both.",
            },
            {
              h: "Limitation of liability",
              b: "Subject to applicable law, BIPE’s liability arising out of website use is limited to the maximum extent permitted. Statutory rights of admitted students under their offer letter and BTEUP / AICTE rules are not affected.",
            },
            {
              h: "Governing law and jurisdiction",
              b: "These terms are governed by Indian law. Disputes are subject to the exclusive jurisdiction of the courts at Varanasi, Uttar Pradesh.",
            },
            {
              h: "Changes to these terms",
              b: "We may update these terms from time to time. Material changes are noted at the top of this page with an effective date.",
            },
          ].map((s) => (
            <article key={s.h} style={{ paddingTop: 26, paddingBottom: 26, borderBottom: "1px solid var(--line)" }}>
              <h2 className="bipe-h3" style={{ fontSize: 22 }}>{s.h}</h2>
              <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.7 }}>{s.b}</p>
            </article>
          ))}

          <article style={{ marginTop: 32, padding: 28, borderRadius: 18, background: "var(--paper-2)", border: "1px solid var(--line)" }}>
            <div className="eyebrow">§ Grievance Officer · IT Rules 2021</div>
            <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.7 }}>
              <strong>Office of the Principal · BIPE</strong><br />
              Email: <a href={`mailto:${DATA.contact.emailGrievance}`} style={{ color: "var(--brand)" }}>{DATA.contact.emailGrievance}</a><br />
              Phone: <a href={`tel:${DATA.contact.phone}`} style={{ color: "var(--brand)" }}>{DATA.contact.phone}</a><br />
              Address: {DATA.contact.address}
            </p>
            <p style={{ marginTop: 10, fontSize: 13, color: "var(--ink-3)" }}>
              Acknowledged within 24 hours · resolved within 15 days where statutorily applicable. See also <Link href="/grievance" style={{ color: "var(--brand)" }}>Grievance Redressal</Link> for category-specific committees.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
