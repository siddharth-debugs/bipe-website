/**
 * Server-side content bundle fetcher.
 *
 * The Next.js public pages call ``getContent()`` during SSR (or via the
 * App Router's request memoisation) to merge ``DATA.*`` static fallback
 * with admin-edited rows from the Django backend.
 *
 * Same resilience contract as ``getSeoBundle()`` — if the backend is
 * unreachable, every helper returns the static fallback so the site
 * never breaks on a CMS hiccup.
 */

import { DATA, BRANCH_CLOSURES } from "@/lib/data";

const BACKEND_BASE =
  process.env.BIPE_BACKEND_URL?.trim().replace(/\/+$/, "") ||
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, "") ||
  "http://127.0.0.1:8000/api/v1";

// ─── Bundle shape (mirrors content.views.public_bundle) ──────────────

export interface PublicEvent {
  id: number;
  date: string;
  tag: string;
  title: string;
  body: string;
  link_url: string;
  image_url: string;
  is_published: boolean;
  sort_order: number;
}
export interface PublicTestimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  language: "en" | "hi" | "mix";
  photo_url: string;
  year_passed: number | null;
}
export interface PublicFaculty {
  id: number;
  name: string;
  designation: string;
  department: string;
  qualifications: string;
  experience_years: number | null;
  bio: string;
  photo_url: string;
  email: string;
  linkedin_url: string;
  is_principal: boolean;
  is_hod: boolean;
}
export interface PublicRecruiter {
  id: number;
  name: string;
  logo_url: string;
  website_url: string;
  tier: "flagship" | "regular" | "alumni";
  alumni_count: number;
  blurb: string;
}
export interface PublicBranch {
  id: number;
  code: string;
  slug: string;
  name: string;
  name_hi: string;
  seats: number;
  fee_year: string;
  short_description: string;
  tag: string;
  color_index: number;
  thumbnail_url: string;
  thumbnail_alt: string;
  slide1_url: string;
  slide1_alt: string;
  slide2_url: string;
  slide2_alt: string;
  slide3_url: string;
  slide3_alt: string;
}
export interface PublicLibraryPhoto {
  id: number;
  image_url: string;
  alt: string;
  caption: string;
  sort_order: number;
  is_published: boolean;
}
export interface PublicAlumnus {
  id: number;
  name: string;
  branch: string;
  year: string;
  company: string;
  role: string;
  drive_date: string;
  status: "joined" | "offered";
  photo_url: string;
  sort_order: number;
  is_published: boolean;
}
export interface PublicPageSection {
  id: number;
  page: string;
  section_key: string;
  section_type: "hero" | "text-block" | "image-list" | "stats" | "generic";
  title: string;
  content: Record<string, unknown>;
  sort_order: number;
  is_published: boolean;
}
export interface PublicContact {
  phone: string;
  whatsapp_url: string;
  email: string;
  email_principal: string;
  email_grievance: string;
  email_anti_ragging: string;
  address: string;
  map_url: string;
  map_embed_url: string;
  aicte_id: string;
  jeecup_code: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  x_url: string;
  linkedin_url: string;
  office_hours: string;
}

export interface ContentBundle {
  events: PublicEvent[];
  testimonials: PublicTestimonial[];
  faculty: PublicFaculty[];
  recruiters: PublicRecruiter[];
  branches: PublicBranch[];
  library_photos: PublicLibraryPhoto[];
  alumni: PublicAlumnus[];
  page_sections: PublicPageSection[];
  contact: PublicContact;
}

// ─── Fetcher ───────────────────────────────────────────────────────────

/**
 * The Next.js fetch cache tag that every public-bundle request is
 * pinned to. The admin proxy route handler calls revalidateTag(this)
 * after any successful content mutation so admin edits surface on the
 * next render — no waiting for the lazy revalidate window.
 */
export const CONTENT_CACHE_TAG = "content:public";

