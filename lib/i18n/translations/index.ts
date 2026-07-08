import type { Locale, NearbyPlace, Translations } from "../types";
import { en, amenityImages, galleryImages } from "./en";
import { mn } from "./mn";
import {
  ballroomEventTypes as ballroomEventTypeAssets,
  ballroomGalleryCategories as ballroomGalleryAssets,
  ballroomHighlights as ballroomHighlightAssets,
  ballroomLayouts as ballroomLayoutAssets,
} from "../../ballroomContent";
import { ballroomSkyfold as ballroomSkyfoldAssets } from "../../ballroomBrochure";
import type { BallroomEventIcon } from "../types";

const catalogs: Record<Locale, Translations> = { en, mn };

export function getTranslations(locale: Locale): Translations {
  return catalogs[locale] ?? en;
}

export function getBallroomHighlights(locale: Locale) {
  const copy = getTranslations(locale).ballroom.highlights;
  return ballroomHighlightAssets.map((item) => ({
    icon: item.icon,
    title: copy[item.icon].title,
    description: copy[item.icon].description,
  }));
}

export function getBallroomGalleryCategories(locale: Locale) {
  const copy = getTranslations(locale).ballroom.gallery;
  return ballroomGalleryAssets.map((category) => {
    const text = copy.categories[category.id];
    return {
      id: category.id,
      label: text.label,
      description: text.description,
      images: category.images.map((image, index) => ({
        ...image,
        alt: text.images[index]?.alt ?? image.alt,
        caption: text.images[index]?.caption ?? image.caption,
      })),
    };
  });
}

export function getBallroomEventTypes(locale: Locale) {
  const copy = getTranslations(locale).ballroom.capacity;
  return (Object.keys(copy.eventTypes) as BallroomEventIcon[]).map((icon) => {
    const asset = ballroomEventTypeAssets.find((item) => item.icon === icon);
    const event = copy.eventTypes[icon];
    return {
      icon,
      title: event.title,
      layout: event.layout,
      image: asset?.image ?? "",
    };
  });
}

export function getBallroomLayouts(locale: Locale) {
  const copy = getTranslations(locale).ballroom.capacity;
  return ballroomLayoutAssets.map((layout) => ({
    ...layout,
    label: copy.layouts[layout.layout].label,
    note: copy.layouts[layout.layout].note,
  }));
}

export function getBallroomSkyfold(locale: Locale) {
  const copy = getTranslations(locale).ballroom.skyfold;
  return {
    image: ballroomSkyfoldAssets.image,
    title: copy.title,
    subtitle: copy.eyebrow,
    tagline: copy.tagline,
    imageAlt: copy.imageAlt,
    modes: ballroomSkyfoldAssets.modes.map((mode) => ({
      ...mode,
      label: copy.modes[mode.id].label,
      hint: copy.modes[mode.id].hint,
    })),
    points: copy.points,
  };
}

export function getBallroomBookingEventTypes(locale: Locale) {
  const copy = getTranslations(locale).ballroom.availability.eventTypes;
  return (Object.keys(copy) as Array<keyof typeof copy>).map((value) => ({
    value,
    label: copy[value],
  }));
}

export function translateBallroomCheckTimeMessage(message: string, locale: Locale) {
  const copy = getTranslations(locale).ballroom.availability;
  if (copy.checkTimeMessages[message]) return copy.checkTimeMessages[message];

  const conflictMatch = message.match(/^Сонгосон цаг давхцаж байна: (.+)$/);
  if (conflictMatch) {
    return `${copy.conflictPrefix} ${conflictMatch[1]}`;
  }

  return message;
}

export function getNearbyPlaces(locale: Locale): NearbyPlace[] {
  const names: Record<Locale, { name: string; imageAlt: string }[]> = {
    en: [
      { name: "Sukhbaatar Square", imageAlt: "Sukhbaatar Square in central Ulaanbaatar" },
      {
        name: "The National Amusement Park",
        imageAlt: "The National Amusement Park, Ulaanbaatar",
      },
      {
        name: "National Stadium of Mongolia",
        imageAlt: "National Stadium of Mongolia, Ulaanbaatar",
      },
      {
        name: "National Garden Park",
        imageAlt: "National Garden Park, Ulaanbaatar",
      },
      { name: "Orchlon School", imageAlt: "Aerial view near Orchlon School" },
      { name: "Hobby School", imageAlt: "Hobby School building, Ulaanbaatar" },
      {
        name: "International School of Ulaanbaatar",
        imageAlt: "Aerial view near International School of Ulaanbaatar",
      },
      { name: "Global Innova", imageAlt: "Aerial view near Global Innova" },
      { name: "Olonlog Academy School", imageAlt: "Aerial view near Olonlog Academy School" },
      { name: "School No. 130", imageAlt: "Aerial view near School No. 130" },
    ],
    mn: [
      { name: "Сүхбаатарын талбай", imageAlt: "Улаанбаатар хотын төвийн Сүхбаатарын талбай" },
      {
        name: "Үндэсний соёл амралтын хүрээлэн",
        imageAlt: "Үндэсний соёл амралтын хүрээлэн",
      },
      {
        name: "Төв цэнгэлдэх хүрээлэн",
        imageAlt: "Төв цэнгэлдэх хүрээлэн, Улаанбаатар",
      },
      {
        name: "Үндэсний цэцэрлэгт хүрээлэн",
        imageAlt: "Үндэсний цэцэрлэгт хүрээлэн, Улаанбаатар",
      },
      { name: "Орчлон сургууль", imageAlt: "Орчлон сургуулийн ойролцоох агаарын зураг" },
      { name: "Hobby сургууль", imageAlt: "Hobby сургуулийн барилга, Улаанбаатар" },
      {
        name: "International School of Ulaanbaatar",
        imageAlt: "International School of Ulaanbaatar-ийн ойролцоох агаарын зураг",
      },
      { name: "Global Innova", imageAlt: "Global Innova-ийн ойролцоох агаарын зураг" },
      { name: "Olonlog Academy School", imageAlt: "Olonlog Academy School-ийн ойролцоох агаарын зураг" },
      { name: "130-р сургууль", imageAlt: "130-р сургуулийн ойролцоох агаарын зураг" },
    ],
  };

  const images = [
    "/images/nearby/sukhbaatar-square.jpg",
    "/images/nearby/national-amusement-park.jpg",
    "/images/nearby/national-stadium.jpg",
    "/images/nearby/national-garden-park.jpg",
    "/images/nearby/orchlon-school.jpg",
    "/images/nearby/hobby-school.jpg",
    "/images/nearby/international-school-of-ulaanbaatar.png",
    "/images/drone/drone-4.jpg",
    "/images/nearby/olonlog-academy-school.jpg",
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
