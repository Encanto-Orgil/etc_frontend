"use client";

import { useMemo } from "react";
import GalleryPreviewGrid from "@/components/gallery/GalleryPreviewGrid";
import { getMallGallerySlides } from "@/lib/mallGallery";

export default function MallGalleryStack() {
  const slides = useMemo(() => getMallGallerySlides(), []);

  return <GalleryPreviewGrid slides={slides} revealAttr="data-mall-reveal" />;
}
