import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, WhatsAppIcon, PhoneIcon } from "@/components/shell/Icons";
import { DATA } from "@/lib/data";
import { SITE_URL } from "@/lib/routes";
import { PLACEMENT_STATS, formatPlacements } from "@/lib/placement-stats";
import { BLOG_POSTS } from "@/lib/blogPosts";

/**
 * Custom 404 — replaces Next.js's default plain text "Not Found"
 * with an editorial page that:
 *
 *  1. Communicates the missing-page state in BIPE's voice
 *  2. Routes the visitor back to the popular destinations they
 *     probably wanted (Apply, JEECUP, Fees, Courses, Placements,
 *     Blog, Contact)
 *  3. Offers /search as a fallback if no preset matches their intent
 *
 * SEO posture: no-index. A 404 page being indexed would just dilute
 * the site's authority and could cannibalise "BIPE" queries. The
 * Next.js framework already serves HTTP 404 for this component;
 * we additionally declare robots: noindex,follow so any crawler
 * that does happen to fetch it doesn't bank the page.
 *
 * Why noindex,follow (not noindex,nofollow):
 *   The internal links to /apply, /courses, etc. on this page are
 *   still useful PageRank conduits — letting crawlers follow them
 *   helps the linked pages, doesn't help the 404 itself.
 */
export const metadata: Metadata = {
  title: "Page not found · BIPE",
  description:
    "The page you were looking for doesn't exist or has moved. Try Apply for 2026-27, JEECUP guidance, the 4 diploma branches admitting this session, or search across BIPE.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    title: "Page not found · BIPE",
    description: "The page you were looking for doesn't exist or has moved.",
    url: `${SITE_URL}/`,
    siteName: "BIPE",
    type: "website",
    locale: "en_IN",
  },
};

const POPULAR_DESTINATIONS: {
  label: string;
  hi: string;
  href: string;
  body: string;
}[] = [
  { label: "Apply for 2026-27", hi: "आवेदन करें", href: "/apply", body: "Five-minute application form, callback within 24 hours." },
  { label: "JEECUP Counselling", hi: "जेईईसीयूपी काउंसलिंग", href: "/jeecup-counselling", body: "Six-step counselling explainer — institute code 4455." },
  // 3 Sep 2026 — was "All 5 branches" / "CSE, Dairy, Civil, Electrical,
  // Mechanical Engineering (Production)". A nav card is a list of things
  // you can go and pick, so it names the four branches open for 2026-27.
  // Dairy Engineering closed to new admissions from 2026-27 and its page
  // is still live for the cohort finishing in 2028 — /courses links it.
  { label: "The 4 branches admitting", hi: "शाखाएँ", href: "/courses", body: "Civil, CSE, Electrical, Mechanical Engineering (Production) — open for 2026-27." },
  { label: "Fees & scholarships", hi: "शुल्क और छात्रवृत्ति", href: "/fees", body: "AFRC-approved ₹30,150/year. UP post-matric and EWS support." },
  { label: "Placement record", hi: "प्लेसमेंट रिकॉर्ड", href: "/placements", body: `${formatPlacements(PLACEMENT_STATS.totalPlacements)} verified placements through ${PLACEMENT_STATS.endYear}. ${PLACEMENT_STATS.totalRecruiters} recruiters.` },
  { label: "Visit the campus", hi: "कैम्पस देखें", href: "/visit", body: "~35 min from Varanasi Cantt by auto. Mon–Sat 9 AM – 5 PM." },
  { label: "Blog", hi: "ब्लॉग", href: "/blog", body: `${BLOG_POSTS.length} long-form guides on admission, syllabus, JEECUP and careers.` },
  { label: "Search BIPE", hi: "खोजें", href: "/search", body: "Type to filter every page and post on this site." },
];

