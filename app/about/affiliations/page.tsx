import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metadataFor, breadcrumbJsonLd } from "@/lib/seo";
import { DATA } from "@/lib/data";
import { ArrowIcon } from "@/components/shell/Icons";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("aboutAffiliations");
}

/**
 * /about/affiliations — single-source validation page.
 *
 * Phase 1.5 keyword analysis (May 2026) identified the
 * "bte up affiliated polytechnic varanasi" cluster as a small-
 * volume but very-high-conversion validation-intent query — parents
 * specifically checking affiliation before applying. /approvals
 * exists already but is funnel-style (verify-on-portal CTAs); this
 * page is a flatter reference — every affiliation with its name,
 * code, and the official portal where you can independently verify.
 */

interface Affiliation {
  id: string;
  body: string;
  abbreviation: string;
  fullName: string;
  scope: string;
  ourStatus: string;
  ourCode: string;
  verifyUrl: string;
  verifyLabel: string;
  note: string;
}

const AFFILIATIONS: Affiliation[] = [
  {
    id: "bteup",
    body: "Board of Technical Education, Uttar Pradesh",
    abbreviation: "BTE UP",
    fullName: "Board of Technical Education, Uttar Pradesh (also written BTEUP)",
    scope:
      "Affiliating body for every polytechnic in UP. Sets the syllabus, conducts semester exams, awards the diploma. Recognised by Government of Uttar Pradesh under the BTE UP Act.",
    ourStatus: "Affiliated · since 2010",
    ourCode: "College Code 4455",
    verifyUrl: "https://bteup.ac.in/",
    verifyLabel: "bteup.ac.in",
    note: "Confirm BIPE on the official BTE UP affiliated-college list. Filter by district = Varanasi.",
  },
  {
    id: "aicte",
    body: "All India Council for Technical Education",
    abbreviation: "AICTE",
    fullName: "All India Council for Technical Education (AICTE), Ministry of Education, Government of India",
    scope:
      "Statutory body of the Government of India that approves all technical-education institutions (B.Tech, M.Tech, MBA, diploma). Issues the Extension of Approval (EoA) annually.",
    ourStatus: "Approved · Permanent",
    ourCode: `Permanent ID: ${DATA.contact.aicte} · EoA ${DATA.contact.aicteEoaRef} dated ${DATA.contact.aicteEoaDate}`,
    verifyUrl: "https://facilities.aicte-india.org/dashboard/pages/dashboardaa.php",
    verifyLabel: "AICTE Dashboard (public)",
    note: "Look up the AICTE Permanent ID on the dashboard — institute name, location, branches, and current EoA all appear publicly.",
  },
  {
    id: "jeecup",
    body: "Joint Entrance Examination Council, Polytechnic (UP)",
    abbreviation: "JEECUP",
    fullName: "Joint Entrance Examination Council (Polytechnic), Uttar Pradesh",
    scope:
      "Conducts the annual UPJEE (Polytechnic) entrance exam and counselling. Every BTE UP-affiliated polytechnic admits students through JEECUP.",
    ourStatus: "Participating institute",
    ourCode: `Institute Code ${DATA.contact.jeecup}`,
    verifyUrl: "https://jeecup.admissions.nic.in/",
    verifyLabel: "jeecup.admissions.nic.in",
    note: "When you fill choices in counselling, BIPE appears under code 4455 — selectable for each branch.",
  },
  {
    id: "aishe",
    body: "All India Survey on Higher Education",
    abbreviation: "AISHE",
    fullName: "All India Survey on Higher Education (AISHE), Department of Higher Education, Ministry of Education",
    scope:
      "Government of India's annual census of higher-education institutions. Mandatory annual DCF (Data Capture Format) submission for every approved institute.",
    ourStatus: "Registered · DCF submitted annually",
    ourCode: "Registered with Department of Higher Education, MoE",
    verifyUrl: "https://aishe.gov.in/",
    verifyLabel: "aishe.gov.in",
    note: "AISHE registration confirms BIPE is in the central higher-education database. UDISE codes appear in the institute-search.",
  },
  {
    id: "afrc",
    body: "Admission & Fee Regulatory Committee, Uttar Pradesh",
    abbreviation: "AFRC UP",
    fullName: "Admission & Fee Regulatory Committee, Uttar Pradesh (AFRC UP)",
    scope:
      "State regulatory body that approves the annual tuition fee structure for every private polytechnic and engineering college in UP. Prevents capitation / arbitrary fee increases.",
    ourStatus: "Approved tuition · ₹30,150 / academic year",
    ourCode: "AFRC-approved fee structure on file",
    verifyUrl: "http://afrcup2018.in/",
    verifyLabel: "afrcup2018.in",
    note: "AFRC's website publishes the approved fee schedule for each institute. Insist any institute show their AFRC-approved fee in writing before you pay.",
  },
  {
    id: "urise",
    body: "URISE (UP Government polytechnic portal)",
    abbreviation: "URISE",
    fullName: "Unified Registration & Information System for Education (URISE), Government of Uttar Pradesh",
    scope:
      "State government portal that lists every recognised polytechnic in UP with its code, district, branches, and approval status.",
    ourStatus: "Listed at code 4455",
    ourCode: "/poly/4455",
    verifyUrl: "https://urise.up.gov.in/poly/4455",
    verifyLabel: "urise.up.gov.in/poly/4455",
    note: "Direct deep-link to BIPE's listing. Shows institute name, branches, district, and current approval status.",
  },
  {
    id: "irdt",
    body: "Institute of Research, Development & Training, UP",
    abbreviation: "IRDT UP",
    fullName: "Institute of Research, Development & Training, Uttar Pradesh",
    scope:
      "UP government body for technical-education training, curriculum development, and faculty development programmes. Most BTE UP polytechnics participate in IRDT FDP (Faculty Development Programmes).",
    ourStatus: "Participating institute",
    ourCode: "via BTE UP affiliation",
    verifyUrl: "https://irdtup.in/",
    verifyLabel: "irdtup.in",
    note: "Faculty across BIPE branches attend IRDT-conducted FDPs as part of their continuing-education credits.",
  },
];

