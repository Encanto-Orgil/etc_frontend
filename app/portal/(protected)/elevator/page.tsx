"use client";

import PortalElevatorAccessPanel from "@/components/portal/PortalElevatorAccess";
import styles from "@/components/dashboard/DashboardOverview.module.css";

export default function PortalElevatorPage() {
  return (
    <main className={styles.page}>
      <PortalElevatorAccessPanel />
    </main>
  );
}
