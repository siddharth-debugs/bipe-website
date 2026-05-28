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
      "AICTE-approved polytechnic college in Varanasi — diploma engineering across 5 branches.\nMentor 1:20 · 1,331 placed · since 2010.",
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

  // Migrate legacy hero-campus references to the Cloudinary delivery
  // URL (now the canonical source — see BIPE_IMG.heroWide for the
  // lineage and why Cloudinary). The backend CMS page_section
  // "home/hero" record can hold any of three historical values:
  //
  //   /hero-campus.png   — original 2.45 MB asset (deleted from /public)
  //   /hero-campus.jpg   — 313 KB JPEG (still in /public as fallback)
  //   <cloudinary URL>   — current canonical, set via /admin after
  //                        this commit
  //
  // We normalize the first two to Cloudinary so a stale backend
  // record can't cost us LCP. The fix is a no-op once the backend
  // record is updated via /admin to use the Cloudinary URL directly.
  const rawBgUrl = readString(bg?.url, fallback.bg_image_url);
  const isLegacyHeroPath =
    rawBgUrl === "/hero-campus.png" || rawBgUrl === "/hero-campus.jpg";
  const bg_image_url = isLegacyHeroPath ? BIPE_IMG.heroWide : rawBgUrl;

  return {
    // headline_* also pinned to static fallbacks 28 May 2026 — the
    // backend CMS still serves a singular "Engineer" (grammatically
    // broken: singular subject + plural verb "begin"). The fallback
    // is correctly plural ("Engineers"). Restore CMS wiring once the
    // backend admin record is brought in line.
    headline_pre:   fallback.headline_pre,
    headline_accent: fallback.headline_accent,
    headline_post:  fallback.headline_post,
    // Description is pinned to the static fallback as of 28 May 2026.
    // The backend admin record still carries a stale "1,000+ placed"
    // copy that contradicts the canonical 1,331 TPO-verified figure
    // in lib/data.ts and the Organization schema. Until the admin
    // re-publishes the hero section with the new number, the
    // fallback wins — see lib/data.ts > stats for the source of
    // truth. Restore `readString(c.description, fallback.description)`
    // once the backend has been brought in line.
    description:    fallback.description,
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

      <div
        className="container bipe-hero-pad"
        style={{
          position: "relative",
          // Per-axis padding instead of shorthand so the `.container`
          // class's own horizontal padding (24px desktop / 18px tablet /
          // 16px phone — see app/globals.css) survives. Earlier shorthand
          // `padding: "72px 0 48px"` was zeroing left+right and the
          // hero buttons + headline landed flush against the viewport
          // edge on mobile. Reported 2026-05-20.
          paddingTop: 72,
          paddingBottom: 48,
          color: "var(--paper)",
          zIndex: 2,
        }}
      >
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

          {/*
            Hindi affirmation line (May 2026). BIPE's primary audience
            is Hindi-medium families across UP and Bihar.
            A small Devanagari reassurance immediately above the CTAs
            signals "this site is for you" at the exact moment of
            decision. Kept short (one short clause), low-emphasis
            styling so it doesn't compete with the English brand line
            or the CTAs themselves — but high enough contrast to be
            read at a glance.
          */}
          <p
            lang="hi"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
              padding: "8px 14px",
              fontFamily: "var(--font-serif)",
              fontSize: 14,
              fontStyle: "italic",
              fontWeight: 400,
              lineHeight: 1.4,
              color: "color-mix(in oklab, #fff 88%, transparent)",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid color-mix(in oklab, #fff 18%, transparent)",
              borderRadius: 999,
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "var(--accent)",
              }}
            />
            हिन्दी में बात करें · Hindi-medium families since 2010 · WhatsApp पर तुरंत जवाब
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

        {/*
          In-hero Approvals strip REMOVED 27 May 2026 — duplicated the
          site-wide TrustBadgeStrip (commit af39c72) which renders the
          same institutional credentials right below the Nav on every
          page. Two stacked credential strips read as redundant content
          to visitors. The TrustBadgeStrip is the single source of
          truth now; the backend `home/hero` content section can still
          carry an `approvals` array but it's not rendered here.
        */}
      </div>
    </section>
  );
}
