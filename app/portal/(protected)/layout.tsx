import type { Metadata } from "next";
import { headers } from "next/headers";
import PortalAuthGate from "@/components/portal/PortalAuthGate";
import { portalPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const pathname = (await headers()).get("x-pathname") ?? "/portal";
  return portalPageMetadata(pathname);
}

export default function ProtectedPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalAuthGate>{children}</PortalAuthGate>;
}
