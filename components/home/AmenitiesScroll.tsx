"use client";

import { getAmenities, useLocale, useTranslations } from "@/lib/i18n";
import shared from "./home.shared.module.css";
import styles from "./AmenitiesScroll.module.css";

const GRID_PLACEMENTS = [
  { column: "1 / 3", row: "1 / 3" },
  { column: "3", row: "1" },
  { column: "4", row: "1" },
  { column: "3", row: "2" },
  { column: "4", row: "2" },
  { column: "1", row: "3" },
  { column: "2", row: "3" },
  { column: "3", row: "3" },
  { column: "4", row: "3" },
  { column: "2 / 4", row: "4" },
] as const;

export default function AmenitiesScroll() {
  const { locale } = useLocale();
  const amenities = getAmenities(locale);
  const copy = useTranslations().home.amenities;

  return (
    <section
      className={`${shared.section} ${shared.darkSection} ${styles.section}`}
      id="amenities"
    >
      <div className={styles.glow} aria-hidden />

      <div className={shared.container}>
        <div className={styles.header} data-home-reveal>
          <div className={styles.headerCopy}>
            <p className={shared.eyebrowLight}>{copy.eyebrow}</p>
            <h2 className={`${shared.titleLight} ${styles.title}`}>{copy.title}</h2>
          </div>
          <p className={styles.lead}>{copy.lead}</p>
        </div>

        <div className={styles.grid} data-home-reveal aria-label={copy.ariaLabel}>
          {amenities.map((item, index) => {
            const placement = GRID_PLACEMENTS[index];
            const isFeatured = index === 0;

            return (
              <article
                key={item.title}
                className={`${styles.card} ${isFeatured ? styles.cardFeatured : ""}`}
                style={
                  placement
                    ? {
                        gridColumn: placement.column,
                        gridRow: placement.row,
                      }
                    : undefined
                }
              >
                <img src={item.image} alt={item.title} className={styles.image} loading="lazy" />
                <div className={styles.overlay} aria-hidden />
                <div className={styles.cardBody}>
                  <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
