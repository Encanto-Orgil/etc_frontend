"use client";

import { getAmenities, useLocale, useTranslations } from "@/lib/i18n";
import shared from "./home.shared.module.css";
import styles from "./AmenitiesScroll.module.css";

export default function AmenitiesScroll() {
  const { locale } = useLocale();
  const amenities = getAmenities(locale);
  const copy = useTranslations().home.amenities;
  const marqueeItems = [...amenities, ...amenities];

  return (
    <section className={`${shared.section} ${styles.section}`} id="amenities">
      <div className={shared.container}>
        <div className={styles.header} data-home-reveal>
          <p className={shared.eyebrow}>{copy.eyebrow}</p>
          <h2 className={shared.title}>{copy.title}</h2>
        </div>
      </div>

      <div className={styles.marquee} data-home-reveal aria-label={copy.ariaLabel}>
        <div className={styles.marqueeTrack}>
          {marqueeItems.map((item, index) => (
            <article key={`${item.title}-${index}`} className={styles.card}>
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className={styles.cardOverlay}>
                <h3>{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
