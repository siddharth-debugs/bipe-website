/**
 * Best-effort forwarder that posts a sanitised copy of every accepted
 * form submission to the BIPE DRF backend (separate service / repo).
 *
 * Failures are swallowed and only logged — the public form must not
 * break if the backend is briefly down. The email path remains the
 * source of truth for delivery; the backend gives us a queryable record
 * for the admin dashboard.
 *
 * Required env (server-side, NOT prefixed with NEXT_PUBLIC_):
 *   BIPE_BACKEND_URL          base URL, e.g. https://api.bipevns.org/api/v1
 *   BIPE_INGEST_TOKEN         shared secret matching SUBMIT_INGEST_TOKEN on the backend
 */

type IngestKind = "apply" | "contact" | "visit";

const HEADER = "X-Bipe-Submit-Token";

function envBase(): string | null {
  return (process.env.BIPE_BACKEND_URL ?? "").trim() || null;
}

function envToken(): string | null {
  return (process.env.BIPE_INGEST_TOKEN ?? "").trim() || null;
}

export async function forwardToBackend(
  kind: IngestKind,
  payload: Record<string, unknown>,
): Promise<void> {
  const base = envBase();
  const token = envToken();
  if (!base || !token) {
    // Not configured (e.g. local dev without a backend). Silently skip.
    return;
  }

  const url = `${base.replace(/\/+$/, "")}/submissions/ingest/${kind}/`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [HEADER]: token,
      },
      body: JSON.stringify(payload),
      // 5s ceiling — never block the user's email confirmation.
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.warn(
        `[backend] ${kind} ingest returned ${res.status}: ${txt.slice(0, 240)}`,
      );
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown error";
    console.warn(`[backend] ${kind} ingest failed: ${msg}`);
  }
}
