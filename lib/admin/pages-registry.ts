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

/** Schema for a single field on a list-row in a list-items section. */
export interface ItemFieldDef {
  key: string;
  label: string;
  placeholder?: string;
  widget?: "input" | "textarea";
  help?: string;
}

export interface SectionDef {
  key: string;
  label: string;
  /** Which typed editor to render; falls back to "generic" if unknown. */
  type: SectionType;
  /** Description shown under the section card. */
  description?: string;
  /**
   * If set, the admin renders a typed list editor for the section's
   * `content.items` array. Each row has these named fields. The
   * dispatcher in SectionEditorBody picks this up before falling back
   * to a typed-by-type editor or the generic JSON textarea.
   */
  itemFields?: ItemFieldDef[];
  /** Default object used when the admin clicks "+ Add row". */
  itemTemplate?: Record<string, unknown>;
  /** Label for the add button (defaults to "+ Add row"). */
  addLabel?: string;
  /** Singular noun shown in the row header (defaults to "Row"). */
  rowLabel?: string;
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
      {
        key: "hero", label: "Hero", type: "hero",
        description: "Headline, description, CTAs, background photo, approvals strip.",
      },
      {
        key: "stats", label: "Stats bar", type: "generic",
        description: "5 tiles under the hero.",
        rowLabel: "Tile", addLabel: "+ Add tile",
        itemTemplate: { num: "", label: "", sub: "" },
        itemFields: [
          { key: "num",   label: "Number",     placeholder: "16 / 1,000+ / 1:20" },
          { key: "label", label: "Label",      placeholder: "Years serving Eastern UP" },
          { key: "sub",   label: "Sub-label",  placeholder: "since 2010" },
        ],
      },
      {
        key: "why-bipe", label: "Why BIPE", type: "generic",
        description: "4-item differentiator block. The first item is featured larger; the rest become tabs underneath.",
        rowLabel: "Differentiator", addLabel: "+ Add differentiator",
        itemTemplate: { num: "", metric: "", metricLabel: "", title: "", body: "", icon: "" },
        itemFields: [
          { key: "num",         label: "Index",        placeholder: "01" },
          { key: "metric",      label: "Metric",       placeholder: "1:20 / 4 only / 1,000+" },
          { key: "metricLabel", label: "Metric label", placeholder: "mentor ratio / alumni in 16 yrs" },
          { key: "title",       label: "Title",        placeholder: "One mentor. Twenty students." },
          { key: "body",        label: "Body",         widget: "textarea" },
          { key: "icon",        label: "Icon SVG path d=", placeholder: "M12 12a4 4 0 …",
            help: "Raw `d=` attribute for the inline <svg>; copy/paste from a Lucide / Heroicons asset." },
        ],
      },
      {
        key: "faq", label: "FAQ", type: "generic",
        description: "Frequently asked questions. Also rendered on /faq. Add as many rows as you like; category groups them into pills.",
        rowLabel: "Q&A", addLabel: "+ Add question",
        itemTemplate: { cat: "Admission", q: "", a: "" },
        itemFields: [
          { key: "cat", label: "Category", placeholder: "Admission / Fees / Career / Campus" },
          { key: "q",   label: "Question", placeholder: "How do I apply to BIPE?" },
          { key: "a",   label: "Answer",   widget: "textarea" },
        ],
      },
      {
        key: "facilities", label: "Facilities", type: "generic",
        description: "Campus-life tiles shown after the branches slider on the home page.",
        rowLabel: "Tile", addLabel: "+ Add tile",
        itemTemplate: { name: "", count: "", body: "" },
        itemFields: [
          { key: "name",  label: "Name",        placeholder: "120-computer lab" },
          { key: "count", label: "Highlight",   placeholder: "120 PCs / 8,428 / rare" },
          { key: "body",  label: "Body",        widget: "textarea" },
        ],
      },
      {
        key: "jeecup-steps", label: "JEECUP steps", type: "generic",
        description: "6-card 'application → first day of class' grid.",
        rowLabel: "Step", addLabel: "+ Add step",
        itemTemplate: { step: "", title: "", body: "" },
        itemFields: [
          { key: "step",  label: "Step #",     placeholder: "01" },
          { key: "title", label: "Step title", placeholder: "Sit the entrance" },
          { key: "body",  label: "Body",       widget: "textarea" },
        ],
      },
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
