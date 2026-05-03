import React from "react";
import Image from "next/image";

/**
 * Person avatar that falls back to brand-tinted initials when no photo
 * is available. Used in faculty/staff cards.
 *
 * Pass a `photo` path (under /public) or empty string. The size prop is
 * the diameter in px; the rendered element is square.
 */
export interface AvatarProps {
  name: string;
  photo?: string;
  size?: number;
  alt?: string;
  /** Render shape — circle (default) or rounded square */
  shape?: "circle" | "square";
  className?: string;
  style?: React.CSSProperties;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Deterministic gradient pick from name (so the same person always gets
// the same avatar tint — feels less random across page loads).
function tintIndex(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return Math.abs(h) % 4;
}

const TINTS: Array<[string, string]> = [
  ["color-mix(in oklab, var(--brand) 80%, var(--accent))", "var(--brand-deep)"],
  ["color-mix(in oklab, var(--accent) 70%, var(--brand))", "color-mix(in oklab, var(--accent-deep) 80%, var(--ink))"],
  ["color-mix(in oklab, var(--brand) 60%, var(--ink))", "var(--ink)"],
  ["color-mix(in oklab, var(--accent) 60%, var(--ink))", "var(--brand-deep)"],
];

export function Avatar({
  name,
  photo,
  size = 56,
  alt,
  shape = "circle",
  className,
  style,
}: AvatarProps) {
  const radius = shape === "circle" ? "50%" : 14;
  const has = !!photo && photo.trim() !== "";
  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: radius,
    overflow: "hidden",
    flexShrink: 0,
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    ...style,
  };

  if (has) {
    return (
      <div className={className} style={baseStyle}>
        <Image
          src={photo!}
          alt={alt || name}
          fill
          sizes={`${size}px`}
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
    );
  }

  const [from, to] = TINTS[tintIndex(name)];
  const initials = initialsOf(name);
  return (
    <div
      className={className}
      style={{
        ...baseStyle,
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        color: "var(--paper)",
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        letterSpacing: "0.02em",
        fontSize: Math.round(size * 0.38),
        textTransform: "uppercase",
      }}
      aria-label={name}
      role="img"
    >
      {initials}
    </div>
  );
}
