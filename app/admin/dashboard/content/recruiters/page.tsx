"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  Banner, Field, FieldGrid, GhostBtn, Loading, Modal, PrimaryBtn, Section,
} from "@/components/admin/common/Toolkit";
import { ContentTable } from "@/components/admin/content/ContentTable";
import { Recruiters, RecruiterRow, RecruiterWrite } from "@/lib/admin/content";

const TIERS = ["flagship", "regular", "alumni"];

export default function RecruitersAdmin() {
  const [rows, setRows] = useState<RecruiterRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [editor, setEditor] = useState<{ open: boolean; row: RecruiterRow | null }>({ open: false, row: null });

  async function refresh() {
    setRows(null); setErr(null);
    try { setRows(await Recruiters.list()); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); setRows([]); }
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

  return (
    <>
      <PageHeader eyebrow="Content · Recruiters" title="Recruiter" accent="directory."
        description="Companies that have hired BIPE alumni — shown on the home Recruiters strip and the /placements page." />
      {err && <Banner kind="error" onDismiss={() => setErr(null)}>{err}</Banner>}
      {msg && <Banner kind="ok" onDismiss={() => setMsg(null)}>{msg}</Banner>}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <PrimaryBtn onClick={() => setEditor({ open: true, row: null })}>+ New recruiter</PrimaryBtn>
      </div>
      {!rows ? <Loading /> : (
        <ContentTable
          rows={rows}
          columns={[
            { key: "name", header: "Name", render: (r) => <span style={{ fontWeight: 600 }}>{r.name}</span> },
            { key: "tier", header: "Tier", render: (r) => <span className="admin-pill">{r.tier}</span> },
            { key: "cnt",  header: "Alumni placed", render: (r) => r.alumni_count },
            { key: "blurb", header: "Blurb", render: (r) => <span style={{ color: "var(--ink-3)", fontSize: 12 }}>{r.blurb}</span> },
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
  open: boolean; row: RecruiterRow | null;
  onClose: () => void; onSaved: () => void; onError: (s: string) => void;
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
    } catch (e) { onError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  }

  return (
    <Modal open={open} onClose={onClose} title={row ? "Edit recruiter" : "New recruiter"} width={620}
      footer={<>
        <GhostBtn disabled={saving} onClick={onClose}>Cancel</GhostBtn>
        <PrimaryBtn disabled={saving} onClick={onSave}>{saving ? "Saving…" : "Save"}</PrimaryBtn>
      </>}
    >
      <Section title="Recruiter">
        <FieldGrid>
          <Field label="Name"><input className="admin-input" value={form.name || ""} onChange={(e) => set("name", e.target.value)} style={{ width: "100%" }} /></Field>
          <Field label="Tier">
            <select className="admin-select" value={form.tier || "regular"} onChange={(e) => set("tier", e.target.value as RecruiterWrite["tier"])}>
              {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Logo URL" full><input className="admin-input" value={form.logo_url || ""} onChange={(e) => set("logo_url", e.target.value)} placeholder="https://…" style={{ width: "100%" }} /></Field>
          <Field label="Website URL" full><input className="admin-input" value={form.website_url || ""} onChange={(e) => set("website_url", e.target.value)} placeholder="https://…" style={{ width: "100%" }} /></Field>
          <Field label="Alumni placed"><input className="admin-input" type="number" value={form.alumni_count ?? 0} onChange={(e) => set("alumni_count", Number(e.target.value))} style={{ width: "100%" }} /></Field>
          <Field label="Sort order"><input className="admin-input" type="number" value={String(form.sort_order ?? 0)} onChange={(e) => set("sort_order", Number(e.target.value))} style={{ width: "100%" }} /></Field>
          <Field label="Short blurb (optional)" full><input className="admin-input" value={form.blurb || ""} onChange={(e) => set("blurb", e.target.value)} placeholder="e.g. 'Munich · pool drive May 2026'" style={{ width: "100%" }} /></Field>
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
