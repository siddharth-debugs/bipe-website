"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tokens } from "@/lib/admin/api";

/**
 * Manual refresh trigger for /admin/dashboard/seo.
 *
 * POSTs to /api/seo/refresh with the admin's JWT (read from localStorage
 * via Tokens.access — same pattern the rest of the admin shell uses).
 * On success: revalidatePath triggers a server-side refetch of the
 * dashboard, then router.refresh() pulls the new HTML.
 *
 * On failure: shows the message inline below the button, doesn't reload.
 * The dashboard's static fallback (SEO_SNAPSHOT in lib/seo-snapshot.ts)
 * keeps the page useful even if Semrush is down.
 */
export function SeoRefreshButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setPending(true);
    setError(null);
    try {
      const token = Tokens.access();
      if (!token) {
        setError("Not signed in — refresh page and re-login.");
        setPending(false);
        return;
      }
      const res = await fetch("/api/seo/refresh", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        setError(j.error ?? `HTTP ${res.status}`);
        setPending(false);
        return;
      }
      // Cache invalidated server-side. Force the App Router to refetch
      // the page's server component, which will re-call Semrush.
      router.refresh();
      // Keep the spinner up for a beat so the user sees something
      // changed before router.refresh resolves.
      setTimeout(() => setPending(false), 400);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
      setPending(false);
    }
  }

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: pending ? "var(--ink-3)" : "var(--paper)",
          background: pending ? "var(--paper-2)" : "var(--brand)",
          border: "1px solid var(--brand)",
          borderRadius: 8,
          padding: "8px 14px",
          cursor: pending ? "wait" : "pointer",
          transition: "background 0.15s",
        }}
      >
        {pending ? "Refreshing…" : "↻ Refresh from Semrush"}
      </button>
      {error && (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "#dc2626",
            maxWidth: 240,
            textAlign: "right",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