export default function Page() {
  return (
    <div className="page-enter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "About BIPE", path: "/about" },
              { name: "Affiliations", path: "/about/affiliations" },
            ]),
          ),
        }}
      />
      {/* ── HERO ── */}
      <section
        className="section bipe-pad"
        style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 56 }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: -180,
            top: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "color-mix(in oklab, var(--brand) 26%, transparent)",
            filter: "blur(120px)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative" }}>
          <div className="eyebrow">Affiliations · everything in one place · 2026</div>
          <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "24ch" }}>
            Seven affiliations.{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              Seven portals to verify them on.
            </span>
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: "62ch" }}>
            Every claim BIPE makes about its regulatory status is published with a direct link to
            the government portal where you can independently verify it. No documentation gymnastics,
            no &ldquo;submit a request&rdquo; — these are public records the government itself
            maintains, and our institute appears in them by name and code.
          </p>
        </div>
      </section>

      {/* ── AFFILIATIONS LIST ── */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div style={{ display: "grid", gap: 24 }}>
            {AFFILIATIONS.map((a, i) => (
              <article
                key={a.id}
                className="card"
                style={{
                  padding: 28,
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 28,
                  alignItems: "start",
                }}
              >
                <div
                  className="serif"
                  style={{
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: 48,
                    color: "var(--brand)",
                    lineHeight: 0.9,
                    minWidth: 56,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--brand)",
                    }}
                  >
                    {a.abbreviation}
                  </div>
                  <h2 className="bipe-h3" style={{ fontSize: 22, lineHeight: 1.25, marginTop: 6 }}>
                    {a.body}
                  </h2>
                  <p
                    style={{
                      marginTop: 8,
                      color: "var(--ink-3)",
                      fontSize: 13,
                      fontStyle: "italic",
                    }}
                  >
                    {a.fullName}
                  </p>

                  <p
                    style={{
                      marginTop: 16,
                      color: "var(--ink-2)",
                      fontSize: 15,
                      lineHeight: 1.65,
                    }}
                  >
                    {a.scope}
                  </p>

                  <div
                    style={{
                      marginTop: 18,
                      padding: "14px 18px",
                      background: "color-mix(in oklab, var(--brand) 5%, transparent)",
                      borderLeft: "3px solid var(--brand)",
                      borderRadius: "0 8px 8px 0",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--brand)",
                        marginBottom: 4,
                      }}
                    >
                      BIPE&rsquo;s status
                    </div>
                    <div style={{ color: "var(--ink-1)", fontSize: 15, fontWeight: 600 }}>
                      {a.ourStatus}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "var(--ink-2)",
                      }}
                    >
                      {a.ourCode}
                    </div>
                  </div>

                  <a
                    href={a.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginTop: 18,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 16px",
                      borderRadius: 8,
                      background: "var(--brand)",
                      color: "var(--paper)",
                      textDecoration: "none",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Verify on {a.verifyLabel} <ArrowIcon size={14} />
                  </a>

                  <p
                    style={{
                      marginTop: 14,
                      color: "var(--ink-3)",
                      fontSize: 13,
                      lineHeight: 1.6,
                      fontStyle: "italic",
                    }}
                  >
                    {a.note}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── BTEUP procedural resources cluster ──
          Phase 4 cross-link (May 2026): readers who land on
          /about/affiliations care about the BTEUP relationship
          specifically — surface the procedural guides here so
          they can dive into the day-to-day mechanics (semester
          exams, Family-ID linking, fees, registration) without
          hunting through the footer. */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow">BTEUP procedural resources · current students</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "30ch" }}>
            The day-to-day{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              mechanics of being affiliated.
            </span>
          </h2>
          <p style={{ marginTop: 18, color: "var(--ink-2)", maxWidth: "62ch" }}>
            Affiliation isn&rsquo;t paperwork — it&rsquo;s how every
            BIPE student actually interacts with BTEUP across their
            diploma. Procedural guides for each touchpoint:
          </p>
          <div
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {[
              ["BTEUP Family ID Mandate", "May 2026 · scholarship gateway", "/bteup-family-id-registration"],
              ["BTEUP Semester Exam Dates", "Odd / even / practical · 2026", "/bteup-semester-exam-dates-2026"],
              ["BTEUP Admit Card", "Download · verify · troubleshoot", "/bteup-admit-card-download"],
              ["BTEUP Result Check", "Grades · grace · revaluation", "/bteup-result-check"],
              ["BTEUP Exam Fees Payment", "Portal · deadlines · failures", "/bteup-exam-fees-payment"],
              ["BTEUP Student Registration", "Annual · BIPE-coordinated", "/bteup-student-registration"],
            ].map(([title, sub, href]) => (
              <Link
                key={href}
                href={href}
                className="card"
                style={{
                  padding: 22,
                  background: "var(--paper)",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--brand)",
                  }}
                >
                  BTEUP
                </div>
                <div
                  className="serif"
                  style={{
                    fontSize: 19,
                    fontWeight: 500,
                    color: "var(--ink-1)",
                    marginTop: 6,
                    lineHeight: 1.3,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    color: "var(--ink-2)",
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  {sub} <span style={{ color: "var(--brand)" }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ + CTA ── */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">Three honest questions</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "26ch" }}>
            What this list{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              doesn&rsquo;t guarantee.
            </span>
          </h2>
          <div style={{ marginTop: 28, display: "grid", gap: 20, maxWidth: "70ch" }}>
            {[
              {
                q: "Does AICTE / BTE UP approval guarantee a job after the diploma?",
                a: "No. Approval guarantees the diploma is government-recognised and the curriculum is BTEUP-standard — that&rsquo;s the floor, not the ceiling. Job outcomes depend on the institute&rsquo;s placement cell, the student&rsquo;s performance, and the wider labour market. See /placements for BIPE&rsquo;s actual record (1,000+ verified placements over 16 years).",
              },
              {
                q: "If AICTE approval is annual, what happens if it isn&rsquo;t renewed?",
                a: "AICTE issues an Extension of Approval (EoA) every academic year. BIPE&rsquo;s 2026-27 EoA is on file — see card 02 above for the reference number. AICTE publishes EoA letters publicly on their dashboard; you can confirm any institute&rsquo;s current-year status before paying fees. Institutes that fail to secure annual EoA cannot admit new students.",
              },
              {
                q: "Why list seven affiliations? Most institutes show three.",
                a: "Most institutes list BTE UP + AICTE + AISHE and stop there. AFRC UP, URISE, IRDT and JEECUP are equally real affiliations that affect daily institute operations — AFRC sets the fee, URISE is the UP government&rsquo;s public listing, IRDT runs faculty training, JEECUP runs admissions. Listing all seven is transparency, not padding.",
              },
            ].map((f, i) => (
              <article
                key={i}
                style={{
                  padding: "20px 24px",
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  background: "var(--paper)",
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--ink-1)",
                    lineHeight: 1.4,
                  }}
                >
                  {f.q}
                </h3>
                <p
                  style={{
                    marginTop: 10,
                    color: "var(--ink-2)",
                    fontSize: 15,
                    lineHeight: 1.65,
                  }}
                >
                  {f.a}
                </p>
              </article>
            ))}
          </div>

          <div style={{ marginTop: 40, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/approvals" className="btn btn-primary btn-lg">
              Full approvals page <ArrowIcon size={16} />
            </Link>
            <Link href="/why-bipe" className="btn btn-ghost btn-lg">
              How BIPE compares
            </Link>
            <Link href="/apply" className="btn btn-ghost btn-lg">
              Apply for 2026-27
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
