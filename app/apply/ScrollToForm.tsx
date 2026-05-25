"use client";

import { useEffect } from "react";

export function ScrollToForm() {
  useEffect(() => {
    const el = document.getElementById("apply-form");
    if (!el) return;
    // Defer one frame so the form's dynamic chunk has hydrated and
    // its real height is measured before we scroll.
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);
  return null;
}
