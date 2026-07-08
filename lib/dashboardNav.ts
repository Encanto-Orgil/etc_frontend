import { TOWER_KIND_LABELS, type TowerKind } from "./stacking";

export type DashboardSubmenuItem = {
  key: string;
  label: string;
  path: string;
};

export type DashboardMenuGroup = {
  key: string;
  label: string;
  path: string;
  items: DashboardSubmenuItem[];
};

export const DASHBOARD_PAGES: Record<string, { eyebrow: string; title: string }> = {
  "/dashboard": { eyebrow: "Encanto Trade Center", title: "Dashboard" },
  "/dashboard/inquiries": { eyebrow: "Operations", title: "Inquiries" },
  "/dashboard/support": { eyebrow: "Operations", title: "Support Tickets" },
  "/dashboard/property": { eyebrow: "Property Management", title: "Stacking Plan" },
  "/dashboard/stacking": { eyebrow: "", title: "Түрээсийн төлөвлөлтийн тойм" },
};

export const DASHBOARD_MANAGEMENT_GROUPS: DashboardMenuGroup[] = [
  {
    key: "property-management",
    label: "Property Management",
    path: "/dashboard/property",
    items: [
      { key: "/dashboard/property", label: "Stacking Plan", path: "/dashboard/property" },
      { key: "/dashboard/property/buildings", label: "Buildings", path: "/dashboard/property/buildings" },
      { key: "/dashboard/property/floors", label: "Floors", path: "/dashboard/property/floors" },
      { key: "/dashboard/property/units", label: "Units", path: "/dashboard/property/units" },
      { key: "/dashboard/property/tenants", label: "Tenants", path: "/dashboard/property/tenants" },
      { key: "/dashboard/property/contracts", label: "Contracts", path: "/dashboard/property/contracts" },
      {
        key: "/dashboard/property/rent-schedule",
        label: "Rent Schedule",
        path: "/dashboard/property/rent-schedule",
      },
      {
        key: "/dashboard/property/rental-invoices",
        label: "Rental Invoices",
        path: "/dashboard/property/rental-invoices",
      },
    ],
  },
  {
    key: "ballroom-management",
    label: "Ballroom Management",
    path: "/dashboard/ballroom",
    items: [
      { key: "/dashboard/ballroom", label: "Dashboard", path: "/dashboard/ballroom" },
      { key: "/dashboard/ballroom/bookings", label: "Bookings", path: "/dashboard/ballroom/bookings" },
      { key: "/dashboard/ballroom/calendar", label: "Calendar", path: "/dashboard/ballroom/calendar" },
      { key: "/dashboard/ballroom/events", label: "Events", path: "/dashboard/ballroom/events" },
      { key: "/dashboard/ballroom/customers", label: "Customers", path: "/dashboard/ballroom/customers" },
      { key: "/dashboard/ballroom/invoices", label: "Invoices", path: "/dashboard/ballroom/invoices" },
      { key: "/dashboard/ballroom/quotes", label: "Quotes", path: "/dashboard/ballroom/quotes" },
      { key: "/dashboard/ballroom/settings", label: "Settings", path: "/dashboard/ballroom/settings" },
      { key: "/dashboard/ballroom/bms", label: "BMS", path: "/dashboard/ballroom/bms" },
      { key: "/dashboard/ballroom/bms/cameras", label: "Cameras", path: "/dashboard/ballroom/bms/cameras" },
      {
        key: "/dashboard/ballroom/bms/fire-alarms",
        label: "Fire Alarms",
        path: "/dashboard/ballroom/bms/fire-alarms",
      },
      {
        key: "/dashboard/ballroom/bms/elevator-access",
        label: "Elevator NFC",
        path: "/dashboard/ballroom/bms/elevator-access",
      },
    ],
  },
  {
    key: "site-management",
    label: "Site Management",
    path: "/dashboard/site",
    items: [
      { key: "/dashboard/site", label: "Dashboard", path: "/dashboard/site" },
      { key: "/dashboard/site/pages", label: "Pages", path: "/dashboard/site/pages" },
      { key: "/dashboard/site/media", label: "Media", path: "/dashboard/site/media" },
      { key: "/dashboard/site/news", label: "News", path: "/dashboard/site/news" },
      { key: "/dashboard/site/promotions", label: "Promotions", path: "/dashboard/site/promotions" },
      { key: "/dashboard/site/seo", label: "SEO", path: "/dashboard/site/seo" },
      { key: "/dashboard/site/settings", label: "Settings", path: "/dashboard/site/settings" },
    ],
  },
];

export const DASHBOARD_MANAGEMENT_PAGES = DASHBOARD_MANAGEMENT_GROUPS.reduce<
  Record<string, { eyebrow: string; title: string }>
>((pages, group) => {
  group.items.forEach((item) => {
    pages[item.path] = { eyebrow: group.label, title: item.label };
  });
  pages["/dashboard/property/dashboard"] = { eyebrow: "Property Management", title: "Dashboard" };
  return pages;
}, {});

