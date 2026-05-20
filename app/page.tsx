import type { Metadata } from "next";
import { metadataFor } from "@/lib/seo";
import { getBranchesMapped, getPageSection } from "@/lib/content";
import type { Stat, WhyItem, Facility, JeecupStep } from "@/lib/data";
import { HeroFull } from "@/components/home/HeroFull";
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

  return (
    <div className="page-enter">
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

