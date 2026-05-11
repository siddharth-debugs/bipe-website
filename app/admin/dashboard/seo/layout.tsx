"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/admin/utils";

const TABS = [
  { href: "/admin/dashboard/seo/site", label: "Site defaults" },
  { href: "/admin/dashboard/seo/pages", label: "Pages" },
  { href: "/admin/dashboard/seo/analytics", label: "Analytics" },
  { href: "/admin/dashboard/seo/verification", label: "Verification" },
  { href: "/admin/dashboard/seo/schemas", label: "Schemas" },
];

export default function SEOLayout({ children }: { children: React.ReactNode }) {
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
              className={cn("admin-pill admin-pill-no-dot")}
              style={{
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 8,
                background: active ? "var(--ink)" : "transparent",
                color: active ? "var(--paper)" : "var(--ink-2)",
                border: "none",
                textDecoration: "none",
                transition: "background 0.15s ease",
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
