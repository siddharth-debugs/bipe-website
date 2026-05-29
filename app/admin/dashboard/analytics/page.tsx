import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  isGA4Configured,
  getEventCounts,
  BIPE_TRACKED_EVENTS,
  type BipeEventName,
} from "@/lib/ga4";

// Force SSR — page calls GA4 Data API at render time. Static rendering
// would bake whatever counts existed at build into the page; that's
// useless for a live operator dashboard.
export const dynamic = "force-dynamic";

/**
 * /admin/dashboard/analytics — operator dashboard for call /
 * WhatsApp / form-submit event counts.
 *
 * Reads the last 7 days from GA4 via the Data API (lib/ga4.ts). If
 * GA4_PROPERTY_ID / GA4_SERVICE_ACCOUNT_EMAIL /
 * GA4_SERVICE_ACCOUNT_PRIVATE_KEY env vars are missing, renders a
 * setup-instructions panel instead so the operator knows what to do
 * next rather than seeing an empty table.
 *
 * The events themselves are already firing site-wide (task #59 +
 * the OutboundTracker + form success paths). This page is the
 * read-only viewer.
 */

const EVENT_LABELS: Record<BipeEventName, { label: string; intent: string }> = {
  call_click: {
    label: "Phone calls",
    intent: "Visitor tapped a tel: link (call the admissions desk)",
  },
  whatsapp_click: {
    label: "WhatsApp messages",
    intent: "Visitor tapped a wa.me/ link (open WhatsApp chat)",
  },
  mailto_click: {
    label: "Email clicks",
    intent: "Visitor tapped a mailto: link",
  },
  apply_submit: {
    label: "Apply form submissions",
    intent: "Successful /apply submission",
  },
  contact_submit: {
    label: "Contact form submissions",
    intent: "Successful /contact submission",
  },
  visit_submit: {
    label: "Visit-booking submissions",
    intent: "Successful /visit submission",
  },
  enquiry_submit: {
    label: "Enquiry popup submissions",
    intent: "Inquiry popup or homepage inline form success",
  },
};

const PRIORITY_EVENTS: BipeEventName[] = [
  "call_click",
  "whatsapp_click",
  "apply_submit",
  "enquiry_submit",
  "visit_submit",
  "contact_submit",
  "mailto_click",
];

export default async function AnalyticsPage() {
  const configured = isGA4Configured();
  const result = configured
    ? await getEventCounts([...BIPE_TRACKED_EVENTS], 7)
    : null;

  return (
    <div>
      <PageHeader
        eyebrow="Analytics · Last 7 days"
        title="How visitors"
        accent="reach us."
        description={
          configured
            ? "Live counts from GA4. Refresh the page to re-query (cached server-side for ~60 seconds via the access-token cache)."
            : "Configure GA4 service-account credentials to enable live counts. Walk-through below."
        }
      />

      {!configured ? (
        <SetupPanel />
      ) : result && result.ok ? (
        <CountsPanel result={result} />
      ) : (
        <ErrorPanel error={result?.ok === false ? result.error : "Unknown error"} />
      )}

      <Footer />
    </div>
  );
}

