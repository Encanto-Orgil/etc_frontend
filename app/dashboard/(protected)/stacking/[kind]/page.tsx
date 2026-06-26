"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import StackingManager from "@/components/dashboard/StackingManager";
import type { TowerKind } from "@/lib/stacking";

const VALID_KINDS = new Set<TowerKind>(["office", "mall", "apartment"]);

export default function DashboardStackingKindPage({
  params,
}: {
  params: Promise<{ kind: string }>;
}) {
  const { kind } = use(params);

  if (!VALID_KINDS.has(kind as TowerKind)) {
    notFound();
  }

  return <StackingManager kind={kind as TowerKind} />;
}
