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
import { Textarea } from "@/components/ui/textarea";

import { ImageInput } from "@/components/admin/ImageInput";
import { Testimonials, TestimonialRow, TestimonialWrite } from "@/lib/admin/content";

export default function TestimonialsAdmin() {
  const [rows, setRows] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [editor, setEditor] = useState<{ open: boolean; row: TestimonialRow | null }>({ open: false, row: null });

  async function refresh() {
    setLoading(true); setErr(null);
    try { setRows(await Testimonials.list()); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  }
  // The initial load runs inline rather than through refresh(): refresh()
  // opens with a synchronous setLoading(true)/setErr(null) prologue, and
  // setState reached synchronously from an effect body is exactly what
  // react-hooks/set-state-in-effect flags. That prologue is redundant on
  // mount anyway -- `loading` already initialises to true. The cancelled
  // flag is a real fix rather than lint appeasement: without it a slow
  // response resolves after the admin has navigated away and sets state on
  // an unmounted page.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const rows = await Testimonials.list();
        if (!cancelled) setRows(rows);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function togglePub(r: TestimonialRow) {
    try { await Testimonials.update(r.id, { is_published: !r.is_published }); refresh(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
  }
  async function onDelete(r: TestimonialRow) {
    if (!confirm(`Delete testimonial from "${r.name}"?`)) return;
    try { await Testimonials.remove(r.id); setMsg("Deleted."); refresh(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
  }

  const columns: ColumnDef<TestimonialRow>[] = [
    { id: "name", header: "Name", accessorFn: (r) => r.name,
      cell: ({ row }) => <span className="font-semibold text-[var(--ink)]">{row.original.name}</span> },
    { id: "role", header: "Role", accessorFn: (r) => r.role,
      cell: ({ row }) => <span>{row.original.role}</span> },
    { id: "quote", header: "Quote", accessorFn: (r) => r.quote,
      cell: ({ row }) => (
        <span className="text-[var(--ink-3)] line-clamp-1 max-w-md inline-block">
          {row.original.quote.slice(0, 60)}{row.original.quote.length > 60 ? "…" : ""}
        </span>
      ) },
    { id: "lang", header: "Lang", accessorFn: (r) => r.language,
      cell: ({ row }) => <Badge>{row.original.language}</Badge> },
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
      <PageHeader eyebrow="Content · Testimonials" title="Alumni &" accent="parent voices."
        description="Quotes shown on the home Testimonials carousel and the placements page." />
      {err && <Banner kind="error" onDismiss={() => setErr(null)}>{err}</Banner>}
      {msg && <Banner kind="ok" onDismiss={() => setMsg(null)}>{msg}</Banner>}

      <DataTable
        data={rows} columns={columns}
        searchKey="" searchPlaceholder="Search by name, role or quote…"
        toolbar={<Button onClick={() => setEditor({ open: true, row: null })}>+ New testimonial</Button>}
        emptyState={loading ? "Loading…" : "No testimonials yet."}
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
  row: TestimonialRow | null;
  onOpenChange: (b: boolean) => void;
  onSaved: () => void;
  onError: (s: string) => void;
}) {
  const [form, setForm] = useState<TestimonialWrite>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(row ? { ...row } : {
      name: "", role: "", quote: "", language: "en",
      photo_url: "", year_passed: null,
      is_published: true, sort_order: 0,
    });
  }, [open, row]);
  function set<K extends keyof TestimonialWrite>(k: K, v: TestimonialWrite[K]) { setForm((f) => ({ ...f, [k]: v })); }

  async function onSave() {
    setSaving(true);
    try {
      if (row) await Testimonials.update(row.id, form);
      else await Testimonials.create(form);
      onSaved();
    } catch (e) { onError(e instanceof Error ? e.message : "Save failed"); }
    finally { setSaving(false); }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="md" className="p-0">
        <SheetHeader>
          <SheetTitle>{row ? "Edit testimonial" : "New testimonial"}</SheetTitle>
          <SheetDescription>
            Mix Hindi / English / Hinglish freely — set the language so we can render the right font.
          </SheetDescription>
        </SheetHeader>

        <SheetBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name || ""} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="year">Year passed</Label>
              <Input id="year" type="number" value={form.year_passed ?? ""}
                onChange={(e) => set("year_passed", e.target.value ? Number(e.target.value) : null)}
                placeholder="2020" />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="role">Role / context</Label>
              <Input id="role" value={form.role || ""} onChange={(e) => set("role", e.target.value)}
                placeholder="Mech (2020) → Krishna Maruti campus hire" />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="quote">Quote</Label>
              <Textarea id="quote" rows={4} value={form.quote || ""} onChange={(e) => set("quote", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lang">Language</Label>
              <Select value={form.language || "en"} onValueChange={(v) => set("language", v as TestimonialWrite["language"])}>
                <SelectTrigger id="lang"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="mix">Hinglish</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="photo">Photo (optional)</Label>
              <ImageInput id="photo" value={form.photo_url || ""} onChange={(v) => set("photo_url", v)} />
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
        </SheetBody>

        <SheetFooter>
          <Button variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={saving} onClick={onSave}>{saving ? "Saving…" : "Save"}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
