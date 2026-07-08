"use client";

import {
  ApartmentOutlined,
  BankOutlined,
  CalendarOutlined,
  FormOutlined,
  HomeOutlined,
  MessageOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, List, Progress, Row, Spin, Statistic, Tag } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchDashboardStats, type DashboardStats } from "@/lib/auth";
import { formatMoneyDisplay } from "@/lib/moneyFormat";
import {
  BOOKING_STATUS_LABELS,
  INTEREST_LABELS,
  TOWER_KIND_LABELS,
  type TowerKind,
} from "@/lib/stacking";
import InquiriesCard from "./InquiriesCard";
import SupportTicketsCard from "./SupportTicketsCard";
import styles from "./DashboardOverview.module.css";

const TOWER_ICONS: Record<TowerKind, React.ReactNode> = {
  office: <BankOutlined />,
  mall: <ShopOutlined />,
  apartment: <ApartmentOutlined />,
};

const QUICK_LINKS = [
  { href: "/dashboard/property", label: "Property", icon: <HomeOutlined /> },
  { href: "/dashboard/ballroom", label: "Ballroom", icon: <CalendarOutlined /> },
  { href: "/dashboard/stacking", label: "Stacking", icon: <ApartmentOutlined /> },
  { href: "/dashboard/inquiries", label: "Inquiries", icon: <FormOutlined /> },
  { href: "/dashboard/support", label: "Support", icon: <MessageOutlined /> },
];

function occupancyPercent(rented: number, total: number) {
  if (!total) return 0;
  return Math.round((rented / total) * 100);
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <Spin size="large" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={styles.loadingWrap}>
        <p className={styles.mutedText}>Dashboard мэдээлэл ачаалахад алдаа гарлаа.</p>
        <Button onClick={() => window.location.reload()}>Дахин оролдох</Button>
      </div>
    );
  }

  const { summary, stacking, rental_finance: finance } = stats;
  const towerKinds = Object.keys(stacking) as TowerKind[];

  return (
    <main className={styles.page}>
      <div className={styles.overviewGrid}>
        <aside className={styles.sideColumn}>
          <InquiriesCard />
          <SupportTicketsCard />
        </aside>

        <section className={styles.mainColumn}>
          <Row gutter={[16, 16]} className={styles.kpiRow}>
            <Col xs={12} md={6}>
              <Card className={styles.kpiCard}>
                <Statistic title="Pending inquiries" value={summary.pending_inquiries} />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card className={styles.kpiCard}>
                <Statistic title="Ballroom bookings" value={summary.pending_bookings} />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card className={styles.kpiCard}>
                <Statistic title="Available units" value={summary.available_units} />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card className={styles.kpiCard}>
                <Statistic title="Open tickets" value={summary.open_support_tickets} />
              </Card>
            </Col>
          </Row>

          <Card
            className={styles.sectionCard}
            title="Occupancy by tower"
            extra={
              <Link href="/dashboard/stacking">
                <Button size="small" type="link">
                  Stacking plan
                </Button>
              </Link>
            }
          >
            <div className={styles.stackingGrid}>
              {towerKinds.map((kind) => {
                const tower = stacking[kind];
                const occupied = tower.rented_count + tower.reserved_count;
                const percent = occupancyPercent(occupied, tower.unit_count);
                return (
                  <div key={kind} className={styles.stackingCard}>
                    <div className={styles.stackingHead}>
                      <span className={styles.stackingIcon}>{TOWER_ICONS[kind]}</span>
                      <div>
                        <strong>{TOWER_KIND_LABELS[kind]}</strong>
                        <p>{tower.floor_count} давхар · {tower.unit_count} unit</p>
                      </div>
                    </div>
                    <Progress percent={percent} size="small" />
                    <div className={styles.stackingStats}>
                      <span>{tower.available_count} боломжтой</span>
                      <span>{tower.rented_count} түрээслэгдсэн</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card className={styles.sectionCard} title={`Rent collection — ${finance.period.label}`}>
                <div className={styles.financeStats}>
                  <div>
                    <span>Expected</span>
                    <strong>{formatMoneyDisplay(finance.combined.expected_total)}</strong>
                  </div>
                  <div>
                    <span>Collected</span>
                    <strong>{formatMoneyDisplay(finance.combined.collected)}</strong>
                  </div>
                  <div>
                    <span>Outstanding</span>
                    <strong>{formatMoneyDisplay(finance.combined.outstanding)}</strong>
                  </div>
                </div>
                <Progress
                  percent={finance.combined.collection_rate}
                  status={finance.combined.collection_rate >= 80 ? "success" : "active"}
                />
                <p className={styles.mutedText}>
                  {finance.combined.paid_count} paid · {finance.combined.unpaid_count} unpaid
                </p>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                className={styles.sectionCard}
                title="Recent ballroom bookings"
                extra={
                  <Link href="/dashboard/ballroom/bookings">
                    <Button size="small" type="link">
                      View all
                    </Button>
                  </Link>
                }
              >
                <List
                  size="small"
                  locale={{ emptyText: "No bookings yet." }}
                  dataSource={stats.recent_bookings.slice(0, 5)}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.name}
                        description={`${item.guest_count} guests · ${item.phone}`}
                      />
                      <Tag>{BOOKING_STATUS_LABELS[item.status] ?? item.status}</Tag>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>

          <Card className={styles.sectionCard} title="Recent inquiries">
            <List
              size="small"
              locale={{ emptyText: "No inquiries yet." }}
              dataSource={stats.recent_inquiries.slice(0, 6)}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name}
                    description={`${INTEREST_LABELS[item.interest] ?? item.interest} · ${item.phone} · ${dayjs(item.created_at).format("MMM D, HH:mm")}`}
                  />
                  <Tag color={item.is_handled ? "default" : "gold"}>
                    {item.is_handled ? "Handled" : "Pending"}
                  </Tag>
                </List.Item>
              )}
            />
          </Card>

          <div className={styles.quickLinks}>
            {QUICK_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={styles.quickLink}>
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
