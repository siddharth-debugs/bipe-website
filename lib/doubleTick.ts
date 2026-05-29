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
 * Best-effort: fire the appropriate template after a successful form
 * submission. Always returns void — failures are swallowed and
 * logged. Designed to be invoked WITHOUT await from /api/submit
 * (the caller continues responding to the user while DT fires in
 * the background).
 */
export function fireSubmissionConfirmation(args: {
  /** Submission type — determines which template env var is read. */
  formType: "apply" | "enquiry" | "visit" | "contact";
  /** Submitter phone (the recipient of the WhatsApp confirmation). */
  phone: string;
  /** Submitter name. Used as placeholder {{1}} by default. */
  name: string;
  /** Optional branch interest. Used as placeholder {{2}} by default. */
  branch?: string;
}): void {
  const templateName = resolveTemplateName(args.formType);
  if (!templateName) {
    // No template configured for this form type — silently skip. The
    // operator can wire it later by setting the env var.
    return;
  }

  // Default placeholder mapping: {{1}} = first name, {{2}} = branch.
  // If the operator's approved template uses a different mapping,
  // they'll need to expose a custom env-var-driven mapping here.
  // Start narrow; iterate when the approved templates land.
  const firstName = args.name.trim().split(/\s+/)[0] || args.name.trim();
  const placeholders = [firstName, args.branch ?? ""].filter(Boolean);

  // Fire and forget. Log on failure but never throw.
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
 * Map a formType to the env var holding its approved template name.
 * The /visit form gets a dedicated template if configured;
 * otherwise it falls back to the Enquiry template (same callback
 * flow, slightly different copy if you want it).
 */
function resolveTemplateName(
  formType: "apply" | "enquiry" | "visit" | "contact",
): string | undefined {
  switch (formType) {
    case "apply":
      return process.env.DOUBLETICK_TEMPLATE_APPLY_RECEIVED || undefined;
    case "visit":
      return (
        process.env.DOUBLETICK_TEMPLATE_VISIT_RECEIVED ||
        process.env.DOUBLETICK_TEMPLATE_ENQUIRY_RECEIVED ||
        undefined
      );
    case "enquiry":
    case "contact":
      return process.env.DOUBLETICK_TEMPLATE_ENQUIRY_RECEIVED || undefined;
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
