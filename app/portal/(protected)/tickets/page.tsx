"use client";

import { FilterOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Modal, Row, Col, Select, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
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
import styles from "@/components/dashboard/DashboardOverview.module.css";

export default function PortalTicketsPage() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [contracts, setContracts] = useState<LeaseContract[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
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

  const columns: ColumnsType<SupportTicket> = [
    { title: "Subject", dataIndex: "subject" },
    { title: "Category", dataIndex: "category_label" },
    { title: "Priority", dataIndex: "priority_label" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: SupportTicket["status"]) => (
        <Tag color={TICKET_STATUS_COLORS[status]}>{TICKET_STATUS_LABELS[status]}</Tag>
      ),
    },
    { title: "Created", dataIndex: "created_at", render: (v) => dayjs(v).format("YYYY-MM-DD HH:mm") },
  ];

  const save = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      await createPortalTicket(values);
      message.success("Request submitted.");
      setOpen(false);
      form.resetFields();
      load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to submit.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.projectsSection}>
        <div className={styles.projectToolbar}>
          <Input
            className={styles.projectSearch}
            prefix={<SearchOutlined />}
            placeholder="Search requests..."
            variant="borderless"
          />
          <Button className={styles.iconButton} aria-label="Filter" icon={<FilterOutlined />} />
          <Button className={styles.addButton} icon={<PlusOutlined />} onClick={() => setOpen(true)}>
            New request
          </Button>
          <Button className={styles.iconButton} icon={<ReloadOutlined />} onClick={load} />
        </div>

        <h2 className={styles.sectionTitle}>Support requests</h2>
        <Spin spinning={loading}>
          <Card bordered className={styles.sideCard} styles={{ body: { padding: 0 } }}>
            <Table rowKey="id" columns={columns} dataSource={tickets} pagination={{ pageSize: 20 }} />
          </Card>
        </Spin>
      </section>

      <Modal title="New support request" open={open} onCancel={() => setOpen(false)} onOk={save} confirmLoading={saving} width={640} destroyOnClose>
        <Form form={form} layout="vertical" initialValues={{ priority: "normal", category: "maintenance" }}>
          <Form.Item name="contract" label="Contract">
            <Select
              allowClear
              options={contracts.map((c) => ({
                value: c.id,
                label: `${c.contract_number} · ${c.unit_code}`,
              }))}
            />
          </Form.Item>
          <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Select
                  options={(Object.keys(PORTAL_TICKET_CATEGORY_LABELS) as SupportTicketCategory[]).map((value) => ({
                    value,
                    label: PORTAL_TICKET_CATEGORY_LABELS[value],
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="Priority">
                <Select
                  options={Object.entries(TICKET_PRIORITY_LABELS).map(([value, label]) => ({ value, label }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}
