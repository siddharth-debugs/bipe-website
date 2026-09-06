/**
 * Daily check: are website enquiries still arriving in the Sampark CRM?
 *
 * WHAT THIS IS
 *   A one-sided ANOMALY check, not a two-sided reconciliation, and the
 *   difference matters. It reads how many leads ARRIVED (the CRM's own count)
 *   and compares today against the trailing week. It cannot compare that with
 *   how many were SENT, because the BIPE backend's submission counts sit behind
 *   an OTP-to-a-phone login that no scheduled job can complete. See the note at
 *   the bottom for what would make it two-sided.
 *
 * WHY IT EXISTS
 *   Until 2026-09-06 the CRM webhook was write-only, so nothing anywhere could
 *   tell whether a lead the website believed it sent had actually landed. A bug
 *   that mangled mobiles beginning 91 dropped those students silently for an
 *   unknown length of time — they saw a success screen, and no counsellor ever
 *   saw them. This is the alarm that would have caught it going quiet.
 *
 * WHAT IT CATCHES
 *   - Nothing arrived today, while the trailing week had traffic  → outage
 *   - Today collapsed against the trailing average                → partial loss
 *   Both are the shape the 91-bug had: not an error, just fewer than there
 *   should be, with nothing complaining.
 *
 * WHAT IT DOES NOT CATCH
 *   A genuinely quiet day. Enquiry volume is seasonal and weekday-shaped, so a
 *   real drop and a slow Sunday look identical from one side. The thresholds
 *   below are deliberately loose: this is a smoke alarm, not an audit, and a
 *   check that cries wolf gets muted and then ignored — which is exactly how
 *   the original bug survived.
 *
 *   Nor a pipeline that is ALREADY dark when the week begins: with the trailing
 *   week at zero there is no baseline to fall from, so silence reads the same
 *   as no traffic. This catches the transition into failure, not a failure it
 *   was never running for. First run after a long quiet spell is uninformative
 *   by nature.
 *
 * ENV
 *   BIPE_CRM_COUNT_URL   full URL of the count endpoint, e.g.
 *                        https://crm-backend.bitevns.org/api/v1/integrations/bite-leads/count/
 *   BIPE_CRM_API_KEY     the same shared secret the site already uses to forward leads
 *   BIPE_CRM_COLLEGE     defaults to "BIPE"
 *
 * Exits 1 on an anomaly or a hard failure, so the workflow goes red and GitHub
 * emails whoever is watching. Exit 0 means checked and healthy.
 */

const COUNT_URL = (process.env.BIPE_CRM_COUNT_URL || "").trim();
const API_KEY = (process.env.BIPE_CRM_API_KEY || "").trim();
const COLLEGE = (process.env.BIPE_CRM_COLLEGE || "BIPE").trim();

/** Days of history to compare today against. */
const TRAILING_DAYS = 7;
/** Below this many leads a day, ratios are noise — skip the drop test. */
const MIN_BASELINE = 3;
/** Today must reach this share of the trailing average. */
const DROP_RATIO = 0.4;

if (!COUNT_URL || !API_KEY) {
  console.error(
    `FAIL  configuration missing — BIPE_CRM_COUNT_URL=${COUNT_URL ? "set" : "MISSING"} ` +
      `BIPE_CRM_API_KEY=${API_KEY ? "set" : "MISSING"}`,
  );
  process.exit(1);
}

/** Midnight UTC, `daysAgo` days back. Day boundaries keep buckets comparable. */
function dayStart(daysAgo) {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d;
}

async function countBetween(since, until) {
  const url = new URL(COUNT_URL);
  url.searchParams.set("college", COLLEGE);
  url.searchParams.set("since", since.toISOString());
  url.searchParams.set("until", until.toISOString());

  const res = await fetch(url, {
    headers: { "X-API-Key": API_KEY },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) {
    throw new Error(`count endpoint returned HTTP ${res.status}`);
  }
  const body = await res.json();
  if (typeof body?.count !== "number") {
    throw new Error(`count endpoint returned no count: ${JSON.stringify(body).slice(0, 200)}`);
  }
  return body.count;
}

const label = (d) => d.toISOString().slice(0, 10);

try {
  // Buckets: index 0 = today so far, 1 = yesterday, … TRAILING_DAYS = oldest.
  const days = [];
  for (let i = 0; i <= TRAILING_DAYS; i++) {
    const since = dayStart(i);
    const until = dayStart(i - 1);
    days.push({ day: label(since), count: await countBetween(since, until) });
  }

  const [today, ...trailing] = days;
  const total = trailing.reduce((n, d) => n + d.count, 0);
  const average = total / trailing.length;

  console.log(`Sampark arrivals — ${COLLEGE} website leads\n`);
  for (const d of [...days].reverse()) {
    const bar = "▇".repeat(Math.min(40, d.count));
    console.log(
      `  ${d.day}  ${String(d.count).padStart(4)}  ${bar}${d === today ? "   <- today" : ""}`,
    );
  }
  console.log(
    `\n  trailing ${trailing.length}-day total ${total}, average ${average.toFixed(1)}/day`,
  );

  // A zero day only means something where zero days are NOT the usual shape.
  // On a quiet week — a handful of leads spread across seven days — zeros are
  // normal, and alarming on one teaches everyone to mute the alarm. That is
  // exactly how the bug this check exists for survived: a signal nobody trusts
  // is worth less than no signal, because it also buries the true one.
  const trailingHasZeroDay = trailing.some((d) => d.count === 0);
  const problems = [];
  if (today.count === 0 && average >= MIN_BASELINE && !trailingHasZeroDay) {
    problems.push(
      `nothing arrived today — the first zero day in ${trailing.length}, ` +
        `which carried ${total} leads (${average.toFixed(1)}/day)`,
    );
  } else if (average >= MIN_BASELINE && today.count < average * DROP_RATIO) {
    problems.push(
      `today is ${today.count} against a trailing average of ${average.toFixed(1)} ` +
        `(under ${Math.round(DROP_RATIO * 100)}% of normal)`,
    );
  }

  if (problems.length) {
    console.error(`\nANOMALY  ${problems.join("; ")}`);
    console.error(
      "\nThis measures what ARRIVED, so it cannot say where a lead was lost. Check, in order:",
    );
    console.error("  1. Vercel logs for [crm-forward] LEAD NOT DELIVERED — the site knows it failed");
    console.error("  2. Vercel logs for [crm-forward] DELIVERED — confirms the site is still sending");
    console.error("  3. Whether it is simply a quiet day (holiday, off-season, weekend)");
    process.exit(1);
  }

  console.log("\nOK  arrivals are within normal range.");
  process.exit(0);
} catch (err) {
  // A failure to CHECK is not a failure of the pipeline, and saying so stops
  // someone reading a broken checker as a broken CRM.
  console.error(`\nFAIL  could not complete the check: ${err.message}`);
  console.error("The CRM may be perfectly healthy — this says the check did not run.");
  process.exit(1);
}

/*
 * TO MAKE THIS A REAL RECONCILIATION
 *
 * It needs the SENT number as well, and today that is unreachable: the BIPE
 * backend's submission counts are behind /submissions/summary/, which requires
 * a JWT minted from an OTP sent to a phone. A scheduled job cannot log in.
 *
 * The smallest unlock is a token-readable count on the BIPE backend, mirroring
 * what the CRM now exposes — authenticated with the ingest token the site
 * already holds. Then this script fetches both numbers and subtracts them, and
 * "42 sent, 41 arrived" becomes a fact rather than an inference.
 */
