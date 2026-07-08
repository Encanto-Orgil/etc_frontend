import fs from "fs";
import path from "path";
import type { Locale } from "@/lib/i18n/types";

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

const IMAGE_RE = /\.(jpe?g|png|webp|gif)$/i;
const EXT_PREFERENCE = [".jpg", ".jpeg", ".webp", ".png", ".gif"];

function naturalSort(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function dedupeByStem(files: string[]) {
  const byStem = new Map<string, string>();

  for (const file of files.sort(naturalSort)) {
    const stem = file.replace(/\.[^.]+$/, "").toLowerCase();
    const ext = file.slice(file.lastIndexOf(".")).toLowerCase();
    const existing = byStem.get(stem);

    if (!existing) {
      byStem.set(stem, file);
      continue;
    }

    const existingExt = existing.slice(existing.lastIndexOf(".")).toLowerCase();
    if (EXT_PREFERENCE.indexOf(ext) < EXT_PREFERENCE.indexOf(existingExt)) {
      byStem.set(stem, file);
    }
  }

  return [...byStem.values()].sort(naturalSort);
}

export function getHomeGalleryGroups(locale: Locale = "en"): HomeGalleryGroup[] {
  const root = path.join(process.cwd(), "public", "images");
  const groups: HomeGalleryGroup[] = [];

  for (const folder of GALLERY_FOLDERS) {
    const dir = path.join(root, folder);
    if (!fs.existsSync(dir)) continue;

    const files = dedupeByStem(fs.readdirSync(dir).filter((name) => IMAGE_RE.test(name)));
    if (!files.length) continue;

    groups.push({
      id: folder,
      title: CATEGORY_LABELS[folder][locale],
      images: files.map((file) => `/images/${folder}/${file}`),
    });
  }

  return groups;
}
