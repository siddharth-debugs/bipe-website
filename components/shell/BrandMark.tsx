import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";

export const BrandMark = () => (
  <Link
    href="/"
    className="brand-mark"
    aria-label="BIPE — Home"
    style={{ display: "inline-flex", alignItems: "center" }}
  >
    <Logo size={50} />
  </Link>
);
