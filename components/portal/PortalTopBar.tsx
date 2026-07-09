"use client";

import { BellOutlined, DownOutlined, MessageOutlined } from "@ant-design/icons";
import { Avatar, Badge, Dropdown, Layout } from "antd";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/lib/auth";
import styles from "../dashboard/DashboardShell.module.css";

const { Header } = Layout;

export default function PortalTopBar({
  eyebrow,
  title,
  user,
}: {
  eyebrow: string;
  title: string;
  user: AuthUser;
}) {
  const router = useRouter();
  const breadcrumb = eyebrow ? `${eyebrow} / ${title}` : title || "Overview";
  const displayName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;
  const tenantName = user.tenant?.company || user.tenant?.name || displayName;

  return (
    <Header className={styles.header}>
      <Dropdown
        menu={{
          items: [
            { key: "overview", label: "Overview", onClick: () => router.push("/portal") },
            { key: "invoices", label: "Invoices", onClick: () => router.push("/portal/invoices") },
            { key: "support", label: "Support", onClick: () => router.push("/portal/tickets") },
            { key: "elevator", label: "Elevator", onClick: () => router.push("/portal/elevator") },
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
          <Badge count={0} size="small" offset={[-2, 2]} showZero={false}>
            <BellOutlined />
          </Badge>
        </button>
        <Avatar className={styles.topAvatar}>
          {(tenantName || "T").slice(0, 1).toUpperCase()}
        </Avatar>
      </div>
    </Header>
  );
}
