"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BLOG_POSTS } from "@/lib/blogPosts";
import { ROUTES, type RouteKey } from "@/lib/routes";

/**
 * Command-K / Ctrl-K palette · site-wide fuzzy navigation
 *
 * Triggers:
 *   - Cmd+K (Mac) / Ctrl+K (Win/Linux)        keyboard shortcut
 *   - window.dispatchEvent(new CustomEvent('bipe:cmdk-open'))
 *                                              Nav search button uses this
 *
 * Search corpus (~110 entries · all client-side, no backend):
 *   - All ROUTES from lib/routes.ts            page title + description
 *   - All BLOG_POSTS from lib/blogPosts.ts     post title + excerpt + category
 *
 * Why a global palette (vs. just the /search page):
 *   - Power users navigate faster — Cmd+K is universal muscle memory
 *     (GitHub, Linear, Vercel, Notion, Stripe all use it)
 *   - Mobile users tap the search button in Nav; same palette opens
 *   - The existing /search page stays as the deep-link / shareable
 *     search surface (also keeps SearchAction schema valid)
 *
 * Implementation notes:
 *   - Lightweight substring match — no fuzzy lib, no scoring. At ~110
 *     entries this is faster and more predictable than fuzzy.
 *   - Body scroll lock when open; restored on close
 *   - Keyboard: ↑↓ navigate · ↵ select · ESC close
 *   - Click backdrop to close
 *   - Empty query shows curated Quick Links so the palette is useful
 *     before typing — these are derived from ROUTES entries that opt in
 *     via `quickLink: { label, hint, priority }` in lib/routes.ts
 */

type PageResult = {
  kind: "page";
  key: RouteKey;
  path: string;
  title: string;
  description: string;
};
type PostResult = {
  kind: "post";
  slug: string;
  title: string;
  excerpt: string;
  category: string;
};
type Result = PageResult | PostResult;

type QuickLink = {
  label: string;
  path: string;
  hint: string;
};

/**
 * Curated empty-state shortcuts, derived from ROUTES (lib/routes.ts).
 *
 * Single source of truth: any route can opt in by adding a `quickLink`
 * block ({ label, hint, priority }). That keeps palette copy, route
 * paths and SEO metadata co-located — when a route moves or its label
 * changes, the palette tracks it automatically.
 *
 * Ordering is by `priority` ascending; ties resolved by ROUTES key order.
 */
const QUICK_LINKS: QuickLink[] = (
  Object.values(ROUTES) as Array<(typeof ROUTES)[RouteKey]>
)
  .filter(
    (r): r is typeof r & { quickLink: NonNullable<typeof r.quickLink> } =>
      !!r.quickLink,
  )
  .sort((a, b) => a.quickLink.priority - b.quickLink.priority)
  .map((r) => ({ label: r.quickLink.label, path: r.path, hint: r.quickLink.hint }));

