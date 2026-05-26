/**
 * Google Reviews data layer.
 *
 * Reads from lib/reviews.json — a file populated either by
 * scripts/fetch-google-reviews.mjs (automated, daily) or by manual
 * edit (for the day-1 path before the GCP setup is complete).
 *
 * The JSON file is the single source of truth so that:
 *
 *   (a) AggregateRating schema in app/layout.tsx and the ReviewsCarousel
 *       component both read from the same data
 *   (b) Updates only require touching one file (or running the script)
 *   (c) The component + schema gracefully no-op when reviewCount = 0,
 *       so the site renders cleanly before any reviews exist
 *
 * Why this file lives in /lib (not /scripts):
 *   The Next.js bundle imports lib/reviews.json directly so the
 *   AggregateRating JSON-LD is emitted at build time (server-side).
 *   No runtime API calls needed; data refreshes happen out-of-band via
 *   the GitHub Action or manual edit.
 */

import rawReviews from "./reviews.json";

export interface ReviewAuthor {
  name: string;
  profilePhotoUrl?: string;
}

export interface Review {
  /** Google's stable review ID, used as the React key */
  id: string;
  /** 1-5 integer rating the user gave */
  rating: number;
  /** Full review text (may be empty) */
  text: string;
  /** ISO timestamp */
  publishTime: string;
  /** Relative time string Google returns ("a month ago" etc.) */
  relativeTime?: string;
  author: ReviewAuthor;
}

export interface ReviewsData {
  /** Aggregate rating · 1-5 with decimal (e.g., 4.3) */
  rating: number;
  /** Total number of reviews on the GBP listing */
  reviewCount: number;
  /** Schema.org bestRating */
  bestRating: number;
  /** Schema.org worstRating */
  worstRating: number;
  /** Curated subset to render in the on-site carousel */
  reviews: Review[];
  /** Provenance — "manual" or "google-places-api" */
  source?: "manual" | "google-places-api";
  /** ISO timestamp of last refresh */
  lastUpdated?: string | null;
}

/**
 * Coerce the JSON file (loose shape because it might be hand-edited
 * or written by the API script) into the typed ReviewsData shape.
 * Defends against missing fields by returning zero-state when bad.
 */
function loadReviews(): ReviewsData {
  const r = rawReviews as Record<string, unknown>;
  const rating = typeof r.rating === "number" ? r.rating : 0;
  const reviewCount = typeof r.reviewCount === "number" ? r.reviewCount : 0;
  const bestRating = typeof r.bestRating === "number" ? r.bestRating : 5;
  const worstRating = typeof r.worstRating === "number" ? r.worstRating : 1;
  const reviews = Array.isArray(r.reviews) ? (r.reviews as Review[]) : [];
  const meta = (r._meta as Record<string, unknown> | undefined) ?? {};
  return {
    rating,
    reviewCount,
    bestRating,
    worstRating,
    reviews,
    source: meta.source === "google-places-api" ? "google-places-api" : "manual",
    lastUpdated: (meta.lastUpdated as string | null | undefined) ?? null,
  };
}

export const REVIEWS = loadReviews();

/**
 * True iff there's enough data to render the carousel + schema.
 * Use this as the conditional in any component that reads reviews —
 * prevents rendering empty stars or "(0)" on day 1.
 */
export function hasReviews(): boolean {
  return REVIEWS.rating > 0 && REVIEWS.reviewCount > 0;
}

/**
 * Schema.org AggregateRating object for embedding in Organization
 * JSON-LD. Returns null when data is empty so the calling code can
 * conditionally omit the property (rather than emit zero-state).
 */
export function aggregateRatingSchema():
  | {
      "@type": "AggregateRating";
      ratingValue: string;
      reviewCount: string;
      bestRating: string;
      worstRating: string;
    }
  | null {
  if (!hasReviews()) return null;
  return {
    "@type": "AggregateRating",
    ratingValue: REVIEWS.rating.toFixed(1),
    reviewCount: String(REVIEWS.reviewCount),
    bestRating: String(REVIEWS.bestRating),
    worstRating: String(REVIEWS.worstRating),
  };
}
