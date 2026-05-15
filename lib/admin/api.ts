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
  },
  clear() {
    if (!isBrowser()) return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

async function refreshAccess(): Promise<string | null> {
  const r = Tokens.refresh();
  if (!r) return null;
  const res = await fetch(`${API_BASE_URL}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: r }),
  });
  if (!res.ok) {
    Tokens.clear();
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
    const msg =
      (data && typeof data === "object" && (data as { detail?: string }).detail) ||
      `Request failed (${res.status})`;
    throw new ApiError(msg as string, res.status, data);
  }

  return data as T;
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
  visit: SummaryByForm;
}

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
