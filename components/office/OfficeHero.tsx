"use client";

import { officeHero } from "@/lib/officeContent";
import { useTranslations } from "@/lib/i18n";
import styles from "./OfficeHero.module.css";

export default function OfficeHero() {
  const copy = useTranslations().office.hero;

  return (
    <section className={styles.hero} id="hero">
      <div
        className={styles.bg}
        style={{ backgroundImage: `url(${officeHero.image})` }}
        data-office-parallax
      />
      <div className={styles.overlay} />

      <div className={styles.bottom}>
        <div className={styles.glassPanel}>
          <h1 className={styles.title}>{copy.title}</h1>
          <p className={styles.description}>{copy.description}</p>
        </div>
      </div>
    </section>
  );
}
