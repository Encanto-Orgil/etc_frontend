import type { Metadata } from "next";
import HomePageContent from "@/components/home/HomePageContent";
import JsonLd from "@/components/JsonLd";
import { homeMetadata, homePageJsonLd } from "@/lib/seo";

export const metadata: Metadata = homeMetadata();

export default function Home() {
  return (
    <>
      <JsonLd data={homePageJsonLd()} />
      <HomePageContent />
    </>
  );
}
