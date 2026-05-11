"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  Banner,
  Field,
  FieldGrid,
  PrimaryButton,
  SecondaryButton,
  Section,
  Skeleton,
} from "@/components/admin/seo/FormBits";
import {
  deletePage,
  getPage,
  parseJSON,
  prettyJSON,
  updatePage,
  type PageSEO,
} from "@/lib/admin/seo";

const ROBOTS = ["", "index,follow", "noindex,follow", "index,nofollow", "noindex,nofollow"];
const TWITTER_CARDS = ["", "summary", "summary_large_image", "app", "player"];
const OG_TYPES = ["website", "article", "profile", "video.other", "book"];
const CHANGEFREQS = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];

export default function PageEditScreen() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [data, setData] = useState<PageSEO | null>(null);
  const [schemasText, setSchemasText] = useState("");
  const [hreflangText, setHreflangText] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getPage(id)
      .then((d) => {
        setData(d);
        setSchemasText(prettyJSON(d.schemas));
        setHreflangText(prettyJSON(d.hreflang));
      })
      .catch((e) => setErr(e?.message ?? "Failed to load"));
  }, [id]);

  function set<K extends keyof PageSEO>(key: K, value: PageSEO[K]) {
    setData((d) => (d ? { ...d, [key]: value } : d));
  }

  const schemasParsed = useMemo(() => parseJSON<unknown[]>(schemasText, []), [schemasText]);
  const hreflangParsed = useMemo(
    () => parseJSON<Record<string, string>>(hreflangText, {}),
    [hreflangText],
  );
  const schemasErr = schemasParsed[1];
  const hreflangErr = hreflangParsed[1];

  async function onSave() {
    if (!data) return;
    if (schemasErr || hreflangErr) {
      setErr("Fix the JSON errors below before saving.");
      return;
    }
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      const updated = await updatePage(data.id!, {
        ...data,
        schemas: (Array.isArray(schemasParsed[0]) ? schemasParsed[0] : []) as Record<
          string,
          unknown
        >[],
        hreflang: hreflangParsed[0],
      });
      setData(updated);
      setMsg("Saved.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!data?.id) return;
    if (!confirm(`Delete SEO entry for ${data.path}? Page will fall back to site defaults.`)) return;
    await deletePage(data.id);
    router.push("/admin/dashboard/seo/pages");
  }

  return (
    <>
      <PageHeader
        eyebrow="SEO · Page"
        title={data?.path ?? "—"}
        accent={data?.label ? `· ${data.label}` : ""}
        description="Per-page overrides. Anything left blank falls back to site defaults."
      />
      <div style={{ marginBottom: 16, display: "flex", gap: 10 }}>
        <Link
          href="/admin/dashboard/seo/pages"
          className="admin-btn-soft"
          style={{ padding: "8px 14px", fontSize: 12, textDecoration: "none" }}
        >
          ← Back to list
        </Link>
      </div>

      {err && <Banner kind="error">{err}</Banner>}
      {msg && <Banner kind="ok">{msg}</Banner>}

      {!data ? (
        <Skeleton />
      ) : (
        <>
          {/* SERP preview */}
          <Section title="Search preview" description="Approximation of how Google may render this page in results.">
            <SerpPreview
              title={data.title || "(falls back to site default)"}
              url={data.canonical_url || `https://bipevns.org${data.path}`}
              description={data.description || "(falls back to site default)"}
            />
          </Section>

          <Section title="Basics">
            <FieldGrid>
              <Field label="Path" value={data.path} onChange={(v) => set("path", v)} hint="Must start with /" />
              <Field label="Label (admin-only)" value={data.label} onChange={(v) => set("label", v)} />
              <label style={{ gridColumn: "1 / -1", display: "inline-flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={data.enabled}
                  onChange={(e) => set("enabled", e.target.checked)}
                />
                <span className="admin-label" style={{ margin: 0 }}>Enabled (uncheck to fall back to site defaults)</span>
              </label>
            </FieldGrid>
          </Section>

          <Section title="Meta">
            <FieldGrid>
              <Field label="Title" value={data.title} onChange={(v) => set("title", v)} hint={`Recommended ≤ 60 chars (currently ${data.title.length}).`} full />
              <Field label="Description" value={data.description} onChange={(v) => set("description", v)} textarea full hint={`Recommended ≤ 160 chars (currently ${data.description.length}).`} />
              <Field label="Keywords" value={data.keywords} onChange={(v) => set("keywords", v)} hint="Comma-separated; mostly informational." full />
              <Field label="Canonical URL" value={data.canonical_url} onChange={(v) => set("canonical_url", v)} placeholder={`https://bipevns.org${data.path}`} hint="Leave blank to auto-build from site URL + path." full />
              <Field label="Robots">
                <select className="admin-select" value={data.robots ?? ""} onChange={(e) => set("robots", e.target.value)}>
                  {ROBOTS.map((r) => <option key={r || "default"} value={r}>{r || "(inherit site default)"}</option>)}
                </select>
              </Field>
            </FieldGrid>
          </Section>

          <Section title="Open Graph (Facebook / LinkedIn / WhatsApp)">
            <FieldGrid>
              <Field label="OG title" value={data.og_title} onChange={(v) => set("og_title", v)} hint="Leave blank to mirror the meta title." full />
              <Field label="OG description" value={data.og_description} onChange={(v) => set("og_description", v)} textarea full />
              <Field label="OG image URL" value={data.og_image} onChange={(v) => set("og_image", v)} placeholder="https://bipevns.org/og/about.png" hint="1200×630 px works for every platform." full />
              <Field label="OG type">
                <select className="admin-select" value={data.og_type || "website"} onChange={(e) => set("og_type", e.target.value)}>
                  {OG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="OG locale" value={data.og_locale} onChange={(v) => set("og_locale", v)} placeholder="en_IN" />
            </FieldGrid>
          </Section>

          <Section title="Twitter Card">
            <FieldGrid>
              <Field label="Card type">
                <select className="admin-select" value={data.twitter_card ?? ""} onChange={(e) => set("twitter_card", e.target.value)}>
                  {TWITTER_CARDS.map((c) => <option key={c || "default"} value={c}>{c || "(inherit site default)"}</option>)}
                </select>
              </Field>
              <Field label="Twitter image URL" value={data.twitter_image} onChange={(v) => set("twitter_image", v)} placeholder="https://…/twitter.png" />
              <Field label="Twitter title" value={data.twitter_title} onChange={(v) => set("twitter_title", v)} full />
              <Field label="Twitter description" value={data.twitter_description} onChange={(v) => set("twitter_description", v)} textarea full />
            </FieldGrid>
          </Section>

          <Section
            title="JSON-LD on this page"
            description="Array of schema.org objects. Each rendered as its own <script type='application/ld+json'>."
          >
            <textarea
              className="admin-textarea"
              value={schemasText}
              onChange={(e) => setSchemasText(e.target.value)}
              rows={10}
              style={{ width: "100%", fontFamily: "var(--font-mono)", fontSize: 12.5 }}
              placeholder='[\n  { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [] }\n]'
            />
            {schemasErr && <div className="admin-field-msg">JSON error: {schemasErr}</div>}
          </Section>

          <Section title="Hreflang alternates" description="Object mapping locale → URL or path.">
            <textarea
              className="admin-textarea"
              value={hreflangText}
              onChange={(e) => setHreflangText(e.target.value)}
              rows={5}
              style={{ width: "100%", fontFamily: "var(--font-mono)", fontSize: 12.5 }}
              placeholder='{\n  "hi-IN": "/?lang=hi"\n}'
            />
            {hreflangErr && <div className="admin-field-msg">JSON error: {hreflangErr}</div>}
          </Section>

          <Section title="Sitemap hints">
            <FieldGrid>
              <Field
                label="Priority (0.0 – 1.0)"
                value={String(data.sitemap_priority)}
                onChange={(v) => set("sitemap_priority", v)}
              />
              <Field label="Change frequency">
                <select
                  className="admin-select"
                  value={data.sitemap_changefreq}
                  onChange={(e) => set("sitemap_changefreq", e.target.value)}
                >
                  {CHANGEFREQS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </FieldGrid>
          </Section>

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 20 }}>
            <PrimaryButton disabled={saving} onClick={onSave}>
              {saving ? "Saving…" : "Save"}
            </PrimaryButton>
            <SecondaryButton onClick={onDelete}>Delete page entry</SecondaryButton>
            {data.updated_at && (
              <span style={{ color: "var(--ink-3)", fontSize: 12, fontFamily: "var(--font-mono)", marginLeft: "auto" }}>
                Last updated {new Date(data.updated_at).toLocaleString()}
              </span>
            )}
          </div>
        </>
      )}
    </>
  );
}

function SerpPreview({
  title,
  url,
  description,
}: {
  title: string;
  url: string;
  description: string;
}) {
  return (
    <div
      style={{
        padding: "16px 18px",
        background: "var(--white)",
        border: "1px solid var(--line)",
        borderRadius: 10,
        maxWidth: 640,
      }}
    >
      <div style={{ fontSize: 12, color: "#202124" }}>{url}</div>
      <div style={{ fontSize: 18, lineHeight: 1.25, color: "#1a0dab", margin: "4px 0 6px" }}>
        {title}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.5, color: "#4d5156" }}>
        {description}
      </div>
    </div>
  );
}
