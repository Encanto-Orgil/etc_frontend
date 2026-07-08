"use client";

import {
  ApartmentOutlined,
  BankOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  FileProtectOutlined,
  HomeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Switch,
  Table,
  Tag,
  Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo, useState, useCallback, useEffect } from "react";
import {
  createLeaseContract,
  createPropertyFloor,
  createPropertyTenant,
  createPropertyTenantWithLogo,
  createPropertyUnit,
  deleteLeaseContract,
  deletePropertyFloor,
  deletePropertyTenant,
  deletePropertyUnit,
  fetchLeaseContracts,
  fetchLeaseRentSchedule,
  fetchPropertyBuildings,
  fetchPropertyFloors,
  fetchPropertySummary,
  fetchPropertyTenants,
  fetchPropertyUnits,
  updateLeaseContract,
  updatePropertyFloor,
  updatePropertyTenant,
  updatePropertyTenantWithLogo,
  updatePropertyUnit,
} from "@/lib/propertyManagement";
import type {
  LeaseBillingCycle,
  LeaseContract,
  LeaseContractStatus,
  LeaseRentScheduleLine,
  LeaseRentScheduleStatus,
  PropertyOverdueAccount,
  PropertyBuilding,
  PropertyFloor,
  PropertySummary,
  PropertyTenant,
  PropertyUnit,
  PropertyUnitStatus,
} from "@/lib/propertyManagement";
import MoneyInput from "@/components/dashboard/MoneyInput";
import PropertyStackingDashboard from "@/components/dashboard/PropertyStackingDashboard";
import styles from "./PropertyManagement.module.css";

export type PropertyManagementView =
  | "dashboard"
  | "buildings"
  | "floors"
  | "units"
  | "tenants"
  | "contracts"
  | "rent-schedule"
  | "rental-invoices"
  | "stacking";

type FloorFormValues = {
  building: number;
  floor_number: number;
  label: string;
  layout_notes: string;
  is_published: boolean;
  order: number;
};

type UnitFormValues = {
  floor: number;
  unit_code: string;
  area_sqm: number;
  status: PropertyUnitStatus;
  notes: string;
};

type TenantFormValues = {
  name: string;
  company: string;
  phone: string;
  email: string;
  registration_number: string;
  address: string;
  notes: string;
  is_active: boolean;
};

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

const UNIT_STATUS_LABELS: Record<PropertyUnitStatus, string> = {
  available: "Available",
  rented: "Rented",
  reserved: "Reserved",
  unavailable: "Unavailable",
};

const UNIT_STATUS_COLORS: Record<PropertyUnitStatus, string> = {
  available: "green",
  rented: "blue",
  reserved: "gold",
  unavailable: "default",
};

const CONTRACT_STATUS_LABELS: Record<LeaseContractStatus, string> = {
  draft: "Draft",
  active: "Active",
  ended: "Ended",
  terminated: "Terminated",
};

const CONTRACT_STATUS_COLORS: Record<LeaseContractStatus, string> = {
  draft: "default",
  active: "green",
  ended: "blue",
  terminated: "red",
};

const RENT_SCHEDULE_STATUS_COLORS: Record<LeaseRentScheduleStatus, string> = {
  pending: "default",
  invoiced: "blue",
  paid: "green",
  cancelled: "red",
};

const RENT_SCHEDULE_STATUS_LABELS: Record<LeaseRentScheduleStatus, string> = {
  pending: "Pending",
  invoiced: "Invoiced",
  paid: "Paid",
  cancelled: "Cancelled",
};

