"use client";

import { EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Input, message, Select, Space, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  fetchSupportTickets,
  TICKET_STATUS_COLORS,
  TICKET_STATUS_LABELS,
  updateSupportTicket,
  type SupportTicket,
  type SupportTicketStatus,
} from "@/lib/supportManagement";
import styles from "./PropertyManagement.module.css";

export default function SupportTickets() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setTickets(
        await fetchSupportTickets({
          search: search || undefined,
          status: statusFilter === "all" ? undefined : statusFilter,
        }),
      );
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: number, status: SupportTicketStatus, event?: React.MouseEvent) => {
    event?.stopPropagation();
    try {
      await updateSupportTicket(id, { status });
      message.success("Ticket updated.");
      load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Update failed.");
    }
  };

  const columns: ColumnsType<SupportTicket> = [
    {
      title: "Ticket",
      dataIndex: "subject",
      render: (value, record) => (
        <div>
          <Link href={`/dashboard/support/${record.id}`} className={styles.tableLink}>
            <strong>{value}</strong>
          </Link>
          <div className={styles.muted}>{record.tenant_company || record.tenant_name}</div>
        </div>
      ),
    },
    { title: "Category", dataIndex: "category_label" },
    { title: "Priority", dataIndex: "priority_label" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: SupportTicketStatus) => (
        <Tag color={TICKET_STATUS_COLORS[status]}>{TICKET_STATUS_LABELS[status]}</Tag>
      ),
    },
    {
      title: "Replies",
      key: "replies",
      render: (_, record) => record.messages?.length ?? 0,
    },
    { title: "Created", dataIndex: "created_at", render: (v) => dayjs(v).format("YYYY-MM-DD HH:mm") },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small" onClick={(event) => event.stopPropagation()}>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/dashboard/support/${record.id}`)}
          >
            View
          </Button>
          <Select
            size="small"
            value={record.status}
            style={{ width: 150 }}
            onChange={(value) => updateStatus(record.id, value)}
            options={Object.entries(TICKET_STATUS_LABELS).map(([value, label]) => ({ value, label }))}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.shell}>
      <div className={styles.workspace}>
        <div className={styles.pageHead}>
          <div>
            <h1>Support tickets</h1>
            <p>Tenant maintenance and service requests from the portal.</p>
          </div>
          <Button icon={<ReloadOutlined />} onClick={load}>
            Refresh
          </Button>
        </div>

        <div className={styles.searchArea}>
          <Input
            allowClear
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={load}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 180 }}
            options={[
              { value: "all", label: "All statuses" },
              ...Object.entries(TICKET_STATUS_LABELS).map(([value, label]) => ({ value, label })),
            ]}
          />
          <Button onClick={load}>Apply</Button>
        </div>

        <Spin spinning={loading}>
          <Card className={styles.statCard}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={tickets}
              pagination={{ pageSize: 20 }}
              onRow={(record) => ({
                onClick: () => router.push(`/dashboard/support/${record.id}`),
                style: { cursor: "pointer" },
              })}
            />
          </Card>
        </Spin>
      </div>
    </div>
  );
}
