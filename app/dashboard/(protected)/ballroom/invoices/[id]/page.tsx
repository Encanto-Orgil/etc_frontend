"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import BallroomInvoiceDetail from "@/components/dashboard/BallroomInvoiceDetail";

export default function DashboardBallroomInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const invoiceId = Number(id);

  if (!Number.isInteger(invoiceId) || invoiceId <= 0) {
    notFound();
  }

  return <BallroomInvoiceDetail invoiceId={invoiceId} />;
}
