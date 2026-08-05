/**
 * Canonical leadership facts — ONE source of truth.
 *
 * Why this file exists: lib/routes.ts:308-312 records a real incident —
 * the May 2026 SERP audit caught Google surfacing a stale leadership
 * name because the same person was typed by hand into a route title,
 * a JSON-LD block and a page heading, and the three drifted apart.
 * Everything that names a leader (the /director page, the homepage
 * Leadership section, JSON-LD, llms.txt copy) reads from here.
 *
 * SOURCE OF THE DIRECTOR'S RECORD: Prof. Tewari's own detailed résumé,
 * supplied by the office on 4 Aug 2026 and read in full before
 * publication. Deliberately EXCLUDED from this file and from the site,
 * even though the résumé contains them: date of birth, home address,
 * personal mobile number, personal email addresses and marital status.
 * Those are private facts about a living person; publishing them on a
 * public admissions website would be a privacy harm and they carry no
 * value for a student or parent. Only professional credentials appear.
 *
 * NOTE ON SPELLING — SETTLED 4 AUG 2026, DO NOT "HARMONISE":
 *   English   → "Tewari"  (not Tiwari). Matches his résumé and his
 *                IIT (BHU) email, sptewari.mec@iitbhu.ac.in.
 *   Devanagari → "तिवारी"  (not तेवारी).
 * The two forms deliberately do NOT mirror each other. Both were
 * confirmed by the office. Resist the urge to make the Hindi match the
 * English transliteration or vice versa — that "fix" has already been
 * attempted once and reverted.
 *
 * Unrelated alumni named Tiwari appear elsewhere in the repo; those are
 * different people and are spelled correctly. Never run a global
 * find-and-replace on either form.
 */

export type LeaderCredential = { label: string; value: string };

export type Leader = {
  /** Full display name, exactly as it should appear everywhere. */
  name: string;
  /** Post-nominal / honorific line rendered under the name. */
  postNominal: string;
  role: string;
  roleHi: string;
  /** Portrait in /public. */
  photo: string;
  href: string;
};

/* ────────────────────────── Director ────────────────────────── */

export const DIRECTOR: Leader = {
  name: "Prof. (Dr.) S. P. Tewari",
  postNominal: "Ph.D. · FIE",
  role: "Director, BIPE",
  roleHi: "निदेशक, बीआईपीई",
  photo: "/faculty/director-prof-sp-tewari.jpg",
  href: "/director",
};

/**
 * Full name, as he signs it.
 *
 * On his 5 Aug 2026 mark-up he corrected "S. P." to "Satya Prakash" at
 * the pull-quote signature, and his own typed message is signed
 * "Prof. Satya Prakash Tewari". Applied at those two places only.
 *
 * PENDING (Q2 with him): whether the full name should replace "S. P."
 * everywhere — page title, hero H1, nav, homepage cards, nameplate,
 * social posts. Until he answers, DIRECTOR.name above stays "S. P."
 * so the compact surfaces are untouched.
 */
export const DIRECTOR_FULL_NAME = "Prof. (Dr.) Satya Prakash Tewari";
/** Exactly as he signs the message — no "(Dr.)". */
export const DIRECTOR_SIGNATURE_NAME = "Prof. Satya Prakash Tewari";

/** One-line positioning used in nav, cards and meta descriptions. */
export const DIRECTOR_TAGLINE =
  "38 years teaching at IIT (BHU) Varanasi";

/**
 * Headline numbers. Every figure below is taken from the résumé:
 *   - 38.5 years of UG + PG teaching (14 Feb 1981 → 31 Aug 2019).
 *   - 8 doctoral theses listed as awarded in the corrected résumé
 *     table. (An earlier summary line in the same document reads
 *     "completed 05, ongoing 03" — the corrected table supersedes it.)
 *   - 40 M.Tech dissertations, 56 papers, 5 books: résumé totals.
 *   - Research funding is the SUM OF SANCTIONED grants only —
 *     ONGC 50,000 + BARC 2,12,000 + AICTE 4,00,000 + UGC 8,38,300
 *     = 15,00,300. A ₹78 lakh proposal in the résumé is marked
 *     "Proposal Submitted" and is deliberately NOT counted.
 */
export const DIRECTOR_STATS: LeaderCredential[] = [
  { label: "Years teaching at IIT (BHU)", value: "38" },
  { label: "Ph.D. scholars guided", value: "8" },
  { label: "M.Tech dissertations", value: "40" },
  { label: "Research papers", value: "56" },
  { label: "Books authored", value: "5" },
  { label: "Research grants sanctioned", value: "₹15 L" },
];

