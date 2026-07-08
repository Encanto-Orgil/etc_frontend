"use client";

import Link from "next/link";
import { apartmentHero } from "@/lib/apartmentContent";
import { useTranslations } from "@/lib/i18n";
import styles from "./ApartmentHero.module.css";

export default function ApartmentHero() {
  const copy = useTranslations().residence.hero;

  return (
    <section className={styles.hero} id="hero">
      <div
        className={styles.bgMorning}
        style={{ backgroundImage: `url(${apartmentHero.imageDay})` }}
        data-apartment-parallax
      />
      <div
        className={styles.bgSunset}
        style={{ backgroundImage: `url(${apartmentHero.imageSunset})` }}
        aria-hidden
      />
      <div
        className={styles.bgNight}
        style={{ backgroundImage: `url(${apartmentHero.imageNight})` }}
        aria-hidden
      />
      <div className={styles.skyTint} aria-hidden />
      <div className={styles.overlay} />

      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <p className={styles.headline}>{copy.headline}</p>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.description}>{copy.description}</p>
        <div className={styles.actions}>
          <Link href={apartmentHero.primaryCta.href} className={styles.primary}>
            {copy.primaryCta}
          </Link>
          <Link href={apartmentHero.secondaryCta.href} className={styles.secondary}>
            {copy.secondaryCta}
          </Link>
          <Link href={apartmentHero.tertiaryCta.href} className={styles.tertiary}>
            {copy.tertiaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
