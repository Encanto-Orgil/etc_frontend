"use client";

import Link from "next/link";
import { apartmentHero } from "@/lib/apartmentContent";
import HeroBackgroundImage from "@/components/HeroBackgroundImage";
import styles from "./ApartmentHero.module.css";

export default function ApartmentHero() {
  return (
    <section className={styles.hero} id="hero">
      <HeroBackgroundImage
        src={apartmentHero.imageDay}
        wrapperClassName={styles.bgMorning}
        imageClassName={styles.bgImage}
        priority
        data-apartment-parallax
      />
      <HeroBackgroundImage
        src={apartmentHero.imageSunset}
        wrapperClassName={styles.bgSunset}
        imageClassName={styles.bgImage}
        loading="lazy"
        aria-hidden
      />
      <HeroBackgroundImage
        src={apartmentHero.imageNight}
        wrapperClassName={styles.bgNight}
        imageClassName={styles.bgImage}
        loading="lazy"
        aria-hidden
      />
      <div className={styles.skyTint} aria-hidden />
      <div className={styles.overlay} />

      <div className={styles.inner}>
        <p className={styles.eyebrow}>{apartmentHero.eyebrow}</p>
        <p className={styles.headline}>{apartmentHero.headline}</p>
        <h1 className={styles.title}>{apartmentHero.title}</h1>
        <p className={styles.description}>{apartmentHero.description}</p>
        <div className={styles.actions}>
          <Link href={apartmentHero.primaryCta.href} className={styles.primary}>
            {apartmentHero.primaryCta.label}
          </Link>
          <Link href={apartmentHero.secondaryCta.href} className={styles.secondary}>
            {apartmentHero.secondaryCta.label}
          </Link>
          <Link href={apartmentHero.tertiaryCta.href} className={styles.tertiary}>
            {apartmentHero.tertiaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
