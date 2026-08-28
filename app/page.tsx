import type { Metadata } from "next";
import HomePageContent from "@/components/home/HomePageContent";
import JsonLd from "@/components/JsonLd";
import { assetUrl } from "@/lib/image";
import { homeMetadata, homePageJsonLd } from "@/lib/seo";

export const metadata: Metadata = homeMetadata();

const HERO_PRELOAD = assetUrl("/images/renders/render-34.jpg");

export default function Home() {
  return (
    <>
      <link rel="preload" as="image" href={HERO_PRELOAD} fetchPriority="high" />
      <JsonLd data={homePageJsonLd()} />
      <HomePageContent />
    </>
  );
}
