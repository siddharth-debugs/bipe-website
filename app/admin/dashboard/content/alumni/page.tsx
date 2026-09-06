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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { ImageInput } from "@/components/admin/ImageInput";
import { Alumni, AlumnusRow, AlumnusWrite } from "@/lib/admin/content";

const BRANCHES = [
  "Civil Engineering",
  "Computer Science & Engineering",
  "Electrical Engineering",
  "Electronics Engineering",
  "Mechanical Engineering",
  "Mechanical Engineering (Automobile)",
  "Mechanical Engineering (Production)",
];

const STATUSES: { value: "joined" | "offered"; label: string }[] = [
  { value: "joined", label: "Joined" },
  { value: "offered", label: "Offered (moved on)" },
];

export default function AlumniAdmin() {
  const [rows, setRows] = useState<AlumnusRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [editor, setEditor] = useState<{ open: boolean; row: AlumnusRow | null }>({ open: false, row: null });
  const [query, setQuery] = useState("");

  async function refresh() {
    setLoading(true); setErr(null);
    try { setRows(await Alumni.list()); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, []);

  async function togglePub(r: AlumnusRow) {
    try { await Alumni.update(r.id, { is_published: !r.is_published }); refresh(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
  }
  async function onDelete(r: AlumnusRow) {
    if (!confirm(`Delete alumnus "${r.name}"?`)) return;
    try { await Alumni.remove(r.id); setMsg("Deleted."); refresh(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
  }

  const filtered = query
    ? rows.filter((r) => {
        const q = query.toLowerCase();
        return r.name.toLowerCase().includes(q)
          || r.company.toLowerCase().includes(q)
          || r.branch.toLowerCase().includes(q)
          || r.year.includes(q);
      })
    : rows;

  const columns: ColumnDef<AlumnusRow>[] = [
    { id: "photo", header: "", enableSorting: false,
      cell: ({ row }) => row.original.photo_url ? (
        // alt = alumnus name so a screen reader on the avatar cell
        // announces who the row represents — the name column repeats
        // it, which is the standard table-avatar a11y pattern.
        //
        // next/image is not usable here: photo_url is an arbitrary
        // operator-supplied remote URL, so it has no configured remote
        // pattern and no known intrinsic size.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={row.original.photo_url} alt={`${row.original.name} avatar`} style={{ height: 36, width: 36, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--line)" }} />
      ) : (
        <div style={{ height: 36, width: 36, borderRadius: "50%", background: "var(--paper-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-3)", fontSize: 11, fontWeight: 600 }}>
          {row.original.name.split(/\s+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
        </div>
      ) },
    { id: "name", header: "Name", accessorFn: (r) => r.name,
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="font-semibold text-[var(--ink)]">{row.original.name}</div>
          <div className="text-xs text-[var(--ink-3)]">{row.original.branch} · {row.original.year}</div>
        </div>
      ) },
    { id: "placement", header: "Placement", accessorFn: (r) => r.company,
      cell: ({ row }) => (
        <div className="min-w-0" style={{ maxWidth: 280 }}>
          <div className="text-sm text-[var(--ink)] truncate">{row.original.company || <span className="text-[var(--ink-4)]">—</span>}</div>
          {row.original.role && (
            <div className="text-xs text-[var(--ink-3)] truncate">{row.original.role}</div>
          )}
        </div>
      ) },
    { id: "status", header: "Status", accessorFn: (r) => r.status,
      cell: ({ row }) => row.original.status === "joined"
        ? <Badge variant="success">joined</Badge>
        : <Badge variant="accent">offered</Badge> },
    { id: "published", header: "", accessorFn: (r) => (r.is_published ? "live" : "draft"),
      cell: ({ row }) => row.original.is_published
        ? <Badge variant="success">live</Badge>
        : <Badge>draft</Badge> },
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
      <PageHeader eyebrow="Content · Alumni" title="Alumni" accent="directory."
        description="BIPE placement records shown on /alumni and /placements. Add a Cloudinary photo per alumnus where available." />
      {err && <Banner kind="error" onDismiss={() => setErr(null)}>{err}</Banner>}
      {msg && <Banner kind="ok" onDismiss={() => setMsg(null)}>{msg}</Banner>}

      <div className="flex items-center gap-3 mb-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, company, branch, year…"
          style={{ maxWidth: 360 }}
        />
        <span className="text-xs text-[var(--ink-3)]">
          {loading ? "Loading…" : `${filtered.length} of ${rows.length} alumni`}
        </span>
      </div>

      <DataTable
        data={filtered} columns={columns}
        searchKey="" searchPlaceholder=""
        toolbar={<Button onClick={() => setEditor({ open: true, row: null })}>+ New alumnus</Button>}
        emptyState={loading ? "Loading…" : "No alumni match those filters."}
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
  row: AlumnusRow | null;
  onOpenChange: (b: boolean) => void;
  onSaved: () => void;
  onError: (s: string) => void;
}) {
  const [form, setForm] = useState<AlumnusWrite>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(row ? { ...row } : {
      name: "", branch: BRANCHES[0], year: "",
      company: "", role: "", drive_date: "", status: "joined",
      photo_url: "",
      is_published: true, sort_order: 0,
    });
  }, [open, row]);
  function set<K extends keyof AlumnusWrite>(k: K, v: AlumnusWrite[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSave() {
    setSaving(true);
    try {
      if (row) await Alumni.update(row.id, form); else await Alumni.create(form);
      onSaved();
    } catch (e) { onError(e instanceof Error ? e.message : "Save failed"); }
    finally { setSaving(false); }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="md" className="p-0">
        <SheetHeader>
          <SheetTitle>{row ? "Edit alumnus" : "New alumnus"}</SheetTitle>
          <SheetDescription>A single BIPE placement record.</SheetDescription>
        </SheetHeader>

        <SheetBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name || ""} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="branch">Branch</Label>
              <Select value={form.branch || BRANCHES[0]} onValueChange={(v) => set("branch", v)}>
                <SelectTrigger id="branch"><SelectValue placeholder="Choose branch" /></SelectTrigger>
                <SelectContent>
                  {BRANCHES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="year">Year</Label>
              <Input id="year" value={form.year || ""} onChange={(e) => set("year", e.target.value)} placeholder="2024" />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="company">Company</Label>
              <Input id="company" value={form.company || ""} onChange={(e) => set("company", e.target.value)} placeholder="e.g. Mahindra · Krishna Maruti" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">Role / Designation</Label>
              <Input id="role" value={form.role || ""} onChange={(e) => set("role", e.target.value)} placeholder="DET / JE / Site Engineer …" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="drive">Drive date (optional)</Label>
              <Input id="drive" value={form.drive_date || ""} onChange={(e) => set("drive_date", e.target.value)} placeholder="DD-MM-YYYY" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select value={form.status || "joined"} onValueChange={(v) => set("status", v as "joined" | "offered")}>
                <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="order">Sort order</Label>
              <Input id="order" type="number" value={String(form.sort_order ?? 0)} onChange={(e) => set("sort_order", Number(e.target.value))} />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="photo">Photo (optional)</Label>
              <ImageInput id="photo" value={form.photo_url || ""} onChange={(v) => set("photo_url", v)} />
            </div>
            <div className="space-y-1.5">
              <Label>Published</Label>
              <div className="flex items-center gap-2 h-9">
                <Switch checked={form.is_published ?? true} onCheckedChange={(b) => set("is_published", b)} />
                <span className="text-sm text-[var(--ink-2)]">{form.is_published ?? true ? "Live" : "Draft"}</span>
              </div>
            </div>
          </div>
        </SheetBody>

        <SheetFooter>
          <Button variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={saving} onClick={onSave}>{saving ? "Saving…" : "Save"}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
