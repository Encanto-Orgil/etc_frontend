"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useTranslations } from "@/lib/i18n";
import type { HomeGalleryCategory, HomeGalleryGroup } from "@/lib/homeGallery";
import GalleryFullscreenSlider from "./GalleryFullscreenSlider";
import shared from "./home.shared.module.css";
import styles from "./GalleryCategorySlider.module.css";

type Props = {
  groups: HomeGalleryGroup[];
};

function preloadImage(src: string) {
  if (typeof window === "undefined" || !src) return;
  const img = new window.Image();
  img.decoding = "async";
  img.src = src;
}

export default function GalleryCategorySlider({ groups }: Props) {
  const copy = useTranslations().home.gallery;
  const [categoryId, setCategoryId] = useState<HomeGalleryCategory>(
    groups[0]?.id ?? "renders",
  );
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeGroup = useMemo(
    () => groups.find((group) => group.id === categoryId) ?? groups[0],
    [groups, categoryId],
  );

  const images = activeGroup?.images ?? [];
  const total = images.length;
  const current = images[index] ?? "";
  const prevSrc = total ? images[(index - 1 + total) % total] : "";
  const nextSrc = total ? images[(index + 1) % total] : "";

  useEffect(() => {
    setIndex(0);
  }, [categoryId]);

  useEffect(() => {
    if (nextSrc && nextSrc !== current) preloadImage(nextSrc);
    if (prevSrc && prevSrc !== current) preloadImage(prevSrc);
  }, [current, nextSrc, prevSrc]);

  const selectCategory = (id: HomeGalleryCategory) => {
    if (id === categoryId) return;
    setCategoryId(id);
    setLightboxOpen(false);
  };

  const goPrev = useCallback(() => {
    if (!total) return;
    setIndex((currentIndex) => (currentIndex - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    if (!total) return;
    setIndex((currentIndex) => (currentIndex + 1) % total);
  }, [total]);

  useEffect(() => {
    if (lightboxOpen || !total) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext, lightboxOpen, total]);

  if (!groups.length || !activeGroup || !current) {
    return null;
  }

  const lightboxItems = images.map((image) => ({
    image,
    title: activeGroup.title,
  }));

  return (
    <>
      <section className={shared.section} id="gallery">
        <div className={shared.container}>
          <div className={styles.header} data-home-reveal>
            <div>
              <p className={shared.eyebrow}>{copy.eyebrow}</p>
              <h2 className={shared.title}>{copy.title}</h2>
            </div>
            <p className={styles.count}>
              {activeGroup.title} · {String(index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </p>
          </div>

          <div className={styles.tabs} role="tablist" aria-label={copy.title} data-home-reveal>
            {groups.map((group) => {
              const selected = group.id === categoryId;
              return (
                <button
                  key={group.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={`${styles.tab} ${selected ? styles.tabActive : ""}`}
                  onClick={() => selectCategory(group.id)}
                >
                  <span>{group.title}</span>
                  <span className={styles.tabCount}>{group.images.length}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.slider} data-home-reveal>
            <button
              type="button"
              className={`${styles.nav} ${styles.navPrev}`}
              onClick={goPrev}
              aria-label={copy.lightbox.prev}
            >
              <LuChevronLeft aria-hidden />
            </button>

            <button
              type="button"
              className={styles.stage}
              onClick={() => setLightboxOpen(true)}
              aria-label={`${copy.lightbox.viewImage}: ${activeGroup.title}`}
            >
              <img
                key={current}
                src={current}
                alt={activeGroup.title}
                className={styles.image}
                loading="eager"
                decoding="async"
                fetchPriority="low"
              />
            </button>

            <button
              type="button"
              className={`${styles.nav} ${styles.navNext}`}
              onClick={goNext}
              aria-label={copy.lightbox.next}
            >
              <LuChevronRight aria-hidden />
            </button>
          </div>

          <div className={styles.dots} aria-hidden>
            {Array.from({ length: Math.min(total, 12) }, (_, dotIndex) => {
              const active =
                total <= 12
                  ? dotIndex === index
                  : Math.floor((index / Math.max(total - 1, 1)) * 11) === dotIndex;
              return (
                <span
                  key={`${categoryId}-dot-${dotIndex}`}
                  className={`${styles.dot} ${active ? styles.dotActive : ""}`}
                />
              );
            })}
          </div>
        </div>
      </section>

      <GalleryFullscreenSlider
        items={lightboxItems}
        initialIndex={index}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        labels={copy.lightbox}
      />
    </>
  );
}
