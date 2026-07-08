import { authFetch } from "./auth";

export type BmsCameraLocation = "ballroom" | "lobby" | "parking" | "office" | "mall" | "other";
export type BmsFireAlarmSeverity = "info" | "warning" | "alarm";
export type BmsElevatorCardStatus = "active" | "revoked" | "expired";
export type BmsElevatorAccessResult = "granted" | "denied";

export type BmsCamera = {
  id: number;
  name: string;
  location: BmsCameraLocation;
  location_label: string;
  stream_url: string;
  is_active: boolean;
  notes: string;
  order: number;
  created_at: string;
  updated_at: string;
};

export type BmsFireAlarmLog = {
  id: number;
  zone: string;
  location: string;
  message: string;
  severity: BmsFireAlarmSeverity;
  severity_label: string;
  triggered_at: string;
  cleared_at: string | null;
  is_active: boolean;
  source: string;
  notes: string;
  created_at: string;
};

export type BmsElevatorAccessCard = {
  id: number;
  card_uid: string;
  holder_name: string;
  company: string;
  department: string;
  allowed_floors: string;
  elevator_bank: string;
  status: BmsElevatorCardStatus;
  status_label: string;
  valid_from: string | null;
  valid_until: string | null;
  last_used_at: string | null;
  last_used_floor: number | null;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type BmsElevatorAccessLog = {
  id: number;
  card: number;
  card_uid: string;
  holder_name: string;
  accessed_at: string;
  floor_number: number;
  elevator_bank: string;
  result: BmsElevatorAccessResult;
  result_label: string;
  notes: string;
  created_at: string;
};

export type BmsSummary = {
  summary: {
    camera_count: number;
    active_camera_count: number;
    active_alarm_count: number;
    elevator_card_count: number;
    active_elevator_card_count: number;
  };
  recent_alarms: BmsFireAlarmLog[];
  recent_access_logs: BmsElevatorAccessLog[];
};

type ListEnvelope<T> = T[] | { results: T[] };
type Query = Record<string, string | number | boolean | null | undefined>;

function queryString(query?: Query) {
  const params = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "" || value === "all") return;
    params.set(key, String(value));
  });
  const text = params.toString();
  return text ? `?${text}` : "";
}

function unwrapList<T>(data: ListEnvelope<T>): T[] {
  return Array.isArray(data) ? data : data.results;
}

async function parseError(res: Response, fallback: string) {
  const data = await res.json().catch(() => ({}));
  if (typeof data.detail === "string") return data.detail;
  const first = Object.values(data).flat()[0];
  if (typeof first === "string") return first;
  return fallback;
}

async function fetchList<T>(path: string, query?: Query): Promise<T[]> {
  const res = await authFetch(`${path}${queryString(query)}`);
  if (!res.ok) throw new Error(await parseError(res, "Failed to load BMS data."));
  return unwrapList<T>(await res.json());
}

async function fetchOne<T>(path: string, init?: RequestInit, fallback = "Request failed."): Promise<T> {
  const res = await authFetch(path, init);
  if (!res.ok) throw new Error(await parseError(res, fallback));
  return res.json();
}

async function send<T>(path: string, method: "POST" | "PATCH", payload: object, fallback: string) {
  return fetchOne<T>(path, { method, body: JSON.stringify(payload) }, fallback);
}

async function remove(path: string, fallback: string) {
  const res = await authFetch(path, { method: "DELETE" });
  if (!res.ok) throw new Error(await parseError(res, fallback));
}

export function fetchBmsSummary() {
  return fetchOne<BmsSummary>("/dashboard/bms/summary/");
}

export function fetchBmsCameras(query?: Query) {
  return fetchList<BmsCamera>("/dashboard/bms/cameras/", query);
}

export function createBmsCamera(payload: {
  name: string;
  location: BmsCameraLocation;
  stream_url: string;
  is_active?: boolean;
  notes?: string;
  order?: number;
}) {
  return send<BmsCamera>("/dashboard/bms/cameras/", "POST", payload, "Failed to create camera.");
}

