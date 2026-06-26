"use client";

import { BulbOutlined } from "@ant-design/icons";
import type { PortfolioAiInsight } from "@/lib/stackingInsights";
import { formatStackingUpdatedAt } from "@/lib/stackingInsights";
import styles from "./StackingAiInsight.module.css";

type Props = {
  insight: PortfolioAiInsight;
  updatedAt: Date | null;
  loading?: boolean;
};

export default function StackingAiInsight({ insight, updatedAt, loading }: Props) {
  return (
    <section className={`${styles.panel} ${styles[insight.tone]} ${loading ? styles.loading : ""}`}>
      <div className={styles.head}>
        <div className={styles.badge}>
          <BulbOutlined />
          <span>AI insight</span>
        </div>
        {updatedAt ? (
          <time className={styles.updated} dateTime={updatedAt.toISOString()}>
            Сүүлд шинэчлэгдсэн: {formatStackingUpdatedAt(updatedAt)}
          </time>
        ) : null}
      </div>

      <p className={styles.summary}>{insight.summary}</p>

      <ul className={styles.list}>
        {insight.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
