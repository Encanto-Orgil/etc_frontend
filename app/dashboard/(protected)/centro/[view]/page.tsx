"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import CentroBrandsManagement from "@/components/dashboard/CentroBrandsManagement";
import CentroPagesManagement from "@/components/dashboard/CentroPagesManagement";
import Inquiries from "@/components/dashboard/Inquiries";
import SiteNewsManagement from "@/components/dashboard/SiteNewsManagement";

const VIEWS = new Set(["brands", "news", "inquiries", "pages"]);

export default function DashboardCentroViewPage({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view } = use(params);

  if (!VIEWS.has(view)) {
    notFound();
  }

  if (view === "brands") return <CentroBrandsManagement />;
  if (view === "news") return <SiteNewsManagement />;
  if (view === "inquiries") return <Inquiries />;
  if (view === "pages") return <CentroPagesManagement />;

  notFound();
}
