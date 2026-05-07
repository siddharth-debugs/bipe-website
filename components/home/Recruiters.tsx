import React from "react";
import Image from "next/image";
import { DATA } from "@/lib/data";
import { BIPE_IMG } from "@/lib/images";

/**
 * Inline SVG fallback for recruiters whose logo isn't in
 * BIPE_IMG.recruiterLogos. Renders a simple shield/building glyph in
 * the same grey as the wordmark text — no broken-image icons.
 */
const PLACEHOLDER = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <path
      d="M4 21V8.5L12 4l8 4.5V21M9 21v-6h6v6M8 12h.01M12 12h.01M16 12h.01"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function RecruiterTile({ name }: { name: string }) {
  const logo = BIPE_IMG.recruiterLogos[name];
  return (
    <span
      className="bipe-recruiter"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 16,
        // Wordmark colour matches ink-3; the same colour is applied to
        // the placeholder SVG via currentColor so they read as one
        // greyscale unit. Real PNG logos are recoloured via the
        // `bipe-recruiter-logo` class filter (see globals.css).
        color: "var(--ink-3)",
        whiteSpace: "nowrap",
      }}
    >
      {logo ? (
        <Image
          src={logo}
          alt={`${name} logo`}
          width={64}
          height={32}
          className="bipe-recruiter-logo"
          unoptimized
          style={{ height: 32, width: "auto", objectFit: "contain" }}
        />
      ) : (
        PLACEHOLDER
      )}
      <span
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: 36,
          lineHeight: 1,
        }}
      >
        {name}
      </span>
    </span>
  );
}

export const Recruiters = () => (
  <section className="section-tight">
    <div className="container" style={{ marginBottom: 18 }}>
      <div className="eyebrow" style={{ textAlign: "center" }}>
        1,000+ alumni placed at
      </div>
    </div>
    <div className="marquee">
      <div className="marquee-track" style={{ animationDuration: "55s" }}>
        {[0, 1].flatMap((cycle) =>
          DATA.recruiters.map((r, j) => (
            <span
              key={`${cycle}-${j}`}
              style={{ display: "inline-flex", alignItems: "center", gap: 48 }}
            >
              <RecruiterTile name={r} />
              <span
                style={{
                  color: "var(--accent)",
                  fontFamily: "var(--font-sans)",
                  fontStyle: "normal",
                  fontSize: 8,
                }}
              >
                ●
              </span>
            </span>
          )),
        )}
      </div>
    </div>
  </section>
);
