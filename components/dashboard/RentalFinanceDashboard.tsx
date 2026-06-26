"use client";

import { CheckOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Col, Progress, Row, Select, Space, Statistic, Table, Tag, Typography, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import {
  fetchRentalFinance,
  formatMnt,
  markRentPaymentPaid,
  PAYMENT_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
  type RentPayment,
  type RentalFinanceData,
} from "@/lib/rentalFinance";
import { TOWER_KIND_LABELS } from "@/lib/stacking";
import styles from "./RentalFinanceDashboard.module.css";

type Props = {
  kind: "office" | "mall";
};

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}-р сар`,
}));

export default function RentalFinanceDashboard({ kind }: Props) {
  const now = dayjs();
  const [year, setYear] = useState(now.year());
  const [month, setMonth] = useState(now.month() + 1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RentalFinanceData | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchRentalFinance(kind, year, month);
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [kind, year, month]);

  useEffect(() => {
    load();
  }, [load]);

  const onMarkPaid = async (paymentId: number) => {
    try {
      await markRentPaymentPaid(paymentId);
      message.success("Төлбөр төлсөн гэж тэмдэглэгдлээ.");
      load();
    } catch {
      message.error("Алдаа гарлаа.");
    }
  };

  const summary = data?.summary;
  const rates = data?.rates;

  const columns: ColumnsType<RentPayment> = [
    {
      title: "Давхар",
      key: "floor",
      width: 90,
      render: (_, row) => `${row.floor_number}${row.unit_code}`,
    },
    {
      title: "Түрээслэгч",
      dataIndex: "tenant_name",
      key: "tenant_name",
      ellipsis: true,
    },
    {
      title: "Талбай",
      dataIndex: "area_sqm",
      key: "area_sqm",
      width: 80,
      render: (v) => `${Number(v)} м²`,
    },
    {
      title: "Түрээс",
      dataIndex: "rent_amount",
      key: "rent_amount",
      width: 120,
      render: (v) => formatMnt(Number(v)),
    },
    {
      title: "Ашиглалт",
      dataIndex: "usage_amount",
      key: "usage_amount",
      width: 110,
      render: (v) => formatMnt(Number(v)),
    },
    {
      title: "Нийт",
      dataIndex: "total_due",
      key: "total_due",
      width: 120,
      render: (v) => <strong>{formatMnt(Number(v))}</strong>,
    },
    {
      title: "Төлсөн",
      dataIndex: "amount_paid",
      key: "amount_paid",
      width: 120,
      render: (v) => formatMnt(Number(v)),
    },
    {
      title: "Төлөв",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status: RentPayment["status"], row) => (
        <Tag color={PAYMENT_STATUS_COLORS[status]}>{row.status_label}</Tag>
      ),
    },
    {
      title: "",
      key: "action",
      width: 120,
      render: (_, row) =>
        row.status !== "paid" ? (
          <Button
            size="small"
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => onMarkPaid(row.id)}
          >
            Төлсөн
          </Button>
        ) : null,
    },
  ];

  return (
    <section className={styles.wrap}>
      <div className={styles.head}>
        <div>
          <Typography.Title level={4} className={styles.title}>
            {TOWER_KIND_LABELS[kind]} — сарын түрээсийн санхүү
          </Typography.Title>
          <Typography.Text type="secondary">
            Түрээс {formatMnt(rates?.rent_per_sqm ?? 100000)}/м² · Ашиглалт{" "}
            {formatMnt(rates?.usage_per_sqm ?? 10000)}/м²
          </Typography.Text>
        </div>

        <Space wrap>
          <Select
            value={year}
            onChange={setYear}
            options={[year - 1, year, year + 1].map((y) => ({ value: y, label: `${y} он` }))}
            style={{ width: 110 }}
          />
          <Select
            value={month}
            onChange={setMonth}
            options={MONTH_OPTIONS}
            style={{ width: 110 }}
          />
          <Button icon={<ReloadOutlined />} onClick={load} loading={loading}>
            Шинэчлэх
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <Card className={styles.statCard} loading={loading}>
            <Statistic title="Хүлээгдэж буй орлого" value={summary?.expected_total ?? 0} formatter={(v) => formatMnt(Number(v))} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className={styles.statCard} loading={loading}>
            <Statistic title="Түрээс" value={summary?.expected_rent ?? 0} formatter={(v) => formatMnt(Number(v))} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className={styles.statCard} loading={loading}>
            <Statistic title="Ашиглалт" value={summary?.expected_usage ?? 0} formatter={(v) => formatMnt(Number(v))} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className={styles.statCard} loading={loading}>
            <Statistic
              title="Орлогод орсон"
              value={summary?.collected ?? 0}
              valueStyle={{ color: "#16a34a" }}
              formatter={(v) => formatMnt(Number(v))}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card className={styles.panelCard} loading={loading} title="Төлбөрийн төлөв">
            <div className={styles.progressBlock}>
              <div className={styles.progressMeta}>
                <span>Авлагын цуглуулалт</span>
                <strong>{summary?.collection_rate ?? 0}%</strong>
              </div>
              <Progress
                percent={summary?.collection_rate ?? 0}
                strokeColor="#16a34a"
                showInfo={false}
              />
            </div>
            <div className={styles.statusRow}>
              <Tag color="green">Төлсөн: {summary?.paid_count ?? 0}</Tag>
              <Tag color="gold">Төлөөгүй: {summary?.unpaid_count ?? 0}</Tag>
              <Tag color="blue">Хэсэгчлэн: {summary?.partial_count ?? 0}</Tag>
              <Tag color="red">Хэтэрсэн: {summary?.overdue_count ?? 0}</Tag>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className={styles.panelCard} loading={loading} title="Үлдэгдэл">
            <Statistic
              title="Төлөөгүй дүн"
              value={summary?.outstanding ?? 0}
              valueStyle={{ color: "#dc2626" }}
              formatter={(v) => formatMnt(Number(v))}
            />
            <Typography.Paragraph type="secondary" className={styles.hint}>
              {summary?.rented_units ?? 0} түрээслэгдсэн нэгж · {summary?.total_area_sqm ?? 0} м²
            </Typography.Paragraph>
          </Card>
        </Col>
      </Row>

      <Card
        className={styles.tableCard}
        title={data?.period.label ?? "Сарын төлбөр"}
        extra={
          <Typography.Text type="secondary">
            {PAYMENT_STATUS_LABELS.paid} / {PAYMENT_STATUS_LABELS.unpaid} төлөв
          </Typography.Text>
        }
      >
        <Table
          rowKey="id"
          size="small"
          loading={loading}
          columns={columns}
          dataSource={data?.payments ?? []}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 980 }}
        />
      </Card>
    </section>
  );
}
