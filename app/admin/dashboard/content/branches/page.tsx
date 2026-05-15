"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  Banner, Field, FieldGrid, GhostBtn, Loading, Modal, PrimaryBtn, Section,
} from "@/components/admin/common/Toolkit";
import { ContentTable } from "@/components/admin/content/ContentTable";
import { Branches, BranchRow, BranchWrite } from "@/lib/admin/content";

export default function BranchesAdmin() {
  const [rows, setRows] = useState<BranchRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [editor, setEditor] = useState<{ open: boolean; row: BranchRow | null }>({ open: false, row: null });

  async function refresh() {
    setRows(null); setErr(null);
    try { setRows(await Branches.list()); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); setRows([]); }
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

  return (
    <>
      <PageHeader eyebrow="Content · Branches" title="Diploma" accent="branches."
        description="The five BTEUP branches shown across the site. Overrides the static lib/data.ts list when present." />
      {err && <Banner kind="error" onDismiss={() => setErr(null)}>{err}</Banner>}
      {msg && <Banner kind="ok" onDismiss={() => setMsg(null)}>{msg}</Banner>}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <PrimaryBtn onClick={() => setEditor({ open: true, row: null })}>+ New branch</PrimaryBtn>
      </div>
      {!rows ? <Loading /> : (
        <ContentTable
          rows={rows}
          columns={[
            { key: "code", header: "Code", render: (r) => <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--brand)" }}>{r.code}</span> },
            { key: "name", header: "Name", render: (r) => <div><div style={{ fontWeight: 600 }}>{r.name}</div><div className="serif" style={{ fontSize: 12, color: "var(--ink-3)" }}>{r.name_hi}</div></div> },
            { key: "seats", header: "Seats", render: (r) => r.seats },
            { key: "fee",  header: "Fee/yr", render: (r) => <span style={{ fontFamily: "var(--font-mono)" }}>₹{r.fee_year}</span> },
            { key: "tag",  header: "Tag", render: (r) => r.tag ? <span className="admin-pill admin-pill-accent">{r.tag}</span> : "—" },
          ]}
          onEdit={(r) => setEditor({ open: true, row: r })}
          onTogglePublished={togglePub}
          onDelete={onDelete}
        />
      )}
      <Editor open={editor.open} row={editor.row}
        onClose={() => setEditor({ open: false, row: null })}
        onSaved={() => { setEditor({ open: false, row: null }); setMsg("Saved."); refresh(); }}
        onError={setErr} />
    </>
  );
}

function Editor({ open, row, onClose, onSaved, onError }: {
  open: boolean; row: BranchRow | null;
  onClose: () => void; onSaved: () => void; onError: (s: string) => void;
}) {
  const [form, setForm] = useState<BranchWrite>({});
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!open) return;
    setForm(row ? { ...row } : {
      code: "", slug: "", name: "", name_hi: "", seats: 60, fee_year: "30,150",
      short_description: "", tag: "", color_index: 1,
      is_published: true, sort_order: 0,
    });
  }, [open, row]);
  function set<K extends keyof BranchWrite>(k: K, v: BranchWrite[K]) { setForm((f) => ({ ...f, [k]: v })); }

  async function onSave() {
    setSaving(true);
    try {
      if (row) await Branches.update(row.id, form); else await Branches.create(form);
      onSaved();
    } catch (e) { onError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  }

  return (
    <Modal open={open} onClose={onClose} title={row ? "Edit branch" : "New branch"} width={680}
      footer={<>
        <GhostBtn disabled={saving} onClick={onClose}>Cancel</GhostBtn>
        <PrimaryBtn disabled={saving} onClick={onSave}>{saving ? "Saving…" : "Save"}</PrimaryBtn>
      </>}
    >
      <Section title="Branch">
        <FieldGrid>
          <Field label="BTEUP code"><input className="admin-input" value={form.code || ""} onChange={(e) => set("code", e.target.value)} style={{ width: "100%" }} /></Field>
          <Field label="Slug"><input className="admin-input" value={form.slug || ""} onChange={(e) => set("slug", e.target.value)} placeholder="computer-science-engineering" style={{ width: "100%" }} /></Field>
          <Field label="Name (English)" full><input className="admin-input" value={form.name || ""} onChange={(e) => set("name", e.target.value)} style={{ width: "100%" }} /></Field>
          <Field label="Name (Hindi)" full><input className="admin-input" value={form.name_hi || ""} onChange={(e) => set("name_hi", e.target.value)} style={{ width: "100%" }} /></Field>
          <Field label="Sanctioned seats"><input className="admin-input" type="number" value={form.seats ?? 60} onChange={(e) => set("seats", Number(e.target.value))} style={{ width: "100%" }} /></Field>
          <Field label="Fee per year (₹)"><input className="admin-input" value={form.fee_year || ""} onChange={(e) => set("fee_year", e.target.value)} placeholder="30,150" style={{ width: "100%" }} /></Field>
          <Field label="Tag"><input className="admin-input" value={form.tag || ""} onChange={(e) => set("tag", e.target.value)} placeholder="Popular / Rare / (blank)" style={{ width: "100%" }} /></Field>
          <Field label="Color index (1–5)"><input className="admin-input" type="number" value={form.color_index ?? 1} onChange={(e) => set("color_index", Number(e.target.value))} style={{ width: "100%" }} /></Field>
          <Field label="Short description" full><textarea className="admin-textarea" rows={3} value={form.short_description || ""} onChange={(e) => set("short_description", e.target.value)} style={{ width: "100%" }} /></Field>
          <Field label="Sort order"><input className="admin-input" type="number" value={String(form.sort_order ?? 0)} onChange={(e) => set("sort_order", Number(e.target.value))} style={{ width: "100%" }} /></Field>
          <Field label="Status">
            <label style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" checked={form.is_published ?? true} onChange={(e) => set("is_published", e.target.checked)} />
              <span>Published</span>
            </label>
          </Field>
        </FieldGrid>
      </Section>
    </Modal>
  );
}
