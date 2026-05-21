"use client";

import React, { useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DATA } from "@/lib/data";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";
import { FormSelect } from "@/components/ui/FormSelect";
import {
  contactFormSchema,
  contactDefaults,
  BRANCH_OPTIONS,
  SOURCE_OPTIONS,
  type ContactFormData,
} from "@/lib/validation";

type SubmitStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; firstName: string; phone: string }
  | { state: "error"; message: string };

export function ContactForm() {
  const [status, setStatus] = useState<SubmitStatus>({ state: "idle" });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: contactDefaults,
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setStatus({ state: "submitting" });
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as {
        ok: boolean;
        id?: number;
        error?: string;
        fieldErrors?: Record<string, string[]>;
      };
      if (!res.ok || !json.ok) {
        if (json.fieldErrors) {
          for (const [field, msgs] of Object.entries(json.fieldErrors)) {
            if (msgs && msgs.length > 0) {
              setError(field as keyof ContactFormData, { message: msgs[0] });
            }
          }
        }
        setStatus({
          state: "error",
          message: json.error ?? "Could not send. Please try again.",
        });
        return;
      }
      setStatus({
        state: "success",
        firstName: data.name.trim().split(/\s+/)[0] || "there",
        phone: data.phone,
      });
    } catch {
      setStatus({
        state: "error",
        message: "Network error. Try again or WhatsApp us.",
      });
    }
  };

  const fieldError = (k: keyof ContactFormData): string | undefined => {
    const e = errors[k as keyof typeof errors];
    return e?.message ? String(e.message) : undefined;
  };

  // ============ SUCCESS STATE ============
  if (status.state === "success") {
    return (
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
          width: 520, height: 520, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 22%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />
        <div style={{ position: "relative", textAlign: "center", padding: "32px 20px" }}>
          <span className="pill" style={{ background: "color-mix(in oklab, var(--success) 16%, transparent)", color: "var(--success)" }}>
            Received · we&apos;ll reply in &lt;24h
          </span>
          <p
            className="serif"
            style={{
              marginTop: 22,
              fontStyle: "italic", fontWeight: 400,
              fontSize: "clamp(36px, 4.6vw, 64px)",
              lineHeight: 1.05, letterSpacing: "-0.02em",
              maxWidth: "18ch", margin: "22px auto 0",
              color: "var(--ink)",
            }}
          >
            Thanks, <span style={{ color: "var(--brand)" }}>{status.firstName}.</span>
          </p>
          <p style={{ marginTop: 20, color: "var(--ink-2)", fontSize: 16, lineHeight: 1.6, maxWidth: "52ch", margin: "20px auto 0" }}>
            Admissions has your message. We&apos;ll call{" "}
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--brand)" }}>
              {status.phone}
            </span>{" "}
            within 24 hours, Monday to Saturday — in Hindi or English.
          </p>
<div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
              <WhatsAppIcon /> WhatsApp instead
            </a>
            <button
              type="button"
              onClick={() => {
                reset(contactDefaults);
                setStatus({ state: "idle" });
              }}
              className="btn btn-ghost"
            >
              Send another <ArrowIcon size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const errClass = (k: keyof ContactFormData) => (fieldError(k) ? "field field-error" : "field");

  // Per-schema required-field set. Stays in sync with contactFormSchema
  // (in lib/validation.ts). aria-required announces "required" to
  // screen readers at the same fields zod validates as required.
  const REQUIRED: ReadonlySet<keyof ContactFormData> = new Set([
    "name", "phone", "branch", "consent",
  ] as const);

  /**
   * Produce the a11y attribute bundle for one form field.
   * Pair with `<span id={`cf-${k}-err`} role="alert">` when fieldError
   * is truthy — the aria-describedby points there.
   */
  const fieldProps = (k: keyof ContactFormData) => {
    const id = `cf-${String(k)}`;
    const err = !!fieldError(k);
    return {
      id,
      "aria-required": REQUIRED.has(k) || undefined,
      "aria-invalid": err || undefined,
      "aria-describedby": err ? `${id}-err` : undefined,
    } as const;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="bipe-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className={errClass("name")}>
          <label htmlFor="cf-name">
            Full name <span style={{ color: "var(--danger)" }}>*</span>
            <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· पूरा नाम</span>
          </label>
          <input
            {...fieldProps("name")}
            type="text"
            autoComplete="name"
            placeholder="Your name (or guardian's)"
            {...register("name")}
          />
          {fieldError("name") && <span id="cf-name-err" role="alert" className="error-msg">{fieldError("name")}</span>}
        </div>
        <div className={errClass("phone")}>
          <label htmlFor="cf-phone">
            Mobile <span style={{ color: "var(--danger)" }}>*</span>
            <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· मोबाइल नंबर</span>
          </label>
          <input
            {...fieldProps("phone")}
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={10}
            placeholder="98XXXXXXXX"
            {...register("phone", {
              onChange: (e) => {
                e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
              },
            })}
          />
          {fieldError("phone") && <span id="cf-phone-err" role="alert" className="error-msg">{fieldError("phone")}</span>}
        </div>
      </div>

      <div className="bipe-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 14 }}>
        <div className={errClass("email")}>
          <label htmlFor="cf-email">
            Email <span className="muted" style={{ fontSize: 11 }}>(optional)</span>
            <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· ईमेल</span>
          </label>
          <input
            {...fieldProps("email")}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {fieldError("email") && <span id="cf-email-err" role="alert" className="error-msg">{fieldError("email")}</span>}
        </div>
        <div className={errClass("branch")}>
          <label htmlFor="cf-branch">
            Branch interest <span style={{ color: "var(--danger)" }}>*</span>
            <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· ब्रांच में रुचि</span>
          </label>
          <Controller
            control={control}
            name="branch"
            render={({ field }) => (
              <FormSelect
                id="cf-branch"
                value={field.value || ""}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                invalid={!!fieldError("branch")}
                required
                describedBy={fieldError("branch") ? "cf-branch-err" : undefined}
                placeholder="Choose a branch…"
                options={BRANCH_OPTIONS.map((b) => ({ value: b, label: b }))}
              />
            )}
          />
          {fieldError("branch") && <span id="cf-branch-err" role="alert" className="error-msg">{fieldError("branch")}</span>}
        </div>
      </div>

      <div className="field" style={{ marginTop: 14 }}>
        <label htmlFor="cf-source">
          How did you hear about BIPE? <span className="muted" style={{ fontSize: 11 }}>(optional)</span>
          <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· BIPE के बारे में कैसे जाना?</span>
        </label>
        <Controller
          control={control}
          name="source"
          render={({ field }) => (
            <FormSelect
              id="cf-source"
              value={field.value || ""}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              placeholder="Pick the closest match"
              options={SOURCE_OPTIONS.map((s) => ({ value: s, label: s }))}
            />
          )}
        />
      </div>

      <div className={errClass("message")} style={{ marginTop: 14 }}>
        <label htmlFor="cf-message">
          Your message <span className="muted" style={{ fontSize: 11 }}>(optional)</span>
          <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· आपका संदेश</span>
        </label>
        <textarea
          {...fieldProps("message")}
          rows={4}
          placeholder="Anything specific you'd like answered before we call back?"
          {...register("message")}
        />
        {fieldError("message") && <span id="cf-message-err" role="alert" className="error-msg">{fieldError("message")}</span>}
      </div>

      <label
        htmlFor="cf-consent"
        style={{
          marginTop: 18,
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          padding: "14px 16px",
          background: "color-mix(in oklab, var(--brand) 5%, var(--white))",
          border: fieldError("consent") ? "1px solid var(--danger)" : "1px solid var(--line)",
          borderRadius: 12,
          cursor: "pointer",
        }}
      >
        <input
          {...fieldProps("consent")}
          type="checkbox"
          {...register("consent")}
          style={{ marginTop: 4, accentColor: "var(--brand)" }}
        />
        <span style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
          I agree to be contacted by BIPE Admissions on the mobile number above for the purpose of this query. We&apos;ll never share your details with third parties.
        </span>
      </label>
      {fieldError("consent") && (
        <div id="cf-consent-err" role="alert" className="error-msg" style={{ marginTop: 6 }}>
          {fieldError("consent")}
        </div>
      )}

      {status.state === "error" && (
        <div
          role="alert"
          style={{
            marginTop: 14,
            padding: "12px 14px",
            borderRadius: 10,
            background: "color-mix(in oklab, var(--danger) 12%, var(--paper))",
            border: "1px solid color-mix(in oklab, var(--danger) 30%, transparent)",
            color: "var(--danger)",
            fontSize: 14,
          }}
        >
          {status.message}
        </div>
      )}

      <div
        style={{
          marginTop: 22,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending…" : <>Send to admissions <ArrowIcon size={14} /></>}
        </button>
        <a
          href={DATA.contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 14,
            color: "var(--brand)",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          Or, just WhatsApp us instantly <ArrowIcon size={14} />
        </a>
      </div>
    </form>
  );
}
