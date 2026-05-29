/**
 * WhatsApp handoff — the shared submission logic for the site's
 * WhatsApp-style "enquiry → chat" surfaces.
 *
 * Two consumers as of 28 May 2026:
 *
 *   - components/shell/InquiryModal.tsx  — the 3-second entry-intent
 *                                          popup (modal card UI). Calls
 *                                          submitWhatsAppHandoff with
 *                                          persist=true so the lead
 *                                          lands in the admin Inbox
 *                                          even before the WhatsApp
 *                                          handoff fires.
 *   - components/shell/WhatsAppFAB.tsx   — the floating green bubble
 *                                          (chat-panel UI). Calls
 *                                          submitWhatsAppHandoff with
 *                                          persist=false; the user has
 *                                          already opted in via the
 *                                          mini-chat affordance and we
 *                                          don't want a duplicate row
 *                                          in the Inbox per FAB click.
 *
 * Why extracted to a shared module and not a shared <WhatsAppForm />
 * component: the two consumers have very different visual chrome (one
 * is a modal card with .inq-* CSS classes, the other a floating chat
 * panel with .wa-* CSS classes). Forcing them into a single component
 * would have meant more conditional rendering than it removed. The
 * shared logic that DOES belong in one place — the WA phone number,
 * the message format, the persist call, the analytics event — lives
 * here. Visual presentation stays surface-specific by design.
 *
 * Per the 28 May 2026 user directive "use only one number for call
 * 9005882866, remove 9198646464 and 9198767676" — BOTH WhatsApp
 * surfaces ALREADY converged on 9005882866 for the chat handoff well
 * before that direction was given. The fuller phone consolidation
 * shipped later the same day brought DATA.contact.phone in line too,
 * so this number now matches the site-wide voice / WhatsApp single
 * source of truth.
 */

import { track } from "@/lib/analytics";

/**
 * Admissions WhatsApp handset — the destination phone number for
 * every wa.me handoff started from the site's WhatsApp surfaces. As
 * of the 28 May 2026 phone consolidation this is also the destination
 * baked into DATA.contact.whatsapp (the wa.me URL the static pages
 * use). The constant is kept as a separate export because the FAB +
 * Modal handoffs build their wa.me URLs programmatically and want a
 * named anchor that's stable across refactors.
 */
export const BIPE_ADMISSIONS_WA_PHONE = "919005882866";

export type WhatsAppHandoffFields = {
  /** Visitor name. Required. Trimmed before use. */
  name: string;
  /** Visitor mobile (10-digit). Optional — InquiryModal collects it,
   *  WhatsAppFAB does not. When present, included in the persist
   *  payload AND mentioned in the pre-filled WhatsApp message so the
   *  admissions operator can call back if the visitor never finishes
   *  the chat. */
  phone?: string;
  /** Branch / course of interest. Optional. */
  branch?: string;
  /** Where the handoff originated. Used for analytics and to compose
   *  a useful default `message` in the /api/submit payload when the
   *  consumer doesn't provide one. */
  source: string;
};

export type WhatsAppHandoffOptions = {
  /** When true, also persists the enquiry to /api/submit before
   *  opening WhatsApp. Use this for surfaces where the user might
   *  drop off before the WhatsApp handoff completes. */
  persist?: boolean;
  /** Gtag event name to fire on submission. Defaults to
   *  "enquiry_submit". */
  gtagEvent?: string;
  /** Honeypot value from the form (passed through to /api/submit
   *  when persist=true). The server silently 200s any submission
   *  with a non-empty value here. */
  honeypotValue?: string;
};

export type WhatsAppHandoffResult =
  | { ok: true; persisted: boolean; whatsAppUrl: string }
  | { ok: false; error: string };

/**
 * Build the pre-filled WhatsApp message. Kept as a separate export
 * so tests can assert format independently from the side-effects
 * (network call, window.open) in submitWhatsAppHandoff.
 */
export function buildWhatsAppMessage(fields: WhatsAppHandoffFields): string {
  const name = fields.name.trim() || "there";
  const branch = fields.branch?.trim();
  const phone = fields.phone?.trim();

  const branchClause = branch
    ? `I'm interested in ${branch} at BIPE Varanasi.`
    : "Please share BIPE Varanasi admission details.";

  const phoneTrailer = phone ? ` (Phone: ${phone})` : "";

  return `Hi, I'm ${name}. ${branchClause} Please share details.${phoneTrailer}`;
}

/**
 * Construct the wa.me URL with pre-filled text. Pure function — no
 * side effects.
 */
export function buildWhatsAppUrl(fields: WhatsAppHandoffFields): string {
  const text = buildWhatsAppMessage(fields);
  return `https://api.whatsapp.com/send/?phone=${BIPE_ADMISSIONS_WA_PHONE}&text=${encodeURIComponent(
    text,
  )}&type=phone_number&app_absent=0`;
}

/**
 * Orchestrate the full handoff: optional persist → analytics →
 * window.open. Returns a result describing what happened so the
 * caller can render the right success / error UI.
 *
 * Caller is responsible for client-side validation (name length,
 * phone format) BEFORE invoking this. The function does NOT perform
 * its own validation — that's UI-layer concern that varies between
 * surfaces.
 */
export async function submitWhatsAppHandoff(
  fields: WhatsAppHandoffFields,
  options: WhatsAppHandoffOptions = {},
): Promise<WhatsAppHandoffResult> {
  const { persist = false, gtagEvent = "enquiry_submit", honeypotValue = "" } =
    options;

  let persisted = false;
  if (persist) {
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "enquiry",
          name: fields.name.trim(),
          phone: (fields.phone ?? "").trim(),
          branch: fields.branch ?? "",
          source: fields.source,
          message: `Admissions enquiry via ${fields.source}. Branch interest: ${
            fields.branch || "not specified"
          }.`,
          consent: true,
          website: honeypotValue,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        // Persist failed, but we STILL want to surface the WhatsApp
        // handoff so the visitor isn't blocked. The caller decides
        // whether to surface the persist failure.
        const persistError = body?.error ?? "Could not save your enquiry.";
        track(gtagEvent, {
          branch: fields.branch || "unspecified",
          persisted: false,
          source: fields.source,
        });
        return { ok: false, error: persistError };
      }
      persisted = true;
    } catch {
      track(gtagEvent, {
        branch: fields.branch || "unspecified",
        persisted: false,
        source: fields.source,
      });
      return {
        ok: false,
        error: "Network error. Try WhatsApp directly or call us.",
      };
    }
  }

  track(gtagEvent, {
    branch: fields.branch || "unspecified",
    persisted,
    source: fields.source,
  });

  const whatsAppUrl = buildWhatsAppUrl(fields);

  return { ok: true, persisted, whatsAppUrl };
}
