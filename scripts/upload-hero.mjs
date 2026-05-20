/**
 * One-shot uploader for the homepage hero photo to Cloudinary.
 *
 * Why this exists: the homepage hero is the LCP element on /. Serving it
 * through Vercel's image optimizer cost AVIF support (we already burned
 * through Vercel's monthly transformation quota once — see next.config.ts
 * comment on `images.formats`). Cloudinary gives us free AVIF/WebP via
 * f_auto + free q_auto with no monthly cap.
 *
 * Usage:
 *   node scripts/upload-hero.mjs [path/to/local.jpg]
 *
 * Defaults to `public/hero-campus.jpg` if no path is given.
 *
 * Output is the resulting Cloudinary URL (paste into lib/images.ts
 * heroWide). Re-running with the same publicId overwrites in place.
 *
 * Mirrors the auth pattern from scripts/sync-labs.mjs so the same env
 * variables (CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET) work here
 * if you have them set; otherwise it falls back to the same baked-in
 * constants the lab sync script uses.
 */
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME || "dg8sty5ej";
const KEY    = process.env.CLOUDINARY_API_KEY    || "652117684298495";
const SECRET = process.env.CLOUDINARY_API_SECRET || "mHMr_v3COY8ypgyS8CAiWQ5dV1A";

const SRC = process.argv[2] || "public/hero-campus.jpg";
const FOLDER = "bipe/hero";
const PUBLIC_ID = "hero-campus";

function sign(params, secret) {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(toSign + secret).digest("hex");
}

const buf = await fs.readFile(path.resolve(SRC));
const ext = path.extname(SRC).slice(1).toLowerCase() || "jpg";
const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

const timestamp = Math.floor(Date.now() / 1000);
const params = {
  folder: FOLDER,
  overwrite: "true",
  public_id: PUBLIC_ID,
  tags: "hero",
  timestamp: String(timestamp),
  unique_filename: "false",
  use_filename: "false",
};
const signature = sign(params, SECRET);

const fd = new FormData();
fd.set("api_key", KEY);
fd.set("file", new Blob([buf], { type: mime }), `${PUBLIC_ID}.${ext}`);
for (const [k, v] of Object.entries(params)) fd.set(k, v);
fd.set("signature", signature);

const res = await fetch(
  `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
  { method: "POST", body: fd },
);
if (!res.ok) {
  const txt = await res.text().catch(() => "");
  console.error(`Cloudinary ${res.status}: ${txt.slice(0, 400)}`);
  process.exit(1);
}
const r = await res.json();

const baseUrl = `https://res.cloudinary.com/${CLOUD}/image/upload`;
const transforms = "f_auto,q_auto";
const versioned = `${baseUrl}/${transforms}/v${r.version}/${r.public_id}.${r.format}`;

console.log("\n=== Hero uploaded ===");
console.log(`  source:    ${SRC} (${(buf.length / 1024).toFixed(0)} KB, ${r.width}x${r.height})`);
console.log(`  public_id: ${r.public_id}`);
console.log(`  version:   v${r.version}`);
console.log(`  format:    ${r.format}`);
console.log(`\n  Paste into lib/images.ts heroWide:\n`);
console.log(`  ${versioned}\n`);
