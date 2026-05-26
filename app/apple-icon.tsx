import { ImageResponse } from "next/og";

/**
 * Dynamic 180x180 apple-touch-icon — branded navy + gold "BIPE"
 * wordmark. Next.js serves this from /apple-icon automatically.
 *
 * Shows up on:
 *   - iOS "Add to Home Screen" tile
 *   - macOS Safari pinned tab / favourites
 *   - Some Android browsers' bookmark icons
 *
 * The full wordmark (vs the single "B" of the smaller favicon)
 * fits at 180px and reinforces the brand on mobile home screens.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 72,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          fontFamily: "system-ui",
        }}
      >
        BIPE
      </div>
    ),
    { ...size },
  );
}
