import type { Metadata } from "next";
import { headers } from "next/headers";
import DashboardAuthGate from "@/components/dashboard/DashboardAuthGate";
import { dashboardPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const pathname = (await headers()).get("x-pathname") ?? "/dashboard";
  return dashboardPageMetadata(pathname);
}

export default function ProtectedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardAuthGate>{children}</DashboardAuthGate>;
}
