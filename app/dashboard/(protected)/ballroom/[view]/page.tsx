"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import BallroomCalendar from "@/components/dashboard/BallroomCalendar";
import BallroomManagement, { type BallroomManagementView } from "@/components/dashboard/BallroomManagement";
import ManagementPlaceholder from "@/components/dashboard/ManagementPlaceholder";
import { getDashboardManagementRoute } from "@/lib/dashboardNav";

const MANAGEMENT_VIEWS = new Set<BallroomManagementView>(["dashboard", "bookings", "invoices", "quotes", "contracts", "events", "settings"]);

export default function DashboardBallroomViewPage({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view } = use(params);

  if (view === "calendar") {
    return <BallroomCalendar />;
  }

  if (MANAGEMENT_VIEWS.has(view as BallroomManagementView)) {
    return <BallroomManagement view={view as BallroomManagementView} />;
  }

  const route = getDashboardManagementRoute(`/dashboard/ballroom/${view}`);
  if (!route) {
    notFound();
  }

  return <ManagementPlaceholder group={route.group} activeItem={route.activeItem} />;
}
