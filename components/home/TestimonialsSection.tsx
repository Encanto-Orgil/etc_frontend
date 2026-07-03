"use client";

import Link from "next/link";
import { towers } from "@/lib/data";
import { destinationLabels, exploreSection } from "@/lib/homeContent";
import shared from "./home.shared.module.css";
import styles from "./TestimonialsSection.module.css";

export default function TestimonialsSection() {
  return (
    <section className={`${shared.section} ${shared.darkSection}`} id="destinations">
      <div className={shared.container}>
        <div className={styles.header} data-home-reveal>
          <p className={shared.eyebrowLight}>{exploreSection.eyebrow}</p>
          <h2 className={shared.titleLight}>{exploreSection.title}</h2>
        </div>

        <div className={styles.panel} data-home-reveal>
          {towers.map((tower) => (
            <Link
              key={tower.slug}
              href={`/${tower.slug}`}
              className={styles.card}
              aria-label={`Explore ${destinationLabels[tower.slug] ?? tower.name}`}
            >
              <img
                src={tower.heroImage}
                alt=""
                className={styles.cardImage}
                loading="lazy"
              />
              <div className={styles.cardScrim} aria-hidden />
              <div className={styles.cardBody}>
                <span className={styles.cardFloors}>{tower.floors}</span>
                <h3 className={styles.cardTitle}>
                  {destinationLabels[tower.slug] ?? tower.name}
                </h3>
                <p className={styles.cardTagline}>{tower.tagline}</p>
                <p className={styles.cardSummary}>{tower.summary}</p>
                <span className={styles.cardCta}>
                  View details <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
