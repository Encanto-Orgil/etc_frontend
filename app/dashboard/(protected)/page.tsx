"use client";

import {
  CalendarOutlined,
  HomeOutlined,
  MailOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic, Table, Tag, Typography } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { DashboardStats } from "@/lib/auth";
import { fetchDashboardStats } from "@/lib/auth";
import {
  BOOKING_STATUS_LABELS,
  INTEREST_LABELS,
  TOWER_KIND_LABELS,
} from "@/lib/stacking";
import styles from "./dashboard.module.css";

const bookingStatusColors: Record<string, string> = {
  pending: "gold",
  confirmed: "green",
  declined: "red",
  cancelled: "default",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  const stacking = stats?.stacking;

  return (
    <div className={styles.page}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <Card className={styles.statCard} loading={loading}>
            <Statistic
              title="Шинэ хүсэлт"
              value={stats?.summary.pending_inquiries ?? 0}
              prefix={<MailOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className={styles.statCard} loading={loading}>
            <Statistic
              title="Ballroom захиалга"
              value={stats?.summary.pending_bookings ?? 0}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className={styles.statCard} loading={loading}>
            <Statistic
              title="Боломжтой нэгж (нийт)"
              value={stats?.summary.available_units ?? 0}
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className={styles.statCard} loading={loading}>
            <Statistic
              title="Нийт төсөл"
              value={stats?.summary.tower_count ?? 0}
              prefix={<ShopOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className={styles.statCard} loading={loading} title={TOWER_KIND_LABELS.office}>
            <Statistic title="Боломжтой" value={stacking?.office?.available_count ?? 0} />
            <Typography.Text type="secondary">
              {stacking?.office?.rented_count ?? 0} түрээслэгдсэн · {stacking?.office?.unit_count ?? 0} нийт
            </Typography.Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className={styles.statCard} loading={loading} title={TOWER_KIND_LABELS.mall}>
            <Statistic title="Боломжтой" value={stacking?.mall?.available_count ?? 0} />
            <Typography.Text type="secondary">
              {stacking?.mall?.rented_count ?? 0} түрээслэгдсэн · {stacking?.mall?.unit_count ?? 0} нийт
            </Typography.Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className={styles.statCard} loading={loading} title={TOWER_KIND_LABELS.apartment}>
            <Statistic title="Боломжтой" value={stacking?.apartment?.available_count ?? 0} />
            <Typography.Text type="secondary">
              {stacking?.apartment?.rented_count ?? 0} түрээслэгдсэн ·{" "}
              {stacking?.apartment?.unit_count ?? 0} нийт
            </Typography.Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className={styles.tables}>
        <Col xs={24} xl={12}>
          <Card
            title="Сүүлийн хүсэлтүүд"
            className={styles.tableCard}
            extra={<Link href="/dashboard/stacking">Төлөвлөлт руу</Link>}
          >
            <Table
              size="small"
              rowKey="id"
              loading={loading}
              pagination={false}
              dataSource={stats?.recent_inquiries ?? []}
              columns={[
                { title: "Нэр", dataIndex: "name", key: "name" },
                { title: "Утас", dataIndex: "phone", key: "phone" },
                {
                  title: "Сонирхол",
                  dataIndex: "interest",
                  key: "interest",
                  render: (value: string) => INTEREST_LABELS[value] || value,
                },
                {
                  title: "Төлөв",
                  dataIndex: "is_handled",
                  key: "is_handled",
                  render: (handled: boolean) => (
                    <Tag color={handled ? "green" : "gold"}>
                      {handled ? "Хариулсан" : "Шинэ"}
                    </Tag>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} xl={12}>
          <Card title="Ballroom захиалгууд" className={styles.tableCard}>
            <Table
              size="small"
              rowKey="id"
              loading={loading}
              pagination={false}
              dataSource={stats?.recent_bookings ?? []}
              columns={[
                { title: "Нэр", dataIndex: "name", key: "name" },
                {
                  title: "Огноо",
                  key: "slot",
                  render: (_, row) =>
                    `${row.slot__date} ${String(row.slot__start_time).slice(0, 5)}`,
                },
                {
                  title: "Төлөв",
                  dataIndex: "status",
                  key: "status",
                  render: (status: string) => (
                    <Tag color={bookingStatusColors[status] || "default"}>
                      {BOOKING_STATUS_LABELS[status] || status}
                    </Tag>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
