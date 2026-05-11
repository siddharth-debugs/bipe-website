import type { Metadata } from "next";
import { metadataFor } from "@/lib/seo";
import { PageHeader } from "@/components/ui/PageHeader";

export async function generateMetadata(): Promise<Metadata> { return metadataFor("blog"); }

type Post = {
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
};

const POSTS: Post[] = [
  {
    title: "JEECUP 2026 — Step-by-step for Eastern UP families",
    category: "Admission · JEECUP",
    date: "29 Apr 2026",
    readTime: "6 min read",
    excerpt: "A practical walkthrough of the JEECUP 2026 process, from registering on the portal to picking BIPE in counselling, written for first-generation engineering families.",
  },
  {
    title: "Why Dairy Engineering is Eastern UP's most underrated diploma",
    category: "Career · Dairy",
    date: "28 Apr 2026",
    readTime: "5 min read",
    excerpt: "Less than 1.1% of UP polytechnics offer Dairy Engineering. Here's why that scarcity creates an opportunity, especially for students from Mau, Ghazipur and Azamgarh.",
  },
  {
    title: "Government jobs after a polytechnic diploma — the real list",
    category: "Career · Government",
    date: "27 Apr 2026",
    readTime: "7 min read",
    excerpt: "A diploma in engineering opens many central and state government technical roles. Here's the verified list of exams, eligibility, and where BIPE alumni have actually landed.",
  },
];

export default function Page() {
  return (
    <div className="page-enter">
      <PageHeader
        eyebrow="Blog"
        title="Notes from BIPE."
        lead="Practical writing for diploma students and parents in Eastern UP — admission, careers and life on campus."
      />
      <section className="section">
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
            {POSTS.map((p) => (
              // TODO: full post pages aren't built yet — listing only for now.
              <article key={p.title} className="card" style={{ padding: 28 }}>
                <div className="row" style={{ gap: 12, alignItems: "center" }}>
                  <span className="pill pill-accent" style={{ fontSize: 11 }}>{p.category}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)" }}>{p.date}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)" }}>· {p.readTime}</span>
                </div>
                <h2 className="bipe-h3" style={{ marginTop: 12, fontSize: 24 }}>{p.title}</h2>
                <p style={{ color: "var(--ink-2)", fontSize: 15, marginTop: 12, lineHeight: 1.65 }}>{p.excerpt}</p>
              </article>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 24, fontSize: 13 }}>Full posts coming soon.</p>
        </div>
      </section>
    </div>
  );
}
