import { formatMoneyDisplay } from "@/lib/moneyFormat";

export type VatMode = "included" | "excluded" | "none";

export type InvoiceLineInput = {
  quantity: number;
  unit_price: number;
};

export type InvoiceTotals = {
  subtotal: number;
  discountAmount: number;
  netAmount: number;
  vatAmount: number;
  total: number;
};

export const VAT_MODE_LABELS: Record<VatMode, string> = {
  included: "НӨАТ-тай (÷1.1)",
  excluded: "НӨАТ-гүй (+10%)",
  none: "НӨАТ байхгүй",
};

export function computeInvoiceTotals(
  lines: InvoiceLineInput[],
  discountAmount: number,
  vatMode: VatMode,
): InvoiceTotals {
  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.unit_price, 0);
  const discount = Math.max(Number(discountAmount || 0), 0);
  const afterDiscount = Math.max(subtotal - discount, 0);

  if (vatMode === "included") {
    const total = afterDiscount;
    const netAmount = total / 1.1;
    const vatAmount = total - netAmount;
    return { subtotal, discountAmount: discount, netAmount, vatAmount, total };
  }

  if (vatMode === "excluded") {
    const netAmount = afterDiscount;
    const vatAmount = netAmount * 0.1;
    const total = netAmount + vatAmount;
    return { subtotal, discountAmount: discount, netAmount, vatAmount, total };
  }

  return {
    subtotal,
    discountAmount: discount,
    netAmount: afterDiscount,
    vatAmount: 0,
    total: afterDiscount,
  };
}

export function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function formatInvoiceMoney(value: number | string) {
  return formatMoneyDisplay(value);
}
