"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DATA } from "@/lib/data";
import { useLang } from "@/lib/lang";
import { ArrowIcon, WhatsAppIcon } from "./Icons";
import { BrandMark } from "./BrandMark";
import { NavSearchButton } from "./NavSearchButton";

const routeForPath = (pathname: string): string => {
  if (pathname === "/" || pathname === "") return "home";
  return pathname.replace(/^\//, "").split("/")[0] || "home";
};

const NavLink = ({ to, label, hi, currentRoute }: { to: string; label: string; hi?: string; currentRoute: string }) => {
  const { lang } = useLang();
  const id = to === "/" ? "home" : to.replace(/^\//, "");
  const active = currentRoute === id;
  return (
    <Link href={to} className={"nav-link " + (active ? "active" : "")}>
      {lang === "hi" && hi ? hi : label}
    </Link>
  );
};

const MegaItem = ({ to, title, desc, icon }: { to: string; title: string; desc: string; icon: string }) => (
  <Link href={to} className="nav-mega-item">
    <div className="nav-mega-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d={icon} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <div>
      <div className="nav-mega-title">{title}</div>
      <div className="nav-mega-desc">{desc}</div>
    </div>
    <span className="nav-mega-arrow"><ArrowIcon size={14} /></span>
  </Link>
);

/**
 * Controlled hover dropdown. Stays open while the cursor is over either the
 * trigger link or the panel; closes after a small grace period when the
 * cursor leaves both. The grace period absorbs the 8px visual gap between
 * trigger and panel so a normal mouse traversal doesn't flicker.
 */
/**
 * Hover dropdown driven by CSS :hover on the wrap (open) plus a brief JS lock
 * (close override) right after a click or route change. CSS hover is robust
 * for any DOM-descendant of the wrap — including the bridge pseudo-element
 * that covers the visual gap — so cursor traversal from trigger to panel
 * never flickers. The lock guarantees the panel doesn't snap back open
 * while the cursor is still over the trigger from the click that just
 * navigated.
 */
function NavMenuWrap({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) {
  const [locked, setLocked] = React.useState(false);
  const lockTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const lock = React.useCallback(() => {
    setLocked(true);
    if (lockTimer.current) clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => setLocked(false), 500);
  }, []);

  React.useEffect(() => () => {
    if (lockTimer.current) clearTimeout(lockTimer.current);
  }, []);

  // Lock on every pathname change (skipping the initial mount) so the menu
  // is forced closed even if the cursor is still over the trigger.
  const pathname = usePathname();
  const firstRender = React.useRef(true);
  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    lock();
  }, [pathname, lock]);

  // Lock immediately when any link inside the wrap is activated. Fires in
  // the capture phase, before navigation commits, so the panel collapses
  // on the click rather than waiting for the route effect.
  const onClickCapture = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement | null)?.closest?.("a");
    if (a && e.currentTarget.contains(a)) {
      lock();
      // release focus so :focus-within doesn't keep the panel pinned open
      requestAnimationFrame(() => (a as HTMLElement).blur());
    }
  }, [lock]);

  // Escape key — lock to force close while cursor may still be over wrap.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") lock(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lock]);

  return (
    <div
      className={"nav-link-wrap" + (locked ? " is-locked" : "")}
      style={{ position: "relative" }}
      onClickCapture={onClickCapture}
    >
      {trigger}
      <div className="nav-dropdown-mega">
        {children}
      </div>
    </div>
  );
}

