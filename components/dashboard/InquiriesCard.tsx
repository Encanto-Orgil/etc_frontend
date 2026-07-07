"use client";

import { FormOutlined } from "@ant-design/icons";
import { Button, Card, List, Tag } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchInquirySummary, type InquirySummary } from "@/lib/inquiryManagement";
import styles from "./DashboardOverview.module.css";

export default function InquiriesCard() {
  const [data, setData] = useState<InquirySummary | null>(null);

  useEffect(() => {
    fetchInquirySummary()
      .then(setData)
      .catch(() => setData(null));
  }, []);

  return (
    <Card
      bordered
      className={styles.sideCard}
      title={
        <span>
          <FormOutlined /> Inquiries
        </span>
      }
      extra={
        <Link href="/dashboard/inquiries">
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
              <strong>{data.summary.pending}</strong>
              <span>Pending</span>
            </div>
            <div>
              <strong>{data.summary.handled}</strong>
              <span>Handled</span>
            </div>
            <div>
              <strong>{data.summary.total}</strong>
              <span>Total</span>
            </div>
          </div>
          <List
            size="small"
            dataSource={data.recent.slice(0, 5)}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.name}
                  description={`${item.interest_label} · ${item.phone} · ${dayjs(item.created_at).format("MMM D")}`}
                />
                <Tag color={item.is_handled ? "default" : "gold"}>
                  {item.is_handled ? "Handled" : "Pending"}
                </Tag>
              </List.Item>
            )}
          />
        </>
      ) : (
        <p className={styles.mutedText}>No inquiries yet.</p>
      )}
    </Card>
  );
}
