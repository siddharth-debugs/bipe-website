import React from "react";
import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { ArrowIcon } from "@/components/shell/Icons";
import { BIPE_IMG } from "@/lib/images";
import { getPageSection } from "@/lib/content";

/**
 * Trust strip shown at the foot of the hero. The numeric stats live in
 * the StatsBar section right below this — surfacing them here too is
 * just visual noise. Regulator/credential signals fill the slot
 * instead: AICTE / BTEUP / JEECUP / AISHE are unique to this strip.
 *
 * Now also editable from /admin → Content → Pages → Home → Hero. The
 * admin saves a JSON content payload; this component reads it via
 * getPageSection("home", "hero") and falls back to the static defaults
 * below if the backend is unreachable or hasn't been seeded.
 */
const FALLBACK_APPROVALS = [
  { label: "AICTE-approved",   sub: "ID 1-488233171" },
  { label: "BTEUP-affiliated", sub: "5 branches · code 4455" },
  { label: "JEECUP code 4455", sub: "single counselling route" },
  { label: "AISHE registered", sub: "Dept. of Higher Education · MoE" },
];

interface HeroData {
  headline_pre: string;
  headline_accent: string;
  headline_post: string;
  description: string;
  cta_primary: { label: string; href: string };
  cta_secondary: { label: string; href: string };
  bg_image_url: string;
  bg_image_alt: string;
  approvals: { label: string; sub: string }[];
}

function readString(src: unknown, fallback: string): string {
  return typeof src === "string" && src.trim() ? src : fallback;
}
function readObj<T extends Record<string, unknown>>(src: unknown): T | null {
  return src && typeof src === "object" && !Array.isArray(src) ? (src as T) : null;
}

async function loadHero(): Promise<HeroData> {
  const fallback: HeroData = {
    headline_pre: "Engineers",
    headline_accent: "begin",
    headline_post: "here.",
    // Description fallback now includes the exact head-term phrase
    // "polytechnic in Varanasi" — May 2026 keyword audit P0 fix. Note:
    // production renders the backend-stored hero copy (page_section
    // "home/hero") when available; this fallback only ships when the
    // backend is unreachable or that section is unpublished. The
    // backend record should be updated via the admin panel to match,
    // otherwise this fix is dormant in production.
    description:
      "AICTE-approved polytechnic college in Varanasi — diploma engineering across 5 branches.\nMentor 1:20 · 1,000+ placed · Eastern UP since 2010.",
    cta_primary: { label: "Apply for 2026-27", href: "/apply" },
    cta_secondary: { label: "Book a campus visit", href: "/visit" },
    bg_image_url: BIPE_IMG.heroWide,
    bg_image_alt: "BIPE campus — main building",
    approvals: FALLBACK_APPROVALS,
  };

  const section = await getPageSection("home", "hero");
  if (!section || !section.is_published) return fallback;

  const c = section.content;
  const cta1 = readObj<{ label?: string; href?: string }>(c.cta_primary);
  const cta2 = readObj<{ label?: string; href?: string }>(c.cta_secondary);
  const bg = readObj<{ url?: string; alt?: string }>(c.bg_image);
  const approvalsRaw = Array.isArray(c.approvals) ? c.approvals : null;
  const approvals = approvalsRaw
    ? approvalsRaw
        .filter((a): a is { label?: unknown; sub?: unknown } => !!a && typeof a === "object")
        .map((a) => ({
          label: readString((a as { label?: unknown }).label, ""),
          sub: readString((a as { sub?: unknown }).sub, ""),
        }))
        .filter((a) => a.label)
    : null;

  // Migrate the legacy hero-campus PNG reference. The 2.45 MB PNG
  // was replaced by a 313 KB JPEG in commit a5afd32 (Phase 1.5
  // image optimization). The backend CMS page_section "home/hero"
  // still holds the old URL until someone re-saves it via /admin,
  // which caused 400-status console errors in Lighthouse (the
  // browser tried to load a deleted file). This swap keeps the
  // homepage clean until the backend record is updated, and is a
  // no-op once it IS updated (since the .jpg suffix will already
  // be in the URL).
  const rawBgUrl = readString(bg?.url, fallback.bg_image_url);
  const bg_image_url =
    rawBgUrl === "/hero-campus.png" ? "/hero-campus.jpg" : rawBgUrl;

  return {
    headline_pre:   readString(c.headline_pre,   fallback.headline_pre),
    headline_accent: readString(c.headline_accent, fallback.headline_accent),
    headline_post:  readString(c.headline_post,  fallback.headline_post),
    description:    readString(c.description,    fallback.description),
    cta_primary:    { label: readString(cta1?.label, fallback.cta_primary.label), href: readString(cta1?.href, fallback.cta_primary.href) },
    cta_secondary:  { label: readString(cta2?.label, fallback.cta_secondary.label), href: readString(cta2?.href, fallback.cta_secondary.href) },
    bg_image_url,
    bg_image_alt:   readString(bg?.alt, fallback.bg_image_alt),
    approvals:      approvals && approvals.length ? approvals : fallback.approvals,
  };
}