export function Nav() {
  const pathname = usePathname() || "/";
  const route = routeForPath(pathname);
  const { lang, setLang } = useLang();
  const C = DATA.contact;
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  React.useEffect(() => { setDrawerOpen(false); }, [pathname]);
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
    <nav className="nav">
      <div className="nav-utility">
        <div className="nav-utility-inner">
          <div className="nav-utility-left">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 0 3px color-mix(in oklab, var(--accent) 22%, transparent)" }} />
              <span style={{ textTransform: "uppercase", color: "var(--accent)", fontWeight: 600 }}>Admissions Open · 2026-27</span>
            </span>
            <span className="nav-utility-divider" />
            <span style={{ textTransform: "uppercase", color: "var(--paper)", fontWeight: 600 }}>JEECUP {C.jeecup}</span>
            <span className="nav-utility-divider" />
            <span style={{ textTransform: "uppercase", color: "var(--paper)", fontWeight: 600 }}>Classes start 1 Aug</span>
          </div>
          <div className="nav-utility-right">
            <a href={`tel:${C.phone}`} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3 3h3l1 4-2 1a8 8 0 004 4l1-2 4 1v3a1 1 0 01-1 1A11 11 0 012 4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>
              {C.phone}
            </a>
            <span className="nav-utility-divider" />
            <a href={C.whatsapp} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#25D366", boxShadow: "0 0 0 3px color-mix(in oklab, #25D366 22%, transparent)" }} />
              WhatsApp
            </a>
            <span className="nav-utility-divider" />
            <div className="nav-utility-lang">
              <button onClick={() => setLang("en")} data-on={lang === "en"} aria-pressed={lang === "en"}>EN</button>
              <button onClick={() => setLang("hi")} data-on={lang === "hi"} aria-pressed={lang === "hi"}>हिं</button>
            </div>
          </div>
        </div>
      </div>

      <div className="nav-inner">
        <div className="row" style={{ alignItems: "center", gap: 18 }}>
          <BrandMark />
        </div>

        <div className="nav-links primary">
          <NavMenuWrap
            trigger={
              <Link href="/about" className={"nav-link " + (["about", "chairman", "principal", "teaching"].includes(route) ? "active" : "")}>
                {lang === "hi" ? "हमारे बारे में" : "About"}<span className="nav-caret" aria-hidden="true"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              </Link>
            }
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12, paddingLeft: 14 }}>
              The institution
            </div>
            <div className="nav-mega-grid">
              <MegaItem to="/about" title="BIPE" desc="Sixteen years on record" icon="M3 21V10l9-6 9 6v11M9 21V12h6v9" />
              <MegaItem to="/chairman" title="Chairman's Message" desc="Dr. Chandrika Rai, IPS (Retd.)" icon="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z" />
              <MegaItem to="/principal" title="Principal's Message" desc="A note from our leadership" icon="M3 5h18v14H3zM3 5l9 7 9-7" />
              <MegaItem to="/teaching" title="Teaching & Learning" desc="OBE + AI-augmented pedagogy" icon="M2 4h20v12H2zM2 20h20" />
            </div>
            <div className="nav-mega-footer">
              <span>Est. 2010 · Phoolpur</span>
              <Link href="/about" style={{ color: "var(--brand)", textDecoration: "none", fontWeight: 600 }}>Our story →</Link>
            </div>
          </NavMenuWrap>

          <NavLink to="/courses" label="Academics" hi="शैक्षणिक" currentRoute={route} />

          <NavMenuWrap
            trigger={
              <Link href="/admission" className={"nav-link " + (["admission", "fees", "scholarships", "jeecup", "apply", "documents"].includes(route) ? "active" : "")}>
                {lang === "hi" ? "प्रवेश" : "Admission"}<span className="nav-caret" aria-hidden="true"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              </Link>
            }
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12, paddingLeft: 14 }}>
              Join BIPE — Session 2026-27
            </div>
            <div className="nav-mega-grid">
              <MegaItem to="/admission" title="Overview" desc="JEECUP Group A · key dates" icon="M3 8h18M5 8V5h14v3M3 8v10h18V8M9 12h6" />
              <MegaItem to="/apply" title="Apply now" desc="Single-step form · callback in 24 hrs" icon="M14 3l7 7-11 11H3v-7L14 3z" />
              <MegaItem to="/early-registration" title="Pre-Counselling Registration" desc="JEECUP 2026 · reserve your branch before counselling" icon="M9 11l3 3L20 5M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" />
              <MegaItem to="/jeecup" title="JEECUP Guidance" desc="6-step counselling explainer" icon="M12 2v20M5 8l7-6 7 6M5 16l7 6 7-6" />
              <MegaItem to="/fees" title="Fees" desc="₹30,150/year — AFRC-approved" icon="M3 7h18v10H3zM7 12h2M14 12h3" />
              <MegaItem to="/scholarships" title="Scholarships" desc="UP post-matric & EWS support" icon="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z" />
              <MegaItem to="/documents" title="Documents" desc="Required certificates checklist" icon="M6 2h9l5 5v15H6zM15 2v5h5" />
            </div>
            <div className="nav-mega-footer">
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
                Counselling open
              </span>
              <Link href="/apply" style={{ color: "var(--brand)", textDecoration: "none", fontWeight: 600 }}>Apply now →</Link>
            </div>
          </NavMenuWrap>

          <NavLink to="/placements" label="Placements" hi="प्लेसमेंट" currentRoute={route} />

          <NavMenuWrap
            trigger={
              <Link href="/campus" className={"nav-link " + (["campus", "hostel", "faculty"].includes(route) ? "active" : "")}>
                {lang === "hi" ? "कैम्पस" : "Campus"}<span className="nav-caret" aria-hidden="true"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              </Link>
            }
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12, paddingLeft: 14 }}>
              Phoolpur, Varanasi
            </div>
            <div className="nav-mega-grid">
              <MegaItem to="/campus" title="Facilities" desc="Labs, library, workshops" icon="M3 21V8l9-6 9 6v13M9 21V12h6v9" />
              <MegaItem to="/hostel" title="Hostel" desc="Boys' block · on-campus mess" icon="M3 11l9-8 9 8v10H3zM9 21v-6h6v6" />
              <MegaItem to="/faculty" title="Faculty" desc="40 mentors · 1:20 ratio" icon="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0" />
            </div>
            <div className="nav-mega-footer">
              <span>~35 min from Varanasi Cantt by auto</span>
              <Link href="/visit#book" style={{ color: "var(--brand)", textDecoration: "none", fontWeight: 600 }}>Book a visit →</Link>
            </div>
          </NavMenuWrap>

          <NavLink to="/events" label="Events" hi="इवेंट्स" currentRoute={route} />

          <NavLink to="/alumni" label="Alumni" hi="पूर्व छात्र" currentRoute={route} />

          <NavLink to="/contact" label="Contact" hi="संपर्क" currentRoute={route} />
        </div>

        <div className="row" style={{ alignItems: "center", gap: 10 }}>
          <NavSearchButton />
          <Link href="/apply" className="btn btn-primary btn-sm" style={{ paddingLeft: 14, paddingRight: 14, whiteSpace: "nowrap" }}>
            <span className="hide-md">Apply for 2026-27</span>
            <span style={{ display: "none" }} className="show-md">Apply</span>
            <ArrowIcon size={14} />
          </Link>
          <button
            type="button"
            className="nav-hamburger"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((v) => !v)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>
    </nav>

    {/* Mobile drawer — rendered as a sibling of <nav>, not a child.
        The nav has `backdrop-filter`, which (in WebKit) establishes a
        containing block that would trap a position:fixed drawer inside
        the navbar's visual box. Pulling the drawer out to the root
        fragment makes `top:0; bottom:0` resolve to the actual viewport. */}
      <div
        className={"nav-drawer-backdrop" + (drawerOpen ? " is-open" : "")}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={"nav-drawer" + (drawerOpen ? " is-open" : "")}
        aria-hidden={!drawerOpen}
        role="dialog"
      >
        <div className="nav-drawer-header">
          <BrandMark />
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            className="nav-drawer-close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="nav-drawer-cta">
          <Link href="/apply" className="btn btn-primary" style={{ justifyContent: "center" }} onClick={() => setDrawerOpen(false)}>
            Apply for 2026-27 <ArrowIcon size={14} />
          </Link>
          <Link href="/early-registration" className="btn btn-sm" onClick={() => setDrawerOpen(false)}
            style={{ justifyContent: "center", marginTop: 8, background: "var(--accent)", color: "var(--ink)", border: "none", fontWeight: 600 }}>
            JEECUP 2026 · Pre-Counselling Registration →
          </Link>
          <div className="nav-drawer-lang">
            <button onClick={() => setLang("en")} data-on={lang === "en"} aria-pressed={lang === "en"}>EN</button>
            <button onClick={() => setLang("hi")} data-on={lang === "hi"} aria-pressed={lang === "hi"}>हिंदी</button>
          </div>
        </div>

        <div className="nav-drawer-scroll">
          {DRAWER_GROUPS.map((g) => (
            <div key={g.title} className="nav-drawer-group">
              <div className="nav-drawer-eyebrow">{g.title}</div>
              <div className="nav-drawer-list">
                {g.items.map((item) => {
                  const id = item.to === "/" ? "home" : item.to.replace(/^\//, "");
                  const active = route === id;
                  const label = lang === "hi" && item.hi ? item.hi : item.label;
                  return (
                    <Link
                      key={item.to}
                      href={item.to}
                      // Close the drawer on tap. Without this, tapping a
                      // link to the CURRENT page (e.g. "Academics" while
                      // already on /courses) does nothing user-visible:
                      // the route is unchanged, the drawer stays open,
                      // and it looks like the button is broken. User
                      // reported exactly this on /courses 2026-05-20.
                      // The handler also improves UX for cross-page
                      // taps — the drawer closes immediately rather
                      // than waiting for navigation to complete.
                      onClick={() => setDrawerOpen(false)}
                      className={"nav-drawer-link" + (active ? " is-active" : "")}
                    >
                      <span>{label}</span>
                      <ArrowIcon size={13} />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="nav-drawer-footer">
          <a href={`tel:${C.phone}`} className="btn btn-ghost" style={{ justifyContent: "center" }} onClick={() => setDrawerOpen(false)}>
            Call {C.phone}
          </a>
          <a href={C.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-wa" style={{ justifyContent: "center" }} onClick={() => setDrawerOpen(false)}>
            <WhatsAppIcon /> WhatsApp admissions
          </a>
        </div>
      </aside>
    </>
  );
}

type DrawerItem = { to: string; label: string; hi?: string };
const DRAWER_GROUPS: { title: string; items: DrawerItem[] }[] = [
  {
    title: "Main",
    items: [
      { to: "/", label: "Home", hi: "होम" },
      { to: "/about", label: "About BIPE", hi: "हमारे बारे में" },
      // /about/affiliations added 2026-05-20 — consolidated 7-affiliation
      // page (AICTE / BTEUP / AISHE / JEECUP / Purwanchal Educational
      // Trust / etc.) shipped earlier this session, had no nav link.
      { to: "/about/affiliations", label: "Affiliations & Approvals", hi: "मान्यता" },
      // /why-bipe — category-leader brand page (repositioned 2026-05-25
      // from a private-competitor comparison surface). Decision-stage
      // page, belongs right next to "About BIPE" in the Main section.
      { to: "/why-bipe", label: "Why BIPE", hi: "BIPE क्यों" },
      // /private-vs-government-polytechnic — the real comparison
      // surface (Phase 2, 25 May 2026). Addresses the actual decision:
      // government polytechnic seat at ~half the fee vs BIPE. Decision-
      // stage page; sits next to "Why BIPE" in the Main section.
      {
        to: "/private-vs-government-polytechnic",
        label: "Private vs Government",
        hi: "प्राइवेट vs सरकारी",
      },
      { to: "/chairman", label: "Chairman's Message", hi: "अध्यक्ष का संदेश" },
      { to: "/principal", label: "Principal's Message", hi: "प्रिंसिपल का संदेश" },
    ],
  },
  {
    title: "Admission · 2026-27",
    items: [
      { to: "/admission", label: "Admission Overview", hi: "प्रवेश" },
      { to: "/apply", label: "Apply now", hi: "आवेदन करें" },
      { to: "/jeecup", label: "JEECUP Guidance" },
      // /jeecup-counselling added 2026-05-20 — same nav-gap diagnosis
      // as Placements earlier this week. The page targets the
      // 18,100/mo "jeecup counselling" head term but had zero
      // permanent navigation entry. Now sits one slot below
      // JEECUP Guidance, which is the natural place a parent
      // would expect to find the dedicated counselling-steps
      // explainer.
      { to: "/jeecup-counselling", label: "JEECUP Counselling", hi: "जेईईसीयूपी काउंसलिंग" },
      { to: "/fees", label: "Fees", hi: "शुल्क" },
      { to: "/scholarships", label: "Scholarships", hi: "छात्रवृत्ति" },
      { to: "/documents", label: "Documents", hi: "दस्तावेज़" },
    ],
  },
  {
    title: "Academics",
    items: [
      { to: "/courses", label: "Academics", hi: "शैक्षणिक" },
      // Placements bumped up 2026-05-20 — user spotted that on the
      // mobile side menu it was 4th in the section, sitting below the
      // visible fold (after Teaching & Learning). Moving it to
      // position 2 puts it right after the academics overview, which
      // is the natural reader flow ("what do you study" →
      // "where does that take you") and the strongest argument we
      // have for the branch lineup. Alumni / Faculty / Teaching
      // matter but they're supporting content; Placements is the
      // conversion-critical page.
      { to: "/placements", label: "Placements", hi: "प्लेसमेंट" },
      { to: "/faculty", label: "Faculty", hi: "संकाय" },
      { to: "/teaching", label: "Teaching & Learning" },
      { to: "/alumni", label: "Alumni", hi: "पूर्व छात्र" },
    ],
  },
  {
    title: "Campus",
    items: [
      { to: "/campus", label: "Campus tour", hi: "कैम्पस" },
      { to: "/hostel", label: "Hostel", hi: "छात्रावास" },
      { to: "/events", label: "Events", hi: "इवेंट्स" },
      { to: "/contact", label: "Contact", hi: "संपर्क" },
    ],
  },
  // Compliance pages (Approvals, Mandatory Disclosure, Grievance,
  // Anti-Ragging) are reachable from the footer's "Compliances" column.
];
