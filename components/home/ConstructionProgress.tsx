"use client";

import { useTranslations } from "@/lib/i18n";
import shared from "./home.shared.module.css";
import styles from "./ConstructionProgress.module.css";

export default function ConstructionProgress() {
  const construction = useTranslations().home.construction;

  return (
    <section className={shared.section} id="progress">
      <div className={shared.container}>
        <div className={styles.header} data-home-reveal>
          <p className={shared.eyebrow}>{construction.eyebrow}</p>
          <h2 className={shared.title}>{construction.title}</h2>
          <p className={styles.lead}>{construction.lead}</p>
        </div>

        <ol className={styles.timeline}>
          {construction.timeline.map((item, index) => {
            const isLast = index === construction.timeline.length - 1;

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
