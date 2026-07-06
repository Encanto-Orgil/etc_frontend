import { authFetch } from "./auth";
import type { LeaseContract, LeaseRentScheduleLine } from "./propertyManagement";
import type { SupportTicket } from "./supportManagement";

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
  };
  contracts: LeaseContract[];
  recent_invoices: LeaseRentScheduleLine[];
  recent_tickets: SupportTicket[];
};

export type SupportTicketCategory = "maintenance" | "repair" | "facilities" | "billing" | "other";
export type SupportTicketPriority = "low" | "normal" | "high" | "urgent";

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

export async function fetchPortalTickets() {
  const res = await authFetch("/portal/tickets/");
  if (!res.ok) throw new Error(await parseError(res, "Failed to load tickets."));
  return unwrapList<SupportTicket>(await res.json());
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

export const PORTAL_TICKET_CATEGORY_LABELS: Record<SupportTicketCategory, string> = {
  maintenance: "Засвар үйлчилгээ",
  repair: "Засвар",
  facilities: "Барилгын үйлчилгээ",
  billing: "Төлбөр, нэхэмжлэх",
  other: "Бусад",
};
