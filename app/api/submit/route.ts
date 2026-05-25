import { NextResponse } from "next/server";
import {
  applyFormSchema,
  contactFormSchema,
  enquiryFormSchema,
  visitFormSchema,
} from "@/lib/validation";
import { forwardToBackend } from "@/lib/backend";

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
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
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
  return r.ok
    ? NextResponse.json({ ok: true, id: r.id })
    : NextResponse.json({ ok: false, error: r.error }, { status: 502 });
}
