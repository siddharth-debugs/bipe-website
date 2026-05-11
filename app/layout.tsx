import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { LangProvider } from "@/lib/lang";
import { ConditionalChrome } from "@/components/shell/ConditionalChrome";
import { ROUTES, SITE_URL } from "@/lib/routes";
import { DATA } from "@/lib/data";
import { getSeoBundle } from "@/lib/seo";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans-next", display: "swap" });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif-next", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono-next", display: "swap" });

/**
 * Static fallback JSON-LD — used only if the backend has no
 * organization_schema configured (or is unreachable).
 */
const fallbackOrgJsonLd: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollegeOrUniversity",
      "@id": `${SITE_URL}#org`,
      name: "Banaras Institute of Polytechnic & Engineering",
      alternateName: ["BIPE", "BIPE Varanasi", "Banaras Institute of Polytechnic and Engineering"],
      url: SITE_URL,
      logo: `${SITE_URL}/bipe-logo.svg`,
      image: `${SITE_URL}/bipe-logo.svg`,
      foundingDate: "2010",
      slogan: "Engineering education that changes lives in Eastern UP — since 2010.",
      areaServed: { "@type": "AdministrativeArea", name: "Eastern Uttar Pradesh" },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Village Gajokhar, Post Parsara, Phoolpur",
        addressLocality: "Varanasi",
        postalCode: "221206",
        addressRegion: "Uttar Pradesh",
        addressCountry: "IN",
      },
      telephone: DATA.contact.phone,
      email: DATA.contact.email,
      identifier: [
        { "@type": "PropertyValue", propertyID: "AICTE Permanent ID", value: DATA.contact.aicte },
        { "@type": "PropertyValue", propertyID: "JEECUP Code", value: DATA.contact.jeecup },
        { "@type": "PropertyValue", propertyID: "BTEUP", value: "Affiliated · 4455" },
        { "@type": "PropertyValue", propertyID: "ISO", value: "9001:2015" },
      ],
      department: DATA.branches.map((b) => ({
        "@type": "EducationalOrganization",
        name: `Department of ${b.name}`,
        identifier: b.code,
      })),
      sameAs: DATA.social.map((s) => s.url),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: "BIPE",
      inLanguage: ["en-IN", "hi-IN"],
      publisher: { "@id": `${SITE_URL}#org` },
    },
    ...DATA.branches.map((b) => ({
      "@type": "Course",
      "@id": `${SITE_URL}/courses#${b.slug}`,
      name: `Diploma in ${b.name}`,
      description: b.desc,
      courseCode: b.code,
      provider: { "@id": `${SITE_URL}#org` },
      educationalCredentialAwarded: "Diploma in Engineering (3-year, BTEUP)",
      inLanguage: ["en-IN", "hi-IN"],
    })),
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const bundle = await getSeoBundle("/");

  const verificationOther: Record<string, string> = {};
  if (bundle?.verification.bing) verificationOther["msvalidate.01"] = bundle.verification.bing;
  if (bundle?.verification.facebook)
    verificationOther["facebook-domain-verification"] = bundle.verification.facebook;
  if (bundle?.verification.pinterest) verificationOther["p:domain_verify"] = bundle.verification.pinterest;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: bundle?.title || ROUTES.home.title,
      template: bundle?.site.title_template?.replace("%s", "%s") || "%s",
    },
    description: bundle?.description || ROUTES.home.description,
    alternates: {
      canonical: "/",
      languages: {
        "en-IN": "/",
        "hi-IN": "/?lang=hi",
      },
    },
    openGraph: {
      title: bundle?.og.title || ROUTES.home.title,
      description: bundle?.og.description || ROUTES.home.description,
      url: SITE_URL,
      siteName: bundle?.og.site_name || "BIPE",
      type: "website",
      locale: bundle?.og.locale || "en_IN",
      images: bundle?.og.image ? [{ url: bundle.og.image }] : undefined,
    },
    twitter: {
      card: (bundle?.twitter.card as "summary_large_image") || "summary_large_image",
      site: bundle?.twitter.site || undefined,
    },
    icons: {
      icon: [{ url: "/bipe-logo.svg", type: "image/svg+xml" }],
      shortcut: "/bipe-logo.svg",
      apple: "/bipe-logo.svg",
    },
    verification: {
      google: bundle?.verification.google || undefined,
      yandex: bundle?.verification.yandex || undefined,
      other: Object.keys(verificationOther).length ? verificationOther : undefined,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const bundle = await getSeoBundle("/");

  const orgSchemas =
    bundle?.schemas && bundle.schemas.length > 0 ? bundle.schemas : [fallbackOrgJsonLd];

  const a = bundle?.analytics;
  const ga4 = a?.ga4_measurement_id?.trim();
  const gtm = a?.gtm_container_id?.trim();
  const ads = a?.google_ads_id?.trim();
  const pixel = a?.facebook_pixel_id?.trim();
  const hotjar = a?.hotjar_id?.trim();
  const clarity = a?.microsoft_clarity_id?.trim();

  return (
    <html lang="en">
      <head>
        {/* GTM (head) */}
        {gtm && (
          <Script id="bipe-gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
          </Script>
        )}
        {/* GA4 (only if GTM is NOT configured — GTM usually owns GA4) */}
        {!gtm && ga4 && (
          <>
            <Script
              id="bipe-ga4-src"
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`}
              strategy="afterInteractive"
            />
            <Script id="bipe-ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${ga4}');${ads ? ` gtag('config', '${ads}');` : ""}`}
            </Script>
          </>
        )}
        {/* Meta (Facebook) Pixel */}
        {pixel && (
          <Script id="bipe-fbpixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`}
          </Script>
        )}
        {/* Hotjar */}
        {hotjar && (
          <Script id="bipe-hotjar" strategy="afterInteractive">
            {`(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${hotjar},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
          </Script>
        )}
        {/* Microsoft Clarity */}
        {clarity && (
          <Script id="bipe-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${clarity}");`}
          </Script>
        )}
        {/* Raw extra head HTML (set in SEO admin → Site defaults → Advanced) */}
        {bundle?.extra_head_html ? (
          <span dangerouslySetInnerHTML={{ __html: bundle.extra_head_html }} />
        ) : null}
      </head>
      <body className={`${geist.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}>
        {/* GTM noscript fallback (body) */}
        {gtm && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtm}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        {/* JSON-LD: Organization + extra schemas (from backend), else fallback. */}
        {orgSchemas.map((schema, i) => (
          <Script
            key={`bipe-jsonld-${i}`}
            id={`bipe-jsonld-${i}`}
            type="application/ld+json"
            strategy="afterInteractive"
          >
            {JSON.stringify(schema)}
          </Script>
        ))}

        <LangProvider>
          <ConditionalChrome>{children}</ConditionalChrome>
        </LangProvider>
      </body>
    </html>
  );
}
