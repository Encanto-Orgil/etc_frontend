import Link from "next/link";
import type { Tower } from "@/lib/data";
import MallExperience from "./MallExperience";
import MallFlowSection from "./MallFlowSection";
import MallFloorNav from "./MallFloorNav";
import MallHero from "./MallHero";
import {
  MallAtriumSection,
  MallBrandsSection,
  MallContactSection,
  MallDiningSection,
  MallEntertainmentSection,
  MallExperienceSection,
  MallGallerySection,
  MallHighlightsSection,
  MallLeasingSection,
  MallVisitSection,
  MallWhySection,
  MallZonesSection,
} from "./MallLandingSections";
import styles from "./MallPage.module.css";

type Props = {
  tower: Tower;
  others: Tower[];
};

export default function MallPage({ others }: Props) {
  return (
    <MallExperience>
      <div className={styles.page}>
        <MallHero />

        <MallExperienceSection />
        <MallHighlightsSection />
        <MallZonesSection />
        <MallBrandsSection />
        <MallFlowSection />
        <MallAtriumSection />
        <MallDiningSection />
        <MallEntertainmentSection />
        <MallFloorNav />
        <MallWhySection />
        <MallGallerySection />
        <MallLeasingSection />
        <MallVisitSection />
        <MallContactSection />

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
    </MallExperience>
  );
}
