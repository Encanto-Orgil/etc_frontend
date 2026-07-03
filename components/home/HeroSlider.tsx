"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./HeroSlider.module.css";

const slide = {
  image: "/images/renders/render-34.jpg",
  tag: "Premium Offices • Luxury Residences • Retail & Lifestyle",
  title: "Encanto",
  titleLine2: "Trade Center",
  subtitle:
    "A new-generation integrated business destination where commerce, lifestyle, and investment converge in one iconic development.",
};

export default function HeroSlider() {
  const [light, setLight] = useState({ x: 50, y: 40 });

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
          key={slide.image}
          className={styles.slide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      </AnimatePresence>

      <div className={styles.overlay} />

      <div className={styles.bottom}>
        <motion.div
          className={styles.glassPanel}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.tag}>{slide.tag}</span>
          <h1 className={styles.title}>
            {slide.title}
            <br />
            {slide.titleLine2}
          </h1>
          <p className={styles.sub}>{slide.subtitle}</p>
          <div className={styles.actions}>
            <Link href="/#contact" className={styles.ctaPrimary}>
              Schedule Private Presentation
            </Link>
            <Link href="/#why-encanto" className={styles.ctaSecondary}>
              Explore the Project
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
        aria-label="Scroll down to explore"
      >
        <motion.span
          className={styles.scrollDownText}
          animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          Scroll Down
        </motion.span>
        <span className={styles.scrollDownTrack} aria-hidden>
          <span className={styles.scrollDownMarker} />
        </span>
      </motion.a>
    </section>
  );
}
