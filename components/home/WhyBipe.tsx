"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DATA, type WhyItem } from "@/lib/data";
import { ArrowIcon } from "@/components/shell/Icons";

/**
 * `items` optional — home server page passes live items from the
 * home/why-bipe PageSection. Falls back to DATA.whyBipe.
 */
export const WhyBipe = ({ items: liveItems }: { items?: WhyItem[] } = {}) => {
  const [active, setActive] = useState(0);
  const items: WhyItem[] = liveItems && liveItems.length > 0 ? liveItems : DATA.whyBipe;
  const featured = items[0];
  const rest = items.slice(1);
  return (
    <section className="section" style={{ position: "relative" }}>
      <div className="container">
        <div className="reveal bipe-split" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 56, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
          <div>
            <div className="eyebrow">Why BIPE</div>
            <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "14ch" }}>
              We measure what students <span className="serif" style={{ color: "var(--brand)" }}>become</span>.
            </h2>
          </div>
          <p style={{ color: "var(--ink-2)", fontSize: 17, lineHeight: 1.55, maxWidth: "42ch", justifySelf: "end", textAlign: "right" }}>
            Not the largest polytechnic in UP — one of the most accountable. Four commitments we make to every family who trusts us.
          </p>
        </div>

        <div className="reveal bipe-pad-box" style={{ position: "relative", background: "var(--ink)", color: "var(--paper)", borderRadius: 24, padding: "56px 56px 48px", overflow: "hidden", marginBottom: 24 }}>
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)", backgroundSize: "56px 56px", pointerEvents: "none" }} />
          <div aria-hidden="true" style={{ position: "absolute", right: -120, top: -120, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, color-mix(in oklab, var(--brand) 60%, transparent), transparent 70%)", pointerEvents: "none" }} />

          <div className="bipe-split" style={{ position: "relative", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 48, alignItems: "center" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", color: "var(--accent)", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
              SIGNATURE COMMITMENT — 01 / 04
            </div>
            <div>
              <div className="row" style={{ gap: 24, alignItems: "baseline", marginBottom: 20 }}>
                <div style={{ fontFamily: "var(--font-display, var(--font-serif))", fontStyle: "italic", fontSize: 88, lineHeight: 0.9, color: "var(--accent)" }}>
                  {featured.metric}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 60%, transparent)" }}>
                  {featured.metricLabel}
                </div>
              </div>
              <h3 style={{ fontSize: 36, lineHeight: 1.1, fontWeight: 600, letterSpacing: "-0.02em", maxWidth: "22ch" }}>
                {featured.title}
              </h3>
              <p style={{ color: "color-mix(in oklab, var(--paper) 75%, transparent)", fontSize: 16, lineHeight: 1.6, marginTop: 18, maxWidth: "58ch" }}>
                {featured.body}
              </p>
              <div className="row" style={{ marginTop: 28, gap: 14 }}>
                <Link href="/faculty" className="btn" style={{ background: "var(--paper)", color: "var(--ink)" }}>Meet our mentors <ArrowIcon size={14} /></Link>
                <Link href="/about" className="btn btn-ghost" style={{ color: "var(--paper)", borderColor: "color-mix(in oklab, var(--paper) 30%, transparent)" }}>How mentoring works</Link>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 32, borderLeft: "1px solid color-mix(in oklab, var(--paper) 18%, transparent)" }}>
              {[
                { k: "Visits/sem", v: "2" },
                { k: "Faculty", v: "40" },
                { k: "Avg. cohort", v: "60" },
              ].map((s) => (
                <div key={s.k} style={{ padding: "12px 0" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", color: "color-mix(in oklab, var(--paper) 55%, transparent)" }}>{s.k}</div>
                  <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid bipe-grid-3" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 0, border: "1px solid var(--line)", borderRadius: 24, overflow: "hidden", background: "var(--white)" }}>
          {rest.map((w, i) => (
            <div key={i}
              className="reveal"
              onMouseEnter={() => setActive(i + 1)}
              style={{
                padding: "36px 32px 32px",
                borderRight: i < rest.length - 1 ? "1px solid var(--line)" : "none",
                transition: "background .25s var(--ease)",
                transitionDelay: `${i * 70}ms`,
                background: active === i + 1 ? "var(--brand-tint)" : "transparent",
                cursor: "default",
                position: "relative",
              }}>
              <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", color: "var(--ink-3)" }}>{w.num}</span>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--brand-soft)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d={w.icon} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
                <div style={{ fontFamily: "var(--font-display, var(--font-serif))", fontStyle: "italic", fontSize: 48, lineHeight: 0.9, color: "var(--brand)", letterSpacing: "-0.02em" }}>
                  {w.metric}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  {w.metricLabel}
                </div>
              </div>
              <h3 style={{ fontSize: 20, lineHeight: 1.25, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--ink)" }}>
                {w.title}
              </h3>
              <p style={{ color: "var(--ink-2)", fontSize: 14, marginTop: 12, lineHeight: 1.6 }}>{w.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
