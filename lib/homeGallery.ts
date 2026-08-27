import type { Locale } from "@/lib/i18n/types";
import { resolveAssetUrl } from "@/lib/image";
import galleryManifest from "./homeGallery.manifest.json";

export const GALLERY_FOLDERS = ["renders", "drone", "mall", "ballroom"] as const;

export type HomeGalleryCategory = (typeof GALLERY_FOLDERS)[number];

export type HomeGalleryGroup = {
  id: HomeGalleryCategory;
  title: string;
  images: string[];
};

const CATEGORY_LABELS: Record<HomeGalleryCategory, Record<Locale, string>> = {
  renders: { en: "Renders", mn: "3D дүрслэл" },
  drone: { en: "Drone", mn: "Дрон" },
  mall: { en: "Mall", mn: "Худалдааны төв" },
  ballroom: { en: "Ballroom", mn: "Ballroom" },
};

type GalleryManifest = Record<HomeGalleryCategory, string[]>;

/**
 * Gallery paths come from a static JSON manifest (not fs.readdir).
 * Set NEXT_PUBLIC_GALLERY_CDN_BASE so images are served from Cloudflare R2
 * (object keys: images/renders/..., images/drone/..., etc.).
 */
export function getHomeGalleryGroups(locale: Locale = "en"): HomeGalleryGroup[] {
  const manifest = galleryManifest as GalleryManifest;
  const groups: HomeGalleryGroup[] = [];

  for (const folder of GALLERY_FOLDERS) {
    const images = (manifest[folder] ?? []).map(resolveAssetUrl);
    if (!images.length) continue;

    groups.push({
      id: folder,
      title: CATEGORY_LABELS[folder][locale],
      images,
    });
  }

  return groups;
}
