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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { ImageInput } from "@/components/admin/ImageInput";
import { Branches, BranchRow, BranchWrite } from "@/lib/admin/content";

export default function BranchesAdmin() {
  const [rows, setRows] = useState<BranchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [editor, setEditor] = useState<{ open: boolean; row: BranchRow | null }>({ open: false, row: null });

  async function refresh() {
    setLoading(true); setErr(null);
    try { setRows(await Branches.list()); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, []);

  async function togglePub(r: BranchRow) {
    try { await Branches.update(r.id, { is_published: !r.is_published }); refresh(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
  }
  async function onDelete(r: BranchRow) {
    if (!confirm(`Delete branch "${r.name}"?`)) return;
    try { await Branches.remove(r.id); setMsg("Deleted."); refresh(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
  }

  const columns: ColumnDef<BranchRow>[] = [
    { id: "code", header: "Code", accessorFn: (r) => r.code,
      cell: ({ row }) => <span className="font-mono font-bold text-[var(--brand)]" style={{ fontFamily: "var(--font-mono)" }}>{row.original.code}</span> },
    { id: "name", header: "Name", accessorFn: (r) => r.name,
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="font-semibold text-[var(--ink)]">{row.original.name}</div>
          <div className="serif text-xs text-[var(--ink-3)]" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
            {row.original.name_hi}
          </div>
        </div>
      ) },
    { id: "seats", header: "Seats", accessorFn: (r) => r.seats,
      cell: ({ row }) => row.original.seats },
    { id: "fee", header: "Fee/yr", accessorFn: (r) => r.fee_year,
      cell: ({ row }) => <span style={{ fontFamily: "var(--font-mono)" }}>₹{row.original.fee_year}</span> },
    { id: "tag", header: "Tag", accessorFn: (r) => r.tag,
      cell: ({ row }) => row.original.tag ? <Badge variant="accent">{row.original.tag}</Badge> : <span className="text-[var(--ink-4)]">—</span> },
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
      <PageHeader eyebrow="Content · Branches" title="Diploma" accent="branches."
        description="The five BTEUP branches shown across the site. Overrides the static lib/data.ts list when present." />
      {err && <Banner kind="error" onDismiss={() => setErr(null)}>{err}</Banner>}
      {msg && <Banner kind="ok" onDismiss={() => setMsg(null)}>{msg}</Banner>}

      <DataTable
        data={rows} columns={columns}
        searchKey="" searchPlaceholder="Search branches…"
        toolbar={<Button onClick={() => setEditor({ open: true, row: null })}>+ New branch</Button>}
        emptyState={loading ? "Loading…" : "No branches yet."}
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
  row: BranchRow | null;
  onOpenChange: (b: boolean) => void;
  onSaved: () => void;
  onError: (s: string) => void;
}) {
  const [form, setForm] = useState<BranchWrite>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(row ? { ...row } : {
      code: "", slug: "", name: "", name_hi: "", seats: 60, fee_year: "30,150",
      short_description: "", tag: "", color_index: 1,
      thumbnail_url: "", thumbnail_alt: "",
      slide1_url: "", slide1_alt: "",
      slide2_url: "", slide2_alt: "",
      slide3_url: "", slide3_alt: "",
      is_published: true, sort_order: 0,
    });
  }, [open, row]);
  function set<K extends keyof BranchWrite>(k: K, v: BranchWrite[K]) { setForm((f) => ({ ...f, [k]: v })); }

  async function onSave() {
    setSaving(true);
    try {
      if (row) await Branches.update(row.id, form); else await Branches.create(form);
      onSaved();
    } catch (e) { onError(e instanceof Error ? e.message : "Save failed"); }
    finally { setSaving(false); }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="md" className="p-0">
        <SheetHeader>
          <SheetTitle>{row ? "Edit branch" : "New branch"}</SheetTitle>
          <SheetDescription>BTEUP diploma branch.</SheetDescription>
        </SheetHeader>

        <SheetBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="code">BTEUP code</Label>
              <Input id="code" value={form.code || ""} onChange={(e) => set("code", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={form.slug || ""} onChange={(e) => set("slug", e.target.value)} placeholder="computer-science-engineering" />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="name">Name (English)</Label>
              <Input id="name" value={form.name || ""} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="name_hi">Name (Hindi)</Label>
              <Input id="name_hi" value={form.name_hi || ""} onChange={(e) => set("name_hi", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="seats">Sanctioned seats</Label>
              <Input id="seats" type="number" value={form.seats ?? 60} onChange={(e) => set("seats", Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fee">Fee per year (₹)</Label>
              <Input id="fee" value={form.fee_year || ""} onChange={(e) => set("fee_year", e.target.value)} placeholder="30,150" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tag">Tag</Label>
              <Input id="tag" value={form.tag || ""} onChange={(e) => set("tag", e.target.value)} placeholder="Popular / Rare / (blank)" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="color">Color index (1–5)</Label>
              <Input id="color" type="number" min={1} max={5} value={form.color_index ?? 1} onChange={(e) => set("color_index", Number(e.target.value))} />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="desc">Short description</Label>
              <Textarea id="desc" rows={3} value={form.short_description || ""} onChange={(e) => set("short_description", e.target.value)} />
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

            {/* Imagery — one thumbnail + three slider slots. Leave any
                URL blank to hide that slot. All images should be
                landscape (≥ 1.3 aspect) to crop cleanly to 16:9. */}
            <div className="sm:col-span-2 pt-2 border-t border-[var(--line)]">
              <div className="text-xs uppercase tracking-wide text-[var(--ink-3)] mb-1">Imagery</div>
              <p className="text-xs text-[var(--ink-3)]">
                One thumbnail + up to three slider images. Use landscape (16:9) photos.
                Cloudinary auto-format URLs work well. Leave a URL blank to hide that slot.
              </p>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="thumb_url">Thumbnail</Label>
              <ImageInput id="thumb_url" value={form.thumbnail_url || ""} onChange={(v) => set("thumbnail_url", v)} />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="thumb_alt">Thumbnail alt text</Label>
              <Input id="thumb_alt" value={form.thumbnail_alt || ""} onChange={(e) => set("thumbnail_alt", e.target.value)} placeholder="Short description for screen readers / SEO" />
            </div>

            {([1, 2, 3] as const).map((n) => {
              const urlKey = `slide${n}_url` as const;
              const altKey = `slide${n}_alt` as const;
              return (
                <div key={n} className="sm:col-span-2 space-y-2 p-3 rounded-md bg-[var(--paper)]/40 border border-[var(--line)]">
                  <div className="text-xs uppercase tracking-wide text-[var(--ink-3)]">
                    Slide {n}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`s${n}_url`}>Image</Label>
                    <ImageInput id={`s${n}_url`} value={form[urlKey] || ""} onChange={(v) => set(urlKey, v)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`s${n}_alt`}>Alt text</Label>
                    <Input id={`s${n}_alt`} value={form[altKey] || ""} onChange={(e) => set(altKey, e.target.value)} placeholder="Caption / description" />
                  </div>
                </div>
              );
            })}
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
