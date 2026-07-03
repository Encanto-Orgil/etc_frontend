export type OfficeUnitStatus = "available" | "rented" | "reserved" | "unavailable";

export type OfficeUnit = {
  id: number;
  unit_code: string;
  area_sqm: string;
  status: OfficeUnitStatus;
  status_label: string;
  tenant_name: string;
  notes: string;
};

export type OfficeFloor = {
  id: number;
  floor_number: number;
  label: string;
  layout_notes: string;
  units: OfficeUnit[];
};

export type OfficeStackingPlan = {
  floors: OfficeFloor[];
  summary: {
    floor_count: number;
    unit_count: number;
    available_count: number;
    units_per_floor: number;
  };
};

export const STATUS_META: Record<
  OfficeUnitStatus,
  { label: string; color: string; bg: string }
> = {
  available: { label: "Available for lease", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  rented: { label: "Leased", color: "#94a3b8", bg: "rgba(148,163,184,0.15)" },
  reserved: { label: "Reserved", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  unavailable: { label: "Unavailable", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};
