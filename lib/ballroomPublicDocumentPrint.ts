import type { PublicBallroomDocument } from "./ballroomManagement";

const LOGO_SRC = "/images/encanto-logo.png";
const BRAND_NAME = "Encanto Trade Center";

function escapeHtml(value: string | number) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMoney(value: string | number) {
  return `${Number(value || 0).toLocaleString()} ₮`;
}

function metaRow(label: string, value: string | null | undefined) {
  if (!value) return "";
  return `<div class="field"><span class="label">${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>`;
}

export function buildBallroomPrintableHtml(document: PublicBallroomDocument, logoUrl: string) {
  const isInvoice = document.document_type === "invoice";
  const number = isInvoice ? document.invoice_number : document.quote_number;
  const title = isInvoice ? "Нэхэмжлэх" : "Үнийн санал";
  const profile = document.billing_profile;
  const eventTime =
    document.event_start && document.event_end
      ? `${document.event_start.slice(0, 5)} – ${document.event_end.slice(0, 5)}`
      : "";

  const metaFields = [
    metaRow("Харилцагч", document.customer_name),
    metaRow("Утас", document.customer_phone),
    metaRow("И-мэйл", document.customer_email),
    metaRow("Арга хэмжээ", document.event_type_label),
    metaRow("Огноо", document.event_date || undefined),
    metaRow("Цаг", eventTime),
    metaRow("Гаргасан", document.issue_date),
    isInvoice ? metaRow("Төлөх хугацаа", document.due_date) : metaRow("Хүчинтэй хүртэл", document.valid_until),
    metaRow("Төлөв", document.status_label),
  ].join("");

  const lineRows = document.lines
    .map(
      (line) =>
        `<tr>
          <td>${escapeHtml(line.description)}</td>
          <td class="right">${escapeHtml(line.quantity)}</td>
          <td class="right">${escapeHtml(formatMoney(line.unit_price))}</td>
          <td class="right">${escapeHtml(formatMoney(line.amount))}</td>
        </tr>`,
    )
    .join("");

  const bankBlock =
    profile.bank_name || profile.bank_account_number
      ? `<div class="section">
          <h3>Төлбөрийн мэдээлэл</h3>
          ${profile.bank_name ? `<p>${escapeHtml(profile.bank_name)}</p>` : ""}
          ${profile.bank_account_number ? `<p>Данс: ${escapeHtml(profile.bank_account_number)}</p>` : ""}
          ${profile.bank_account_name ? `<p>${escapeHtml(profile.bank_account_name)}</p>` : ""}
          ${profile.payment_notes ? `<p>${escapeHtml(profile.payment_notes)}</p>` : ""}
        </div>`
      : "";

  const notesBlock = document.notes
    ? `<div class="section">
        <h3>Тэмдэглэл</h3>
        <p>${escapeHtml(document.notes)}</p>
      </div>`
    : "";

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)} ${escapeHtml(number || "")}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #111; margin: 32px; }
    .header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 1px solid #ddd; padding-bottom: 18px; }
    .logo { height: 48px; width: auto; max-width: 180px; object-fit: contain; }
    h1 { margin: 6px 0 0; font-size: 28px; }
    .muted { color: #666; font-size: 12px; }
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; margin: 24px 0; }
    .field { display: grid; grid-template-columns: 130px 1fr; gap: 12px; font-size: 13px; margin: 6px 0; }
    .label { color: #555; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 13px; }
    th { text-align: left; border-bottom: 1px solid #ddd; padding: 9px 8px; background: #f8f8fc; }
    td { border-bottom: 1px solid #eee; padding: 9px 8px; vertical-align: top; }
    .right { text-align: right; }
    .totals { width: 320px; margin-left: auto; margin-top: 20px; }
    .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
    .grand { font-weight: 800; border-top: 1px solid #ddd; margin-top: 6px; padding-top: 10px; font-size: 16px; }
    .section { margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee; }
    .section h3 { margin: 0 0 8px; font-size: 15px; }
    .section p { margin: 0 0 4px; color: #444; font-size: 13px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <img class="logo" src="${escapeHtml(logoUrl)}" alt="${escapeHtml(BRAND_NAME)}" />
      <div class="muted" style="margin-top:12px;">${escapeHtml(profile.company_name || BRAND_NAME)}</div>
    </div>
    <div style="text-align:right;">
      <div class="muted">${escapeHtml(title)}</div>
      <h1>${escapeHtml(number || "")}</h1>
    </div>
  </div>
  <div class="meta">${metaFields}</div>
  <table>
    <thead>
      <tr>
        <th>Үйлчилгээ</th>
        <th class="right">Тоо</th>
        <th class="right">Үнэ</th>
        <th class="right">Дүн</th>
      </tr>
    </thead>
    <tbody>${lineRows}</tbody>
  </table>
  <div class="totals">
    ${Number(document.discount_amount) > 0 ? `<div class="total-row"><span>Хөнгөлөлт</span><strong>${escapeHtml(formatMoney(document.discount_amount))}</strong></div>` : ""}
    <div class="total-row"><span>Цэвэр дүн</span><strong>${escapeHtml(formatMoney(document.net_amount))}</strong></div>
    ${Number(document.vat_amount) > 0 ? `<div class="total-row"><span>НӨАТ</span><strong>${escapeHtml(formatMoney(document.vat_amount))}</strong></div>` : ""}
    <div class="total-row grand"><span>Нийт</span><strong>${escapeHtml(formatMoney(document.total_amount))}</strong></div>
  </div>
  ${bankBlock}
  ${notesBlock}
</body>
</html>`;
}

export function printBallroomPublicDocument(document: PublicBallroomDocument) {
  const logoUrl = `${window.location.origin}${LOGO_SRC}`;
  const printableHtml = buildBallroomPrintableHtml(document, logoUrl);
  const printWindow = window.open("", "_blank", "width=960,height=720");
  if (!printWindow) {
    throw new Error("Popup blocked. Please allow popups to print the document.");
  }
  printWindow.document.write(printableHtml);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
