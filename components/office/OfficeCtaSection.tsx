import Link from "next/link";
import { officeCta } from "@/lib/officeContent";
import styles from "./OfficeCtaSection.module.css";

export default function OfficeCtaSection() {
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
            <p className={styles.eyebrow}>{officeCta.eyebrow}</p>
            <h2 className={styles.title}>{officeCta.title}</h2>
            <p className={styles.lead}>{officeCta.body}</p>
          </div>

          <aside className={styles.panel} data-office-reveal>
            <ul className={styles.highlights}>
              {officeCta.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className={styles.actions}>
              <Link href={officeCta.primary.href} className={styles.primary}>
                {officeCta.primary.label}
              </Link>
              <Link href={officeCta.secondary.href} className={styles.secondary}>
                {officeCta.secondary.label}
              </Link>
              <Link href={officeCta.tertiary.href} className={styles.tertiary}>
                {officeCta.tertiary.label}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
