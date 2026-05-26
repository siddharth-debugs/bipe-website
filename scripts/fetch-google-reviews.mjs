#!/usr/bin/env node
/**
 * Fetches BIPE's current Google Business Profile rating + reviews via
 * the Google Places API (New) and writes the result to lib/reviews.json.
 *
 * Designed to run:
 *   - In a GitHub Action (.github/workflows/refresh-reviews.yml) on a
 *     daily cron + manual workflow_dispatch trigger
 *   - Locally for one-off refreshes:  node scripts/fetch-google-reviews.mjs
 *
 * Required env vars:
 *   GOOGLE_PLACES_API_KEY   API key from Google Cloud Console
 *                            (https://console.cloud.google.com)
 *   GOOGLE_PLACES_PLACE_ID  BIPE's Place ID (find via:
 *                            https://developers.google.com/maps/documentation/
 *                              places/web-service/place-id)
 *
 * Optional env vars:
 *   REVIEW_MIN_RATING       Filter floor (default: 4 — only 4-star+ reviews).
 *                            Set to 1 to include everything.
 *   REVIEW_KEEP_COUNT       How many reviews to keep in the carousel
 *                            (default: 6, capped by what the API returns).
 *
 * Quota:
 *   Place Details (New) is in Google's "Pro" SKU. Free tier covers
 *   200K requests/month; daily refresh = 30 req/month. Well within.
 *
 * Exits 0 when the file is updated (or no change is needed); exits 1
 * on auth / API errors so the GitHub Action surfaces them in logs.
 */

import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "..", "lib", "reviews.json");

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.env.GOOGLE_PLACES_PLACE_ID;
const MIN_RATING = Number(process.env.REVIEW_MIN_RATING ?? "4");
const KEEP_COUNT = Number(process.env.REVIEW_KEEP_COUNT ?? "6");

if (!API_KEY || !PLACE_ID) {
  console.error(
    "[fetch-google-reviews] Missing env vars. Set GOOGLE_PLACES_API_KEY " +
      "and GOOGLE_PLACES_PLACE_ID before running.",
  );
  process.exit(1);
}

const ENDPOINT = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
const FIELD_MASK = "id,displayName,rating,userRatingCount,reviews";

async function main() {
  console.log(`[fetch-google-reviews] Fetching Place Details for ${PLACE_ID}`);
  const res = await fetch(ENDPOINT, {
    method: "GET",
    headers: {
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": FIELD_MASK,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(
      `[fetch-google-reviews] Places API error ${res.status}: ${text.slice(0, 400)}`,
    );
    process.exit(1);
  }

  const data = await res.json();
  const rating = typeof data.rating === "number" ? data.rating : 0;
  const reviewCount =
    typeof data.userRatingCount === "number" ? data.userRatingCount : 0;
  const apiReviews = Array.isArray(data.reviews) ? data.reviews : [];

  // Map Google's review shape to our minimal Review type. Order:
  //   1. Filter to MIN_RATING or higher (default ≥4 stars)
  //   2. Sort by publishTime DESC (newest first) — Google's Places API
  //      returns reviews in "relevance" order by default, which often
  //      means old highly-rated reviews crowd out recent 5-star ones.
  //      Client-side sort by publishTime gives the user the freshest
  //      social-proof signal first.
  //   3. Slice to KEEP_COUNT
  const reviews = apiReviews
    .filter((r) => typeof r.rating === "number" && r.rating >= MIN_RATING)
    .sort((a, b) => {
      // ISO timestamps sort lexicographically in correct order, so a
      // simple string comparison works. Reverse for DESC.
      const ta = typeof a.publishTime === "string" ? a.publishTime : "";
      const tb = typeof b.publishTime === "string" ? b.publishTime : "";
      return tb.localeCompare(ta);
    })
    .slice(0, KEEP_COUNT)
    .map((r) => ({
      id: typeof r.name === "string" ? r.name.split("/").pop() : crypto.randomUUID(),
      rating: r.rating,
      text: r.text?.text ?? "",
      publishTime: r.publishTime ?? "",
      relativeTime: r.relativePublishTimeDescription ?? "",
      author: {
        name: r.authorAttribution?.displayName ?? "Google user",
        profilePhotoUrl: r.authorAttribution?.photoUri ?? undefined,
      },
    }));

  const output = {
    _meta: {
      source: "google-places-api",
      lastUpdated: new Date().toISOString(),
      placeId: PLACE_ID,
      displayName: data.displayName?.text ?? "",
      apiRevision: "places/v1",
    },
    rating,
    reviewCount,
    bestRating: 5,
    worstRating: 1,
    reviews,
  };

  // Don't rewrite the file when nothing has changed — avoids no-op
  // commits from the daily cron when ratings / counts are stable.
  let prev = "";
  try {
    prev = await readFile(OUTPUT_PATH, "utf-8");
  } catch {
    // file may not exist on first run
  }
  const next = JSON.stringify(output, null, 2) + "\n";

  // Compare ignoring `lastUpdated` (which always changes) so we only
  // commit when ratings / reviews actually moved.
  const stripLastUpdated = (s) =>
    s.replace(/"lastUpdated":\s*"[^"]*"/, '"lastUpdated":""');
  if (stripLastUpdated(prev) === stripLastUpdated(next)) {
    console.log(
      `[fetch-google-reviews] No data change (rating ${rating}, count ${reviewCount}). Skipping write.`,
    );
    process.exit(0);
  }

  await writeFile(OUTPUT_PATH, next, "utf-8");
  console.log(
    `[fetch-google-reviews] Wrote ${reviews.length} reviews · rating ${rating} · count ${reviewCount}`,
  );
}

main().catch((err) => {
  console.error("[fetch-google-reviews] Unhandled error:", err);
  process.exit(1);
});
