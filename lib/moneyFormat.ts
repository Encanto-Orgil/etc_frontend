/** Parse digits from a formatted money string into a number. */
export function parseMoneyDigits(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return 0;
  return Number(digits);
}

/** Format a number with comma thousand separators, e.g. 12300000 → "12,300,000". */
export function formatMoneyDigits(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "string" && value.replace(/[^\d]/g, "") === "") return "";
  const num = typeof value === "number" ? value : parseMoneyDigits(value);
  if (!Number.isFinite(num)) return "";
  return num.toLocaleString("en-US");
}

/** Display money with currency symbol. */
export function formatMoneyDisplay(value: string | number | null | undefined) {
  return `${Number(value || 0).toLocaleString("en-US")} ₮`;
}
