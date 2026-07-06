import { authFetch } from "./auth";

export type PropertyBuildingKind = "office" | "mall" | "apartment";
export type PropertyUnitStatus = "available" | "rented" | "reserved" | "unavailable";
export type LeaseContractStatus = "draft" | "active" | "ended" | "terminated";
export type LeaseBillingCycle = "monthly" | "quarterly" | "yearly";
export type LeaseRentScheduleStatus = "pending" | "invoiced" | "paid" | "cancelled";
export type LeaseContractAttachmentType = "pdf" | "document" | "image";

export type PropertyBuilding = {
  id: number;
  kind: PropertyBuildingKind;
  slug: string;
  name: string;
  description: string;
  image: string;
  order: number;
  is_active: boolean;
  floor_count: number;
  unit_count: number;
  available_count: number;
  rented_count: number;
  reserved_count: number;
  unavailable_count: number;
  created_at: string;
  updated_at: string;
};

export type PropertyFloor = {
  id: number;
  building: number;
  building_name: string;
  building_kind: PropertyBuildingKind;
  floor_number: number;
  label: string;
  layout_notes: string;
  is_published: boolean;
  order: number;
  unit_count: number;
  available_count: number;
  created_at: string;
  updated_at: string;
};

export type LeaseContractCompact = {
  id: number;
  contract_number: string;
  tenant: number;
  tenant_name: string;
  tenant_company: string;
  status: LeaseContractStatus;
  start_date: string | null;
  end_date: string | null;
  rent_amount: string | number;
  service_charge: string | number;
  deposit_amount: string | number;
  billing_cycle: LeaseBillingCycle;
};

export type PropertyUnit = {
  id: number;
  floor: number;
  floor_number: number;
  floor_label: string;
  building: number;
  building_name: string;
  building_kind: PropertyBuildingKind;
  unit_code: string;
  area_sqm: string | number;
  status: PropertyUnitStatus;
  status_label: string;
  notes: string;
  active_contract: LeaseContractCompact | null;
  created_at: string;
  updated_at: string;
};

export type PropertyTenant = {
  id: number;
  name: string;
  company: string;
  phone: string;
  email: string;
  registration_number: string;
  address: string;
  logo: string | null;
  logo_url: string;
  notes: string;
  is_active: boolean;
  portal_enabled: boolean;
  portal_username: string;
  contract_count: number;
  active_contract_count: number;
  created_at: string;
  updated_at: string;
};

export type LeaseContract = LeaseContractCompact & {
  unit: number;
  unit_code: string;
  floor_number: number;
  building: number;
  building_name: string;
  building_kind: PropertyBuildingKind;
  status_label: string;
  billing_cycle_label: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type LeaseRentScheduleLine = {
  id: number;
  contract: number;
  contract_number: string;
  tenant: number;
  tenant_name: string;
  tenant_company: string;
  unit: number;
  unit_code: string;
  building: number;
  building_name: string;
  floor_number: number;
  period_start: string;
  period_end: string;
  due_date: string;
  rent_amount: string | number;
  service_charge: string | number;
  total_amount: string | number;
  status: LeaseRentScheduleStatus;
  status_label: string;
  invoice_reference: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type GenerateRentScheduleResponse = {
  created_count: number;
  updated_count: number;
  skipped_count: number;
  results: LeaseRentScheduleLine[];
};

export type LeaseContractAttachment = {
  id: number;
  contract: number;
  file: string;
  file_url: string;
  original_name: string;
  content_type: string;
  size: number;
  attachment_type: LeaseContractAttachmentType;
  notes: string;
  uploaded_by: number | null;
  uploaded_by_name: string;
  created_at: string;
};

export type PropertyOverdueAccount = {
  contract_id: number;
  contract__contract_number: string;
  contract__tenant_id: number;
  contract__tenant__name: string;
  contract__tenant__company: string;
  contract__unit__unit_code: string;
  contract__unit__floor__floor_number: number;
  contract__unit__floor__building__name: string;
  unpaid_months: number;
  overdue_amount: string | number;
  oldest_due_date: string;
};

export type PropertySummary = {
  summary: {
    building_count: number;
    floor_count: number;
    unit_count: number;
    tenant_count: number;
    contract_count: number;
    active_contract_count: number;
    available_count: number;
    rented_count: number;
    reserved_count: number;
    unavailable_count: number;
  };
  buildings: PropertyBuilding[];
  reports: {
    current_month_receivables: {
      period_start: string;
      period_end: string;
      total_due: string | number;
      paid_amount: string | number;
      unpaid_amount: string | number;
      paid_count: number;
      unpaid_count: number;
      collection_rate: number;
    };
    overdue_receivables: {
      as_of: string;
      line_count: number;
      contract_count: number;
      amount: string | number;
      accounts: PropertyOverdueAccount[];
    };
    recent_contracts: LeaseContract[];
    expiring_contracts: LeaseContract[];
    rent_status_breakdown: Array<{
      status: LeaseRentScheduleStatus;
      count: number;
      amount: string | number;
    }>;
  };
};

type ListEnvelope<T> = T[] | { results: T[] };
type Query = Record<string, string | number | boolean | null | undefined>;

function queryString(query?: Query) {
  const params = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "" || value === "all") return;
    params.set(key, String(value));
  });
  const text = params.toString();
  return text ? `?${text}` : "";
}

