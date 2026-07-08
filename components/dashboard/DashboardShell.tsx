"use client";

import { ConfigProvider, Layout } from "antd";
import { usePathname } from "next/navigation";
import type { AuthUser } from "@/lib/auth";
import { getDashboardPageMeta } from "@/lib/dashboardNav";
import DashboardProjectProvider from "@/components/dashboard/DashboardProjectProvider";
import styles from "./DashboardShell.module.css";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const { Content } = Layout;

export default function DashboardShell({
  user,
  children,
}: {
  user: AuthUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageMeta = getDashboardPageMeta(pathname);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#000000",
          borderRadius: 8,
          colorBorder: "#eaeaea",
          colorText: "#111111",
          colorTextSecondary: "#666666",
          fontFamily:
            '"Inter Variable", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
      }}
    >
      <div className={styles.scope}>
        <DashboardProjectProvider>
          <Layout className={styles.main}>
            <Sidebar user={user} />
            <Layout className={styles.contentShell}>
              <TopBar eyebrow={pageMeta.eyebrow} title={pageMeta.title} user={user} />
              <Content className={styles.content}>{children}</Content>
            </Layout>
          </Layout>
        </DashboardProjectProvider>
      </div>
    </ConfigProvider>
  );
}
