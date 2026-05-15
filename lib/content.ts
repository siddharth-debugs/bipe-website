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

import { DATA } from "@/lib/data";

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
}
export interface PublicContact {
  phone: string;
  phone2: string;
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
  contact: PublicContact;
}

// ─── Fetcher ───────────────────────────────────────────────────────────

let _cached: { value: ContentBundle | null; at: number } | null = null;
const TTL_MS = 5 * 60 * 1000;

/**
 * Server-side fetch with a 5-minute in-memory cache and ``next: { revalidate }``
 * tag so the framework can de-dupe across the same render.
 *
 * Never throws. Returns ``null`` if the backend is unreachable, which
 * callers should interpret as "use the static fallback".
 */
export async function getContent(): Promise<ContentBundle | null> {
  if (_cached && Date.now() - _cached.at < TTL_MS) return _cached.value;
  try {
    const url = `${BACKEND_BASE}/content/public/`;
    const res = await fetch(url, {
      next: { revalidate: 300, tags: ["content:public"] },
    });
    if (!res.ok) {
      _cached = { value: null, at: Date.now() };
      return null;
    }
    const data = (await res.json()) as ContentBundle;
    _cached = { value: data, at: Date.now() };
    return data;
  } catch {
    _cached = { value: null, at: Date.now() };
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
  }));
}

export async function getContact(): Promise<PublicContact> {
  const b = await getContent();
  if (b?.contact) return b.contact;
  // Static fallback from DATA.contact + DATA.social
  const c = DATA.contact;
  const social = (key: string) => DATA.social.find((s) => s.name.toLowerCase() === key)?.url ?? "";
  return {
    phone: c.phone,
    phone2: c.phone2,
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
    office_hours: "Mon–Sat · 9:00 AM – 5:00 PM",
  };
}
