/**
 * One-off image generator: replace every Unsplash placeholder in
 * lib/images.ts with either a real BIPE photo (from /public/labs/) or
 * an AI photo generated via Gemini 2.5 Flash Image.
 *
 * Usage:
 *   GEMINI_API_KEY=... node scripts/gen-images.mjs
 *
 * Idempotent — skips outputs that already exist on disk.
 */
import fs from "node:fs/promises";
import path from "node:path";

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error("GEMINI_API_KEY env var required.");
  process.exit(1);
}

const ROOT = path.resolve(process.cwd());
const OUT_DIR = path.join(ROOT, "public", "gen");
await fs.mkdir(OUT_DIR, { recursive: true });

const STYLE = [
  "Documentary photograph, natural daylight, 35mm look,",
  "real engineering polytechnic in Varanasi, India.",
  "Students wear simple teal-green polo shirts (no logos visible).",
  "Authentic, slightly imperfect, real-world feel — not stock.",
  "Photorealistic, candid, mid-action.",
].join(" ");

/**
 * Each entry maps an `images.ts` key to one of:
 *   { local: "/labs/X.jpg" }      — reuse an existing BIPE photo
 *   { gen: "<descriptive prompt>" } — generate via Gemini
 *
 * Prompts are short scene descriptions; STYLE is appended automatically.
 */
