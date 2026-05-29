import { NextResponse } from "next/server";
import {
  alumniContactRequestSchema,
  applyFormSchema,
  contactFormSchema,
  enquiryFormSchema,
  visitFormSchema,
} from "@/lib/validation";
import { forwardToBackend } from "@/lib/backend";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { fireSubmissionConfirmation } from "@/lib/doubleTick";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/submit — handles /apply, /contact, /visit form submissions.
 *
 * Validates with Zod (server-side trust boundary), then persists to the
 * BIPE Django backend. The backend is now the single source of truth
 * for submissions — there is no SMTP / email path.
 */
export async function POST(req: Request) {
  // Rate-limit by client IP before doing any work. Default: 5 req / hour.
  // Bot floods get a fast 429 with Retry-After + standard X-RateLimit-*
  // headers; legitimate admission-cycle submissions never come close to
  // tripping this (a family submits once, maybe twice if they made a typo).
  const ip = getClientIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    const retryAfterSec = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000));
    return NextResponse.json(
      {
        ok: false,
        error: "Too many requests. Please wait before submitting again.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSec),
          "X-RateLimit-Limit": String(rl.limit),
          "X-RateLimit-Remaining": String(rl.remaining),
          "X-RateLimit-Reset": String(Math.ceil(rl.resetAt / 1000)),
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  // Honeypot check — every form renders an invisible "website" input
  // (components/shell/Honeypot.tsx). Bots that auto-fill all visible
  // inputs in the DOM end up populating it; humans never see it.
  //
  // On a hit we return a fake success — bot thinks it submitted and
  // moves on. Returning 400/429 instead would teach the bot to skip
  // the field on retry, which defeats the trap.
  const honeypot = (body as { website?: unknown } | null)?.website;
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    return NextResponse.json({ ok: true, id: "ok" });
  }

  const formType =
    (body as { formType?: string } | null)?.formType ?? "contact";

  if (formType === "apply") {
    const result = applyFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Validation failed",
          fieldErrors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const d = result.data;
    const r = await forwardToBackend("apply", {
      name: d.name,
      phone: d.phone,
      email: d.email,
      branch: d.branch,
      consent: d.consent,
      parent: d.parent,
      category: d.category,
      board: d.board,
      marks: d.marks,
      source: d.source,
      visit: d.visit,
      visitDate: d.visit === "yes" ? d.visitDate : "",
      visitTime: d.visit === "yes" ? d.visitTime : "",
      notes: d.notes,
    });
    if (r.ok) {
      fireSubmissionConfirmation({
        formType: "apply",
        phone: d.phone,
        name: d.name,
        branch: d.branch,
        submissionId: r.id ?? undefined,
      });
    }
    return r.ok
      ? NextResponse.json({ ok: true, id: r.id })
      : NextResponse.json({ ok: false, error: r.error }, { status: 502 });
  }

  if (formType === "enquiry") {
    const result = enquiryFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Validation failed",
          fieldErrors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const d = result.data;
    const r = await forwardToBackend("enquiry", {
      name: d.name,
      phone: d.phone,
      email: d.email ?? "",
      branch: d.branch ?? "",
      source: d.source || "inquiry-modal",
      message: d.message ?? "",
      consent: d.consent ?? false,
    });
    if (r.ok) {
      fireSubmissionConfirmation({
        formType: "enquiry",
        phone: d.phone,
        name: d.name,
        branch: d.branch ?? undefined,
        submissionId: r.id ?? undefined,
      });
    }
    return r.ok
      ? NextResponse.json({ ok: true, id: r.id })
      : NextResponse.json({ ok: false, error: r.error }, { status: 502 });
  }

  if (formType === "alumni-contact") {
    const result = alumniContactRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Validation failed",
          fieldErrors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const d = result.data;
    const r = await forwardToBackend("alumni-contact", {
      // Visitor (the requester) — placement cell calls THIS number to
      // verify before sharing the alumnus's number.
      name: d.name,
      phone: d.phone,
      email: d.email ?? "",
      consent: d.consent,
      purpose: d.purpose,
      purposeNote: d.purposeNote ?? "",
      // Target alumnus — operator joins on alumniId in the admin to
      // pull the actual contact number from the TPO XLSX. The other
      // fields are denormalised for readability in the admin row.
      alumniId: d.alumniId,
      alumniName: d.alumniName,
      alumniBranch: d.alumniBranch ?? "",
      alumniYear: d.alumniYear ?? "",
      alumniCompany: d.alumniCompany ?? "",
    });
    if (r.ok) {
      // {{3}} placeholder in the WhatsApp template doubles as "what
      // is this enquiry about" — for alumni-contact we use a short
      // "Intro with {Name}" string so the visitor's confirmation is
      // self-explanatory. {{4}} = 48h because verification touches
      // both visitor and alumnus before the introduction goes out.
      const introLabel = `Intro with ${d.alumniName}`.slice(0, 60);
      fireSubmissionConfirmation({
        formType: "alumni-contact",
        phone: d.phone,
        name: d.name,
        branch: introLabel,
        submissionId: r.id ?? undefined,
        callbackHours: "48",
      });
    }
    return r.ok
      ? NextResponse.json({ ok: true, id: r.id })
      : NextResponse.json({ ok: false, error: r.error }, { status: 502 });
  }

  if (formType === "visit") {
    const result = visitFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Validation failed",
          fieldErrors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const d = result.data;
    const r = await forwardToBackend("visit", {
      name: d.name,
      phone: d.phone,
      email: d.email,
      branch: d.branch,
      consent: d.consent,
      visitDate: d.visitDate,
      visitTime: d.visitTime,
      party: d.party,
      needsShuttle: !!d.needsShuttle,
      notes: d.notes,
    });
    if (r.ok) {
      fireSubmissionConfirmation({
        formType: "visit",
        phone: d.phone,
        name: d.name,
        branch: d.branch,
        submissionId: r.id ?? undefined,
      });
    }
    return r.ok
      ? NextResponse.json({ ok: true, id: r.id })
      : NextResponse.json({ ok: false, error: r.error }, { status: 502 });
  }

  // Contact form path
  const result = contactFormSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed",
        fieldErrors: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }
  const d = result.data;
  const r = await forwardToBackend("contact", {
    name: d.name,
    phone: d.phone,
    email: d.email,
    branch: d.branch,
    consent: d.consent,
    source: d.source,
    message: d.message,
  });
  if (r.ok) {
    fireSubmissionConfirmation({
      formType: "contact",
      phone: d.phone,
      name: d.name,
      branch: d.branch,
      submissionId: r.id ?? undefined,
    });
  }
  return r.ok
    ? NextResponse.json({ ok: true, id: r.id })
    : NextResponse.json({ ok: false, error: r.error }, { status: 502 });
}
