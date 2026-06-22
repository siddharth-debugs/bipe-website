"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowIcon } from "@/components/shell/Icons";

const cell = (n: number, l: string) => (
  <div style={{ textAlign: "center", padding: "18px 8px", background: "var(--white)", border: "1px solid var(--line)", borderRadius: 14, minWidth: 84 }}>
    <div className="serif" style={{ fontSize: 48, lineHeight: 1, color: "var(--brand)" }} suppressHydrationWarning>{String(n).padStart(2, "0")}</div>
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", marginTop: 6, color: "var(--ink-3)", textTransform: "uppercase" }}>{l}</div>
  </div>
);

export const Countdown = () => {
  const target = useMemo(() => new Date("2026-08-01T00:00:00").getTime(), []);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return (
    <section className="section">
      <div className="container">
        <div className="reveal bipe-split bipe-pad-box" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 40, alignItems: "center", border: "1px solid var(--line)", background: "var(--brand-tint)", borderRadius: 24, padding: 40 }}>
          <div>
            <div className="row" style={{ alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span className="live-dot" />
              <span className="eyebrow" style={{ color: "var(--brand)" }}>Counselling Live</span>
            </div>
            <h2 className="bipe-h2">Classes begin <span className="serif">1 August, 2026.</span></h2>
            <p className="lead" style={{ marginTop: 14 }}>JEECUP 2026 counselling is on — Round 1 choice-filling 25–30 June, classes begin 1 August. Seat allotment is rank-based, so reserve your branch early and add code 4455 in your choice list.</p>
            <div className="row" style={{ marginTop: 22, flexWrap: "wrap" }}>
              <Link href="/apply" className="btn btn-primary">Apply now <ArrowIcon /></Link>
              <Link href="/jeecup" className="btn btn-ghost">JEECUP guide</Link>
            </div>
          </div>
          <div className="row" style={{ justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
            {cell(d, "days")}
            {cell(h, "hours")}
            {cell(m, "min")}
            {cell(s, "sec")}
          </div>
        </div>
      </div>
    </section>
  );
};
