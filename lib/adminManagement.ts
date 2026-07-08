import { authFetch } from "./auth";

export type DashboardStaffUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  role_label: string;
  last_login: string | null;
  date_joined: string;
};

export type DashboardAdminSummary = {
  summary: {
    staff_count: number;
    active_count: number;
    superuser_count: number;
  };
  recent_users: DashboardStaffUser[];
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
  if (!res.ok) throw new Error(await parseError(res, "Failed to load admin data."));
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

export function fetchDashboardAdminSummary() {
  return fetchOne<DashboardAdminSummary>("/dashboard/admin/summary/");
}

export function fetchDashboardStaffUsers(query?: Query) {
  return fetchList<DashboardStaffUser>("/dashboard/admin/users/", query);
}

export function createDashboardStaffUser(payload: {
  username: string;
  password: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_superuser?: boolean;
}) {
  return send<DashboardStaffUser>(
    "/dashboard/admin/users/",
    "POST",
    payload,
    "Failed to create dashboard user.",
  );
}

export function updateDashboardStaffUser(
  id: number,
  payload: Partial<{
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    is_superuser: boolean;
    password: string;
  }>,
) {
  return send<DashboardStaffUser>(
    `/dashboard/admin/users/${id}/`,
    "PATCH",
    payload,
    "Failed to update dashboard user.",
  );
}

export function revokeDashboardStaffUser(id: number) {
  return remove(`/dashboard/admin/users/${id}/`, "Failed to revoke dashboard access.");
}
