"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LuChevronLeft, LuChevronRight, LuX } from "react-icons/lu";
import styles from "./GalleryFullscreenSlider.module.css";

export type GallerySlide = {
  title: string;
  image: string;
};

type Props = {
  items: GallerySlide[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
  labels: {
    close: string;
    prev: string;
    next: string;
    viewImage: string;
  };
};

export default function GalleryFullscreenSlider({
  items,
  initialIndex,
  open,
  onClose,
  labels,
}: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowLeft") {
        setDirection(-1);
        setIndex((current) => (current - 1 + items.length) % items.length);
      }

      if (event.key === "ArrowRight") {
        setDirection(1);
        setIndex((current) => (current + 1) % items.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, items.length]);

  const goPrev = useCallback(() => {
    if (!items.length) return;
    setDirection(-1);
    setIndex((current) => (current - 1 + items.length) % items.length);
  }, [items.length]);

  const goNext = useCallback(() => {
    if (!items.length) return;
    setDirection(1);
    setIndex((current) => (current + 1) % items.length);
  }, [items.length]);

  if (typeof document === "undefined") return null;

  const active = items[index];
  if (!active) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            className={styles.backdrop}
            onClick={onClose}
            aria-label={labels.close}
          />

          <div className={styles.toolbar}>
            <div className={styles.meta}>
              <span className={styles.counter}>
                {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <span className={styles.title}>{active.title}</span>
            </div>
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label={labels.close}>
              <LuX aria-hidden />
            </button>
          </div>

          <div className={styles.stage}>
            <button
              type="button"
              className={`${styles.navBtn} ${styles.navPrev}`}
              onClick={goPrev}
              aria-label={labels.prev}
            >
              <LuChevronLeft aria-hidden />
            </button>

            <div className={styles.imageFrame}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.img
                  key={active.image}
                  src={active.image}
                  alt={active.title}
                  className={styles.image}
                  custom={direction}
                  initial={{ opacity: 0, x: direction >= 0 ? 48 : -48, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction >= 0 ? -48 : 48, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  draggable={false}
                />
              </AnimatePresence>
            </div>

            <button
              type="button"
              className={`${styles.navBtn} ${styles.navNext}`}
              onClick={goNext}
              aria-label={labels.next}
            >
              <LuChevronRight aria-hidden />
            </button>
          </div>

          {items.length > 1 && items.length <= 16 ? (
            <div className={styles.thumbs}>
              {items.map((item, thumbIndex) => (
                <button
                  key={`${item.image}-${thumbIndex}`}
                  type="button"
                  className={`${styles.thumb} ${thumbIndex === index ? styles.thumbActive : ""}`}
                  onClick={() => {
                    setDirection(thumbIndex > index ? 1 : -1);
                    setIndex(thumbIndex);
                  }}
                  aria-label={`${labels.viewImage}: ${item.title}`}
                >
                  <img src={item.image} alt="" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
