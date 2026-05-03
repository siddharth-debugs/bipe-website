"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  EVENT_PHOTOS,
  EVENT_YEARS,
  EVENT_CATEGORY_LABELS,
  EVENT_CATEGORY_ORDER,
  type EventCategory,
} from "@/lib/events-gallery";
import { Lightbox } from "./Lightbox";

type CategoryFilter = EventCategory | "All";
type YearFilter = number | "All";

/**
 * Pinterest-style masonry gallery of college events.
 *
 * - Filter chips (category + year) above the grid
 * - CSS-columns masonry — preserves intrinsic aspect ratios; tiles flow
 *   into 2/3/4 columns depending on viewport width
 * - Click a tile → custom lightbox with prev/next + keyboard nav
 */
export function EventsGallery() {
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [year, setYear] = useState<YearFilter>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return EVENT_PHOTOS.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (year !== "All" && p.year !== year) return false;
      return true;
    });
  }, [category, year]);

  // Reset lightbox if its target falls outside the filtered set
  React.useEffect(() => {
    if (lightboxIndex !== null && lightboxIndex >= filtered.length) {
      setLightboxIndex(null);
    }
  }, [filtered.length, lightboxIndex]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: EVENT_PHOTOS.length };
    for (const cat of EVENT_CATEGORY_ORDER) c[cat] = 0;
    for (const p of EVENT_PHOTOS) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, []);

  const yearCounts = useMemo(() => {
    const c: Record<string, number> = { All: EVENT_PHOTOS.length };
    for (const y of EVENT_YEARS) c[String(y)] = 0;
    for (const p of EVENT_PHOTOS) {
      if (p.year !== null) c[String(p.year)] = (c[String(p.year)] ?? 0) + 1;
    }
    return c;
  }, []);

  return (
    <>
      {/* Filter strips */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <FilterRow
          label="Category"
          chips={[
            { value: "All" as const, label: "All", count: counts.All },
            ...EVENT_CATEGORY_ORDER
              .filter((c) => (counts[c] ?? 0) > 0)
              .map((c) => ({
                value: c,
                label: EVENT_CATEGORY_LABELS[c],
                count: counts[c] ?? 0,
              })),
          ]}
          active={category}
          onChange={(v) => setCategory(v as CategoryFilter)}
        />
        <FilterRow
          label="Year"
          chips={[
            { value: "All" as const, label: "All years", count: yearCounts.All },
            ...EVENT_YEARS.map((y) => ({
              value: y,
              label: String(y),
              count: yearCounts[String(y)] ?? 0,
            })),
          ]}
          active={year}
          onChange={(v) => setYear(v as YearFilter)}
        />
      </div>

      <div
        style={{
          marginTop: 18,
          paddingTop: 14,
          borderTop: "1px solid var(--line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
          }}
        >
          Showing {filtered.length} {filtered.length === 1 ? "photo" : "photos"}
          {category !== "All" && <> · {EVENT_CATEGORY_LABELS[category]}</>}
          {year !== "All" && <> · {year}</>}
        </span>
        {(category !== "All" || year !== "All") && (
          <button
            type="button"
            onClick={() => {
              setCategory("All");
              setYear("All");
            }}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--brand)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              borderBottom: "1px solid var(--brand)",
            }}
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Masonry */}
      <div
        className="bipe-masonry"
        style={{ marginTop: 22 }}
      >
        {filtered.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setLightboxIndex(i)}
            className="bipe-masonry-tile"
            aria-label={`Open ${photo.title} (${i + 1} of ${filtered.length})`}
          >
            <Image
              src={photo.src}
              alt={photo.title}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 640px) 50vw, (max-width: 1080px) 33vw, 25vw"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: 14,
              }}
            />
            <div className="bipe-masonry-caption">
              <span className="bipe-masonry-caption-title">{photo.title}</span>
              {photo.year && (
                <span className="bipe-masonry-caption-meta">{photo.year}</span>
              )}
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "var(--ink-3)",
              fontSize: 14,
            }}
          >
            No photos match those filters.
          </div>
        )}
      </div>

      <Lightbox
        photos={filtered}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChange={setLightboxIndex}
      />
    </>
  );
}

// ───────────────────────────────────────────────────────────────────
// FilterRow
// ───────────────────────────────────────────────────────────────────
function FilterRow<T extends string | number>({
  label,
  chips,
  active,
  onChange,
}: {
  label: string;
  chips: Array<{ value: T | "All"; label: string; count: number }>;
  active: T | "All";
  onChange: (next: T | "All") => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--ink-3)",
          flexShrink: 0,
          minWidth: 60,
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {chips.map((c) => {
          const on = c.value === active;
          return (
            <button
              key={String(c.value)}
              type="button"
              onClick={() => onChange(c.value)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 14px",
                borderRadius: 999,
                border: on
                  ? "1px solid var(--brand)"
                  : "1px solid var(--line-2)",
                background: on ? "var(--brand)" : "var(--white)",
                color: on ? "var(--paper)" : "var(--ink-2)",
                fontSize: 13,
                fontWeight: on ? 600 : 500,
                cursor: "pointer",
                transition: "background .15s, color .15s, border-color .15s",
              }}
            >
              <span>{c.label}</span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  color: on
                    ? "color-mix(in oklab, var(--paper) 75%, transparent)"
                    : "var(--ink-3)",
                }}
              >
                {c.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
