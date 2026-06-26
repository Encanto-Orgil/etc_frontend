"use client";

import { ballroomKeyAdvantages } from "@/lib/ballroomBrochure";
import styles from "./BallroomKeyAdvantages.module.css";

export default function BallroomKeyAdvantages() {
  return (
    <section className={styles.section} id="amenities">
      <div className={styles.inner}>
        <header className={styles.head}>
          <span className={styles.eyebrow}>Key advantages</span>
          <h2 className={styles.title}>Давуу талууд</h2>
          <p className={styles.lead}>
            VIP-ээс terrace хүртэл — зочдын туршлагыг бүрэн дэмжсэн дагалдах орчин.
          </p>
        </header>

        <div className={styles.bento}>
          {ballroomKeyAdvantages.map((item, index) => (
            <article
              key={item.id}
              className={`${styles.card} ${styles[item.size]}`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <img src={item.image} alt={item.title} className={styles.image} loading="lazy" />
              <div className={styles.overlay} />
              <div className={styles.content}>
                <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
