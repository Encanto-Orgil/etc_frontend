"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import styles from "./HeroSlider.module.css";

const slides = [
  {
    image: "/images/drone/drone-3.jpg",
    tag: "Encanto Trade Center",
    title: "ENCANTO",
    titleLine2: "TRADE CENTER",
    subtitle: "Баянзүрх дүүрэгт өсөн нэмэгдэж буй хотын шинэ дүр төрх.",
  },
  {
    image: "/images/renders/render-8.jpg",
    tag: "Encanto Trade Center",
    title: "ENCANTO",
    titleLine2: "TRADE CENTER",
    subtitle: "Оффис · Mall · Ballroom · Sky Residence — нэг цогцолбор.",
  }
];

const INTERVAL = 7000;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const goTo = useCallback((i: number) => {
    setIndex((i + slides.length) % slides.length);
    setProgress(0);
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused) return;

    const started = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - started;
      const p = Math.min(elapsed / INTERVAL, 1);
      setProgress(p);

      if (p >= 1) {
        setIndex((i) => (i + 1) % slides.length);
        setProgress(0);
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [index, paused]);

  const slide = slides[index];

  return (
    <section
      className={styles.hero}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
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
          key={index}
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
        </motion.div>
      </div>

      <div className={styles.dots}>
        {slides.map((s, i) => (
          <button
            key={s.image}
            type="button"
            className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          >
            {i === index ? (
              <span
                className={styles.dotProgress}
                style={{ transform: `scaleX(${progress})` }}
              />
            ) : null}
          </button>
        ))}
      </div>

      <div className={styles.controls}>
        <div className={styles.arrows}>
          <button
            type="button"
            className={styles.arrowBtn}
            onClick={prev}
            aria-label="Өмнөх slide"
          >
            <LeftOutlined />
          </button>
          <button
            type="button"
            className={styles.arrowBtn}
            onClick={next}
            aria-label="Дараагийн slide"
          >
            <RightOutlined />
          </button>
        </div>
      </div>
    </section>
  );
}
