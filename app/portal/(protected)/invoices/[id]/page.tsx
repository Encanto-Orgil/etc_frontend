"use client";

import { use } from "react";
import PortalInvoiceDetail from "@/components/portal/PortalInvoiceDetail";
import styles from "@/components/dashboard/DashboardOverview.module.css";

export default function PortalInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <main className={styles.page}>
      <PortalInvoiceDetail lineId={Number(id)} />
    </main>
  );
}
