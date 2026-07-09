"use client";

import {
  AppstoreOutlined,
  DownOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Card, Dropdown, Input, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PortalSummary } from "@/lib/portalManagement";
import { formatMoneyDisplay } from "@/lib/moneyFormat";
import { INVOICE_STATUS_COLORS, INVOICE_STATUS_LABELS } from "@/lib/rentInvoiceDocument";
import type { LeaseRentScheduleStatus } from "@/lib/propertyManagement";
import PortalContractCard from "./PortalContractCard";
import PortalSummaryCard, { buildPortalMetrics } from "./PortalSummaryCard";
import PortalTicketsCard from "./PortalTicketsCard";
import portalStyles from "./Portal.module.css";
import styles from "../dashboard/DashboardOverview.module.css";

function formatDate(value: string | null) {
  return value ? dayjs(value).format("YYYY-MM-DD") : "-";
}

export default function PortalOverview({
  summary,
  loading,
  onNewTicket,
}: {
  summary: PortalSummary | null;
  loading: boolean;
  onNewTicket: () => void;
}) {
  const router = useRouter();
  const hasOutstanding = Number(summary?.summary.outstanding_amount || 0) > 0;

  const invoiceColumns: ColumnsType<PortalSummary["recent_invoices"][number]> = [
    {
      title: "Нэхэмжлэх",
      dataIndex: "invoice_reference",
      render: (v, r) => v || `#${r.id}`,
    },
    { title: "Талбай", dataIndex: "unit_code" },
    { title: "Төлөх хугацаа", dataIndex: "due_date", render: formatDate },
    { title: "Дүн", dataIndex: "total_amount", render: (v) => formatMoneyDisplay(v) },
    {
      title: "Төлөв",
      dataIndex: "status",
      render: (status: LeaseRentScheduleStatus, row) => (
        <Tag color={INVOICE_STATUS_COLORS[status]}>{INVOICE_STATUS_LABELS[status] || row.status_label}</Tag>
      ),
    },
  ];

  return (
    <main className={styles.page}>
      <Spin spinning={loading}>
        {summary ? (
          <>
            {hasOutstanding ? (
              <div className={`${portalStyles.heroBanner} ${portalStyles.heroBannerWarning}`}>
                <div className={portalStyles.heroBannerContent}>
                  <strong>Төлөгдөөгүй нэхэмжлэх байна</strong>
                  <p>
                    {summary.summary.unpaid_invoices} нэхэмжлэх · {formatMoneyDisplay(summary.summary.outstanding_amount)} төлөх ёстой
                  </p>
                </div>
                <Button type="primary" onClick={() => router.push("/portal/invoices?status=invoiced")}>
                  Нэхэмжлэх харах
                </Button>
              </div>
            ) : null}

            <div className={styles.overviewGrid}>
              <aside className={styles.sideColumn}>
                <PortalSummaryCard metrics={buildPortalMetrics(summary.summary)} />
                <PortalTicketsCard tickets={summary.recent_tickets} />
                <Card bordered className={styles.sideCard} styles={{ body: { padding: 16 } }}>
                  <div className={styles.alertCardContent}>
                    <h2>Лифтийн эрх</h2>
                    <p>
                      {summary.summary.active_elevator_cards} идэвхтэй карт
                      {summary.summary.elevator_cards ? ` · нийт ${summary.summary.elevator_cards}` : ""}
                    </p>
                    <Link href="/portal/elevator">
                      <Button className={styles.outlineButton}>Лифт харах</Button>
                    </Link>
                  </div>
                </Card>
                <Card bordered className={styles.sideCard} styles={{ body: { padding: 16 } }}>
                  <div className={styles.alertCardContent}>
                    <h2>Тусламж хэрэгтэй юу?</h2>
                    <p>Засвар, үйлчилгээний хүсэлт илгээж манай багтай холбогдоно уу.</p>
                    <Button className={styles.outlineButton} onClick={onNewTicket}>
                      Шинэ хүсэлт
                    </Button>
                  </div>
                </Card>
              </aside>

              <section className={styles.projectsSection}>
                <div className={portalStyles.pageHeader}>
                  <div className={portalStyles.pageHeaderMain}>
                    <span className={portalStyles.eyebrow}>Түрээслэгчийн портал</span>
                    <h1>Сайн байна уу, {summary.tenant.company || summary.tenant.name}</h1>
                    <p className={portalStyles.pageSubtitle}>Гэрээ, нэхэмжлэх, дэмжлэг болон лифтийн мэдээлэл.</p>
                  </div>
                </div>

                <div className={styles.projectToolbar}>
                  <Input
                    className={styles.projectSearch}
                    prefix={<SearchOutlined />}
                    placeholder="Гэрээ хайх..."
                    variant="borderless"
                  />
                  <Button className={styles.iconButton} aria-label="Filter" icon={<FilterOutlined />} />
                  <div className={styles.viewToggle} aria-label="View">
                    <Button className={styles.iconButtonActive} aria-label="Grid view" icon={<AppstoreOutlined />} />
                    <Button className={styles.iconButton} aria-label="List view" icon={<UnorderedListOutlined />} />
                  </div>
                  <Dropdown
                    menu={{
                      items: [
                        { key: "ticket", label: "Шинэ дэмжлэгийн хүсэлт", onClick: onNewTicket },
                        { key: "invoices", label: "Нэхэмжлэх харах", onClick: () => router.push("/portal/invoices") },
                        { key: "elevator", label: "Лифтийн эрх", onClick: () => router.push("/portal/elevator") },
                      ],
                    }}
                    trigger={["click"]}
                  >
                    <Button className={styles.addButton}>
                      <PlusOutlined />
                      Нэмэх...
                      <DownOutlined />
                    </Button>
                  </Dropdown>
                </div>

                <h2 className={styles.sectionTitle}>Идэвхтэй гэрээнүүд</h2>
                <div className={styles.projectGrid}>
                  {summary.contracts.length ? (
                    summary.contracts.map((contract) => (
                      <PortalContractCard key={contract.id} contract={contract} />
                    ))
                  ) : (
                    <Card bordered className={styles.projectCard} styles={{ body: { padding: 16 } }}>
                      <p className={styles.mutedText}>Идэвхтэй гэрээ байхгүй.</p>
                    </Card>
                  )}
                </div>

                <div style={{ marginTop: 28 }}>
                  <div className={styles.projectToolbar}>
                    <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
                      Сүүлийн нэхэмжлэх
                    </h2>
                    <Link href="/portal/invoices">
                      <Button className={styles.outlineButton}>Бүгдийг харах</Button>
                    </Link>
                  </div>
                  <Card bordered className={portalStyles.contentCard}>
                    <Table
                      size="small"
                      rowKey="id"
                      pagination={false}
                      dataSource={summary.recent_invoices}
                      columns={invoiceColumns}
                      rowClassName={portalStyles.clickableRow}
                      onRow={(record) => ({
                        onClick: () => router.push(`/portal/invoices/${record.id}`),
                      })}
                    />
                  </Card>
                </div>
              </section>
            </div>
          </>
        ) : null}
      </Spin>
    </main>
  );
}
