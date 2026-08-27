import type { Inquiry, OfficeLeasingDetails } from "@/lib/inquiryManagement";

const LEASING_DETAIL_LABELS: Record<keyof OfficeLeasingDetails, string> = {
  company_name: "Company",
  business_type: "Business type",
  alt_phone: "Alt. phone",
  office_size: "Office size",
  employees: "Employees",
  move_in_date: "Move-in date",
  duration_years: "Duration (years)",
};

export function formatLeasingDetails(details?: OfficeLeasingDetails): string | null {
  if (!details) return null;

  const lines = (Object.keys(LEASING_DETAIL_LABELS) as (keyof OfficeLeasingDetails)[])
    .map((key) => {
      const value = details[key]?.trim();
      if (!value) return null;
      return `${LEASING_DETAIL_LABELS[key]}: ${value}`;
    })
    .filter(Boolean);

  return lines.length > 0 ? lines.join(" · ") : null;
}

export function inquiryContactTitle(record: Inquiry): string {
  const company = record.leasing_details?.company_name?.trim();
  if (company) return company;
  return record.name;
}

export function inquiryContactSubtitle(record: Inquiry): string | null {
  const company = record.leasing_details?.company_name?.trim();
  if (company && record.name.trim()) return record.name;
  return null;
}