const MAP = {
  // ─── Hero / campus ────────────────────────────────────────────────
  heroGroup:        { gen: "Group photo of around 15 Indian engineering polytechnic students standing in front of a clean white college building, smiling, mid-20s, mixed gender, daylight." },
  campusWide:       { gen: "Wide shot of a clean modern Indian polytechnic college campus exterior, white three-storey academic block with blue accent, lush trees, clear sky, students walking on paved pathways." },
  aerial:           { gen: "Aerial top-down photograph of a small Indian polytechnic college campus — central academic block surrounded by gardens, hostel block, parking, sports ground." },

  // ─── Programmes / branches (homepage Branches slider) ─────────────
  workshop:         { local: "/labs/workshop.jpg" },
  cncLab:           { local: "/labs/cnc.jpg" },
  computerLab:      { gen: "Bright Indian polytechnic computer lab with around 30 desktop PCs in neat rows, students coding on screens visible, fluorescent ceiling lights, clean tile floor." },
  electrical:       { local: "/labs/electrical-machines.jpg" },
  civil:            { local: "/labs/civil-drafting.jpg" },
  dairy:            { gen: "Stainless-steel dairy processing plant interior with milk pasteurisation tanks and pipes, two technicians in white coats and hairnets monitoring gauges, bright industrial lighting." },
  automobile:       { local: "/labs/automobile.jpg" },
  mechanical:       { local: "/labs/lathe.jpg" },
  weldingHands:     { local: "/labs/welding.jpg" },
  surveying:        { gen: "Civil engineering students using a total-station survey instrument on a tripod outdoors, holding a survey rod in the distance, open ground with trees, India, daytime." },
  drafting:         { gen: "Engineering drafting room with parallel-bar drafting tables and triangular set-squares, technical drawings in progress, students bent over their boards." },
  classroom:        { gen: "Polytechnic classroom interior with rows of wooden benches, students seated taking notes, teacher writing on a green chalkboard, ceiling fans visible, India." },
  lectureHall:      { gen: "Tiered lecture hall with about 60 polytechnic students seated, attentive, teacher at the podium with projector screen behind, India." },
  graduation:       { gen: "Indian engineering polytechnic students in graduation gowns and caps celebrating outdoors, tossing caps in the air, smiling." },

  // ─── Library / hostel / mess ─────────────────────────────────────
  library:          { gen: "Polytechnic library interior — wooden shelves stacked with engineering textbooks, students reading at study desks, soft natural light from windows, ceiling fans, India." },
  hostel:           { gen: "Boys' hostel building exterior, three-storey block, garden in front, balconies with clothes drying, Indian college campus, daylight." },
  hostelGirls:      { gen: "Boys' hostel building exterior, three-storey block, garden in front, balconies with clothes drying, Indian college campus, daylight." },
  hostelBoys:       { gen: "Twin-bed boys' hostel room, neatly made beds with blue blankets, two study desks against the wall, books and a desk lamp, posters on walls, daylight from window." },
  hostelRoom:       { gen: "Twin-bed boys' hostel room, neatly made beds with blue blankets, two study desks against the wall, books and a desk lamp, posters on walls, daylight from window." },
  mess:             { gen: "Indian college mess dining hall with long wooden tables and benches, steel thalis with rice, dal and sabzi, students eating, kitchen counter at the back." },
  diningHall:       { gen: "Indian college mess dining hall with long wooden tables and benches, steel thalis with rice, dal and sabzi, students eating, kitchen counter at the back." },
  thaali:           { gen: "Top-down photo of a steel Indian thali with separate compartments for dal, sabzi, rice, roti and a small bowl of curd, on a wooden mess table." },
  warden:           { gen: "Friendly middle-aged Indian male hostel warden in a button-down shirt sitting at a wooden desk in his office, register book open, daylight, photographed warmly." },
  map:              { gen: "Stylised illustrated overhead map sketch of an Indian polytechnic campus on cream paper, hand-drawn ink lines marking academic block, hostel, gardens, sports ground, parking." },

  // ─── Faculty / portraits ─────────────────────────────────────────
  faculty1:         { gen: "Portrait of a serious mid-40s Indian male engineering professor in a navy blazer, light shirt, neutral grey background, soft natural light." },
  faculty2:         { gen: "Portrait of a smiling early-40s Indian female engineering professor in a maroon kurti, neutral grey background, soft natural light." },
  facultyTeach:     { gen: "Indian polytechnic professor teaching at a green chalkboard with engineering equations in chalk, gesturing, students attentive in foreground out of focus." },
  facultyMeet:      { gen: "Faculty meeting around a wooden conference table, 6 Indian engineering teachers discussing, papers and laptops on table, polytechnic office room." },
  studentSmiling:   { gen: "Friendly portrait of a young Indian male polytechnic student in a teal polo shirt, smiling, slight head tilt, neutral campus background out of focus." },
  ruralStudent:     { gen: "Portrait of a young Indian polytechnic student from a rural town in eastern UP, teal polo shirt, simple bag, standing on a campus path, warm afternoon light." },
  alumniPortrait:   { gen: "Portrait of a 24-year-old Indian engineer in a workshop uniform with safety helmet on his head, factory machinery softly out of focus behind, confident smile." },
  studentReading:   { gen: "Indian polytechnic student reading a thick engineering textbook at a library desk, focused expression, soft window light." },
  studentWriting:   { gen: "Close-up of an Indian polytechnic student's hands writing engineering notes in a ruled notebook with a blue ballpoint pen, on a wooden desk." },
  students2024:     { gen: "Group of about 8 Indian polytechnic students walking together along a campus pathway after class, books in hand, talking, late afternoon light." },

  // ─── Admission / fees / forms ────────────────────────────────────
  admissionForm:    { gen: "Indian polytechnic admission form on a wooden counter, ballpoint pen resting on it, an applicant's hand filling in details, daylight from a window." },
  examHall:         { gen: "Indian engineering entrance exam hall — rows of desks each with a student writing, invigilator standing in the aisle, OMR sheets visible, fluorescent lighting." },
  counsellingHall:  { gen: "Indian polytechnic counselling hall, families seated in plastic chairs facing a stage, parents with their children clutching documents, banner on the wall." },
  studentsForms:    { gen: "Two Indian polytechnic students helping a younger applicant fill an admission form, seated at a desk on the verandah of a college building, daylight." },
  feeReceipt:       { gen: "Close-up of a printed Indian college fee receipt on a wooden desk, official seal stamped, a 500-rupee note partially visible, ballpoint pen beside it." },
  rupees:           { gen: "Indian rupee notes — 500 and 100 denominations — neatly fanned on a plain wooden surface, top-down, soft daylight." },
  scholarship:      { gen: "Indian polytechnic principal handing a scholarship certificate to a smiling student on a small stage, audience applauding, banner reading 'Scholarship'." },
  documentFolder:   { gen: "Manila document folder open on a wooden desk, official Indian engineering polytechnic admission documents inside — printed forms, certificates with seals." },
  documentStack:    { gen: "Tall stack of Indian academic documents and certificates on a desk — mark sheets, transfer certificate, photo IDs — held together with a binder clip." },
  documentSeal:     { gen: "Close-up of an official Indian education department rubber stamp pressing a circular blue seal onto a document, ink slightly smudged." },
  shaking:          { gen: "Two Indian engineers shaking hands warmly at a campus placement event, both smiling, formal shirts, soft indoor lighting." },

  // ─── Sustainability / facilities ─────────────────────────────────
  solarPanels:      { gen: "Rooftop solar PV panels on an Indian polytechnic college building under a clear blue sky, neat rows, slight perspective, daylight." },
  rainHarvest:      { gen: "Rainwater harvesting tank and pipes connecting downspouts on the side of an Indian college building, lush green plants below, daylight." },
  ledLight:         { gen: "Energy-efficient LED tubelight on the ceiling of a clean Indian polytechnic corridor, glowing warmly, ceiling tiles visible." },
  rampAccess:       { gen: "Wheelchair-accessible concrete ramp with handrails at the entrance of an Indian polytechnic building, paved approach, accessible signage on the wall." },
  industryVisit:    { gen: "Group of Indian polytechnic students wearing teal polos and safety helmets touring a real factory floor, listening to a guide pointing at equipment." },
  sportsGround:     { gen: "Wide view of an Indian college sports ground with a cricket pitch and goalposts visible, students playing in distance, evening sun, eucalyptus trees lining the boundary." },
  cricketBat:       { gen: "Indian polytechnic students playing cricket on a campus ground, batsman mid-swing, fielders positioned, late afternoon golden light." },
  kabaddi:          { gen: "Indian college students playing kabaddi on a clay ground, mid-action raid, audience watching from the side, dusty atmosphere, evening light." },
  chess:            { gen: "Two Indian polytechnic students playing chess on a wooden board at a campus table, focused expressions, others watching, daylight." },
  volleyball:       { gen: "Indian polytechnic students playing volleyball on a sand court, mid-spike, net dividing the court, late afternoon sun." },
  trackField:       { gen: "Indian polytechnic students running on a red athletics track in a campus stadium, motion blur, evening light." },

  // ─── Events / culture ────────────────────────────────────────────
  techFestStage:    { gen: "Indian polytechnic tech-fest stage at night, banner reading 'Kashi Tech', students presenting a robotics project, audience clapping, stage lights." },
  culturalDance:    { gen: "Indian polytechnic students performing a folk dance on a campus stage, colourful costumes, mid-step, audience watching." },
  drama:            { gen: "Indian polytechnic students performing a stage play in their college auditorium, dramatic lighting, costumes." },
  projectFair:      { gen: "Indian polytechnic engineering project fair — student teams standing behind tables with their built prototypes, judges examining, posters on display." },
  engineersDay:     { gen: "Indian polytechnic Engineer's Day celebration — large banner with portrait of Sir M Visvesvaraya, students seated, dignitaries on stage, ceremonial atmosphere." },
  music:            { gen: "Indian polytechnic students performing music on a college stage — guitar, harmonium and tabla, audience visible in foreground, warm stage lights." },

  // ─── Placements / alumni ─────────────────────────────────────────
  placementInterview: { gen: "Indian polytechnic placement interview — student in formal shirt sitting opposite a recruiter at a desk, both calm, college campus visible through window." },
  placementHandshake: { gen: "Indian polytechnic student in formal shirt shaking hands with a recruiter holding an offer letter, both smiling, on-campus placement room." },
  placementOffice:  { gen: "Empty Indian polytechnic placement cell office — desks with computers, recruitment posters on the walls, neat and bright, daylight." },
  placementGroup:   { gen: "Group of about 12 Indian polytechnic students who just received placement offers, holding their offer letters, smiling at camera, principal beside them." },
  trainCab:         { gen: "Inside the cab of an Indian Railways diesel locomotive, the driver's hand on the throttle, cab dashboard with gauges, view forward through the windscreen." },
  factoryFloor:     { gen: "Wide view of a real Indian manufacturing factory floor — overhead cranes, CNC machines and conveyors, workers in helmets and uniforms moving between stations." },
};

