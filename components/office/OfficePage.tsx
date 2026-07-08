import Link from "next/link";
import type { Tower } from "@/lib/data";
import OfficeExperience from "./OfficeExperience";
import OfficeContactSection from "./OfficeContactSection";
import OfficeHero from "./OfficeHero";
import OfficePresentationVideo from "./OfficePresentationVideo";
import OfficeHighlightsSection from "./OfficeHighlightsSection";
import OfficeCtaSection from "./OfficeCtaSection";
import OfficePortalSection from "./OfficePortalSection";
import OfficeWhySection from "./OfficeWhySection";
import {
  OfficeAmenitiesSection,
  OfficeBusinessSection,
  OfficeFaqSection,
  OfficeGallerySection,
  OfficeLocationSection,
  OfficeTypesSection,
} from "./OfficeLandingSections";
import OfficeStackingPlan from "./OfficeStackingPlan";
import OfficeStickySidebar from "./OfficeStickySidebar";
import styles from "./OfficePage.module.css";

type Props = {
  tower: Tower;
  others: Tower[];
};

export default function OfficePage({ others }: Props) {
  return (
    <OfficeExperience>
      <div className={styles.page}>
        <OfficeHero />
        <OfficeStickySidebar />

        <OfficeBusinessSection />
        <OfficePresentationVideo />
        <OfficeHighlightsSection />
        <OfficeTypesSection />
        <OfficeStackingPlan />
        <OfficeAmenitiesSection />
        <OfficeWhySection />
        <OfficePortalSection />
        <OfficeLocationSection />
        <OfficeGallerySection />
        <OfficeFaqSection />
        <OfficeCtaSection />

        <OfficeContactSection />

        <section className={`${styles.section} ${styles.sectionSoft}`} id="explore">
          <div className={styles.inner}>
            <header className={styles.sectionHead}>
              <span className={styles.eyebrow}>Project</span>
              <h2 className={styles.title}>Explore Other Destinations</h2>
            </header>
            <div className={styles.otherGrid}>
              {others.map((t) => (
                <Link key={t.slug} href={`/${t.slug}`} className={styles.otherCard}>
                  <img src={t.heroImage} alt={t.nameMn} />
                  <span>{t.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </OfficeExperience>
  );
}
