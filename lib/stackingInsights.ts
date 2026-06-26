import type { StackingSummary, TowerKind } from "./stacking";

export type StackingTowerMeta = {
  kind: TowerKind;
  title: string;
  subtitle: string;
  floorsLabel: string;
  image: string;
  accent: string;
};

export const STACKING_TOWER_META: Record<TowerKind, StackingTowerMeta> = {
  office: {
    kind: "office",
    title: "Office Tower",
    subtitle: "A зэрэглэлийн оффис цамхаг",
    floorsLabel: "24 давхар",
    image: "/images/renders/render-8.jpg",
    accent: "#0c0c0c",
  },
  mall: {
    kind: "mall",
    title: "Central Mall",
    subtitle: "Худалдаа, gastronomy, luxury retail",
    floorsLabel: "6 давхар",
    image: "/images/renders/render-40.jpg",
    accent: "#8b5a2b",
  },
  apartment: {
    kind: "apartment",
    title: "Sky Residence",
    subtitle: "Premium орон сууцны цамхаг",
    floorsLabel: "34 давхар",
    image: "/images/renders/render-20.jpg",
    accent: "#1e3a5f",
  },
};

export type StackingInsights = {
  occupancy: number;
  availability: number;
  pipeline: number;
  blocked: number;
  health: "good" | "medium" | "attention";
  healthLabel: string;
  highlight: string;
};

export function buildStackingInsights(
  summary: StackingSummary,
  kind: TowerKind,
): StackingInsights {
  const total = summary.unit_count || 1;
  const occupancy = Math.round((summary.rented_count / total) * 100);
  const availability = Math.round((summary.available_count / total) * 100);
  const pipeline = Math.round((summary.reserved_count / total) * 100);
  const blocked = Math.round((summary.unavailable_count / total) * 100);

  let health: StackingInsights["health"] = "good";
  let healthLabel = "Түрээсийн эзэлэлт тогтвортой";
  let highlight = `${summary.available_count} нэгж шууд түрээслэх боломжтой`;

  if (availability >= 55) {
    health = "attention";
    healthLabel = "Чөлөөт багтаамж өндөр — борлуулалт идэвхжүүлэх";
    highlight = `${availability}% нэгж боломжтой байна`;
  } else if (occupancy < 35) {
    health = "medium";
    healthLabel = "Эзэлэлт доогуур — сурталчилгаа шаардлагатай";
    highlight = `Зөвхөн ${occupancy}% түрээслэгдсэн`;
  } else if (pipeline >= 15) {
    health = "medium";
    healthLabel = "Захиалгын урсгал идэвхтэй";
    highlight = `${summary.reserved_count} нэгж захиалсан төлөвт`;
  }

  if (kind === "mall" && occupancy >= 60) {
    highlight = "Retail mix — гол давхрууд өндөр эзэлэлттэй";
  }
  if (kind === "apartment" && summary.rented_count >= summary.unit_count * 0.7) {
    healthLabel = "Орон сууцны эзэлэлт өндөр";
  }

  return {
    occupancy,
    availability,
    pipeline,
    blocked,
    health,
    healthLabel,
    highlight,
  };
}

export type PortfolioAiInsight = {
  summary: string;
  bullets: string[];
  tone: "positive" | "neutral" | "caution";
};

export function buildPortfolioAiInsight(
  stacking: Record<TowerKind, StackingSummary>,
): PortfolioAiInsight {
  const kinds: TowerKind[] = ["office", "mall", "apartment"];
  const labels = { office: "оффис", mall: "молл", apartment: "орон сууц" };

  const totalUnits = kinds.reduce((s, k) => s + stacking[k].unit_count, 0);
  const totalRented = kinds.reduce((s, k) => s + stacking[k].rented_count, 0);
  const totalAvailable = kinds.reduce((s, k) => s + stacking[k].available_count, 0);
  const totalReserved = kinds.reduce((s, k) => s + stacking[k].reserved_count, 0);

  const occupancy = totalUnits ? Math.round((totalRented / totalUnits) * 100) : 0;
  const availability = totalUnits ? Math.round((totalAvailable / totalUnits) * 100) : 0;

  const perKind = kinds.map((k) => ({
    kind: k,
    label: labels[k],
    ...buildStackingInsights(stacking[k], k),
  }));

  const strongest = [...perKind].sort((a, b) => b.occupancy - a.occupancy)[0];
  const weakest = [...perKind].sort((a, b) => a.occupancy - b.occupancy)[0];

  let tone: PortfolioAiInsight["tone"] = "positive";
  if (availability >= 50 || occupancy < 40) tone = "caution";
  else if (totalReserved >= 5 || weakest.occupancy < 45) tone = "neutral";

  const summary = `Нийт ${totalUnits} нэгжийн ${occupancy}% түрээслэгдсэн, ${totalAvailable} нэгж (${availability}%) боломжтой байна. ${strongest.label.charAt(0).toUpperCase() + strongest.label.slice(1)} хэсэг ${strongest.occupancy}% эзэлэлттэй хамгийн тогтвортой, ${weakest.label} хэсэгт идэвхжүүлэх боломж үлдсэн.`;

  const bullets: string[] = [
    `${perKind.find((p) => p.kind === "office")?.occupancy ?? 0}% оффис, ${perKind.find((p) => p.kind === "mall")?.occupancy ?? 0}% молл, ${perKind.find((p) => p.kind === "apartment")?.occupancy ?? 0}% орон сууцны эзэлэлт.`,
  ];

  if (totalReserved > 0) {
    bullets.push(`${totalReserved} нэгж захиалсан төлөвт — борлуулалтын багтай холбогдож баталгаажуулахыг зөвлөж байна.`);
  }

  if (availability >= 45) {
    bullets.push("Чөлөөт багтаамж өндөр тул targeted маркетинг, broker суваг, showroom үзүүлэлтийг идэвхжүүлэх нь зохимжтой.");
  } else if (occupancy >= 55) {
    bullets.push("Ерөнхий эзэлэлт сайн байна. Renewal, upsell болон түрээслэгчийн туршлагыг сайжруулахад анхаарлаа төвлөрүүлээрэй.");
  } else {
    bullets.push("Эзэлэлт дундаж түвшинд байна. Оффис, retail, residence бүрийн pipeline-ийг тусад нь хянах шаардлагатай.");
  }

  return { summary, bullets, tone };
}

export function formatStackingUpdatedAt(date: Date): string {
  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
