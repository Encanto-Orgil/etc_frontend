"use client";

import { ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Input,
  Modal,
  message,
  Select,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import {
  fetchInquiries,
  INQUIRY_INTEREST_LABELS,
  updateInquiry,
  type Inquiry,
} from "@/lib/inquiryManagement";
import {
  formatLeasingDetails,
  inquiryContactSubtitle,
  inquiryContactTitle,
} from "@/lib/inquiryDisplay";
import styles from "./PropertyManagement.module.css";

export default function Inquiries() {
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [interestFilter, setInterestFilter] = useState("all");
  const [handleModalOpen, setHandleModalOpen] = useState(false);
  const [handlingId, setHandlingId] = useState<number | null>(null);
  const [memo, setMemo] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setInquiries(
        await fetchInquiries({
          search: search || undefined,
          status: statusFilter === "all" ? undefined : statusFilter,
          interest: interestFilter === "all" ? undefined : interestFilter,
        }),
      );
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to load inquiries.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, interestFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const openHandleModal = (id: number) => {
    setHandlingId(id);
    setMemo("");
    setHandleModalOpen(true);
  };

  const confirmHandled = async () => {
    if (handlingId == null) return;
    const trimmed = memo.trim();
    if (!trimmed) {
      message.error("Handled болгохдоо memo бичнэ үү.");
      return;
    }
    setSaving(true);
    try {
      await updateInquiry(handlingId, { is_handled: true, handled_memo: trimmed });
      message.success("Marked as handled.");
      setHandleModalOpen(false);
      setHandlingId(null);
      setMemo("");
      load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const markPending = async (id: number) => {
    try {
      await updateInquiry(id, { is_handled: false });
      message.success("Marked as pending.");
      load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Update failed.");
    }
  };

  const columns: ColumnsType<Inquiry> = [
    {
      title: "Contact",
      key: "contact",
      render: (_, record) => {
        const subtitle = inquiryContactSubtitle(record);
        const leasingSummary = formatLeasingDetails(record.leasing_details);

        return (
          <div>
            <strong>{inquiryContactTitle(record)}</strong>
            {subtitle ? <div className={styles.muted}>{subtitle}</div> : null}
            <div className={styles.muted}>{record.phone}</div>
            {record.email ? <div className={styles.muted}>{record.email}</div> : null}
            {leasingSummary ? <div className={styles.muted}>{leasingSummary}</div> : null}
          </div>
        );
      },
    },
    {
      title: "Interest",
      dataIndex: "interest_label",
      render: (label: string, record) => (
        <Space direction="vertical" size={4}>
          <Tag color={record.is_office_leasing ? "gold" : undefined}>
            {record.is_office_leasing ? "Office Leasing" : label || INQUIRY_INTEREST_LABELS[record.interest]}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Notes",
      dataIndex: "message",
      render: (value: string, record) => {
        const leasingSummary = formatLeasingDetails(record.leasing_details);
        if (record.is_office_leasing) {
          return (
            <span className={styles.muted}>
              {value?.trim() || leasingSummary || "—"}
            </span>
          );
        }
        return <span className={styles.muted}>{value || "—"}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "is_handled",
      render: (isHandled: boolean, record) => (
        <Space direction="vertical" size={4}>
          <Tag color={isHandled ? "default" : "gold"}>
            {isHandled ? "Handled" : "Pending"}
          </Tag>
          {isHandled && record.handled_by_name ? (
            <span className={styles.muted}>
              {record.handled_by_name}
              {record.handled_at
                ? ` · ${dayjs(record.handled_at).format("YYYY-MM-DD HH:mm")}`
                : ""}
            </span>
          ) : null}
          {isHandled && record.handled_memo ? (
            <span className={styles.muted}>{record.handled_memo}</span>
          ) : null}
        </Space>
      ),
    },
    {
      title: "Submitted",
      dataIndex: "created_at",
      render: (value) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Select
          size="small"
          value={record.is_handled ? "handled" : "pending"}
          style={{ minWidth: 120 }}
          onChange={(value) => {
            if (value === "handled") openHandleModal(record.id);
            else markPending(record.id);
          }}
          options={[
            { value: "pending", label: "Pending" },
            { value: "handled", label: "Handled" },
          ]}
        />
      ),
    },
  ];

  return (
    <Card bordered className={styles.pageCard}>
      <Space wrap style={{ marginBottom: 16 }}>
        <Input.Search
          allowClear
          placeholder="Search name, phone, email, message"
          style={{ width: 280 }}
          onSearch={setSearch}
        />
        <Select
          value={statusFilter}
          style={{ width: 140 }}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All statuses" },
            { value: "pending", label: "Pending" },
            { value: "handled", label: "Handled" },
          ]}
        />
        <Select
          value={interestFilter}
          style={{ width: 140 }}
          onChange={setInterestFilter}
          options={[
            { value: "all", label: "All interests" },
            ...Object.entries(INQUIRY_INTEREST_LABELS).map(([value, label]) => ({ value, label })),
          ]}
        />
        <Button icon={<ReloadOutlined />} onClick={load}>
          Refresh
        </Button>
      </Space>

      <Spin spinning={loading}>
        <Table rowKey="id" columns={columns} dataSource={inquiries} pagination={{ pageSize: 20 }} />
      </Spin>

      <Modal
        title="Mark as handled"
        open={handleModalOpen}
        onCancel={() => {
          setHandleModalOpen(false);
          setHandlingId(null);
          setMemo("");
        }}
        onOk={confirmHandled}
        confirmLoading={saving}
        okText="Save"
      >
        <p className={styles.muted} style={{ marginBottom: 8 }}>
          Ямар мэдээлэл өгсөн / юу хийснээ memo-д бичнэ үү.
        </p>
        <Input.TextArea
          rows={4}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="Жишээ: Утсаар холбогдож office tour товлов. 2026-10-01 14:00."
        />
      </Modal>
    </Card>
  );
}
