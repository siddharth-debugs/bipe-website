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
import { Events, EventRow, EventWrite } from "@/lib/admin/content";

const TAGS = ["Admission", "Placement", "Campus", "Faculty", "Sports", "Workshop", "Announcement"];

export default function EventsAdmin() {
  const [rows, setRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [editor, setEditor] = useState<{ open: boolean; row: EventRow | null }>({ open: false, row: null });

  async function refresh() {
    setLoading(true); setErr(null);
    try { setRows(await Events.list()); }
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
        const rows = await Events.list();
        if (!cancelled) setRows(rows);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function togglePub(r: EventRow) {
    try { await Events.update(r.id, { is_published: !r.is_published }); refresh(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
  }
  async function onDelete(r: EventRow) {
    if (!confirm(`Delete event "${r.title}"?`)) return;
    try { await Events.remove(r.id); setMsg("Deleted."); refresh(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
  }

  const columns: ColumnDef<EventRow>[] = [
    { id: "date",  header: "Date", accessorFn: (r) => r.date,
      cell: ({ row }) => <span style={{ fontFamily: "var(--font-mono)" }} className="text-xs">{row.original.date}</span> },
    { id: "tag",   header: "Tag",   accessorFn: (r) => r.tag,
      cell: ({ row }) => <Badge variant="brand">{row.original.tag}</Badge> },
    { id: "title", header: "Title", accessorFn: (r) => r.title,
      cell: ({ row }) => <span className="font-semibold text-[var(--ink)]">{row.original.title}</span> },
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
      <PageHeader eyebrow="Content · Events" title="Events &" accent="news strip."
        description="Items shown on the home News section and /events page. Most recent date sorts first." />
      {err && <Banner kind="error" onDismiss={() => setErr(null)}>{err}</Banner>}
      {msg && <Banner kind="ok" onDismiss={() => setMsg(null)}>{msg}</Banner>}

      <DataTable
        data={rows} columns={columns}
        searchKey="" searchPlaceholder="Search events…"
        toolbar={<Button onClick={() => setEditor({ open: true, row: null })}>+ New event</Button>}
        emptyState={loading ? "Loading events…" : "No events yet."}
      />

      <EventSheet
        open={editor.open}
        row={editor.row}
        onOpenChange={(b) => setEditor((s) => ({ ...s, open: b }))}
        onSaved={() => { setEditor({ open: false, row: null }); setMsg("Saved."); refresh(); }}
        onError={setErr}
      />
    </>
  );
}

function EventSheet({
  open, row, onOpenChange, onSaved, onError,
}: {
  open: boolean;
  row: EventRow | null;
  onOpenChange: (b: boolean) => void;
  onSaved: () => void;
  onError: (s: string) => void;
}) {
  const [form, setForm] = useState<EventWrite>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(row ? { ...row } : {
      date: new Date().toISOString().slice(0, 10),
      tag: "Announcement", title: "", body: "", link_url: "", image_url: "",
      is_published: true, sort_order: 0,
    });
  }, [open, row]);
  function set<K extends keyof EventWrite>(k: K, v: EventWrite[K]) { setForm((f) => ({ ...f, [k]: v })); }

  async function onSave() {
    setSaving(true);
    try {
      if (row) await Events.update(row.id, form); else await Events.create(form);
      onSaved();
    } catch (e) { onError(e instanceof Error ? e.message : "Save failed"); }
    finally { setSaving(false); }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="md" className="p-0">
        <SheetHeader>
          <SheetTitle>{row ? "Edit event" : "New event"}</SheetTitle>
          <SheetDescription>Shown on the home News strip and /events.</SheetDescription>
        </SheetHeader>

        <SheetBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={(form.date as string) || ""} onChange={(e) => set("date", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tag">Tag</Label>
              <Select value={form.tag || "Announcement"} onValueChange={(v) => set("tag", v)}>
                <SelectTrigger id="tag"><SelectValue /></SelectTrigger>
                <SelectContent>{TAGS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title || ""} onChange={(e) => set("title", e.target.value)} />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="body">Body</Label>
              <Textarea id="body" rows={4} value={form.body || ""} onChange={(e) => set("body", e.target.value)} />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="link">Read-more link (optional)</Label>
              <Input id="link" value={form.link_url || ""} onChange={(e) => set("link_url", e.target.value)} placeholder="https://…" />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="image">Image (optional)</Label>
              <ImageInput id="image" value={form.image_url || ""} onChange={(v) => set("image_url", v)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="order">Sort order</Label>
              <Input id="order" type="number" value={String(form.sort_order ?? 0)} onChange={(e) => set("sort_order", Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label>Published</Label>
              <div className="flex items-center gap-2 h-9">
                <Switch checked={form.is_published ?? true} onCheckedChange={(b) => set("is_published", b)} />
                <span className="text-sm text-[var(--ink-2)]">{form.is_published ?? true ? "Live on public site" : "Draft"}</span>
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