/**
 * Degrees, most recent first.
 * Fields corrected by him on 5 Aug 2026: the Ph.D. and the M.E. are
 * both in Mechanical Engineering, with the specialisation in brackets.
 */
export const DIRECTOR_EDUCATION: { degree: string; field: string; institute: string; year: string }[] = [
  { degree: "Ph.D.", field: "Mechanical Engineering (Welding)", institute: "IT-BHU, Varanasi (now IIT BHU)", year: "1998" },
  { degree: "M.E.", field: "Mechanical Engineering (Production Engineering)", institute: "MLNREC, Allahabad (now MNNIT)", year: "1980" },
  { degree: "B.E.", field: "Mechanical Engineering", institute: "MLNREC, Allahabad (now MNNIT)", year: "1978" },
];

/*
 * DIRECTOR_CAREER (the five-row Lecturer→Professor rank progression)
 * was REMOVED on 5 Aug 2026 — he struck out every row on his mark-up.
 * PENDING (Q5 with him): whether he wants it gone entirely or reduced
 * to a single line, since it is the clearest evidence for the 38-year
 * figure. Restore from git history (commit f7190c7) if he asks.
 */

/**
 * National roles — HIS OWN WORDING.
 *
 * On his 5 Aug 2026 mark-up he struck the heading "Roles he has held
 * nationally" and wrote "National Roles and Responsibilities", then
 * attached a typed list of exactly these six items, each ticked, and
 * struck the longer descriptions that had been on the cards. On the
 * second item he struck "Examiner, Evaluator & Interview", leaving
 * "UPSC & State PSC Expert".
 *
 * Note he genericised two of them himself — "National Research Project
 * Reviewer" rather than naming SERB/DST, and "a Premier Professional
 * Engineering Institution" rather than naming the Institution of
 * Engineers (India). That is his preference; do not "restore" the
 * specifics.
 */
export const DIRECTOR_NATIONAL_ROLES: string[] = [
  "AICTE Expert & Accreditation Committee Member",
  "UPSC & State PSC Expert",
  "DRDO Expert",
  "National Research Project Reviewer",
  "Reviewer for Reputed Research Journals",
  "Board of Studies & Curriculum Development Expert",
  "Fellow of a Premier Professional Engineering Institution",
];

/**
 * ONE ITEM STILL OPEN — the tail of the English pull quote.
 *
 * On the 5 Aug proof he hand-wrote the quote to show a capitalisation
 * change: "Minds, guided by values" in lower case, which IS applied
 * above. Directly beneath it he wrote "Building a Strong Nation" and
 * struck it through.
 *
 * Read at 600dpi that strike is deliberate, but it is more likely a
 * struck false start than a deletion instruction, because:
 *   - the phrase is his own, from the tagline he supplied on 4 Aug;
 *   - he left the Hindi line completely unmarked, and it still ends
 *     "सशक्त राष्ट्र का निर्माण" = "building a strong nation". Cutting
 *     the English alone would leave the two lines saying different
 *     things.
 *
 * So the phrase is KEPT. If he confirms he wanted it cut, delete the
 * final clause here and the matching "— सशक्त राष्ट्र का निर्माण" from
 * `hi` below, so the two languages stay in step.
 */

/** Honours. Only awards explicitly listed in the résumé. */
export const DIRECTOR_HONOURS: { title: string; body: string }[] = [
  {
    title: "Best Paper Award — ICSET 2018, New York",
    body: "Best paper award medal at the International Conference on Science, Engineering & Technology, New York.",
  },
  {
    title: "ISTE–GSFC National Award (First Prize, 2004)",
    body: "National Award & Certificate of Achievement for guiding the best M.Tech thesis in Mechanical Engineering.",
  },
  {
    title: "ISTE–GSFC National Award (2003 & 2006)",
    body: "Second Prize in both years — again for guiding the best M.Tech thesis in Mechanical Engineering nationally.",
  },
];

/**
 * The Director's message — HIS OWN WORDS, with two additions he approved.
 *
 * Round 1 (5 Aug 2026): he struck the previously drafted message and
 * supplied his own typed text.
 * Round 2 (5 Aug 2026, second mark-up): he was offered a variant that
 * kept his text intact and added two short passages naming his 38 years
 * at IIT (BHU) and his own field. He wrote on it: "Text with two
 * additions and one modification, inclusion is final." — so BOTH
 * additions below are approved by him and are marked.
 *
 * Every other sentence is his, verbatim and in his order. Do not edit
 * for style; any change must come from him.
 */
