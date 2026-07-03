import Link from "next/link";
import Logo from "@/components/Logo";
import { project } from "@/lib/data";
import { HOME_PAGE_NAV, SITE_SECTION_NAV } from "@/lib/site-nav";
import styles from "./Footer.module.css";

const FOOTER_COMPANY = [
  { href: "/#about", label: "About" },
  { href: "/#news", label: "News" },
  { href: "/#contact", label: "Contact" },
  { href: "#", label: "Privacy" },
];

const FOOTER_SOCIAL = [
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://linkedin.com", label: "LinkedIn" },
  { href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <Logo height={44} className={styles.logo} variant="muted" />
          <p className={styles.tag}>{project.tagline}</p>
        </div>

        <nav className={styles.col} aria-label="Project">
          <h4>Project</h4>
          {HOME_PAGE_NAV.filter((item) => item.href.startsWith("/#") || item.href.startsWith("/")).slice(0, 6).map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className={styles.col} aria-label="Company">
          <h4>Company</h4>
          {FOOTER_COMPANY.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.col}>
          <h4>Social</h4>
          {FOOTER_SOCIAL.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
              {item.label}
            </a>
          ))}
          <h4 className={styles.subHeading}>Address</h4>
          <span>{project.contactAddress}</span>
          <a href={`mailto:${project.contactEmail}`}>{project.contactEmail}</a>
          <a href={`tel:${project.contactPhone.replace(/\s/g, "")}`}>{project.contactPhone}</a>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Encanto Trade Center</span>
        <div className={styles.bottomLinks}>
          {SITE_SECTION_NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
