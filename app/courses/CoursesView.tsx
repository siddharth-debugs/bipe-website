"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DATA } from "@/lib/data";
import { BIPE_IMG } from "@/lib/images";
import { Img } from "@/components/ui/Img";
import { ArrowIcon } from "@/components/shell/Icons";

const BRANCH_ICONS: Record<string, string> = {
  "355": "M4 5h16v10H4zM2 19h20M9 9l2 2 4-4",
  "327": "M8 3h8l1 4-1 14H8L7 7l1-4zM10 11h4",
  "322": "M3 21h18M5 21V11l7-6 7 6v10M9 21v-6h6v6",
  "328": "M11 2L4 14h6l-1 8 8-12h-6l1-8z",
  "343": "M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3M9 12a3 3 0 106 0 3 3 0 00-6 0z",
};

export function CoursesView() {
  const [active, setActive] = useState<string>(DATA.branches[0].code);

  const list = DATA.branches;

  // Ensure active is in the visible list; if not, fall back to first.
  const visibleActive = list.find((b) => b.code === active) ?? list[0];
  const b = visibleActive;

  return (
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
            "linear-gradient(color-mix(in oklab, var(--paper) 100%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--paper) 100%, transparent) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -200,
          top: -100,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 70%, transparent)",
          filter: "blur(120px)",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: -180,
          bottom: -180,
          width: 460,
          height: 460,
          borderRadius: "50%",
          background: "color-mix(in oklab, var(--accent) 38%, transparent)",
          filter: "blur(140px)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative" }}>
        {/* Section heading */}
        <div
          className="between"
          style={{ marginBottom: 32, alignItems: "end", flexWrap: "wrap", gap: 24 }}
        >
          <div>
            <div className="eyebrow" style={{ color: "var(--accent)" }}>
              § The catalogue
            </div>
            <h2
              className="bipe-h1"
              style={{ marginTop: 14, color: "var(--paper)", maxWidth: "20ch" }}
            >
              Five branches.{" "}
              <span
                className="serif"
                style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}
              >
                Hover, tap, choose.
              </span>
            </h2>
            <p
              style={{
                color: "color-mix(in oklab, var(--paper) 70%, transparent)",
                marginTop: 14,
                maxWidth: "52ch",
              }}
            >
              Every BTEUP-licensed diploma BIPE offers — five 3-year branches, three years to a career. Browse the index, watch the panel update.
            </p>
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              color: "color-mix(in oklab, var(--paper) 55%, transparent)",
            }}
          >
            BIPE / COURSES · 03
          </div>
        </div>

        {/* Two-column index + featured */}
        <div
          className="bipe-split"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 1fr",
            gap: 36,
            alignItems: "stretch",
          }}
        >
          {/* Left: index list */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {list.map((br, i) => {
              const on = br.code === b.code;
              return (
                <div
                  key={br.code}
                  onMouseEnter={() => setActive(br.code)}
                  onClick={() => setActive(br.code)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActive(br.code);
                    }
                  }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "56px 1fr auto",
                    gap: 20,
                    alignItems: "center",
                    padding: "22px 8px",
                    borderTop:
                      i === 0
                        ? "1px solid color-mix(in oklab, var(--paper) 16%, transparent)"
                        : "none",
                    borderBottom: "1px solid color-mix(in oklab, var(--paper) 16%, transparent)",
                    cursor: "pointer",
                    transition: "padding-left .35s var(--ease), background .25s var(--ease)",
                    paddingLeft: on ? 24 : 8,
                    background: on
                      ? "color-mix(in oklab, var(--paper) 5%, transparent)"
                      : "transparent",
                    position: "relative",
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: on ? 12 : 0,
                      height: on ? 12 : 0,
                      borderRadius: 999,
                      background: "var(--accent)",
                      transition: "width .3s var(--ease), height .3s var(--ease)",
                    }}
                  />
                  <div
                    className="serif"
                    style={{
                      fontSize: 42,
                      lineHeight: 1,
                      color: on
                        ? "var(--accent)"
                        : "color-mix(in oklab, var(--paper) 35%, transparent)",
                      transition: "color .3s var(--ease)",
                      fontStyle: "italic",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 19,
                        color: "var(--paper)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {br.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontStyle: "italic",
                        color: "color-mix(in oklab, var(--paper) 60%, transparent)",
                        fontSize: 15,
                        marginTop: 2,
                      }}
                    >
                      {br.hi}
                    </div>
                  </div>
                  <div className="row" style={{ gap: 8, alignItems: "center" }}>
                    {br.tag && (
                      <span
                        className="pill pill-accent"
                        style={{ fontSize: 9, padding: "3px 8px" }}
                      >
                        {br.tag}
                      </span>
                    )}
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "color-mix(in oklab, var(--paper) 55%, transparent)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      BTEUP {br.code}
                    </span>
                    <span
                      style={{
                        color: on ? "var(--accent)" : "transparent",
                        transition: "color .3s var(--ease), transform .3s var(--ease)",
                        transform: on ? "translateX(0)" : "translateX(-6px)",
                      }}
                    >
                      <ArrowIcon size={16} />
                    </span>
                  </div>
                </div>
              );
            })}
            {list.length === 0 && (
              <div
                style={{
                  padding: 32,
                  border: "1px dashed color-mix(in oklab, var(--paper) 20%, transparent)",
                  borderRadius: 14,
                  textAlign: "center",
                  color: "color-mix(in oklab, var(--paper) 70%, transparent)",
                }}
              >
                No branches in this filter.
              </div>
            )}
          </div>

          {/* Right: featured panel */}
          <div style={{ position: "sticky", top: 100, alignSelf: "flex-start", height: "fit-content" }}>
            {b && (
              <div
                key={b.code}
                className="page-enter"
                style={{
                  background: "var(--paper)",
                  color: "var(--ink)",
                  borderRadius: 24,
                  padding: 32,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: -60,
                    top: -60,
                    width: 220,
                    height: 220,
                    borderRadius: "50%",
                    background: "color-mix(in oklab, var(--brand) 18%, transparent)",
                    pointerEvents: "none",
                  }}
                />

                <div className="between" style={{ position: "relative" }}>
                  <span
                    className="pill"
                    style={{ background: "var(--ink)", color: "var(--paper)" }}
                  >
                    BTEUP {b.code}
                  </span>
                  <div className="row" style={{ gap: 6 }}>
                    {b.tag && (
                      <span className="pill pill-accent">{b.tag}</span>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    position: "relative",
                    marginTop: 20,
                    borderRadius: 16,
                    overflow: "hidden",
                  }}
                >
                  <Img
                    src={BIPE_IMG.byCode[b.code] || BIPE_IMG.byCode.default}
                    label={`BTEUP ${b.code}`}
                    aspectRatio="16/9"
                    style={{ borderRadius: 16 }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: 14,
                      top: 14,
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: "var(--brand)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 6px 18px -4px rgba(10,26,63,0.3)",
                    }}
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <path
                        d={BRANCH_ICONS[b.code] || "M3 12h18"}
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <h3 className="bipe-h2" style={{ marginTop: 20, position: "relative" }}>
                  {b.name}
                </h3>
                <div
                  className="serif"
                  style={{ fontSize: 24, color: "var(--ink-3)", marginTop: 4, fontStyle: "italic" }}
                >
                  {b.hi}
                </div>

                <p
                  style={{
                    color: "var(--ink-2)",
                    fontSize: 15,
                    marginTop: 18,
                    lineHeight: 1.65,
                    position: "relative",
                  }}
                >
                  {b.desc}
                </p>

                <div
                  className="bipe-grid-3"
                  style={{
                    marginTop: 24,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 0,
                    border: "1px solid var(--line)",
                    borderRadius: 12,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {(
                    [
                      ["Duration", "3 YR · 6 SEM"],
                      ["Seats", `${b.seats}`],
                      ["Fee/yr", `₹${b.fee}`],
                    ] as [string, string][]
                  ).map(([k, v], j) => (
                    <div
                      key={k}
                      style={{
                        padding: "14px 16px",
                        borderRight: j < 2 ? "1px solid var(--line)" : "none",
                        background: "var(--white)",
                      }}
                    >
                      <div className="eyebrow" style={{ fontSize: 10 }}>
                        {k}
                      </div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          marginTop: 4,
                          color: "var(--ink)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {v}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="row" style={{ marginTop: 24, gap: 8, position: "relative" }}>
                  <Link href="/apply" className="btn btn-primary">
                    Apply for this branch <ArrowIcon />
                  </Link>
                  <a
                    href={`mailto:${DATA.contact.email}?subject=Syllabus%20request%20-%20${encodeURIComponent(
                      b.name
                    )}%20(BTEUP%20${b.code})&body=Hello%20BIPE%2C%0A%0AI%20would%20like%20a%20copy%20of%20the%20syllabus%20for%20${encodeURIComponent(
                      b.name
                    )}%20(BTEUP%20${b.code}).%0A%0AThanks.`}
                    className="btn btn-ghost btn-sm"
                  >
                    Get syllabus
                  </a>
                </div>
              </div>
            )}

            <div
              style={{
                marginTop: 14,
                padding: "16px 22px",
                borderRadius: 14,
                border: "1px dashed color-mix(in oklab, var(--paper) 30%, transparent)",
                color: "color-mix(in oklab, var(--paper) 80%, transparent)",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  fontWeight: 700,
                }}
              >
                Same campus · Same mentors
              </span>
              <div style={{ marginTop: 6 }}>
                All five branches share the same Phoolpur campus, library and faculty mentorship structure — the BTEUP diploma you graduate with is identical, regardless of branch.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