export const DIRECTOR_MESSAGE: string[] = [
  "It gives me immense pleasure to welcome you to our Polytechnic Institute. Technical education plays a vital role in shaping skilled professionals who contribute to the nation's industrial, technological, and socio-economic development. Our mission is not only to impart sound technical knowledge but also to develop competence, creativity, discipline, ethical values, and a lifelong passion for learning among our students.",
  // Addition 1 — approved by him, 5 Aug 2026.
  "I have spent thirty-eight years teaching mechanical engineering at IIT (BHU), Varanasi, and I have come to a polytechnic by choice. A diploma is not a smaller version of a degree; it is a different kind of education — closer to the machine, closer to the site, and closer to the work itself.",
  // Addition 2 — the final two sentences of this paragraph, approved by him.
  "At our institute, we are committed to providing a dynamic learning environment where theory is effectively integrated with practical training through modern laboratories, workshops, industry interaction, internships, and project-based learning. We strive to bridge the gap between academic education and industrial expectations so that our students become confident, competent, and employable professionals. In my own field — welding, casting and production — I have seen repeatedly that this understanding is not gained from a screen. It is gained standing at the machine, with one's hands.",
  "Innovation, research orientation, entrepreneurship, digital learning, and sustainable development are the guiding principles of our academic activities. We encourage our students to think critically, solve real-life engineering problems, and continuously upgrade their knowledge and skills to meet the challenges of an ever-evolving technological world.",
  "Our dedicated faculty members and staff remain committed to mentoring students in their academic, professional, and personal growth. We firmly believe that every student possesses immense potential, and it is our responsibility to provide the right guidance, opportunities, and environment to help them achieve excellence.",
  "I invite students, parents, alumni, industry partners, and all stakeholders to join us in our journey towards academic excellence, innovation, and nation building. Together, let us create an institution that stands as a model of quality technical education, skill development, and professional integrity.",
  "I extend my best wishes to all and look forward to your valuable support and cooperation.",
];

/**
 * The full-bleed pull quote — replaced by him on 5 Aug 2026.
 *
 * CONFIRMED 5 Aug 2026: he reviewed the rendered page and returned the
 * Devanagari below unmarked, so the transcription of his handwriting is
 * correct.
 *
 * OPEN: on the same proof he wrote over the ENGLISH line — see
 * DIRECTOR_QUOTE_OPEN_QUESTION below. Do not publish the English until
 * that is settled.
 */
export const DIRECTOR_QUOTE = {
  en: "Skilled Hands, Innovative Minds, guided by values, Building a Strong Nation.",
  /** The phrase rendered in accent colour inside the English quote. */
  highlight: "Building a Strong Nation",
  hi: "कुशल हाथ, नवोन्मेषी मस्तिष्क, मूल्यों से निर्देशित — सशक्त राष्ट्र का निर्माण।",
  hiConfirmed: true,
};

/* ────────────────────────── Chairman ────────────────────────── */

export const CHAIRMAN: Leader = {
  name: "Dr. Chandrika Rai",
  postNominal: "IPS (Retd.)",
  role: "Chairman, Purwanchal Educational Trust",
  roleHi: "अध्यक्ष, पूर्वांचल एजुकेशनल ट्रस्ट",
  photo: "/faculty/chairman-dr-chandrika-rai.png",
  href: "/chairman",
};

/** Verbatim from the existing /chairman pull quote — kept in sync. */
export const CHAIRMAN_QUOTE = {
  en: "Education is the key to a nation's progress.",
  hi: "शिक्षा राष्ट्र की प्रगति की कुंजी है।",
};

/* ────────────────────────── Principal ────────────────────────── */

export const PRINCIPAL: Leader = {
  name: "Rahul Srivastava",
  postNominal: "M.Tech",
  role: "Principal, BIPE",
  roleHi: "प्रधानाचार्य, बीआईपीई",
  photo: "/faculty/rahul-srivastava.png",
  href: "/principal",
};

/** Verbatim from the existing /principal pull quote — kept in sync. */
export const PRINCIPAL_QUOTE = {
  en: "We do not prepare students for examinations alone — we prepare them for work that matters.",
  hi: "हम विद्यार्थियों को केवल परीक्षा के लिए तैयार नहीं करते — हम उन्हें सार्थक कार्य के लिए तैयार करते हैं।",
};
