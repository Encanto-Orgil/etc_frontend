import dayjs from "dayjs";
import type { LeaseRentScheduleLine, LeaseRentScheduleStatus } from "./propertyManagement";

export const INVOICE_STATUS_LABELS: Record<LeaseRentScheduleStatus, string> = {
  pending: "Ноорог",
  invoiced: "Илгээсэн",
  paid: "Төлсөн",
  cancelled: "Цуцлагдсан",
};

export const INVOICE_STATUS_COLORS: Record<LeaseRentScheduleStatus, string> = {
  pending: "default",
  invoiced: "blue",
  paid: "green",
  cancelled: "red",
};

export const INVOICE_LOGO_SRC = "/images/encanto-logo.png";
export const INVOICE_BRAND_NAME = "Encanto Trade Center";

export type InvoiceLineRow = {
  key: string;
  product: string;
  description: string;
  quantity: string;
  price: string | number;
  amount: string | number;
};

export function formatInvoiceMoney(value: string | number) {
  return `${Number(value || 0).toLocaleString()} ₮`;
}

export function formatInvoiceDate(value: string | null) {
  return value ? dayjs(value).format("YYYY-MM-DD") : "-";
}

export function buildInvoiceRows(line: LeaseRentScheduleLine): InvoiceLineRow[] {
  const rows: InvoiceLineRow[] = [
    {
      key: "rent",
      product: "Түрээс",
      description: `${line.unit_code} (${formatInvoiceDate(line.period_start)} – ${formatInvoiceDate(line.period_end)})`,
      quantity: "1.00",
      price: line.rent_amount,
      amount: line.rent_amount,
    },
  ];
  if (Number(line.service_charge || 0) > 0) {
    rows.push({
      key: "service",
      product: "Үйлчилгээний төлбөр",
      description: `${line.unit_code} үйлчилгээний төлбөр`,
      quantity: "1.00",
      price: line.service_charge,
      amount: line.service_charge,
    });
  }
  return rows;
}

