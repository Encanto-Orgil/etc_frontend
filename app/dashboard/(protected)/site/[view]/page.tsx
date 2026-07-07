"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import ManagementPlaceholder from "@/components/dashboard/ManagementPlaceholder";
import SiteNewsManagement from "@/components/dashboard/SiteNewsManagement";
import { getDashboardManagementRoute } from "@/lib/dashboardNav";

export default function DashboardSiteViewPage({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view } = use(params);

  if (view === "news") {
    return <SiteNewsManagement />;
  }

  const route = getDashboardManagementRoute(`/dashboard/site/${view}`);
  if (!route) {
    notFound();
  }

  return <ManagementPlaceholder group={route.group} activeItem={route.activeItem} />;
}
