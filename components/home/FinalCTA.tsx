import React from "react";
import Link from "next/link";
import { DATA } from "@/lib/data";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";

export const FinalCTA = () => (
  <section className="section" style={{ paddingTop: 48 }}>
    <div className="container">
      <div style={{
        position: "relative",
        background: "var(--ink)",
        color: "var(--paper)",
        borderRadius: 28,
        overflow: "hidden",
        minHeight: 520,
      }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)", backgroundSize: "72px 72px", pointerEvents: "none" }} />
        <div aria-hidden="true" style={{ position: "absolute", left: -160, bottom: -160, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, color-mix(in oklab, var(--brand) 55%, transparent), transparent 70%)", pointerEvents: "none" }} />
        <div aria-hidden="true" style={{ position: "absolute", right: -120, top: -120, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, color-mix(in oklab, var(--accent) 45%, transparent), transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", padding: "22px 40px", borderBottom: "1px solid color-mix(in oklab, var(--paper) 12%, transparent)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div className="row" style={{ gap: 14, alignItems: "center" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 0 4px color-mix(in oklab, var(--accent) 25%, transparent)", animation: "pulse 2s infinite" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 75%, transparent)" }}>
              Admissions Open · Session 2026-27
            </span>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", color: "color-mix(in oklab, var(--paper) 55%, transparent)" }}>
            BIPE / FINAL · 16
          </div>
        </div>

        <div className="bipe-split" style={{ position: "relative", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 0, minHeight: 420 }}>
          <div style={{ padding: "64px 56px 56px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)" }}>One last step</div>
              <h2 style={{
                fontSize: "clamp(48px, 5.4vw, 84px)",
                lineHeight: 0.96,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                marginTop: 22,
                color: "var(--paper)",
              }}>
                Three years<br />
                <span className="serif" style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>change</span> a career.
              </h2>
              <p style={{
                marginTop: 24,
                fontSize: 18,
                lineHeight: 1.55,
                color: "color-mix(in oklab, var(--paper) 72%, transparent)",
                maxWidth: "42ch",
              }}>
                Pick the path that fits you. Apply, talk, or visit — we&apos;ll meet you wherever you are in the decision.
              </p>
            </div>

            {/* The headline stats (16 years / 1,331 / 5 branches) already
                live in the StatsBar right under the hero — repeating
                them here was filler. Show what happens AFTER the user
                presses Apply instead, so the CTA earns its space. */}
            <div className="row" style={{ marginTop: 48, gap: 24, flexWrap: "wrap", alignItems: "center" }}>
              {[
                { num: "24 hr",  l: "callback promise" },
                { num: "₹0",     l: "to apply" },
                { num: "1 : 20", l: "mentor ratio" },
                { num: "5 days", l: "to a decision" },
              ].map((s, i, arr) => (
                <React.Fragment key={s.l}>
                  <div>
                    <div style={{ fontFamily: "var(--font-display, var(--font-serif))", fontStyle: "italic", fontSize: 30, lineHeight: 1, color: "var(--paper)" }}>{s.num}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 55%, transparent)", marginTop: 4 }}>{s.l}</div>
                  </div>
                  {i < arr.length - 1 && <span style={{ width: 1, height: 36, background: "color-mix(in oklab, var(--paper) 14%, transparent)" }} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div style={{ padding: "64px 56px 56px", display: "flex", flexDirection: "column", gap: 14, justifyContent: "center", borderLeft: "1px solid color-mix(in oklab, var(--paper) 10%, transparent)", position: "relative" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "color-mix(in oklab, var(--paper) 55%, transparent)", marginBottom: 8 }}>Choose your path</div>

            <Link href="/apply"
              style={{
                display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                padding: "22px 24px", borderRadius: 14,
                background: "var(--paper)", color: "var(--ink)",
                textDecoration: "none",
                transition: "transform .25s var(--ease)",
              }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>01</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 17 }}>Apply for 2026-27</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>4-step form · 5 minutes</div>
              </div>
              <ArrowIcon size={18} />
            </Link>

            <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer"
              style={{
                display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                padding: "22px 24px", borderRadius: 14,
                background: "color-mix(in oklab, var(--paper) 8%, transparent)",
                border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
                color: "var(--paper)",
                textDecoration: "none",
                transition: "background .25s var(--ease)",
              }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "color-mix(in oklab, var(--paper) 55%, transparent)" }}>02</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 17 }}>Talk on WhatsApp</div>
                <div style={{ fontSize: 12, color: "color-mix(in oklab, var(--paper) 55%, transparent)", marginTop: 2 }}>Same-day reply · EN / हिं</div>
              </div>
              <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#25D366", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><WhatsAppIcon /></span>
            </a>

            <Link href="/visit"
              style={{
                display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center",
                padding: "22px 24px", borderRadius: 14,
                background: "color-mix(in oklab, var(--paper) 8%, transparent)",
                border: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)",
                color: "var(--paper)",
                textDecoration: "none",
                transition: "background .25s var(--ease)",
              }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "color-mix(in oklab, var(--paper) 55%, transparent)" }}>03</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 17 }}>Visit campus</div>
                <div style={{ fontSize: 12, color: "color-mix(in oklab, var(--paper) 55%, transparent)", marginTop: 2 }}>Free shuttle · Varanasi Cantt</div>
              </div>
              <ArrowIcon size={18} />
            </Link>

            <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid color-mix(in oklab, var(--paper) 10%, transparent)", fontSize: 12, color: "color-mix(in oklab, var(--paper) 55%, transparent)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Or call <a href={`tel:${DATA.contact.phone}`} style={{ color: "var(--paper)", textDecoration: "none", fontWeight: 600 }}>{DATA.contact.phone}</a></span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em" }}>MON–SAT · 9–6</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
