"use client";

import { useEffect, useRef } from "react";
import type { IconType } from "react-icons";
import Image from "next/image";
import { LuBuilding2, LuMapPin, LuNetwork, LuSettings2 } from "react-icons/lu";
import { officeWhySection, type OfficeWhyReasonIcon } from "@/lib/officeContent";
import { useTranslations } from "@/lib/i18n";
import styles from "./OfficeWhySection.module.css";

const iconMap: Record<OfficeWhyReasonIcon, IconType> = {
  prestige: LuBuilding2,
  location: LuMapPin,
  ecosystem: LuNetwork,
  infrastructure: LuSettings2,
};

function useCountUp(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;
    const target = Number(el.dataset.count ?? "0");
    if (!target) return;

    let frame = 0;
    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled, ref]);
}

function StatCounter({ value, suffix, label }: { value: string; suffix: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isNumeric = /^\d+$/.test(value);
  useCountUp(ref, isNumeric);

  return (
    <div className={styles.stat} data-office-reveal>
      <span className={styles.statValue}>
        {isNumeric ? (
          <>
            <span ref={ref} data-count={value}>
              0
            </span>
            {suffix}
          </>
        ) : (
          value
        )}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

export default function OfficeWhySection() {
  const copy = useTranslations().office;

  return (
    <section className={styles.section} id="why-choose">
      <div className={styles.inner}>
        <div className={styles.panel} data-office-reveal>
          <div className={styles.panelGlow} aria-hidden />

          <header className={styles.header}>
            <div className={styles.headerCopy}>
              <p className={styles.eyebrow}>{copy.whySection.eyebrow}</p>
              <h2 className={styles.title}>{copy.whySection.title}</h2>
            </div>
            <p className={styles.lead}>{copy.whySection.lead}</p>
          </header>

          <div className={styles.showcase}>
            <div className={styles.visual}>
              <Image
                src={officeWhySection.image}
                alt={copy.whySection.imageAlt}
                fill
                sizes="(max-width: 960px) 100vw, 45vw"
                className={styles.visualImage}
              />
              <div className={styles.visualBadge}>
                <strong>Grade-A</strong>
                <span>Commercial Standard</span>
              </div>
            </div>

            <div className={styles.reasons}>
              {copy.whyReasons.map((reason) => {
                const Icon = iconMap[reason.icon];

                return (
                  <article key={reason.title} className={styles.reason} data-office-reveal>
                    <span className={styles.iconWrap} aria-hidden>
                      <Icon className={styles.icon} />
                    </span>
                    <div className={styles.reasonCopy}>
                      <h3>{reason.title}</h3>
                      <p>{reason.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className={styles.features}>
            <h3 className={styles.featuresTitle}>{copy.whySection.featuresTitle}</h3>
            <div className={styles.featureGrid}>
              {copy.whySection.features.map((feature) => (
                <div key={feature} className={styles.featureItem} data-office-reveal>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.statsRail}>
            {copy.whyStats.map((stat) => (
              <StatCounter key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
