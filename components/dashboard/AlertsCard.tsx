"use client";

import { BellOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import styles from "./DashboardOverview.module.css";

export default function AlertsCard() {
  return (
    <Card bordered className={styles.sideCard} styles={{ body: { padding: 16 } }}>
      <div className={styles.alertCardContent}>
        <span className={styles.alertIcon}>
          <BellOutlined />
        </span>
        <h2>Get alerted for anomalies</h2>
        <p>Automatically monitor your projects for anomalies and get notified.</p>
        <Button className={styles.outlineButton}>Upgrade to Pro</Button>
      </div>
    </Card>
  );
}
