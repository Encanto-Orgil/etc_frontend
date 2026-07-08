"use client";

import Link from "next/link";
import { mallHero } from "@/lib/mallContent";
import HeroBackgroundImage from "@/components/HeroBackgroundImage";
import styles from "./MallHero.module.css";

export default function MallHero() {
  return (
    <section className={styles.hero} id="hero">
      <HeroBackgroundImage
        src={mallHero.image}
        wrapperClassName={styles.bgDay}
        imageClassName={styles.bgImage}
        priority
        data-mall-parallax
      />
      <HeroBackgroundImage
        src={mallHero.imageNight}
        wrapperClassName={styles.bgNight}
        imageClassName={styles.bgImage}
        loading="lazy"
        aria-hidden
      />
      <div className={styles.dayNightCycle} aria-hidden />
      <div className={styles.overlay} />

      <div className={styles.inner}>
        <p className={styles.eyebrow}>{mallHero.eyebrow}</p>
        <p className={styles.headline}>{mallHero.headline}</p>
        <h1 className={styles.title}>{mallHero.title}</h1>
        <p className={styles.description}>{mallHero.description}</p>
        <div className={styles.actions}>
          <Link href={mallHero.primaryCta.href} className={styles.primary}>
            {mallHero.primaryCta.label}
          </Link>
          <Link href={mallHero.secondaryCta.href} className={styles.secondary}>
            {mallHero.secondaryCta.label}
          </Link>
          <Link href={mallHero.tertiaryCta.href} className={styles.tertiary}>
            {mallHero.tertiaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
