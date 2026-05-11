import type { Metadata } from "next";
import { metadataFor } from "@/lib/seo";
import { PageHeader } from "@/components/ui/PageHeader";
import { FAQ } from "@/components/home/FAQ";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("faq"); }

export default function Page() {
  return (
    <div className="page-enter">
      <PageHeader
        eyebrow="FAQ"
        title="Asked & answered."
        lead="Common questions on admission, fees, scholarships, hostel and campus life, placements and approvals — answered with facts from across the BIPE site."
      />
      <FAQ />
    </div>
  );
}