/**
 * Server-side fetch of the merged public content bundle.
 *
 * Caching strategy:
 *   - Next.js fetch cache is the only cache layer. It's tagged with
 *     CONTENT_CACHE_TAG so revalidateTag() (called from the admin
 *     proxy after a POST/PATCH/DELETE on /content/*) busts it instantly.
 *   - A 5-min lazy `revalidate` window covers the case where someone
 *     edits the DB directly (not through the admin) — eventual
 *     consistency, not stale-forever.
 *
 * The previous in-memory module-level cache was removed: it was per-
 * function-instance, not shared, and couldn't be invalidated from the
 * proxy on a different function instance — so admin edits would
 * silently take up to 5 minutes to appear even after the Next.js fetch
 * cache had been busted.
 *
 * Never throws. Returns null if the backend is unreachable, which
 * callers should interpret as "use the static fallback".
 */
export async function getContent(): Promise<ContentBundle | null> {
  try {
    const url = `${BACKEND_BASE}/content/public/`;
    const res = await fetch(url, {
      next: { revalidate: 300, tags: [CONTENT_CACHE_TAG] },
    });
    if (!res.ok) return null;
    return (await res.json()) as ContentBundle;
  } catch {
    return null;
  }
}

// ─── Hybrid getters: dynamic-first, static-fallback ─────────────────

export async function getEvents(): Promise<PublicEvent[]> {
  const b = await getContent();
  if (b && b.events.length > 0) return b.events;
  // Map static DATA.events into the public shape
  return DATA.events.map((e, i) => ({
    id: 1000 + i,
    date: e.date,
    tag: e.tag,
    title: e.title,
    body: e.body,
    link_url: "",
    image_url: "",
    is_published: true,
    sort_order: i,
  }));
}

export async function getTestimonials(): Promise<PublicTestimonial[]> {
  const b = await getContent();
  if (b && b.testimonials.length > 0) return b.testimonials;
  return DATA.testimonials.map((t, i) => ({
    id: 1000 + i,
    name: t.name,
    role: t.role,
    quote: t.quote,
    language: "en",
    photo_url: "",
    year_passed: null,
  }));
}

export async function getFaculty(): Promise<PublicFaculty[]> {
  const b = await getContent();
  if (b && b.faculty.length > 0) return b.faculty;
  return [];
}

export async function getRecruiters(): Promise<PublicRecruiter[]> {
  const b = await getContent();
  if (b && b.recruiters.length > 0) return b.recruiters;
  return DATA.recruiters.map((name, i) => ({
    id: 1000 + i,
    name,
    logo_url: "",
    website_url: "",
    tier: "regular",
    alumni_count: 0,
    blurb: "",
  }));
}

export async function getBranches(): Promise<PublicBranch[]> {
  const b = await getContent();
  if (b && b.branches.length > 0) return b.branches;
  return DATA.branches.map((br, i) => ({
    id: 1000 + i,
    code: br.code,
    slug: br.slug,
    name: br.name,
    name_hi: br.hi,
    seats: br.seats,
    fee_year: br.fee,
    short_description: br.desc,
    tag: br.tag ?? "",
    color_index: br.color,
    thumbnail_url: br.thumbnail.src,
    thumbnail_alt: br.thumbnail.alt,
    slide1_url: br.slides[0]?.src ?? "",
    slide1_alt: br.slides[0]?.alt ?? "",
    slide2_url: br.slides[1]?.src ?? "",
    slide2_alt: br.slides[1]?.alt ?? "",
    slide3_url: br.slides[2]?.src ?? "",
    slide3_alt: br.slides[2]?.alt ?? "",
  }));
}

/**
 * One-shot legacy fix for the 2026-05 library photo upload.
 *
 * Six of the eleven library frames (library-02/03/04/05/09/10) were
 * captured on a phone in portrait mode but uploaded to Cloudinary
 * without an EXIF Orientation tag. They render 90° rotated unless we
 * tell Cloudinary to apply the rotation at delivery time. The backend
 * library_photos rows store the unrotated URLs, so we have to inject
 * `a_90,` here on the way out — both for backend-served and static
 * fallback URLs.
 *
 * Drop this helper once every backend row is updated to embed `a_90`
 * directly, or once the photos are re-uploaded with EXIF preserved.
 */
function applyLibraryRotationFix(imageUrl: string): string {
  if (!imageUrl) return imageUrl;
  if (!/\/library-(02|03|04|05|09|10)\.jpg/.test(imageUrl)) return imageUrl;
  if (imageUrl.includes("a_90")) return imageUrl;
  return imageUrl.replace("/image/upload/", "/image/upload/a_90,");
}

