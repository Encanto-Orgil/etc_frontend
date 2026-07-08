import type { Metadata } from "next";
import { portalLoginMetadata } from "@/lib/seo";

export const metadata: Metadata = portalLoginMetadata;

export default function PortalLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
