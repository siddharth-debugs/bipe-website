import { headers } from "next/headers";

import RootDocument from "@/components/shell/RootDocument";
import { getPostBySlug } from "@/lib/blogPosts";

export { metadata, viewport } from "@/components/shell/RootDocument";

/**
 * Root layout for the blog, and the only part of the site that renders per
 * request.
 *
 * Fourteen of the thirty posts are in Hindi, and a Hindi post has to be
 * served inside `<html lang="hi-IN">` to match its own self-referencing
 * hi-IN hreflang. Without that, Semrush reports an hreflang language
 * mismatch — the finding this mechanism was added to clear in Aug 2026.
 *
 * `<html lang>` can only be set by a root layout, and a root layout is not
 * given the route's params, so the only way to know which post is being
 * rendered is the request path. proxy.ts forwards it as `x-pathname`.
 * Reading a header opts every route beneath this layout into per-request
 * rendering — which is precisely why the blog now has a root layout of its
 * own. The cost stops at /blog and /blog/[slug] instead of reaching all 111
 * route patterns, and the rest of the site prerenders.
 *
 * If the post is unknown or English, this is identical to the site layout.
 */
export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const slug = pathname.match(/^\/blog\/([^/?#]+)/)?.[1];
  const lang = (slug ? getPostBySlug(slug)?.lang : undefined) ?? "en-IN";

  return <RootDocument lang={lang}>{children}</RootDocument>;
}
