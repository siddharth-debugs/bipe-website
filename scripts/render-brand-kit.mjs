// One-shot SVG → PNG render for the brand kit asset.
// Run: node scripts/render-brand-kit.mjs
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const svg = readFileSync(resolve(root, "public/bipe-brand-kit.svg"));

// 1600x1200 native; render at 2x for crisp shareable PNG (3200x2400)
const out = await sharp(svg, { density: 288 })
  .resize(3200, 2400, { fit: "contain", background: "#F6F4EE" })
  .png({ compressionLevel: 9 })
  .toBuffer();

writeFileSync(resolve(root, "public/bipe-brand-kit.png"), out);
console.log(`✓ public/bipe-brand-kit.png · ${(out.length / 1024).toFixed(1)} KB`);
