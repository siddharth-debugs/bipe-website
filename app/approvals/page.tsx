import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metadataFor } from "@/lib/seo";
import { ArrowIcon } from "@/components/shell/Icons";
import { DATA } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("approvals"); }

type Approval = {
  key: string;
  name: string;
  full: string;
  status: string;
  body: React.ReactNode;
  meta: { label: string; value: string }[];
  verify?: { label: string; href: string };
  icon: React.ReactNode;
};

const APPROVALS: Approval[] = [
  {
    key: "aicte",
    name: "AICTE",
    full: "All India Council for Technical Education",
    status: "Active",
    body: (
      <>
        Permanent recognition by the apex regulator of technical education in India. Annual EoA letter renewed for the 2026-27 academic year.
      </>
    ),
    meta: [
      { label: "Permanent ID", value: "1-488233171" },
      { label: "EoA F.No.", value: "Northern/1-46216893240/2026/EOA" },
      { label: "Issued", value: "16 March 2026" },
    ],
    verify: { label: "Verify on AICTE portal", href: "https://facilities.aicte-india.org/dashboard/pages/dashboardaa.php" },
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M3 21V10l9-6 9 6v11M9 21V12h6v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "bteup",
    name: "BTEUP",
    full: "Board of Technical Education, Uttar Pradesh",
    status: "Affiliated",
    body: (
      <>
        State-board affiliation under JEECUP. All five BIPE branches are listed under college code 4455 in the JEECUP counselling portal.
      </>
    ),
    meta: [
      { label: "JEECUP Code", value: "4455" },
      { label: "Branches", value: "5" },
      { label: "Sanctioned seats", value: "480" },
    ],
    verify: { label: "Verify on JEECUP portal", href: "https://jeecup.admissions.nic.in" },
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M4 4h16v16H4zM4 8h16M8 4v16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "aishe",
    name: "AISHE",
    full: "All India Survey on Higher Education",
    status: "Registered",
    body: (
      <>
        Active registration with the Department of Higher Education, Ministry of Education — the national database for accredited institutions.
      </>
    ),
    meta: [
      { label: "Registry", value: "Dept. of Higher Education" },
      { label: "Status", value: "Active" },
      { label: "Reporting", value: "Annual" },
    ],
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M3 12l9-7 9 7-9 7-9-7zM5 13v6h14v-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const SEAT_MATRIX: { name: string; code: string; intake: string }[] = [
  { name: "Civil Engineering", code: "322", intake: "120" },
  { name: "Electrical Engineering", code: "328", intake: "120" },
  { name: "Mechanical Engineering (Production)", code: "343", intake: "120" },
  { name: "Computer Science & Engineering", code: "355", intake: "60" },
  { name: "Dairy Engineering", code: "327", intake: "60" },
];

const DISCLOSURE: { num: string; label: string }[] = [
  { num: "480", label: "Total seats 2026-27" },
  { num: "40", label: "Faculty" },
  { num: "6", label: "Acres campus" },
  { num: "8,428", label: "Books · volumes" },
  { num: "1,220", label: "Library titles" },
  { num: "120", label: "PCs in lab" },
  { num: "50 Mbps", label: "Leased internet" },
  { num: "100%", label: "Wi-Fi coverage" },
];

const DOWNLOADS: { title: string; size: string; href: string }[] = [
  // TODO: replace placeholder hrefs once PDFs are uploaded to /public/downloads/
  { title: "AICTE EoA Letter 2026-27", size: "PDF · ~480 KB", href: "/downloads/aicte-eoa-2026-27.pdf" },
  { title: "Mandatory Disclosure (Annexure-18)", size: "PDF · ~2.1 MB", href: "/downloads/mandatory-disclosure-2026-27.pdf" },
  { title: "BTEUP Affiliation Letter", size: "PDF · on request", href: "/downloads/bteup-affiliation.pdf" },
];

export default function Page() {
  return (
    <div className="page-enter">
      {/* ====================================================================== */}
      {/* 1. HERO + SEAL                                                          */}
      {/* ====================================================================== */}
      <section className="section bipe-pad" style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 72 }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "64px 64px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: -160, top: -120, width: 460, height: 460, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 26%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div className="eyebrow">APPROVALS · 2026-27</div>
              <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "16ch" }}>
                All approvals —{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  regulatory and quality.
                </span>
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "52ch" }}>
                BIPE holds AICTE permanent recognition, BTEUP affiliation under JEECUP code 4455 and active AISHE registration. Documents are public; copies are available on request from the Principal's office.
              </p>
              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <span className="pill pill-accent">EoA · 16 MAR 2026</span>
                <span className="pill" style={{ background: "var(--brand)", color: "#fff" }}>JEECUP 4455</span>
                <span className="pill">AISHE ACTIVE</span>
              </div>
              <div className="row" style={{ marginTop: 18, gap: 12, flexWrap: "wrap" }}>
                <Link href="/mandatory-disclosure" className="btn btn-primary">
                  Mandatory Disclosure 2026-27 <ArrowIcon size={14} />
                </Link>
                <Link href="/grievance" className="btn btn-ghost">
                  Statutory committees
                </Link>
              </div>
            </div>

            {/* Stylised seal */}
            <div style={{ position: "relative", aspectRatio: "1 / 1", maxWidth: 420, marginInline: "auto", width: "100%" }}>
              {/* Outer ring with rotating dashed circle */}
              <div aria-hidden="true" style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                border: "1px dashed var(--brand)",
                opacity: 0.4,
              }} />
              <div aria-hidden="true" style={{
                position: "absolute", inset: 14, borderRadius: "50%",
                border: "2px solid var(--brand)",
              }} />
              <div aria-hidden="true" style={{
                position: "absolute", inset: 22, borderRadius: "50%",
                border: "1px solid var(--line)",
              }} />
              <div aria-hidden="true" style={{
                position: "absolute", inset: 40, borderRadius: "50%",
                background: "color-mix(in oklab, var(--brand) 8%, var(--paper))",
                border: "1px solid color-mix(in oklab, var(--brand) 24%, transparent)",
              }} />
              <div aria-hidden="true" style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "radial-gradient(circle at 50% 38%, color-mix(in oklab, var(--accent) 36%, transparent), transparent 55%)",
                pointerEvents: "none",
              }} />

              {/* Center mark */}
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                textAlign: "center",
              }}>
                <div className="serif" style={{
                  fontStyle: "italic", fontWeight: 400,
                  fontSize: "clamp(72px, 8vw, 112px)",
                  lineHeight: 0.85, color: "var(--brand)",
                  letterSpacing: "-0.04em",
                }}>
                  BIPE
                </div>
                <div className="eyebrow" style={{ marginTop: 8, color: "var(--brand)" }}>VARANASI · 2010</div>
                <div style={{ marginTop: 10, height: 1, width: 80, background: "var(--accent)" }} />
                <div style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", color: "var(--ink-2)", textTransform: "uppercase" }}>
                  AICTE · BTEUP · AISHE
                </div>
              </div>

              {/* Curved label tick marks */}
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 360) / 24;
                return (
                  <div key={i} aria-hidden="true" style={{
                    position: "absolute", left: "50%", top: "50%",
                    width: 2, height: 8,
                    background: i % 6 === 0 ? "var(--accent)" : "var(--brand)",
                    opacity: i % 6 === 0 ? 1 : 0.4,
                    transformOrigin: "50% 50%",
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-180px)`,
                  }} />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. APPROVALS GRID                                                       */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", right: -160, top: -120, width: 360, height: 360, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 18%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 40, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">The three approvals</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
                Each one,{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  independently verifiable.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Where a public portal exists, the verify link is one click away. Where it doesn't, the certificate is available on written request to the Principal's office.
            </p>
          </div>

          <div className="bipe-form-row" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {APPROVALS.map((a) => (
              <article key={a.key} className="card" style={{ padding: 32, position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{
                  position: "absolute", right: -50, top: -50, width: 180, height: 180, borderRadius: "50%",
                  background: "color-mix(in oklab, var(--brand) 6%, transparent)",
                  pointerEvents: "none",
                }} />
                <div style={{ position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: 14,
                        background: "var(--brand-soft)", color: "var(--brand)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {a.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 26, letterSpacing: "-0.015em", lineHeight: 1.1 }}>{a.name}</div>
                        <div style={{ marginTop: 4, fontSize: 13, color: "var(--ink-3)" }}>{a.full}</div>
                      </div>
                    </div>
                    <span className="pill" style={{ background: "color-mix(in oklab, #2E7D52 18%, var(--paper))", color: "#2E7D52" }}>
                      ● {a.status}
                    </span>
                  </div>

                  <p style={{ marginTop: 18, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.6 }}>{a.body}</p>

                  <div style={{
                    marginTop: 20, padding: "14px 16px",
                    border: "1px solid var(--line)", borderRadius: 12,
                    background: "var(--paper)",
                    display: "grid", gap: 8,
                  }}>
                    {a.meta.map((m) => (
                      <div key={m.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)" }}>{m.label}</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: "var(--ink)", textAlign: "right" }}>{m.value}</span>
                      </div>
                    ))}
                  </div>

                  {a.verify && (
                    <a href={a.verify.href} target="_blank" rel="noopener noreferrer" style={{
                      marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8,
                      color: "var(--brand)", fontWeight: 600, fontSize: 14,
                    }}>
                      {a.verify.label} &rarr;
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. DISCLOSURE STATS — dark                                              */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--ink)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
          backgroundSize: "64px 64px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: "30%", top: -160, width: 520, height: 520, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 50%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 40 }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>By the numbers</div>
              <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch", color: "var(--paper)" }}>
                The 2026-27{" "}
                <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                  disclosure.
                </span>
              </h2>
            </div>
            <p style={{ color: "color-mix(in oklab, var(--paper) 72%, transparent)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              Numbers we publish on AICTE Annexure-18 and re-publish here without rounding or rephrasing.
            </p>
          </div>

          <div className="bipe-grid-4" style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
            borderRadius: 24, overflow: "hidden",
          }}>
            {DISCLOSURE.map((d, i) => (
              <div key={d.label} style={{
                padding: "32px 24px",
                borderRight: (i + 1) % 4 !== 0 ? "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" : "none",
                borderBottom: i < 4 ? "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" : "none",
              }}>
                <div className="serif" style={{
                  fontStyle: "italic", fontWeight: 400,
                  fontSize: "clamp(40px, 5vw, 72px)",
                  lineHeight: 0.9, letterSpacing: "-0.02em",
                  color: "var(--accent)",
                }}>
                  {d.num}
                </div>
                <div style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 65%, transparent)" }}>
                  {d.label}
                </div>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 18, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", color: "color-mix(in oklab, var(--paper) 55%, transparent)" }}>
            Source: AICTE Mandatory Disclosure 2026-27 · Annexure-18
          </p>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. SEAT MATRIX                                                          */}
      {/* ====================================================================== */}
      <section className="section" style={{ position: "relative" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 24 }}>
            <div>
              <div className="eyebrow">Seat matrix</div>
              <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "20ch" }}>
                Branch-wise{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  sanctioned seats.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
              The 2026-27 sanctioned intake under JEECUP college code 4455 — five 3-year BTEUP diploma courses.
            </p>
          </div>

          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "auto 3fr 1fr",
              padding: "16px 24px",
              background: "var(--ink)", color: "var(--paper)",
              fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
            }}>
              <div>Code</div>
              <div>Branch</div>
              <div>Intake</div>
            </div>
            {SEAT_MATRIX.map((row, i) => (
              <div key={row.code} style={{
                display: "grid", gridTemplateColumns: "auto 3fr 1fr",
                padding: "20px 24px",
                background: i % 2 === 0 ? "var(--white)" : "var(--paper-2)",
                borderBottom: i < SEAT_MATRIX.length - 1 ? "1px solid var(--line)" : "none",
                alignItems: "center",
              }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--brand)", minWidth: 40 }}>{row.code}</div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{row.name}</div>
                <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 28, color: "var(--ink)", letterSpacing: "-0.01em" }}>{row.intake}</div>
              </div>
            ))}
            <div style={{
              display: "grid", gridTemplateColumns: "auto 3fr 1fr",
              padding: "20px 24px",
              background: "color-mix(in oklab, var(--brand) 8%, var(--paper))",
              borderTop: "2px solid var(--brand)",
              alignItems: "center",
            }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--brand)" }}>TOTAL</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>2026-27 sanctioned intake</div>
              <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 36, color: "var(--brand)", letterSpacing: "-0.02em" }}>480</div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5. DOWNLOADS                                                            */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", left: -160, bottom: -120, width: 360, height: 360, borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 22%, transparent)",
          filter: "blur(120px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid var(--line)" }}>
            <div>
              <div className="eyebrow">Downloads</div>
              <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "20ch" }}>
                Documents,{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  on letterhead.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right", fontSize: 14 }}>
              PDFs are publicly available. If a link is on request, write to <a href="mailto:info@bipe.ac.in" style={{ color: "var(--brand)", fontWeight: 600 }}>info@bipe.ac.in</a>.
            </p>
          </div>

          <div className="bipe-form-row" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            {DOWNLOADS.map((d, i) => (
              // TODO: real PDFs not yet uploaded — placeholder hrefs only
              <a key={d.title} href={d.href} download style={{
                display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 18, alignItems: "center",
                padding: "22px 24px", borderRadius: 16,
                background: "var(--white)", border: "1px solid var(--line)",
                textDecoration: "none", color: "var(--ink)",
                transition: "border-color .25s var(--ease), transform .25s var(--ease)",
              }}>
                <div style={{
                  width: 44, height: 52, borderRadius: 8,
                  background: "color-mix(in oklab, var(--brand) 8%, var(--paper))",
                  border: "1px solid color-mix(in oklab, var(--brand) 18%, transparent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "var(--brand)" }}>PDF</div>
                  <span style={{
                    position: "absolute", top: -1, right: -1,
                    fontFamily: "var(--font-mono)", fontSize: 8,
                    background: "var(--ink)", color: "var(--paper)",
                    padding: "1px 4px", borderRadius: 3,
                  }}>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15.5, letterSpacing: "-0.005em" }}>{d.title}</div>
                  <div style={{ marginTop: 3, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em", color: "var(--ink-3)" }}>{d.size}</div>
                </div>
                <span style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "var(--brand-soft)", color: "var(--brand)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <ArrowIcon size={14} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 5b. REGULATOR PORTALS — full directory                                  */}
      {/* ====================================================================== */}
      <section className="section" style={{ background: "var(--paper-2)", paddingTop: 40, paddingBottom: 40, position: "relative", overflow: "hidden" }}>
        <div className="container">
          <div className="eyebrow">Regulator portals · directory</div>
          <h2 className="bipe-h3" style={{ marginTop: 12, fontSize: 22, marginBottom: 22 }}>
            Every government and regulatory portal that lists or governs BIPE.
          </h2>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 12,
          }}>
            {DATA.regulators.map((r) => (
              <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" style={{
                padding: "16px 18px",
                borderRadius: 14,
                border: "1px solid var(--line)",
                background: "var(--white)",
                color: "var(--ink)",
                textDecoration: "none",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14,
              }}>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--brand)" }}>{r.name}</div>
                  <div style={{ marginTop: 4, fontSize: 13, color: "var(--ink-2)" }}>{r.full}</div>
                </div>
                <ArrowIcon size={14} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 6. EXTERNAL VERIFICATION                                                */}
      {/* ====================================================================== */}
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div style={{
            position: "relative", overflow: "hidden",
            background: "var(--ink)", color: "var(--paper)",
            borderRadius: 24,
            padding: "40px 56px",
          }}>
            <div aria-hidden="true" style={{
              position: "absolute", inset: 0, opacity: 0.05,
              backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
              backgroundSize: "56px 56px", pointerEvents: "none",
            }} />
            <div aria-hidden="true" style={{
              position: "absolute", right: -120, top: -120, width: 360, height: 360, borderRadius: "50%",
              background: "color-mix(in oklab, var(--accent) 36%, transparent)",
              filter: "blur(120px)", pointerEvents: "none",
            }} />
            <div className="bipe-split" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32, alignItems: "center" }}>
              <div>
                <div className="eyebrow" style={{ color: "var(--accent)" }}>Verify independently</div>
                <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", lineHeight: 1.08, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 14, color: "var(--paper)", maxWidth: "20ch" }}>
                  Don't take our word for it.{" "}
                  <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>
                    Check the portals.
                  </span>
                </h2>
                <p style={{ marginTop: 18, color: "color-mix(in oklab, var(--paper) 72%, transparent)", fontSize: 15, maxWidth: "52ch", lineHeight: 1.6 }}>
                  Both AICTE and JEECUP maintain public dashboards where institutions, codes and EoA letters can be looked up directly. BTEUP affiliation certificates are available on written request.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href="https://facilities.aicte-india.org/dashboard/pages/dashboardaa.php" target="_blank" rel="noopener noreferrer" style={{
                  padding: "16px 22px", borderRadius: 14,
                  background: "var(--accent)", color: "var(--ink)",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  fontWeight: 600,
                }}>
                  AICTE portal &rarr;
                </a>
                <a href="https://jeecup.admissions.nic.in" target="_blank" rel="noopener noreferrer" style={{
                  padding: "16px 22px", borderRadius: 14,
                  background: "color-mix(in oklab, var(--paper) 8%, transparent)",
                  border: "1px solid color-mix(in oklab, var(--paper) 22%, transparent)",
                  color: "var(--paper)",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  fontWeight: 600,
                }}>
                  JEECUP portal &rarr;
                </a>
                <Link href="/contact" style={{
                  padding: "16px 22px", borderRadius: 14,
                  background: "color-mix(in oklab, var(--paper) 8%, transparent)",
                  border: "1px solid color-mix(in oklab, var(--paper) 22%, transparent)",
                  color: "var(--paper)",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  fontWeight: 600,
                }}>
                  Request BTEUP cert <ArrowIcon size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
