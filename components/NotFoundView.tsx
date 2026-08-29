"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n";
import { getContactHref } from "@/lib/site-nav";
import { usePathname } from "next/navigation";
import styles from "./NotFoundView.module.css";

const DESTINATIONS = [
  { href: "/office", labelKey: "office" as const },
  { href: "/mall", labelKey: "mall" as const },
  { href: "/ballroom", labelKey: "ballroom" as const },
  { href: "/residence", labelKey: "residences" as const },
  { href: "/news", labelKey: "news" as const },
];

export default function NotFoundView() {
  const t = useTranslations();
  const copy = t.notFound;
  const pathname = usePathname();
  const contactHref = getContactHref(pathname);

  return (
    <section className={styles.page}>
      <div className={styles.bg} aria-hidden />
      <div className={styles.overlay} aria-hidden />

      <div className={styles.inner}>
        <p className={styles.code}>{copy.code}</p>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.description}>{copy.description}</p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primary}>
            {copy.backHome}
          </Link>
          <Link href={contactHref} className={styles.secondary}>
            {copy.contact}
          </Link>
        </div>

        <div className={styles.explore}>
          <p className={styles.exploreLabel}>{copy.explore}</p>
          <nav className={styles.links} aria-label={copy.explore}>
            {DESTINATIONS.map((item) => (
              <Link key={item.href} href={item.href} className={styles.link}>
                {t.nav[item.labelKey]}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
