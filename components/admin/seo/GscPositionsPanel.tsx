import { isGSCConfigured, getSearchAnalytics } from "@/lib/gsc";

/**
 * Live positions from Google Search Console — FREE, first-party
 * ranking data for bipevns.org (real average position, clicks,
 * impressions, CTR per query, last 28 days).
 *
 * This is the free, more-accurate counterpart to the Semrush position
 * table elsewhere on the page: it's Google's own data for our site, no
 * API units, no sales contract. Renders a setup notice until
 * GSC_SITE_URL + a Search-Console-authorised service account are set
 * (see lib/gsc.ts). Async server component — drop <GscPositionsPanel/>
 * into the page; it fetches at render.
 */
export default async function GscPositionsPanel() {
  const configured = isGSCConfigured();
  const result = configured ? await getSearchAnalytics(28, 25) : null;

  return (
    <section style={{ marginBottom: 36 }}>
      <h2 className="bipe-h3" style={{ fontSize: 22, marginBottom: 4 }}>
        Live positions —{" "}
        <span style={{ color: "var(--brand)" }}>Search Console</span>
      </h2>
      <p
        style={{
          color: "var(--ink-2)",
          fontSize: 14,
          lineHeight: 1.6,
          maxWidth: "70ch",
          marginBottom: 16,
        }}
      >
        Google&rsquo;s own data for bipevns.org — real average position, clicks,
        impressions and CTR over the last 28 days. Free, no API units, more
        accurate than third-party estimates. Sorted by clicks.
      </p>

      {!configured ? (
        <SetupNotice />
      ) : result && result.ok ? (
        <CountsTable result={result} />
      ) : (
        <ErrorNotice error={result?.ok === false ? result.error : "Unknown error"} />
      )}
    </section>
  );
}

function CountsTable({
  result,
}: {
  result: { ok: true; rows: { query: string; clicks: number; impressions: number; ctr: number; position: number }[]; daysBack: number; fetchedAt: string };
}) {
  if (!result.rows.length) {
    return (
      <Notice tone="muted">
        Connected, but Search Console returned no rows yet. New properties
        take a few days to accumulate query data (GSC also lags ~2-3 days).
      </Notice>
    );
  }
  const cols = "minmax(0, 3fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)";
  return (
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
          gridTemplateColumns: cols,
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
        <div>Query</div>
        <div style={{ textAlign: "right" }}>Position</div>
        <div style={{ textAlign: "right" }}>Clicks</div>
        <div style={{ textAlign: "right" }}>Impr.</div>
        <div style={{ textAlign: "right" }}>CTR</div>
      </div>
      {result.rows.map((r, i) => (
        <div
          key={`${r.query}-${i}`}
          style={{
            display: "grid",
            gridTemplateColumns: cols,
            padding: "12px 18px",
            borderBottom:
              i < result.rows.length - 1 ? "1px solid var(--line)" : "none",
            alignItems: "center",
            fontSize: 13.5,
          }}
        >
          <div style={{ fontWeight: 500 }}>{r.query}</div>
          <div
            style={{
              textAlign: "right",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              color: r.position <= 10 ? "var(--brand)" : "var(--ink-2)",
            }}
          >
            {r.position.toFixed(1)}
          </div>
          <div style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>
            {r.clicks.toLocaleString("en-IN")}
          </div>
          <div style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}>
            {r.impressions.toLocaleString("en-IN")}
          </div>
          <div style={{ textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}>
            {(r.ctr * 100).toFixed(1)}%
          </div>
        </div>
      ))}
      <div
        style={{
          padding: "10px 18px",
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--ink-3)",
          background: "var(--paper-2)",
        }}
      >
        Last {result.daysBack} days · live from Search Console · GSC lags ~2-3 days
      </div>
    </div>
  );
}

function SetupNotice() {
  return (
    <Notice tone="muted">
      <strong>Not configured yet.</strong> To light this up free of cost: set{" "}
      <code>GSC_SITE_URL</code> (e.g. <code>sc-domain:bipevns.org</code>) in
      Vercel, and in Search Console → Settings → Users and permissions, add the
      GA4 service-account email as a user. No new credentials needed — it reuses
      the GA4 service account. Full steps in <code>lib/gsc.ts</code>.
    </Notice>
  );
}

function ErrorNotice({ error }: { error: string }) {
  return (
    <Notice tone="error">
      <strong>Search Console error.</strong> {error}
    </Notice>
  );
}

function Notice({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "muted" | "error";
}) {
  return (
    <div
      style={{
        padding: "16px 18px",
        borderRadius: 14,
        border: `1px solid ${tone === "error" ? "color-mix(in oklab, red 30%, var(--line))" : "var(--line)"}`,
        background: tone === "error" ? "color-mix(in oklab, red 6%, var(--white))" : "var(--paper-2)",
        fontSize: 13.5,
        lineHeight: 1.65,
        color: "var(--ink-2)",
      }}
    >
      {children}
    </div>
  );
}
