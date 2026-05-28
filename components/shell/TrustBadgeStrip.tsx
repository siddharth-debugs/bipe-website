import Link from "next/link";

/**
 * Site-wide trust-badge strip · 6 institutional credentials.
 *
 * Rendered between <Nav> and <main> via ConditionalChrome (not on
 * /admin). Inspired by BITE's site-wide top-band trust strip; BIPE's
 * version surfaces the institutional credentials a polytechnic
 * applicant actually verifies before applying:
 *
 *   - AICTE Approved             linked to /about/affiliations
 *   - BTEUP 4455                 linked to /about/affiliations
 *   - AISHE Registered           linked to /about/affiliations
 *   - AFRC Compliant             linked to /fees
 *   - Since 2010 · 16 years      linked to /about
 *   - 1,331 Placements          linked to /placements
 *
 * Visual design — May 2026 upgrade (Direction A · verified badges):
 *   - Each credential renders as a bordered card with a verified
 *     tick mark (accent-gold filled circle with white check)
 *   - Two-line content: mono uppercase label (12.5px, brand) +
 *     hairline divider + mono detail (11px, ink-2)
 *   - Card hover lifts (translateY) with brand-tinted border + shadow
 *   - Paper-2 → gradient background so the strip announces itself
 *     as the "credentials zone" without competing with the hero
 *   - Strip height ~64px (was ~36px)
 *
 * Each clicks through to the source-of-truth page so the visitor
 * can audit the underlying evidence. That's the BIPE trust model.
 */

const VerifiedTick = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    aria-hidden="true"
    style={{ flexShrink: 0, display: "block" }}
  >
    <circle cx="7" cy="7" r="7" fill="var(--accent, #c8a951)" />
    <path
      d="M3.8 7L6 9.2L10.2 4.5"
      stroke="#fff"
      strokeWidth="1.8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
  { label: "1,331 Placements", detail: "2,200+ alumni network", href: "/placements" },
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
            <span className="trust-pill-head">
              <VerifiedTick />
              <span className="trust-pill-label">{b.label}</span>
            </span>
            <span className="trust-pill-divider" aria-hidden="true" />
            <span className="trust-pill-detail">{b.detail}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
