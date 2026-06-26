import Link from "next/link";
import { project } from "@/lib/data";
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

        <div className={styles.col}>
          <h4>Төсөл</h4>
          <Link href="/office">Office</Link>
          <Link href="/mall">Mall</Link>
          <Link href="/ballroom">Ballroom</Link>
          <Link href="/apartment">Apartment</Link>
        </div>

        <div className={styles.col}>
          <h4>Компани</h4>
          <Link href="/#about">Танилцуулга</Link>
          <Link href="/#towers">Төслийн хэсгүүд</Link>
          <Link href="/#contact">Холбоо барих</Link>
        </div>

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
