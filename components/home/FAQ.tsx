"use client";

import React, { useState } from "react";
import { DATA } from "@/lib/data";
import { WhatsAppIcon } from "@/components/shell/Icons";

export const FAQ = () => {
  const all = DATA.faq;
  const cats = ["All", ...Array.from(new Set(all.map(f => f.cat)))];
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(0);
  const [query, setQuery] = useState("");
  const filtered = all
    .map((f, i) => ({ ...f, _i: i }))
    .filter(f => filter === "All" || f.cat === filter)
    .filter(f => !query || (f.q + " " + f.a).toLowerCase().includes(query.toLowerCase()));

  const catCounts = cats.reduce<Record<string, number>>((acc, c) => {
    acc[c] = c === "All" ? all.length : all.filter(f => f.cat === c).length;
    return acc;
  }, {});

  return (
    <section className="section" style={{ position: "relative" }}>
      <div className="container">
        <div className="reveal bipe-split" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 48, alignItems: "end", marginBottom: 48, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}>
          <div>
            <div className="eyebrow">§ FAQ</div>
            <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "16ch" }}>
              Asked & <span className="serif" style={{ color: "var(--brand)" }}>answered.</span>
            </h2>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", color: "var(--ink-3)", textTransform: "uppercase", marginBottom: 8 }}>Can&apos;t find it?</div>
            <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer"
              className="row" style={{ gap: 10, alignItems: "center", textDecoration: "none", color: "var(--ink)", fontWeight: 600, fontSize: 16 }}>
              <span style={{ width: 32, height: 32, borderRadius: 8, background: "#25D366", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><WhatsAppIcon /></span>
              Ask on WhatsApp <span style={{ color: "var(--ink-3)", fontWeight: 400, fontSize: 14 }}>· same-day reply</span>
            </a>
          </div>
        </div>

        <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 48, alignItems: "start" }}>
          <aside className="reveal" style={{ position: "sticky", top: 90 }}>
            <div style={{ position: "relative", marginBottom: 24 }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)" }}>
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" /><path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search questions…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ width: "100%", padding: "12px 14px 12px 38px", border: "1px solid var(--line)", borderRadius: 10, fontSize: 14, background: "var(--white)", color: "var(--ink)", fontFamily: "inherit", outline: "none", transition: "border-color .2s" }}
              />
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", color: "var(--ink-3)", textTransform: "uppercase", marginBottom: 14 }}>Browse by topic</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {cats.map(c => {
                const isActive = filter === c;
                return (
                  <button key={c}
                    onClick={() => { setFilter(c); setOpen(-1); }}
                    style={{
                      textAlign: "left", padding: "12px 14px", borderRadius: 10, border: "none",
                      background: isActive ? "var(--ink)" : "transparent",
                      color: isActive ? "var(--paper)" : "var(--ink-2)",
                      fontWeight: isActive ? 600 : 500,
                      fontSize: 14, cursor: "pointer", transition: "all .2s var(--ease)",
                      display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "inherit",
                    }}>
                    <span>{c}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, opacity: isActive ? 0.7 : 0.5 }}>{String(catCounts[c]).padStart(2, "0")}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 32, padding: 20, borderRadius: 14, background: "var(--brand-tint)", border: "1px solid var(--line)" }}>
              <div style={{ fontFamily: "var(--font-display, var(--font-serif))", fontStyle: "italic", fontSize: 28, lineHeight: 1.05, color: "var(--brand)" }}>
                Still unsure?
              </div>
              <p style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 8, lineHeight: 1.5 }}>
                Visit the campus. Free shuttle from Varanasi Cantt — meet faculty, see labs, talk to current students.
              </p>
            </div>
          </aside>

          <div>
            {filtered.length === 0 ? (
              <div style={{ padding: "60px 0", textAlign: "center", color: "var(--ink-3)" }}>
                <div style={{ fontFamily: "var(--font-display, var(--font-serif))", fontStyle: "italic", fontSize: 32, color: "var(--ink-2)" }}>No matches.</div>
                <p style={{ marginTop: 8, fontSize: 14 }}>Try a different word, or <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand)" }}>ask us directly</a>.</p>
              </div>
            ) : filtered.map((f, i) => {
              const isOpen = open === f._i;
              return (
                // No .reveal here on purpose: the IntersectionObserver
                // only observes elements that exist on mount, so items
                // that get added when the user changes category would
                // otherwise stay at opacity 0 and the right column
                // would look empty.
                <div key={f._i}
                  style={{
                    borderTop: "1px solid var(--line)",
                    borderBottom: i === filtered.length - 1 ? "1px solid var(--line)" : "none",
                    background: isOpen ? "color-mix(in oklab, var(--brand-tint) 50%, transparent)" : "transparent",
                    // Use longhand transition props instead of the shorthand
                    // to avoid React's "removing transitionDelay while
                    // transition is set" warning when filter switches.
                    transitionProperty: "background",
                    transitionDuration: "0.25s",
                    transitionTimingFunction: "var(--ease)",
                    transitionDelay: "0s",
                    padding: "0 16px",
                    margin: "0 -16px",
                    borderRadius: isOpen ? 12 : 0,
                  }}>
                  <button onClick={() => setOpen(isOpen ? -1 : f._i)}
                    style={{
                      width: "100%", textAlign: "left", padding: "22px 0",
                      display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 20, alignItems: "center",
                      background: "transparent", border: "none", color: "var(--ink)",
                      fontWeight: 600, fontSize: 17, fontFamily: "inherit", cursor: "pointer",
                    }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", color: isOpen ? "var(--brand)" : "var(--ink-3)", minWidth: 32 }}>
                      {String(f._i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ lineHeight: 1.35 }}>{f.q}</span>
                    <span style={{
                      width: 32, height: 32, borderRadius: "50%",
                      border: `1px solid ${isOpen ? "var(--brand)" : "var(--line)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all .3s var(--ease)",
                      background: isOpen ? "var(--brand)" : "transparent",
                      color: isOpen ? "#fff" : "var(--ink-2)",
                    }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: "transform .3s var(--ease)", transform: isOpen ? "rotate(45deg)" : "none" }}>
                        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  <div style={{ maxHeight: isOpen ? 240 : 0, overflow: "hidden", transition: "max-height .35s var(--ease)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "52px 1fr", gap: 0, paddingBottom: 24 }}>
                      <div />
                      <div>
                        <p style={{ color: "var(--ink-2)", fontSize: 15, lineHeight: 1.65, maxWidth: "66ch" }}>{f.a}</p>
                        <div className="row" style={{ marginTop: 14, gap: 14 }}>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 999, background: "var(--brand-soft)", color: "var(--brand)" }}>{f.cat}</span>
                          <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "var(--ink-3)", textDecoration: "none" }}>
                            Need more detail? <span style={{ color: "var(--brand)", textDecoration: "underline", textUnderlineOffset: 3 }}>Ask on WhatsApp →</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
