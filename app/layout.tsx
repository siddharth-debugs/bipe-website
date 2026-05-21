import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { LangProvider } from "@/lib/lang";
import { ConditionalChrome } from "@/components/shell/ConditionalChrome";
import { ROUTES, SITE_URL } from "@/lib/routes";
import { DATA } from "@/lib/data";
import { Analytics } from "@vercel/analytics/next";
import { getContact, getBranchesMapped } from "@/lib/content";
import type { Branch } from "@/lib/data";
import type { PublicContact } from "@/lib/content";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans-next", display: "swap" });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif-next", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono-next", display: "swap" });

/**
 * Site-wide JSON-LD — Organization + WebSite + per-branch Course schemas.
 * Rendered as plain <script> tags in the SSR <head> so non-JS crawlers
 * (Perplexity, ChatGPT-Bot, Anthropic ClaudeBot, Googlebot's first pass)
 * see the structured data without needing client hydration.
 */
/**
 * Build the site-wide JSON-LD payload from live data.
 *
 * Was a module-init constant pinned to DATA.branches and DATA.contact —
 * meaning admin edits to either silently never reached the schema.org
 * payload search engines consume. Lifted into a function called from
 * the async RootLayout so the same getContact() / getBranchesMapped()
 * helpers that power the rest of the site keep the JSON-LD honest.
 *
 * Falls back to DATA.* via the helpers' own resilience contracts.
 */
function buildOrgJsonLd(branches: Branch[], contact: PublicContact): Record<string, unknown> {
  const social = [
    contact.facebook_url, contact.instagram_url, contact.youtube_url,
    contact.x_url, contact.linkedin_url,
  ].filter(Boolean);
  // Fall back to DATA.social if no live social URLs come down at all
  // (e.g. backend bundle empty).
  const sameAs = social.length > 0 ? social : DATA.social.map((s) => s.url);

  return {
  "@context": "https://schema.org",
  "@graph": [
    {
      // Multi-typed: CollegeOrUniversity (entity class) + LocalBusiness
      // (for local-pack / Maps eligibility) + EducationalOrganization
      // (for academic-property eligibility). May 2026 keyword research
      // showed Google sometimes confused BIPE with "government
      // polytechnic Varanasi" — adding LocalBusiness + explicit
      // "private" framing in description should resolve the mix-up.
      "@type": ["CollegeOrUniversity", "LocalBusiness", "EducationalOrganization"],
      "@id": `${SITE_URL}#org`,
      name: "Banaras Institute of Polytechnic & Engineering",
      alternateName: ["BIPE", "BIPE Varanasi", "Banaras Institute of Polytechnic and Engineering"],
      description:
        "Private, AICTE-approved polytechnic college in Varanasi (Uttar Pradesh, India). " +
        "BTEUP-affiliated diploma engineering across five branches — Civil, Computer Science & Engineering, " +
        "Dairy, Electrical, and Mechanical (Production). JEECUP institute code 4455. " +
        "Founded 2010 by the Purwanchal Educational Trust; AFRC-approved tuition ₹30,150 / academic year. " +
        "Not a government institution — privately funded, publicly accountable through AICTE / BTEUP / AISHE.",
      url: SITE_URL,
      logo: `${SITE_URL}/bipe-logo.svg`,
      image: `${SITE_URL}/bipe-logo.svg`,
      foundingDate: "2010",
      founder: {
        "@type": "Organization",
        name: "Purwanchal Educational Trust",
      },
      slogan: "Engineering education that changes lives in Eastern UP — since 2010.",
      keywords: [
        "polytechnic college in Varanasi",
        "AICTE-approved polytechnic",
        "diploma engineering Varanasi",
        "BTEUP affiliated polytechnic",
        "private polytechnic Phoolpur",
        "JEECUP 4455",
      ].join(", "),
      areaServed: { "@type": "AdministrativeArea", name: "Eastern Uttar Pradesh" },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Village Gajokhar, Post Parsara, Phoolpur",
        addressLocality: "Varanasi",
        postalCode: "221206",
        addressRegion: "Uttar Pradesh",
        addressCountry: "IN",
      },
      // Geo coordinates from a GPS-tagged BIPE admission-desk photo
      // shot on the Phoolpur campus, May 2026.
      geo: {
        "@type": "GeoCoordinates",
        latitude: 25.53203,
        longitude: 82.84361,
      },
      hasMap: "https://www.google.com/maps/search/?api=1&query=BIPE+Phoolpur+Varanasi",
      telephone: contact.phone || DATA.contact.phone,
      email: contact.email || DATA.contact.email,
      // LocalBusiness fields — office hours for admissions / front desk.
      // Mon-Sat 9am-5pm is the institute's regular office cadence.
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "09:00",
          closes: "17:00",
        },
      ],
      // Tuition fee as the LocalBusiness priceRange anchor (academic
      // fee, not a transactional purchase). Helps the local pack
      // surface "polytechnic fees" SERP context.
      priceRange: "INR 30,150 / academic year (AFRC-approved tuition)",
      identifier: [
        { "@type": "PropertyValue", propertyID: "AICTE Permanent ID", value: contact.aicte_id || DATA.contact.aicte },
        { "@type": "PropertyValue", propertyID: "JEECUP Code", value: contact.jeecup_code || DATA.contact.jeecup },
        { "@type": "PropertyValue", propertyID: "BTEUP", value: "Affiliated · 4455" },
        { "@type": "PropertyValue", propertyID: "AISHE", value: "Registered" },
      ],
      // accreditedBy — Phase 1.5 strategy (May 2026). BTE UP and AICTE
      // are the institute's two formal accrediting bodies; surfacing
      // them as explicit `accreditedBy` references (separate from the
      // identifier PropertyValue rows above) gives Google a cleaner
      // entity link to the boards' own knowledge-graph entries and
      // strengthens E-E-A-T trust signals for the YMYL education
      // vertical.
      accreditedBy: [
        {
          "@type": "EducationalOrganization",
          name: "Board of Technical Education, Uttar Pradesh (BTE UP)",
          url: "https://bteup.ac.in/",
        },
        {
          "@type": "EducationalOrganization",
          name: "All India Council for Technical Education (AICTE)",
          url: "https://www.aicte-india.org/",
        },
      ],
      department: branches.map((b) => ({
        "@type": "EducationalOrganization",
        name: `Department of ${b.name}`,
        identifier: b.code,
      })),
      sameAs,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: "BIPE",
      alternateName: "Banaras Institute of Polytechnic & Engineering",
      inLanguage: ["en-IN"],
      publisher: { "@id": `${SITE_URL}#org` },
      dateModified: new Date().toISOString().slice(0, 10),
      // SearchAction enables Google's "sitelinks searchbox" rich
      // result under branded SERP entries — the search field that
      // appears below a site's main listing for "site:domain.com"
      // and major brand queries. Backed by the real /search route
      // (app/search/page.tsx + SearchClient.tsx) — without that,
      // declaring SearchAction would be hreflang-lying.
      // Added 2026-05-20 alongside the /search page.
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    ...branches.map((b) => ({
      "@type": "Course",
      "@id": `${SITE_URL}/courses#${b.slug}`,
      name: `Diploma in ${b.name}`,
      description: b.desc,
      courseCode: b.code,
      provider: { "@id": `${SITE_URL}#org` },
      educationalCredentialAwarded: "Diploma in Engineering (3-year, BTEUP)",
      inLanguage: ["en-IN"],
    })),
  ],
  };
}

