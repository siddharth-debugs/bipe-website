import React from "react";
import Link from "next/link";
import { DATA } from "@/lib/data";
import { ArrowIcon } from "@/components/shell/Icons";

export const News = () => (
  <section className="section">
    <div className="container">
      <div className="between" style={{ marginBottom: 36, alignItems: "end", flexWrap: "wrap", gap: 24 }}>
        <div className="reveal">
          <div className="eyebrow">News & Events</div>
          <h2 className="bipe-h1" style={{ marginTop: 14 }}>What&apos;s <span className="serif">happening</span> on campus.</h2>
        </div>
        <Link href="/events" className="btn btn-ghost">All events <ArrowIcon /></Link>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "1.2fr 1fr 1fr" }}>
        {DATA.events.slice(0, 3).map((e, i) => (
          <div key={i} className="card reveal" style={{ padding: i === 0 ? 28 : 22, gridRow: i === 0 ? "span 1" : "auto", transitionDelay: `${i * 50}ms` }}>
            <div className="row" style={{ gap: 10, marginBottom: 14 }}>
              <span className="pill">{e.tag}</span>
              <span className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{e.date}</span>
            </div>
            <h3 className={i === 0 ? "bipe-h2" : "bipe-h3"}>{e.title}</h3>
            <p style={{ color: "var(--ink-2)", fontSize: 14, marginTop: 12, lineHeight: 1.55 }}>{e.body}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {DATA.events.slice(3).map((e, i) => (
          <div key={i} className="card reveal" style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14 }}>
            <div>
              <div className="row" style={{ gap: 10, marginBottom: 6 }}>
                <span className="pill" style={{ fontSize: 10 }}>{e.tag}</span>
                <span className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>{e.date}</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{e.title}</div>
            </div>
            <ArrowIcon />
          </div>
        ))}
      </div>
    </div>
  </section>
);
