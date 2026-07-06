"use client";

import { InfoCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { formatMoneyDisplay } from "@/lib/moneyFormat";
import styles from "../dashboard/DashboardOverview.module.css";

type Metric = {
  label: string;
  value: string | number;
  tone?: "red" | "orange" | "blue";
  hasInfo?: boolean;
};

export default function PortalSummaryCard({ metrics }: { metrics: Metric[] }) {
  return (
    <Card bordered className={styles.sideCard} styles={{ body: { padding: 16 } }}>
      <div className={styles.usageHeader}>
        <div className={styles.usageTitle}>
          <WarningOutlined />
          <span>Lease overview</span>
        </div>
      </div>

      <div className={styles.usageList}>
        {metrics.map((metric) => (
          <div className={styles.usageRow} key={metric.label}>
            <span className={`${styles.statusDot} ${metric.tone ? styles[metric.tone] : styles.blue}`} />
            <span className={styles.usageLabel}>
              {metric.label}
              {metric.hasInfo ? <InfoCircleOutlined /> : null}
            </span>
            <span className={styles.usageValue}>
              {typeof metric.value === "number" ? metric.value : metric.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function buildPortalMetrics(summary: {
  active_contracts: number;
  unpaid_invoices: number;
  outstanding_amount: string | number;
  open_tickets: number;
}): Metric[] {
  return [
    { label: "Active contracts", value: summary.active_contracts, tone: "blue" },
    {
      label: "Unpaid invoices",
      value: summary.unpaid_invoices,
      tone: summary.unpaid_invoices > 0 ? "orange" : "blue",
      hasInfo: summary.unpaid_invoices > 0,
    },
    {
      label: "Outstanding",
      value: formatMoneyDisplay(summary.outstanding_amount),
      tone: Number(summary.outstanding_amount) > 0 ? "red" : "blue",
    },
    {
      label: "Open support tickets",
      value: summary.open_tickets,
      tone: summary.open_tickets > 0 ? "orange" : "blue",
    },
  ];
}
