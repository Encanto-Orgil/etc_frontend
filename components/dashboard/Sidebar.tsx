"use client";

import {
  AppstoreOutlined,
  CalendarOutlined,
  ClusterOutlined,
  DownOutlined,
  FormOutlined,
  GlobalOutlined,
  LogoutOutlined,
  MessageOutlined,
  MoreOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "@/lib/api";
import type { AuthUser } from "@/lib/auth";
import { logout } from "@/lib/auth";
import {
  DASHBOARD_MANAGEMENT_GROUPS,
  getDashboardOpenKeys,
  getDashboardSelectedKey,
} from "@/lib/dashboardNav";
import styles from "./DashboardShell.module.css";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const managementIcons: Record<string, ReactNode> = {
  "property-management": <ShopOutlined />,
  "ballroom-management": <CalendarOutlined />,
  "bms-management": <ClusterOutlined />,
  "site-management": <GlobalOutlined />,
  "admin-management": <SafetyCertificateOutlined />,
};

export default function Sidebar({ user }: { user: AuthUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const selectedKeys = [getDashboardSelectedKey(pathname)];
  const [openKeys, setOpenKeys] = useState<string[]>(getDashboardOpenKeys(pathname));
  const managementItems = useMemo<MenuItem[]>(
    () => [
      { key: "/dashboard", icon: <AppstoreOutlined />, label: "Dashboard" },
      { key: "/dashboard/inquiries", icon: <FormOutlined />, label: "Inquiries" },
      { key: "/dashboard/support", icon: <MessageOutlined />, label: "Support Tickets" },
      ...DASHBOARD_MANAGEMENT_GROUPS.filter(
        (group) => group.key !== "admin-management" || user.is_superuser,
      ).map((group) => ({
        key: group.key,
        icon: managementIcons[group.key],
        label: group.label,
        children: group.items.map((item) => ({
          key: item.key,
          label: item.label,
        })),
      })),
    ],
    [user.is_superuser],
  );

  useEffect(() => {
    const activeOpenKeys = getDashboardOpenKeys(pathname);
    setOpenKeys((current) => Array.from(new Set([...current, ...activeOpenKeys])));
  }, [pathname]);

  const adminUrl = `${API_BASE.replace(/\/api\/?$/, "")}/admin/`;
  const displayName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;

  const userMenu: MenuProps = {
    items: [
      {
        key: "admin",
        label: (
          <a href={adminUrl} target="_blank" rel="noreferrer">
            Django admin
          </a>
        ),
      },
      { type: "divider" },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Log out",
        onClick: async () => {
          await logout();
          router.replace("/dashboard/login");
        },
      },
    ],
  };

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (typeof key === "string" && key.startsWith("/dashboard")) {
      router.push(key);
    }
  };

  return (
    <Sider className={styles.sider} width={260}>
      <div className={styles.siderInner}>
        <Dropdown
          menu={{
            items: [
              { key: "team", label: "Encanto Trade Center" },
              { key: "settings", label: "Team settings" },
            ],
          }}
          trigger={["click"]}
        >
          <button type="button" className={styles.teamSwitcher}>
            <span className={styles.teamAvatar}>E</span>
            <span className={styles.teamCopy}>
              <strong>Encanto Trade Center</strong>
            </span>
            <DownOutlined className={styles.teamChevron} />
          </button>
        </Dropdown>

        <button type="button" className={styles.findButton}>
          <SearchOutlined />
          <span>Find...</span>
          <kbd>F</kbd>
        </button>

        <nav className={styles.navArea} aria-label="Dashboard navigation">
          <Menu
            className={styles.menu}
            mode="inline"
            items={managementItems}
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onOpenChange={setOpenKeys}
            onClick={onMenuClick}
          />
        </nav>

        <div className={styles.userRow}>
          <Avatar className={styles.userAvatar}>
            {displayName.slice(0, 1).toUpperCase()}
          </Avatar>
          <span className={styles.userName}>{displayName}</span>
          <Dropdown menu={userMenu} placement="topRight" trigger={["click"]}>
            <button type="button" className={styles.footerIcon} aria-label="Open user menu">
              <MoreOutlined />
            </button>
          </Dropdown>
        </div>
      </div>
    </Sider>
  );
}
