"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Tokens, api, logout, type Me } from "@/lib/admin/api";
import {
  LayoutDashboard,
  GraduationCap,
  Mail,
  CalendarDays,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/admin/utils";

const NAV = [
  { href: "/admin/dashboard", label: "Overview", Icon: LayoutDashboard },
  { href: "/admin/dashboard/apply", label: "Apply", Icon: GraduationCap },
  { href: "/admin/dashboard/contact", label: "Contact", Icon: Mail },
  { href: "/admin/dashboard/visit", label: "Visit", Icon: CalendarDays },
  { href: "/admin/dashboard/settings", label: "Settings", Icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [me, setMe] = useState<Me | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!Tokens.access()) {
      router.replace("/admin");
      return;
    }
    api<Me>("/auth/me/")
      .then((u) => setMe(u))
      .catch(() => {
        Tokens.clear();
        router.replace("/admin");
      })
      .finally(() => setReady(true));
  }, [router]);

  async function onLogout() {
    await logout();
    router.replace("/admin");
  }

  if (!ready) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          color: "var(--ink-3)",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.16em",
        }}
      >
        LOADING…
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        minHeight: "100vh",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          background: "var(--white)",
          borderRight: "1px solid var(--line)",
          padding: "22px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div style={{ padding: "0 8px 18px" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "var(--brand)",
            }}
          >
            § BIPE
          </div>
          <div className="admin-h3" style={{ marginTop: 4 }}>
            Admin
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column" }}>
          {NAV.map(({ href, label, Icon }) => {
            const active = href === "/admin/dashboard"
              ? pathname === "/admin/dashboard"
              : pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn("admin-sidebar-link", active && "is-active")}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--line)" }}>
          {me && (
            <div style={{ padding: "10px 14px", fontSize: 12 }}>
              <div style={{ fontWeight: 600, color: "var(--ink)" }}>
                {me.first_name || me.username}
              </div>
              <div style={{ color: "var(--ink-3)", fontSize: 11, marginTop: 2 }}>
                {me.email || "—"}
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={onLogout}
            className="admin-sidebar-link"
            style={{
              width: "100%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--ink-3)",
              fontFamily: "inherit",
            }}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ padding: "24px 28px 60px", minWidth: 0 }}>{children}</main>
    </div>
  );
}
