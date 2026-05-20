import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  POSITION_SNAPSHOTS,
  latestSnapshot,
  totalAddressableVolume,
  quickWins,
  type KeywordPosition,
} from "@/lib/keyword-positions";

/**
 * /admin/dashboard/seo — read-only SEO position tracker.
 *
 * Renders the latest snapshot from lib/keyword-positions.ts as a
 * filterable table, plus a few headline stats. Server component —
 * data is statically imported; no client state, no auth check (the
 * parent /admin/dashboard layout handles auth).
 *
 * To add a fresh snapshot, edit lib/keyword-positions.ts directly;
 * the array is sorted newest-first and this page reads index [0].
 */

const tierLabel: Record<KeywordPosition["tier"], { color: string; label: string }> = {
  A: { color: "#C00000", label: "Brand" },
  B: { color: "#ED7D31", label: "Local" },
  C: { color: "#FFC000", label: "Process" },
  D: { color: "#70AD47", label: "Branch" },
  E: { color: "#4472C4", label: "Compare" },
  F: { color: "#7030A0", label: "Career" },
  G: { color: "#A5A5A5", label: "Regional" },
  H: { color: "#2F5597", label: "Trust" },
};

function rankCell(rank: number | null): { label: string; color: string } {
  if (rank === null) return { label: "Not in top 100", color: "var(--ink-3)" };
  if (rank <= 3) return { label: `#${rank}`, color: "#16a34a" };
  if (rank <= 10) return { label: `#${rank}`, color: "#22c55e" };
  if (rank <= 30) return { label: `#${rank}`, color: "#f59e0b" };
  return { label: `#${rank}`, color: "var(--ink-2)" };
}

export default function SeoPositionsPage() {
  const snapshot = latestSnapshot();
  const wins = quickWins(snapshot);
  const totalVolume = totalAddressableVolume(snapshot);

  const ranking = snapshot.ranks.filter((r) => r.currentRank !== null);
  const notRanking = snapshot.ranks.filter((r) => r.currentRank === null);

  return (
    <div>
      <PageHeader
        eyebrow={`Snapshot · ${snapshot.date}`}
        title="Keyword positions"
        accent="and where we are."
        description={
          `${snapshot.ranks.length} tracked queries · ${ranking.length} ranking in top 100 · ` +
          `addressable monthly volume ≈ ${totalVolume.toLocaleString()}. ` +
          `Source: ${snapshot.source} · ${snapshot.label}.`
        }
        right={
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
            }}
          >
            {POSITION_SNAPSHOTS.length} snapshot{POSITION_SNAPSHOTS.length === 1 ? "" : "s"} on file
          </span>
        }
      />

      {/* ── Headline stats strip ───────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginTop: 28,
          marginBottom: 36,
        }}
      >
        {[
          { label: "Total tracked", value: snapshot.ranks.length, sub: "queries" },
          {
            label: "Currently ranking",
            value: ranking.length,
            sub: `${notRanking.length} not in top 100`,
          },
          { label: "Quick wins (≤ #30)", value: wins.length, sub: "realistic short-term lift" },
          {
            label: "Monthly volume",
            value: totalVolume.toLocaleString(),
            sub: "addressable searches",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              padding: 18,
              border: "1px solid var(--line)",
              borderRadius: 14,
              background: "var(--paper)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
              }}
            >
              {s.label}
            </div>
            <div
              className="serif"
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 32,
                color: "var(--brand)",
                marginTop: 6,
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                marginTop: 6,
                color: "var(--ink-2)",
                fontSize: 12,
                fontFamily: "var(--font-mono)",
              }}
            >
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick wins section ─────────────────────────────────── */}
      {wins.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 14,
              color: "var(--ink-1)",
            }}
          >
            Quick wins — already ranking, just need a push
          </h2>
          <div
            style={{
              border: "1px solid var(--line)",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead style={{ background: "var(--paper-2)" }}>
                <tr>
                  <th style={th}>Rank</th>
                  <th style={th}>Keyword</th>
                  <th style={th}>Volume / mo</th>
                  <th style={th}>Target page</th>
                  <th style={th}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {wins.map((r) => {
                  const rank = rankCell(r.currentRank);
                  return (
                    <tr key={r.keyword} style={{ borderTop: "1px solid var(--line)" }}>
                      <td style={{ ...td, fontWeight: 700, color: rank.color }}>{rank.label}</td>
                      <td style={td}>{r.keyword}</td>
                      <td style={td}>{r.monthlySearches.toLocaleString()}</td>
                      <td style={{ ...td, fontFamily: "var(--font-mono)", fontSize: 12 }}>
                        {r.targetPage}
                      </td>
                      <td style={{ ...td, color: "var(--ink-2)", fontSize: 13 }}>
                        {r.notes ?? ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Full table ─────────────────────────────────────────── */}
      <section>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 14,
            color: "var(--ink-1)",
          }}
        >
          All tracked queries — full snapshot
        </h2>
        <div
          style={{
            border: "1px solid var(--line)",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead style={{ background: "var(--paper-2)" }}>
              <tr>
                <th style={th}>Tier</th>
                <th style={th}>Keyword</th>
                <th style={th}>Intent</th>
                <th style={th}>Vol / mo</th>
                <th style={th}>CPC ₹</th>
                <th style={th}>Comp</th>
                <th style={th}>Rank</th>
                <th style={th}>Target</th>
                <th style={th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.ranks.map((r) => {
                const t = tierLabel[r.tier];
                const rank = rankCell(r.currentRank);
                return (
                  <tr key={r.keyword} style={{ borderTop: "1px solid var(--line)" }}>
                    <td style={td}>
                      <span
                        style={{
                          display: "inline-block",
                          background: t.color,
                          color: "#fff",
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          padding: "3px 6px",
                          borderRadius: 4,
                        }}
                      >
                        {r.tier}
                      </span>
                    </td>
                    <td style={td}>{r.keyword}</td>
                    <td
                      style={{
                        ...td,
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "var(--ink-3)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {r.intent}
                    </td>
                    <td style={{ ...td, fontWeight: 600 }}>
                      {r.monthlySearches.toLocaleString()}
                    </td>
                    <td style={td}>{r.cpcInr.toFixed(2)}</td>
                    <td style={td}>{r.competition.toFixed(2)}</td>
                    <td style={{ ...td, color: rank.color, fontWeight: 700 }}>{rank.label}</td>
                    <td style={{ ...td, fontFamily: "var(--font-mono)", fontSize: 11 }}>
                      {r.targetPage}
                    </td>
                    <td style={{ ...td, color: "var(--ink-2)", fontSize: 12, maxWidth: 280 }}>
                      {r.notes ?? ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── How to update footer note ──────────────────────────── */}
      <div
        style={{
          marginTop: 36,
          padding: 18,
          background: "var(--paper-2)",
          borderRadius: 12,
          color: "var(--ink-2)",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "var(--ink-1)" }}>How to refresh this page:</strong>{" "}
        edit <code>lib/keyword-positions.ts</code> — prepend a new entry to{" "}
        <code>POSITION_SNAPSHOTS</code> with today&rsquo;s date and the fresh ranks. The header
        comment in that file walks through the workflow. Once a Semrush / Ahrefs API key is
        provisioned, this static array can be swapped for a server-action that pulls ranks
        automatically — the <code>KeywordPosition</code> shape is intentionally compatible with
        Semrush&rsquo;s <code>domain_ranks</code> endpoint.
      </div>
    </div>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--ink-3)",
  fontWeight: 600,
};

const td: React.CSSProperties = {
  padding: "10px 12px",
  verticalAlign: "top",
};
