import type { Metadata } from "next";
import { dashboardLoginMetadata } from "@/lib/seo";

export const metadata: Metadata = dashboardLoginMetadata;

export default function DashboardLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
