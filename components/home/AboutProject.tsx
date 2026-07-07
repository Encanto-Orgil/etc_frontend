"use client";

import { useTranslations } from "@/lib/i18n";
import shared from "./home.shared.module.css";
import styles from "./AboutProject.module.css";

const aboutImage = "/images/renders/render-8.jpg";

export default function AboutProject() {
  const about = useTranslations().home.about;

  return (
    <section className={shared.section} id="about">
      <div className={`${shared.container} ${styles.grid}`}>
        <div className={styles.mediaWrap} data-home-reveal>
          <img src={aboutImage} alt={about.imageAlt} className={styles.image} />
        </div>

        <div className={styles.copy} data-home-reveal>
          <p className={shared.eyebrow}>{about.eyebrow}</p>
          <h2 className={shared.title}>{about.title}</h2>
          <p className={shared.lead}>{about.body}</p>
        </div>
      </div>
    </section>
  );
}
