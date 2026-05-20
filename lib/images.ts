// Image registry for the BIPE site.
//
// Every key in this file is referenced by at least one consumer. The
// May 2026 audit flagged that this file had grown ~half full of dead
// Unsplash URLs (slots declared here but never imported anywhere) —
// which made the file lie about what real BIPE photography we have
// and what's still a stock placeholder. A grep-based audit removed
// 36 unused keys in one commit; what remains below is only live.
//
// Rule: do not add a key here without a consumer in the same PR. If
// a slot disappears because its consumer was removed, delete it here
// too in the same commit.
export const BIPE_IMG = {
  // Hero campus photo. Lineage:
  //   - Original PNG: 2.45 MB, LCP bottleneck (Lighthouse 79).
  //   - Re-encoded JPEG: 313 KB, shipped to /public (audit η).
  //   - Cloudinary delivery (this URL): same source, served via
  //     scripts/upload-hero.mjs at v1779261976.
  //
  // The URL deliberately has NO `w_` transform. Img.tsx detects that
  // and routes through cloudinaryLoader, which generates a proper
  // responsive srcSet hitting Cloudinary directly: ~50 KB AVIF/JPEG
  // on mobile (640w) through ~290 KB at 1920w. Zero Vercel
  // transformation quota consumed — that quota was exhausted once
  // already (see next.config.ts images.formats note).
  //
  // Format upgrade path: Cloudinary's account-level "Auto AVIF" is
  // OFF by default on this account, so `f_auto` currently picks JPEG
  // even on Chrome/Safari that accept AVIF. Toggling that switch in
  // Cloudinary Settings → Optimization yields an immediate ~30%
  // payload drop on every viewport with zero code change. Until
  // someone flips it, we deliver q_auto JPEG, which is already at
  // parity with Next/Image's WebP variants (verified May 2026:
  // w_750 = 69 KB Cloudinary vs ~70 KB Next/Image WebP).
  //
  // The legacy /hero-campus.jpg file is intentionally left in
  // /public as a defensive fallback for the backend page_section
  // "home/hero" record; HeroFull.tsx normalizes both .jpg and .png
  // legacy paths to this URL so admin-stored references keep working.
  heroWide:
    "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto/v1779261976/bipe/hero/hero-campus",

  // Branch-relevant photos — sourced from BIPE's Cloudinary lab manifest
  // (lib/labs-manifest.json). Only landscape-orientation photos are used
  // here because the slider crops to 16:9 — portrait shots get an awful
  // centre-strip crop. Dairy stays on Unsplash because we have no
  // dairy-lab photography yet.
  workshop:    "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778151561/bipe/labs/mechanical/machin-shop-3",
  cncLab:      "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778151561/bipe/labs/mechanical/machin-shop-3",
  computerLab: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778150980/bipe/labs/cse/programming-lab-4",
  electrical:  "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778151049/bipe/labs/ee/ee-machin",
  civil:       "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778151196/bipe/labs/civil/survey-camp",
  // Dairy: synced 2026-05-20 from Drive's Photos > Lab Photos > Dairy
  // Engineering folder via scripts/sync-labs.mjs. Only one frame is
  // unambiguously a dairy photo ("Dairy Engineering.jpg" → slug
  // "dairy-engineering", 800×600). The other 7 frames in that folder
  // were mis-filed mechanical lab photos (Hydraulics / Thermal /
  // Engg Mechanics) — they synced fine but should NOT be used here.
  //
  // Alternatives Drive uploaded but unverified (could be dairy-relevant,
  // names are opaque "18.jpeg", "24.jpeg", "33.jpeg" — swap freely if any
  // are better visual matches):
  //   .../v1779263602/bipe/labs/dairy/18
  //   .../v1779263622/bipe/labs/dairy/24
  //   .../v1779263640/bipe/labs/dairy/33
  dairy:       "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto/v1779263644/bipe/labs/dairy/dairy-engineering",
  automobile:  "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778149853/bipe/labs/mechanical/auto-mobile-lab",

  // Campus exterior tile on /about (the "6-ACRE CAMPUS" card). User
  // flagged 2026-05-20 that the previous Unsplash photo was a
  // graduates-throwing-caps shot at Marina Bay Sands (Singapore) —
  // visibly NOT a 6-acre BIPE campus and breaking the authenticity
  // commitment. Swapped to the same Cloudinary URL the homepage hero
  // uses (BIPE main building, 1672×941, verifiably real BIPE
  // photography). The URL form is loader-ready (no baked-in w_), so
  // Img.tsx's cloudinaryLoader picks the right responsive variant per
  // viewport — the about tile gets a smaller crop than the hero on
  // the same URL.
  //
  // Re-using one URL across two slots is intentional: until someone
  // drops real campus exterior shots into Drive's
  // Photos > Campus & Accomodation > Campus folder (currently empty,
  // probed 2026-05-20), this is the only verified BIPE campus image
  // we have. When that folder gets populated and synced via
  // scripts/sync-labs.mjs, point campusWide at a distinctive frame
  // and let the slots diverge.
  campusWide:
    "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto/v1779261976/bipe/hero/hero-campus",
  // Single library still kept as a fallback; the curated set lives in
  // `libraryPhotos` below and is rendered as a slider on /campus.
  library: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_1200/v1778955753/bipe/library/library-01.jpg",
  /**
   * BIPE library — own photos shot 2026-05-16. Eleven landscape frames
   * covering reading room, stacks, study tables, magazine corner.
   * Rendered as a CrossfadeSlider on /campus. Tuples land in
   * "establishing → reading → detail" order so the cycle feels intentional.
   */
  // Per-frame note: photos 02/03/04/05/09/10 were captured on a phone
  // in portrait mode but uploaded to Cloudinary without an EXIF
  // Orientation tag (Cloudinary strips EXIF on upload by default). On
  // /campus they previously rendered 90° rotated — the reading-room
  // shots appeared to be lying on their side. Fix: prepend `a_90` to
  // the Cloudinary transform on those six URLs so they rotate at
  // delivery time. Photos 01/06/07/08/11 were already landscape and
  // do NOT need the rotate transform — keep them as-is. Verified May
  // 2026 by downloading each frame in `a_none / a_90 / a_270` and
  // comparing in a viewer.
  libraryPhotos: [
    { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_1200/v1778955753/bipe/library/library-01.jpg", alt: "BIPE library — main reading hall" },
    { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/a_90,f_auto,q_auto,w_1200/v1778955756/bipe/library/library-02.jpg", alt: "BIPE library — bookshelves and study area" },
    { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/a_90,f_auto,q_auto,w_1200/v1778955760/bipe/library/library-03.jpg", alt: "BIPE library — students at study tables" },
    { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/a_90,f_auto,q_auto,w_1200/v1778955763/bipe/library/library-04.jpg", alt: "BIPE library — stacks and reference section" },
    { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/a_90,f_auto,q_auto,w_1200/v1778955766/bipe/library/library-05.jpg", alt: "BIPE library — long reading room view" },
    { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_1200/v1778955769/bipe/library/library-06.jpg", alt: "BIPE library — periodicals and journals" },
    { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_1200/v1778955771/bipe/library/library-07.jpg", alt: "BIPE library — quiet study corner" },
    { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_1200/v1778955774/bipe/library/library-08.jpg", alt: "BIPE library — additional stacks" },
    { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/a_90,f_auto,q_auto,w_1200/v1778955777/bipe/library/library-09.jpg", alt: "BIPE library — circulation and DELNET desk" },
    { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/a_90,f_auto,q_auto,w_1200/v1778955780/bipe/library/library-10.jpg", alt: "BIPE library — reference texts and shelves" },
    { src: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_1200/v1778955782/bipe/library/library-11.jpg", alt: "BIPE library — overview" },
  ] as { src: string; alt: string }[],
  // Hostel: synced 2026-05-20 from Drive's Photos > Campus &
  // Accomodation > Hostel n Mess folder via sync-labs.mjs. The folder
  // contained 9 frames — mostly WhatsApp-timestamp filenames (opaque
  // semantically) plus one clearly labeled "Mess.png" and one large
  // 2023 capture. Slots picked by orientation match:
  //
  //   hostel      → 1327×721 landscape  (HOSTEL · INTERIOR slot —
  //                   /hostel · /visit · homepage CampusLife)
  //   hostelBoys  → 4080×3060 large     (HOSTEL · EXTERIOR slot —
  //                   /hostel only)
  //
  // Other hostel frames available if visual swap needed:
  //   .../v1779263745/bipe/hostel/1779184067484             (portrait)
  //   .../v1779263757/bipe/hostel/1779184432779             (portrait)
  //   .../v1779263785/bipe/hostel/1779187400799             (~16:9)
  //   .../v1779263848/bipe/hostel/mess                      (1920×1080 — labeled Mess)
  //   .../v1779263817/bipe/hostel/file-0000000010a47207...  (portrait)
  //   .../v1779263859/bipe/hostel/whatsapp-image-2026-05-19-at-16-05-41
  //   .../v1779263854/bipe/hostel/whatsapp-image-2026-05-19-at-16-05-41-1
  hostel: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto/v1779263766/bipe/hostel/1779186676308",
  hostelBoys: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto/v1779263838/bipe/hostel/img-20230408-203849",
  // mess: real BIPE mess close-up (students standing, hands folded in
  // grace before meal, April 2023). Replaces the Unsplash placeholder
  // the audit flagged on /hostel.
  mess: "/campus-photos/mess-1-grace.png",

  // Real BIPE classroom photo, Dec 2022 — two students in foreground
  // wearing BIPE-branded hoodies + lanyards with full cohort behind.
  // The slot name kept "2024" only for backwards-compat; consumer in
  // app/about uses an honest "Recent cohort" label.
  students2024: "/students/classroom-cohort.jpg",

  principal: "/faculty/rahul-srivastava.png",

  // editorial extras
  // Same real BIPE classroom shot used for `students2024` on /about
  // (two students in BIPE-branded hoodies + lanyards, full cohort
  // behind). Re-used here so the "Classroom · year one" tile at the
  // bottom of /admission is an authentic BIPE space, not stock.
  classroom: "/students/classroom-cohort.jpg",
  surveying:    "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778151162/bipe/labs/civil/auto-level-jpg",
  weldingHands: "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778149843/bipe/labs/mechanical/welding-shop",

  // admission · jeecup · fees · scholarships · documents · apply
  //
  // Slots removed 2026-05-20 (replaced with components/ui/IconTile at
  // every consumer): examHall (→ /jeecup), scholarship (→ /scholarships),
  // documentFolder / documentStack / documentSeal (→ /documents).
  // Each was an Unsplash placeholder; IconTile renders a designed
  // illustration tile (Lucide icon + brand-tinted background +
  // diagonal pattern) that's clearly not pretending to be a BIPE
  // photo. When real campus photos are available, swap IconTile
  // back to <Img> at the consumer call site.

  // Real BIPE counselling moment — counsellor (pink shirt) interviewing
  // two prospective students at his desk, "Success Stories #bipeans"
  // alumni wall in the background, glass desk with computer/keyboard.
  // Replaces the generic Unsplash hall-of-chairs that the audit flagged
  // on /admission's "Counselling round" tile.
  counsellingHall: "/admission-activity/counselling-interview.jpg",
  // Real BIPE admission desk wide-angle — counsellors at the central
  // desk helping a row of seated prospective students, "ADMISSION OPEN
  // SESSION 2018-19" banner visible on the right, BIPE letterhead sign
  // on the left, Utkarsh event-photo wall behind. Same room as the
  // counselling photo above.
  studentsForms: "/admission-activity/admission-desk-wide.jpg",
  // studentWriting swapped off Unsplash 2026-05-20 — used on
  // /scholarships for the "Filing the portal form" tile. The real
  // BIPE classroom-cohort photo shows students with notebooks open at
  // desks (BIPE-branded hoodies, lanyards), which matches the
  // form-filling intent of the slot. Same photo also drives students2024
  // and classroom — re-using one verified-real frame across three
  // honest contexts beats keeping a stock placeholder.
  studentWriting: "/students/classroom-cohort.jpg",

  // campus · hostel · faculty · events extras
  //
  // sportsGround swapped off Unsplash 2026-05-20 — used on /campus
  // for a sports-field tile. Real BIPE sports photography exists in
  // /public/events/volleyball-final-showdown/ (8 frames from a
  // Spardha volleyball match). Using frame 4 here so it differs from
  // the sportsMeet slot which uses frame 5 — gives visual variation
  // between the two campus-life tiles without resorting to stock.
  sportsGround: "/events/volleyball-final-showdown/4.jpg",
  // solarPanels / rainHarvest / ledLight / rampAccess removed
  // 2026-05-20: the four /campus sustainability tiles now render via
  // components/ui/IconTile (Sun / Droplets / Lightbulb / Accessibility
  // glyphs over brand-tinted backgrounds). No real BIPE photos of
  // solar arrays, rainwater bores, LED retrofits or ramps exist yet;
  // honest icon tiles beat stock placeholders.
  // Real BIPE Utkarsh 2020 stage performance — line of student
  // dancers in yellow kurta + red harem, "UTKARSH 2020" stage
  // backdrop with BIPE Banaras Institute of Polytechnic & Engineering
  // branding clearly visible. Marigold-bordered red stage. Replaces
  // the generic Unsplash classical-dance placeholder on /events.
  culturalDance: "/cultural-events/utkarsh-2020-dance.jpg",
  // Real BIPE Technofest 2020 — faculty + visiting officials
  // inspecting a student-built scale model at the project exhibit.
  // Matches the card body's "live demonstrations — civil scale-models"
  // copy. Same Utkarsh-week event captured the same day.
  projectFair: "/cultural-events/technofest-2020-model.jpg",
  // Real BIPE Spardha volleyball action — players mid-game with the
  // ball above the net, outdoor grass court at the Phoolpur campus,
  // green vs blue jerseys, "VOLLEYBALL TOURNAMENT" banner in the
  // adjacent frame. Replaces the generic Unsplash track-and-field
  // shot on /events FLAGSHIPS · Spardha. Slot renamed from
  // `trackField` to `sportsMeet` because the photo is volleyball,
  // not track & field, and the SPARDHA card label already reads
  // "SPORTS MEET" not "TRACK & FIELD".
  sportsMeet: "/events/volleyball-final-showdown/5.jpg",

  // placements — placementInterview / placementHandshake removed
  // 2026-05-20: /placements now uses components/ui/IconTile
  // (BriefcaseBusiness for the mock-interview tile, Handshake for the
  // recruiter-visit tile). When real campus placement-day photos
  // come in, swap IconTile back to <Img> at the call site.

  // Per-branch thumbnail + slider imagery now lives on DATA.branches
  // (lib/data.ts) as `thumbnail` and `slides`. Consumers should read
  // those fields directly instead of looking up by BTEUP code here.

  /**
   * Reserved for future hand-uploaded recruiter wordmarks (drop them in
   * /public/recruiters/ and add a key here). Wikipedia thumbnail URLs
   * proved unreliable — the redirected/renamed files were 404'ing in
   * production, so we now ship a uniform inline SVG glyph for every
   * recruiter via Recruiters.tsx. Empty map by design.
   */
  recruiterLogos: {} as Record<string, string>,
};