export async function HeroFull() {
  const h = await loadHero();

  // Description supports literal newlines from the admin's textarea —
  // split into lines so each renders on its own line with a <br/>.
  const descLines = h.description.split(/\n+/);

  return (
    <section className="bipe-hero-section" style={{ position: "relative", overflow: "hidden", background: "#000" }}>
      <Img
        src={h.bg_image_url}
        alt={h.bg_image_alt}
        label=""
        priority
        // Explicit 100vw — the hero is full-bleed. Without this, the
        // default Img sizes hint ("75vw on tablet, 50vw on desktop")
        // would tell Next/Image to serve a too-small variant for the
        // full-width background, forcing the browser to upscale and
        // delaying LCP. Setting 100vw lets Next pick the correct
        // responsive variant: ~640w mobile, ~1080w tablet, ~1920w desktop.
        sizes="100vw"
        className="bipe-hero-bg"
        style={{ position: "absolute", inset: 0, borderRadius: 0 }}
      />

      {/* Hero overlay — three layers composited in one paint pass.
          Used to be three separate <div> wrappers (uniform 42% wash,
          left→right edge fade for headline contrast, bottom fade for
          the trust strip). Merging them into a single element with
          stacked background-image gradients drops two DOM nodes and
          collapses three potential compositor layers into one. CSS
          multi-background paints first-listed on TOP, so the bottom
          fade is first and the flat wash is last — matches the
          original DOM order pixel-for-pixel.

          Why this matters: every absolutely-positioned full-bleed
          overlay is a paint-layer candidate. Three of them above the
          LCP image meant the browser was potentially repainting four
          times to draw the hero. One overlay = one repaint, full stop.
          The campus signage stays readable, the headline contrast is
          unchanged. */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background:
          "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.7) 100%)," +
          "linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 100%)," +
          "rgba(0, 0, 0, 0.42)",
        pointerEvents: "none"
      }} />

      <div className="container bipe-hero-pad" style={{ position: "relative", padding: "72px 0 48px", color: "var(--paper)", zIndex: 2 }}>
        <div>
          {/*
            Hero eyebrow added May 2026. Semrush keyword research shows
            BIPE ranks #12 (page 2) for "polytechnic college in
            varanasi" — 590 monthly searches, low competition. Adding
            the verbatim phrase above the H1 gives the strongest
            possible on-page signal without disrupting the editorial
            "Engineers begin here." brand line below.
          */}
          <div
            className="eyebrow"
            style={{
              color: "color-mix(in oklab, #fff 70%, transparent)",
              borderColor: "color-mix(in oklab, #fff 25%, transparent)",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "6px 14px",
              border: "1px solid color-mix(in oklab, #fff 25%, transparent)",
              borderRadius: 999,
              backdropFilter: "blur(8px)",
              background: "rgba(255,255,255,0.06)",
            }}
          >
            AICTE-Approved Polytechnic College in Varanasi
          </div>
          <h1 className="bipe-hero-h1" style={{
            fontFamily: "var(--font-display, var(--font-sans))",
            fontSize: "clamp(48px, 8vw, 132px)",
            lineHeight: 0.95,
            letterSpacing: "-0.035em",
            fontWeight: 600,
            color: "var(--paper)",
            marginBottom: 24,
            textShadow: "0 2px 30px rgba(0,0,0,0.4)"
          }}>
            {h.headline_pre}{" "}
            <br />
            <span className="serif" style={{ fontStyle: "italic", fontWeight: 400, color: "var(--accent)", letterSpacing: "-0.02em" }}>{h.headline_accent}</span>
            <span style={{ fontStyle: "italic", fontFamily: "var(--font-serif)", fontWeight: 300, color: "color-mix(in oklab, #fff 85%, transparent)" }}> {h.headline_post}</span>
          </h1>

          <p style={{
            fontSize: "clamp(15px, 1.2vw, 18px)",
            lineHeight: 1.55,
            color: "color-mix(in oklab, #fff 85%, transparent)",
            maxWidth: "54ch",
            marginBottom: 28
          }}>
            {descLines.map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < descLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>

          <div className="row" style={{ gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <Link href={h.cta_primary.href} className="btn btn-lg"
              style={{ background: "var(--accent)", color: "var(--ink)", border: "none", fontWeight: 600 }}>
              {h.cta_primary.label} <ArrowIcon size={16} />
            </Link>
            <Link href={h.cta_secondary.href} className="btn btn-lg"
              style={{ background: "rgba(255,255,255,0.08)", color: "var(--paper)", border: "1px solid color-mix(in oklab, #fff 35%, transparent)", backdropFilter: "blur(10px)" }}>
              {h.cta_secondary.label}
            </Link>
          </div>
        </div>

        <div className="bipe-hero-trust" style={{
          marginTop: 44,
          paddingTop: 20,
          borderTop: "1px solid color-mix(in oklab, #fff 18%, transparent)",
        }}>
          <div className="row" style={{ alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "color-mix(in oklab, #fff 55%, transparent)", flexShrink: 0 }}>
              Approvals
            </span>
            <div className="bipe-hero-trust-list" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 20,
              flex: 1,
            }}>
              {h.approvals.map((t) => (
                <div key={t.label} style={{
                  paddingLeft: 14,
                  borderLeft: "2px solid var(--accent)",
                }}>
                  <div style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: "color-mix(in oklab, #fff 92%, transparent)",
                    letterSpacing: "-0.005em",
                  }}>
                    {t.label}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "color-mix(in oklab, #fff 55%, transparent)",
                    marginTop: 3,
                  }}>
                    {t.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
