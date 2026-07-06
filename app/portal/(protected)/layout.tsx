"use client";

import { Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PortalShell from "@/components/portal/PortalShell";
import { getMe, type AuthUser } from "@/lib/auth";

export default function ProtectedPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    getMe().then((nextUser) => {
      if (!nextUser) {
        router.replace("/portal/login");
        return;
      }
      if (nextUser.is_staff) {
        router.replace("/dashboard");
        return;
      }
      if (nextUser.role !== "tenant") {
        router.replace("/portal/login");
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

  return <PortalShell user={user}>{children}</PortalShell>;
}
