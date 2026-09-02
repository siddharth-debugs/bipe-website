import type { Metadata } from "next";
import Link from "next/link";
import { DATA } from "@/lib/data";
import { SITE_URL } from "@/lib/routes";
import { ArrowIcon } from "@/components/shell/Icons";

/**
 * /campus/phoolpur — geo-hub page targeting:
 *   "polytechnic in Phoolpur", "polytechnic colleges in Phoolpur",
 *   "how to reach BIPE", "Varanasi Cantt to Phoolpur BIPE",
 *   "Phoolpur Varanasi 221206", "PG near BIPE Phoolpur".
 *
 * Location facts are sourced from existing site pages:
 *   - /visit       — verified distance numbers (LBS Airport 14.1 km,
 *                    Khalishpur Rail 1.8 km, NH-56 access)
 *   - /contact     — embed URL and directions link, "Phoolpur–Parsara road"
 *   - /admission-from-bihar — "~35 minutes from Varanasi Junction by road"
 *   - lib/data.ts — address, phone, WhatsApp, AICTE/BTEUP/AISHE identifiers
 *
 * Don't add new claims (distance numbers, transport modes, PG lists) here
 * without grounding them in those pages — otherwise the site contradicts
 * itself across pages, which is one of the things the May 2026 SEO audit
 * specifically flagged as an E-E-A-T risk.
 */
