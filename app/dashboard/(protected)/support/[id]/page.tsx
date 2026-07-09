"use client";

import { use } from "react";
import SupportTicketDetail from "@/components/dashboard/SupportTicketDetail";

export default function DashboardSupportTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <SupportTicketDetail ticketId={Number(id)} />;
}
