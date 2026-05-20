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

  // Build the hero preload srcSet mirroring what Img.tsx's
  // cloudinaryLoader produces per Next/Image deviceSize. Without
  // this preload, the browser doesn't start fetching the hero image
  // until it parses the rendered <img>/srcset that React paints —
  // costs ~500 ms on the LCP. Putting a <link rel="preload"> in the
  // returned JSX lets React 19 / Next 16 hoist it to <head> so the
  // request fires the moment the HTML response arrives.
  //
  // Source URL is BIPE_IMG.heroWide (Cloudinary, no fixed w_); we
  // generate the same 5 width-variant URLs the cloudinaryLoader
  // would, with f_auto and q_auto to match. If heroWide changes,
  // both code paths use the new base URL — only this preload
  // template needs the width set kept in sync (matches Next 16
  // defaults: 640, 750, 828, 1080, 1200, 1920).
  const heroBaseUrl = BIPE_IMG.heroWide; // .../f_auto,q_auto/v.../bipe/hero/hero-campus
  const cloudinaryWidthUrl = (w: number) =>
    heroBaseUrl.replace(
      /\/image\/upload\/([^/]+)\//,
      (_, transforms) => {
        const cleaned = transforms
          .split(",")
          .filter((t: string) => !/^(w_|q_|f_)/.test(t));
        return `/image/upload/${[...cleaned, "f_auto", "q_auto", `w_${w}`].join(",")}/`;
      },
    );
  const heroPreloadWidths = [640, 750, 828, 1080, 1200, 1920];
  const heroSrcSet = heroPreloadWidths
    .map((w) => `${cloudinaryWidthUrl(w)} ${w}w`)
    .join(", ");
  const heroPreloadHref = cloudinaryWidthUrl(1080); // mid-range fallback for crawlers / no-srcset

  return (
    <div className="page-enter">
      {/* React 19 / Next 16 hoists <link> elements to <head> when
          rendered inside any server component. Preloading the hero
          image here trims ~500 ms off mobile LCP (verified via
          Lighthouse audit). fetchPriority high outranks every other
          preloaded asset — only the hero gets it. */}
      <link
        rel="preload"
        as="image"
        href={heroPreloadHref}
        imageSrcSet={heroSrcSet}
        imageSizes="100vw"
        fetchPriority="high"
      />
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

