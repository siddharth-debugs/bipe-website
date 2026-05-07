import React from "react";
import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { ArrowIcon } from "@/components/shell/Icons";
import { BIPE_IMG } from "@/lib/images";

/**
 * Trust strip shown at the foot of the hero. The numeric stats live in
 * the StatsBar section right below this — surfacing them here too is
 * just visual noise. Regulator/credential signals fill the slot
 * instead: AICTE / BTEUP / JEECUP / ISO are unique to this strip.
 */
const HERO_TRUST: { label: string; sub: string }[] = [
  { label: "AICTE-approved",       sub: "ID 1-488233171" },
  { label: "BTEUP-affiliated",     sub: "5 branches · code 4455" },
  { label: "JEECUP code 4455",     sub: "single counselling route" },
  { label: "ISO 9001:2015",        sub: "quality-certified" },
];

export const HeroFull = () => (
  <section style={{ position: "relative", overflow: "hidden", background: "#000" }}>
    <Img src={BIPE_IMG.heroWide} label="" priority style={{ position: "absolute", inset: 0, borderRadius: 0 }} />

    {/* Lighter dark wash — the campus photo has the BIPE building
        signage in it; we want that readable, not muddy. The bottom and
        side gradients give the headline its contrast. */}
    <div aria-hidden="true" style={{
      position: "absolute", inset: 0,
      background: "rgba(0, 0, 0, 0.42)",
      pointerEvents: "none"
    }} />
    <div aria-hidden="true" style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 100%)",
      pointerEvents: "none"
    }} />
    <div aria-hidden="true" style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.7) 100%)",
      pointerEvents: "none"
    }} />

    <div className="container bipe-hero-pad" style={{ position: "relative", padding: "72px 0 48px", color: "var(--paper)", zIndex: 2 }}>
      <div>
        <h1 className="bipe-hero-h1" style={{
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
          AICTE-approved diploma courses across 5 branches.<br />
          Mentor 1:20 · 1,000+ placed · Eastern UP since 2010.
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

      {/* Trust / credentials strip — replaces the recruiter-name strip
          that used to live here (recruiters already show in the
          Recruiters marquee right below the hero, so it was repetitive).
          Each item is a regulatory signal unique to this slot. */}
      <div className="bipe-hero-trust" style={{
        marginTop: 44,
        paddingTop: 20,
        borderTop: "1px solid color-mix(in oklab, #fff 18%, transparent)",
      }}>
        <div className="row" style={{ alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "color-mix(in oklab, #fff 55%, transparent)", flexShrink: 0 }}>
            Approvals
          </span>
          <div className="bipe-hero-trust-list" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 20,
            flex: 1,
          }}>
            {HERO_TRUST.map((t) => (
              <div key={t.label} style={{
                paddingLeft: 14,
                borderLeft: "2px solid var(--accent)",
              }}>
                <div style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: "color-mix(in oklab, #fff 92%, transparent)",
                  letterSpacing: "-0.005em",
                }}>
                  {t.label}
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "color-mix(in oklab, #fff 55%, transparent)",
                  marginTop: 3,
                }}>
                  {t.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
