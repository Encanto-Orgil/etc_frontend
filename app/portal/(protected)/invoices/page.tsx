"use client";

import { FilterOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Input, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { fetchPortalInvoices } from "@/lib/portalManagement";
import type { LeaseRentScheduleLine } from "@/lib/propertyManagement";
import { formatMoneyDisplay } from "@/lib/moneyFormat";
import styles from "@/components/dashboard/DashboardOverview.module.css";

export default function PortalInvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<LeaseRentScheduleLine[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setInvoices(await fetchPortalInvoices());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const columns: ColumnsType<LeaseRentScheduleLine> = [
    { title: "Invoice", dataIndex: "invoice_reference", render: (v, r) => v || `#${r.id}` },
    { title: "Contract", dataIndex: "contract_number" },
    { title: "Unit", dataIndex: "unit_code" },
    { title: "Period", key: "period", render: (_, r) => `${r.period_start} – ${r.period_end}` },
    { title: "Due", dataIndex: "due_date" },
    { title: "Amount", dataIndex: "total_amount", render: (v) => formatMoneyDisplay(v) },
    { title: "Status", dataIndex: "status_label", render: (v) => <Tag>{v}</Tag> },
    { title: "Updated", dataIndex: "updated_at", render: (v) => dayjs(v).format("YYYY-MM-DD") },
  ];

  return (
    <main className={styles.page}>
      <section className={styles.projectsSection}>
        <div className={styles.projectToolbar}>
          <Input
            className={styles.projectSearch}
            prefix={<SearchOutlined />}
            placeholder="Search invoices..."
            variant="borderless"
          />
          <Button className={styles.iconButton} aria-label="Filter" icon={<FilterOutlined />} />
          <Button className={styles.iconButton} icon={<ReloadOutlined />} onClick={load} />
        </div>

        <h2 className={styles.sectionTitle}>Invoices</h2>
        <Spin spinning={loading}>
          <Card bordered className={styles.sideCard} styles={{ body: { padding: 0 } }}>
            <Table rowKey="id" columns={columns} dataSource={invoices} pagination={{ pageSize: 20 }} />
          </Card>
        </Spin>
      </section>
    </main>
  );
}
