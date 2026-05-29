/**
 * Press clippings from regional and national Hindi dailies covering
 * BIPE Phoolpur (Banaras Institute of Polytechnic & Engineering).
 *
 * Curated subset (6 of 23) of physical clippings the institute has
 * collected since 2020. Originals are scans from print editions —
 * uploaded by info@bipe.ac.in to the institute's Drive in
 * May 2026 and pulled into /public/press/ in this commit.
 *
 * Used by components/about/PressMentions.tsx to render an "In the
 * press" section on /about as a third-party trust signal. The May
 * 2026 SEO audit flagged the absence of external coverage as a
 * credibility gap — these clippings address it directly without
 * fabricating anything.
 *
 * Add new entries here as more clippings come in. Keep the ID stable
 * (used by React `key`) and prefer ISO dates so sorting is trivial.
 */
export interface PressMention {
  /** Stable slug — used as React key and (later) URL anchor. */
  id: string;
  /** Newspaper name as printed in its masthead. */
  publication: string;
  /**
   * "national" for Hindustan / Amar Ujala (top-5 Hindi dailies by
   * circulation); "regional" for UP / Varanasi-area papers.
   */
  scope: "national" | "regional";
  /** ISO date — when the clipping was published in print. */
  dateISO: string;
  /** Human label — "25 February 2020" — what readers see. */
  dateLabel: string;
  /** English translation of the headline (for screen readers + alt). */
  headlineEn: string;
  /** Original Hindi headline (for the chip below the image). */
  headlineHi: string;
  /** One-line English summary; what the article actually reports. */
  summary: string;
  /** Path to the scanned clipping under /public/. */
  src: string;
}

export const PRESS_MENTIONS: PressMention[] = [
  {
    id: "hindustan-spardha-2020-02-25",
    publication: "Hindustan",
    scope: "national",
    dateISO: "2020-02-25",
    dateLabel: "25 February 2020",
    headlineEn: "Spardha begins at Banaras Institute",
    headlineHi: "बनारस इंस्टीट्यूट में 'स्पर्धा' का आरंभ",
    summary:
      "Coverage of the Spardha 2020 sports-meet launch at BIPE Phoolpur, with Arjun Award winner Bahadur Prasad as chief guest and a photo of the trophy handover.",
    src: "/press/hindustan-spardha-launch-2020-02-25.jpg",
  },
  {
    id: "amarujala-kabaddi-2020-02-26",
    publication: "Amar Ujala",
    scope: "national",
    dateISO: "2020-02-26",
    dateLabel: "26 February 2020",
    headlineEn: "Kabaddi: Red House defeats Yellow House",
    headlineHi: "कबड्डी : रेड ने यलो हाउस को किया पराजित",
    summary:
      "Match-by-match recap of Spardha 2020 — cricket, volleyball, kabaddi, javelin and 100/200 metre sprints — including an action photo of the kabaddi final.",
    src: "/press/amarujala-kabaddi-2020-02-26.jpg",
  },
  {
    id: "aaj-spardha-awards-2020-03-08",
    publication: "Aaj",
    scope: "regional",
    dateISO: "2020-03-08",
    dateLabel: "8 March 2020",
    headlineEn: "Spardha winners awarded",
    headlineHi: "स्पर्धा के विजेताओं को किया गया पुरस्कृत",
    summary:
      "Closing-ceremony report from Spardha 2020 — Blue House (Electrical) as best team, Yellow House (Mechanical Automobile) as best athlete, with trophy-presentation photograph.",
    src: "/press/aaj-spardha-awards-2020-03-08.jpg",
  },
  {
    id: "gandiv-technofest-2020-03-07",
    publication: "Gandiv",
    scope: "regional",
    dateISO: "2020-03-07",
    dateLabel: "7 March 2020",
    headlineEn:
      "Future engineers and technicians display their talent at Technofest 2020",
    headlineHi:
      "टेक्नोफेस्ट-2020 में भावी इंजीनियरों एवं तकनीशियनों ने दिखायी अपनी प्रतिभा",
    summary:
      "Gandiv's coverage of Technofest 2020 at BIPE Phoolpur — student project demonstrations on the theme 'Recognise your talent, power the future', with a photo of officials examining a working model.",
    src: "/press/gandiv-technofest-2020-03-07.jpg",
  },
  {
    id: "janmukh-technofest-2020-03-07",
    publication: "Janmukh",
    scope: "regional",
    dateISO: "2020-03-07",
    dateLabel: "7 March 2020",
    headlineEn:
      "Engineers and technicians showcase talent at Technofest 2020",
    headlineHi:
      "‘टेक्नोफेस्ट 2020’ में भावी इंजीनियरों एवं तकनीशियनों ने दिखाई अपनी प्रतिभा",
    summary:
      "Janmukh's report on Technofest 2020 covering NRG, civil, mechanical, woodcraft and mixed-discipline student projects, with chief guest S.K. Sachdev (UPCB Yuko Bank) and Banaras Group Institutions chair Dr Chandrika Roy.",
    src: "/press/janmukh-technofest-2020-03-07.jpg",
  },
  {
    id: "jansandesh-hfcl-placement-2020-10-09",
    publication: "Jansandesh Times",
    scope: "regional",
    dateISO: "2020-10-09",
    dateLabel: "9 October 2020",
    headlineEn: "Online campus selection at BIPE — HFCL recruits students",
    headlineHi: "बीआईपी में आन लाइन कैम्पस सेलेक्शन",
    summary:
      "HFCL Hyderabad's online recruitment drive at BIPE Phoolpur during the COVID-era — 9 final-year Electrical Engineering students selected after a written test and HR interview.",
    src: "/press/jansandesh-hfcl-placement-2020-10-09.jpg",
  },
];
