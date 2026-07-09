"use client";

import { ArrowLeftOutlined, DownloadOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Spin, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { fetchPortalInvoice } from "@/lib/portalManagement";
import type { LeaseRentScheduleLine } from "@/lib/propertyManagement";
import {
  INVOICE_BRAND_NAME,
  INVOICE_LOGO_SRC,
  INVOICE_STATUS_COLORS,
  INVOICE_STATUS_LABELS,
  buildInvoiceRows,
  downloadInvoicePdf,
  formatInvoiceDate,
  formatInvoiceMoney,
  printInvoiceDocument,
  type InvoiceLineRow,
} from "@/lib/rentInvoiceDocument";
import styles from "./Portal.module.css";

export default function PortalInvoiceDetail({ lineId }: { lineId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [line, setLine] = useState<LeaseRentScheduleLine | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setLine(await fetchPortalInvoice(lineId));
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Нэхэмжлэх ачааллахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  }, [lineId]);

  useEffect(() => {
    load();
  }, [load]);

  const invoiceRows = line ? buildInvoiceRows(line) : [];
  const invoiceNumber = line?.invoice_reference || `Нэхэмжлэх #${line?.id}`;

  const handlePrint = async () => {
    if (!line) return;
    try {
      await printInvoiceDocument(line, invoiceRows);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Хэвлэхэд алдаа гарлаа.");
    }
  };

  const handleDownload = async () => {
    if (!line) return;
    setDownloading(true);
    try {
      await downloadInvoicePdf(line, invoiceRows);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "PDF татахад алдаа гарлаа.");
    } finally {
      setDownloading(false);
    }
  };

  const columns: ColumnsType<InvoiceLineRow> = [
    {
      title: "Бүтээгдэхүүн",
      key: "product",
      render: (_, item) => (
        <div>
          <strong>{item.product}</strong>
          <div style={{ color: "#6b7280", fontSize: 12 }}>{item.description}</div>
        </div>
      ),
    },
    { title: "Тоо", dataIndex: "quantity", align: "right" },
    { title: "Үнэ", key: "price", align: "right", render: (_, item) => formatInvoiceMoney(item.price) },
    { title: "Дүн", key: "amount", align: "right", render: (_, item) => formatInvoiceMoney(item.amount) },
  ];

  return (
    <Spin spinning={loading}>
      <div className={styles.backButton}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/portal/invoices")}>
          Нэхэмжлэхүүд
        </Button>
      </div>

      {line ? (
        <>
          <div className={styles.pageHeader}>
            <div className={styles.pageHeaderMain}>
              <span className={styles.eyebrow}>Нэхэмжлэх</span>
              <h1>{invoiceNumber}</h1>
              <p className={styles.pageSubtitle}>
                {line.contract_number} · {line.period_start} – {line.period_end}
              </p>
            </div>
            <Tag color={INVOICE_STATUS_COLORS[line.status]}>{INVOICE_STATUS_LABELS[line.status]}</Tag>
          </div>

          <div className={styles.invoiceActions}>
            <Button icon={<PrinterOutlined />} onClick={handlePrint}>
              Хэвлэх
            </Button>
            <Button type="primary" icon={<DownloadOutlined />} loading={downloading} onClick={handleDownload}>
              PDF татах
            </Button>
          </div>

          <Card bordered className={styles.invoiceDocument}>
            <div className={styles.invoiceBrandHeader}>
              <img src={INVOICE_LOGO_SRC} alt={INVOICE_BRAND_NAME} className={styles.invoiceBrandLogo} />
              <div style={{ textAlign: "right" }}>
                <div className={styles.eyebrow}>Нэхэмжлэх</div>
                <h2 style={{ margin: "4px 0 0", fontSize: 24 }}>{invoiceNumber}</h2>
              </div>
            </div>

            <div className={styles.invoiceMetaGrid}>
              <div>
                <div className={styles.invoiceField}>
                  <span className={styles.invoiceFieldLabel}>Харилцагч</span>
                  <strong>{line.tenant_company || line.tenant_name}</strong>
                </div>
                <div className={styles.invoiceField}>
                  <span className={styles.invoiceFieldLabel}>Гэрээ</span>
                  <strong>{line.contract_number}</strong>
                </div>
                <div className={styles.invoiceField}>
                  <span className={styles.invoiceFieldLabel}>Талбай</span>
                  <strong>
                    {line.building_name} · {line.floor_number}F · {line.unit_code}
                  </strong>
                </div>
              </div>
              <div>
                <div className={styles.invoiceField}>
                  <span className={styles.invoiceFieldLabel}>Огноо</span>
                  <strong>{formatInvoiceDate(line.created_at)}</strong>
                </div>
                <div className={styles.invoiceField}>
                  <span className={styles.invoiceFieldLabel}>Төлөх хугацаа</span>
                  <strong>{formatInvoiceDate(line.due_date)}</strong>
                </div>
                <div className={styles.invoiceField}>
                  <span className={styles.invoiceFieldLabel}>Валют</span>
                  <strong>MNT</strong>
                </div>
                {line.status === "paid" ? (
                  <>
                    <div className={styles.invoiceField}>
                      <span className={styles.invoiceFieldLabel}>Төлсөн огноо</span>
                      <strong>{formatInvoiceDate(line.paid_at)}</strong>
                    </div>
                    <div className={styles.invoiceField}>
                      <span className={styles.invoiceFieldLabel}>Төлбөрийн хэлбэр</span>
                      <strong>{line.payment_method_label || "-"}</strong>
                    </div>
                  </>
                ) : null}
                {line.sent_at ? (
                  <div className={styles.invoiceField}>
                    <span className={styles.invoiceFieldLabel}>Илгээсэн</span>
                    <strong>
                      {dayjs(line.sent_at).format("YYYY-MM-DD HH:mm")}
                      {line.sent_to_email ? ` → ${line.sent_to_email}` : ""}
                    </strong>
                  </div>
                ) : null}
              </div>
            </div>

            <Table rowKey="key" columns={columns} dataSource={invoiceRows} pagination={false} />

            <div className={styles.invoiceTotals}>
              <div className={styles.invoiceTotalsInner}>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="НӨАТ-гүй дүн">{formatInvoiceMoney(line.total_amount)}</Descriptions.Item>
                  <Descriptions.Item label="Татвар">0 ₮</Descriptions.Item>
                  <Descriptions.Item label="Нийт">{formatInvoiceMoney(line.total_amount)}</Descriptions.Item>
                  <Descriptions.Item label="Төлөх дүн">{formatInvoiceMoney(line.total_amount)}</Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          </Card>
        </>
      ) : null}
    </Spin>
  );
}
