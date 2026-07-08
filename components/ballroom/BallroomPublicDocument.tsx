"use client";

import { Button, Card, Descriptions, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { PublicBallroomDocument } from "@/lib/ballroomManagement";
import styles from "./BallroomPublicDocument.module.css";

function formatMoney(value: string | number) {
  return `${Number(value || 0).toLocaleString()} ₮`;
}

type Props = {
  document: PublicBallroomDocument;
  showQuoteActions?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  actionLoading?: boolean;
};

export default function BallroomPublicDocument({
  document,
  showQuoteActions = false,
  onAccept,
  onDecline,
  actionLoading = false,
}: Props) {
  const isInvoice = document.document_type === "invoice";
  const number = isInvoice ? document.invoice_number : document.quote_number;
  const profile = document.billing_profile;

  const columns: ColumnsType<(typeof document.lines)[number]> = [
    { title: "Үйлчилгээ", dataIndex: "description" },
    { title: "Тоо", dataIndex: "quantity", width: 80, align: "right" },
    {
      title: "Үнэ",
      dataIndex: "unit_price",
      width: 120,
      align: "right",
      render: (value) => formatMoney(value),
    },
    {
      title: "Дүн",
      dataIndex: "amount",
      width: 120,
      align: "right",
      render: (value) => formatMoney(value),
    },
  ];

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{profile.company_name || "Encanto Trade Center"}</p>
            <h1>{isInvoice ? "Нэхэмжлэх" : "Үнийн санал"}</h1>
            <p className={styles.number}>{number}</p>
          </div>
          <Tag>{document.status_label}</Tag>
        </div>

        <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }} className={styles.meta}>
          <Descriptions.Item label="Харилцагч">{document.customer_name}</Descriptions.Item>
          {document.customer_phone ? (
            <Descriptions.Item label="Утас">{document.customer_phone}</Descriptions.Item>
          ) : null}
          {document.customer_email ? (
            <Descriptions.Item label="И-мэйл">{document.customer_email}</Descriptions.Item>
          ) : null}
          {document.event_type_label ? (
            <Descriptions.Item label="Арга хэмжээ">{document.event_type_label}</Descriptions.Item>
          ) : null}
          {document.event_date ? (
            <Descriptions.Item label="Огноо">{document.event_date}</Descriptions.Item>
          ) : null}
          {document.event_start && document.event_end ? (
            <Descriptions.Item label="Цаг">
              {document.event_start.slice(0, 5)} – {document.event_end.slice(0, 5)}
            </Descriptions.Item>
          ) : null}
          <Descriptions.Item label="Гаргасан">{document.issue_date}</Descriptions.Item>
          {isInvoice && document.due_date ? (
            <Descriptions.Item label="Төлөх хугацаа">{document.due_date}</Descriptions.Item>
          ) : null}
          {!isInvoice && document.valid_until ? (
            <Descriptions.Item label="Хүчинтэй хүртэл">{document.valid_until}</Descriptions.Item>
          ) : null}
        </Descriptions>

        <Table
          className={styles.table}
          rowKey={(row, index) => `${row.description}-${index}`}
          columns={columns}
          dataSource={document.lines}
          pagination={false}
          size="small"
        />

        <div className={styles.totals}>
          {Number(document.discount_amount) > 0 ? (
            <p>Хөнгөлөлт: {formatMoney(document.discount_amount)}</p>
          ) : null}
          <p>Цэвэр дүн: {formatMoney(document.net_amount)}</p>
          {Number(document.vat_amount) > 0 ? <p>НӨАТ: {formatMoney(document.vat_amount)}</p> : null}
          <p className={styles.grandTotal}>Нийт: {formatMoney(document.total_amount)}</p>
        </div>

        {(profile.bank_name || profile.bank_account_number) && (
          <div className={styles.bankBlock}>
            <h3>Төлбөрийн мэдээлэл</h3>
            {profile.bank_name ? <p>{profile.bank_name}</p> : null}
            {profile.bank_account_number ? <p>Данс: {profile.bank_account_number}</p> : null}
            {profile.bank_account_name ? <p>{profile.bank_account_name}</p> : null}
            {profile.payment_notes ? <p>{profile.payment_notes}</p> : null}
          </div>
        )}

        {document.notes ? (
          <div className={styles.notes}>
            <h3>Тэмдэглэл</h3>
            <p>{document.notes}</p>
          </div>
        ) : null}

        {showQuoteActions && document.status === "sent" ? (
          <Space className={styles.actions}>
            <Button type="primary" loading={actionLoading} onClick={onAccept}>
              Зөвшөөрөх
            </Button>
            <Button danger loading={actionLoading} onClick={onDecline}>
              Татгалзах
            </Button>
          </Space>
        ) : null}
      </Card>
    </div>
  );
}
