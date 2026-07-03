import {
  generateDefaultCalibration,
  migrateCalibration,
  type InteractiveBuildingCalibration,
} from "./interactiveBuildingZones";

export const INTERACTIVE_BUILDING_CALIBRATION_STORAGE_KEY =
  "etc-interactive-building-calibration";

export function loadInteractiveBuildingCalibration(): InteractiveBuildingCalibration {
  if (typeof window === "undefined") {
    return generateDefaultCalibration();
  }

  try {
    const raw = localStorage.getItem(INTERACTIVE_BUILDING_CALIBRATION_STORAGE_KEY);
    if (!raw) return generateDefaultCalibration();
    return migrateCalibration(JSON.parse(raw));
  } catch {
    return generateDefaultCalibration();
  }
}

export function saveInteractiveBuildingCalibration(data: InteractiveBuildingCalibration) {
  if (typeof window === "undefined") return;
  localStorage.setItem(INTERACTIVE_BUILDING_CALIBRATION_STORAGE_KEY, JSON.stringify(data));
}

export function exportInteractiveBuildingCalibration(
  data: InteractiveBuildingCalibration,
): string {
  return JSON.stringify(data, null, 2);
}

export function importInteractiveBuildingCalibration(
  json: string,
): InteractiveBuildingCalibration {
  return migrateCalibration(JSON.parse(json));
}

export function downloadInteractiveBuildingCalibration(
  data: InteractiveBuildingCalibration,
  filename = "interactive-building-zones.json",
) {
  const blob = new Blob([exportInteractiveBuildingCalibration(data)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
