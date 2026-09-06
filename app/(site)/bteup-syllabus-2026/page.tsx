import type { Metadata } from "next";
import { metadataFor } from "@/lib/seo";
import BteupResourceTemplate from "@/components/bteup/BteupResourceTemplate";
import { bteupResourceBySlug } from "@/lib/bteup-resources";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("bteupSyllabus");
}

export default function Page() {
  const data = bteupResourceBySlug("bteup-syllabus-2026");
  if (!data) return null;
  return <BteupResourceTemplate data={data} />;
}
