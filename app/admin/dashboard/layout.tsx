"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Tokens, api, logout, hasPerm, type Me } from "@/lib/admin/api";
import {
  LayoutDashboard,
  Inbox,
  Search,
  Settings,
  LogOut,
  ExternalLink,
  FileText,
  Users as UsersIcon,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/admin/utils";

type NavItem = {
  href: string;
  label: string;
  Icon: typeof LayoutDashboard;
  /** Permission codes that gate visibility. Empty = always visible. */
  perms?: string[];
};

const NAV: NavItem[] = [
  { href: "/admin/dashboard",          label: "Overview", Icon: LayoutDashboard },
  { href: "/admin/dashboard/inbox",    label: "Inbox",    Icon: Inbox,         perms: ["accounts.manage_submissions", "submissions.view_applysubmission", "submissions.view_contactsubmission", "submissions.view_visitsubmission"] },
  { href: "/admin/dashboard/content",  label: "Content",  Icon: FileText,      perms: ["accounts.manage_content"] },
  { href: "/admin/dashboard/seo",      label: "SEO",      Icon: Search,        perms: ["accounts.manage_seo"] },
  { href: "/admin/dashboard/users",    label: "Users",    Icon: UsersIcon,     perms: ["accounts.manage_users"] },
  { href: "/admin/dashboard/roles",    label: "Roles",    Icon: ShieldCheck,   perms: ["accounts.manage_roles"] },
  { href: "/admin/dashboard/settings", label: "Settings", Icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
          letterSpacing: "0.18em",
          background: "var(--paper)",
        }}
      >
        <span className="admin-skel" style={{ width: 80, height: 6 }} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "248px 1fr",
        minHeight: "100vh",
        background: "var(--paper)",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          background: "var(--white)",
          borderRight: "1px solid var(--line)",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        {/* Brand block */}
        <Link
          href="/admin/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 8px 18px",
            textDecoration: "none",
            color: "inherit",
            borderBottom: "1px dashed var(--line-2)",
            marginBottom: 12,
          }}
        >
          <Image
            src="/bipe-logo.svg"
            alt=""
            aria-hidden="true"
            width={2162}
            height={2497}
            style={{
              height: 40,
              width: Math.round(40 * (2162 / 2497)),
              flexShrink: 0,
            }}
            draggable={false}
          />
          <div style={{ minWidth: 0 }}>
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
              BIPE · Admin
            </div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 14,
                color: "var(--ink-3)",
                marginTop: 2,
              }}
            >
              Banaras Institute
            </div>
          </div>
        </Link>

        <nav style={{ display: "flex", flexDirection: "column" }}>
          {NAV
            .filter(({ perms }) => !perms?.length || hasPerm(me, ...perms))
            .map(({ href, label, Icon }) => {
              const active =
                href === "/admin/dashboard"
                  ? pathname === "/admin/dashboard"
                  : pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn("admin-sidebar-link", active && "is-active")}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
        </nav>

        <a
          href="https://bipe-blond.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-sidebar-link"
          style={{ marginTop: 18, color: "var(--ink-3)" }}
        >
          <ExternalLink size={15} />
          Public site
        </a>

        {/* Footer — user + logout */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: 14,
            borderTop: "1px dashed var(--line-2)",
          }}
        >
          {me && (
            <div
              style={{
                padding: "10px 14px",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "var(--brand)",
                  color: "var(--paper)",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "0.04em",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {(me.name || me.phone || "?").slice(0, 1).toUpperCase()}
              </span>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    color: "var(--ink)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 150,
                  }}
                >
                  {me.name || me.phone}
                </div>
                <div
                  style={{
                    color: "var(--ink-3)",
                    fontSize: 10.5,
                    marginTop: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 150,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {me.phone || me.email || "—"}
                </div>
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
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ padding: "26px 30px 60px", minWidth: 0 }}>{children}</main>
    </div>
  );
}
