"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  Banner, Field, FieldGrid, Loading, PrimaryBtn, Section,
} from "@/components/admin/common/Toolkit";
import { Contact, ContactInfoRow, ContactInfoWrite } from "@/lib/admin/content";

export default function ContactInfoAdmin() {
  const [data, setData] = useState<ContactInfoRow | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Contact.get().then(setData).catch((e) => setErr(e instanceof Error ? e.message : "Failed"));
  }, []);

  function set<K extends keyof ContactInfoRow>(k: K, v: ContactInfoRow[K]) {
    setData((d) => (d ? { ...d, [k]: v } : d));
  }

  async function onSave() {
    if (!data) return;
    setSaving(true); setMsg(null); setErr(null);
    try {
      // Strip non-writable fields
      const { id: _id, updated_at: _ua, ...write } = data;
      const updated = await Contact.update(write as ContactInfoWrite);
      setData(updated);
      setMsg("Saved.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally { setSaving(false); }
  }

  return (
    <>
      <PageHeader eyebrow="Content · Contact info" title="Site-wide" accent="contact details."
        description="Everything that says phone / email / address / WhatsApp / map / social on the public site reads from this singleton." />
      {err && <Banner kind="error" onDismiss={() => setErr(null)}>{err}</Banner>}
      {msg && <Banner kind="ok" onDismiss={() => setMsg(null)}>{msg}</Banner>}
      {!data ? <Loading /> : (
        <>
          <Section title="Phones & email">
            <FieldGrid>
              {/* 28 May 2026 — "Alternate phone" admin field removed
                  alongside the broader phone consolidation (single
                  admissions handset 9415202879). */}
              <Field label="Admissions phone"><input className="admin-input" value={data.phone} onChange={(e) => set("phone", e.target.value)} style={{ width: "100%" }} /></Field>
              <Field label="WhatsApp link" full><input className="admin-input" value={data.whatsapp_url} onChange={(e) => set("whatsapp_url", e.target.value)} placeholder="https://wa.me/9415…" style={{ width: "100%" }} /></Field>
              <Field label="Primary email" full><input className="admin-input" type="email" value={data.email} onChange={(e) => set("email", e.target.value)} style={{ width: "100%" }} /></Field>
              <Field label="Principal's email"><input className="admin-input" type="email" value={data.email_principal} onChange={(e) => set("email_principal", e.target.value)} style={{ width: "100%" }} /></Field>
              <Field label="Grievance email"><input className="admin-input" type="email" value={data.email_grievance} onChange={(e) => set("email_grievance", e.target.value)} style={{ width: "100%" }} /></Field>
              <Field label="Anti-ragging email"><input className="admin-input" type="email" value={data.email_anti_ragging} onChange={(e) => set("email_anti_ragging", e.target.value)} style={{ width: "100%" }} /></Field>
              <Field label="Office hours"><input className="admin-input" value={data.office_hours} onChange={(e) => set("office_hours", e.target.value)} style={{ width: "100%" }} /></Field>
            </FieldGrid>
          </Section>

          <Section title="Address & map">
            <FieldGrid>
              <Field label="Postal address" full><textarea className="admin-textarea" rows={2} value={data.address} onChange={(e) => set("address", e.target.value)} style={{ width: "100%" }} /></Field>
              <Field label="Google Maps URL"><input className="admin-input" value={data.map_url} onChange={(e) => set("map_url", e.target.value)} style={{ width: "100%" }} /></Field>
              <Field label="Map embed URL (iframe src)"><input className="admin-input" value={data.map_embed_url} onChange={(e) => set("map_embed_url", e.target.value)} style={{ width: "100%" }} /></Field>
            </FieldGrid>
          </Section>

          <Section title="Identifiers">
            <FieldGrid>
              <Field label="AICTE Permanent ID"><input className="admin-input" value={data.aicte_id} onChange={(e) => set("aicte_id", e.target.value)} style={{ width: "100%" }} /></Field>
              <Field label="JEECUP code"><input className="admin-input" value={data.jeecup_code} onChange={(e) => set("jeecup_code", e.target.value)} style={{ width: "100%" }} /></Field>
            </FieldGrid>
          </Section>

          <Section title="Social">
            <FieldGrid>
              <Field label="Facebook"><input className="admin-input" value={data.facebook_url} onChange={(e) => set("facebook_url", e.target.value)} style={{ width: "100%" }} /></Field>
              <Field label="Instagram"><input className="admin-input" value={data.instagram_url} onChange={(e) => set("instagram_url", e.target.value)} style={{ width: "100%" }} /></Field>
              <Field label="YouTube"><input className="admin-input" value={data.youtube_url} onChange={(e) => set("youtube_url", e.target.value)} style={{ width: "100%" }} /></Field>
              <Field label="X / Twitter"><input className="admin-input" value={data.x_url} onChange={(e) => set("x_url", e.target.value)} style={{ width: "100%" }} /></Field>
              <Field label="LinkedIn" full><input className="admin-input" value={data.linkedin_url} onChange={(e) => set("linkedin_url", e.target.value)} style={{ width: "100%" }} /></Field>
            </FieldGrid>
          </Section>

          <PrimaryBtn disabled={saving} onClick={onSave}>{saving ? "Saving…" : "Save contact info"}</PrimaryBtn>
          {data.updated_at && (
            <div style={{ marginTop: 12, fontSize: 12, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>
              Last saved {new Date(data.updated_at).toLocaleString()}
            </div>
          )}
        </>
      )}
    </>
  );
}
