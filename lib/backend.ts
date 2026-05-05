/**
 * Forwards every accepted form submission to the BIPE DRF backend
 * (separate Django service / repo). The backend is the single source
 * of truth for submissions — see app/api/submit/route.ts.
 *
 * Required env (server-side, NOT prefixed with NEXT_PUBLIC_):
 *   BIPE_BACKEND_URL          base URL, e.g. https://api.bipevns.org/api/v1
 *   BIPE_INGEST_TOKEN         shared secret matching SUBMIT_INGEST_TOKEN on the backend
 */

type IngestKind = "apply" | "contact" | "visit";

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
