"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Banner } from "@/components/admin/common/Toolkit";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { ImageInput } from "@/components/admin/ImageInput";
import { ListItemsEditor } from "@/components/admin/ListItemsEditor";
import { PageSections, PageSectionRow, PageSectionWrite, SectionType } from "@/lib/admin/content";
import { PAGES, pageBySlug, SectionDef } from "@/lib/admin/pages-registry";

type Approval = { label: string; sub: string };
type HeroContent = {
  eyebrow?: string;
  headline_pre?: string;
  headline_accent?: string;
  headline_post?: string;
  description?: string;
  cta_primary?: { label?: string; href?: string };
  cta_secondary?: { label?: string; href?: string };
  bg_image?: { url?: string; alt?: string };
  approvals?: Approval[];
};

type TextBlockContent = {
  eyebrow?: string;
  heading?: string;
  body?: string;
};

export default function PageDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const pageDef = pageBySlug(slug);

  const [rows, setRows] = useState<PageSectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  async function refresh() {
    if (!slug) return;
    setLoading(true); setErr(null);
    try {
      const all = await PageSections.list();
      const mine = all.filter((s) => s.page === slug);
      setRows(mine);
      if (!activeKey && pageDef?.sections.length) setActiveKey(pageDef.sections[0].key);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }
  // Dependency-driven refetch, as in components/admin/DataTable.tsx: moving
  // between pages in the admin changes `slug` without remounting, so a new
  // request starts and the editor must read as pending from that moment.
  // refresh()'s synchronous setLoading(true)/setErr(null) prologue is what
  // set-state-in-effect flags, and there is no event handler to move it to --
  // the refetch is caused by a route change, not a click.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!pageDef) {
    return (
      <>
        <PageHeader eyebrow="Content · Pages" title="Unknown" accent="page." description="" />
        <Banner kind="error">No page registered with slug “{slug}”. <Link href="/admin/dashboard/content/pages" style={{ color: "var(--brand)" }}>Back to pages</Link>.</Banner>
      </>
    );
  }

  const activeDef: SectionDef | undefined = pageDef.sections.find((s) => s.key === activeKey)
    ?? pageDef.sections[0];
  const activeRow: PageSectionRow | undefined = rows.find((r) => r.section_key === activeDef?.key);

  return (
    <>
      <PageHeader
        eyebrow={`Content · Pages · ${pageDef.publicPath}`}
        title={pageDef.label}
        accent="sections."
        description={pageDef.description}
      />
      {err && <Banner kind="error" onDismiss={() => setErr(null)}>{err}</Banner>}
      {msg && <Banner kind="ok" onDismiss={() => setMsg(null)}>{msg}</Banner>}

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 22 }}>
        {pageDef.sections.map((s) => {
          const has = rows.some((r) => r.section_key === s.key);
          const active = activeDef?.key === s.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setActiveKey(s.key)}
              style={{
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 10,
                border: "1px solid " + (active ? "var(--ink)" : "var(--line)"),
                background: active ? "var(--ink)" : "var(--white)",
                color: active ? "var(--paper)" : "var(--ink-2)",
                cursor: "pointer",
                display: "inline-flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              {s.label}
              {!has && <span style={{ fontSize: 10, opacity: 0.7 }}>(empty)</span>}
            </button>
          );
        })}
      </div>

      {activeDef && (
        <SectionEditor
          pageSlug={pageDef.slug}
          sectionDef={activeDef}
          row={activeRow}
          loading={loading}
          onSaved={() => { setMsg("Saved."); refresh(); }}
          onError={setErr}
        />
      )}
    </>
  );
}

