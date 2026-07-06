"use client";

import { Col, Form, Input, message, Modal, Row, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import {
  createPortalTicket,
  fetchPortalSummary,
  PORTAL_TICKET_CATEGORY_LABELS,
  type PortalSummary,
  type SupportTicketCategory,
} from "@/lib/portalManagement";
import PortalOverview from "@/components/portal/PortalOverview";

export default function TenantPortalDashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<PortalSummary | null>(null);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setSummary(await fetchPortalSummary());
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to load portal.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveTicket = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      await createPortalTicket(values);
      message.success("Support request submitted.");
      setTicketOpen(false);
      form.resetFields();
      load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to submit request.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PortalOverview summary={summary} loading={loading} onNewTicket={() => setTicketOpen(true)} />

      <Modal
        title="New support request"
        open={ticketOpen}
        onCancel={() => setTicketOpen(false)}
        onOk={saveTicket}
        confirmLoading={saving}
        width={640}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={{ priority: "normal", category: "maintenance" }}>
          <Form.Item name="contract" label="Contract (optional)">
            <Select
              allowClear
              options={(summary?.contracts ?? []).map((c) => ({
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
                  options={[
                    { value: "low", label: "Low" },
                    { value: "normal", label: "Normal" },
                    { value: "high", label: "High" },
                    { value: "urgent", label: "Urgent" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Describe the maintenance or service request..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
