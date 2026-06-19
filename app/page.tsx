import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { metadataFor } from "@/lib/seo";
import { getBranchesMapped, getPageSection } from "@/lib/content";
import type { Stat, WhyItem, Facility, JeecupStep } from "@/lib/data";
import Link from "next/link";
import { HeroFull } from "@/components/home/HeroFull";
import { BIPE_IMG } from "@/lib/images";
import { StatsBar } from "@/components/home/StatsBar";
import { Recruiters } from "@/components/home/Recruiters";
import { ScholarshipStrip } from "@/components/home/ScholarshipStrip";
import { WhyBipe } from "@/components/home/WhyBipe";
import { JeecupSteps } from "@/components/home/JeecupSteps";
import { CampusLife } from "@/components/home/CampusLife";
import { Testimonials } from "@/components/home/Testimonials";
import ReviewsCarousel from "@/components/home/ReviewsCarousel";
import { News } from "@/components/home/News";
import { FinalCTA } from "@/components/home/FinalCTA";

/**
 * Below-the-fold client components deferred via next/dynamic.
 *
 * Why: GSC's INP report (May 2026) flagged 303ms on mobile. Each
 * 'use client' component on the page contributes to hydration cost
 * on first interaction. Below-the-fold heavy ones (form state,
 * setInterval timers, carousel state) cost most.
 *
 * ssr: true means the HTML still renders server-side (preserves SEO
 * content + LCP), but the JS chunk loads in a separate request that
 * Next.js's chunk-priority logic can defer until after the visible
 * portion has hydrated.
 *
 *   InlineApply   — form with useState x4 + fetch handler.
 *                   Biggest hydration cost on the homepage.
 *   Countdown     — has setInterval timer in useEffect; chunk runs
 *                   continuously after mount.
 *   Branches      — carousel state with CrossfadeSlider; multiple
 *                   useState calls per branch card.
 *
 * Other client components on the homepage (StatsBar, Counter, WhyBipe,
 * JeecupSteps, CampusLife, Testimonials, News, FinalCTA) are either
 * (a) above the fold OR (b) small enough that chunk-split overhead
 * outweighs the deferral benefit. Left as direct imports.
 */
const Countdown = dynamic(
  () => import("@/components/home/Countdown").then((m) => m.Countdown),
  { ssr: true },
);
const Branches = dynamic(
  () => import("@/components/home/Branches").then((m) => m.Branches),
  { ssr: true },
);
const InlineApply = dynamic(
  () => import("@/components/home/InlineApply").then((m) => m.InlineApply),
  { ssr: true },
);

export async function generateMetadata(): Promise<Metadata> { return metadataFor("home"); }

/**
 * Pluck an `items` array from a generic PageSection's content, falling
 * back to undefined when missing or unpublished so the component's own
 * static-DATA fallback kicks in cleanly.
 */
function itemsFromSection<T>(section: Awaited<ReturnType<typeof getPageSection>>): T[] | undefined {
  if (!section || !section.is_published) return undefined;
  const raw = (section.content as { items?: unknown }).items;
  return Array.isArray(raw) ? (raw as T[]) : undefined;
}

