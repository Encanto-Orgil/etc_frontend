"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { LocaleProvider } from "@/lib/i18n";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppShell = pathname.startsWith("/dashboard") || pathname.startsWith("/portal");
  const isBareDocument =
    pathname.startsWith("/ballroom/invoice/") || pathname.startsWith("/ballroom/quote/");

  if (isAppShell || isBareDocument) {
    return <>{children}</>;
  }

  return (
    <LocaleProvider>
      <Navbar />
      <main className="site-main">{children}</main>
      <Footer />
    </LocaleProvider>
  );
}
