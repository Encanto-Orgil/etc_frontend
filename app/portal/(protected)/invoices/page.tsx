"use client";

import { FilterOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Input, Select, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchPortalInvoices, INVOICE_STATUS_FILTER_LABELS } from "@/lib/portalManagement";
import type { LeaseRentScheduleLine, LeaseRentScheduleStatus } from "@/lib/propertyManagement";
import { formatMoneyDisplay } from "@/lib/moneyFormat";
import { INVOICE_STATUS_COLORS, INVOICE_STATUS_LABELS } from "@/lib/rentInvoiceDocument";
import portalStyles from "@/components/portal/Portal.module.css";
import styles from "@/components/dashboard/DashboardOverview.module.css";

export default function PortalInvoicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "";
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<LeaseRentScheduleLine[]>([]);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setInvoices(await fetchPortalInvoices(statusFilter || undefined));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return invoices;
    return invoices.filter(
      (item) =>
        (item.invoice_reference || "").toLowerCase().includes(query) ||
        item.contract_number.toLowerCase().includes(query) ||
        item.unit_code.toLowerCase().includes(query),
    );
  }, [invoices, search]);

  const columns: ColumnsType<LeaseRentScheduleLine> = [
    { title: "Нэхэмжлэх", dataIndex: "invoice_reference", render: (v, r) => v || `#${r.id}` },
    { title: "Гэрээ", dataIndex: "contract_number" },
    { title: "Талбай", dataIndex: "unit_code" },
    { title: "Хугацаа", key: "period", render: (_, r) => `${r.period_start} – ${r.period_end}` },
    { title: "Төлөх хугацаа", dataIndex: "due_date" },
    { title: "Дүн", dataIndex: "total_amount", render: (v) => formatMoneyDisplay(v) },
    {
      title: "Төлөв",
      dataIndex: "status",
      render: (status: LeaseRentScheduleStatus, row) => (
        <Tag color={INVOICE_STATUS_COLORS[status]}>{INVOICE_STATUS_LABELS[status] || row.status_label}</Tag>
      ),
    },
    { title: "Шинэчлэгдсэн", dataIndex: "updated_at", render: (v) => dayjs(v).format("YYYY-MM-DD") },
  ];

  return (
    <main className={styles.page}>
      <section className={styles.projectsSection}>
        <div className={portalStyles.pageHeader}>
          <div className={portalStyles.pageHeaderMain}>
            <span className={portalStyles.eyebrow}>Нэхэмжлэх</span>
            <h1>Нэхэмжлэхийн жагсаалт</h1>
            <p className={portalStyles.pageSubtitle}>Нэхэмжлэхийн дэлгэрэнгүй харах, хэвлэх, PDF татах боломжтой.</p>
          </div>
        </div>

        <div className={portalStyles.toolbar}>
          <Input
            className={portalStyles.searchInput}
            prefix={<SearchOutlined />}
            placeholder="Нэхэмжлэх, гэрээ, талбай хайх..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            allowClear
          />
          <Select
            allowClear
            placeholder="Төлөвөөр шүүх"
            style={{ width: 180 }}
            value={statusFilter || undefined}
            onChange={(value) => router.push(value ? `/portal/invoices?status=${value}` : "/portal/invoices")}
            options={Object.entries(INVOICE_STATUS_FILTER_LABELS).map(([value, label]) => ({ value, label }))}
          />
          <Button className={styles.iconButton} aria-label="Filter" icon={<FilterOutlined />} />
          <Button className={styles.iconButton} icon={<ReloadOutlined />} onClick={load} />
        </div>

        <Spin spinning={loading}>
          <Card bordered className={portalStyles.contentCard}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={filtered}
              pagination={{ pageSize: 20 }}
              rowClassName={portalStyles.clickableRow}
              onRow={(record) => ({
                onClick: () => router.push(`/portal/invoices/${record.id}`),
              })}
            />
          </Card>
        </Spin>
      </section>
    </main>
  );
}