const KIND_PATH = /^\/dashboard\/stacking\/(office|mall|apartment)$/;
const PROPERTY_TENANT_DETAIL_PATH = /^\/dashboard\/property\/tenants\/\d+$/;
const PROPERTY_CONTRACT_DETAIL_PATH = /^\/dashboard\/property\/contracts\/\d+$/;
const PROPERTY_RENT_SCHEDULE_DETAIL_PATH = /^\/dashboard\/property\/rent-schedule\/\d+$/;
const BALLROOM_INVOICE_DETAIL_PATH = /^\/dashboard\/ballroom\/invoices\/\d+$/;
const BALLROOM_QUOTE_DETAIL_PATH = /^\/dashboard\/ballroom\/quotes\/\d+$/;

export function getDashboardPageMeta(pathname: string) {
  const kindMatch = pathname.match(KIND_PATH);
  if (kindMatch) {
    const kind = kindMatch[1] as TowerKind;
    return {
      eyebrow: "",
      title: TOWER_KIND_LABELS[kind],
    };
  }

  if (PROPERTY_TENANT_DETAIL_PATH.test(pathname)) {
    return { eyebrow: "Property Management / Tenants", title: "Tenant Detail" };
  }

  if (PROPERTY_CONTRACT_DETAIL_PATH.test(pathname)) {
    return { eyebrow: "Property Management / Contracts", title: "Contract Detail" };
  }

  if (PROPERTY_RENT_SCHEDULE_DETAIL_PATH.test(pathname)) {
    return { eyebrow: "Property Management / Rent Schedule", title: "Invoice Detail" };
  }

  if (BALLROOM_INVOICE_DETAIL_PATH.test(pathname)) {
    return { eyebrow: "Ballroom Management / Invoices", title: "Invoice Detail" };
  }

  if (BALLROOM_QUOTE_DETAIL_PATH.test(pathname)) {
    return { eyebrow: "Ballroom Management / Quotes", title: "Quote Detail" };
  }

  return (
    DASHBOARD_MANAGEMENT_PAGES[pathname] ??
    DASHBOARD_PAGES[pathname] ?? { eyebrow: "Удирдлага", title: "Хяналтын самбар" }
  );
}

export function isStackingSection(pathname: string) {
  return pathname === "/dashboard/stacking" || pathname.startsWith("/dashboard/stacking/");
}

export function getDashboardSelectedKey(pathname: string) {
  if (pathname === "/dashboard") return "/dashboard";
  if (pathname === "/dashboard/inquiries" || pathname.startsWith("/dashboard/inquiries/")) {
    return "/dashboard/inquiries";
  }
  if (pathname === "/dashboard/support" || pathname.startsWith("/dashboard/support/")) return "/dashboard/support";
  if (pathname === "/dashboard/property" || pathname === "/dashboard/property/stacking") {
    return "/dashboard/property";
  }
  if (PROPERTY_TENANT_DETAIL_PATH.test(pathname)) return "/dashboard/property/tenants";
  if (PROPERTY_CONTRACT_DETAIL_PATH.test(pathname)) return "/dashboard/property/contracts";
  if (PROPERTY_RENT_SCHEDULE_DETAIL_PATH.test(pathname)) return "/dashboard/property/rent-schedule";
  if (BALLROOM_INVOICE_DETAIL_PATH.test(pathname)) return "/dashboard/ballroom/invoices";
  if (BALLROOM_QUOTE_DETAIL_PATH.test(pathname)) return "/dashboard/ballroom/quotes";
  if (pathname === "/dashboard/ballroom/bms" || pathname.startsWith("/dashboard/ballroom/bms/")) {
    const exact = DASHBOARD_MANAGEMENT_GROUPS.flatMap((group) => group.items).find(
      (item) => item.path === pathname,
    );
    if (exact) return exact.key;
    return "/dashboard/ballroom/bms";
  }

  const exactGroupItem = DASHBOARD_MANAGEMENT_GROUPS.flatMap((group) => group.items).find(
    (item) => item.path === pathname,
  );

  if (exactGroupItem) return exactGroupItem.key;
  if (isStackingSection(pathname)) return "/dashboard/property";

  return "/dashboard";
}

export function getDashboardOpenKeys(pathname: string) {
  return DASHBOARD_MANAGEMENT_GROUPS.filter(
    (group) => pathname === group.path || pathname.startsWith(`${group.path}/`),
  ).map((group) => group.key);
}

export function getDashboardManagementRoute(pathname: string) {
  const group = DASHBOARD_MANAGEMENT_GROUPS.find(
    (item) => pathname === item.path || pathname.startsWith(`${item.path}/`),
  );

  if (!group) return null;

  const activeItem = group.items.find((item) => item.path === pathname);
  if (!activeItem) return null;

  return { group, activeItem };
}
