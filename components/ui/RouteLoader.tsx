"use client";

import React from "react";
import { usePathname } from "next/navigation";

const MIN_VISIBLE_MS = 380;
const MAX_VISIBLE_MS = 8000;

/**
 * Global route-transition loader.
 *
 * Behaviour:
 *  - Shown when the user clicks an internal-route anchor (any descendant of
 *    document; covers next/link since it renders to <a>).
 *  - Skips: external schemes, hash links, modifier-key clicks, target=_blank,
 *    same-pathname clicks, and clicks already prevented by other handlers.
 *  - Hides shortly after `usePathname()` reports the new path. Stays visible
 *    for at least MIN_VISIBLE_MS so the brand mark registers. Auto-aborts
 *    after MAX_VISIBLE_MS as a failsafe.
 *  - Closes immediately if the user hits Escape.
 */
export function RouteLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = React.useState(false);
  const startedAtRef = React.useRef<number>(0);
  const failsafeRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPathRef = React.useRef<string | null>(pathname);

  const begin = React.useCallback(() => {
    startedAtRef.current = Date.now();
    setVisible(true);
    if (failsafeRef.current) clearTimeout(failsafeRef.current);
    failsafeRef.current = setTimeout(() => setVisible(false), MAX_VISIBLE_MS);
  }, []);

  const end = React.useCallback(() => {
    const elapsed = Date.now() - startedAtRef.current;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
    setTimeout(() => setVisible(false), remaining);
    if (failsafeRef.current) {
      clearTimeout(failsafeRef.current);
      failsafeRef.current = null;
    }
  }, []);

  // Intercept internal-link clicks at document level.
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const path = e.composedPath ? e.composedPath() : [];
      const link = (path.find((n) => n instanceof HTMLAnchorElement) as HTMLAnchorElement | undefined)
        ?? (e.target instanceof Element ? e.target.closest("a") : null);
      if (!link) return;

      const target = link.getAttribute("target");
      if (target && target !== "_self") return;

      const href = link.getAttribute("href");
      if (!href) return;
      if (/^(https?:|mailto:|tel:|#|javascript:)/i.test(href)) return;

      try {
        const url = new URL(link.href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname && url.search === window.location.search) return;
        begin();
      } catch {
        /* ignore malformed hrefs */
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [begin]);

  // Pathname changed → end the loader.
  React.useEffect(() => {
    if (lastPathRef.current !== pathname) {
      lastPathRef.current = pathname;
      if (visible) end();
    }
  }, [pathname, visible, end]);

  // Escape closes immediately.
  React.useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVisible(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  // Cleanup failsafe on unmount.
  React.useEffect(() => () => {
    if (failsafeRef.current) clearTimeout(failsafeRef.current);
  }, []);

  return (
    <div
      className={"bipe-loader" + (visible ? " is-on" : "")}
      role="status"
      aria-live="polite"
      aria-busy={visible}
      aria-hidden={!visible}
    >
      <div className="bipe-loader-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bipe-logo.svg"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="bipe-loader-logo"
          style={{ height: 132, width: "auto", display: "block" }}
        />
        <div className="bipe-loader-track">
          <div className="bipe-loader-bar" />
        </div>
        <div className="bipe-loader-eyebrow">
          BIPE<span style={{ color: "var(--accent)", margin: "0 6px" }}>·</span>Loading
        </div>
      </div>
    </div>
  );
}
