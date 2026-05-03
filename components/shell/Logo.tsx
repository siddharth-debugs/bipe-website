import React from "react";
import Image from "next/image";

/**
 * Brand logo. Renders the user-provided asset at /public/bipe-logo.svg
 * via next/image, so the source SVG stays the single source of truth —
 * if the asset is updated on disk, every consumer picks it up automatically.
 *
 * `size` is the rendered HEIGHT in px. Width auto-derives from the SVG's
 * intrinsic 2162×2497 aspect ratio (≈ 0.866).
 */
export interface LogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

const ASPECT = 2162 / 2497; // width / height
const NATURAL_W = 2162;
const NATURAL_H = 2497;

export const Logo = ({ size = 48, className, style, alt = "BIPE" }: LogoProps) => {
  const width = Math.round(size * ASPECT);
  return (
    <Image
      src="/bipe-logo.svg"
      alt={alt}
      width={NATURAL_W}
      height={NATURAL_H}
      className={className}
      style={{ height: size, width, display: "block", ...style }}
      draggable={false}
      priority
    />
  );
};