// Some Unsplash IDs appear multiple times under different keys; map by key
// rather than by URL so each section gets a unique image when we want it to.

async function generate(prompt, outPath) {
  const fullPrompt = `${prompt} ${STYLE}`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${KEY}`;
  const body = {
    contents: [{ parts: [{ text: fullPrompt }] }],
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status}: ${txt.slice(0, 400)}`);
  }
  const json = await res.json();
  const parts = json?.candidates?.[0]?.content?.parts ?? [];
  const inline = parts.find((p) => p.inlineData?.data);
  if (!inline) {
    throw new Error("No inlineData in response: " + JSON.stringify(json).slice(0, 600));
  }
  const buf = Buffer.from(inline.inlineData.data, "base64");
  await fs.writeFile(outPath, buf);
}

const PUBLIC_PATHS = {};
let generated = 0;
let skipped = 0;
let reused = 0;

for (const [key, spec] of Object.entries(MAP)) {
  if (spec.local) {
    PUBLIC_PATHS[key] = spec.local;
    reused++;
    continue;
  }
  const out = path.join(OUT_DIR, `${key}.png`);
  PUBLIC_PATHS[key] = `/gen/${key}.png`;
  try {
    await fs.access(out);
    skipped++;
    continue;
  } catch {}

  try {
    process.stdout.write(`generating ${key}… `);
    const started = Date.now();
    await generate(spec.gen, out);
    const ms = Date.now() - started;
    console.log(`ok (${ms}ms)`);
    generated++;
  } catch (e) {
    console.error(`FAILED: ${e.message.slice(0, 200)}`);
  }
  // Polite spacing between requests to avoid quota spikes.
  await new Promise((r) => setTimeout(r, 300));
}

console.log(`\nDone. generated=${generated} skipped=${skipped} reused-local=${reused}`);
console.log("Path map (first 6):");
for (const [k, v] of Object.entries(PUBLIC_PATHS).slice(0, 6)) {
  console.log(`  ${k.padEnd(24)} -> ${v}`);
}

// Emit the final mapping so the next step (lib/images.ts patch) can read it.
await fs.writeFile(
  path.join(ROOT, "scripts", "image-map.json"),
  JSON.stringify(PUBLIC_PATHS, null, 2),
);
console.log("\nWrote scripts/image-map.json");
