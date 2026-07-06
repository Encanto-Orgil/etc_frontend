"use client";

import { MessageOutlined } from "@ant-design/icons";
import { Button, Card, List, Tag } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchSupportTicketSummary, TICKET_STATUS_COLORS, TICKET_STATUS_LABELS } from "@/lib/supportManagement";
import type { SupportTicketSummary } from "@/lib/supportManagement";
import styles from "./DashboardOverview.module.css";

export default function SupportTicketsCard() {
  const [data, setData] = useState<SupportTicketSummary | null>(null);

  useEffect(() => {
    fetchSupportTicketSummary()
      .then(setData)
      .catch(() => setData(null));
  }, []);

  return (
    <Card
      bordered
      className={styles.sideCard}
      title={
        <span>
          <MessageOutlined /> Support tickets
        </span>
      }
      extra={
        <Link href="/dashboard/support">
          <Button size="small" type="link">
            View all
          </Button>
        </Link>
      }
      styles={{ body: { padding: 16 } }}
    >
      {data ? (
        <>
          <div className={styles.ticketStats}>
            <div>
              <strong>{data.summary.open}</strong>
              <span>Open</span>
            </div>
            <div>
              <strong>{data.summary.in_progress}</strong>
              <span>In progress</span>
            </div>
            <div>
              <strong>{data.summary.urgent}</strong>
              <span>Urgent</span>
            </div>
          </div>
          <List
            size="small"
            dataSource={data.recent.slice(0, 5)}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.subject}
                  description={`${item.tenant_company || item.tenant_name} · ${dayjs(item.created_at).format("MMM D")}`}
                />
                <Tag color={TICKET_STATUS_COLORS[item.status]}>{TICKET_STATUS_LABELS[item.status]}</Tag>
              </List.Item>
            )}
          />
        </>
      ) : (
        <p className={styles.mutedText}>No support tickets yet.</p>
      )}
    </Card>
  );
}
