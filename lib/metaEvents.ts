/**
 * Meta (Facebook) conversion events — browser Pixel + Conversions API, deduped.
 *
 * The base Pixel (PageView) lives in components/shell/MetaPixelBeacon.tsx and is
 * already firing. This module adds the higher-value conversion events — Lead
 * (form submissions) and Contact (WhatsApp / call taps) — and reports each one
 * BOTH from the browser (fbq) AND from our server (Conversions API, via
 * /api/meta-capi).
 *
 * Why both: the browser Pixel is blocked by ad-blockers + iOS privacy on a
 * large share of mobile traffic. The server event isn't, so it backfills the
 * gaps. Meta merges the two using a shared `event_id` (the dedup key) so the
 * conversion is never double-counted — the single most important invariant
 * here: the SAME event_id string must reach both paths. This function mints
 * one id and uses it for both, so callers can't get it wrong.
 *
 * PII matching (Jun 2026, per owner + Akshat): Lead passes the applicant's
 * email/phone so Meta can match the conversion to an account (higher match
 * quality). The raw values go only to OUR same-origin route, which SHA-256-
 * hashes them before they ever reach Meta — raw PII never leaves our server.
 * (DPDP / consent posture for this is owner-deferred — tracked separately.)
 */

export type MetaEventName = "Lead" | "Contact";

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? m[2] : undefined;
}

function newEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export interface MetaTrackOpts {
  /** Applicant email (raw — hashed server-side before reaching Meta). */
  email?: string;
  /** Applicant phone (raw — hashed server-side before reaching Meta). */
  phone?: string;
  /** Conversion value, if any. Defaults to currency INR when set. */
  value?: number;
  currency?: string;
  /** Extra custom_data keys (e.g. { form: "apply" }, { channel: "whatsapp" }). */
  custom?: Record<string, unknown>;
}

/**
 * Fire a Meta conversion event on BOTH the browser Pixel and the server CAPI,
 * sharing one event_id for deduplication. Never throws — analytics must not
 * break a form submit or a link tap.
 */
export async function trackMetaEvent(
  eventName: MetaEventName,
  opts: MetaTrackOpts = {},
): Promise<void> {
  if (typeof window === "undefined") return;

  const eventId = newEventId();

  const custom_data: Record<string, unknown> = {
    ...(opts.value !== undefined
      ? { value: opts.value, currency: opts.currency ?? "INR" }
      : {}),
    ...opts.custom,
  };

  // 1) Browser Pixel — eventID ties it to the server event below.
  try {
    const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
    if (typeof fbq === "function") {
      fbq("track", eventName, custom_data, { eventID: eventId });
    }
  } catch {
    /* pixel not ready / blocked — the server event still fires below */
  }

  // 2) Server (Conversions API) — SAME eventId. keepalive lets the request
  //    survive the page navigating away (tel: links, WhatsApp handoff).
  try {
    await fetch("/api/meta-capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventName,
        eventId,
        eventSourceUrl: window.location.href,
        email: opts.email,
        phone: opts.phone,
        fbp: getCookie("_fbp"),
        fbc: getCookie("_fbc"),
        custom_data,
      }),
    });
  } catch {
    /* the browser pixel already fired; a server hiccup is non-fatal */
  }
}
