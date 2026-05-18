import type { Metadata } from "next";
import { metadataFor } from "@/lib/seo";
import { PageHeader } from "@/components/ui/PageHeader";
import { FAQ } from "@/components/home/FAQ";
import { DATA } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("faq"); }

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: DATA.faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Page() {
  return (
    <div className="page-enter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <PageHeader
        eyebrow="FAQ"
        title="Asked & answered."
        lead="Common questions on admission, fees, scholarships, hostel and campus life, placements and approvals — answered with facts from across the BIPE site."
      />
      <FAQ />
    </div>
  );
}
