"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import BmsManagement, { type BmsManagementView } from "@/components/dashboard/BmsManagement";

const BMS_VIEWS = new Set<BmsManagementView>(["cameras", "fire-alarms", "elevator-access"]);

export default function DashboardBmsViewPage({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view } = use(params);

  if (!BMS_VIEWS.has(view as BmsManagementView)) {
    notFound();
  }

  return <BmsManagement view={view as BmsManagementView} />;
}
