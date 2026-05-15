"use client";

import { useEffect, useState } from "react";
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
  AdminUser,
  AdminUserCompact,
  AdminUserWrite,
  Role,
  createUser,
  deactivateUser,
  getUser,
  listRoles,
  listUsers,
  resetUserRoles,
  updateUser,
} from "@/lib/admin/rbac";

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUserCompact[] | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "disabled">("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorUser, setEditorUser] = useState<AdminUser | null>(null);

  async function refresh() {
    setUsers(null);
    setErr(null);
    try {
      const [u, r] = await Promise.all([
        listUsers({
          search,
          active: activeFilter === "all" ? undefined : activeFilter === "active",
        }),
        listRoles(),
      ]);
      setUsers(u);
      setRoles(r);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
      setUsers([]);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeFilter]);

  function openNew() {
    setEditorUser(null);
    setEditorOpen(true);
  }

  async function openEdit(id: number) {
    try {
      const u = await getUser(id);
      setEditorUser(u);
      setEditorOpen(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to open");
    }
  }

  async function onSaved() {
    setEditorOpen(false);
    setEditorUser(null);
    setMsg("Saved.");
    refresh();
  }

  async function onDeactivate(u: AdminUserCompact) {
    if (!confirm(`Deactivate ${u.display_name || u.username}? They will lose access immediately.`)) return;
    try {
      await deactivateUser(u.id);
      setMsg("User deactivated.");
      refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin · Users"
        title="Manage"
        accent="admin users."
        description="Add staff, assign their role, deactivate accounts. Users sign in with their phone via OTP — the phone you enter here becomes their username."
      />
      {err && <Banner kind="error" onDismiss={() => setErr(null)}>{err}</Banner>}
      {msg && <Banner kind="ok" onDismiss={() => setMsg(null)}>{msg}</Banner>}

      <div
        className="admin-card"
        style={{
          padding: 16,
          marginBottom: 16,
          display: "grid",
          gridTemplateColumns: "1fr auto auto auto",
          gap: 12,
          alignItems: "center",
        }}
      >
        <input
          className="admin-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, email…"
          style={{ width: "100%" }}
        />
        <select
          className="admin-select"
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value as "all" | "active" | "disabled")}
        >
          <option value="all">All users</option>
          <option value="active">Active only</option>
          <option value="disabled">Disabled only</option>
        </select>
        <GhostBtn onClick={refresh}>Refresh</GhostBtn>
        <PrimaryBtn onClick={openNew}>+ Add user</PrimaryBtn>
      </div>

      {!users ? (
        <Loading />
      ) : users.length === 0 ? (
        <Empty
          title="No users match these filters."
          body="Try clearing the search or status filter."
          action={<PrimaryBtn onClick={openNew}>+ Add user</PrimaryBtn>}
        />
      ) : (
        <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--paper-2)", textAlign: "left" }}>
                <Th>Name / phone</Th>
                <Th>Primary role</Th>
                <Th>All roles</Th>
                <Th>Status</Th>
                <Th>Last login</Th>
                <Th>{""}</Th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderTop: "1px solid var(--line)" }}>
                  <Td>
                    <div style={{ fontWeight: 600 }}>{u.display_name || u.username}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-3)" }}>
                      {u.username}
                      {u.email ? ` · ${u.email}` : ""}
                    </div>
                  </Td>
                  <Td>{u.primary_role ? <Tag tone="brand">{u.primary_role}</Tag> : <span style={{ color: "var(--ink-4)" }}>—</span>}</Td>
                  <Td>
                    {u.roles.length === 0 ? <span style={{ color: "var(--ink-4)" }}>—</span> :
                      <span style={{ display: "inline-flex", flexWrap: "wrap", gap: 6 }}>
                        {u.roles.map((r) => <Tag key={r}>{r}</Tag>)}
                      </span>}
                  </Td>
                  <Td>{u.is_active ? <Tag tone="success">active</Tag> : <Tag tone="danger">disabled</Tag>}</Td>
                  <Td style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-3)" }}>
                    {u.last_login ? new Date(u.last_login).toLocaleDateString() : "—"}
                  </Td>
                  <Td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <button
                      className="admin-btn-soft"
                      style={{ padding: "6px 12px", fontSize: 12 }}
                      onClick={() => openEdit(u.id)}
                    >
                      Edit
                    </button>
                    {u.is_active && (
                      <button
                        className="admin-btn-soft"
                        style={{ padding: "6px 12px", fontSize: 12, marginLeft: 6, color: "var(--danger, #c13b2b)" }}
                        onClick={() => onDeactivate(u)}
                        disabled={u.is_superuser}
                        title={u.is_superuser ? "Superusers can't be deactivated from the dashboard." : ""}
                      >
                        Disable
                      </button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <UserEditorModal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        user={editorUser}
        roles={roles}
        onSaved={onSaved}
        onError={setErr}
      />
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        padding: "10px 14px",
        fontSize: 11,
        fontFamily: "var(--font-mono)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "var(--ink-3)",
        fontWeight: 500,
      }}
    >
      {children}
    </th>
  );
}
function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <td style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--ink-2)", ...style }}>{children}</td>;
}

