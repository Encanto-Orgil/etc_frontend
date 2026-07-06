"use client";

import {
  DownOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Button, Card, Progress } from "antd";
import type { UsageMetric } from "@/lib/dashboardMockData";
import styles from "./DashboardOverview.module.css";

export default function UsageCard({ metrics }: { metrics: UsageMetric[] }) {
  return (
    <Card bordered className={styles.sideCard} styles={{ body: { padding: 16 } }}>
      <div className={styles.usageHeader}>
        <div className={styles.usageTitle}>
          <WarningOutlined />
          <span>Exceeded free resources</span>
        </div>
        <Button className={styles.blackButton} size="small">
          Upgrade
        </Button>
      </div>

      <div className={styles.usageList}>
        {metrics.map((metric) => (
          <div className={styles.usageRow} key={metric.label}>
            <span
              className={`${styles.statusDot} ${
                metric.progressPercent ? styles.progressDot : ""
              } ${styles[metric.tone]}`}
            >
              {metric.progressPercent ? (
                <Progress
                  type="circle"
                  percent={metric.progressPercent}
                  size={16}
                  showInfo={false}
                  strokeColor="#0070f3"
                  trailColor="#eaeaea"
                />
              ) : null}
            </span>
            <span className={styles.usageLabel}>
              {metric.label}
              {metric.hasInfo ? <InfoCircleOutlined /> : null}
            </span>
            <span className={styles.usageValue}>{metric.value}</span>
          </div>
        ))}
      </div>

      <button type="button" className={styles.expandButton} aria-label="Expand usage metrics">
        <DownOutlined />
      </button>
    </Card>
  );
}
