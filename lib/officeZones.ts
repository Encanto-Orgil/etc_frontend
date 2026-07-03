import type { OfficeFloor } from "./officeStacking";

export type OfficeZone = {
  id: string;
  min: number;
  max: number;
  label: string;
  title: string;
  description: string;
  bullets: string[];
};

export const OFFICE_ZONES: OfficeZone[] = [
  {
    id: "1-8",
    min: 1,
    max: 8,
    label: "1–8",
    title: "Lower floors",
    description: "Office floors close to the podium with flexible planning options.",
    bullets: [
      "4 office suites per floor (A–D)",
      "Open-plan layouts with flexible partitioning",
      "High-speed elevators and glass facade",
    ],
  },
  {
    id: "9-16",
    min: 9,
    max: 16,
    label: "9–16",
    title: "Mid-rise floors",
    description: "Grade-A workspace with panoramic city views.",
    bullets: [
      "Panoramic glazing and natural daylight",
      "Smart ventilation and access control",
      "Corporate suites and open office layouts",
    ],
  },
  {
    id: "17-24",
    min: 17,
    max: 24,
    label: "17–24",
    title: "Upper floors",
    description: "Premium office solutions at the top of the tower.",
    bullets: [
      "Exclusive upper-level views",
      "VIP lift access and premium lobby",
      "Large floorplates for enterprise headquarters",
    ],
  },
];

export function zoneForFloor(floorNumber: number): OfficeZone | undefined {
  return OFFICE_ZONES.find((z) => floorNumber >= z.min && floorNumber <= z.max);
}

export function floorsInZone(floors: OfficeFloor[], zone: OfficeZone): OfficeFloor[] {
  return floors.filter((f) => f.floor_number >= zone.min && f.floor_number <= zone.max);
}

export function availableCount(floor: OfficeFloor): number {
  return floor.units.filter((u) => u.status === "available").length;
}

export function isFullyRented(floor: OfficeFloor): boolean {
  return floor.units.length > 0 && floor.units.every((u) => u.status === "rented");
}
