"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { brandStatement } from "@/lib/homeContent";
import styles from "./BrandStatement.module.css";

const STATS = brandStatement.stats;
const LAST_INDEX = STATS.length - 1;

/** Scroll distance per stat word (vh). */
const STEP_VH = 72;

function wordOpacity(index: number, progress: number) {
  const exactIndex = progress * LAST_INDEX;
  const distance = Math.abs(index - exactIndex);
  return Math.max(0.06, 1 - distance * 0.78);
}

function wordScale(index: number, progress: number) {
  const exactIndex = progress * LAST_INDEX;
  const distance = Math.abs(index - exactIndex);
  return 0.9 + Math.max(0, 1 - distance * 1.35) * 0.1;
}

function StatWord({
  stat,
  index,
  scrollProgress,
  measureRef,
}: {
  stat: (typeof STATS)[number];
  index: number;
  scrollProgress: MotionValue<number>;
  measureRef?: RefObject<HTMLLIElement | null>;
}) {
  const opacity = useTransform(scrollProgress, (progress) =>
    wordOpacity(index, progress),
  );
  const scale = useTransform(scrollProgress, (progress) =>
    wordScale(index, progress),
  );
  const [active, setActive] = useState(index === 0);

  useMotionValueEvent(scrollProgress, "change", (progress) => {
    const exactIndex = progress * LAST_INDEX;
    setActive(Math.abs(index - exactIndex) < 0.45);
  });

  return (
    <li ref={measureRef} className={styles.wordItem}>
      <motion.div className={styles.wordBlock} style={{ opacity, scale }}>
        <span className={styles.statValue} data-active={active ? "true" : "false"}>
          {stat.value}
        </span>
        <span className={styles.statLabel} data-active={active ? "true" : "false"}>
          {stat.label}
        </span>
      </motion.div>
    </li>
  );
}

export default function BrandStatement() {
  const containerRef = useRef<HTMLElement>(null);
  const itemRef = useRef<HTMLLIElement>(null);
  const scrollProgress = useMotionValue(0);
  const [itemHeight, setItemHeight] = useState(160);
  const [activeDot, setActiveDot] = useState(0);

  const trackY = useTransform(scrollProgress, (progress) => {
    const exactIndex = progress * LAST_INDEX;
    return (1 - exactIndex) * itemHeight;
  });

  useMotionValueEvent(scrollProgress, "change", (progress) => {
    setActiveDot(Math.round(progress * LAST_INDEX));
  });

  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;

    const measure = () => setItemHeight(item.getBoundingClientRect().height || 160);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(item);
    return () => observer.disconnect();
  }, []);

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
      style={{ height: `${STATS.length * STEP_VH}vh` }}
      id="brand"
      aria-label={brandStatement.headline}
    >
      <div className={styles.sticky}>
        <div className={styles.backdrop} aria-hidden />
        <div className={styles.inner}>
          <div className={styles.grid}>
            <div className={styles.intro}>
              <h2 className={styles.headline}>{brandStatement.headline}</h2>
              <p className={styles.body}>
                {brandStatement.body.split("\n").map((line, i) => (
                  <span key={line}>
                    {line}
                    {i === 0 ? <br /> : null}
                  </span>
                ))}
              </p>
            </div>

            <div className={styles.scrollCol}>
              <div className={styles.wordWindow}>
                <motion.ul className={styles.wordTrack} style={{ y: trackY }}>
                  {STATS.map((stat, index) => (
                    <StatWord
                      key={stat.label}
                      stat={stat}
                      index={index}
                      scrollProgress={scrollProgress}
                      measureRef={index === 0 ? itemRef : undefined}
                    />
                  ))}
                </motion.ul>
              </div>

              <div className={styles.dots} aria-hidden>
                {STATS.map((stat, index) => (
                  <span
                    key={stat.label}
                    className={styles.dot}
                    data-active={index === activeDot ? "true" : "false"}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
