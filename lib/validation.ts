import { z } from "zod";

/**
 * Form validation schemas, shared between client (react-hook-form +
 * zodResolver) and the /api/submit route. Single source of truth — fields
 * added here flow through to both client-side validation and the
 * server-side trust boundary, plus the email body sent to admissions.
 *
 * Branch options stay in lockstep with lib/data.ts (5 BTEUP-licensed
 * branches). Updating one without the other is a footgun.
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

// Indian mobile — accepts +91 prefix optionally, must start 6-9, ten digits.
const phoneRegex = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;

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
  .regex(phoneRegex, "Enter a valid 10-digit Indian mobile number");

const optionalEmail = z
  .string()
  .trim()
  .email("Enter a valid email address")
  .max(120)
  .optional()
  .or(z.literal(""));

const branchField = z.enum(BRANCH_OPTIONS, {
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
    category: z.enum(CATEGORY_OPTIONS),
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
