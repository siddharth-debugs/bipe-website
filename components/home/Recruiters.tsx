import React from "react";
import { DATA } from "@/lib/data";

export const Recruiters = () => (
  <section className="section-tight">
    <div className="container" style={{ marginBottom: 18 }}>
      <div className="eyebrow" style={{ textAlign: "center" }}>1,000+ alumni placed at</div>
    </div>
    <div className="marquee">
      <div className="marquee-track" style={{ animationDuration: "55s" }}>
        {[0, 1].flatMap((i) => DATA.recruiters.map((r, j) => (
          <span key={`${i}-${j}`} style={{ fontFamily: "var(--font-serif)", fontSize: 38, fontStyle: "italic", color: "var(--ink-3)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 48 }}>
            {r}
            <span style={{ color: "var(--accent)", fontFamily: "var(--font-sans)", fontStyle: "normal", fontSize: 8 }}>●</span>
          </span>
        )))}
      </div>
    </div>
  </section>
);
