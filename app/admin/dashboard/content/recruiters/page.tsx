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
import { Recruiters, RecruiterRow, RecruiterWrite } from "@/lib/admin/content";

const TIERS = ["flagship", "regular", "alumni"] as const;

export default function RecruitersAdmin() {
  const [rows, setRows] = useState<RecruiterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [editor, setEditor] = useState<{ open: boolean; row: RecruiterRow | null }>({ open: false, row: null });

  async function refresh() {
    setLoading(true); setErr(null);
    try { setRows(await Recruiters.list()); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, []);

  async function togglePub(r: RecruiterRow) {
    try { await Recruiters.update(r.id, { is_published: !r.is_published }); refresh(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
  }
  async function onDelete(r: RecruiterRow) {
    if (!confirm(`Delete recruiter "${r.name}"?`)) return;
    try { await Recruiters.remove(r.id); setMsg("Deleted."); refresh(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
  }

  const columns: ColumnDef<RecruiterRow>[] = [
    { id: "name", header: "Name", accessorFn: (r) => r.name,
      cell: ({ row }) => <span className="font-semibold text-[var(--ink)]">{row.original.name}</span> },
    { id: "tier", header: "Tier", accessorFn: (r) => r.tier,
      cell: ({ row }) => (
        <Badge variant={row.original.tier === "flagship" ? "brand" : row.original.tier === "alumni" ? "accent" : "outline"}>
          {row.original.tier}
        </Badge>
      ) },
    { id: "count", header: "Alumni placed", accessorFn: (r) => r.alumni_count,
      cell: ({ row }) => row.original.alumni_count },
    { id: "blurb", header: "Blurb", accessorFn: (r) => r.blurb,
      cell: ({ row }) => <span className="text-[var(--ink-3)] text-xs">{row.original.blurb}</span> },
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
      <PageHeader eyebrow="Content · Recruiters" title="Recruiter" accent="directory."
        description="Companies that have hired BIPE alumni." />
      {err && <Banner kind="error" onDismiss={() => setErr(null)}>{err}</Banner>}
      {msg && <Banner kind="ok" onDismiss={() => setMsg(null)}>{msg}</Banner>}

      <DataTable
        data={rows} columns={columns}
        searchKey="" searchPlaceholder="Search recruiters…"
        toolbar={<Button onClick={() => setEditor({ open: true, row: null })}>+ New recruiter</Button>}
        emptyState={loading ? "Loading…" : "No recruiters yet."}
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
  row: RecruiterRow | null;
  onOpenChange: (b: boolean) => void;
  onSaved: () => void;
  onError: (s: string) => void;
}) {
  const [form, setForm] = useState<RecruiterWrite>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(row ? { ...row } : {
      name: "", logo_url: "", website_url: "", tier: "regular",
      alumni_count: 0, blurb: "", is_published: true, sort_order: 0,
    });
  }, [open, row]);
  function set<K extends keyof RecruiterWrite>(k: K, v: RecruiterWrite[K]) { setForm((f) => ({ ...f, [k]: v })); }

  async function onSave() {
    setSaving(true);
    try {
      if (row) await Recruiters.update(row.id, form); else await Recruiters.create(form);
      onSaved();
    } catch (e) { onError(e instanceof Error ? e.message : "Save failed"); }
    finally { setSaving(false); }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="md" className="p-0">
        <SheetHeader>
          <SheetTitle>{row ? "Edit recruiter" : "New recruiter"}</SheetTitle>
          <SheetDescription>Company that hires BIPE alumni — shown on home + /placements.</SheetDescription>
        </SheetHeader>

        <SheetBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name || ""} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tier">Tier</Label>
              <Select value={form.tier || "regular"} onValueChange={(v) => set("tier", v as RecruiterWrite["tier"])}>
                <SelectTrigger id="tier"><SelectValue /></SelectTrigger>
                <SelectContent>{TIERS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="logo">Logo</Label>
              <ImageInput id="logo" value={form.logo_url || ""} onChange={(v) => set("logo_url", v)} />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="website">Website URL</Label>
              <Input id="website" value={form.website_url || ""} onChange={(e) => set("website_url", e.target.value)} placeholder="https://…" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cnt">Alumni placed</Label>
              <Input id="cnt" type="number" value={form.alumni_count ?? 0} onChange={(e) => set("alumni_count", Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="order">Sort order</Label>
              <Input id="order" type="number" value={String(form.sort_order ?? 0)} onChange={(e) => set("sort_order", Number(e.target.value))} />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="blurb">Short blurb (optional)</Label>
              <Input id="blurb" value={form.blurb || ""} onChange={(e) => set("blurb", e.target.value)} placeholder="e.g. 'Munich · pool drive May 2026'" />
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
