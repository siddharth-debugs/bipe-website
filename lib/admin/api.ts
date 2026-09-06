import { ResponseCache } from "./responseCache";

/**
 * Thin client for the BIPE DRF backend.
 *
 * - Stores tokens in localStorage (under `bipe.access` / `bipe.refresh`).
 * - Auto-refreshes the access token on a 401 the first time around.
 * - Throws ApiError with `.status` and `.data` on non-2xx responses.
 */

/**
 * The dashboard talks to its OWN origin under /api/admin, which Next.js
 * (next.config.ts → rewrites) proxies server-side to the real Django
 * backend. Browser only sees HTTPS Vercel; the HTTP hop to EC2 is
 * server-to-server. No CORS preflight, no mixed content.
 *
 * Override with NEXT_PUBLIC_API_BASE_URL for local dev hitting Django
 * directly (e.g. http://127.0.0.1:8000/api/v1).
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/admin";

const ACCESS_KEY = "bipe.access";
const REFRESH_KEY = "bipe.refresh";

/**
 * Cache of GET responses, shared by every admin screen. See
 * lib/admin/responseCache.ts for the rules — the short version is that a
 * write empties it, signing in or out empties it, and entries expire on
 * their own after 20 seconds.
 *
 * Exported so the two Refresh buttons (Inbox and Users) can empty it before
 * they reload: a person pressing Refresh is asking for the current truth,
 * and serving them a cached copy would make the button a lie.
 *
 * Browser-only, enforced at the call site in api(). A module-level Map on
 * the server would be shared across every request the server handles, which
 * is one operator's data reaching another's screen — the cache is never
 * populated there.
 */
export const responseCache = new ResponseCache();

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export const Tokens = {
  access(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(ACCESS_KEY);
  },
  refresh(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(REFRESH_KEY);
  },
  set(access: string, refresh?: string) {
    if (!isBrowser()) return;
    localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
    // A new token can mean a new person at this browser. Nothing cached for
    // the previous one may survive that. (It also fires on a routine token
    // refresh for the same user, where the only cost is one refetch.)
    responseCache.clear();
  },
  clear() {
    if (!isBrowser()) return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    responseCache.clear();
  },
};

/**
 * End the session and get the operator to the login screen.
 *
 * Until now nothing did the second half. When a token expired, refreshAccess()
 * cleared the tokens and returned null, every caller's request failed, and the
 * dashboard sat there rendering its zero states — "0 new · 0 leads · All leads
 * · 0" — with no indication that anything was wrong. To an admissions operator
 * that reads as the leads having vanished, which is about the most alarming
 * thing this panel could say and was not even true.
 *
 * The layout does redirect on a rejected token, but only from its one mount
 * check of /auth/me/. A session that dies later, with the tab already open, was
 * never anyone's job to notice.
 *
 * A hard navigation rather than the router, for two reasons: this module has no
 * router to reach, and a full load is the right thing for a sign-out anyway —
 * nothing in memory survives to leak into the next person's session.
 */
let endingSession = false;

function endSession(): void {
  Tokens.clear();
  if (!isBrowser() || endingSession) return;
  // Already on the login screen; there is nowhere to send them.
  if (window.location.pathname === "/admin") return;
  endingSession = true;
  // replace(), not assign(): Back should not return to a dead dashboard.
  window.location.replace("/admin");
}

/**
 * One refresh at a time, however many requests hit a 401 together.
 *
 * The Inbox fires five endpoints at once and the layout adds a sixth. When a
 * token expires they all 401 in the same tick, and each used to start its own
 * refresh — six POSTs to /auth/refresh/ for one dead session, all racing to
 * write the same tokens. Callers now share whichever attempt is in flight.
 */
