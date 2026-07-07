import type { Locale, NearbyPlace, Translations } from "../types";
import { en, amenityImages, galleryImages } from "./en";
import { mn } from "./mn";

const catalogs: Record<Locale, Translations> = { en, mn };

export function getTranslations(locale: Locale): Translations {
  return catalogs[locale] ?? en;
}

export function getNearbyPlaces(locale: Locale): NearbyPlace[] {
  const names: Record<Locale, { name: string; imageAlt: string }[]> = {
    en: [
      { name: "Sukhbaatar Square", imageAlt: "Sukhbaatar Square in central Ulaanbaatar" },
      {
        name: "National Culture and Recreation Center",
        imageAlt: "Aerial view near the National Culture and Recreation Center",
      },
      {
        name: "National Stadium of Mongolia",
        imageAlt: "National Sports Stadium, Ulaanbaatar",
      },
      {
        name: "National Garden Park",
        imageAlt: "National Garden Park, Ulaanbaatar",
      },
      { name: "Orchlon School", imageAlt: "Aerial view near Orchlon School" },
      { name: "Hobby School", imageAlt: "Hobby School building, Ulaanbaatar" },
      {
        name: "International School of Mongolia",
        imageAlt: "Aerial view near International School of Mongolia",
      },
      { name: "Global Innova", imageAlt: "Aerial view near Global Innova" },
      { name: "Olonlog School", imageAlt: "Aerial view near Olonlog School" },
      { name: "School No. 130", imageAlt: "Aerial view near School No. 130" },
    ],
    mn: [
      { name: "Сүхбаатарын талбай", imageAlt: "Улаанбаатар хотын төвийн Сүхбаатарын талбай" },
      {
        name: "Үндэсний соёл амралтын төв",
        imageAlt: "Үндэсний соёл амралтын төвийн ойролцоох агаарын зураг",
      },
      {
        name: "Үндэсний спортын цогцолбор",
        imageAlt: "Үндэсний спортын цогцолбор, Улаанбаатар",
      },
      {
        name: "Үндэсний цэцэрлэгт хүрээлэн",
        imageAlt: "Үндэсний цэцэрлэгт хүрээлэн, Улаанбаатар",
      },
      { name: "Орчлон сургууль", imageAlt: "Орчлон сургуулийн ойролцоох агаарын зураг" },
      { name: "Хобби сургууль", imageAlt: "Хобби сургуулийн барилга, Улаанбаатар" },
      {
        name: "Монголын Олон Улсын Сургууль",
        imageAlt: "Монголын Олон Улсын Сургуулийн ойролцоох агаарын зураг",
      },
      { name: "Global Innova", imageAlt: "Global Innova-ийн ойролцоох агаарын зураг" },
      { name: "Олонлог сургууль", imageAlt: "Олонлог сургуулийн ойролцоох агаарын зураг" },
      { name: "130 дугаар сургууль", imageAlt: "130 дугаар сургуулийн ойролцоох агаарын зураг" },
    ],
  };

  const images = [
    "/images/nearby/sukhbaatar-square.jpg",
    "/images/drone/drone-2.jpg",
    "/images/nearby/national-stadium.jpg",
    "/images/nearby/national-garden-park.jpg",
    "/images/drone/drone-5.jpg",
    "/images/nearby/hobby-school.jpg",
    "/images/drone/drone-3.jpg",
    "/images/drone/drone-4.jpg",
    "/images/drone/drone-6.jpg",
    "/images/drone/drone-2.jpg",
  ];

  const distances = ["900 m", "500 m", "800 m", "500 m", "100 m", "700 m", "300 m", "900 m", "700 m", "300 m"];

  return names[locale].map((place, index) => ({
    ...place,
    distance: distances[index],
    image: images[index],
  }));
}

export function getAmenities(locale: Locale) {
  const items = getTranslations(locale).home.amenities.items;
  return items.map((item, index) => ({
    title: item.title,
    image: amenityImages[index],
  }));
}

export function getGalleryItems(locale: Locale) {
  const items = getTranslations(locale).home.gallery.items;
  return items.map((item, index) => ({
    title: item.title,
    ...galleryImages[index],
  }));
}

import { homeFloorPlanCards } from "../../homeFloorPlans";

export function getFloorPlanTabs(locale: Locale) {
  const t = getTranslations(locale).home.floorPlans;
  const labelById = Object.fromEntries(t.tabs.map((tab) => [tab.id, tab.label]));

  return homeFloorPlanCards.map((card) => ({
    id: card.id,
    label: labelById[card.id] ?? card.id,
    image: card.image,
    pdf: card.pdf,
  }));
}

export { en, mn };
