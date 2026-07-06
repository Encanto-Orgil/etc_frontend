import { authFetch } from "./auth";
import type { BallroomCustomBookingPayload } from "./ballroomAvailability";

export type BallroomBookingStatus = "pending" | "confirmed" | "declined" | "cancelled";
export type BallroomEventType = "wedding" | "corporate" | "gala" | "conference" | "other";
export type BallroomInvoiceStatus = "draft" | "sent" | "paid" | "cancelled";
export type BallroomQuoteStatus = "draft" | "sent" | "accepted" | "declined" | "cancelled";

export type DashboardBallroomBooking = {
  id: number;
  slot: number;
  slot_date: string;
  slot_start: string;
  slot_end: string;
  slot_label: string;
  name: string;
  phone: string;
  email: string;
  guest_count: number;
  event_type: BallroomEventType;
  event_type_label: string;
  message: string;
  status: BallroomBookingStatus;
  status_label: string;
  is_handled: boolean;
  created_at: string;
};

export type BallroomInvoiceLine = {
  id: number;
  description: string;
  quantity: string | number;
  unit_price: string | number;
  amount: string | number;
  order: number;
};

export type BallroomVatMode = "included" | "excluded" | "none";

export type BallroomBillingProfile = {
  id: number;
  slug: string;
  company_name: string;
  registration_number: string;
  address: string;
  phone: string;
  email: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  bank_branch: string;
  payment_notes: string;
  updated_at: string;
};

export type DashboardBallroomInvoice = {
  id: number;
  booking: number;
  booking_name: string;
  booking_phone: string;
  booking_email: string;
  booking_event_type: string;
  booking_date: string;
  booking_start: string;
  booking_end: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  lines: BallroomInvoiceLine[];
  subtotal: string | number;
  discount_amount: string | number;
  vat_mode: BallroomVatMode;
  vat_mode_label: string;
  net_amount: string | number;
  vat_amount: string | number;
  total_amount: string | number;
  status: BallroomInvoiceStatus;
  status_label: string;
  notes: string;
  billing_profile: BallroomBillingProfile;
  created_at: string;
  updated_at: string;
};

export type BallroomQuoteLine = {
  id: number;
  description: string;
  quantity: string | number;
  unit_price: string | number;
  amount: string | number;
  order: number;
};

export type DashboardBallroomQuote = {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  event_type: BallroomEventType | "";
  event_type_label: string;
  event_date: string | null;
  guest_count: number | null;
  quote_number: string;
  issue_date: string;
  valid_until: string;
  lines: BallroomQuoteLine[];
  subtotal: string | number;
  discount_amount: string | number;
  vat_mode: BallroomVatMode;
  vat_mode_label: string;
  net_amount: string | number;
  vat_amount: string | number;
  total_amount: string | number;
  status: BallroomQuoteStatus;
  status_label: string;
  notes: string;
  billing_profile: BallroomBillingProfile;
  created_at: string;
  updated_at: string;
};

export type BallroomSummary = {
  summary: {
    total_bookings: number;
    pending_bookings: number;
    confirmed_bookings: number;
    month_bookings: number;
    total_invoices: number;
    draft_invoices: number;
    paid_invoices: number;
    outstanding_amount: string | number;
    total_quotes: number;
    draft_quotes: number;
    sent_quotes: number;
  };
  recent_bookings: DashboardBallroomBooking[];
  recent_invoices: DashboardBallroomInvoice[];
  recent_quotes: DashboardBallroomQuote[];
  status_breakdown: Array<{ status: BallroomBookingStatus; count: number }>;
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
  if (!res.ok) throw new Error(await parseError(res, "Failed to load ballroom data."));
  return unwrapList<T>(await res.json());
}

async function fetchOne<T>(path: string, init?: RequestInit, fallback = "Request failed."): Promise<T> {
  const res = await authFetch(path, init);
  if (!res.ok) throw new Error(await parseError(res, fallback));
  return res.json();
}