export async function getLibraryPhotos(): Promise<PublicLibraryPhoto[]> {
  const b = await getContent();
  if (b && b.library_photos && b.library_photos.length > 0) {
    return b.library_photos.map((p) => ({
      ...p,
      image_url: applyLibraryRotationFix(p.image_url),
    }));
  }
  // Static fallback — mirror lib/images.ts > BIPE_IMG.libraryPhotos.
  // (Those fallback URLs already include `a_90` where needed, but we
  // pass them through the same fix so the helper stays the single
  // source of truth.)
  const { BIPE_IMG } = await import("@/lib/images");
  return BIPE_IMG.libraryPhotos.map((p, i) => ({
    id: 1000 + i,
    image_url: applyLibraryRotationFix(p.src),
    alt: p.alt,
    caption: "",
    sort_order: i,
    is_published: true,
  }));
}

export async function getAlumni(): Promise<PublicAlumnus[]> {
  const b = await getContent();
  if (b && b.alumni && b.alumni.length > 0) return b.alumni;
  // Static fallback from the JSON manifest.
  const manifest = (await import("@/lib/alumni-manifest.json")).default as {
    alumni: Array<{
      id: number; name: string; branch: string; year: string;
      company?: string; role?: string; driveDate?: string;
      status?: string; photo?: string;
    }>;
  };
  return manifest.alumni.map((a) => ({
    id: a.id,
    name: a.name,
    branch: a.branch,
    year: a.year,
    company: a.company ?? "",
    role: a.role ?? "",
    drive_date: a.driveDate ?? "",
    status: (a.status === "offered" ? "offered" : "joined") as "joined" | "offered",
    photo_url: a.photo ?? "",
    sort_order: 0,
    is_published: true,
  }));
}

/**
 * Returns branches in the SAME shape the rest of the codebase already
 * uses (lib/data.ts > Branch — camelCase, with `hi`, `desc`, `fee`,
 * `color`, `thumbnail: {src,alt}`, `slides: {src,alt}[]`). This lets
 * existing consumers swap `DATA.branches` for `await getBranchesMapped()`
 * without touching every field reference.
 *
 * Falls back to DATA.branches when the backend bundle is empty.
 */
export async function getBranchesMapped(): Promise<typeof DATA.branches> {
  const live = await getBranches();
  if (!live || live.length === 0) return DATA.branches;
  return live.map((b) => {
    // A branch closed to new admissions has its PITCH fields pinned to the
    // seed. The CMS row for Dairy still reads "Rare diploma — offered by
    // only 4 institutes including BIPE...", which is a recruitment pitch
    // for a branch that no longer recruits, and CMS-first mapping means a
    // repo edit to `desc` would never reach production on its own. Pinning
    // is the durable fix: it does not depend on someone remembering to
    // PATCH a row, and it cannot regress if the stale row is ever
    // republished. Only desc/tag are pinned — seats, code and name stay
    // CMS-supplied and are separately asserted against the seed at build
    // time in app/llms.txt/route.ts. 3 Sep 2026.
    const closure = BRANCH_CLOSURES[b.slug];
    const seed = closure ? DATA.branches.find((s) => s.slug === b.slug) : undefined;
    return {
      code: b.code,
      slug: b.slug,
      name: b.name,
      hi: b.name_hi,
      seats: b.seats,
      fee: b.fee_year,
      desc: seed ? seed.desc : b.short_description,
      tag: seed ? seed.tag : b.tag || null,
      color: b.color_index,
      thumbnail: { src: b.thumbnail_url, alt: b.thumbnail_alt },
      slides: [
        ...(b.slide1_url ? [{ src: b.slide1_url, alt: b.slide1_alt }] : []),
        ...(b.slide2_url ? [{ src: b.slide2_url, alt: b.slide2_alt }] : []),
        ...(b.slide3_url ? [{ src: b.slide3_url, alt: b.slide3_alt }] : []),
      ],
      // SEED-ENFORCED, not CMS-supplied. Admission closure is a claim the
      // repo owns: there is no `admissions` column in the CMS bundle, and
      // there must not be one that can silently re-open a closed branch to
      // applicants. Same overlay shape as getContact()'s identity fields.
      // 3 Sep 2026 — see BRANCH_CLOSURES in lib/data.ts.
      admissions: closure,
    };
  });
}

