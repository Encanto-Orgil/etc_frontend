"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import BallroomQuoteDetail from "@/components/dashboard/BallroomQuoteDetail";

export default function DashboardBallroomQuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const quoteId = Number(id);

  if (!Number.isInteger(quoteId) || quoteId <= 0) {
    notFound();
  }

  return <BallroomQuoteDetail quoteId={quoteId} />;
}
