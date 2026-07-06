import type { Metadata } from "next";
import "@fontsource-variable/inter";
import { dashboardMetadata } from "@/lib/seo";

export const metadata: Metadata = dashboardMetadata;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
