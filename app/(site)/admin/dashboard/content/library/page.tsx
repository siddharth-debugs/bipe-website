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

import { ImageInput } from "@/components/admin/ImageInput";
import { Library, LibraryPhotoRow, LibraryPhotoWrite } from "@/lib/admin/content";

export default function LibraryPhotosAdmin() {
  const [rows, setRows] = useState<LibraryPhotoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [editor, setEditor] = useState<{ open: boolean; row: LibraryPhotoRow | null }>({ open: false, row: null });

  async function refresh() {
    setLoading(true); setErr(null);
    try { setRows(await Library.list()); }
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
        const rows = await Library.list();
        if (!cancelled) setRows(rows);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function togglePub(r: LibraryPhotoRow) {
    try { await Library.update(r.id, { is_published: !r.is_published }); refresh(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
  }
  async function onDelete(r: LibraryPhotoRow) {
    if (!confirm(`Delete this library photo?`)) return;
    try { await Library.remove(r.id); setMsg("Deleted."); refresh(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
  }

  const columns: ColumnDef<LibraryPhotoRow>[] = [
    { id: "preview", header: "Preview", enableSorting: false,
      cell: ({ row }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={row.original.image_url}
          alt={row.original.alt}
          style={{ height: 44, width: 64, objectFit: "cover", borderRadius: 4, border: "1px solid var(--line)" }}
        />
      ) },
    { id: "alt", header: "Alt text", accessorFn: (r) => r.alt,
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="font-semibold text-[var(--ink)] truncate" style={{ maxWidth: 360 }}>
            {row.original.alt || <span className="text-[var(--ink-4)]">—</span>}
          </div>
          {row.original.caption && (
            <div className="text-xs text-[var(--ink-3)] truncate" style={{ maxWidth: 360 }}>
              {row.original.caption}
            </div>
          )}
        </div>
      ) },
    { id: "order", header: "Order", accessorFn: (r) => r.sort_order,
      cell: ({ row }) => <span style={{ fontFamily: "var(--font-mono)" }}>{row.original.sort_order}</span> },
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
      <PageHeader eyebrow="Content · Library" title="Library" accent="photos."
        description="Photos shown in the /campus library section as a crossfade slider. Use landscape (16:9) images." />
      {err && <Banner kind="error" onDismiss={() => setErr(null)}>{err}</Banner>}
      {msg && <Banner kind="ok" onDismiss={() => setMsg(null)}>{msg}</Banner>}

      <DataTable
        data={rows} columns={columns}
        searchKey="" searchPlaceholder="Search by alt text…"
        toolbar={<Button onClick={() => setEditor({ open: true, row: null })}>+ New photo</Button>}
        emptyState={loading ? "Loading…" : "No library photos yet."}
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
  row: LibraryPhotoRow | null;
  onOpenChange: (b: boolean) => void;
  onSaved: () => void;
  onError: (s: string) => void;
}) {
  const [form, setForm] = useState<LibraryPhotoWrite>({});
  const [saving, setSaving] = useState(false);

  // Reset the form when the dialog opens, and when it is opened on a
  // different row. This adjusts state during render instead of in an effect,
  // which is React's documented answer for "a prop changed, derive fresh
  // state from it" (react.dev/learn/you-might-not-need-an-effect). React
  // discards and re-runs the render immediately, so unlike the effect this
  // replaces, the previously edited row's values are never painted first.
  const [lastOpened, setLastOpened] = useState<{ open: boolean; row: typeof row }>({ open, row });
  if (open !== lastOpened.open || row !== lastOpened.row) {
    setLastOpened({ open, row });
    if (open) {
      setForm(row ? { ...row } : {
        image_url: "", alt: "", caption: "",
        is_published: true, sort_order: 0,
      });
    }
  }
  function set<K extends keyof LibraryPhotoWrite>(k: K, v: LibraryPhotoWrite[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSave() {
    setSaving(true);
    try {
      if (row) await Library.update(row.id, form); else await Library.create(form);
      onSaved();
    } catch (e) { onError(e instanceof Error ? e.message : "Save failed"); }
    finally { setSaving(false); }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="md" className="p-0">
        <SheetHeader>
          <SheetTitle>{row ? "Edit library photo" : "New library photo"}</SheetTitle>
          <SheetDescription>One image in the /campus library slider.</SheetDescription>
        </SheetHeader>

        <SheetBody className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="img">Image</Label>
            <ImageInput id="img" value={form.image_url || ""} onChange={(v) => set("image_url", v)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="alt">Alt text</Label>
            <Input id="alt" value={form.alt || ""} onChange={(e) => set("alt", e.target.value)} placeholder="Short description for screen readers / SEO" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="caption">Caption (optional)</Label>
            <Input id="caption" value={form.caption || ""} onChange={(e) => set("caption", e.target.value)} placeholder="Visible caption beneath the photo" />
          </div>
          <div className="grid grid-cols-2 gap-4">
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
