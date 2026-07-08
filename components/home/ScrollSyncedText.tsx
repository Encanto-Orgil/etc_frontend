"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type RefObject } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import styles from "./ScrollSyncedText.module.css";

const ITEMS = [
  { word: "Office", href: "/office" },
  { word: "Mall", href: "/mall" },
  { word: "Residence", href: "/residence" },
  { word: "Ballroom", href: "/ballroom" },
] as const;

const LAST_INDEX = ITEMS.length - 1;

/** Scroll distance per word (vh). Lower = faster word changes. */
const STEP_VH = 62;

function wordOpacity(index: number, progress: number) {
  const exactIndex = progress * LAST_INDEX;
  const distance = Math.abs(index - exactIndex);
  return Math.max(0.1, 1 - distance * 0.72);
}

function ScrollWord({
  item,
  index,
  scrollProgress,
  measureRef,
}: {
  item: (typeof ITEMS)[number];
  index: number;
  scrollProgress: MotionValue<number>;
  measureRef?: RefObject<HTMLLIElement | null>;
}) {
  const opacity = useTransform(scrollProgress, (progress) =>
    wordOpacity(index, progress),
  );
  const [active, setActive] = useState(index === 0);

  useMotionValueEvent(scrollProgress, "change", (progress) => {
    const exactIndex = progress * LAST_INDEX;
    setActive(Math.abs(index - exactIndex) < 0.45);
  });

  return (
    <li ref={measureRef} className={styles.wordItem}>
      <motion.span className={styles.wordLinkWrap} style={{ opacity }}>
        <Link
          href={item.href}
          className={styles.wordLink}
          data-active={active ? "true" : "false"}
          tabIndex={active ? 0 : -1}
          aria-current={active ? "true" : undefined}
        >
          {item.word}
        </Link>
      </motion.span>
    </li>
  );
}

export default function ScrollSyncedText() {
  const containerRef = useRef<HTMLElement>(null);
  const itemRef = useRef<HTMLLIElement>(null);
  const scrollProgress = useMotionValue(0);
  const [itemHeight, setItemHeight] = useState(88);
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

    const measure = () => setItemHeight(item.getBoundingClientRect().height || 88);
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
      style={{ height: `${ITEMS.length * STEP_VH}vh` }}
      aria-label="Encanto Trade Center хэсгүүд"
    >
      <div className={styles.sticky}>
        <div className={styles.inner}>
          <div className={styles.row}>
            <p className={styles.prefix}>Encanto Trade Center —</p>

            <div className={styles.wordWindow}>
              <motion.ul className={styles.wordTrack} style={{ y: trackY }}>
                {ITEMS.map((item, index) => (
                  <ScrollWord
                    key={item.word}
                    item={item}
                    index={index}
                    scrollProgress={scrollProgress}
                    measureRef={index === 0 ? itemRef : undefined}
                  />
                ))}
              </motion.ul>
            </div>
          </div>

          <div className={styles.dots} aria-hidden>
            {ITEMS.map((item, index) => (
              <span
                key={item.word}
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
