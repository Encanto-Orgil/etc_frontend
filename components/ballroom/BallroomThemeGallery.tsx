"use client";

import { useMemo } from "react";
import GalleryPreviewGrid from "@/components/gallery/GalleryPreviewGrid";
import { getBallroomGallerySlides } from "@/lib/ballroomGallerySlides";
import { useTranslations } from "@/lib/i18n";

export default function BallroomThemeGallery() {
  const copy = useTranslations().ballroom.gallery;
  const slides = useMemo(() => getBallroomGallerySlides(), []);

  return (
    <GalleryPreviewGrid
      slides={slides}
      revealAttr="data-ballroom-reveal"
      eyebrow={copy.eyebrow}
      title={copy.title}
    />
  );
}
