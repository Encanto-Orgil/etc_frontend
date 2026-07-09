"use client";

import { MessageOutlined } from "@ant-design/icons";
import { Button, Card, List, Tag } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TICKET_STATUS_COLORS,
  TICKET_STATUS_LABELS,
  type SupportTicket,
} from "@/lib/supportManagement";
import portalStyles from "./Portal.module.css";
import styles from "../dashboard/DashboardOverview.module.css";

export default function PortalTicketsCard({ tickets }: { tickets: SupportTicket[] }) {
  const router = useRouter();

  return (
    <Card
      bordered
      className={styles.sideCard}
      title={
        <span>
          <MessageOutlined /> Дэмжлэгийн хүсэлтүүд
        </span>
      }
      extra={
        <Link href="/portal/tickets">
          <Button size="small" type="link">
            Бүгдийг харах
          </Button>
        </Link>
      }
      styles={{ body: { padding: 16 } }}
    >
      {tickets.length ? (
        <List
          size="small"
          dataSource={tickets.slice(0, 5)}
          renderItem={(item) => (
            <List.Item
              className={portalStyles.clickableRow}
              style={{ cursor: "pointer" }}
              onClick={() => router.push(`/portal/tickets/${item.id}`)}
            >
              <List.Item.Meta
                title={item.subject}
                description={dayjs(item.created_at).format("MMM D, YYYY")}
              />
              <Tag color={TICKET_STATUS_COLORS[item.status]}>{TICKET_STATUS_LABELS[item.status]}</Tag>
            </List.Item>
          )}
        />
      ) : (
        <p className={styles.mutedText}>Одоогоор хүсэлт байхгүй.</p>
      )}
    </Card>
  );
}
