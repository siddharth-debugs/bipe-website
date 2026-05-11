"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  Banner,
  Field,
  FieldGrid,
  PrimaryButton,
  Section,
  Skeleton,
} from "@/components/admin/seo/FormBits";
import { getSite, patchSite, type SiteSEO } from "@/lib/admin/seo";

const ROBOTS = [
  "index,follow",
  "noindex,follow",
  "index,nofollow",
  "noindex,nofollow",
];

const TWITTER_CARDS = ["summary", "summary_large_image", "app", "player"];

export default function SiteDefaultsPage() {
  const [data, setData] = useState<SiteSEO | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    getSite()
      .then(setData)
      .catch((e) => setErr(e?.message ?? "Failed to load"));
  }, []);

  function set<K extends keyof SiteSEO>(key: K, value: SiteSEO[K]) {
    setData((d) => (d ? { ...d, [key]: value } : d));
  }

  async function onSave() {
    if (!data) return;
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      const patch: Partial<SiteSEO> = {
        site_name: data.site_name,
        site_url: data.site_url,
        default_locale: data.default_locale,
        default_title: data.default_title,
        title_template: data.title_template,
        default_description: data.default_description,
        default_keywords: data.default_keywords,
        default_og_image: data.default_og_image,
        default_robots: data.default_robots,
        twitter_handle: data.twitter_handle,
        twitter_card: data.twitter_card,
        extra_head_html: data.extra_head_html,
      };
      const updated = await patchSite(patch);
      setData(updated);
      setMsg("Saved.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="SEO · Site defaults"
        title="Site-wide"
        accent="metadata."
        description="Fallback values applied to every page unless that page has its own override. Title template uses %s as the page-title placeholder."
      />
      {err && <Banner kind="error">{err}</Banner>}
      {msg && <Banner kind="ok">{msg}</Banner>}
      {!data ? (
        <Skeleton />
      ) : (
        <>
          <Section title="Identity">
            <FieldGrid>
              <Field label="Site name" value={data.site_name} onChange={(v) => set("site_name", v)} />
              <Field label="Site URL" value={data.site_url} onChange={(v) => set("site_url", v)} placeholder="https://bipevns.org" />
              <Field label="Default locale" value={data.default_locale} onChange={(v) => set("default_locale", v)} placeholder="en_IN" />
              <Field label="Default robots" value={data.default_robots}>
                <select className="admin-select" value={data.default_robots} onChange={(e) => set("default_robots", e.target.value)}>
                  {ROBOTS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
            </FieldGrid>
          </Section>

          <Section title="Meta defaults" description="Used when a page has no specific override.">
            <FieldGrid>
              <Field label="Default title" value={data.default_title} onChange={(v) => set("default_title", v)} full />
              <Field
                label="Title template"
                value={data.title_template}
                onChange={(v) => set("title_template", v)}
                hint="Use %s as the page-title placeholder, e.g. '%s | BIPE'."
                full
              />
              <Field label="Default description" value={data.default_description} onChange={(v) => set("default_description", v)} textarea full />
              <Field label="Default keywords" value={data.default_keywords} onChange={(v) => set("default_keywords", v)} hint="Comma-separated." full />
              <Field label="Default OG image URL" value={data.default_og_image} onChange={(v) => set("default_og_image", v)} placeholder="https://bipevns.org/og.png" full />
            </FieldGrid>
          </Section>

          <Section title="Twitter / X">
            <FieldGrid>
              <Field label="Handle" value={data.twitter_handle} onChange={(v) => set("twitter_handle", v)} placeholder="@bipevns" />
              <Field label="Card type" value={data.twitter_card}>
                <select className="admin-select" value={data.twitter_card} onChange={(e) => set("twitter_card", e.target.value)}>
                  {TWITTER_CARDS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </FieldGrid>
          </Section>

          <Section title="Advanced" description="Raw HTML injected into <head> on every page. Use sparingly.">
            <Field
              label="Extra <head> HTML"
              value={data.extra_head_html}
              onChange={(v) => set("extra_head_html", v)}
              textarea
              full
            />
          </Section>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <PrimaryButton disabled={saving} onClick={onSave}>
              {saving ? "Saving…" : "Save site defaults"}
            </PrimaryButton>
            {data.updated_at && (
              <span style={{ color: "var(--ink-3)", fontSize: 12, fontFamily: "var(--font-mono)" }}>
                Last updated {new Date(data.updated_at).toLocaleString()}
              </span>
            )}
          </div>
        </>
      )}
    </>
  );
}
