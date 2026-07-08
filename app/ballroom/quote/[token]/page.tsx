"use client";

import { Alert, Spin, message } from "antd";
import { notFound } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import BallroomPublicDocument from "@/components/ballroom/BallroomPublicDocument";
import {
  fetchPublicBallroomQuote,
  respondPublicBallroomQuote,
  type PublicBallroomDocument,
} from "@/lib/ballroomManagement";

export default function PublicBallroomQuotePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [document, setDocument] = useState<PublicBallroomDocument | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      notFound();
    }
    setLoading(true);
    try {
      setDocument(await fetchPublicBallroomQuote(token));
      setError(null);
    } catch {
      setError("Үнийн санал олдсонгүй эсвэл идэвхгүй болсон.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const respond = async (action: "accept" | "decline") => {
    setActionLoading(true);
    try {
      setDocument(await respondPublicBallroomQuote(token, action));
      message.success(action === "accept" ? "Үнийн саналыг зөвшөөрлөө." : "Үнийн саналд татгалзлаа.");
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Failed to submit response.");
    } finally {
      setActionLoading(false);
    }
  };

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

  return (
    <BallroomPublicDocument
      document={document}
      showQuoteActions
      actionLoading={actionLoading}
      onAccept={() => respond("accept")}
      onDecline={() => respond("decline")}
    />
  );
}
