"use client";

import { usePathname } from "next/navigation";
import { Nav } from "./Nav";
import { Footer, type FooterContact } from "./Footer";
import { RevealObserver } from "@/components/ui/RevealObserver";

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
      <main>{children}</main>
      <Footer contact={contact} />
      <RevealObserver />
    </>
  );
}
