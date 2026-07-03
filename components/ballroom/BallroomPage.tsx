import Link from "next/link";
import type { Tower } from "@/lib/data";
import BallroomExperience from "./BallroomExperience";
import BallroomHero from "./BallroomHero";
import {
  BallroomContactSection,
  BallroomExperienceSection,
  BallroomFaqSection,
  BallroomHighlightsSection,
  BallroomSignatureSection,
} from "./BallroomLandingSections";
import BallroomCapacityPlanner from "./BallroomCapacityPlanner";
import BallroomSkyfold from "./BallroomSkyfold";
import BallroomSubNav from "./BallroomSubNav";
import BallroomThemeGallery from "./BallroomThemeGallery";
import styles from "./BallroomPage.module.css";

type Props = {
  tower: Tower;
  others: Tower[];
};

export default function BallroomPage({ others }: Props) {
  return (
    <BallroomExperience>
      <div className={styles.page}>
        <BallroomHero />
        <BallroomSubNav />

        <BallroomExperienceSection />
        <BallroomHighlightsSection />
        <BallroomThemeGallery />
        <BallroomCapacityPlanner />
        <BallroomSkyfold />
        <BallroomSignatureSection />
        <BallroomContactSection />
        <BallroomFaqSection />

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
    </BallroomExperience>
  );
}
