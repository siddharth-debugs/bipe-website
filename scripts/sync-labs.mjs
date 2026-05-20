/**
 * Sync the campus lab photos from Google Drive → Cloudinary →
 * lib/labs-manifest.json (committed to the repo).
 *
 * Auto-discovery: instead of a manual file inventory, this script
 * scrapes Drive's public `embeddedfolderview` page for each category
 * folder. ANY image dropped into the right Drive sub-folder is picked
 * up next time you run the script — no code edits needed.
 *
 * Each folder must be shared "Anyone with the link · Viewer".
 *
 * Env (or fall back to the constants below):
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 *
 * Usage:
 *   node scripts/sync-labs.mjs
 *
 * Idempotent: re-running the same `publicId` (derived from the file
 * title) overwrites the Cloudinary asset rather than creating a
 * duplicate — Cloudinary returns the existing version on overwrite.
 */
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME || "dg8sty5ej";
const KEY   = process.env.CLOUDINARY_API_KEY   || "652117684298495";
const SECRET = process.env.CLOUDINARY_API_SECRET || "mHMr_v3COY8ypgyS8CAiWQ5dV1A";

// ─── Folder map ────────────────────────────────────────────────────────
// Drive folder ID → category slug. Every image inside the folder is
// uploaded to Cloudinary with this category tag. Add new categories by
// dropping a new Drive folder into the parent shared folder, sharing
// it "Anyone with the link", and listing it here.
//
// Optional per-entry overrides:
//   cloudinaryFolder  — full Cloudinary path (default: bipe/labs/${category})
//   cloudinaryTags    — comma-separated tags (default: lab,${category})
//
// May 2026 note: the original 4 lab folder IDs below (cse/ee/mechanical/
// civil) now point at containers that hold sub-folders rather than
// direct image files — the Drive was reorganized into a cleaner
// `Photos > Lab Photos > [Branch]` tree. Re-running the script logs
// "0 images found" for those four entries (the existing Cloudinary
// URLs continue serving from older syncs). When someone refreshes the
// lab photos, update those IDs to the new tree:
//
//   Photos > Lab Photos > Computer Science & Engineering  1jZvTYXuvFoYfYpumYOPtY8xG-sCrQVmg
//   Photos > Lab Photos > Electrical Engineering          1IiLfh1kvYQPVCViQjzch7JsSuU1ZFhtP
//   Photos > Lab Photos > Mechanical Engineering          1QREQI8T1HssFmgJEe07WXbdfVv-ak88g
//   Photos > Lab Photos > Civil Engineering               1N5ahaYJCRzj1BSYCZ-XZI66gUaZoFVMa

const FOLDERS = [
  { id: "1UNeAJW5xjtoS41eVm3E7BbCeXKX2E-E3", category: "cse" },        // CSE-LAB & Workshops
  { id: "1v9ngGVLyBOrvQnSvEwP-GsfioKm2NhuN", category: "ee" },         // EE
  { id: "1PJsjN0m1EIpqVfeAECtc62Ye4EkdumgH", category: "mechanical" }, // MECHANICAL
  { id: "1FWj1svm2hazJZsrvR6nZDd4lBkzXfY4h", category: "civil" },      // CIVIL
  // Added 2026-05-20 — users reported missing dairy + hostel photos on
  // /courses/dairy-engineering and /hostel. These come from the new
  // Photos > Lab Photos > Dairy Engineering and
  // Photos > Campus & Accomodation > Hostel n Mess folders.
  { id: "1KVDbAaRC5vEAONdTlHTpisoQzkJEm6bc", category: "dairy" },      // Dairy Engineering
  {
    id: "1_IVM9TGG55UD-Fz6keLTbmakLP-ZvNX7",
    category: "hostel",
    cloudinaryFolder: "bipe/hostel",
    cloudinaryTags: "hostel,campus",
  }, // Hostel n Mess
];

