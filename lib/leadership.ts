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
 * NOTE ON SPELLING: the résumé, and his institutional email at
 * IIT (BHU), both spell the surname "Tewari" (not "Tiwari"). That
 * spelling is used throughout and should not be "corrected".
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

/** Degrees, most recent first. */
export const DIRECTOR_EDUCATION: { degree: string; field: string; institute: string; year: string }[] = [
  { degree: "Ph.D.", field: "Welding", institute: "IT-BHU, Varanasi (now IIT BHU)", year: "1998" },
  { degree: "M.E.", field: "Production Engineering", institute: "MLNREC, Allahabad (now MNNIT)", year: "1980" },
  { degree: "B.E.", field: "Mechanical Engineering", institute: "MLNREC, Allahabad (now MNNIT)", year: "1978" },
];

/** Rank progression in a single department across 38 years. */
export const DIRECTOR_CAREER: { years: string; title: string }[] = [
  { years: "2009 – 2019", title: "Professor, Mechanical Engineering, IIT (BHU) Varanasi" },
  { years: "2006 – 2009", title: "Associate Professor, IT-BHU Varanasi" },
  { years: "1998 – 2005", title: "Reader, IT-BHU Varanasi" },
  { years: "1989 – 1998", title: "Lecturer (Senior Scale), IT-BHU Varanasi" },
  { years: "1981 – 1989", title: "Lecturer, IT-BHU Varanasi" },
];

/** National-level roles — the strongest external trust signals. */
export const DIRECTOR_NATIONAL_ROLES: { title: string; body: string }[] = [
  {
    title: "AICTE Expert Visit Committee",
    body: "Served on AICTE Expert Visit Committees (2019), inspecting institutions across Odisha, Hyderabad and Assam — the same approval machinery BIPE is assessed by.",
  },
  {
    title: "UPSC & UPPSC examiner",
    body: "Civil-services examiner and evaluator — interviewer, paper setter, head examiner and moderator for UPSC and UPPSC examinations.",
  },
  {
    title: "SERB · DST research reviewer",
    body: "Reviewer of research projects for the Science and Engineering Research Board, Department of Science & Technology, Government of India.",
  },
  {
    title: "Board of Studies member",
    body: "Curriculum design as a Board of Studies member at KNIT Sultanpur, VBS Purvanchal University Jaunpur, SRM University Barabanki and IET Faizabad.",
  },
  {
    title: "Fellow, Institution of Engineers (India)",
    body: "Elected Fellow (FIE) of the Institution of Engineers (India) in 2010.",
  },
  {
    title: "Journal reviewer",
    body: "Standing reviewer for DRDO, Sadhana (Indian Academy of Sciences) and other national research journals.",
  },
];

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
 * The Director's message.
 *
 * STATUS: drafted by the institute's communications workflow from his
 * career record, and pending his own sign-off before it is presented
 * anywhere as a verbatim personal statement. Do not syndicate to press
 * or social channels until the office confirms.
 */
export const DIRECTOR_MESSAGE: string[] = [
  "For thirty-eight years I taught engineering at IIT (BHU), Varanasi. In that time I learned something that took me by surprise, and that I have never since been able to unlearn: the students who travelled furthest were rarely the ones who arrived with the highest marks. They were the ones who were not afraid of the workshop — who would pick up a piece of steel, strike an arc, and find out for themselves what the metal would do.",
  "That is a large part of why I have come to BIPE.",
  "A diploma is not a smaller version of a degree. It is a different kind of education — closer to the machine, closer to the site, closer to the work itself. The engineer who can read a drawing and also cut, weld and assemble the thing it describes is exactly the engineer that every workshop, every railway yard and every construction site in this country is short of. I have spent my career on welding, casting and production — the oldest conversation there is between a person and a material — and I can tell you that this conversation is not learned from a screen. It is learned standing up, with your hands.",
  "Many of our students are the first in their family to study engineering. Some arrive quietly unsure whether they belong in an engineering institution at all. To them I want to say something plainly: you belong here. Your rank in an entrance examination measures one morning of your life. It does not measure your hands, your patience, or how far you are willing to go.",
  "To parents, I make a simpler promise. You are trusting us with three years of your child's life at the precise moment their future is decided. We will teach them properly. We will keep our workshops busy and our laboratories honest. And we will treat your child with the same seriousness I was expected to show every student who walked into my classroom at IIT (BHU).",
  "Come and see the campus. Ask us difficult questions. That is how good institutions are built — and that is the institution I have joined BIPE to help build.",
];

/** The line lifted into the full-bleed pull quote. */
export const DIRECTOR_QUOTE = {
  en: "The best engineers I taught were never the ones with the highest marks. They were the ones who were not afraid of the workshop.",
  /** The word rendered in accent colour inside the English quote. */
  highlight: "workshop",
  hi: "मैंने जिन सर्वश्रेष्ठ इंजीनियरों को पढ़ाया, वे सर्वाधिक अंक पाने वाले नहीं थे — वे वे थे जो कार्यशाला से नहीं डरते थे।",
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
