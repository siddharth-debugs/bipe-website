import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  POSITION_SNAPSHOTS,
  latestSnapshot,
  totalAddressableVolume,
  quickWins,
  opportunityTargets,
  type KeywordPosition,
} from "@/lib/keyword-positions";

// Force SSR — the page calls Semrush at render time. If we leave it
// static, Next.js would try to pre-render at build (where there's no
// SEMRUSH_API_KEY in env) and bake the fallback snapshot in. The
// fetch() inside fetchSemrushSnapshot still caches via revalidateTag,
// so admin visits within a 24h window are served from cache — but
// the FIRST request after deploy actually calls Semrush with the
// live env key.
export const dynamic = "force-dynamic";
import {
  SEO_SNAPSHOT,
  indexedZombiePages,
  type SeoSnapshot,
} from "@/lib/seo-snapshot";
import { fetchSemrushSnapshot } from "@/lib/fetch-semrush";
import { SeoRefreshButton } from "@/components/admin/SeoRefreshButton";

/**
 * /admin/dashboard/seo — read-only SEO position tracker.
 *
 * Now reads from TWO sources, complementary:
 *
 *   1. lib/keyword-positions.ts  — our tracked keyword universe
 *      (64 strategic keywords we want to rank for; populated from
 *      Phase 1 Semrush export + ongoing manual review).
 *
 *   2. lib/seo-snapshot.ts       — what Semrush actually observes
 *      us ranking for, plus domain-wide signals (top pages,
 *      competitors, traffic). Pulled fresh 2026-05-20.
 *
 * The two answer different questions:
 *   - "How are we doing against our targets?"   → keyword-positions
 *   - "How does Google actually see us?"        → seo-snapshot
 *
 * Server component — data is statically imported; no client state,
 * no auth check (the parent /admin/dashboard layout handles auth).
 *
 * To refresh: see header comments in both lib files. Once
 * SEMRUSH_API_KEY is in Vercel env, a cron will overwrite the
 * seo-snapshot module on a daily cadence and this page will pick
 * up the change on next deploy without any code edit here.
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

/**
 * Render a position-delta cell. Semrush reports positionDelta as
 * (current - previous), so a POSITIVE number means the ranking FELL
 * (higher position number = further from #1) and a NEGATIVE number
 * means it ROSE. We invert the visual cue so green = good, red = bad
 * regardless of mathematical sign.
 */
function deltaCell(delta: number): { label: string; color: string } {
  if (delta === 0) return { label: "·", color: "var(--ink-3)" };
  if (delta < 0) return { label: `↑ ${Math.abs(delta)}`, color: "#16a34a" };
  return { label: `↓ ${delta}`, color: "#dc2626" };
}

/**
 * Try live Semrush first; fall back to the static snapshot on any
 * failure (missing API key, Semrush 5xx, network blip). The fallback
 * is real data — just the last manually-pulled snapshot — so the page
 * stays useful in either case. Caller gets a `source` discriminator
 * so the UI can label the freshness honestly.
 */
async function getLiveSnapshot(): Promise<{
  data: SeoSnapshot;
  source: "live" | "fallback";
  error?: string;
}> {
  try {
    const data = await fetchSemrushSnapshot();
    return { data, source: "live" };
  } catch (e) {
    return {
      data: SEO_SNAPSHOT,
      source: "fallback",
      error: e instanceof Error ? e.message : "Semrush fetch failed",
    };
  }
}

