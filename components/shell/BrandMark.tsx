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
        flexShrink: 0,
        height: 50,
        // Lock the width so flex can't squeeze the lockup into 4 lines
        // when the primary nav grows. Each line of caps fits in ≤290px.
        width: 290,
        fontFamily: "var(--font-sans)",
        fontSize: 19,
        lineHeight: 1.18,
        fontWeight: 700,
        letterSpacing: "0.005em",
        textTransform: "uppercase",
        color: "var(--ink)",
        whiteSpace: "nowrap",
      }}
    >
      <span>Banaras Institute of</span>
      <span>Polytechnic &amp; Engineering</span>
    </span>
  </Link>
);
