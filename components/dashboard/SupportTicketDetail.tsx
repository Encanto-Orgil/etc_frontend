"use client";

import { ArrowLeftOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Form, Input, Select, Spin, Tag, message } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  createSupportTicketMessage,
  fetchSupportTicket,
  TICKET_CATEGORY_LABELS,
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_COLORS,
  TICKET_STATUS_LABELS,
  updateSupportTicket,
  type SupportTicket,
  type SupportTicketPriority,
  type SupportTicketStatus,
} from "@/lib/supportManagement";
import styles from "./PropertyManagement.module.css";

export default function SupportTicketDetail({ ticketId }: { ticketId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [replyForm] = Form.useForm<{ body: string }>();
  const [metaForm] = Form.useForm<{
    status: SupportTicketStatus;
    priority: SupportTicketPriority;
    staff_notes: string;
  }>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSupportTicket(ticketId);
      setTicket(data);
      metaForm.setFieldsValue({
        status: data.status,
        priority: data.priority,
        staff_notes: data.staff_notes || "",
      });
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Хүсэлт ачааллахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  }, [metaForm, ticketId]);

  useEffect(() => {
    load();
  }, [load]);

  const saveMeta = async () => {
    const values = await metaForm.validateFields();
    setSaving(true);
    try {
      const updated = await updateSupportTicket(ticketId, values);
      setTicket(updated);
      message.success("Хүсэлт шинэчлэгдлээ.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Хадгалахад алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  const sendReply = async () => {
    const values = await replyForm.validateFields();
    setSending(true);
    try {
      await createSupportTicketMessage(ticketId, values.body.trim());
      replyForm.resetFields();
      await load();
      message.success("Хариулт илгээгдлээ.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Илгээхэд алдаа гарлаа.");
    } finally {
      setSending(false);
    }
  };

  const messages = ticket?.messages ?? [];

  return (
    <div className={styles.shell}>
      <div className={styles.workspace}>
        <Spin spinning={loading}>
          {ticket ? (
            <>
              <div className={styles.detailHeader}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/dashboard/support")}>
                  Support tickets
                </Button>
                <div>
                  <h1>{ticket.subject}</h1>
                  <p>
                    #{ticket.id} · {ticket.tenant_company || ticket.tenant_name} ·{" "}
                    {dayjs(ticket.created_at).format("YYYY-MM-DD HH:mm")}
                  </p>
                </div>
                <Tag color={TICKET_STATUS_COLORS[ticket.status]}>{TICKET_STATUS_LABELS[ticket.status]}</Tag>
              </div>

              <div className={styles.ticketDetailLayout}>
                <section>
                  <Card className={styles.detailCard} title="Харилцаа">
                    <div className={styles.ticketThreadList}>
                      <div className={styles.ticketMessage}>
                        <div className={styles.ticketMessageHeader}>
                          <span className={styles.ticketMessageAuthor}>
                            {ticket.created_by_name || ticket.tenant_company || ticket.tenant_name}
                          </span>
                          <span className={styles.ticketMessageTime}>
                            {dayjs(ticket.created_at).format("YYYY-MM-DD HH:mm")}
                          </span>
                        </div>
                        <p className={styles.ticketMessageBody}>{ticket.description}</p>
                        <Tag>Анхны хүсэлт</Tag>
                      </div>

                      {messages.map((item) => (
                        <div
                          key={item.id}
                          className={`${styles.ticketMessage} ${item.is_staff_reply ? styles.ticketMessageStaff : ""}`}
                        >
                          <div className={styles.ticketMessageHeader}>
                            <span className={styles.ticketMessageAuthor}>
                              {item.is_staff_reply ? item.author_name || "Ажилтан" : item.author_name || "Түрээслэгч"}
                            </span>
                            <span className={styles.ticketMessageTime}>
                              {dayjs(item.created_at).format("YYYY-MM-DD HH:mm")}
                            </span>
                          </div>
                          <p className={styles.ticketMessageBody}>{item.body}</p>
                          <Tag color={item.is_staff_reply ? "blue" : "default"}>
                            {item.is_staff_reply ? "Албаны хариулт" : "Түрээслэгч"}
                          </Tag>
                        </div>
                      ))}
                    </div>

                    <div className={styles.ticketReplyBox}>
                      <Form form={replyForm} layout="vertical">
                        <Form.Item
                          name="body"
                          label="Түрээслэгчид хариулах"
                          rules={[{ required: true, message: "Хариултаа бичнэ үү." }]}
                        >
                          <Input.TextArea rows={4} placeholder="Албаны хариултаа бичнэ үү..." />
                        </Form.Item>
                        <Button type="primary" icon={<SendOutlined />} loading={sending} onClick={sendReply}>
                          Хариулт илгээх
                        </Button>
                      </Form>
                    </div>
                  </Card>
                </section>

                <aside className={styles.ticketSidePanel}>
                  <Card className={styles.detailCard} title="Дэлгэрэнгүй">
                    <Descriptions column={1} size="small" className={styles.detailDescriptions}>
                      <Descriptions.Item label="Түрээслэгч">
                        {ticket.tenant_company || ticket.tenant_name}
                      </Descriptions.Item>
                      <Descriptions.Item label="Ангилал">
                        {TICKET_CATEGORY_LABELS[ticket.category] || ticket.category_label}
                      </Descriptions.Item>
                      {ticket.contract_number ? (
                        <Descriptions.Item label="Гэрээ">{ticket.contract_number}</Descriptions.Item>
                      ) : null}
                      {ticket.unit_code ? (
                        <Descriptions.Item label="Талбай">{ticket.unit_code}</Descriptions.Item>
                      ) : null}
                      {ticket.assigned_to_name ? (
                        <Descriptions.Item label="Хариуцагч">{ticket.assigned_to_name}</Descriptions.Item>
                      ) : null}
                      <Descriptions.Item label="Сүүлд шинэчлэгдсэн">
                        {dayjs(ticket.updated_at).format("YYYY-MM-DD HH:mm")}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>

                  <Card className={styles.detailCard} title="Удирдлага">
                    <Form form={metaForm} layout="vertical">
                      <Form.Item name="status" label="Төлөв">
                        <Select
                          options={Object.entries(TICKET_STATUS_LABELS).map(([value, label]) => ({ value, label }))}
                        />
                      </Form.Item>
                      <Form.Item name="priority" label="Чухал байдал">
                        <Select
                          options={Object.entries(TICKET_PRIORITY_LABELS).map(([value, label]) => ({ value, label }))}
                        />
                      </Form.Item>
                      <Form.Item name="staff_notes" label="Дотоод тэмдэглэл">
                        <Input.TextArea rows={3} placeholder="Зөвхөн ажилтнууд харах тэмдэглэл..." />
                      </Form.Item>
                      <Button type="primary" loading={saving} onClick={saveMeta} block>
                        Хадгалах
                      </Button>
                    </Form>
                  </Card>
                </aside>
              </div>
            </>
          ) : null}
        </Spin>
      </div>
    </div>
  );
}
