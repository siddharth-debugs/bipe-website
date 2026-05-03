"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DATA } from "@/lib/data";
import { useLang } from "@/lib/lang";
import { ArrowIcon, WhatsAppIcon } from "./Icons";
import { BrandMark } from "./BrandMark";

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

  return (
    <nav className="nav">
      <div className="nav-utility">
        <div className="nav-utility-inner">
          <div className="nav-utility-left">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 0 3px color-mix(in oklab, var(--accent) 22%, transparent)" }} />
              <span style={{ textTransform: "uppercase", color: "var(--ink-2)", fontWeight: 600 }}>Admissions Open · 2026-27</span>
            </span>
            <span className="nav-utility-divider" />
            <span style={{ textTransform: "uppercase", color: "var(--ink-3)" }}>JEECUP {C.jeecup}</span>
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
          <NavLink to="/" label="Home" hi="होम" currentRoute={route} />

          <NavMenuWrap
            trigger={
              <Link href="/about" className={"nav-link " + (["about", "principal", "teaching", "approvals", "ai-policy", "mandatory-disclosure", "anti-ragging", "grievance"].includes(route) ? "active" : "")}>
                {lang === "hi" ? "हमारे बारे में" : "About"}<span className="nav-caret" aria-hidden="true"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              </Link>
            }
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12, paddingLeft: 14 }}>
              The institution
            </div>
            <div className="nav-mega-grid">
              <MegaItem to="/about" title="About BIPE" desc="Sixteen years in Eastern UP" icon="M3 21V10l9-6 9 6v11M9 21V12h6v9" />
              <MegaItem to="/principal" title="Principal's Message" desc="A note from our leadership" icon="M3 5h18v14H3zM3 5l9 7 9-7" />
              <MegaItem to="/teaching" title="Teaching & Learning" desc="OBE + AI-augmented pedagogy" icon="M2 4h20v12H2zM2 20h20" />
              <MegaItem to="/ai-policy" title="AI Policy" desc="How we use Claude in class" icon="M12 2a8 8 0 100 16 8 8 0 000-16zm0 4v8m-4-4h8" />
              <MegaItem to="/approvals" title="Approvals" desc="AICTE, BTEUP, ISO, AISHE" icon="M9 12l2 2 4-4M12 3l8 4v6c0 5-4 8-8 8s-8-3-8-8V7l8-4z" />
              <MegaItem to="/mandatory-disclosure" title="Mandatory Disclosure" desc="AICTE Annexure-18 · 2026-27" icon="M6 2h9l5 5v15H6zM15 2v5h5" />
              <MegaItem to="/grievance" title="Grievance & Committees" desc="Anti-Ragging · POSH · SC/ST · PWD" icon="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0" />
              <MegaItem to="/anti-ragging" title="Anti-Ragging" desc="Zero-tolerance · UGC helpline" icon="M12 3l8 4v6c0 5-4 8-8 8s-8-3-8-8V7l8-4z" />
            </div>
            <div className="nav-mega-footer">
              <span>Est. 2010 · Phoolpur</span>
              <Link href="/about" style={{ color: "var(--brand)", textDecoration: "none", fontWeight: 600 }}>Our story →</Link>
            </div>
          </NavMenuWrap>

          <NavLink to="/courses" label="Courses" hi="पाठ्यक्रम" currentRoute={route} />

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
              <MegaItem to="/admission" title="Admission Overview" desc="JEECUP Group A · key dates" icon="M3 8h18M5 8V5h14v3M3 8v10h18V8M9 12h6" />
              <MegaItem to="/apply" title="Apply now" desc="4-step form · 5 minutes" icon="M14 3l7 7-11 11H3v-7L14 3z" />
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
              <Link href="/campus" className={"nav-link " + (["campus", "hostel", "faculty", "events"].includes(route) ? "active" : "")}>
                {lang === "hi" ? "कैम्पस" : "Campus"}<span className="nav-caret" aria-hidden="true"><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              </Link>
            }
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 12, paddingLeft: 14 }}>
              Six-acre campus, Phoolpur
            </div>
            <div className="nav-mega-grid">
              <MegaItem to="/campus" title="Facilities" desc="Labs, library, workshops" icon="M3 21V8l9-6 9 6v13M9 21V12h6v9" />
              <MegaItem to="/hostel" title="Hostel" desc="Boys' & girls' blocks · mess" icon="M3 11l9-8 9 8v10H3zM9 21v-6h6v6" />
              <MegaItem to="/faculty" title="Faculty" desc="45+ mentors · 1:20 ratio" icon="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0" />
              <MegaItem to="/events" title="Events" desc="Tech fest, drives, open house" icon="M5 4h14v16H5zM5 8h14M9 2v4M15 2v4" />
            </div>
            <div className="nav-mega-footer">
              <span>Free shuttle · Varanasi Cantt</span>
              <Link href="/visit" style={{ color: "var(--brand)", textDecoration: "none", fontWeight: 600 }}>Book a visit →</Link>
            </div>
          </NavMenuWrap>

          <NavLink to="/visit" label="Visit" hi="विज़िट" currentRoute={route} />
          <NavLink to="/contact" label="Contact" hi="संपर्क" currentRoute={route} />
        </div>

        <div className="row" style={{ alignItems: "center", gap: 10 }}>
          <a href={C.whatsapp} target="_blank" rel="noopener noreferrer"
            title="WhatsApp"
            style={{ width: 36, height: 36, borderRadius: 10, background: "var(--brand-tint)", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "background .2s" }}>
            <WhatsAppIcon />
          </a>
          <Link href="/apply" className="btn btn-primary btn-sm" style={{ paddingLeft: 14, paddingRight: 14, whiteSpace: "nowrap" }}>
            <span className="hide-md">Apply for 2026-27</span>
            <span style={{ display: "none" }} className="show-md">Apply</span>
            <ArrowIcon size={14} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
