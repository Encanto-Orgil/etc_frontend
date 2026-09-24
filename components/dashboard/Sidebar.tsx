"use client";

import {
  AppstoreOutlined,
  CalendarOutlined,
  ClusterOutlined,
  DownOutlined,
  FileTextOutlined,
  FormOutlined,
  GlobalOutlined,
  InboxOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  MoreOutlined,
  ReadOutlined,
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
import {
  CENTRO_NAV_ITEMS,
  DASHBOARD_PROJECTS,
  getProjectIdFromPathname,
  type DashboardProjectId,
} from "@/lib/dashboardProjects";
import { useDashboardProject } from "@/components/dashboard/DashboardProjectProvider";
import { useSidebarCollapse } from "@/components/dashboard/SidebarCollapseContext";
import { fetchInquirySummary } from "@/lib/inquiryManagement";
import { fetchBallroomSummary } from "@/lib/ballroomManagement";
import { fetchSupportTicketSummary } from "@/lib/supportManagement";
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

const centroIcons: Record<string, ReactNode> = {
  "/dashboard/centro": <AppstoreOutlined />,
  "/dashboard/centro/brands": <ShopOutlined />,
  "/dashboard/centro/news": <ReadOutlined />,
  "/dashboard/centro/inquiries": <InboxOutlined />,
  "/dashboard/centro/pages": <FileTextOutlined />,
};

function MenuLabel({
  text,
  count,
  collapsed,
}: {
  text: string;
  count?: number;
  collapsed?: boolean;
}) {
  if (collapsed || !count || count <= 0) return <span>{text}</span>;
  const display = count > 99 ? "99+" : String(count);
  return (
    <span className={styles.menuLabelInner}>
      <span className={styles.menuLabelText}>{text}</span>
      <span className={styles.menuCountBadge} aria-label={`${count} pending`}>
        {display}
      </span>
    </span>
  );
}

export default function Sidebar({ user }: { user: AuthUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, setCollapsed, toggleCollapsed } = useSidebarCollapse();
  const { projectId, setProject } = useDashboardProject();
  const activeProjectId = getProjectIdFromPathname(pathname) ?? projectId;
  const isCentro = activeProjectId === "encanto-centro";
  const currentProject = DASHBOARD_PROJECTS[activeProjectId];

  const selectedKeys = [getDashboardSelectedKey(pathname, activeProjectId)];
  const [openKeys, setOpenKeys] = useState<string[]>(getDashboardOpenKeys(pathname));
  const [navCounts, setNavCounts] = useState({ inquiries: 0, support: 0, pendingBookings: 0 });

  useEffect(() => {
    if (isCentro) return;

    let cancelled = false;

    async function loadNavCounts() {
      try {
        const [inquirySummary, supportSummary, ballroomSummary] = await Promise.all([
          fetchInquirySummary(),
          fetchSupportTicketSummary(),
          fetchBallroomSummary(),
        ]);
        if (cancelled) return;
        setNavCounts({
          inquiries: inquirySummary.summary.pending,
          support: supportSummary.summary.open + supportSummary.summary.in_progress,
          pendingBookings: ballroomSummary.summary.pending_bookings,
        });
      } catch {
        // Keep sidebar usable if count endpoints fail.
      }
    }

    loadNavCounts();
    return () => {
      cancelled = true;
    };
  }, [pathname, isCentro]);

  const managementItems = useMemo<MenuItem[]>(
    () => [
      { key: "/dashboard", icon: <AppstoreOutlined />, label: "Dashboard" },
      {
        key: "/dashboard/inquiries",
        icon: <FormOutlined />,
        label: (
          <MenuLabel
            text="Inquiries"
            count={navCounts.inquiries}
            collapsed={collapsed}
          />
        ),
      },
      {
        key: "/dashboard/support",
        icon: <MessageOutlined />,
        label: (
          <MenuLabel
            text="Support Tickets"
            count={navCounts.support}
            collapsed={collapsed}
          />
        ),
      },
      ...DASHBOARD_MANAGEMENT_GROUPS.filter(
        (group) => group.key !== "admin-management" || user.is_superuser,
      ).map((group) => ({
        key: group.key,
        icon: managementIcons[group.key],
        label: group.label,
        children: group.items.map((item) => ({
          key: item.key,
          label:
            group.key === "ballroom-management" &&
            item.key === "/dashboard/ballroom/bookings" ? (
              <MenuLabel
                text={item.label}
                count={navCounts.pendingBookings}
                collapsed={collapsed}
              />
            ) : (
              item.label
            ),
        })),
      })),
    ],
    [
      user.is_superuser,
      navCounts.inquiries,
      navCounts.support,
      navCounts.pendingBookings,
      collapsed,
    ],
  );

  const centroItems = useMemo<MenuItem[]>(
    () =>
      CENTRO_NAV_ITEMS.map((item) => ({
        key: item.key,
        icon: centroIcons[item.key],
        label: item.label,
      })),
    [],
  );

  const menuItems = isCentro ? centroItems : managementItems;

  useEffect(() => {
    if (isCentro) return;
    const activeOpenKeys = getDashboardOpenKeys(pathname);
    setOpenKeys((current) => Array.from(new Set([...current, ...activeOpenKeys])));
  }, [pathname, isCentro]);

  const adminUrl = `${API_BASE.replace(/\/api\/?$/, "")}/admin/`;
  const displayName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;

  const projectMenuItems: MenuProps["items"] = (Object.keys(DASHBOARD_PROJECTS) as DashboardProjectId[]).map(
    (id) => ({
      key: id,
      label: DASHBOARD_PROJECTS[id].label,
      onClick: () => setProject(id),
    }),
  );

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
    <Sider
      className={`${styles.sider} ${collapsed ? styles.siderCollapsed : ""}`}
      width={260}
      collapsedWidth={72}
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      trigger={null}
    >
      <div className={styles.siderInner}>
        <div className={styles.siderTop}>
          <Dropdown menu={{ items: projectMenuItems }} trigger={["click"]}>
            <button type="button" className={styles.teamSwitcher} title={currentProject.label}>
              <span className={styles.teamAvatar}>{currentProject.avatar}</span>
              {!collapsed ? (
                <>
                  <span className={styles.teamCopy}>
                    <strong>{currentProject.label}</strong>
                  </span>
                  <DownOutlined className={styles.teamChevron} />
                </>
              ) : null}
            </button>
          </Dropdown>
          <button
            type="button"
            className={styles.collapseButton}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={toggleCollapsed}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>

        {!collapsed ? (
          <button type="button" className={styles.findButton}>
            <SearchOutlined />
            <span>Find...</span>
            <kbd>F</kbd>
          </button>
        ) : (
          <button type="button" className={styles.findButtonCollapsed} title="Find...">
            <SearchOutlined />
          </button>
        )}

        <nav className={styles.navArea} aria-label="Dashboard navigation">
          <Menu
            className={styles.menu}
            mode="inline"
            inlineCollapsed={collapsed}
            items={menuItems}
            selectedKeys={selectedKeys}
            openKeys={collapsed || isCentro ? undefined : openKeys}
            onOpenChange={collapsed || isCentro ? undefined : setOpenKeys}
            onClick={onMenuClick}
          />
        </nav>

        <div className={styles.userRow}>
          <Avatar className={styles.userAvatar} src={user.avatar_url || undefined}>
            {displayName.slice(0, 1).toUpperCase()}
          </Avatar>
          {!collapsed ? <span className={styles.userName}>{displayName}</span> : null}
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
