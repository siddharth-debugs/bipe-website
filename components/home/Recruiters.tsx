import React from "react";
import Image from "next/image";
import { DATA } from "@/lib/data";
import { BIPE_IMG } from "@/lib/images";

/**
 * Inline SVG glyphs used as the placeholder logo when a real one isn't
 * shipped. We classify each recruiter into one of five rough buckets
 * (auto / steel / dairy / energy / rail) so the marquee has some visual
 * variety instead of identical building icons across every name.
 */
type Glyph = "auto" | "steel" | "dairy" | "energy" | "rail" | "default";

function classifyRecruiter(name: string): Glyph {
  const n = name.toLowerCase();
  if (/(mahindra|motors|jcb|maruti|bajaj|hero|ola|ather|krishna)/.test(n)) return "auto";
  if (/(steel|bhel|asian paints|electron|bel)/.test(n)) return "steel";
  if (/(amul|dairy|parag|nestl|nddb)/.test(n)) return "dairy";
  if (/(uppcl|power|adani|solar|electric)/.test(n)) return "energy";
  if (/(rail|metro)/.test(n)) return "rail";
  return "default";
}

const GLYPHS: Record<Glyph, React.ReactElement> = {
  // Car silhouette
  auto: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 13l2-5a2 2 0 011.8-1.2h10.4A2 2 0 0119 8l2 5M5 17a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0zM3 13h18M3 13v3h2m14 0h2v-3"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  ),
  // Factory chimneys
  steel: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 21V11l5 3V11l5 3V11l5 3v7H3zM7 17v2M11 17v2M15 17v2M19 17v2M5 11V5h2v6"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  ),
  // Milk bottle
  dairy: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 3h6v3l1 2v11a2 2 0 01-2 2H10a2 2 0 01-2-2V8l1-2V3zM8 12h8M9 16h6"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  ),
  // Lightning bolt
  energy: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  ),
  // Train head + tracks
  rail: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 18V6a3 3 0 013-3h8a3 3 0 013 3v12M5 13h14M9 9h2M13 9h2M7 21l2-3M17 21l-2-3"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  ),
  // Building / fallback
  default: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 21V8.5L12 4l8 4.5V21M9 21v-6h6v6M8 12h.01M12 12h.01M16 12h.01"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  ),
};

function RecruiterTile({ name }: { name: string }) {
  const logo = BIPE_IMG.recruiterLogos[name];
  return (
    <span
      className="bipe-recruiter"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        // Wordmark colour matches ink-3; the same colour is applied to
        // the inline SVG via currentColor so they read as one greyscale
        // unit. Real PNG logos (when shipped under /recruiters/) get
        // greyed via the .bipe-recruiter-logo CSS filter.
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
        <span style={{ display: "inline-flex", flexShrink: 0 }}>
          {GLYPHS[classifyRecruiter(name)]}
        </span>
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