export async function getPageSections(page: string): Promise<PublicPageSection[]> {
  const b = await getContent();
  if (!b || !b.page_sections) return [];
  return b.page_sections.filter((s) => s.page === page);
}

/** Return the first section on `page` with the given `section_key`,
 *  or null if missing. Callers should fall back to their static defaults
 *  when this returns null so the page never breaks on a CMS outage. */
export async function getPageSection(page: string, key: string): Promise<PublicPageSection | null> {
  const list = await getPageSections(page);
  return list.find((s) => s.section_key === key) ?? null;
}

/**
 * Office hours in the three shapes the site renders them. Every surface
 * imports from here — six pages had drifted to a 9–6 close and /campus/phoolpur
 * to 09:30–17:30, all stale against the front desk's actual 9–5.
 *
 * Declared above seedContact() because that function reads OFFICE_HOURS: if
 * the seed ever becomes an eagerly-evaluated module-scope constant, a
 * declaration below it would throw a temporal-dead-zone ReferenceError on
 * import and take down every page that imports this module.
 */
export const OFFICE_HOURS = "Mon–Sat · 9:00 AM – 5:00 PM";
export const OFFICE_HOURS_COMPACT = "MON–SAT · 9–5";
export const OFFICE_HOURS_PROSE = "Mon–Sat, 9 AM to 5 PM";

/** PublicContact built entirely from the code seed (DATA.contact +
 *  DATA.social). Used both as the backend-down fallback and as the
 *  authoritative source for the identity overlay in getContact(). */
function seedContact(): PublicContact {
  const c = DATA.contact;
  const social = (key: string) => DATA.social.find((s) => s.name.toLowerCase() === key)?.url ?? "";
  return {
    phone: c.phone,
    whatsapp_url: c.whatsapp,
    email: c.email,
    email_principal: c.emailPrincipal,
    email_grievance: c.emailGrievance,
    email_anti_ragging: c.emailAntiRagging,
    address: c.address,
    map_url: "https://www.google.com/maps/search/?api=1&query=BIPE+Phoolpur+Varanasi",
    map_embed_url: "https://maps.google.com/maps?q=BIPE+Phoolpur+Varanasi&t=&z=15&ie=UTF8&iwloc=&output=embed",
    aicte_id: c.aicte,
    jeecup_code: c.jeecup,
    facebook_url: social("facebook"),
    instagram_url: social("instagram"),
    youtube_url: social("youtube"),
    x_url: social("x"),
    linkedin_url: social("linkedin"),
    office_hours: OFFICE_HOURS,
  };
}

/**
 * Identity-critical NAP + entity fields are SEED-AUTHORITATIVE: the CMS
 * bundle can no longer override them.
 *
 * 2 Sep 2026 incident: the backend Contact singleton was a 15 May
 * snapshot — retired phone 9198646464, retired bipevns@gmail.com, the
 * pre-June long-form address, an empty grievance email, the dead
 * @bipevns YouTube handle and a personal /in/ LinkedIn URL — and it
 * silently outranked the audited seed in the footer payload and the
 * schema.org JSON-LD of every page. The owner's NAP directives (28 May
 * phone consolidation, 1 Jun canonical address, info@bipe.ac.in
 * migration) land in lib/data.ts via reviewed commits, so lib/data.ts
 * is the audited record; a CMS row that disagrees with it is stale by
 * definition. Identity edits therefore go through lib/data.ts. The
 * admin Contact singleton stays authoritative for the operational
 * fields only (map links, office hours — and any future columns, which
 * the spread passes through).
 */
export async function getContact(): Promise<PublicContact> {
  const seed = seedContact();
  const b = await getContent();
  if (!b?.contact) return seed;
  return {
    ...b.contact,
    phone: seed.phone,
    whatsapp_url: seed.whatsapp_url,
    email: seed.email,
    email_principal: seed.email_principal,
    email_grievance: seed.email_grievance,
    email_anti_ragging: seed.email_anti_ragging,
    address: seed.address,
    aicte_id: seed.aicte_id,
    jeecup_code: seed.jeecup_code,
    facebook_url: seed.facebook_url,
    instagram_url: seed.instagram_url,
    youtube_url: seed.youtube_url,
    x_url: seed.x_url,
    linkedin_url: seed.linkedin_url,
  };
}