// ─── Helpers ───────────────────────────────────────────────────────────

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")          // drop file extension
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function titleize(filename) {
  // Preserve the casing the user gave us in Drive — it's almost always
  // already a sensible label ("Networking & IoT Lab", "Programming Lab",
  // "Project Expo 3rd year"). We just drop the extension and clean up
  // separators / repeated whitespace.
  return filename
    .replace(/\.[a-z0-9]+$/i, "") // drop extension
    .replace(/[_]+/g, " ")        // underscores → spaces (keep dashes intact)
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtmlEntities(s) {
  return s
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'");
}

/**
 * Scrape Drive's public folder embed view for the file list. Returns
 * an array of { id, title } for image entries in the folder.
 *
 * The embed view is plain HTML with each entry of the form:
 *   <div class="flip-entry" id="entry-{ID}" ...>
 *     ...<img src="...://drive-thirdparty.googleusercontent.com/16/type/{mime}" .../>
 *     <div class="flip-entry-title">{title}</div>
 */
async function listFolder(folderId) {
  const url = `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Folder embed fetch failed: ${folderId} (${res.status})`);
  const html = await res.text();

  // Split on the start-marker of each entry. The closing tags are
  // deeply nested (5+ divs) so a non-greedy block regex is fragile —
  // instead we slice between consecutive `flip-entry` start markers
  // and parse each slice for its id, mime type, and title.
  const entries = [];
  const marker = '<div class="flip-entry" id="entry-';
  const slices = html.split(marker).slice(1); // first chunk is pre-list HTML
  for (const slice of slices) {
    const idMatch = slice.match(/^([^"]+)/);
    const mimeMatch = slice.match(/drive-thirdparty\.googleusercontent\.com\/16\/type\/([^"\/]+\/[^"\/]+)/);
    const titleMatch = slice.match(/<div class="flip-entry-title">([\s\S]*?)<\/div>/);
    if (!idMatch || !titleMatch) continue;
    const mime = mimeMatch ? decodeURIComponent(mimeMatch[1]) : "";
    if (!mime.startsWith("image/")) continue;
    entries.push({
      id: idMatch[1],
      title: decodeHtmlEntities(titleMatch[1].trim()),
    });
  }
  return entries;
}

async function downloadFromDrive(driveId) {
  const url = `https://drive.google.com/uc?export=download&id=${driveId}`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Drive download failed: ${driveId} (${res.status})`);
  const buf = Buffer.from(await res.arrayBuffer());
  const magic = buf.slice(0, 4).toString("hex");
  if (!/^(ffd8ff|89504e47|47494638|52494646)/.test(magic)) {
    throw new Error(
      `Drive returned non-image for ${driveId} (magic=${magic}). ` +
      "The file may be too large for the auto-confirm download path " +
      "(>100 MB) or the folder isn't shared 'Anyone with the link'.",
    );
  }
  return buf;
}

function sign(params, secret) {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(toSign + secret).digest("hex");
}

async function uploadToCloudinary(buf, { publicId, folder, tags }) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signedParams = {
    folder,
    overwrite: "true",
    public_id: publicId,
    tags,
    timestamp: String(timestamp),
    unique_filename: "false",
    use_filename: "false",
  };
  const signature = sign(signedParams, SECRET);

  const fd = new FormData();
  fd.set("api_key", KEY);
  fd.set("file", new Blob([buf], { type: "image/jpeg" }), `${publicId}.jpg`);
  for (const [k, v] of Object.entries(signedParams)) fd.set(k, v);
  fd.set("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
    { method: "POST", body: fd },
  );
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Cloudinary ${res.status}: ${txt.slice(0, 240)}`);
  }
  return res.json();
}

// ─── Run ───────────────────────────────────────────────────────────────

if (!CLOUD || !KEY || !SECRET) {
  console.error("Missing Cloudinary creds (CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET).");
  process.exit(1);
}

const root = path.resolve(process.cwd());
const manifestOut = path.join(root, "lib", "labs-manifest.json");

const manifest = [];
let totalSeen = 0;
let totalOk = 0;
let totalFailed = 0;

for (const f of FOLDERS) {
  process.stdout.write(`\n=== ${f.category.padEnd(11)} (folder ${f.id}) ===\n`);
  let entries;
  try {
    entries = await listFolder(f.id);
  } catch (e) {
    console.warn(`  list failed: ${e.message}`);
    continue;
  }
  console.log(`  ${entries.length} image(s) found`);
  totalSeen += entries.length;

  // Track slugs we've already used in this category so two files with
  // the same name (e.g. MACHIN SHOP.jpg + MACHIN SHOP.jpeg) don't
  // collide on Cloudinary.
  const usedSlugs = new Set();
  for (const e of entries) {
    const title = titleize(e.title);
    const baseSlug = slugify(e.title);
    let slug = baseSlug;
    let n = 2;
    while (usedSlugs.has(slug)) slug = `${baseSlug}-${n++}`;
    usedSlugs.add(slug);
    const folder = f.cloudinaryFolder || `bipe/labs/${f.category}`;
    const tags = f.cloudinaryTags || `lab,${f.category}`;
    const publicId = slug;
    process.stdout.write(`  → ${f.category}/${slug.padEnd(40, " ")} `);
    try {
      const buf = await downloadFromDrive(e.id);
      const r = await uploadToCloudinary(buf, {
        publicId,
        folder,
        tags,
      });
      manifest.push({
        publicId: r.public_id,
        category: f.category,
        title,
        width: r.width,
        height: r.height,
        version: r.version,
      });
      console.log(`ok (${(buf.length / 1024).toFixed(0)} KB → ${r.width}×${r.height})`);
      totalOk += 1;
    } catch (err) {
      console.log(`FAILED: ${err.message.slice(0, 200)}`);
      totalFailed += 1;
    }
  }
}

manifest.sort((a, b) => {
  if (a.category !== b.category) return a.category.localeCompare(b.category);
  return a.title.localeCompare(b.title);
});

await fs.writeFile(manifestOut, JSON.stringify(manifest, null, 2) + "\n");

console.log(
  `\nDone. seen=${totalSeen} uploaded=${totalOk} failed=${totalFailed}`,
);
console.log(`Manifest: ${path.relative(root, manifestOut)} (${manifest.length} entries)`);
