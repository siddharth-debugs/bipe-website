"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Nav } from "./Nav";
import { Footer, type FooterContact } from "./Footer";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { WhatsAppFAB } from "./WhatsAppFAB";
import { TrustBadgeStrip } from "./TrustBadgeStrip";

// CommandK (⌘K palette) and InquiryModal (timed enquiry popup) render
// nothing until the user triggers them (a keypress / the Nav search
// button / a delay timer). Statically importing them shipped their JS in
// the initial bundle and hydrated it inside the first long task — wasted
// main-thread work that inflated INP. Lazy-loading with ssr:false moves
// both into a chunk that loads AFTER hydration, off the early-interaction
// critical path; their own listeners/timers attach a beat later, which is
// imperceptible. (CWV INP work, Jun 2026.)
const InquiryModal = dynamic(() => import("./InquiryModal").then((m) => m.InquiryModal), { ssr: false });
const CommandK = dynamic(() => import("./CommandK").then((m) => m.CommandK), { ssr: false });

/**
 * The public site's Nav + Footer + scroll-reveal observer should NOT
 * appear on the /admin dashboard. This client component reads the
 * pathname and conditionally mounts them.
 *
 * `contact` is fetched server-side in app/layout.tsx (via getContact())
 * and threaded through here so the Footer — which renders the address,
 * phone, email, WhatsApp link, JEECUP code, etc. — can pick up live
 * edits from the admin panel without an SSR boundary issue. Falling
 * back to DATA.contact happens inside the Footer itself.
 */
export function ConditionalChrome({
  children,
  contact,
}: {
  children: React.ReactNode;
  contact?: FooterContact;
}) {
  const path = usePathname() ?? "/";
  const isAdmin = path.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Nav />
      <TrustBadgeStrip />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer contact={contact} />
      <WhatsAppFAB />
      <InquiryModal />
      <CommandK />
      <RevealObserver />
    </>
  );
}
