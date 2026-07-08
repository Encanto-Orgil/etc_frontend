"use client";

import {
  ArrowLeftOutlined,
  CheckOutlined,
  CloseOutlined,
  CopyOutlined,
  MailOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Button, Descriptions, Form, Input, message, Modal, Space, Spin, Table, Tag } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  fetchDashboardBallroomQuote,
  markBallroomQuoteAccepted,
  markBallroomQuoteDeclined,
  markBallroomQuoteSent,
  sendBallroomQuoteEmail,
  type BallroomQuoteStatus,
  type DashboardBallroomQuote,
} from "@/lib/ballroomManagement";
import styles from "./PropertyManagement.module.css";

const STATUS_COLORS: Record<BallroomQuoteStatus, string> = {
  draft: "default",
  sent: "blue",
  accepted: "green",
  declined: "red",
  cancelled: "default",
};

function formatMoney(value: string | number) {
  return `${Number(value || 0).toLocaleString()} ₮`;
}

export default function BallroomQuoteDetail({ quoteId }: { quoteId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [quote, setQuote] = useState<DashboardBallroomQuote | null>(null);
  const [emailForm] = Form.useForm<{ email: string }>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setQuote(await fetchDashboardBallroomQuote(quoteId));
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Quote failed to load.");
    } finally {
      setLoading(false);
    }
  }, [quoteId]);

  useEffect(() => {
    load();
  }, [load]);

  const copyPublicUrl = async () => {
    if (!quote?.public_url) return;
    await navigator.clipboard.writeText(quote.public_url);
    message.success("Public link copied.");
  };

  const openEmailModal = () => {
    emailForm.setFieldsValue({ email: quote?.customer_email || quote?.sent_to_email || "" });
    setEmailOpen(true);
  };

  const handleSendEmail = async () => {
    const values = await emailForm.validateFields();
    setSending(true);
    try {
      setQuote(await sendBallroomQuoteEmail(quoteId, values.email.trim()));
      message.success("Quote email sent.");
      setEmailOpen(false);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to send email.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: 320, display: "grid", placeItems: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!quote) return null;

  return (
    <div className={styles.detailPage}>
      <div className={styles.detailHeader}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/dashboard/ballroom/quotes")}>
          Back
        </Button>
        <Space wrap>
          <Button icon={<CopyOutlined />} onClick={copyPublicUrl} disabled={!quote.public_url}>
            Copy public link
          </Button>
          <Button icon={<MailOutlined />} onClick={openEmailModal}>
            Send email
          </Button>
          {quote.status === "draft" ? (
            <Button icon={<SendOutlined />} onClick={() => markBallroomQuoteSent(quoteId).then(load)}>
              Mark sent
            </Button>
          ) : null}
          {quote.status === "sent" ? (
            <>
              <Button type="primary" icon={<CheckOutlined />} onClick={() => markBallroomQuoteAccepted(quoteId).then(load)}>
                Accept
              </Button>
              <Button danger icon={<CloseOutlined />} onClick={() => markBallroomQuoteDeclined(quoteId).then(load)}>
                Decline
              </Button>
            </>
          ) : null}
        </Space>
      </div>

      <div className={styles.detailHero}>
        <div>
          <p className={styles.eyebrow}>Ballroom quote</p>
          <h1>{quote.quote_number}</h1>
          <Tag color={STATUS_COLORS[quote.status]}>{quote.status_label}</Tag>
        </div>
      </div>

      <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }} className={styles.descriptions}>
          <Descriptions.Item label="Customer">{quote.customer_name}</Descriptions.Item>
          <Descriptions.Item label="Phone">{quote.customer_phone || "—"}</Descriptions.Item>
          <Descriptions.Item label="Email">{quote.customer_email || "—"}</Descriptions.Item>
          <Descriptions.Item label="Event">{quote.event_type_label || "—"}</Descriptions.Item>
          <Descriptions.Item label="Event date">{quote.event_date || "—"}</Descriptions.Item>
          <Descriptions.Item label="Guests">{quote.guest_count ?? "—"}</Descriptions.Item>
          <Descriptions.Item label="Issue date">{quote.issue_date}</Descriptions.Item>
          <Descriptions.Item label="Valid until">{quote.valid_until}</Descriptions.Item>
          <Descriptions.Item label="Public URL" span={2}>
            {quote.public_url || "—"}
          </Descriptions.Item>
          {quote.sent_at ? (
            <Descriptions.Item label="Last sent" span={2}>
              {dayjs(quote.sent_at).format("YYYY-MM-DD HH:mm")}
              {quote.sent_to_email ? ` → ${quote.sent_to_email}` : ""}
            </Descriptions.Item>
          ) : null}
        </Descriptions>

        <Table
          style={{ marginTop: 20 }}
          rowKey="id"
          size="small"
          pagination={false}
          dataSource={quote.lines}
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
          <p>Net: {formatMoney(quote.net_amount)}</p>
          {Number(quote.vat_amount) > 0 ? <p>VAT: {formatMoney(quote.vat_amount)}</p> : null}
          <p style={{ fontSize: 18, fontWeight: 700 }}>Total: {formatMoney(quote.total_amount)}</p>
        </div>

      <Modal
        title="Send quote by email"
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
