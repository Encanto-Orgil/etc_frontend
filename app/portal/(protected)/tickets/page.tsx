"use client";

import { FilterOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Modal, Row, Col, Select, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createPortalTicket,
  fetchPortalContracts,
  fetchPortalTickets,
  PORTAL_TICKET_CATEGORY_LABELS,
  type SupportTicketCategory,
} from "@/lib/portalManagement";
import type { LeaseContract } from "@/lib/propertyManagement";
import {
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_COLORS,
  TICKET_STATUS_LABELS,
  type SupportTicket,
} from "@/lib/supportManagement";
import portalStyles from "@/components/portal/Portal.module.css";
import styles from "@/components/dashboard/DashboardOverview.module.css";

export default function PortalTicketsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [contracts, setContracts] = useState<LeaseContract[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ticketList, contractList] = await Promise.all([fetchPortalTickets(), fetchPortalContracts()]);
      setTickets(ticketList);
      setContracts(contractList);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return tickets;
    return tickets.filter(
      (item) =>
        item.subject.toLowerCase().includes(query) ||
        item.category_label.toLowerCase().includes(query) ||
        item.status_label.toLowerCase().includes(query),
    );
  }, [tickets, search]);

  const columns: ColumnsType<SupportTicket> = [
    { title: "Гарчиг", dataIndex: "subject" },
    { title: "Ангилал", dataIndex: "category_label" },
    { title: "Чухал байдал", dataIndex: "priority_label" },
    {
      title: "Төлөв",
      dataIndex: "status",
      render: (status: SupportTicket["status"]) => (
        <Tag color={TICKET_STATUS_COLORS[status]}>{TICKET_STATUS_LABELS[status]}</Tag>
      ),
    },
    { title: "Үүссэн", dataIndex: "created_at", render: (v) => dayjs(v).format("YYYY-MM-DD HH:mm") },
  ];

  const save = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const ticket = await createPortalTicket(values);
      message.success("Хүсэлт илгээгдлээ.");
      setOpen(false);
      form.resetFields();
      router.push(`/portal/tickets/${ticket.id}`);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to submit.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.projectsSection}>
        <div className={portalStyles.pageHeader}>
          <div className={portalStyles.pageHeaderMain}>
            <span className={portalStyles.eyebrow}>Дэмжлэг</span>
            <h1>Дэмжлэгийн хүсэлтүүд</h1>
            <p className={portalStyles.pageSubtitle}>Хүсэлтийн дэлгэрэнгүй рүү орж асуулт-хариулт илгээнэ үү.</p>
          </div>
        </div>

        <div className={portalStyles.toolbar}>
          <Input
            className={portalStyles.searchInput}
            prefix={<SearchOutlined />}
            placeholder="Хүсэлт хайх..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            allowClear
          />
          <Button className={styles.iconButton} aria-label="Filter" icon={<FilterOutlined />} />
          <Button className={styles.addButton} icon={<PlusOutlined />} onClick={() => setOpen(true)}>
            Шинэ хүсэлт
          </Button>
          <Button className={styles.iconButton} icon={<ReloadOutlined />} onClick={load} />
        </div>

        <Spin spinning={loading}>
          <Card bordered className={portalStyles.contentCard}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={filtered}
              pagination={{ pageSize: 20 }}
              rowClassName={portalStyles.clickableRow}
              onRow={(record) => ({
                onClick: () => router.push(`/portal/tickets/${record.id}`),
              })}
            />
          </Card>
        </Spin>
      </section>

      <Modal title="Шинэ дэмжлэгийн хүсэлт" open={open} onCancel={() => setOpen(false)} onOk={save} confirmLoading={saving} width={640} destroyOnClose>
        <Form form={form} layout="vertical" initialValues={{ priority: "normal", category: "maintenance" }}>
          <Form.Item name="contract" label="Гэрээ">
            <Select
              allowClear
              options={contracts.map((c) => ({
                value: c.id,
                label: `${c.contract_number} · ${c.unit_code}`,
              }))}
            />
          </Form.Item>
          <Form.Item name="subject" label="Гарчиг" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="category" label="Ангилал" rules={[{ required: true }]}>
                <Select
                  options={(Object.keys(PORTAL_TICKET_CATEGORY_LABELS) as SupportTicketCategory[]).map((value) => ({
                    value,
                    label: PORTAL_TICKET_CATEGORY_LABELS[value],
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="Чухал байдал">
                <Select
                  options={Object.entries(TICKET_PRIORITY_LABELS).map(([value, label]) => ({ value, label }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Тайлбар" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}
