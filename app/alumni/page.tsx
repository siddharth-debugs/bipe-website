import type { Metadata } from "next";
import { metadataFor } from "@/lib/seo";
import { getAlumni } from "@/lib/content";
import { AlumniView } from "./AlumniView";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("alumni");
}

export default async function Page() {
  const live = await getAlumni();
  // Map snake_case API rows → the camelCase shape <AlumniView /> expects.
  // When the API returns nothing the helper falls back to the static
  // manifest, but for clarity we still hand the empty result through —
  // <AlumniView /> takes care of the final fallback.
  const alumni = live.map((a) => ({
    id: a.id,
    name: a.name,
    branch: a.branch,
    year: a.year,
    company: a.company,
    driveDate: a.drive_date,
    status: a.status,
    role: a.role,
    photo: a.photo_url,
  }));
  return <AlumniView alumni={alumni} />;
}
