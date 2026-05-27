import type { Metadata } from "next";
import { metadataFor } from "@/lib/seo";
import JeecupResourceTemplate from "@/components/jeecup/JeecupResourceTemplate";
import { jeecupResourceBySlug } from "@/lib/jeecup-resources";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("jeecupPreviousPapers");
}

export default function Page() {
  const data = jeecupResourceBySlug("jeecup-previous-year-papers");
  if (!data) return null;
  return <JeecupResourceTemplate data={data} />;
}
