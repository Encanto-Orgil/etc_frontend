import { authFetch } from "./auth";
import type { LeaseContract, LeaseRentScheduleLine } from "./propertyManagement";
import type { SupportTicket, SupportTicketMessage } from "./supportManagement";

export type PortalTenant = {
  id: number;
  name: string;
  company: string;
  phone: string;
  email: string;
  registration_number: string;
  address: string;
  logo_url: string;
  portal_enabled: boolean;
};

export type PortalSummary = {
  tenant: PortalTenant;
  summary: {
    active_contracts: number;
    total_contracts: number;
    unpaid_invoices: number;
    outstanding_amount: string | number;
    open_tickets: number;
    elevator_cards: number;
    active_elevator_cards: number;
  };
  contracts: LeaseContract[];
  recent_invoices: LeaseRentScheduleLine[];
  recent_tickets: SupportTicket[];
};

export type SupportTicketCategory = "maintenance" | "repair" | "facilities" | "billing" | "other";
export type SupportTicketPriority = "low" | "normal" | "high" | "urgent";

export type PortalElevatorAccessCard = {
  id: number;
  card_uid: string;
  card_uid_masked: string;
  holder_name: string;
  company: string;
  department: string;
  allowed_floors: string;
  elevator_bank: string;
  status: "active" | "revoked" | "expired";
  status_label: string;
  valid_from: string | null;
  valid_until: string | null;
  last_used_at: string | null;
  last_used_floor: number | null;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type PortalElevatorAccessLog = {
  id: number;
  card: number;
  card_uid: string;
  holder_name: string;
  accessed_at: string;
  floor_number: number;
  elevator_bank: string;
  result: "granted" | "denied";
  result_label: string;
  notes: string;
  created_at: string;
};

type ListEnvelope<T> = T[] | { results: T[] };

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

export async function fetchPortalSummary(): Promise<PortalSummary> {
  const res = await authFetch("/portal/summary/");
  if (!res.ok) throw new Error(await parseError(res, "Failed to load portal."));
  return res.json();
}

export async function fetchPortalContracts() {
  const res = await authFetch("/portal/contracts/");
  if (!res.ok) throw new Error(await parseError(res, "Failed to load contracts."));
  return res.json() as Promise<LeaseContract[]>;
}

export async function fetchPortalInvoices(status?: string) {
  const params = status ? `?status=${status}` : "";
  const res = await authFetch(`/portal/invoices/${params}`);
  if (!res.ok) throw new Error(await parseError(res, "Failed to load invoices."));
  return res.json() as Promise<LeaseRentScheduleLine[]>;
}

export async function fetchPortalInvoice(id: number) {
  const res = await authFetch(`/portal/invoices/${id}/`);
  if (!res.ok) throw new Error(await parseError(res, "Failed to load invoice."));
  return res.json() as Promise<LeaseRentScheduleLine>;
}

export async function fetchPortalTickets() {
  const res = await authFetch("/portal/tickets/");
  if (!res.ok) throw new Error(await parseError(res, "Failed to load tickets."));
  return unwrapList<SupportTicket>(await res.json());
}

export async function fetchPortalTicket(id: number) {
  const res = await authFetch(`/portal/tickets/${id}/`);
  if (!res.ok) throw new Error(await parseError(res, "Failed to load ticket."));
  return res.json() as Promise<SupportTicket>;
}

export async function createPortalTicket(payload: {
  contract?: number | null;
  unit?: number | null;
  subject: string;
  category: SupportTicketCategory;
  description: string;
  priority?: SupportTicketPriority;
}) {
  const res = await authFetch("/portal/tickets/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res, "Failed to create ticket."));
  return res.json() as Promise<SupportTicket>;
}

export async function fetchPortalTicketMessages(ticketId: number) {
  const res = await authFetch(`/portal/tickets/${ticketId}/messages/`);
  if (!res.ok) throw new Error(await parseError(res, "Failed to load messages."));
  return res.json() as Promise<SupportTicketMessage[]>;
}

export async function createPortalTicketMessage(ticketId: number, body: string) {
  const res = await authFetch(`/portal/tickets/${ticketId}/messages/`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
  if (!res.ok) throw new Error(await parseError(res, "Failed to send message."));
  return res.json() as Promise<SupportTicketMessage>;
}

export async function fetchPortalElevatorAccess() {
  const res = await authFetch("/portal/elevator-access/");
  if (!res.ok) throw new Error(await parseError(res, "Failed to load elevator access."));
  return res.json() as Promise<PortalElevatorAccessCard[]>;
}

export async function fetchPortalElevatorAccessLogs() {
  const res = await authFetch("/portal/elevator-access/logs/");
  if (!res.ok) throw new Error(await parseError(res, "Failed to load elevator logs."));
  return res.json() as Promise<PortalElevatorAccessLog[]>;
}

export const PORTAL_TICKET_CATEGORY_LABELS: Record<SupportTicketCategory, string> = {
  maintenance: "Засвар үйлчилгээ",
  repair: "Засвар",
  facilities: "Барилгын үйлчилгээ",
  billing: "Төлбөр, нэхэмжлэх",
  other: "Бусад",
};

export const INVOICE_STATUS_FILTER_LABELS: Record<string, string> = {
  pending: "Ноорог",
  invoiced: "Төлөгдөөгүй",
  paid: "Төлсөн",
  cancelled: "Цуцлагдсан",
};
