/**
 * Sync the campus lab photos from Google Drive → Cloudinary →
 * lib/labs-manifest.json (committed to the repo).
 *
 * Reads the Drive file inventory below (snapshot from the
 * `parentId = '1MawOcJ9fP8hCQF7wBEw55VEJKypHjxyK'` listing), pulls
 * each file via Drive's direct download URL, and uploads it to
 * Cloudinary under `bipe/labs/<category>/<slug>` with a category tag.
 *
 * Env (or fall back to the constants below):
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 *
 * Usage:
 *   node scripts/sync-labs.mjs
 *
 * Idempotent: re-running with the same `publicId` overwrites the
 * Cloudinary asset rather than creating a duplicate.
 *
 * To add new images later: drop them into the matching Drive sub-
 * folder, copy the file ID + title into the inventory below, and
 * run this script again.
 */
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME || "dg8sty5ej";
const KEY   = process.env.CLOUDINARY_API_KEY   || "652117684298495";
const SECRET = process.env.CLOUDINARY_API_SECRET || "mHMr_v3COY8ypgyS8CAiWQ5dV1A";

if (!CLOUD || !KEY || !SECRET) {
  console.error("Missing Cloudinary creds (CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET).");
  process.exit(1);
}

// ─── Inventory ─────────────────────────────────────────────────────────
// Snapshot of the Drive folder listing. To extend: paste new entries from
// Drive's mcp search and re-run this script.

const INVENTORY = [
  // CSE-LAB & Workshops
  { driveId: "1g9sBXhQbv7qMOIV47CSER8r0JMZ--wUa", category: "cse",        title: "Networking Lab" },

  // EE — empty in Drive at the moment. Add entries here as they're uploaded.

  // MECHANICAL
  { driveId: "1RxEUgbT2U3mEXr0G0zvAnnuzKjfiRkdh", category: "mechanical", title: "Smithy & Forging" },
  { driveId: "1P2HW1AlceYsyIPYJVnyIZi5BILQHbKqG", category: "mechanical", title: "PT Lathe Shop" },
  { driveId: "1LAFy7YhBCOL76T-it_H9qneFOccf7oo7", category: "mechanical", title: "Auto Mobile Project Work" },
  { driveId: "1QbWJ64rQVPDIF1LFs5mVSIo0ZnQ8p3do", category: "mechanical", title: "CNC Controller" },
  { driveId: "1Wh9P90bMgrlfxILkaZSZYFW0iRJLgCxc", category: "mechanical", title: "Auto Mobile Lab — Engine Strip" },
  { driveId: "1qc-3qnEH9RY1w8dJz_miAK5myG-vWBtk", category: "mechanical", title: "Machine Shop" },
  { driveId: "1VFbyABmn2XSAJVGTjK5nNNnlLhg3QFfL", category: "mechanical", title: "Welding Shop" },
  { driveId: "1q4lBx_KQ-ktkM92Umy2GALwIzuyQZbO_", category: "mechanical", title: "Auto Mobile Lab — Workbench" },
  { driveId: "1WRDRIbcKUv3fRXQeKWB-7MHs3lKWnIbC", category: "mechanical", title: "Machine Shop — Lathes" },
  { driveId: "1X8e4HLwNwqFQXXTl443Lboi70G074H4N", category: "mechanical", title: "Machine Shop — Milling Bay" },
  { driveId: "1lhaWQJWT_9a9-Sz2u-jZ0UmJHKD9Ahl-", category: "mechanical", title: "Auto Mobile Lab" },
  { driveId: "1oLTEb_qO6sT79o-e1ILkbkTpr344Wxrc", category: "mechanical", title: "Thermal Engineering Prototypes" },
  { driveId: "15YGFD3OmPVdvDts_vVR28rWcS_ndbYZO", category: "mechanical", title: "Auto Mobile Lab — Wide" },
  { driveId: "1rC6KQ5-OvII9i9R-4cN3Nnec8sap_yov", category: "mechanical", title: "Machine Shop — Wide" },
  { driveId: "1GgPC5dFoUqdCbv7HfMt_I1EbRkJzCWZK", category: "mechanical", title: "PT Shop — Wide 1" },
  { driveId: "1KDkk4Ih-a7TUha3c6Y_rceksYBTOhL-C", category: "mechanical", title: "PT Shop — Wide 2" },

  // CIVIL
  { driveId: "11WauucU_Em-ieASr6ZEpVuCJAytag-Vh", category: "civil",      title: "Engineering Drawing Class" },
];

// ─── Helpers ───────────────────────────────────────────────────────────

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function downloadFromDrive(driveId) {
  const url = `https://drive.google.com/uc?export=download&id=${driveId}`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Drive download failed: ${driveId} (${res.status})`);
  const buf = Buffer.from(await res.arrayBuffer());
  // Drive returns an HTML virus-scan page for files >100 MB. The
  // small files here don't trip it but check the magic bytes anyway.
  const magic = buf.slice(0, 4).toString("hex");
  if (!/^(ffd8ff|89504e47|47494638|52494646)/.test(magic)) {
    throw new Error(
      `Drive returned non-image for ${driveId} (magic=${magic}). ` +
      "Make sure the folder is shared 'Anyone with the link'.",
    );
  }
  return buf;
}

function sign(params, secret) {
  // Cloudinary signature: sort params alphabetically, join as `k=v&k=v`,
  // append API secret, SHA1 the result.
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
  fd.set("folder", signedParams.folder);
  fd.set("overwrite", signedParams.overwrite);
  fd.set("public_id", signedParams.public_id);
  fd.set("tags", signedParams.tags);
  fd.set("timestamp", signedParams.timestamp);
  fd.set("unique_filename", signedParams.unique_filename);
  fd.set("use_filename", signedParams.use_filename);
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

const root = path.resolve(process.cwd());
const manifestOut = path.join(root, "lib", "labs-manifest.json");

const manifest = [];
let n = 0;
for (const item of INVENTORY) {
  n += 1;
  const slug = slugify(item.title);
  const folder = `bipe/labs/${item.category}`;
  const publicId = slug;
  process.stdout.write(`[${n}/${INVENTORY.length}] ${item.category}/${slug} … `);
  try {
    const buf = await downloadFromDrive(item.driveId);
    const sized = buf.length;
    const r = await uploadToCloudinary(buf, {
      publicId,
      folder,
      tags: `lab,${item.category}`,
    });
    manifest.push({
      publicId: r.public_id,                     // e.g. bipe/labs/cse/networking-lab
      category: item.category,
      title: item.title,
      width: r.width,
      height: r.height,
      version: r.version,
    });
    console.log(`ok (${(sized / 1024).toFixed(0)} KB → ${r.width}×${r.height})`);
  } catch (e) {
    console.log(`FAILED: ${e.message}`);
  }
}

await fs.writeFile(manifestOut, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\nWrote manifest: ${path.relative(root, manifestOut)} (${manifest.length} entries)`);
