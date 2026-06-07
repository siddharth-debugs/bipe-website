"use client";

import { useState, useEffect } from "react";

/**
 * NavSearchButton — visible affordance in the navbar that opens the ⌘K
 * palette. Imported by Nav.tsx so the keyboard shortcut isn't the only
 * discovery path (and mobile users have a tap target).
 *
 * Uses a custom DOM event instead of a shared context to avoid having to
 * wrap the app in another Provider just to communicate "open me".
 *
 * Lives in its own file (split out of CommandK.tsx, Jun 2026) so that the
 * heavy ⌘K palette can be lazy-loaded via next/dynamic in
 * ConditionalChrome WITHOUT this small, always-rendered button dragging
 * the palette's code back into the initial bundle. It carries its own
 * copy of the tiny SearchIcon for the same reason — a shared icon module
 * would re-couple the two and undo the code-split.
 */
function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, color: "var(--ink-3)" }}
    >
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M14 14L18 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NavSearchButton() {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(
      typeof navigator !== "undefined" &&
        /Mac|iPhone|iPod|iPad/i.test(navigator.platform || navigator.userAgent),
    );
  }, []);

  const open = () => {
    window.dispatchEvent(new CustomEvent("bipe:cmdk-open"));
  };

  return (
    <button
      type="button"
      onClick={open}
      className="nav-search-btn"
      aria-label="Search BIPE site (Command-K)"
      title="Search · ⌘K"
    >
      <SearchIcon />
      <span className="nav-search-btn-label">Search</span>
      <span className="nav-search-btn-kbd" aria-hidden="true">
        <kbd>{isMac ? "⌘" : "Ctrl"}</kbd>
        <kbd>K</kbd>
      </span>
    </button>
  );
}
