"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  Banner,
  Field,
  FieldGrid,
  GhostBtn,
  Loading,
  Modal,
  PrimaryBtn,
  Section,
} from "@/components/admin/common/Toolkit";
import { ContentTable } from "@/components/admin/content/ContentTable";
import {
  Testimonials,
  TestimonialRow,
  TestimonialWrite,
} from "@/lib/admin/content";

export default function TestimonialsAdmin() {
  const [rows, setRows] = useState<TestimonialRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [editor, setEditor] = useState<{ open: boolean; row: TestimonialRow | null }>({ open: false, row: null });

  async function refresh() {
    setRows(null); setErr(null);
    try { setRows(await Testimonials.list()); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); setRows([]); }
  }
  useEffect(() => { refresh(); }, []);

  async function togglePub(r: TestimonialRow) {
    try { await Testimonials.update(r.id, { is_published: !r.is_published }); refresh(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
  }
  async function onDelete(r: TestimonialRow) {
    if (!confirm(`Delete testimonial from "${r.name}"?`)) return;
    try { await Testimonials.remove(r.id); setMsg("Deleted."); refresh(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
  }

  return (
    <>
      <PageHeader
        eyebrow="Content · Testimonials"
        title="Alumni &"
        accent="parent voices."
        description="Quotes shown on the home Testimonials carousel and the placements page. Mix Hindi / English / Hinglish freely — set the language so we can render the right font."
      />
      {err && <Banner kind="error" onDismiss={() => setErr(null)}>{err}</Banner>}
      {msg && <Banner kind="ok" onDismiss={() => setMsg(null)}>{msg}</Banner>}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <PrimaryBtn onClick={() => setEditor({ open: true, row: null })}>+ New testimonial</PrimaryBtn>
      </div>
      {!rows ? <Loading /> : (
        <ContentTable
          rows={rows}
          columns={[
            { key: "name", header: "Name", render: (r) => <span style={{ fontWeight: 600 }}>{r.name}</span> },
            { key: "role", header: "Role", render: (r) => r.role },
            { key: "quote", header: "Quote (excerpt)", render: (r) => <span style={{ color: "var(--ink-3)" }}>{r.quote.slice(0, 60)}{r.quote.length > 60 ? "…" : ""}</span> },
            { key: "lang", header: "Lang", render: (r) => <span className="admin-pill">{r.language}</span> },
          ]}
          onEdit={(r) => setEditor({ open: true, row: r })}
          onTogglePublished={togglePub}
          onDelete={onDelete}
        />
      )}

      <Editor
        open={editor.open}
        row={editor.row}
        onClose={() => setEditor({ open: false, row: null })}
        onSaved={() => { setEditor({ open: false, row: null }); setMsg("Saved."); refresh(); }}
        onError={setErr}
      />
    </>
  );
}

function Editor({ open, row, onClose, onSaved, onError }: {
  open: boolean; row: TestimonialRow | null;
  onClose: () => void; onSaved: () => void; onError: (s: string) => void;
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
    <Modal open={open} onClose={onClose} title={row ? "Edit testimonial" : "New testimonial"} width={620}
      footer={<>
        <GhostBtn disabled={saving} onClick={onClose}>Cancel</GhostBtn>
        <PrimaryBtn disabled={saving} onClick={onSave}>{saving ? "Saving…" : "Save"}</PrimaryBtn>
      </>}
    >
      <Section title="Testimonial">
        <FieldGrid>
          <Field label="Name">
            <input className="admin-input" value={form.name || ""} onChange={(e) => set("name", e.target.value)} style={{ width: "100%" }} />
          </Field>
          <Field label="Year passed">
            <input className="admin-input" type="number" value={form.year_passed ?? ""} onChange={(e) => set("year_passed", e.target.value ? Number(e.target.value) : null)} placeholder="2020" style={{ width: "100%" }} />
          </Field>
          <Field label="Role / context" full>
            <input className="admin-input" value={form.role || ""} onChange={(e) => set("role", e.target.value)} placeholder="Mech (2020) → Tata Motors campus hire" style={{ width: "100%" }} />
          </Field>
          <Field label="Quote" full>
            <textarea className="admin-textarea" rows={4} value={form.quote || ""} onChange={(e) => set("quote", e.target.value)} style={{ width: "100%" }} />
          </Field>
          <Field label="Language">
            <select className="admin-select" value={form.language || "en"} onChange={(e) => set("language", e.target.value as TestimonialWrite["language"])}>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mix">Hinglish</option>
            </select>
          </Field>
          <Field label="Photo URL (optional)">
            <input className="admin-input" value={form.photo_url || ""} onChange={(e) => set("photo_url", e.target.value)} placeholder="https://…" style={{ width: "100%" }} />
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