export function updateBmsCamera(
  id: number,
  payload: Partial<{
    name: string;
    location: BmsCameraLocation;
    stream_url: string;
    is_active: boolean;
    notes: string;
    order: number;
  }>,
) {
  return send<BmsCamera>(`/dashboard/bms/cameras/${id}/`, "PATCH", payload, "Failed to update camera.");
}

export function deleteBmsCamera(id: number) {
  return remove(`/dashboard/bms/cameras/${id}/`, "Failed to delete camera.");
}

export function fetchBmsFireAlarms(query?: Query) {
  return fetchList<BmsFireAlarmLog>("/dashboard/bms/fire-alarms/", query);
}

export function createBmsFireAlarm(payload: {
  zone: string;
  location: string;
  message: string;
  severity?: BmsFireAlarmSeverity;
  triggered_at: string;
  is_active?: boolean;
  source?: string;
  notes?: string;
}) {
  return send<BmsFireAlarmLog>(
    "/dashboard/bms/fire-alarms/",
    "POST",
    payload,
    "Failed to create fire alarm log.",
  );
}

export function clearBmsFireAlarm(id: number) {
  return fetchOne<BmsFireAlarmLog>(
    `/dashboard/bms/fire-alarms/${id}/clear/`,
    { method: "POST" },
    "Failed to clear alarm.",
  );
}

export function fetchBmsElevatorCards(query?: Query) {
  return fetchList<BmsElevatorAccessCard>("/dashboard/bms/elevator-cards/", query);
}

export function createBmsElevatorCard(payload: {
  card_uid: string;
  holder_name: string;
  company?: string;
  department?: string;
  allowed_floors: string;
  elevator_bank?: string;
  status?: BmsElevatorCardStatus;
  valid_from?: string | null;
  valid_until?: string | null;
  notes?: string;
}) {
  return send<BmsElevatorAccessCard>(
    "/dashboard/bms/elevator-cards/",
    "POST",
    payload,
    "Failed to create elevator card.",
  );
}

export function updateBmsElevatorCard(
  id: number,
  payload: Partial<{
    card_uid: string;
    holder_name: string;
    company: string;
    department: string;
    allowed_floors: string;
    elevator_bank: string;
    status: BmsElevatorCardStatus;
    valid_from: string | null;
    valid_until: string | null;
    notes: string;
  }>,
) {
  return send<BmsElevatorAccessCard>(
    `/dashboard/bms/elevator-cards/${id}/`,
    "PATCH",
    payload,
    "Failed to update elevator card.",
  );
}

export function deleteBmsElevatorCard(id: number) {
  return remove(`/dashboard/bms/elevator-cards/${id}/`, "Failed to delete elevator card.");
}

export function revokeBmsElevatorCard(id: number) {
  return fetchOne<BmsElevatorAccessCard>(
    `/dashboard/bms/elevator-cards/${id}/revoke/`,
    { method: "POST" },
    "Failed to revoke card.",
  );
}

export function activateBmsElevatorCard(id: number) {
  return fetchOne<BmsElevatorAccessCard>(
    `/dashboard/bms/elevator-cards/${id}/activate/`,
    { method: "POST" },
    "Failed to activate card.",
  );
}

export function recordBmsElevatorAccess(
  id: number,
  payload: { floor_number: number; result?: BmsElevatorAccessResult; notes?: string },
) {
  return fetchOne<{ card: BmsElevatorAccessCard; log: BmsElevatorAccessLog }>(
    `/dashboard/bms/elevator-cards/${id}/record_access/`,
    { method: "POST", body: JSON.stringify(payload) },
    "Failed to record access.",
  );
}

export function fetchBmsElevatorAccessLogs(query?: Query) {
  return fetchList<BmsElevatorAccessLog>("/dashboard/bms/elevator-access-logs/", query);
}
