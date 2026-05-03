"use client";

import React, { CSSProperties, useState } from "react";

export type ImgProps = {
  src: string;
  alt?: string;
  label?: string;
  style?: CSSProperties;
  className?: string;
  aspectRatio?: string;
};

export function Img({ src, alt, label, style, className, aspectRatio }: ImgProps) {
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
  return (
    <div className={className} style={wrapStyle}>
      {!errored && (
        <img
          src={src}
          alt={alt || label || ""}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
            opacity: loaded ? 1 : 0, transition: "opacity .5s var(--ease)",
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
