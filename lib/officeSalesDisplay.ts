/** English copy for the office landing page sales & contact blocks */

export const OFFICE_SALES_DEPARTMENT = {
  name: "Sales Department",
  addressLines: [
    "Ulaanbaatar, Bayanzurkh District,",
    "26th Khoroo, Ikh Mongol Uls Avenue",
    "Encanto Office, 4th Floor",
  ],
  hours: "Mon - Fri: 09:00 - 18:00",
};

export const OFFICE_SALES_PROFILES: Record<
  string,
  { displayName: string; title: string; focus: string }
> = {
  hetbold: {
    displayName: "A. Khetbold",
    title: "General Manager",
    focus: "Office & retail leasing",
  },
  "nomin-erdene": {
    displayName: "T. Nomin-Erdene",
    title: "Sales Manager",
    focus: "Residential sales",
  },
  rolomjav: {
    displayName: "Rolomjav",
    title: "Sales Manager",
    focus: "Residential sales",
  },
};

export function getOfficeSalesProfile(id: string, fallbackName: string) {
  const profile = OFFICE_SALES_PROFILES[id];
  return {
    displayName: profile?.displayName ?? fallbackName,
    title: profile?.title ?? "",
    focus: profile?.focus ?? "",
  };
}