export default async function HomePage() {
  // Fetch every backend-fed surface in parallel so the home page
  // doesn't gain a sequential waterfall of round-trips. All getters
  // share the same 5-min in-memory bundle cache underneath so this is
  // effectively one network call.
  const [branches, sStats, sWhy, sFacilities, sSteps] = await Promise.all([
    getBranchesMapped(),
    getPageSection("home", "stats"),
    getPageSection("home", "why-bipe"),
    getPageSection("home", "facilities"),
    getPageSection("home", "jeecup-steps"),
  ]);

  // Hero preload variables (heroBaseUrl, cloudinaryWidthUrl,
  // heroPreloadWidths, heroSrcSet, heroPreloadHref) were removed
  // alongside the custom <link rel="preload"> below. See the JSX
  // comment for the LCP-regression context.

  return (
    <div className="page-enter">
      {/*
        Custom <link rel="preload"> for the hero was REMOVED (May 24, 2026).
        GSC CrUX flagged 4.3s LCP on mobile; one of the causes was that
        the hero was being preloaded TWICE — once by this explicit <link>
        and once by Next.js's auto-preload that's generated whenever an
        <Image priority> renders. The duplicate preload didn't perfectly
        match URLs (one had w_1080 in href, the other had a different
        fallback), so the browser was fetching the hero twice instead of
        deduplicating.

        Next.js's auto-preload — emitted from the <Image priority> in
        components/home/HeroFull.tsx — is now the single source of truth.
        It generates the same srcset that the rendered <img> uses, so the
        preload URL is GUARANTEED to match the image the browser actually
        loads. No risk of a "wrong variant preloaded" bug.

        If LCP doesn't improve from this fix, the next lever is enabling
        Cloudinary's account-level Auto-AVIF toggle (user action) — the
        hero is currently served as JPEG because f_auto falls back to
        JPEG when AVIF is disabled at the account.
      */}
      <HeroFull />

      {/* JEECUP 2026 · RESULT OUT — results-day announcement (15 Jun 2026,
          replacing the generic early-reg strip). Two actions: check the result
          (our /jeecup-result-2026 explainer → official portal) and lock a seat
          + branch + ₹1,200 PET scholarship via /early-registration. */}
      <aside
        aria-label="JEECUP 2026 result announcement"
        className="jeecup-result-bar"
        style={{ background: "var(--ink)", color: "var(--paper)", borderTop: "3px solid var(--accent)", borderBottom: "1px solid color-mix(in oklab, var(--accent) 40%, transparent)" }}
      >
        <div
          className="container"
          style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, padding: "16px", flexWrap: "wrap", textAlign: "center" }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <span className="row" style={{ alignItems: "center", gap: 8 }}>
              <span className="live-dot" />
              <span className="eyebrow" style={{ color: "var(--accent)", margin: 0, whiteSpace: "nowrap" }}>JEECUP 2026 · Result Out</span>
            </span>
            <span style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.4 }}>
              JEECUP 2026 results are out — lock your branch at BIPE (code 4455) before counselling.
              <span style={{ display: "block", fontWeight: 400, fontSize: 13, opacity: 0.82, marginTop: 2 }}>
                जेईईसीयूपी 2026 का रिज़ल्ट आ गया है — अपनी सीट और ब्रांच अभी सुरक्षित करें।
              </span>
            </span>
          </span>
          <span className="row" style={{ gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <Link
              href="/jeecup-result-2026"
              className="btn btn-sm"
              style={{ background: "color-mix(in oklab, var(--paper) 16%, transparent)", color: "var(--paper)", border: "1px solid color-mix(in oklab, var(--paper) 30%, transparent)", whiteSpace: "nowrap" }}
            >
              Check your result →
            </Link>
            <Link href="/early-registration" className="btn btn-primary btn-sm jeecup-result-cta" style={{ whiteSpace: "nowrap" }}>
              Register Now →
            </Link>
          </span>
        </div>
      </aside>
      {/*
        StatsBar is no longer wired to the backend PageSection.
        Reason 28 May 2026: the Django admin had stale stats
        ("1,000+ Successful alumni · Mahindra · Tata · BEL") that
        contradicted the canonical 2,200+ alumni network / 1,331
        TPO-verified placements maintained in lib/data.ts. Until the
        backend admin UI is brought in line, the homepage reads
        stats from DATA.stats (default fallback inside StatsBar) so
        the canonical numbers stay consistent with the rest of the
        site. Re-wire items={itemsFromSection<Stat>(sStats)} when
        the backend stats row is verified clean.
      */}
      <StatsBar />
      <Recruiters />
      {/* 28 May 2026 — Trust 50% scholarship strip added per user
          direction. Anchors the top-2,000-JEECUP-rank / 50% offer
          right under the recruiter marquee so strong candidates see
          it before they leave the homepage. /scholarships carries the
          full policy + Hindi FAQ; /fees Scenario card 02 carries the
          worked-example net figure (₹15,075/year). */}
      <ScholarshipStrip />
      <Countdown />
      {/* WhyBipe items also pinned to DATA.whyBipe (28 May 2026) for the
          same reason as StatsBar above: the backend CMS still carries the
          stale "Eastern UP-built. Thousands placed." text contradicting
          the canonical 1,331 / regional-positioning instructions. Restore
          items={itemsFromSection<WhyItem>(sWhy)} once the backend admin
          record is brought in line. */}
      <WhyBipe />
      <Branches branches={branches} />
      <JeecupSteps items={itemsFromSection<JeecupStep>(sSteps)} />
      <CampusLife items={itemsFromSection<Facility>(sFacilities)} />
      <Testimonials />
      <InlineApply />
      <ReviewsCarousel />
      <News />
      <FinalCTA />
    </div>
  );
}

