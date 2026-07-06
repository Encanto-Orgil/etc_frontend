"use client";

import { ConfigProvider, Layout } from "antd";
import { usePathname } from "next/navigation";
import type { AuthUser } from "@/lib/auth";
import { getPortalPageMeta } from "@/lib/portalNav";
import styles from "../dashboard/DashboardShell.module.css";
import PortalSidebar from "./PortalSidebar";
import PortalTopBar from "./PortalTopBar";

const { Content } = Layout;

export default function PortalShell({
  user,
  children,
}: {
  user: AuthUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageMeta = getPortalPageMeta(pathname);

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
        <Layout className={styles.main}>
          <PortalSidebar user={user} />
          <Layout className={styles.contentShell}>
            <PortalTopBar eyebrow={pageMeta.eyebrow} title={pageMeta.title} user={user} />
            <Content className={styles.content}>{children}</Content>
          </Layout>
        </Layout>
      </div>
    </ConfigProvider>
  );
}
