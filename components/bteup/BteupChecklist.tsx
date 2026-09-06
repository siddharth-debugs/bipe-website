"use client";

import { useMemo, useState } from "react";
import { useHydrated } from "@/lib/useHydrated";

/**
 * Interactive checklist used inside BteupResourceTemplate.
 *
 * Why this exists:
 *   The original render used a decorative <span aria-hidden> with a 1.5px
 *   border that LOOKED like a checkbox but did nothing on tap. That's a
 *   false affordance — Praveen reported it as "drop down is not
 *   functioning" / boxes-don't-do-anything. Made real.
 *
 * State model:
 *   Checked state persists to localStorage keyed by `bipe.checklist.<slug>`.
 *   Value is { [itemText]: true }. Keyed by item TEXT rather than index so
 *   if we reorder items later, students who already checked things don't
 *   lose progress on the renamed positions.
 *
 * SSR safety:
 *   localStorage is only read in useEffect, so the initial render matches
 *   the server (no hydration mismatch). First paint shows all items
 *   unchecked; if there's persisted state, it hydrates on mount.
 *
 * Reset:
 *   Long-press / right-click on the heading isn't a thing we shipped.
 *   Students who want to start over can clear site data. Keeping the
 *   component surface minimal.
 */

export interface BteupChecklistProps {
  /** Storage key suffix — the BteupResource.slug for this page. */
  slug: string;
  /** Checklist item strings, in render order. */
  items: string[];
}

const STORAGE_PREFIX = "bipe.checklist.";

export default function BteupChecklist({ slug, items }: BteupChecklistProps) {
  const storageKey = STORAGE_PREFIX + slug;

  // Read the saved ticks once hydration has happened, rather than correcting
  // state from a mount effect (react-hooks/set-state-in-effect). Empty on the
  // server and on the first client paint, so the markup matches either way --
  // the same guarantee the effect gave, without the extra render pass.
  // Guarded against malformed JSON (which would happen if a future schema
  // change rewrites the shape).
  const hydrated = useHydrated();
  const stored = useMemo<Record<string, boolean>>(() => {
    if (!hydrated) return {};
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object"
        ? (parsed as Record<string, boolean>)
        : {};
    } catch {
      // Ignore malformed JSON; treat as empty.
      return {};
    }
  }, [hydrated, storageKey]);

  // Ticks made in this session take precedence over what was stored; null
  // means "nothing ticked yet here", so the stored set shows through.
  const [session, setSession] = useState<Record<string, boolean> | null>(null);

  // A different checklist means a different saved set: drop this session's
  // ticks so they cannot leak across slugs, as the keyed effect used to.
  const [lastKey, setLastKey] = useState(storageKey);
  if (storageKey !== lastKey) {
    setLastKey(storageKey);
    setSession(null);
  }

  const checked = session ?? stored;

  function toggle(item: string) {
    const next = { ...checked, [item]: !checked[item] };
    setSession(next);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // Quota-exceeded or private-mode -- silently degrade to in-memory.
    }
  }

  return (
    <ul
      style={{
        marginTop: 32,
        display: "grid",
        gap: 10,
        maxWidth: "78ch",
        listStyle: "none",
        padding: 0,
      }}
    >
      {items.map((item) => {
        const isChecked = !!checked[item];
        return (
          <li
            key={item}
            style={{
              padding: 0,
              background: "var(--paper)",
              border: "1px solid var(--line)",
              borderRadius: 12,
            }}
          >
            <label
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 14,
                padding: "14px 18px",
                alignItems: "start",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggle(item)}
                style={{
                  width: 18,
                  height: 18,
                  marginTop: 2,
                  accentColor: "var(--brand)",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  color: isChecked ? "var(--ink-3)" : "var(--ink-2)",
                  fontSize: 14.5,
                  lineHeight: 1.6,
                  textDecoration: isChecked ? "line-through" : "none",
                  transition: "color 120ms ease, text-decoration-color 120ms ease",
                }}
              >
                {item}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
