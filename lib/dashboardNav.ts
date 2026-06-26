import { TOWER_KIND_LABELS, type TowerKind } from "./stacking";

export const DASHBOARD_PAGES: Record<string, { eyebrow: string; title: string }> = {
  "/dashboard": { eyebrow: "Удирдлага", title: "Тойм" },
  "/dashboard/stacking": { eyebrow: "", title: "Түрээсийн төлөвлөлтийн тойм" },
};

const KIND_PATH = /^\/dashboard\/stacking\/(office|mall|apartment)$/;

export function getDashboardPageMeta(pathname: string) {
  const kindMatch = pathname.match(KIND_PATH);
  if (kindMatch) {
    const kind = kindMatch[1] as TowerKind;
    return {
      eyebrow: "",
      title: TOWER_KIND_LABELS[kind],
    };
  }

  return DASHBOARD_PAGES[pathname] ?? { eyebrow: "Удирдлага", title: "Хяналтын самбар" };
}

export function isStackingSection(pathname: string) {
  return pathname === "/dashboard/stacking" || pathname.startsWith("/dashboard/stacking/");
}
