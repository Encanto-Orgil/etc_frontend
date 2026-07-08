"use client";

import Link from "next/link";
import { officeHero } from "@/lib/officeContent";
import HeroBackgroundImage from "@/components/HeroBackgroundImage";
import styles from "./OfficeHero.module.css";

export default function OfficeHero() {
  return (
    <section className={styles.hero} id="hero">
      <HeroBackgroundImage
        src={officeHero.image}
        wrapperClassName={styles.bg}
        imageClassName={styles.bgImage}
        priority
        data-office-parallax
      />
      <div className={styles.sheen} aria-hidden />
      <div className={styles.overlay} />

      <div className={styles.inner}>
        <p className={styles.eyebrow}>{officeHero.eyebrow}</p>
        <p className={styles.headline}>{officeHero.headline}</p>
        <h1 className={styles.title}>{officeHero.title}</h1>
        <p className={styles.description}>{officeHero.description}</p>
        <div className={styles.actions}>
          <Link href={officeHero.primaryCta.href} className={styles.primary}>
            {officeHero.primaryCta.label}
          </Link>
          <Link href={officeHero.secondaryCta.href} className={styles.secondary}>
            {officeHero.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
