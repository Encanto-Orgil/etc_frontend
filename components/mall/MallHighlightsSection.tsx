"use client";

import type { IconType } from "react-icons";
import {
  LuBuilding2,
  LuCar,
  LuLayoutGrid,
  LuMapPin,
  LuTrendingUp,
  LuUsers,
  LuZap,
} from "react-icons/lu";
import { type MallHighlightIcon } from "@/lib/mallContent";
import { useTranslations } from "@/lib/i18n";
import styles from "./MallHighlightsSection.module.css";

const iconMap: Record<MallHighlightIcon, IconType> = {
  scale: LuBuilding2,
  flow: LuUsers,
  engineering: LuZap,
  tenant: LuLayoutGrid,
  growth: LuTrendingUp,
  location: LuMapPin,
  parking: LuCar,
};

export function MallHighlightsSection() {
  const copy = useTranslations().mall;

  return (
    <section className={styles.section} id="highlights">
      <div className={styles.inner}>
        <header className={styles.header} data-mall-reveal>
          <div className={styles.headerCopy}>
            <p className={styles.eyebrow}>{copy.highlightsSection.eyebrow}</p>
            <h2 className={styles.title}>{copy.highlightsSection.title}</h2>
          </div>
          <p className={styles.lead}>{copy.highlightsSection.lead}</p>
        </header>

        <div className={styles.grid}>
          {copy.highlightCards.map((card, index) => {
            const Icon = iconMap[card.icon];

            return (
              <article key={card.title} className={styles.card} data-mall-reveal>
                <span className={styles.index} aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={styles.cardTop}>
                  <span className={styles.iconWrap} aria-hidden>
                    <Icon className={styles.icon} />
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
