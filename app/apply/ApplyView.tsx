"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DATA } from "@/lib/data";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";
import { FormSelect } from "@/components/ui/FormSelect";
import { DatePicker } from "@/components/ui/DatePicker";
import {
  applyFormSchema,
  applyDefaults,
  APPLY_STEP_FIELDS,
  BRANCH_OPTIONS,
  SOURCE_OPTIONS,
  CATEGORY_OPTIONS,
  BOARD_OPTIONS,
  VISIT_TIME_OPTIONS,
  type ApplyFormData,
} from "@/lib/validation";

const STEP_TITLES: { title: string; sub: string }[] = [
  { title: "Your details", sub: "Name, phone, parent — basics so we can call back." },
  { title: "Branch interest", sub: "Pick a branch (or ask for guidance) and tell us about marks." },
  { title: "How you found us", sub: "Source, visit preference, anything we should know." },
  { title: "Confirm", sub: "Review, agree to the consent line, then submit." },
];

type SubmitStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; ref: string }
  | { state: "error"; message: string };

export function ApplyView() {
  const [step, setStep] = useState(0);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ state: "idle" });

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ApplyFormData>({
    resolver: zodResolver(applyFormSchema),
    defaultValues: applyDefaults,
    mode: "onTouched",
  });

  const visit = watch("visit");
  const name = watch("name");

  // Move step forward only after the fields owned by the current step pass.
  const next = async () => {
    const fields = APPLY_STEP_FIELDS[step] as (keyof ApplyFormData)[];
    const valid = await trigger(fields, { shouldFocus: true });
    if (valid) setStep(step + 1);
  };

  const onSubmit: SubmitHandler<ApplyFormData> = async (data) => {
    setSubmitStatus({ state: "submitting" });
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
      setSubmitStatus({ state: "success", ref });
      setStep(4);
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

  // Per-schema required-field set. Stays in sync with applyFormSchema
  // (lib/validation.ts). aria-required announces "required" to screen
  // readers at the same fields zod validates as required. visit is on
  // a radio group; consent is the final checkbox.
  const REQUIRED: ReadonlySet<keyof ApplyFormData> = new Set([
    "name", "phone", "branch", "category", "visit", "consent",
  ] as const);

  /** A11y props for one form field. Pair with `<span id={`${k}-err`} role="alert">`. */
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
  if (step === 4 && submitStatus.state === "success") {
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
    <section className="section" style={{ position: "relative", overflow: "hidden", paddingTop: 32 }}>
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div style={{
            position: "relative", overflow: "hidden",
            borderRadius: 28,
            border: "1px solid var(--line)",
            background: "color-mix(in oklab, var(--brand) 6%, var(--white))",
            padding: 4,
          }}>
            <div aria-hidden="true" style={{
              position: "absolute", left: -160, top: -120, width: 360, height: 360, borderRadius: "50%",
              background: "color-mix(in oklab, var(--brand) 22%, transparent)",
              filter: "blur(110px)", pointerEvents: "none",
            }} />
            <div aria-hidden="true" style={{
              position: "absolute", right: -120, bottom: -120, width: 320, height: 320, borderRadius: "50%",
              background: "color-mix(in oklab, var(--accent) 32%, transparent)",
              filter: "blur(110px)", pointerEvents: "none",
            }} />

            <div className="bipe-split" style={{ position: "relative", display: "grid", gridTemplateColumns: "320px 1fr", gap: 0, borderRadius: 24, overflow: "hidden" }}>
              {/* LEFT RAIL */}
              <aside style={{
                background: "var(--ink)", color: "var(--paper)",
                padding: "40px 32px",
                position: "relative", overflow: "hidden",
              }}>
                <div aria-hidden="true" style={{
                  position: "absolute", inset: 0, opacity: 0.06,
                  backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
                  backgroundSize: "48px 48px", pointerEvents: "none",
                }} />
                <div aria-hidden="true" style={{
                  position: "absolute", left: -80, bottom: -80, width: 240, height: 240, borderRadius: "50%",
                  background: "color-mix(in oklab, var(--brand) 50%, transparent)",
                  filter: "blur(100px)", pointerEvents: "none",
                }} />
                <div style={{ position: "relative" }}>
                  <div className="eyebrow" style={{ color: "var(--accent)" }}>Application form</div>
                  <div className="serif" style={{
                    fontStyle: "italic", fontWeight: 400,
                    fontSize: 36, lineHeight: 1, color: "var(--paper)",
                    marginTop: 12,
                  }}>
                    Step{" "}
                    <span style={{ color: "var(--accent)" }}>{step + 1}</span>{" "}
                    of 4
                  </div>

                  <ol style={{ marginTop: 32, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                    {STEP_TITLES.map((s, i) => {
                      const state: "done" | "active" | "todo" = i < step ? "done" : i === step ? "active" : "todo";
                      return (
                        <li key={s.title} style={{
                          position: "relative",
                          padding: "14px 16px",
                          borderRadius: 12,
                          background: state === "active" ? "color-mix(in oklab, var(--accent) 18%, transparent)" : "transparent",
                          border: state === "active" ? "1px solid color-mix(in oklab, var(--accent) 36%, transparent)" : "1px solid transparent",
                        }}>
                          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "center" }}>
                            <span style={{
                              width: 30, height: 30, borderRadius: 999,
                              display: "inline-flex", alignItems: "center", justifyContent: "center",
                              fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
                              background: state === "done" ? "var(--accent)" : state === "active" ? "var(--paper)" : "color-mix(in oklab, var(--paper) 12%, transparent)",
                              color: state === "done" ? "var(--ink)" : state === "active" ? "var(--ink)" : "color-mix(in oklab, var(--paper) 60%, transparent)",
                            }}>
                              {state === "done" ? "✓" : String(i + 1).padStart(2, "0")}
                            </span>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 14, color: state === "todo" ? "color-mix(in oklab, var(--paper) 60%, transparent)" : "var(--paper)" }}>
                                {s.title}
                              </div>
                              <div style={{ fontSize: 11.5, marginTop: 3, color: "color-mix(in oklab, var(--paper) 55%, transparent)", lineHeight: 1.4 }}>
                                {s.sub}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>

                  <div style={{ marginTop: 36, paddingTop: 22, borderTop: "1px solid color-mix(in oklab, var(--paper) 14%, transparent)" }}>
                    <div className="eyebrow" style={{ color: "color-mix(in oklab, var(--paper) 60%, transparent)" }}>
                      Need help?
                    </div>
                    <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" style={{
                      marginTop: 12, display: "inline-flex", alignItems: "center", gap: 8,
                      color: "var(--accent)", fontWeight: 600, fontSize: 13,
                    }}>
                      <WhatsAppIcon /> Chat with admissions
                    </a>
                  </div>
                </div>
              </aside>

              {/* RIGHT PANE */}
              <div style={{ background: "var(--white)", padding: "40px 44px" }}>
                <div className="eyebrow" style={{ color: "var(--brand)" }}>{`Step 0${step + 1}`}</div>
                <h3 className="bipe-h2" style={{ marginTop: 8, fontSize: 32 }}>
                  {STEP_TITLES[step].title}
                  <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>.</span>
                </h3>
                <p className="muted" style={{ marginTop: 8, fontSize: 14, maxWidth: "52ch" }}>
                  {STEP_TITLES[step].sub}
                </p>

                <div style={{ marginTop: 28 }}>
                  {/* ── Step 0 ── */}
                  {step === 0 && (
                    <div className="grid" style={{ gap: 18 }}>
                      <div className="grid bipe-form-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
                        <div className={"field " + (fieldError("name") ? "field-error" : "")}>
                          <label htmlFor="name">Your full name</label>
                          <input
                            {...fieldProps("name")}
                            placeholder="e.g. Aarav Yadav"
                            autoComplete="name"
                            {...register("name")}
                          />
                          {fieldError("name") && <span id="name-err" role="alert" className="error-msg">{fieldError("name")}</span>}
                        </div>
                        <div className={"field " + (fieldError("phone") ? "field-error" : "")}>
                          <label htmlFor="phone">Phone (we&apos;ll call you)</label>
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
                      <div className="grid bipe-form-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
                        <div className={"field " + (fieldError("email") ? "field-error" : "")}>
                          <label htmlFor="email">Email <span style={{ color: "var(--ink-3)" }}>(optional)</span></label>
                          <input
                            {...fieldProps("email")}
                            type="email"
                            autoComplete="email"
                            placeholder="you@email.com"
                            {...register("email")}
                          />
                          {fieldError("email") && <span id="email-err" role="alert" className="error-msg">{fieldError("email")}</span>}
                        </div>
                        <div className={"field " + (fieldError("parent") ? "field-error" : "")}>
                          <label htmlFor="parent">Parent / guardian name <span style={{ color: "var(--ink-3)" }}>(optional)</span></label>
                          <input
                            {...fieldProps("parent")}
                            placeholder="e.g. Mr. Yadav"
                            {...register("parent")}
                          />
                          {fieldError("parent") && <span id="parent-err" role="alert" className="error-msg">{fieldError("parent")}</span>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Step 1 ── */}
                  {step === 1 && (
                    <div className="grid" style={{ gap: 18 }}>
                      <div className={"field " + (fieldError("branch") ? "field-error" : "")}>
                        <label htmlFor="branch">Preferred branch</label>
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
                              placeholder="Choose a branch…"
                              options={BRANCH_OPTIONS.map((b) => ({ value: b, label: b }))}
                            />
                          )}
                        />
                        {fieldError("branch") && <span id="branch-err" role="alert" className="error-msg">{fieldError("branch")}</span>}
                      </div>
                      <div className="grid bipe-form-row" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                        <div className="field">
                          <label htmlFor="category">Category</label>
                          <Controller
                            control={control}
                            name="category"
                            render={({ field }) => (
                              <FormSelect
                                id="category"
                                value={field.value || ""}
                                onValueChange={field.onChange}
                                onBlur={field.onBlur}
                                required
                                placeholder="Select category"
                                options={CATEGORY_OPTIONS.map((c) => ({ value: c, label: c }))}
                              />
                            )}
                          />
                        </div>
                        <div className="field">
                          <label htmlFor="board">10th board</label>
                          <Controller
                            control={control}
                            name="board"
                            render={({ field }) => (
                              <FormSelect
                                id="board"
                                value={field.value || ""}
                                onValueChange={field.onChange}
                                onBlur={field.onBlur}
                                placeholder="Select board"
                                options={BOARD_OPTIONS.map((c) => ({ value: c, label: c }))}
                              />
                            )}
                          />
                        </div>
                        <div className={"field " + (fieldError("marks") ? "field-error" : "")}>
                          <label htmlFor="marks">10th marks (%)</label>
                          <input
                            {...fieldProps("marks")}
                            inputMode="decimal"
                            placeholder="e.g. 72"
                            {...register("marks")}
                          />
                          {fieldError("marks") && <span id="marks-err" role="alert" className="error-msg">{fieldError("marks")}</span>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Step 2 ── */}
                  {step === 2 && (
                    <div className="grid" style={{ gap: 18 }}>
                      <div className="field">
                        <label htmlFor="source">How did you hear about BIPE? <span style={{ color: "var(--ink-3)" }}>(optional)</span></label>
                        <Controller
                          control={control}
                          name="source"
                          render={({ field }) => (
                            <FormSelect
                              id="source"
                              value={field.value || ""}
                              onValueChange={field.onChange}
                              onBlur={field.onBlur}
                              placeholder="Pick the closest match"
                              options={SOURCE_OPTIONS.map((s) => ({ value: s, label: s }))}
                            />
                          )}
                        />
                      </div>

                      <div className="field">
                        <label>Would you like to visit campus?</label>
                        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
                          {([["yes", "Yes — book a slot"], ["maybe", "Maybe — call me first"], ["no", "No — apply only"]] as const).map(([v, l]) => (
                            <label
                              key={v}
                              style={{
                                padding: "12px 16px",
                                borderRadius: 10,
                                border: "1px solid " + (visit === v ? "var(--brand)" : "var(--line-2)"),
                                background: visit === v ? "var(--brand-soft)" : "var(--white)",
                                color: visit === v ? "var(--brand)" : "var(--ink-2)",
                                fontWeight: 500,
                                fontSize: 14,
                                cursor: "pointer",
                                userSelect: "none",
                              }}
                            >
                              <input
                                type="radio"
                                value={v}
                                {...register("visit")}
                                style={{ marginRight: 6 }}
                              />
                              {l}
                            </label>
                          ))}
                        </div>
                      </div>
                      {visit === "yes" && (
                        <div className="grid bipe-form-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
                          <div className={"field " + (fieldError("visitDate") ? "field-error" : "")}>
                            <label htmlFor="visitDate">Visit date</label>
                            <Controller
                              control={control}
                              name="visitDate"
                              render={({ field }) => (
                                <DatePicker
                                  id="visitDate"
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                  invalid={!!fieldError("visitDate")}
                                  describedBy={fieldError("visitDate") ? "visitDate-err" : undefined}
                                  min={new Date().toISOString().slice(0, 10)}
                                  placeholder="Pick a date"
                                />
                              )}
                            />
                            {fieldError("visitDate") && <span id="visitDate-err" role="alert" className="error-msg">{fieldError("visitDate")}</span>}
                          </div>
                          <div className="field">
                            <label htmlFor="visitTime">Slot</label>
                            <Controller
                              control={control}
                              name="visitTime"
                              render={({ field }) => (
                                <FormSelect
                                  id="visitTime"
                                  value={field.value || ""}
                                  onValueChange={field.onChange}
                                  onBlur={field.onBlur}
                                  placeholder="Choose a slot"
                                  options={VISIT_TIME_OPTIONS.map((t) => ({ value: t, label: t }))}
                                />
                              )}
                            />
                          </div>
                        </div>
                      )}
                      <div className={"field " + (fieldError("notes") ? "field-error" : "")}>
                        <label htmlFor="notes">Anything you&apos;d like us to know? <span style={{ color: "var(--ink-3)" }}>(optional)</span></label>
                        <textarea
                          {...fieldProps("notes")}
                          rows={3}
                          placeholder="Special requests, accessibility needs, transport preference…"
                          {...register("notes")}
                        />
                        {fieldError("notes") && <span id="notes-err" role="alert" className="error-msg">{fieldError("notes")}</span>}
                      </div>
                    </div>
                  )}

                  {/* ── Step 3 ── */}
                  {step === 3 && (
                    <ReviewBlock watch={watch} fieldError={fieldError} register={register} />
                  )}
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

                <div className="between" style={{ marginTop: 36, paddingTop: 22, borderTop: "1px solid var(--line)" }}>
                  <button
                    type="button"
                    onClick={() => (step > 0 ? setStep(step - 1) : null)}
                    className="btn btn-ghost"
                    disabled={step === 0 || isSubmitting}
                    style={{ opacity: step === 0 ? 0.4 : 1 }}
                  >
                    ← Back
                  </button>
                  {step < 3 ? (
                    <button type="button" onClick={next} className="btn btn-primary">
                      Continue <ArrowIcon />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting…" : <>Submit application <ArrowIcon /></>}
                    </button>
                  )}
                </div>
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

// ───────────────────────────────────────────────────────────────────
// Review block — Step 3 — inline component for readability
// ───────────────────────────────────────────────────────────────────
function ReviewBlock({
  watch,
  fieldError,
  register,
}: {
  watch: ReturnType<typeof useForm<ApplyFormData>>["watch"];
  fieldError: (k: keyof ApplyFormData) => string | undefined;
  register: ReturnType<typeof useForm<ApplyFormData>>["register"];
}) {
  const v = watch();
  const rows: [string, string][] = [
    ["Name", v.name || "—"],
    ["Phone", v.phone || "—"],
    ["Email", v.email || "—"],
    ["Parent / Guardian", v.parent || "—"],
    ["Branch", v.branch || "—"],
    ["Category", v.category || "—"],
    ["10th board · marks", `${v.board || "—"} · ${v.marks ? v.marks + "%" : "—"}`],
    ["How you found us", v.source || "—"],
    [
      "Campus visit",
      v.visit === "yes"
        ? `${v.visitDate || "date TBD"} · ${v.visitTime || "—"}`
        : v.visit === "maybe"
          ? "Maybe — call me first"
          : "No — apply only",
    ],
  ];
  return (
    <div>
      <div className="grid bipe-form-row" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {rows.map(([k, val]) => (
          <div key={k} style={{ padding: 14, background: "var(--paper-2)", borderRadius: 10 }}>
            <div className="eyebrow" style={{ fontSize: 10 }}>{k}</div>
            <div style={{ fontSize: 14, marginTop: 4, fontWeight: 500 }}>{val}</div>
          </div>
        ))}
      </div>
      {v.notes && (
        <div style={{ marginTop: 14, padding: 14, background: "var(--paper-2)", borderRadius: 10 }}>
          <div className="eyebrow" style={{ fontSize: 10 }}>Notes</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>{v.notes}</div>
        </div>
      )}

      <div className={"field " + (fieldError("consent") ? "field-error" : "")} style={{ marginTop: 22 }}>
        <label
          htmlFor="consent"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            cursor: "pointer",
            padding: 16,
            border: "1px solid var(--line-2)",
            borderRadius: 12,
            background: "var(--white)",
          }}
        >
          <input
            id="consent"
            type="checkbox"
            aria-required
            aria-invalid={fieldError("consent") ? true : undefined}
            aria-describedby={fieldError("consent") ? "consent-err" : undefined}
            {...register("consent")}
            style={{ marginTop: 4, accentColor: "var(--brand)" }}
          />
          <span style={{ fontSize: 14, lineHeight: 1.5, color: "var(--ink-2)" }}>
            I agree to be contacted by the BIPE admissions office about the 2026-27 session. My details will not be shared with third parties.
          </span>
        </label>
        {fieldError("consent") && <span id="consent-err" role="alert" className="error-msg">{fieldError("consent")}</span>}
      </div>
    </div>
  );
}
