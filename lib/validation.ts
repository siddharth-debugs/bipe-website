import { z } from "zod";
import { BRANCH_OPTIONS, BRANCH_OPTIONS_ALL, SOURCE_OPTIONS } from "./formOptions";

// Re-export for back-compat: the server schemas below + any genuine
// zodResolver forms still import these from here. CLIENT components that
// need ONLY the option lists should import from "@/lib/formOptions"
// directly, so they don't pull zod into their bundle.
export { BRANCH_OPTIONS, BRANCH_OPTIONS_ALL, SOURCE_OPTIONS };

/**
 * Form validation schemas, shared between client (react-hook-form +
 * zodResolver) and the /api/submit route. Single source of truth — fields
 * added here flow through to both client-side validation and the
 * server-side trust boundary, plus the email body sent to admissions.
 *
 * Branch options stay in lockstep with lib/data.ts (5 BTEUP-affiliated
 * branches). Updating one without the other is a footgun.
 */

// BRANCH_OPTIONS + SOURCE_OPTIONS now live in lib/formOptions.ts (zod-free)
// and are imported + re-exported at the top of this file.

export const CATEGORY_OPTIONS = [
  "General",
  "OBC",
  "SC",
  "ST",
  "EWS",
  "Minority",
] as const;

export const BOARD_OPTIONS = ["UP Board", "CBSE", "ICSE", "Other"] as const;

export const VISIT_OPTIONS = ["yes", "maybe", "no"] as const;
export const VISIT_TIME_OPTIONS = [
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
] as const;

// Indian mobile — strictly 10 digits, must start with 6-9. No country-code
// prefix and no formatting characters; we strip non-digits client-side.
const phoneRegex = /^[6-9]\d{9}$/;

// 0–100 with optional decimals.
const marksRegex = /^(?:100(?:\.0+)?|\d{1,2}(?:\.\d{1,2})?)$/;

