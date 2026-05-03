import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { metaFor } from "@/lib/routes";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";
import { Counter } from "@/components/ui/Counter";
import { Avatar } from "@/components/ui/Avatar";
import {
  FACULTY,
  OFFICE_STAFF,
  FACULTY_BY_DEPT,
  DEPT_LABELS,
  type Faculty,
  type Department,
} from "@/lib/faculty";
import { DATA } from "@/lib/data";
import Image from "next/image";

export const metadata: Metadata = metaFor("faculty");

const DEPT_ORDER: Department[] = [
  "Electrical",
  "Civil",
  "Mechanical",
  "Computer Science",
  "Dairy",
];

const PRINCIPAL = FACULTY.find((f) => f.designation === "Principal");
const OFFICERS = FACULTY.filter((f) => f.isLeadership && f.designation !== "Principal");
const HODS = FACULTY.filter((f) => f.isHOD);

const TOTAL_FACULTY = FACULTY.length;
const TOTAL_PUBLICATIONS = FACULTY.reduce((s, f) => s + (f.publications ?? 0), 0);

// =====================================================================
// Portrait card — photo on top (4:5), info below
// =====================================================================
function PortraitCard({
  f,
  dark = false,
  aspect = "4 / 5",
  size = 320,
}: {
  f: Faculty;
  dark?: boolean;
  aspect?: string;
  size?: number;
}) {
  const muted = dark
    ? "color-mix(in oklab, var(--paper) 70%, transparent)"
    : "var(--ink-3)";
  const body = dark
    ? "color-mix(in oklab, var(--paper) 82%, transparent)"
    : "var(--ink-2)";
  const cardBg = dark
    ? "color-mix(in oklab, var(--paper) 5%, transparent)"
    : "var(--white)";
  const cardBorder = dark
    ? "1px solid color-mix(in oklab, var(--paper) 14%, transparent)"
    : "1px solid var(--line)";

  return (
    <article
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 20,
        background: cardBg,
        border: cardBorder,
        display: "flex",
        flexDirection: "column",
        transition: "transform .35s var(--ease), border-color .25s, box-shadow .35s",
      }}
    >
      {/* Photo / avatar area — top */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: aspect,
          background: dark
            ? "color-mix(in oklab, var(--paper) 8%, transparent)"
            : "var(--paper-2)",
          overflow: "hidden",
        }}
      >
        {f.photo ? (
          <Image
            src={f.photo}
            alt={f.name}
            fill
            sizes={`(max-width: 768px) 100vw, ${size}px`}
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar name={f.name} size={size * 0.55} shape="circle" />
          </div>
        )}

        {/* Gradient bar at the bottom of the photo for legibility */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 60,
            background:
              "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--ink) 55%, transparent) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Department / role chip — bottom-left of photo */}
        {(f.isHOD || f.isLeadership) && (
          <span
            style={{
              position: "absolute",
              left: 14,
              bottom: 12,
              padding: "5px 10px",
              borderRadius: 999,
              fontFamily: "var(--font-mono)",
              fontSize: 9.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: 600,
              background: f.isLeadership ? "var(--accent)" : "var(--brand)",
              color: f.isLeadership ? "var(--ink)" : "var(--paper)",
            }}
          >
            {f.isLeadership ? "Leadership" : "HOD"}
          </span>
        )}

        {/* Papers chip — bottom-right of photo */}
        {f.publications && f.publications > 0 && (
          <span
            style={{
              position: "absolute",
              right: 14,
              bottom: 12,
              padding: "5px 10px",
              borderRadius: 999,
              fontFamily: "var(--font-mono)",
              fontSize: 9.5,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontWeight: 600,
              background: "color-mix(in oklab, var(--paper) 90%, transparent)",
              color: "var(--brand-deep)",
              backdropFilter: "blur(8px)",
            }}
          >
            {f.publications} paper{f.publications === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {/* Info area — below photo */}
      <div
        style={{
          padding: "20px 22px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: 1,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 19,
              fontWeight: 600,
              color: dark ? "var(--paper)" : "var(--ink)",
              letterSpacing: "-0.015em",
              lineHeight: 1.18,
            }}
          >
            {f.name}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: muted,
              marginTop: 6,
              lineHeight: 1.4,
            }}
          >
            {f.designation}
          </div>
        </div>

        {f.qualifications.length > 0 && (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            {f.qualifications.slice(0, 2).map((q, i) => (
              <li
                key={i}
                style={{
                  fontSize: 12.5,
                  lineHeight: 1.5,
                  color: body,
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  columnGap: 8,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 999,
                    background: "var(--accent)",
                    marginTop: 8,
                  }}
                />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        )}

        {f.highlight && (
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 13.5,
              lineHeight: 1.4,
              color: body,
              borderLeft: `2px solid ${dark ? "var(--accent)" : "var(--brand)"}`,
              paddingLeft: 12,
            }}
          >
            {f.highlight}
          </div>
        )}

        <div
          style={{
            marginTop: "auto",
            paddingTop: 12,
            borderTop: dark
              ? "1px dashed color-mix(in oklab, var(--paper) 16%, transparent)"
              : "1px dashed var(--line-2)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: muted }}>
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "var(--brand)",
              }}
            />
            {f.experience || "—"}
          </span>
          <span style={{ color: muted }}>BIPE</span>
        </div>
      </div>
    </article>
  );
}

// =====================================================================
// Page
// =====================================================================
export default function Page() {
  return (
    <div className="page-enter">
      {/* ============================================================ */}
      {/* 1. EDITORIAL HERO                                            */}
      {/* ============================================================ */}
      <section
        className="section bipe-pad"
        style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 64 }}
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
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "color-mix(in oklab, var(--brand) 26%, transparent)",
            filter: "blur(120px)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: -160,
            bottom: -160,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "color-mix(in oklab, var(--accent) 28%, transparent)",
            filter: "blur(140px)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative" }}>
          <div className="eyebrow">§ Faculty · {DATA.contact.aicte}</div>
          <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "22ch" }}>
            The teachers,{" "}
            <span
              className="serif"
              style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
            >
              in their own names.
            </span>
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: "62ch" }}>
            A diploma is the product of who teaches it. Below — every academic
            faculty member at BIPE, with their qualifications, experience and
            published work. No anonymous &ldquo;33 faculty&rdquo; counts; we name them.
          </p>
          <div
            className="bipe-stats"
            style={{
              marginTop: 36,
              paddingTop: 22,
              borderTop: "1px solid var(--line)",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 28,
            }}
          >
            {[
              { num: TOTAL_FACULTY, lbl: "academic faculty", sub: "Named on this page" },
              { num: 5, lbl: "departments", sub: "BTEUP-licensed" },
              { num: TOTAL_PUBLICATIONS, lbl: "papers published", sub: "Journals + conferences" },
              { num: HODS.length, lbl: "department heads", sub: "One per branch" },
            ].map((s) => (
              <div key={s.lbl}>
                <div
                  className="serif"
                  style={{
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "clamp(40px, 4.4vw, 60px)",
                    lineHeight: 0.9,
                    color: "var(--brand)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  <Counter to={String(s.num)} />
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--ink-2)",
                    fontWeight: 600,
                  }}
                >
                  {s.lbl}
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. PRINCIPAL — featured split                                */}
      {/* ============================================================ */}
      {PRINCIPAL && (
        <section className="section bipe-pad" style={{ background: "var(--paper-2)", paddingTop: 56, paddingBottom: 56 }}>
          <div className="container">
            <div
              className="bipe-split"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.05fr)",
                gap: 48,
                alignItems: "stretch",
                background: "var(--white)",
                border: "1px solid var(--line)",
                borderRadius: 24,
                overflow: "hidden",
              }}
            >
              {/* Portrait */}
              <div
                style={{
                  position: "relative",
                  aspectRatio: "4 / 5",
                  background: "var(--paper-2)",
                  minHeight: 420,
                }}
              >
                {PRINCIPAL.photo && (
                  <Image
                    src={PRINCIPAL.photo}
                    alt={PRINCIPAL.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    style={{ objectFit: "cover", objectPosition: "center top" }}
                    priority
                  />
                )}
                <span
                  style={{
                    position: "absolute",
                    left: 22,
                    top: 22,
                    padding: "6px 12px",
                    borderRadius: 999,
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    background: "var(--accent)",
                    color: "var(--ink)",
                  }}
                >
                  Principal
                </span>
              </div>

              {/* Editorial bio */}
              <div
                className="bipe-pad-box"
                style={{
                  padding: "44px 44px 44px 8px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 22,
                }}
              >
                <div>
                  <div className="eyebrow">§ Office of the Principal</div>
                  <h2
                    className="bipe-h2"
                    style={{ marginTop: 12, maxWidth: "16ch", letterSpacing: "-0.02em" }}
                  >
                    {PRINCIPAL.name}
                  </h2>
                  <div
                    style={{
                      marginTop: 10,
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--ink-3)",
                    }}
                  >
                    {PRINCIPAL.experience}
                  </div>
                </div>

                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {PRINCIPAL.qualifications.map((q, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: 14.5,
                        lineHeight: 1.55,
                        color: "var(--ink-2)",
                        display: "grid",
                        gridTemplateColumns: "auto 1fr",
                        gap: 12,
                      }}
                    >
                      <span
                        className="serif"
                        style={{
                          fontStyle: "italic",
                          fontWeight: 400,
                          fontSize: 22,
                          lineHeight: 1,
                          color: "var(--brand)",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>

                {PRINCIPAL.highlight && (
                  <p
                    className="serif"
                    style={{
                      fontStyle: "italic",
                      fontSize: 18,
                      lineHeight: 1.45,
                      color: "var(--ink-2)",
                      borderLeft: "3px solid var(--accent)",
                      paddingLeft: 14,
                    }}
                  >
                    {PRINCIPAL.highlight}
                  </p>
                )}

                <div
                  style={{
                    paddingTop: 16,
                    borderTop: "1px dashed var(--line-2)",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {PRINCIPAL.publications && (
                    <span
                      style={{
                        padding: "5px 12px",
                        borderRadius: 999,
                        background: "color-mix(in oklab, var(--accent) 18%, var(--paper))",
                        color: "var(--accent-deep)",
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      {PRINCIPAL.publications} papers published
                    </span>
                  )}
                  {(PRINCIPAL.certifications ?? []).map((c) => (
                    <span
                      key={c}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 999,
                        border: "1px solid var(--line)",
                        background: "var(--paper-2)",
                        color: "var(--ink-2)",
                        fontSize: 11,
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <Link
                  href="/principal"
                  className="btn btn-ghost"
                  style={{ alignSelf: "flex-start", marginTop: 8 }}
                >
                  Read principal&rsquo;s message <ArrowIcon size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 3. OFFICERS — Admin & Welfare                                */}
      {/* ============================================================ */}
      {OFFICERS.length > 0 && (
        <section className="section" style={{ paddingTop: 32 }}>
          <div className="container">
            <div
              style={{
                display: "flex",
                alignItems: "end",
                justifyContent: "space-between",
                gap: 20,
                marginBottom: 28,
                paddingBottom: 18,
                borderBottom: "1px solid var(--line)",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div className="eyebrow">§ Student services</div>
                <h2 className="bipe-h2" style={{ marginTop: 12, maxWidth: "20ch" }}>
                  Two offices,{" "}
                  <span
                    className="serif"
                    style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
                  >
                    one phone number.
                  </span>
                </h2>
              </div>
              <p
                style={{
                  color: "var(--ink-3)",
                  fontSize: 13,
                  maxWidth: "42ch",
                  lineHeight: 1.6,
                  textAlign: "right",
                }}
              >
                Admissions, training &amp; placements, and student welfare —
                each with a name, a face, and a working phone number.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 460px))",
                gap: 18,
                justifyContent: "start",
              }}
            >
              {OFFICERS.map((f) => (
                <PortraitCard key={f.id} f={f} aspect="5 / 4" size={400} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 4. HEADS OF DEPARTMENT                                       */}
      {/* ============================================================ */}
      <section
        className="section"
        style={{
          background: "var(--ink)",
          color: "var(--paper)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            backgroundImage:
              "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: -200,
            top: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "color-mix(in oklab, var(--brand) 60%, transparent)",
            filter: "blur(140px)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative" }}>
          <div
            style={{
              display: "flex",
              alignItems: "end",
              justifyContent: "space-between",
              gap: 20,
              marginBottom: 32,
              paddingBottom: 22,
              borderBottom: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>
                § Heads of department
              </div>
              <h2
                className="bipe-h2"
                style={{ marginTop: 14, color: "var(--paper)", maxWidth: "20ch" }}
              >
                Four HODs.{" "}
                <span
                  className="serif"
                  style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}
                >
                  One per branch.
                </span>
              </h2>
            </div>
            <p
              style={{
                color: "color-mix(in oklab, var(--paper) 70%, transparent)",
                fontSize: 13,
                maxWidth: "42ch",
                lineHeight: 1.6,
                textAlign: "right",
              }}
            >
              Curriculum, mentorship, and recruiter relationships sit with these four. Their door is open Mon&ndash;Sat.
            </p>
          </div>
          <div
            className="bipe-hod-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 16,
            }}
          >
            {HODS.map((f) => (
              <PortraitCard key={f.id} f={f} dark size={280} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. DEPARTMENT-WISE FACULTY                                   */}
      {/* ============================================================ */}
      {DEPT_ORDER.map((dept, i) => {
        const list = (FACULTY_BY_DEPT[dept] || []).filter((f) => !f.isHOD);
        if (list.length === 0) return null;
        const isOdd = i % 2 === 1;
        return (
          <section
            key={dept}
            className="section"
            style={{
              background: isOdd ? "var(--paper-2)" : "var(--paper)",
            }}
          >
            <div className="container">
              <div
                style={{
                  display: "flex",
                  alignItems: "end",
                  justifyContent: "space-between",
                  gap: 20,
                  marginBottom: 32,
                  paddingBottom: 18,
                  borderBottom: "1px solid var(--line)",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div
                    className="eyebrow"
                    style={{ color: "var(--brand)", fontWeight: 700 }}
                  >
                    § Department / 0{i + 1}
                  </div>
                  <h2
                    className="bipe-h2"
                    style={{ marginTop: 12, maxWidth: "24ch" }}
                  >
                    {DEPT_LABELS[dept]}
                  </h2>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--ink-3)",
                    paddingBottom: 8,
                  }}
                >
                  {list.length} member{list.length === 1 ? "" : "s"} ·{" "}
                  <Link
                    href="/courses"
                    style={{
                      color: "var(--brand)",
                      textDecoration: "none",
                      borderBottom: "1px solid var(--brand)",
                      paddingBottom: 1,
                    }}
                  >
                    branch page →
                  </Link>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 360px))",
                  gap: 16,
                  justifyContent: "start",
                }}
              >
                {list.map((f) => (
                  <PortraitCard key={f.id} f={f} size={320} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* ============================================================ */}
      {/* 6. RESEARCH HIGHLIGHTS                                       */}
      {/* ============================================================ */}
      <section
        className="section"
        style={{
          background: "var(--ink)",
          color: "var(--paper)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "50%",
            top: "-30%",
            transform: "translateX(-50%)",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--accent) 35%, transparent), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative", textAlign: "center" }}>
          <div className="eyebrow" style={{ color: "var(--accent)" }}>
            § Faculty research
          </div>
          <p
            className="serif"
            style={{
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(28px, 3.6vw, 48px)",
              lineHeight: 1.2,
              maxWidth: "26ch",
              margin: "18px auto 0",
              color: "var(--paper)",
              letterSpacing: "-0.015em",
            }}
          >
            <Counter to={String(TOTAL_PUBLICATIONS)} /> peer-reviewed papers across power systems, photovoltaics, mechanical CAD,{" "}
            <span style={{ color: "var(--accent)" }}>energy management</span> and welding optimisation.
          </p>
          <p
            style={{
              marginTop: 20,
              fontSize: 14,
              color: "color-mix(in oklab, var(--paper) 70%, transparent)",
              maxWidth: "60ch",
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.6,
            }}
          >
            Diploma teaching at BIPE is anchored by faculty who actively publish &mdash; from journal papers on virtual synchronous machines and EV-grid integration to conference work on dye-sensitised solar cells and ZnO nanostructures.
          </p>
          <div style={{ marginTop: 28, display: "inline-flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              href="/teaching"
              className="btn"
              style={{ background: "var(--paper)", color: "var(--ink)" }}
            >
              Outcome-based teaching <ArrowIcon size={14} />
            </Link>
            <Link
              href="/approvals"
              className="btn btn-ghost"
              style={{
                color: "var(--paper)",
                borderColor: "color-mix(in oklab, var(--paper) 28%, transparent)",
              }}
            >
              Annexure-18 disclosure
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. OFFICE STAFF — minimal compact list                       */}
      {/* ============================================================ */}
      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <div
            style={{
              marginBottom: 28,
              paddingBottom: 18,
              borderBottom: "1px solid var(--line)",
            }}
          >
            <div className="eyebrow">§ Office staff</div>
            <h2 className="bipe-h3" style={{ marginTop: 12, maxWidth: "30ch" }}>
              Records, fees, library, day-to-day operations.
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 320px))",
              gap: 12,
              justifyContent: "start",
            }}
          >
            {OFFICE_STAFF.map((f) => (
              <div
                key={f.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: 18,
                  borderRadius: 14,
                  background: "var(--white)",
                  border: "1px solid var(--line)",
                  transition: "border-color .25s, transform .25s var(--ease)",
                }}
              >
                <Avatar name={f.name} photo={f.photo} size={48} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
                    {f.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--ink-3)",
                      marginTop: 3,
                    }}
                  >
                    {f.designation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. CTA                                                       */}
      {/* ============================================================ */}
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container">
          <div
            className="bipe-split bipe-pad-box"
            style={{
              padding: "44px 40px",
              borderRadius: 24,
              background: "var(--white)",
              border: "1px solid var(--line)",
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: 36,
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                right: -80,
                top: -80,
                width: 280,
                height: 280,
                borderRadius: "50%",
                background: "color-mix(in oklab, var(--brand) 12%, transparent)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative" }}>
              <div className="eyebrow">§ Talk to a teacher</div>
              <h3 className="bipe-h3" style={{ marginTop: 12, maxWidth: "22ch" }}>
                Pick a branch you&rsquo;re considering &mdash; we&rsquo;ll connect you with the lecturer who runs that lab.
              </h3>
              <p
                style={{
                  color: "var(--ink-2)",
                  fontSize: 14,
                  marginTop: 12,
                  maxWidth: "58ch",
                  lineHeight: 1.6,
                }}
              >
                Most parents reach out before counselling to talk to the actual faculty teaching the branch. We respond within 24 hours, in English or Hindi.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
              <Link href="/visit" className="btn btn-primary">
                Book a campus visit <ArrowIcon size={14} />
              </Link>
              <a
                href={DATA.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa"
                style={{ justifyContent: "center" }}
              >
                <WhatsAppIcon /> WhatsApp admissions
              </a>
              <a
                href={`tel:${DATA.contact.phone}`}
                className="btn btn-ghost"
                style={{ justifyContent: "center" }}
              >
                Call {DATA.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
