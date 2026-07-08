export type DashboardProjectId = "encanto-trade-center" | "encanto-centro";

export const DASHBOARD_PROJECT_COOKIE = "etc_dashboard_project";

export type DashboardProject = {
  id: DashboardProjectId;
  label: string;
  avatar: string;
  homePath: string;
};

export const DASHBOARD_PROJECTS: Record<DashboardProjectId, DashboardProject> = {
  "encanto-trade-center": {
    id: "encanto-trade-center",
    label: "Encanto Trade Center",
    avatar: "E",
    homePath: "/dashboard",
  },
  "encanto-centro": {
    id: "encanto-centro",
    label: "Encanto Centro",
    avatar: "C",
    homePath: "/dashboard/centro",
  },
};

export const CENTRO_NAV_ITEMS = [
  { key: "/dashboard/centro", label: "Dashboard" },
  { key: "/dashboard/centro/brands", label: "Brands" },
  { key: "/dashboard/centro/news", label: "News" },
  { key: "/dashboard/centro/inquiries", label: "Inquiry" },
  { key: "/dashboard/centro/pages", label: "Pages" },
] as const;

export const CENTRO_PAGES: Record<string, { eyebrow: string; title: string }> = {
  "/dashboard/centro": { eyebrow: "Encanto Centro", title: "Dashboard" },
  "/dashboard/centro/brands": { eyebrow: "Encanto Centro", title: "Brands" },
  "/dashboard/centro/news": { eyebrow: "Encanto Centro", title: "News" },
  "/dashboard/centro/inquiries": { eyebrow: "Encanto Centro", title: "Inquiry" },
  "/dashboard/centro/pages": { eyebrow: "Encanto Centro", title: "Pages" },
};

export function getProjectIdFromPathname(pathname: string): DashboardProjectId {
  if (pathname === "/dashboard/centro" || pathname.startsWith("/dashboard/centro/")) {
    return "encanto-centro";
  }
  return "encanto-trade-center";
}

export function getDashboardProject(id: DashboardProjectId): DashboardProject {
  return DASHBOARD_PROJECTS[id];
}
