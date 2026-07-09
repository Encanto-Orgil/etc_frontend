"use client";

import {
  ArrowLeftOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  MailOutlined,
  PhoneOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Segmented,
  Space,
  Spin,
  Statistic,
  Table,
  Tabs,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  disableTenantPortal,
  enableTenantPortal,
  fetchLeaseContracts,
  fetchLeaseRentSchedule,
  fetchPropertyTenant,
  type LeaseContract,
  type LeaseContractStatus,
  type LeaseRentScheduleLine,
  type LeaseRentScheduleStatus,
  type PropertyTenant,
} from "@/lib/propertyManagement";
import styles from "./PropertyManagement.module.css";

const CONTRACT_STATUS_COLORS: Record<LeaseContractStatus, string> = {
  draft: "default",
  active: "green",
  ended: "blue",
  terminated: "red",
};

const CONTRACT_STATUS_LABELS: Record<LeaseContractStatus, string> = {
  draft: "Draft",
  active: "Active",
  ended: "Ended",
  terminated: "Terminated",
};

const RENT_SCHEDULE_STATUS_COLORS: Record<LeaseRentScheduleStatus, string> = {
  pending: "default",
  invoiced: "blue",
  paid: "green",
  cancelled: "red",
};

type PaymentFilter = "all" | LeaseRentScheduleStatus | "overdue";

function formatMoney(value: string | number) {
  return `${Number(value || 0).toLocaleString()} ₮`;
}

function formatDate(value: string | null) {
  return value ? dayjs(value).format("YYYY-MM-DD") : "-";
}

function isOverdue(line: LeaseRentScheduleLine) {
  if (line.status === "paid" || line.status === "cancelled") return false;
  return dayjs(line.due_date).isBefore(dayjs(), "day");
}

function cycleAmount(contract: LeaseContract) {
  return Number(contract.rent_amount || 0) + Number(contract.service_charge || 0);
}

