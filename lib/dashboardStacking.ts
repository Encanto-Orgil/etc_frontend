import { authFetch } from "./auth";
import type { StackingFloor, StackingPlan, StackingUnit, TowerKind } from "./stacking";

async function parseError(res: Response, fallback: string) {
  const data = await res.json().catch(() => ({}));
  if (typeof data.detail === "string") return data.detail;
  const first = Object.values(data).flat()[0];
  if (typeof first === "string") return first;
  return fallback;
}

export async function fetchDashboardStacking(kind: TowerKind): Promise<StackingPlan | null> {
  const res = await authFetch(`/dashboard/stacking/?kind=${kind}`);
  if (!res.ok) return null;
  return res.json();
}

export async function createStackingFloor(
  payload: Partial<StackingFloor> & { tower_kind: TowerKind; floor_number: number },
): Promise<StackingFloor> {
  const res = await authFetch("/dashboard/stacking/floors/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res, "Давхар нэмэхэд алдаа гарлаа."));
  return res.json();
}

export async function updateStackingFloor(
  id: number,
  payload: Partial<StackingFloor>,
): Promise<StackingFloor> {
  const res = await authFetch(`/dashboard/stacking/floors/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res, "Давхар шинэчлэхэд алдаа гарлаа."));
  return res.json();
}

export async function deleteStackingFloor(id: number) {
  const res = await authFetch(`/dashboard/stacking/floors/${id}/`, { method: "DELETE" });
  if (!res.ok) throw new Error(await parseError(res, "Давхар устгахад алдаа гарлаа."));
}

export async function createStackingUnit(
  payload: Partial<StackingUnit> & { floor: number; unit_code: string },
): Promise<StackingUnit> {
  const res = await authFetch("/dashboard/stacking/units/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res, "Нэгж нэмэхэд алдаа гарлаа."));
  return res.json();
}

export async function updateStackingUnit(
  id: number,
  payload: Partial<StackingUnit>,
): Promise<StackingUnit> {
  const res = await authFetch(`/dashboard/stacking/units/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res, "Нэгж шинэчлэхэд алдаа гарлаа."));
  return res.json();
}

export async function deleteStackingUnit(id: number) {
  const res = await authFetch(`/dashboard/stacking/units/${id}/`, { method: "DELETE" });
  if (!res.ok) throw new Error(await parseError(res, "Нэгж устгахад алдаа гарлаа."));
}
