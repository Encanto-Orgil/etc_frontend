"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DASHBOARD_PROJECT_COOKIE,
  DASHBOARD_PROJECTS,
  getDashboardProject,
  getProjectIdFromPathname,
  type DashboardProjectId,
} from "@/lib/dashboardProjects";

type DashboardProjectContextValue = {
  projectId: DashboardProjectId;
  project: (typeof DASHBOARD_PROJECTS)[DashboardProjectId];
  setProject: (id: DashboardProjectId) => void;
};

const DashboardProjectContext = createContext<DashboardProjectContextValue | null>(null);

function readStoredProject(): DashboardProjectId | null {
  if (typeof window === "undefined") return null;

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${DASHBOARD_PROJECT_COOKIE}=`))
    ?.split("=")[1];

  if (cookie === "encanto-trade-center" || cookie === "encanto-centro") {
    return cookie;
  }

  const stored = localStorage.getItem(DASHBOARD_PROJECT_COOKIE);
  if (stored === "encanto-trade-center" || stored === "encanto-centro") {
    return stored;
  }

  return null;
}

function persistProject(id: DashboardProjectId) {
  document.cookie = `${DASHBOARD_PROJECT_COOKIE}=${id};path=/;max-age=31536000;SameSite=Lax`;
  localStorage.setItem(DASHBOARD_PROJECT_COOKIE, id);
}

export function DashboardProjectProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const pathProjectId = getProjectIdFromPathname(pathname);
  const [projectId, setProjectIdState] = useState<DashboardProjectId>(pathProjectId);

  useEffect(() => {
    setProjectIdState(pathProjectId);
    persistProject(pathProjectId);
  }, [pathProjectId]);

  const setProject = useCallback(
    (id: DashboardProjectId) => {
      const next = getDashboardProject(id);
      setProjectIdState(id);
      persistProject(id);
      router.push(next.homePath);
    },
    [router],
  );

  const value = useMemo(
    () => ({
      projectId,
      project: getDashboardProject(projectId),
      setProject,
    }),
    [projectId, setProject],
  );

  return (
    <DashboardProjectContext.Provider value={value}>{children}</DashboardProjectContext.Provider>
  );
}

export function useDashboardProject() {
  const ctx = useContext(DashboardProjectContext);
  if (!ctx) {
    throw new Error("useDashboardProject must be used within DashboardProjectProvider");
  }
  return ctx;
}

export default DashboardProjectProvider;
