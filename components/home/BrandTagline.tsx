"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { project } from "@/lib/data";
import styles from "./BrandTagline.module.css";

const WORDS = project.taglineWords;
const LAST_INDEX = WORDS.length - 1;
const STEP_VH = 55;

function wordOpacity(index: number, progress: number) {
  const exactIndex = progress * LAST_INDEX;
  const distance = Math.abs(index - exactIndex);
  return Math.max(0.12, 1 - distance * 0.78);
}

function wordScale(index: number, progress: number) {
  const exactIndex = progress * LAST_INDEX;
  const distance = Math.abs(index - exactIndex);
  return 1 + Math.max(0, 1 - distance * 1.4) * 0.045;
}

function TaglineWord({
  word,
  index,
  scrollProgress,
}: {
  word: (typeof WORDS)[number];
  index: number;
  scrollProgress: MotionValue<number>;
}) {
  const opacity = useTransform(scrollProgress, (progress) =>
    wordOpacity(index, progress),
  );
  const scale = useTransform(scrollProgress, (progress) =>
    wordScale(index, progress),
  );

  return (
    <span className={styles.wordGroup}>
      <motion.span className={styles.word} style={{ opacity, scale }}>
        {word}
      </motion.span>
      <span className={styles.period} aria-hidden>
        .
      </span>
    </span>
  );
}

export default function BrandTagline() {
  const containerRef = useRef<HTMLElement>(null);
  const scrollProgress = useMotionValue(0);
  const [activeDot, setActiveDot] = useState(0);
  const underlineX = useTransform(scrollProgress, (progress) => `${progress * 100}%`);

  useMotionValueEvent(scrollProgress, "change", (progress) => {
    setActiveDot(Math.round(progress * LAST_INDEX));
  });

  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    let frame = 0;

    const update = () => {
      const scrollRange = section.offsetHeight - window.innerHeight;
      if (scrollRange <= 0) {
        scrollProgress.set(0);
        return;
      }

      const progress = Math.min(
        1,
        Math.max(0, -section.getBoundingClientRect().top / scrollRange),
      );
      scrollProgress.set(progress);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [scrollProgress]);

  return (
    <section
      ref={containerRef}
      className={styles.section}
      style={{ height: `${WORDS.length * STEP_VH}vh` }}
      aria-label={project.taglineEn}
    >
      <div className={styles.sticky}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>Encanto Trade Center</p>

          <h2 className={styles.tagline}>
            {WORDS.map((word, index) => (
              <TaglineWord
                key={word}
                word={word}
                index={index}
                scrollProgress={scrollProgress}
              />
            ))}
          </h2>

          <div className={styles.progressTrack} aria-hidden>
            <motion.span className={styles.progressFill} style={{ width: underlineX }} />
          </div>

          <div className={styles.dots} aria-hidden>
            {WORDS.map((word, index) => (
              <span
                key={word}
                className={styles.dot}
                data-active={index === activeDot ? "true" : "false"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
