"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import manifest from "@/lib/alumni-manifest.json";
import { DATA } from "@/lib/data";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";

// ─── Types ──────────────────────────────────────────────────────────────────

type Alumnus = (typeof manifest.alumni)[number];
type Drive = (typeof manifest.drives)[number];

const PAGE_SIZE = 24;

// ─── Avatar helper — deterministic initials on a brand-palette gradient ────

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function hashHue(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

function Avatar({ name, photo, size = 56 }: { name: string; photo?: string; size?: number }) {
  const hue = hashHue(name);
  // Real photo (Cloudinary delivers AVIF/WebP via f_auto,q_auto already
  // baked into the URL). Falls back to the gradient initials tile if the
  // photo fails to load — guards against any 404s.
  if (photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
          boxShadow: "0 4px 12px -3px rgba(10,26,63,0.18)",
          background: `linear-gradient(135deg, hsl(${hue} 60% 56%) 0%, hsl(${(hue + 38) % 360} 64% 42%) 100%)`,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, hsl(${hue} 60% 56%) 0%, hsl(${(hue + 38) % 360} 64% 42%) 100%)`,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
        fontSize: size * 0.34,
        fontWeight: 700,
        letterSpacing: "0.02em",
        flexShrink: 0,
        boxShadow: "0 4px 12px -3px rgba(10,26,63,0.18)",
      }}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────

/**
 * Optional `alumni` prop: when the server page passes a list (sourced
 * from /api/v1/content/alumni/) it overrides the bundled manifest so
 * admin edits show without a rebuild. The drives, year/branch facet
 * lists and headline stats still come from the manifest — those are
 * not currently first-class entities in the backend.
 */
export function AlumniView({ alumni }: { alumni?: Alumnus[] } = {}) {
  const all: Alumnus[] = alumni && alumni.length > 0 ? alumni : manifest.alumni;
  const drives: Drive[] = manifest.drives;

  const [q, setQ] = useState("");
  const [branch, setBranch] = useState<string>("All");
  const [year, setYear] = useState<string>("All");
  const [status, setStatus] = useState<"all" | "joined" | "offered">("all");
  const [visible, setVisible] = useState<number>(PAGE_SIZE);
  const [openDrives, setOpenDrives] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return all.filter((a) => {
      if (branch !== "All" && a.branch !== branch) return false;
      if (year !== "All" && a.year !== year) return false;
      if (status !== "all" && a.status !== status) return false;
      if (!needle) return true;
      return (
        a.name.toLowerCase().includes(needle) ||
        (a.company ?? "").toLowerCase().includes(needle)
      );
    });
  }, [all, q, branch, year, status]);

  // Top recruiters tally for the stats strip. Company names in the
  // bundled manifest were imported with trailing drive-date suffixes
  // baked into the string (e.g. "MKC GUJRAT 24/09/2020" or "Vikash
  // Group, Faridabad 17-05-2018") which made the recruiter look like
  // a single-day placement. Strip those date patterns at display
  // time only; the underlying manifest stays as-is so drive history
  // can still match by raw company+date keys. User-flagged 29 May
  // 2026 ("333 not in single day 24/09/2020 — its over a period of
  // time").
  const topRecruiter = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of all) counts[a.company] = (counts[a.company] ?? 0) + 1;
    let max = 0;
    let name = "";
    for (const [k, v] of Object.entries(counts)) {
      if (v > max) {
        max = v;
        name = k;
      }
    }
    // Strip trailing date patterns: " 24/09/2020", "-17-05-2018",
    // " 03.02.2018", etc. Also strip a leading comma+location
    // fragment if present.
    const cleaned = name
      .replace(/[\s,-]+\d{1,2}[/.\-]\d{1,2}[/.\-]\d{2,4}\s*$/, "")
      .trim();
    return { name: cleaned || name, count: max };
  }, [all]);

  function resetFilters() {
    setQ("");
    setBranch("All");
    setYear("All");
    setStatus("all");
    setVisible(PAGE_SIZE);
  }

  return (
    <div className="page-enter">
      {/* ====================================================================== */}
      {/* 1. EDITORIAL HERO                                                       */}
      {/* ====================================================================== */}
      <section
        className="section bipe-pad"
        style={{ position: "relative", overflow: "hidden", paddingTop: 72, paddingBottom: 72 }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: -180,
            top: -120,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "color-mix(in oklab, var(--brand) 26%, transparent)",
            filter: "blur(120px)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: -160,
            bottom: -160,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "color-mix(in oklab, var(--accent) 28%, transparent)",
            filter: "blur(130px)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative" }}>
          <div style={{ maxWidth: 820 }}>
            <div className="eyebrow">Alumni</div>
            <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "20ch" }}>
              1,331 placements,{" "}
              <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                shipping work across India.
              </span>
            </h1>
            {/* 28 May 2026 — hero reconciled to the canonical TPO-
                verified figure (1,331 placements across 44 recruiters
                between 2016 and 2025) that the rest of the site uses
                (/placements, homepage, /why-bipe, /private-vs-
                government-polytechnic). The searchable directory below
                still surfaces the 997 named records from the bundled
                manifest — the gap is disclosed honestly in the lead
                copy instead of being papered over. Add the remaining
                ~334 named records to lib/alumni-manifest.json as
                quarterly batches and the directory will catch up to
                the headline. */}
            <p className="lead" style={{ marginTop: 22, maxWidth: "60ch" }}>
              1,331 TPO-verified placements across 44 recruiters between 2016 and 2025 — the
              canonical placement record. The searchable directory below lists{" "}
              {manifest.totalAlumni.toLocaleString("en-IN")} named alumni from{" "}
              {manifest.totalDrives} documented recruiter drives; of those,{" "}
              {manifest.totalJoined.toLocaleString("en-IN")} joined the company and{" "}
              {manifest.totalOffered.toLocaleString("en-IN")} were offered a role and chose another
              path (tagged <em>Offered</em>). The remaining named records are added in
              quarterly batches.
            </p>
            <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
              <Link href="/placements" className="btn btn-primary">
                Why recruiters return <ArrowIcon size={14} />
              </Link>
              <a
                href={DATA.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa"
              >
                <WhatsAppIcon /> Alumni? Reconnect
              </a>
            </div>
          </div>

          {/* Stats band */}
          <div
            className="bipe-stats"
            style={{
              marginTop: 48,
              padding: 22,
              border: "1px solid var(--line)",
              borderRadius: 18,
              background: "var(--white)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 0,
            }}
          >
            {[
              // 28 May 2026 — stats reframed to put the canonical
              // 1,331 / 44 numbers up front, with the directory
              // subset (997 named / top-recruiter tally) following.
              // Keeps the SEO-relevant numbers consistent with
              // /placements + homepage while still surfacing the
              // directory-level detail the rest of this page renders.
              //
              // 29 May 2026 — "Drives documented: 16" stat dropped
              // per user direction "16 is not correct figure". The
              // 16 was just the count of recruiter-drives in the
              // bundled manifest subset, not BIPE's full historical
              // total, so claiming it as a sitewide stat was
              // misleading. The 16-drive accordion further down the
              // page still surfaces them as "named drive records"
              // without making any totality claim.
              { num: "1,331", l: "Total placements · TPO-verified" },
              { num: "44", l: "Recruiters across India" },
              { num: manifest.totalAlumni.toString(), l: "Named in this directory" },
              {
                num: topRecruiter.count.toString(),
                l: `Top recruiter · ${topRecruiter.name.slice(0, 24)}${topRecruiter.name.length > 24 ? "…" : ""}`,
              },
            ].map((s, i) => (
              <div
                key={s.l}
                style={{
                  padding: "10px 18px",
                  borderRight: i < 4 ? "1px solid var(--line)" : "none",
                }}
              >
                <div
                  className="serif"
                  style={{
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "clamp(28px, 3vw, 44px)",
                    lineHeight: 0.95,
                    color: "var(--brand)",
                    letterSpacing: "-0.02em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: "var(--font-mono)",
                    fontSize: 10.5,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--ink-3)",
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 2. ALUMNI DIRECTORY · search + filter pills + paginated grid            */}
      {/* ====================================================================== */}
      <section
        className="section"
        style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}
      >
        <div className="container" style={{ position: "relative" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: 32,
              alignItems: "end",
              marginBottom: 32,
              paddingBottom: 24,
              borderBottom: "1px solid var(--line)",
            }}
          >
            <div>
              <div className="eyebrow">Directory</div>
              <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "22ch" }}>
                Browse the{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  full roll.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right", fontSize: 14 }}>
              Phone numbers are kept private. Reach out via the BIPE office if you&apos;d like to be put in touch with an alumnus.
            </p>
          </div>

          {/* Filters */}
          {/* 29 May 2026 — bipe-alumni-filters class added for explicit
              mobile stacking. The 2-column auto-1fr layout puts
              branches on the left and years on the right; on phones
              the year column's pills (10 of them at full width) were
              overflowing into the branch area and visually layering.
              The site-wide safety-net @media rule was missed here for
              an as-yet-unclear reason (possibly RSC vs Client
              serialisation of the inline style hash). Explicit class
              + dedicated rule in app/globals.css is the reliable fix. */}
          <div
            className="bipe-alumni-filters"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 16,
              alignItems: "start",
              marginBottom: 22,
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Pill active={branch === "All"} onClick={() => { setBranch("All"); setVisible(PAGE_SIZE); }}>
                All branches
              </Pill>
              {manifest.branches.map((b) => (
                <Pill
                  key={b}
                  active={branch === b}
                  onClick={() => { setBranch(b); setVisible(PAGE_SIZE); }}
                >
                  {shortBranch(b)}
                </Pill>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <Pill active={year === "All"} onClick={() => { setYear("All"); setVisible(PAGE_SIZE); }}>
                All years
              </Pill>
              {manifest.years.map((y) => (
                <Pill key={y} active={year === y} onClick={() => { setYear(y); setVisible(PAGE_SIZE); }}>
                  {y}
                </Pill>
              ))}
            </div>
          </div>

          {/* Status pills */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
            <Pill active={status === "all"} onClick={() => { setStatus("all"); setVisible(PAGE_SIZE); }}>
              All · {manifest.totalAlumni}
            </Pill>
            <Pill active={status === "joined"} onClick={() => { setStatus("joined"); setVisible(PAGE_SIZE); }}>
              Joined · {manifest.totalJoined}
            </Pill>
            <Pill active={status === "offered"} onClick={() => { setStatus("offered"); setVisible(PAGE_SIZE); }}>
              Offered · {manifest.totalOffered}
            </Pill>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, marginBottom: 22 }}>
            <input
              type="search"
              value={q}
              onChange={(e) => { setQ(e.target.value); setVisible(PAGE_SIZE); }}
              placeholder="Search by name or recruiter…"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid var(--line)",
                borderRadius: 12,
                background: "var(--white)",
                fontSize: 14,
                fontFamily: "var(--font-sans)",
                color: "var(--ink)",
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={resetFilters}
              className="btn btn-ghost"
              style={{ whiteSpace: "nowrap" }}
            >
              Reset
            </button>
          </div>

          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
              marginBottom: 18,
            }}
          >
            Showing {Math.min(visible, filtered.length).toLocaleString("en-IN")} of{" "}
            {filtered.length.toLocaleString("en-IN")} · filtered from{" "}
            {manifest.totalAlumni.toLocaleString("en-IN")} named alumni · subset of 1,331 TPO-verified placements
          </div>

          {/* Alumni grid */}
          {filtered.length === 0 ? (
            <div
              className="card"
              style={{ padding: 32, textAlign: "center", color: "var(--ink-3)" }}
            >
              No alumni match those filters.{" "}
              <button
                type="button"
                onClick={resetFilters}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--brand)",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Reset filters
              </button>
              .
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 14,
              }}
            >
              {filtered.slice(0, visible).map((a) => (
                <article
                  key={a.id}
                  className="card"
                  style={{
                    padding: 18,
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: 14,
                    alignItems: "center",
                    background: "var(--white)",
                    position: "relative",
                    opacity: a.status === "offered" ? 0.82 : 1,
                  }}
                >
                  {a.status === "offered" && (
                    <span
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: "color-mix(in oklab, var(--accent) 18%, var(--white))",
                        color: "var(--accent-deep, var(--accent))",
                        border: "1px solid color-mix(in oklab, var(--accent) 36%, transparent)",
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                      }}
                    >
                      Offered
                    </span>
                  )}
                  <Avatar name={a.name} photo={(a as Alumnus & { photo?: string }).photo} />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14.5,
                        letterSpacing: "-0.005em",
                        color: "var(--ink)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        paddingRight: a.status === "offered" ? 56 : 0,
                      }}
                      title={a.name}
                    >
                      {a.name}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 12,
                        color: "var(--ink-3)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={a.branch}
                    >
                      {shortBranch(a.branch)} · {a.year}
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        paddingTop: 8,
                        borderTop: "1px dashed var(--line-2, var(--line))",
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        letterSpacing: "0.06em",
                        color: "var(--brand)",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={a.company}
                    >
                      → {a.company}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Show more */}
          {visible < filtered.length && (
            <div style={{ textAlign: "center", marginTop: 28 }}>
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="btn btn-primary"
              >
                Show next {Math.min(PAGE_SIZE, filtered.length - visible)} <ArrowIcon size={14} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 3. DRIVE HISTORY — accordion of every campus drive 2016–2021            */}
      {/* ====================================================================== */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: 32,
              alignItems: "end",
              marginBottom: 32,
              paddingBottom: 24,
              borderBottom: "1px solid var(--line)",
            }}
          >
            <div>
              <div className="eyebrow">Drive history</div>
              <h2 className="bipe-h2" style={{ marginTop: 14, maxWidth: "22ch" }}>
                Sixteen documented drives.{" "}
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                  Named by date.
                </span>
              </h2>
            </div>
            <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right", fontSize: 14 }}>
              Click any row to expand the cohort placed in that drive. Earlier and later drives are still being reconciled into the named directory.
            </p>
          </div>

          <div
            className="card"
            style={{ padding: 0, overflow: "hidden", border: "1px solid var(--line)", borderRadius: 18 }}
          >
            {drives.map((d, i) => {
              const key = `${d.company}-${d.date}`;
              const open = !!openDrives[key];
              const cohort = all.filter(
                (a) => a.company === d.company && a.driveDate === d.date,
              );
              return (
                <div
                  key={key}
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid var(--line)",
                    background: open ? "var(--paper-2)" : "var(--white)",
                    transition: "background .2s",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDrives((p) => ({ ...p, [key]: !p[key] }))
                    }
                    style={{
                      width: "100%",
                      padding: "18px 22px",
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto auto",
                      gap: 18,
                      alignItems: "center",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      color: "var(--ink)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    <div
                      className="serif"
                      style={{
                        fontStyle: "italic",
                        fontSize: 28,
                        color: "var(--brand)",
                        minWidth: 50,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{d.company}</div>
                      <div
                        style={{
                          marginTop: 4,
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          letterSpacing: "0.1em",
                          color: "var(--ink-3)",
                        }}
                      >
                        {d.date} {d.year && d.date !== d.year ? `· ${d.year}` : ""}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, whiteSpace: "nowrap" }}>
                      <span className="pill pill-accent" style={{ fontSize: 10 }}>
                        {d.joined} joined
                      </span>
                      {d.offered > 0 && (
                        <span
                          className="pill"
                          style={{
                            fontSize: 10,
                            background: "color-mix(in oklab, var(--accent) 14%, var(--white))",
                            color: "var(--accent-deep, var(--accent))",
                            border: "1px solid color-mix(in oklab, var(--accent) 30%, transparent)",
                          }}
                        >
                          {d.offered} offered
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: open ? "var(--brand)" : "var(--brand-soft)",
                        color: open ? "#fff" : "var(--brand)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background .2s, transform .25s",
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </button>

                  {open && (
                    <div style={{ padding: "4px 22px 22px" }}>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                          gap: 8,
                        }}
                      >
                        {cohort.map((a) => (
                          <div
                            key={a.id}
                            style={{
                              padding: "10px 12px",
                              borderRadius: 10,
                              background: "var(--white)",
                              border: "1px solid var(--line)",
                              display: "grid",
                              gridTemplateColumns: "auto 1fr",
                              gap: 10,
                              alignItems: "center",
                              opacity: a.status === "offered" ? 0.82 : 1,
                              position: "relative",
                            }}
                          >
                            {a.status === "offered" && (
                              <span
                                style={{
                                  position: "absolute",
                                  top: 6,
                                  right: 6,
                                  padding: "1px 6px",
                                  borderRadius: 999,
                                  background: "color-mix(in oklab, var(--accent) 18%, var(--white))",
                                  color: "var(--accent-deep, var(--accent))",
                                  border: "1px solid color-mix(in oklab, var(--accent) 32%, transparent)",
                                  fontFamily: "var(--font-mono)",
                                  fontSize: 8,
                                  letterSpacing: "0.12em",
                                  textTransform: "uppercase",
                                  fontWeight: 700,
                                }}
                              >
                                Offered
                              </span>
                            )}
                            <Avatar name={a.name} photo={(a as Alumnus & { photo?: string }).photo} size={32} />
                            <div style={{ minWidth: 0 }}>
                              <div
                                style={{
                                  fontWeight: 600,
                                  fontSize: 13,
                                  color: "var(--ink)",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  paddingRight: a.status === "offered" ? 50 : 0,
                                }}
                                title={a.name}
                              >
                                {a.name}
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "var(--ink-3)",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {shortBranch(a.branch)} · {a.year}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* 4. CTA — reconnect / be listed                                         */}
      {/* ====================================================================== */}
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              background: "var(--ink)",
              color: "var(--paper)",
              borderRadius: 24,
              padding: "48px 56px",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.05,
                backgroundImage:
                  "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
                backgroundSize: "64px 64px",
                pointerEvents: "none",
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                right: -120,
                top: -120,
                width: 360,
                height: 360,
                borderRadius: "50%",
                background: "color-mix(in oklab, var(--accent) 36%, transparent)",
                filter: "blur(120px)",
                pointerEvents: "none",
              }}
            />
            <div
              className="bipe-split"
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr",
                gap: 32,
                alignItems: "center",
              }}
            >
              <div>
                <div className="eyebrow" style={{ color: "var(--accent)" }}>
                  Are you BIPE alumni?
                </div>
                <h2
                  style={{
                    fontSize: "clamp(28px, 3vw, 44px)",
                    lineHeight: 1.1,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    marginTop: 14,
                    color: "var(--paper)",
                  }}
                >
                  Reconnect with the campus.{" "}
                  <span
                    className="serif"
                    style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}
                  >
                    Send a note.
                  </span>
                </h2>
                <p
                  style={{
                    marginTop: 14,
                    color: "color-mix(in oklab, var(--paper) 72%, transparent)",
                    fontSize: 15,
                    lineHeight: 1.7,
                    maxWidth: "52ch",
                  }}
                >
                  If your name is wrong, missing, or you&apos;d like your company logo and current role
                  added to your card, write to us. We update this directory in batches each quarter.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <a
                  href={DATA.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lg btn-wa"
                  style={{ justifyContent: "space-between" }}
                >
                  WhatsApp the office <WhatsAppIcon />
                </a>
                <a
                  href={`mailto:${DATA.contact.email}?subject=BIPE%20Alumni%20update`}
                  className="btn btn-lg"
                  style={{
                    background: "var(--accent)",
                    color: "var(--ink)",
                    justifyContent: "space-between",
                  }}
                >
                  Email an update <ArrowIcon size={16} />
                </a>
                <Link
                  href="/placements"
                  className="btn btn-lg"
                  style={{
                    background: "color-mix(in oklab, var(--paper) 8%, transparent)",
                    border: "1px solid color-mix(in oklab, var(--paper) 22%, transparent)",
                    color: "var(--paper)",
                    justifyContent: "space-between",
                  }}
                >
                  See the placements page <ArrowIcon size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Small helpers ─────────────────────────────────────────────────────────

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 14px",
        borderRadius: 999,
        border: "1px solid",
        borderColor: active ? "var(--brand)" : "var(--line)",
        background: active ? "var(--brand)" : "var(--white)",
        color: active ? "#fff" : "var(--ink)",
        fontSize: 12.5,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "background .15s, border-color .15s, color .15s",
        fontFamily: "var(--font-sans)",
      }}
    >
      {children}
    </button>
  );
}

function shortBranch(b: string): string {
  return b
    .replace("Mechanical Engineering (Production)", "Mechanical · Production")
    .replace("Mechanical Engineering (Automobile)", "Mechanical · Automobile")
    .replace("Electrical Engineering", "Electrical")
    .replace("Electronics Engineering", "Electronics")
    .replace("Civil Engineering", "Civil")
    .replace("Computer Science & Engineering", "Computer Science");
}
