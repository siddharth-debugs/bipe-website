import type { Metadata } from "next";
import { metadataFor } from "@/lib/seo";
import CatchmentTemplate from "@/components/catchment/CatchmentTemplate";
import { catchmentBySlug } from "@/lib/catchments";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("polytechnicInBhadohi");
}

export default function Page() {
  const data = catchmentBySlug("bhadohi");
  if (!data) return null;
  return <CatchmentTemplate data={data} />;
}
