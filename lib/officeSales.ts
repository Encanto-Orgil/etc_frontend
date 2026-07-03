import { getPrimarySalesContact } from "@/lib/salesTeam";
import { getOfficeSalesProfile, OFFICE_SALES_DEPARTMENT } from "@/lib/officeSalesDisplay";

const primary = getPrimarySalesContact("office");
const primaryProfile = getOfficeSalesProfile(primary.id, primary.name);

export const officeSales = {
  name: primaryProfile.displayName,
  department: OFFICE_SALES_DEPARTMENT.name,
  phone: primary.phones[0],
  phones: primary.phones,
  email: primary.email,
  hours: OFFICE_SALES_DEPARTMENT.hours,
  addressLines: OFFICE_SALES_DEPARTMENT.addressLines,
};

export function buildOfficeInquiryMessage(
  floorLabel: string,
  unitCode: string,
  areaSqm: string,
) {
  return `I would like to inquire about leasing Office ${unitCode} on ${floorLabel} (${areaSqm} sqm).`;
}
