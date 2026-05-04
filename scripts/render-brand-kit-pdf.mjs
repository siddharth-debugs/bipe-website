// Render the brand kit into a single-page PDF at 4:3.
// Embeds the rasterised PNG (3200×2400) so fonts render pixel-perfect
// regardless of system font availability — preferred for sharing.
// Run: node scripts/render-brand-kit-pdf.mjs
import PDFDocument from "pdfkit";
import { readFileSync, createWriteStream, statSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const png = readFileSync(resolve(root, "public/bipe-brand-kit.png"));

// PDF page in points (1 pt = 1/72 inch). 1600 × 1200 pt = ~22.2 × 16.7 in
// Anything larger inflates file size with no benefit.
const W = 1600;
const H = 1200;

const out = resolve(root, "public/bipe-brand-kit.pdf");
const doc = new PDFDocument({
  size: [W, H],
  margin: 0,
  info: {
    Title: "BIPE Brand Kit",
    Author: "Banaras Institute of Polytechnic & Engineering",
    Subject: "Logo, palette and typography reference",
    Keywords: "BIPE, brand, logo, palette, typography",
    Producer: "bipevns.org",
  },
});

const stream = createWriteStream(out);
doc.pipe(stream);

doc.image(png, 0, 0, { width: W, height: H });

doc.end();

await new Promise((resolveP, rejectP) => {
  stream.on("finish", resolveP);
  stream.on("error", rejectP);
});

const size = statSync(out).size;
console.log(`✓ public/bipe-brand-kit.pdf · ${(size / 1024).toFixed(1)} KB · ${W}×${H} pt (4:3)`);
