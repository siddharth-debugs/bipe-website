import React from "react";
import { DATA } from "@/lib/data";

export const Testimonials = () => (
  <section className="section" style={{ background: "var(--brand-tint)" }}>
    <div className="container">
      <div className="reveal" style={{ textAlign: "center", marginBottom: 40 }}>
        <div className="eyebrow">Voices · Students & Parents</div>
        <h2 className="bipe-h1" style={{ maxWidth: "22ch", margin: "14px auto 0" }}>What families say about <span className="serif">three years</span> at BIPE.</h2>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {DATA.testimonials.map((q, i) => (
          <div key={i} className="card reveal" style={{ padding: 24, transitionDelay: `${i * 40}ms` }}>
            <div className="serif" style={{ fontSize: 48, lineHeight: 0.7, color: "var(--brand)", opacity: 0.5 }}>&quot;</div>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--ink-2)", marginTop: 6 }}>{q.quote}</p>
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{q.name}</div>
              <div className="muted" style={{ fontSize: 12 }}>{q.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
