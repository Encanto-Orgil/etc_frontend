"use client";

import { apartmentHero } from "@/lib/apartmentContent";
import { useTranslations } from "@/lib/i18n";
import styles from "./ApartmentHero.module.css";

export default function ApartmentHero() {
  const copy = useTranslations().residence.hero;

  return (
    <section className={styles.hero} id="hero">
      <div
        className={styles.bg}
        style={{ backgroundImage: `url(${apartmentHero.image})` }}
        data-apartment-parallax
      />
      <div className={styles.overlay} />

      <div className={styles.inner}>
        <p className={styles.headline}>{copy.headline}</p>
        <h1 className={styles.title}>{copy.title}</h1>
      </div>
    </section>
  );
}
