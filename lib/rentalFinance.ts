import { authFetch } from "./auth";
import type { TowerKind } from "./stacking";

export type PaymentStatus = "paid" | "unpaid" | "partial" | "overdue";

export type RentPayment = {
  id: number;
  unit_id: number;
  floor_number: number;
  unit_code: string;
  tenant_name: string;
  tenant_phone: string;
  area_sqm: string | number;
  rent_amount: number;
  usage_amount: number;
  total_due: number;
  amount_paid: number;
  status: PaymentStatus;
  status_label: string;
  paid_at: string | null;
  notes: string;
  updated_at: string;
};

export type RentalFinanceSummary = {
  rented_units: number;
  total_area_sqm: number;
  expected_rent: number;
  expected_usage: number;
  expected_total: number;
  collected: number;
  outstanding: number;
  collection_rate: number;
  paid_count: number;
  unpaid_count: number;
  partial_count: number;
  overdue_count: number;
};

export type RentalFinanceData = {
  kind: TowerKind;
  period: { year: number; month: number; label: string };
  rates: { rent_per_sqm: number; usage_per_sqm: number; total_per_sqm: number };
  summary: RentalFinanceSummary;
  payments: RentPayment[];
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: "Төлсөн",
  unpaid: "Төлөөгүй",
  partial: "Хэсэгчлэн",
  overdue: "Хугацаа хэтэрсэн",
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  paid: "green",
  unpaid: "gold",
  partial: "blue",
  overdue: "red",
};

export function formatMnt(value: number) {
  return `${new Intl.NumberFormat("mn-MN").format(value)} ₮`;
}

export async function fetchRentalFinance(
  kind: "office" | "mall",
  year: number,
  month: number,
): Promise<RentalFinanceData | null> {
  const res = await authFetch(
    `/dashboard/rental-finance/?kind=${kind}&year=${year}&month=${month}`,
  );
  if (!res.ok) return null;
  return res.json();
}

export async function markRentPaymentPaid(id: number): Promise<RentPayment> {
  const res = await authFetch(`/dashboard/rental-finance/payments/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ mark_paid: true }),
  });
  if (!res.ok) throw new Error("Төлбөр шинэчлэхэд алдаа гарлаа.");
  return res.json();
}
