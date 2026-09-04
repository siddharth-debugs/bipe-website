/**
 * Double Tick WhatsApp Business API — server-side template sender.
 *
 * Wired to fire on successful /api/submit submissions (28 May 2026
 * per user direction "Scaffold + wire to /api/submit success"). Each
 * accepted Apply / Enquiry / Visit / Contact submission triggers a
 * Double Tick template message back to the submitter's phone number
 * so they get an immediate WhatsApp confirmation — and admissions
 * doesn't have to remember to send one.
 *
 * Failure mode: any DT failure (network, missing env var, template
 * rejection, rate limit) is logged and swallowed. The user response
 * stays {ok: true} regardless. The form submission already landed in
 * the backend; the WhatsApp confirmation is a NICE-TO-HAVE on top,
 * not a critical path.
 *
 * Configuration via environment variables:
 *   DOUBLETICK_API_KEY                       — required (no fallback)
 *   DOUBLETICK_FROM_NUMBER                   — BIPE WhatsApp Business
 *                                              sender number, e.g.
 *                                              "919415202879"
 *   DOUBLETICK_TEMPLATE_APPLY_RECEIVED       — template for /apply
 *   DOUBLETICK_TEMPLATE_ENQUIRY_RECEIVED     — template for /contact +
 *                                              /visit (Enquiry flow)
 *   DOUBLETICK_TEMPLATE_VISIT_RECEIVED       — optional override for
 *                                              /visit-specific copy;
 *                                              falls back to the
 *                                              Enquiry template
 *   DOUBLETICK_TEMPLATE_LANGUAGE             — defaults to "en"
 *
 * If DOUBLETICK_API_KEY is empty/unset, sendDoubleTickTemplate is a
 * no-op that returns { ok: true, skipped: true } — useful for local
 * dev without DT credentials and for the production safety net of
 * "DT credentials get rotated, forms keep working".
 *
 * Approved-template names need to be wired up by the operator (the
 * "test_temp" name in the curl example you'd want to replace). Until
 * the operator sets the env vars above, the fire-on-submit hook is
 * effectively dormant and form submissions continue to work as
 * before.
 */

const DT_API = "https://public.doubletick.io/whatsapp/message/template";

export type DoubleTickResult =
  | { ok: true; messageId?: string; skipped?: boolean }
  | { ok: false; error: string };

export type DoubleTickTemplateInput = {
  /** Recipient phone in E.164 sans `+`, e.g. "919415202879". */
  to: string;
  /** Approved Double Tick template name (configured in the DT
   *  dashboard). */
  templateName: string;
  /** Body placeholders, in order. Maps to `{{1}}`, `{{2}}`, … in
   *  the approved template. Pass an empty array for templates that
   *  have no body placeholders. */
  placeholders?: string[];
  /** ISO 639-1 language code, defaults to "en". */
  language?: string;
};

/**
 * POST a template message to the Double Tick API. Server-only — must
 * never be imported from "use client" code.
 */
