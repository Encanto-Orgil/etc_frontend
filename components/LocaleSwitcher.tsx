"use client";

import { useLocale } from "@/lib/i18n";
import styles from "./Navbar.module.css";

export default function LocaleSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div className={`${styles.lang} ${className ?? ""}`} role="group" aria-label="Language">
      <button
        type="button"
        className={locale === "en" ? styles.langActive : styles.langBtn}
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <span className={styles.langSep} aria-hidden>
        /
      </span>
      <button
        type="button"
        className={locale === "mn" ? styles.langActive : styles.langBtn}
        onClick={() => setLocale("mn")}
        aria-pressed={locale === "mn"}
      >
        MN
      </button>
    </div>
  );
}
