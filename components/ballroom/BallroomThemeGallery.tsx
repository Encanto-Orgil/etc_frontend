"use client";

import { useState } from "react";
import { Image } from "antd";
import {
  ballroomGalleryCategories,
  type BallroomGalleryCategoryId,
} from "@/lib/ballroomContent";
import styles from "./ballroom.landing.module.css";
import themeStyles from "./BallroomThemeGallery.module.css";

export default function BallroomThemeGallery() {
  const [category, setCategory] = useState<BallroomGalleryCategoryId>("lobby");
  const active =
    ballroomGalleryCategories.find((item) => item.id === category) ??
    ballroomGalleryCategories[0];

  return (
    <section
      className={`${styles.sectionCream} ${themeStyles.galleryLight}`}
      id="gallery"
    >
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Ballroom Gallery</p>
        <h2 className={styles.title}>A Venue That Transforms</h2>

        <div className={themeStyles.categoryBar} data-ballroom-reveal>
          {ballroomGalleryCategories.map((item) => (
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