const BILLING_CYCLES: { value: LeaseBillingCycle; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

const BUILDING_IMAGE_POSITIONS: Record<string, string> = {
  office: "42% 28%",
  mall: "48% 58%",
  apartment: "62% 30%",
};

const FINANCE_NOTES: Partial<Record<PropertyManagementView, string>> = {
  "rent-schedule": "Rent Schedule will be connected to lease contracts and billing rules in the next finance pass.",
  "rental-invoices": "Rental Invoices continue to use the rental finance module until contract billing is connected.",
};

function formatArea(value: string | number) {
  return `${Number(value || 0).toLocaleString()} m²`;
}

function formatMoney(value: string | number) {
  return `${Number(value || 0).toLocaleString()} ₮`;
}

function formatDate(value: string | null) {
  return value ? dayjs(value).format("YYYY-MM-DD") : "-";
}

function contains(text: unknown, query: string) {
  return String(text ?? "").toLowerCase().includes(query);
}

function metricCard(title: string, value: string | number, icon: ReactNode) {
  return (
    <Card className={styles.metricCard}>
      <div className={styles.metricContent}>
        <span className={styles.metricIcon}>{icon}</span>
        <Statistic title={title} value={value} />
      </div>
    </Card>
  );
}

function tenantFormData(values: TenantFormValues, logoFile: File | null) {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("company", values.company || "");
  formData.append("phone", values.phone || "");
  formData.append("email", values.email || "");
  formData.append("registration_number", values.registration_number || "");
  formData.append("address", values.address || "");
  formData.append("notes", values.notes || "");
  formData.append("is_active", String(values.is_active));
  if (logoFile) formData.append("logo", logoFile);
  return formData;
}

export default function PropertyManagement({ view }: { view: PropertyManagementView }) {
  const router = useRouter();
  const activeView = view === "dashboard" ? "dashboard" : view;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState<PropertySummary | null>(null);
  const [buildings, setBuildings] = useState<PropertyBuilding[]>([]);
  const [floors, setFloors] = useState<PropertyFloor[]>([]);
  const [units, setUnits] = useState<PropertyUnit[]>([]);
  const [tenants, setTenants] = useState<PropertyTenant[]>([]);
  const [contracts, setContracts] = useState<LeaseContract[]>([]);
  const [rentScheduleLines, setRentScheduleLines] = useState<LeaseRentScheduleLine[]>([]);
  const [buildingFilter, setBuildingFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<PropertyUnitStatus | LeaseContractStatus | "all">("all");
  const [query, setQuery] = useState("");

  const [floorModalOpen, setFloorModalOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState<PropertyFloor | null>(null);
  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<PropertyUnit | null>(null);
  const [tenantModalOpen, setTenantModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<PropertyTenant | null>(null);
  const [tenantLogoFile, setTenantLogoFile] = useState<File | null>(null);
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<LeaseContract | null>(null);

  const [floorForm] = Form.useForm<FloorFormValues>();
  const [unitForm] = Form.useForm<UnitFormValues>();
  const [tenantForm] = Form.useForm<TenantFormValues>();
  const [contractForm] = Form.useForm<ContractFormValues>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [
        nextSummary,
        nextBuildings,
        nextFloors,
        nextUnits,
        nextTenants,
        nextContracts,
        nextRentScheduleLines,
      ] = await Promise.all([
        fetchPropertySummary(),
        fetchPropertyBuildings(),
        fetchPropertyFloors(),
        fetchPropertyUnits(),
        fetchPropertyTenants(),
        fetchLeaseContracts(),
        fetchLeaseRentSchedule(),
      ]);
      setSummary(nextSummary);
      setBuildings(nextBuildings);
      setFloors(nextFloors);
      setUnits(nextUnits);
      setTenants(nextTenants);
      setContracts(nextContracts);
      setRentScheduleLines(nextRentScheduleLines);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Property data failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const buildingOptions = useMemo(
    () => [
      { value: "all" as const, label: "All Buildings" },
      ...buildings.map((building) => ({ value: building.id, label: building.name })),
    ],
    [buildings],
  );

  const filteredFloors = useMemo(() => {
    const search = query.trim().toLowerCase();
    return floors.filter((floor) => {
      if (buildingFilter !== "all" && floor.building !== buildingFilter) return false;
      if (!search) return true;
      return [floor.building_name, floor.label, floor.floor_number, floor.layout_notes].some((item) =>
        contains(item, search),
      );
    });
  }, [buildingFilter, floors, query]);

  const filteredUnits = useMemo(() => {
    const search = query.trim().toLowerCase();
    return units.filter((unit) => {
      if (buildingFilter !== "all" && unit.building !== buildingFilter) return false;
      if (statusFilter !== "all" && unit.status !== statusFilter) return false;
      if (!search) return true;
      return [
        unit.building_name,
        unit.floor_label,
        unit.floor_number,
        unit.unit_code,
        unit.notes,
        unit.active_contract?.tenant_name,
        unit.active_contract?.tenant_company,
      ].some((item) => contains(item, search));
    });
  }, [buildingFilter, query, statusFilter, units]);

  const filteredTenants = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return tenants;
    return tenants.filter((tenant) =>
      [tenant.name, tenant.company, tenant.phone, tenant.email, tenant.registration_number].some((item) =>
        contains(item, search),
      ),
    );
  }, [query, tenants]);

  const filteredContracts = useMemo(() => {
    const search = query.trim().toLowerCase();
    return contracts.filter((contract) => {
      if (buildingFilter !== "all" && contract.building !== buildingFilter) return false;
      if (statusFilter !== "all" && contract.status !== statusFilter) return false;
      if (!search) return true;
      return [
        contract.contract_number,
        contract.tenant_name,
        contract.tenant_company,
        contract.unit_code,
        contract.building_name,
      ].some((item) => contains(item, search));
    });
  }, [buildingFilter, contracts, query, statusFilter]);

  const filteredRentScheduleLines = useMemo(() => {
    const search = query.trim().toLowerCase();
    return rentScheduleLines.filter((line) => {
      if (buildingFilter !== "all" && line.building !== buildingFilter) return false;
      if (!search) return true;
      return [
        line.contract_number,
        line.tenant_name,
        line.tenant_company,
        line.unit_code,
        line.building_name,
        line.invoice_reference,
      ].some((item) => contains(item, search));
    });
  }, [buildingFilter, query, rentScheduleLines]);

  const filteredRentalInvoices = useMemo(() => {
    const search = query.trim().toLowerCase();
    return rentScheduleLines.filter((line) => {
      const hasInvoice = Boolean(line.invoice_reference) || line.status === "invoiced" || line.status === "paid";
      if (!hasInvoice) return false;
      if (buildingFilter !== "all" && line.building !== buildingFilter) return false;
      if (!search) return true;
      return [
        line.invoice_reference,
        line.contract_number,
        line.tenant_name,
        line.tenant_company,
        line.unit_code,
        line.building_name,
      ].some((item) => contains(item, search));
    });
  }, [buildingFilter, query, rentScheduleLines]);

  const openFloorModal = (floor?: PropertyFloor) => {
    setEditingFloor(floor ?? null);
    floorForm.setFieldsValue({
      building: floor?.building ?? (buildings[0]?.id || undefined),
      floor_number: floor?.floor_number ?? 1,
      label: floor?.label ?? "",
      layout_notes: floor?.layout_notes ?? "",
      is_published: floor?.is_published ?? true,
      order: floor?.order ?? 0,
    });
    setFloorModalOpen(true);
  };

  const openUnitModal = (unit?: PropertyUnit) => {
    setEditingUnit(unit ?? null);
    unitForm.setFieldsValue({
      floor: unit?.floor ?? floors[0]?.id,
      unit_code: unit?.unit_code ?? "",
      area_sqm: Number(unit?.area_sqm ?? 0),
      status: unit?.status ?? "available",
      notes: unit?.notes ?? "",
    });
    setUnitModalOpen(true);
  };

  const openTenantModal = (tenant?: PropertyTenant) => {
    setEditingTenant(tenant ?? null);
    setTenantLogoFile(null);
    tenantForm.setFieldsValue({
      name: tenant?.name ?? "",
      company: tenant?.company ?? "",
      phone: tenant?.phone ?? "",
      email: tenant?.email ?? "",
      registration_number: tenant?.registration_number ?? "",
      address: tenant?.address ?? "",
      notes: tenant?.notes ?? "",
      is_active: tenant?.is_active ?? true,
    });
    setTenantModalOpen(true);
  };

  const openContractModal = (contract?: LeaseContract) => {
    setEditingContract(contract ?? null);
    contractForm.setFieldsValue({
      contract_number: contract?.contract_number ?? "",
      unit: contract?.unit ?? units[0]?.id,
      tenant: contract?.tenant ?? tenants[0]?.id,
      status: contract?.status ?? "draft",
      start_date: contract?.start_date ? dayjs(contract.start_date) : null,
      end_date: contract?.end_date ? dayjs(contract.end_date) : null,
      rent_amount: Number(contract?.rent_amount ?? 0),
      service_charge: Number(contract?.service_charge ?? 0),
      deposit_amount: Number(contract?.deposit_amount ?? 0),
      billing_cycle: contract?.billing_cycle ?? "monthly",
      notes: contract?.notes ?? "",
    });
    setContractModalOpen(true);
  };

  const saveFloor = async () => {
    const values = await floorForm.validateFields();
    setSaving(true);
    try {
      if (editingFloor) await updatePropertyFloor(editingFloor.id, values);
      else await createPropertyFloor(values);
      message.success(editingFloor ? "Floor updated." : "Floor created.");
      setFloorModalOpen(false);
      await load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to save floor.");
    } finally {
      setSaving(false);
    }
  };

  const saveUnit = async () => {
    const values = await unitForm.validateFields();
    setSaving(true);
    try {
      if (editingUnit) await updatePropertyUnit(editingUnit.id, values);
      else await createPropertyUnit(values);
      message.success(editingUnit ? "Unit updated." : "Unit created.");
      setUnitModalOpen(false);
      await load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to save unit.");
    } finally {
      setSaving(false);
    }
  };

  const saveTenant = async () => {
    const values = await tenantForm.validateFields();
    setSaving(true);
    try {
      if (tenantLogoFile) {
        const formData = tenantFormData(values, tenantLogoFile);
        if (editingTenant) await updatePropertyTenantWithLogo(editingTenant.id, formData);
        else await createPropertyTenantWithLogo(formData);
      } else if (editingTenant) await updatePropertyTenant(editingTenant.id, values);
      else await createPropertyTenant(values);
      message.success(editingTenant ? "Tenant updated." : "Tenant created.");
      setTenantModalOpen(false);
      await load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to save tenant.");
    } finally {
      setSaving(false);
    }
  };

  const saveContract = async () => {
    const values = await contractForm.validateFields();
    const payload = {
      ...values,
      start_date: values.start_date ? values.start_date.format("YYYY-MM-DD") : null,
      end_date: values.end_date ? values.end_date.format("YYYY-MM-DD") : null,
    };
    setSaving(true);
    try {
      if (editingContract) await updateLeaseContract(editingContract.id, payload);
      else await createLeaseContract(payload);
      message.success(editingContract ? "Contract updated." : "Contract created.");
      setContractModalOpen(false);
      await load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to save contract.");
    } finally {
      setSaving(false);
    }
  };

  const removeFloor = async (id: number) => {
    try {
      await deletePropertyFloor(id);
      message.success("Floor deleted.");
      await load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to delete floor.");
    }
  };

  const removeUnit = async (id: number) => {
    try {
      await deletePropertyUnit(id);
      message.success("Unit deleted.");
      await load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to delete unit.");
    }
  };

  const removeTenant = async (id: number) => {
    try {
      await deletePropertyTenant(id);
      message.success("Tenant deleted.");
      await load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to delete tenant.");
    }
  };

  const removeContract = async (id: number) => {
    try {
      await deleteLeaseContract(id);
      message.success("Contract deleted.");
      await load();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to delete contract.");
    }
  };

  const floorsByBuilding = useMemo(() => {
    if (buildingFilter === "all") return floors;
    return floors.filter((floor) => floor.building === buildingFilter);
  }, [buildingFilter, floors]);

  const newButton = useMemo(() => {
    if (activeView === "floors") return { label: "New Floor", onClick: () => openFloorModal() };
    if (activeView === "units") return { label: "New Unit", onClick: () => openUnitModal() };
    if (activeView === "tenants") return { label: "New Tenant", onClick: () => openTenantModal() };
    if (activeView === "contracts") return { label: "New Contract", onClick: () => openContractModal() };
    return null;
  }, [activeView, floors, tenants, units]);

  const floorColumns: ColumnsType<PropertyFloor> = [
    { title: "Building", dataIndex: "building_name", key: "building_name" },
    {
      title: "Floor",
      key: "floor",
      render: (_, floor) => floor.label || `${floor.floor_number}F`,
    },
    { title: "Units", dataIndex: "unit_count", key: "unit_count" },
    { title: "Available", dataIndex: "available_count", key: "available_count" },
    {
      title: "Published",
      dataIndex: "is_published",
      key: "is_published",
      render: (value: boolean) => <Tag color={value ? "green" : "default"}>{value ? "Yes" : "No"}</Tag>,
    },
    {
      title: "",
      key: "actions",
      align: "right",
      render: (_, floor) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openFloorModal(floor)}>
            Edit
          </Button>
          <Popconfirm title="Delete this floor?" onConfirm={() => removeFloor(floor.id)}>
            <Button danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const unitColumns: ColumnsType<PropertyUnit> = [
    { title: "Building", dataIndex: "building_name", key: "building_name" },
    {
      title: "Floor",
      key: "floor",
      render: (_, unit) => unit.floor_label || `${unit.floor_number}F`,
    },
    { title: "Unit", dataIndex: "unit_code", key: "unit_code" },
    { title: "Area", key: "area", render: (_, unit) => formatArea(unit.area_sqm) },
    {
      title: "Status",
      key: "status",
      render: (_, unit) => <Tag color={UNIT_STATUS_COLORS[unit.status]}>{UNIT_STATUS_LABELS[unit.status]}</Tag>,
    },
    {
      title: "Tenant",
      key: "tenant",
      render: (_, unit) => unit.active_contract?.tenant_company || unit.active_contract?.tenant_name || "-",
    },
    {
      title: "",
      key: "actions",
      align: "right",
      render: (_, unit) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openUnitModal(unit)}>
            Edit
          </Button>
          <Popconfirm title="Delete this unit?" onConfirm={() => removeUnit(unit.id)}>
            <Button danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tenantColumns: ColumnsType<PropertyTenant> = [
    {
      title: "Tenant",
      key: "tenant",
      render: (_, tenant) => (
        <div className={styles.tenantCell}>
          <Avatar shape="square" size={28} src={tenant.logo_url || undefined}>
            {(tenant.company || tenant.name || "?").charAt(0)}
          </Avatar>
          <div>
            <strong>{tenant.company || tenant.name}</strong>
            {tenant.company ? <span className={styles.muted}> · {tenant.name}</span> : null}
          </div>
        </div>
      ),
    },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Active Contracts", dataIndex: "active_contract_count", key: "active_contract_count" },
    {
      title: "Active",
      dataIndex: "is_active",
      key: "is_active",
      render: (value: boolean) => <Tag color={value ? "green" : "default"}>{value ? "Yes" : "No"}</Tag>,
    },
    {
      title: "",
      key: "actions",
      align: "right",
      render: (_, tenant) => (
        <Space onClick={(event) => event.stopPropagation()}>
          <Button icon={<EditOutlined />} size="small" onClick={() => openTenantModal(tenant)}>
            Edit
          </Button>
          <Popconfirm title="Delete this tenant?" onConfirm={() => removeTenant(tenant.id)}>
            <Button danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const contractColumns: ColumnsType<LeaseContract> = [
    { title: "Contract", dataIndex: "contract_number", key: "contract_number" },
    {
      title: "Tenant",
      key: "tenant",
      render: (_, contract) => contract.tenant_company || contract.tenant_name,
    },
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
    {
      title: "",
      key: "actions",
      align: "right",
      render: (_, contract) => (
        <Space onClick={(event) => event.stopPropagation()}>
          <Button icon={<EditOutlined />} size="small" onClick={() => openContractModal(contract)}>
            Edit
          </Button>
          <Popconfirm title="Delete this contract?" onConfirm={() => removeContract(contract.id)}>
            <Button danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rentScheduleColumns: ColumnsType<LeaseRentScheduleLine> = [
    { title: "Contract", dataIndex: "contract_number", key: "contract_number" },
    {
      title: "Tenant",
      key: "tenant",
      render: (_, line) => line.tenant_company || line.tenant_name,
    },
    {
      title: "Unit",
      key: "unit",
      render: (_, line) => `${line.building_name} · ${line.floor_number}F · ${line.unit_code}`,
    },
    { title: "Period Start", dataIndex: "period_start", key: "period_start", render: formatDate },
    { title: "Period End", dataIndex: "period_end", key: "period_end", render: formatDate },
    { title: "Due Date", dataIndex: "due_date", key: "due_date", render: formatDate },
    { title: "Total", key: "total", render: (_, line) => formatMoney(line.total_amount) },
    { title: "Invoice", dataIndex: "invoice_reference", key: "invoice_reference", render: (value: string) => value || "Draft" },
    {
      title: "Status",
      key: "status",
      render: (_, line) => <Tag color={RENT_SCHEDULE_STATUS_COLORS[line.status]}>{line.status_label}</Tag>,
    },
  ];

  const rentalInvoiceColumns: ColumnsType<LeaseRentScheduleLine> = [
    { title: "Invoice", dataIndex: "invoice_reference", key: "invoice_reference", render: (value: string) => value || "Draft" },
    { title: "Contract", dataIndex: "contract_number", key: "contract_number" },
    {
      title: "Customer",
      key: "tenant",
      render: (_, line) => line.tenant_company || line.tenant_name,
    },
    {
      title: "Unit",
      key: "unit",
      render: (_, line) => `${line.building_name} · ${line.floor_number}F · ${line.unit_code}`,
    },
    { title: "Invoice Date", dataIndex: "created_at", key: "created_at", render: formatDate },
    { title: "Due Date", dataIndex: "due_date", key: "due_date", render: formatDate },
    { title: "Amount Due", key: "amount", render: (_, line) => formatMoney(line.total_amount) },
    {
      title: "Status",
      key: "status",
      render: (_, line) => <Tag color={RENT_SCHEDULE_STATUS_COLORS[line.status]}>{RENT_SCHEDULE_STATUS_LABELS[line.status]}</Tag>,
    },
  ];

  const recentContractColumns: ColumnsType<LeaseContract> = [
    { title: "Contract", dataIndex: "contract_number", key: "contract_number" },
    {
      title: "Tenant",
      key: "tenant",
      render: (_, contract) => contract.tenant_company || contract.tenant_name,
    },
    {
      title: "Unit",
      key: "unit",
      render: (_, contract) => `${contract.building_name} · ${contract.floor_number}F · ${contract.unit_code}`,
    },
    {
      title: "Status",
      key: "status",
      render: (_, contract) => <Tag color={CONTRACT_STATUS_COLORS[contract.status]}>{CONTRACT_STATUS_LABELS[contract.status]}</Tag>,
    },
    { title: "Start", dataIndex: "start_date", key: "start_date", render: formatDate },
    { title: "Rent", key: "rent", render: (_, contract) => formatMoney(contract.rent_amount) },
  ];

  const expiringContractColumns: ColumnsType<LeaseContract> = [
    { title: "Contract", dataIndex: "contract_number", key: "contract_number" },
    {
      title: "Tenant",
      key: "tenant",
      render: (_, contract) => contract.tenant_company || contract.tenant_name,
    },
    { title: "End Date", dataIndex: "end_date", key: "end_date", render: formatDate },
    {
      title: "Unit",
      key: "unit",
      render: (_, contract) => `${contract.building_name} · ${contract.floor_number}F · ${contract.unit_code}`,
    },
  ];

  const overdueAccountColumns: ColumnsType<PropertyOverdueAccount> = [
    {
      title: "Tenant",
      key: "tenant",
      render: (_, account) => account.contract__tenant__company || account.contract__tenant__name,
    },
    { title: "Contract", dataIndex: "contract__contract_number", key: "contract" },
    {
      title: "Unit",
      key: "unit",
      render: (_, account) =>
        `${account.contract__unit__floor__building__name} · ${account.contract__unit__floor__floor_number}F · ${account.contract__unit__unit_code}`,
    },
    { title: "Unpaid Months", dataIndex: "unpaid_months", key: "unpaid_months" },
    { title: "Oldest Due", dataIndex: "oldest_due_date", key: "oldest_due_date", render: formatDate },
    { title: "Amount", key: "amount", render: (_, account) => formatMoney(account.overdue_amount) },
  ];

  const rentStatusColumns: ColumnsType<{
    status: LeaseRentScheduleStatus;
    count: number;
    amount: string | number;
  }> = [
    {
      title: "Status",
      key: "status",
      render: (_, item) => <Tag color={RENT_SCHEDULE_STATUS_COLORS[item.status]}>{RENT_SCHEDULE_STATUS_LABELS[item.status]}</Tag>,
    },
    { title: "Lines", dataIndex: "count", key: "count" },
    { title: "Amount", key: "amount", render: (_, item) => formatMoney(item.amount) },
  ];

  const totals = summary?.summary;
  const reports = summary?.reports;

  const renderDashboard = () => (
    <>
      <Row gutter={[12, 12]} className={styles.metrics}>
        <Col xs={12} lg={6}>
          {metricCard("Buildings", totals?.building_count ?? 0, <BankOutlined />)}
        </Col>
        <Col xs={12} lg={6}>
          {metricCard("Available Units", totals?.available_count ?? 0, <HomeOutlined />)}
        </Col>
        <Col xs={12} lg={6}>
          {metricCard("Rented Units", totals?.rented_count ?? 0, <ApartmentOutlined />)}
        </Col>
        <Col xs={12} lg={6}>
          {metricCard("Active Contracts", totals?.active_contract_count ?? 0, <FileProtectOutlined />)}
        </Col>
      </Row>

      <PropertyStackingDashboard
        buildings={buildings}
        floors={floors}
        units={units}
        onRefresh={load}
      />
    </>
  );

  const renderBuildings = () => (
    <div className={styles.buildingGrid}>
      {buildings.map((building) => {
        const occupied = building.rented_count + building.reserved_count;
        const occupancy = building.unit_count ? Math.round((occupied / building.unit_count) * 100) : 0;
        return (
          <Card key={building.id} className={styles.buildingCard} bodyStyle={{ padding: 0 }}>
            <div className={styles.buildingImageWrap}>
              <img
                alt={building.name}
                className={styles.buildingImage}
                src={building.image || "/images/renders/render-41.jpg"}
                style={{ objectPosition: BUILDING_IMAGE_POSITIONS[building.kind] ?? "50% 50%" }}
              />
              <Tag className={styles.buildingTag}>{building.is_active ? "Active" : "Inactive"}</Tag>
            </div>
            <div className={styles.buildingBody}>
              <div className={styles.buildingTitleRow}>
                <div>
                  <h3>{building.name}</h3>
                  {building.description ? <p>{building.description}</p> : null}
                </div>
                <span className={styles.occupancy}>{occupancy}%</span>
              </div>
              <div className={styles.progressTrack}>
                <span style={{ width: `${occupancy}%` }} />
              </div>
              <div className={styles.buildingStats}>
                <span>
                  <strong>{building.floor_count}</strong>
                  Floors
                </span>
                <span>
                  <strong>{building.unit_count}</strong>
                  Units
                </span>
                <span>
                  <strong>{building.available_count}</strong>
                  Available
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  const renderFilters = (showStatus = false, contractStatuses = false) => (
    <div className={styles.searchArea}>
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder="Search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <Select value={buildingFilter} options={buildingOptions} onChange={setBuildingFilter} />
      {showStatus ? (
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All Statuses" },
            ...(contractStatuses
              ? Object.entries(CONTRACT_STATUS_LABELS).map(([value, label]) => ({ value, label }))
              : Object.entries(UNIT_STATUS_LABELS).map(([value, label]) => ({ value, label }))),
          ]}
        />
      ) : null}
      <Button icon={<FilterOutlined />}>Filters</Button>
      <Button icon={<ReloadOutlined />} onClick={load}>
        Refresh
      </Button>
    </div>
  );

  const renderTable = () => {
    if (activeView === "buildings") return renderBuildings();
    if (activeView === "floors") {
      return (
        <>
          {renderFilters()}
          <Table rowKey="id" columns={floorColumns} dataSource={filteredFloors} pagination={{ pageSize: 100 }} />
        </>
      );
    }
    if (activeView === "units") {
      return (
        <>
          {renderFilters(true)}
          <Table rowKey="id" columns={unitColumns} dataSource={filteredUnits} pagination={{ pageSize: 100 }} />
        </>
      );
    }
    if (activeView === "tenants") {
      return (
        <>
          <div className={styles.searchArea}>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Search tenants"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Button icon={<ReloadOutlined />} onClick={load}>
              Refresh
            </Button>
          </div>
          <Table
            rowKey="id"
            columns={tenantColumns}
            dataSource={filteredTenants}
            pagination={{ pageSize: 100 }}
            onRow={(tenant) => ({
              onClick: () => router.push(`/dashboard/property/tenants/${tenant.id}`),
            })}
          />
        </>
      );
    }
    if (activeView === "contracts") {
      return (
        <>
          {renderFilters(true, true)}
          <Table
            rowKey="id"
            columns={contractColumns}
            dataSource={filteredContracts}
            pagination={{ pageSize: 100 }}
            onRow={(contract) => ({
              onClick: () => router.push(`/dashboard/property/contracts/${contract.id}`),
            })}
          />
        </>
      );
    }
    if (activeView === "rent-schedule") {
      return (
        <>
          <div className={styles.searchArea}>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Search rent schedule"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Select value={buildingFilter} options={buildingOptions} onChange={setBuildingFilter} />
            <Button icon={<ReloadOutlined />} onClick={load}>
              Refresh
            </Button>
          </div>
          <Table
            rowKey="id"
            columns={rentScheduleColumns}
            dataSource={filteredRentScheduleLines}
            pagination={{ pageSize: 100 }}
            onRow={(line) => ({
              onClick: () => router.push(`/dashboard/property/rent-schedule/${line.id}`),
            })}
          />
        </>
      );
    }
    if (activeView === "rental-invoices") {
      return (
        <>
          <div className={styles.searchArea}>
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Search invoices"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Select value={buildingFilter} options={buildingOptions} onChange={setBuildingFilter} />
            <Button icon={<ReloadOutlined />} onClick={load}>
              Refresh
            </Button>
          </div>
          <Table
            rowKey="id"
            columns={rentalInvoiceColumns}
            dataSource={filteredRentalInvoices}
            pagination={{ pageSize: 100 }}
            onRow={(line) => ({
              onClick: () => router.push(`/dashboard/property/rent-schedule/${line.id}`),
            })}
          />
        </>
      );
    }
    return (
      <Card className={styles.placeholder}>
        <h3>{activeView}</h3>
        <p>{FINANCE_NOTES[activeView] ?? "This module will use normalized property data."}</p>
      </Card>
    );
  };

  return (
    <Spin spinning={loading}>
      <section className={styles.shell}>
        <div className={styles.pageHead}>
          <div>
            <span className={styles.eyebrow}>Property Management</span>
            <h1>
              {activeView === "dashboard" || activeView === "stacking"
                ? "Stacking Plan"
                : activeView.replace("-", " ")}
            </h1>
            <p>Manage buildings, floors, units, tenants, and lease contracts from the normalized database.</p>
          </div>
          <div className={styles.pager}>
            {newButton ? (
              <Button type="primary" icon={<PlusOutlined />} onClick={newButton.onClick}>
                {newButton.label}
              </Button>
            ) : null}
          </div>
        </div>

        <div className={styles.viewWrap}>
          {activeView === "dashboard" || activeView === "stacking"
            ? renderDashboard()
            : renderTable()}
        </div>

        <Modal
          title={editingFloor ? "Edit Floor" : "New Floor"}
          open={floorModalOpen}
          onCancel={() => setFloorModalOpen(false)}
          onOk={saveFloor}
          confirmLoading={saving}
          destroyOnClose
        >
          <Form form={floorForm} layout="vertical">
            <Form.Item name="building" label="Building" rules={[{ required: true }]}>
              <Select options={buildings.map((building) => ({ value: building.id, label: building.name }))} />
            </Form.Item>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="floor_number" label="Floor Number" rules={[{ required: true }]}>
                  <InputNumber min={0} className={styles.fullWidth} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="order" label="Order">
                  <InputNumber min={0} className={styles.fullWidth} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="label" label="Label">
              <Input placeholder="12F" />
            </Form.Item>
            <Form.Item name="layout_notes" label="Layout Notes">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="is_published" label="Published" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={editingUnit ? "Edit Unit" : "New Unit"}
          open={unitModalOpen}
          onCancel={() => setUnitModalOpen(false)}
          onOk={saveUnit}
          confirmLoading={saving}
          destroyOnClose
        >
          <Form form={unitForm} layout="vertical">
            <Form.Item name="floor" label="Floor" rules={[{ required: true }]}>
              <Select
                showSearch
                optionFilterProp="label"
                options={floorsByBuilding.map((floor) => ({
                  value: floor.id,
                  label: `${floor.building_name} · ${floor.label || `${floor.floor_number}F`}`,
                }))}
              />
            </Form.Item>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="unit_code" label="Unit Code" rules={[{ required: true }]}>
                  <Input placeholder="A-1201" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="area_sqm" label="Area (m²)" rules={[{ required: true }]}>
                  <InputNumber min={0} className={styles.fullWidth} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select options={Object.entries(UNIT_STATUS_LABELS).map(([value, label]) => ({ value, label }))} />
            </Form.Item>
            <Form.Item name="notes" label="Notes">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={editingTenant ? "Edit Tenant" : "New Tenant"}
          open={tenantModalOpen}
          onCancel={() => setTenantModalOpen(false)}
          onOk={saveTenant}
          confirmLoading={saving}
          destroyOnClose
        >
          <Form form={tenantForm} layout="vertical">
            <Form.Item label="Logo">
              <div className={styles.logoUploadRow}>
                <Avatar shape="square" size={44} src={tenantLogoFile ? URL.createObjectURL(tenantLogoFile) : editingTenant?.logo_url || undefined}>
                  {(editingTenant?.company || editingTenant?.name || "T").charAt(0)}
                </Avatar>
                <Upload
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  beforeUpload={(file) => {
                    setTenantLogoFile(file);
                    return false;
                  }}
                  maxCount={1}
                  onRemove={() => {
                    setTenantLogoFile(null);
                  }}
                >
                  <Button>Upload Logo</Button>
                </Upload>
                <span className={styles.muted}>JPG, PNG, GIF, WEBP · max 5MB</span>
              </div>
            </Form.Item>
            <Form.Item name="name" label="Contact Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="company" label="Company">
              <Input />
            </Form.Item>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="phone" label="Phone">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="email" label="Email">
                  <Input type="email" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="registration_number" label="Registration Number">
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Address">
              <Input />
            </Form.Item>
            <Form.Item name="notes" label="Notes">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="is_active" label="Active" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={editingContract ? "Edit Contract" : "New Contract"}
          open={contractModalOpen}
          onCancel={() => setContractModalOpen(false)}
          onOk={saveContract}
          confirmLoading={saving}
          destroyOnClose
        >
          <Form form={contractForm} layout="vertical">
            <Form.Item name="contract_number" label="Contract Number">
              <Input placeholder="Auto-generated if empty" />
            </Form.Item>
            <Form.Item name="tenant" label="Tenant" rules={[{ required: true }]}>
              <Select
                showSearch
                optionFilterProp="label"
                options={tenants.map((tenant) => ({
                  value: tenant.id,
                  label: tenant.company ? `${tenant.company} · ${tenant.name}` : tenant.name,
                }))}
              />
            </Form.Item>
            <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
              <Select
                showSearch
                optionFilterProp="label"
                options={units.map((unit) => ({
                  value: unit.id,
                  label: `${unit.building_name} · ${unit.floor_label || `${unit.floor_number}F`} · ${unit.unit_code}`,
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
