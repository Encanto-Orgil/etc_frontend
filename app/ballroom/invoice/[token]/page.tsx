"use client";

import { Alert, Spin } from "antd";
import { notFound } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import BallroomPublicDocument from "@/components/ballroom/BallroomPublicDocument";
import { fetchPublicBallroomInvoice, type PublicBallroomDocument } from "@/lib/ballroomManagement";

export default function PublicBallroomInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [document, setDocument] = useState<PublicBallroomDocument | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      notFound();
    }
    setLoading(true);
    try {
      setDocument(await fetchPublicBallroomInvoice(token));
      setError(null);
    } catch {
      setError("Нэхэмжлэх олдсонгүй эсвэл идэвхгүй болсон.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div style={{ maxWidth: 640, margin: "48px auto", padding: "0 16px" }}>
        <Alert type="error" message={error || "Not found"} showIcon />
      </div>
    );
  }

  return <BallroomPublicDocument document={document} />;
}
