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
 * Branch options stay in lockstep with lib/data.ts — see BRANCH_CLOSURES
 * there. BIPE is affiliated for 5 branches and admits to 4 of them.
 */

const ADMITTING_BRANCH_LABELS = [
  "Civil Engineering",
  "Electrical Engineering",
  "Mechanical Engineering (Production)",
  "Computer Science & Engineering",
] as const;

/** Closed to new admissions but still a valid stored value. */
const CLOSED_BRANCH_LABELS = ["Dairy Engineering"] as const;

const GUIDE_ME = "Not sure yet — guide me";

/**
 * What a NEW applicant can pick in a public form.
 *
 * Dairy Engineering was removed 3 Sep 2026 when it closed to new
 * admissions. Leaving it in the dropdown would have kept generating
 * enquiries for a branch that cannot be offered, and would have told a
 * family it was still on the table at the exact moment they were
 * choosing. Feeds the 6 public forms (WhatsApp FAB, Enquiry, Apply,
 * Early Registration, LP lead form).
 */
export const BRANCH_OPTIONS = [...ADMITTING_BRANCH_LABELS, GUIDE_ME] as const;

/**
 * Every branch label the system must still ACCEPT and DISPLAY —
 * deliberately a superset of BRANCH_OPTIONS.
 *
 * Validation and admin surfaces use this, NOT BRANCH_OPTIONS, because:
 *   - a form submitted from a page cached before the closure still POSTs
 *     "Dairy Engineering". Validating against the shortened list would
 *     400 it and silently drop a real enquiry — the failure mode is
 *     invisible and costs a lead;
 *   - leads captured while Dairy was open must stay filterable in the
 *     admin inbox instead of disappearing from the follow-up queue;
 *   - enrolled Dairy students teaching out to 2028 are still a real
 *     audience for the follow-up tooling.
 *
 * Never build a public dropdown from this array.
 */
export const BRANCH_OPTIONS_ALL = [
  ...ADMITTING_BRANCH_LABELS,
  ...CLOSED_BRANCH_LABELS,
  GUIDE_ME,
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
