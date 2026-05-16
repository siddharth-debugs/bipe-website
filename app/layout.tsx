import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { LangProvider } from "@/lib/lang";
import { ConditionalChrome } from "@/components/shell/ConditionalChrome";
import { ROUTES, SITE_URL } from "@/lib/routes";
import { DATA } from "@/lib/data";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans-next", display: "swap" });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif-next", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono-next", display: "swap" });

/**
 * Site-wide JSON-LD — Organization + WebSite + per-branch Course schemas.
 * Rendered as plain <script> tags in the SSR <head> so non-JS crawlers
 * (Perplexity, ChatGPT-Bot, Anthropic ClaudeBot, Googlebot's first pass)
 * see the structured data without needing client hydration.
 */
const ORG_JSON_LD: Record<string, unknown> = {
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
        { "@type": "PropertyValue", propertyID: "AISHE", value: "Registered" },
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
      inLanguage: ["en-IN"],
      publisher: { "@id": `${SITE_URL}#org` },
      dateModified: new Date().toISOString().slice(0, 10),
    },
    ...DATA.branches.map((b) => ({
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          // dangerouslySetInnerHTML is intentional — schema built from typed sources, no user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
      </head>
      <body className={`${geist.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}>
        <LangProvider>
          <ConditionalChrome>{children}</ConditionalChrome>
        </LangProvider>
      </body>
    </html>
  );
}
