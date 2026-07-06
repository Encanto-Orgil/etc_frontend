"use client";

import { ArrowLeftOutlined, DownloadOutlined, EditOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, DatePicker, Descriptions, Form, Input, Modal, message, Row, Col, Space, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import BallroomInvoiceFormFields, { buildInvoicePayload, type InvoiceFormValues } from "@/components/dashboard/BallroomInvoiceFormFields";
import {
  fetchDashboardBallroomInvoice,
  markBallroomInvoicePaid,
  markBallroomInvoiceSent,
  updateDashboardBallroomInvoice,
  type BallroomInvoiceStatus,
  type DashboardBallroomInvoice,
} from "@/lib/ballroomManagement";
import { formatSlotTime } from "@/lib/ballroomAvailability";
import { formatInvoiceMoney, VAT_MODE_LABELS } from "@/lib/ballroomInvoiceMath";
import styles from "./PropertyManagement.module.css";

const INVOICE_STATUS_LABELS: Record<BallroomInvoiceStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  cancelled: "Cancelled",
};

const INVOICE_STATUS_COLORS: Record<BallroomInvoiceStatus, string> = {
  draft: "default",
  sent: "blue",
  paid: "green",
  cancelled: "red",
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
  issue_date: dayjs.Dayjs;
  due_date: dayjs.Dayjs;
  notes?: string;
};

