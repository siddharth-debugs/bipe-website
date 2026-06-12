/**
 * Plain form-option arrays — deliberately zod-FREE.
 *
 * These used to live in lib/validation.ts (next to the zod schemas). That
 * meant any client component importing just the option list — most notably
 * the always-mounted WhatsApp FAB form — dragged zod (~12 KB gzipped) into
 * the SHARED bundle that loads on every page, including blog posts. A
 * Jun 2026 bundle trace (GSC mobile INP work) found zod shipping site-wide
 * for no client-side reason: the FAB / Early-Registration forms validate
 * manually, not via zodResolver.
 *
 * Splitting the option lists out lets those components import the arrays
 * without pulling zod. lib/validation.ts re-exports both names, so the
 * server-side schemas and any genuine zodResolver forms keep a single
 * source — but CLIENT components that only need the lists should import
 * from "@/lib/formOptions" directly.
 *
 * Branch options stay in lockstep with lib/data.ts (5 BTEUP-affiliated
 * branches + a "not sure" guide option).
 */

export const BRANCH_OPTIONS = [
  "Civil Engineering",
  "Electrical Engineering",
  "Mechanical Engineering (Production)",
  "Computer Science & Engineering",
  "Dairy Engineering",
  "Not sure yet — guide me",
] as const;

export const SOURCE_OPTIONS = [
  "Friend / Family",
  "Google search",
  "Newspaper / advertisement",
  "Visited the campus",
  "School counsellor",
  "JEECUP guide",
  "Other",
] as const;