const PATH = "/campus/phoolpur";
const CANONICAL = `${SITE_URL}${PATH}`;
const MAPS_DIRECTIONS = "https://www.google.com/maps/search/?api=1&query=BIPE+Phoolpur+Varanasi";
const MAPS_EMBED = "https://maps.google.com/maps?q=BIPE+Phoolpur+Varanasi&t=&z=15&ie=UTF8&iwloc=&output=embed";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Polytechnic in Phoolpur · BIPE Varanasi Campus | Directions & Map";
  const description =
    "BIPE — the AICTE-approved polytechnic in Phoolpur, Varanasi. 6-acre campus on the Phoolpur–Parsara road, off NH-56. Khalishpur Railway Station 1.8 km, LBS Airport 14.1 km, ~35 min auto from Varanasi Cantt.";
  return {
    title,
    description,
    alternates: {
      canonical: PATH,
      // en-IN only — see comment in lib/seo.ts. The site has no SSR
      // Hindi variant; declaring hi-IN here would be hreflang-lying.
      languages: { "en-IN": PATH },
    },
    openGraph: {
      title,
      description,
      url: CANONICAL,
      siteName: "BIPE",
      type: "website",
      locale: "en_IN",
      images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-default.png`],
    },
  };
}

const TRANSPORT: { mode: string; place: string; distance: string; body: string }[] = [
  {
    mode: "By rail · nearest",
    place: "Khalishpur Railway Station",
    distance: "1.8 km",
    body: "The closest station to campus — 15 minutes on foot or a 5-minute auto. Good for short-distance trains within the eastern UP region.",
  },
  {
    mode: "By rail · long distance",
    place: "Varanasi Cantt / Banaras (Manduadih)",
    distance: "~14 km · ~35 min by auto",
    body: "All major north / south / east / west express trains stop here. App-cabs (Ola / Uber) and pre-paid autos from the station auto-stand reach Phoolpur in about 35 minutes off-peak. Confirm your visit on WhatsApp and we'll send the campus pin to your driver.",
  },
  {
    mode: "By air",
    place: "Lal Bahadur Shastri International Airport",
    distance: "14.1 km",
    body: "Direct flights from Delhi, Mumbai, Bengaluru and Kolkata. Pre-paid taxis and autos at arrivals reach Phoolpur in about 35 minutes off-peak.",
  },
  {
    mode: "By road",
    place: "NH-56 · Varanasi → Phoolpur",
    distance: "Highway access",
    body: "NH-56 runs through Phoolpur, with the campus on the Parsara approach road — easy by car or bike. Travel guidance from Varanasi Cantt on request.",
  },
];

const LIVING: { title: string; body: string }[] = [
  {
    title: "On-campus boys' hostel",
    body: "A boys' hostel block on the Phoolpur campus — resident warden, 24×7 security, pure-vegetarian on-campus mess. Confirm your hostel slot at the time of fee payment; out-of-state applicants are prioritised.",
  },
  {
    title: "PG and rented accommodation",
    body: "For day-scholar girl students and families looking for rooms near campus, several PGs and rentals exist along the Phoolpur–Parsara road and in adjoining villages. Talk to admissions on WhatsApp before counselling and BIPE will share verified local contacts.",
  },
  {
    title: "Climate and rhythm",
    body: "Hot summers (April–June, 35–42 °C), monsoon (July–September), pleasant winters (November–February, 8–22 °C). Phoolpur is a small town — quieter than central Varanasi, with daily markets, tea stalls, basic clinics and reliable mobile coverage from all major operators.",
  },
  {
    title: "Distance to the city",
    body: "About 35 minutes by road from Varanasi city, the ghats and Kashi Vishwanath. Easy day-trip access for festivals, family visits and the wider Varanasi student culture without the traffic and rent of central neighbourhoods.",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Where exactly is BIPE in Phoolpur?",
    a: `BIPE is at ${DATA.contact.address}. The campus sits on the Phoolpur–Parsara road, off NH-56, with the closest railway station being Khalishpur (1.8 km).`,
  },
  {
    q: "How do I get to BIPE from Varanasi Cantt?",
    a: "Confirm your visit on WhatsApp (+91-7310077788) and BIPE will share the campus pin and easiest route. An app-cab (Ola / Uber) or pre-paid auto from the station auto-stand reaches Phoolpur in about 35 minutes off-peak — roughly ₹300-500.",
  },
  {
    q: "Is the Phoolpur campus the only BIPE location?",
    a: "Yes — BIPE has a single 6-acre campus in Phoolpur, Varanasi. All five BTEUP-affiliated branches (CSE, Civil, Electrical, Mechanical Engineering Production and the rare Dairy Engineering) are taught here.",
  },
  {
    q: "Are there hostels and PGs around BIPE?",
    a: "Yes. BIPE runs a boys' hostel on campus with a resident warden and on-campus mess. For day-scholar girl students or families, several PGs and rentals exist along the Phoolpur–Parsara road. Admissions can share verified local contacts on WhatsApp.",
  },
  {
    q: "What's the pincode for the BIPE Phoolpur campus?",
    a: "221206 — Gajokhar, Phoolpur, Varanasi, Uttar Pradesh 221206. Useful when filling JEECUP forms, ordering deliveries, or sharing the address with parents.",
  },
];

const placeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Place",
  "@id": `${CANONICAL}#place`,
  name: "BIPE — Phoolpur Campus, Varanasi",
  description:
    "AICTE-approved polytechnic on a 6-acre campus in Phoolpur, Varanasi. AICTE permanent ID 1-488233171, BTEUP code 4455.",
  url: CANONICAL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Gajokhar, Phoolpur",
    addressLocality: "Varanasi",
    postalCode: "221206",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  },
  containedInPlace: { "@type": "AdministrativeArea", name: "Varanasi district, Uttar Pradesh" },
  hasMap: MAPS_DIRECTIONS,
  isAccessibleForFree: true,
  publicAccess: true,
  smokingAllowed: false,
  telephone: DATA.contact.phone,
  sameAs: `${SITE_URL}#org`,
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Campus", item: `${SITE_URL}/campus` },
    { "@type": "ListItem", position: 3, name: "Phoolpur", item: CANONICAL },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Page() {
  return (
    <article className="page-enter">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(placeJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: 80, paddingBottom: 32 }}>
        <div className="container">
          <nav aria-label="Breadcrumb" style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-2)", marginBottom: 24 }}>
            <Link href="/" style={{ color: "inherit" }}>Home</Link>
            <span style={{ margin: "0 8px", opacity: 0.5 }}>/</span>
            <Link href="/campus" style={{ color: "inherit" }}>Campus</Link>
            <span style={{ margin: "0 8px", opacity: 0.5 }}>/</span>
            <span style={{ color: "var(--brand)" }}>Phoolpur</span>
          </nav>

          <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div className="eyebrow">Phoolpur · Varanasi 221206</div>
              <h1 className="bipe-h1" style={{ marginTop: 18, maxWidth: "22ch" }}>
                A <span className="serif" style={{ color: "var(--brand)", fontStyle: "italic", fontWeight: 400 }}>polytechnic</span> in Phoolpur, Varanasi.
              </h1>
              <p className="lead" style={{ marginTop: 22, maxWidth: "58ch" }}>
                BIPE has been an AICTE-approved polytechnic in Phoolpur, Varanasi, since {DATA.contact.aicte ? "2010" : "the institution's founding"} — six acres on the Phoolpur–Parsara road, off NH-56. Khalishpur Railway Station is 1.8 km away, LBS Airport 14.1 km, and Varanasi Cantt is a 35-minute auto / app-cab ride. AICTE permanent ID {DATA.contact.aicte}, BTEUP code {DATA.contact.jeecup}.
              </p>
              <div className="row" style={{ marginTop: 28, gap: 12, flexWrap: "wrap" }}>
                <Link href="/visit" className="btn btn-primary">Book a campus visit <ArrowIcon /></Link>
                <a href={MAPS_DIRECTIONS} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Get directions <ArrowIcon /></a>
              </div>
            </div>

            <div className="card" style={{ padding: 28, background: "color-mix(in oklab, var(--brand) 8%, var(--white))" }}>
              <div className="eyebrow" style={{ color: "var(--brand)" }}>Address</div>
              <div style={{ marginTop: 14, fontSize: 16, lineHeight: 1.7, fontWeight: 500 }}>
                Gajokhar, Phoolpur,<br />
                Varanasi, Uttar Pradesh 221206
              </div>
              <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--line)", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.08em", color: "var(--ink-2)" }}>
                <div>AICTE · {DATA.contact.aicte}</div>
                <div style={{ marginTop: 6 }}>BTEUP · 4455 ({DATA.contact.bteup.replace("Affiliated · ", "")})</div>
                <div style={{ marginTop: 6 }}>JEECUP · {DATA.contact.jeecup}</div>
                <div style={{ marginTop: 6 }}>Phone · {DATA.contact.phone}</div>
              </div>
            </div>
          </div>

          {/* Quick fact strip */}
          <div className="card" style={{ marginTop: 48, padding: 28, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {[
              { num: "6", l: "Acres · single boundary" },
              { num: "1.8 km", l: "Khalishpur railway station" },
              { num: "14.1 km", l: "LBS Varanasi airport" },
              { num: "NH-56", l: "Highway access · Parsara road" },
            ].map((s) => (
              <div key={s.l}>
                <div className="serif" style={{ fontStyle: "italic", fontWeight: 400, fontSize: 36, color: "var(--brand)", lineHeight: 0.95 }}>
                  {s.num}
                </div>
                <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-2)" }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How to reach ─────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">Getting here</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "22ch" }}>
            How to reach BIPE <span className="serif">in Phoolpur.</span>
          </h2>
          <p className="lead" style={{ marginTop: 18, maxWidth: "60ch" }}>
            Whether you&apos;re coming from inside Varanasi, from elsewhere in UP, or by air or long-distance train from another state, here&apos;s how to land at the BIPE campus.
          </p>
          <div className="grid" style={{ marginTop: 32, gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {TRANSPORT.map((t) => (
              <div key={t.mode} className="card" style={{ padding: 24 }}>
                <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                  <div className="eyebrow" style={{ color: "var(--brand)" }}>{t.mode}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", color: "var(--ink-2)" }}>{t.distance}</div>
                </div>
                <div style={{ marginTop: 12, fontWeight: 600, fontSize: 16 }}>{t.place}</div>
                <p style={{ marginTop: 10, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.6 }}>{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Visit-the-campus callout ─────────────────────────────── */}
      {/* 28 May 2026 — refactored from a "Free shuttle · On us." brand
          banner to an honest "easy to reach" callout. BIPE does not
          run a free shuttle service; the previous banner over-claimed
          a free pickup. Distance + auto-cab guidance is the truth. */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 40, background: "var(--brand)", color: "#fff" }}>
            <div className="bipe-split" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32, alignItems: "center" }}>
              <div>
                <div className="eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>Visit the campus</div>
                <h2 className="bipe-h1" style={{ color: "#fff", marginTop: 14, maxWidth: "20ch" }}>
                  35 minutes from Varanasi Cantt. <span className="serif">By road.</span>
                </h2>
                <p style={{ marginTop: 18, opacity: 0.85, maxWidth: "52ch", lineHeight: 1.7 }}>
                  Book a Saturday slot — confirm on WhatsApp and we&rsquo;ll send the campus pin to your driver. App-cab from Varanasi Cantt is roughly ₹300-500. Walk the labs, meet current students, eat at the mess, talk to faculty. Bring your parents — that&rsquo;s the visit we expect.
                </p>
                <div className="row" style={{ marginTop: 24, gap: 12, flexWrap: "wrap" }}>
                  <Link href="/visit" className="btn btn-primary" style={{ background: "#fff", color: "var(--brand)" }}>Book a visit <ArrowIcon /></Link>
                  <a href={DATA.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}>WhatsApp the team <ArrowIcon /></a>
                </div>
              </div>
              <div style={{ paddingLeft: 32, borderLeft: "1px solid rgba(255,255,255,0.2)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.7 }}>Visit hours</div>
                <div style={{ marginTop: 8, fontSize: 16, lineHeight: 1.7 }}>Monday–Saturday<br />09:00 — 17:00 IST</div>
                <div style={{ marginTop: 22, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.7 }}>Front desk</div>
                <div style={{ marginTop: 8, fontSize: 16 }}>{DATA.contact.phone}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Living in Phoolpur ───────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">Living in Phoolpur</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "20ch" }}>
            What life looks like <span className="serif">around campus.</span>
          </h2>
          <div className="grid" style={{ marginTop: 32, gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {LIVING.map((l) => (
              <div key={l.title} className="card" style={{ padding: 24 }}>
                <div style={{ fontWeight: 600, fontSize: 17 }}>{l.title}</div>
                <p style={{ marginTop: 12, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.7 }}>{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Map embed ────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">On the map</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "20ch" }}>
            Find us in <span className="serif">Phoolpur.</span>
          </h2>
          <div style={{ marginTop: 32, borderRadius: 18, overflow: "hidden", border: "1px solid var(--line)", aspectRatio: "16/9", background: "var(--ink-soft, #eef1f6)" }}>
            <iframe
              title="BIPE Phoolpur, Varanasi — Google Map"
              src={MAPS_EMBED}
              style={{ width: "100%", height: "100%", border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <a href={MAPS_DIRECTIONS} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Open in Google Maps <ArrowIcon /></a>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="eyebrow">FAQ · Phoolpur campus</div>
          <h2 className="bipe-h1" style={{ marginTop: 14, maxWidth: "20ch" }}>
            Asked <span className="serif">& answered.</span>
          </h2>
          <div style={{ marginTop: 32, maxWidth: 800 }}>
            {FAQS.map((f) => (
              <details key={f.q} style={{ borderTop: "1px solid var(--line)", padding: "20px 0" }}>
                <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: 16, listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {f.q}
                  <span style={{ marginLeft: 12, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--brand)" }}>+</span>
                </summary>
                <p style={{ marginTop: 12, color: "var(--ink-2)", lineHeight: 1.7 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Closing CTA ──────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 40, textAlign: "center" }}>
            <h2 className="bipe-h1" style={{ maxWidth: "22ch", margin: "0 auto" }}>
              Come see the campus. <span className="serif">Bring your parents.</span>
            </h2>
            <p style={{ marginTop: 18, color: "var(--ink-2)", maxWidth: "52ch", margin: "18px auto 0", lineHeight: 1.7 }}>
              The Phoolpur campus is open Monday to Saturday. WhatsApp the team to confirm your day — we&apos;ll send the campus pin to your driver and help you arrange a cab from Varanasi Cantt if you need one.
            </p>
            <div className="row" style={{ marginTop: 28, gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/visit" className="btn btn-primary">Book a visit <ArrowIcon /></Link>
              <Link href="/apply" className="btn btn-ghost">Apply for 2026-27 <ArrowIcon /></Link>
              <Link href="/campus" className="btn btn-ghost">All facilities <ArrowIcon /></Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