export default function BallroomInvoiceDetail({ invoiceId }: { invoiceId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [invoice, setInvoice] = useState<DashboardBallroomInvoice | null>(null);
  const [editForm] = Form.useForm<EditFormValues>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setInvoice(await fetchDashboardBallroomInvoice(invoiceId));
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Invoice detail failed to load.");
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    load();
  }, [load]);

  const openEdit = () => {
    if (!invoice) return;
    editForm.setFieldsValue({
      issue_date: dayjs(invoice.issue_date),
      due_date: dayjs(invoice.due_date),
      lines: invoice.lines.map((line) => ({
        description: line.description,
        quantity: Number(line.quantity),
        unit_price: Number(line.unit_price),
      })),
      discount_amount: Number(invoice.discount_amount),
      vat_mode: invoice.vat_mode,
      notes: invoice.notes,
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    const values = await editForm.validateFields();
    setSaving(true);
    try {
      const updated = await updateDashboardBallroomInvoice(invoiceId, {
        ...buildInvoicePayload(values),
        issue_date: values.issue_date.format("YYYY-MM-DD"),
        due_date: values.due_date.format("YYYY-MM-DD"),
      });
      setInvoice(updated);
      setEditOpen(false);
      message.success("Invoice updated.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to update invoice.");
    } finally {
      setSaving(false);
    }
  };

  const markSent = async () => {
    try {
      setInvoice(await markBallroomInvoiceSent(invoiceId));
      message.success("Invoice marked as sent.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to update invoice.");
    }
  };

  const markPaid = async () => {
    try {
      setInvoice(await markBallroomInvoicePaid(invoiceId));
      message.success("Invoice marked as paid.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to update invoice.");
    }
  };

  const invoiceRows = invoice
    ? invoice.lines.map((line) => ({
        key: String(line.id),
        product: line.description,
        description: "",
        quantity: Number(line.quantity).toFixed(2),
        price: line.unit_price,
        amount: line.amount,
      }))
    : [];

  const invoiceNumber = invoice?.invoice_number || `Draft #${invoiceId}`;
  const profile = invoice?.billing_profile;

  const bankHtml = profile
    ? `<div class="bank">
      <h3>Payment details</h3>
      ${profile.company_name ? `<div><strong>${escapeHtml(profile.company_name)}</strong></div>` : ""}
      ${profile.registration_number ? `<div>Reg: ${escapeHtml(profile.registration_number)}</div>` : ""}
      ${profile.bank_name ? `<div>Bank: ${escapeHtml(profile.bank_name)}${profile.bank_branch ? ` · ${escapeHtml(profile.bank_branch)}` : ""}</div>` : ""}
      ${profile.bank_account_number ? `<div>Account: ${escapeHtml(profile.bank_account_number)}</div>` : ""}
      ${profile.bank_account_name ? `<div>Holder: ${escapeHtml(profile.bank_account_name)}</div>` : ""}
      ${profile.payment_notes ? `<div class="muted">${escapeHtml(profile.payment_notes)}</div>` : ""}
    </div>`
    : "";

  const printableHtml = invoice
    ? `<!doctype html>
<html>
<head>
  <title>${escapeHtml(invoiceNumber)}</title>
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
    .bank { margin-top: 28px; padding: 16px; border: 1px solid #ddd; border-radius: 8px; background: #fafafa; font-size: 13px; }
    .bank h3 { margin: 0 0 10px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="muted">${escapeHtml(profile?.company_name || "Ballroom Invoice")}</div>
      <h1>${escapeHtml(invoiceNumber)}</h1>
      <div class="muted">${escapeHtml(invoice.booking_event_type)} · ${escapeHtml(invoice.booking_date)}</div>
    </div>
    <div class="muted">Status: ${escapeHtml(INVOICE_STATUS_LABELS[invoice.status])}<br/>${escapeHtml(invoice.vat_mode_label || VAT_MODE_LABELS[invoice.vat_mode])}</div>
  </div>
  <div class="grid">
    <div>
      <div class="field"><span class="label">Customer</span><span>${escapeHtml(invoice.booking_name)}</span></div>
      <div class="field"><span class="label">Phone</span><span>${escapeHtml(invoice.booking_phone)}</span></div>
      <div class="field"><span class="label">Email</span><span>${escapeHtml(invoice.booking_email || "-")}</span></div>
    </div>
    <div>
      <div class="field"><span class="label">Issue date</span><span>${escapeHtml(formatDate(invoice.issue_date))}</span></div>
      <div class="field"><span class="label">Due date</span><span>${escapeHtml(formatDate(invoice.due_date))}</span></div>
      <div class="field"><span class="label">Currency</span><span>MNT</span></div>
    </div>
  </div>
  <table>
    <thead><tr><th>Service</th><th class="right">Qty</th><th class="right">Unit price</th><th class="right">Amount</th></tr></thead>
    <tbody>
      ${invoiceRows
        .map(
          (row) =>
            `<tr><td>${escapeHtml(row.product)}</td><td class="right">${escapeHtml(row.quantity)}</td><td class="right">${escapeHtml(formatInvoiceMoney(row.price))}</td><td class="right">${escapeHtml(formatInvoiceMoney(row.amount))}</td></tr>`,
        )
        .join("")}
    </tbody>
  </table>
  <div class="totals">
    <div class="total-row"><span>Subtotal</span><strong>${escapeHtml(formatInvoiceMoney(invoice.subtotal))}</strong></div>
    <div class="total-row"><span>Discount</span><strong>-${escapeHtml(formatInvoiceMoney(invoice.discount_amount))}</strong></div>
    <div class="total-row"><span>Net (without VAT)</span><strong>${escapeHtml(formatInvoiceMoney(invoice.net_amount))}</strong></div>
    <div class="total-row"><span>VAT (10%)</span><strong>${escapeHtml(formatInvoiceMoney(invoice.vat_amount))}</strong></div>
    <div class="total-row grand"><span>Total</span><strong>${escapeHtml(formatInvoiceMoney(invoice.total_amount))}</strong></div>
    <div class="total-row grand"><span>Amount due</span><strong>${escapeHtml(formatInvoiceMoney(invoice.total_amount))}</strong></div>
  </div>
  ${bankHtml}
</body>
</html>`
    : "";

  const printInvoice = () => {
    if (!invoice) return;
    const printWindow = window.open("", "_blank", "width=960,height=720");
    if (!printWindow) {
      message.error("Popup blocked. Please allow popups to print the invoice.");
      return;
    }
    printWindow.document.write(printableHtml);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const downloadPdf = async () => {
    if (!invoice) return;
    setDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 42;
      let y = 52;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(profile?.company_name || "Ballroom Invoice", margin, y);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      y += 28;
      doc.text(invoiceNumber, margin, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      y += 18;
      doc.text(`${invoice.booking_event_type} · ${invoice.booking_date}`, margin, y);
      doc.text(`Status: ${INVOICE_STATUS_LABELS[invoice.status]}`, pageWidth - margin, 52, { align: "right" });
      doc.text(VAT_MODE_LABELS[invoice.vat_mode], pageWidth - margin, 66, { align: "right" });

      y += 38;
      const leftX = margin;
      const rightX = pageWidth / 2 + 10;
      const fields = [
        ["Customer", invoice.booking_name, "Issue date", formatDate(invoice.issue_date)],
        ["Phone", invoice.booking_phone, "Due date", formatDate(invoice.due_date)],
        ["Email", invoice.booking_email || "-", "Currency", "MNT"],
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

      invoiceRows.forEach((row) => {
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
        ["Subtotal", formatInvoiceMoney(invoice.subtotal)],
        ["Discount", `-${formatInvoiceMoney(invoice.discount_amount)}`],
        ["Net (without VAT)", formatInvoiceMoney(invoice.net_amount)],
        ["VAT (10%)", formatInvoiceMoney(invoice.vat_amount)],
        ["Total", formatInvoiceMoney(invoice.total_amount)],
        ["Amount due", formatInvoiceMoney(invoice.total_amount)],
      ];
      totalRows.forEach(([label, value], index) => {
        doc.setFont("helvetica", index >= 4 ? "bold" : "normal");
        doc.text(label, totalX, y);
        doc.text(value, pageWidth - margin, y, { align: "right" });
        y += 18;
      });

      if (profile && (profile.bank_name || profile.bank_account_number)) {
        y += 16;
        doc.setFont("helvetica", "bold");
        doc.text("Payment details", margin, y);
        y += 18;
        doc.setFont("helvetica", "normal");
        if (profile.bank_name) {
          doc.text(`Bank: ${profile.bank_name}${profile.bank_branch ? ` · ${profile.bank_branch}` : ""}`, margin, y);
          y += 16;
        }
        if (profile.bank_account_number) {
          doc.text(`Account: ${profile.bank_account_number}`, margin, y);
          y += 16;
        }
        if (profile.bank_account_name) {
          doc.text(`Holder: ${profile.bank_account_name}`, margin, y);
          y += 16;
        }
        if (profile.payment_notes) {
          doc.text(profile.payment_notes, margin, y, { maxWidth: pageWidth - margin * 2 });
        }
      }

      doc.save(`${invoiceNumber.replace(/[^\w-]+/g, "_")}.pdf`);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to download PDF.");
    } finally {
      setDownloading(false);
    }
  };

  const columns: ColumnsType<(typeof invoiceRows)[number]> = [
    { title: "Service", dataIndex: "product", key: "product" },
    { title: "Qty", dataIndex: "quantity", key: "quantity", align: "right" },
    { title: "Unit price", key: "price", align: "right", render: (_, item) => formatInvoiceMoney(item.price) },
    { title: "Amount", key: "amount", align: "right", render: (_, item) => formatInvoiceMoney(item.amount) },
  ];

  return (
    <Spin spinning={loading}>
      <section className={styles.shell}>
        <div className={styles.detailHeader}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/dashboard/ballroom/invoices")}>
            Invoices
          </Button>
          <div>
            <span className={styles.eyebrow}>Ballroom Invoice</span>
            <h1>{invoiceNumber}</h1>
            {invoice ? (
              <p>
                {invoice.booking_name} · {formatDate(invoice.booking_date)}{" "}
                {formatSlotTime(invoice.booking_start)}–{formatSlotTime(invoice.booking_end)} · {VAT_MODE_LABELS[invoice.vat_mode]}
              </p>
            ) : null}
          </div>
          {invoice ? (
            <Tag color={INVOICE_STATUS_COLORS[invoice.status]}>{INVOICE_STATUS_LABELS[invoice.status]}</Tag>
          ) : null}
        </div>

        {invoice ? (
          <div className={styles.detailGrid}>
            <Space wrap style={{ marginBottom: 12 }}>
              <Button icon={<EditOutlined />} onClick={openEdit}>
                Edit
              </Button>
              <Button icon={<PrinterOutlined />} onClick={printInvoice}>
                Print
              </Button>
              <Button icon={<DownloadOutlined />} loading={downloading} onClick={downloadPdf}>
                Download PDF
              </Button>
              {invoice.status === "draft" && (
                <Button type="primary" onClick={markSent}>
                  Mark sent
                </Button>
              )}
              {(invoice.status === "draft" || invoice.status === "sent") && (
                <Button type="primary" onClick={markPaid}>
                  Mark paid
                </Button>
              )}
            </Space>

            <Descriptions bordered size="small" column={2} className={styles.detailCard}>
              <Descriptions.Item label="Customer">{invoice.booking_name}</Descriptions.Item>
              <Descriptions.Item label="Phone">{invoice.booking_phone}</Descriptions.Item>
              <Descriptions.Item label="Email">{invoice.booking_email || "-"}</Descriptions.Item>
              <Descriptions.Item label="Event">{invoice.booking_event_type}</Descriptions.Item>
              <Descriptions.Item label="Issue date">{formatDate(invoice.issue_date)}</Descriptions.Item>
              <Descriptions.Item label="Due date">{formatDate(invoice.due_date)}</Descriptions.Item>
            </Descriptions>

            <Table rowKey="key" columns={columns} dataSource={invoiceRows} pagination={false} style={{ marginTop: 12 }} />

            <div className={styles.invoiceTotals}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Subtotal">{formatInvoiceMoney(invoice.subtotal)}</Descriptions.Item>
                <Descriptions.Item label="Discount">-{formatInvoiceMoney(invoice.discount_amount)}</Descriptions.Item>
                <Descriptions.Item label="Net (without VAT)">{formatInvoiceMoney(invoice.net_amount)}</Descriptions.Item>
                <Descriptions.Item label="VAT (10%)">{formatInvoiceMoney(invoice.vat_amount)}</Descriptions.Item>
                <Descriptions.Item label="Total">{formatInvoiceMoney(invoice.total_amount)}</Descriptions.Item>
                <Descriptions.Item label="Amount due">{formatInvoiceMoney(invoice.total_amount)}</Descriptions.Item>
              </Descriptions>
            </div>

            {profile && (profile.bank_name || profile.bank_account_number || profile.company_name) ? (
              <div className={styles.bankInfoBlock}>
                <h3>Payment details</h3>
                {profile.company_name ? <div><strong>{profile.company_name}</strong></div> : null}
                {profile.registration_number ? <div>Reg: {profile.registration_number}</div> : null}
                {profile.address ? <div>{profile.address}</div> : null}
                {profile.phone ? <div>Phone: {profile.phone}</div> : null}
                {profile.bank_name ? (
                  <div>
                    Bank: {profile.bank_name}
                    {profile.bank_branch ? ` · ${profile.bank_branch}` : ""}
                  </div>
                ) : null}
                {profile.bank_account_number ? <div>Account: {profile.bank_account_number}</div> : null}
                {profile.bank_account_name ? <div>Holder: {profile.bank_account_name}</div> : null}
                {profile.payment_notes ? <p className={styles.muted}>{profile.payment_notes}</p> : null}
              </div>
            ) : null}

            {invoice.notes ? <p className={styles.muted}>Notes: {invoice.notes}</p> : null}
          </div>
        ) : null}
      </section>

      <Modal
        title="Edit invoice"
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
              <Form.Item name="issue_date" label="Issue date" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="due_date" label="Due date" rules={[{ required: true }]}>
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