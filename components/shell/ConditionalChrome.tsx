"use client";

import { usePathname } from "next/navigation";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { RevealObserver } from "@/components/ui/RevealObserver";

/**
 * The public site's Nav + Footer + scroll-reveal observer should NOT
 * appear on the /admin dashboard. This client component reads the
 * pathname and conditionally mounts them.
 */
export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname() ?? "/";
  const isAdmin = path.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
      <RevealObserver />
    </>
  );
}