export default async function SeoPositionsPage() {
  const snapshot = latestSnapshot();
  const wins = quickWins(snapshot);
  const opportunities = opportunityTargets(snapshot);
  const totalVolume = totalAddressableVolume(snapshot);
  const opportunityVolume = opportunities.reduce((sum, r) => sum + r.monthlySearches, 0);

  const ranking = snapshot.ranks.filter((r) => r.currentRank !== null);
  const notRanking = snapshot.ranks.filter((r) => r.currentRank === null);

  // Live Semrush data — what Google actually associates with us.
  const live = await getLiveSnapshot();
  const liveSeo = live.data;
  const zombies = indexedZombiePages(liveSeo);

  // Derive a Set of tracked keywords (lowercased) so we can tell which
  // of Semrush's observed positions correspond to keywords we have
  // explicit strategy notes for, vs which we accidentally rank for.
  // The "discovered" subset is interesting — opportunities to either
  // promote (if relevant) or document (if confusing entity signals).
  const trackedKeywordSet = new Set<string>(
    snapshot.ranks.map((r) => r.keyword.toLowerCase()),
  );

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

      {/* ── Semrush domain overview ────────────────────────────── */}
      <section style={{ marginTop: 28, marginBottom: 36 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--ink-1)" }}>
              Domain overview — what Google sees
            </h2>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: live.source === "live" ? "#16a34a" : "#d97706",
                marginTop: 4,
              }}
            >
              {live.source === "live" ? (
                <>● Live · Semrush · {liveSeo.database} · {liveSeo.date} (24h cache)</>
              ) : (
                <>◐ Fallback · static snapshot · {liveSeo.date} · {live.error?.slice(0, 80)}</>
              )}
            </div>
          </div>
          <SeoRefreshButton />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {[
            {
              label: "Authority rank",
              value: liveSeo.overview.rank.toLocaleString(),
              sub: "Semrush global rank (lower = better)",
            },
            {
              label: "Organic keywords",
              value: liveSeo.overview.organicKeywords,
              sub: "ranking in top 100 of Google India",
            },
            {
              label: "Organic traffic / mo",
              value: liveSeo.overview.organicTraffic.toLocaleString(),
              sub: "estimated visits from organic search",
            },
            {
              label: "Competitors tracked",
              value: liveSeo.competitors.length,
              sub: "domains sharing our keyword profile",
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
      </section>

      {/* ── Indexed-zombie alert ──────────────────────────────── */}
      {zombies.length > 0 && (() => {
        const openZombies = zombies.filter((z) => !z.remediation);
        const remediatedZombies = zombies.filter((z) => z.remediation);
        // Pick the surrounding alert tone based on whether there's
        // anything OPEN. If every row is already remediated, the
        // alert is just an audit-trail and should look reassuring
        // (green/teal), not alarming (amber).
        const allRemediated = openZombies.length === 0;
        const tones = allRemediated
          ? { border: "#16a34a", bg: "#dcfce7", eyebrow: "#166534", body: "#14532d", row: "#bbf7d0" }
          : { border: "#f59e0b", bg: "#fef3c7", eyebrow: "#92400e", body: "#78350f", row: "#fde68a" };
        return (
          <section
            style={{
              marginBottom: 36,
              padding: 18,
              border: `1px solid ${tones.border}`,
              background: tones.bg,
              borderRadius: 14,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: tones.eyebrow,
                marginBottom: 8,
              }}
            >
              {allRemediated ? "✓  Indexed pages — all remediated, awaiting SERP refresh" : "⚠  Indexed pages worth investigating"}
            </div>
            <div style={{ color: tones.body, fontSize: 13, lineHeight: 1.6 }}>
              Semrush observed these URLs ranking, but they shouldn&rsquo;t be:
              either they&rsquo;re from a previous version of the site (e.g.
              /bipe-media, /polytechnic-courses) or they leak admin/form
              artefacts into search (e.g. /thank-u).
              {allRemediated ? (
                <>
                  {" "}
                  <strong>All four are now 301-redirected</strong> in
                  <code> next.config.ts</code> — they&rsquo;ll drop from this
                  list once Semrush re-crawls (typically 2-4 weeks after
                  Google sees the redirects).
                </>
              ) : (
                <>
                  {" "}
                  Consider adding<code> noindex </code>headers or 301-redirecting
                  to live URLs.
                </>
              )}
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
                marginTop: 12,
              }}
            >
              <thead>
                <tr>
                  <th style={th}>URL</th>
                  <th style={th}>Keywords</th>
                  <th style={th}>Traffic / mo</th>
                  <th style={th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {zombies.map((z) => (
                  <tr key={z.url} style={{ borderTop: `1px solid ${tones.row}` }}>
                    <td style={{ ...td, fontFamily: "var(--font-mono)", fontSize: 12 }}>
                      {z.url}
                    </td>
                    <td style={td}>{z.keywords}</td>
                    <td style={td}>{z.traffic}</td>
                    <td style={td}>
                      {z.remediation ? (
                        <span
                          title={`Since ${z.remediation.sinceISO}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            letterSpacing: "0.1em",
                            fontWeight: 700,
                            color: "#166534",
                            background: "#bbf7d0",
                            padding: "3px 8px",
                            borderRadius: 4,
                            textTransform: "uppercase",
                          }}
                        >
                          ✓ 301 → {z.remediation.redirectsTo}
                        </span>
                      ) : (
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            letterSpacing: "0.1em",
                            fontWeight: 700,
                            color: "#92400e",
                            background: "#fde68a",
                            padding: "3px 8px",
                            borderRadius: 4,
                            textTransform: "uppercase",
                          }}
                        >
                          ⚠ Open
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      })()}

      {/* ── Tracked-target stats strip ────────────────────────── */}
      <h2
        style={{
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 14,
          color: "var(--ink-1)",
        }}
      >
        Tracked targets — what we&rsquo;re trying to win
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
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

      {/* ── Opportunity targets ───────────────────────────────── */}
      {opportunities.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 14,
              color: "var(--ink-1)",
            }}
          >
            Opportunity targets — biggest prizes we don&rsquo;t yet rank for
          </h2>
          <p style={{ color: "var(--ink-2)", fontSize: 13, marginBottom: 14, lineHeight: 1.55 }}>
            {opportunities.length} tracked keywords with ≥ 500 monthly searches that are not yet
            in the top 100. Combined addressable demand:{" "}
            <strong>{opportunityVolume.toLocaleString()} searches / month</strong>. Sorted by
            volume — biggest unclaimed prize at the top. Pair this with the notes column
            for the strategic gloss on each row (some are flagged &ldquo;don&rsquo;t target
            head-on&rdquo; — read before acting).
          </p>
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
                  <th style={th}>Volume / mo</th>
                  <th style={th}>Keyword</th>
                  <th style={th}>Intent</th>
                  <th style={th}>Target page</th>
                  <th style={th}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((r) => {
                  const t = tierLabel[r.tier];
                  return (
                    <tr key={r.keyword} style={{ borderTop: "1px solid var(--line)" }}>
                      <td
                        style={{
                          ...td,
                          fontWeight: 700,
                          color: t.color,
                        }}
                      >
                        {r.monthlySearches.toLocaleString()}
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
                      <td style={{ ...td, fontFamily: "var(--font-mono)", fontSize: 12 }}>
                        {r.targetPage}
                      </td>
                      <td style={{ ...td, color: "var(--ink-2)", fontSize: 13, maxWidth: 320 }}>
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

      {/* ── Live Semrush positions ────────────────────────────── */}
      <section style={{ marginBottom: 36 }}>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 14,
            color: "var(--ink-1)",
          }}
        >
          Live Semrush positions — what Google actually ranks us for
        </h2>
        <p style={{ color: "var(--ink-2)", fontSize: 13, marginBottom: 14, lineHeight: 1.55 }}>
          The {liveSeo.topPositions.length} keyword/URL combinations Semrush observed for{" "}
          <code>{liveSeo.overview.domain}</code> in the Google India index. &ldquo;Discovered&rdquo;
          rows are positions Semrush sees but aren&rsquo;t in our tracked-target list — worth
          reviewing for opportunity (genuine win we should document) or confusion (entity-mismatch
          signal worth disambiguating). Δ shows monthly position change: ↑ green = rose, ↓ red =
          fell, · = no change.
        </p>
        <div style={{ border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead style={{ background: "var(--paper-2)" }}>
              <tr>
                <th style={th}>Pos</th>
                <th style={th}>Δ</th>
                <th style={th}>Keyword</th>
                <th style={th}>Vol / mo</th>
                <th style={th}>Traffic %</th>
                <th style={th}>Ranking URL</th>
                <th style={th}>Source</th>
              </tr>
            </thead>
            <tbody>
              {liveSeo.topPositions.map((p, i) => {
                const isTracked = trackedKeywordSet.has(p.keyword.toLowerCase());
                const rank = rankCell(p.position);
                const delta = deltaCell(p.positionDelta);
                return (
                  <tr
                    key={`${p.keyword}-${p.url}-${i}`}
                    style={{ borderTop: "1px solid var(--line)" }}
                  >
                    <td style={{ ...td, fontWeight: 700, color: rank.color }}>{rank.label}</td>
                    <td
                      style={{
                        ...td,
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        color: delta.color,
                      }}
                    >
                      {delta.label}
                    </td>
                    <td style={td}>{p.keyword}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{p.searchVolume.toLocaleString()}</td>
                    <td style={td}>{p.trafficPct.toFixed(2)}%</td>
                    <td
                      style={{
                        ...td,
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        maxWidth: 280,
                        wordBreak: "break-all",
                      }}
                    >
                      {p.url}
                    </td>
                    <td style={td}>
                      <span
                        style={{
                          display: "inline-block",
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: isTracked ? "var(--paper-2)" : "#fef3c7",
                          color: isTracked ? "var(--ink-2)" : "#92400e",
                        }}
                      >
                        {isTracked ? "tracked" : "discovered"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Top organic pages (Semrush) ───────────────────────── */}
      <section style={{ marginBottom: 36 }}>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 14,
            color: "var(--ink-1)",
          }}
        >
          Top organic pages — where the traffic lands
        </h2>
        <p style={{ color: "var(--ink-2)", fontSize: 13, marginBottom: 14, lineHeight: 1.55 }}>
          Heavy concentration on the homepage — {liveSeo.topPages[0]?.trafficPct.toFixed(0) ?? 0}% of
          organic traffic lands there. Long tail is thin, which is where the keyword-research roadmap
          aims to fill.
        </p>
        <div style={{ border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead style={{ background: "var(--paper-2)" }}>
              <tr>
                <th style={th}>URL</th>
                <th style={th}>Keywords</th>
                <th style={th}>Traffic / mo</th>
                <th style={th}>% of total</th>
              </tr>
            </thead>
            <tbody>
              {liveSeo.topPages.map((p) => (
                <tr key={p.url} style={{ borderTop: "1px solid var(--line)" }}>
                  <td style={{ ...td, fontFamily: "var(--font-mono)", fontSize: 12 }}>{p.url}</td>
                  <td style={td}>{p.keywords}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{p.traffic.toLocaleString()}</td>
                  <td style={{ ...td, color: "var(--ink-2)" }}>{p.trafficPct.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Top competitors (Semrush) ─────────────────────────── */}
      <section style={{ marginBottom: 36 }}>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 14,
            color: "var(--ink-1)",
          }}
        >
          Top organic competitors — who Google groups us with
        </h2>
        <p style={{ color: "var(--ink-2)", fontSize: 13, marginBottom: 14, lineHeight: 1.55 }}>
          Domains that rank for the same keywords as bipevns.org. Relevance ≈ keyword-profile
          similarity (0–1). Internal SEO-intel only — these competitor names are intentionally{" "}
          <strong>not</strong> mentioned on any public-facing page (we don&rsquo;t hand smaller
          private polytechnics free brand exposure inside our funnel). The real competitive set
          is government &amp; aided polytechnics — addressed on /private-vs-government-polytechnic.{" "}
          <code>ggpvaranasi.in</code> (Government Girls Polytechnic) is the source of our
          ranking confusion for &ldquo;government girls polytechnic varanasi&rdquo;.
        </p>
        <div style={{ border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead style={{ background: "var(--paper-2)" }}>
              <tr>
                <th style={th}>Domain</th>
                <th style={th}>Relevance</th>
                <th style={th}>Common kw</th>
                <th style={th}>Their kw</th>
                <th style={th}>Their traffic</th>
              </tr>
            </thead>
            <tbody>
              {liveSeo.competitors.map((c) => (
                <tr key={c.domain} style={{ borderTop: "1px solid var(--line)" }}>
                  <td style={{ ...td, fontFamily: "var(--font-mono)", fontSize: 12 }}>
                    {c.domain}
                  </td>
                  <td style={td}>{c.relevance.toFixed(2)}</td>
                  <td style={td}>{c.commonKeywords}</td>
                  <td style={td}>{c.theirOrganicKeywords.toLocaleString()}</td>
                  <td style={{ ...td, fontWeight: 600 }}>
                    {c.theirOrganicTraffic.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

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
        <strong style={{ color: "var(--ink-1)" }}>How this page works:</strong>{" "}
        Two data sources, complementary. The &ldquo;Domain overview&rdquo;, &ldquo;Top organic
        pages&rdquo;, and &ldquo;Top competitors&rdquo; sections read from{" "}
        <code>lib/seo-snapshot.ts</code> (live Semrush data, pulled{" "}
        {liveSeo.date}). The &ldquo;Tracked targets&rdquo; stats, &ldquo;Quick wins&rdquo;,
        and full position table read from <code>lib/keyword-positions.ts</code> (the 64 strategic
        keywords we&rsquo;re trying to win).
        <br />
        <br />
        <strong style={{ color: "var(--ink-1)" }}>How to refresh:</strong> today both files are
        updated manually (or via a Claude Code session running Semrush MCP queries). Phase B will
        wire <code>SEMRUSH_API_KEY</code> into Vercel env + a daily cron that overwrites{" "}
        <code>lib/seo-snapshot.ts</code> automatically, while the tracked-targets file stays
        editor-driven (it&rsquo;s strategy, not just observation).
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