function escapeHtml(value: string | number) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function loadImageDataUrl(src: string) {
  const response = await fetch(src);
  if (!response.ok) throw new Error("Failed to load invoice logo.");
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function buildPrintableHtml(
  line: LeaseRentScheduleLine,
  invoiceRows: InvoiceLineRow[],
  logoUrl: string,
) {
  const invoiceNumber = line.invoice_reference || `Нэхэмжлэх #${line.id}`;
  return `<!doctype html>
<html>
<head>
  <title>${escapeHtml(invoiceNumber)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #111; margin: 32px; }
    .header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 1px solid #ddd; padding-bottom: 18px; }
    .logo { height: 48px; width: auto; max-width: 180px; object-fit: contain; }
    h1 { margin: 6px 0 0; font-size: 28px; }
    .muted { color: #666; font-size: 12px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin: 24px 0; }
    .field { display: grid; grid-template-columns: 130px 1fr; gap: 12px; margin: 9px 0; font-size: 13px; }
    .label { color: #555; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 13px; }
    th { text-align: left; border-bottom: 1px solid #ddd; padding: 9px 8px; background: #f8f8fc; }
    td { border-bottom: 1px solid #eee; padding: 9px 8px; vertical-align: top; }
    .right { text-align: right; }
    .totals { width: 360px; margin-left: auto; margin-top: 20px; }
    .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
    .grand { font-weight: 800; border-top: 1px solid #ddd; margin-top: 6px; padding-top: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <img class="logo" src="${escapeHtml(logoUrl)}" alt="${escapeHtml(INVOICE_BRAND_NAME)}" />
      <div class="muted" style="margin-top:12px;">${escapeHtml(INVOICE_BRAND_NAME)}</div>
    </div>
    <div style="text-align:right;">
      <div class="muted">Нэхэмжлэх</div>
      <h1>${escapeHtml(invoiceNumber)}</h1>
      <div class="muted">${escapeHtml(line.contract_number)} · ${escapeHtml(line.period_start)} – ${escapeHtml(line.period_end)}</div>
      <div class="muted">Төлөв: ${escapeHtml(INVOICE_STATUS_LABELS[line.status])}</div>
    </div>
  </div>
  <div class="grid">
    <div>
      <div class="field"><span class="label">Харилцагч</span><span>${escapeHtml(line.tenant_company || line.tenant_name)}</span></div>
      <div class="field"><span class="label">Гэрээ</span><span>${escapeHtml(line.contract_number)}</span></div>
      <div class="field"><span class="label">Талбай</span><span>${escapeHtml(`${line.building_name} · ${line.floor_number}F · ${line.unit_code}`)}</span></div>
    </div>
    <div>
      <div class="field"><span class="label">Огноо</span><span>${escapeHtml(formatInvoiceDate(line.created_at))}</span></div>
      <div class="field"><span class="label">Төлөх хугацаа</span><span>${escapeHtml(formatInvoiceDate(line.due_date))}</span></div>
      <div class="field"><span class="label">Валют</span><span>MNT</span></div>
    </div>
  </div>
  <table>
    <thead><tr><th>Бүтээгдэхүүн</th><th class="right">Тоо</th><th class="right">Үнэ</th><th class="right">Дүн</th></tr></thead>
    <tbody>
      ${invoiceRows
        .map(
          (row) =>
            `<tr><td><strong>${escapeHtml(row.product)}</strong><br/><span class="muted">${escapeHtml(row.description)}</span></td><td class="right">${escapeHtml(row.quantity)}</td><td class="right">${escapeHtml(formatInvoiceMoney(row.price))}</td><td class="right">${escapeHtml(formatInvoiceMoney(row.amount))}</td></tr>`,
        )
        .join("")}
    </tbody>
  </table>
  <div class="totals">
    <div class="total-row"><span>НӨАТ-гүй дүн</span><strong>${escapeHtml(formatInvoiceMoney(line.total_amount))}</strong></div>
    <div class="total-row"><span>Татвар</span><strong>0 ₮</strong></div>
    <div class="total-row grand"><span>Нийт</span><strong>${escapeHtml(formatInvoiceMoney(line.total_amount))}</strong></div>
    <div class="total-row grand"><span>Төлөх дүн</span><strong>${escapeHtml(formatInvoiceMoney(line.total_amount))}</strong></div>
  </div>
</body>
</html>`;
}

export async function printInvoiceDocument(line: LeaseRentScheduleLine, invoiceRows: InvoiceLineRow[]) {
  const logoUrl = `${window.location.origin}${INVOICE_LOGO_SRC}`;
  const printableHtml = buildPrintableHtml(line, invoiceRows, logoUrl);
  const printWindow = window.open("", "_blank", "width=960,height=720");
  if (!printWindow) throw new Error("Popup blocked. Please allow popups to print the invoice.");
  printWindow.document.write(printableHtml);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

export async function downloadInvoicePdf(line: LeaseRentScheduleLine, invoiceRows: InvoiceLineRow[]) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 42;
  let y = 52;
  const invoiceNumber = line.invoice_reference || `Invoice_${line.id}`;

  try {
    const logoData = await loadImageDataUrl(INVOICE_LOGO_SRC);
    doc.addImage(logoData, "PNG", margin, y - 18, 120, 36);
  } catch {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(INVOICE_BRAND_NAME, margin, y);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Нэхэмжлэх", pageWidth - margin, y, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  y += 28;
  doc.text(invoiceNumber, pageWidth - margin, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  y += 18;
  doc.text(`${line.contract_number} · ${line.period_start} – ${line.period_end}`, pageWidth - margin, y, { align: "right" });
  doc.text(`Төлөв: ${INVOICE_STATUS_LABELS[line.status]}`, pageWidth - margin, y + 18, { align: "right" });

  y += 38;
  const leftX = margin;
  const rightX = pageWidth / 2 + 10;
  const fields = [
    ["Харилцагч", line.tenant_company || line.tenant_name, "Огноо", formatInvoiceDate(line.created_at)],
    ["Гэрээ", line.contract_number, "Төлөх хугацаа", formatInvoiceDate(line.due_date)],
    ["Талбай", `${line.building_name} · ${line.floor_number}F · ${line.unit_code}`, "Валют", "MNT"],
  ];
  fields.forEach(([leftLabel, leftValue, rightLabel, rightValue]) => {
    doc.setFont("helvetica", "bold");
    doc.text(leftLabel, leftX, y);
    doc.text(rightLabel, rightX, y);
    doc.setFont("helvetica", "normal");
    doc.text(String(leftValue), leftX + 90, y);
    doc.text(String(rightValue), rightX + 90, y);
    y += 20;
  });

  y += 20;
  doc.setDrawColor(220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 22;
  doc.setFont("helvetica", "bold");
  doc.text("Бүтээгдэхүүн", margin, y);
  doc.text("Тоо", pageWidth - 220, y, { align: "right" });
  doc.text("Үнэ", pageWidth - 130, y, { align: "right" });
  doc.text("Дүн", pageWidth - margin, y, { align: "right" });
  y += 14;
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;

  invoiceRows.forEach((row) => {
    doc.setFont("helvetica", "bold");
    doc.text(row.product, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(row.quantity, pageWidth - 220, y, { align: "right" });
    doc.text(formatInvoiceMoney(row.price), pageWidth - 130, y, { align: "right" });
    doc.text(formatInvoiceMoney(row.amount), pageWidth - margin, y, { align: "right" });
    y += 15;
    doc.setFontSize(9);
    doc.text(row.description, margin, y);
    doc.setFontSize(10);
    y += 22;
  });

  y += 20;
  const totalX = pageWidth - 250;
  const totalRows = [
    ["НӨАТ-гүй дүн", formatInvoiceMoney(line.total_amount)],
    ["Татвар", "0 ₮"],
    ["Нийт", formatInvoiceMoney(line.total_amount)],
    ["Төлөх дүн", formatInvoiceMoney(line.total_amount)],
  ];
  totalRows.forEach(([label, value], index) => {
    doc.setFont("helvetica", index >= 2 ? "bold" : "normal");
    doc.text(label, totalX, y);
    doc.text(value, pageWidth - margin, y, { align: "right" });
    y += 18;
  });

  doc.save(`${invoiceNumber.replace(/[^\w-]+/g, "_")}.pdf`);
}
