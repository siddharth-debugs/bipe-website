import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { forwardToBackend } from "@/lib/backend";
import { forwardLeadToCrm } from "@/lib/crm-forward";
import { BRANCH_OPTIONS_ALL } from "@/lib/formOptions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * /api/meta-leads — Meta Lead Ads (Instant Form) webhook.
 *
 * Speed-to-lead pipeline: the moment someone submits the Instant Form on a
 * Meta ad, Meta POSTs a `leadgen` webhook here. We fetch the lead's answers
 * from the Graph API and:
 *   1. ingest it into the Django backend as an ENQUIRY row (same admin inbox
 *      as website leads, source "meta-instant-form"),
 *   2. WhatsApp the admissions admin via Double Tick (fires even if the
 *      backend ingest fails — the ping IS the safety net), and
 *   3. WhatsApp the student the standard enquiry confirmation (backend
 *      success only, matching /api/submit behaviour).
 *
 * GET  — Meta's one-time webhook verification handshake: echo hub.challenge
 *        when hub.verify_token matches META_LEADS_VERIFY_TOKEN.
 * POST — the leadgen event. Authenticated by the X-Hub-Signature-256 HMAC
 *        (SHA-256 of the raw body with META_APP_SECRET) — NOT by IP or
 *        rate-limit. Unsigned/mis-signed posts get 401 and no processing,
 *        so nobody can spray fake leads at the admin's WhatsApp.
 *
 * Env (server-side, set in Vercel):
 *   META_LEADS_VERIFY_TOKEN  — any secret string; paste the same value in
 *                              the App Dashboard webhook config.
 *   META_APP_SECRET          — App Dashboard → Settings → Basic → App secret.
 *   META_PAGE_ACCESS_TOKEN   — Page token WITH `leads_retrieval` (a Business
 *                              Manager system-user token with the Page
 *                              assigned works too).
 *
 * Failure mode: a lead we can't fetch is logged and skipped, and we still
 * return 200 — a non-200 makes Meta re-deliver the WHOLE batch, which would
 * duplicate the leads that DID process. Meta also retries genuinely dropped
 * deliveries for a while, and every lead stays downloadable in Ads Manager →
 * Leads Center regardless, so nothing is permanently lost.
 */

const GRAPH = "https://graph.facebook.com/v23.0";

/**
 * Best-effort dedupe of leadgen_ids across Meta's retry deliveries. Module-
 * level so it only helps on a warm serverless instance — that's fine, this
 * is belt-and-braces on top of returning 200s promptly. Capped so a long-
 * lived instance can't grow it unbounded.
 */
const seenLeadgenIds = new Set<string>();
const SEEN_CAP = 500;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const expected = (process.env.META_LEADS_VERIFY_TOKEN ?? "").trim();

  if (mode === "subscribe" && expected && token === expected && challenge) {
    // Meta expects the raw challenge string back, not JSON.
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
  return new Response("Forbidden", { status: 403 });
}

export async function POST(req: Request) {
  const appSecret = (process.env.META_APP_SECRET ?? "").trim();
  const pageToken = (process.env.META_PAGE_ACCESS_TOKEN ?? "").trim();
  if (!appSecret || !pageToken) {
    console.warn(
      `[meta-leads] webhook hit but not configured — META_APP_SECRET=${appSecret ? "set" : "missing"} META_PAGE_ACCESS_TOKEN=${pageToken ? "set" : "missing"}`,
    );
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 503 });
  }

  // Signature check runs on the RAW body — read text first, parse after.
  const raw = await req.text();
  const signature = req.headers.get("x-hub-signature-256") ?? "";
  if (!verifySignature(raw, signature, appSecret)) {
    console.warn("[meta-leads] rejected POST with missing/invalid X-Hub-Signature-256");
    return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }

  const page = body as {
    object?: string;
    entry?: Array<{
      changes?: Array<{ field?: string; value?: { leadgen_id?: string | number } }>;
    }>;
  };
  if (page.object !== "page") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const leadgenIds: string[] = [];
  for (const entry of page.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const id = change.field === "leadgen" ? change.value?.leadgen_id : undefined;
      if (id !== undefined && id !== null) leadgenIds.push(String(id));
    }
  }

  let processed = 0;
  for (const id of leadgenIds) {
    if (seenLeadgenIds.has(id)) continue;
    if (seenLeadgenIds.size >= SEEN_CAP) seenLeadgenIds.clear();
    seenLeadgenIds.add(id);
    try {
      await processLead(id, pageToken);
      processed++;
    } catch (err) {
      console.warn(`[meta-leads] lead ${id} processing threw:`, err);
    }
  }

  console.log(`[meta-leads] webhook ok — ${processed}/${leadgenIds.length} lead(s) processed`);
  return NextResponse.json({ ok: true, received: leadgenIds.length, processed });
}

function verifySignature(raw: string, header: string, secret: string): boolean {
  if (!header.startsWith("sha256=")) return false;
  const theirs = header.slice("sha256=".length);
  const ours = createHmac("sha256", secret).update(raw, "utf8").digest("hex");
  if (theirs.length !== ours.length) return false;
  try {
    return timingSafeEqual(Buffer.from(theirs, "hex"), Buffer.from(ours, "hex"));
  } catch {
    return false;
  }
}

