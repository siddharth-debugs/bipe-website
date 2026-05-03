import React from "react";

/**
 * Brand logo. Renders the user-provided asset at /public/bipe-logo.svg
 * directly via <img>, so the source SVG stays the single source of truth —
 * if the asset is updated on disk, every consumer picks it up automatically.
 *
 * `size` is the rendered HEIGHT in px. Width is auto from intrinsic aspect.
 */
export interface LogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

export const Logo = ({ size = 48, className, style, alt = "BIPE" }: LogoProps) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/bipe-logo.svg"
    alt={alt}
    height={size}
    className={className}
    style={{ height: size, width: "auto", display: "block", ...style }}
    draggable={false}
  />
);
