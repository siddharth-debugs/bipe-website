/**
 * Schema.org Person JSON-LD generator for BIPE faculty.
 *
 * Why this lives in a shared lib:
 *
 *   The same Person node is emitted from two pages — /faculty (where
 *   every academic faculty member appears in an ItemList) and /principal
 *   (where the Principal appears as a single ProfilePage anchor). Lifting
 *   the shape into one file means the alumniOf parsing rules and the
 *   worksFor reference stay consistent across both surfaces.
 *
 * What the schema does:
 *
 *   - Builds Knowledge-Graph connectivity. Google links Person → worksFor
 *     → CollegeOrUniversity (BIPE) → LocalBusiness (the layout.tsx node).
 *     Strong graph signals help rank "BIPE Varanasi" head queries and
 *     reduce conflation with BITE.
 *
 *   - Earns rich-result eligibility on the /principal ProfilePage —
 *     Google can surface name + job title + photo + alumniOf details in
 *     a richer card than a plain title/snippet pair.
 *
 *   - Validates faculty as real, named teachers — Google trusts named
 *     people with institutional affiliations more than the generic
 *     "40+ faculty" claim that fly-by-night institutions tend to make.
 */
import type { Faculty } from "./faculty";
import { SITE_URL } from "./routes";

/**
 * The BIPE Organization node referenced by every faculty member's
 * `worksFor`. Kept terse — Google de-duplicates Organization references
 * by URL, so the full LocalBusiness node in layout.tsx remains canonical.
 */
const BIPE_ORG_REF = {
  "@type": "CollegeOrUniversity",
  name: "Banaras Institute of Polytechnic & Engineering",
  url: SITE_URL,
} as const;

/**
 * Parse the institution name out of a qualification string.
 *
 * Format conventions seen in lib/faculty.ts:
 *
 *   "M.Tech (Nano Science & Technology), Jadavpur University, Kolkata"
 *      → splits to: ["M.Tech (Nano Science & Technology)",
 *                    " Jadavpur University", " Kolkata"]
 *      → institution = "Jadavpur University"
 *
 *   "B.Tech (Mechanical Engineering), SMS IT Lucknow (AKTU UP)"
 *      → institution = "SMS IT Lucknow (AKTU UP)"
 *
 *   "M.Tech (Mechanical Engineering)"
 *      → no second part — return null (don't emit a partial alumniOf)
 *
 * The parser also strips trailing year suffixes like ", 2013" and the
 * " — pursuing" marker that we use for in-progress degrees.
 */
function parseInstitution(qual: string): string | null {
  // Split on the FIRST comma after the closing paren of "(field)".
  // Simple split-by-comma approach: first comma in the string is always
  // the degree/field boundary, second-onwards are institution + city/etc.
  const parts = qual.split(",").map((p) => p.trim());
  if (parts.length < 2) return null;

  const candidate = parts[1];
  if (!candidate) return null;

  // Strip the "— pursuing" marker — alumniOf shouldn't claim a degree
  // that's still in progress, but for graph purposes the affiliation is
  // still legitimate.
  return candidate.replace(/\s*[—-]\s*pursuing\s*$/i, "").trim() || null;
}

/**
 * Build the Schema.org Person node for one faculty member.
 *
 * Fields populated when the underlying Faculty record has them — we
 * omit empty/optional fields rather than emit empty strings, since
 * Google's parser treats `""` as a real value (and a broken link).
 */
export function personSchema(f: Faculty): Record<string, unknown> {
  const node: Record<string, unknown> = {
    "@type": "Person",
    "@id": `${SITE_URL}/faculty#${f.id}`,
    name: f.name,
    jobTitle: f.designation,
    worksFor: BIPE_ORG_REF,
  };

  if (f.photo) {
    // Absolute URLs only — Google's structured-data parser silently
    // drops relative image paths from the rich-result candidate.
    node.image = `${SITE_URL}${f.photo}`;
  }

  if (f.highlight) {
    node.description = f.highlight;
  }

  // alumniOf — collect every parseable institution from qualifications.
  const alumni = f.qualifications
    .map(parseInstitution)
    .filter((name): name is string => Boolean(name))
    // De-duplicate when a faculty lists multiple degrees from the same
    // institution (e.g. integrated M.Tech).
    .filter((name, i, arr) => arr.indexOf(name) === i)
    .map((name) => ({
      "@type": "EducationalOrganization",
      name,
    }));

  if (alumni.length > 0) {
    node.alumniOf = alumni;
  }

  // hasCredential — list each degree as a credential. This is more
  // semantically correct than dumping the raw qualification strings
  // into alumniOf, and Google indexes it for the ProfilePage rich
  // result on /principal.
  const credentials = f.qualifications.map((q) => ({
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "degree",
    name: q,
  }));
  if (credentials.length > 0) {
    node.hasCredential = credentials;
  }

  return node;
}
