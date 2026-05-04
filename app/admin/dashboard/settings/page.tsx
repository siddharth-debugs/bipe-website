"use client";

import { useEffect, useState } from "react";
import { api, type Me, API_BASE_URL } from "@/lib/admin/api";
import { formatDate } from "@/lib/admin/utils";

export default function SettingsPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api<Me>("/auth/me/").then(setMe).catch((e) => setErr(e?.message ?? "Could not load."));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <header
        style={{
          display: "flex",
          alignItems: "end",
          justifyContent: "space-between",
          paddingBottom: 18,
          borderBottom: "1px solid var(--line)",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <div>
          <div className="eyebrow">§ Settings</div>
          <h1 className="admin-h1" style={{ marginTop: 8 }}>
            Account &amp; environment
          </h1>
        </div>
      </header>

      {err && <div className="card" style={{ padding: 14, color: "var(--danger)" }}>{err}</div>}

      <div className="card" style={{ padding: 22 }}>
        <h2 className="admin-h2">Signed-in user</h2>
        <dl
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            rowGap: 10,
            columnGap: 18,
            marginTop: 14,
            fontSize: 13.5,
          }}
        >
          {me ? (
            <>
              <dt className="eyebrow">Username</dt>
              <dd>{me.username}</dd>

              <dt className="eyebrow">Email</dt>
              <dd>{me.email || "—"}</dd>

              <dt className="eyebrow">Name</dt>
              <dd>{[me.first_name, me.last_name].filter(Boolean).join(" ") || "—"}</dd>

              <dt className="eyebrow">Roles</dt>
              <dd style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {me.is_superuser && <span className="admin-pill admin-pill-brand">Superuser</span>}
                {me.is_staff && <span className="admin-pill admin-pill-accent">Staff</span>}
              </dd>

              <dt className="eyebrow">Last login</dt>
              <dd style={{ fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}>
                {formatDate(me.last_login)}
              </dd>
            </>
          ) : (
            <span style={{ color: "var(--ink-3)" }}>Loading…</span>
          )}
        </dl>
      </div>

      <div className="card" style={{ padding: 22 }}>
        <h2 className="admin-h2">Backend</h2>
        <p style={{ marginTop: 8, color: "var(--ink-3)", fontSize: 13 }}>
          API base URL is set via <code>NEXT_PUBLIC_API_BASE_URL</code>.
        </p>
        <div
          style={{
            marginTop: 12,
            padding: 14,
            borderRadius: 10,
            background: "var(--paper-2)",
            border: "1px solid var(--line)",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "var(--ink)",
            wordBreak: "break-all",
          }}
        >
          {API_BASE_URL}
        </div>
      </div>
    </div>
  );
}
