import type { OfficeFloor } from "./officeStacking";

export type ResidenceZone = {
  id: string;
  min: number;
  max: number;
  label: string;
  title: string;
  description: string;
  bullets: string[];
};

export const RESIDENCE_FLOOR_MIN = 5;
export const RESIDENCE_FLOOR_MAX = 34;

export const RESIDENCE_ZONES: ResidenceZone[] = [
  {
    id: "5-12",
    min: 5,
    max: 12,
    label: "5–12",
    title: "Lower Residence",
    description: "Accessible luxury with strong city connections and everyday convenience.",
    bullets: ["Studio & 1-bedroom layouts", "Direct mall access", "Smart home ready"],
  },
  {
    id: "13-22",
    min: 13,
    max: 22,
    label: "13–22",
    title: "Mid-Rise Living",
    description: "Elevated panoramas with balanced privacy and urban energy.",
    bullets: ["1 & 2-bedroom residences", "Expanded city views", "Premium finishes"],
  },
  {
    id: "23-30",
    min: 23,
    max: 30,
    label: "23–30",
    title: "Sky Collection",
    description: "High-floor residences with sweeping skyline perspectives.",
    bullets: ["2 & 3-bedroom premium", "Corner units available", "Sunset-facing options"],
  },
  {
    id: "31-34",
    min: 31,
    max: 34,
    label: "31–34",
    title: "Penthouse Level",
    description: "Ultra-luxury top-floor residences with bespoke layouts.",
    bullets: ["Penthouse collection", "Private elevator access", "Custom interior planning"],
  },
];

export const VIEW_FILTERS = [
  { id: "all", label: "All Views" },
  { id: "north", label: "North View", min: 5, max: 14 },
  { id: "south", label: "South View", min: 15, max: 24 },
  { id: "city", label: "City View", min: 25, max: 34 },
] as const;

export type ViewFilterId = (typeof VIEW_FILTERS)[number]["id"];

export function zoneForFloor(floorNumber: number): ResidenceZone | undefined {
  return RESIDENCE_ZONES.find((z) => floorNumber >= z.min && floorNumber <= z.max);
}

export function floorsInZone(floors: OfficeFloor[], zone: ResidenceZone): OfficeFloor[] {
  return floors.filter((f) => f.floor_number >= zone.min && f.floor_number <= zone.max);
}

export function availableCount(floor: OfficeFloor): number {
  return floor.units.filter((u) => u.status === "available").length;
}

export function isFullyRented(floor: OfficeFloor): boolean {
  return floor.units.length > 0 && floor.units.every((u) => u.status !== "available");
}

export function filterByView(floors: OfficeFloor[], viewId: ViewFilterId): OfficeFloor[] {
  if (viewId === "all") return floors;
  const view = VIEW_FILTERS.find((v) => v.id === viewId);
  if (!view || !("min" in view)) return floors;
  return floors.filter((f) => f.floor_number >= view.min && f.floor_number <= view.max);
}
