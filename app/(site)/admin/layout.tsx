import type { Metadata } from "next";
import "./admin.css";

// Admin pages must NOT inherit the public homepage <title> (the root
// layout's `default`). Without this, every admin screen — and any PDF
// printed from one — was titled "Polytechnic & Engineering College in
// Varanasi · BTE UP, AICTE Approved · BIPE 4455" (1 Jun 2026 report
// naming bug). This scopes an admin title ("BIPE Admin", or
// "<Page> · BIPE Admin" when a page sets its own) and keeps the whole
// /admin subtree out of the search index.
export const metadata: Metadata = {
  title: { default: "BIPE Admin", template: "%s · BIPE Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // The public site's Nav + Footer are already suppressed for /admin paths
  // by ConditionalChrome (see app/layout.tsx). This layout exists mainly to
  // pull in admin.css scoped to the admin subtree.
  return children;
}
