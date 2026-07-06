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
import PortalContractCard from "./PortalContractCard";
import PortalSummaryCard, { buildPortalMetrics } from "./PortalSummaryCard";
import PortalTicketsCard from "./PortalTicketsCard";
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

  const invoiceColumns: ColumnsType<PortalSummary["recent_invoices"][number]> = [
    { title: "Invoice", dataIndex: "invoice_reference", render: (v, r) => v || `#${r.id}` },
    { title: "Unit", dataIndex: "unit_code" },
    { title: "Due", dataIndex: "due_date", render: formatDate },
    { title: "Amount", dataIndex: "total_amount", render: (v) => formatMoneyDisplay(v) },
    { title: "Status", dataIndex: "status_label", render: (v) => <Tag>{v}</Tag> },
  ];

  return (
    <main className={styles.page}>
      <Spin spinning={loading}>
        {summary ? (
          <div className={styles.overviewGrid}>
            <aside className={styles.sideColumn}>
              <PortalSummaryCard metrics={buildPortalMetrics(summary.summary)} />
              <PortalTicketsCard tickets={summary.recent_tickets} />
              <Card bordered className={styles.sideCard} styles={{ body: { padding: 16 } }}>
                <div className={styles.alertCardContent}>
                  <h2>Need help?</h2>
                  <p>Submit a maintenance or service request and our team will follow up.</p>
                  <Button className={styles.outlineButton} onClick={onNewTicket}>
                    New request
                  </Button>
                </div>
              </Card>
            </aside>

            <section className={styles.projectsSection}>
              <div className={styles.projectToolbar}>
                <Input
                  className={styles.projectSearch}
                  prefix={<SearchOutlined />}
                  placeholder="Search contracts..."
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
                      { key: "ticket", label: "New support request", onClick: onNewTicket },
                      { key: "invoices", label: "View invoices", onClick: () => router.push("/portal/invoices") },
                    ],
                  }}
                  trigger={["click"]}
                >
                  <Button className={styles.addButton}>
                    <PlusOutlined />
                    Add New...
                    <DownOutlined />
                  </Button>
                </Dropdown>
              </div>

              <h2 className={styles.sectionTitle}>Active contracts</h2>
              <div className={styles.projectGrid}>
                {summary.contracts.length ? (
                  summary.contracts.map((contract) => (
                    <PortalContractCard key={contract.id} contract={contract} />
                  ))
                ) : (
                  <Card bordered className={styles.projectCard} styles={{ body: { padding: 16 } }}>
                    <p className={styles.mutedText}>No active contracts.</p>
                  </Card>
                )}
              </div>

              <div style={{ marginTop: 28 }}>
                <div className={styles.projectToolbar}>
                  <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
                    Recent invoices
                  </h2>
                  <Link href="/portal/invoices">
                    <Button className={styles.outlineButton}>View all</Button>
                  </Link>
                </div>
                <Card bordered className={styles.sideCard} styles={{ body: { padding: 0 } }}>
                  <Table
                    size="small"
                    rowKey="id"
                    pagination={false}
                    dataSource={summary.recent_invoices}
                    columns={invoiceColumns}
                  />
                </Card>
              </div>
            </section>
          </div>
        ) : null}
      </Spin>
    </main>
  );
}
