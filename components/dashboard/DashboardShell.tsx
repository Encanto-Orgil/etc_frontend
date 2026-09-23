"use client";

import { useEffect, useState } from "react";
import { ConfigProvider, Layout } from "antd";
import { usePathname } from "next/navigation";
import type { AuthUser } from "@/lib/auth";
import { getDashboardPageMeta } from "@/lib/dashboardNav";
import DashboardProjectProvider from "@/components/dashboard/DashboardProjectProvider";
import { SidebarCollapseContext } from "@/components/dashboard/SidebarCollapseContext";
import styles from "./DashboardShell.module.css";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const { Content } = Layout;

const SIDEBAR_COLLAPSED_KEY = "etc_dashboard_sidebar_collapsed";

export default function DashboardShell({
  user,
  children,
}: {
  user: AuthUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageMeta = getDashboardPageMeta(pathname);
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1");
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "1" : "0");
    } catch {
      // ignore
    }
  }, [collapsed, ready]);

  const toggleCollapsed = () => setCollapsed((value) => !value);

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
        <SidebarCollapseContext.Provider
          value={{ collapsed, setCollapsed, toggleCollapsed }}
        >
          <DashboardProjectProvider>
            <Layout className={styles.main}>
              <Sidebar user={user} />
              <Layout
                className={`${styles.contentShell} ${
                  collapsed ? styles.contentShellCollapsed : ""
                }`}
              >
                <TopBar
                  eyebrow={pageMeta.eyebrow}
                  title={pageMeta.title}
                  user={user}
                />
                <Content className={styles.content}>{children}</Content>
              </Layout>
            </Layout>
          </DashboardProjectProvider>
        </SidebarCollapseContext.Provider>
      </div>
    </ConfigProvider>
  );
}
