/**
 * Admission-cycle status — one source for every "which session?" string
 * the visitor-facing surfaces show.
 *
 * WHY THIS EXISTS (7 Sep 2026)
 * ---------------------------
 * The "2026-27 is closed, enquire for 2027-28" message was written by hand
 * on /apply, /jeecup, /lp/jeecup, /contact's FAQ, /admission-from-bihar and
 * the blog CTAs — but was missing entirely from the four surfaces that
 * actually capture leads: the homepage inline form, /contact, /visit and the
 * WhatsApp FAB. A visitor could fill in the homepage form under a button
 * reading "Apply now" and never be told the session had closed.
 *
 * Rather than hand-write the sentence a fifth time, every lead surface now
 * reads from here. When JEECUP 2027 opens, change the three constants at the
 * top and every form, bar and success message follows.
 *
 * WHAT TO CHANGE WHEN THE CYCLE ROLLS
 * -----------------------------------
 *   CLOSED_SESSION  → "2027-28"      (the session that just filled)
 *   OPEN_SESSION    → "2028-29"      (the one taking enquiries)
 *   ENTRANCE_EXAM   → "JEECUP 2028"
 *
 * And set SEASON_IS_CLOSED to false during the months when counselling is
 * live — that hides the bar and swaps the form notice for the open-cycle
 * line, so the site never tells an applicant a live cycle is shut.
 *
 * NOT YET WIRED THROUGH HERE — deliberate, flagged rather than silently
 * expanded: app/(site)/llms.txt/route.ts, the /apply and /jeecup page copy,
 * and the blog CTA blocks all still carry their own hand-written version of
 * this sentence. They are correct today. Folding them in is a follow-up.
 */

/** The session with no seats left. */
export const CLOSED_SESSION = "2026-27";

/** The session enquiries are being taken for. */
export const OPEN_SESSION = "2027-28";

/** The entrance route into OPEN_SESSION. */
export const ENTRANCE_EXAM = "JEECUP 2027";

/**
 * False while counselling is live and BIPE can actually admit. Flip it
 * rather than deleting the bar — the copy below switches with it.
 */
export const SEASON_IS_CLOSED = true;

/* ── Site-wide status bar (above the nav) ───────────────────────────── */

/** Left half — the fact. */
export const SEASON_BAR_STATUS = `Session ${CLOSED_SESSION} admission is closed`;

/** Right half — what the visitor can still do. */
export const SEASON_BAR_ACTION = `Enquiries open for ${OPEN_SESSION} via ${ENTRANCE_EXAM}`;

/* ── Inside every lead form, above the fields ───────────────────────── */

/**
 * The notice that sits above the first field. Deliberately states the
 * closure before the invitation: a parent skim-reading should hit the
 * constraint first, not after they have typed a phone number.
 */
export const FORM_SEASON_NOTICE = SEASON_IS_CLOSED
  ? `Admission for session ${CLOSED_SESSION} is closed. This enquiry is for the next session, ${OPEN_SESSION}, through ${ENTRANCE_EXAM}.`
  : `Enquiries are open for session ${OPEN_SESSION} through ${ENTRANCE_EXAM}.`;

/** Short form, for tight spaces like the WhatsApp panel subtitle. */
export const FORM_SEASON_NOTICE_SHORT = SEASON_IS_CLOSED
  ? `${CLOSED_SESSION} closed · enquiries for ${OPEN_SESSION}`
  : `Enquiries open · ${OPEN_SESSION}`;

/* ── After the form is submitted ────────────────────────────────────── */

/**
 * Appended to every success message. The confirmation is the last thing a
 * visitor reads before they leave, and until now it said only "we'll call
 * you within 24 hours" — which reads as a callback about admission *now*.
 */
export const SUCCESS_SEASON_NOTE = SEASON_IS_CLOSED
  ? `The call is about session ${OPEN_SESSION} — session ${CLOSED_SESSION} is closed.`
  : `The call is about session ${OPEN_SESSION}.`;

/* ── Consent lines ──────────────────────────────────────────────────── */

/**
 * What the visitor is consenting to be contacted about. The /visit form
 * previously named "2026-27 admissions" here — the closed session — in the
 * small print people tick without reading.
 */
export const CONSENT_SESSION = `${OPEN_SESSION} admissions`;
