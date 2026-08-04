import Link from "next/link";
import Image from "next/image";
import { ArrowIcon } from "@/components/shell/Icons";
import { DIRECTOR, DIRECTOR_TAGLINE } from "@/lib/leadership";

/**
 * Homepage announcement band — Prof. (Dr.) S. P. Tewari's appointment
 * as Director (owner request, 4 Aug 2026: "put this as prominent news").
 *
 * Sits directly under the JEECUP admissions banner, i.e. the first
 * thing after the hero and the live counselling strip. The appointment
 * is already the featured card in <News />, but that section renders
 * near the foot of a long homepage — a visitor deciding between
 * polytechnics during Round 5 would rarely scroll that far.
 *
 * Deliberately styled UNLIKE the JEECUP banner immediately above it:
 * that one is full-bleed --ink (dark) and carries the admissions CTA,
 * so this one is a light brand-tint band with an accent rule. Two dark
 * strips stacked would read as one heavy block and blunt both.
 *
 * This is an announcement, not an evergreen section — retire it once
 * the appointment stops being news (roughly a month), leaving the
 * Leadership band and /director to carry it permanently.
 */
export const DirectorAnnouncement = () => (
  <aside
    aria-label="Institute announcement"
    style={{
      background: "var(--brand-tint)",
      borderTop: "3px solid var(--accent)",
      borderBottom: "1px solid var(--line)",
    }}
  >
    <div
      className="container"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        flexWrap: "wrap",
        padding: "18px 16px",
      }}
    >
      {/* Portrait */}
      <div style={{
        position: "relative", width: 62, height: 62, flexShrink: 0,
        borderRadius: "50%", overflow: "hidden",
        border: "2px solid var(--white)",
        boxShadow: "0 2px 10px color-mix(in oklab, var(--ink) 14%, transparent)",
      }}>
        <Image
          src={DIRECTOR.photo}
          alt={`${DIRECTOR.name} — Director, BIPE`}
          fill
          sizes="62px"
          style={{ objectFit: "cover", objectPosition: "center 18%" }}
        />
      </div>

      {/* Copy */}
      <div style={{ flex: "1 1 320px", minWidth: 0 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em",
          textTransform: "uppercase", color: "var(--accent-deep)", fontWeight: 700,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%", background: "var(--accent)",
            boxShadow: "0 0 0 3px color-mix(in oklab, var(--accent) 24%, transparent)",
          }} />
          News · August 2026
        </div>
        <div style={{ marginTop: 6, fontWeight: 700, fontSize: 17.5, lineHeight: 1.35, letterSpacing: "-0.01em" }}>
          {DIRECTOR.name} joins BIPE as{" "}
          <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>Director.</span>
        </div>
        <div style={{ marginTop: 4, fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.5 }}>
          {DIRECTOR_TAGLINE} · Ph.D. (Welding) · Fellow, Institution of Engineers (India)
        </div>
      </div>

      {/* CTA */}
      <Link
        href={DIRECTOR.href}
        className="btn btn-primary btn-sm"
        style={{ whiteSpace: "nowrap", flexShrink: 0 }}
      >
        Read his message <ArrowIcon size={13} />
      </Link>
    </div>
  </aside>
);
