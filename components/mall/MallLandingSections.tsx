"use client";

import Image from "next/image";
import {
  mallIntro,
  mallLayout,
  mallLocation,
  mallTenantComposition,
} from "@/lib/mallBrochure";
import { useTranslations } from "@/lib/i18n";
import styles from "./mall.landing.module.css";

export function MallIntroSection() {
  const copy = useTranslations().mall.intro;

  return (
    <section className={styles.sectionCream} id="intro">
      <div className={styles.inner}>
        <div className={styles.split}>
          <div className={styles.splitImage} data-mall-reveal>
            <Image src={mallIntro.image} alt={copy.imageAlt} width={900} height={700} />
          </div>
          <div data-mall-reveal>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h2 className={styles.title}>{copy.title}</h2>
            <p className={styles.lead}>{copy.body}</p>
            <div className={styles.statsGrid}>
              {copy.stats.map((stat) => (
                <div key={stat.label} className={styles.statItemLight} data-mall-reveal>
                  <span className={styles.statValueLight}>
                    {stat.value}
                    {stat.unit ? <small> {stat.unit}</small> : null}
                  </span>
                  <span className={styles.statLabelLight}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MallTenantSection() {
  const copy = useTranslations().mall.tenantSection;

  return (
    <section className={styles.sectionCream} id="tenants">
      <div className={styles.inner}>
        <div className={styles.split}>
          <div className={styles.splitImage} data-mall-reveal>
            <Image src={mallTenantComposition.image} alt={copy.imageAlt} width={900} height={700} />
          </div>
          <div data-mall-reveal>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h2 className={styles.title}>{copy.title}</h2>
            <p className={styles.lead}>{copy.body}</p>
            <ul className={styles.featureList}>
              {copy.categories.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className={styles.outcomeGrid}>
              {copy.outcomes.map((item) => (
                <span key={item} className={styles.outcomeChip}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MallLayoutSection() {
  const copy = useTranslations().mall.layoutSection;

  return (
    <section className={styles.sectionDark} id="layout">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.title}>{copy.title}</h2>
        <p className={styles.lead}>{copy.body}</p>
        <ul className={styles.featureListLight}>
          {copy.features.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className={styles.diningGrid}>
          {mallLayout.images.map((src) => (
            <Image key={src} src={src} alt={copy.imageAlt} width={400} height={300} data-mall-reveal />
          ))}
        </div>
      </div>
    </section>
  );
}

export function MallLocationSection() {
  const copy = useTranslations().mall.locationSection;

  return (
    <section className={styles.sectionCream} id="location">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.title}>{copy.title}</h2>
        <p className={styles.lead}>{copy.body}</p>
        <div className={styles.split}>
          <div data-mall-reveal>
            <ul className={styles.featureList}>
              {copy.points.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className={styles.landmarkGrid}>
              {copy.landmarks.map((landmark) => (
                <article key={landmark.name} className={styles.landmarkCard}>
                  <strong>{landmark.name}</strong>
                  <p>{landmark.note}</p>
                </article>
              ))}
            </div>
            <p className={styles.address}>{copy.address}</p>
            <div className={styles.visitActions}>
              <a
                href="https://www.google.com/maps?q=Encanto+Town+Ulaanbaatar"
                target="_blank"
                rel="noreferrer"
                className={styles.visitBtn}
              >
                {copy.getDirections}
              </a>
            </div>
          </div>
          <div className={styles.splitImage} data-mall-reveal>
            <Image src={mallLocation.image} alt={copy.imageAlt} width={900} height={700} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function MallFaqSection() {
  const copy = useTranslations().mall;

  return (
    <section className={styles.sectionDark} id="faq">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.faqSection.eyebrow}</p>
        <h2 className={styles.title}>{copy.faqSection.title}</h2>
        <div className={styles.faqList}>
          {copy.faq.map((item) => (
            <details key={item.q} className={styles.faqItem} data-mall-reveal>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
