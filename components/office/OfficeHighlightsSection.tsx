"use client";

import type { IconType } from "react-icons";
import {
  LuBuilding2,
  LuCar,
  LuMapPin,
  LuShieldCheck,
  LuWifi,
  LuZap,
} from "react-icons/lu";
import {
  officeHighlightCards,
  officeHighlightsSection,
  type OfficeHighlightIcon,
} from "@/lib/officeContent";
import { officeHighlights } from "@/lib/officeBrochure";
import styles from "./OfficeHighlightsSection.module.css";

const iconMap: Record<OfficeHighlightIcon, IconType> = {
  office: LuBuilding2,
  location: LuMapPin,
  parking: LuCar,
  security: LuShieldCheck,
  connectivity: LuWifi,
  energy: LuZap,
};

export default function OfficeHighlightsSection() {
  return (
    <section className={styles.section} id="highlights">
      <div className={styles.inner}>
        <header className={styles.header} data-office-reveal>
          <div className={styles.headerCopy}>
            <p className={styles.eyebrow}>{officeHighlightsSection.eyebrow}</p>
            <h2 className={styles.title}>{officeHighlightsSection.title}</h2>
          </div>
          <p className={styles.lead}>{officeHighlightsSection.lead}</p>
        </header>

        <div className={styles.metricsRail} data-office-reveal>
          {officeHighlights.map((stat) => (
            <div key={stat.label} className={styles.metric}>
              <span className={styles.metricValue}>
                {stat.value}
                {stat.unit ? <small className={styles.metricUnit}>{stat.unit}</small> : null}
                {stat.note ? <span className={styles.metricNote}>{stat.note}</span> : null}
              </span>
              <span className={styles.metricLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.grid}>
          {officeHighlightCards.map((card, index) => {
            const Icon = iconMap[card.icon];

            return (
              <article key={card.title} className={styles.card} data-office-reveal>
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
