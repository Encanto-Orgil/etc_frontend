import { constructionTimeline } from "@/lib/homeContent";
import shared from "./home.shared.module.css";
import styles from "./ConstructionProgress.module.css";

export default function ConstructionProgress() {
  return (
    <section className={shared.section} id="progress">
      <div className={shared.container}>
        <div className={styles.header} data-home-reveal>
          <p className={shared.eyebrow}>Construction Progress</p>
          <h2 className={shared.title}>Operational from autumn 2026.</h2>
          <p className={styles.lead}>
            Office, mall, ballroom, and apartment collections are on track to open from fall 2026.
          </p>
        </div>

        <ol className={styles.timeline}>
          {constructionTimeline.map((item, index) => {
            const isLast = index === constructionTimeline.length - 1;

            return (
              <li key={item.tower} className={styles.item} data-home-reveal>
                <div className={styles.rail}>
                  <div className={styles.marker}>
                    <span>{item.period}</span>
                  </div>
                  {!isLast ? (
                    <>
                      <span className={styles.line} aria-hidden />
                      <span className={styles.arrow} aria-hidden>
                        ↓
                      </span>
                    </>
                  ) : null}
                </div>

                <div className={styles.content}>
                  <h3>{item.tower}</h3>
                  <p>{item.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
