"use client";

import Link from "next/link";
import { useState } from "react";
import { OFFICE_HERO_BLUR_DATA_URL } from "@/lib/officeHeroBlurHash";
import { officeHero } from "@/lib/officeContent";
import { useTranslations } from "@/lib/i18n";
import styles from "./OfficeHero.module.css";

export default function OfficeHero() {
  const copy = useTranslations().office.hero;
  const [heroLoaded, setHeroLoaded] = useState(false);
  const heroAlt = `${copy.title} — Encanto Trade Center`;

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.bg} data-office-parallax>
        <img
          src={OFFICE_HERO_BLUR_DATA_URL}
          alt=""
          aria-hidden
          className={styles.bgPlaceholder}
        />
        <img
          src={officeHero.image}
          alt={heroAlt}
          ref={(img) => {
            if (img?.complete) setHeroLoaded(true);
          }}
          className={`${styles.bgImage} ${heroLoaded ? styles.bgImageLoaded : ""}`}
          fetchPriority="high"
          decoding="async"
          onLoad={() => setHeroLoaded(true)}
        />
      </div>
      <div className={styles.overlay} />

      <div className={styles.bottom}>
        <div className={styles.glassPanel}>
          <h1 className={styles.title}>{copy.title}</h1>
          <p className={styles.description}>{copy.description}</p>
          <div className={styles.actions}>
            <Link href="#contact" className={styles.primary}>
              {copy.leasingCta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
