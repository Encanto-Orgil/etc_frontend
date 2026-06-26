import { getPrimarySalesContact, getSalesPhones } from "@/lib/salesTeam";

const primary = getPrimarySalesContact("office");

export const officeSales = {
  name: primary.name,
  title: primary.role,
  department: "Encanto Trade Center — Борлуулалтын алба",
  phone: primary.phones[0],
  phones: primary.phones,
  email: primary.email,
  hours: "Даваа–Баасан · 09:00–18:00",
};

export function buildOfficeInquiryMessage(
  floorLabel: string,
  unitCode: string,
  areaSqm: string,
) {
  return `${floorLabel}, ${unitCode} оффис (${areaSqm} м²)-ийн түрээсийн талаар лавлахыг хүсч байна.`;
}

export const officeSalesPhones = getSalesPhones("office");
