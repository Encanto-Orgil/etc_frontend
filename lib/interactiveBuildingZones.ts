import {
  buildingDestinations,
  type BuildingDestination,
  type BuildingZonePoint,
} from "./interactiveBuildingConfig";

export type { BuildingZonePoint };

export const INTERACTIVE_BUILDING_VIEWBOX = { width: 1920, height: 1080 } as const;

export const MIN_ZONE_POINTS = 3;

export type InteractiveBuildingCalibration = {
  version: 1;
  zones: Record<string, BuildingZonePoint[]>;
};

export function rectPercentToZone(
  top: string,
  left: string,
  width: string,
  height: string,
): BuildingZonePoint[] {
  const { width: vw, height: vh } = INTERACTIVE_BUILDING_VIEWBOX;
  const x = (parseFloat(left) / 100) * vw;
  const y = (parseFloat(top) / 100) * vh;
  const x2 = x + (parseFloat(width) / 100) * vw;
  const y2 = y + (parseFloat(height) / 100) * vh;

  return [
    { x: round(x), y: round(y) },
    { x: round(x2), y: round(y) },
    { x: round(x2), y: round(y2) },
    { x: round(x), y: round(y2) },
  ];
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

function clonePoint(point: BuildingZonePoint): BuildingZonePoint {
  return { x: point.x, y: point.y };
}

function cloneZone(zone: BuildingZonePoint[]): BuildingZonePoint[] {
  return zone.map(clonePoint);
}

export function normalizeZone(points: unknown): BuildingZonePoint[] | null {
  if (!Array.isArray(points) || points.length < MIN_ZONE_POINTS) return null;

  const zone = points
    .map((point) => {
      if (!point || typeof point !== "object") return null;
      const raw = point as { x?: unknown; y?: unknown };
      if (typeof raw.x !== "number" || typeof raw.y !== "number") return null;
      return { x: raw.x, y: raw.y };
    })
    .filter(Boolean) as BuildingZonePoint[];

  return zone.length >= MIN_ZONE_POINTS ? zone : null;
}

export function generateDefaultCalibration(): InteractiveBuildingCalibration {
  const zones: Record<string, BuildingZonePoint[]> = {};

  for (const destination of buildingDestinations) {
    zones[destination.id] = cloneZone(destination.zone);
  }

  return { version: 1, zones };
}

export function migrateCalibration(data: unknown): InteractiveBuildingCalibration {
  const fallback = generateDefaultCalibration();
  if (!data || typeof data !== "object") return fallback;

  const raw = data as { version?: number; zones?: Record<string, unknown> };
  if (!raw.zones || typeof raw.zones !== "object") return fallback;

  const zones: Record<string, BuildingZonePoint[]> = {};

  for (const destination of buildingDestinations) {
    const normalized = normalizeZone(raw.zones[destination.id]);
    zones[destination.id] = normalized ?? cloneZone(destination.zone);
  }

  return { version: 1, zones };
}

export function polygonToPoints(zone: BuildingZonePoint[]): string {
  return zone.map((point) => `${point.x},${point.y}`).join(" ");
}

export function getZoneCentroid(zone: BuildingZonePoint[]): BuildingZonePoint {
  if (!zone.length) return { x: 0, y: 0 };
  const x = zone.reduce((sum, point) => sum + point.x, 0) / zone.length;
  const y = zone.reduce((sum, point) => sum + point.y, 0) / zone.length;
  return { x, y };
}

export function getDestinationZone(
  destinationId: string,
  calibration?: InteractiveBuildingCalibration | null,
): BuildingZonePoint[] {
  const custom = calibration?.zones[destinationId];
  if (custom && custom.length >= MIN_ZONE_POINTS) return cloneZone(custom);

  const fallback = buildingDestinations.find((item) => item.id === destinationId);
  return fallback ? cloneZone(fallback.zone) : [];
}

function setDestinationZone(
  calibration: InteractiveBuildingCalibration,
  destinationId: string,
  zone: BuildingZonePoint[],
): InteractiveBuildingCalibration {
  return {
    version: 1,
    zones: { ...calibration.zones, [destinationId]: cloneZone(zone) },
  };
}

export function updateZonePoint(
  calibration: InteractiveBuildingCalibration,
  destinationId: string,
  pointIndex: number,
  point: BuildingZonePoint,
): InteractiveBuildingCalibration {
  const zone = cloneZone(getDestinationZone(destinationId, calibration));
  if (pointIndex < 0 || pointIndex >= zone.length) return calibration;
  zone[pointIndex] = clonePoint(point);
  return setDestinationZone(calibration, destinationId, zone);
}

export function moveDestinationZone(
  calibration: InteractiveBuildingCalibration,
  destinationId: string,
  dx: number,
  dy: number,
): InteractiveBuildingCalibration {
  const zone = getDestinationZone(destinationId, calibration).map((point) => ({
    x: point.x + dx,
    y: point.y + dy,
  }));
  return setDestinationZone(calibration, destinationId, zone);
}

export function addZonePoint(
  calibration: InteractiveBuildingCalibration,
  destinationId: string,
  point: BuildingZonePoint,
  afterIndex?: number,
): InteractiveBuildingCalibration {
  const zone = cloneZone(getDestinationZone(destinationId, calibration));
  const index = afterIndex === undefined ? zone.length : Math.min(afterIndex + 1, zone.length);
  zone.splice(index, 0, clonePoint(point));
  return setDestinationZone(calibration, destinationId, zone);
}

export function removeZonePoint(
  calibration: InteractiveBuildingCalibration,
  destinationId: string,
  pointIndex: number,
): InteractiveBuildingCalibration {
  const zone = cloneZone(getDestinationZone(destinationId, calibration));
  if (zone.length <= MIN_ZONE_POINTS || pointIndex < 0 || pointIndex >= zone.length) {
    return calibration;
  }
  zone.splice(pointIndex, 1);
  return setDestinationZone(calibration, destinationId, zone);
}

function dist(a: BuildingZonePoint, b: BuildingZonePoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function projectOnSegment(
  point: BuildingZonePoint,
  a: BuildingZonePoint,
  b: BuildingZonePoint,
): BuildingZonePoint {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return clonePoint(a);
  const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / lenSq));
  return { x: a.x + dx * t, y: a.y + dy * t };
}

export function insertPointOnNearestEdge(
  calibration: InteractiveBuildingCalibration,
  destinationId: string,
  click: BuildingZonePoint,
  maxDistance = 36,
): InteractiveBuildingCalibration {
  const zone = cloneZone(getDestinationZone(destinationId, calibration));
  if (zone.length < 2) return calibration;

  let bestDist = Infinity;
  let insertAt = -1;
  let bestPoint = click;

  for (let index = 0; index < zone.length; index += 1) {
    const a = zone[index];
    const b = zone[(index + 1) % zone.length];
    const projected = projectOnSegment(click, a, b);
    const distance = dist(click, projected);
    if (distance < bestDist) {
      bestDist = distance;
      insertAt = index + 1;
      bestPoint = projected;
    }
  }

  if (insertAt < 0 || bestDist > maxDistance) {
    return addZonePoint(calibration, destinationId, click);
  }

  zone.splice(insertAt, 0, bestPoint);
  return setDestinationZone(calibration, destinationId, zone);
}

export function mergeDestinationsWithCalibration(
  calibration?: InteractiveBuildingCalibration | null,
): BuildingDestination[] {
  return buildingDestinations.map((destination) => ({
    ...destination,
    zone: getDestinationZone(destination.id, calibration),
  }));
}
