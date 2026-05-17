/**
 * Typed client for /api/v1/content/* — Events, Testimonials, Faculty,
 * Recruiters, Branches and the singleton Contact info.
 */

import { api } from "@/lib/admin/api";

// ─── Shared shape ─────────────────────────────────────────────────────────

interface BaseRow {
  id: number;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ─── Events ───────────────────────────────────────────────────────────────

export interface EventRow extends BaseRow {
  date: string;
  tag: string;
  title: string;
  body: string;
  link_url: string;
  image_url: string;
}
export type EventWrite = Partial<Omit<EventRow, "id" | "created_at" | "updated_at">>;

// ─── Testimonials ─────────────────────────────────────────────────────────

export interface TestimonialRow extends BaseRow {
  name: string;
  role: string;
  quote: string;
  language: "en" | "hi" | "mix";
  photo_url: string;
  year_passed: number | null;
}
export type TestimonialWrite = Partial<Omit<TestimonialRow, "id" | "created_at" | "updated_at">>;

// ─── Faculty ──────────────────────────────────────────────────────────────

export interface FacultyRow extends BaseRow {
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
export type FacultyWrite = Partial<Omit<FacultyRow, "id" | "created_at" | "updated_at">>;

// ─── Recruiters ───────────────────────────────────────────────────────────

export interface RecruiterRow extends BaseRow {
  name: string;
  logo_url: string;
  website_url: string;
  tier: "flagship" | "regular" | "alumni";
  alumni_count: number;
  blurb: string;
}
export type RecruiterWrite = Partial<Omit<RecruiterRow, "id" | "created_at" | "updated_at">>;

// ─── Branches ─────────────────────────────────────────────────────────────

// ─── Library photos ───────────────────────────────────────────────────────

export interface LibraryPhotoRow extends BaseRow {
  image_url: string;
  alt: string;
  caption: string;
}
export type LibraryPhotoWrite = Partial<Omit<LibraryPhotoRow, "id" | "created_at" | "updated_at">>;

// ─── Alumni ───────────────────────────────────────────────────────────────

export interface AlumnusRow extends BaseRow {
  name: string;
  branch: string;
  year: string;
  company: string;
  role: string;
  drive_date: string;
  status: "joined" | "offered";
  photo_url: string;
}
export type AlumnusWrite = Partial<Omit<AlumnusRow, "id" | "created_at" | "updated_at">>;

// ─── Branches ─────────────────────────────────────────────────────────────

export interface BranchRow extends BaseRow {
  code: string;
  slug: string;
  name: string;
  name_hi: string;
  seats: number;
  fee_year: string;
  short_description: string;
  tag: string;
  color_index: number;
  // Card / list thumbnail.
  thumbnail_url: string;
  thumbnail_alt: string;
  // Three fixed slider slots — leave a URL blank to hide that slot.
  slide1_url: string;
  slide1_alt: string;
  slide2_url: string;
  slide2_alt: string;
  slide3_url: string;
  slide3_alt: string;
}
export type BranchWrite = Partial<Omit<BranchRow, "id" | "created_at" | "updated_at">>;

// ─── Contact info (singleton) ────────────────────────────────────────────

export interface ContactInfoRow {
  id: number;
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
  updated_at: string;
}
export type ContactInfoWrite = Partial<Omit<ContactInfoRow, "id" | "updated_at">>;

// ─── Generic CRUD helpers ─────────────────────────────────────────────────

interface List<T> {
  results?: T[];
  count?: number;
}
function unwrap<T>(r: T[] | List<T>): T[] {
  return Array.isArray(r) ? r : (r.results ?? []);
}

function makeCrud<R extends BaseRow, W>(resource: string) {
  return {
    list: async (): Promise<R[]> => unwrap(await api<R[] | List<R>>(`/content/${resource}/`)),
    get: (id: number | string) => api<R>(`/content/${resource}/${id}/`),
    create: (body: W) => api<R>(`/content/${resource}/`, { method: "POST", body }),
    update: (id: number | string, body: W) =>
      api<R>(`/content/${resource}/${id}/`, { method: "PATCH", body }),
    remove: (id: number | string) =>
      api<void>(`/content/${resource}/${id}/`, { method: "DELETE" }),
  };
}

export const Events = makeCrud<EventRow, EventWrite>("events");
export const Testimonials = makeCrud<TestimonialRow, TestimonialWrite>("testimonials");
export const Faculty = makeCrud<FacultyRow, FacultyWrite>("faculty");
export const Recruiters = makeCrud<RecruiterRow, RecruiterWrite>("recruiters");
export const Branches = makeCrud<BranchRow, BranchWrite>("branches");
export const Library = makeCrud<LibraryPhotoRow, LibraryPhotoWrite>("library");
export const Alumni = makeCrud<AlumnusRow, AlumnusWrite>("alumni");

// Contact: singleton, no list/create/delete.
export const Contact = {
  get: () => api<ContactInfoRow>("/content/contact/"),
  update: (body: ContactInfoWrite) =>
    api<ContactInfoRow>("/content/contact/", { method: "PATCH", body }),
};

// Public bundle: used by frontend SSR (never hits this admin client path,
// but exported here so admin previews can call the same endpoint).
export interface PublicBundle {
  events: EventRow[];
  testimonials: TestimonialRow[];
  faculty: FacultyRow[];
  recruiters: RecruiterRow[];
  branches: BranchRow[];
  library_photos: LibraryPhotoRow[];
  alumni: AlumnusRow[];
  contact: ContactInfoRow;
}
export function publicBundle(): Promise<PublicBundle> {
  return api<PublicBundle>("/content/public/");
}
