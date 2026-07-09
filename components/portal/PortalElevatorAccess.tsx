"use client";

import { CreditCardOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import {
  fetchPortalElevatorAccess,
  fetchPortalElevatorAccessLogs,
  type PortalElevatorAccessCard,
  type PortalElevatorAccessLog,
} from "@/lib/portalManagement";
import styles from "./Portal.module.css";

const CARD_STATUS_COLORS: Record<PortalElevatorAccessCard["status"], string> = {
  active: "green",
  revoked: "red",
  expired: "default",
};

const LOG_RESULT_COLORS: Record<PortalElevatorAccessLog["result"], string> = {
  granted: "green",
  denied: "red",
};

export default function PortalElevatorAccessPanel() {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<PortalElevatorAccessCard[]>([]);
  const [logs, setLogs] = useState<PortalElevatorAccessLog[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cardList, logList] = await Promise.all([fetchPortalElevatorAccess(), fetchPortalElevatorAccessLogs()]);
      setCards(cardList);
      setLogs(logList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const logColumns: ColumnsType<PortalElevatorAccessLog> = [
    { title: "Карт", dataIndex: "holder_name" },
    { title: "Давхар", dataIndex: "floor_number", width: 90 },
    {
      title: "Үр дүн",
      dataIndex: "result",
      width: 120,
      render: (result: PortalElevatorAccessLog["result"], row) => (
        <Tag color={LOG_RESULT_COLORS[result]}>{row.result_label}</Tag>
      ),
    },
    {
      title: "Огноо",
      dataIndex: "accessed_at",
      render: (value) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderMain}>
          <span className={styles.eyebrow}>Лифтийн эрх</span>
          <h1>Лифтийн NFC карт</h1>
          <p className={styles.pageSubtitle}>Танай байгууллагын лифтийн хандалтын картууд болон сүүлийн ашиглалт.</p>
        </div>
        <Button icon={<ReloadOutlined />} onClick={load}>
          Шинэчлэх
        </Button>
      </div>

      {cards.length ? (
        <div className={styles.elevatorGrid}>
          {cards.map((card) => (
            <Card key={card.id} bordered className={styles.elevatorCard}>
              <div className={styles.elevatorCardHeader}>
                <div>
                  <CreditCardOutlined style={{ marginRight: 8 }} />
                  <h3 className={styles.elevatorCardTitle}>{card.holder_name}</h3>
                </div>
                <Tag color={CARD_STATUS_COLORS[card.status]}>{card.status_label}</Tag>
              </div>
              <div className={styles.elevatorCardMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Карт UID</span>
                  <span className={styles.metaValue}>{card.card_uid_masked}</span>
                </div>
                {card.department ? (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Хэлтэс</span>
                    <span className={styles.metaValue}>{card.department}</span>
                  </div>
                ) : null}
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Зөвшөөрсөн давхар</span>
                  <span className={styles.metaValue}>{card.allowed_floors}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Хүчинтэй хугацаа</span>
                  <span className={styles.metaValue}>
                    {card.valid_from || "—"} – {card.valid_until || "—"}
                  </span>
                </div>
                {card.last_used_at ? (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Сүүлд ашигласан</span>
                    <span className={styles.metaValue}>
                      {dayjs(card.last_used_at).format("YYYY-MM-DD HH:mm")}
                      {card.last_used_floor != null ? ` · ${card.last_used_floor}F` : ""}
                    </span>
                  </div>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h3>Лифтийн карт олдсонгүй</h3>
          <p>Танай байгууллагад холбогдсон NFC карт одоогоор бүртгэгдээгүй байна.</p>
        </div>
      )}

      <div className={styles.pageHeader} style={{ marginTop: 8 }}>
        <div className={styles.pageHeaderMain}>
          <h2 style={{ margin: 0, fontSize: 20 }}>Сүүлийн ашиглалт</h2>
        </div>
      </div>

      <Card bordered className={styles.contentCard}>
        <Table
          rowKey="id"
          size="small"
          columns={logColumns}
          dataSource={logs}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "Ашиглалтын түүх байхгүй." }}
        />
      </Card>
    </Spin>
  );
}