function CountsPanel({
  result,
}: {
  result: { ok: true; counts: { eventName: string; count: number; users: number }[]; daysBack: number; fetchedAt: string };
}) {
  const byName = new Map(result.counts.map((c) => [c.eventName, c]));
  const ordered = PRIORITY_EVENTS.map((name) => ({
    name,
    label: EVENT_LABELS[name].label,
    intent: EVENT_LABELS[name].intent,
    count: byName.get(name)?.count ?? 0,
    users: byName.get(name)?.users ?? 0,
  }));

  const callsAndChats =
    (byName.get("call_click")?.count ?? 0) +
    (byName.get("whatsapp_click")?.count ?? 0);
  const formSubmissions =
    (byName.get("apply_submit")?.count ?? 0) +
    (byName.get("enquiry_submit")?.count ?? 0) +
    (byName.get("visit_submit")?.count ?? 0) +
    (byName.get("contact_submit")?.count ?? 0);

  return (
    <>
      {/* Top-line summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <SummaryTile
          label="Phone + WhatsApp taps"
          big={callsAndChats}
          sub="Combined call_click + whatsapp_click"
          accent
        />
        <SummaryTile
          label="Form submissions"
          big={formSubmissions}
          sub="apply + enquiry + visit + contact"
        />
      </div>

      {/* Per-event breakdown */}
      <div
        style={{
          background: "var(--white)",
          border: "1px solid var(--line)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)",
            padding: "12px 18px",
            background: "var(--paper-2)",
            borderBottom: "1px solid var(--line)",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
          }}
        >
          <div>Event</div>
          <div style={{ textAlign: "right" }}>Count</div>
          <div style={{ textAlign: "right" }}>Unique users</div>
        </div>
        {ordered.map((row, i) => (
          <div
            key={row.name}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)",
              padding: "16px 18px",
              borderBottom:
                i < ordered.length - 1 ? "1px solid var(--line)" : "none",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 14.5 }}>{row.label}</div>
              <div
                style={{
                  marginTop: 4,
                  fontSize: 12,
                  color: "var(--ink-3)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {row.name} · {row.intent}
              </div>
            </div>
            <div
              style={{
                textAlign: "right",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: 16,
                color: row.count > 0 ? "var(--brand)" : "var(--ink-3)",
              }}
            >
              {row.count.toLocaleString("en-IN")}
            </div>
            <div
              style={{
                textAlign: "right",
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                color: "var(--ink-2)",
              }}
            >
              {row.users.toLocaleString("en-IN")}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 16,
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--ink-3)",
        }}
      >
        Last {result.daysBack} days · fetched {new Date(result.fetchedAt).toLocaleString("en-IN")}
      </div>
    </>
  );
}

function SummaryTile({
  label,
  big,
  sub,
  accent,
}: {
  label: string;
  big: number;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        padding: 22,
        borderRadius: 14,
        border: "1px solid var(--line)",
        background: accent ? "color-mix(in oklab, var(--brand) 6%, var(--white))" : "var(--white)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--ink-3)",
        }}
      >
        {label}
      </div>
      <div
        className="serif"
        style={{
          marginTop: 6,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(40px, 5vw, 56px)",
          lineHeight: 0.95,
          color: accent ? "var(--brand)" : "var(--ink)",
          letterSpacing: "-0.02em",
        }}
      >
        {big.toLocaleString("en-IN")}
      </div>
      <div style={{ marginTop: 8, fontSize: 12.5, color: "var(--ink-2)" }}>{sub}</div>
    </div>
  );
}

function ErrorPanel({ error }: { error: string }) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 12,
        background: "color-mix(in oklab, var(--danger) 10%, var(--white))",
        border: "1px solid color-mix(in oklab, var(--danger) 40%, transparent)",
        marginBottom: 24,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--danger)",
          fontWeight: 700,
        }}
      >
        GA4 fetch failed
      </div>
      <div style={{ marginTop: 10, fontSize: 14, color: "var(--ink)", lineHeight: 1.6 }}>
        {error}
      </div>
      <div style={{ marginTop: 12, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>
        Common causes:
        <ul style={{ marginTop: 6, paddingLeft: 18, display: "grid", gap: 4 }}>
          <li>
            <code>GA4_PROPERTY_ID</code> is wrong — it must be the numeric Property
            ID (e.g. <code>501234567</code>), NOT the <code>G-XXX</code> measurement
            ID.
          </li>
          <li>
            The service account email hasn't been added as a Viewer on the GA4
            property (GA4 Admin → Property Access Management → Add user).
          </li>
          <li>
            <code>GA4_SERVICE_ACCOUNT_PRIVATE_KEY</code> is missing the BEGIN /
            END PEM markers, or the literal <code>\n</code> sequences weren't
            preserved when pasting into Vercel env.
          </li>
        </ul>
      </div>
    </div>
  );
}

