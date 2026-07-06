import { authFetch } from "./auth";
import type { LeaseContract, LeaseRentScheduleLine } from "./propertyManagement";

export type SupportTicketCategory = "maintenance" | "repair" | "facilities" | "billing" | "other";
export type SupportTicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type SupportTicketPriority = "low" | "normal" | "high" | "urgent";

export type SupportTicket = {
  id: number;
  tenant: number;
  tenant_name: string;
  tenant_company: string;
  contract: number | null;
  contract_number: string;
  unit: number | null;
  unit_code: string;
  subject: string;
  category: SupportTicketCategory;
  category_label: string;
  description: string;
  status: SupportTicketStatus;
  status_label: string;
  priority: SupportTicketPriority;
  priority_label: string;
  created_by: number | null;
  created_by_name: string;
  assigned_to: number | null;
  assigned_to_name: string;
  staff_notes: string;
  created_at: string;
  updated_at: string;
};

export type SupportTicketSummary = {
  summary: {
    total: number;
    open: number;
    in_progress: number;
    urgent: number;
  };
  recent: SupportTicket[];
  by_status: Array<{ status: SupportTicketStatus; count: number }>;
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

export async function fetchSupportTicketSummary(): Promise<SupportTicketSummary> {
  const res = await authFetch("/dashboard/support-tickets/summary/");
  if (!res.ok) throw new Error(await parseError(res, "Failed to load support tickets."));
  return res.json();
}

export function fetchSupportTickets(query?: Query) {
  return authFetch(`/dashboard/support-tickets/${queryString(query)}`).then(async (res) => {
    if (!res.ok) throw new Error(await parseError(res, "Failed to load support tickets."));
    return unwrapList<SupportTicket>(await res.json());
  });
}

export function updateSupportTicket(
  id: number,
  payload: Partial<{
    status: SupportTicketStatus;
    priority: SupportTicketPriority;
    assigned_to: number | null;
    staff_notes: string;
  }>,
) {
  return authFetch(`/dashboard/support-tickets/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }).then(async (res) => {
    if (!res.ok) throw new Error(await parseError(res, "Failed to update ticket."));
    return res.json() as Promise<SupportTicket>;
  });
}

export const TICKET_CATEGORY_LABELS: Record<SupportTicketCategory, string> = {
  maintenance: "Засвар үйлчилгээ",
  repair: "Засвар",
  facilities: "Барилгын үйлчилгээ",
  billing: "Төлбөр, нэхэмжлэх",
  other: "Бусад",
};

export const TICKET_STATUS_LABELS: Record<SupportTicketStatus, string> = {
  open: "Нээлттэй",
  in_progress: "Хийгдэж байна",
  resolved: "Шийдэгдсэн",
  closed: "Хаагдсан",
};

export const TICKET_STATUS_COLORS: Record<SupportTicketStatus, string> = {
  open: "gold",
  in_progress: "blue",
  resolved: "green",
  closed: "default",
};

export const TICKET_PRIORITY_LABELS: Record<SupportTicketPriority, string> = {
  low: "Бага",
  normal: "Энгийн",
  high: "Өндөр",
  urgent: "Яаралтай",
};
