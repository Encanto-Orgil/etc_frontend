"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import {
  BankOutlined,
  CrownOutlined,
  HomeOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { ENCHANTO_LOGO_SRC } from "@/lib/branding";
import type { Tower } from "@/lib/data";
import { getSectionNavLabel } from "@/lib/site-nav";
import styles from "./TowerFluidStack.module.css";

const ICONS = {
  office: BankOutlined,
  mall: ShopOutlined,
  ballroom: CrownOutlined,
  apartment: HomeOutlined,
} as const;

type Props = {
  items: Tower[];
  id?: string;
};

export default function TowerFluidStack({ items, id = "towers" }: Props) {
  const [active, setActive] = useState<number | null>(null);

  const clearActive = useCallback(() => setActive(null), []);

  return (
    <section className={styles.section} id={id} aria-label="Төслийн хэсгүүд">
      <div className={styles.watermark} aria-hidden>
        <img src={ENCHANTO_LOGO_SRC} alt="" className={styles.watermarkImg} />
      </div>

      <div className={styles.header}>
        <p className={styles.eyebrow}>Төсөл</p>
        <h2 className={styles.title}>Төслийн хэсгүүд</h2>
      </div>

      <div className={styles.stackWrap}>
        <div className={styles.stack} onMouseLeave={clearActive}>
          {items.map((tower, index) => {
            const Icon = ICONS[tower.kind];
            const isActive = active === index;
            const sectionLabel = getSectionNavLabel(tower.slug);

            return (
              <Link
                key={tower.slug}
                href={`/${tower.slug}`}
                className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                aria-label={`${sectionLabel} — дэлгэрэнгүй үзэх`}
              >
                <div className={styles.cardSurface}>
                  <div
                    className={styles.cardBg}
                    style={{ backgroundImage: `url(${tower.heroImage})` }}
                    aria-hidden
                  />
                  <div className={styles.cardOverlay} aria-hidden />

                  <span className={styles.iconWrap} aria-hidden>
                    <Icon />
                  </span>

                  <div className={styles.cardBody}>
                    <p className={styles.floors}>{tower.floors}</p>
                    <h3 className={styles.cardTitle}>{sectionLabel}</h3>

                    <div className={styles.expanded}>
                      <p className={styles.summary}>{tower.summary}</p>
                      <span className={styles.cta}>
                        Дэлгэрэнгүй
                        <span className={styles.ctaArrow} aria-hidden>
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <p className={styles.scrollHint} aria-hidden>
          <span>Сүүлж үзэх</span>
          <span className={styles.scrollHintDots}>
            {items.map((tower) => (
              <i key={tower.slug} />
            ))}
          </span>
        </p>
      </div>
    </section>
  );
}
