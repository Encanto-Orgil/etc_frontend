"use client";

import { useMemo } from "react";
import type { IconType } from "react-icons";
import {
  LuArrowUpDown,
  LuBuilding2,
  LuCar,
  LuCctv,
  LuChefHat,
  LuDoorOpen,
  LuDroplets,
  LuFlame,
  LuLayers,
  LuLayoutGrid,
  LuPanelTop,
  LuRuler,
  LuShield,
  LuSnowflake,
  LuSofa,
  LuStore,
  LuWind,
} from "react-icons/lu";
import {
  residenceSpecCategoryOrder,
  residenceSpecLayout,
  type ResidenceSpecCategory,
  type ResidenceSpecIcon,
} from "@/lib/apartmentContent";
import { useTranslations } from "@/lib/i18n";
import styles from "./ApartmentHighlightsSection.module.css";

const iconMap: Record<ResidenceSpecIcon, IconType> = {
  height: LuRuler,
  door: LuDoorOpen,
  structure: LuBuilding2,
  facade: LuPanelTop,
  interior: LuSofa,
  layout: LuLayoutGrid,
  air: LuWind,
  elevator: LuArrowUpDown,
  water: LuDroplets,
  heating: LuFlame,
  floor: LuLayers,
  entry: LuShield,
  intercom: LuCctv,
  ac: LuSnowflake,
  kitchen: LuChefHat,
  podium: LuStore,
  parking: LuCar,
};

type SpecItem = {
  label: string;
  value: string;
  category: ResidenceSpecCategory;
  icon: ResidenceSpecIcon;
  featured?: boolean;
  index: number;
};

export default function ApartmentHighlightsSection() {
  const copy = useTranslations().residence;
  const section = copy.specificationsSection;

  const grouped = useMemo(() => {
    const items: SpecItem[] = copy.specifications.map((spec, index) => {
      const layout = residenceSpecLayout[index];
      return {
        ...spec,
        category: layout?.category ?? "structure",
        icon: layout?.icon ?? "structure",
        featured: layout?.featured,
        index,
      };
    });

    return residenceSpecCategoryOrder
      .map((category) => ({
        category,
        label: section.categories[category],
        items: items.filter((item) => item.category === category),
      }))
      .filter((group) => group.items.length > 0);
  }, [copy.specifications, section.categories]);

  return (
    <section className={styles.section} id="highlights">
      <div className={styles.inner}>
        <header className={styles.header} data-apartment-reveal>
          <div className={styles.headerCopy}>
            <p className={styles.eyebrow}>{section.eyebrow}</p>
            <h2 className={styles.title}>{section.title}</h2>
          </div>
          <p className={styles.lead}>{section.lead}</p>
        </header>

        <div className={styles.metricsRail} data-apartment-reveal>
          {section.metrics.map((metric) => (
            <div key={metric.label} className={styles.metric}>
              <span className={styles.metricValue}>
                {metric.value}
                {metric.unit ? <small className={styles.metricUnit}>{metric.unit}</small> : null}
              </span>
              <span className={styles.metricLabel}>{metric.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.groups}>
          {grouped.map((group) => (
            <section key={group.category} className={styles.group} aria-labelledby={`highlight-${group.category}`}>
              <div className={styles.groupHead} data-apartment-reveal>
                <h3 id={`highlight-${group.category}`} className={styles.groupTitle}>
                  {group.label}
                </h3>
                <span className={styles.groupCount}>
                  {String(group.items.length).padStart(2, "0")}
                </span>
              </div>

              <div className={styles.grid}>
                {group.items.map((item) => {
                  const Icon = iconMap[item.icon];

                  return (
                    <article
                      key={item.label}
                      className={`${styles.card} ${item.featured ? styles.cardFeatured : ""}`}
                      data-apartment-reveal
                    >
                      <span className={styles.index} aria-hidden>
                        {String(item.index + 1).padStart(2, "0")}
                      </span>
                      <div className={styles.cardTop}>
                        <span className={styles.iconWrap} aria-hidden>
                          <Icon className={styles.icon} />
                        </span>
                      </div>
                      <div className={styles.cardBody}>
                        <h4>{item.label}</h4>
                        <p>{item.value}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
