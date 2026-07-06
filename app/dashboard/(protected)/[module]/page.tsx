"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import ManagementPlaceholder from "@/components/dashboard/ManagementPlaceholder";
import { getDashboardManagementRoute } from "@/lib/dashboardNav";

export default function DashboardModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = use(params);

  if (module === "ballroom") {
    notFound();
  }

  const route = getDashboardManagementRoute(`/dashboard/${module}`);

  if (!route) {
    notFound();
  }

  return <ManagementPlaceholder group={route.group} activeItem={route.activeItem} />;
}
