"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Tokens, api, logout, hasPerm, type Me } from "@/lib/admin/api";
import { useSignedIn } from "@/lib/admin/useSignedIn";
import {
  LayoutDashboard,
  Inbox,
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
  { href: "/admin/dashboard/users",    label: "Users",    Icon: UsersIcon,     perms: ["accounts.manage_users"] },
  { href: "/admin/dashboard/roles",    label: "Roles",    Icon: ShieldCheck,   perms: ["accounts.manage_roles"] },
  { href: "/admin/dashboard/settings", label: "Settings", Icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [me, setMe] = useState<Me | null>(null);
  // Read at render time, so the shell knows who it is drawing for before any
  // effect has run. Set only when the server rejects a token we did have.
  const hasToken = useSignedIn();
  const [tokenRejected, setTokenRejected] = useState(false);

  // Who is this, and what are they allowed to see?
  //
  // This used to hold the whole dashboard back: the layout rendered a bare
  // skeleton until /auth/me/ answered. That cost far more than the one
  // request. Because the page inside had not mounted, it had not started
  // loading its own data either — so the two waits ran back to back rather
  // than side by side, and the operator watched a blank screen through both
  // (Sep 2026 performance audit, finding F2).
  //
  // Now the shell renders immediately and this fetch resolves alongside the
  // page's own. React runs a child's effects before its parent's, so the
  // page has already fired its requests by the time this one leaves.
  //
  // Nothing is disclosed early by doing so. The sidebar's permission-gated
  // links stay hidden while `me` is null — hasPerm(null, …) is false — and
  // every figure on screen arrives from an API that checks the token itself.
  // A visitor with no token, or a stale one, is redirected below; they get
  // one wasted unauthenticated request from the page underneath on the way
  // out, which is a fair price for not stalling every signed-in load.
  useEffect(() => {
    if (!Tokens.access()) {
      router.replace("/admin");
      return;
    }
    api<Me>("/auth/me/")
      .then((u) => setMe(u))
      .catch(() => {
        Tokens.clear();
        setTokenRejected(true);
        router.replace("/admin");
      });
  }, [router]);

  async function onLogout() {
    await logout();
    router.replace("/admin");
  }

  // Signed out — either no token at all, or one the server refused. The
  // redirect is already in flight; painting the dashboard chrome on the way
  // to the login screen would only flash.
  if (!hasToken || tokenRejected) return null;

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
            {/*
              Full canonical institution name — not "Banaras Institute" alone.
              The bare prefix collides with Banaras Institute of Technology
              (BIT / BITE, a separate institution), and disambiguation matters
              even inside the admin UI. Italic serif at 14px wraps gracefully
              to 2 lines in the sidebar.
            */}
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 14,
                color: "var(--ink-3)",
                marginTop: 2,
                lineHeight: 1.25,
              }}
            >
              Banaras Institute of Polytechnic &amp; Engineering
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
          {/*
            The signed-in user's chip. `me` arrives a moment after the shell
            now that the layout no longer waits for it, so the placeholder
            below holds the exact same space — otherwise Sign out would jump
            down the sidebar the instant /auth/me/ answered.
          */}
          {!me && (
            <div
              aria-hidden="true"
              style={{
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                className="admin-skel"
                style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0 }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span className="admin-skel" style={{ width: 92, height: 8 }} />
                <span className="admin-skel" style={{ width: 64, height: 7 }} />
              </div>
            </div>
          )}
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
