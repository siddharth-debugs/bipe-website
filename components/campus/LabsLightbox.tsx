"use client";

import React, { useCallback, useEffect } from "react";

/**
 * Lightbox for the campus lab gallery — mirrors the events lightbox UX
 * (Esc closes, arrow keys / on-screen buttons navigate, click backdrop
 * to dismiss) but renders a plain <img> against the Cloudinary URL so
 * we keep using its pipeline rather than Next's image optimiser.
 */

export interface LabsLightboxPhoto {
  src: string;
  title: string;
  categoryLabel: string;
  width: number;
  height: number;
}

export interface LabsLightboxProps {
  photos: LabsLightboxPhoto[];
  index: number | null;
  onClose: () => void;
  onChange: (next: number) => void;
}

export function LabsLightbox({ photos, index, onClose, onChange }: LabsLightboxProps) {
  const open = index !== null && photos.length > 0;
  const photo = open ? photos[index!] : null;

  const goPrev = useCallback(() => {
    if (index === null || photos.length === 0) return;
    onChange((index - 1 + photos.length) % photos.length);
  }, [index, photos.length, onChange]);

  const goNext = useCallback(() => {
    if (index === null || photos.length === 0) return;
    onChange((index + 1) % photos.length);
  }, [index, photos.length, onChange]);

  // Keyboard navigation + scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, goPrev, goNext]);

  if (!open || !photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.title} — photo ${index! + 1} of ${photos.length}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "color-mix(in oklab, var(--ink) 92%, transparent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        animation: "lightbox-fade-in .22s var(--ease)",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 22px",
          color: "var(--paper)",
          gap: 16,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, minWidth: 0 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--accent)",
              fontWeight: 600,
            }}
          >
            {photo.categoryLabel}
          </span>
          <span
            className="serif"
            style={{
              fontStyle: "italic",
              fontSize: 17,
              color: "color-mix(in oklab, var(--paper) 92%, transparent)",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {photo.title}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              color: "color-mix(in oklab, var(--paper) 65%, transparent)",
            }}
          >
            {index! + 1} / {photos.length}
          </span>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              width: 38,
              height: 38,
              borderRadius: 999,
              border: "1px solid color-mix(in oklab, var(--paper) 22%, transparent)",
              background: "color-mix(in oklab, var(--paper) 6%, transparent)",
              color: "var(--paper)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background .15s, border-color .15s",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stage */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          minHeight: 0,
          position: "relative",
        }}
      >
        <button type="button" aria-label="Previous photo" onClick={goPrev} style={navBtnStyle("left")}>
          <ArrowSvg dir="left" />
        </button>

        <div
          key={photo.src}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            maxWidth: 1280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "lightbox-image-in .25s var(--ease)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt={photo.title}
            decoding="async"
            style={{
              maxWidth: "100%",
              maxHeight: "calc(100vh - 200px)",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              borderRadius: 12,
              boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)",
            }}
          />
        </div>

        <button type="button" aria-label="Next photo" onClick={goNext} style={navBtnStyle("right")}>
          <ArrowSvg dir="right" />
        </button>
      </div>

      <div
        style={{
          padding: "12px 22px 18px",
          color: "color-mix(in oklab, var(--paper) 55%, transparent)",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        ← / → to navigate · Esc to close
      </div>

      <style>{`
        @keyframes lightbox-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lightbox-image-in { from { opacity: 0; transform: scale(0.985); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

function navBtnStyle(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    [side]: 16,
    top: "50%",
    transform: "translateY(-50%)",
    width: 48,
    height: 48,
    borderRadius: 999,
    border: "1px solid color-mix(in oklab, var(--paper) 22%, transparent)",
    background: "color-mix(in oklab, var(--paper) 8%, transparent)",
    color: "var(--paper)",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    transition: "background .15s, border-color .15s, transform .15s",
  } as React.CSSProperties;
}

function ArrowSvg({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      {dir === "left" ? (
        <path d="M10 3l-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}
