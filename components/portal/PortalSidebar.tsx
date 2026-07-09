"use client";

import {
  BarChartOutlined,
  BellOutlined,
  CreditCardOutlined,
  DownOutlined,
  FileTextOutlined,
  HomeOutlined,
  LogoutOutlined,
  MessageOutlined,
  MoreOutlined,
  SearchOutlined,
  SettingOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu, Tag } from "antd";
import type { MenuProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
import type { AuthUser } from "@/lib/auth";
import { logout } from "@/lib/auth";
import { getPortalSelectedKey } from "@/lib/portalNav";
import styles from "../dashboard/DashboardShell.module.css";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const accountItems: MenuItem[] = [
  { key: "/portal/usage", icon: <BarChartOutlined />, label: "Lease summary" },
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Account",
    children: [
      { key: "settings-profile", label: "Profile" },
      { key: "settings-security", label: "Security" },
    ],
  },
];

export default function PortalSidebar({ user }: { user: AuthUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const selectedKeys = [getPortalSelectedKey(pathname)];
  const tenantName = user.tenant?.company || user.tenant?.name || user.username;
  const tenantInitial = tenantName.slice(0, 1).toUpperCase();
  const displayName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;

  const navItems: MenuItem[] = [
    { key: "/portal", icon: <HomeOutlined />, label: "Overview" },
    { key: "/portal/invoices", icon: <FileTextOutlined />, label: "Invoices" },
    { key: "/portal/tickets", icon: <MessageOutlined />, label: "Support" },
    { key: "/portal/elevator", icon: <CreditCardOutlined />, label: "Elevator" },
    {
      key: "/portal/shop",
      icon: <ShoppingOutlined />,
      label: (
        <span className={styles.menuLabelInner}>
          <span>Shop</span>
          <Tag className={styles.betaTag}>Demo</Tag>
        </span>
      ),
    },
  ];

  const userMenu: MenuProps = {
    items: [
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Log out",
        onClick: async () => {
          await logout();
          router.replace("/portal/login");
        },
      },
    ],
  };

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (typeof key === "string" && key.startsWith("/portal")) {
      router.push(key);
    }
  };

  return (
    <Sider className={styles.sider} width={260}>
      <div className={styles.siderInner}>
        <Dropdown
          menu={{
            items: [{ key: "tenant", label: tenantName }],
          }}
          trigger={["click"]}
        >
          <button type="button" className={styles.teamSwitcher}>
            <span className={styles.teamAvatar}>{tenantInitial}</span>
            <span className={styles.teamCopy}>
              <strong>{tenantName}</strong>
              <Tag className={styles.planTag}>Tenant</Tag>
            </span>
            <DownOutlined className={styles.teamChevron} />
          </button>
        </Dropdown>

        <button type="button" className={styles.findButton}>
          <SearchOutlined />
          <span>Find...</span>
          <kbd>F</kbd>
        </button>

        <nav className={styles.navArea} aria-label="Portal navigation">
          <Menu
            className={styles.menu}
            mode="inline"
            items={navItems}
            selectedKeys={selectedKeys}
            onClick={onMenuClick}
          />
          <div className={styles.menuDivider} />
          <Menu
            className={styles.menu}
            mode="inline"
            items={accountItems}
            selectedKeys={selectedKeys}
            onClick={onMenuClick}
          />
        </nav>

        <div className={styles.userRow}>
          <Avatar className={styles.userAvatar}>{displayName.slice(0, 1).toUpperCase()}</Avatar>
          <span className={styles.userName}>{displayName}</span>
          <Dropdown menu={userMenu} placement="topRight" trigger={["click"]}>
            <button type="button" className={styles.footerIcon} aria-label="Open user menu">
              <MoreOutlined />
            </button>
          </Dropdown>
          <button type="button" className={styles.footerIcon} aria-label="Notifications">
            <BellOutlined />
            <span className={styles.notificationDot} />
          </button>
        </div>
      </div>
    </Sider>
  );
}
