import Link from "next/link";
import Image from "next/image";
import { ArrowIcon } from "@/components/shell/Icons";
import {
  CHAIRMAN,
  CHAIRMAN_QUOTE,
  DIRECTOR,
  DIRECTOR_QUOTE,
  DIRECTOR_TAGLINE,
  PRINCIPAL,
  PRINCIPAL_QUOTE,
} from "@/lib/leadership";

/**
 * Homepage leadership band — Chairman, Director, Principal.
 *
 * Added Aug 2026 with the appointment of Prof. (Dr.) S. P. Tewari as
 * Director. Before this the homepage carried NO leadership surface at
 * all, so the three trust anchors of the institution (the founding
 * trust chairman, the academic director and the principal) were
 * invisible to a first-time visitor.
 *
 * The Director card is deliberately given the visual lead — a full
 * flag row above the other two, an accent "newly appointed" badge and
 * the largest portrait — because an IIT (BHU) professor of 38 years
 * choosing a polytechnic is the single strongest credibility signal
 * BIPE has, and it is new information for every returning visitor.
 *
 * All names, roles and quotes come from lib/leadership.ts so this
 * component can never drift from the individual leadership pages.
 */

const CARD_STYLE: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  padding: 26,
  borderRadius: 18,
  border: "1px solid var(--line)",
  background: "var(--white)",
};

const ROLE_STYLE: React.CSSProperties = {
  marginTop: 6,
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--ink-3)",
};

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

      {/* ── Featured: the Director ─────────────────────────────── */}
      <div
        className="reveal"
        style={{
          marginTop: 40,
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: 34,
          alignItems: "center",
          padding: 30,
          borderRadius: 22,
          border: "1px solid color-mix(in oklab, var(--brand) 24%, transparent)",
          background: "var(--brand-tint)",
        }}
      >
        <div style={{ position: "relative", width: 172, height: 172, flexShrink: 0 }}>
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
              src={DIRECTOR.photo}
              alt={`${DIRECTOR.name} — Director, BIPE`}
              fill
              sizes="172px"
              style={{ objectFit: "cover", objectPosition: "center top" }}
            />
          </div>
        </div>

        <div style={{ minWidth: 0 }}>
          <span
            className="pill pill-accent"
            style={{ display: "inline-block" }}
          >
            NEWLY APPOINTED · AUGUST 2026
          </span>
          <div className="serif" style={{ marginTop: 14, fontStyle: "italic", fontWeight: 400, fontSize: 32, lineHeight: 1.15, color: "var(--brand)" }}>
            {DIRECTOR.name}
          </div>
          <div style={ROLE_STYLE}>
            {DIRECTOR.role} · {DIRECTOR_TAGLINE}
          </div>
          <p className="serif" style={{
            marginTop: 16, fontStyle: "italic", fontSize: 19, lineHeight: 1.55,
            color: "var(--ink-2)", maxWidth: "52ch",
          }}>
            &ldquo;{DIRECTOR_QUOTE.en}&rdquo;
          </p>
          <Link href={DIRECTOR.href} className="btn btn-primary" style={{ marginTop: 20 }}>
            Read the Director&rsquo;s message <ArrowIcon size={14} />
          </Link>
        </div>
      </div>

      {/* ── Chairman + Principal ───────────────────────────────── */}
      <div
        className="reveal"
        style={{
          marginTop: 20,
          display: "grid",
          gap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        {[
          { leader: CHAIRMAN, quote: CHAIRMAN_QUOTE.en, cta: "Read the Chairman’s message" },
          { leader: PRINCIPAL, quote: PRINCIPAL_QUOTE.en, cta: "Read the Principal’s message" },
        ].map(({ leader, quote, cta }) => (
          <div key={leader.href} style={CARD_STYLE}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{
                position: "relative", width: 84, height: 84, flexShrink: 0,
                overflow: "hidden", borderRadius: 14,
                border: "1px solid var(--line)", background: "var(--brand-tint)",
              }}>
                <Image
                  src={leader.photo}
                  alt={`${leader.name} — ${leader.role}`}
                  fill
                  sizes="84px"
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                />
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 24, lineHeight: 1.2, color: "var(--brand)" }}>
                  {leader.name}
                </div>
                <div style={{ marginTop: 4, fontSize: 12.5, color: "var(--ink-3)", fontWeight: 600 }}>
                  {leader.postNominal}
                </div>
                <div style={ROLE_STYLE}>{leader.role}</div>
              </div>
            </div>

            <p className="serif" style={{
              marginTop: 20, fontStyle: "italic", fontSize: 17, lineHeight: 1.6,
              color: "var(--ink-2)", flexGrow: 1,
            }}>
              &ldquo;{quote}&rdquo;
            </p>

            <Link
              href={leader.href}
              style={{
                marginTop: 18, display: "inline-flex", alignItems: "center", gap: 8,
                fontWeight: 600, fontSize: 14.5, color: "var(--brand)",
              }}
            >
              {cta} <ArrowIcon size={13} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);
