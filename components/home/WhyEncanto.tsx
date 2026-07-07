"use client";

import type { IconType } from "react-icons";
import { LuBriefcase, LuBuilding2, LuHouse, LuTrendingUp } from "react-icons/lu";
import { useTranslations, type WhyEncantoIcon } from "@/lib/i18n";
import shared from "./home.shared.module.css";
import styles from "./WhyEncanto.module.css";

const iconMap: Record<WhyEncantoIcon, IconType> = {
  landmark: LuBuilding2,
  office: LuBriefcase,
  residence: LuHouse,
  investment: LuTrendingUp,
};

export default function WhyEncanto() {
  const whyEncantoSection = useTranslations().home.whyEncanto;

  return (
    <section className={`${shared.section} ${shared.darkSection} ${styles.section}`} id="why-encanto">
      <div className={shared.container}>
        <div className={styles.header} data-home-reveal>
          <div className={styles.headerCopy}>
            <p className={shared.eyebrowLight}>{whyEncantoSection.eyebrow}</p>
            <h2 className={`${shared.titleLight} ${styles.title}`}>
              {whyEncantoSection.title}
              <br />
              {whyEncantoSection.titleLine2}
            </h2>
          </div>
          <p className={styles.lead}>{whyEncantoSection.lead}</p>
        </div>

        <div className={styles.grid}>
          {whyEncantoSection.items.map((item, index) => {
            const Icon = iconMap[item.icon];

            return (
              <article key={item.title} className={styles.card} data-home-reveal>
                <span className={styles.index} aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={styles.cardTop}>
                  <span className={styles.iconWrap} aria-hidden>
                    <Icon className={styles.icon} />
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
