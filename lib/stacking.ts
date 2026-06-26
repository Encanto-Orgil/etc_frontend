export type TowerKind = "office" | "mall" | "apartment";

export type UnitStatus = "available" | "rented" | "reserved" | "unavailable";

export type StackingUnit = {
  id: number;
  floor: number;
  tower_kind: TowerKind;
  floor_number: number;
  unit_code: string;
  area_sqm: string | number;
  status: UnitStatus;
  status_label: string;
  tenant_name: string;
  tenant_phone: string;
  tenant_email: string;
  lease_start: string | null;
  lease_end: string | null;
  notes: string;
};

export type StackingFloor = {
  id: number;
  tower_kind: TowerKind;
  floor_number: number;
  label: string;
  layout_notes: string;
  is_published: boolean;
  order: number;
  units: StackingUnit[];
  unit_count: number;
  available_count: number;
};

export type StackingSummary = {
  floor_count: number;
  unit_count: number;
  available_count: number;
  rented_count: number;
  reserved_count: number;
  unavailable_count: number;
};

export type StackingPlan = {
  kind: TowerKind;
  floors: StackingFloor[];
  summary: StackingSummary;
};

export const TOWER_KIND_LABELS: Record<TowerKind, string> = {
  office: "Оффис",
  mall: "Молл",
  apartment: "Орон сууц",
};

export const UNIT_STATUS_LABELS: Record<UnitStatus, string> = {
  available: "Түрээслэх боломжтой",
  rented: "Түрээслэгдсэн",
  reserved: "Захиалсан",
  unavailable: "Боломжгүй",
};

export const UNIT_STATUS_COLORS: Record<UnitStatus, string> = {
  available: "green",
  rented: "default",
  reserved: "gold",
  unavailable: "red",
};

export const INTEREST_LABELS: Record<string, string> = {
  office: "Оффис",
  mall: "Молл",
  ballroom: "Ballroom",
  apartment: "Орон сууц",
  general: "Ерөнхий",
};

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: "Хүлээгдэж буй",
  confirmed: "Баталгаажсан",
  declined: "Татгалзсан",
  cancelled: "Цуцлагдсан",
};
