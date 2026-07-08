"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import styles from "./ManagementPlaceholder.module.css";

type BrandRow = {
  key: string;
  name: string;
  category: string;
  floor: string;
  status: "Active" | "Draft";
};

const sampleBrands: BrandRow[] = [
  { key: "1", name: "Orgil Chain", category: "Supermarket", floor: "B1–B2", status: "Active" },
  { key: "2", name: "Fashion House", category: "Retail", floor: "1F", status: "Draft" },
  { key: "3", name: "Sky Lounge Café", category: "F&B", floor: "3F", status: "Active" },
];

export default function CentroBrandsManagement() {
  const columns: ColumnsType<BrandRow> = [
    { title: "Brand", dataIndex: "name" },
    { title: "Category", dataIndex: "category" },
    { title: "Floor", dataIndex: "floor", width: 100 },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      render: (status: BrandRow["status"]) => (
        <Tag color={status === "Active" ? "green" : "default"}>{status}</Tag>
      ),
    },
  ];

  return (
    <section className={styles.shell}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Encanto Centro</p>
          <h2>Brands</h2>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          Add brand
        </Button>
      </header>

      <Card className={styles.tableCard}>
        <Table rowKey="key" columns={columns} dataSource={sampleBrands} pagination={false} />
      </Card>
    </section>
  );
}
