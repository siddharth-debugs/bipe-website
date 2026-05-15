"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  Banner,
  DangerBtn,
  Empty,
  Field,
  FieldGrid,
  GhostBtn,
  Loading,
  Modal,
  PrimaryBtn,
  Section,
  Tag,
} from "@/components/admin/common/Toolkit";
import {
  PermissionCatalogue,
  PermissionRow,
  Role,
  createRole,
  deleteRole,
  getPermissionCatalogue,
  getRole,
  listRoles,
  updateRole,
} from "@/lib/admin/rbac";

const SYSTEM_ROLES = new Set([
  "Superadmin",
  "Admin",
  "Content Editor",
  "Submissions Moderator",
  "Viewer",
]);

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [catalogue, setCatalogue] = useState<PermissionCatalogue | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorRole, setEditorRole] = useState<Role | null>(null);

  async function refresh() {
    setRoles(null);
    setErr(null);
    try {
      const [rs, cat] = await Promise.all([listRoles(), getPermissionCatalogue()]);
      setRoles(rs);
      setCatalogue(cat);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
      setRoles([]);
    }
  }

  useEffect(() => { refresh(); }, []);

  function openNew() {
    setEditorRole(null);
    setEditorOpen(true);
  }

  async function openEdit(id: number) {
    try {
      const r = await getRole(id);
      setEditorRole(r);
      setEditorOpen(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to open");
    }
  }

  async function onDelete(r: Role) {
    if (SYSTEM_ROLES.has(r.name)) {
      alert("System roles cannot be deleted.");
      return;
    }
    if (r.user_count > 0) {
      if (!confirm(`${r.name} is assigned to ${r.user_count} user${r.user_count === 1 ? "" : "s"}. Delete anyway?`)) return;
    } else {
      if (!confirm(`Delete role "${r.name}"?`)) return;
    }
    try {
      await deleteRole(r.id);
      setMsg("Role deleted.");
      refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin · Roles"
        title="Roles &"
        accent="permissions."
        description="A role bundles permissions. Assigning a role to a user gives them every permission in that role. Five system roles are seeded automatically; you can clone or add more."
      />
      {err && <Banner kind="error" onDismiss={() => setErr(null)}>{err}</Banner>}
      {msg && <Banner kind="ok" onDismiss={() => setMsg(null)}>{msg}</Banner>}

      <div
        className="admin-card"
        style={{
          padding: 16,
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ margin: 0, color: "var(--ink-3)", fontSize: 13 }}>
          {roles?.length ?? "—"} role{(roles?.length ?? 0) === 1 ? "" : "s"} defined.
        </p>
        <PrimaryBtn onClick={openNew}>+ New role</PrimaryBtn>
      </div>

      {!roles ? (
        <Loading />
      ) : roles.length === 0 ? (
        <Empty title="No roles yet." action={<PrimaryBtn onClick={openNew}>+ New role</PrimaryBtn>} />
      ) : (
        <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--paper-2)", textAlign: "left" }}>
                <Th>Role</Th>
                <Th>Permissions</Th>
                <Th>Users</Th>
                <Th>{""}</Th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid var(--line)" }}>
                  <Td>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ fontWeight: 700 }}>{r.name}</div>
                      {SYSTEM_ROLES.has(r.name) && <Tag tone="accent">System</Tag>}
                    </div>
                  </Td>
                  <Td>{r.permission_codes.length} permissions</Td>
                  <Td>{r.user_count}</Td>
                  <Td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <button
                      className="admin-btn-soft"
                      style={{ padding: "6px 12px", fontSize: 12 }}
                      onClick={() => openEdit(r.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-btn-soft"
                      style={{ padding: "6px 12px", fontSize: 12, marginLeft: 6, color: "var(--danger, #c13b2b)" }}
                      onClick={() => onDelete(r)}
                      disabled={SYSTEM_ROLES.has(r.name)}
                      title={SYSTEM_ROLES.has(r.name) ? "System roles can't be deleted." : ""}
                    >
                      Delete
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RoleEditorModal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        role={editorRole}
        catalogue={catalogue}
        onSaved={() => {
          setEditorOpen(false);
          setEditorRole(null);
          setMsg("Saved.");
          refresh();
        }}
        onError={setErr}
      />
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ padding: "10px 14px", fontSize: 11, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-3)", fontWeight: 500 }}>{children}</th>
  );
}
function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <td style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--ink-2)", ...style }}>{children}</td>;
}

// ─── Editor modal ─────────────────────────────────────────────────────

