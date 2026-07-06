"use client";

import { ArrowLeftOutlined, DeleteOutlined, FileImageOutlined, FilePdfOutlined, FileWordOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  Upload,
} from "antd";
import type { UploadProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import MoneyInput from "@/components/dashboard/MoneyInput";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  deleteLeaseContractAttachment,
  fetchLeaseContract,
  fetchLeaseContractAttachments,
  fetchLeaseRentSchedule,
  fetchPropertyTenants,
  fetchPropertyTenant,
  fetchPropertyUnits,
  fetchPropertyUnit,
  generateLeaseRentSchedule,
  uploadLeaseContractAttachment,
  updateLeaseContract,
  type LeaseBillingCycle,
  type LeaseContractAttachment,
  type LeaseContractAttachmentType,
  type LeaseContract,
  type LeaseContractStatus,
  type LeaseRentScheduleLine,
  type LeaseRentScheduleStatus,
  type PropertyTenant,
  type PropertyUnit,
  type PropertyUnitStatus,
} from "@/lib/propertyManagement";
import styles from "./PropertyManagement.module.css";

type ContractFormValues = {
  contract_number?: string;
  unit: number;
  tenant: number;
  status: LeaseContractStatus;
  start_date?: dayjs.Dayjs | null;
  end_date?: dayjs.Dayjs | null;
  rent_amount: number;
  service_charge: number;
  deposit_amount: number;
  billing_cycle: LeaseBillingCycle;
  notes: string;
};

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

const UNIT_STATUS_COLORS: Record<PropertyUnitStatus, string> = {
  available: "green",
  rented: "blue",
  reserved: "gold",
  unavailable: "default",
};

const UNIT_STATUS_LABELS: Record<PropertyUnitStatus, string> = {
  available: "Available",
  rented: "Rented",
  reserved: "Reserved",
  unavailable: "Unavailable",
};

const CONTRACT_STEPS: LeaseContractStatus[] = ["draft", "active", "ended", "terminated"];

const RENT_SCHEDULE_STATUS_COLORS: Record<LeaseRentScheduleStatus, string> = {
  pending: "default",
  invoiced: "blue",
  paid: "green",
  cancelled: "red",
};

const ATTACHMENT_TYPE_LABELS: Record<LeaseContractAttachmentType, string> = {
  pdf: "PDF",
  document: "Document",
  image: "Image",
};

const ATTACHMENT_ACCEPT = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp";

