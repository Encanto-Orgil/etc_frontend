export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api";

export type InquiryPayload = {
  name: string;
  phone: string;
  email?: string;
  interest: "office" | "mall" | "ballroom" | "apartment" | "general";
  message?: string;
};

export async function submitInquiry(payload: InquiryPayload): Promise<void> {
  const res = await fetch(`${API_BASE}/inquiries/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Inquiry failed: ${res.status}`);
  }
}

export type { OfficeStackingPlan } from "./officeStacking";
export type { PublicSiteNewsItem } from "./siteNewsManagement";

export async function fetchSiteNews(): Promise<import("./siteNewsManagement").PublicSiteNewsItem[] | null> {
  try {
    const res = await fetch(`${API_BASE}/news/`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchSiteNewsClient(): Promise<import("./siteNewsManagement").PublicSiteNewsItem[]> {
  const res = await fetch(`${API_BASE}/news/`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load news: ${res.status}`);
  }
  return res.json();
}

export async function fetchOfficeStackingPlan(): Promise<import("./officeStacking").OfficeStackingPlan | null> {
  try {
    const res = await fetch(`${API_BASE}/office/stacking-plan/`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchApartmentStackingPlan(): Promise<import("./officeStacking").OfficeStackingPlan | null> {
  try {
    const res = await fetch(`${API_BASE}/apartment/stacking-plan/`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchBallroomAvailability(
  year: number,
  month: number,
): Promise<import("./ballroomAvailability").BallroomAvailability | null> {
  try {
    const res = await fetch(
      `${API_BASE}/ballroom/availability/?year=${year}&month=${month}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function checkBallroomTime(
  payload: import("./ballroomAvailability").BallroomCheckTimePayload,
): Promise<import("./ballroomAvailability").BallroomCheckTimeResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/ballroom/check-time/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const detail =
        typeof data === "object" && data
          ? Object.values(data).flat().join(" ")
          : "";
      throw new Error(detail || `Check failed: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    if (error instanceof Error) throw error;
    return null;
  }
}

function parseBookingError(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const record = data as Record<string, unknown>;
  if (typeof record.detail === "string") return record.detail;
  if (Array.isArray(record.detail)) return record.detail.join(" ");
  for (const value of Object.values(record)) {
    if (typeof value === "string") return value;
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  }
  return "";
}

export async function submitBallroomBooking(
  payload: import("./ballroomAvailability").BallroomBookingPayload,
): Promise<import("./ballroomAvailability").BallroomBookingResponse> {
  const res = await fetch(`${API_BASE}/ballroom/bookings/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(parseBookingError(data) || `Booking failed: ${res.status}`);
  }
  return res.json();
}
