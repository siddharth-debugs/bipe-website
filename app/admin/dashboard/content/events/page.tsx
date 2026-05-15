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
  EventRow,
  EventWrite,
  Events,
} from "@/lib/admin/content";

const TAGS = ["Admission", "Placement", "Campus", "Faculty", "Sports", "Workshop", "Announcement"];

export default function EventsAdmin() {
  const [rows, setRows] = useState<EventRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [editor, setEditor] = useState<{ open: boolean; row: EventRow | null }>({ open: false, row: null });

  async function refresh() {
    setRows(null); setErr(null);
    try { setRows(await Events.list()); } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
      setRows([]);
    }
  }
  useEffect(() => { refresh(); }, []);

  async function togglePub(r: EventRow) {
    try { await Events.update(r.id, { is_published: !r.is_published }); refresh(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
  }
  async function onDelete(r: EventRow) {
    if (!confirm(`Delete event "${r.title}"?`)) return;
    try { await Events.remove(r.id); setMsg("Deleted."); refresh(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
  }

  return (
    <>
      <PageHeader
        eyebrow="Content · Events"
        title="Events &"
        accent="news strip."
        description="Items shown on the home News section and /events page. Most recent date sorts first."
      />
      {err && <Banner kind="error" onDismiss={() => setErr(null)}>{err}</Banner>}
      {msg && <Banner kind="ok" onDismiss={() => setMsg(null)}>{msg}</Banner>}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <PrimaryBtn onClick={() => setEditor({ open: true, row: null })}>+ New event</PrimaryBtn>
      </div>
      {!rows ? <Loading /> : (
        <ContentTable
          rows={rows}
          columns={[
            { key: "date", header: "Date", render: (r) => <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{r.date}</span> },
            { key: "tag", header: "Tag", render: (r) => <span className="admin-pill admin-pill-brand">{r.tag}</span> },
            { key: "title", header: "Title", render: (r) => <span style={{ fontWeight: 600 }}>{r.title}</span> },
          ]}
          onEdit={(r) => setEditor({ open: true, row: r })}
          onTogglePublished={togglePub}
          onDelete={onDelete}
        />
      )}

      <EventEditor
        open={editor.open}
        row={editor.row}
        onClose={() => setEditor({ open: false, row: null })}
        onSaved={() => { setEditor({ open: false, row: null }); setMsg("Saved."); refresh(); }}
        onError={setErr}
      />
    </>
  );
}

function EventEditor({
  open, row, onClose, onSaved, onError,
}: {
  open: boolean;
  row: EventRow | null;
  onClose: () => void;
  onSaved: () => void;
  onError: (s: string) => void;
}) {
  const [form, setForm] = useState<EventWrite>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(row ? { ...row } : {
      date: new Date().toISOString().slice(0, 10),
      tag: "Announcement",
      title: "", body: "", link_url: "", image_url: "",
      is_published: true, sort_order: 0,
    });
  }, [open, row]);

  function set<K extends keyof EventWrite>(k: K, v: EventWrite[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSave() {
    setSaving(true);
    try {
      if (row) await Events.update(row.id, form);
      else await Events.create(form);
      onSaved();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Save failed");
    } finally { setSaving(false); }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={row ? `Edit event` : "New event"}
      width={680}
      footer={
        <>
          <GhostBtn disabled={saving} onClick={onClose}>Cancel</GhostBtn>
          <PrimaryBtn disabled={saving} onClick={onSave}>{saving ? "Saving…" : "Save"}</PrimaryBtn>
        </>
      }
    >
      <Section title="Event">
        <FieldGrid>
          <Field label="Date">
            <input className="admin-input" type="date" value={(form.date as string) || ""} onChange={(e) => set("date", e.target.value)} style={{ width: "100%" }} />
          </Field>
          <Field label="Tag">
            <select className="admin-select" value={form.tag || ""} onChange={(e) => set("tag", e.target.value)}>
              {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Title" full>
            <input className="admin-input" value={form.title || ""} onChange={(e) => set("title", e.target.value)} style={{ width: "100%" }} />
          </Field>
          <Field label="Body" full>
            <textarea className="admin-textarea" rows={4} value={form.body || ""} onChange={(e) => set("body", e.target.value)} style={{ width: "100%" }} />
          </Field>
          <Field label="Read-more link (optional)" full>
            <input className="admin-input" value={form.link_url || ""} onChange={(e) => set("link_url", e.target.value)} placeholder="https://…" style={{ width: "100%" }} />
          </Field>
          <Field label="Image URL (optional)" full>
            <input className="admin-input" value={form.image_url || ""} onChange={(e) => set("image_url", e.target.value)} placeholder="https://…" style={{ width: "100%" }} />
          </Field>
          <Field label="Sort order (lower = earlier)">
            <input className="admin-input" type="number" value={String(form.sort_order ?? 0)} onChange={(e) => set("sort_order", Number(e.target.value))} style={{ width: "100%" }} />
          </Field>
          <Field label="Status">
            <label style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" checked={form.is_published ?? true} onChange={(e) => set("is_published", e.target.checked)} />
              <span>Published (visible on public site)</span>
            </label>
          </Field>
        </FieldGrid>
      </Section>
    </Modal>
  );
}