export default function NotFoundPage() {
  return (
    <div className="page-enter">
      {/* ── Editorial hero ──────────────────────────────────────────── */}
      <section
        className="section bipe-pad"
        style={{
          position: "relative",
          overflow: "hidden",
          paddingTop: 72,
          paddingBottom: 56,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: -160,
            top: -160,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "color-mix(in oklab, var(--accent) 30%, transparent)",
            filter: "blur(120px)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative" }}>
          <div
            style={{
              display: "inline-block",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--accent-deep, var(--accent))",
              padding: "5px 14px",
              border: "1px solid color-mix(in oklab, var(--accent) 40%, transparent)",
              borderRadius: 999,
              background: "color-mix(in oklab, var(--accent) 8%, transparent)",
              marginBottom: 24,
            }}
          >
            404 · Page not found
          </div>

          <h1
            className="bipe-h1"
            style={{ maxWidth: "20ch", marginBottom: 22 }}
          >
            That page{" "}
            <span
              className="serif"
              style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}
            >
              isn&rsquo;t here.
            </span>
          </h1>
          <p
            className="lead"
            style={{ maxWidth: "60ch", color: "var(--ink-2)", lineHeight: 1.7 }}
          >
            Either the link is old, the page has moved, or someone made a
            typo. No drama — the most-visited corners of the site are right
            below, plus a search if none of them fit.
          </p>

          <div
            className="row"
            style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}
          >
            <Link href="/" className="btn btn-primary btn-lg">
              Back to BIPE home <ArrowIcon size={16} />
            </Link>
            <Link href="/search" className="btn btn-ghost btn-lg">
              Search the site <ArrowIcon size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Popular destinations grid ───────────────────────────────── */}
      <section
        className="section"
        style={{ paddingTop: 32, paddingBottom: 56 }}
      >
        <div className="container">
          <div className="eyebrow">Where most visitors go</div>
          <h2
            className="bipe-h1"
            style={{ marginTop: 14, marginBottom: 30, fontSize: 36, maxWidth: "24ch" }}
          >
            Pick a starting point{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              from here.
            </span>
          </h2>

          <div
            className="bipe-grid-4"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {POPULAR_DESTINATIONS.map((d) => (
              <Link
                key={d.href}
                href={d.href}
                className="card"
                style={{
                  padding: 22,
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  transition: "transform 0.15s, border-color 0.2s",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--ink-3)",
                  }}
                >
                  {d.hi}
                </div>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    color: "var(--ink-1)",
                    margin: 0,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {d.label}
                </h3>
                <p
                  style={{
                    color: "var(--ink-2)",
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {d.body}
                </p>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: "auto",
                    color: "var(--brand)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  Open <ArrowIcon size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Talk to admissions strip ────────────────────────────────── */}
      <section
        className="section"
        style={{
          background: "var(--paper-2)",
          paddingTop: 36,
          paddingBottom: 36,
        }}
      >
        <div className="container">
          <div
            className="bipe-split"
            style={{
              display: "grid",
              gridTemplateColumns: "1.3fr 1fr",
              gap: 24,
              alignItems: "center",
            }}
          >
            <div>
              <div className="eyebrow">Or just talk to a person</div>
              <h3
                style={{
                  marginTop: 8,
                  fontSize: 22,
                  fontWeight: 600,
                  color: "var(--ink-1)",
                  letterSpacing: "-0.01em",
                }}
              >
                Admissions Mon–Sat · 9 AM – 5 PM.
              </h3>
              <p
                style={{
                  marginTop: 8,
                  color: "var(--ink-2)",
                  fontSize: 14,
                  lineHeight: 1.65,
                  maxWidth: "52ch",
                }}
              >
                If you got here from a link in a brochure or social-media
                post, message us — we&rsquo;ll point you at the right page
                and update the link if it&rsquo;s ours.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <a
                href={DATA.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa"
              >
                <WhatsAppIcon /> WhatsApp
              </a>
              <a href={`tel:${DATA.contact.phone}`} className="btn btn-ghost">
                <PhoneIcon /> {DATA.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
