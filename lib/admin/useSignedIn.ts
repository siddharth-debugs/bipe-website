"use client";

import { useSyncExternalStore } from "react";
import { Tokens } from "./api";

/**
 * Whether an access token is present, readable during render.
 *
 * The dashboard layout needs this before its effects run: it renders the
 * shell immediately rather than waiting on /auth/me/, so it has to know at
 * render time whether it is drawing for someone signed in or for someone
 * about to be bounced to the login screen.
 *
 * `Tokens.access()` reads localStorage, which does not exist on the server
 * and must not be read directly during render. useSyncExternalStore is the
 * sanctioned way in: getSnapshot may read external state, which is why this
 * form passes react-hooks/purity and the useState + useEffect pair it
 * replaces does not (see lib/useHydrated.ts for the same shape).
 *
 * getServerSnapshot returns true — optimistic on purpose. The server and the
 * hydration pass both assume a signed-in visitor and render the dashboard
 * chrome; the real answer lands immediately after hydration. Guessing the
 * other way would blank the shell on every load for the split second before
 * the token could be read, which is the exact stall this was meant to remove.
 * A visitor who is genuinely signed out sees the shell for that one frame and
 * is then redirected.
 *
 * No subscription: a token appearing or disappearing always comes with a
 * navigation (sign-in, sign-out, or the redirect on a rejected token), and
 * that re-renders anyway.
 */
const subscribe = () => () => {};
const getSnapshot = () => Tokens.access() !== null;
const getServerSnapshot = () => true;

export function useSignedIn(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
