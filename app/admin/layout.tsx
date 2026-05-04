import "./admin.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // The public site's Nav + Footer are already suppressed for /admin paths
  // by ConditionalChrome (see app/layout.tsx). This layout exists mainly to
  // pull in admin.css scoped to the admin subtree.
  return children;
}
