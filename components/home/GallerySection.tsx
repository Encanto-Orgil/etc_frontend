import { cookies } from "next/headers";
import GalleryCategorySlider from "@/components/home/GalleryCategorySlider";
import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from "@/lib/i18n";
import { getHomeGalleryGroups } from "@/lib/homeGallery";

async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return value === "mn" || value === "en" ? value : DEFAULT_LOCALE;
}

export default async function GallerySection() {
  const locale = await getServerLocale();
  const groups = getHomeGalleryGroups(locale);

  return <GalleryCategorySlider groups={groups} />;
}
