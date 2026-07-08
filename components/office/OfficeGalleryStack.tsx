"use client";

import { useMemo } from "react";
import GalleryPreviewGrid from "@/components/gallery/GalleryPreviewGrid";
import { getOfficeGallerySlides } from "@/lib/officeGallerySlides";

export default function OfficeGalleryStack() {
  const slides = useMemo(() => getOfficeGallerySlides(), []);

  return <GalleryPreviewGrid slides={slides} revealAttr="data-office-reveal" />;
}
