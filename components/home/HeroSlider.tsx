"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { heroBackgroundUrl } from "@/lib/image";
import { useTranslations } from "@/lib/i18n";
import styles from "./HeroSlider.module.css";

const HERO_IMAGE = "/images/renders/render-34.jpg";
const HERO_IMAGE_SRC = heroBackgroundUrl(HERO_IMAGE);

export default function HeroSlider() {
  const t = useTranslations();
  const hero = t.home.hero;
  const [light, setLight] = useState({ x: 50, y: 40 });
  const heroAlt = `${hero.title} ${hero.titleLine2}`.trim();

  return (
    <section
      className={styles.hero}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setLight({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100,
        });
      }}
    >
      <div
        className={styles.light}
        style={{
          background: `radial-gradient(circle at ${light.x}% ${light.y}%, rgba(255,255,255,0.16), transparent 28%)`,
        }}
        aria-hidden
      />
      <AnimatePresence mode="sync">
        <motion.div
          key={HERO_IMAGE}
          className={styles.slide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={HERO_IMAGE_SRC}
            alt={heroAlt}
            className={styles.slideImage}
            fetchPriority="high"
            decoding="async"
          />
        </motion.div>
      </AnimatePresence>

      <div className={styles.overlay} />

      <div className={styles.bottom}>
        <motion.div
          className={styles.glassPanel}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.tag}>{hero.tag}</span>
          <h1 className={styles.title}>
            {hero.title}
            <br />
            {hero.titleLine2}
          </h1>
          <p className={styles.sub}>{hero.subtitle}</p>

          <motion.div
            className={styles.leasingWrap}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.leasingBadge}>
              <span className={styles.leasingDot} aria-hidden />
              {hero.leasingBadge}
            </span>
            <Link href="/office#contact" className={styles.ctaLeasing}>
              <span className={styles.ctaLeasingGlow} aria-hidden />
              <span className={styles.ctaLeasingShimmer} aria-hidden />
              {hero.ctaLeasing}
            </Link>
          </motion.div>

          <div className={styles.actions}>
            <Link href="/#contact" className={styles.ctaPrimary}>
              {hero.ctaPrimary}
            </Link>
            <Link href="/#why-encanto" className={styles.ctaSecondary}>
              {hero.ctaSecondary}
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#brand"
        className={styles.scrollDown}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        aria-label={hero.scrollAria}
      >
        <motion.span
          className={styles.scrollDownText}
          animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          {hero.scrollDown}
        </motion.span>
        <span className={styles.scrollDownTrack} aria-hidden>
          <span className={styles.scrollDownMarker} />
        </span>
      </motion.a>
    </section>
  );
}
