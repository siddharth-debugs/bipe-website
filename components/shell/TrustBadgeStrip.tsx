import Link from "next/link";

/**
 * Site-wide trust-badge strip · 6 institutional credentials.
 *
 * Rendered between <Nav> and <main> via ConditionalChrome (not on
 * /admin). Inspired by BITE's site-wide top-band trust strip
 * (which carries a Sanskrit shloka + accreditation pills); BIPE's
 * version surfaces the institutional credentials a polytechnic
 * applicant actually verifies before applying:
 *
 *   - AICTE Approved             linked to /about/affiliations
 *   - BTEUP 4455                 linked to /about/affiliations
 *   - AISHE Registered           linked to /about/affiliations
 *   - AFRC Compliant             linked to /fees
 *   - Since 2010 · 16 years      linked to /about
 *   - 1,200+ Placements          linked to /placements
 *
 * Visual design — paper-tone background (subtle), brand-navy text,
 * compact pills with two-line content (label + detail). Mobile:
 * horizontal scroll with snap points so the strip doesn't push the
 * hero down. Desktop: single row with comfortable spacing.
 *
 * Why each label clicks through to a different page: every claim
 * here is auditable on a source-of-truth surface. Clicking through
 * gives the visitor the underlying evidence — that's the trust
 * model BIPE has been building since the May 2026 SEO sprint.
 */
interface Badge {
  label: string;
  detail: string;
  href: string;
}

const BADGES: Badge[] = [
  { label: "AICTE Approved", detail: "Permanent ID 1-488233171", href: "/about/affiliations" },
  { label: "BTEUP Affiliated", detail: "JEECUP code 4455", href: "/about/affiliations" },
  { label: "AISHE Registered", detail: "Ministry of Education", href: "/about/affiliations" },
  { label: "AFRC Compliant", detail: "₹30,150/year tuition", href: "/fees" },
  { label: "Since 2010", detail: "16 years on record", href: "/about" },
  { label: "1,200+ Placements", detail: "2,200+ alumni network", href: "/placements" },
];

export function TrustBadgeStrip() {
  return (
    <div
      className="trust-strip"
      role="region"
      aria-label="BIPE institutional credentials"
    >
      <div className="trust-strip-inner">
        {BADGES.map((b) => (
          <Link key={b.label} href={b.href} className="trust-pill">
            <span className="trust-pill-label">{b.label}</span>
            <span className="trust-pill-detail">{b.detail}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