const BILLING_CYCLES: { value: LeaseBillingCycle; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

function formatMoney(value: string | number) {
  return `${Number(value || 0).toLocaleString()} ₮`;
}

function formatArea(value: string | number) {
  return `${Number(value || 0).toLocaleString()} m²`;
}

function formatDate(value: string | null) {
  return value ? dayjs(value).format("YYYY-MM-DD") : "-";
}

export default function PropertyContractDetail({ contractId }: { contractId: number }) {
  const router = useRouter();
  const [form] = Form.useForm<ContractFormValues>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [contract, setContract] = useState<LeaseContract | null>(null);
  const [tenant, setTenant] = useState<PropertyTenant | null>(null);
  const [unit, setUnit] = useState<PropertyUnit | null>(null);
  const [tenantOptions, setTenantOptions] = useState<PropertyTenant[]>([]);
  const [unitOptions, setUnitOptions] = useState<PropertyUnit[]>([]);
  const [rentLines, setRentLines] = useState<LeaseRentScheduleLine[]>([]);
  const [attachments, setAttachments] = useState<LeaseContractAttachment[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const nextContract = await fetchLeaseContract(contractId);
      setContract(nextContract);
      const [nextTenant, nextUnit, nextRentLines, nextAttachments, nextTenants, nextUnits] = await Promise.all([
        fetchPropertyTenant(nextContract.tenant),
        fetchPropertyUnit(nextContract.unit),
        fetchLeaseRentSchedule({ contract: contractId }),
        fetchLeaseContractAttachments({ contract: contractId }),
        fetchPropertyTenants(),
        fetchPropertyUnits(),
      ]);
      setTenant(nextTenant);
      setUnit(nextUnit);
      setRentLines(nextRentLines);
      setAttachments(nextAttachments);
      setTenantOptions(nextTenants);
      setUnitOptions(nextUnits);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Contract detail failed to load.");
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    load();
  }, [load]);

  const openEditModal = () => {
    if (!contract) return;
    form.setFieldsValue({
      contract_number: contract.contract_number,
      unit: contract.unit,
      tenant: contract.tenant,
      status: contract.status,
      start_date: contract.start_date ? dayjs(contract.start_date) : null,
      end_date: contract.end_date ? dayjs(contract.end_date) : null,
      rent_amount: Number(contract.rent_amount || 0),
      service_charge: Number(contract.service_charge || 0),
      deposit_amount: Number(contract.deposit_amount || 0),
      billing_cycle: contract.billing_cycle,
      notes: contract.notes || "",
    });
    setEditOpen(true);
  };

  const saveContract = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      await updateLeaseContract(contractId, {
        ...values,
        start_date: values.start_date ? values.start_date.format("YYYY-MM-DD") : null,
        end_date: values.end_date ? values.end_date.format("YYYY-MM-DD") : null,
      });
      message.success("Contract updated.");
      setEditOpen(false);
      await load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to update contract.");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateSchedule = async () => {
    setGenerating(true);
    try {
      const result = await generateLeaseRentSchedule(contractId);
      setRentLines(result.results);
      message.success(
        `Rent schedule generated. Created: ${result.created_count}, updated: ${result.updated_count}, skipped: ${result.skipped_count}.`,
      );
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to generate rent schedule.");
    } finally {
      setGenerating(false);
    }
  };

  const handleUpload: UploadProps["customRequest"] = async ({ file, onError, onSuccess }) => {
    setUploading(true);
    try {
      const uploaded = await uploadLeaseContractAttachment(contractId, file as File);
      setAttachments((current) => [uploaded, ...current]);
      message.success("Attachment uploaded.");
      onSuccess?.(uploaded);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to upload attachment.");
      onError?.(error instanceof Error ? error : new Error("Failed to upload attachment."));
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = async (id: number) => {
    try {
      await deleteLeaseContractAttachment(id);
      setAttachments((current) => current.filter((item) => item.id !== id));
      message.success("Attachment deleted.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to delete attachment.");
    }
  };

  const attachmentIcon = (type: LeaseContractAttachmentType) => {
    if (type === "pdf") return <FilePdfOutlined />;
    if (type === "document") return <FileWordOutlined />;
    return <FileImageOutlined />;
  };

  const rentColumns: ColumnsType<LeaseRentScheduleLine> = [
    { title: "Period Start", dataIndex: "period_start", key: "period_start", render: formatDate },
    { title: "Period End", dataIndex: "period_end", key: "period_end", render: formatDate },
    { title: "Due Date", dataIndex: "due_date", key: "due_date", render: formatDate },
    { title: "Rent Amount", key: "rent_amount", render: (_, line) => formatMoney(line.rent_amount) },
    { title: "Service Charge", key: "service_charge", render: (_, line) => formatMoney(line.service_charge) },
    { title: "Total Amount", key: "total_amount", render: (_, line) => formatMoney(line.total_amount) },
    {
      title: "Status",
      key: "status",
      render: (_, line) => <Tag color={RENT_SCHEDULE_STATUS_COLORS[line.status]}>{line.status_label}</Tag>,
    },
    { title: "Invoice", dataIndex: "invoice_reference", key: "invoice_reference", render: (value: string) => value || "-" },
  ];

  const attachmentColumns: ColumnsType<LeaseContractAttachment> = [
    {
      title: "File",
      key: "file",
      render: (_, attachment) => (
        <a href={attachment.file_url} rel="noreferrer" target="_blank">
          <Space>
            {attachmentIcon(attachment.attachment_type)}
            <span>{attachment.original_name}</span>
          </Space>
        </a>
      ),
    },
    {
      title: "Type",
      key: "type",
      render: (_, attachment) => <Tag>{ATTACHMENT_TYPE_LABELS[attachment.attachment_type]}</Tag>,
    },
    {
      title: "Size",
      key: "size",
      render: (_, attachment) => `${(attachment.size / 1024 / 1024).toFixed(2)} MB`,
    },
    { title: "Uploaded By", dataIndex: "uploaded_by_name", key: "uploaded_by_name", render: (value: string) => value || "-" },
    { title: "Uploaded", dataIndex: "created_at", key: "created_at", render: (value: string) => dayjs(value).format("YYYY-MM-DD HH:mm") },
    {
      title: "",
      key: "actions",
      align: "right",
      render: (_, attachment) => (
        <Popconfirm title="Delete this attachment?" onConfirm={() => removeAttachment(attachment.id)}>
          <Button danger icon={<DeleteOutlined />} size="small">
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <section className={styles.shell}>
        <div className={styles.detailHeader}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/dashboard/property/contracts")}>
            Contracts
          </Button>
          <div>
            <span className={styles.eyebrow}>Contract Detail</span>
            <h1>{contract?.contract_number || "Lease Contract"}</h1>
            {contract ? (
              <p>
                {contract.building_name} · {contract.floor_number}F · {contract.unit_code}
              </p>
            ) : null}
          </div>
          {contract ? (
            <Tag color={CONTRACT_STATUS_COLORS[contract.status]}>{CONTRACT_STATUS_LABELS[contract.status]}</Tag>
          ) : null}
        </div>

        {contract ? (
          <div className={styles.odooForm}>
            <div className={styles.odooToolbar}>
              <Space>
                <Button onClick={() => router.push("/dashboard/property/contracts")}>New</Button>
                <Button onClick={openEditModal}>Edit</Button>
                <Button onClick={load}>Refresh</Button>
                <Button type="primary" loading={generating} onClick={handleGenerateSchedule}>
                  Generate Rent Schedule
                </Button>
                {tenant ? (
                  <Button onClick={() => router.push(`/dashboard/property/tenants/${tenant.id}`)}>Open Tenant</Button>
                ) : null}
              </Space>
              <div className={styles.statusStepper}>
                {CONTRACT_STEPS.map((step) => (
                  <span key={step} className={step === contract.status ? styles.statusStepActive : styles.statusStep}>
                    {CONTRACT_STATUS_LABELS[step]}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.smartButtons}>
              <button type="button">
                <strong>{rentLines.length}</strong>
                <span>Rent Lines</span>
              </button>
              <button type="button" onClick={() => tenant && router.push(`/dashboard/property/tenants/${tenant.id}`)}>
                <strong>{tenant?.company || tenant?.name || contract.tenant_name || "-"}</strong>
                <span>Tenant</span>
              </button>
              <button type="button">
                <strong>{contract.unit_code}</strong>
                <span>Unit</span>
              </button>
              <button type="button">
                <strong>{attachments.length}</strong>
                <span>Attachments</span>
              </button>
            </div>

            <div className={styles.odooSheet}>
              <span className={styles.formLabel}>Reference</span>
              <h2>{contract.contract_number}</h2>

              <div className={styles.formColumns}>
                <div className={styles.formColumn}>
                  <div className={styles.formField}>
                    <span>Tenant</span>
                    <strong>{tenant?.company || tenant?.name || contract.tenant_name || "-"}</strong>
                  </div>
                  <div className={styles.formField}>
                    <span>Unit</span>
                    <strong>{contract.unit_code}</strong>
                  </div>
                  <div className={styles.formField}>
                    <span>Floor</span>
                    <strong>{unit?.floor_label || `${contract.floor_number}F`}</strong>
                  </div>
                  <div className={styles.formField}>
                    <span>Building</span>
                    <strong>{contract.building_name}</strong>
                  </div>
                  <div className={styles.formField}>
                    <span>Unit Area</span>
                    <strong>{unit ? formatArea(unit.area_sqm) : "-"}</strong>
                  </div>
                  <div className={styles.formField}>
                    <span>Unit Status</span>
                    <strong>
                      {unit ? <Tag color={UNIT_STATUS_COLORS[unit.status]}>{UNIT_STATUS_LABELS[unit.status]}</Tag> : "-"}
                    </strong>
                  </div>
                </div>

                <div className={styles.formColumn}>
                  <div className={styles.formField}>
                    <span>Start Date</span>
                    <strong>{formatDate(contract.start_date)}</strong>
                  </div>
                  <div className={styles.formField}>
                    <span>End Date</span>
                    <strong>{formatDate(contract.end_date)}</strong>
                  </div>
                  <div className={styles.formField}>
                    <span>Monthly Rent</span>
                    <strong>{formatMoney(contract.rent_amount)}</strong>
                  </div>
                  <div className={styles.formField}>
                    <span>Service Charge</span>
                    <strong>{formatMoney(contract.service_charge)}</strong>
                  </div>
                  <div className={styles.formField}>
                    <span>Deposit</span>
                    <strong>{formatMoney(contract.deposit_amount)}</strong>
                  </div>
                  <div className={styles.formField}>
                    <span>Status</span>
                    <strong>
                      <Tag color={CONTRACT_STATUS_COLORS[contract.status]}>{CONTRACT_STATUS_LABELS[contract.status]}</Tag>
                    </strong>
                  </div>
                </div>
              </div>

              <div className={styles.sectionTitle}>Financial Summary</div>
              <div className={styles.summaryGrid}>
                <div>
                  <span>Amount Per Cycle</span>
                  <strong>{formatMoney(Number(contract.rent_amount || 0) + Number(contract.service_charge || 0))}</strong>
                </div>
                <div>
                  <span>Deposit</span>
                  <strong>{formatMoney(contract.deposit_amount)}</strong>
                </div>
                <div>
                  <span>Billing Cycle</span>
                  <strong>{contract.billing_cycle_label}</strong>
                </div>
              </div>

              <Tabs
                className={styles.odooTabs}
                items={[
                  {
                    key: "schedule",
                    label: "Rent Schedule",
                    children: (
                      <Table
                        rowKey="id"
                        columns={rentColumns}
                        dataSource={rentLines}
                        pagination={{ pageSize: 100 }}
                        onRow={(rentLine) => ({
                          onClick: () => router.push(`/dashboard/property/rent-schedule/${rentLine.id}`),
                        })}
                      />
                    ),
                  },
                  {
                    key: "attachments",
                    label: "Attachments",
                    children: (
                      <div className={styles.attachmentPanel}>
                        <div className={styles.attachmentToolbar}>
                          <Upload
                            accept={ATTACHMENT_ACCEPT}
                            customRequest={handleUpload}
                            disabled={uploading}
                            maxCount={1}
                            showUploadList={false}
                          >
                            <Button loading={uploading} type="primary">
                              Attach File
                            </Button>
                          </Upload>
                          <span>Allowed: PDF, DOC, DOCX, JPG, PNG, GIF, WEBP. Max 20MB.</span>
                        </div>
                        <Table
                          rowKey="id"
                          columns={attachmentColumns}
                          dataSource={attachments}
                          pagination={{ pageSize: 100 }}
                        />
                      </div>
                    ),
                  },
                  {
                    key: "tenant",
                    label: "Tenant",
                    children: (
                      <Descriptions column={2} size="small" className={styles.detailDescriptions}>
                        <Descriptions.Item label="Company">{tenant?.company || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Contact">{tenant?.name || contract.tenant_name || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Phone">{tenant?.phone || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Email">{tenant?.email || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Registration">{tenant?.registration_number || "-"}</Descriptions.Item>
                      </Descriptions>
                    ),
                  },
                  {
                    key: "notes",
                    label: "Notes",
                    children: <p className={styles.noteBlock}>{contract.notes || unit?.notes || "No notes."}</p>,
                  },
                ]}
              />
            </div>
          </div>
        ) : null}

        <Modal
          title="Edit Contract"
          open={editOpen}
          onCancel={() => setEditOpen(false)}
          onOk={saveContract}
          confirmLoading={saving}
          destroyOnClose
          width={720}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="contract_number" label="Contract Number" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="tenant" label="Tenant" rules={[{ required: true }]}>
              <Select
                showSearch
                optionFilterProp="label"
                options={tenantOptions.map((item) => ({
                  value: item.id,
                  label: item.company ? `${item.company} · ${item.name}` : item.name,
                }))}
              />
            </Form.Item>
            <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
              <Select
                showSearch
                optionFilterProp="label"
                options={unitOptions.map((item) => ({
                  value: item.id,
                  label: `${item.building_name} · ${item.floor_label || `${item.floor_number}F`} · ${item.unit_code}`,
                }))}
              />
            </Form.Item>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                  <Select options={Object.entries(CONTRACT_STATUS_LABELS).map(([value, label]) => ({ value, label }))} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="billing_cycle" label="Billing Cycle" rules={[{ required: true }]}>
                  <Select options={BILLING_CYCLES} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="start_date" label="Start Date">
                  <DatePicker className={styles.fullWidth} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="end_date" label="End Date">
                  <DatePicker className={styles.fullWidth} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item name="rent_amount" label="Rent">
                  <MoneyInput className={styles.fullWidth} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="service_charge" label="Service">
                  <MoneyInput className={styles.fullWidth} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="deposit_amount" label="Deposit">
                  <MoneyInput className={styles.fullWidth} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="notes" label="Notes">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>
      </section>
    </Spin>
  );
}
