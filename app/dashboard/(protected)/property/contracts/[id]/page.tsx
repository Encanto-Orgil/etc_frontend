"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import PropertyContractDetail from "@/components/dashboard/PropertyContractDetail";

export default function DashboardPropertyContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const contractId = Number(id);

  if (!Number.isInteger(contractId) || contractId <= 0) {
    notFound();
  }

  return <PropertyContractDetail contractId={contractId} />;
}
