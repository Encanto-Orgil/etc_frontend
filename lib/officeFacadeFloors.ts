export const OFFICE_FACADE_IMAGE = "/images/office/office-facade.png";

export const FACADE_VIEWBOX = { width: 712, height: 1024 } as const;

export const FACADE_FLOOR_COUNT = 24;

export const MIN_POLYGON_POINTS = 3;

export type FacadePoint = { x: number; y: number };

/** Closed polygon — points connected in order (min 3). */
export type FacadeFloorPolygon = FacadePoint[];

export type FacadeCalibration = {
  version: 2;
  floors: Record<string, FacadeFloorPolygon>;
};

const TOWER = {
  topY: 128,
  bottomY: 778,
  leftTop: 114,
  rightTop: 284,
  leftBottom: 58,
  rightBottom: 372,
  perspectivePower: 1.24,
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mapT(t: number) {
  return Math.pow(Math.max(0, Math.min(1, t)), TOWER.perspectivePower);
}

function edgeX(t: number, side: "left" | "right") {
  const mapped = mapT(t);
  if (side === "left") return lerp(TOWER.leftTop, TOWER.leftBottom, mapped);
  return lerp(TOWER.rightTop, TOWER.rightBottom, mapped);
}

function edgeY(t: number) {
  return lerp(TOWER.topY, TOWER.bottomY, mapT(t));
}

function clonePoint(p: FacadePoint): FacadePoint {
  return { x: p.x, y: p.y };
}

function clonePolygon(poly: FacadeFloorPolygon): FacadeFloorPolygon {
  return poly.map(clonePoint);
}

export function generateDefaultFloorPolygon(
  floorNumber: number,
  totalFloors = FACADE_FLOOR_COUNT
): FacadeFloorPolygon {
  const tTop = 1 - floorNumber / totalFloors;
  const tBottom = 1 - (floorNumber - 1) / totalFloors;

  const yTop = edgeY(tTop);
  const yBottom = edgeY(tBottom);

  return [
    { x: edgeX(tTop, "left"), y: yTop },
    { x: edgeX(tTop, "right"), y: yTop },
    { x: edgeX(tBottom, "right"), y: yBottom },
    { x: edgeX(tBottom, "left"), y: yBottom },
  ];
}

export function generateDefaultCalibration(
  totalFloors = FACADE_FLOOR_COUNT
): FacadeCalibration {
  const floors: Record<string, FacadeFloorPolygon> = {};
  for (let n = 1; n <= totalFloors; n++) {
    floors[String(n)] = generateDefaultFloorPolygon(n, totalFloors);
  }
  return { version: 2, floors };
}

export function normalizeFloorPolygon(poly: unknown): FacadeFloorPolygon | null {
  if (!Array.isArray(poly) || poly.length < MIN_POLYGON_POINTS) return null;
  const points = poly
    .map((p) => {
      if (!p || typeof p !== "object") return null;
      const pt = p as { x?: unknown; y?: unknown };
      if (typeof pt.x !== "number" || typeof pt.y !== "number") return null;
      return { x: pt.x, y: pt.y };
    })
    .filter(Boolean) as FacadePoint[];
  return points.length >= MIN_POLYGON_POINTS ? points : null;
}

export function migrateCalibration(data: unknown): FacadeCalibration {
  const fallback = generateDefaultCalibration(FACADE_FLOOR_COUNT);

  if (!data || typeof data !== "object") return fallback;

  const raw = data as { version?: number; floors?: Record<string, unknown> };
  if (!raw.floors || typeof raw.floors !== "object") return fallback;

  const floors: Record<string, FacadeFloorPolygon> = {};

  for (let n = 1; n <= FACADE_FLOOR_COUNT; n++) {
    const key = String(n);
    const normalized = normalizeFloorPolygon(raw.floors[key]);
    floors[key] = normalized ?? generateDefaultFloorPolygon(n);
  }

  return { version: 2, floors };
}

export function polygonToPoints(polygon: FacadeFloorPolygon): string {
  return polygon.map((p) => `${p.x},${p.y}`).join(" ");
}

export function getFloorLabelFromPolygon(polygon: FacadeFloorPolygon): FacadePoint {
  if (!polygon.length) return { x: 0, y: 0 };
  const x = polygon.reduce((s, p) => s + p.x, 0) / polygon.length;
  const y = polygon.reduce((s, p) => s + p.y, 0) / polygon.length;
  return { x, y };
}

export function getFacadeFloorPoints(
  floorNumber: number,
  calibration?: FacadeCalibration | null,
  totalFloors = FACADE_FLOOR_COUNT
): string {
  return polygonToPoints(getFacadeFloorPolygon(floorNumber, calibration, totalFloors));
}

export function getFacadeFloorPolygon(
  floorNumber: number,
  calibration?: FacadeCalibration | null,
  totalFloors = FACADE_FLOOR_COUNT
): FacadeFloorPolygon {
  const custom = calibration?.floors[String(floorNumber)];
  if (custom && custom.length >= MIN_POLYGON_POINTS) return clonePolygon(custom);
  return generateDefaultFloorPolygon(floorNumber, totalFloors);
}

export function getFacadeFloorLabel(
  floorNumber: number,
  calibration?: FacadeCalibration | null,
  totalFloors = FACADE_FLOOR_COUNT
): FacadePoint {
  return getFloorLabelFromPolygon(
    getFacadeFloorPolygon(floorNumber, calibration, totalFloors)
  );
}

function setFloorPolygon(
  calibration: FacadeCalibration,
  floorNumber: number,
  polygon: FacadeFloorPolygon
): FacadeCalibration {
  return {
    version: 2,
    floors: { ...calibration.floors, [String(floorNumber)]: clonePolygon(polygon) },
  };
}

export function updatePolygonPoint(
  calibration: FacadeCalibration,
  floorNumber: number,
  pointIndex: number,
  point: FacadePoint
): FacadeCalibration {
  const poly = clonePolygon(getFacadeFloorPolygon(floorNumber, calibration));
  if (pointIndex < 0 || pointIndex >= poly.length) return calibration;
  poly[pointIndex] = clonePoint(point);
  return setFloorPolygon(calibration, floorNumber, poly);
}

export function moveFloorPolygon(
  calibration: FacadeCalibration,
  floorNumber: number,
  dx: number,
  dy: number
): FacadeCalibration {
  const poly = getFacadeFloorPolygon(floorNumber, calibration).map((p) => ({
    x: p.x + dx,
    y: p.y + dy,
  }));
  return setFloorPolygon(calibration, floorNumber, poly);
}

export function addPolygonPoint(
  calibration: FacadeCalibration,
  floorNumber: number,
  point: FacadePoint,
  afterIndex?: number
): FacadeCalibration {
  const poly = clonePolygon(getFacadeFloorPolygon(floorNumber, calibration));
  const idx = afterIndex === undefined ? poly.length : Math.min(afterIndex + 1, poly.length);
  poly.splice(idx, 0, clonePoint(point));
  return setFloorPolygon(calibration, floorNumber, poly);
}

export function removePolygonPoint(
  calibration: FacadeCalibration,
  floorNumber: number,
  pointIndex: number
): FacadeCalibration {
  const poly = clonePolygon(getFacadeFloorPolygon(floorNumber, calibration));
  if (poly.length <= MIN_POLYGON_POINTS || pointIndex < 0 || pointIndex >= poly.length) {
    return calibration;
  }
  poly.splice(pointIndex, 1);
  return setFloorPolygon(calibration, floorNumber, poly);
}

function dist(a: FacadePoint, b: FacadePoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function projectOnSegment(p: FacadePoint, a: FacadePoint, b: FacadePoint): FacadePoint {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return clonePoint(a);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq));
  return { x: a.x + dx * t, y: a.y + dy * t };
}

/** Insert a point on the nearest edge of the polygon (within maxDistance). */
export function insertPointOnNearestEdge(
  calibration: FacadeCalibration,
  floorNumber: number,
  click: FacadePoint,
  maxDistance = 28
): FacadeCalibration {
  const poly = clonePolygon(getFacadeFloorPolygon(floorNumber, calibration));
  if (poly.length < 2) return calibration;

  let bestDist = Infinity;
  let insertAt = -1;
  let bestPoint = click;

  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const proj = projectOnSegment(click, a, b);
    const d = dist(click, proj);
    if (d < bestDist) {
      bestDist = d;
      insertAt = i + 1;
      bestPoint = proj;
    }
  }

  if (insertAt < 0 || bestDist > maxDistance) {
    return addPolygonPoint(calibration, floorNumber, click);
  }

  poly.splice(insertAt, 0, bestPoint);
  return setFloorPolygon(calibration, floorNumber, poly);
}

/** @deprecated use updatePolygonPoint */
export function applyCornerUpdate(
  calibration: FacadeCalibration,
  floorNumber: number,
  cornerIndex: number,
  point: FacadePoint
) {
  return updatePolygonPoint(calibration, floorNumber, cornerIndex, point);
}
