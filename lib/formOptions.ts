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
 * Branch options stay in lockstep with lib/data.ts.
 */

const PUBLIC_BRANCH_LABELS = [
  "Civil Engineering",
  "Electrical Engineering",
  "Mechanical Engineering (Production)",
  "Computer Science & Engineering",
] as const;

/** Retired from the public site but still a valid stored value. */
const RETIRED_BRANCH_LABELS = ["Dairy Engineering"] as const;

const GUIDE_ME = "Not sure yet — guide me";

/**
 * What an applicant can pick in a public form. Feeds the 6 public forms
 * (WhatsApp FAB, Enquiry, Apply, Early Registration, LP lead form).
 */
export const BRANCH_OPTIONS = [...PUBLIC_BRANCH_LABELS, GUIDE_ME] as const;

/**
 * Every branch label the system must still ACCEPT and DISPLAY —
 * deliberately a superset of BRANCH_OPTIONS.
 *
 * Validation and admin surfaces use this, NOT BRANCH_OPTIONS, because:
 *   - a form submitted from a page cached before a list change still POSTs
 *     the old label. Validating against the shortened list would 400 it
 *     and silently drop a real enquiry — the failure mode is invisible
 *     and costs a lead;
 *   - leads already captured must stay filterable in the admin inbox
 *     instead of disappearing from the follow-up queue.
 *
 * Never build a public dropdown from this array.
 */
export const BRANCH_OPTIONS_ALL = [
  ...PUBLIC_BRANCH_LABELS,
  ...RETIRED_BRANCH_LABELS,
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

/**
 * The `source` an /alumni introduction request is stored under.
 *
 * Written ONLY by the alumni-contact branch of /api/submit. The admin Inbox
 * classifies rows by this value and drops those groups out of every
 * admissions view, so it decides whether a submission is triaged at all.
 *
 * Named here rather than repeated as a literal because it is now load-bearing
 * in three places — the writer, the guard that stops a client claiming it, and
 * the Inbox predicate that reads it.
 */
export const SOURCE_ALUMNI_INTRO = "alumni-intro";

/**
 * Sources only the server may set. A client sending one of these on the
 * enquiry form (the one kind whose `source` is free text rather than the
 * SOURCE_OPTIONS enum) is refused — see the enquiry branch of
 * app/api/submit/route.ts.
 *
 * NOT the place for "early-registration": that one is legitimately set by the
 * client at app/early-registration/EarlyRegistrationForm.tsx, and an early-reg
 * group still appears under "All" in the Inbox, so claiming it hides nothing.
 */
export const SERVER_ONLY_SOURCES: readonly string[] = [SOURCE_ALUMNI_INTRO];
