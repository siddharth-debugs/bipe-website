"use client";

import React from "react";

/**
 * Small "↑ Back to top" pill used in the footer hero strip.
 * Lives in its own client component so the footer stays server-rendered.
 */
export function BackToTop() {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <a
      href="#top"
      aria-label="Back to top"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        marginTop: 22,
        padding: "9px 16px",
        border: "1px solid color-mix(in oklab, var(--paper) 22%, transparent)",
        borderRadius: 999,
        fontFamily: "var(--font-mono)",
        fontSize: 10.5,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "color-mix(in oklab, var(--paper) 80%, transparent)",
        textDecoration: "none",
        transition: "background .2s, border-color .2s, color .2s",
      }}
    >
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M6 9V3M3 6l3-3 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back to top
    </a>
  );
}
