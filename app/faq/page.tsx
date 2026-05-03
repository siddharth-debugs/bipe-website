import type { Metadata } from "next";
import { metaFor } from "@/lib/routes";
import { PageHeader } from "@/components/ui/PageHeader";
import { FAQ } from "@/components/home/FAQ";

export const metadata: Metadata = metaFor("faq");

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
