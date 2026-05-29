/**
 * Forwards every accepted form submission to the BIPE DRF backend
 * (separate Django service / repo). The backend is the single source
 * of truth for submissions — see app/api/submit/route.ts.
 *
 * Required env (server-side, NOT prefixed with NEXT_PUBLIC_):
 *   BIPE_BACKEND_URL          base URL, e.g. https://api.bipevns.org/api/v1
 *   BIPE_INGEST_TOKEN         shared secret matching SUBMIT_INGEST_TOKEN on the backend
 *
 * NOTE on the api.bipevns.org reference (do not "clean up" during the
 * website canonical migration to bipe.ac.in): the backend lives at
 * api.bipevns.org behind Cloudflare SSL → EC2 origin (gunicorn).
 * The subdomain stays on .org independent of the website canonical;
 * it does NOT migrate with the website. Touching the env value
 * without coordinating with the Django/EC2 deployment will break
 * every form on the site.
 */

type IngestKind =
  | "apply"
  | "contact"
  | "enquiry"
  | "visit"
  // 29 May 2026 — alumni introduction requests. The visitor wants to
  // talk to a specific alumnus; the placement cell verifies the
  // request out-of-band before sharing any number. Backend endpoint
  // is /submissions/ingest/alumni-contact/ — until the Django side
  // ships that route, POSTs return 404 + the visitor sees the
  // friendly "couldn't save" message + WhatsApp fallback. The full
  // payload still lands in Vercel server logs so the operator has
  // an audit trail in the gap.
  | "alumni-contact";

const HEADER = "X-Bipe-Submit-Token";

export type IngestResult =
  | { ok: true; id: number | null }
  | { ok: false; error: string };

function envBase(): string | null {
  return (process.env.BIPE_BACKEND_URL ?? "").trim() || null;
}

function envToken(): string | null {
  return (process.env.BIPE_INGEST_TOKEN ?? "").trim() || null;
}

export async function forwardToBackend(
  kind: IngestKind,
  payload: Record<string, unknown>,
): Promise<IngestResult> {
  const base = envBase();
  const token = envToken();
  if (!base || !token) {
    console.warn(
      `[backend] ${kind} ingest skipped — BIPE_BACKEND_URL=${base ? "set" : "missing"} BIPE_INGEST_TOKEN=${token ? "set" : "missing"}`,
    );
    return {
      ok: false,
      error: "Submissions service is not configured. Please WhatsApp us instead.",
    };
  }

  const url = `${base.replace(/\/+$/, "")}/submissions/ingest/${kind}/`;
  const started = Date.now();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [HEADER]: token,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });
    const ms = Date.now() - started;
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.warn(
        `[backend] ${kind} ingest -> ${url} ${res.status} in ${ms}ms: ${txt.slice(0, 240)}`,
      );
      return {
        ok: false,
        error: "We couldn't save your submission. Please try again or WhatsApp us.",
      };
    }
    const json = (await res.json().catch(() => ({}))) as { id?: number };
    console.log(`[backend] ${kind} ingest -> ${url} 201 in ${ms}ms id=${json.id ?? "?"}`);
    return { ok: true, id: json.id ?? null };
  } catch (err) {
    const ms = Date.now() - started;
    const msg = err instanceof Error ? err.message : "unknown error";
    console.warn(`[backend] ${kind} ingest -> ${url} failed in ${ms}ms: ${msg}`);
    return {
      ok: false,
      error: "Network problem reaching the server. Please try again or WhatsApp us.",
    };
  }
}
