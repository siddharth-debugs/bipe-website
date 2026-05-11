"use client";

import React, { useEffect, useState, useRef } from "react";

export interface CrossfadeSliderProps {
  images: { src: string; alt: string }[];
  /** Autoplay interval in ms. Default 4000. */
  interval?: number;
  /** Crossfade duration in ms. Default 900. */
  fadeMs?: number;
  /** Aspect ratio CSS value. Default "16/9". */
  aspectRatio?: string;
  /** Border radius. Default 16. */
  radius?: number;
  className?: string;
  /** Optional element rendered on top of the slider (e.g. brand chip). */
  overlay?: React.ReactNode;
}

/**
 * Crossfade image slider — no slide motion, no prev/next buttons.
 * - Autoplay rotates through images on a timer.
 * - Active image has opacity 1, others 0; CSS transitions handle the
 *   ease-in-out crossfade ("morph" feel without layout shift).
 * - Dots at the bottom indicate position; click a dot to jump.
 * - Pauses autoplay on hover/focus inside the slider.
 */
export const CrossfadeSlider = ({
  images,
  interval = 4000,
  fadeMs = 900,
  aspectRatio = "16/9",
  radius = 16,
  className,
  overlay,
}: CrossfadeSliderProps) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (paused || images.length < 2) return;
    timerRef.current = setTimeout(() => {
      setActive((i) => (i + 1) % images.length);
    }, interval);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, paused, interval, images.length]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio,
        borderRadius: radius,
        overflow: "hidden",
        background: "var(--paper-2)",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {images.map((img, i) => (
        <div
          key={img.src}
          aria-hidden={i !== active}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === active ? 1 : 0,
            transform: i === active ? "scale(1)" : "scale(1.04)",
            transition: `opacity ${fadeMs}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${fadeMs + 400}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            willChange: "opacity, transform",
          }}
        >
          {/* Plain <img>, not next/image. Cloudinary already does
              f_auto/q_auto/w_*; going through Next's image optimiser
              breaks these URLs (same fix as LabsGallery on /campus). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.src}
            alt={img.alt}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      ))}

      {overlay}

      {/* Dots */}
      <div
        role="tablist"
        aria-label="Slide selection"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 14,
          display: "flex",
          justifyContent: "center",
          gap: 8,
          zIndex: 2,
        }}
      >
        {images.map((_, i) => {
          const on = i === active;
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={on}
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setActive(i)}
              style={{
                width: on ? 24 : 8,
                height: 8,
                borderRadius: 999,
                border: "none",
                padding: 0,
                cursor: "pointer",
                background: on
                  ? "var(--paper)"
                  : "color-mix(in oklab, var(--paper) 45%, transparent)",
                boxShadow: "0 2px 6px -1px rgba(10,26,63,0.35)",
                transition: "width .35s cubic-bezier(0.4, 0, 0.2, 1), background .25s",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
