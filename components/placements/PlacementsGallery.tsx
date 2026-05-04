"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { EVENT_PHOTOS } from "@/lib/events-gallery";
import { Lightbox } from "@/components/events/Lightbox";

type BranchFilter = "All" | "Electrical" | "Mechanical" | "General";
type YearFilter = number | "All";

const BRANCH_LABELS: Record<BranchFilter, string> = {
  All: "All",
  Electrical: "Electrical",
  Mechanical: "Mechanical",
  General: "General",
};

const BRANCH_ORDER: Exclude<BranchFilter, "All">[] = ["Electrical", "Mechanical", "General"];

/**
 * Pinterest-style masonry gallery of placement-drive photos.
 *
 * Reuses the EVENT_PHOTOS dataset, pre-filtered to category === "Placement".
 * Filter chips: Branch (Electrical / Mechanical / General) + Year.
 * Click a tile -> the events Lightbox component (custom, keyboard-navigable).
 */
export function PlacementsGallery() {
  // Pre-filter once.
  const PLACEMENT_PHOTOS = useMemo(
    () => EVENT_PHOTOS.filter((p) => p.category === "Placement"),
    [],
  );
  const PLACEMENT_YEARS = useMemo(() => {
    const ys = new Set<number>();
    for (const p of PLACEMENT_PHOTOS) if (p.year != null) ys.add(p.year);
    return Array.from(ys).sort((a, b) => b - a);
  }, [PLACEMENT_PHOTOS]);

  const [branch, setBranch] = useState<BranchFilter>("All");
  const [year, setYear] = useState<YearFilter>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return PLACEMENT_PHOTOS.filter((p) => {
      if (branch !== "All") {
        const b = p.branch ?? "General";
        const norm: BranchFilter = b === "Electrical" || b === "Mechanical" ? b : "General";
        if (norm !== branch) return false;
      }
      if (year !== "All" && p.year !== year) return false;
      return true;
    });
  }, [PLACEMENT_PHOTOS, branch, year]);

  React.useEffect(() => {
    if (lightboxIndex !== null && lightboxIndex >= filtered.length) {
      setLightboxIndex(null);
    }
  }, [filtered.length, lightboxIndex]);

  const branchCounts = useMemo(() => {
    const c: Record<string, number> = { All: PLACEMENT_PHOTOS.length };
    for (const k of BRANCH_ORDER) c[k] = 0;
    for (const p of PLACEMENT_PHOTOS) {
      const b = p.branch ?? "General";
      const norm = b === "Electrical" || b === "Mechanical" ? b : "General";
      c[norm] = (c[norm] ?? 0) + 1;
    }
    return c;
  }, [PLACEMENT_PHOTOS]);

  const yearCounts = useMemo(() => {
    const c: Record<string, number> = { All: PLACEMENT_PHOTOS.length };
    for (const y of PLACEMENT_YEARS) c[String(y)] = 0;
    for (const p of PLACEMENT_PHOTOS) {
      if (p.year != null) c[String(p.year)] = (c[String(p.year)] ?? 0) + 1;
    }
    return c;
  }, [PLACEMENT_PHOTOS, PLACEMENT_YEARS]);

  return (
    <>
      {/* Filter strips */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <FilterRow
          label="Branch"
          chips={[
            { value: "All" as const, label: "All", count: branchCounts.All },
            ...BRANCH_ORDER
              .filter((k) => (branchCounts[k] ?? 0) > 0)
              .map((k) => ({
                value: k as BranchFilter,
                label: BRANCH_LABELS[k],
                count: branchCounts[k] ?? 0,
              })),
          ]}
          active={branch}
          onChange={(v) => setBranch(v as BranchFilter)}
        />
        <FilterRow
          label="Year"
          chips={[
            { value: "All" as const, label: "All years", count: yearCounts.All },
            ...PLACEMENT_YEARS.map((y) => ({
              value: y,
              label: String(y),
              count: yearCounts[String(y)] ?? 0,
            })),
          ]}
          active={year}
          onChange={(v) => setYear(v as YearFilter)}
        />
      </div>

      {/* Status row */}
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
          {branch !== "All" && <> · {BRANCH_LABELS[branch]}</>}
          {year !== "All" && <> · {year}</>}
        </span>
        {(branch !== "All" || year !== "All") && (
          <button
            type="button"
            onClick={() => {
              setBranch("All");
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
      <div className="bipe-masonry" style={{ marginTop: 22 }}>
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
            No placement photos match those filters.
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
// FilterRow — same pattern as EventsGallery
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
