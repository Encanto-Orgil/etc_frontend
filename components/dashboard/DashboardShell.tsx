"use client";

import {
  AppstoreOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PartitionOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Menu } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { AuthUser } from "@/lib/auth";
import { logout } from "@/lib/auth";
import { getDashboardPageMeta, isStackingSection } from "@/lib/dashboardNav";
import styles from "./DashboardShell.module.css";

const { Sider, Header, Content } = Layout;

const SIDEBAR_KEY = "etc-dashboard-sidebar-collapsed";

const menuItems = [
  { key: "/dashboard", icon: <DashboardOutlined />, label: "Тойм" },
  { key: "/dashboard/stacking", icon: <PartitionOutlined />, label: "Түрээсийн төлөвлөлт" },
  { key: "admin", icon: <AppstoreOutlined />, label: "Django админ" },
];

export default function DashboardShell({
  user,
  children,
}: {
  user: AuthUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const pageMeta = getDashboardPageMeta(pathname);
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_KEY);
    if (stored === "1") setCollapsed(true);
    setReady(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
      return next;
    });
  };

  const displayName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;

  const onLogout = async () => {
    await logout();
    router.replace("/dashboard/login");
  };

  const userMenu = {
    items: [
      {
        key: "admin",
        label: (
          <a href="http://localhost:8000/admin/" target="_blank" rel="noreferrer">
            Django админ
          </a>
        ),
      },
      { type: "divider" as const },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Гарах",
        onClick: onLogout,
      },
    ],
  };

  return (
    <div className={styles.scope}>
      <Layout className={styles.layout}>
        <Sider
          className={styles.sider}
          width={248}
          collapsedWidth={72}
          collapsible
          collapsed={collapsed}
          trigger={null}
          onCollapse={setCollapsed}
        >
          <div className={styles.siderInner}>
            <div className={`${styles.brand} ${collapsed ? styles.brandCollapsed : ""}`}>
              <Link href="/dashboard" className={styles.brandLink}>
                <span className={styles.brandMark}>E</span>
                {!collapsed ? (
                  <div className={styles.brandCopy}>
                    <strong>ETC удирдлага</strong>
                    <span>Түрээсийн систем</span>
                  </div>
                ) : null}
              </Link>
            </div>

            <div className={styles.menuWrap}>
              <Menu
                mode="inline"
                inlineCollapsed={collapsed}
                selectedKeys={[isStackingSection(pathname) ? "/dashboard/stacking" : pathname]}
                items={menuItems}
                className={styles.menu}
                onClick={({ key }) => {
                  if (key === "admin") {
                    window.open("http://localhost:8000/admin/", "_blank");
                    return;
                  }
                  if (!key.startsWith("/")) return;
                  router.push(key);
                }}
              />
            </div>

            {!collapsed ? (
              <div className={styles.siderFooter}>
                <span>Encanto Trade Center</span>
              </div>
            ) : null}
          </div>
        </Sider>

        <Layout className={styles.main}>
          <Header className={styles.header}>
            <div className={styles.headerLeft}>
              <Button
                type="text"
                className={styles.toggleBtn}
                aria-label={collapsed ? "Sidebar нээх" : "Sidebar хаах"}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={toggleCollapsed}
              />

              <div className={styles.headerTitles}>
                {pageMeta.eyebrow ? (
                  <p className={styles.eyebrow}>{pageMeta.eyebrow}</p>
                ) : null}
                <h1 className={styles.pageTitle}>{pageMeta.title}</h1>
              </div>
            </div>

            <Dropdown menu={userMenu} placement="bottomRight" trigger={["click"]}>
              <button type="button" className={styles.userBtn}>
                <Avatar className={styles.avatar}>{displayName.charAt(0).toUpperCase()}</Avatar>
                <span className={styles.userMeta}>
                  <strong>{displayName}</strong>
                  <small>{user.email || user.username}</small>
                </span>
              </button>
            </Dropdown>
          </Header>

          <Content className={styles.content}>{ready ? children : null}</Content>
        </Layout>
      </Layout>
    </div>
  );
}
