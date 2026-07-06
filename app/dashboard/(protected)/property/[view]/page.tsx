"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import PropertyManagement, { type PropertyManagementView } from "@/components/dashboard/PropertyManagement";

const PROPERTY_VIEWS = new Set<PropertyManagementView>([
  "dashboard",
  "buildings",
  "floors",
  "units",
  "tenants",
  "contracts",
  "rent-schedule",
  "rental-invoices",
]);

export default function DashboardPropertyViewPage({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view } = use(params);

  if (!PROPERTY_VIEWS.has(view as PropertyManagementView)) {
    notFound();
  }

  return <PropertyManagement view={view as PropertyManagementView} />;
}
