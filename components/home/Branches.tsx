import Link from "next/link";
import { DATA } from "@/lib/data";
import { ArrowIcon } from "@/components/shell/Icons";

/**
 * Homepage Branches section · preview only.
 *
 * May 2026 rewrite (Praveen's call): this used to be a full
 * hover-to-reveal widget with featured-branch preview panel + photo
 * carousel — visually identical to the widget on /courses (rendered
 * by CoursesView.tsx). Visitors clicking the branches CTA
 * landed on /courses and saw the same widget, breaking the funnel
 * promise of "see more depth here."
 *
 * Now: compact 5-card preview grid. Each card is a deep-link to
 * /courses/[branch] for the immersive experience. The rich widget
 * (photo carousel, syllabus, careers panel) lives only on /courses
 * where it belongs.
 *
 * Side effects of the rewrite:
 *   - No longer a client component (was "use client" for useState).
 *     Server-rendered now → smaller homepage JS bundle.
 *   - Dropped imports: useState, CrossfadeSlider, BRANCH_ICONS map.
 *   - Homepage scroll length reduced ~250-300px.
 *   - English head-keyword density on /courses sharpens (no longer
 *     diluted by duplicate widget on /).
 *
 * `branches` is optional: the home server page passes the live list
 * from getBranchesMapped() so admin edits flow through. Falls back
 * to DATA.branches if omitted (e.g. backend down).
 */
export const Branches = ({
  branches,
}: { branches?: typeof DATA.branches } = {}) => {
  const list = branches && branches.length > 0 ? branches : DATA.branches;

  return (
    <section
      className="section"
      style={{
        background: "var(--ink)",
        color: "var(--paper)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          backgroundImage:
            "linear-gradient(color-mix(in oklab, var(--paper) 100%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--paper) 100%, transparent) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -200,
          top: -100,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 70%, transparent)",
          filter: "blur(120px)",
          opacity: 0.5,
        }}
      />

      <div className="container" style={{ position: "relative" }}>
        {/* Heading + lead + CTA to the deep /courses surface */}
        <div
          className="between reveal"
          style={{
            marginBottom: 40,
            alignItems: "end",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div>
            <div className="eyebrow" style={{ color: "var(--accent)" }}>
              Programmes · 2026-27
            </div>
            <h2
              className="bipe-h1"
              style={{ marginTop: 14, color: "var(--paper)", maxWidth: "22ch" }}
            >
              Engineering,{" "}
              <span className="serif" style={{ color: "var(--accent)" }}>
                on a working schedule.
              </span>
            </h2>
            <p
              className="lead"
              style={{
                color: "color-mix(in oklab, var(--paper) 70%, transparent)",
                marginTop: 14,
                maxWidth: "min(100%, 60ch)",
              }}
            >
              A BTEUP diploma at BIPE is engineering on a working schedule —
              apply after Class 10 (three-year programme) or after Class 12
              (lateral entry to the second year, JEECUP Group K). Practical
              labs, industry exposure and a BTEUP-recognised credential that
              opens both a job and the second-year B.Tech door. Four branches
              admitting; one mentor for every twenty students.
            </p>
          </div>
          <Link
            href="/courses"
            className="btn"
            style={{
              color: "var(--paper)",
              border:
                "1px solid color-mix(in oklab, var(--paper) 25%, transparent)",
            }}
          >
            Explore the branches <ArrowIcon />
          </Link>
        </div>

        {/*
          Compact 5-card preview grid.
          auto-fit + minmax(180px, 1fr) means:
            - Wide desktop (≥1100px):  5 cards in one row
            - Tablet (~768-1099px):    3 cards per row
            - Small tablet (~500-767): 2 cards per row
            - Mobile (<500px):         1 card per row
          Each card is a deep-link to /courses/[branch].
        */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
          }}
        >
          {list.map((br, i) => (
            <Link
              key={br.code}
              href={`/courses/${br.slug}`}
              className="reveal bipe-branch-card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                padding: "22px 18px",
                border:
                  "1px solid color-mix(in oklab, var(--paper) 16%, transparent)",
                borderRadius: 14,
                background: "color-mix(in oklab, var(--paper) 4%, transparent)",
                color: "var(--paper)",
                textDecoration: "none",
                position: "relative",
                minHeight: 200,
                transition:
                  "border-color .25s var(--ease), background .25s var(--ease), transform .25s var(--ease)",
              }}
            >
              {/* Top row: serif italic number + optional tag pill */}
              <div
                className="between"
                style={{ alignItems: "flex-start", gap: 12 }}
              >
                <div
                  className="serif"
                  style={{
                    fontStyle: "italic",
                    fontSize: 36,
                    lineHeight: 0.9,
                    color: "var(--accent)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                {br.tag && (
                  <span
                    className="pill pill-accent"
                    style={{ fontSize: 9, padding: "3px 8px" }}
                  >
                    {br.tag}
                  </span>
                )}
              </div>

              {/* Middle: branch name (English) + Hindi (serif italic) */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 15.5,
                    color: "var(--paper)",
                    letterSpacing: "-0.005em",
                    lineHeight: 1.3,
                  }}
                >
                  {br.name}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    color:
                      "color-mix(in oklab, var(--paper) 60%, transparent)",
                    fontSize: 13,
                    marginTop: 6,
                    lineHeight: 1.3,
                  }}
                >
                  {br.hi}
                </div>
              </div>

              {/* Bottom row: BTEUP code + arrow */}
              <div
                className="between"
                style={{ marginTop: 4, alignItems: "center" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    color:
                      "color-mix(in oklab, var(--paper) 55%, transparent)",
                  }}
                >
                  BTEUP {br.code}
                </span>
                <ArrowIcon size={14} />
              </div>
            </Link>
          ))}
        </div>

        {/* Sanctioned-seats callout · preserved from the previous version.
            Acts as a trust-signal hook into /approvals; doesn't compete
            with the 5-card grid above visually (dashed border, different
            tone). */}
        <Link
          href="/approvals"
          style={{
            display: "block",
            marginTop: 32,
            padding: "18px 22px",
            borderRadius: 14,
            border:
              "1px dashed color-mix(in oklab, var(--paper) 30%, transparent)",
            color: "var(--paper)",
            textDecoration: "none",
            maxWidth: "78ch",
          }}
        >
          <div className="between">
            <div>
              <div className="eyebrow" style={{ color: "var(--accent)" }}>
                480 sanctioned seats · 2026-27
              </div>
              <div
                style={{
                  fontSize: 14,
                  marginTop: 4,
                  color: "color-mix(in oklab, var(--paper) 80%, transparent)",
                }}
              >
                AICTE-approved · BTEUP-affiliated
              </div>
            </div>
            <ArrowIcon />
          </div>
        </Link>
      </div>
    </section>
  );
};
