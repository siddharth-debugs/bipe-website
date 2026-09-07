"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  CLOSED_SESSION,
  OPEN_SESSION,
  SEASON_BAR_STATUS,
  SEASON_BAR_ACTION,
  SEASON_IS_CLOSED,
} from "@/lib/admissionSeason";

/**
 * Site-wide admission-cycle status bar.
 *
 * Sits above <Nav> in ConditionalChrome, so it is the first thing on every
 * public page including the blog. Not on /admin, and not on /lp/* — the ad
 * landing pages run chrome-free and carry the season line in their own copy.
 *
 * WHY IT IS HERE (7 Sep 2026)
 * ---------------------------
 * The homepage used to carry JeecupCounsellingBanner, which announced each
 * counselling round and then hid itself after Round 5 on 16 August. It did
 * its job and switched off — but nothing replaced it, so from mid-August the
 * top of the site said nothing about the cycle at all. The first explicit
 * "2026-27 is closed" on the homepage sat 26% down the page, below the hero,
 * the Director's news and the stat tiles.
 *
 * That banner is round-driven and 2026-specific. This one is season-driven
 * and reads from lib/admissionSeason.ts, so it survives the cycle roll.
 *
 * DISMISSAL
 * ---------
 * Remembered per browser, keyed on the session pair, so the bar returns by
 * itself when the cycle rolls rather than staying dismissed forever.
 *
 * localStorage is an external system, so it is read through
 * useSyncExternalStore rather than a useState + useEffect pair — the same
 * reasoning as lib/useNow.ts, and what react-hooks/set-state-in-effect
 * requires. getServerSnapshot() returns false so the server render and the
 * hydration pass agree that the bar is visible; a visitor who dismissed it
 * earlier sees it corrected away immediately after hydration.
 *
 * Dismissing the bar does not hide the message: every lead form carries
 * FORM_SEASON_NOTICE above its first field regardless.
 */

const DISMISS_KEY = `bipe.seasonBar.${CLOSED_SESSION}-${OPEN_SESSION}`;

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  // Cross-tab: dismissing in one tab settles the others too.
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot(): boolean {
  try {
    return window.localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    // Private mode / blocked storage — show the bar. Failing open is
    // correct here: the message matters more than the preference.
    return false;
  }
}

/** Server and hydration both see "not dismissed", so the markup matches. */
function getServerSnapshot(): boolean {
  return false;
}

function persistDismissal() {
  try {
    window.localStorage.setItem(DISMISS_KEY, "1");
  } catch {
    // Nothing to do — the bar reappears next visit.
  }
  // `storage` does not fire in the tab that wrote it, so notify directly.
  listeners.forEach((cb) => cb());
}

export function AdmissionSeasonBar() {
  const dismissed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (!SEASON_IS_CLOSED || dismissed) return null;

  return (
    <aside className="season-bar" aria-label="Admission cycle status">
      <div className="season-bar-inner">
        <p className="season-bar-text">
          <span className="season-bar-status">{SEASON_BAR_STATUS}</span>
          <span className="season-bar-sep" aria-hidden="true">
            ·
          </span>
          <span className="season-bar-action">{SEASON_BAR_ACTION}</span>
        </p>
        <Link href="/apply" className="season-bar-cta">
          Enquire for {OPEN_SESSION}
        </Link>
        <button
          type="button"
          onClick={persistDismissal}
          className="season-bar-close"
          aria-label="Dismiss admission cycle notice"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M3.5 3.5l7 7M10.5 3.5l-7 7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </aside>
  );
}
