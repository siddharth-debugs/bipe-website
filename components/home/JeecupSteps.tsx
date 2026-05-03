import React from "react";
import Link from "next/link";
import { DATA } from "@/lib/data";
import { ArrowIcon } from "@/components/shell/Icons";

export const JeecupSteps = () => (
  <section className="section">
    <div className="container">
      <div className="between" style={{ marginBottom: 36, alignItems: "end", flexWrap: "wrap", gap: 24 }}>
        <div className="reveal">
          <div className="eyebrow">JEECUP · Step by Step</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "18ch" }}>From application to <span className="serif">first day of class.</span></h2>
        </div>
        <Link href="/jeecup" className="btn btn-ghost">Full guide <ArrowIcon /></Link>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden", background: "var(--white)" }}>
        {DATA.jeecupSteps.map((s, i) => (
          <div key={i} className="reveal"
            style={{ padding: 28, borderRight: (i + 1) % 3 ? "1px solid var(--line)" : "none", borderBottom: i < 3 ? "1px solid var(--line)" : "none", transitionDelay: `${i * 50}ms` }}>
            <div className="serif" style={{ fontSize: 64, lineHeight: 1, color: "var(--brand)", opacity: 0.5 }}>{s.step}</div>
            <h3 className="bipe-h3" style={{ marginTop: 8 }}>{s.title}</h3>
            <p style={{ color: "var(--ink-2)", fontSize: 14, marginTop: 10, lineHeight: 1.55 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