export default function PropertyTenantDetail({ tenantId }: { tenantId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<PropertyTenant | null>(null);
  const [contracts, setContracts] = useState<LeaseContract[]>([]);
  const [rentLines, setRentLines] = useState<LeaseRentScheduleLine[]>([]);
  const [selectedContractId, setSelectedContractId] = useState<number | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all");
  const [activeTab, setActiveTab] = useState("payments");
  const [portalOpen, setPortalOpen] = useState(false);
  const [portalSaving, setPortalSaving] = useState(false);
  const [portalForm] = Form.useForm<{ username: string; password: string }>();
  const contractPanelRef = useRef<HTMLDivElement>(null);

  const focusContract = (contractId: number) => {
    setSelectedContractId(contractId);
    contractPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const showOverduePayments = () => {
    setPaymentFilter("overdue");
    setActiveTab("payments");
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [nextTenant, nextContracts, nextRentLines] = await Promise.all([
        fetchPropertyTenant(tenantId),
        fetchLeaseContracts({ tenant: tenantId }),
        fetchLeaseRentSchedule({ tenant: tenantId }),
      ]);
      setTenant(nextTenant);
      setContracts(nextContracts);
      setRentLines(nextRentLines);
      setSelectedContractId((current) => {
        if (current && nextContracts.some((contract) => contract.id === current)) {
          return current;
        }
        const active = nextContracts.find((contract) => contract.status === "active");
        return active?.id ?? nextContracts[0]?.id ?? null;
      });
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Tenant detail failed to load.");
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    load();
  }, [load]);

  const selectedContract = useMemo(
    () => contracts.find((contract) => contract.id === selectedContractId) ?? null,
    [contracts, selectedContractId],
  );

  const paymentStats = useMemo(() => {
    const stats = {
      pending: { count: 0, amount: 0 },
      invoiced: { count: 0, amount: 0 },
      paid: { count: 0, amount: 0 },
      overdue: { count: 0, amount: 0 },
    };

    for (const line of rentLines) {
      const amount = Number(line.total_amount || 0);
      if (line.status === "pending") {
        stats.pending.count += 1;
        stats.pending.amount += amount;
      } else if (line.status === "invoiced") {
        stats.invoiced.count += 1;
        stats.invoiced.amount += amount;
      } else if (line.status === "paid") {
        stats.paid.count += 1;
        stats.paid.amount += amount;
      }
      if (isOverdue(line)) {
        stats.overdue.count += 1;
        stats.overdue.amount += amount;
      }
    }

    return stats;
  }, [rentLines]);

  const activeMonthlyRent = useMemo(
    () =>
      contracts
        .filter((contract) => contract.status === "active")
        .reduce((sum, contract) => sum + cycleAmount(contract), 0),
    [contracts],
  );

  const filteredRentLines = useMemo(() => {
    if (paymentFilter === "all") return rentLines;
    if (paymentFilter === "overdue") return rentLines.filter(isOverdue);
    return rentLines.filter((line) => line.status === paymentFilter);
  }, [paymentFilter, rentLines]);

  const contractColumns: ColumnsType<LeaseContract> = [
    { title: "Contract", dataIndex: "contract_number", key: "contract_number" },
    {
      title: "Unit",
      key: "unit",
      render: (_, contract) => `${contract.building_name} · ${contract.floor_number}F · ${contract.unit_code}`,
    },
    {
      title: "Status",
      key: "status",
      render: (_, contract) => (
        <Tag color={CONTRACT_STATUS_COLORS[contract.status]}>{CONTRACT_STATUS_LABELS[contract.status]}</Tag>
      ),
    },
    {
      title: "Period",
      key: "period",
      render: (_, contract) => `${formatDate(contract.start_date)} – ${formatDate(contract.end_date)}`,
    },
    { title: "Rent / cycle", key: "rent", render: (_, contract) => formatMoney(cycleAmount(contract)) },
    {
      title: "",
      key: "actions",
      width: 88,
      render: (_, contract) => (
        <Button
          size="small"
          type="link"
          onClick={(event) => {
            event.stopPropagation();
            router.push(`/dashboard/property/contracts/${contract.id}`);
          }}
        >
          Open
        </Button>
      ),
    },
  ];

  const paymentColumns: ColumnsType<LeaseRentScheduleLine> = [
    { title: "Contract", dataIndex: "contract_number", key: "contract_number", width: 120 },
    {
      title: "Unit",
      key: "unit",
      render: (_, line) => `${line.building_name} · ${line.unit_code}`,
    },
    { title: "Period", key: "period", render: (_, line) => `${formatDate(line.period_start)} – ${formatDate(line.period_end)}` },
    { title: "Due", dataIndex: "due_date", key: "due_date", render: formatDate },
    { title: "Total", key: "total_amount", render: (_, line) => formatMoney(line.total_amount) },
    {
      title: "Status",
      key: "status",
      render: (_, line) => (
        <Space size={4}>
          <Tag color={RENT_SCHEDULE_STATUS_COLORS[line.status]}>{line.status_label}</Tag>
          {isOverdue(line) ? <Tag color="red">Overdue</Tag> : null}
        </Space>
      ),
    },
    { title: "Invoice", dataIndex: "invoice_reference", key: "invoice_reference", render: (value: string) => value || "-" },
  ];

  const title = tenant?.company || tenant?.name || "Tenant";
  const contractOptions = contracts.map((contract) => ({
    label: `${contract.contract_number} · ${contract.unit_code}`,
    value: contract.id,
  }));

  const openPortalModal = () => {
    portalForm.setFieldsValue({
      username: tenant?.portal_username || tenant?.email?.split("@")[0] || `tenant_${tenantId}`,
      password: "",
    });
    setPortalOpen(true);
  };

  const savePortal = async () => {
    const values = await portalForm.validateFields();
    setPortalSaving(true);
    try {
      setTenant(await enableTenantPortal(tenantId, values));
      message.success("Tenant portal access enabled.");
      setPortalOpen(false);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to enable portal.");
    } finally {
      setPortalSaving(false);
    }
  };

  const disablePortal = async () => {
    try {
      setTenant(await disableTenantPortal(tenantId));
      message.success("Tenant portal access disabled.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to disable portal.");
    }
  };

  return (
    <Spin spinning={loading}>
      <section className={styles.shell}>
        <div className={styles.detailHeader}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/dashboard/property/tenants")}>
            Tenants
          </Button>
          <div>
            <span className={styles.eyebrow}>Tenant Detail</span>
            <h1>{title}</h1>
            {tenant?.company ? <p>{tenant.name}</p> : null}
          </div>
          {tenant ? <Tag color={tenant.is_active ? "green" : "default"}>{tenant.is_active ? "Active" : "Inactive"}</Tag> : null}
        </div>

        {tenant ? (
          <div className={styles.tenantDetailLayout}>
            <div className={styles.odooToolbar}>
              <Space wrap>
                <Button onClick={load}>Refresh</Button>
                <Button type="primary" onClick={() => router.push("/dashboard/property/contracts")}>
                  New Contract
                </Button>
                {tenant.portal_enabled ? (
                  <Button danger onClick={disablePortal}>
                    Disable portal
                  </Button>
                ) : (
                  <Button onClick={openPortalModal}>Enable portal login</Button>
                )}
              </Space>
              <div className={styles.statusStepper}>
                <span className={tenant.is_active ? styles.statusStepActive : styles.statusStep}>Active</span>
                <span className={!tenant.is_active ? styles.statusStepActive : styles.statusStep}>Inactive</span>
              </div>
            </div>

            <div className={styles.tenantHero}>
              <div className={styles.tenantDetailTitle}>
                <Avatar shape="square" size={72} src={tenant.logo_url || undefined}>
                  {title.charAt(0)}
                </Avatar>
                <div>
                  <span className={styles.formLabel}>Tenant</span>
                  <h2>{title}</h2>
                  <Space wrap className={styles.tenantContactChips}>
                    {tenant.phone ? (
                      <span>
                        <PhoneOutlined /> {tenant.phone}
                      </span>
                    ) : null}
                    {tenant.email ? (
                      <span>
                        <MailOutlined /> {tenant.email}
                      </span>
                    ) : null}
                    {tenant.registration_number ? <span>Reg: {tenant.registration_number}</span> : null}
                  </Space>
                </div>
              </div>
              <div className={styles.tenantHeroMeta}>
                <Tag color={tenant.portal_enabled ? "green" : "default"}>
                  Portal {tenant.portal_enabled ? "enabled" : "disabled"}
                </Tag>
                <span className={styles.muted}>
                  {tenant.contract_count} contract{tenant.contract_count === 1 ? "" : "s"} · {tenant.active_contract_count} active
                </span>
              </div>
            </div>

            <Row gutter={[12, 12]} className={styles.tenantKpiRow}>
              <Col xs={24} sm={12} lg={6}>
                <Card size="small" className={styles.tenantKpiCard}>
                  <Statistic title="Active rent / cycle" value={activeMonthlyRent} formatter={(value) => formatMoney(value)} />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card size="small" className={styles.tenantKpiCard}>
                  <Statistic
                    title="Pending"
                    value={paymentStats.pending.amount}
                    formatter={(value) => formatMoney(value)}
                    suffix={<span className={styles.tenantKpiSuffix}>{paymentStats.pending.count} lines</span>}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card size="small" className={styles.tenantKpiCard}>
                  <Statistic
                    title="Invoiced"
                    value={paymentStats.invoiced.amount}
                    formatter={(value) => formatMoney(value)}
                    suffix={<span className={styles.tenantKpiSuffix}>{paymentStats.invoiced.count} lines</span>}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card size="small" className={`${styles.tenantKpiCard} ${paymentStats.overdue.count > 0 ? styles.tenantKpiAlert : ""}`}>
                  <Statistic
                    title="Overdue"
                    value={paymentStats.overdue.amount}
                    formatter={(value) => formatMoney(value)}
                    valueStyle={paymentStats.overdue.count > 0 ? { color: "#cf1322" } : undefined}
                    suffix={<span className={styles.tenantKpiSuffix}>{paymentStats.overdue.count} lines</span>}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[12, 12]} className={styles.tenantOverviewRow}>
              <Col xs={24} xl={12}>
                <div ref={contractPanelRef}>
                <Card
                  size="small"
                  className={styles.tenantSectionCard}
                  title={
                    <Space>
                      <FileTextOutlined />
                      <span>Contract detail</span>
                    </Space>
                  }
                  extra={
                    selectedContract ? (
                      <Button
                        size="small"
                        type="link"
                        onClick={() => router.push(`/dashboard/property/contracts/${selectedContract.id}`)}
                      >
                        Full view
                      </Button>
                    ) : null
                  }
                >
                  {contracts.length > 1 ? (
                    <Segmented
                      block
                      className={styles.tenantContractPicker}
                      options={contractOptions}
                      value={selectedContractId ?? undefined}
                      onChange={(value) => setSelectedContractId(Number(value))}
                    />
                  ) : null}

                  {selectedContract ? (
                    <div className={styles.tenantContractPanel}>
                      <div className={styles.tenantContractHead}>
                        <div>
                          <strong>{selectedContract.contract_number}</strong>
                          <p className={styles.muted}>
                            {selectedContract.building_name} · {selectedContract.floor_number}F · {selectedContract.unit_code}
                          </p>
                        </div>
                        <Tag color={CONTRACT_STATUS_COLORS[selectedContract.status]}>
                          {CONTRACT_STATUS_LABELS[selectedContract.status]}
                        </Tag>
                      </div>

                      <div className={styles.tenantContractGrid}>
                        <div>
                          <span>Lease period</span>
                          <strong>
                            <CalendarOutlined /> {formatDate(selectedContract.start_date)} – {formatDate(selectedContract.end_date)}
                          </strong>
                        </div>
                        <div>
                          <span>Billing cycle</span>
                          <strong>{selectedContract.billing_cycle_label}</strong>
                        </div>
                        <div>
                          <span>Monthly rent</span>
                          <strong>{formatMoney(selectedContract.rent_amount)}</strong>
                        </div>
                        <div>
                          <span>Service charge</span>
                          <strong>{formatMoney(selectedContract.service_charge)}</strong>
                        </div>
                        <div>
                          <span>Deposit</span>
                          <strong>{formatMoney(selectedContract.deposit_amount)}</strong>
                        </div>
                        <div>
                          <span>Amount / cycle</span>
                          <strong className={styles.tenantMoneyHighlight}>{formatMoney(cycleAmount(selectedContract))}</strong>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.tenantEmptyPanel}>
                      <FileTextOutlined />
                      <p>No contracts yet. Create a lease contract to start tracking rent.</p>
                      <Button type="primary" size="small" onClick={() => router.push("/dashboard/property/contracts")}>
                        New Contract
                      </Button>
                    </div>
                  )}
                </Card>
                </div>
              </Col>

              <Col xs={24} xl={12}>
                <Card
                  size="small"
                  className={styles.tenantSectionCard}
                  title={
                    <Space>
                      <DollarOutlined />
                      <span>Payment monitor</span>
                    </Space>
                  }
                  extra={
                    paymentStats.overdue.count > 0 ? (
                      <Button size="small" type="link" danger onClick={showOverduePayments}>
                        View overdue
                      </Button>
                    ) : null
                  }
                >
                  {rentLines.length > 0 ? (
                    <>
                      <div className={styles.tenantPaymentSummary}>
                        <div>
                          <span>Paid total</span>
                          <strong>{formatMoney(paymentStats.paid.amount)}</strong>
                        </div>
                        <div>
                          <span>Open balance</span>
                          <strong>{formatMoney(paymentStats.pending.amount + paymentStats.invoiced.amount)}</strong>
                        </div>
                      </div>

                      <div className={styles.tenantUpcomingList}>
                        {rentLines
                          .filter((line) => line.status !== "paid" && line.status !== "cancelled")
                          .slice(0, 4)
                          .map((line) => (
                            <button
                              key={line.id}
                              type="button"
                              className={`${styles.tenantUpcomingItem} ${isOverdue(line) ? styles.tenantUpcomingOverdue : ""}`}
                              onClick={() => router.push(`/dashboard/property/rent-schedule/${line.id}`)}
                            >
                              <div>
                                <strong>{formatDate(line.due_date)}</strong>
                                <span>
                                  {line.contract_number} · {line.unit_code}
                                </span>
                              </div>
                              <div>
                                <strong>{formatMoney(line.total_amount)}</strong>
                                <Tag color={RENT_SCHEDULE_STATUS_COLORS[line.status]}>{line.status_label}</Tag>
                              </div>
                            </button>
                          ))}
                      </div>
                    </>
                  ) : (
                    <div className={styles.tenantEmptyPanel}>
                      <DollarOutlined />
                      <p>No rent schedule lines yet. Generate schedule from a contract.</p>
                    </div>
                  )}
                </Card>
              </Col>
            </Row>

            {paymentStats.overdue.count > 0 ? (
              <div className={styles.tenantOverdueBanner}>
                <WarningOutlined />
                <span>
                  {paymentStats.overdue.count} overdue payment{paymentStats.overdue.count === 1 ? "" : "s"} totaling{" "}
                  {formatMoney(paymentStats.overdue.amount)}
                </span>
                <Button size="small" onClick={showOverduePayments}>
                  Review
                </Button>
              </div>
            ) : null}

            <div className={styles.odooSheet}>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                className={styles.odooTabs}
                items={[
                  {
                    key: "payments",
                    label: `Payments (${rentLines.length})`,
                    children: (
                      <div className={styles.tenantPaymentsTab}>
                        <Segmented
                          value={paymentFilter}
                          onChange={(value) => setPaymentFilter(value as PaymentFilter)}
                          options={[
                            { label: "All", value: "all" },
                            { label: `Pending (${paymentStats.pending.count})`, value: "pending" },
                            { label: `Invoiced (${paymentStats.invoiced.count})`, value: "invoiced" },
                            { label: `Paid (${paymentStats.paid.count})`, value: "paid" },
                            { label: `Overdue (${paymentStats.overdue.count})`, value: "overdue" },
                          ]}
                        />
                        <Table
                          rowKey="id"
                          columns={paymentColumns}
                          dataSource={filteredRentLines}
                          pagination={{ pageSize: 20, showSizeChanger: true }}
                          onRow={(line) => ({
                            onClick: () => router.push(`/dashboard/property/rent-schedule/${line.id}`),
                          })}
                        />
                      </div>
                    ),
                  },
                  {
                    key: "contracts",
                    label: `Contracts (${contracts.length})`,
                    children: (
                      <Table
                        rowKey="id"
                        columns={contractColumns}
                        dataSource={contracts}
                        pagination={{ pageSize: 20, showSizeChanger: true }}
                        onRow={(contract) => ({
                          onClick: () => focusContract(contract.id),
                        })}
                      />
                    ),
                  },
                  {
                    key: "contact",
                    label: "Contact & Portal",
                    children: (
                      <div className={styles.tenantContactPanel}>
                        <div className={styles.formColumns}>
                          <div className={styles.formColumn}>
                            <div className={styles.formField}>
                              <span>Contact Name</span>
                              <strong>{tenant.name || "-"}</strong>
                            </div>
                            <div className={styles.formField}>
                              <span>Company</span>
                              <strong>{tenant.company || "-"}</strong>
                            </div>
                            <div className={styles.formField}>
                              <span>Phone</span>
                              <strong>{tenant.phone || "-"}</strong>
                            </div>
                            <div className={styles.formField}>
                              <span>Email</span>
                              <strong>{tenant.email || "-"}</strong>
                            </div>
                          </div>
                          <div className={styles.formColumn}>
                            <div className={styles.formField}>
                              <span>Registration</span>
                              <strong>{tenant.registration_number || "-"}</strong>
                            </div>
                            <div className={styles.formField}>
                              <span>Address</span>
                              <strong>{tenant.address || "-"}</strong>
                            </div>
                            <div className={styles.formField}>
                              <span>Portal enabled</span>
                              <strong>
                                {tenant.portal_enabled ? <Tag color="green">Yes</Tag> : <Tag>No</Tag>}
                              </strong>
                            </div>
                            <div className={styles.formField}>
                              <span>Login username</span>
                              <strong>{tenant.portal_username || "-"}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: "notes",
                    label: "Notes",
                    children: <p className={styles.noteBlock}>{tenant.notes || "No notes."}</p>,
                  },
                ]}
              />
            </div>
          </div>
        ) : null}
      </section>

      <Modal
        title="Enable tenant portal"
        open={portalOpen}
        onCancel={() => setPortalOpen(false)}
        onOk={savePortal}
        confirmLoading={portalSaving}
        destroyOnClose
      >
        <Form form={portalForm} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  );
}