const OG_IMAGE = {
  url: `${SITE_URL}/og-default.png`,
  width: 1200,
  height: 630,
  alt: ROUTES.home.title,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: ROUTES.home.title,
    template: "%s",
  },
  description: ROUTES.home.description,
  alternates: {
    canonical: "/",
    languages: { "en-IN": "/" },
  },
  robots: { index: true, follow: true },
  // Backup ownership verification for the GSC URL-prefix property
  // (https://www.bipevns.org/). The Domain property bipevns.org is
  // verified via DNS TXT on Wix; this <meta> gives a second,
  // code-side verification path so we don't lose GSC access if the
  // DNS record gets edited by mistake.
  verification: {
    google: "OZV4dGpmUItyv5MzDzQ7WxFZDyhNja62R_rP1joizYY",
  },
  openGraph: {
    title: ROUTES.home.title,
    description: ROUTES.home.description,
    url: SITE_URL,
    siteName: "BIPE",
    type: "website",
    locale: "en_IN",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: ROUTES.home.title,
    description: ROUTES.home.description,
    images: [OG_IMAGE.url],
  },
  icons: {
    icon: [{ url: "/bipe-logo.svg", type: "image/svg+xml" }],
    shortcut: "/bipe-logo.svg",
    apple: "/bipe-logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#283e7a",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Server-fetch live contact + branches once per request. Both feed
  // the JSON-LD payload (kept honest with admin edits) and the live
  // contact info is also threaded through ConditionalChrome → Footer.
  // Falls back to DATA.* are inside each helper.
  const [liveContact, liveBranches] = await Promise.all([
    getContact(),
    getBranchesMapped(),
  ]);
  const footerContact = {
    phone: liveContact.phone,
    phone2: liveContact.phone2,
    email: liveContact.email,
    whatsapp: liveContact.whatsapp_url,
    address: liveContact.address,
    jeecup: liveContact.jeecup_code,
    aicte: liveContact.aicte_id,
  };
  const orgJsonLd = buildOrgJsonLd(liveBranches, liveContact);
  return (
    <html lang="en">
      <head>
        {/*
          Preconnect hints (Phase 2 SEO audit May 2026 — BIPE had 0
          preconnects vs BITE's 4). Tells the browser to begin DNS
          resolution + TCP/TLS handshake to these third-party origins
          early, so when the actual requests fire later (Cloudinary
          images, Vercel analytics beacons), the handshake is already
          done.

          Cloudinary is the highest-value preconnect — every above-the-
          fold image on Home, /about, /campus, /placements comes from
          res.cloudinary.com, and shaving the handshake off the
          critical path materially helps LCP.

          crossOrigin="anonymous" is correct for Cloudinary (it serves
          assets without credentials and CORS-enabled). Vercel's
          beacons set their own CORS so we don't need crossOrigin there.
        */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
        <link rel="preconnect" href="https://vitals.vercel-insights.com" />

        <script
          type="application/ld+json"
          // dangerouslySetInnerHTML is intentional — schema built from typed sources, no user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className={`${geist.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}>
        <LangProvider>
          <ConditionalChrome contact={footerContact}>{children}</ConditionalChrome>
        </LangProvider>
        <Analytics />
      </body>
    </html>
  );
}
