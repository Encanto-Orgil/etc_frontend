import { authFetch } from "./auth";

export type InquiryInterest = "office" | "mall" | "ballroom" | "apartment" | "general";

export type Inquiry = {
  id: number;
  name: string;
  phone: string;
  email: string;
  interest: InquiryInterest;
  interest_label: string;
  message: string;
  is_handled: boolean;
  created_at: string;
};

export type InquirySummary = {
  summary: {
    total: number;
    pending: number;
    handled: number;
  };
  recent: Inquiry[];
};

export const INQUIRY_INTEREST_LABELS: Record<InquiryInterest, string> = {
  office: "Office",
  mall: "Mall",
  ballroom: "Ballroom",
  apartment: "Apartment",
  general: "General",
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

export async function fetchInquirySummary(): Promise<InquirySummary> {
  const res = await authFetch("/dashboard/inquiries/summary/");
  if (!res.ok) throw new Error(await parseError(res, "Failed to load inquiries."));
  return res.json();
}

export function fetchInquiries(query?: Query) {
  return authFetch(`/dashboard/inquiries/${queryString(query)}`).then(async (res) => {
    if (!res.ok) throw new Error(await parseError(res, "Failed to load inquiries."));
    return unwrapList<Inquiry>(await res.json());
  });
}

export async function updateInquiry(id: number, payload: { is_handled: boolean }) {
  const res = await authFetch(`/dashboard/inquiries/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res, "Failed to update inquiry."));
  return res.json() as Promise<Inquiry>;
}
