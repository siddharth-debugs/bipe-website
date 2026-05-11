"use client";

import React, { CSSProperties, useState } from "react";
import NextImage from "next/image";

export type ImgProps = {
  src: string;
  alt?: string;
  label?: string;
  style?: CSSProperties;
  className?: string;
  aspectRatio?: string;
  /** Use for above-the-fold imagery — eager load + high fetchPriority. */
  priority?: boolean;
  /** Optional sizes hint passed to next/image for responsive selection. */
  sizes?: string;
};

/**
 * App-wide image wrapper.
 *
 * Renders a `next/image` with `fill` inside a positioned container, so the
 * image always covers its parent at any size. Falls back to the striped
 * `.ph` placeholder while loading or on error, and shows the optional
 * mono-cap label tag in the bottom-left corner once the image is ready.
 */
export function Img({
  src,
  alt,
  label,
  style,
  className,
  aspectRatio,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 75vw, 50vw",
}: ImgProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const wrapStyle: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    borderRadius: 14,
    background: "var(--ink-soft, #eef1f6)",
    aspectRatio,
    ...style,
  };
  // Cloudinary already returns WebP/AVIF via f_auto and the right size
  // via w_/h_. Routing those URLs through Next's image optimiser breaks
  // them (same fix as components/campus/LabsGallery + CrossfadeSlider).
  const isCloudinary = typeof src === "string" && src.includes("res.cloudinary.com");
  return (
    <div className={className} style={wrapStyle}>
      {!errored && (
        <NextImage
          src={src}
          alt={alt || label || ""}
          fill
          sizes={sizes}
          priority={priority}
          fetchPriority={priority ? "high" : "auto"}
          unoptimized={isCloudinary}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          style={{
            objectFit: "cover",
            objectPosition: "center",
            opacity: loaded ? 1 : 0,
            transition: "opacity .5s var(--ease)",
          }}
        />
      )}
      {(!loaded || errored) && (
        <div className="ph" data-label={label}
             style={{ position: "absolute", inset: 0, borderRadius: "inherit", border: "none" }} />
      )}
      {label && loaded && !errored && (
        <div style={{
          position: "absolute", left: 12, bottom: 12,
          fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "#fff",
          background: "rgba(10,26,63,0.6)", backdropFilter: "blur(6px)",
          padding: "4px 8px", borderRadius: 6,
        }}>{label}</div>
      )}
    </div>
  );
}
