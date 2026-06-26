import {
  FACADE_FLOOR_COUNT,
  generateDefaultCalibration,
  migrateCalibration,
  type FacadeCalibration,
} from "./officeFacadeFloors";

export const FACADE_CALIBRATION_STORAGE_KEY = "etc-office-facade-calibration";

export function loadFacadeCalibration(): FacadeCalibration {
  if (typeof window === "undefined") {
    return generateDefaultCalibration(FACADE_FLOOR_COUNT);
  }

  try {
    const raw = localStorage.getItem(FACADE_CALIBRATION_STORAGE_KEY);
    if (!raw) return generateDefaultCalibration(FACADE_FLOOR_COUNT);
    return migrateCalibration(JSON.parse(raw));
  } catch {
    return generateDefaultCalibration(FACADE_FLOOR_COUNT);
  }
}

export function saveFacadeCalibration(data: FacadeCalibration) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FACADE_CALIBRATION_STORAGE_KEY, JSON.stringify(data));
}

export function exportFacadeCalibration(data: FacadeCalibration): string {
  return JSON.stringify(data, null, 2);
}

export function importFacadeCalibration(json: string): FacadeCalibration {
  return migrateCalibration(JSON.parse(json));
}

export function downloadFacadeCalibration(
  data: FacadeCalibration,
  filename = "office-facade-calibration.json"
) {
  const blob = new Blob([exportFacadeCalibration(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