function unwrapList<T>(data: ListEnvelope<T>): T[] {
  return Array.isArray(data) ? data : data.results;
}

async function parseError(res: Response, fallback: string) {
  const data = await res.json().catch(() => ({}));
  if (typeof data.detail === "string") return data.detail;
  const first = Object.values(data).flat()[0];
  if (typeof first === "string") return first;
  return fallback;
}

async function fetchList<T>(path: string, query?: Query): Promise<T[]> {
  const res = await authFetch(`${path}${queryString(query)}`);
  if (!res.ok) throw new Error(await parseError(res, "Failed to load property data."));
  return unwrapList<T>(await res.json());
}

async function fetchOne<T>(path: string, init?: RequestInit, fallback = "Request failed."): Promise<T> {
  const res = await authFetch(path, init);
  if (!res.ok) throw new Error(await parseError(res, fallback));
  return res.json();
}

async function send<T>(path: string, method: "POST" | "PATCH", payload: object, fallback: string) {
  return fetchOne<T>(
    path,
    {
      method,
      body: JSON.stringify(payload),
    },
    fallback,
  );
}

async function remove(path: string, fallback: string) {
  const res = await authFetch(path, { method: "DELETE" });
  if (!res.ok) throw new Error(await parseError(res, fallback));
}

export async function fetchPropertySummary(): Promise<PropertySummary> {
  return fetchOne<PropertySummary>("/dashboard/property/summary/");
}

export function fetchPropertyBuildings(query?: Query) {
  return fetchList<PropertyBuilding>("/dashboard/property/buildings/", query);
}

export function createPropertyBuilding(payload: Partial<PropertyBuilding>) {
  return send<PropertyBuilding>("/dashboard/property/buildings/", "POST", payload, "Failed to create building.");
}

export function updatePropertyBuilding(id: number, payload: Partial<PropertyBuilding>) {
  return send<PropertyBuilding>(`/dashboard/property/buildings/${id}/`, "PATCH", payload, "Failed to update building.");
}

export function deletePropertyBuilding(id: number) {
  return remove(`/dashboard/property/buildings/${id}/`, "Failed to delete building.");
}

export function fetchPropertyFloors(query?: Query) {
  return fetchList<PropertyFloor>("/dashboard/property/floors/", query);
}

export function createPropertyFloor(payload: Partial<PropertyFloor>) {
  return send<PropertyFloor>("/dashboard/property/floors/", "POST", payload, "Failed to create floor.");
}

export function updatePropertyFloor(id: number, payload: Partial<PropertyFloor>) {
  return send<PropertyFloor>(`/dashboard/property/floors/${id}/`, "PATCH", payload, "Failed to update floor.");
}

export function deletePropertyFloor(id: number) {
  return remove(`/dashboard/property/floors/${id}/`, "Failed to delete floor.");
}

export function fetchPropertyUnits(query?: Query) {
  return fetchList<PropertyUnit>("/dashboard/property/units/", query);
}

export function fetchPropertyUnit(id: number) {
  return fetchOne<PropertyUnit>(`/dashboard/property/units/${id}/`, undefined, "Failed to load unit.");
}

export function createPropertyUnit(payload: Partial<PropertyUnit>) {
  return send<PropertyUnit>("/dashboard/property/units/", "POST", payload, "Failed to create unit.");
}

export function updatePropertyUnit(id: number, payload: Partial<PropertyUnit>) {
  return send<PropertyUnit>(`/dashboard/property/units/${id}/`, "PATCH", payload, "Failed to update unit.");
}

export function deletePropertyUnit(id: number) {
  return remove(`/dashboard/property/units/${id}/`, "Failed to delete unit.");
}

