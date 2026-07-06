"use client";

import { BellOutlined, DownOutlined, MessageOutlined } from "@ant-design/icons";
import { Avatar, Badge, Dropdown, Layout } from "antd";
import type { AuthUser } from "@/lib/auth";
import styles from "./DashboardShell.module.css";

const { Header } = Layout;

export default function TopBar({
  eyebrow,
  title,
  user,
}: {
  eyebrow: string;
  title: string;
  user: AuthUser;
}) {
  const breadcrumb = eyebrow ? `${eyebrow} / ${title}` : title || "All Projects";
  const displayName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;

  return (
    <Header className={styles.header}>
      <Dropdown
        menu={{
          items: [
            { key: "current", label: breadcrumb },
            { key: "all", label: "All Projects" },
            { key: "property", label: "Property Management" },
          ],
        }}
        trigger={["click"]}
      >
        <button type="button" className={styles.breadcrumbButton}>
          {breadcrumb}
          <DownOutlined />
        </button>
      </Dropdown>

      <div className={styles.topBarActions}>
        <button type="button" className={styles.topIconButton} aria-label="Messages">
          <Badge dot color="#0070f3" offset={[-1, 2]}>
            <MessageOutlined />
          </Badge>
        </button>
        <button type="button" className={styles.topIconButton} aria-label="Notifications">
          <Badge count={3} size="small" offset={[-2, 2]}>
            <BellOutlined />
          </Badge>
        </button>
        <Avatar className={styles.topAvatar}>
          {(displayName || "U").slice(0, 1).toUpperCase()}
        </Avatar>
      </div>
    </Header>
  );
}
