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

export default function AnalyticsPage() {
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
        ga4_measurement_id: data.ga4_measurement_id,
        gtm_container_id: data.gtm_container_id,
        google_ads_id: data.google_ads_id,
        facebook_pixel_id: data.facebook_pixel_id,
        hotjar_id: data.hotjar_id,
        microsoft_clarity_id: data.microsoft_clarity_id,
      };
      const updated = await patchSite(patch);
      setData(updated);
      setMsg("Saved. Changes apply on next page load.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="SEO · Analytics & tags"
        title="Tracking"
        accent="& measurement."
        description="IDs entered here are loaded by the public site automatically. Leave blank to skip a particular tag."
      />
      {err && <Banner kind="error">{err}</Banner>}
      {msg && <Banner kind="ok">{msg}</Banner>}
      {!data ? (
        <Skeleton />
      ) : (
        <>
          <Section title="Google" description="GA4 + Tag Manager + Ads conversion.">
            <FieldGrid>
              <Field
                label="GA4 measurement ID"
                value={data.ga4_measurement_id}
                onChange={(v) => set("ga4_measurement_id", v)}
                placeholder="G-XXXXXXXXXX"
                hint="From GA4 → Admin → Data streams."
              />
              <Field
                label="GTM container ID"
                value={data.gtm_container_id}
                onChange={(v) => set("gtm_container_id", v)}
                placeholder="GTM-XXXXXXX"
                hint="If set, GA4 is usually managed inside GTM."
              />
              <Field
                label="Google Ads conversion ID"
                value={data.google_ads_id}
                onChange={(v) => set("google_ads_id", v)}
                placeholder="AW-XXXXXXXXX"
              />
            </FieldGrid>
          </Section>

          <Section title="Other vendors">
            <FieldGrid>
              <Field
                label="Meta (Facebook) Pixel ID"
                value={data.facebook_pixel_id}
                onChange={(v) => set("facebook_pixel_id", v)}
                placeholder="123456789012345"
              />
              <Field
                label="Hotjar site ID"
                value={data.hotjar_id}
                onChange={(v) => set("hotjar_id", v)}
                placeholder="1234567"
              />
              <Field
                label="Microsoft Clarity project ID"
                value={data.microsoft_clarity_id}
                onChange={(v) => set("microsoft_clarity_id", v)}
                placeholder="abcdefghij"
                full
              />
            </FieldGrid>
          </Section>

          <PrimaryButton disabled={saving} onClick={onSave}>
            {saving ? "Saving…" : "Save tracking IDs"}
          </PrimaryButton>
        </>
      )}
    </>
  );
}
