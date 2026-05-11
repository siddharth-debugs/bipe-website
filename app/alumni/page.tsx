import type { Metadata } from "next";
import { metadataFor } from "@/lib/seo";
import { AlumniView } from "./AlumniView";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("alumni");
}

export default function Page() {
  return <AlumniView />;
}
