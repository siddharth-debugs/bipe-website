"use client";

import React from "react";
import { DATA } from "@/lib/data";
import { Counter } from "@/components/ui/Counter";

export const StatsBar = () => (
  <section className="section-tight">
    <div className="container">
      <div className="reveal bipe-stats" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden", background: "var(--white)" }}>
        {DATA.stats.map((s, i) => (
          <div key={i} style={{ padding: "28px 24px", borderRight: i < 4 ? "1px solid var(--line)" : "none" }}>
            <div className="serif" style={{ fontSize: 54, lineHeight: 1, color: "var(--brand)" }}>
              {s.num.match(/^\d/) ? <Counter to={s.num.replace(/[^\d,]/g, "")} /> : s.num}
              {s.num.includes("+") ? <span>+</span> : null}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 10 }}>{s.label}</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
