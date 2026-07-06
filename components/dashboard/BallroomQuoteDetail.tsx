"use client";

import { ArrowLeftOutlined, DownloadOutlined, EditOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Descriptions, Form, Input, InputNumber, message, Modal, Row, Select, Space, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import BallroomInvoiceFormFields, { buildInvoicePayload, type InvoiceFormValues } from "@/components/dashboard/BallroomInvoiceFormFields";
import { ballroomBookingEventTypes } from "@/lib/ballroomAvailability";
import {
  fetchDashboardBallroomQuote,
  markBallroomQuoteAccepted,
  markBallroomQuoteDeclined,
  markBallroomQuoteSent,
  updateDashboardBallroomQuote,
  type BallroomQuoteStatus,
  type BallroomEventType,
  type DashboardBallroomQuote,
} from "@/lib/ballroomManagement";
import { formatInvoiceMoney, VAT_MODE_LABELS } from "@/lib/ballroomInvoiceMath";
import styles from "./PropertyManagement.module.css";

const QUOTE_STATUS_LABELS: Record<BallroomQuoteStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  declined: "Declined",
  cancelled: "Cancelled",
};

const QUOTE_STATUS_COLORS: Record<BallroomQuoteStatus, string> = {
  draft: "default",
  sent: "blue",
  accepted: "green",
  declined: "red",
  cancelled: "default",
};

function formatDate(value: string | null) {
  return value ? dayjs(value).format("MM/DD/YYYY") : "-";
}

function escapeHtml(value: string | number) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type EditFormValues = InvoiceFormValues & {
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  event_type?: string;
  event_date?: dayjs.Dayjs | null;
  guest_count?: number | null;
  issue_date: dayjs.Dayjs;
  valid_until: dayjs.Dayjs;
  notes?: string;
};

