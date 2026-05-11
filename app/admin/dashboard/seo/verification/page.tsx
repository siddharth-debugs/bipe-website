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

export default function VerificationPage() {
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
        google_site_verification: data.google_site_verification,
        bing_site_verification: data.bing_site_verification,
        yandex_verification: data.yandex_verification,
        facebook_domain_verification: data.facebook_domain_verification,
        pinterest_verification: data.pinterest_verification,
      };
      const updated = await patchSite(patch);
      setData(updated);
      setMsg("Saved. Re-trigger verification in each console after the next deploy.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="SEO · Domain verification"
        title="Webmaster"
        accent="proofs."
        description="Paste only the content value from each property's HTML meta tag — the surrounding <meta> markup is added automatically."
      />
      {err && <Banner kind="error">{err}</Banner>}
      {msg && <Banner kind="ok">{msg}</Banner>}
      {!data ? (
        <Skeleton />
      ) : (
        <>
          <Section title="Search engines">
            <FieldGrid>
              <Field
                label="Google Search Console"
                value={data.google_site_verification}
                onChange={(v) => set("google_site_verification", v)}
                placeholder="abc123…"
                hint="Search Console → Settings → Ownership → HTML tag → content value."
                full
              />
              <Field
                label="Bing Webmaster Tools"
                value={data.bing_site_verification}
                onChange={(v) => set("bing_site_verification", v)}
                placeholder="xyz789…"
                full
              />
              <Field
                label="Yandex Webmaster"
                value={data.yandex_verification}
                onChange={(v) => set("yandex_verification", v)}
                placeholder="…"
                full
              />
            </FieldGrid>
          </Section>

          <Section title="Other properties">
            <FieldGrid>
              <Field
                label="Facebook / Meta domain verification"
                value={data.facebook_domain_verification}
                onChange={(v) => set("facebook_domain_verification", v)}
                placeholder="…"
                hint="Business Settings → Brand safety → Domains → Verify."
                full
              />
              <Field
                label="Pinterest"
                value={data.pinterest_verification}
                onChange={(v) => set("pinterest_verification", v)}
                placeholder="…"
                full
              />
            </FieldGrid>
          </Section>

          <PrimaryButton disabled={saving} onClick={onSave}>
            {saving ? "Saving…" : "Save verifications"}
          </PrimaryButton>
        </>
      )}
    </>
  );
}
