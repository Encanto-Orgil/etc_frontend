import { API_BASE } from "./api";

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  role: "staff" | "tenant" | "user";
  tenant?: {
    id: number;
    name: string;
    company: string;
    phone: string;
    email: string;
    portal_enabled: boolean;
  };
};

export type DashboardStats = {
  summary: {
    pending_inquiries: number;
    pending_bookings: number;
    available_units: number;
    tower_count: number;
    total_inquiries: number;
    total_bookings: number;
    open_support_tickets: number;
  };
  recent_inquiries: Array<{
    id: number;
    name: string;
    phone: string;
    interest: string;
    is_handled: boolean;
    created_at: string;
  }>;
  recent_bookings: Array<{
    id: number;
    name: string;
    phone: string;
    status: string;
    guest_count: number;
    created_at: string;
    slot__date: string;
    slot__start_time: string;
    slot__end_time: string;
  }>;
  recent_support_tickets: Array<{
    id: number;
    subject: string;
    category: string;
    status: string;
    priority: string;
    created_at: string;
    tenant__name: string;
    tenant__company: string;
  }>;
  stacking: Record<
    string,
    {
      floor_count: number;
      unit_count: number;
      available_count: number;
      rented_count: number;
      reserved_count: number;
      unavailable_count: number;
    }
  >;
  rental_finance: {
    period: { year: number; month: number; label: string };
    combined: {
      expected_total: number;
      collected: number;
      outstanding: number;
      paid_count: number;
      unpaid_count: number;
      collection_rate: number;
    };
    office?: {
      expected_total: number;
      collected: number;
      outstanding: number;
      paid_count: number;
      unpaid_count: number;
      collection_rate: number;
    };
    mall?: {
      expected_total: number;
      collected: number;
      outstanding: number;
      paid_count: number;
      unpaid_count: number;
      collection_rate: number;
    };
  };
};

let cachedCsrfToken = "";
let csrfRefreshPromise: Promise<string> | null = null;

function getCookie(name: string) {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function readCsrfToken() {
  return getCookie("csrftoken") || cachedCsrfToken;
}

async function refreshCsrfToken(): Promise<string> {
  if (csrfRefreshPromise) return csrfRefreshPromise;

  csrfRefreshPromise = (async () => {
    const res = await fetch(`${API_BASE}/auth/csrf/`, {
      credentials: "include",
    });
    if (!res.ok) return "";
    const data = await res.json().catch(() => ({}));
    const token = typeof data.csrfToken === "string" ? data.csrfToken : "";
    if (token) cachedCsrfToken = token;
    return token;
  })().finally(() => {
    csrfRefreshPromise = null;
  });

  return csrfRefreshPromise;
}

async function attachCsrfHeader(headers: Headers) {
  let csrf = readCsrfToken();
  if (!csrf) csrf = await refreshCsrfToken();
  if (csrf) headers.set("X-CSRFToken", csrf);
}

export async function authFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const method = (init.method || "GET").toUpperCase();

  if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
    await attachCsrfHeader(headers);
  }

  if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (
    res.status === 403 &&
    method !== "GET" &&
    method !== "HEAD" &&
    method !== "OPTIONS"
  ) {
    const data = await res.clone().json().catch(() => ({}));
    const detail = typeof data.detail === "string" ? data.detail : "";
    if (detail.toLowerCase().includes("csrf")) {
      cachedCsrfToken = "";
      const retryHeaders = new Headers(init.headers);
      await attachCsrfHeader(retryHeaders);
      if (!retryHeaders.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
        retryHeaders.set("Content-Type", "application/json");
      }
      res = await fetch(`${API_BASE}${path}`, {
        ...init,
        headers: retryHeaders,
        credentials: "include",
      });
    }
  }

  return res;
}

export async function ensureCsrf() {
  await refreshCsrfToken();
}

export async function login(
  username: string,
  password: string,
): Promise<AuthUser> {
  await ensureCsrf();
  const res = await authFetch("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      typeof data.detail === "string" ? data.detail : "Нэвтрэхэд алдаа гарлаа.",
    );
  }

  const data = await res.json();
  return data.user as AuthUser;
}

export function getLoginRedirect(user: AuthUser) {
  if (user.is_staff) return "/dashboard";
  if (user.role === "tenant") return "/portal";
  return "/dashboard/login";
}

export async function logout() {
  await authFetch("/auth/logout/", { method: "POST" });
}

export async function getMe(): Promise<AuthUser | null> {
  const res = await authFetch("/auth/me/");
  if (res.status === 401 || res.status === 403) return null;
  if (!res.ok) return null;
  const data = await res.json();
  return data.user as AuthUser;
}

export async function fetchDashboardStats(): Promise<DashboardStats | null> {
  const res = await authFetch("/dashboard/stats/");
  if (!res.ok) return null;
  return res.json();
}
