"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import GalleryFullscreenSlider from "@/components/home/GalleryFullscreenSlider";
import type { GallerySlide } from "@/lib/pageGallery";
import { useTranslations } from "@/lib/i18n";
import styles from "./GalleryPreviewGrid.module.css";

const PREVIEW_IMAGE_COUNT = 11;

const GRID_PLACEMENTS = [
  { column: "1 / 8", row: "1 / 3" },
  { column: "8 / 13", row: "1" },
  { column: "8 / 13", row: "2" },
  { column: "1 / 5", row: "3" },
  { column: "5 / 9", row: "3" },
  { column: "9 / 13", row: "3" },
  { column: "1 / 4", row: "4" },
  { column: "4 / 7", row: "4" },
  { column: "7 / 10", row: "4" },
  { column: "10 / 13", row: "4" },
  { column: "1 / 7", row: "5" },
  { column: "7 / 13", row: "5" },
] as const;

type PreviewTile =
  | {
      kind: "image";
      slide: GallerySlide;
      index: number;
    }
  | {
      kind: "overflow";
      slide: GallerySlide;
      index: number;
      remaining: number;
    };

type Props = {
  slides: GallerySlide[];
  revealAttr?: string;
  eyebrow?: string;
  title?: string;
};

export default function GalleryPreviewGrid({
  slides,
  revealAttr = "data-gallery-reveal",
  eyebrow,
  title,
}: Props) {
  const copy = useTranslations().home.gallery;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const previewTiles = useMemo<PreviewTile[]>(() => {
    if (!slides.length) return [];

    const hasOverflow = slides.length > PREVIEW_IMAGE_COUNT;
    const visibleImages = hasOverflow ? slides.slice(0, PREVIEW_IMAGE_COUNT) : slides;

    const tiles: PreviewTile[] = visibleImages.map((slide, index) => ({
      kind: "image",
      slide,
      index,
    }));

    if (hasOverflow) {
      const overflowIndex = PREVIEW_IMAGE_COUNT;
      tiles.push({
        kind: "overflow",
        slide: slides[overflowIndex],
        index: overflowIndex,
        remaining: slides.length - PREVIEW_IMAGE_COUNT,
      });
    }

    return tiles;
  }, [slides]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (!slides.length) {
    return null;
  }

  return (
    <>
      <section className={styles.section} id="gallery">
        <div className={styles.inner}>
          <header className={styles.header} {...{ [revealAttr]: true }}>
            <div className={styles.headerCopy}>
              <p className={styles.eyebrow}>{eyebrow ?? copy.eyebrow}</p>
              <h2 className={styles.title}>{title ?? copy.title}</h2>
            </div>
            <p className={styles.count}>{slides.length} images</p>
          </header>

          <div className={styles.grid} {...{ [revealAttr]: true }}>
            {previewTiles.map((tile, tileIndex) => {
              const placement = GRID_PLACEMENTS[tileIndex];
              const isFeatured = tileIndex === 0;
              const isOverflow = tile.kind === "overflow";

              return (
                <button
                  key={`${tile.slide.image}-${tileIndex}`}
                  type="button"
                  className={`${styles.tile} ${isFeatured ? styles.tileFeatured : ""} ${isOverflow ? styles.tileOverflow : ""}`}
                  style={
                    placement
                      ? {
                          gridColumn: placement.column,
                          gridRow: placement.row,
                        }
                      : undefined
                  }
                  onClick={() => openLightbox(tile.index)}
                  aria-label={
                    isOverflow
                      ? `${copy.lightbox.viewImage} +${tile.remaining}`
                      : `${copy.lightbox.viewImage} ${tile.index + 1}`
                  }
                >
                  <Image
                    src={tile.slide.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.image}
                  />
                  <span className={styles.overlay} aria-hidden />
                  {isOverflow ? <span className={styles.overflowBadge}>+{tile.remaining}</span> : null}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <GalleryFullscreenSlider
        items={slides}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        labels={{
          close: copy.lightbox.close,
          prev: copy.lightbox.prev,
          next: copy.lightbox.next,
          viewImage: copy.lightbox.viewImage,
        }}
      />
    </>
  );
}
