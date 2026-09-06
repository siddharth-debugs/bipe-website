#!/usr/bin/env node
/**
 * Reproducible mobile PageSpeed audit for BIPE.
 *
 * Runs Lighthouse against five canonical production URLs and writes
 * per-page JSON + a parsed summary to /tmp/lighthouse-bipe/.
 * Designed for the cadence the May 2026 Phase 1.5 audit recommended
 * (weekly during admission cycle, monthly thereafter).
 *
 * Usage:
 *   npm run lighthouse
 *
 * Requirements:
 *   - npx lighthouse@latest (auto-installed via `npx`)
 *   - Google Chrome at /Applications/Google Chrome.app/Contents/MacOS/
 *     Google Chrome (macOS default). Override with CHROME_PATH env var.
 *
 * Output:
 *   /tmp/lighthouse-bipe/<page>.json      — full Lighthouse report
 *   /tmp/lighthouse-bipe/summary.json     — parsed scores + Core Web Vitals
 *
 * Companion: BIPE_PageSpeed_Audit.md at project root is the human
 * report; this script regenerates the raw data it cites.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = "/tmp/lighthouse-bipe";
const CHROME_PATH =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const PAGES = [
  { name: "home",                url: "https://bipe.ac.in/" },
  { name: "admission",           url: "https://bipe.ac.in/admission" },
  { name: "jeecup",              url: "https://bipe.ac.in/jeecup" },
  { name: "jeecup-counselling",  url: "https://bipe.ac.in/jeecup-counselling" },
  { name: "about",               url: "https://bipe.ac.in/about" },
];

if (!fs.existsSync(CHROME_PATH)) {
  console.error(`✗ Chrome binary not found at ${CHROME_PATH}.`);
  console.error(`  Override via CHROME_PATH env var or install Google Chrome.`);
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const { name, url } of PAGES) {
  const outFile = path.join(OUT_DIR, `${name}.json`);
  console.log(`→ Lighthouse · ${name.padEnd(22)} ${url}`);
  try {
    execSync(
      `npx --yes lighthouse "${url}" \
        --quiet --output=json --output-path="${outFile}" \
        --form-factor=mobile --throttling-method=simulate \
        --chrome-flags="--headless --no-sandbox" \
        --only-categories=performance,accessibility,best-practices,seo \
        --max-wait-for-load=45000`,
      {
        stdio: ["ignore", "ignore", "pipe"],
        env: { ...process.env, CHROME_PATH },
      },
    );
    console.log(`  ✓ saved ${outFile}`);
  } catch (err) {
    console.error(`  ✗ failed for ${url}`);
    console.error(`    ${err.message?.slice(0, 200)}`);
  }
}

// Parse + summarise
console.log(`\n=== Scores summary (mobile) ===`);
const KEY_METRICS = [
  ["first-contentful-paint", "FCP"],
  ["largest-contentful-paint", "LCP"],
  ["total-blocking-time", "TBT"],
  ["cumulative-layout-shift", "CLS"],
  ["speed-index", "SI"],
  ["interactive", "TTI"],
];

const summary = [];
for (const { name } of PAGES) {
  const f = path.join(OUT_DIR, `${name}.json`);
  if (!fs.existsSync(f)) continue;
  const d = JSON.parse(fs.readFileSync(f, "utf-8"));
  const lh = d.lighthouseResult ?? d;
  const cats = lh.categories ?? {};
  const audits = lh.audits ?? {};
  const row = {
    name,
    url: lh.finalUrl ?? "?",
    perf: Math.round((cats.performance?.score ?? 0) * 100),
    a11y: Math.round((cats.accessibility?.score ?? 0) * 100),
    bp:   Math.round((cats["best-practices"]?.score ?? 0) * 100),
    seo:  Math.round((cats.seo?.score ?? 0) * 100),
  };
  for (const [k, lbl] of KEY_METRICS) {
    row[lbl] = audits[k]?.displayValue ?? "?";
  }
  summary.push(row);
}

console.log(
  ["Page".padEnd(22), "Perf", "A11y", "BP", "SEO", "  LCP", "  CLS", "  TBT", "  FCP"].join(" ").trim()
);
console.log("-".repeat(80));
for (const r of summary) {
  console.log(
    [
      r.name.padEnd(22),
      String(r.perf).padStart(4),
      String(r.a11y).padStart(4),
      String(r.bp).padStart(4),
      String(r.seo).padStart(4),
      r.LCP.padStart(7),
      r.CLS.padStart(7),
      r.TBT.padStart(7),
      r.FCP.padStart(7),
    ].join(" ")
  );
}

fs.writeFileSync(
  path.join(OUT_DIR, "summary.json"),
  JSON.stringify(summary, null, 2)
);
console.log(`\nFull summary at ${OUT_DIR}/summary.json`);
console.log(`Human report at  ./BIPE_PageSpeed_Audit.md`);
