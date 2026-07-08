"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import BallroomContractDetail from "@/components/dashboard/BallroomContractDetail";

export default function DashboardBallroomContractPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const contractId = Number(id);

  if (!Number.isInteger(contractId) || contractId <= 0) {
    notFound();
  }

  return <BallroomContractDetail contractId={contractId} />;
}