let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccess(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = performRefresh();
  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

async function performRefresh(): Promise<string | null> {
  const r = Tokens.refresh();
  if (!r) {
    endSession();
    return null;
  }
  const res = await fetch(`${API_BASE_URL}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: r }),
  });
  if (!res.ok) {
    // The server has refused the refresh token too. There is no way back to a
    // working session from here, so stop pretending there is one.
    endSession();
    return null;
  }
  const data = (await res.json()) as { access: string; refresh?: string };
  Tokens.set(data.access, data.refresh);
  return data.access;
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  searchParams?: Record<string, string | number | boolean | undefined>;
  /** When true, send the token in Authorization. Default true. */
  authed?: boolean;
}

export async function api<T = unknown>(
  path: string,
  opts: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, searchParams, authed = true } = opts;
  const isRead = method === "GET";

  // API_BASE_URL may be absolute (http://...) or relative (/api/admin).
  // For relative paths, anchor against window.location so URL() can parse.
  const raw = `${API_BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
  const url = /^https?:\/\//i.test(raw)
    ? new URL(raw)
    : new URL(raw, isBrowser() ? window.location.origin : "http://localhost");
  if (searchParams) {
    for (const [k, v] of Object.entries(searchParams)) {
      if (v === undefined || v === "") continue;
      url.searchParams.set(k, String(v));
    }
  }

  // Served from the shared cache when it is a GET and we have a live copy.
  // The full URL — path plus query string — is the key, so /content/faculty/
  // and /content/faculty/?page=2 are correctly different entries.
  const cacheKey = url.toString();
  if (isRead && isBrowser()) {
    const cached = responseCache.get(cacheKey);
    if (cached.hit) return cached.data as T;
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authed) {
    const t = Tokens.access();
    if (t) headers.Authorization = `Bearer ${t}`;
  }

  let res = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (res.status === 401 && authed) {
    const newAccess = await refreshAccess();
    if (newAccess) {
      headers.Authorization = `Bearer ${newAccess}`;
      res = await fetch(url.toString(), {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        cache: "no-store",
      });
    }
  }

  // Anything that is not a GET may have changed anything. Empty the whole
  // cache, and do it whatever the response was: a write that failed leaves
  // the server in a state we did not predict either, and the only cost of
  // being wrong in this direction is one refetch.
  //
  // Placed before the error check below so a rejected write clears it too.
  if (!isRead) responseCache.clear();

  let data: unknown = null;
  if (res.status !== 204) {
    const txt = await res.text();
    try {
      data = txt ? JSON.parse(txt) : null;
    } catch {
      data = txt;
    }
  }

  if (!res.ok) {
    const msg = extractErrorMessage(data, res.status);
    throw new ApiError(msg, res.status, data);
  }

  // Only successful reads are stored — the throw above means an error body
  // never reaches this line.
  if (isRead && isBrowser()) responseCache.set(cacheKey, data);

  return data as T;
}

/**
 * Build a human-readable error message from a DRF response body.
 *
 * DRF returns errors in several shapes depending on the failure:
 *   - { detail: "string" }                                 — auth / permission
 *   - { field: ["error 1", "error 2"], other_field: [...] } — serializer validation
 *   - { non_field_errors: ["..."] }                         — top-level rule
 *   - { ok: false, fieldErrors: { field: ["..."] } }        — Next route handlers
 *   - plain string                                          — fallback
 *
 * This flattens whichever shape we get into a single sentence the UI
 * can render via `error.message`, while still keeping the raw payload
 * on `error.data` so callers can inspect field-level errors.
 */
function extractErrorMessage(data: unknown, status: number): string {
  if (typeof data === "string" && data.trim()) return data.slice(0, 400);
  if (!data || typeof data !== "object") {
    return `Request failed (${status})`;
  }
  const obj = data as Record<string, unknown>;

  // `detail` (DRF auth / permission errors)
  if (typeof obj.detail === "string") return obj.detail;

  // Next.js route-handler shape: { ok: false, fieldErrors: { field: ["..."] } }
  const fe = (obj.fieldErrors ?? obj.field_errors) as
    | Record<string, string[] | string>
    | undefined;
  if (fe && typeof fe === "object") {
    const parts: string[] = [];
    for (const [field, val] of Object.entries(fe)) {
      const msgs = Array.isArray(val) ? val : [String(val)];
      parts.push(`${field}: ${msgs.join("; ")}`);
    }
    if (parts.length) return parts.join(" · ");
  }

  // DRF serializer shape: { field: ["..."], non_field_errors: ["..."] }
  // Heuristic: every value is an array of strings.
  const drfParts: string[] = [];
  for (const [field, val] of Object.entries(obj)) {
    if (Array.isArray(val) && val.every((x) => typeof x === "string")) {
      const label = field === "non_field_errors" ? "" : `${field}: `;
      drfParts.push(`${label}${(val as string[]).join("; ")}`);
    }
  }
  if (drfParts.length) return drfParts.join(" · ");

  return `Request failed (${status})`;
}

// ─── Auth helpers ──────────────────────────────────────────────────────────
//
// The dashboard uses phone-OTP login. The legacy username/password flow
// has been removed — `requestOtp` issues an OTP for an allowlisted admin
// phone, `verifyOtp` exchanges a correct OTP for a SimpleJWT pair.
//
// Dummy admin numbers (e.g. 9000000001) accept the OTP "123456" in any
// environment — see services_otp.py on the backend.

export interface OtpRequestResult {
  success: boolean;
  expiresIn: number;
  /** Backend hint shown when SMS is bypassed (DEBUG / dummy phone). */
  debug?: string;
}

export async function requestOtp(phone: string): Promise<OtpRequestResult> {
  return api<OtpRequestResult>("/auth/request-otp/", {
    method: "POST",
    body: { phone },
    authed: false,
  });
}

export async function verifyOtp(
  phone: string,
  otp: string,
): Promise<{ access: string; refresh: string }> {
  const data = await api<{ access: string; refresh: string }>(
    "/auth/verify-otp/",
    { method: "POST", body: { phone, otp }, authed: false },
  );
  Tokens.set(data.access, data.refresh);
  return data;
}

export async function logout(): Promise<void> {
  const r = Tokens.refresh();
  if (r) {
    try {
      await api("/auth/logout/", { method: "POST", body: { refresh: r } });
    } catch {
      // best-effort blacklist; clear tokens regardless.
    }
  }
  Tokens.clear();
}

// ─── Domain types ──────────────────────────────────────────────────────────
export type SubmissionStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "enrolled"
  | "rejected"
  | "spam";

export interface BaseSubmission {
  id: number;
  name: string;
  phone: string;
  email: string;
  branch: string;
  consent: boolean;
  /** Notes the user wrote in the form. */
  notes: string;
  /** Internal staff remarks added from the dashboard. Never seen by the user. */
  admin_notes: string;
  status: SubmissionStatus;
  source_ip: string | null;
  user_agent: string;
  created_at: string;
  updated_at: string;
}

export interface ApplySubmission extends BaseSubmission {
  parent: string;
  category: string;
  board: string;
  marks: string;
  source: string;
  visit: string;
  visit_date: string;
  visit_time: string;
}

export interface ContactSubmission extends BaseSubmission {
  source: string;
  message: string;
}

export interface EnquirySubmission extends BaseSubmission {
  source: string;
  message: string;
}

export interface VisitSubmission extends BaseSubmission {
  visit_date: string;
  visit_time: string;
  party: string;
  needs_shuttle: boolean;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface SummaryByForm {
  new: number;
  contacted: number;
  qualified: number;
  enrolled: number;
  rejected: number;
  spam: number;
  total: number;
}
export interface Summary {
  apply: SummaryByForm;
  contact: SummaryByForm;
  enquiry: SummaryByForm;
  visit: SummaryByForm;
}

// ─── FollowUp (admin-logged contact attempts) ──────────────────────────────
//
// Lives alongside submissions. One FollowUp belongs to a phone-deduped
// "lead group" via `leadKey` (normalised 10-digit phone). The backend
// auto-derives `status` from `outcome` via OUTCOME_TO_STATUS — operators
// pick an outcome, the status follows.
export type FollowUpMedium =
  | "call"
  | "whatsapp"
  | "sms"
  | "email"
  | "in_person"
  | "other";

export type FollowUpOutcome =
  | ""
  | "left_message"
  | "followup_needed"
  | "no_answer"
  | "busy"
  | "switched_off"
  | "not_reachable"
  | "wrong_number"
  | "interested"
  | "converted"
  | "not_interested"
  | "spam"
  | "other";

export type LeadStatus =
  | ""
  | "new"
  | "in_progress"
  | "closed_win"
  | "closed_loss"
  | "spam";

export interface FollowUp {
  id: number;
  leadKey: string;
  medium: FollowUpMedium;
  outcome: FollowUpOutcome;
  status: Exclude<LeadStatus, "new">;
  interestCourse: string;
  remarks: string;
  nextActionAt: string | null;
  createdBy: string;
  createdAt: string;
}

export const OUTCOME_TO_STATUS: Record<Exclude<FollowUpOutcome, "">, Exclude<LeadStatus, "" | "new">> = {
  left_message: "in_progress",
  followup_needed: "in_progress",
  no_answer: "in_progress",
  busy: "in_progress",
  switched_off: "in_progress",
  not_reachable: "in_progress",
  interested: "in_progress",
  other: "in_progress",
  converted: "closed_win",
  not_interested: "closed_loss",
  wrong_number: "spam",
  spam: "spam",
};

export interface MeRole {
  id: number;
  name: string;
}

export interface Me {
  id: number;
  /** Mobile number used to sign in (the OTP-allowlisted admin phone). */
  phone: string;
  /** Friendly display name from the UserProfile / AdminPhone record. */
  name: string;
  email: string;
  avatar_url?: string;
  /** Display label for the user's primary role badge. */
  primary_role?: string;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string | null;
  /** Groups (= roles) the user belongs to. */
  roles?: MeRole[];
  /**
   * Flat list of permission codes the user has, in
   * ``app_label.codename`` form. Superuser short-circuits to ``["*"]``
   * so the frontend can grant everything without loading the full
   * permission catalogue.
   */
  permissions?: string[];
}

/**
 * True if the current user has (any of) the given permission codes.
 * Superusers always return true.
 */
export function hasPerm(me: Me | null, ...codes: string[]): boolean {
  if (!me) return false;
  if (me.is_superuser) return true;
  if (me.permissions?.includes("*")) return true;
  if (!codes.length) return true;
  return codes.some((c) => me.permissions?.includes(c));
}