async function send<T>(path: string, method: "POST" | "PATCH", payload: object, fallback: string) {
  return fetchOne<T>(
    path,
    { method, body: JSON.stringify(payload) },
    fallback,
  );
}

async function remove(path: string, fallback: string) {
  const res = await authFetch(path, { method: "DELETE" });
  if (!res.ok) throw new Error(await parseError(res, fallback));
}

export async function fetchBallroomSummary(): Promise<BallroomSummary> {
  return fetchOne<BallroomSummary>("/dashboard/ballroom/summary/");
}

export function fetchDashboardBallroomBookings(query?: Query) {
  return fetchList<DashboardBallroomBooking>("/dashboard/ballroom/bookings/", query);
}

export function fetchDashboardBallroomBooking(id: number) {
  return fetchOne<DashboardBallroomBooking>(
    `/dashboard/ballroom/bookings/${id}/`,
    undefined,
    "Failed to load booking.",
  );
}

export function createDashboardBallroomBooking(
  payload: BallroomCustomBookingPayload & { status?: BallroomBookingStatus },
) {
  return send<DashboardBallroomBooking>(
    "/dashboard/ballroom/bookings/",
    "POST",
    payload,
    "Failed to create booking.",
  );
}

export function updateDashboardBallroomBooking(
  id: number,
  payload: Partial<
    Pick<
      DashboardBallroomBooking,
      "name" | "phone" | "email" | "guest_count" | "event_type" | "message" | "status" | "is_handled"
    >
  >,
) {
  return send<DashboardBallroomBooking>(
    `/dashboard/ballroom/bookings/${id}/`,
    "PATCH",
    payload,
    "Failed to update booking.",
  );
}

export function deleteDashboardBallroomBooking(id: number) {
  return remove(`/dashboard/ballroom/bookings/${id}/`, "Failed to delete booking.");
}

export function confirmDashboardBallroomBooking(id: number) {
  return fetchOne<DashboardBallroomBooking>(
    `/dashboard/ballroom/bookings/${id}/confirm/`,
    { method: "POST" },
    "Failed to confirm booking.",
  );
}

export function declineDashboardBallroomBooking(id: number) {
  return fetchOne<DashboardBallroomBooking>(
    `/dashboard/ballroom/bookings/${id}/decline/`,
    { method: "POST" },
    "Failed to decline booking.",
  );
}

export function cancelDashboardBallroomBooking(id: number) {
  return fetchOne<DashboardBallroomBooking>(
    `/dashboard/ballroom/bookings/${id}/cancel/`,
    { method: "POST" },
    "Failed to cancel booking.",
  );
}

export function fetchDashboardBallroomInvoices(query?: Query) {
  return fetchList<DashboardBallroomInvoice>("/dashboard/ballroom/invoices/", query);
}

export function fetchDashboardBallroomInvoice(id: number) {
  return fetchOne<DashboardBallroomInvoice>(
    `/dashboard/ballroom/invoices/${id}/`,
    undefined,
    "Failed to load invoice.",
  );
}

export function createDashboardBallroomInvoice(payload: {
  booking: number;
  issue_date: string;
  due_date: string;
  lines: Array<{ description: string; quantity: number; unit_price: number; order?: number }>;
  discount_amount?: number;
  vat_mode?: BallroomVatMode;
  status?: BallroomInvoiceStatus;
  notes?: string;
}) {
  return send<DashboardBallroomInvoice>(
    "/dashboard/ballroom/invoices/",
    "POST",
    payload,
    "Failed to create invoice.",
  );
}

export function updateDashboardBallroomInvoice(
  id: number,
  payload: Partial<{
    issue_date: string;
    due_date: string;
    lines: Array<{ description: string; quantity: number; unit_price: number; order?: number }>;
    discount_amount: number;
    vat_mode: BallroomVatMode;
    status: BallroomInvoiceStatus;
    notes: string;
  }>,
) {
  return send<DashboardBallroomInvoice>(
    `/dashboard/ballroom/invoices/${id}/`,
    "PATCH",
    payload,
    "Failed to update invoice.",
  );
}

