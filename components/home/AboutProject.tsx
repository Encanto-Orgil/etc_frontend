import { aboutProject } from "@/lib/homeContent";
import shared from "./home.shared.module.css";
import styles from "./AboutProject.module.css";

export default function AboutProject() {
  return (
    <section className={shared.section} id="about">
      <div className={`${shared.container} ${styles.grid}`}>
        <div className={styles.mediaWrap} data-home-reveal>
          <img
            src={aboutProject.image}
            alt="Encanto Trade Center render"
            className={styles.image}
          />
        </div>

        <div className={styles.copy} data-home-reveal>
          <p className={shared.eyebrow}>About Project</p>
          <h2 className={shared.title}>{aboutProject.title}</h2>
          <p className={shared.lead}>{aboutProject.body}</p>
        </div>
      </div>
    </section>
  );
}
