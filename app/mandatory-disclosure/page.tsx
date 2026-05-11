import type { Metadata } from "next";
import Link from "next/link";
import type React from "react";
import { metadataFor } from "@/lib/seo";
import { DATA } from "@/lib/data";
import { ArrowIcon } from "@/components/shell/Icons";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("mandatoryDisclosure"); }

// AICTE Approval Process Handbook 2024-27, Annexure-18: every approved
// technical institution must publish a structured Mandatory Disclosure on
// its website and revise it annually. This page is the website-facing
// version; the downloadable PDF is hosted under /downloads (TODO: upload).

type Section = { id: string; n: string; title: string; body: React.ReactNode };

const SECTIONS: Section[] = [
  {
    id: "institution",
    n: "01",
    title: "Name and address of the institution",
    body: (
      <>
        <p><strong>Banaras Institute of Polytechnic &amp; Engineering (BIPE)</strong></p>
        <p>{DATA.contact.address}</p>
        <p>
          Telephone: <a href={`tel:${DATA.contact.phone}`}>{DATA.contact.phone}</a> · Alt <a href={`tel:${DATA.contact.phone2}`}>{DATA.contact.phone2}</a><br />
          Email: <a href={`mailto:${DATA.contact.email}`}>{DATA.contact.email}</a><br />
          Web: <a href="https://bipevns.org">https://bipevns.org</a>
        </p>
      </>
    ),
  },
  {
    id: "trust",
    n: "02",
    title: "Sponsoring trust / society",
    body: (
      <>
        <p><strong>Purvanchal Educational Trust</strong> — registered charitable trust based in Varanasi, sponsoring BIPE since 2010.</p>
        <p>{`// TODO: publish trustees roster, registration number and trust deed reference once the trust office releases the latest constitution.`}</p>
      </>
    ),
  },
  {
    id: "principal",
    n: "03",
    title: "Principal",
    body: (
      <>
        <p><strong>Dr. R. K. Sharma</strong> · Principal, BIPE</p>
        <p>
          Email: <a href={`mailto:${DATA.contact.emailPrincipal}`}>{DATA.contact.emailPrincipal}</a> · Phone: <a href={`tel:${DATA.contact.phone}`}>{DATA.contact.phone}</a>
        </p>
        <p>See the full <Link href="/principal">Principal&rsquo;s Message</Link> page.</p>
      </>
    ),
  },
  {
    id: "affiliation",
    n: "04",
    title: "Affiliating body and approvals",
    body: (
      <>
        <p>BIPE is affiliated to the <strong>Board of Technical Education, Uttar Pradesh (BTEUP)</strong> under JEECUP college code <strong>4455</strong>.</p>
        <p>Approved by the <strong>All India Council for Technical Education (AICTE)</strong> · Permanent ID <strong>{DATA.contact.aicte}</strong>.</p>
        <p>
          Latest Extension of Approval (EoA): F.No. <strong>{DATA.contact.aicteEoaRef}</strong>, dated {DATA.contact.aicteEoaDate}.
        </p>
        <p>Quality management certified to <strong>ISO 9001:2015</strong>. Active <strong>AISHE</strong> registration with the Department of Higher Education, Government of India.</p>
        <p>Independent verification: see the <Link href="/approvals">Approvals page</Link> or the AICTE / JEECUP / URISE portals linked in our footer.</p>
      </>
    ),
  },
  {
    id: "governance",
    n: "05",
    title: "Governance",
    body: (
      <>
        <p>BIPE is governed by a Governing Body comprising trustee representatives, the Principal, senior faculty and external academic / industry experts.</p>
        <p>{`// TODO: publish names, designations and brief background of every Governing Body member once the trust office releases the 2026-27 composition.`}</p>
      </>
    ),
  },
  {
    id: "programmes",
    n: "06",
    title: "Programmes — branches, codes, intake, fees",
    body: (
      <>
        <p>
          BIPE offers <strong>5 BTEUP-affiliated diploma branches</strong> at JEECUP college code 4455, all 3-year programmes admitted via JEECUP Group A.
        </p>
        <p>
          Total sanctioned intake (2026-27): <strong>480 seats</strong> — Civil 120, Electrical 120, Mechanical Engineering (Production) 120, Computer Science &amp; Engineering 60, Dairy Engineering 60. Annual tuition is <strong>₹30,150</strong>, AFRC-approved and identical across branches.
        </p>
        <p>See the <Link href="/courses">Courses page</Link> for the full branch catalogue and the <Link href="/fees">Fees page</Link> for the AFRC-approved fee structure.</p>
      </>
    ),
  },
  {
    id: "faculty",
    n: "07",
    title: "Faculty — count, qualifications, ratio",
    body: (
      <>
        <p><strong>33 BTEUP-recognised faculty</strong> across seven departments (CSE, Civil, Electrical, Mechanical, Dairy Engineering, Applied Sciences &amp; Humanities, Workshop &amp; Practical Training).</p>
        <p>Mentor-to-student ratio: <strong>1:20</strong> across the diploma. Faculty are AICTE-FDP trained and OBE-aligned. See the <Link href="/faculty">Faculty page</Link> for departmental composition.</p>
        <p>{`// TODO: publish department-wise faculty roster (name, designation, qualification, tenure, experience) per AICTE Annexure-18 §7 once HR consolidates the 2026-27 list.`}</p>
      </>
    ),
  },
  {
    id: "fees",
    n: "08",
    title: "Fee structure",
    body: (
      <>
        <p>Annual tuition is <strong>₹30,150</strong>, AFRC-approved and identical for all 5 BTEUP branches. Refunds follow AICTE norms: 100% (less ₹1,000 processing) if you withdraw 15+ days before classes start, and a tapered scale thereafter — full schedule on the <Link href="/fees">Fees page</Link>.</p>
        <p>{`// TODO: upload the AFRC fee notification PDF for 2026-27 once the printed copy is available from the trust office.`}</p>
      </>
    ),
  },
  {
    id: "admission",
    n: "09",
    title: "Admission procedure and last 3 years' admissions",
    body: (
      <>
        <p>Admissions to all BIPE diploma courses are exclusively through <strong>JEECUP</strong> counselling — institute code <strong>4455</strong>. Six counselling steps, with eligibility, documents and timelines on the <Link href="/admission">Admission</Link> and <Link href="/jeecup">JEECUP guidance</Link> pages.</p>
        <p>{`// TODO: publish branch-wise admitted-student counts for the last three cycles (2023-24, 2024-25, 2025-26) per AICTE Annexure-18 §10 once the Examination cell releases the consolidated figures.`}</p>
      </>
    ),
  },
  {
    id: "infrastructure",
    n: "10",
    title: "Infrastructure — labs, library, computers",
    body: (
      <>
        <p>
          Six-acre Phoolpur campus. <strong>Computer Lab:</strong> 120+ systems, dual-monitor, dedicated servers, 50 Mbps leased internet, 100% Wi-Fi. <strong>Library:</strong> 8,428 volumes across 1,220 titles plus e-resource subscriptions including IEEE digital library and NPTEL.
        </p>
        <p>Branch-wise lab inventory is published on the <Link href="/campus">Campus &amp; Facilities</Link> page. The <Link href="/teaching">Teaching &amp; Learning</Link> page lists the 32 laboratories and workshops.</p>
      </>
    ),
  },
  {
    id: "hostel",
    n: "11",
    title: "Hostel and transport",
    body: (
      <>
        <p>Boys&rsquo; hostel block on the 6-acre campus, with on-campus mess, Wi-Fi, study halls and 24×7 security. Annual mess fee ₹36,000. Free shuttle from Varanasi Cantt for campus visits.</p>
        <p>See the <Link href="/hostel">Hostel page</Link> for the full breakdown.</p>
      </>
    ),
  },
  {
    id: "scholarships",
    n: "12",
    title: "Scholarships and financial assistance",
    body: (
      <>
        <p>UP Government post-matric scholarships cover full or partial tuition for SC, ST, OBC, EWS and Minority categories. BIPE also offers merit-based waivers (25–50% for high JEECUP ranks; 10–25% for Class 10 toppers). See the <Link href="/scholarships">Scholarships page</Link>.</p>
      </>
    ),
  },
  {
    id: "committees",
    n: "13",
    title: "Statutory committees",
    body: (
      <>
        <p>BIPE constitutes the following statutory committees with public contact details:</p>
        <ul>
          <li><strong>Anti-Ragging Committee</strong> — <a href={`mailto:${DATA.contact.emailAntiRagging}`}>{DATA.contact.emailAntiRagging}</a> · per UGC Anti-Ragging Regulations 2009 and Supreme Court directions.</li>
          <li><strong>Internal Committee (POSH)</strong> — <a href={`mailto:${DATA.contact.emailIC}`}>{DATA.contact.emailIC}</a> · per Sexual Harassment of Women at Workplace Act, 2013.</li>
          <li><strong>SC / ST Committee</strong> — <a href={`mailto:${DATA.contact.emailScSt}`}>{DATA.contact.emailScSt}</a> · per SC/ST (Prevention of Atrocities) Act, 1989.</li>
          <li><strong>PWD / Equal Opportunity Cell</strong> — <a href={`mailto:${DATA.contact.emailPwd}`}>{DATA.contact.emailPwd}</a> · per RPWD Act 2016.</li>
          <li><strong>Grievance Redressal Cell</strong> — <a href={`mailto:${DATA.contact.emailGrievance}`}>{DATA.contact.emailGrievance}</a>. See <Link href="/grievance">Grievance Redressal</Link>.</li>
        </ul>
      </>
    ),
  },
  {
    id: "internship",
    n: "14",
    title: "Internship policy",
    body: (
      <>
        <p>Every BIPE student completes the AICTE-mandated internship at a regional employer — manufacturing unit, dairy plant, infrastructure contractor or utility — supervised by a faculty mentor. See <Link href="/teaching">Teaching &amp; Learning</Link>.</p>
      </>
    ),
  },
  {
    id: "ai-policy",
    n: "15",
    title: "AI use disclosure",
    body: (
      <>
        <p>BIPE uses AI tools — including Claude (Anthropic) — to augment teaching, never to replace faculty. The full policy is published at <Link href="/ai-policy">/ai-policy</Link> and reviewed annually by the academic council.</p>
      </>
    ),
  },
  {
    id: "loa",
    n: "16",
    title: "AICTE LoA / EoA letters",
    body: (
      <>
        <p>The latest Extension of Approval (EoA) for 2026-27: <strong>F.No. {DATA.contact.aicteEoaRef}</strong>, issued {DATA.contact.aicteEoaDate}. Verifiable on the <a href="https://facilities.aicte-india.org/dashboard/pages/dashboardaa.php" target="_blank" rel="noopener noreferrer">AICTE public dashboard</a>.</p>
        <p>{`// TODO: upload year-wise LoA / EoA letters (2010–2026) as PDFs to /downloads/ once scans are consolidated. Current draft uploads listed on the Approvals page.`}</p>
      </>
    ),
  },
];

