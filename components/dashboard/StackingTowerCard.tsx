"use client";

import { ArrowRightOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { StackingInsights } from "@/lib/stackingInsights";
import type { StackingSummary, TowerKind } from "@/lib/stacking";
import { TOWER_KIND_LABELS } from "@/lib/stacking";
import type { StackingTowerMeta } from "@/lib/stackingInsights";
import styles from "./StackingTowerCard.module.css";

type Props = {
  meta: StackingTowerMeta;
  summary: StackingSummary;
  insights: StackingInsights;
  loading?: boolean;
};

const HEALTH_LABELS = {
  good: "Сайн",
  medium: "Анхаарах",
  attention: "Идэвхжүүлэх",
} as const;

export default function StackingTowerCard({ meta, summary, insights, loading }: Props) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--rx", `${-y * 10}deg`);
    el.style.setProperty("--ry", `${x * 12}deg`);
    el.style.setProperty("--tz", "18px");
    el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  };

  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--tz", "0px");
    el.style.setProperty("--gx", "50%");
    el.style.setProperty("--gy", "35%");
  };

  return (
    <Link
      ref={cardRef}
      href={`/dashboard/stacking/${meta.kind}`}
      className={`${styles.cardLink} ${loading ? styles.loading : ""}`}
      style={{ "--accent": meta.accent } as React.CSSProperties}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <article className={styles.card}>
        <div className={styles.visual}>
          <div className={styles.imageWrap}>
            <Image
              src={meta.image}
              alt={meta.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={styles.image}
              priority={meta.kind === "office"}
            />
            <div className={styles.imageGlow} />
            <div className={styles.imageShade} />
          </div>
          <div className={styles.badgeRow}>
            <span className={styles.kindBadge}>{TOWER_KIND_LABELS[meta.kind as TowerKind]}</span>
            <span className={`${styles.healthBadge} ${styles[insights.health]}`}>
              {HEALTH_LABELS[insights.health]}
            </span>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.head}>
            <div>
              <h2>{meta.title}</h2>
              <p>{meta.subtitle}</p>
            </div>
            <span className={styles.floors}>{meta.floorsLabel}</span>
          </div>

          <div className={styles.metrics}>
            <div className={styles.metric}>
              <strong>{summary.unit_count}</strong>
              <span>Нийт нэгж</span>
            </div>
            <div className={styles.metric}>
              <strong>{summary.available_count}</strong>
              <span>Боломжтой</span>
            </div>
            <div className={styles.metric}>
              <strong>{insights.occupancy}%</strong>
              <span>Эзэлэлт</span>
            </div>
          </div>

          <div className={styles.bars}>
            <div className={styles.barRow}>
              <span>Түрээслэгдсэн</span>
              <div className={styles.barTrack}>
                <div className={styles.barRented} style={{ width: `${insights.occupancy}%` }} />
              </div>
            </div>
            <div className={styles.barRow}>
              <span>Боломжтой</span>
              <div className={styles.barTrack}>
                <div className={styles.barAvailable} style={{ width: `${insights.availability}%` }} />
              </div>
            </div>
            <div className={styles.barRow}>
              <span>Захиалсан</span>
              <div className={styles.barTrack}>
                <div className={styles.barPipeline} style={{ width: `${insights.pipeline}%` }} />
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <span>
              {summary.floor_count} давхар · {summary.rented_count} түрээслэгдсэн
            </span>
            <span className={styles.cta}>
              Дэлгэрэнгүй <ArrowRightOutlined />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
