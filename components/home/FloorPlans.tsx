"use client";

import { LuDownload } from "react-icons/lu";
import { getFloorPlanTabs, useLocale, useTranslations } from "@/lib/i18n";
import shared from "./home.shared.module.css";
import styles from "./FloorPlans.module.css";

export default function FloorPlans() {
  const { locale } = useLocale();
  const floorPlanCards = getFloorPlanTabs(locale);
  const copy = useTranslations().home.floorPlans;

  return (
    <section className={`${shared.section} ${styles.section}`} id="floor-plans">
      <div className={shared.container}>
        <div className={styles.header} data-home-reveal>
          <p className={shared.eyebrow}>{copy.eyebrow}</p>
          <h2 className={shared.title}>{copy.title}</h2>
        </div>

        <div className={styles.grid} data-home-reveal>
          {floorPlanCards.map((card) => (
            <article key={card.id} className={styles.card}>
              <div className={styles.media}>
                <img
                  src={card.image}
                  alt={`${card.label} ${copy.imageAlt}`}
                  className={styles.image}
                  loading="lazy"
                />
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{card.label}</h3>
                <a
                  href={card.pdf}
                  className={styles.downloadBtn}
                  {...(card.pdf.endsWith(".pdf")
                    ? { download: true, target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  <LuDownload aria-hidden />
                  {copy.downloadPdf}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