export function fetchPropertyTenants(query?: Query) {
  return fetchList<PropertyTenant>("/dashboard/property/tenants/", query);
}

export function fetchPropertyTenant(id: number) {
  return fetchOne<PropertyTenant>(`/dashboard/property/tenants/${id}/`, undefined, "Failed to load tenant.");
}

export function createPropertyTenant(payload: Partial<PropertyTenant>) {
  return send<PropertyTenant>("/dashboard/property/tenants/", "POST", payload, "Failed to create tenant.");
}

export function updatePropertyTenant(id: number, payload: Partial<PropertyTenant>) {
  return send<PropertyTenant>(`/dashboard/property/tenants/${id}/`, "PATCH", payload, "Failed to update tenant.");
}

export function createPropertyTenantWithLogo(formData: FormData) {
  return fetchOne<PropertyTenant>(
    "/dashboard/property/tenants/",
    {
      method: "POST",
      body: formData,
    },
    "Failed to create tenant.",
  );
}

export function updatePropertyTenantWithLogo(id: number, formData: FormData) {
  return fetchOne<PropertyTenant>(
    `/dashboard/property/tenants/${id}/`,
    {
      method: "PATCH",
      body: formData,
    },
    "Failed to update tenant.",
  );
}

export function deletePropertyTenant(id: number) {
  return remove(`/dashboard/property/tenants/${id}/`, "Failed to delete tenant.");
}

export function enableTenantPortal(id: number, payload: { username: string; password: string }) {
  return fetchOne<PropertyTenant>(
    `/dashboard/property/tenants/${id}/enable-portal/`,
    { method: "POST", body: JSON.stringify(payload) },
    "Failed to enable tenant portal.",
  );
}

export function disableTenantPortal(id: number) {
  return fetchOne<PropertyTenant>(
    `/dashboard/property/tenants/${id}/disable-portal/`,
    { method: "POST" },
    "Failed to disable tenant portal.",
  );
}

export function fetchLeaseContracts(query?: Query) {
  return fetchList<LeaseContract>("/dashboard/property/contracts/", query);
}

export function fetchLeaseContract(id: number) {
  return fetchOne<LeaseContract>(`/dashboard/property/contracts/${id}/`, undefined, "Failed to load contract.");
}

export function createLeaseContract(payload: Partial<LeaseContract>) {
  return send<LeaseContract>("/dashboard/property/contracts/", "POST", payload, "Failed to create contract.");
}

export function updateLeaseContract(id: number, payload: Partial<LeaseContract>) {
  return send<LeaseContract>(`/dashboard/property/contracts/${id}/`, "PATCH", payload, "Failed to update contract.");
}

export function deleteLeaseContract(id: number) {
  return remove(`/dashboard/property/contracts/${id}/`, "Failed to delete contract.");
}

export function fetchLeaseRentSchedule(query?: Query) {
  return fetchList<LeaseRentScheduleLine>("/dashboard/property/rent-schedule/", query);
}

export function fetchLeaseRentScheduleLine(id: number) {
  return fetchOne<LeaseRentScheduleLine>(`/dashboard/property/rent-schedule/${id}/`, undefined, "Failed to load rent schedule line.");
}

export function generateLeaseRentSchedule(id: number, replace = true) {
  return send<GenerateRentScheduleResponse>(
    `/dashboard/property/contracts/${id}/generate-schedule/`,
    "POST",
    { replace },
    "Failed to generate rent schedule.",
  );
}

export function createInvoiceFromRentScheduleLine(id: number) {
  return send<LeaseRentScheduleLine>(
    `/dashboard/property/rent-schedule/${id}/create-invoice/`,
    "POST",
    {},
    "Failed to create invoice.",
  );
}

export function fetchLeaseContractAttachments(query?: Query) {
  return fetchList<LeaseContractAttachment>("/dashboard/property/contract-attachments/", query);
}

export function uploadLeaseContractAttachment(contractId: number, file: File, notes = "") {
  const formData = new FormData();
  formData.append("contract", String(contractId));
  formData.append("file", file);
  if (notes) formData.append("notes", notes);

  return fetchOne<LeaseContractAttachment>(
    "/dashboard/property/contract-attachments/",
    {
      method: "POST",
      body: formData,
    },
    "Failed to upload attachment.",
  );
}

export function deleteLeaseContractAttachment(id: number) {
  return remove(`/dashboard/property/contract-attachments/${id}/`, "Failed to delete attachment.");
}
