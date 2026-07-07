"use client";

import { ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Input, message, Select, Space, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import {
  fetchInquiries,
  INQUIRY_INTEREST_LABELS,
  updateInquiry,
  type Inquiry,
} from "@/lib/inquiryManagement";
import styles from "./PropertyManagement.module.css";

export default function Inquiries() {
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [interestFilter, setInterestFilter] = useState("all");

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

  const markHandled = async (id: number, isHandled: boolean) => {
    try {
      await updateInquiry(id, { is_handled: isHandled });
      message.success(isHandled ? "Marked as handled." : "Marked as pending.");
      load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Update failed.");
    }
  };

  const columns: ColumnsType<Inquiry> = [
    {
      title: "Contact",
      key: "contact",
      render: (_, record) => (
        <div>
          <strong>{record.name}</strong>
          <div className={styles.muted}>{record.phone}</div>
          {record.email ? <div className={styles.muted}>{record.email}</div> : null}
        </div>
      ),
    },
    {
      title: "Interest",
      dataIndex: "interest_label",
      render: (label: string, record) => (
        <Tag>{label || INQUIRY_INTEREST_LABELS[record.interest]}</Tag>
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      render: (value: string) => (
        <span className={styles.muted}>{value || "—"}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_handled",
      render: (isHandled: boolean) => (
        <Tag color={isHandled ? "default" : "gold"}>
          {isHandled ? "Handled" : "Pending"}
        </Tag>
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
          onChange={(value) => markHandled(record.id, value === "handled")}
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
    </Card>
  );
}