export function deleteDashboardBallroomInvoice(id: number) {
  return remove(`/dashboard/ballroom/invoices/${id}/`, "Failed to delete invoice.");
}

export function markBallroomInvoiceSent(id: number) {
  return fetchOne<DashboardBallroomInvoice>(
    `/dashboard/ballroom/invoices/${id}/mark-sent/`,
    { method: "POST" },
    "Failed to mark invoice as sent.",
  );
}

export function markBallroomInvoicePaid(id: number) {
  return fetchOne<DashboardBallroomInvoice>(
    `/dashboard/ballroom/invoices/${id}/mark-paid/`,
    { method: "POST" },
    "Failed to mark invoice as paid.",
  );
}

export function fetchBallroomBillingProfile() {
  return fetchOne<BallroomBillingProfile>(
    "/dashboard/ballroom/billing-profile/",
    undefined,
    "Failed to load billing profile.",
  );
}

export function updateBallroomBillingProfile(payload: Partial<Omit<BallroomBillingProfile, "id" | "slug" | "updated_at">>) {
  return fetchOne<BallroomBillingProfile>(
    "/dashboard/ballroom/billing-profile/",
    { method: "PATCH", body: JSON.stringify(payload) },
    "Failed to update billing profile.",
  );
}

export function fetchDashboardBallroomQuotes(query?: Query) {
  return fetchList<DashboardBallroomQuote>("/dashboard/ballroom/quotes/", query);
}

export function fetchDashboardBallroomQuote(id: number) {
  return fetchOne<DashboardBallroomQuote>(
    `/dashboard/ballroom/quotes/${id}/`,
    undefined,
    "Failed to load quote.",
  );
}

export function createDashboardBallroomQuote(payload: {
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  event_type?: BallroomEventType | "";
  event_date?: string | null;
  guest_count?: number | null;
  issue_date: string;
  valid_until: string;
  lines: Array<{ description: string; quantity: number; unit_price: number; order?: number }>;
  discount_amount?: number;
  vat_mode?: BallroomVatMode;
  status?: BallroomQuoteStatus;
  notes?: string;
}) {
  return send<DashboardBallroomQuote>(
    "/dashboard/ballroom/quotes/",
    "POST",
    payload,
    "Failed to create quote.",
  );
}

export function updateDashboardBallroomQuote(
  id: number,
  payload: Partial<{
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    event_type: BallroomEventType | "";
    event_date: string | null;
    guest_count: number | null;
    issue_date: string;
    valid_until: string;
    lines: Array<{ description: string; quantity: number; unit_price: number; order?: number }>;
    discount_amount: number;
    vat_mode: BallroomVatMode;
    status: BallroomQuoteStatus;
    notes: string;
  }>,
) {
  return send<DashboardBallroomQuote>(
    `/dashboard/ballroom/quotes/${id}/`,
    "PATCH",
    payload,
    "Failed to update quote.",
  );
}

export function deleteDashboardBallroomQuote(id: number) {
  return remove(`/dashboard/ballroom/quotes/${id}/`, "Failed to delete quote.");
}

export function markBallroomQuoteSent(id: number) {
  return fetchOne<DashboardBallroomQuote>(
    `/dashboard/ballroom/quotes/${id}/mark-sent/`,
    { method: "POST" },
    "Failed to mark quote as sent.",
  );
}

export function markBallroomQuoteAccepted(id: number) {
  return fetchOne<DashboardBallroomQuote>(
    `/dashboard/ballroom/quotes/${id}/mark-accepted/`,
    { method: "POST" },
    "Failed to mark quote as accepted.",
  );
}

export function markBallroomQuoteDeclined(id: number) {
  return fetchOne<DashboardBallroomQuote>(
    `/dashboard/ballroom/quotes/${id}/mark-declined/`,
    { method: "POST" },
    "Failed to mark quote as declined.",
  );
}