// ─── Editor modal ─────────────────────────────────────────────────────

function UserEditorModal({
  open,
  onClose,
  user,
  roles,
  onSaved,
  onError,
}: {
  open: boolean;
  onClose: () => void;
  user: AdminUser | null;
  roles: Role[];
  onSaved: () => void;
  onError: (s: string) => void;
}) {
  const [form, setForm] = useState<AdminUserWrite>({});
  const [saving, setSaving] = useState(false);

  // Reset form when modal opens or user changes
  useEffect(() => {
    if (!open) return;
    if (user) {
      setForm({
        phone: user.username,
        display_name: user.profile?.display_name ?? "",
        email: user.email,
        is_active: user.is_active,
        primary_role_id: user.profile?.primary_role ?? null,
        role_ids: user.role_summary.map((r) => r.id),
      });
    } else {
      setForm({
        phone: "",
        display_name: "",
        email: "",
        is_active: true,
        primary_role_id: null,
        role_ids: [],
      });
    }
  }, [user, open]);

  function set<K extends keyof AdminUserWrite>(k: K, v: AdminUserWrite[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function toggleRole(id: number) {
    const cur = new Set(form.role_ids ?? []);
    if (cur.has(id)) cur.delete(id);
    else cur.add(id);
    set("role_ids", Array.from(cur));
  }

  async function onSave() {
    setSaving(true);
    try {
      if (user) {
        await updateUser(user.id, form);
      } else {
        await createUser(form);
      }
      onSaved();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onResetRoles() {
    if (!user) return;
    if (!confirm("Remove all roles from this user?")) return;
    setSaving(true);
    try {
      const u = await resetUserRoles(user.id);
      setForm((f) => ({ ...f, role_ids: u.role_summary.map((r) => r.id), primary_role_id: u.profile?.primary_role ?? null }));
    } catch (e) {
      onError(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={user ? `Edit user · ${user.profile?.display_name || user.username}` : "Add admin user"}
      width={640}
      footer={
        <>
          {user && <DangerBtn disabled={saving} onClick={onResetRoles}>Reset roles</DangerBtn>}
          <GhostBtn disabled={saving} onClick={onClose}>Cancel</GhostBtn>
          <PrimaryBtn disabled={saving} onClick={onSave}>
            {saving ? "Saving…" : user ? "Save changes" : "Create user"}
          </PrimaryBtn>
        </>
      }
    >
      <Section title="Identity">
        <FieldGrid>
          <Field label="Phone (10 digits) · also the login username" hint="e.g. 9198646464">
            <input
              className="admin-input"
              value={form.phone ?? ""}
              onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
              style={{ width: "100%" }}
              disabled={!!user && user.is_superuser}
            />
          </Field>
          <Field label="Display name">
            <input
              className="admin-input"
              value={form.display_name ?? ""}
              onChange={(e) => set("display_name", e.target.value)}
              style={{ width: "100%" }}
            />
          </Field>
          <Field label="Email (optional)">
            <input
              className="admin-input"
              type="email"
              value={form.email ?? ""}
              onChange={(e) => set("email", e.target.value)}
              style={{ width: "100%" }}
            />
          </Field>
          <Field label="Status">
            <label style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={form.is_active ?? true}
                onChange={(e) => set("is_active", e.target.checked)}
                disabled={!!user && user.is_superuser}
              />
              <span>Active (can log in)</span>
            </label>
          </Field>
        </FieldGrid>
      </Section>

      <Section title="Roles" description="One user can hold multiple roles; their permissions are the union of all.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
          {roles.length === 0 && <p style={{ color: "var(--ink-3)", fontSize: 13 }}>No roles defined yet — go to Roles tab.</p>}
          {roles.map((r) => {
            const checked = (form.role_ids ?? []).includes(r.id);
            return (
              <label
                key={r.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 10,
                  padding: 10,
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                  background: checked ? "var(--brand-soft)" : "var(--white)",
                  cursor: "pointer",
                }}
              >
                <input type="checkbox" checked={checked} onChange={() => toggleRole(r.id)} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{r.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>
                    {r.permission_codes.length} permission{r.permission_codes.length === 1 ? "" : "s"}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        <div style={{ marginTop: 14 }}>
          <Field label="Primary role (badge shown in the dashboard)">
            <select
              className="admin-select"
              value={form.primary_role_id ?? ""}
              onChange={(e) => set("primary_role_id", e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">— None —</option>
              {roles
                .filter((r) => (form.role_ids ?? []).includes(r.id))
                .map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
            </select>
          </Field>
        </div>
      </Section>
    </Modal>
  );
}
