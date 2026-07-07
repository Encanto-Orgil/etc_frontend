"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { useTranslations } from "@/lib/i18n";
import styles from "./Footer.module.css";

const NAV_LINKS = [
  { href: "/", key: "home" as const },
  { href: "/#about", key: "about" as const },
  { href: "/apartment", key: "towerResidence" as const },
  { href: "/mall", key: "towerMall" as const },
  { href: "/#contact", key: "contact" as const },
];

const SOCIAL_LINKS = [
  {
    href: "https://facebook.com",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M14 8.5h2.5l-.6 2.8H14v9h-3.2v-9H9V8.5h1.8V6.8c0-1.9 1.1-3.3 3.2-3.3H17v2.8h-1.6c-.8 0-.9.4-.9 1v1.2Z" />
      </svg>
    ),
  },
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M8.2 3h7.6A5.2 5.2 0 0 1 21 8.2v7.6A5.2 5.2 0 0 1 15.8 21H8.2A5.2 5.2 0 0 1 3 15.8V8.2A5.2 5.2 0 0 1 8.2 3Zm7.6 2.2H8.2A3 3 0 0 0 5.2 8.2v7.6a3 3 0 0 0 3 3h7.6a3 3 0 0 0 3-3V8.2a3 3 0 0 0-3-3ZM12 8.4A3.6 3.6 0 1 1 8.4 12 3.6 3.6 0 0 1 12 8.4Zm0 2.2A1.4 1.4 0 1 0 13.4 12 1.4 1.4 0 0 0 12 10.6ZM16.8 7.3a.9.9 0 1 1-.9-.9.9.9 0 0 1 .9.9Z" />
      </svg>
    ),
  },
  {
    href: "https://x.com",
    label: "X",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="m6.5 5 4.8 6.6L6.3 19h2.2l3.4-4.5 3.1 4.5H18l-5.1-7 4.4-6H15l-3.1 4.2L9.2 5H6.5Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();
  const taglineWords = t.project.tagline.split(/\s+/).filter(Boolean);
  const wordStep = 2.1;
  const wordCycle = taglineWords.length * wordStep;

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.logoWrap}>
          <Logo height={52} className={styles.logo} variant="white" />
        </div>

        <h2 className={styles.headline} aria-label={t.project.tagline}>
          {taglineWords.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className={styles.word}
              style={{
                animationDuration: `${wordCycle}s`,
                animationDelay: `${index * wordStep}s`,
              }}
            >
              {word}
              {index < taglineWords.length - 1 ? "\u00a0" : ""}
            </span>
          ))}
        </h2>
        <p className={styles.subtitle}>{t.footer.subtitle}</p>

        <nav className={styles.nav} aria-label={t.footer.project}>
          {NAV_LINKS.map((item) => (
            <Link key={item.href} href={item.href}>
              {t.footer[item.key]}
            </Link>
          ))}
        </nav>

        <div className={styles.social} aria-label={t.footer.social}>
          {SOCIAL_LINKS.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
              {item.icon}
            </a>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.bottom}>
        <p className={styles.copyright}>
          © {year} {t.footer.copyright}. {t.footer.rightsReserved}
        </p>
      </div>
    </footer>
  );
}
