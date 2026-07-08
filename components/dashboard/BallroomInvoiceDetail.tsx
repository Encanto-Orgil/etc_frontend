"use client";

import {
  ArrowLeftOutlined,
  CheckOutlined,
  CopyOutlined,
  MailOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Button, Descriptions, Form, Input, message, Modal, Space, Spin, Table, Tag } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  fetchDashboardBallroomInvoice,
  markBallroomInvoicePaid,
  markBallroomInvoiceSent,
  sendBallroomInvoiceEmail,
  type BallroomInvoiceStatus,
  type DashboardBallroomInvoice,
} from "@/lib/ballroomManagement";
import styles from "./PropertyManagement.module.css";

const STATUS_COLORS: Record<BallroomInvoiceStatus, string> = {
  draft: "default",
  sent: "blue",
  paid: "green",
  cancelled: "red",
};

function formatMoney(value: string | number) {
  return `${Number(value || 0).toLocaleString()} ₮`;
}

export default function BallroomInvoiceDetail({ invoiceId }: { invoiceId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [invoice, setInvoice] = useState<DashboardBallroomInvoice | null>(null);
  const [emailForm] = Form.useForm<{ email: string }>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setInvoice(await fetchDashboardBallroomInvoice(invoiceId));
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Invoice failed to load.");
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    load();
  }, [load]);

  const copyPublicUrl = async () => {
    if (!invoice?.public_url) return;
    await navigator.clipboard.writeText(invoice.public_url);
    message.success("Public link copied.");
  };

  const openEmailModal = () => {
    emailForm.setFieldsValue({ email: invoice?.booking_email || invoice?.sent_to_email || "" });
    setEmailOpen(true);
  };

  const handleSendEmail = async () => {
    const values = await emailForm.validateFields();
    setSending(true);
    try {
      setInvoice(await sendBallroomInvoiceEmail(invoiceId, values.email.trim()));
      message.success("Invoice email sent.");
      setEmailOpen(false);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to send email.");
    } finally {
      setSending(false);
    }
  };

  const handleMarkSent = async () => {
    try {
      setInvoice(await markBallroomInvoiceSent(invoiceId));
      message.success("Marked as sent.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to update status.");
    }
  };

  const handleMarkPaid = async () => {
    try {
      setInvoice(await markBallroomInvoicePaid(invoiceId));
      message.success("Marked as paid.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to update status.");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: 320, display: "grid", placeItems: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!invoice) return null;

  return (
    <div className={styles.detailPage}>
      <div className={styles.detailHeader}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/dashboard/ballroom/invoices")}>
          Back
        </Button>
        <Space wrap>
          <Button icon={<CopyOutlined />} onClick={copyPublicUrl} disabled={!invoice.public_url}>
            Copy public link
          </Button>
          <Button icon={<MailOutlined />} onClick={openEmailModal}>
            Send email
          </Button>
          {invoice.status === "draft" ? (
            <Button icon={<SendOutlined />} onClick={handleMarkSent}>
              Mark sent
            </Button>
          ) : null}
          {invoice.status === "sent" ? (
            <Button type="primary" icon={<CheckOutlined />} onClick={handleMarkPaid}>
              Mark paid
            </Button>
          ) : null}
        </Space>
      </div>

      <div className={styles.detailHero}>
        <div>
          <p className={styles.eyebrow}>Ballroom invoice</p>
          <h1>{invoice.invoice_number}</h1>
          <Tag color={STATUS_COLORS[invoice.status]}>{invoice.status_label}</Tag>
        </div>
      </div>

      <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }} className={styles.descriptions}>
          <Descriptions.Item label="Customer">{invoice.booking_name}</Descriptions.Item>
          <Descriptions.Item label="Phone">{invoice.booking_phone || "—"}</Descriptions.Item>
          <Descriptions.Item label="Email">{invoice.booking_email || "—"}</Descriptions.Item>
          <Descriptions.Item label="Event">{invoice.booking_event_type}</Descriptions.Item>
          <Descriptions.Item label="Event date">{invoice.booking_date}</Descriptions.Item>
          <Descriptions.Item label="Time">
            {invoice.booking_start?.slice(0, 5)} – {invoice.booking_end?.slice(0, 5)}
          </Descriptions.Item>
          <Descriptions.Item label="Issue date">{invoice.issue_date}</Descriptions.Item>
          <Descriptions.Item label="Due date">{invoice.due_date}</Descriptions.Item>
          <Descriptions.Item label="Public URL" span={2}>
            {invoice.public_url || "—"}
          </Descriptions.Item>
          {invoice.sent_at ? (
            <Descriptions.Item label="Last sent" span={2}>
              {dayjs(invoice.sent_at).format("YYYY-MM-DD HH:mm")}
              {invoice.sent_to_email ? ` → ${invoice.sent_to_email}` : ""}
            </Descriptions.Item>
          ) : null}
        </Descriptions>

        <Table
          style={{ marginTop: 20 }}
          rowKey="id"
          size="small"
          pagination={false}
          dataSource={invoice.lines}
          columns={[
            { title: "Description", dataIndex: "description" },
            { title: "Qty", dataIndex: "quantity", width: 80 },
            {
              title: "Unit price",
              dataIndex: "unit_price",
              width: 120,
              render: (value) => formatMoney(value),
            },
            {
              title: "Amount",
              dataIndex: "amount",
              width: 120,
              render: (value) => formatMoney(value),
            },
          ]}
        />

        <div style={{ marginTop: 16, textAlign: "right" }}>
          <p>Net: {formatMoney(invoice.net_amount)}</p>
          {Number(invoice.vat_amount) > 0 ? <p>VAT: {formatMoney(invoice.vat_amount)}</p> : null}
          <p style={{ fontSize: 18, fontWeight: 700 }}>Total: {formatMoney(invoice.total_amount)}</p>
        </div>

      <Modal
        title="Send invoice by email"
        open={emailOpen}
        onCancel={() => setEmailOpen(false)}
        onOk={handleSendEmail}
        confirmLoading={sending}
        okText="Send"
      >
        <Form form={emailForm} layout="vertical">
          <Form.Item
            name="email"
            label="Recipient email"
            rules={[{ required: true, type: "email", message: "Valid email required." }]}
          >
            <Input placeholder="customer@example.com" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
