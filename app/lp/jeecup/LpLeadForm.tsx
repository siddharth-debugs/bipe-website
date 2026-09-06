"use client";

import { useRef, useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DATA } from "@/lib/data";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";
import { FormSelect } from "@/components/ui/FormSelect";
import { Honeypot } from "@/components/shell/Honeypot";
import { track } from "@/lib/analytics";
import { trackMetaEvent } from "@/lib/metaEvents";
import { BRANCH_OPTIONS } from "@/lib/formOptions";
import { enquiryFormSchema, type EnquiryFormData } from "@/lib/validation";

/**
 * Compact lead form for the /lp/jeecup ad landing page.
 *
 * Two required fields (name, phone) + one optional (branch) = minimal friction
 * for paid mobile traffic — a conversion LP lives or dies on field count. It
 * rides the shared /api/submit "enquiry" contract (honeypot, rate-limit,
 * backend routing all inherited), tags the lead `source: "lp-jeecup"` for
 * attribution, and fires the Meta Lead (Pixel + CAPI, deduped) so the campaign
 * optimises on real conversions. Consent is disclosed inline (the lightweight
 * enquiry surface, like the site popup, treats consent as implied-on-submit).
 */
type Status =
  | { s: "idle" }
  | { s: "submitting" }
  | { s: "ok"; first: string; phone: string }
  | { s: "err"; msg: string };

export default function LpLeadForm() {
  const [status, setStatus] = useState<Status>({ s: "idle" });
  const honeypot = useRef<HTMLInputElement | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      formType: "enquiry",
      name: "",
      phone: "",
      branch: undefined,
      source: "lp-jeecup",
      consent: true,
    },
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<EnquiryFormData> = async (data) => {
    setStatus({ s: "submitting" });
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source: "lp-jeecup",
          website: honeypot.current?.value ?? "",
        }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        error?: string;
        fieldErrors?: Record<string, string[]>;
      };
      if (!res.ok || !json.ok) {
        if (json.fieldErrors) {
          for (const [f, m] of Object.entries(json.fieldErrors)) {
            if (m && m.length) setError(f as keyof EnquiryFormData, { message: m[0] });
          }
        }
        setStatus({ s: "err", msg: json.error ?? "Could not send. Please try again or WhatsApp us." });
        return;
      }
      track("lp_jeecup_submit", { branch: data.branch });
      void trackMetaEvent("Lead", { phone: data.phone, custom: { form: "lp-jeecup" } });
      setStatus({ s: "ok", first: data.name.trim().split(/\s+/)[0] || "there", phone: data.phone });
    } catch {
      setStatus({ s: "err", msg: "Network error. Try again or WhatsApp us." });
    }
  };

  const err = (k: keyof EnquiryFormData): string | undefined => {
    const e = errors[k as keyof typeof errors];
    return e?.message ? String(e.message) : undefined;
  };

  if (status.s === "ok") {
    return (
      <div style={{ textAlign: "center", padding: "20px 6px" }}>
        <span
          className="pill"
          style={{ background: "color-mix(in oklab, var(--success) 16%, transparent)", color: "var(--success)" }}
        >
          Received · we&apos;ll call you
        </span>
        <p
          className="serif"
          style={{ marginTop: 16, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(26px,5vw,38px)", lineHeight: 1.1, color: "var(--ink)" }}
        >
          Thanks, <span style={{ color: "var(--brand)" }}>{status.first}.</span>
        </p>
        <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.6 }}>
          Admissions will call <b>{status.phone}</b> shortly — in Hindi or English. Session 2026-27 is closed, so the call is about session 2027-28 and the JEECUP 2027 route to code&nbsp;4455.
        </p>
        <a
          href={DATA.contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-wa"
          style={{ marginTop: 18 }}
        >
          <WhatsAppIcon /> Chat now on WhatsApp
        </a>
      </div>
    );
  }

  return (
    // False positive via react-hook-form. The rule sees a function that reads
    // a ref (onSubmit reads the honeypot's current value) being passed to
    // handleSubmit() during render, and cannot tell that handleSubmit RETURNS
    // a submit handler rather than calling it. onSubmit runs only on form
    // submission, never during render, so the stale-render hazard the rule
    // guards against cannot occur here.
    // eslint-disable-next-line react-hooks/refs
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Honeypot ref={honeypot} />
      <div className={err("name") ? "field field-error" : "field"}>
        <label htmlFor="lp-name">
          Full name <span style={{ color: "var(--danger)" }}>*</span>
          <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.6, fontSize: 12 }}>· पूरा नाम</span>
        </label>
        <input
          id="lp-name"
          type="text"
          autoComplete="name"
          placeholder="Your name (or guardian's)"
          aria-required
          aria-invalid={!!err("name") || undefined}
          {...register("name")}
        />
        {err("name") && <span role="alert" className="error-msg">{err("name")}</span>}
      </div>

      <div className={err("phone") ? "field field-error" : "field"} style={{ marginTop: 12 }}>
        <label htmlFor="lp-phone">
          Mobile <span style={{ color: "var(--danger)" }}>*</span>
          <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.6, fontSize: 12 }}>· मोबाइल नंबर</span>
        </label>
        <input
          id="lp-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={10}
          placeholder="98XXXXXXXX"
          aria-required
          aria-invalid={!!err("phone") || undefined}
          {...register("phone", {
            onChange: (e) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
            },
          })}
        />
        {err("phone") && <span role="alert" className="error-msg">{err("phone")}</span>}
      </div>

      <div className="field" style={{ marginTop: 12 }}>
        <label htmlFor="lp-branch">
          Branch interest <span className="muted" style={{ fontSize: 11 }}>(optional)</span>
        </label>
        <Controller
          control={control}
          name="branch"
          render={({ field }) => (
            <FormSelect
              id="lp-branch"
              value={field.value || ""}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              placeholder="Choose a branch…"
              options={BRANCH_OPTIONS.map((b) => ({ value: b, label: b }))}
            />
          )}
        />
      </div>

      {status.s === "err" && (
        <div
          role="alert"
          style={{ marginTop: 12, padding: "10px 12px", borderRadius: 9, background: "color-mix(in oklab, var(--danger) 12%, var(--paper))", color: "var(--danger)", fontSize: 13.5 }}
        >
          {status.msg}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={isSubmitting}
        style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
      >
        {isSubmitting ? "Sending…" : <>Ask about 2027-28 <ArrowIcon size={15} /></>}
      </button>

      <p style={{ marginTop: 10, fontSize: 12, color: "var(--ink-3)", lineHeight: 1.5, textAlign: "center" }}>
        Free · 2 minutes. By sending this, you agree BIPE Admissions may call / WhatsApp you about 2027-28 admissions. We never share your details.
      </p>

      <div style={{ marginTop: 12, textAlign: "center" }}>
        <a
          href={DATA.contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, color: "var(--brand)", fontWeight: 600 }}
        >
          Or WhatsApp us instantly <ArrowIcon size={13} />
        </a>
      </div>
    </form>
  );
}