function RoleEditorModal({
  open,
  onClose,
  role,
  catalogue,
  onSaved,
  onError,
}: {
  open: boolean;
  onClose: () => void;
  role: Role | null;
  catalogue: PermissionCatalogue | null;
  onSaved: () => void;
  onError: (s: string) => void;
}) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    if (role) {
      setName(role.name);
      setSelected(new Set(role.permission_codes));
    } else {
      setName("");
      setSelected(new Set());
    }
    setSearch("");
  }, [open, role]);

  const scopePerms = catalogue?.scope_perms ?? [];
  const byApp = catalogue?.by_app ?? {};

  const filteredApps = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return Object.keys(byApp).sort();
    return Object.keys(byApp)
      .filter((app) =>
        app.toLowerCase().includes(q) ||
        byApp[app].some((p) => p.codename.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)),
      )
      .sort();
  }, [byApp, search]);

  function toggle(code: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  function setAllInApp(app: string, on: boolean) {
    setSelected((s) => {
      const next = new Set(s);
      for (const p of byApp[app]) {
        if (on) next.add(p.codename_full);
        else next.delete(p.codename_full);
      }
      return next;
    });
  }

  async function onSave() {
    setSaving(true);
    try {
      const payload = { name: name.trim(), permissions: Array.from(selected) };
      if (!payload.name) {
        onError("Role name is required.");
        setSaving(false);
        return;
      }
      if (role) {
        await updateRole(role.id, payload);
      } else {
        await createRole(payload);
      }
      onSaved();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const isSystem = role && SYSTEM_ROLES.has(role.name);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={role ? `Edit role · ${role.name}` : "Create role"}
      width={820}
      footer={
        <>
          <GhostBtn disabled={saving} onClick={onClose}>Cancel</GhostBtn>
          <PrimaryBtn disabled={saving} onClick={onSave}>
            {saving ? "Saving…" : role ? "Save changes" : "Create role"}
          </PrimaryBtn>
        </>
      }
    >
      <Section title="Identity">
        <FieldGrid>
          <Field label="Role name" full>
            <input
              className="admin-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!!isSystem}
              style={{ width: "100%" }}
            />
            {isSystem && (
              <div style={{ marginTop: 6, fontSize: 11.5, color: "var(--ink-3)" }}>
                System role — name is locked.
              </div>
            )}
          </Field>
        </FieldGrid>
      </Section>

      <Section
        title="Scope permissions"
        description="These five high-level scopes gate entire dashboard tabs."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
          {scopePerms.map((p) => {
            const on = selected.has(p.codename);
            return (
              <label
                key={p.codename}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 10,
                  padding: 10,
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                  background: on ? "var(--brand-soft)" : "var(--white)",
                  cursor: "pointer",
                }}
              >
                <input type="checkbox" checked={on} onChange={() => toggle(p.codename)} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{p.label}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-3)" }}>
                    {p.codename}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </Section>

      <Section
        title="Per-model permissions"
        description="Fine-grained add/change/delete/view rights per Django model. Use if you need read-only access to a single resource."
      >
        <input
          className="admin-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter permissions…"
          style={{ width: "100%", marginBottom: 12 }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
          {filteredApps.map((app) => {
            const perms: PermissionRow[] = byApp[app];
            const allOn = perms.every((p) => selected.has(p.codename_full));
            return (
              <div
                key={app}
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                  padding: 10,
                  background: "var(--white)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--brand)" }}>
                    {app}
                  </div>
                  <button
                    type="button"
                    onClick={() => setAllInApp(app, !allOn)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--ink-3)",
                      fontSize: 11.5,
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    {allOn ? "Clear" : "Select all"}
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {perms
                    .filter((p) => {
                      const q = search.trim().toLowerCase();
                      return !q ||
                        app.toLowerCase().includes(q) ||
                        p.codename.toLowerCase().includes(q) ||
                        p.name.toLowerCase().includes(q);
                    })
                    .map((p) => {
                      const on = selected.has(p.codename_full);
                      return (
                        <label
                          key={p.codename_full}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "auto 1fr",
                            gap: 8,
                            padding: "4px 6px",
                            fontSize: 12.5,
                            color: "var(--ink-2)",
                            background: on ? "color-mix(in oklab, var(--brand) 6%, transparent)" : "transparent",
                            borderRadius: 6,
                            cursor: "pointer",
                          }}
                        >
                          <input type="checkbox" checked={on} onChange={() => toggle(p.codename_full)} />
                          <div style={{ minWidth: 0 }}>
                            <span>{p.name}</span>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-4)", marginLeft: 6 }}>
                              {p.codename}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 8 }}>
        Selected · <strong style={{ color: "var(--ink)" }}>{selected.size}</strong> permission{selected.size === 1 ? "" : "s"}
      </div>
    </Modal>
  );
}
