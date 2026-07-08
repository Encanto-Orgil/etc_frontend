"use client";

import Link from "next/link";
import { ballroomHero } from "@/lib/ballroomContent";
import { useTranslations } from "@/lib/i18n";
import styles from "./BallroomHero.module.css";

export default function BallroomHero() {
  const copy = useTranslations().ballroom.hero;

  return (
    <section className={styles.hero} id="hero">
      <div
        className={styles.bg}
        style={{ backgroundImage: `url(${ballroomHero.image})` }}
        data-ballroom-parallax
      />
      <div className={styles.chandelierGlow} aria-hidden />
      <div className={styles.overlay} />

      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <p className={styles.headline}>{copy.headline}</p>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.description}>{copy.description}</p>
        <div className={styles.actions}>
          <Link href={ballroomHero.primaryCta.href} className={styles.primary}>
            {copy.primaryCta}
          </Link>
          <Link href={ballroomHero.secondaryCta.href} className={styles.secondary}>
            {copy.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
