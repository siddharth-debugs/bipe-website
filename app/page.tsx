import type { Metadata } from "next";
import { metaFor } from "@/lib/routes";
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
import { FAQ } from "@/components/home/FAQ";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata: Metadata = metaFor("home");

export default function HomePage() {
  return (
    <div className="page-enter">
      <HeroFull />
      <StatsBar />
      <Recruiters />
      <Countdown />
      <WhyBipe />
      <Branches />
      <JeecupSteps />
      <CampusLife />
      <Testimonials />
      <InlineApply />
      <News />
      <FAQ />
      <FinalCTA />
    </div>
  );
}
