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
 * Cloudinary delivery loader for next/image.
 *
 * Takes a Cloudinary URL with NO `w_` transform (the "responsive-ready"
 * pattern, e.g. heroWide in lib/images.ts), and rewrites it per srcSet
 * entry by injecting `f_auto,q_auto,w_{width}` into the transform list.
 * next/image calls this once per deviceSize, so the browser gets a
 * proper srcSet pointing at right-sized Cloudinary URLs — no Vercel
 * transformation quota is touched at all.
 *
 * URL forms handled:
 *
 *   .../image/upload/f_auto,q_auto/v123/path/asset       (existing transforms)
 *   .../image/upload/v123/path/asset                     (no transforms)
 *   .../image/upload/path/asset                          (no transforms, no version)
 *
 * URLs already containing `w_NNN` (the older lab/library pattern) keep
 * their hardcoded width and skip this loader — see isCloudinarySized
 * below. That preserves the existing behavior for the 17+ entries in
 * lib/images.ts that bake a width into their URLs.
 */
function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const marker = "/image/upload/";
  const idx = src.indexOf(marker);
  if (idx === -1) return src;
  const head = src.slice(0, idx + marker.length);
  const rest = src.slice(idx + marker.length);
  const firstSlash = rest.indexOf("/");
  if (firstSlash === -1) return src;
  const firstSegment = rest.slice(0, firstSlash);
  // First segment is either a transform list ("f_auto,q_auto") or a
  // version stamp ("v1234567890"). If it's a version, transforms are
  // empty and we keep the version in `remainder`.
  const isVersion = /^v\d+$/.test(firstSegment);
  const oldTransforms = isVersion ? "" : firstSegment;
  const remainder = isVersion ? rest : rest.slice(firstSlash);
  const keep = oldTransforms
    ? oldTransforms.split(",").filter((t) => !/^(w_|q_|f_)/.test(t))
    : [];
  const newTransforms = [...keep, "f_auto", `q_${quality ?? "auto"}`, `w_${width}`]
    .filter(Boolean)
    .join(",");
  const prefix = isVersion ? "/" : "";
  return `${head}${newTransforms}${prefix}${remainder}`;
}

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
  // Cloudinary handling has two modes depending on the URL shape:
  //
  //   1. URLs WITH a `w_NNN` transform (e.g. the labs/library/workshop
  //      keys in lib/images.ts that bake `w_900` or `w_1200` into the
  //      path) — the URL already encodes its delivered size. Pass them
  //      through unoptimized so Next/Image doesn't try to re-process.
  //
  //   2. URLs WITHOUT a `w_NNN` transform (the responsive-ready
  //      pattern used by the homepage hero) — let next/image generate
  //      a proper srcSet via the cloudinaryLoader. The browser then
  //      picks a right-sized variant per viewport: ~50 KB on mobile,
  //      ~130 KB on tablet, ~290 KB on 1920px desktop. None of these
  //      hit Vercel's image optimizer.
  //
  // Either way, zero Vercel transformation quota is consumed for any
  // Cloudinary-hosted asset.
  const isCloudinary = typeof src === "string" && src.includes("res.cloudinary.com");
  const hasFixedWidth = isCloudinary && /\/upload\/[^/]*w_\d+/.test(src);
  const useLoader = isCloudinary && !hasFixedWidth;
  return (
    <div className={className} style={wrapStyle}>
      {/* Placeholder rendered FIRST so it sits BEHIND the image. It shows
          until the image's own onLoad fires (and stays put if the image
          errors, since onLoad never fires then). Previously this div
          rendered AFTER the image — painting on TOP of it — and the
          image itself was held at opacity:0 until a post-hydration
          onLoad + a 0.5s fade. That double client-JS gate meant the LCP
          image stayed invisible on mobile until the JS bundle downloaded
          and hydrated, pushing field LCP past 4s (GSC CWV, Jun 2026). */}
      {!loaded && (
        <div className="ph" data-label={label}
             style={{ position: "absolute", inset: 0, borderRadius: "inherit", border: "none" }} />
      )}
      {!errored && (
        <NextImage
          src={src}
          alt={alt || label || ""}
          fill
          sizes={sizes}
          priority={priority}
          fetchPriority={priority ? "high" : "auto"}
          loader={useLoader ? cloudinaryLoader : undefined}
          unoptimized={isCloudinary && !useLoader}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          // No JS opacity gate: the image is visible (opacity:1) in the
          // SSR HTML, so it counts toward LCP the instant its bytes
          // decode instead of waiting for hydration. Non-priority
          // (below-the-fold) images get a pure-CSS fade via .img-reveal;
          // priority/LCP images skip the animation entirely so nothing
          // can delay their paint.
          className={priority ? undefined : "img-reveal"}
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
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
