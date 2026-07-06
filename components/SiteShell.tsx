"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppShell = pathname.startsWith("/dashboard") || pathname.startsWith("/portal");

  if (isAppShell) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
