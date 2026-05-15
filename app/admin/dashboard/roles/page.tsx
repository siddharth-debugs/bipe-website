"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Banner } from "@/components/admin/common/Toolkit";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import {
  Role,
  createRole,
  deleteRole,
  getRole,
  listRoles,
  updateRole,
} from "@/lib/admin/rbac";
import {
  Access,
  MODULE_GROUPS,
  ModuleDef,
  ModuleKey,
  accessToRolePerms,
  emptyAccess,
  modulesByGroup,
  rolePermsToAccess,
} from "@/lib/admin/modules";

const SYSTEM_ROLES = new Set([
  "Superadmin",
  "Admin",
  "Content Editor",
  "Submissions Moderator",
  "Viewer",
]);

function accessSummary(access: Record<ModuleKey, Access>): { writes: number; reads: number } {
  let writes = 0, reads = 0;
  for (const m of Object.values(access)) {
    if (m === "write") writes++;
    else if (m === "read") reads++;
  }
  return { writes, reads };
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorRole, setEditorRole] = useState<Role | null>(null);

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const rs = await listRoles();
      setRoles(rs);
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
      alert("Built-in roles cannot be deleted.");
      return;
    }
    if (r.user_count > 0) {
      if (!confirm(`${r.name} is used by ${r.user_count} user${r.user_count === 1 ? "" : "s"}. Delete anyway?`)) return;
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
          {SYSTEM_ROLES.has(row.original.name) && <Badge variant="accent">Built-in</Badge>}
        </div>
      ),
    },
    {
      id: "access",
      header: "Access",
      accessorFn: (r) => r.permission_codes.length,
      cell: ({ row }) => {
        const access = rolePermsToAccess(row.original.permission_codes);
        const { writes, reads } = accessSummary(access);
        const isSuper = row.original.name === "Superadmin";
        if (isSuper) return <Badge variant="brand">Full access</Badge>;
        if (writes === 0 && reads === 0) return <span className="text-[var(--ink-4)]">No access</span>;
        return (
          <div className="flex flex-wrap gap-1.5">
            {writes > 0 && <Badge variant="brand">{writes} write</Badge>}
            {reads > 0 && <Badge>{reads} read</Badge>}
          </div>
        );
      },
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
            title={SYSTEM_ROLES.has(row.original.name) ? "Built-in roles can't be deleted." : ""}
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
        description="A role bundles what someone can see and change in the admin panel. Five built-in roles are seeded; clone them or add your own."
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

      <RoleEditorSheet
        open={editorOpen}
        onOpenChange={setEditorOpen}
        role={editorRole}
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

// ─── Editor Sheet ─────────────────────────────────────────────────────

function RoleEditorSheet({
  open,
  onOpenChange,
  role,
  onSaved,
  onError,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  role: Role | null;
  onSaved: () => void;
  onError: (s: string) => void;
}) {
  const [name, setName] = useState("");
  const [access, setAccess] = useState<Record<ModuleKey, Access>>(emptyAccess());
  const [saving, setSaving] = useState(false);

  const isSuperadmin = role?.name === "Superadmin";
  const isSystem = role && SYSTEM_ROLES.has(role.name);

  useEffect(() => {
    if (!open) return;
    if (role) {
      setName(role.name);
      setAccess(rolePermsToAccess(role.permission_codes));
    } else {
      setName("");
      setAccess(emptyAccess());
    }
  }, [open, role]);

  function setModuleAccess(key: ModuleKey, value: Access) {
    setAccess((a) => ({ ...a, [key]: value }));
  }

  function setAll(value: Access) {
    setAccess((a) => {
      const next = { ...a };
      for (const k of Object.keys(a) as ModuleKey[]) next[k] = value;
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
      const payload = { name: name.trim(), permissions: accessToRolePerms(access) };
      if (role) await updateRole(role.id, payload);
      else await createRole(payload);
      onSaved();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const grouped = modulesByGroup();
  const { writes, reads } = accessSummary(access);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="lg" className="p-0">
        <SheetHeader>
          <SheetTitle>{role ? `Edit role · ${role.name}` : "Create role"}</SheetTitle>
          <SheetDescription>
            For each module, choose <strong className="text-[var(--ink)]">Read</strong> (view only) or
            {" "}<strong className="text-[var(--ink)]">Write</strong> (view, add, edit, delete).
          </SheetDescription>
        </SheetHeader>

        <SheetBody className="space-y-6">
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
              <p className="text-[11px] text-[var(--ink-3)]">Built-in role — name is locked.</p>
            )}
          </div>

          {isSuperadmin ? (
            <div className="rounded-lg border border-[var(--line)] bg-[var(--brand-soft)] p-4 text-sm text-[var(--ink-2)]">
              <strong className="text-[var(--ink)]">Superadmin has every permission.</strong>{" "}
              You can&apos;t restrict this role from here. To limit someone&apos;s access, assign them a different role.
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="text-sm text-[var(--ink-3)]">
                  Selected · <strong className="text-[var(--ink)]">{writes}</strong> write
                  {", "}<strong className="text-[var(--ink)]">{reads}</strong> read
                </div>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" onClick={() => setAll("read")}>All read</Button>
                  <Button variant="outline" size="sm" onClick={() => setAll("write")}>All write</Button>
                  <Button variant="outline" size="sm" onClick={() => setAll("none")}>Clear</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-6">
                {MODULE_GROUPS.map((group) => {
                  const mods = grouped[group];
                  if (mods.length === 0) return null;
                  return (
                    <section key={group} className="space-y-2.5">
                      <div className="text-[10.5px] uppercase tracking-[0.14em] text-[var(--ink-3)]" style={{ fontFamily: "var(--font-mono)" }}>
                        § {group}
                      </div>
                      <div className="rounded-lg border border-[var(--line)] divide-y divide-[var(--line)] bg-[var(--white)]">
                        {mods.map((m) => (
                          <ModuleRow
                            key={m.key}
                            module={m}
                            value={access[m.key]}
                            onChange={(v) => setModuleAccess(m.key, v)}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </>
          )}
        </SheetBody>

        <SheetFooter>
          <Button variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={saving} onClick={onSave}>
            {saving ? "Saving…" : role ? "Save changes" : "Create role"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function ModuleRow({
  module,
  value,
  onChange,
}: {
  module: ModuleDef;
  value: Access;
  onChange: (v: Access) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-3.5">
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-[13.5px] text-[var(--ink)]">{module.label}</div>
        <div className="text-[12px] text-[var(--ink-3)] mt-0.5 leading-snug">{module.description}</div>
      </div>
      <div className="flex shrink-0 rounded-md border border-[var(--line)] overflow-hidden text-[12px]">
        <SegmentButton active={value === "none"}  onClick={() => onChange("none")}>None</SegmentButton>
        <SegmentButton active={value === "read"}  onClick={() => onChange("read")}>Read</SegmentButton>
        <SegmentButton active={value === "write"} onClick={() => onChange("write")} accent>Write</SegmentButton>
      </div>
    </div>
  );
}

function SegmentButton({
  active,
  accent,
  onClick,
  children,
}: {
  active: boolean;
  accent?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const base = "px-3 py-1.5 cursor-pointer transition-colors border-r border-[var(--line)] last:border-r-0 font-medium";
  const inactive = "bg-[var(--white)] text-[var(--ink-3)] hover:bg-[var(--paper-2)]";
  const activeRead = "bg-[var(--paper-2)] text-[var(--ink)]";
  const activeWrite = "bg-[var(--brand)] text-white";
  const cls = active ? (accent ? activeWrite : activeRead) : inactive;
  return (
    <button type="button" onClick={onClick} className={`${base} ${cls}`}>
      {children}
    </button>
  );
}
