import { REVIEWS, hasReviews } from "@/lib/reviews";

/**
 * ReviewsCarousel — renders BIPE's curated Google reviews as a
 * horizontal scroll-snap card row.
 *
 * Why a CSS scroll-snap row, not a JS carousel:
 *   - Zero JS budget → respects the INP work in commit 8632da2
 *   - Native mobile swipe behaviour
 *   - Accessible by default (focus + keyboard nav free)
 *   - No flash-of-unstyled-content while a JS lib hydrates
 *
 * Conditional rendering — returns null when lib/reviews.json has
 * zero data (the day-1 state before manual values or API are filled in).
 * This means the homepage doesn't show an empty section while the
 * GBP integration is being set up.
 *
 * Data flow:
 *   lib/reviews.json (manual OR Google Places API output)
 *     ↓ via lib/reviews.ts
 *     ↓ via REVIEWS + hasReviews()
 *   This component
 *
 * Used on /home (full carousel) and /placements (compact variant).
 */
function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  // Render rating as 5 filled / half-filled / empty stars.
  // Visual only — actual rating value is shown as text alongside.
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  return (
    <span
      aria-label={`Rated ${rating.toFixed(1)} out of 5`}
      style={{
        display: "inline-flex",
        gap: 1,
        color: "var(--accent, #c8a951)",
        fontSize: size,
        letterSpacing: "0.05em",
        lineHeight: 1,
      }}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        if (i < fullStars) return <span key={i}>★</span>;
        if (i === fullStars && hasHalf) return <span key={i} style={{ opacity: 0.7 }}>★</span>;
        return (
          <span key={i} style={{ color: "color-mix(in oklab, var(--accent) 25%, transparent)" }}>
            ★
          </span>
        );
      })}
    </span>
  );
}

export function ReviewsCarousel({ variant = "full" }: { variant?: "full" | "compact" }) {
  if (!hasReviews()) return null;

  const isCompact = variant === "compact";
  const sectionPad = isCompact ? "32px 0" : "72px 0 56px";

  return (
    <section
      className="section reviews-section"
      style={{ position: "relative", padding: sectionPad }}
      aria-labelledby="reviews-heading"
    >
      <div className="container">
        {!isCompact && (
          <div className="eyebrow">Live on Google · refreshed daily</div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 18,
            flexWrap: "wrap",
            marginTop: isCompact ? 0 : 12,
          }}
        >
          <h2
            id="reviews-heading"
            className={isCompact ? "bipe-h3" : "bipe-h1"}
            style={{ margin: 0, maxWidth: "32ch" }}
          >
            {isCompact ? (
              <>Verified Google reviews</>
            ) : (
              <>
                Real reviews from{" "}
                <span
                  className="serif"
                  style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
                >
                  {REVIEWS.reviewCount.toLocaleString("en-IN")} families.
                </span>
              </>
            )}
          </h2>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 14px",
              borderRadius: 999,
              background: "color-mix(in oklab, var(--accent, #c8a951) 12%, transparent)",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: "var(--ink-1)",
              fontWeight: 600,
            }}
          >
            <StarRow rating={REVIEWS.rating} size={16} />
            <span style={{ fontVariantNumeric: "tabular-nums" }}>
              {REVIEWS.rating.toFixed(1)}
            </span>
            <span style={{ color: "var(--ink-3)" }}>
              · {REVIEWS.reviewCount.toLocaleString("en-IN")} reviews
            </span>
          </div>
        </div>

        <div className="reviews-row" style={{ marginTop: isCompact ? 18 : 32 }}>
          {REVIEWS.reviews.map((r) => (
            <article key={r.id} className="reviews-card">
              <StarRow rating={r.rating} />
              <p className="reviews-text">{r.text || "—"}</p>
              <footer className="reviews-author">
                <span className="reviews-author-name">{r.author.name}</span>
                {r.relativeTime && (
                  <span className="reviews-author-time">· {r.relativeTime}</span>
                )}
              </footer>
            </article>
          ))}
        </div>

        <p className="reviews-disclaimer">
          Sourced from Google Business Profile. Reviews refresh{" "}
          {REVIEWS.source === "google-places-api" ? "daily via Google Places API" : "periodically"}.
        </p>
      </div>
    </section>
  );
}

export default ReviewsCarousel;
