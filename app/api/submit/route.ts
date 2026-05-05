import { NextResponse, after } from "next/server";
import {
  applyFormSchema,
  contactFormSchema,
  visitFormSchema,
  type ApplyFormData,
} from "@/lib/validation";
import { sendFormEmail } from "@/lib/email-service";
import { forwardToBackend } from "@/lib/backend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/submit — handles both /apply and /contact form submissions.
 *
 * Validates with Zod (server-side trust boundary; clients also validate
 * with the same schema for instant feedback), then forwards to Web3Forms
 * which sends an email to admissions@bipevns.org.
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
    const d = result.data as ApplyFormData;

    // Apply form has rich context — fold the extras into the email body.
    const sent = await sendFormEmail({
      formType: "apply",
      name: d.name,
      phone: d.phone,
      email: d.email,
      branch: d.branch,
      source: d.source,
      message: d.notes,
      consent: d.consent,
      extras: {
        parent_guardian: d.parent || "(not provided)",
        category: d.category,
        tenth_board: d.board || "(not provided)",
        tenth_marks_pct: d.marks || "(not provided)",
        wants_visit: d.visit,
        visit_date: d.visit === "yes" ? d.visitDate : undefined,
        visit_time: d.visit === "yes" ? d.visitTime : undefined,
      },
    });

    if (!sent.ok) {
      return NextResponse.json(
        { ok: false, error: sent.message ?? "Could not deliver your application" },
        { status: 502 },
      );
    }
    const applyPayload = {
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
    };
    after(() => forwardToBackend("apply", applyPayload));
    return NextResponse.json({ ok: true, mocked: sent.mocked === true });
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
    const sent = await sendFormEmail({
      formType: "visit",
      name: d.name,
      phone: d.phone,
      email: d.email,
      branch: d.branch,
      message: d.notes,
      consent: d.consent,
      extras: {
        visit_date: d.visitDate,
        visit_time: d.visitTime,
        party: d.party,
        needs_shuttle: d.needsShuttle ? "Yes" : "No",
      },
    });
    if (!sent.ok) {
      return NextResponse.json(
        { ok: false, error: sent.message ?? "Could not deliver your visit booking" },
        { status: 502 },
      );
    }
    const visitPayload = {
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
    };
    after(() => forwardToBackend("visit", visitPayload));
    return NextResponse.json({ ok: true, mocked: sent.mocked === true });
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
  const sent = await sendFormEmail({
    formType: "contact",
    name: d.name,
    phone: d.phone,
    email: d.email,
    branch: d.branch,
    source: d.source,
    message: d.message,
    consent: d.consent,
  });

  if (!sent.ok) {
    return NextResponse.json(
      { ok: false, error: sent.message ?? "Could not deliver your message" },
      { status: 502 },
    );
  }
  const contactPayload = {
    name: d.name,
    phone: d.phone,
    email: d.email,
    branch: d.branch,
    consent: d.consent,
    source: d.source,
    message: d.message,
  };
  after(() => forwardToBackend("contact", contactPayload));
  return NextResponse.json({ ok: true, mocked: sent.mocked === true });
}
