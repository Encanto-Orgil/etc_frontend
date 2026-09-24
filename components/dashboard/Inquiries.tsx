"use client";

import { ReloadOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Descriptions,
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
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchInquiries,
  INQUIRY_INTEREST_LABELS,
  updateInquiry,
  type Inquiry,
  type OfficeLeasingDetails,
} from "@/lib/inquiryManagement";
import styles from "./PropertyManagement.module.css";
import inquiryStyles from "./Inquiries.module.css";

const LEASING_LABELS: { key: keyof OfficeLeasingDetails; label: string }[] = [
  { key: "company_name", label: "Company" },
  { key: "business_type", label: "Business type" },
  { key: "alt_phone", label: "Alt. phone" },
  { key: "office_size", label: "Office size" },
  { key: "employees", label: "Employees" },
  { key: "move_in_date", label: "Move-in date" },
  { key: "duration_years", label: "Duration (years)" },
];

export default function Inquiries() {
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [interestFilter, setInterestFilter] = useState("all");
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [memo, setMemo] = useState("");
  const [memoMode, setMemoMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchInquiries({
        search: search || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        interest: interestFilter === "all" ? undefined : interestFilter,
      });
      setInquiries(data);
      setSelected((current) => {
        if (!current) return null;
        return data.find((item) => item.id === current.id) ?? null;
      });
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to load inquiries.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, interestFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const closeDetail = () => {
    setSelected(null);
    setMemo("");
    setMemoMode(false);
  };

  const confirmHandled = async () => {
    if (!selected) return;
    const trimmed = memo.trim();
    if (!trimmed) {
      message.error("Handled болгохдоо memo бичнэ үү.");
      return;
    }
    setSaving(true);
    try {
      await updateInquiry(selected.id, { is_handled: true, handled_memo: trimmed });
      message.success("Marked as handled.");
      setMemo("");
      setMemoMode(false);
      await load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const markPending = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await updateInquiry(selected.id, { is_handled: false });
      message.success("Marked as pending.");
      setMemoMode(false);
      setMemo("");
      await load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const leasingRows = useMemo(() => {
    if (!selected?.leasing_details) return [];
    return LEASING_LABELS.flatMap(({ key, label }) => {
      const value = selected.leasing_details?.[key]?.trim();
      return value ? [{ label, value }] : [];
    });
  }, [selected]);

  const columns: ColumnsType<Inquiry> = [
    {
      title: "Contact",
      key: "contact",
      ellipsis: true,
      render: (_, record) => (
        <div className={inquiryStyles.contactCell}>
          <strong>{record.name}</strong>
          <span className={styles.muted}>{record.phone}</span>
          {record.email ? <span className={styles.muted}>{record.email}</span> : null}
        </div>
      ),
    },
    {
      title: "Interest",
      dataIndex: "interest_label",
      width: 140,
      render: (label: string, record) => (
        <Tag color={record.is_office_leasing ? "gold" : undefined}>
          {record.is_office_leasing
            ? "Office Leasing"
            : label || INQUIRY_INTEREST_LABELS[record.interest]}
        </Tag>
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      ellipsis: true,
      render: (value: string) => (
        <span className={styles.muted}>{value?.trim() || "—"}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_handled",
      width: 110,
      render: (isHandled: boolean) => (
        <Tag color={isHandled ? "default" : "gold"}>
          {isHandled ? "Handled" : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Submitted",
      dataIndex: "created_at",
      width: 150,
      className: inquiryStyles.submittedCol,
      render: (value: string) => (
        <span className={inquiryStyles.submittedDate}>
          {dayjs(value).format("YYYY-MM-DD HH:mm")}
        </span>
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
            ...Object.entries(INQUIRY_INTEREST_LABELS).map(([value, label]) => ({
              value,
              label,
            })),
          ]}
        />
        <Button icon={<ReloadOutlined />} onClick={load}>
          Refresh
        </Button>
      </Space>

      <Spin spinning={loading}>
        <Table
          size="small"
          rowKey="id"
          columns={columns}
          dataSource={inquiries}
          pagination={{ pageSize: 20, size: "small" }}
          className={inquiryStyles.compactTable}
          rowClassName={(_, index) =>
            `${inquiryStyles.clickableRow} ${
              index % 2 === 1 ? inquiryStyles.stripedRow : ""
            }`
          }
          onRow={(record) => ({
            onClick: () => {
              setSelected(record);
              setMemo("");
              setMemoMode(false);
            },
          })}
        />
      </Spin>

      <Modal
        title={selected ? `Inquiry · ${selected.name}` : "Inquiry"}
        open={Boolean(selected)}
        onCancel={closeDetail}
        width={640}
        footer={
          selected ? (
            <Space wrap>
              <Button onClick={closeDetail}>Close</Button>
              {selected.is_handled ? (
                <Button loading={saving} onClick={markPending}>
                  Reopen as pending
                </Button>
              ) : memoMode ? (
                <>
                  <Button
                    onClick={() => {
                      setMemoMode(false);
                      setMemo("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="primary" loading={saving} onClick={confirmHandled}>
                    Save handled
                  </Button>
                </>
              ) : (
                <Button type="primary" onClick={() => setMemoMode(true)}>
                  Mark as handled
                </Button>
              )}
            </Space>
          ) : null
        }
      >
        {selected ? (
          <div className={inquiryStyles.detailBody}>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Name">{selected.name}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selected.phone}</Descriptions.Item>
              {selected.email ? (
                <Descriptions.Item label="Email">{selected.email}</Descriptions.Item>
              ) : null}
              <Descriptions.Item label="Interest">
                <Tag color={selected.is_office_leasing ? "gold" : undefined}>
                  {selected.is_office_leasing
                    ? "Office Leasing"
                    : selected.interest_label ||
                      INQUIRY_INTEREST_LABELS[selected.interest]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Submitted">
                {dayjs(selected.created_at).format("YYYY-MM-DD HH:mm")}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selected.is_handled ? "default" : "gold"}>
                  {selected.is_handled ? "Handled" : "Pending"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {selected.message?.trim() ? (
              <div className={inquiryStyles.section}>
                <div className={inquiryStyles.sectionTitle}>Message</div>
                <p className={inquiryStyles.sectionText}>{selected.message}</p>
              </div>
            ) : null}

            {leasingRows.length > 0 ? (
              <div className={inquiryStyles.section}>
                <div className={inquiryStyles.sectionTitle}>Office leasing details</div>
                <Descriptions column={1} size="small" bordered>
                  {leasingRows.map((row) => (
                    <Descriptions.Item key={row.label} label={row.label}>
                      {row.value}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </div>
            ) : null}

            {selected.is_handled ? (
              <div className={inquiryStyles.section}>
                <div className={inquiryStyles.sectionTitle}>Handled</div>
                <Descriptions column={1} size="small" bordered>
                  {selected.handled_by_name ? (
                    <Descriptions.Item label="By">
                      <span className={inquiryStyles.handledBy}>
                        <Avatar
                          size={28}
                          src={selected.handled_by_avatar_url || undefined}
                          className={inquiryStyles.handledByAvatar}
                        >
                          {selected.handled_by_name.slice(0, 1).toUpperCase()}
                        </Avatar>
                        <span>{selected.handled_by_name}</span>
                      </span>
                    </Descriptions.Item>
                  ) : null}
                  {selected.handled_at ? (
                    <Descriptions.Item label="When">
                      {dayjs(selected.handled_at).format("YYYY-MM-DD HH:mm")}
                    </Descriptions.Item>
                  ) : null}
                  {selected.handled_memo ? (
                    <Descriptions.Item label="Memo">{selected.handled_memo}</Descriptions.Item>
                  ) : null}
                </Descriptions>
              </div>
            ) : null}

            {memoMode && !selected.is_handled ? (
              <div className={inquiryStyles.section}>
                <div className={inquiryStyles.sectionTitle}>Handled memo</div>
                <p className={styles.muted} style={{ marginBottom: 8 }}>
                  Ямар мэдээлэл өгсөн / юу хийснээ memo-д бичнэ үү.
                </p>
                <Input.TextArea
                  rows={4}
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="Жишээ: Утсаар холбогдож office tour товлов. 2026-10-01 14:00."
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </Card>
  );
}