function SetupPanel() {
  return (
    <div
      style={{
        padding: 24,
        borderRadius: 14,
        border: "1px solid var(--line)",
        background: "var(--white)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--accent)",
          fontWeight: 700,
        }}
      >
        Setup required · ~10 minutes
      </div>
      <h2
        style={{
          marginTop: 8,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.01em",
        }}
      >
        Connect GA4 to surface call / WhatsApp / form counts here.
      </h2>
      <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.65 }}>
        The events are already firing site-wide (verified via the OutboundTracker
        — see <code>lib/analytics.ts</code> and <code>components/shell/OutboundTracker.tsx</code>).
        Connect a GA4 service account to surface the counts on this page so
        admissions doesn&apos;t have to log into Google Analytics for every check.
      </p>

      <ol style={{ marginTop: 20, paddingLeft: 22, display: "grid", gap: 14 }}>
        <li>
          <strong>Find the numeric Property ID.</strong> In GA4 → Admin →
          Property Settings. Copy the numeric ID (e.g. <code>501234567</code>) —
          NOT the <code>G-XXXX</code> measurement ID.
        </li>
        <li>
          <strong>Create a service account.</strong>{" "}
          <a href="https://console.cloud.google.com/iam-admin/serviceaccounts" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand)", fontWeight: 600 }}>
            Google Cloud Console → IAM → Service Accounts → Create
          </a>
          . Name it <code>bipe-ga4-reader</code>, role: just &quot;none&quot; for
          now (GA4 access is granted in step 4, not via Cloud IAM).
        </li>
        <li>
          <strong>Download a JSON key.</strong> On the service account &rarr;
          Keys &rarr; Add key &rarr; Create new key &rarr; JSON. Save it
          somewhere safe — you only need three fields from it:
          <code>client_email</code>, <code>private_key</code>, plus the
          GA4 property ID from step 1.
        </li>
        <li>
          <strong>Grant the service account read access to the GA4 property.</strong>{" "}
          GA4 &rarr; Admin &rarr; Property Access Management &rarr; +
          &rarr; Email = the service account&apos;s <code>client_email</code>,
          Role = <code>Viewer</code>.
        </li>
        <li>
          <strong>Set three env vars in Vercel.</strong> Settings &rarr;
          Environment Variables, all scoped to Production + Preview:
          <pre
            style={{
              marginTop: 8,
              padding: "12px 14px",
              background: "var(--paper-2)",
              border: "1px solid var(--line)",
              borderRadius: 10,
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              overflow: "auto",
            }}
          >
{`GA4_PROPERTY_ID=501234567
GA4_SERVICE_ACCOUNT_EMAIL=bipe-ga4-reader@PROJECT.iam.gserviceaccount.com
GA4_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIE...\\n-----END PRIVATE KEY-----\\n"`}
          </pre>
          The private key has literal <code>\n</code> sequences when
          pasted from JSON — keep them as-is; the server-side code
          replaces them with real newlines before signing the JWT.
        </li>
        <li>
          <strong>Redeploy</strong> (Vercel auto-redeploys env-var changes
          on the next push, or manually via the Deployments tab).
        </li>
        <li>
          <strong>Reload this page</strong> — the panel will switch from
          this setup view to live counts within ~3 seconds.
        </li>
      </ol>

      <p
        style={{
          marginTop: 20,
          fontSize: 13,
          color: "var(--ink-3)",
          fontStyle: "italic",
        }}
      >
        Detailed walk-through with screenshots: see <code>ANALYTICS_SETUP.md</code>.
      </p>
    </div>
  );
}

function Footer() {
  return (
    <div
      style={{
        marginTop: 28,
        padding: 16,
        background: "var(--paper-2)",
        borderRadius: 12,
        border: "1px solid var(--line)",
        fontSize: 13,
        color: "var(--ink-2)",
        lineHeight: 1.65,
      }}
    >
      <strong>What&apos;s counted on this page:</strong> every visitor who taps
      a phone number, WhatsApp button, or successfully submits a form on the
      public site. The event names map 1:1 to{" "}
      <code>BIPE_TRACKED_EVENTS</code> in{" "}
      <code>lib/ga4.ts</code>. The events themselves fire via the delegated
      click listener in <code>components/shell/OutboundTracker.tsx</code>{" "}
      (covers every <code>tel:</code> / <code>wa.me/</code> /{" "}
      <code>mailto:</code> link site-wide) and the success paths inside{" "}
      <code>components/forms/</code>. Mobile Safari occasionally fires the{" "}
      <code>tel:</code> handoff before the click event reaches the listener
      — actual call counts are likely 1.3-1.5x what GA4 shows.
    </div>
  );
}