export default function Page() {
  return (
    <div className="page-enter">
      {/* ====================================================================== */}
      {/* 1. HERO                                                                 */}
      {/* ====================================================================== */}
      <section className="section bipe-pad" style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 56 }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "64px 64px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", right: -160, top: -120, width: 460, height: 460, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 26%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="eyebrow">MANDATORY DISCLOSURE · 2026-27</div>
          <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "22ch" }}>
            Public disclosure,{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              per AICTE Annexure-18.
            </span>
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: "62ch" }}>
            Every AICTE-approved technical institution is required to publish a structured Mandatory Disclosure on its website and revise it annually. Below is BIPE&rsquo;s current 2026-27 disclosure. The downloadable PDF version (with signatures) is linked from the <Link href="/approvals">Approvals page</Link>.
          </p>
          <div className="row" style={{ marginTop: 22, gap: 12, flexWrap: "wrap" }}>
            <span className="pill pill-accent">EoA · {DATA.contact.aicteEoaDate}</span>
            <span className="pill" style={{ background: "var(--brand)", color: "#fff" }}>JEECUP {DATA.contact.jeecup}</span>
            <span className="pill">AICTE {DATA.contact.aicte}</span>
            <span className="pill">{DATA.contact.iso}</span>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. INDEX OF SECTIONS                                                    */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", paddingTop: 40, paddingBottom: 40 }}>
        <div className="container">
          <div className="eyebrow">Index</div>
          <div className="bipe-grid-4" style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
            border: "1px solid var(--line)",
            borderRadius: 18,
            overflow: "hidden",
            background: "var(--white)",
          }}>
            {SECTIONS.map((s, i, arr) => (
              <a key={s.id} href={`#${s.id}`} style={{
                padding: "14px 18px",
                borderRight: (i + 1) % 4 !== 0 ? "1px solid var(--line)" : "none",
                borderBottom: i < arr.length - (arr.length % 4 === 0 ? 4 : arr.length % 4) ? "1px solid var(--line)" : "none",
                color: "var(--ink)",
                textDecoration: "none",
                display: "flex",
                alignItems: "baseline",
                gap: 10,
              }}>
                <span className="serif" style={{ fontStyle: "italic", color: "var(--brand)", fontSize: 22, minWidth: 28 }}>{s.n}</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.35 }}>{s.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. SECTION CONTENT                                                       */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container" style={{ maxWidth: 920 }}>
          {SECTIONS.map((s) => (
            <article key={s.id} id={s.id} style={{ paddingTop: 32, paddingBottom: 32, borderBottom: "1px solid var(--line)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, alignItems: "start" }}>
                <div className="serif" style={{
                  fontStyle: "italic", fontWeight: 400,
                  fontSize: 56, lineHeight: 0.85,
                  color: "var(--brand)", letterSpacing: "-0.02em",
                  minWidth: 56,
                }}>
                  {s.n}
                </div>
                <div>
                  <h2 className="bipe-h3" style={{ fontSize: 22, fontWeight: 700 }}>{s.title}</h2>
                  <div style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.7 }} className="prose-md">
                    {s.body}
                  </div>
                </div>
              </div>
            </article>
          ))}

          <div style={{
            marginTop: 32, padding: "20px 24px",
            borderRadius: 16, background: "var(--paper-2)",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14,
          }}>
            <div>
              <div className="eyebrow">Last revised</div>
              <div style={{ marginTop: 6, fontWeight: 600 }}>2026-27 · revised {DATA.contact.aicteEoaDate}. Next review: 2027-28.</div>
            </div>
            <Link href="/approvals" className="btn btn-ghost">
              See Approvals page <ArrowIcon size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
