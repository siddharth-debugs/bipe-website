"use client";

import React, { useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DATA } from "@/lib/data";
import { ArrowIcon, WhatsAppIcon } from "@/components/shell/Icons";
import { FormSelect } from "@/components/ui/FormSelect";
import { DatePicker } from "@/components/ui/DatePicker";
import {
  visitFormSchema,
  visitDefaults,
  BRANCH_OPTIONS,
  VISIT_TIME_OPTIONS,
  VISIT_PARTY_OPTIONS,
  type VisitFormData,
} from "@/lib/validation";

type SubmitStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; firstName: string; date: string; time: string }
  | { state: "error"; message: string };

// Today's date as YYYY-MM-DD for the date input min.
function todayIso(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function VisitForm() {
  const [status, setStatus] = useState<SubmitStatus>({ state: "idle" });

  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VisitFormData>({
    resolver: zodResolver(visitFormSchema),
    defaultValues: visitDefaults,
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<VisitFormData> = async (data) => {
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
              setError(field as keyof VisitFormData, { message: msgs[0] });
            }
          }
        }
        setStatus({
          state: "error",
          message: json.error ?? "Could not book. Please try again.",
        });
        return;
      }
      setStatus({
        state: "success",
        firstName: data.name.trim().split(/\s+/)[0] || "there",
        date: data.visitDate,
        time: data.visitTime,
      });
    } catch {
      setStatus({
        state: "error",
        message: "Network error. Try again or WhatsApp us.",
      });
    }
  };

  const fieldError = (k: keyof VisitFormData): string | undefined => {
    const e = errors[k as keyof typeof errors];
    return (e as { message?: string } | undefined)?.message;
  };

  const errClass = (k: keyof VisitFormData) =>
    "field" + (fieldError(k) ? " field-error" : "");

  if (status.state === "success") {
    return (
      <div
        style={{
          background: "var(--white)",
          border: "1px solid var(--line)",
          borderRadius: 18,
          padding: 32,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 44 }}>📅</div>
        <h3 className="bipe-h3" style={{ marginTop: 8 }}>
          See you on campus, {status.firstName}.
        </h3>
        <p style={{ color: "var(--ink-2)", fontSize: 15, marginTop: 12, lineHeight: 1.6, maxWidth: "44ch", margin: "12px auto 0" }}>
          Your visit is provisionally booked for{" "}
          <strong style={{ color: "var(--ink)" }}>{status.date}</strong> at{" "}
          <strong style={{ color: "var(--ink)" }}>{status.time}</strong>. We&apos;ll
          confirm by phone within a working day.
        </p>
<button
          type="button"
          onClick={() => {
            reset(visitDefaults);
            setStatus({ state: "idle" });
          }}
          className="btn btn-ghost"
          style={{ marginTop: 22 }}
        >
          Book another visit
        </button>
      </div>
    );
  }

  const hasError = (k: keyof VisitFormData) => !!fieldError(k);

  // Per-schema required-field set. Stays in sync with visitFormSchema
  // (in lib/validation.ts) — every field that does NOT have .optional()
  // is listed here, so aria-required announces "required" to screen
  // readers at the same fields the zod validator rejects empty.
  const REQUIRED: ReadonlySet<keyof VisitFormData> = new Set([
    "name", "phone", "branch", "visitDate", "visitTime", "party", "consent",
  ] as const);

  /**
   * Produce the a11y attribute bundle for one form field.
   * Pair with an <span id={`vf-${k}-err`} role="alert"> when fieldError
   * is truthy — the aria-describedby points there.
   */
  const fieldProps = (k: keyof VisitFormData) => {
    const id = `vf-${String(k)}`;
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
      {/* Row 1 — name + phone */}
      <div className="bipe-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className={errClass("name")}>
          <label htmlFor="vf-name">
            Your full name
            <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· पूरा नाम</span>
          </label>
          <input
            {...fieldProps("name")}
            type="text"
            autoComplete="name"
            placeholder="As you'd like to be greeted"
            {...register("name")}
          />
          {fieldError("name") && (
            <span id="vf-name-err" role="alert" className="field-msg">{fieldError("name")}</span>
          )}
        </div>
        <div className={errClass("phone")}>
          <label htmlFor="vf-phone">
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
          {fieldError("phone") && (
            <span id="vf-phone-err" role="alert" className="field-msg">{fieldError("phone")}</span>
          )}
        </div>
      </div>

      {/* Row 2 — email + branch */}
      <div className="bipe-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 12 }}>
        <div className={errClass("email")}>
          <label htmlFor="vf-email">
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
          {fieldError("email") && (
            <span id="vf-email-err" role="alert" className="field-msg">{fieldError("email")}</span>
          )}
        </div>
        <div className={errClass("branch")}>
          <label htmlFor="vf-branch">
            Branch you want to see
            <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· ब्रांच देखनी है</span>
          </label>
          <Controller
            control={control}
            name="branch"
            render={({ field }) => (
              <FormSelect
                id="vf-branch"
                value={field.value || ""}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                invalid={hasError("branch")}
                required
                describedBy={hasError("branch") ? "vf-branch-err" : undefined}
                placeholder="Choose a branch…"
                options={BRANCH_OPTIONS.map((b) => ({ value: b, label: b }))}
              />
            )}
          />
          {fieldError("branch") && (
            <span id="vf-branch-err" role="alert" className="field-msg">{fieldError("branch")}</span>
          )}
        </div>
      </div>

      {/* Row 3 — date + time + party */}
      <div className="bipe-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 12 }}>
        <div className={errClass("visitDate")}>
          <label htmlFor="vf-date">
            Preferred date
            <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· पसंदीदा तारीख</span>
          </label>
          <Controller
            control={control}
            name="visitDate"
            render={({ field }) => (
              <DatePicker
                id="vf-date"
                value={field.value || ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                invalid={hasError("visitDate")}
                required
                describedBy={hasError("visitDate") ? "vf-visitDate-err" : undefined}
                min={todayIso()}
                placeholder="Pick a date"
              />
            )}
          />
          {fieldError("visitDate") && (
            <span id="vf-visitDate-err" role="alert" className="field-msg">{fieldError("visitDate")}</span>
          )}
        </div>
        <div className={errClass("visitTime")}>
          <label htmlFor="vf-time">
            Preferred slot
            <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· समय चुनें</span>
          </label>
          <Controller
            control={control}
            name="visitTime"
            render={({ field }) => (
              <FormSelect
                id="vf-time"
                value={field.value || ""}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                invalid={hasError("visitTime")}
                required
                describedBy={hasError("visitTime") ? "vf-visitTime-err" : undefined}
                placeholder="Pick a slot"
                options={VISIT_TIME_OPTIONS.map((t) => ({ value: t, label: t }))}
              />
            )}
          />
          {fieldError("visitTime") && (
            <span id="vf-visitTime-err" role="alert" className="field-msg">{fieldError("visitTime")}</span>
          )}
        </div>
        <div className={errClass("party")}>
          <label htmlFor="vf-party">
            Who&apos;s coming
            <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· कौन आ रहा है</span>
          </label>
          <Controller
            control={control}
            name="party"
            render={({ field }) => (
              <FormSelect
                id="vf-party"
                value={field.value || ""}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                invalid={hasError("party")}
                required
                describedBy={hasError("party") ? "vf-party-err" : undefined}
                placeholder="Choose"
                options={VISIT_PARTY_OPTIONS.map((p) => ({ value: p, label: p }))}
              />
            )}
          />
          {fieldError("party") && (
            <span id="vf-party-err" role="alert" className="field-msg">{fieldError("party")}</span>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className={errClass("notes")} style={{ marginTop: 12 }}>
        <label htmlFor="vf-notes">
          Anything we should know? <span className="muted" style={{ fontSize: 11 }}>(optional)</span>
          <span lang="hi" style={{ fontWeight: 400, marginLeft: 6, opacity: 0.65, fontSize: 12 }}>· कुछ बताना है?</span>
        </label>
        <textarea
          {...fieldProps("notes")}
          rows={3}
          placeholder="e.g. travelling from Mau, would like to meet a CS faculty mentor"
          {...register("notes")}
        />
        {fieldError("notes") && (
          <span id="vf-notes-err" role="alert" className="field-msg">{fieldError("notes")}</span>
        )}
      </div>

      {/* Shuttle + consent */}
      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            fontSize: 14,
            color: "var(--ink-2)",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            {...register("needsShuttle")}
            style={{ marginTop: 3, accentColor: "var(--brand)" }}
          />
          <span>Free shuttle from Varanasi Cantt — please pick us up</span>
        </label>

        <div className={errClass("consent")}>
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              fontSize: 14,
              color: "var(--ink-2)",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              {...fieldProps("consent")}
              {...register("consent")}
              style={{ marginTop: 3, accentColor: "var(--brand)" }}
            />
            <span>
              I agree that BIPE may contact me about this visit and 2026-27
              admissions. <span className="muted">No spam, ever.</span>
            </span>
          </label>
          {fieldError("consent") && (
            <span id="vf-consent-err" role="alert" className="field-msg">{fieldError("consent")}</span>
          )}
        </div>
      </div>

      {status.state === "error" && (
        <div
          role="alert"
          style={{
            marginTop: 14,
            padding: 12,
            background: "color-mix(in oklab, var(--danger) 10%, var(--paper))",
            border: "1px solid color-mix(in oklab, var(--danger) 30%, transparent)",
            borderRadius: 10,
            fontSize: 13,
            color: "var(--danger)",
          }}
        >
          {status.message}
        </div>
      )}

      <div
        className="row"
        style={{ marginTop: 18, gap: 10, flexWrap: "wrap", alignItems: "center" }}
      >
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || status.state === "submitting"}
        >
          {isSubmitting || status.state === "submitting"
            ? "Booking…"
            : "Confirm visit booking"}
          <ArrowIcon size={14} />
        </button>
        <a
          href={DATA.contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-wa"
        >
          <WhatsAppIcon /> Or WhatsApp us
        </a>
      </div>

      <p
        style={{
          marginTop: 14,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.06em",
          color: "var(--ink-3)",
        }}
      >
        We confirm by phone within one working day. Visits run Mon–Sat, 10 AM–4 PM.
      </p>
    </form>
  );
}
