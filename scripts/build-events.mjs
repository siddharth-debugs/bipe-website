// One-off: walks the extracted "College Events" tree, copies every photo
// into /public/events/<slug-path>/<n>.jpg, auto-categorises by path, and
// emits a typed catalog at /lib/events-gallery.ts.
//
// Run with: node scripts/build-events.mjs <source-root>

import { readdir, mkdir, copyFile, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import { readFileSync } from "node:fs";

const SRC_ROOT = process.argv[2];
if (!SRC_ROOT) {
  console.error("Usage: node scripts/build-events.mjs <source-root>");
  process.exit(1);
}

const PROJECT_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/(\w):/, "$1:"), "..");
const PUBLIC_OUT = path.join(PROJECT_ROOT, "public", "events");
const CATALOG_OUT = path.join(PROJECT_ROOT, "lib", "events-gallery.ts");

const TRANSLITERATIONS = new Map([
  ["कटौना गांव", "katauna-gaon"],
]);

function slug(input) {
  let s = input;
  for (const [k, v] of TRANSLITERATIONS) s = s.replaceAll(k, v);
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[_]+/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

// Look at each path SEGMENT (not the joined string) so generic words like
// "Engineering" inside branch folders don't trigger event-type matches.
// More specific categories are checked first.
function categorize(originalPath) {
  const segs = originalPath
    .split(path.sep)
    .map((s) => s.toLowerCase());

  const any = (re) => segs.some((s) => re.test(s));

  // 1. Industrial visits — branch tours, survey camps, substations, plants
  if (any(/\bindustrial visit\b/)) return "IndustrialVisit";
  if (any(/\bsurvey camp\b|\bsubstation\b|\bsub-station\b/)) return "IndustrialVisit";
  if (any(/\bobra thermal\b|\bconstruction site\b|\bbanaras engineering\b|\bbecl\b/)) return "IndustrialVisit";

  // 2. Placement — placement drives, placed students, career arc seminar
  if (any(/\bplacement drive\b|\bplaced students\b/)) return "Placement";

  // 3. Career programmes & training
  if (any(/\bamcat\b|\bpolytechnic chalo\b|\bpowerpoint\b|\bseminar\b|\bcareer guidance\b|\bscience 2 engineering\b|\bcareer arc\b/))
    return "CareerProgram";

  // 4. Labs / practicals / training internships
  if (any(/\blab activity\b|\bsurveying practical\b|\bcnc\b|\bexpirement\b|\bexperiment\b|\btraining program\b|\bin-?house\b|\bsummer training\b|\brama digital\b|\binternship\b/))
    return "Lab";

  // 5. Sports — explicit sport names
  if (any(/\bbadminton\b|\bcarrom\b|\bchess\b|\bvolleyball\b|\bcricket\b|\btournament\b/)) return "Sports";
  // Generic "sports" folder — but skip if it's the branch label
  if (any(/^sports$/)) return "Sports";

  // 6. Convocation / achievements / project displays
  if (any(/\bconvocation\b|\bachivement\b|\bachievement\b|\bproject activity\b|\bcollage_s\b|\bcollege_s\b/))
    return "Convocation";

  // 7. Cultural events — by specific event name, not generic "engineer"
  if (any(/\butkarsh\b|\bsaraswati\b|\bteacher_s day\b|\bteacher's day\b|\bindependence\b|\bidependence\b|\b15th august\b|\brepublic day\b|\bengineer_s day\b|\bengineer's day\b|\bnavsarg\b|\bfresher\b|\binduction\b|\bwelcome event\b|\bsaraswati pujan\b/))
    return "Cultural";

  // 8. Anything inside a generic "Events" folder
  if (segs.includes("events") || segs.includes("event")) return "Cultural";

  return "Other";
}

const BRANCH_RULES = [
  { re: /civil engineering/i, label: "Civil" },
  { re: /electrical engineering/i, label: "Electrical" },
  { re: /mechanical engineering/i, label: "Mechanical" },
  { re: /computer (sciencs|science) and engineering/i, label: "CSE" },
  { re: /dairy engineering/i, label: "Dairy" },
];
function findBranch(p) {
  for (const r of BRANCH_RULES) if (r.re.test(p)) return r.label;
  return null;
}

const YEAR_RE = /\b(2016|2017|2018|2019|2020|2021|2022|2023|2024|2025|2026)\b/;
function findYear(p) {
  const m = YEAR_RE.exec(p);
  return m ? Number(m[1]) : null;
}

const TITLE_FIXES = new Map([
  ["Idependence Day", "Independence Day"],
  ["Expirement Demonstration", "Experiment Demonstration"],
  ["Collage_s Achivement", "College Achievements"],
  ["Computer Sciencs and Engineering", "Computer Science & Engineering"],
  ["Tailbros Automotive Component", "Talbros Automotive Components"],
  ["BD Group and Baverages LLP(Campa)", "BD Group & Beverages (Campa)"],
  ["Sub-Station Tour in Electrical Sub-Station Ghajokhar, Phoolpur", "Sub-Station Tour · Gajokhar, Phoolpur"],
  ["Electrical Substation, Gajokhar, Phoolpur", "Electrical Substation · Gajokhar, Phoolpur"],
  ["Powerpoint Presentation Competition on Industrial Training Internship", "PPT Competition · Industrial Training"],
  ["Welcome Event of All Freshers", "Freshers Welcome"],
  ["Student Induction Program – Navsarg", "Student Induction · Navsarg"],
  ["Educational Construction Site Tour", "Construction Site Tour"],
  ["Training Program for 1st Year by RAMA Digital Electronics Lab", "RAMA Digital Electronics · 1st Year Training"],
  ["IN-HOUSE Summer Internship 1st Year", "In-House Summer Internship · 1st Year"],
  ["Summer Training Internship 1st Year", "Summer Training · 1st Year"],
  ["Final Year Industrial Visit", "Final Year Industrial Visit"],
]);

function cleanSegment(s) {
  if (TITLE_FIXES.has(s)) return TITLE_FIXES.get(s);
  return s
    .replace(/_s\b/g, "'s")
    .replace(/\bSurveying Practical\b/, "Surveying Practical")
    .replace(/\b15th August\b/, "15 August · Independence Day")
    .replace(/\bTeacher's Day\b/, "Teacher's Day")
    .replace(/Engineer's Day/, "Engineer's Day")
    .replace(/Polytechnic Chalo Campaign/, "Polytechnic Chalo Campaign")
    .trim();
}

// Pull a clean event title from the deepest descriptive folder (NOT the
// numeric image filename) and prepend the company / venue when relevant.
function titleOf(originalRel) {
  const parts = originalRel.split(path.sep).filter(Boolean);
  // Drop leading "College Events" + the actual image filename at the end
  const trimmed = parts.slice(parts[0] === "College Events" ? 1 : 0).slice(0, -1);
  // Drop the year prefix if present
  const noYear = trimmed[0] && /^\d{4}$/.test(trimmed[0]) ? trimmed.slice(1) : trimmed;
  // Drop branch if it's the first
  const noBranch = noYear[0] && /^(Civil|Electrical|Mechanical|Computer|Dairy)/i.test(noYear[0]) ? noYear.slice(1) : noYear;
  // Skip generic container folders unless they're the only thing left
  const containers = /^(events?|extra curriculum|placement drive|event|industrial visit|placed students|final year industrial visit|survey camp)$/i;
  let filtered = noBranch.filter((p) => !containers.test(p));
  if (filtered.length === 0) filtered = noBranch;
  // Take last 2 segments for richer context (e.g. "Industrial Visit · Obra Thermal Power Station")
  const tail = filtered.slice(-2).map(cleanSegment);
  const label = tail.join(" · ");
  return label || "Untitled";
}

async function walk(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (e.isFile()) {
      out.push(full);
    }
  }
  return out;
}

async function main() {
  const allFiles = (await walk(SRC_ROOT)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  console.log(`Found ${allFiles.length} image files. Copying...`);

  const records = [];
  let okCount = 0;
  let skipCount = 0;

  for (const src of allFiles) {
    const relFromRoot = path.relative(SRC_ROOT, src);
    const parts = relFromRoot.split(path.sep);
    // Slugify each segment
    const segSlugs = parts.map((p) => slug(p)).filter(Boolean);
    // Final filename — keep slug + extension
    const ext = path.extname(parts[parts.length - 1]).toLowerCase() || ".jpg";
    const baseName = path.basename(parts[parts.length - 1], path.extname(parts[parts.length - 1]));
    const fileSlug = slug(baseName) || "img";
    const dirSegs = segSlugs.slice(0, -1);
    const dest = path.join(PUBLIC_OUT, ...dirSegs, fileSlug + ext);
    const destDir = path.dirname(dest);
    if (!existsSync(destDir)) {
      await mkdir(destDir, { recursive: true });
    }
    try {
      const s = await stat(src);
      if (s.size === 0) {
        skipCount++;
        continue;
      }
      await copyFile(src, dest);
      okCount++;
    } catch (err) {
      console.warn(`Skip ${src}: ${err.message}`);
      skipCount++;
      continue;
    }

    // Read intrinsic dimensions for masonry layout. Falls back to 4:3 if
    // the file is malformed or unrecognised.
    let width = 800;
    let height = 600;
    try {
      const buf = readFileSync(dest);
      const dim = imageSize(buf);
      if (dim.width && dim.height) {
        width = dim.width;
        height = dim.height;
      }
    } catch {
      /* ignore — fallback dims are fine */
    }

    const publicSrc = "/" + path.relative(path.join(PROJECT_ROOT, "public"), dest).replaceAll(path.sep, "/");
    const year = findYear(relFromRoot);
    const branch = findBranch(relFromRoot);
    const category = categorize(relFromRoot);
    const title = titleOf(relFromRoot);

    records.push({
      src: publicSrc,
      year,
      branch,
      category,
      title,
      width,
      height,
      original: relFromRoot.replaceAll(path.sep, "/"),
    });
  }

  console.log(`Copied ${okCount} files (${skipCount} skipped).`);

  // Sort: most recent year first, then by category, then by title for stability
  records.sort((a, b) => {
    if ((b.year ?? 0) !== (a.year ?? 0)) return (b.year ?? 0) - (a.year ?? 0);
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.title.localeCompare(b.title);
  });

  // Emit TS catalog
  const ts = `// Auto-generated by scripts/build-events.mjs — do not edit by hand.
// Source: extracted "College Events" archive (see Drive).
// Photos live under /public/events/. Re-run the script to refresh.

export type EventCategory =
  | "Cultural"
  | "Sports"
  | "IndustrialVisit"
  | "Placement"
  | "Lab"
  | "CareerProgram"
  | "Convocation"
  | "Other";

export interface EventPhoto {
  /** Path under /public, e.g. /events/2026/civil-engineering/... */
  src: string;
  /** Year, when present in the source path */
  year: number | null;
  /** Branch when the photo lives under a branch folder */
  branch: "Civil" | "Electrical" | "Mechanical" | "CSE" | "Dairy" | null;
  /** Auto-categorised by path */
  category: EventCategory;
  /** Human-readable event label, derived from the deepest descriptive folder */
  title: string;
  /** Intrinsic image dimensions in pixels. Used by next/image for proper masonry. */
  width: number;
  height: number;
}

export const EVENT_PHOTOS: EventPhoto[] = ${JSON.stringify(
    records.map(({ original, ...r }) => r),
    null,
    2,
  )};

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  Cultural: "Cultural & Festivals",
  Sports: "Sports",
  IndustrialVisit: "Industrial Visits",
  Placement: "Placement Drives",
  Lab: "Labs & Workshops",
  CareerProgram: "Career & Training",
  Convocation: "Convocation & Achievements",
  Other: "Other",
};

export const EVENT_CATEGORY_ORDER: EventCategory[] = [
  "Cultural",
  "Sports",
  "Lab",
  "IndustrialVisit",
  "Placement",
  "CareerProgram",
  "Convocation",
  "Other",
];

/** Years present in the catalog, newest first. */
export const EVENT_YEARS: number[] = Array.from(
  new Set(EVENT_PHOTOS.map((p) => p.year).filter((y): y is number => y !== null)),
).sort((a, b) => b - a);
`;

  await writeFile(CATALOG_OUT, ts, "utf8");
  console.log(`Wrote catalog to ${CATALOG_OUT} with ${records.length} entries.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
