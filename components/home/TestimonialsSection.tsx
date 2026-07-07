"use client";

import Link from "next/link";
import { towers } from "@/lib/data";
import { useTranslations } from "@/lib/i18n";
import shared from "./home.shared.module.css";
import styles from "./TestimonialsSection.module.css";

export default function TestimonialsSection() {
  const explore = useTranslations().home.explore;

  return (
    <section className={`${shared.section} ${shared.darkSection}`} id="destinations">
      <div className={shared.container}>
        <div className={styles.header} data-home-reveal>
          <p className={shared.eyebrowLight}>{explore.eyebrow}</p>
          <h2 className={shared.titleLight}>{explore.title}</h2>
        </div>

        <div className={styles.panel} data-home-reveal>
          {towers.map((tower) => {
            const localized = explore.towers[tower.slug];
            const label = explore.destinationLabels[tower.slug] ?? tower.name;

            return (
              <Link
                key={tower.slug}
                href={`/${tower.slug}`}
                className={styles.card}
                aria-label={`${explore.viewDetails} — ${label}`}
              >
                <img
                  src={tower.heroImage}
                  alt=""
                  className={styles.cardImage}
                  loading="lazy"
                />
                <div className={styles.cardScrim} aria-hidden />
                <div className={styles.cardBody}>
                  <span className={styles.cardFloors}>
                    {localized?.floors ?? tower.floors}
                  </span>
                  <h3 className={styles.cardTitle}>{label}</h3>
                  <p className={styles.cardTagline}>
                    {localized?.tagline ?? tower.tagline}
                  </p>
                  <p className={styles.cardSummary}>
                    {localized?.summary ?? tower.summary}
                  </p>
                  <span className={styles.cardCta}>
                    {explore.viewDetails} <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
