"use client";

import dynamic from "next/dynamic";
import HeroSlider from "@/components/home/HeroSlider";
import HomeExperience from "@/components/home/HomeExperience";

const BrandStatement = dynamic(() => import("@/components/home/BrandStatement"));
const AboutProject = dynamic(() => import("@/components/home/AboutProject"));
const TestimonialsSection = dynamic(() => import("@/components/home/TestimonialsSection"));
const ConstructionProgress = dynamic(() => import("@/components/home/ConstructionProgress"));
const WhyEncanto = dynamic(() => import("@/components/home/WhyEncanto"));
const LocationSection = dynamic(() => import("@/components/home/LocationSection"));
const InteractiveBuilding = dynamic(
  () => import("@/components/home/InteractiveBuilding"),
  { ssr: false },
);
const FloorPlans = dynamic(() => import("@/components/home/FloorPlans"));
const AmenitiesScroll = dynamic(() => import("@/components/home/AmenitiesScroll"));
const GallerySection = dynamic(() => import("@/components/home/GallerySection"));
const NewsSection = dynamic(() => import("@/components/home/NewsSection"));
const ContactSection = dynamic(() => import("@/components/home/ContactSection"));
const FloatingActions = dynamic(() => import("@/components/home/FloatingActions"), {
  ssr: false,
});

export default function HomePageContent() {
  return (
    <>
      <HomeExperience>
        <HeroSlider />
        <BrandStatement />
        <AboutProject />
        <TestimonialsSection />
        <ConstructionProgress />
        <WhyEncanto />
        <LocationSection />
        <InteractiveBuilding />
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
