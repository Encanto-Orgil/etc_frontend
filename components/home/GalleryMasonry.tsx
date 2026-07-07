"use client";

import { useState } from "react";
import { getGalleryItems, useLocale, useTranslations } from "@/lib/i18n";
import GalleryFullscreenSlider from "./GalleryFullscreenSlider";
import shared from "./home.shared.module.css";
import styles from "./GalleryMasonry.module.css";

export default function GalleryMasonry() {
  const { locale } = useLocale();
  const galleryItems = getGalleryItems(locale);
  const copy = useTranslations().home.gallery;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <section className={shared.section} id="gallery">
        <div className={shared.container}>
          <div className={styles.header} data-home-reveal>
            <p className={shared.eyebrow}>{copy.eyebrow}</p>
            <h2 className={shared.title}>{copy.title}</h2>
          </div>

          <div className={styles.grid}>
            {galleryItems.map((item, index) => (
              <button
                key={item.title}
                type="button"
                className={`${styles.item} ${item.tall ? styles.tall : ""} ${item.wide ? styles.wide : ""}`}
                data-home-reveal
                onClick={() => setActiveIndex(index)}
                aria-label={`${copy.lightbox.viewImage}: ${item.title}`}
              >
                <img src={item.image} alt={item.title} loading="lazy" />
                <span className={styles.caption}>{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <GalleryFullscreenSlider
        items={galleryItems}
        initialIndex={activeIndex ?? 0}
        open={activeIndex !== null}
        onClose={() => setActiveIndex(null)}
        labels={copy.lightbox}
      />
    </>
  );
}
