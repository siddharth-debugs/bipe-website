/**
 * Catalogue of the public pages the admin can edit and the sections
 * each page exposes. Kept in one file so the "Pages" tab, the per-page
 * detail screen, and the section editors share a single source of truth.
 *
 * Adding a new editable section is a 3-step process:
 *
 *   1. Add an entry here under the right page.
 *   2. Seed an initial row in content/management/commands/seed_content.py
 *      (or create it from the admin's "+ New section" button — the
 *      generic JSON editor accepts any shape).
 *   3. If you want a typed form instead of the generic JSON editor,
 *      add a case in <SectionEditorBody /> in pages/[slug]/page.tsx.
 */

import type { SectionType } from "@/lib/admin/content";

export interface SectionDef {
  key: string;
  label: string;
  /** Which typed editor to render; falls back to "generic" if unknown. */
  type: SectionType;
  /** Description shown under the section card. */
  description?: string;
}

export interface PageDef {
  slug: string;
  label: string;
  /** Public path on the site this corresponds to (for "View live" link). */
  publicPath: string;
  description: string;
  /** Sections the admin can edit on this page. */
  sections: SectionDef[];
}

export const PAGES: PageDef[] = [
  {
    slug: "home",
    label: "Home",
    publicPath: "/",
    description: "Landing page — hero, branches, stats, recruiters, why-BIPE, testimonials, events.",
    sections: [
      { key: "hero",         label: "Hero",         type: "hero",    description: "Headline, description, CTAs, background photo, approvals strip." },
      { key: "stats",        label: "Stats bar",    type: "generic", description: "5 tiles under the hero — number / label / sub-label. Edit `content.items`." },
      { key: "why-bipe",     label: "Why BIPE",     type: "generic", description: "4-item differentiator list with mentor ratio, OBE pedagogy, rare dairy, alumni count." },
      { key: "faq",          label: "FAQ",          type: "generic", description: "Frequently asked questions. Also rendered on /faq. Edit `content.items` (cat / q / a)." },
      { key: "facilities",   label: "Facilities",   type: "generic", description: "4 campus-life tiles shown after the branches slider." },
      { key: "jeecup-steps", label: "JEECUP steps", type: "generic", description: "6-card 'application → first day of class' grid." },
    ],
  },
  {
    slug: "about",
    label: "About",
    publicPath: "/about",
    description: "Institution overview, chairman/principal/teaching dropdown landing.",
    sections: [
      { key: "intro", label: "Intro", type: "text-block", description: "Eyebrow + headline + body paragraph at the top of /about." },
    ],
  },
  {
    slug: "alumni",
    label: "Alumni",
    publicPath: "/alumni",
    description: "Alumni directory + drives view. The directory data itself lives under the Alumni tab.",
    sections: [
      { key: "intro", label: "Intro", type: "text-block", description: "Page header above the alumni grid." },
    ],
  },
  {
    slug: "placements",
    label: "Placements",
    publicPath: "/placements",
    description: "Placement narrative + recruiter highlights.",
    sections: [
      { key: "intro", label: "Intro", type: "text-block", description: "Top section of /placements." },
    ],
  },
  {
    slug: "campus",
    label: "Campus",
    publicPath: "/campus",
    description: "Campus tour — facilities, library, computer centre, hostel.",
    sections: [
      { key: "intro", label: "Intro", type: "text-block", description: "Editorial hero at the top of /campus." },
    ],
  },
  {
    slug: "admission",
    label: "Admission",
    publicPath: "/admission",
    description: "Admission overview, JEECUP, apply, fees, scholarships, documents.",
    sections: [
      { key: "intro", label: "Intro", type: "text-block", description: "Header on /admission." },
    ],
  },
];

export function pageBySlug(slug: string): PageDef | undefined {
  return PAGES.find((p) => p.slug === slug);
}
