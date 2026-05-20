import type { Metadata } from "next";
import { metadataFor } from "@/lib/seo";
import { PageHeader } from "@/components/ui/PageHeader";
import { FAQ } from "@/components/home/FAQ";
import { DATA, type FAQItem } from "@/lib/data";
import { getPageSection } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("faq"); }

export default async function Page() {
  // Pull live FAQ items from the home/faq PageSection — same source
  // the home page's FAQ section reads. Falls back to DATA.faq when
  // the section is missing or unpublished.
  const section = await getPageSection("home", "faq");
  const rawItems = section && section.is_published
    ? (section.content as { items?: unknown }).items
    : undefined;
  const items: FAQItem[] = Array.isArray(rawItems) ? (rawItems as FAQItem[]) : DATA.faq;

  // JSON-LD has to mirror what the page renders so search engines and
  // AI extractors get the same Q&As visitors see.
  const FAQ_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

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
      <FAQ items={items} />
    </div>
  );
}
