"use client";

import Link from "next/link";
import type { Tower } from "@/lib/data";
import { useTranslations } from "@/lib/i18n";
import MallExperience from "./MallExperience";
import MallContactSection from "./MallContactSection";
import MallFloorPlan from "./MallFloorPlan";
import MallGallerySection from "./MallGallerySection";
import MallHero from "./MallHero";
import { MallHighlightsSection } from "./MallHighlightsSection";
import {
  MallFaqSection,
  MallIntroSection,
  MallLayoutSection,
  MallLocationSection,
  MallTenantSection,
} from "./MallLandingSections";
import styles from "./MallPage.module.css";

type Props = {
  tower: Tower;
  others: Tower[];
};

export default function MallPage({ others }: Props) {
  const explore = useTranslations().mall.explore;

  return (
    <MallExperience>
      <div className={styles.page}>
        <MallHero />
        <MallIntroSection />
        <MallHighlightsSection />
        <MallTenantSection />
        <MallLayoutSection />
        <MallFloorPlan />
        <MallLocationSection />
        <MallGallerySection />
        <MallContactSection />
        <MallFaqSection />

        <section className={`${styles.section} ${styles.sectionSoft}`} id="explore">
          <div className={styles.inner}>
            <header className={styles.sectionHead}>
              <span className={styles.eyebrow}>{explore.eyebrow}</span>
              <h2 className={styles.title}>{explore.title}</h2>
            </header>
            <div className={styles.otherGrid}>
              {others.map((item) => (
                <Link key={item.slug} href={`/${item.slug}`} className={styles.otherCard}>
                  <img src={item.heroImage} alt={item.nameMn} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </MallExperience>
  );
}
