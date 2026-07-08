"use client";

import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "./ManagementPlaceholder.module.css";

type PageRow = {
  key: string;
  title: string;
  slug: string;
  locale: string;
  status: "Published" | "Draft";
  updated: string;
};

const staticPages: PageRow[] = [
  { key: "1", title: "Home", slug: "/", locale: "MN / EN", status: "Published", updated: "2026-07-01" },
  { key: "2", title: "About Encanto Centro", slug: "/about", locale: "MN / EN", status: "Published", updated: "2026-06-28" },
  { key: "3", title: "Leasing", slug: "/leasing", locale: "MN / EN", status: "Published", updated: "2026-06-20" },
  { key: "4", title: "Contact", slug: "/contact", locale: "MN / EN", status: "Published", updated: "2026-06-15" },
  { key: "5", title: "Privacy Policy", slug: "/privacy", locale: "MN / EN", status: "Draft", updated: "2026-05-30" },
];

export default function CentroPagesManagement() {
  const columns: ColumnsType<PageRow> = [
    { title: "Page", dataIndex: "title" },
    { title: "Path", dataIndex: "slug" },
    { title: "Locale", dataIndex: "locale", width: 100 },
    {
      title: "Status",
      dataIndex: "status",
      width: 110,
      render: (status: PageRow["status"]) => (
        <Tag color={status === "Published" ? "green" : "default"}>{status}</Tag>
      ),
    },
    { title: "Updated", dataIndex: "updated", width: 120 },
    {
      title: "Actions",
      key: "actions",
      width: 90,
      render: () => (
        <Button size="small" icon={<EditOutlined />}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <section className={styles.shell}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Encanto Centro</p>
          <h2>Static Pages</h2>
        </div>
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            New page
          </Button>
        </Space>
      </header>

      <Card className={styles.tableCard}>
        <Table rowKey="key" columns={columns} dataSource={staticPages} pagination={false} />
      </Card>
    </section>
  );
}
