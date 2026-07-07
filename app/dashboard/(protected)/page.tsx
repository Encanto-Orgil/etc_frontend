"use client";

import AlertsCard from "@/components/dashboard/AlertsCard";
import InquiriesCard from "@/components/dashboard/InquiriesCard";
import ProjectsGrid from "@/components/dashboard/ProjectsGrid";
import RecentPreviewsCard from "@/components/dashboard/RecentPreviewsCard";
import SupportTicketsCard from "@/components/dashboard/SupportTicketsCard";
import UsageCard from "@/components/dashboard/UsageCard";
import { projects, recentPreview, usageMetrics } from "@/lib/dashboardMockData";
import styles from "@/components/dashboard/DashboardOverview.module.css";

export default function DashboardPage() {
  return (
    <main className={styles.page}>
      <div className={styles.overviewGrid}>
        <aside className={styles.sideColumn}>
          <UsageCard metrics={usageMetrics} />
          <SupportTicketsCard />
          <InquiriesCard />
          <AlertsCard />
          <RecentPreviewsCard preview={recentPreview} />
        </aside>

        <ProjectsGrid projects={projects} />
      </div>
    </main>
  );
}
