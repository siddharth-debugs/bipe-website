"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login, Tokens, ApiError } from "@/lib/admin/api";

export default function LoginPage() {
  const router = useRouter();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // If already signed in, jump straight to dashboard.
  useEffect(() => {
    if (Tokens.access()) router.replace("/admin/dashboard");
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await login(u.trim(), p);
      router.replace("/admin/dashboard");
    } catch (ex) {
      let msg: string;
      if (ex instanceof ApiError) {
        msg = (ex.data as { detail?: string })?.detail ?? ex.message;
      } else if (
        ex instanceof TypeError &&
        /failed to fetch|networkerror|load failed/i.test(ex.message)
      ) {
        // Browser-thrown network error — likely the backend isn't reachable
        // from this origin. Tell the user something useful.
        msg =
          "Could not reach the admin backend. The API server is unreachable — verify that NEXT_PUBLIC_API_BASE_URL is set on this deployment and the backend is running.";
      } else {
        msg = ex instanceof Error ? ex.message : "Could not sign in.";
      }
      setErr(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(ellipse at top, color-mix(in oklab, var(--brand) 16%, var(--paper)) 0%, var(--paper) 60%)",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: 999,
              background: "var(--brand)",
              color: "var(--paper)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            BIPE · Admin
          </div>
          <h1 className="admin-h1" style={{ marginTop: 18, color: "var(--ink)" }}>
            Welcome back.
          </h1>
          <p style={{ color: "var(--ink-3)", fontSize: 14, marginTop: 8 }}>
            Sign in to manage form submissions and admissions data.
          </p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <form onSubmit={onSubmit}>
            <label className="admin-label" htmlFor="u">Username</label>
            <input
              id="u"
              className="admin-input"
              autoComplete="username"
              value={u}
              onChange={(e) => setU(e.target.value)}
              required
            />

            <div style={{ height: 14 }} />
            <label className="admin-label" htmlFor="p">Password</label>
            <input
              id="p"
              type="password"
              className="admin-input"
              autoComplete="current-password"
              value={p}
              onChange={(e) => setP(e.target.value)}
              required
            />

            {err && (
              <div
                role="alert"
                style={{
                  marginTop: 14,
                  padding: 10,
                  borderRadius: 8,
                  background: "color-mix(in oklab, var(--danger) 10%, var(--white))",
                  color: "var(--danger)",
                  fontSize: 13,
                  border: "1px solid color-mix(in oklab, var(--danger) 30%, transparent)",
                }}
              >
                {err}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={busy}
              style={{ marginTop: 22, width: "100%" }}
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p
          style={{
            marginTop: 18,
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--ink-4)",
          }}
        >
          bipevns.org · admin
        </p>
      </div>
    </div>
  );
}
