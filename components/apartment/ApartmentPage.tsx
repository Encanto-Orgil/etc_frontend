import Link from "next/link";
import type { Tower } from "@/lib/data";
import ApartmentExperience from "./ApartmentExperience";
import ApartmentFloorPlans from "./ApartmentFloorPlans";
import ApartmentHero from "./ApartmentHero";
import {
  ApartmentConceptSection,
  ApartmentContactSection,
  ApartmentCtaSection,
  ApartmentEcosystemSection,
  ApartmentGallerySection,
  ApartmentHighlightsSection,
  ApartmentInteriorSection,
  ApartmentInvestmentSection,
  ApartmentLocationSection,
  ApartmentPageFooter,
  ApartmentServicesSection,
  ApartmentSpecificationsSection,
  ApartmentTypesSection,
  ApartmentWhySection,
} from "./ApartmentLandingSections";
import styles from "./ApartmentPage.module.css";

type Props = {
  tower: Tower;
  others: Tower[];
};

export default function ApartmentPage({ others }: Props) {
  return (
    <ApartmentExperience>
      <div className={styles.page}>
        <ApartmentHero />

        <ApartmentConceptSection />
        <ApartmentHighlightsSection />
        <ApartmentTypesSection />
        <ApartmentInteriorSection />
        <ApartmentSpecificationsSection />
        <ApartmentServicesSection />
        <ApartmentLocationSection />
        <ApartmentInvestmentSection />
        <ApartmentFloorPlans />
        <ApartmentGallerySection />
        <ApartmentWhySection />
        <ApartmentEcosystemSection />
        <ApartmentCtaSection />
        <ApartmentContactSection />
        <ApartmentPageFooter />

        <section className={`${styles.section} ${styles.sectionSoft}`} id="explore">
          <div className={styles.inner}>
            <header className={styles.sectionHead}>
              <span className={styles.eyebrow}>Project</span>
              <h2 className={styles.title}>Explore Other Destinations</h2>
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
    </ApartmentExperience>
  );
}
