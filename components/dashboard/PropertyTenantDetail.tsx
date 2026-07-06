"use client";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { Avatar, Button, Descriptions, Form, Input, message, Modal, Space, Spin, Table, Tabs, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  disableTenantPortal,
  enableTenantPortal,
  fetchLeaseContracts,
  fetchPropertyTenant,
  type LeaseContract,
  type LeaseContractStatus,
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

function formatMoney(value: string | number) {
  return `${Number(value || 0).toLocaleString()} ₮`;
}

function formatDate(value: string | null) {
  return value ? dayjs(value).format("YYYY-MM-DD") : "-";
}

export default function PropertyTenantDetail({ tenantId }: { tenantId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<PropertyTenant | null>(null);
  const [contracts, setContracts] = useState<LeaseContract[]>([]);
  const [portalOpen, setPortalOpen] = useState(false);
  const [portalSaving, setPortalSaving] = useState(false);
  const [portalForm] = Form.useForm<{ username: string; password: string }>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [nextTenant, nextContracts] = await Promise.all([
        fetchPropertyTenant(tenantId),
        fetchLeaseContracts({ tenant: tenantId }),
      ]);
      setTenant(nextTenant);
      setContracts(nextContracts);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Tenant detail failed to load.");
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    load();
  }, [load]);

  const columns: ColumnsType<LeaseContract> = [
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
    { title: "Period", key: "period", render: (_, contract) => `${formatDate(contract.start_date)} - ${formatDate(contract.end_date)}` },
    { title: "Rent", key: "rent", render: (_, contract) => formatMoney(contract.rent_amount) },
  ];

  const title = tenant?.company || tenant?.name || "Tenant";

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
          <div className={styles.odooForm}>
            <div className={styles.odooToolbar}>
              <Space>
                <Button onClick={() => router.push("/dashboard/property/tenants")}>New</Button>
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

            <div className={styles.smartButtons}>
              <button type="button">
                <strong>{tenant.contract_count}</strong>
                <span>Contracts</span>
              </button>
              <button type="button">
                <strong>{tenant.active_contract_count}</strong>
                <span>Active Contracts</span>
              </button>
              <button type="button">
                <strong>{tenant.phone || "-"}</strong>
                <span>Phone</span>
              </button>
            </div>

            <div className={styles.odooSheet}>
              <div className={styles.tenantDetailTitle}>
                <Avatar shape="square" size={72} src={tenant.logo_url || undefined}>
                  {title.charAt(0)}
                </Avatar>
                <div>
                  <span className={styles.formLabel}>Tenant</span>
                  <h2>{title}</h2>
                </div>
              </div>

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
                    <span>Status</span>
                    <strong>
                      <Tag color={tenant.is_active ? "green" : "default"}>{tenant.is_active ? "Active" : "Inactive"}</Tag>
                    </strong>
                  </div>
                </div>
              </div>

              <div className={styles.sectionTitle}>Lease Summary</div>
              <div className={styles.summaryGrid}>
                <div>
                  <span>Total Contracts</span>
                  <strong>{tenant.contract_count}</strong>
                </div>
                <div>
                  <span>Active Contracts</span>
                  <strong>{tenant.active_contract_count}</strong>
                </div>
                <div>
                  <span>Customer Status</span>
                  <strong>{tenant.is_active ? "Active" : "Inactive"}</strong>
                </div>
              </div>

              <Tabs
                className={styles.odooTabs}
                items={[
                  {
                    key: "contracts",
                    label: "Contracts",
                    children: (
                      <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={contracts}
                        pagination={{ pageSize: 100 }}
                        onRow={(contract) => ({
                          onClick: () => router.push(`/dashboard/property/contracts/${contract.id}`),
                        })}
                      />
                    ),
                  },
                  {
                    key: "contact",
                    label: "Contact",
                    children: (
                      <Descriptions column={2} size="small" className={styles.detailDescriptions}>
                        <Descriptions.Item label="Phone">{tenant.phone || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Email">{tenant.email || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Registration">{tenant.registration_number || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Address">{tenant.address || "-"}</Descriptions.Item>
                      </Descriptions>
                    ),
                  },
                  {
                    key: "portal",
                    label: "Portal access",
                    children: (
                      <Descriptions column={1} size="small" className={styles.detailDescriptions}>
                        <Descriptions.Item label="Portal enabled">
                          {tenant.portal_enabled ? <Tag color="green">Yes</Tag> : <Tag>No</Tag>}
                        </Descriptions.Item>
                        <Descriptions.Item label="Login username">{tenant.portal_username || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Portal URL">/portal/login</Descriptions.Item>
                      </Descriptions>
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
