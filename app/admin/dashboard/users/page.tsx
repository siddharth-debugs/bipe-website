"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Banner } from "@/components/admin/common/Toolkit";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

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
  const [users, setUsers] = useState<AdminUserCompact[]>([]);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "disabled">("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorUser, setEditorUser] = useState<AdminUser | null>(null);

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const [u, r] = await Promise.all([
        listUsers({
          active: activeFilter === "all" ? undefined : activeFilter === "active",
        }),
        listRoles(),
      ]);
      setUsers(u);
      setRoles(r);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

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

  const columns: ColumnDef<AdminUserCompact>[] = [
    {
      id: "name",
      header: "Name / phone",
      accessorFn: (u) => u.display_name || u.username,
      cell: ({ row }) => {
        const u = row.original;
        return (
          <div className="min-w-0">
            <div className="font-semibold text-[var(--ink)]">{u.display_name || u.username}</div>
            <div className="text-[11.5px] text-[var(--ink-3)]" style={{ fontFamily: "var(--font-mono)" }}>
              {u.username}{u.email ? ` · ${u.email}` : ""}
            </div>
          </div>
        );
      },
    },
    {
      id: "primary_role",
      header: "Primary role",
      accessorFn: (u) => u.primary_role || "",
      cell: ({ row }) => row.original.primary_role
        ? <Badge variant="brand">{row.original.primary_role}</Badge>
        : <span className="text-[var(--ink-4)]">—</span>,
    },
    {
      id: "roles",
      header: "All roles",
      accessorFn: (u) => u.roles.join(", "),
      cell: ({ row }) => row.original.roles.length === 0
        ? <span className="text-[var(--ink-4)]">—</span>
        : <div className="flex flex-wrap gap-1.5">{row.original.roles.map((r) => <Badge key={r}>{r}</Badge>)}</div>,
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (u) => (u.is_active ? "active" : "disabled"),
      cell: ({ row }) => row.original.is_active
        ? <Badge variant="success">active</Badge>
        : <Badge variant="destructive">disabled</Badge>,
    },
    {
      id: "last_login",
      header: "Last login",
      accessorFn: (u) => u.last_login ?? "",
      cell: ({ row }) => (
        <span className="text-[11.5px] text-[var(--ink-3)]" style={{ fontFamily: "var(--font-mono)" }}>
          {row.original.last_login ? new Date(row.original.last_login).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const u = row.original;
        return (
          <div className="flex justify-end gap-1.5 whitespace-nowrap">
            <Button variant="outline" size="sm" onClick={() => openEdit(u.id)}>
              Edit
            </Button>
            {u.is_active && (
              <Button
                variant="outline"
                size="sm"
                className="text-[var(--danger,#c13b2b)]"
                disabled={u.is_superuser}
                onClick={() => onDeactivate(u)}
                title={u.is_superuser ? "Superusers can't be deactivated from here" : ""}
              >
                Disable
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Admin · Users"
        title="Manage"
        accent="admin users."
        description="Add staff, give them a role, disable accounts. Users log in with their phone via OTP — the number you enter here is their login."
      />
      {err && <Banner kind="error" onDismiss={() => setErr(null)}>{err}</Banner>}
      {msg && <Banner kind="ok" onDismiss={() => setMsg(null)}>{msg}</Banner>}

      <DataTable
        data={users}
        columns={columns}
        searchKey=""
        searchPlaceholder="Search by name, phone, email…"
        toolbar={
          <>
            <Select value={activeFilter} onValueChange={(v) => setActiveFilter(v as typeof activeFilter)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All users</SelectItem>
                <SelectItem value="active">Active only</SelectItem>
                <SelectItem value="disabled">Disabled only</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={refresh} disabled={loading}>
              Refresh
            </Button>
            <Button onClick={openNew}>+ Add user</Button>
          </>
        }
        emptyState={loading ? "Loading users…" : "No users match these filters."}
        pageSize={20}
      />

      <UserEditorSheet
        open={editorOpen}
        onOpenChange={setEditorOpen}
        user={editorUser}
        roles={roles}
        onSaved={onSaved}
        onError={setErr}
      />
    </>
  );
}

// ─── Editor Sheet ────────────────────────────────────────────────────

function UserEditorSheet({
  open,
  onOpenChange,
  user,
  roles,
  onSaved,
  onError,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  user: AdminUser | null;
  roles: Role[];
  onSaved: () => void;
  onError: (s: string) => void;
}) {
  const [form, setForm] = useState<AdminUserWrite>({});
  const [saving, setSaving] = useState(false);

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
      if (user) await updateUser(user.id, form);
      else await createUser(form);
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
      setForm((f) => ({
        ...f,
        role_ids: u.role_summary.map((r) => r.id),
        primary_role_id: u.profile?.primary_role ?? null,
      }));
    } catch (e) {
      onError(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="lg" className="p-0">
        <SheetHeader>
          <SheetTitle>
            {user ? `Edit user · ${user.profile?.display_name || user.username}` : "Add admin user"}
          </SheetTitle>
          <SheetDescription>
            Phone is what they log in with. A role decides what they can see and change.
          </SheetDescription>
        </SheetHeader>

        <SheetBody className="space-y-6">
          {/* Identity */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.14em] text-[var(--ink-3)]" style={{ fontFamily: "var(--font-mono)" }}>
              <span>§</span> Identity
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  value={form.phone ?? ""}
                  onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="9005882866"
                  disabled={!!user && user.is_superuser}
                />
                <p className="text-[11px] text-[var(--ink-3)]">10 digits, no country code. They log in with this number.</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="display_name">Display name</Label>
                <Input
                  id="display_name"
                  value={form.display_name ?? ""}
                  onChange={(e) => set("display_name", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email ?? ""}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <div className="flex items-center gap-2 h-9">
                  <Switch
                    checked={form.is_active ?? true}
                    onCheckedChange={(b) => set("is_active", b)}
                    disabled={!!user && user.is_superuser}
                  />
                  <span className="text-sm text-[var(--ink-2)]">{form.is_active ?? true ? "Active (can log in)" : "Disabled"}</span>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Roles */}
          <section className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div className="text-[10.5px] uppercase tracking-[0.14em] text-[var(--ink-3)]" style={{ fontFamily: "var(--font-mono)" }}>
                § Roles
              </div>
              <p className="text-xs text-[var(--ink-3)]">Tick every role this user should have. Their access is the combined access of all selected roles.</p>
            </div>

            {roles.length === 0 ? (
              <p className="text-sm text-[var(--ink-3)]">No roles defined yet — go to the Roles tab.</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {roles.map((r) => {
                  const checked = (form.role_ids ?? []).includes(r.id);
                  return (
                    <label
                      key={r.id}
                      className={
                        "flex items-start gap-3 rounded-lg border border-[var(--line)] p-3 cursor-pointer transition-colors " +
                        (checked ? "bg-[var(--brand-soft)]" : "bg-[var(--white)] hover:bg-[var(--paper-2)]")
                      }
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleRole(r.id)}
                        className="mt-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-[13.5px]">{r.name}</div>
                        <div className="text-[11.5px] text-[var(--ink-3)]">
                          {r.user_count} user{r.user_count === 1 ? "" : "s"} with this role
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            <div className="space-y-1.5 max-w-md">
              <Label htmlFor="primary_role">Primary role — the badge shown next to their name</Label>
              <Select
                value={form.primary_role_id != null ? String(form.primary_role_id) : "_"}
                onValueChange={(v) => set("primary_role_id", v === "_" ? null : Number(v))}
              >
                <SelectTrigger id="primary_role">
                  <SelectValue placeholder="— None —" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_">— None —</SelectItem>
                  {roles
                    .filter((r) => (form.role_ids ?? []).includes(r.id))
                    .map((r) => (
                      <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </section>
        </SheetBody>

        <SheetFooter>
          {user && (
            <Button variant="outline" disabled={saving} onClick={onResetRoles} className="mr-auto text-[var(--danger,#c13b2b)]">
              Reset roles
            </Button>
          )}
          <Button variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={saving} onClick={onSave}>
            {saving ? "Saving…" : user ? "Save changes" : "Create user"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
