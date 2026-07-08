"use client";

import Link from "next/link";
import { Card, Col, Row } from "antd";
import { CENTRO_NAV_ITEMS } from "@/lib/dashboardProjects";
import styles from "./ManagementPlaceholder.module.css";
import overviewStyles from "./DashboardOverview.module.css";

export default function CentroOverview() {
  return (
    <div className={styles.shell}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Encanto Centro</p>
          <h2>Dashboard</h2>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <Row gutter={[16, 16]}>
        {CENTRO_NAV_ITEMS.filter((item) => item.key !== "/dashboard/centro").map((item) => (
          <Col key={item.key} xs={24} sm={12} lg={8}>
            <Link href={item.key} style={{ display: "block" }}>
              <Card className={overviewStyles.sectionCard} hoverable>
                <strong style={{ display: "block", color: "#111" }}>{item.label}</strong>
              </Card>
            </Link>
          </Col>
        ))}
        </Row>
      </div>
    </div>
  );
}
