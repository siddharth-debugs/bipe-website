import type { Metadata } from "next";
import { metadataFor } from "@/lib/seo";
import JeecupResourceTemplate from "@/components/jeecup/JeecupResourceTemplate";
import { jeecupResourceBySlug } from "@/lib/jeecup-resources";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("jeecupRankPredictor");
}

export default function Page() {
  const data = jeecupResourceBySlug("jeecup-rank-predictor-2026");
  if (!data) return null;
  return <JeecupResourceTemplate data={data} />;
}
