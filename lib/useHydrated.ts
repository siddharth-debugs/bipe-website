"use client";

import { useSyncExternalStore } from "react";

/**
 * False on the server and through hydration, true once mounted on the client.
 *
 * For values that only exist in the browser -- `navigator`, matchMedia, and
 * the like -- read as:
 *
 *     const hydrated = useHydrated();
 *     const isMac = hydrated && /Mac/i.test(navigator.userAgent);
 *
 * This replaces the useState(false) + useEffect(() => setState(true)) pair,
 * which react-hooks/set-state-in-effect flags because it costs a second
 * render pass on every mount. getServerSnapshot() backs both the server
 * render and the hydration pass, so the two agree on false by construction
 * and the browser-only value lands strictly afterwards -- the same hydration
 * guarantee the effect version was reaching for, without the extra pass.
 */
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
