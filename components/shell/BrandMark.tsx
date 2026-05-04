import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";

/**
 * Header brand lockup: logo + institute full name in two lines.
 * The text block height is constrained to the logo height (50px)
 * with a tight 1.05 line-height so two lines fit cleanly alongside.
 *
 * Hidden on small phones where the logo alone is enough.
 */
export const BrandMark = () => (
  <Link
    href="/"
    className="brand-mark"
    aria-label="BIPE — Banaras Institute of Polytechnic & Engineering — Home"
    style={{ display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none" }}
  >
    <Logo size={50} />
    <span
      className="brand-mark-name"
      style={{
        display: "inline-flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: 50,
        maxWidth: 280,
        fontFamily: "var(--font-sans)",
        // Two lines × line-height ≈ 50px so text height matches logo height
        fontSize: 22,
        lineHeight: 1.13,
        fontWeight: 600,
        letterSpacing: "-0.018em",
        color: "var(--ink)",
        whiteSpace: "normal",
      }}
    >
      <span>Banaras Institute of</span>
      <span>Polytechnic &amp; Engineering</span>
    </span>
  </Link>
);
