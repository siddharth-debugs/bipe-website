"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { requestOtp, verifyOtp, Tokens, ApiError } from "@/lib/admin/api";

type Step = "phone" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const otpInputRef = useRef<HTMLInputElement | null>(null);

  // If already signed in, jump straight to dashboard.
  useEffect(() => {
    if (Tokens.access()) router.replace("/admin/dashboard");
  }, [router]);

  // Auto-focus the OTP field on step transition.
  useEffect(() => {
    if (step === "otp") setTimeout(() => otpInputRef.current?.focus(), 60);
  }, [step]);

  function readError(ex: unknown): string {
    if (ex instanceof ApiError) {
      const d = (ex.data as { detail?: string })?.detail;
      return d ?? ex.message;
    }
    if (
      ex instanceof TypeError &&
      /failed to fetch|networkerror|load failed/i.test(ex.message)
    ) {
      return "Could not reach the admin backend. Please retry in a moment.";
    }
    return ex instanceof Error ? ex.message : "Something went wrong.";
  }

  async function onPhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const r = await requestOtp(phone.trim());
      setHint(r.debug ?? null);
      setStep("otp");
    } catch (ex) {
      setErr(readError(ex));
    } finally {
      setBusy(false);
    }
  }

  async function onOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await verifyOtp(phone.trim(), otp.trim());
      router.replace("/admin/dashboard");
    } catch (ex) {
      setErr(readError(ex));
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    if (busy) return;
    setErr(null);
    setBusy(true);
    try {
      const r = await requestOtp(phone.trim());
      setHint(r.debug ?? null);
      setOtp("");
      otpInputRef.current?.focus();
    } catch (ex) {
      setErr(readError(ex));
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
            {step === "phone" ? "Welcome back." : "Verify your number."}
          </h1>
          <p style={{ color: "var(--ink-3)", fontSize: 14, marginTop: 8 }}>
            {step === "phone"
              ? "Sign in with the admin mobile number you registered."
              : `We sent a 6-digit OTP to ${phone}.`}
          </p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          {step === "phone" ? (
            <form onSubmit={onPhoneSubmit}>
              <label className="admin-label" htmlFor="phone">Mobile number</label>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                placeholder="98XXXXXXXX"
                className="admin-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                required
                pattern="[6-9][0-9]{9}"
                title="10-digit mobile number starting with 6-9"
              />

              {err && <ErrorBox>{err}</ErrorBox>}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={busy || phone.length !== 10}
                style={{ marginTop: 22, width: "100%" }}
              >
                {busy ? "Sending OTP…" : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={onOtpSubmit}>
              <label className="admin-label" htmlFor="otp">6-digit OTP</label>
              <input
                ref={otpInputRef}
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="123456"
                className="admin-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                pattern="[0-9]{6}"
                style={{
                  letterSpacing: "0.4em",
                  textAlign: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 18,
                }}
              />

              {hint && (
                <div
                  style={{
                    marginTop: 12,
                    padding: 10,
                    borderRadius: 8,
                    background: "color-mix(in oklab, var(--brand) 8%, var(--white))",
                    color: "var(--brand)",
                    fontSize: 12,
                    border: "1px dashed color-mix(in oklab, var(--brand) 30%, transparent)",
                  }}
                >
                  {hint}
                </div>
              )}

              {err && <ErrorBox>{err}</ErrorBox>}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={busy || otp.length !== 6}
                style={{ marginTop: 18, width: "100%" }}
              >
                {busy ? "Verifying…" : "Verify & sign in"}
              </button>

              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: 13,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                    setErr(null);
                    setHint(null);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    color: "var(--ink-3)",
                    cursor: "pointer",
                  }}
                >
                  ← Change number
                </button>
                <button
                  type="button"
                  onClick={resend}
                  disabled={busy}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    color: busy ? "var(--ink-4)" : "var(--brand)",
                    cursor: busy ? "not-allowed" : "pointer",
                    fontWeight: 600,
                  }}
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
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
          bipe.ac.in · admin
        </p>
      </div>
    </div>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </div>
  );
}
