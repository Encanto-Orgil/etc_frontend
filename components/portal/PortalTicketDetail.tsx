"use client";

import { ArrowLeftOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Spin, Tag, message } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  createPortalTicketMessage,
  fetchPortalTicket,
  PORTAL_TICKET_CATEGORY_LABELS,
  type SupportTicketCategory,
} from "@/lib/portalManagement";
import {
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_COLORS,
  TICKET_STATUS_LABELS,
  type SupportTicket,
} from "@/lib/supportManagement";
import styles from "./Portal.module.css";

export default function PortalTicketDetail({ ticketId }: { ticketId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [form] = Form.useForm<{ body: string }>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setTicket(await fetchPortalTicket(ticketId));
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Хүсэлт ачааллахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    load();
  }, [load]);

  const sendReply = async () => {
    const values = await form.validateFields();
    setSending(true);
    try {
      await createPortalTicketMessage(ticketId, values.body.trim());
      form.resetFields();
      await load();
      message.success("Хариулт илгээгдлээ.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Илгээхэд алдаа гарлаа.");
    } finally {
      setSending(false);
    }
  };

  const isClosed = ticket?.status === "closed";
  const messages = ticket?.messages ?? [];

  return (
    <Spin spinning={loading}>
      <div className={styles.backButton}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/portal/tickets")}>
          Дэмжлэгийн хүсэлтүүд
        </Button>
      </div>

      {ticket ? (
        <div className={styles.detailLayout}>
          <section>
            <div className={styles.pageHeader}>
              <div className={styles.pageHeaderMain}>
                <span className={styles.eyebrow}>Дэмжлэгийн хүсэлт</span>
                <h1>{ticket.subject}</h1>
                <p className={styles.pageSubtitle}>
                  #{ticket.id} · {dayjs(ticket.created_at).format("YYYY-MM-DD HH:mm")}
                </p>
              </div>
              <Tag color={TICKET_STATUS_COLORS[ticket.status]}>{TICKET_STATUS_LABELS[ticket.status]}</Tag>
            </div>

            <Card bordered className={styles.threadCard} title="Харилцаа">
              <div className={styles.threadList}>
                <div className={`${styles.messageBubble} ${styles.messageBubbleTenant}`}>
                  <div className={styles.messageHeader}>
                    <span className={styles.messageAuthor}>{ticket.created_by_name || "Та"}</span>
                    <span className={styles.messageTime}>{dayjs(ticket.created_at).format("YYYY-MM-DD HH:mm")}</span>
                  </div>
                  <p className={styles.messageBody}>{ticket.description}</p>
                  <Tag>Анхны хүсэлт</Tag>
                </div>

                {messages.map((item) => (
                  <div
                    key={item.id}
                    className={`${styles.messageBubble} ${item.is_staff_reply ? styles.messageBubbleStaff : styles.messageBubbleTenant}`}
                  >
                    <div className={styles.messageHeader}>
                      <span className={styles.messageAuthor}>
                        {item.is_staff_reply ? "Encanto баг" : item.author_name || "Та"}
                      </span>
                      <span className={styles.messageTime}>{dayjs(item.created_at).format("YYYY-MM-DD HH:mm")}</span>
                    </div>
                    <p className={styles.messageBody}>{item.body}</p>
                    {item.is_staff_reply ? <Tag color="blue">Албаны хариулт</Tag> : null}
                  </div>
                ))}
              </div>

              {isClosed ? (
                <div className={styles.closedNotice}>Энэ хүсэлт хаагдсан тул шинэ хариулт илгээх боломжгүй.</div>
              ) : (
                <div className={styles.replyBox}>
                  <Form form={form} layout="vertical">
                    <Form.Item
                      name="body"
                      label="Хариулт бичих"
                      rules={[{ required: true, message: "Хариултаа бичнэ үү." }]}
                    >
                      <Input.TextArea rows={4} placeholder="Асуулт, нэмэлт мэдээлэл эсвэл хариултаа бичнэ үү..." />
                    </Form.Item>
                    <Button type="primary" icon={<SendOutlined />} loading={sending} onClick={sendReply}>
                      Илгээх
                    </Button>
                  </Form>
                </div>
              )}
            </Card>
          </section>

          <aside>
            <Card bordered className={styles.metaCard} title="Дэлгэрэнгүй">
              <div className={styles.metaList}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Ангилал</span>
                  <span className={styles.metaValue}>
                    {PORTAL_TICKET_CATEGORY_LABELS[ticket.category as SupportTicketCategory] || ticket.category_label}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Чухал байдал</span>
                  <span className={styles.metaValue}>{TICKET_PRIORITY_LABELS[ticket.priority]}</span>
                </div>
                {ticket.contract_number ? (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Гэрээ</span>
                    <span className={styles.metaValue}>{ticket.contract_number}</span>
                  </div>
                ) : null}
                {ticket.unit_code ? (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Талбай</span>
                    <span className={styles.metaValue}>{ticket.unit_code}</span>
                  </div>
                ) : null}
                {ticket.assigned_to_name ? (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Хариуцагч</span>
                    <span className={styles.metaValue}>{ticket.assigned_to_name}</span>
                  </div>
                ) : null}
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Сүүлд шинэчлэгдсэн</span>
                  <span className={styles.metaValue}>{dayjs(ticket.updated_at).format("YYYY-MM-DD HH:mm")}</span>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      ) : null}
    </Spin>
  );
}
