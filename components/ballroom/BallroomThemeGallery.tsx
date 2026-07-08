"use client";

import { useState } from "react";
import { Image } from "antd";
import { getBallroomGalleryCategories, useLocale, useTranslations } from "@/lib/i18n";
import type { BallroomGalleryCategoryId } from "@/lib/i18n/types";
import styles from "./ballroom.landing.module.css";
import themeStyles from "./BallroomThemeGallery.module.css";

export default function BallroomThemeGallery() {
  const { locale } = useLocale();
  const copy = useTranslations().ballroom.gallery;
  const categories = getBallroomGalleryCategories(locale);
  const [category, setCategory] = useState<BallroomGalleryCategoryId>("lobby");
  const active = categories.find((item) => item.id === category) ?? categories[0];

  return (
    <section
      className={`${styles.sectionCream} ${themeStyles.galleryLight}`}
      id="gallery"
    >
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.title}>{copy.title}</h2>

        <div className={themeStyles.categoryBar} data-ballroom-reveal>
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${themeStyles.categoryBtn} ${category === item.id ? themeStyles.categoryActive : ""}`}
              onClick={() => setCategory(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {active.description ? (
          <p className={themeStyles.categoryDescription} data-ballroom-reveal>
            {active.description}
          </p>
        ) : null}

        <Image.PreviewGroup key={active.id}>
          <div className={themeStyles.galleryGrid}>
            {active.images.map((item, index) => (
              <figure
                key={`${active.id}-${item.src}-${index}`}
                className={`${themeStyles.galleryCell} ${item.wide ? themeStyles.galleryWide : ""} ${item.tall ? themeStyles.galleryTall : ""}`}
                data-ballroom-reveal
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  className={themeStyles.galleryImg}
                  rootClassName={themeStyles.galleryImgRoot}
                />
                {item.caption ? (
                  <figcaption className={themeStyles.galleryCaption}>{item.caption}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </Image.PreviewGroup>
      </div>
    </section>
  );
}
