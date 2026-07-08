import type { Locale } from "@/lib/i18n/types";
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

function withCdnBase(src: string) {
  const base = process.env.NEXT_PUBLIC_GALLERY_CDN_BASE?.replace(/\/$/, "");
  if (!base) return src;
  if (/^https?:\/\//i.test(src)) return src;
  return `${base}${src.startsWith("/") ? src : `/${src}`}`;
}

/**
 * Gallery paths come from a static JSON manifest (not fs.readdir).
 * Reading public/images at runtime makes Vercel bundle ~500MB into the
 * serverless function and exceeds the 250MB limit.
 *
 * Optional: set NEXT_PUBLIC_GALLERY_CDN_BASE to an R2 public URL so images
 * are served from CDN instead of the Next.js public folder.
 */
export function getHomeGalleryGroups(locale: Locale = "en"): HomeGalleryGroup[] {
  const manifest = galleryManifest as GalleryManifest;
  const groups: HomeGalleryGroup[] = [];

  for (const folder of GALLERY_FOLDERS) {
    const images = (manifest[folder] ?? []).map(withCdnBase);
    if (!images.length) continue;

    groups.push({
      id: folder,
      title: CATEGORY_LABELS[folder][locale],
      images,
    });
  }

  return groups;
}
