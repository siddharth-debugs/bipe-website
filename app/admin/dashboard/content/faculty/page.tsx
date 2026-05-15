"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Banner } from "@/components/admin/common/Toolkit";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Sheet, SheetBody, SheetContent, SheetDescription,
  SheetFooter, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { Faculty, FacultyRow, FacultyWrite } from "@/lib/admin/content";

export default function FacultyAdmin() {
  const [rows, setRows] = useState<FacultyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [editor, setEditor] = useState<{ open: boolean; row: FacultyRow | null }>({ open: false, row: null });

  async function refresh() {
    setLoading(true); setErr(null);
    try { setRows(await Faculty.list()); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, []);

  async function togglePub(r: FacultyRow) {
    try { await Faculty.update(r.id, { is_published: !r.is_published }); refresh(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
  }
  async function onDelete(r: FacultyRow) {
    if (!confirm(`Delete faculty "${r.name}"?`)) return;
    try { await Faculty.remove(r.id); setMsg("Deleted."); refresh(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
  }

  const columns: ColumnDef<FacultyRow>[] = [
    { id: "name", header: "Name", accessorFn: (r) => r.name,
      cell: ({ row }) => <span className="font-semibold text-[var(--ink)]">{row.original.name}</span> },
    { id: "designation", header: "Designation", accessorFn: (r) => r.designation,
      cell: ({ row }) => row.original.designation },
    { id: "dept", header: "Department", accessorFn: (r) => r.department,
      cell: ({ row }) => <span className="text-[var(--ink-3)]">{row.original.department}</span> },
    { id: "flags", header: "Flags", enableSorting: false,
      cell: ({ row }) => {
        const f = [
          row.original.is_principal && <Badge key="p" variant="brand">Principal</Badge>,
          row.original.is_hod && <Badge key="h" variant="accent">HOD</Badge>,
        ].filter(Boolean);
        return f.length ? <div className="flex gap-1.5">{f}</div> : <span className="text-[var(--ink-4)]">—</span>;
      } },
    { id: "status", header: "Status", accessorFn: (r) => (r.is_published ? "live" : "draft"),
      cell: ({ row }) => row.original.is_published
        ? <Badge variant="success">live</Badge> : <Badge>draft</Badge> },
    { id: "actions", header: "", enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1.5 whitespace-nowrap">
          <Button variant="outline" size="sm" onClick={() => setEditor({ open: true, row: row.original })}>Edit</Button>
          <Button variant="outline" size="sm" onClick={() => togglePub(row.original)}>
            {row.original.is_published ? "Unpublish" : "Publish"}
          </Button>
          <Button variant="outline" size="sm" className="text-[var(--danger,#c13b2b)]" onClick={() => onDelete(row.original)}>
            Delete
          </Button>
        </div>
      ) },
  ];

  return (
    <>
      <PageHeader eyebrow="Content · Faculty" title="Faculty" accent="profiles."
        description="Profiles shown on the /faculty page. Mark one row as Principal and one per department as HOD." />
      {err && <Banner kind="error" onDismiss={() => setErr(null)}>{err}</Banner>}
      {msg && <Banner kind="ok" onDismiss={() => setMsg(null)}>{msg}</Banner>}

      <DataTable
        data={rows} columns={columns}
        searchKey="" searchPlaceholder="Search faculty…"
        toolbar={<Button onClick={() => setEditor({ open: true, row: null })}>+ New faculty</Button>}
        emptyState={loading ? "Loading…" : "No faculty added yet."}
      />

      <Editor
        open={editor.open}
        row={editor.row}
        onOpenChange={(b) => setEditor((s) => ({ ...s, open: b }))}
        onSaved={() => { setEditor({ open: false, row: null }); setMsg("Saved."); refresh(); }}
        onError={setErr}
      />
    </>
  );
}

function Editor({
  open, row, onOpenChange, onSaved, onError,
}: {
  open: boolean;
  row: FacultyRow | null;
  onOpenChange: (b: boolean) => void;
  onSaved: () => void;
  onError: (s: string) => void;
}) {
  const [form, setForm] = useState<FacultyWrite>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(row ? { ...row } : {
      name: "", designation: "", department: "", qualifications: "",
      experience_years: null, bio: "", photo_url: "", email: "", linkedin_url: "",
      is_principal: false, is_hod: false, is_published: true, sort_order: 0,
    });
  }, [open, row]);
  function set<K extends keyof FacultyWrite>(k: K, v: FacultyWrite[K]) { setForm((f) => ({ ...f, [k]: v })); }

  async function onSave() {
    setSaving(true);
    try {
      if (row) await Faculty.update(row.id, form); else await Faculty.create(form);
      onSaved();
    } catch (e) { onError(e instanceof Error ? e.message : "Save failed"); }
    finally { setSaving(false); }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="lg" className="p-0">
        <SheetHeader>
          <SheetTitle>{row ? "Edit faculty" : "New faculty"}</SheetTitle>
          <SheetDescription>Faculty profile shown across /faculty + home cards.</SheetDescription>
        </SheetHeader>

        <SheetBody className="space-y-6">
          <section className="space-y-3">
            <div className="text-[10.5px] uppercase tracking-[0.14em] text-[var(--ink-3)]" style={{ fontFamily: "var(--font-mono)" }}>§ Identity</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.name || ""} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="designation">Designation</Label>
                <Input id="designation" value={form.designation || ""} onChange={(e) => set("designation", e.target.value)}
                  placeholder="HOD, Mechanical Engineering" />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="dept">Department</Label>
                <Input id="dept" value={form.department || ""} onChange={(e) => set("department", e.target.value)}
                  placeholder="Mechanical Engineering (Production)" />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="quals">Qualifications</Label>
                <Input id="quals" value={form.qualifications || ""} onChange={(e) => set("qualifications", e.target.value)}
                  placeholder="M.Tech (Production) · NIT Patna" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="exp">Experience (years)</Label>
                <Input id="exp" type="number" value={form.experience_years ?? ""}
                  onChange={(e) => set("experience_years", e.target.value ? Number(e.target.value) : null)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email || ""} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="photo">Photo URL</Label>
                <Input id="photo" value={form.photo_url || ""} onChange={(e) => set("photo_url", e.target.value)} placeholder="https://…" />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input id="linkedin" value={form.linkedin_url || ""} onChange={(e) => set("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/…" />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" rows={4} value={form.bio || ""} onChange={(e) => set("bio", e.target.value)} />
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
            <div className="text-[10.5px] uppercase tracking-[0.14em] text-[var(--ink-3)]" style={{ fontFamily: "var(--font-mono)" }}>§ Flags & ordering</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Is Principal</Label>
                <div className="flex items-center gap-2 h-9">
                  <Switch checked={!!form.is_principal} onCheckedChange={(b) => set("is_principal", b)} />
                  <span className="text-sm text-[var(--ink-2)]">Mark as the Principal</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Is HOD</Label>
                <div className="flex items-center gap-2 h-9">
                  <Switch checked={!!form.is_hod} onCheckedChange={(b) => set("is_hod", b)} />
                  <span className="text-sm text-[var(--ink-2)]">Head of Department</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="order">Sort order</Label>
                <Input id="order" type="number" value={String(form.sort_order ?? 0)} onChange={(e) => set("sort_order", Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label>Published</Label>
                <div className="flex items-center gap-2 h-9">
                  <Switch checked={form.is_published ?? true} onCheckedChange={(b) => set("is_published", b)} />
                  <span className="text-sm text-[var(--ink-2)]">{form.is_published ?? true ? "Live" : "Draft"}</span>
                </div>
              </div>
            </div>
          </section>
        </SheetBody>

        <SheetFooter>
          <Button variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={saving} onClick={onSave}>{saving ? "Saving…" : "Save"}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
