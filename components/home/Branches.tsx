"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DATA } from "@/lib/data";
import { BIPE_IMG } from "@/lib/images";
import { CrossfadeSlider } from "@/components/ui/CrossfadeSlider";
import { ArrowIcon } from "@/components/shell/Icons";

const BRANCH_ICONS: Record<string, string> = {
  "355": "M4 5h16v10H4zM2 19h20M9 9l2 2 4-4",
  "327": "M8 3h8l1 4-1 14H8L7 7l1-4zM10 11h4",
  "322": "M3 21h18M5 21V11l7-6 7 6v10M9 21v-6h6v6",
  "328": "M11 2L4 14h6l-1 8 8-12h-6l1-8z",
  "343": "M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3M9 12a3 3 0 106 0 3 3 0 00-6 0z",
};

export const Branches = () => {
  const list = DATA.branches;
  const [active, setActive] = useState(0);
  const b = list[active];

  return (
    <section className="section" style={{ background: "var(--ink)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, opacity: 0.06,
        backgroundImage: "linear-gradient(color-mix(in oklab, var(--paper) 100%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--paper) 100%, transparent) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />
      <div aria-hidden="true" style={{ position: "absolute", right: -200, top: -100, width: 500, height: 500, borderRadius: "50%", background: "color-mix(in oklab, var(--brand) 70%, transparent)", filter: "blur(120px)", opacity: 0.5 }} />

      <div className="container" style={{ position: "relative" }}>
        <div className="between reveal" style={{ marginBottom: 40, alignItems: "end", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div className="eyebrow" style={{ color: "var(--accent)" }}>Programmes · 2026-27</div>
            <h2 className="bipe-h1" style={{ marginTop: 14, color: "var(--paper)", maxWidth: "22ch" }}>
              Pick a branch. <span className="serif" style={{ color: "var(--accent)" }}>Build a life.</span>
            </h2>
            <p className="lead" style={{ color: "color-mix(in oklab, var(--paper) 70%, transparent)", marginTop: 14, maxWidth: "50ch" }}>
              Five BTEUP-licensed diplomas. One mentor for every twenty students. Hover or tap to explore.
            </p>
          </div>
          <Link href="/courses" className="btn"
            style={{ color: "var(--paper)", border: "1px solid color-mix(in oklab, var(--paper) 25%, transparent)" }}>
            All 5 branches <ArrowIcon />
          </Link>
        </div>

        <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 32, alignItems: "stretch" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {list.map((br, i) => {
              const on = i === active;
              return (
                <div key={br.code}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  style={{
                    display: "grid", gridTemplateColumns: "56px 1fr auto", gap: 20, alignItems: "center",
                    padding: "22px 8px",
                    borderTop: i === 0 ? "1px solid color-mix(in oklab, var(--paper) 16%, transparent)" : "none",
                    borderBottom: "1px solid color-mix(in oklab, var(--paper) 16%, transparent)",
                    cursor: "pointer",
                    transition: "padding-left .35s var(--ease)",
                    paddingLeft: on ? 24 : 8,
                    position: "relative"
                  }}>
                  <div aria-hidden="true" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: on ? 12 : 0, height: on ? 12 : 0, borderRadius: 999, background: "var(--accent)", transition: "width .3s var(--ease), height .3s var(--ease)" }} />
                  <div className="serif" style={{ fontSize: 42, lineHeight: 1, color: on ? "var(--accent)" : "color-mix(in oklab, var(--paper) 35%, transparent)", transition: "color .3s var(--ease)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 20, color: "var(--paper)", letterSpacing: "-0.01em" }}>{br.name}</div>
                    <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "color-mix(in oklab, var(--paper) 60%, transparent)", fontSize: 16, marginTop: 2 }}>{br.hi}</div>
                  </div>
                  <div className="row" style={{ gap: 8, alignItems: "center" }}>
                    {br.tag && <span className="pill pill-accent" style={{ fontSize: 9, padding: "3px 8px" }}>{br.tag}</span>}
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "color-mix(in oklab, var(--paper) 55%, transparent)" }}>BTEUP {br.code}</span>
                    <span style={{ color: on ? "var(--accent)" : "transparent", transition: "color .3s var(--ease), transform .3s var(--ease)", transform: on ? "translateX(0)" : "translateX(-6px)" }}><ArrowIcon size={16} /></span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ position: "sticky", top: 100, alignSelf: "flex-start", height: "fit-content" }}>
            <div style={{
              background: "var(--paper)", color: "var(--ink)",
              borderRadius: 24, padding: 32, position: "relative", overflow: "hidden"
            }}>
              <div aria-hidden="true" style={{ position: "absolute", right: -60, top: -60, width: 200, height: 200, borderRadius: "50%", background: "color-mix(in oklab, var(--brand) 18%, transparent)" }} />

              <div className="between" style={{ position: "relative" }}>
                <span className="pill" style={{ background: "var(--ink)", color: "var(--paper)" }}>BTEUP {b.code}</span>
                {b.tag && <span className="pill pill-accent">{b.tag}</span>}
              </div>

              {/* Slider sits OUTSIDE the keyed branch-text block so it
                  doesn't remount on branch switch — autoplay keeps running. */}
              <div style={{ position: "relative", marginTop: 20 }}>
                <CrossfadeSlider
                  images={[
                    { src: BIPE_IMG.workshop, alt: "Workshop / machining bay" },
                    { src: BIPE_IMG.computerLab, alt: "120-computer lab" },
                    { src: BIPE_IMG.dairy, alt: "Dairy pilot plant" },
                  ]}
                  aspectRatio="16/9"
                  radius={16}
                  interval={4000}
                  fadeMs={900}
                />
              </div>

              <div key={b.code} className="page-enter">
                <h3 className="bipe-h2" style={{ marginTop: 20, position: "relative" }}>{b.name}</h3>
                <div className="serif" style={{ fontSize: 24, color: "var(--ink-3)", marginTop: 4 }}>{b.hi}</div>

              <p style={{ color: "var(--ink-2)", fontSize: 15, marginTop: 18, lineHeight: 1.6, position: "relative" }}>{b.desc}</p>

              <div className="bipe-form-row" style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 0, border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", position: "relative" }}>
                {([
                  ["Duration", "3 YR · 6 SEM"],
                  ["Seats", `${b.seats}`],
                ] as [string, string][]).map(([k, v], j) => (
                  <div key={k} style={{ padding: "14px 16px", borderRight: j < 1 ? "1px solid var(--line)" : "none", background: "var(--white)" }}>
                    <div className="eyebrow" style={{ fontSize: 10 }}>{k}</div>
                    <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4, color: "var(--ink)", fontFamily: "var(--font-mono)" }}>{v}</div>
                  </div>
                ))}
              </div>

              <div className="row" style={{ marginTop: 24, gap: 8, position: "relative" }}>
                <Link href="/apply" className="btn btn-primary">Apply for this <ArrowIcon /></Link>
                <Link href="/courses" className="btn btn-ghost">Syllabus</Link>
              </div>
              </div>
            </div>

            <Link href="/approvals" style={{ display: "block", marginTop: 14, padding: "18px 22px", borderRadius: 14, border: "1px dashed color-mix(in oklab, var(--paper) 30%, transparent)", color: "var(--paper)", textDecoration: "none" }}>
              <div className="between">
                <div>
                  <div className="eyebrow" style={{ color: "var(--accent)" }}>480 sanctioned seats · 2026-27</div>
                  <div style={{ fontSize: 14, marginTop: 4, color: "color-mix(in oklab, var(--paper) 80%, transparent)" }}>AICTE-approved · BTEUP-affiliated · JEECUP code 4455</div>
                </div>
                <ArrowIcon />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
