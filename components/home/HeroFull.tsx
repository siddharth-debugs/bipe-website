import React from "react";
import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { ArrowIcon } from "@/components/shell/Icons";
import { BIPE_IMG } from "@/lib/images";
import { DATA } from "@/lib/data";

export const HeroFull = () => (
  <section style={{ position: "relative", overflow: "hidden", background: "#000" }}>
    <Img src={BIPE_IMG.heroWide} label="" style={{ position: "absolute", inset: 0, borderRadius: 0 }} />

    <div aria-hidden="true" style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 24%, rgba(0,0,0,0.4) 58%, rgba(0,0,0,0.88) 90%, rgba(0,0,0,0.96) 100%)",
      pointerEvents: "none"
    }} />
    <div aria-hidden="true" style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 22%, transparent 45%)",
      pointerEvents: "none"
    }} />

    <div className="container" style={{ position: "relative", padding: "72px 0 48px", color: "var(--paper)", zIndex: 2 }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 48, alignItems: "end" }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-display, var(--font-sans))",
            fontSize: "clamp(48px, 8vw, 132px)",
            lineHeight: 0.95,
            letterSpacing: "-0.035em",
            fontWeight: 600,
            color: "var(--paper)",
            marginBottom: 24,
            textShadow: "0 2px 30px rgba(0,0,0,0.4)"
          }}>
            Engineers
            <br />
            <span className="serif" style={{ fontStyle: "italic", fontWeight: 400, color: "var(--accent)", letterSpacing: "-0.02em" }}>begin</span>
            <span style={{ fontStyle: "italic", fontFamily: "var(--font-serif)", fontWeight: 300, color: "color-mix(in oklab, #fff 85%, transparent)" }}> here.</span>
          </h1>

          <p style={{
            fontSize: "clamp(15px, 1.2vw, 18px)",
            lineHeight: 1.55,
            color: "color-mix(in oklab, #fff 85%, transparent)",
            maxWidth: "54ch",
            marginBottom: 28
          }}>
            AICTE-approved diplomas across 10 branches.<br />
            Mentor 1:20 · Tuition from ₹30,150/yr · 1,000+ placed.
          </p>

          <div className="row" style={{ gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/apply" className="btn btn-lg"
              style={{ background: "var(--accent)", color: "var(--ink)", border: "none", fontWeight: 600 }}>
              Apply for 2026-27 <ArrowIcon size={16} />
            </Link>
            <Link href="/visit" className="btn btn-lg"
              style={{ background: "rgba(255,255,255,0.08)", color: "var(--paper)", border: "1px solid color-mix(in oklab, #fff 35%, transparent)", backdropFilter: "blur(10px)" }}>
              Book a campus visit
            </Link>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-end", paddingBottom: 6 }}>
          {[
            { num: "12+", lbl: "Years" },
            { num: "1,000+", lbl: "Placed" },
            { num: "₹30K", lbl: "From / yr" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "right", borderRight: "2px solid var(--accent)", paddingRight: 16 }}>
              <div className="serif" style={{ fontStyle: "italic", fontSize: "clamp(30px, 3.4vw, 48px)", lineHeight: 0.9, color: "var(--paper)", letterSpacing: "-0.02em" }}>
                {s.num}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "color-mix(in oklab, #fff 65%, transparent)", marginTop: 4 }}>
                {s.lbl}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: 36,
        paddingTop: 18,
        borderTop: "1px solid color-mix(in oklab, #fff 18%, transparent)",
        overflow: "hidden"
      }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "color-mix(in oklab, #fff 55%, transparent)", flexShrink: 0 }}>
            Alumni at →
          </span>
          <div className="row" style={{ gap: 30, fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 16, color: "color-mix(in oklab, #fff 80%, transparent)", overflow: "hidden", flex: 1, justifyContent: "flex-end", whiteSpace: "nowrap" }}>
            {DATA.recruiters.slice(0, 6).map((r, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
                {r}
                {i < 5 && <span style={{ color: "var(--accent)", fontFamily: "var(--font-sans)", fontStyle: "normal", fontSize: 6 }}>●</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
