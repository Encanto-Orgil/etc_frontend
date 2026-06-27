import Link from "next/link";
import { project } from "@/lib/data";
import { HOME_ANCHOR_NAV, SITE_SECTION_NAV } from "@/lib/site-nav";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>E</span>
            <span>Encanto</span>
          </div>
          <p className={styles.tag}>{project.tagline}</p>
        </div>

        <nav className={styles.col} aria-label="Төслийн хэсгүүд">
          <h4>Төсөл</h4>
          {SITE_SECTION_NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className={styles.col} aria-label="Компани">
          <h4>Компани</h4>
          {HOME_ANCHOR_NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/#towers">Төслийн хэсгүүд</Link>
        </nav>

        <div className={styles.col}>
          <h4>Холбоо барих</h4>
          <a href={`tel:${project.contactPhone.replace(/\s/g, "")}`}>
            {project.contactPhone}
          </a>
          <a href={`mailto:${project.contactEmail}`}>{project.contactEmail}</a>
          <span>{project.contactAddress}</span>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Encanto Trade Center</span>
        <span>Баянзүрх дүүрэг · Улаанбаатар</span>
      </div>
    </footer>
  );
}