// ----- Common fields -----
const nameField = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be under 100 characters")
  .regex(/^[\p{L}\s.'-]+$/u, "Use letters, spaces, dots, hyphens or apostrophes");

const phoneField = z
  .string()
  .trim()
  .regex(phoneRegex, "Enter a 10-digit mobile number starting with 6-9");

const optionalEmail = z
  .string()
  .trim()
  .email("Enter a valid email address")
  .max(120)
  .optional()
  .or(z.literal(""));

const branchField = z.enum(BRANCH_OPTIONS_ALL, {
  message: "Pick a branch you're interested in",
});

const consentField = z
  .boolean()
  .refine((v) => v === true, "You must agree to be contacted before we can submit");

// ===================================================================
// APPLY FORM — multi-step, richer context
// ===================================================================
export const applyFormSchema = z
  .object({
    formType: z.literal("apply"),

    // Step 1 — your details
    name: nameField,
    phone: phoneField,
    email: optionalEmail,
    parent: z
      .string()
      .trim()
      .max(100, "Name too long")
      .optional()
      .or(z.literal("")),

    // Step 2 — branch interest
    branch: branchField,
    // Optional as of Jun 2026 — Clarity recordings showed /apply
    // abandonment around the category step (declaring a caste category
    // felt intrusive for a first enquiry). The admissions call collects
    // it instead, so it no longer blocks a lead.
    category: z
      .enum(CATEGORY_OPTIONS)
      .optional()
      .or(z.literal("" as unknown as (typeof CATEGORY_OPTIONS)[number])),
    board: z
      .enum(BOARD_OPTIONS)
      .optional()
      .or(z.literal("" as unknown as (typeof BOARD_OPTIONS)[number])),
    marks: z
      .string()
      .trim()
      .regex(marksRegex, "Enter marks as a number 0–100")
      .optional()
      .or(z.literal("")),

    // Step 3 — visit + how-found-us
    source: z
      .enum(SOURCE_OPTIONS)
      .optional()
      .or(z.literal("" as unknown as (typeof SOURCE_OPTIONS)[number])),
    visit: z.enum(VISIT_OPTIONS),
    visitDate: z.string().optional().or(z.literal("")),
    visitTime: z
      .enum(VISIT_TIME_OPTIONS)
      .optional()
      .or(z.literal("" as unknown as (typeof VISIT_TIME_OPTIONS)[number])),
    notes: z
      .string()
      .trim()
      .max(1500, "Notes must be under 1500 characters")
      .optional()
      .or(z.literal("")),

    // Step 4 — consent
    consent: consentField,
  })
  .refine(
    (v) => v.visit !== "yes" || (v.visitDate && v.visitDate.trim().length > 0),
    {
      message: "Pick a visit date or change visit preference",
      path: ["visitDate"],
    },
  );

export type ApplyFormData = z.infer<typeof applyFormSchema>;

// ===================================================================
// CONTACT FORM — simple single-page
// ===================================================================
export const contactFormSchema = z.object({
  formType: z.literal("contact"),
  name: nameField,
  phone: phoneField,
  email: optionalEmail,
  branch: branchField,
  source: z
    .enum(SOURCE_OPTIONS)
    .optional()
    .or(z.literal("" as unknown as (typeof SOURCE_OPTIONS)[number])),
  message: z
    .string()
    .trim()
    .max(1500, "Message must be under 1500 characters")
    .optional()
    .or(z.literal("")),
  consent: consentField,
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// ===================================================================
// ENQUIRY FORM — site-wide prospectus popup (lightweight lead capture)
// ===================================================================
// Used by components/shell/InquiryModal.tsx. Much shorter than the
// contact form: name + phone are required, everything else optional.
export const enquiryFormSchema = z.object({
  formType: z.literal("enquiry"),
  name: nameField,
  phone: phoneField,
  email: optionalEmail,
  branch: z
    .enum(BRANCH_OPTIONS_ALL)
    .optional()
    .or(z.literal("" as unknown as (typeof BRANCH_OPTIONS_ALL)[number])),
  source: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  consent: z.boolean().optional(),
});

export type EnquiryFormData = z.infer<typeof enquiryFormSchema>;

// ===================================================================
// ALUMNI CONTACT REQUEST — visitor wants to talk to a specific alumnus
// ===================================================================
// Privacy posture: alumni phone numbers are NEVER bundled into the
// public site — the source XLSX lives in data/source/ (operator-only)
// and the parser scrubs phone fields out of lib/alumni-manifest.json.
// This form captures the visitor's intent + their own contact details;
// the placement cell verifies the request out-of-band (calls visitor,
// asks alumnus for consent) before sharing any number. The site is
// strictly the intake form.
//
// Delivery mechanism (29 May 2026): admin gets the full request as a
// WhatsApp message via Double Tick — NOT as a Django backend row. See
// fireAlumniIntroAdminNotification in lib/doubleTick.ts. Configure
// DOUBLETICK_ADMIN_NUMBER (and ideally a dedicated approved template)
// before launch so the audit trail is intact.
//
// Selectable "purpose" tickers — single-select chips so the visitor
// can't ambiguously pick "everything". "Other" reveals an optional
// 500-char free-text field so the operator has context to verify.
export const ALUMNI_REQUEST_PURPOSES = [
  "Course / branch advice",
  "Career mentorship",
  "Placement / job referral",
  "Higher studies guidance",
  "Industry insight",
  "Admission decision help",
  "Other",
] as const;

export const alumniContactRequestSchema = z
  .object({
    formType: z.literal("alumni-contact"),

    // Visitor's own details — required so the placement cell can verify
    // before introducing.
    name: nameField,
    phone: phoneField,
    email: optionalEmail,

    // Why they want to connect — single-select from the chips above.
    purpose: z.enum(ALUMNI_REQUEST_PURPOSES, {
      message: "Tell us why you'd like to connect",
    }),
    // Only required when purpose === "Other"; the refine below enforces
    // it conditionally so the chip-only flow stays one tap.
    purposeNote: z
      .string()
      .trim()
      .max(500, "Note must be under 500 characters")
      .optional()
      .or(z.literal("")),

    // Which alumnus are they asking about? Sourced from the manifest at
    // CTA-click time (id + descriptive fields). All five travel to the
    // backend so the operator's admin can render the request without
    // re-joining against the manifest.
    alumniId: z.number().int().positive(),
    alumniName: z.string().trim().min(1).max(120),
    alumniBranch: z.string().trim().max(120).optional().or(z.literal("")),
    alumniYear: z.string().trim().max(10).optional().or(z.literal("")),
    alumniCompany: z.string().trim().max(160).optional().or(z.literal("")),

    consent: consentField,
  })
  .refine(
    (v) =>
      v.purpose !== "Other" ||
      (typeof v.purposeNote === "string" && v.purposeNote.trim().length > 0),
    {
      message: "Add a one-line note so we can verify your request",
      path: ["purposeNote"],
    },
  );

export type AlumniContactRequestData = z.infer<typeof alumniContactRequestSchema>;

// ===================================================================
// VISIT FORM — book a campus visit
// ===================================================================
export const VISIT_PARTY_OPTIONS = [
  "Just me",
  "With parent / guardian",
  "With family (3+)",
  "School group",
] as const;

export const visitFormSchema = z.object({
  formType: z.literal("visit"),
  name: nameField,
  phone: phoneField,
  email: optionalEmail,
  branch: branchField,
  visitDate: z
    .string()
    .trim()
    .min(1, "Pick a preferred date for your visit"),
  visitTime: z.enum(VISIT_TIME_OPTIONS, {
    message: "Pick a preferred slot",
  }),
  party: z.enum(VISIT_PARTY_OPTIONS, {
    message: "Tell us who's coming",
  }),
  needsShuttle: z.boolean().optional(),
  notes: z
    .string()
    .trim()
    .max(1000, "Notes must be under 1000 characters")
    .optional()
    .or(z.literal("")),
  consent: consentField,
});

export type VisitFormData = z.infer<typeof visitFormSchema>;

// Default form values — keep all fields controlled to avoid React warnings.
export const applyDefaults: Partial<ApplyFormData> = {
  formType: "apply",
  name: "",
  phone: "",
  email: "",
  parent: "",
  branch: undefined,
  category: "General",
  board: "" as unknown as (typeof BOARD_OPTIONS)[number],
  marks: "",
  source: "" as unknown as (typeof SOURCE_OPTIONS)[number],
  visit: "yes",
  visitDate: "",
  visitTime: "10:00 AM" as (typeof VISIT_TIME_OPTIONS)[number],
  notes: "",
  consent: false,
};

export const contactDefaults: Partial<ContactFormData> = {
  formType: "contact",
  name: "",
  phone: "",
  email: "",
  branch: undefined,
  source: "" as unknown as (typeof SOURCE_OPTIONS)[number],
  message: "",
  consent: false,
};

export const visitDefaults: Partial<VisitFormData> = {
  formType: "visit",
  name: "",
  phone: "",
  email: "",
  branch: undefined,
  visitDate: "",
  visitTime: "11:30 AM" as (typeof VISIT_TIME_OPTIONS)[number],
  party: "With parent / guardian" as (typeof VISIT_PARTY_OPTIONS)[number],
  needsShuttle: false,
  notes: "",
  consent: false,
};

// Per-step field lists for the apply wizard's step-level validation
export const APPLY_STEP_FIELDS: ReadonlyArray<ReadonlyArray<keyof ApplyFormData>> = [
  ["name", "phone", "email", "parent"],
  ["branch", "category", "board", "marks"],
  ["source", "visit", "visitDate", "visitTime", "notes"],
  ["consent"],
];
