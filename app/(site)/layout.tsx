import RootDocument from "@/components/shell/RootDocument";

export { metadata, viewport } from "@/components/shell/RootDocument";

/**
 * Root layout for everything except the blog.
 *
 * The whole document lives in components/shell/RootDocument.tsx, shared with
 * app/(blog)/layout.tsx so the two cannot drift. All this adds is the
 * language, which is fixed here — and being fixed is the entire point.
 *
 * Nothing in this layout reads the request, so every route beneath it is
 * prerendered at build time and served from the edge. Before the split there
 * was one root layout, it read a header to find the current path, and that
 * made all 111 route patterns render per-request for every visitor (Sep 2026
 * performance audit, finding F6). With the rendering happening in Washington
 * DC and the audience in Uttar Pradesh, that was a round trip across the
 * planet for a page whose content had not changed.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="en-IN">{children}</RootDocument>;
}
