"use client";

import { useSyncExternalStore } from "react";

/**
 * The wall clock, as an external store.
 *
 * Returns `null` on the server and through hydration, then the live time
 * once the component has mounted on the client. Components that need to
 * agree with the server on first paint and only then correct themselves
 * against the real clock read it as:
 *
 *     const now = useNow();
 *     const round = now === null ? serverValue : roundAt(now);
 *
 * Why this rather than the useState + useEffect pair it replaces: the clock
 * is an external system, so useSyncExternalStore is the API React provides
 * for reading one. That buys three things at once —
 *
 *   - no setState in an effect body, which react-hooks/set-state-in-effect
 *     flags because it causes a second render pass after every mount;
 *   - no Date.now() during render, which is impure (react-hooks/purity):
 *     the store owns the clock read and the component only reads a snapshot;
 *   - no hydration mismatch, because getServerSnapshot() is what React uses
 *     for both the server render and the hydration pass, so both sides
 *     agree on `null` and the correction lands strictly afterwards.
 *
 * Pass a tick interval in milliseconds for a live counter (`useNow(1000)`);
 * the default of 0 resolves the clock once on mount and never ticks. Stores
 * are shared per interval, so ten 1s counters cost one timer between them,
 * and the timer is cleared once the last subscriber unmounts.
 */
type Clock = {
  now: number | null;
  listeners: Set<() => void>;
  timer: ReturnType<typeof setInterval> | null;
  subscribe: (cb: () => void) => () => void;
  getSnapshot: () => number | null;
};

const clocks = new Map<number, Clock>();

function clockFor(tickMs: number): Clock {
  const existing = clocks.get(tickMs);
  if (existing) return existing;

  const clock: Clock = {
    now: null,
    listeners: new Set(),
    timer: null,
    subscribe: (cb) => {
      clock.listeners.add(cb);
      // First subscriber resolves the clock. React re-reads the snapshot
      // after subscribing, so this is picked up without an extra nudge.
      if (clock.now === null) clock.now = Date.now();
      if (tickMs > 0 && clock.timer === null) {
        clock.timer = setInterval(() => {
          clock.now = Date.now();
          for (const listener of clock.listeners) listener();
        }, tickMs);
      }
      return () => {
        clock.listeners.delete(cb);
        if (clock.listeners.size === 0 && clock.timer !== null) {
          clearInterval(clock.timer);
          clock.timer = null;
        }
      };
    },
    getSnapshot: () => clock.now,
  };
  clocks.set(tickMs, clock);
  return clock;
}

/** Always null: the server has no client clock to report. */
const getServerSnapshot = () => null;

export function useNow(tickMs = 0): number | null {
  const clock = clockFor(tickMs);
  return useSyncExternalStore(clock.subscribe, clock.getSnapshot, getServerSnapshot);
}
