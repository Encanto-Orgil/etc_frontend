"use client";

import { use } from "react";
import PortalTicketDetail from "@/components/portal/PortalTicketDetail";
import styles from "@/components/dashboard/DashboardOverview.module.css";

export default function PortalTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <main className={styles.page}>
      <PortalTicketDetail ticketId={Number(id)} />
    </main>
  );
}
