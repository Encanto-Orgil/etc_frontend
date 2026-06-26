"use client";

import { ReloadOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import StackingAiInsight from "@/components/dashboard/StackingAiInsight";
import StackingPaymentBrief from "@/components/dashboard/StackingPaymentBrief";
import StackingTowerCard from "@/components/dashboard/StackingTowerCard";
import type { DashboardStats } from "@/lib/auth";
import { fetchDashboardStats } from "@/lib/auth";
import type { StackingSummary, TowerKind } from "@/lib/stacking";
import {
  buildPortfolioAiInsight,
  buildStackingInsights,
  STACKING_TOWER_META,
} from "@/lib/stackingInsights";
import styles from "./StackingOverview.module.css";

const KINDS: TowerKind[] = ["office", "mall", "apartment"];

const EMPTY_SUMMARY: StackingSummary = {
  floor_count: 0,
  unit_count: 0,
  available_count: 0,
  rented_count: 0,
  reserved_count: 0,
  unavailable_count: 0,
};

export default function StackingOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDashboardStats();
      setStats(data);
      setUpdatedAt(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stacking = stats?.stacking;

  const stackingByKind = useMemo(
    () => ({
      office: stacking?.office ?? EMPTY_SUMMARY,
      mall: stacking?.mall ?? EMPTY_SUMMARY,
      apartment: stacking?.apartment ?? EMPTY_SUMMARY,
    }),
    [stacking],
  );

  const portfolioInsight = useMemo(
    () => buildPortfolioAiInsight(stackingByKind),
    [stackingByKind],
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <Button icon={<ReloadOutlined />} onClick={load} loading={loading}>
          Шинэчлэх
        </Button>
      </div>

      <Row gutter={[20, 20]} className={styles.grid}>
        {KINDS.map((kind) => {
          const summary = stackingByKind[kind];
          const insights = buildStackingInsights(summary, kind);
          return (
            <Col key={kind} xs={24} lg={8}>
              <StackingTowerCard
                meta={STACKING_TOWER_META[kind]}
                summary={summary}
                insights={insights}
                loading={loading}
              />
            </Col>
          );
        })}
      </Row>

      <StackingPaymentBrief finance={stats?.rental_finance} loading={loading} />

      <StackingAiInsight insight={portfolioInsight} updatedAt={updatedAt} loading={loading} />
    </div>
  );
}
