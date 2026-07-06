"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import PropertyTenantDetail from "@/components/dashboard/PropertyTenantDetail";

export default function DashboardPropertyTenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const tenantId = Number(id);

  if (!Number.isInteger(tenantId) || tenantId <= 0) {
    notFound();
  }

  return <PropertyTenantDetail tenantId={tenantId} />;
}
