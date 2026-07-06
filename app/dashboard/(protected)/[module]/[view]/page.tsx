"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import ManagementPlaceholder from "@/components/dashboard/ManagementPlaceholder";
import { getDashboardManagementRoute } from "@/lib/dashboardNav";

export default function DashboardModuleViewPage({
  params,
}: {
  params: Promise<{ module: string; view: string }>;
}) {
  const { module, view } = use(params);
  const route = getDashboardManagementRoute(`/dashboard/${module}/${view}`);

  if (!route) {
    notFound();
  }

  if (module === "ballroom") {
    notFound();
  }

  return <ManagementPlaceholder group={route.group} activeItem={route.activeItem} />;
}
