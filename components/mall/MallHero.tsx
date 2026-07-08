"use client";

import Link from "next/link";
import { mallHero } from "@/lib/mallContent";
import { useTranslations } from "@/lib/i18n";
import styles from "./MallHero.module.css";

export default function MallHero() {
  const copy = useTranslations().mall.hero;

  return (
    <section className={styles.hero} id="hero">
      <div
        className={styles.bg}
        style={{ backgroundImage: `url(${mallHero.image})` }}
        data-mall-parallax
      />
      <div className={styles.overlay} />

      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <p className={styles.headline}>{copy.headline}</p>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.description}>{copy.description}</p>
        <div className={styles.actions}>
          <Link href={mallHero.primaryCta.href} className={styles.primary}>
            {copy.primaryCta}
          </Link>
          <Link href={mallHero.secondaryCta.href} className={styles.secondary}>
            {copy.secondaryCta}
          </Link>
          <Link href={mallHero.tertiaryCta.href} className={styles.tertiary}>
            {copy.tertiaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
