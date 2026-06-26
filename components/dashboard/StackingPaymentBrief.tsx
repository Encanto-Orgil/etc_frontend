"use client";

import Link from "next/link";
import type { DashboardStats } from "@/lib/auth";
import { formatMnt } from "@/lib/rentalFinance";
import styles from "./StackingPaymentBrief.module.css";

type Props = {
  finance: DashboardStats["rental_finance"] | undefined;
  loading?: boolean;
};

export default function StackingPaymentBrief({ finance, loading }: Props) {
  if (loading || !finance) return null;

  const { combined, period, office, mall } = finance;
  if (!combined.expected_total) return null;

  return (
    <section className={styles.wrap}>
      <div className={styles.head}>
        <span className={styles.label}>Сарын төлбөр</span>
        <span className={styles.period}>{period.label}</span>
      </div>

      <div className={styles.metrics}>
        <div>
          <strong>{formatMnt(combined.expected_total)}</strong>
          <span>Хүлээгдэж буй</span>
        </div>
        <div>
          <strong className={styles.green}>{formatMnt(combined.collected)}</strong>
          <span>Орлогод орсон</span>
        </div>
        <div>
          <strong className={styles.red}>{formatMnt(combined.outstanding)}</strong>
          <span>Төлөөгүй</span>
        </div>
        <div>
          <strong>{combined.collection_rate}%</strong>
          <span>Цуглуулалт</span>
        </div>
      </div>

      <div className={styles.split}>
        <Link href="/dashboard/stacking/office" className={styles.link}>
          Оффис · {formatMnt(office?.collected ?? 0)} / {formatMnt(office?.expected_total ?? 0)}
        </Link>
        <span className={styles.dot}>·</span>
        <Link href="/dashboard/stacking/mall" className={styles.link}>
          Молл · {formatMnt(mall?.collected ?? 0)} / {formatMnt(mall?.expected_total ?? 0)}
        </Link>
        <span className={styles.meta}>
          Төлсөн {combined.paid_count} · Төлөөгүй {combined.unpaid_count}
        </span>
      </div>
    </section>
  );
}
