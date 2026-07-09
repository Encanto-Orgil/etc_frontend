"use client";

import { ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Spin } from "antd";
import { useCallback, useEffect, useState } from "react";
import { fetchPortalContracts, fetchPortalSummary, type PortalSummary } from "@/lib/portalManagement";
import type { LeaseContract } from "@/lib/propertyManagement";
import PortalContractCard from "./PortalContractCard";
import PortalSummaryCard, { buildPortalMetrics } from "./PortalSummaryCard";
import portalStyles from "./Portal.module.css";
import styles from "../dashboard/DashboardOverview.module.css";

export default function PortalLeaseSummary() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<PortalSummary | null>(null);
  const [contracts, setContracts] = useState<LeaseContract[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryData, contractData] = await Promise.all([
        fetchPortalSummary(),
        fetchPortalContracts(),
      ]);
      setSummary(summaryData);
      setContracts(contractData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main className={styles.page}>
      <Spin spinning={loading}>
        <section className={styles.projectsSection}>
          <div className={portalStyles.pageHeader}>
            <div className={portalStyles.pageHeaderMain}>
              <span className={portalStyles.eyebrow}>Түрээслэгчийн портал</span>
              <h1>Lease summary</h1>
              <p className={portalStyles.pageSubtitle}>
                Идэвхтэй гэрээ, төлбөрийн тойм болон түрээсийн мэдээлэл.
              </p>
            </div>
            <Button className={styles.iconButton} icon={<ReloadOutlined />} onClick={load} />
          </div>

          {summary ? (
            <>
              <div className={styles.overviewGrid} style={{ gridTemplateColumns: "minmax(280px, 360px) minmax(0, 1fr)" }}>
                <aside className={styles.sideColumn}>
                  <PortalSummaryCard metrics={buildPortalMetrics(summary.summary)} />

                  <Card bordered className={styles.sideCard} styles={{ body: { padding: 16 } }}>
                    <div className={styles.alertCardContent}>
                      <h2>{summary.tenant.company || summary.tenant.name}</h2>
                      <p>
                        {summary.tenant.email || "—"}
                        {summary.tenant.phone ? ` · ${summary.tenant.phone}` : ""}
                      </p>
                      {summary.tenant.address ? <p>{summary.tenant.address}</p> : null}
                    </div>
                  </Card>
                </aside>

                <section>
                  <h2 className={styles.sectionTitle}>Гэрээнүүд</h2>
                  <div className={styles.projectGrid}>
                    {contracts.length ? (
                      contracts.map((contract) => (
                        <PortalContractCard key={contract.id} contract={contract} />
                      ))
                    ) : (
                      <Card bordered className={styles.projectCard} styles={{ body: { padding: 16 } }}>
                        <p className={styles.mutedText}>Гэрээ байхгүй.</p>
                      </Card>
                    )}
                  </div>
                </section>
              </div>
            </>
          ) : !loading ? (
            <Card bordered className={portalStyles.contentCard} styles={{ body: { padding: 24 } }}>
              <p className={styles.mutedText}>Түрээсийн мэдээлэл ачаалахад алдаа гарлаа.</p>
            </Card>
          ) : null}
        </section>
      </Spin>
    </main>
  );
}