export async function sendDoubleTickTemplate(
  input: DoubleTickTemplateInput,
): Promise<DoubleTickResult> {
  const apiKey = process.env.DOUBLETICK_API_KEY;
  const fromNumber = process.env.DOUBLETICK_FROM_NUMBER;

  // Graceful no-op when credentials are absent. Form submissions
  // continue to land in the backend; the WhatsApp confirmation just
  // doesn't fire. This is the local-dev / pre-launch path.
  if (!apiKey) {
    return { ok: true, skipped: true };
  }
  if (!fromNumber) {
    console.warn(
      "[doubleTick] DOUBLETICK_API_KEY is set but DOUBLETICK_FROM_NUMBER is missing — skipping send",
    );
    return { ok: true, skipped: true };
  }

  const language =
    input.language || process.env.DOUBLETICK_TEMPLATE_LANGUAGE || "en";

  // Normalise the destination to a digits-only string with country
  // code. Accept either "+919415202879", "919415202879" or
  // "9415202879" (defaulting to +91 India for the bare-10-digit case
  // since this site only collects Indian mobiles).
  const to = normaliseIndianMsisdn(input.to);
  if (!to) {
    return {
      ok: false,
      error: `Invalid destination number for Double Tick: ${input.to}`,
    };
  }

  const payload = {
    messages: [
      {
        to,
        from: fromNumber,
        content: {
          templateName: input.templateName,
          language,
          templateData: {
            body: {
              placeholders: input.placeholders ?? [],
            },
          },
        },
      },
    ],
  };

  try {
    const res = await fetch(DT_API, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Double Tick ${res.status}: ${text.slice(0, 200)}`,
      };
    }

    const json = (await res.json().catch(() => null)) as
      | { messages?: Array<{ id?: string }> }
      | null;
    const messageId = json?.messages?.[0]?.id;

    return { ok: true, messageId };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Double Tick fetch failed",
    };
  }
}

/**
 * Default template name for every form submission. Approved on the
 * Double Tick account 29 May 2026. Body has 4 placeholders:
 *
 *   {{1}}  →  visitor's first name
 *   {{2}}  →  reference ID, formatted "BIPE/{TYPE}/YYYY/NN"
 *             (e.g. BIPE/ENQ/2026/01, BIPE/APP/2026/12)
 *   {{3}}  →  course / branch of interest
 *   {{4}}  →  callback timeline in hours (default "24")
 *
 * Per-form-type overrides via the DOUBLETICK_TEMPLATE_* env vars
 * still take precedence so future template variants (a dedicated
 * "apply received" copy, a "visit confirmed" copy with date+slot)
 * can be wired without code changes.
 */
const DEFAULT_TEMPLATE_NAME = "enquiry_s_v1_submitted";

/**
 * 4 Sep 2026 — the alumni-introduction flow is the only path that still
 * sends from the website (every other enquirer ack comes from the Sampark
 * CRM since ac7a889). It was dark on both legs: resolveTemplateName had no
 * "alumni-contact" case (visitor ack silently skipped) and the admin ping
 * pushed 4 placeholders into the 2-real-slot legacy template above
 * (vendor-rejected). Both now ride purpose-built UTILITY templates on the
 * BIPE WABA (917310077788). Placeholder COUNT must equal the template's
 * slot count or Double Tick rejects the send — keep these in sync.
 *
 * Visitor ack — bilingual, six slots:
 *   {{1}} first name   {{2}} alumnus name   {{3}} reference ID   (English)
 *   {{4}} first name   {{5}} alumnus name   {{6}} reference ID   (Hindi)
 *   The 48-hour callback window is literal text in the body.
 */
const ALUMNI_INTRO_VISITOR_TEMPLATE = "bipe_alumni_intro_received_v1";
/**
 * Admin alert — five slots:
 *   {{1}} reference ID  {{2}} visitor name  {{3}} visitor phone
 *   {{4}} alumnus (name, branch, year, company)  {{5}} purpose (+ note, email)
 */
const ALUMNI_INTRO_ADMIN_TEMPLATE = "bipe_alumni_intro_admin_v1";

/**
 * Form-type → short code used in the reference ID middle segment.
 * Kept terse so the operator-facing ref reads cleanly when it
 * surfaces in the WhatsApp body. */
const FORM_TYPE_CODE: Record<
  "apply" | "enquiry" | "visit" | "contact" | "alumni-contact",
  string
> = {
  apply: "APP",
  enquiry: "ENQ",
  visit: "VIS",
  contact: "ENQ",
  // Alumni introduction requests. "ALU" keeps the 3-char convention
  // and reads cleanly in the WhatsApp body ("BIPE/ALU/2026/01").
  "alumni-contact": "ALU",
};

/**
 * Build the BIPE/TYPE/YYYY/NN reference ID. NN is zero-padded to at
 * least two digits.
 */
function buildReferenceId(
  formType: "apply" | "enquiry" | "visit" | "contact" | "alumni-contact",
  submissionId: number | string,
): string {
  const code = FORM_TYPE_CODE[formType];
  const year = new Date().getFullYear();
  const seq =
    typeof submissionId === "number"
      ? String(submissionId).padStart(2, "0")
      : String(submissionId);
  return `BIPE/${code}/${year}/${seq}`;
}

/**
 * Best-effort: fire the appropriate template after a successful form
 * submission. Always returns void — failures are swallowed and
 * logged. Designed to be invoked WITHOUT await from /api/submit
 * (the caller continues responding to the user while DT fires in
 * the background).
 */
export function fireSubmissionConfirmation(args: {
  /** Submission type. Routes to the right env-var template override
   *  AND drives the reference-ID middle segment (APP / ENQ / VIS). */
  formType: "apply" | "enquiry" | "visit" | "contact" | "alumni-contact";
  /** Submitter phone (the recipient of the WhatsApp confirmation). */
  phone: string;
  /** Submitter name. First word becomes placeholder {{1}}. */
  name: string;
  /** Optional branch interest. Used as placeholder {{3}} (course). */
  branch?: string;
  /** Submission ID from the backend (used in the reference ID at
   *  placeholder {{2}}). Defaults to "00" when missing. */
  submissionId?: number | string;
  /** Callback timeline in hours. Defaults to "24". Ignored for
   *  alumni-contact (the 48h window is literal text in that template). */
  callbackHours?: string;
  /** alumni-contact only: the alumnus the visitor asked to be introduced
   *  to. Fills {{2}} / {{5}} of bipe_alumni_intro_received_v1. */
  alumniName?: string;
}): void {
  const templateName = resolveTemplateName(args.formType);
  if (!templateName) return; // Template lookup failed AND no default

  const firstName = args.name.trim().split(/\s+/)[0] || args.name.trim();
  const referenceId = buildReferenceId(
    args.formType,
    args.submissionId ?? "00",
  );

  // Order matters — DT maps positionally to {{1}}..{{n}} — and the COUNT
  // must equal the template's slot count or the vendor rejects the send.
  let placeholders: string[];
  if (args.formType === "alumni-contact") {
    // bipe_alumni_intro_received_v1: six slots, see the contract above.
    const alumnus = args.alumniName?.trim() || "the alumnus you selected";
    placeholders = [
      firstName, alumnus, referenceId,
      firstName, alumnus, referenceId,
    ];
  } else {
    // enquiry_s_v1_submitted: {{1}} name {{2}} ref {{3}} course {{4}} hours.
    // Dormant since ac7a889 (the CRM acks these forms) — kept so an
    // operator-set DOUBLETICK_TEMPLATE_* override still has a contract.
    const course = args.branch?.trim() || "General enquiry";
    const callbackHours = args.callbackHours || "24";
    placeholders = [firstName, referenceId, course, callbackHours];
  }

  sendDoubleTickTemplate({
    to: args.phone,
    templateName,
    placeholders,
  })
    .then((result) => {
      if (!result.ok) {
        console.warn(
          `[doubleTick] confirmation send failed for ${args.formType}: ${result.error}`,
        );
      }
    })
    .catch((err) => {
      console.warn(`[doubleTick] confirmation send threw:`, err);
    });
}

/**
 * Best-effort: fire a WhatsApp notification to the BIPE admin number
 * with a full alumni-introduction-request summary. Per user direction
 * 29 May 2026 ("don't show this as new 'alumni-contact' row in the
 * backend dashboard. send admin message through whatsapp"), the
 * admin's WhatsApp inbox is the single source of truth for these
 * requests — no Django row is created.
 *
 * Configuration:
 *   DOUBLETICK_ADMIN_NUMBER                      — required; the
 *     placement-cell / TPO WhatsApp number that receives these
 *     notifications. MUST differ from DOUBLETICK_FROM_NUMBER (DT
 *     can't send from a number to itself).
 *   DOUBLETICK_TEMPLATE_ALUMNI_CONTACT_ADMIN     — optional override;
 *     defaults to DEFAULT_TEMPLATE_NAME so the flow ships without
 *     waiting for a dedicated admin template to be approved. Approve
 *     a purpose-built template later (with one placeholder per
 *     visitor + alumnus + purpose field) for cleaner copy.
 *
 * Failure mode: any DT error (network, missing env var, template
 * rejection) is logged and swallowed. The visitor's response stays
 * {ok: true} regardless. If admin number is missing, we log a LOUD
 * warning — this is the only audit trail for the request, so the
 * operator needs to notice and fix the env asap.
 */
export function fireAlumniIntroAdminNotification(args: {
  /** Short reference suffix, e.g. "A3F7". Built into BIPE/ALU/YYYY/{suffix}
   *  so the admin can quote it back to the visitor on the verification
   *  call. Use the SAME suffix you pass to fireSubmissionConfirmation
   *  so both messages share a reference. */
  refSuffix: string;
  visitorName: string;
  visitorPhone: string;
  visitorEmail?: string;
  purpose: string;
  purposeNote?: string;
  alumniId: number;
  alumniName: string;
  alumniBranch?: string;
  alumniYear?: string;
  alumniCompany?: string;
}): void {
  const adminNumber = process.env.DOUBLETICK_ADMIN_NUMBER;
  if (!adminNumber) {
    console.warn(
      "[doubleTick] ALUMNI INTRO REQUEST RECEIVED but DOUBLETICK_ADMIN_NUMBER is missing — admin will NOT be notified. Configure the env var to restore the audit trail.",
    );
    return;
  }

  const templateName =
    process.env.DOUBLETICK_TEMPLATE_ALUMNI_CONTACT_ADMIN ||
    ALUMNI_INTRO_ADMIN_TEMPLATE;

  const refId = buildReferenceId("alumni-contact", args.refSuffix);

  // bipe_alumni_intro_admin_v1 — one slot per field the admin needs on
  // the verification call (contract at the top of this file). Values are
  // trimmed to WhatsApp's per-variable limit and kept single-line: a
  // newline inside a variable is rejected by the vendor.
  const alumnusDetail = [
    args.alumniName,
    args.alumniBranch,
    args.alumniYear,
    args.alumniCompany,
  ]
    .filter((p): p is string => !!p && p.length > 0)
    .join(", ");
  const oneLine = (v: string, max: number) =>
    v.replace(/\s+/g, " ").trim().slice(0, max);
  const purposeLine = [
    args.purpose,
    args.purposeNote ? `Note: ${args.purposeNote}` : null,
    args.visitorEmail ? `Email: ${args.visitorEmail}` : null,
  ]
    .filter((p): p is string => !!p && p.length > 0)
    .join(" — ");

  const placeholders = [
    refId,
    oneLine(args.visitorName, 80),
    oneLine(args.visitorPhone, 20),
    oneLine(`${alumnusDetail} [#${args.alumniId}]`, 200),
    oneLine(purposeLine, 400),
  ];

  sendDoubleTickTemplate({
    to: adminNumber,
    templateName,
    placeholders,
  })
    .then((result) => {
      if (!result.ok) {
        console.warn(
          `[doubleTick] alumni intro admin notification FAILED: ${result.error}`,
        );
      }
    })
    .catch((err) => {
      console.warn(
        "[doubleTick] alumni intro admin notification threw:",
        err,
      );
    });
}


/**
 * Map a formType to the env var holding its approved template name.
 * Per-form-type overrides win; otherwise the form-type-specific
 * env var hierarchy applies; otherwise DEFAULT_TEMPLATE_NAME (the
 * single approved enquiry_s_v1_submitted template) is used.
 * The /visit form gets a dedicated template if configured;
 * otherwise it falls back to the Enquiry template (same callback
 * flow, slightly different copy if you want it).
 */
function resolveTemplateName(
  formType: "apply" | "enquiry" | "visit" | "contact" | "alumni-contact",
): string | undefined {
  switch (formType) {
    case "apply":
      return (
        process.env.DOUBLETICK_TEMPLATE_APPLY_RECEIVED || DEFAULT_TEMPLATE_NAME
      );
    case "visit":
      return (
        process.env.DOUBLETICK_TEMPLATE_VISIT_RECEIVED ||
        process.env.DOUBLETICK_TEMPLATE_ENQUIRY_RECEIVED ||
        DEFAULT_TEMPLATE_NAME
      );
    case "enquiry":
    case "contact":
      return (
        process.env.DOUBLETICK_TEMPLATE_ENQUIRY_RECEIVED ||
        DEFAULT_TEMPLATE_NAME
      );
    case "alumni-contact":
      // Never fell through to the legacy default: that template has only
      // two real slots and a course line that makes no sense for an
      // introduction request. Dedicated six-slot template since 4 Sep 2026.
      return (
        process.env.DOUBLETICK_TEMPLATE_ALUMNI_CONTACT_RECEIVED ||
        ALUMNI_INTRO_VISITOR_TEMPLATE
      );
  }
}

/**
 * Accept "+919415202879", "919415202879", "9415202879", or "094..."
 * and return "919415202879". Returns null if the input is anything
 * else (not 10/11/12 digits after normalisation).
 */
function normaliseIndianMsisdn(raw: string): string | null {
  const digits = (raw || "").replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]/.test(digits)) {
    return `91${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return `91${digits.slice(1)}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits;
  }
  if (digits.length === 13 && digits.startsWith("091")) {
    return digits.slice(1);
  }
  return null;
}
