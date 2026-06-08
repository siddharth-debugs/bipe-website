"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DATA } from "@/lib/data";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";
import { FormSelect } from "@/components/ui/FormSelect";
import { Honeypot } from "@/components/shell/Honeypot";
import { track } from "@/lib/analytics";
import {
  applyFormSchema,
  applyDefaults,
  BRANCH_OPTIONS,
  CATEGORY_OPTIONS,
  type ApplyFormData,
} from "@/lib/validation";

type SubmitStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; ref: string }
  | { state: "error"; message: string };

export function ApplyView() {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ state: "idle" });
  const honeypotRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ApplyFormData>({
    resolver: zodResolver(applyFormSchema),
    defaultValues: { ...applyDefaults, visit: "no", consent: true },
    mode: "onTouched",
  });

  const name = watch("name");

  const onSubmit: SubmitHandler<ApplyFormData> = async (data) => {
    setSubmitStatus({ state: "submitting" });
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          visit: "no",
          consent: true,
          website: honeypotRef.current?.value ?? "",
        }),
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
              setError(field as keyof ApplyFormData, { message: msgs[0] });
            }
          }
        }
        setSubmitStatus({
          state: "error",
          message: json.error ?? "Submission failed. Please try again.",
        });
        return;
      }
      const ref = json.id
        ? `BIPE-${String(json.id).padStart(6, "0")}`
        : "BIPE-PENDING";
      track("apply_submit", { branch: data.branch, ref });
      setSubmitStatus({ state: "success", ref });
    } catch {
      setSubmitStatus({
        state: "error",
        message: "Network error. Try again or WhatsApp us.",
      });
    }
  };

  const fieldError = (k: keyof ApplyFormData): string | undefined => {
    const e = errors[k as keyof typeof errors];
    return e?.message ? String(e.message) : undefined;
  };

  const REQUIRED: ReadonlySet<keyof ApplyFormData> = new Set([
    "name", "phone", "branch",
  ] as const);

  const fieldProps = (k: keyof ApplyFormData) => {
    const id = String(k);
    const err = !!fieldError(k);
    return {
      id,
      "aria-required": REQUIRED.has(k) || undefined,
      "aria-invalid": err || undefined,
      "aria-describedby": err ? `${id}-err` : undefined,
    } as const;
  };

  // ============ SUCCESS STATE ============
  if (submitStatus.state === "success") {
    return (
      <section className="section" style={{ position: "relative", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "64px 64px", pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", left: "50%", top: "20%", transform: "translateX(-50%)",
          width: 520, height: 520, borderRadius: "50%",
          background: "color-mix(in oklab, var(--brand) 22%, transparent)",
          filter: "blur(140px)", pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative", maxWidth: 720, textAlign: "center", padding: "60px 24px" }}>
          <div style={{
            width: 92, height: 92, borderRadius: 999,
            background: "var(--brand)", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto", fontSize: 42, fontWeight: 600,
            boxShadow: "0 24px 60px -16px color-mix(in oklab, var(--brand) 50%, transparent)",
          }}>
            ✓
          </div>
          <div className="eyebrow" style={{ marginTop: 28, color: "var(--brand)" }}>Application received</div>
          <h2 className="bipe-h1" style={{ marginTop: 14 }}>
            Got it,{" "}
            <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>
              {(name?.split(" ")[0]) || "friend"}.
            </span>
          </h2>
          <p className="lead" style={{ marginTop: 18, margin: "18px auto 0", maxWidth: "52ch" }}>
            Reference{" "}
            <b style={{ color: "var(--brand)", fontFamily: "var(--font-mono)" }}>
              {submitStatus.ref}
            </b>
            . Our admissions cell will call within 24 hours.
          </p>
          <div className="row" style={{ justifyContent: "center", marginTop: 36, flexWrap: "wrap" }}>
            <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-lg">
              <WhatsAppIcon /> Continue on WhatsApp
            </a>
            <Link href="/" className="btn btn-ghost btn-lg">Back to home</Link>
          </div>
        </div>
      </section>
    );
  }

  // ============ FORM ============
  return (
    <section id="apply-form" className="section" style={{ position: "relative", overflow: "hidden", paddingTop: 32, scrollMarginTop: 80 }}>
      <div className="container" style={{ maxWidth: 820 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Honeypot ref={honeypotRef} />
          <div style={{
            position: "relative", overflow: "hidden",
            borderRadius: 24,
            border: "1px solid var(--line)",
            background: "var(--white)",
            padding: "44px 44px",
            boxShadow: "0 24px 60px -28px color-mix(in oklab, var(--brand) 22%, transparent)",
          }}>
            <div aria-hidden="true" style={{
              position: "absolute", right: -120, top: -120, width: 320, height: 320, borderRadius: "50%",
              background: "color-mix(in oklab, var(--brand) 18%, transparent)",
              filter: "blur(110px)", pointerEvents: "none",
            }} />
            <div aria-hidden="true" style={{
              position: "absolute", left: -120, bottom: -120, width: 280, height: 280, borderRadius: "50%",
              background: "color-mix(in oklab, var(--accent) 28%, transparent)",
              filter: "blur(110px)", pointerEvents: "none",
            }} />

            <div style={{ position: "relative" }}>
              <div className="eyebrow" style={{ color: "var(--brand)" }}>Application form · 2026-27</div>
              <h3 className="bipe-h2" style={{ marginTop: 8, fontSize: 32 }}>
                Apply in under a minute
                <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>.</span>
              </h3>
              <p className="muted" style={{ marginTop: 8, fontSize: 14, maxWidth: "56ch" }}>
                Fill in the basics — our admissions team will call within 24 hours to guide you on the next steps.
              </p>

              <div className="grid" style={{ gap: 18, marginTop: 28 }}>
                <div className="grid bipe-form-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <div className={"field " + (fieldError("name") ? "field-error" : "")}>
                    <label htmlFor="name">
                      Full name
                      <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· पूरा नाम</span>
                    </label>
                    <input
                      {...fieldProps("name")}
                      placeholder="e.g. Aarav Yadav"
                      autoComplete="name"
                      {...register("name")}
                    />
                    {fieldError("name") && <span id="name-err" role="alert" className="error-msg">{fieldError("name")}</span>}
                  </div>
                  <div className={"field " + (fieldError("phone") ? "field-error" : "")}>
                    <label htmlFor="phone">
                      Mobile number
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
                    {fieldError("phone") && <span id="phone-err" role="alert" className="error-msg">{fieldError("phone")}</span>}
                  </div>
                </div>

                <div className={"field " + (fieldError("email") ? "field-error" : "")}>
                  <label htmlFor="email">
                    Email <span style={{ color: "var(--ink-3)" }}>(optional)</span>
                    <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· ईमेल</span>
                  </label>
                  <input
                    {...fieldProps("email")}
                    type="email"
                    autoComplete="email"
                    placeholder="you@email.com"
                    {...register("email")}
                  />
                  {fieldError("email") && <span id="email-err" role="alert" className="error-msg">{fieldError("email")}</span>}
                </div>

                <div className="grid bipe-form-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <div className={"field " + (fieldError("branch") ? "field-error" : "")}>
                    <label htmlFor="branch">
                      Course interest
                      <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· कोर्स</span>
                    </label>
                    <Controller
                      control={control}
                      name="branch"
                      render={({ field }) => (
                        <FormSelect
                          id="branch"
                          value={field.value || ""}
                          onValueChange={field.onChange}
                          onBlur={field.onBlur}
                          invalid={!!fieldError("branch")}
                          required
                          describedBy={fieldError("branch") ? "branch-err" : undefined}
                          placeholder="Choose a course…"
                          options={BRANCH_OPTIONS.map((b) => ({ value: b, label: b }))}
                        />
                      )}
                    />
                    {fieldError("branch") && <span id="branch-err" role="alert" className="error-msg">{fieldError("branch")}</span>}
                  </div>
                  <div className={"field " + (fieldError("category") ? "field-error" : "")}>
                    <label htmlFor="category">
                      Category <span style={{ color: "var(--ink-3)" }}>(optional)</span>
                      <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· कैटेगरी</span>
                    </label>
                    <Controller
                      control={control}
                      name="category"
                      render={({ field }) => (
                        <FormSelect
                          id="category"
                          value={field.value || ""}
                          onValueChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder="Select category (or skip)"
                          options={CATEGORY_OPTIONS.map((c) => ({ value: c, label: c }))}
                        />
                      )}
                    />
                    {fieldError("category") && <span id="category-err" role="alert" className="error-msg">{fieldError("category")}</span>}
                    <span className="muted" style={{ fontSize: 11.5, marginTop: 4, display: "block" }}>
                      Only for fee &amp; scholarship guidance — skip if unsure.
                    </span>
                  </div>
                </div>

                {/* Hidden — kept for backend compatibility, not collected here */}
                <input type="hidden" {...register("board")} />
                <input type="hidden" {...register("marks")} />

                <div className={"field " + (fieldError("notes") ? "field-error" : "")}>
                  <label htmlFor="notes">
                    Anything else we should know? <span style={{ color: "var(--ink-3)" }}>(optional)</span>
                    <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· अतिरिक्त जानकारी</span>
                  </label>
                  <textarea
                    {...fieldProps("notes")}
                    rows={3}
                    placeholder="Questions, scholarship eligibility, hostel preference, anything…"
                    {...register("notes")}
                  />
                  {fieldError("notes") && <span id="notes-err" role="alert" className="error-msg">{fieldError("notes")}</span>}
                </div>
              </div>

              {submitStatus.state === "error" && (
                <div
                  role="alert"
                  style={{
                    marginTop: 18,
                    padding: "12px 14px",
                    borderRadius: 10,
                    background: "color-mix(in oklab, var(--danger) 12%, var(--paper))",
                    border: "1px solid color-mix(in oklab, var(--danger) 30%, transparent)",
                    color: "var(--danger)",
                    fontSize: 14,
                  }}
                >
                  {submitStatus.message}
                </div>
              )}

              <div className="between" style={{ marginTop: 32, paddingTop: 22, borderTop: "1px solid var(--line)", flexWrap: "wrap", gap: 12 }}>
                <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  <WhatsAppIcon /> Chat with admissions
                </a>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting…" : <>Submit application <ArrowIcon /></>}
                </button>
              </div>
            </div>
          </div>

          <p className="muted" style={{ marginTop: 18, fontSize: 12, textAlign: "center" }}>
            By submitting, you agree to be contacted by BIPE Admissions about 2026-27 admissions. We don&apos;t share your details.
          </p>
        </form>
      </div>
    </section>
  );
}
