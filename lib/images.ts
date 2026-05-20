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
  // Hero campus photo. The PNG version was 2.45 MB and the LCP
  // bottleneck on /, pulling Lighthouse mobile Performance from
  // ~95 down to 79 (per Phase 1.5 audit η). Re-encoded as a 313 KB
  // progressive JPEG at quality 82 — visually indistinguishable
  // from the PNG but 88% smaller. Next/Image still serves further
  // responsive variants on top of this source.
  heroWide: "/hero-campus.jpg",

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
  dairy:       "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=900&q=80&auto=format&fit=crop",
  automobile:  "https://res.cloudinary.com/dg8sty5ej/image/upload/f_auto,q_auto,w_900/v1778149853/bipe/labs/mechanical/auto-mobile-lab",

  campusWide: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80&auto=format&fit=crop",
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
  hostel: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900&q=80&auto=format&fit=crop",
  hostelBoys: "https://images.unsplash.com/photo-1564540583246-934409427776?w=900&q=80&auto=format&fit=crop",
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
  documentSeal: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&q=80&auto=format&fit=crop",

  // admission · jeecup · fees · scholarships · documents · apply
  examHall: "https://images.unsplash.com/photo-1606326608690-4e0281b1e588?w=900&q=80&auto=format&fit=crop",
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
  scholarship: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=80&auto=format&fit=crop",
  documentFolder: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&q=80&auto=format&fit=crop",
  documentStack: "https://images.unsplash.com/photo-1568667256549-094345857637?w=900&q=80&auto=format&fit=crop",
  studentWriting: "https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=900&q=80&auto=format&fit=crop",

  // campus · hostel · faculty · events extras
  sportsGround: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80&auto=format&fit=crop",
  solarPanels: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=900&q=80&auto=format&fit=crop",
  rainHarvest: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=900&q=80&auto=format&fit=crop",
  // Modern interior with ceiling LED strips. The original Unsplash
  // ID (photo-1565636291749) 404'd upstream — verified May 2026 in
  // the dev server logs. Swapped to a known-stable corridor shot
  // that also visually matches the card body's "academic blocks,
  // workshops, hostels and the corridor" copy.
  ledLight: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80&auto=format&fit=crop",
  rampAccess: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=900&q=80&auto=format&fit=crop",
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

  // placements
  placementInterview: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&q=80&auto=format&fit=crop",
  placementHandshake: "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=900&q=80&auto=format&fit=crop",

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
