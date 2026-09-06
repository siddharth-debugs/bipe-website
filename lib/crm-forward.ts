/* Forward a BIPE website submission to the College-CRM (Sampark) as a
   BIPE enquiry — so admission enquiries land in the consultant inbox with
   the SAME lifecycle (auto-ack, unreachable ramp, cross-refer) that BITE
   and BIP leads get, instead of living only in the BIPE Django backend
   (api.bipevns.org).

   This is a SECOND sink, fired alongside forwardToBackend — the BIPE
   backend stays the record of truth for the website's own dashboard; the
   CRM copy is what the consultants work. Praveen 2026-08-11.

   Best-effort by contract: NEVER throws. A CRM outage must not break the
   form (which already succeeded to the BIPE backend by the time this
   runs). Callers fire-and-forget.

   Config (server-side env, NOT NEXT_PUBLIC_):
     BIPE_CRM_WEBHOOK_URL   e.g. https://crm-backend.bitevns.org/api/v1/integrations/bite-leads/
     BIPE_CRM_API_KEY       shared secret == BITE_LEADS_API_KEY on the CRM
   Both unset → this no-ops with a warning, so a missing config never
   breaks a submission. */

const HEADER = "X-API-Key";

/** BIPE website branch label → the CRM's BIPE course code (they differ:
 *  the CRM catalogue prefixes "Diploma in"). "Not sure" → no course, so
 *  the CRM shows "unspecified" rather than an invented programme. */
const BRANCH_TO_COURSE: Record<string, string> = {
  "Civil Engineering": "Diploma in Civil Engineering",
  "Electrical Engineering": "Diploma in Electrical Engineering",
  "Mechanical Engineering (Production)":
    "Diploma in Mechanical Engineering (Production)",
  "Computer Science & Engineering":
    "Diploma in Computer Science & Engineering",
  "Dairy Engineering": "Diploma in Dairy Engineering",
};

export interface CrmForwardInput {
  name: string;
  phone: string;
  email?: string;
  /** The BIPE branch label from the form (BRANCH_OPTIONS). */
  branch?: string;
  /** e.g. "apply" / "enquiry" / "contact" / "visit" — kept for filtering. */
  formType: string;
  /** Free-text "how did you hear" / page source. */
  source?: string;
  /** The BIPE backend's submission id, so the two systems can be tied. */
  backendId?: number | string | null;
  /** utm_* / fbclid blob if the page captured one. */
  attribution?: unknown;
}

export interface CrmForwardResult {
  ok: boolean;
  status?: number;
  error?: string;
  /** Sampark's own reference for the lead. Present only on confirmed delivery. */
  inquiryCode?: string;
  /** false when Sampark matched an existing lead instead of creating one. */
  created?: boolean;
  /** Consultant the CRM assigned it to, or null when it landed unassigned. */
  assignedConsultantId?: number | null;
}

/**
 * What the Sampark webhook answers, mirroring BiteLeadWebhookView in the CRM
 * repo (integrations/bite_leads/views.py).
 *
 * The important part: it returns HTTP 200 for BOTH outcomes. A lead it
 * ingested comes back with an inquiry_code; a lead it DECLINED comes back as
 * {success: true, skipped: true, reason: "..."} — also 200. Treating resp.ok
 * as delivery therefore counts a declined lead as a delivered one, which is
 * the same shape of silent loss as the phone bug in 873804a.
 */
export type CrmAck = {
  success?: boolean;
  skipped?: boolean;
  reason?: string;
  inquiry_code?: string;
  created?: boolean;
  assigned_consultant_id?: number | null;
  touchpoints?: number;
};

/**
 * Decide from Sampark's answer whether the lead actually landed.
 *
 * Exported for lib/crm-forward.test.ts. This is the SECOND place a lead can be
 * lost without anyone noticing — the first was the phone normaliser (873804a).
 * Both share a shape: a success-looking result that isn't one. Here it is an
 * HTTP 200 carrying skipped:true, which the site used to count as delivered
 * because it never read the body.
 *
 * An absent or unparseable body is treated as delivered: the CRM returned 2xx,
 * and refusing to believe it would raise false alarms on every lead. Only an
 * explicit skipped:true means "not taken".
 */
