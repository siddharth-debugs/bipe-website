import { ImageResponse } from "next/og";

/**
 * Dynamic 32x32 favicon — branded navy + gold "B" wordmark.
 * Next.js serves this from /icon at build/request time.
 *
 * Why dynamic instead of a static PNG: keeps the brand mark in
 * sync with the design tokens (navy #283e7a, gold #c8a951) without
 * needing to maintain hand-exported PNGs at every resolution.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#283e7a",
          color: "#c8a951",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: "-0.05em",
          fontFamily: "system-ui",
        }}
      >
        B
      </div>
    ),
    { ...size },
  );
}
