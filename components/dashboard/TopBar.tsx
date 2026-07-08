"use client";

import { DownOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout } from "antd";
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
  const breadcrumb = eyebrow ? `${eyebrow} / ${title}` : title || "Dashboard";
  const displayName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;

  return (
    <Header className={styles.header}>
      <Dropdown
        menu={{
          items: [
            { key: "current", label: breadcrumb },
            { key: "dashboard", label: "Dashboard" },
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
        <Avatar className={styles.topAvatar}>
          {(displayName || "U").slice(0, 1).toUpperCase()}
        </Avatar>
      </div>
    </Header>
  );
}
