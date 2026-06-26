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
    title: "Доод давхар",
    description: "Суурьт ойр, уян хатан төлөвлөлттэй оффисын давхарууд.",
    bullets: [
      "Давхар бүрт 4 оффис (A–D)",
      "Нээлттэй төлөвлөлт, уян хатан хуваалт",
      "Өндөр хурдны лифт, шилэн фасад",
    ],
  },
  {
    id: "9-16",
    min: 9,
    max: 16,
    label: "9–16",
    title: "Дунд давхар",
    description: "Хотын панорам үзэмжтэй, A зэрэглэлийн ажлын орчин.",
    bullets: [
      "Панорам шилэн фасад, байгалийн гэрэл",
      "Ухаалаг агааржуулалт, хяналтын систем",
      "Corporate suite болон нээлттэй оффис",
    ],
  },
  {
    id: "17-24",
    min: 17,
    max: 24,
    label: "17–24",
    title: "Дээд давхар",
    description: "Төслийн дээд хэсгийн premium оффисын шийдэл.",
    bullets: [
      "Exclusive дээд давхрын үзэмж",
      "VIP lift access, premium lobby",
      "Томоохон корпорацид тохирсон талбай",
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
