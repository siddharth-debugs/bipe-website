/** One-shot probe to verify Gemini image generation works. */
import fs from "node:fs/promises";

const KEY = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${KEY}`;

const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    contents: [{ parts: [{ text: "Photograph of a single ripe red apple on a plain wooden surface, soft daylight, simple composition." }] }],
    generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
  }),
});
console.log("status:", res.status);
if (!res.ok) {
  console.log(await res.text());
  process.exit(1);
}
const j = await res.json();
const parts = j?.candidates?.[0]?.content?.parts ?? [];
console.log("parts:", parts.length);
for (const p of parts) {
  if (p.text) console.log("text:", p.text.slice(0, 120));
  if (p.inlineData) {
    console.log("inlineData mime:", p.inlineData.mimeType, "size~", p.inlineData.data.length);
    await fs.writeFile("d:/tmp/probe.png", Buffer.from(p.inlineData.data, "base64"));
    console.log("saved d:/tmp/probe.png");
  }
}