export function CommandK() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMac, setIsMac] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Detect platform once on mount — purely cosmetic (shows ⌘K vs Ctrl+K
  // in the affordance pill). The keyboard listener accepts both.
  useEffect(() => {
    setIsMac(
      typeof navigator !== "undefined" &&
        /Mac|iPhone|iPod|iPad/i.test(navigator.platform || navigator.userAgent),
    );
  }, []);

  // Global open/close hotkey + custom-event opener for the Nav button.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("bipe:cmdk-open", onOpenEvent as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("bipe:cmdk-open", onOpenEvent as EventListener);
    };
  }, []);

  // When open, lock body scroll, reset state, focus the input.
  useEffect(() => {
    if (open) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setQ("");
      setSelectedIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [open]);

  const trimmed = q.trim();

  const results = useMemo<Result[]>(() => {
    if (trimmed.length < 2) return [];
    const lower = trimmed.toLowerCase();
    const hits = (s: string) => s.toLowerCase().includes(lower);

    const pages: PageResult[] = (
      Object.entries(ROUTES) as Array<[RouteKey, (typeof ROUTES)[RouteKey]]>
    )
      .filter(([, r]) => hits(r.title) || hits(r.description))
      .slice(0, 12)
      .map(([key, r]) => ({
        kind: "page",
        key,
        path: r.path,
        title: r.title,
        description: r.description,
      }));

    const posts: PostResult[] = BLOG_POSTS.filter(
      (p) => hits(p.title) || hits(p.excerpt) || hits(p.category),
    )
      .slice(0, 6)
      .map((p) => ({
        kind: "post",
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        category: p.category,
      }));

    return [...pages, ...posts];
  }, [trimmed]);

  // Reset selection whenever the query changes.
  useEffect(() => {
    setSelectedIndex(0);
  }, [trimmed]);

  // Combined list for keyboard navigation (Quick Links when empty,
  // search results otherwise).
  const displayItems: Array<Result | QuickLink> =
    trimmed.length < 2 ? QUICK_LINKS : results;

  const go = useCallback(
    (item: Result | QuickLink) => {
      const path =
        "path" in item ? item.path : `/blog/${(item as PostResult).slug}`;
      router.push(path);
      setOpen(false);
    },
    [router],
  );

  // Arrow navigation + Enter to select. Listener is scoped to the
  // window so it works regardless of where focus is, as long as the
  // palette is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(displayItems.length - 1, i + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = displayItems[selectedIndex];
        if (item) go(item);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, displayItems, selectedIndex, go]);

  // Auto-scroll the selected item into view as the user arrow-keys
  // through a long result list.
  useEffect(() => {
    if (!listRef.current) return;
    const selectedEl = listRef.current.querySelector<HTMLElement>(
      `[data-cmdk-index="${selectedIndex}"]`,
    );
    selectedEl?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedIndex]);

  if (!open) return null;

  return (
    <div
      className="cmdk-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="BIPE site search"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="cmdk-panel" onClick={(e) => e.stopPropagation()}>
        {/* Input row */}
        <div className="cmdk-input-row">
          <SearchIcon />
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search BIPE — pages, blog posts, JEECUP guides…"
            className="cmdk-input"
            aria-label="Search query"
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
          />
          <kbd className="cmdk-esc">ESC</kbd>
        </div>

        {/* Results list */}
        <div className="cmdk-results" ref={listRef}>
          {trimmed.length < 2 && (
            <>
              <div className="cmdk-section-label">Quick links</div>
              {QUICK_LINKS.map((item, i) => (
                <button
                  key={item.path}
                  data-cmdk-index={i}
                  type="button"
                  onClick={() => go(item)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={
                    "cmdk-result" + (selectedIndex === i ? " selected" : "")
                  }
                >
                  <span className="cmdk-result-title">{item.label}</span>
                  <span className="cmdk-result-sub">{item.hint}</span>
                </button>
              ))}
            </>
          )}

          {trimmed.length >= 2 && results.length === 0 && (
            <div className="cmdk-empty">
              No results for <strong>&ldquo;{trimmed}&rdquo;</strong>
              <br />
              <span className="cmdk-empty-hint">
                Try &ldquo;fees&rdquo;, &ldquo;JEECUP&rdquo;, &ldquo;dairy&rdquo;
                or &ldquo;hostel&rdquo;.
              </span>
            </div>
          )}

          {trimmed.length >= 2 &&
            results.length > 0 &&
            results.map((r, i) => (
              <button
                key={r.kind === "page" ? r.path : r.slug}
                data-cmdk-index={i}
                type="button"
                onClick={() => go(r)}
                onMouseEnter={() => setSelectedIndex(i)}
                className={
                  "cmdk-result" + (selectedIndex === i ? " selected" : "")
                }
              >
                {r.kind === "page" ? (
                  <>
                    <span className="cmdk-result-title">{r.title}</span>
                    <span className="cmdk-result-sub">{r.path}</span>
                  </>
                ) : (
                  <>
                    <span className="cmdk-result-row">
                      <span className="cmdk-result-pill">{r.category}</span>
                      <span className="cmdk-result-title">{r.title}</span>
                    </span>
                    <span className="cmdk-result-sub">
                      Blog · /blog/{r.slug}
                    </span>
                  </>
                )}
              </button>
            ))}
        </div>

        {/* Footer hints */}
        <div className="cmdk-footer">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>
            <kbd>{isMac ? "⌘" : "Ctrl"}</kbd>
            <kbd>K</kbd> toggle
          </span>
          <span>
            <kbd>ESC</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}

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

/**
 * NavSearchButton — visible affordance in the navbar that opens the
 * palette. Imported by Nav.tsx so the keyboard shortcut isn't the
 * only discovery path (and mobile users have a tap target).
 *
 * Uses a custom DOM event instead of a shared context to avoid having
 * to wrap the app in another Provider just to communicate "open me".
 */
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
