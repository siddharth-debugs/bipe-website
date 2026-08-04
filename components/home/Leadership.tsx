import Link from "next/link";
import Image from "next/image";
import { ArrowIcon } from "@/components/shell/Icons";
import {
  CHAIRMAN,
  CHAIRMAN_QUOTE,
  DIRECTOR,
  DIRECTOR_QUOTE,
  DIRECTOR_TAGLINE,
} from "@/lib/leadership";

/**
 * Homepage leadership band — Chairman and Director, side by side.
 *
 * Added Aug 2026 with the appointment of Prof. (Dr.) S. P. Tewari as
 * Director. Before this the homepage carried NO leadership surface at
 * all, so the institution's trust anchors were invisible to a
 * first-time visitor.
 *
 * Two equal columns by owner direction (4 Aug 2026): the Chairman of
 * the founding trust and the Director carry the institution's
 * authority, and giving them matching cards reads as a leadership
 * pair rather than a hierarchy. The Principal is deliberately NOT on
 * the homepage — his message stays at /principal and is reachable
 * from the nav, footer and the Director page's own next-step block.
 *
 * All names, roles, portraits and quotes come from lib/leadership.ts
 * so this band can never drift from the individual leadership pages.
 */

const LEADERS = [
  {
    leader: DIRECTOR,
    quote: DIRECTOR_QUOTE.en,
    badge: "NEWLY APPOINTED · AUGUST 2026",
    strapline: DIRECTOR_TAGLINE,
    cta: "Read the Director’s message",
  },
  {
    leader: CHAIRMAN,
    quote: CHAIRMAN_QUOTE.en,
    badge: null,
    strapline: "Founder · Purwanchal Educational Trust",
    cta: "Read the Chairman’s message",
  },
];

export const Leadership = () => (
  <section className="section bipe-pad" style={{ paddingTop: 84, paddingBottom: 84, position: "relative", overflow: "hidden" }}>
    <div aria-hidden="true" style={{
      position: "absolute", inset: 0, opacity: 0.04,
      backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
      backgroundSize: "64px 64px", pointerEvents: "none",
    }} />

    <div className="container" style={{ position: "relative" }}>
      <div className="eyebrow" style={{ color: "var(--accent-deep)" }}>Leadership</div>
      <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "20ch" }}>
        The people who{" "}
        <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>answer for us.</span>
      </h2>

      <div
        className="reveal"
        style={{
          marginTop: 40,
          display: "grid",
          gap: 22,
          gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
          alignItems: "stretch",
        }}
      >
        {LEADERS.map(({ leader, quote, badge, strapline, cta }) => (
          <div
            key={leader.href}
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 30,
              borderRadius: 20,
              border: badge
                ? "1px solid color-mix(in oklab, var(--brand) 24%, transparent)"
                : "1px solid var(--line)",
              background: badge ? "var(--brand-tint)" : "var(--white)",
            }}
          >
            {/* Portrait, then identity beneath it.
                Stacked rather than side-by-side: at two-column widths a
                side-by-side header leaves ~150px for the name, which
                wraps "Prof. (Dr.) S. P. Tewari" onto three ragged
                lines. Full-width names read far better. */}
            <div style={{ position: "relative", width: 150, height: 150 }}>
              <div aria-hidden="true" style={{
                position: "absolute", inset: 0, transform: "translate(10px, 10px)",
                border: "1px solid var(--brand)", borderRadius: 16, pointerEvents: "none",
              }} />
              <div style={{
                position: "relative", width: "100%", height: "100%",
                overflow: "hidden", borderRadius: 16,
                border: "1px solid var(--line)", background: "var(--white)",
              }}>
                <Image
                  src={leader.photo}
                  alt={`${leader.name} — ${leader.role}`}
                  fill
                  sizes="150px"
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                />
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              {badge && (
                <span className="pill pill-accent" style={{ display: "inline-block", marginBottom: 12 }}>
                  {badge}
                </span>
              )}
              <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 30, lineHeight: 1.15, color: "var(--brand)" }}>
                {leader.name}
              </div>
              <div style={{ marginTop: 6, fontSize: 13.5, color: "var(--ink-3)", fontWeight: 600 }}>
                {leader.postNominal}
              </div>
              <div style={{
                marginTop: 8,
                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.13em",
                textTransform: "uppercase", color: "var(--ink-3)", lineHeight: 1.6,
              }}>
                {leader.role}
              </div>
              <div style={{ marginTop: 5, fontSize: 12.5, color: "var(--ink-3)" }}>
                {strapline}
              </div>
            </div>

            {/* Quote */}
            <p className="serif" style={{
              marginTop: 24, fontStyle: "italic", fontSize: 18.5, lineHeight: 1.6,
              color: "var(--ink-2)", flexGrow: 1,
            }}>
              &ldquo;{quote}&rdquo;
            </p>

            <Link
              href={leader.href}
              className={badge ? "btn btn-primary" : "btn btn-ghost"}
              style={{ marginTop: 22, alignSelf: "flex-start" }}
            >
              {cta} <ArrowIcon size={14} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);
