import { NextResponse, after } from "next/server";
import {
  alumniContactRequestSchema,
  applyFormSchema,
  contactFormSchema,
  enquiryFormSchema,
  visitFormSchema,
} from "@/lib/validation";
import { forwardToBackend } from "@/lib/backend";
import { forwardLeadToCrm } from "@/lib/crm-forward";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  fireAlumniIntroAdminNotification,
  fireSubmissionConfirmation,
} from "@/lib/doubleTick";

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
      // Also land it in the Sampark CRM as a BIPE lead. after() runs it
      // once the response is sent — a bare un-awaited promise is KILLED
      // when Vercel freezes the function, so it must ride after().
      after(() => forwardLeadToCrm({
        name: d.name, phone: d.phone, email: d.email, branch: d.branch,
        formType: "apply", source: d.source, backendId: r.id,
        attribution: (body as { attribution?: unknown }).attribution,
      }));
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
      after(() => forwardLeadToCrm({
        name: d.name, phone: d.phone, email: d.email ?? "",
        branch: d.branch ?? "", formType: "enquiry", source: d.source,
        backendId: r.id,
        attribution: (body as { attribution?: unknown }).attribution,
      }));
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

    // 29 May 2026 — alumni intro requests bypass the Django backend
    // entirely per user direction "don't show this as new
    // 'alumni-contact' row in the backend dashboard. send admin
    // message through whatsapp". The admin's WhatsApp inbox is the
    // single source of truth for these requests; the Vercel server
    // log is the secondary audit trail. Reference ID is generated
    // locally (4-char base36 suffix is unique enough for the volume
    // this form sees) and the SAME suffix goes into both messages so
    // admin can quote it back when calling the visitor.
    const refSuffix = Math.random().toString(36).slice(2, 6).toUpperCase();

    // 1. WhatsApp the admin with the full request payload.
    fireAlumniIntroAdminNotification({
      refSuffix,
      visitorName: d.name,
      visitorPhone: d.phone,
      visitorEmail: d.email || undefined,
      purpose: d.purpose,
      purposeNote: d.purposeNote || undefined,
      alumniId: d.alumniId,
      alumniName: d.alumniName,
      alumniBranch: d.alumniBranch || undefined,
      alumniYear: d.alumniYear || undefined,
      alumniCompany: d.alumniCompany || undefined,
    });

    // 2. WhatsApp the visitor with the same ref so they can quote
    //    it when admin calls back to verify. {{3}} = "Intro with
    //    {Name}", {{4}} = 48h because verification touches both
    //    sides.
    const introLabel = `Intro with ${d.alumniName}`.slice(0, 60);
    fireSubmissionConfirmation({
      formType: "alumni-contact",
      phone: d.phone,
      name: d.name,
      branch: introLabel,
      submissionId: refSuffix,
      callbackHours: "48",
    });

    return NextResponse.json({ ok: true, id: refSuffix });
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
      after(() => forwardLeadToCrm({
        name: d.name, phone: d.phone, email: d.email, branch: d.branch,
        formType: "visit", backendId: r.id,
        attribution: (body as { attribution?: unknown }).attribution,
      }));
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
    void forwardLeadToCrm({
      name: d.name, phone: d.phone, email: d.email, branch: d.branch,
      formType: "contact", source: d.source, backendId: r.id,
      attribution: (body as { attribution?: unknown }).attribution,
    });
  }
  return r.ok
    ? NextResponse.json({ ok: true, id: r.id })
    : NextResponse.json({ ok: false, error: r.error }, { status: 502 });
}