/** Normalise a field_data name for loose matching: lowercase, alnum only. */
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Fetch one lead from the Graph API and fan it out (backend row + admin
 * WhatsApp + student confirmation).
 */
async function processLead(leadgenId: string, pageToken: string): Promise<void> {
  const fields = "created_time,field_data,form_id,ad_name,campaign_name,is_organic,platform";
  const res = await fetch(
    `${GRAPH}/${encodeURIComponent(leadgenId)}?fields=${fields}&access_token=${encodeURIComponent(pageToken)}`,
    { signal: AbortSignal.timeout(8000) },
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.warn(`[meta-leads] Graph fetch for lead ${leadgenId} -> ${res.status}: ${text.slice(0, 240)}`);
    return;
  }
  const lead = (await res.json()) as {
    field_data?: Array<{ name?: string; values?: string[] }>;
    ad_name?: string;
    campaign_name?: string;
    is_organic?: boolean;
    platform?: string;
  };

  const entries = (lead.field_data ?? [])
    .map((f) => ({ key: norm(f.name ?? ""), name: f.name ?? "", value: (f.values ?? [])[0] ?? "" }))
    .filter((f) => f.key && f.value);

  const take = (...keys: string[]): string => {
    for (const k of keys) {
      const hit = entries.find((e) => e.key === k);
      if (hit) return hit.value;
    }
    return "";
  };
  // Custom questions arrive with Meta-slugified names we can't predict
  // exactly ("which_branch?" etc.) — fall back to a contains-match.
  const takeLike = (fragment: string): string =>
    entries.find((e) => e.key.includes(fragment))?.value ?? "";

  const name = take("fullname", "name") || "Instant Form lead";
  const phoneRaw = take("phonenumber", "phone") || takeLike("phone");
  const email = take("email") || takeLike("email");
  const city = take("city") || takeLike("city") || takeLike("district");
  const branchAnswer = takeLike("branch");

  // "+919876543210" / "919876543210" / "09876..." → the 10-digit mobile the
  // backend + Double Tick expect. Keep the raw value in the message so a
  // mangled number is still recoverable by the admin.
  const phoneDigits = phoneRaw.replace(/\D/g, "");
  const phone10 = /^[6-9]\d{9}$/.test(phoneDigits.slice(-10)) ? phoneDigits.slice(-10) : "";

  // Loose-map the branch answer onto the canonical BRANCH_OPTIONS so the
  // admin row filters like website leads; unmatched answers ride the message.
  const branch =
    BRANCH_OPTIONS_ALL.find(
      (b) => branchAnswer && (norm(b).includes(norm(branchAnswer)) || norm(branchAnswer).includes(norm(b))),
    ) ?? "";

  const campaign = [lead.campaign_name, lead.ad_name].filter(Boolean).join(" · ");
  const message = [
    "Meta Instant Form lead",
    campaign ? `Ad: ${campaign}` : null,
    lead.platform ? `Platform: ${lead.platform}` : null,
    lead.is_organic ? "Organic (form shared/found unpaid)" : null,
    city ? `City: ${city}` : null,
    branchAnswer && !branch ? `Branch (as typed): ${branchAnswer}` : null,
    phoneRaw && !phone10 ? `Phone (as submitted): ${phoneRaw}` : null,
    `leadgen_id ${leadgenId}`,
  ]
    .filter((p): p is string => !!p)
    .join(" · ")
    .slice(0, 1000);

  // 1) Same admin inbox as every website enquiry. Phone is required by the
  //    backend serializer — a lead with an unparseable number is logged
  //    loudly below and stays in Meta's Leads Center (its only copy).
  if (phone10) {
    const r = await forwardToBackend("enquiry", {
      name,
      phone: phone10,
      email,
      branch,
      source: "meta-instant-form",
      message,
      consent: true, // the Instant Form carries the privacy-policy consent step
    });
    if (!r.ok) console.warn(`[meta-leads] backend ingest failed for lead ${leadgenId}: ${r.error}`);
    // Land it in the Sampark CRM too (2026-08-17) — until now Meta ad leads
    // stopped at the website inbox and never reached the consultants'
    // queues, callbacks, or the auto-ack. Deliberately NOT gated on r.ok:
    // a backend hiccup should not cost the CRM the lead (the CRM dedups by
    // mobile). The CRM's own ack covers the student confirmation.
    await forwardLeadToCrm({
      name, phone: phone10, email, branch,
      formType: "enquiry", source: "meta-instant-form",
      backendId: r.ok ? r.id : undefined,
    });
  } else {
    console.warn(`[meta-leads] lead ${leadgenId} has no usable Indian mobile ("${phoneRaw}") — skipping backend + CRM ingest — it exists ONLY in Meta's Leads Center, pull it by hand`);
  }

  // 2) Admin WhatsApp ping — RETIRED 4 Sep 2026 (owner decision). It pushed
  //    the legacy 4-placeholder contract into a 2-slot template, so it never
  //    delivered; since 17 Aug the Sampark CRM alerts the consultants itself
  //    (bipe_lead_alert / bipe_new_enquiry_alert) as soon as the forward
  //    above lands. Speed-to-lead lives in the CRM now, not here.

  // 3) Student confirmation now comes from the Sampark CRM's auto-ack
  //    (bipe_enquiry_response on the BIPE number) when the forward above
  //    lands — one ack, one sender, on the lead's timeline.
}
