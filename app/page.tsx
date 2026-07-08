import type { Metadata } from "next";
import { Suspense } from "react";
import HeroSlider from "@/components/home/HeroSlider";
import HomeExperience from "@/components/home/HomeExperience";
import BrandStatement from "@/components/home/BrandStatement";
import AboutProject from "@/components/home/AboutProject";
import WhyEncanto from "@/components/home/WhyEncanto";
import InteractiveBuilding from "@/components/home/InteractiveBuilding";
import AmenitiesScroll from "@/components/home/AmenitiesScroll";
import FloorPlans from "@/components/home/FloorPlans";
import GallerySection from "@/components/home/GallerySection";
import LocationSection from "@/components/home/LocationSection";
import ConstructionProgress from "@/components/home/ConstructionProgress";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsSection from "@/components/home/NewsSection";
import ContactSection from "@/components/home/ContactSection";
import FloatingActions from "@/components/home/FloatingActions";
import JsonLd from "@/components/JsonLd";
import { homeListingJsonLd, homeMetadata } from "@/lib/seo";

export const metadata: Metadata = homeMetadata();

export default function Home() {
  return (
    <>
      <JsonLd data={homeListingJsonLd()} />
      <HomeExperience>
        {/* Conversion funnel: Hero → Trust → Benefits → Location → Planning → Contact */}
        <HeroSlider />
        <BrandStatement />
        <AboutProject />
        <TestimonialsSection />
        <ConstructionProgress />
        <WhyEncanto />
        <LocationSection />
        <Suspense fallback={null}>
          <InteractiveBuilding />
        </Suspense>
        <FloorPlans />
        <AmenitiesScroll />
        <GallerySection />
        <NewsSection />
        <ContactSection />
      </HomeExperience>
      <FloatingActions />
    </>
  );
}
