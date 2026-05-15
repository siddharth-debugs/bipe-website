"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Banner } from "@/components/admin/common/Toolkit";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [catalogue, setCatalogue] = useState<PermissionCatalogue | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorRole, setEditorRole] = useState<Role | null>(null);

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const [rs, cat] = await Promise.all([listRoles(), getPermissionCatalogue()]);
      setRoles(rs);
      setCatalogue(cat);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
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
    } else if (!confirm(`Delete role "${r.name}"?`)) return;
    try {
      await deleteRole(r.id);
      setMsg("Role deleted.");
      refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    }
  }

  const columns: ColumnDef<Role>[] = [
    {
      id: "name",
      header: "Role",
      accessorFn: (r) => r.name,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 min-w-0">
          <div className="font-semibold text-[var(--ink)]">{row.original.name}</div>
          {SYSTEM_ROLES.has(row.original.name) && <Badge variant="accent">System</Badge>}
        </div>
      ),
    },
    {
      id: "perms",
      header: "Permissions",
      accessorFn: (r) => r.permission_codes.length,
      cell: ({ row }) => `${row.original.permission_codes.length} permissions`,
    },
    {
      id: "users",
      header: "Users",
      accessorFn: (r) => r.user_count,
      cell: ({ row }) => row.original.user_count,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1.5 whitespace-nowrap">
          <Button variant="outline" size="sm" onClick={() => openEdit(row.original.id)}>Edit</Button>
          <Button
            variant="outline"
            size="sm"
            className="text-[var(--danger,#c13b2b)]"
            disabled={SYSTEM_ROLES.has(row.original.name)}
            onClick={() => onDelete(row.original)}
            title={SYSTEM_ROLES.has(row.original.name) ? "System roles can't be deleted." : ""}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Admin · Roles"
        title="Roles &"
        accent="permissions."
        description="A role bundles permissions. Five system roles are seeded automatically; you can clone or add more."
      />
      {err && <Banner kind="error" onDismiss={() => setErr(null)}>{err}</Banner>}
      {msg && <Banner kind="ok" onDismiss={() => setMsg(null)}>{msg}</Banner>}

      <DataTable
        data={roles}
        columns={columns}
        searchKey=""
        searchPlaceholder="Search roles…"
        toolbar={<Button onClick={openNew}>+ New role</Button>}
        emptyState={loading ? "Loading roles…" : "No roles yet."}
      />

      <RoleEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
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

// ─── Editor Dialog ─────────────────────────────────────────────────────

function RoleEditorDialog({
  open,
  onOpenChange,
  role,
  catalogue,
  onSaved,
  onError,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
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
        byApp[app].some((p) =>
          p.codename.toLowerCase().includes(q) || p.name.toLowerCase().includes(q),
        ),
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
    if (!name.trim()) {
      onError("Role name is required.");
      return;
    }
    setSaving(true);
    try {
      const payload = { name: name.trim(), permissions: Array.from(selected) };
      if (role) await updateRole(role.id, payload);
      else await createRole(payload);
      onSaved();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const isSystem = role && SYSTEM_ROLES.has(role.name);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="p-0">
        <DialogHeader>
          <DialogTitle>{role ? `Edit role · ${role.name}` : "Create role"}</DialogTitle>
          <DialogDescription>
            Toggle the high-level scope perms or pick fine-grained per-model rights below. Selected · <strong className="text-[var(--ink)]">{selected.size}</strong> permission{selected.size === 1 ? "" : "s"}.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-6">
          {/* Identity */}
          <div className="space-y-1.5 max-w-md">
            <Label htmlFor="role_name">Role name</Label>
            <Input
              id="role_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!!isSystem}
            />
            {isSystem && (
              <p className="text-[11px] text-[var(--ink-3)]">System role — name is locked.</p>
            )}
          </div>

          <Separator />

          {/* Scope perms */}
          <section className="space-y-3">
            <div>
              <div className="text-[10.5px] uppercase tracking-[0.14em] text-[var(--ink-3)]" style={{ fontFamily: "var(--font-mono)" }}>
                § Scope permissions
              </div>
              <p className="text-sm text-[var(--ink-3)] mt-1">
                Five high-level scopes that gate entire dashboard tabs.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {scopePerms.map((p) => {
                const on = selected.has(p.codename);
                return (
                  <label
                    key={p.codename}
                    className={
                      "flex items-start gap-3 rounded-lg border border-[var(--line)] p-3 cursor-pointer transition-colors " +
                      (on ? "bg-[var(--brand-soft)]" : "bg-[var(--white)] hover:bg-[var(--paper-2)]")
                    }
                  >
                    <Checkbox checked={on} onCheckedChange={() => toggle(p.codename)} className="mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[13px]">{p.label}</div>
                      <div className="text-[11px] text-[var(--ink-3)]" style={{ fontFamily: "var(--font-mono)" }}>
                        {p.codename}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          <Separator />

          {/* Per-model perms */}
          <section className="space-y-3">
            <div>
              <div className="text-[10.5px] uppercase tracking-[0.14em] text-[var(--ink-3)]" style={{ fontFamily: "var(--font-mono)" }}>
                § Per-model permissions
              </div>
              <p className="text-sm text-[var(--ink-3)] mt-1">
                Fine-grained add/change/delete/view rights per Django model.
              </p>
            </div>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter permissions…"
              className="max-w-md"
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredApps.map((app) => {
                const perms = byApp[app];
                const allOn = perms.every((p) => selected.has(p.codename_full));
                return (
                  <div key={app} className="rounded-lg border border-[var(--line)] bg-[var(--white)] p-3">
                    <div className="flex items-baseline justify-between mb-2">
                      <div className="text-[10.5px] uppercase tracking-[0.12em] font-bold text-[var(--brand)]" style={{ fontFamily: "var(--font-mono)" }}>
                        {app}
                      </div>
                      <button
                        type="button"
                        onClick={() => setAllInApp(app, !allOn)}
                        className="text-[11px] text-[var(--ink-3)] underline hover:text-[var(--ink)]"
                      >
                        {allOn ? "Clear" : "Select all"}
                      </button>
                    </div>
                    <div className="flex flex-col gap-1">
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
                              className={
                                "flex items-start gap-2 rounded-md px-2 py-1.5 text-[12.5px] cursor-pointer transition-colors " +
                                (on ? "bg-[color-mix(in_oklab,var(--brand)_6%,transparent)]" : "hover:bg-[var(--paper-2)]")
                              }
                            >
                              <Checkbox checked={on} onCheckedChange={() => toggle(p.codename_full)} className="mt-0.5" />
                              <div className="min-w-0 flex-1">
                                <span className="text-[var(--ink-2)]">{p.name}</span>
                                <span className="text-[10.5px] text-[var(--ink-4)] ml-2" style={{ fontFamily: "var(--font-mono)" }}>
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
          </section>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={saving} onClick={onSave}>
            {saving ? "Saving…" : role ? "Save changes" : "Create role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
