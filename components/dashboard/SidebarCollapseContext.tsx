"use client";

import { createContext, useContext } from "react";

export type SidebarCollapseContextValue = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  toggleCollapsed: () => void;
};

export const SidebarCollapseContext =
  createContext<SidebarCollapseContextValue | null>(null);

export function useSidebarCollapse() {
  const ctx = useContext(SidebarCollapseContext);
  if (!ctx) {
    throw new Error("useSidebarCollapse must be used within DashboardShell");
  }
  return ctx;
}
