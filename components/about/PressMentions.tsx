import Image from "next/image";
import { PRESS_MENTIONS } from "@/lib/press-mentions";
import { SITE_URL } from "@/lib/routes";

/**
 * Schema.org NewsArticle @graph for the 6 curated press clippings.
 *
 * Why NewsArticle (not generic Article):
 *
 *   These are real news articles from named publications (Hindustan,
 *   Amar Ujala, etc.) covering BIPE events. NewsArticle is the
 *   purpose-built Schema.org type for this — it lets Google
 *   recognize them as third-party coverage rather than mistaking
 *   them for BIPE's own content.
 *
 * Why no `url` field on each NewsArticle:
 *
 *   These are physical print clippings scanned from print editions —
 *   they have no canonical online URL. Schema.org allows NewsArticle
 *   without a url; Google's parser accepts it. The article is
 *   identified by headline + publisher + datePublished, which is
 *   sufficient for entity-graph deduplication.
 *
 * Why each carries `about: BIPE`:
 *
 *   That's the load-bearing edge. Each NewsArticle is third-party
 *   coverage ABOUT BIPE, so a search engine following the graph from
 *   Hindustan / Amar Ujala / Aaj → about → BIPE has 6 independent
 *   "this is a real institution covered in real Hindi press" votes.
 *   Particularly valuable for the BIPE-vs-BITE disambiguation
 *   problem flagged in the May 2026 SEO audit.
 *
 * inLanguage: "hi" — all 6 clippings are Hindi-language. The
 * `headlineEn` field in our data is our English translation for
 * accessibility (alt text, screen readers); the Hindi headline is
 * the authoritative one and goes into `headline`. Google's parser
 * pairs inLanguage="hi" with the Hindi headline correctly.
 */
const BIPE_REF = {
  "@type": "CollegeOrUniversity",
  name: "Banaras Institute of Polytechnic & Engineering",
  url: SITE_URL,
} as const;

const PRESS_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": PRESS_MENTIONS.map((m) => ({
    "@type": "NewsArticle",
    "@id": `${SITE_URL}/about#${m.id}`,
    headline: m.headlineHi,
    alternativeHeadline: m.headlineEn,
    inLanguage: "hi",
    datePublished: m.dateISO,
    publisher: {
      "@type": "NewsMediaOrganization",
      name: m.publication,
    },
    about: BIPE_REF,
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}${m.src}`,
      caption: m.headlineEn,
    },
    // The 6 clippings are all in our /public/ folder; absent a
    // canonical online article URL, this anchors the @id to the
    // /about page where the rendered card lives.
    mainEntityOfPage: `${SITE_URL}/about#press`,
  })),
};

/**
 * "In the press" section on /about. Renders the curated set in
 * lib/press-mentions.ts as a 3-column grid (1-col on mobile) of
 * scanned clippings — one per publication, masthead-readable.
 *
 * Each card is a static figure: photo of the clipping + English
 * caption + original Hindi headline chip + summary + publication
 * tag. No lightbox / modal — the source is shipped at ~250 KB so
 * the figure is already legible at desktop sizes, and adding a
 * lightbox would push this from a 1-commit feature to a 3-commit
 * feature for marginal value.
 *
 * Server component by design — pure data, no client state, no
 * interactivity.
 */
export default function PressMentions() {
  return (
    <section id="press" className="section" style={{ background: "var(--paper-2)", position: "relative", overflow: "hidden" }}>
      {/* NewsArticle JSON-LD @graph — see PRESS_JSON_LD above for the
          design rationale. Six third-party Hindi-press attestations
          binding to BIPE's entity graph via `about`. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRESS_JSON_LD) }}
      />
      <div aria-hidden="true" style={{
        position: "absolute", right: -160, top: -120, width: 420, height: 420, borderRadius: "50%",
        background: "color-mix(in oklab, var(--accent) 16%, transparent)",
        filter: "blur(140px)", pointerEvents: "none",
      }} />
      <div className="container" style={{ position: "relative" }}>
        <div
          className="bipe-split"
          style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 32, alignItems: "end", marginBottom: 48, paddingBottom: 28, borderBottom: "1px solid var(--line)" }}
        >
          <div>
            <div className="eyebrow">In the press</div>
            <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "18ch" }}>
              Six clippings.{" "}
              <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
                Six newsrooms.
              </span>{" "}
              On the public record.
            </h2>
          </div>
          <p style={{ color: "var(--ink-2)", maxWidth: "44ch", justifySelf: "end", textAlign: "right" }}>
            Hindustan, Amar Ujala and four regional Hindi dailies have covered Spardha, Technofest and the on-campus placement drives at BIPE Phoolpur since 2020. Originals scanned from print editions.
          </p>
        </div>

        <ul
          className="bipe-form-row"
          style={{
            listStyle: "none", padding: 0, margin: 0,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {PRESS_MENTIONS.map((m) => (
            <li key={m.id} className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <figure style={{ margin: 0, position: "relative", aspectRatio: "4 / 5", background: "var(--ink-soft, #eef1f6)" }}>
                <Image
                  src={m.src}
                  alt={`${m.publication}, ${m.dateLabel} — ${m.headlineEn}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 22vw"
                  style={{ objectFit: "cover", objectPosition: "top center" }}
                />
              </figure>

              <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em",
                      textTransform: "uppercase", color: "var(--brand)",
                      fontWeight: 600,
                    }}
                  >
                    {m.publication}
                  </span>
                  {m.scope === "national" && (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        background: "color-mix(in oklab, var(--brand) 12%, transparent)",
                        color: "var(--brand)", padding: "2px 7px", borderRadius: 4,
                      }}
                    >
                      National
                    </span>
                  )}
                  <span style={{ width: 4, height: 4, borderRadius: 999, background: "var(--accent)" }} />
                  <span
                    style={{
                      fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em",
                      color: "var(--ink-3)",
                    }}
                  >
                    {m.dateLabel}
                  </span>
                </div>

                <h3 className="bipe-h3" style={{ fontSize: 18, lineHeight: 1.3, margin: 0 }}>
                  {m.headlineEn}
                </h3>

                <p
                  className="serif"
                  lang="hi"
                  style={{
                    fontStyle: "italic", fontSize: 14, lineHeight: 1.45,
                    color: "var(--ink-2)", margin: 0,
                  }}
                >
                  {m.headlineHi}
                </p>

                <p style={{ color: "var(--ink-2)", fontSize: 14, lineHeight: 1.55, margin: 0, marginTop: "auto" }}>
                  {m.summary}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p
          style={{
            marginTop: 28, color: "var(--ink-3)", fontSize: 13,
            fontFamily: "var(--font-mono)", letterSpacing: "0.08em",
          }}
        >
          Scanned from print editions. Full set on file at the institute &mdash; ask at the front desk.
        </p>
      </div>
    </section>
  );
}
