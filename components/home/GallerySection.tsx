"use client";

import GalleryCategorySlider from "@/components/home/GalleryCategorySlider";
import { useLocale } from "@/lib/i18n";
import { getHomeGalleryGroups } from "@/lib/homeGallery";

export default function GallerySection() {
  const { locale } = useLocale();
  const groups = getHomeGalleryGroups(locale);

  return <GalleryCategorySlider groups={groups} />;
}
