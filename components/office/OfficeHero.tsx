"use client";

import Link from "next/link";
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

      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <p className={styles.headline}>{copy.headline}</p>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.description}>{copy.description}</p>
        <div className={styles.actions}>
          <Link href={officeHero.primaryCta.href} className={styles.primary}>
            {copy.primaryCta}
          </Link>
          <Link href={officeHero.secondaryCta.href} className={styles.secondary}>
            {copy.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
