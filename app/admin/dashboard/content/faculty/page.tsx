"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  Banner, Field, FieldGrid, GhostBtn, Loading, Modal, PrimaryBtn, Section,
} from "@/components/admin/common/Toolkit";
import { ContentTable } from "@/components/admin/content/ContentTable";
import { Faculty, FacultyRow, FacultyWrite } from "@/lib/admin/content";

export default function FacultyAdmin() {
  const [rows, setRows] = useState<FacultyRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [editor, setEditor] = useState<{ open: boolean; row: FacultyRow | null }>({ open: false, row: null });

  async function refresh() {
    setRows(null); setErr(null);
    try { setRows(await Faculty.list()); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); setRows([]); }
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

  return (
    <>
      <PageHeader eyebrow="Content · Faculty" title="Faculty" accent="profiles."
        description="Profiles shown on the /faculty page. Mark one row as Principal and one per department as HOD." />
      {err && <Banner kind="error" onDismiss={() => setErr(null)}>{err}</Banner>}
      {msg && <Banner kind="ok" onDismiss={() => setMsg(null)}>{msg}</Banner>}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <PrimaryBtn onClick={() => setEditor({ open: true, row: null })}>+ New faculty</PrimaryBtn>
      </div>
      {!rows ? <Loading /> : (
        <ContentTable
          rows={rows}
          columns={[
            { key: "name", header: "Name", render: (r) => <span style={{ fontWeight: 600 }}>{r.name}</span> },
            { key: "des",  header: "Designation", render: (r) => r.designation },
            { key: "dept", header: "Department", render: (r) => <span style={{ color: "var(--ink-3)" }}>{r.department}</span> },
            { key: "flag", header: "Flags", render: (r) => [r.is_principal && "Principal", r.is_hod && "HOD"].filter(Boolean).join(" · ") || "—" },
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
  open: boolean; row: FacultyRow | null;
  onClose: () => void; onSaved: () => void; onError: (s: string) => void;
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
    } catch (e) { onError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  }

  return (
    <Modal open={open} onClose={onClose} title={row ? "Edit faculty" : "New faculty"} width={720}
      footer={<>
        <GhostBtn disabled={saving} onClick={onClose}>Cancel</GhostBtn>
        <PrimaryBtn disabled={saving} onClick={onSave}>{saving ? "Saving…" : "Save"}</PrimaryBtn>
      </>}
    >
      <Section title="Identity">
        <FieldGrid>
          <Field label="Name"><input className="admin-input" value={form.name || ""} onChange={(e) => set("name", e.target.value)} style={{ width: "100%" }} /></Field>
          <Field label="Designation"><input className="admin-input" value={form.designation || ""} onChange={(e) => set("designation", e.target.value)} placeholder="HOD, Mechanical Engineering" style={{ width: "100%" }} /></Field>
          <Field label="Department" full><input className="admin-input" value={form.department || ""} onChange={(e) => set("department", e.target.value)} placeholder="Mechanical Engineering (Production)" style={{ width: "100%" }} /></Field>
          <Field label="Qualifications" full><input className="admin-input" value={form.qualifications || ""} onChange={(e) => set("qualifications", e.target.value)} placeholder="M.Tech (Production) · NIT Patna" style={{ width: "100%" }} /></Field>
          <Field label="Experience (years)"><input className="admin-input" type="number" value={form.experience_years ?? ""} onChange={(e) => set("experience_years", e.target.value ? Number(e.target.value) : null)} style={{ width: "100%" }} /></Field>
          <Field label="Email"><input className="admin-input" type="email" value={form.email || ""} onChange={(e) => set("email", e.target.value)} style={{ width: "100%" }} /></Field>
          <Field label="Photo URL" full><input className="admin-input" value={form.photo_url || ""} onChange={(e) => set("photo_url", e.target.value)} placeholder="https://…" style={{ width: "100%" }} /></Field>
          <Field label="LinkedIn" full><input className="admin-input" value={form.linkedin_url || ""} onChange={(e) => set("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/…" style={{ width: "100%" }} /></Field>
          <Field label="Bio" full><textarea className="admin-textarea" rows={4} value={form.bio || ""} onChange={(e) => set("bio", e.target.value)} style={{ width: "100%" }} /></Field>
        </FieldGrid>
      </Section>
      <Section title="Flags & ordering">
        <FieldGrid>
          <Field label="Is Principal">
            <label style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" checked={!!form.is_principal} onChange={(e) => set("is_principal", e.target.checked)} />
              <span>Mark as the Principal</span>
            </label>
          </Field>
          <Field label="Is HOD">
            <label style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" checked={!!form.is_hod} onChange={(e) => set("is_hod", e.target.checked)} />
              <span>Mark as Head of Department</span>
            </label>
          </Field>
          <Field label="Sort order">
            <input className="admin-input" type="number" value={String(form.sort_order ?? 0)} onChange={(e) => set("sort_order", Number(e.target.value))} style={{ width: "100%" }} />
          </Field>
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
