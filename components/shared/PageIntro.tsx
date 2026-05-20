import type { PublicPageSection } from "@/lib/content";

/**
 * Admin-managed intro block.
 *
 * Renders only when an `intro` PageSection exists for the page,
 * is_published is true, and at least one of eyebrow/heading/body is
 * non-empty. Used as a no-op fallback on About / Alumni / Placements /
 * Campus / Admission so the admin can drop a banner above the existing
 * editorial copy without a frontend code change.
 */
export function PageIntro({ section }: { section: PublicPageSection | null }) {
  if (!section || !section.is_published) return null;
  const c = section.content as { eyebrow?: string; heading?: string; body?: string };
  const eyebrow = (c.eyebrow ?? "").trim();
  const heading = (c.heading ?? "").trim();
  const body = (c.body ?? "").trim();
  if (!eyebrow && !heading && !body) return null;

  return (
    <section className="section" style={{ background: "var(--paper-2)", paddingTop: 36, paddingBottom: 36 }}>
      <div className="container" style={{ maxWidth: 780 }}>
        {eyebrow && (
          <div className="eyebrow" style={{ marginBottom: 10 }}>{eyebrow}</div>
        )}
        {heading && (
          <h2 className="bipe-h2" style={{ marginBottom: 14, letterSpacing: "-0.015em" }}>
            {heading}
          </h2>
        )}
        {body && (
          <div style={{ color: "var(--ink-2)", lineHeight: 1.7, fontSize: 16, whiteSpace: "pre-wrap" }}>
            {body}
          </div>
        )}
      </div>
    </section>
  );
}
