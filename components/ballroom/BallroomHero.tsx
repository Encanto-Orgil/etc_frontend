"use client";

import Link from "next/link";
import { ballroomHero } from "@/lib/ballroomContent";
import HeroBackgroundImage from "@/components/HeroBackgroundImage";
import styles from "./BallroomHero.module.css";

export default function BallroomHero() {
  return (
    <section className={styles.hero} id="hero">
      <HeroBackgroundImage
        src={ballroomHero.image}
        wrapperClassName={styles.bg}
        imageClassName={styles.bgImage}
        priority
        data-ballroom-parallax
      />
      <div className={styles.chandelierGlow} aria-hidden />
      <div className={styles.overlay} />

      <div className={styles.inner}>
        <p className={styles.eyebrow}>{ballroomHero.eyebrow}</p>
        <p className={styles.headline}>{ballroomHero.headline}</p>
        <h1 className={styles.title}>{ballroomHero.title}</h1>
        <p className={styles.description}>{ballroomHero.description}</p>
        <div className={styles.actions}>
          <Link href={ballroomHero.primaryCta.href} className={styles.primary}>
            {ballroomHero.primaryCta.label}
          </Link>
          <Link href={ballroomHero.secondaryCta.href} className={styles.secondary}>
            {ballroomHero.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
