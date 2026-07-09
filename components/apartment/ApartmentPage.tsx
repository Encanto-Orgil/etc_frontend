"use client";

import type { Tower } from "@/lib/data";
import ApartmentExperience from "./ApartmentExperience";
import ApartmentFloorPlans from "./ApartmentFloorPlans";
import ApartmentHero from "./ApartmentHero";
import ApartmentContactSection from "./ApartmentContactSection";
import {
  ApartmentAboutSection,
  ApartmentHighlightsSection,
} from "./ApartmentLandingSections";
import styles from "./ApartmentPage.module.css";

type Props = {
  tower: Tower;
  others: Tower[];
};

export default function ApartmentPage(_props: Props) {
  return (
    <ApartmentExperience>
      <div className={styles.page}>
        <ApartmentHero />
        <ApartmentAboutSection />
        <ApartmentFloorPlans />
        <ApartmentHighlightsSection />
        <ApartmentContactSection />
      </div>
    </ApartmentExperience>
  );
}
