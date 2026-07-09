"use client";

import { ArrowLeftOutlined, CheckOutlined, DownloadOutlined, MailOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, DatePicker, Descriptions, Form, Input, message, Modal, Select, Space, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { type Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  createInvoiceFromRentScheduleLine,
  fetchLeaseRentScheduleLine,
  markRentScheduleLinePaid,
  sendRentScheduleInvoiceEmail,
  type LeaseRentPaymentMethod,
  type LeaseRentScheduleLine,
  type LeaseRentScheduleStatus,
} from "@/lib/propertyManagement";
import styles from "./PropertyManagement.module.css";

const INVOICE_STATUS_LABELS: Record<LeaseRentScheduleStatus, string> = {
  pending: "Draft",
  invoiced: "Posted",
  paid: "Paid",
  cancelled: "Cancelled",
};

const PAYMENT_METHOD_OPTIONS: Array<{ value: LeaseRentPaymentMethod; label: string }> = [
  { value: "bank_transfer", label: "Дансаар шилжүүлэг" },
  { value: "cash", label: "Бэлэн мөнгө" },
  { value: "card", label: "Карт" },
  { value: "other", label: "Бусад" },
];

const INVOICE_STATUS_COLORS: Record<LeaseRentScheduleStatus, string> = {
  pending: "default",
  invoiced: "blue",
  paid: "green",
  cancelled: "red",
};

const INVOICE_STEPS: LeaseRentScheduleStatus[] = ["pending", "invoiced", "paid", "cancelled"];
const INVOICE_LOGO_SRC = "/images/encanto-logo.png";
const INVOICE_BRAND_NAME = "Encanto Trade Center";

function formatMoney(value: string | number) {
  return `${Number(value || 0).toLocaleString()} ₮`;
}

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

async function loadImageDataUrl(src: string) {
  const response = await fetch(src);
  if (!response.ok) throw new Error("Failed to load invoice logo.");
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function buildPrintableHtml(
  line: LeaseRentScheduleLine,
  invoiceRows: Array<{ product: string; description: string; quantity: string; price: string | number; amount: string | number }>,
  logoUrl: string,
) {
  const invoiceNumber = line.invoice_reference || "Draft Invoice";
  return `<!doctype html>
<html>
<head>
  <title>${escapeHtml(invoiceNumber)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #111; margin: 32px; }
    .header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 1px solid #ddd; padding-bottom: 18px; }
    .logo { height: 48px; width: auto; max-width: 180px; object-fit: contain; }
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
      <img class="logo" src="${escapeHtml(logoUrl)}" alt="${escapeHtml(INVOICE_BRAND_NAME)}" />
      <div class="muted" style="margin-top:12px;">${escapeHtml(INVOICE_BRAND_NAME)}</div>
    </div>
    <div style="text-align:right;">
      <div class="muted">Customer Invoice</div>
      <h1>${escapeHtml(invoiceNumber)}</h1>
      <div class="muted">${escapeHtml(line.contract_number)} · ${escapeHtml(line.period_start)} to ${escapeHtml(line.period_end)}</div>
      <div class="muted">Status: ${escapeHtml(INVOICE_STATUS_LABELS[line.status])}</div>
    </div>
  </div>
  <div class="grid">
    <div>
      <div class="field"><span class="label">Customer</span><span>${escapeHtml(line.tenant_company || line.tenant_name)}</span></div>
      <div class="field"><span class="label">Contract</span><span>${escapeHtml(line.contract_number)}</span></div>
      <div class="field"><span class="label">Unit</span><span>${escapeHtml(`${line.building_name} · ${line.floor_number}F · ${line.unit_code}`)}</span></div>
    </div>
    <div>
      <div class="field"><span class="label">Invoice Date</span><span>${escapeHtml(formatDate(line.created_at))}</span></div>
      <div class="field"><span class="label">Due Date</span><span>${escapeHtml(formatDate(line.due_date))}</span></div>
      <div class="field"><span class="label">Currency</span><span>MNT</span></div>
    </div>
  </div>
  <table>
    <thead><tr><th>Product</th><th class="right">Quantity</th><th class="right">Price</th><th class="right">Amount</th></tr></thead>
    <tbody>
      ${invoiceRows
        .map(
          (row) =>
            `<tr><td><strong>${escapeHtml(row.product)}</strong><br/><span class="muted">${escapeHtml(row.description)}</span></td><td class="right">${escapeHtml(row.quantity)}</td><td class="right">${escapeHtml(formatMoney(row.price))}</td><td class="right">${escapeHtml(formatMoney(row.amount))}</td></tr>`,
        )
        .join("")}
    </tbody>
  </table>
  <div class="totals">
    <div class="total-row"><span>Untaxed Amount</span><strong>${escapeHtml(formatMoney(line.total_amount))}</strong></div>
    <div class="total-row"><span>Taxes</span><strong>0 ₮</strong></div>
    <div class="total-row grand"><span>Total</span><strong>${escapeHtml(formatMoney(line.total_amount))}</strong></div>
    <div class="total-row grand"><span>Amount Due</span><strong>${escapeHtml(formatMoney(line.total_amount))}</strong></div>
  </div>
</body>
</html>`;
}

export default function PropertyInvoiceDetail({ lineId }: { lineId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [paidModalOpen, setPaidModalOpen] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [line, setLine] = useState<LeaseRentScheduleLine | null>(null);
  const [paidForm] = Form.useForm<{ paid_at: Dayjs; payment_method: LeaseRentPaymentMethod }>();
  const [emailForm] = Form.useForm<{ email: string }>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setLine(await fetchLeaseRentScheduleLine(lineId));
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Invoice detail failed to load.");
    } finally {
      setLoading(false);
    }
  }, [lineId]);

  useEffect(() => {
    load();
  }, [load]);

  const createInvoice = async () => {
    setCreating(true);
    try {
      const nextLine = await createInvoiceFromRentScheduleLine(lineId);
      setLine(nextLine);
      message.success("Invoice created.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to create invoice.");
    } finally {
      setCreating(false);
    }
  };

  const openPaidModal = () => {
    paidForm.setFieldsValue({
      paid_at: line?.paid_at ? dayjs(line.paid_at) : dayjs(),
      payment_method: line?.payment_method || "bank_transfer",
    });
    setPaidModalOpen(true);
  };

  const handleMarkPaid = async () => {
    const values = await paidForm.validateFields();
    setMarkingPaid(true);
    try {
      const nextLine = await markRentScheduleLinePaid(lineId, {
        payment_method: values.payment_method,
        paid_at: values.paid_at.toISOString(),
      });
      setLine(nextLine);
      setPaidModalOpen(false);
      message.success("Marked as paid.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to mark as paid.");
    } finally {
      setMarkingPaid(false);
    }
  };

  const openEmailModal = () => {
    emailForm.setFieldsValue({ email: line?.tenant_email || line?.sent_to_email || "" });
    setEmailModalOpen(true);
  };

  const handleSendEmail = async () => {
    const values = await emailForm.validateFields();
    setSendingEmail(true);
    try {
      const nextLine = await sendRentScheduleInvoiceEmail(lineId, values.email.trim());
      setLine(nextLine);
      setEmailModalOpen(false);
      message.success("Invoice email sent.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to send email.");
    } finally {
      setSendingEmail(false);
    }
  };

  const canMarkPaid = line?.status === "invoiced" || line?.status === "paid";
  const canSendEmail = Boolean(line?.invoice_reference) && line?.status !== "cancelled";

  const invoiceRows = line
    ? [
        {
          key: "rent",
          product: "Monthly Rent",
          description: `${line.unit_code} (${formatDate(line.period_start)} - ${formatDate(line.period_end)})`,
          quantity: "1.00",
          price: line.rent_amount,
          amount: line.rent_amount,
        },
        ...(Number(line.service_charge || 0) > 0
          ? [
              {
                key: "service",
                product: "Service Charge",
                description: `${line.unit_code} service charge`,
                quantity: "1.00",
                price: line.service_charge,
                amount: line.service_charge,
              },
            ]
          : []),
      ]
    : [];

  const invoiceNumber = line?.invoice_reference || "Draft Invoice";

  const printInvoice = () => {
    if (!line) return;
    const logoUrl = `${window.location.origin}${INVOICE_LOGO_SRC}`;
    const printableHtml = buildPrintableHtml(line, invoiceRows, logoUrl);
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
    if (!line) return;
    setDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 42;
      let y = 52;

      try {
        const logoData = await loadImageDataUrl(INVOICE_LOGO_SRC);
        doc.addImage(logoData, "PNG", margin, y - 18, 120, 36);
      } catch {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(INVOICE_BRAND_NAME, margin, y);
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Customer Invoice", pageWidth - margin, y, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      y += 28;
      doc.text(invoiceNumber, pageWidth - margin, y, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      y += 18;
      doc.text(`${line.contract_number} · ${line.period_start} to ${line.period_end}`, pageWidth - margin, y, { align: "right" });
      doc.text(`Status: ${INVOICE_STATUS_LABELS[line.status]}`, pageWidth - margin, y + 18, { align: "right" });

      y += 38;
      const leftX = margin;
      const rightX = pageWidth / 2 + 10;
      const fields = [
        ["Customer", line.tenant_company || line.tenant_name, "Invoice Date", formatDate(line.created_at)],
        ["Contract", line.contract_number, "Due Date", formatDate(line.due_date)],
        ["Unit", `${line.building_name} · ${line.floor_number}F · ${line.unit_code}`, "Currency", "MNT"],
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
      doc.text("Product", margin, y);
      doc.text("Qty", pageWidth - 220, y, { align: "right" });
      doc.text("Price", pageWidth - 130, y, { align: "right" });
      doc.text("Amount", pageWidth - margin, y, { align: "right" });
      y += 14;
      doc.line(margin, y, pageWidth - margin, y);
      y += 20;

      invoiceRows.forEach((row) => {
        doc.setFont("helvetica", "bold");
        doc.text(row.product, margin, y);
        doc.setFont("helvetica", "normal");
        doc.text(row.quantity, pageWidth - 220, y, { align: "right" });
        doc.text(formatMoney(row.price), pageWidth - 130, y, { align: "right" });
        doc.text(formatMoney(row.amount), pageWidth - margin, y, { align: "right" });
        y += 15;
        doc.setFontSize(9);
        doc.text(row.description, margin, y);
        doc.setFontSize(10);
        y += 22;
      });

      y += 20;
      const totalX = pageWidth - 250;
      const totalRows = [
        ["Untaxed Amount", formatMoney(line.total_amount)],
        ["Taxes", "0 ₮"],
        ["Total", formatMoney(line.total_amount)],
        ["Amount Due", formatMoney(line.total_amount)],
      ];
      totalRows.forEach(([label, value], index) => {
        doc.setFont("helvetica", index >= 2 ? "bold" : "normal");
        doc.text(label, totalX, y);
        doc.text(value, pageWidth - margin, y, { align: "right" });
        y += 18;
      });

      doc.save(`${invoiceNumber.replace(/[^\w-]+/g, "_")}.pdf`);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to download PDF.");
    } finally {
      setDownloading(false);
    }
  };

  const columns: ColumnsType<(typeof invoiceRows)[number]> = [
    {
      title: "Product",
      key: "product",
      render: (_, item) => (
        <div>
          <strong>{item.product}</strong>
          <span className={styles.muted}>{item.description}</span>
        </div>
      ),
    },
    { title: "Quantity", dataIndex: "quantity", key: "quantity", align: "right" },
    { title: "Price", key: "price", align: "right", render: (_, item) => formatMoney(item.price) },
    { title: "Amount", key: "amount", align: "right", render: (_, item) => formatMoney(item.amount) },
  ];

  return (
    <Spin spinning={loading}>
      <section className={styles.shell}>
        <div className={styles.detailHeader}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/dashboard/property/rent-schedule")}>
            Rent Schedule
          </Button>
          <div>
            <span className={styles.eyebrow}>Customer Invoice</span>
            <h1>{line?.invoice_reference || "Draft Invoice"}</h1>
            {line ? <p>{line.contract_number} · {line.period_start} to {line.period_end}</p> : null}
          </div>
          {line ? <Tag color={INVOICE_STATUS_COLORS[line.status]}>{INVOICE_STATUS_LABELS[line.status]}</Tag> : null}
        </div>

        {line ? (
          <div className={styles.odooForm}>
            <div className={styles.odooToolbar}>
              <Space>
                <Button type="primary" loading={creating} onClick={createInvoice}>
                  {line.invoice_reference ? "Refresh Invoice" : "Create Invoice"}
                </Button>
                {canMarkPaid ? (
                  <Button type="primary" icon={<CheckOutlined />} onClick={openPaidModal}>
                    {line.status === "paid" ? "Update Payment" : "Mark as Paid"}
                  </Button>
                ) : null}
                {canSendEmail ? (
                  <Button icon={<MailOutlined />} onClick={openEmailModal}>
                    Send Email
                  </Button>
                ) : null}
                <Button icon={<PrinterOutlined />} onClick={printInvoice}>
                  Print
                </Button>
                <Button icon={<DownloadOutlined />} loading={downloading} onClick={downloadPdf}>
                  Download PDF
                </Button>
                <Button onClick={() => router.push(`/dashboard/property/contracts/${line.contract}`)}>Open Contract</Button>
              </Space>
              <div className={styles.statusStepper}>
                {INVOICE_STEPS.map((step) => (
                  <span key={step} className={step === line.status ? styles.statusStepActive : styles.statusStep}>
                    {INVOICE_STATUS_LABELS[step]}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.odooSheet}>
              <div className={styles.invoiceBrandHeader}>
                <img src={INVOICE_LOGO_SRC} alt={INVOICE_BRAND_NAME} className={styles.invoiceBrandLogo} />
                <div className={styles.invoiceBrandMeta}>
                  <span className={styles.formLabel}>Customer Invoice</span>
                  <h2>{line.invoice_reference || "Draft Invoice"}</h2>
                </div>
              </div>

              <div className={styles.formColumns}>
                <div className={styles.formColumn}>
                  <div className={styles.formField}>
                    <span>Customer</span>
                    <strong>{line.tenant_company || line.tenant_name}</strong>
                  </div>
                  <div className={styles.formField}>
                    <span>Contract</span>
                    <strong>{line.contract_number}</strong>
                  </div>
                  <div className={styles.formField}>
                    <span>Unit</span>
                    <strong>{line.building_name} · {line.floor_number}F · {line.unit_code}</strong>
                  </div>
                </div>
                <div className={styles.formColumn}>
                  <div className={styles.formField}>
                    <span>Invoice Date</span>
                    <strong>{formatDate(line.created_at)}</strong>
                  </div>
                  <div className={styles.formField}>
                    <span>Due Date</span>
                    <strong>{formatDate(line.due_date)}</strong>
                  </div>
                  <div className={styles.formField}>
                    <span>Currency</span>
                    <strong>MNT</strong>
                  </div>
                  {line.status === "paid" ? (
                    <>
                      <div className={styles.formField}>
                        <span>Paid At</span>
                        <strong>{formatDate(line.paid_at)}</strong>
                      </div>
                      <div className={styles.formField}>
                        <span>Payment Method</span>
                        <strong>{line.payment_method_label || "-"}</strong>
                      </div>
                    </>
                  ) : null}
                  {line.sent_at ? (
                    <div className={styles.formField}>
                      <span>Last Sent</span>
                      <strong>
                        {dayjs(line.sent_at).format("YYYY-MM-DD HH:mm")}
                        {line.sent_to_email ? ` → ${line.sent_to_email}` : ""}
                      </strong>
                    </div>
                  ) : null}
                </div>
              </div>

              <Table
                className={styles.invoiceLinesTable}
                rowKey="key"
                columns={columns}
                dataSource={invoiceRows}
                pagination={false}
              />

              <div className={styles.invoiceTotals}>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Untaxed Amount">{formatMoney(line.total_amount)}</Descriptions.Item>
                  <Descriptions.Item label="Taxes">0 ₮</Descriptions.Item>
                  <Descriptions.Item label="Total">{formatMoney(line.total_amount)}</Descriptions.Item>
                  <Descriptions.Item label="Amount Due">{formatMoney(line.total_amount)}</Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          </div>
        ) : null}

        <Modal
          title={line?.status === "paid" ? "Update payment details" : "Mark invoice as paid"}
          open={paidModalOpen}
          onCancel={() => setPaidModalOpen(false)}
          onOk={handleMarkPaid}
          okText={line?.status === "paid" ? "Save" : "Mark as Paid"}
          confirmLoading={markingPaid}
          destroyOnHidden
        >
          <Form form={paidForm} layout="vertical">
            <Form.Item
              name="paid_at"
              label="Paid date"
              rules={[{ required: true, message: "Select payment date." }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              name="payment_method"
              label="Payment method"
              rules={[{ required: true, message: "Select payment method." }]}
            >
              <Select options={PAYMENT_METHOD_OPTIONS} />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Send invoice by email"
          open={emailModalOpen}
          onCancel={() => setEmailModalOpen(false)}
          onOk={handleSendEmail}
          okText="Send Email"
          confirmLoading={sendingEmail}
          destroyOnHidden
        >
          <Form form={emailForm} layout="vertical">
            <Form.Item
              name="email"
              label="Recipient email"
              rules={[
                { required: true, message: "Enter recipient email." },
                { type: "email", message: "Enter a valid email address." },
              ]}
            >
              <Input placeholder="tenant@example.com" />
            </Form.Item>
          </Form>
        </Modal>
      </section>
    </Spin>
  );
}
