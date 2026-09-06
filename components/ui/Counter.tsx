"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Count-up stat number.
 *
 * SSR CORRECTNESS (fixed 3 Sep 2026 — do not reintroduce `useState(0)`):
 * this used to initialise at 0 and only compute the real figure inside an
 * IntersectionObserver in useEffect, so the server-rendered HTML shipped a
 * literal "0" for every stat. Anything that reads HTML without running JS
 * — Googlebot's text pass, LLM crawlers (GPTBot, ClaudeBot, PerplexityBot),
 * "view source", no-JS browsers — saw `/campus` as "0 Acres · 0 Books ·
 * 0 Mbps internet · 0 Faculty", silently undoing the very figures the
 * content audit had just corrected. Same component runs on /approvals and
 * /admission.
 *
 * The fix: seed state with the parsed target so the server (and the first
 * client paint) carry the real number, then rewind to 0 in an effect and
 * animate up. The rewind happens after hydration, so a crawler never sees
 * it, and a below-the-fold tile is never visible at its final value before
 * the animation starts. Above-the-fold tiles fire the observer immediately,
 * so the count-up looks exactly as it did before.
 *
 * Reduced-motion users keep the seeded final value and skip the animation
 * entirely — correct number, no movement.
 */

/** Digits only: "8,428" → 8428, "₹30,150" → 30150, "100" → 100. */
function parseTarget(to: string): number {
  return parseFloat(String(to).replace(/[^\d.]/g, "")) || 0;
}

export function Counter({ to, duration = 1200, suffix = "" }: { to: string; duration?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  // Seeded with the real value — this is what SSR emits. See header.
  const [val, setVal] = useState(() => parseTarget(to));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Honour prefers-reduced-motion: keep the seeded final value, no
    // animation, no rewind.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const num = parseTarget(to);
    // Rewind to 0 only now — after hydration, so the server HTML and the
    // pre-hydration paint both kept the real number.
    //
    // This one setState genuinely belongs in the effect body, so it is
    // suppressed rather than moved. Its timing is the entire point: it has
    // to land after hydration (or SSR would emit 0 and the real number would
    // never be in the markup) but before the element scrolls into view (or
    // the viewer sees the number drop from its real value to 0 and count
    // back up). Deriving it during render would put 0 in the server HTML;
    // dropping it would move the rewind to the moment of intersection, which
    // is exactly when it is visible.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVal(0);

    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setVal(Math.round(num * eased));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      // Leave the number at its final value if this unmounts mid-animation
      // (route change), so nothing is left reading 0.
      setVal(num);
    };
  }, [to, duration]);

  const hasComma = String(to).includes(",");
  const display = hasComma ? val.toLocaleString("en-IN") : String(val);
  return <span ref={ref}>{display}{suffix}</span>;
}
