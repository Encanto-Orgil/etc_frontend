"use client";

import { Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getMe, type AuthUser } from "@/lib/auth";

export default function ProtectedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    getMe().then((nextUser) => {
      if (!nextUser) {
        router.replace("/dashboard/login");
        return;
      }
      if (!nextUser.is_staff) {
        router.replace(nextUser.role === "tenant" ? "/portal" : "/portal/login");
        return;
      }
      setUser(nextUser);
    });
  }, [router]);

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
