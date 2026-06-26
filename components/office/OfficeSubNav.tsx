"use client";

import { useEffect, useState } from "react";
import styles from "./OfficePage.module.css";

const LINKS = [
  { href: "#overview", label: "Танилцуулга" },
  { href: "#video", label: "Видео" },
  { href: "#stacking-plan", label: "Stacking" },
  { href: "#location", label: "Байршил" },
  { href: "#specs", label: "Онцлог" },
  { href: "#ecosystem", label: "Үйлчилгээ" },
  { href: "#contact", label: "Холбоо" },
];

export default function OfficeSubNav() {
  const [active, setActive] = useState(LINKS[0].href);

  useEffect(() => {
    const ids = LINKS.map((l) => l.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className={styles.subNav} aria-label="Office хуудсын агуулга">
      <div className={styles.subNavInner}>
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={active === link.href ? styles.subNavActive : undefined}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
