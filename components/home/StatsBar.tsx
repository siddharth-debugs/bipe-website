"use client";

import React from "react";
import { DATA } from "@/lib/data";
import { Counter } from "@/components/ui/Counter";

export const StatsBar = () => (
  <section className="section-tight">
    <div className="container">
      <div className="reveal bipe-stats" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden", background: "var(--white)" }}>
        {DATA.stats.map((s, i) => {
          // Only run the count-up animation on plain integer/comma values
          // (`1,000`, `120`). Anything with a colon, hyphen, slash etc.
          // (e.g. `1:20`) is rendered as-is so the original glyphs are
          // preserved and we don't accidentally print `120`.
          const isPlainNumber = /^\d[\d,]*\+?$/.test(s.num);
          return (
          <div key={i} style={{ padding: "28px 24px", borderRight: i < 4 ? "1px solid var(--line)" : "none" }}>
            <div className="serif" style={{ fontSize: 54, lineHeight: 1, color: "var(--brand)" }}>
              {isPlainNumber ? (
                <>
                  <Counter to={s.num.replace(/[^\d,]/g, "")} />
                  {s.num.includes("+") ? <span>+</span> : null}
                </>
              ) : (
                s.num
              )}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 10 }}>{s.label}</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{s.sub}</div>
          </div>
          );
        })}
      </div>
    </div>
  </section>
);
