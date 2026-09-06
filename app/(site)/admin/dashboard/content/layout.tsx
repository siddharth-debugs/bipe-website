"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/dashboard/content/pages",        label: "Pages" },
  { href: "/admin/dashboard/content/events",       label: "Events / News" },
  { href: "/admin/dashboard/content/testimonials", label: "Testimonials" },
  { href: "/admin/dashboard/content/faculty",      label: "Faculty" },
  { href: "/admin/dashboard/content/recruiters",   label: "Recruiters" },
  { href: "/admin/dashboard/content/branches",     label: "Branches" },
  { href: "/admin/dashboard/content/library",      label: "Library photos" },
  { href: "/admin/dashboard/content/alumni",       label: "Alumni" },
  { href: "/admin/dashboard/content/contact",      label: "Contact info" },
];

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div>
      <nav
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          padding: 4,
          background: "var(--paper-2)",
          border: "1px solid var(--line)",
          borderRadius: 12,
          marginBottom: 24,
          width: "fit-content",
        }}
      >
        {TABS.map((t) => {
          const active = pathname === t.href || pathname?.startsWith(t.href + "/");
          return (
            <Link
              key={t.href}
              href={t.href}
              style={{
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 8,
                background: active ? "var(--ink)" : "transparent",
                color: active ? "var(--paper)" : "var(--ink-2)",
                textDecoration: "none",
                transition: "background 0.15s",
              }}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
