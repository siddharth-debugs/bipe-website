import type { Metadata } from "next";
import { metadataFor } from "@/lib/seo";
import { getBranchesMapped } from "@/lib/content";
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

export default async function HomePage() {
  const branches = await getBranchesMapped();
  return (
    <div className="page-enter">
      <HeroFull />
      <StatsBar />
      <Recruiters />
      <Countdown />
      <WhyBipe />
      <Branches branches={branches} />
      <JeecupSteps />
      <CampusLife />
      <Testimonials />
      <InlineApply />
      <News />
      <FinalCTA />
    </div>
  );
}
