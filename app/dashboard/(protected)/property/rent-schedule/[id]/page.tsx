"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import PropertyInvoiceDetail from "@/components/dashboard/PropertyInvoiceDetail";

export default function DashboardPropertyRentScheduleInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const lineId = Number(id);

  if (!Number.isInteger(lineId) || lineId <= 0) {
    notFound();
  }

  return <PropertyInvoiceDetail lineId={lineId} />;
}