export function readCrmAck(ack: CrmAck | null):
  | { delivered: true; inquiryCode?: string; created?: boolean; assignedConsultantId: number | null }
  | { delivered: false; reason: string } {
  if (ack?.skipped) {
    return { delivered: false, reason: `crm_skipped_${ack.reason || "unspecified"}` };
  }
  return {
    delivered: true,
    inquiryCode: ack?.inquiry_code,
    created: ack?.created,
    assignedConsultantId: ack?.assigned_consultant_id ?? null,
  };
}

/**
 * Strip a country code / trunk prefix only when the LENGTH says there is one.
 *
 * This was `.replace(/^91/, "")`, applied unconditionally, so a valid 10-digit
 * mobile that merely BEGINS 91 — the 9174 / 9198 / 9199 series are live — was
 * cut to 8 digits and rejected as invalid_phone. That lead never reached the
 * CRM, and since the CRM forward is what fires the visitor's WhatsApp ack
 * (ac7a889), the student was never contacted at all: they saw the normal
 * success screen and a reference number, and heard nothing again. Silent by
 * construction — the result is discarded inside after(), and nothing in the
 * codebase reads a CRM lead back.
 *
 * Same rule as normalisePhone() in lib/admin/leads.ts (keep the last 10); not
 * imported because that module belongs to the client admin bundle.
 *
 * Exported for lib/crm-forward.test.ts: the regression that lost those leads
 * is one line of arithmetic, and it is worth a test that fails loudly if the
 * unconditional strip is ever reintroduced.
 */
export function normaliseCrmPhone(raw: string | null | undefined): string {
  const digits = String(raw || "").replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

/** Indian mobile: exactly 10 digits, first digit 6-9. */
export function isDeliverableMobile(phone: string): boolean {
  return phone.length === 10 && "6789".includes(phone[0]);
}

function courseFromBranch(branch?: string): string {
  const b = (branch || "").trim();
  return BRANCH_TO_COURSE[b] || "";
}

/** The delivery itself. Call forwardLeadToCrm — it wraps this with the alarm. */
async function deliverLeadToCrm(
  input: CrmForwardInput,
): Promise<CrmForwardResult> {
  const url = (process.env.BIPE_CRM_WEBHOOK_URL || "").trim();
  const key = (process.env.BIPE_CRM_API_KEY || "").trim();
  if (!url || !key) {
    console.warn(
      `[crm-forward] skipped — BIPE_CRM_WEBHOOK_URL=${url ? "set" : "missing"} BIPE_CRM_API_KEY=${key ? "set" : "missing"}`,
    );
    return { ok: false, error: "not_configured" };
  }

  const phone = normaliseCrmPhone(input.phone);
  if (!isDeliverableMobile(phone)) {
    return { ok: false, error: "invalid_phone" };
  }
  const name = (input.name || "").trim();
  if (name.length < 2) return { ok: false, error: "invalid_name" };

  // The CRM bite-leads webhook lead shape (integrations/bite_leads):
  // phone/name/email/course/source/attribution + college (2026-08-11).
  const payload = {
    name,
    phone,
    email: (input.email || "").trim(),
    course: courseFromBranch(input.branch),
    college: "BIPE", // the whole point — land as a BIPE lead, not BITE
    source: `BIPE website · ${input.formType}${input.source ? ` · ${input.source}` : ""}`.slice(0, 120),
    ref: input.backendId != null ? String(input.backendId) : "",
    submission_model: `bipe_web_${input.formType}`,
    attribution: input.attribution ?? null,
  };

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", [HEADER]: key },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });
      if (!resp.ok) {
        const body = await resp.text().catch(() => "");
        console.error("[crm-forward] HTTP", resp.status, body.slice(0, 200));
        // Non-2xx is a CRM verdict (validation etc.) — retry won't help.
        return { ok: false, status: resp.status };
      }
      // A 200 is not delivery on its own — Sampark answers 200 when it
      // declines a lead too. Read what it actually said.
      const verdict = readCrmAck(
        (await resp.json().catch(() => null)) as CrmAck | null,
      );

      if (!verdict.delivered) {
        // Accepted the request, did NOT take the lead (today the only reason
        // is invalid_phone). No consultant will ever see it, and the visitor
        // gets no WhatsApp either, because the CRM sends that on ingest.
        // Returned as a failure so the alarm names it.
        return { ok: false, status: resp.status, error: verdict.reason };
      }

      // Positive confirmation, per lead: Sampark's own code for it, whether it
      // was newly created or matched to an existing prospect, and the
      // consultant it landed with. This is the answer to "did it actually
      // arrive" — previously the body was discarded, so the only evidence was
      // the absence of an error.
      console.log(
        `[crm-forward] DELIVERED — backendId=${input.backendId ?? "none"}` +
          ` inquiryCode=${verdict.inquiryCode || "not-returned"}` +
          ` created=${verdict.created ?? "unknown"}` +
          ` consultant=${verdict.assignedConsultantId ?? "unassigned"}`,
      );
      return {
        ok: true,
        status: resp.status,
        inquiryCode: verdict.inquiryCode,
        created: verdict.created,
        assignedConsultantId: verdict.assignedConsultantId,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "fetch_error";
      console.error(`[crm-forward] attempt ${attempt} error`, msg);
      if (attempt === 2) return { ok: false, error: msg };
    }
  }
  return { ok: false, error: "unreachable" };
}

