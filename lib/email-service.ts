/**
 * SMTP-based email delivery for /apply and /contact form submissions.
 *
 * Plug in any SMTP server — Gmail, Office365, Zoho, an institutional
 * mail relay, AWS SES SMTP, etc. — by setting the env vars below.
 * No third-party HTTP service in the path.
 *
 * Required environment variables:
 *   SMTP_HOST     — e.g. smtp.gmail.com / smtp.office365.com
 *   SMTP_PORT     — 587 (STARTTLS, recommended) or 465 (SMTPS)
 *   SMTP_USER     — login username (usually the same address as SMTP_FROM)
 *   SMTP_PASS     — password or app password
 *   SMTP_FROM     — From: address (defaults to SMTP_USER)
 *   SMTP_TO       — admissions inbox (defaults to SMTP_FROM)
 *
 * Optional:
 *   SMTP_SECURE   — "true" forces TLS (port 465); auto-detected otherwise.
 *
 * Add the same vars to:
 *   - `.env.local` for local dev
 *   - Vercel → Project Settings → Environment Variables
 *
 * If any required var is missing the service mocks success and logs the
 * payload to the server console — local dev keeps working without SMTP.
 */

import nodemailer from "nodemailer";

export interface FormPayload {
  /** Used to brand the subject line and segment in analytics */
  formType: "apply" | "contact" | "visit";
  name: string;
  phone: string;
  email?: string | "";
  branch: string;
  source?: string | "";
  message?: string | "";
  consent: boolean;
  /** Optional rich context — flattened into the email body verbatim. */
  extras?: Record<string, string | number | boolean | undefined | null>;
}

export interface EmailResult {
  ok: boolean;
  mocked?: boolean;
  message?: string;
}

// Single transporter reused across requests in a serverless instance.
type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
};

let cachedTransport: nodemailer.Transporter | null = null;
let cachedKey: string | null = null;

function readConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const portStr = process.env.SMTP_PORT?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  if (!host || !portStr || !user || !pass) return null;

  const port = Number(portStr);
  if (!Number.isFinite(port) || port <= 0) return null;

  const secureEnv = process.env.SMTP_SECURE?.trim().toLowerCase();
  const secure = secureEnv === "true" || port === 465;

  const from = process.env.SMTP_FROM?.trim() || user;
  const to = process.env.SMTP_TO?.trim() || from;

  return { host, port, secure, user, pass, from, to };
}

function getTransport(cfg: SmtpConfig): nodemailer.Transporter {
  const key = `${cfg.host}|${cfg.port}|${cfg.secure}|${cfg.user}`;
  if (cachedTransport && cachedKey === key) return cachedTransport;
  cachedTransport = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
  });
  cachedKey = key;
  return cachedTransport;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formLabel(t: FormPayload["formType"]): string {
  if (t === "apply") return "Apply 2026-27";
  if (t === "visit") return "Visit booking";
  return "Contact";
}

function formatRows(payload: FormPayload): Array<[string, string]> {
  const rows: Array<[string, string]> = [
    ["Form", formLabel(payload.formType)],
    ["Name", payload.name],
    ["Mobile", payload.phone],
    ["Email", payload.email || "(not provided)"],
    ["Branch interest", payload.branch],
    ["Source", payload.source || "(not provided)"],
  ];
  if (payload.extras) {
    for (const [k, v] of Object.entries(payload.extras)) {
      if (v === undefined || v === null || v === "") continue;
      // pretty-print snake_case keys
      const label = k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      rows.push([label, String(v)]);
    }
  }
  if (payload.message && payload.message.trim()) {
    rows.push(["Message", payload.message.trim()]);
  }
  rows.push(["Consent", payload.consent ? "Yes" : "No"]);
  rows.push(["Submitted at", new Date().toISOString()]);
  return rows;
}

function buildText(payload: FormPayload): string {
  const lines = [
    `New ${formLabel(payload.formType)} form submission`,
    "",
    ...formatRows(payload).map(([k, v]) => `${k}: ${v}`),
    "",
    "—",
    "Sent from the BIPE website (bipevns.org)",
  ];
  return lines.join("\n");
}

function buildHtml(payload: FormPayload): string {
  const heading = `New <em>${formLabel(payload.formType)}</em> submission`;
  const rows = formatRows(payload)
    .map(
      ([k, v]) => `
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid #e4e2da;color:#5a6280;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;font-family:ui-monospace,Menlo,monospace;width:160px;vertical-align:top;">${escapeHtml(k)}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #e4e2da;color:#0a1a3f;font-size:14px;line-height:1.5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${escapeHtml(v).replace(/\n/g, "<br>")}</td>
        </tr>
      `,
    )
    .join("");
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f6f4ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0a1a3f;">
  <div style="max-width:640px;margin:32px auto;background:#ffffff;border:1px solid #e4e2da;border-radius:14px;overflow:hidden;">
    <div style="padding:20px 24px;border-bottom:1px solid #e4e2da;background:#0a1a3f;color:#f6f4ee;">
      <div style="font-family:ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#f0b429;">BIPE Website · Admissions inbox</div>
      <div style="margin-top:6px;font-size:20px;font-weight:600;letter-spacing:-0.01em;">${heading}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;">${rows}</table>
    <div style="padding:14px 24px;font-family:ui-monospace,Menlo,monospace;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#8a92ac;background:#efede5;">
      bipevns.org · auto-generated · do not reply unless intended
    </div>
  </div>
</body></html>`;
}

export async function sendFormEmail(payload: FormPayload): Promise<EmailResult> {
  const cfg = readConfig();

  if (!cfg) {
    console.log("[email-service] SMTP env vars missing — logging only:");
    console.log(JSON.stringify(payload, null, 2));
    return { ok: true, mocked: true };
  }

  const subject = `${formLabel(payload.formType)} · ${payload.name} · ${payload.branch}`;

  try {
    const transport = getTransport(cfg);
    await transport.sendMail({
      from: cfg.from,
      to: cfg.to,
      replyTo: payload.email || cfg.from,
      subject,
      text: buildText(payload),
      html: buildHtml(payload),
    });
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown SMTP error";
    console.error("[email-service] SMTP error:", msg);
    return {
      ok: false,
      message: "Could not deliver your message. Please try again or WhatsApp us.",
    };
  }
}
