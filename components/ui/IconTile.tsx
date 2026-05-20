import React, { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";

export type IconTileTone = "brand" | "accent" | "ink";

export interface IconTileProps {
  /** Lucide-react icon component (or any component matching that signature). */
  icon: LucideIcon;
  /** Optional caption shown bottom-left, mirrors the <Img> label idiom. */
  label?: string;
  /** Tone scheme for background + icon colour. Defaults to "brand". */
  tone?: IconTileTone;
  /** CSS aspect-ratio (e.g. "4/3"). Honors style.height too. */
  aspectRatio?: string;
  /** Pixel size of the icon glyph itself. Default 64. */
  iconSize?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Illustration tile used in place of a photo when we don't have real
 * BIPE photography for the slot.
 *
 * Design rationale: site authenticity rule — real campus photos
 * everywhere they exist, never stock pretending to be BIPE. For the
 * dozen-ish slots where no campus photo is available yet (e.g.
 * /campus sustainability tiles, /documents reporting-day tiles,
 * /scholarships award-day tile), this component renders a designed
 * placeholder using a Lucide icon over a brand-tinted background +
 * subtle diagonal pattern.
 *
 * The visual style intentionally looks like an illustration, NOT a
 * photo — readers should never mistake an IconTile for a real
 * scene. That's the trade-off: lose the "photo" affordance, gain
 * honesty.
 *
 * API mirrors <Img> for drop-in replacement at call sites:
 *   <Img src={BIPE_IMG.scholarship} label="Award day" style={{...}} />
 *   →
 *   <IconTile icon={Award} label="Award day" tone="accent" style={{...}} />
 */
export function IconTile({
  icon: Icon,
  label,
  tone = "brand",
  aspectRatio,
  iconSize = 64,
  className,
  style,
}: IconTileProps) {
  const tones: Record<IconTileTone, { bg: string; pattern: string; iconColor: string }> = {
    brand: {
      bg: "color-mix(in oklab, var(--brand) 8%, var(--white))",
      pattern: "color-mix(in oklab, var(--brand) 18%, transparent)",
      iconColor: "var(--brand)",
    },
    accent: {
      bg: "color-mix(in oklab, var(--accent) 14%, var(--white))",
      pattern: "color-mix(in oklab, var(--accent) 28%, transparent)",
      iconColor: "var(--accent-deep, var(--accent))",
    },
    ink: {
      bg: "var(--paper-2)",
      pattern: "color-mix(in oklab, var(--ink) 10%, transparent)",
      iconColor: "var(--ink-2)",
    },
  };
  const t = tones[tone];

  const wrapStyle: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    borderRadius: 14,
    background: t.bg,
    aspectRatio,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...style,
  };

  return (
    <div className={className} style={wrapStyle}>
      {/* Subtle diagonal stripe — gives the tile a tactile feel
          without competing with the icon. ~6% opacity so it reads
          as texture, not pattern. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `repeating-linear-gradient(135deg, transparent 0px, transparent 14px, ${t.pattern} 14px, ${t.pattern} 15px)`,
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
      <Icon
        size={iconSize}
        strokeWidth={1.4}
        aria-hidden="true"
        style={{ color: t.iconColor, position: "relative", zIndex: 1 }}
      />
      {label && (
        <div
          style={{
            position: "absolute",
            left: 12,
            bottom: 12,
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#fff",
            background: "rgba(10,26,63,0.7)",
            backdropFilter: "blur(6px)",
            padding: "4px 8px",
            borderRadius: 6,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