export default function BallroomQuoteDetail({ quoteId }: { quoteId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [quote, setQuote] = useState<DashboardBallroomQuote | null>(null);
  const [editForm] = Form.useForm<EditFormValues>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setQuote(await fetchDashboardBallroomQuote(quoteId));
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Quote detail failed to load.");
    } finally {
      setLoading(false);
    }
  }, [quoteId]);

  useEffect(() => {
    load();
  }, [load]);

  const openEdit = () => {
    if (!quote) return;
    editForm.setFieldsValue({
      customer_name: quote.customer_name,
      customer_phone: quote.customer_phone,
      customer_email: quote.customer_email,
      event_type: quote.event_type || undefined,
      event_date: quote.event_date ? dayjs(quote.event_date) : null,
      guest_count: quote.guest_count ?? undefined,
      issue_date: dayjs(quote.issue_date),
      valid_until: dayjs(quote.valid_until),
      lines: quote.lines.map((line) => ({
        description: line.description,
        quantity: Number(line.quantity),
        unit_price: Number(line.unit_price),
      })),
      discount_amount: Number(quote.discount_amount),
      vat_mode: quote.vat_mode,
      notes: quote.notes,
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    const values = await editForm.validateFields();
    setSaving(true);
    try {
      const updated = await updateDashboardBallroomQuote(quoteId, {
        customer_name: values.customer_name,
        customer_phone: values.customer_phone || "",
        customer_email: values.customer_email || "",
        event_type: (values.event_type || "") as BallroomEventType | "",
        event_date: values.event_date ? values.event_date.format("YYYY-MM-DD") : null,
        guest_count: values.guest_count ?? null,
        ...buildInvoicePayload(values),
        issue_date: values.issue_date.format("YYYY-MM-DD"),
        valid_until: values.valid_until.format("YYYY-MM-DD"),
      });
      setQuote(updated);
      setEditOpen(false);
      message.success("Quote updated.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to update quote.");
    } finally {
      setSaving(false);
    }
  };

  const quoteRows = quote
    ? quote.lines.map((line) => ({
        key: String(line.id),
        product: line.description,
        quantity: Number(line.quantity).toFixed(2),
        price: line.unit_price,
        amount: line.amount,
      }))
    : [];

  const quoteNumber = quote?.quote_number || `Draft #${quoteId}`;
  const profile = quote?.billing_profile;

  const printableHtml = quote
    ? `<!doctype html>
<html>
<head>
  <title>${escapeHtml(quoteNumber)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #111; margin: 32px; }
    .header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 1px solid #ddd; padding-bottom: 18px; }
    h1 { margin: 6px 0 0; font-size: 28px; }
    .muted { color: #666; font-size: 12px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin: 24px 0; }
    .field { display: grid; grid-template-columns: 130px 1fr; gap: 12px; margin: 9px 0; font-size: 13px; }
    .label { color: #555; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 13px; }
    th { text-align: left; border-bottom: 1px solid #ddd; padding: 9px 8px; background: #f8f8fc; }
    td { border-bottom: 1px solid #eee; padding: 9px 8px; vertical-align: top; }
    .right { text-align: right; }
    .totals { width: 360px; margin-left: auto; margin-top: 20px; }
    .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
    .grand { font-weight: 800; border-top: 1px solid #ddd; margin-top: 6px; padding-top: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="muted">${escapeHtml(profile?.company_name || "Ballroom Quote")}</div>
      <h1>${escapeHtml(quoteNumber)}</h1>
      <div class="muted">Price proposal · ${escapeHtml(quote.event_type_label || "Event")}</div>
    </div>
    <div class="muted">Status: ${escapeHtml(QUOTE_STATUS_LABELS[quote.status])}<br/>${escapeHtml(quote.vat_mode_label || VAT_MODE_LABELS[quote.vat_mode])}</div>
  </div>
  <div class="grid">
    <div>
      <div class="field"><span class="label">Customer</span><span>${escapeHtml(quote.customer_name)}</span></div>
      <div class="field"><span class="label">Phone</span><span>${escapeHtml(quote.customer_phone || "-")}</span></div>
      <div class="field"><span class="label">Email</span><span>${escapeHtml(quote.customer_email || "-")}</span></div>
    </div>
    <div>
      <div class="field"><span class="label">Issue date</span><span>${escapeHtml(formatDate(quote.issue_date))}</span></div>
      <div class="field"><span class="label">Valid until</span><span>${escapeHtml(formatDate(quote.valid_until))}</span></div>
      <div class="field"><span class="label">Currency</span><span>MNT</span></div>
    </div>
  </div>
  <table>
    <thead><tr><th>Service</th><th class="right">Qty</th><th class="right">Unit price</th><th class="right">Amount</th></tr></thead>
    <tbody>
      ${quoteRows
        .map(
          (row) =>
            `<tr><td>${escapeHtml(row.product)}</td><td class="right">${escapeHtml(row.quantity)}</td><td class="right">${escapeHtml(formatInvoiceMoney(row.price))}</td><td class="right">${escapeHtml(formatInvoiceMoney(row.amount))}</td></tr>`,
        )
        .join("")}
    </tbody>
  </table>
  <div class="totals">
    <div class="total-row"><span>Subtotal</span><strong>${escapeHtml(formatInvoiceMoney(quote.subtotal))}</strong></div>
    <div class="total-row"><span>Discount</span><strong>-${escapeHtml(formatInvoiceMoney(quote.discount_amount))}</strong></div>
    <div class="total-row"><span>Net (without VAT)</span><strong>${escapeHtml(formatInvoiceMoney(quote.net_amount))}</strong></div>
    <div class="total-row"><span>VAT (10%)</span><strong>${escapeHtml(formatInvoiceMoney(quote.vat_amount))}</strong></div>
    <div class="total-row grand"><span>Total</span><strong>${escapeHtml(formatInvoiceMoney(quote.total_amount))}</strong></div>
  </div>
</body>
</html>`
    : "";

  const printQuote = () => {
    if (!quote) return;
    const printWindow = window.open("", "_blank", "width=960,height=720");
    if (!printWindow) {
      message.error("Popup blocked. Please allow popups to print the quote.");
      return;
    }
    printWindow.document.write(printableHtml);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const downloadPdf = async () => {
    if (!quote) return;
    setDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 42;
      let y = 52;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(profile?.company_name || "Ballroom Quote", margin, y);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      y += 28;
      doc.text(quoteNumber, margin, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      y += 18;
      doc.text(`Price proposal · ${quote.event_type_label || "Event"}`, margin, y);
      doc.text(`Status: ${QUOTE_STATUS_LABELS[quote.status]}`, pageWidth - margin, 52, { align: "right" });
      doc.text(VAT_MODE_LABELS[quote.vat_mode], pageWidth - margin, 66, { align: "right" });

      y += 38;
      const leftX = margin;
      const rightX = pageWidth / 2 + 10;
      const fields = [
        ["Customer", quote.customer_name, "Issue date", formatDate(quote.issue_date)],
        ["Phone", quote.customer_phone || "-", "Valid until", formatDate(quote.valid_until)],
        ["Email", quote.customer_email || "-", "Currency", "MNT"],
      ];
      fields.forEach(([leftLabel, leftValue, rightLabel, rightValue]) => {
        doc.setFont("helvetica", "bold");
        doc.text(leftLabel, leftX, y);
        doc.text(rightLabel, rightX, y);
        doc.setFont("helvetica", "normal");
        doc.text(String(leftValue), leftX + 90, y);
        doc.text(String(rightValue), rightX + 90, y);
        y += 20;
      });

      y += 20;
      doc.setDrawColor(220);
      doc.line(margin, y, pageWidth - margin, y);
      y += 22;
      doc.setFont("helvetica", "bold");
      doc.text("Service", margin, y);
      doc.text("Qty", pageWidth - 220, y, { align: "right" });
      doc.text("Unit price", pageWidth - 130, y, { align: "right" });
      doc.text("Amount", pageWidth - margin, y, { align: "right" });
      y += 14;
      doc.line(margin, y, pageWidth - margin, y);
      y += 20;

      quoteRows.forEach((row) => {
        doc.setFont("helvetica", "normal");
        doc.text(row.product, margin, y);
        doc.text(row.quantity, pageWidth - 220, y, { align: "right" });
        doc.text(formatInvoiceMoney(row.price), pageWidth - 130, y, { align: "right" });
        doc.text(formatInvoiceMoney(row.amount), pageWidth - margin, y, { align: "right" });
        y += 22;
      });

      y += 20;
      const totalX = pageWidth - 250;
      const totalRows = [
        ["Subtotal", formatInvoiceMoney(quote.subtotal)],
        ["Discount", `-${formatInvoiceMoney(quote.discount_amount)}`],
        ["Net (without VAT)", formatInvoiceMoney(quote.net_amount)],
        ["VAT (10%)", formatInvoiceMoney(quote.vat_amount)],
        ["Total", formatInvoiceMoney(quote.total_amount)],
      ];
      totalRows.forEach(([label, value], index) => {
        doc.setFont("helvetica", index >= 4 ? "bold" : "normal");
        doc.text(label, totalX, y);
        doc.text(value, pageWidth - margin, y, { align: "right" });
        y += 18;
      });

      doc.save(`${quoteNumber.replace(/[^\w-]+/g, "_")}.pdf`);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to download PDF.");
    } finally {
      setDownloading(false);
    }
  };

  const columns: ColumnsType<(typeof quoteRows)[number]> = [
    { title: "Service", dataIndex: "product", key: "product" },
    { title: "Qty", dataIndex: "quantity", key: "quantity", align: "right" },
    { title: "Unit price", key: "price", align: "right", render: (_, item) => formatInvoiceMoney(item.price) },
    { title: "Amount", key: "amount", align: "right", render: (_, item) => formatInvoiceMoney(item.amount) },
  ];

  return (
    <Spin spinning={loading}>
      <section className={styles.shell}>
        <div className={styles.detailHeader}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/dashboard/ballroom/quotes")}>
            Quotes
          </Button>
          <div>
            <span className={styles.eyebrow}>Ballroom Quote</span>
            <h1>{quoteNumber}</h1>
            {quote ? (
              <p>
                {quote.customer_name}
                {quote.event_date ? ` · ${formatDate(quote.event_date)}` : ""}
                {quote.event_type_label ? ` · ${quote.event_type_label}` : ""}
                {" · "}
                {VAT_MODE_LABELS[quote.vat_mode]}
              </p>
            ) : null}
          </div>
          {quote ? (
            <Tag color={QUOTE_STATUS_COLORS[quote.status]}>{QUOTE_STATUS_LABELS[quote.status]}</Tag>
          ) : null}
        </div>

        {quote ? (
          <div className={styles.detailGrid}>
            <Space wrap style={{ marginBottom: 12 }}>
              <Button icon={<EditOutlined />} onClick={openEdit}>
                Edit
              </Button>
              <Button icon={<PrinterOutlined />} onClick={printQuote}>
                Print
              </Button>
              <Button icon={<DownloadOutlined />} loading={downloading} onClick={downloadPdf}>
                Download PDF
              </Button>
              {quote.status === "draft" && (
                <Button type="primary" onClick={async () => setQuote(await markBallroomQuoteSent(quoteId))}>
                  Mark sent
                </Button>
              )}
              {(quote.status === "draft" || quote.status === "sent") && (
                <>
                  <Button type="primary" onClick={async () => setQuote(await markBallroomQuoteAccepted(quoteId))}>
                    Mark accepted
                  </Button>
                  <Button onClick={async () => setQuote(await markBallroomQuoteDeclined(quoteId))}>
                    Mark declined
                  </Button>
                </>
              )}
            </Space>

            <Descriptions bordered size="small" column={2} className={styles.detailCard}>
              <Descriptions.Item label="Customer">{quote.customer_name}</Descriptions.Item>
              <Descriptions.Item label="Phone">{quote.customer_phone || "-"}</Descriptions.Item>
              <Descriptions.Item label="Email">{quote.customer_email || "-"}</Descriptions.Item>
              <Descriptions.Item label="Event">{quote.event_type_label || "-"}</Descriptions.Item>
              <Descriptions.Item label="Event date">{formatDate(quote.event_date)}</Descriptions.Item>
              <Descriptions.Item label="Guests">{quote.guest_count ?? "-"}</Descriptions.Item>
              <Descriptions.Item label="Issue date">{formatDate(quote.issue_date)}</Descriptions.Item>
              <Descriptions.Item label="Valid until">{formatDate(quote.valid_until)}</Descriptions.Item>
            </Descriptions>

            <Table rowKey="key" columns={columns} dataSource={quoteRows} pagination={false} style={{ marginTop: 12 }} />

            <div className={styles.invoiceTotals}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Subtotal">{formatInvoiceMoney(quote.subtotal)}</Descriptions.Item>
                <Descriptions.Item label="Discount">-{formatInvoiceMoney(quote.discount_amount)}</Descriptions.Item>
                <Descriptions.Item label="Net (without VAT)">{formatInvoiceMoney(quote.net_amount)}</Descriptions.Item>
                <Descriptions.Item label="VAT (10%)">{formatInvoiceMoney(quote.vat_amount)}</Descriptions.Item>
                <Descriptions.Item label="Total">{formatInvoiceMoney(quote.total_amount)}</Descriptions.Item>
              </Descriptions>
            </div>

            {quote.notes ? <p className={styles.muted}>Notes: {quote.notes}</p> : null}
          </div>
        ) : null}
      </section>

      <Modal
        title="Edit quote"
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onOk={saveEdit}
        confirmLoading={saving}
        width={920}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical">
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="customer_name" label="Customer name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="customer_phone" label="Phone">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="customer_email" label="Email">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="event_type" label="Event type">
                <Select allowClear options={[...ballroomBookingEventTypes]} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="event_date" label="Event date">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="guest_count" label="Guests">
                <InputNumber min={1} max={2000} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="issue_date" label="Issue date" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="valid_until" label="Valid until" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <BallroomInvoiceFormFields form={editForm} />
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  );
}
