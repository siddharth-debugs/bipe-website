import type { Metadata } from "next";
import { metadataFor } from "@/lib/seo";
import { getBranchesMapped, getPageSection } from "@/lib/content";
import type { Stat, WhyItem, Facility, JeecupStep } from "@/lib/data";
import { HeroFull } from "@/components/home/HeroFull";
import { BIPE_IMG } from "@/lib/images";
import { StatsBar } from "@/components/home/StatsBar";
import { Recruiters } from "@/components/home/Recruiters";
import { Countdown } from "@/components/home/Countdown";
import { WhyBipe } from "@/components/home/WhyBipe";
import { Branches } from "@/components/home/Branches";
import { JeecupSteps } from "@/components/home/JeecupSteps";
import { CampusLife } from "@/components/home/CampusLife";
import { Testimonials } from "@/components/home/Testimonials";
import { InlineApply } from "@/components/home/InlineApply";
import { News } from "@/components/home/News";
import { FinalCTA } from "@/components/home/FinalCTA";

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
      <StatsBar items={itemsFromSection<Stat>(sStats)} />
      <Recruiters />
      <Countdown />
      <WhyBipe items={itemsFromSection<WhyItem>(sWhy)} />
      <Branches branches={branches} />
      <JeecupSteps items={itemsFromSection<JeecupStep>(sSteps)} />
      <CampusLife items={itemsFromSection<Facility>(sFacilities)} />
      <Testimonials />
      <InlineApply />
      <News />
      <FinalCTA />
    </div>
  );
}