function SectionEditor({
  pageSlug, sectionDef, row, loading, onSaved, onError,
}: {
  pageSlug: string;
  sectionDef: SectionDef;
  row: PageSectionRow | undefined;
  loading: boolean;
  onSaved: () => void;
  onError: (s: string) => void;
}) {
  // Local copy of the row that the form mutates. Re-syncs whenever the
  // upstream row identity changes (i.e. the active tab switches, or a
  // refresh brings down fresh data after save).
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setContent((row?.content as Record<string, unknown>) ?? {});
    setIsPublished(row?.is_published ?? true);
  }, [row?.id, row?.section_key]);

  async function save() {
    setSaving(true);
    try {
      const body: PageSectionWrite = {
        page: pageSlug,
        section_key: sectionDef.key,
        section_type: sectionDef.type,
        title: row?.title ?? `${pageSlug} — ${sectionDef.label}`,
        content,
        is_published: isPublished,
        sort_order: row?.sort_order ?? 0,
      };
      if (row) await PageSections.update(row.id, body);
      else await PageSections.create(body);
      onSaved();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      border: "1px solid var(--line)",
      borderRadius: 14,
      padding: "20px 22px",
      background: "var(--white)",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 18,
        paddingBottom: 14,
        borderBottom: "1px solid var(--line)",
      }}>
        <div>
          <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)" }}>
            Section · {sectionDef.type}
          </div>
          <div style={{ marginTop: 4, fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>
            {sectionDef.label}
          </div>
          {sectionDef.description && (
            <div style={{ marginTop: 4, fontSize: 12.5, color: "var(--ink-3)" }}>
              {sectionDef.description}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {row
            ? (row.is_published ? <Badge variant="success">live</Badge> : <Badge>draft</Badge>)
            : <Badge variant="accent">new</Badge>}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{isPublished ? "Live" : "Draft"}</span>
          </div>
        </div>
      </div>

      {loading && !row ? (
        <div style={{ color: "var(--ink-3)", fontSize: 13 }}>Loading…</div>
      ) : (
        <SectionEditorBody
          sectionDef={sectionDef}
          content={content}
          onChange={setContent}
        />
      )}

      <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button disabled={saving} onClick={save}>{saving ? "Saving…" : "Save section"}</Button>
      </div>
    </div>
  );
}

function SectionEditorBody({
  sectionDef, content, onChange,
}: {
  sectionDef: SectionDef;
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  // Sections with an item-schema in the registry (Stats / Why-BIPE /
  // FAQ / Facilities / JEECUP steps) get a typed list editor — much
  // friendlier than raw JSON.
  if (sectionDef.itemFields && sectionDef.itemFields.length > 0) {
    return (
      <ItemsListSectionEditor
        sectionDef={sectionDef}
        content={content}
        onChange={onChange}
      />
    );
  }
  const type: SectionType = sectionDef.type;
  if (type === "hero") return <HeroEditor content={content as HeroContent} onChange={onChange as (c: HeroContent) => void} />;
  if (type === "text-block") return <TextBlockEditor content={content as TextBlockContent} onChange={onChange as (c: TextBlockContent) => void} />;
  // generic / unsupported types — JSON textarea as an escape hatch
  return <GenericEditor content={content} onChange={onChange} />;
}

// ─── Items-list section editor (dispatched by registry itemFields) ────

function ItemsListSectionEditor({
  sectionDef, content, onChange,
}: {
  sectionDef: SectionDef;
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const rawItems = (content.items as unknown) ?? [];
  const items: Record<string, unknown>[] = Array.isArray(rawItems)
    ? (rawItems as Record<string, unknown>[])
    : [];

  function setItems(next: Record<string, unknown>[]) {
    onChange({ ...content, items: next });
  }
  function patchTop<K extends string>(k: K, v: string) {
    onChange({ ...content, [k]: v });
  }

  // Some sections (Why-BIPE) carry top-level eyebrow / heading fields
  // alongside the items array. Render those as a small header form
  // above the items list — only when the existing content has them
  // (we don't want to invent fields the public consumer doesn't read).
  const hasEyebrow = "eyebrow" in content;
  const hasHeading = "heading" in content;

  return (
    <div className="space-y-5">
      {(hasEyebrow || hasHeading) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {hasEyebrow && (
            <div className="space-y-1.5">
              <Label htmlFor="hdr_eye">Eyebrow</Label>
              <Input id="hdr_eye" value={String(content.eyebrow ?? "")}
                     onChange={(e) => patchTop("eyebrow", e.target.value)} />
            </div>
          )}
          {hasHeading && (
            <div className="space-y-1.5">
              <Label htmlFor="hdr_head">Heading</Label>
              <Input id="hdr_head" value={String(content.heading ?? "")}
                     onChange={(e) => patchTop("heading", e.target.value)} />
            </div>
          )}
        </div>
      )}

      <div>
        <div className="text-xs uppercase tracking-wide text-[var(--ink-3)] mb-2">
          {sectionDef.rowLabel ?? "Row"}s — {items.length}
        </div>
        <ListItemsEditor
          items={items}
          setItems={setItems}
          fields={sectionDef.itemFields ?? []}
          newItemTemplate={sectionDef.itemTemplate}
          addLabel={sectionDef.addLabel ?? "+ Add row"}
          rowLabel={sectionDef.rowLabel ?? "Row"}
        />
      </div>
    </div>
  );
}

// ─── Hero editor ────────────────────────────────────────────────────────

function HeroEditor({ content, onChange }: { content: HeroContent; onChange: (c: HeroContent) => void }) {
  const c = content;
  function patch<K extends keyof HeroContent>(k: K, v: HeroContent[K]) { onChange({ ...c, [k]: v }); }
  function patchCta(which: "cta_primary" | "cta_secondary", field: "label" | "href", v: string) {
    onChange({ ...c, [which]: { ...c[which], [field]: v } });
  }
  function patchBg(field: "url" | "alt", v: string) {
    onChange({ ...c, bg_image: { ...c.bg_image, [field]: v } });
  }
  const approvals: Approval[] = useMemo(() => c.approvals ?? [], [c.approvals]);
  function setApprovals(next: Approval[]) { onChange({ ...c, approvals: next }); }

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="eyebrow">Eyebrow (optional, small label above the headline)</Label>
        <Input id="eyebrow" value={c.eyebrow || ""} onChange={(e) => patch("eyebrow", e.target.value)} placeholder="(blank)" />
      </div>

      <div>
        <Label>Headline tokens</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1.5">
          <div className="space-y-1">
            <Label htmlFor="h_pre" style={{ fontSize: 11, color: "var(--ink-3)" }}>Plain (1st word)</Label>
            <Input id="h_pre" value={c.headline_pre || ""} onChange={(e) => patch("headline_pre", e.target.value)} placeholder="Engineers" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="h_accent" style={{ fontSize: 11, color: "var(--ink-3)" }}>Accent (orange italic)</Label>
            <Input id="h_accent" value={c.headline_accent || ""} onChange={(e) => patch("headline_accent", e.target.value)} placeholder="begin" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="h_post" style={{ fontSize: 11, color: "var(--ink-3)" }}>Plain (tail)</Label>
            <Input id="h_post" value={c.headline_post || ""} onChange={(e) => patch("headline_post", e.target.value)} placeholder="here." />
          </div>
        </div>
        <div style={{ marginTop: 6, fontSize: 11, color: "var(--ink-3)" }}>
          Rendered as “{c.headline_pre || "Engineers"}{" "}
          <i style={{ color: "var(--accent)" }}>{c.headline_accent || "begin"}</i>{" "}
          <span style={{ opacity: 0.8 }}>{c.headline_post || "here."}</span>”
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="desc">Description</Label>
        <Textarea id="desc" rows={3} value={c.description || ""} onChange={(e) => patch("description", e.target.value)} placeholder="One or two short lines under the headline." />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 p-3 rounded-md border border-[var(--line)]">
          <div className="text-xs uppercase tracking-wide text-[var(--ink-3)]">Primary CTA</div>
          <div className="space-y-1.5">
            <Label htmlFor="cta1_label">Label</Label>
            <Input id="cta1_label" value={c.cta_primary?.label || ""} onChange={(e) => patchCta("cta_primary", "label", e.target.value)} placeholder="Apply for 2026-27" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cta1_href">Link</Label>
            <Input id="cta1_href" value={c.cta_primary?.href || ""} onChange={(e) => patchCta("cta_primary", "href", e.target.value)} placeholder="/apply" />
          </div>
        </div>
        <div className="space-y-2 p-3 rounded-md border border-[var(--line)]">
          <div className="text-xs uppercase tracking-wide text-[var(--ink-3)]">Secondary CTA</div>
          <div className="space-y-1.5">
            <Label htmlFor="cta2_label">Label</Label>
            <Input id="cta2_label" value={c.cta_secondary?.label || ""} onChange={(e) => patchCta("cta_secondary", "label", e.target.value)} placeholder="Book a campus visit" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cta2_href">Link</Label>
            <Input id="cta2_href" value={c.cta_secondary?.href || ""} onChange={(e) => patchCta("cta_secondary", "href", e.target.value)} placeholder="/visit" />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bg_url">Background photo</Label>
        <ImageInput id="bg_url" value={c.bg_image?.url || ""} onChange={(v) => patchBg("url", v)} />
        <div className="mt-2">
          <Label htmlFor="bg_alt" style={{ fontSize: 11, color: "var(--ink-3)" }}>Alt text</Label>
          <Input id="bg_alt" value={c.bg_image?.alt || ""} onChange={(e) => patchBg("alt", e.target.value)} placeholder="Short description for screen readers" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Approvals strip ({approvals.length} item{approvals.length === 1 ? "" : "s"})</Label>
          <Button type="button" variant="outline" size="sm"
                  onClick={() => setApprovals([...(approvals ?? []), { label: "", sub: "" }])}>
            + Add approval
          </Button>
        </div>
        <div className="space-y-2">
          {approvals.map((a, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-end">
              <div className="space-y-1">
                <Label htmlFor={`appr_lbl_${i}`} style={{ fontSize: 11, color: "var(--ink-3)" }}>Label</Label>
                <Input id={`appr_lbl_${i}`} value={a.label}
                       onChange={(e) => {
                         const next = [...approvals]; next[i] = { ...next[i], label: e.target.value };
                         setApprovals(next);
                       }}
                       placeholder="AICTE-approved" />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`appr_sub_${i}`} style={{ fontSize: 11, color: "var(--ink-3)" }}>Sub-label</Label>
                <Input id={`appr_sub_${i}`} value={a.sub}
                       onChange={(e) => {
                         const next = [...approvals]; next[i] = { ...next[i], sub: e.target.value };
                         setApprovals(next);
                       }}
                       placeholder="ID 1-488233171" />
              </div>
              <Button type="button" variant="outline" size="sm"
                      className="text-[var(--danger,#c13b2b)]"
                      onClick={() => setApprovals(approvals.filter((_, j) => j !== i))}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Text-block editor ─────────────────────────────────────────────────

function TextBlockEditor({ content, onChange }: { content: TextBlockContent; onChange: (c: TextBlockContent) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="tb_eyebrow">Eyebrow</Label>
        <Input id="tb_eyebrow" value={content.eyebrow || ""} onChange={(e) => onChange({ ...content, eyebrow: e.target.value })} placeholder="(optional)" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="tb_head">Heading</Label>
        <Input id="tb_head" value={content.heading || ""} onChange={(e) => onChange({ ...content, heading: e.target.value })} placeholder="Section heading" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="tb_body">Body</Label>
        <Textarea id="tb_body" rows={6} value={content.body || ""} onChange={(e) => onChange({ ...content, body: e.target.value })} placeholder="Section copy. Plain text or basic markdown." />
      </div>
    </div>
  );
}

// ─── Generic editor (JSON) ────────────────────────────────────────────

function GenericEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  // Seeded from `content` directly. A mount effect used to re-set exactly
  // what this initialiser already computes, which was both redundant and a
  // set-state-in-effect violation; it is deliberately not replaced, since
  // re-syncing on later `content` changes would clobber whatever the user is
  // mid-way through typing into the textarea.
  const [text, setText] = useState(() => JSON.stringify(content ?? {}, null, 2));
  const [parseErr, setParseErr] = useState<string | null>(null);

  function onChangeText(v: string) {
    setText(v);
    try {
      const parsed = JSON.parse(v);
      onChange(parsed);
      setParseErr(null);
    } catch (e) {
      setParseErr(e instanceof Error ? e.message : "Invalid JSON");
    }
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-[var(--ink-3)]">
        No typed editor for this section type yet — edit the raw JSON. The shape is up to you; the
        public frontend code that consumes this section dictates the field names.
      </div>
      <Textarea rows={16} value={text} onChange={(e) => onChangeText(e.target.value)} style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }} />
      {parseErr && <div style={{ color: "var(--danger,#c13b2b)", fontSize: 12 }}>JSON parse error: {parseErr}</div>}
    </div>
  );
}

// Ensure all known pages are mentioned for the typechecker / build-time
// sanity. (No runtime effect; just keeps PAGES in scope.)
void PAGES;
