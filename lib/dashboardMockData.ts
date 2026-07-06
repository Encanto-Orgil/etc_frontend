import type { ReactNode } from "react";

export type UsageTone = "red" | "orange" | "blue";

export type UsageMetric = {
  label: string;
  value: string;
  tone: UsageTone;
  hasInfo?: boolean;
  progressPercent?: number;
};

export type RecentPreview = {
  title: string;
  issue: string;
  hash: string;
  provider: "github";
};

export type Project = {
  id: string;
  name: string;
  url: string;
  repo: string;
  commit: string;
  time: string;
  branch: string;
  logo: ReactNode;
  logoTone: "black" | "blue" | "green" | "orange" | "purple";
};

export const usageMetrics: UsageMetric[] = [
  {
    label: "Edge Requests",
    value: "1.4M / 1M",
    tone: "red",
    hasInfo: true,
  },
  {
    label: "ISR Writes",
    value: "183K / 200K",
    tone: "orange",
  },
  {
    label: "Image Optimization - Transformations",
    value: "4.3K / 5K",
    tone: "orange",
    hasInfo: true,
  },
  {
    label: "Fluid Active CPU",
    value: "1h 43m / 4h",
    tone: "blue",
    progressPercent: 43,
  },
];

export const recentPreview: RecentPreview = {
  title: "Add AGENTS.md with Cursor Cloud develo...",
  issue: "#1",
  hash: "a8f3c21",
  provider: "github",
};

export const projects: Project[] = [
  {
    id: "encanto-web",
    name: "encanto-web",
    url: "encantotradecenter.vercel.app",
    repo: "sukhochird/encanto-web",
    commit: "Refine homepage building hero",
    time: "16h ago",
    branch: "main",
    logo: "N",
    logoTone: "black",
  },
  {
    id: "etc-dashboard",
    name: "etc-dashboard",
    url: "etc-dashboard-angar.vercel.app",
    repo: "sukhochird/etc-dashboard",
    commit: "Build tenant overview cards",
    time: "1d ago",
    branch: "main",
    logo: "E",
    logoTone: "blue",
  },
  {
    id: "property-management",
    name: "property-management",
    url: "property-management-demo.vercel.app",
    repo: "sukhochird/property-management",
    commit: "Update tenant table actions",
    time: "2d ago",
    branch: "main",
    logo: "P",
    logoTone: "green",
  },
  {
    id: "mall-directory",
    name: "mall-directory",
    url: "mall-directory-preview.vercel.app",
    repo: "sukhochird/mall-directory",
    commit: "Add retail floor filters",
    time: "Jun 28",
    branch: "main",
    logo: "M",
    logoTone: "orange",
  },
  {
    id: "office-stacking",
    name: "office-stacking",
    url: "office-stacking-visualizer.vercel.app",
    repo: "sukhochird/office-stacking",
    commit: "Sync available units data",
    time: "Jun 24",
    branch: "main",
    logo: "O",
    logoTone: "purple",
  },
  {
    id: "residence-portal",
    name: "residence-portal",
    url: "residence-portal-angar.vercel.app",
    repo: "sukhochird/residence-portal",
    commit: "Improve booking status labels",
    time: "Jun 21",
    branch: "main",
    logo: "R",
    logoTone: "blue",
  },
  {
    id: "ballroom-bookings",
    name: "ballroom-bookings",
    url: "ballroom-bookings.vercel.app",
    repo: "sukhochird/ballroom-bookings",
    commit: "Release event inquiry form",
    time: "Jun 18",
    branch: "main",
    logo: "B",
    logoTone: "green",
  },
  {
    id: "finance-ledger",
    name: "finance-ledger",
    url: "finance-ledger-staging.vercel.app",
    repo: "sukhochird/finance-ledger",
    commit: "Calculate rent aging buckets",
    time: "Jun 15",
    branch: "main",
    logo: "F",
    logoTone: "black",
  },
  {
    id: "leasing-crm",
    name: "leasing-crm",
    url: "leasing-crm-preview.vercel.app",
    repo: "sukhochird/leasing-crm",
    commit: "Add broker follow-up queue",
    time: "Jun 12",
    branch: "main",
    logo: "L",
    logoTone: "orange",
  },
  {
    id: "marketing-site",
    name: "marketing-site",
    url: "encanto-marketing.vercel.app",
    repo: "sukhochird/marketing-site",
    commit: "Polish amenities sections",
    time: "Jun 9",
    branch: "main",
    logo: "A",
    logoTone: "purple",
  },
  {
    id: "tenant-mobile",
    name: "tenant-mobile",
    url: "tenant-mobile-web.vercel.app",
    repo: "sukhochird/tenant-mobile",
    commit: "Ship maintenance request flow",
    time: "Jun 6",
    branch: "main",
    logo: "T",
    logoTone: "blue",
  },
  {
    id: "ops-reports",
    name: "ops-reports",
    url: "ops-reports-angar.vercel.app",
    repo: "sukhochird/ops-reports",
    commit: "Add occupancy export",
    time: "Jun 1",
    branch: "main",
    logo: "S",
    logoTone: "green",
  },
];
