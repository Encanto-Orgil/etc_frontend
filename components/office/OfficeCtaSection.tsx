"use client";

import Link from "next/link";
import { officeCta } from "@/lib/officeContent";
import { useTranslations } from "@/lib/i18n";
import styles from "./OfficeCtaSection.module.css";

export default function OfficeCtaSection() {
  const copy = useTranslations().office.cta;

  return (
    <section className={styles.section} id="cta">
      <div
        className={styles.bg}
        style={{ backgroundImage: `url(${officeCta.image})` }}
        data-office-parallax
        aria-hidden
      />
      <div className={styles.overlay} aria-hidden />
      <div className={styles.glow} aria-hidden />

      <div className={styles.inner}>
        <div className={styles.layout}>
          <div className={styles.copy} data-office-reveal>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h2 className={styles.title}>{copy.title}</h2>
            <p className={styles.lead}>{copy.body}</p>
          </div>

          <aside className={styles.panel} data-office-reveal>
            <ul className={styles.highlights}>
              {copy.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className={styles.actions}>
              <Link href={officeCta.primary.href} className={styles.primary}>
                {copy.primary}
              </Link>
              <Link href={officeCta.secondary.href} className={styles.secondary}>
                {copy.secondary}
              </Link>
              <Link href={officeCta.tertiary.href} className={styles.tertiary}>
                {copy.tertiary}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
