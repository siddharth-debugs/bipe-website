"use client";

import { useEffect, useState } from "react";
import { api, type Me, API_BASE_URL } from "@/lib/admin/api";
import { formatDate } from "@/lib/admin/utils";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Pill } from "@/components/admin/ui/Pill";

export default function SettingsPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api<Me>("/auth/me/").then(setMe).catch((e) => setErr(e?.message ?? "Could not load."));
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Account &"
        accent="environment."
        description="Signed-in user info and the API base the dashboard is talking to."
      />

      {err && (
        <div className="admin-card" style={{ padding: 14, color: "var(--danger)", marginBottom: 18 }}>
          {err}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        <section className="admin-card" style={{ padding: 22 }}>
          <div className="admin-eyebrow" style={{ color: "var(--ink-3)" }}>
            § Signed-in user
          </div>
          <h2 className="admin-h2" style={{ marginTop: 6 }}>
            {me?.name || me?.phone || "—"}
          </h2>
          <dl
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              rowGap: 12,
              columnGap: 18,
              marginTop: 18,
              fontSize: 13.5,
            }}
          >
            {me ? (
              <>
                <Row label="Mobile" value={me.phone} mono />
                <Row label="Email" value={me.email || "—"} />
                <Row
                  label="Roles"
                  value={
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {me.is_superuser && <Pill tone="brand">Superuser</Pill>}
                      {me.is_staff && <Pill tone="accent">Staff</Pill>}
                    </div>
                  }
                />
                <Row label="Last login" value={formatDate(me.last_login)} mono />
              </>
            ) : (
              <span style={{ color: "var(--ink-3)" }}>Loading…</span>
            )}
          </dl>
        </section>

        <section className="admin-card" style={{ padding: 22 }}>
          <div className="admin-eyebrow" style={{ color: "var(--ink-3)" }}>
            § Backend
          </div>
          <h2 className="admin-h2" style={{ marginTop: 6 }}>
            API base
          </h2>
          <p style={{ marginTop: 8, color: "var(--ink-3)", fontSize: 13 }}>
            The dashboard talks to its own origin at <code>/api/admin</code>; that path is proxied
            server-side to the Django backend, so the browser only ever sees HTTPS.
          </p>
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 9,
              background: "var(--paper-2)",
              border: "1px solid var(--line)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--ink)",
              wordBreak: "break-all",
            }}
          >
            {API_BASE_URL}
          </div>
        </section>
      </div>
    </>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <>
      <dt
        className="admin-meta"
        style={{ paddingTop: 4, fontSize: 9.5 }}
      >
        {label}
      </dt>
      <dd
        style={{
          margin: 0,
          color: "var(--ink)",
          ...(mono ? { fontFamily: "var(--font-mono)", fontSize: 13 } : {}),
        }}
      >
        {value}
      </dd>
    </>
  );
}
