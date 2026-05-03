/**
 * Web3Forms-backed email delivery for form submissions.
 *
 * Web3Forms is the simplest free transactional email gateway for static
 * sites: no SMTP, no domain verification, no signup confirmation per
 * request. Sign up once at https://web3forms.com with your destination
 * email (admissions@bipevns.org), grab the access key, and add it to:
 *   - `.env.local` for local dev (`WEB3FORMS_ACCESS_KEY=...`)
 *   - Vercel Project Settings → Environment Variables
 *
 * Free tier: 250 submissions/month — fine for an admissions form.
 *
 * If the env var is missing we log the payload to the server console
 * and return `{ ok: true, mocked: true }` so local testing isn't blocked.
 */

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export interface FormPayload {
  /** Used to brand the subject line and segment in analytics */
  formType: "apply" | "contact";
  name: string;
  phone: string;
  email?: string | "";
  branch: string;
  source?: string | "";
  message?: string | "";
  consent: boolean;
  /** Optional rich context — flattened into the email body verbatim. */
  extras?: Record<string, string | number | boolean | undefined | null>;
}

export interface EmailResult {
  ok: boolean;
  mocked?: boolean;
  message?: string;
}

/**
 * POSTs to Web3Forms. Returns ok=true on success, ok=false with a
 * human-readable message on failure.
 */
export async function sendFormEmail(payload: FormPayload): Promise<EmailResult> {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    console.log("[email-service] WEB3FORMS_ACCESS_KEY not set — logging only:");
    console.log(JSON.stringify(payload, null, 2));
    return { ok: true, mocked: true };
  }

  const subject =
    payload.formType === "apply"
      ? `Apply 2026-27 · ${payload.name} · ${payload.branch}`
      : `Contact · ${payload.name} · ${payload.branch}`;

  // Web3Forms accepts arbitrary key/values and includes them all in the
  // delivered email. We add a few branded fields plus the user data.
  const body: Record<string, string | undefined> = {
    access_key: accessKey,
    subject,
    from_name: "BIPE Website",
    replyto: payload.email || undefined,
    botcheck: "", // honeypot — empty = legitimate

    full_name: payload.name,
    mobile: payload.phone,
    email: payload.email || "(not provided)",
    branch_interest: payload.branch,
    source: payload.source || "(not provided)",
    message: payload.message || "(no message)",
    consent: payload.consent ? "Yes" : "No",
    form_type: payload.formType,
    submitted_at: new Date().toISOString(),
  };

  // Flatten any extras into the email body (Web3Forms includes them all).
  if (payload.extras) {
    for (const [k, v] of Object.entries(payload.extras)) {
      if (v === undefined || v === null || v === "") continue;
      body[k] = String(v);
    }
  }

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });

    const json = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
    };

    if (!res.ok || !json.success) {
      console.error("[email-service] Web3Forms returned error:", res.status, json);
      return {
        ok: false,
        message: json.message || `Email service responded ${res.status}`,
      };
    }

    return { ok: true };
  } catch (err) {
    console.error("[email-service] Network or timeout error:", err);
    return {
      ok: false,
      message: "Could not reach the email service. Please try again or WhatsApp us.",
    };
  }
}
