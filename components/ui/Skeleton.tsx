import React from "react";

/**
 * Lightweight skeleton primitive. Pairs with the `.skeleton` rule in
 * globals.css for the shimmer animation. Use with explicit `width` /
 * `height` (numbers in px or any CSS length string) to mimic the shape
 * of the content that's loading.
 */
export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  variant?: "block" | "circle" | "pill";
  dark?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({
  width = "100%",
  height = 14,
  radius,
  variant = "block",
  dark = false,
  className,
  style,
}: SkeletonProps) {
  const cls = [
    "skeleton",
    variant === "circle" ? "circle" : "",
    variant === "pill" ? "pill" : "",
    dark ? "dark" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <span
      className={cls}
      aria-hidden="true"
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...(radius !== undefined ? { borderRadius: typeof radius === "number" ? `${radius}px` : radius } : {}),
        ...style,
      }}
    />
  );
}
