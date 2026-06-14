import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * Meta Conversions API relay.
 *
 * Receives a conversion event from the browser (lib/metaEvents.ts), hashes the
 * personal fields correctly, and forwards it to Meta's Graph API server-to-
 * server. Pairs with the browser Pixel via a shared `event_id` so Meta dedupes
 * the two reports of the same action.
 *
 * Security / hardening:
 *   - Token lives ONLY in env (META_CAPI_TOKEN), read only here. Never client-side.
 *   - event_name is allow-listed (Lead | Contact) so the public endpoint can't
 *     be used to inject arbitrary events into the dataset.
 *   - Rate-limited per IP (lenient — real users fire a handful of events).
 *   - Returns a minimal body to the client; the full Meta response is logged
 *     server-side only.
 *   - If the token isn't configured yet, it no-ops gracefully (200) — the
 *     browser Pixel has already fired, so nothing breaks before env is set.
 */

const DATASET_ID = "1035125302305497"; // Pixel / dataset id
const API_VERSION = "v23.0"; // bump ~yearly — Meta retires old Graph versions
const TOKEN = process.env.META_CAPI_TOKEN;
const TEST_CODE = process.env.META_TEST_EVENT_CODE; // set ONLY while testing

const ALLOWED_EVENTS = new Set(["Lead", "Contact"]);

// SHA-256. Email: trim + lowercase. Phone: digits only, with country code.
const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");
const hashEmail = (e: string) => sha256(e.trim().toLowerCase());
const hashPhone = (p: string) => {
  let d = p.replace(/\D/g, "");
  if (d.length === 10) d = "91" + d; // India default when country code missing
  return sha256(d);
};

export async function POST(req: Request) {
  // Lenient rate-limit: a real visitor fires a few Lead/Contact events; this
  // just caps someone scripting fake conversions into the dataset.
  const ip = getClientIp(req);
  if (!checkRateLimit(`capi:${ip}`, { limit: 60 }).ok) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let b: Record<string, unknown>;
  try {
    b = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const eventName = String(b.eventName ?? "");
  if (!ALLOWED_EVENTS.has(eventName)) {
    return NextResponse.json({ ok: false, error: "event_not_allowed" }, { status: 400 });
  }

  // No token configured yet → don't error. The browser Pixel already fired.
  if (!TOKEN) {
    console.warn("[meta-capi] skipped — META_CAPI_TOKEN not set");
    return NextResponse.json({ ok: false, skipped: true });
  }

  const ua = req.headers.get("user-agent") || "";

  // user_data — fbp/fbc/IP/UA are sent RAW (Meta requires this); only the
  // contact fields are hashed.
  const user_data: Record<string, unknown> = {
    client_ip_address: ip,
    client_user_agent: ua,
  };
  if (typeof b.email === "string" && b.email) user_data.em = [hashEmail(b.email)];
  if (typeof b.phone === "string" && b.phone) user_data.ph = [hashPhone(b.phone)];
  if (typeof b.fbp === "string" && b.fbp) user_data.fbp = b.fbp;
  if (typeof b.fbc === "string" && b.fbc) user_data.fbc = b.fbc;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: b.eventId, // MUST match the browser eventID for dedup
        action_source: "website",
        event_source_url: b.eventSourceUrl,
        user_data,
        ...(b.custom_data ? { custom_data: b.custom_data } : {}),
      },
    ],
    ...(TEST_CODE ? { test_event_code: TEST_CODE } : {}),
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${DATASET_ID}/events?access_token=${TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      },
    );
    const json = (await res.json().catch(() => ({}))) as {
      events_received?: number;
      error?: unknown;
    };
    if (!res.ok || json.error) {
      console.error("[meta-capi] Meta error:", JSON.stringify(json).slice(0, 400));
      return NextResponse.json({ ok: false }, { status: 502 });
    }
    // Success log for observability — event name + count only, no PII.
    console.log(`[meta-capi] ${eventName} ok — events_received=${json.events_received ?? 0}`);
    // Minimal client response — enough to confirm receipt, no sensitive bits.
    return NextResponse.json({ ok: true, events_received: json.events_received ?? 0 });
  } catch (e) {
    console.error("[meta-capi] request failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, error: "capi_failed" }, { status: 500 });
  }
}