/** Last 4 digits only. Enough to match a row by eye, not a usable identifier. */
function maskPhone(raw: string | null | undefined): string {
  const d = String(raw || "").replace(/\D/g, "");
  return d.length >= 4 ? `••••••${d.slice(-4)}` : "(no digits)";
}

/**
 * Forward a lead to the Sampark CRM, and SAY SO when it does not arrive.
 *
 * Every caller passes this to next/server's after() and discards the result,
 * which is how a lead-losing bug ran unnoticed: deliverLeadToCrm returned
 * {ok:false,error:"invalid_phone"} for every mobile beginning 91 (fixed in
 * 873804a) and had no way to tell anyone. Three of its failure paths —
 * invalid_phone, invalid_name, unreachable — logged nothing at all, and the
 * two that did log named neither the lead nor the submission.
 *
 * So the alarm lives here rather than at the five call sites: one choke point
 * that a new caller inherits for free. That matters in this codebase — the
 * near-identical fan-out in app/api/submit/route.ts has already shipped a
 * missed-one-branch bug once (61615d8 wrapped three form types in after() and
 * left contact behind).
 *
 * This is a FAILURE ALARM, not a reconciliation. It catches a forward that
 * fails; it cannot catch one that succeeds into the wrong place, and it says
 * nothing about leads the CRM accepted and then lost. A real reconciliation
 * needs a readable count on the Sampark side, which does not exist today —
 * BIPE_CRM_WEBHOOK_URL is a write-only ingest endpoint.
 *
 * not_configured stays a warn, not an error: it is the documented local and
 * preview state (.env.example), and firing the alarm there would train
 * everyone to ignore it.
 */
export async function forwardLeadToCrm(
  input: CrmForwardInput,
): Promise<CrmForwardResult> {
  const result = await deliverLeadToCrm(input);
  if (!result.ok && result.error !== "not_configured") {
    const reason = result.error ?? `http_${result.status ?? "unknown"}`;
    // One greppable prefix, and the backend id so the row can be found in the
    // Inbox. Phone is masked — this line goes to a log, and the id is the
    // correlation key that actually matters.
    console.error(
      `[crm-forward] LEAD NOT DELIVERED — reason=${reason} formType=${input.formType} backendId=${input.backendId ?? "none"} phone=${maskPhone(input.phone)}`,
    );
  }
  return result;
}
