"use client";

import React, { useEffect, useRef, useState } from "react";

export function Counter({ to, duration = 1200, suffix = "" }: { to: string; duration?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const start = performance.now();
        const num = parseFloat(String(to).replace(/[^\d.]/g, "")) || 0;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setVal(Math.round(num * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  const hasComma = String(to).includes(",");
  const display = hasComma ? val.toLocaleString("en-IN") : String(val);
  return <span ref={ref}>{display}{suffix}</span>;
}
