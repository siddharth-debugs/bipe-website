"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  Banner,
  PrimaryButton,
  Section,
  Skeleton,
} from "@/components/admin/seo/FormBits";
import { getSite, patchSite, prettyJSON, parseJSON, type SiteSEO } from "@/lib/admin/seo";

const ORG_TEMPLATE = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "BIPE Varanasi",
  url: "https://bipevns.org",
  logo: "https://bipevns.org/bipe-logo.svg",
  sameAs: [],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Village Gajokhar, Post Parsara, Phoolpur",
    addressLocality: "Varanasi",
    addressRegion: "UP",
    postalCode: "221206",
    addressCountry: "IN",
  },
};

export default function SchemasPage() {
  const [data, setData] = useState<SiteSEO | null>(null);
  const [orgText, setOrgText] = useState("");
  const [extraText, setExtraText] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    getSite()
      .then((d) => {
        setData(d);
        setOrgText(prettyJSON(d.organization_schema));
        setExtraText(prettyJSON(d.extra_schemas));
      })
      .catch((e) => setErr(e?.message ?? "Failed to load"));
  }, []);

  const orgPreview = useMemo(() => parseJSON(orgText, {}), [orgText]);
  const extraPreview = useMemo(() => parseJSON<unknown[]>(extraText, []), [extraText]);

  const orgError = orgPreview[1];
  const extraError = extraPreview[1];

  async function onSave() {
    if (!data) return;
    if (orgError || extraError) {
      setErr("Fix the JSON errors below before saving.");
      return;
    }
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      const updated = await patchSite({
        organization_schema: orgPreview[0] as Record<string, unknown>,
        extra_schemas: (Array.isArray(extraPreview[0]) ? extraPreview[0] : []) as Record<
          string,
          unknown
        >[],
      });
      setData(updated);
      setMsg("Saved.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function loadOrgTemplate() {
    setOrgText(prettyJSON(ORG_TEMPLATE));
  }

  return (
    <>
      <PageHeader
        eyebrow="SEO · Schemas"
        title="Site-wide"
        accent="JSON-LD."
        description="Structured data emitted on every page. Per-page schemas live on the page's own edit form."
      />
      {err && <Banner kind="error">{err}</Banner>}
      {msg && <Banner kind="ok">{msg}</Banner>}
      {!data ? (
        <Skeleton />
      ) : (
        <>
          <Section
            title="Organization (or EducationalOrganization)"
            description="The single most important JSON-LD object. Helps Google show your knowledge panel."
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 8,
              }}
            >
              <button
                type="button"
                className="admin-btn-soft"
                style={{ padding: "6px 12px", fontSize: 12 }}
                onClick={loadOrgTemplate}
              >
                Load BIPE template
              </button>
            </div>
            <textarea
              className="admin-textarea"
              value={orgText}
              onChange={(e) => setOrgText(e.target.value)}
              rows={16}
              style={{
                width: "100%",
                fontFamily: "var(--font-mono)",
                fontSize: 12.5,
              }}
            />
            {orgError && (
              <div className="admin-field-msg">JSON error: {orgError}</div>
            )}
          </Section>

          <Section
            title="Additional global schemas"
            description="Array of JSON-LD objects (WebSite, BreadcrumbList, FAQPage, etc.). Each one is rendered as its own <script>."
          >
            <textarea
              className="admin-textarea"
              value={extraText}
              onChange={(e) => setExtraText(e.target.value)}
              rows={12}
              placeholder='[\n  { "@context": "https://schema.org", "@type": "WebSite", "name": "BIPE", "url": "https://bipevns.org" }\n]'
              style={{
                width: "100%",
                fontFamily: "var(--font-mono)",
                fontSize: 12.5,
              }}
            />
            {extraError && (
              <div className="admin-field-msg">JSON error: {extraError}</div>
            )}
          </Section>

          <PrimaryButton disabled={saving} onClick={onSave}>
            {saving ? "Saving…" : "Save schemas"}
          </PrimaryButton>
          <p style={{ marginTop: 12, color: "var(--ink-3)", fontSize: 12 }}>
            Tip: validate at{" "}
            <a
              href="https://validator.schema.org/"
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--brand)" }}
            >
              validator.schema.org
            </a>{" "}
            after publishing.
          </p>
        </>
      )}
    </>
  );
}
