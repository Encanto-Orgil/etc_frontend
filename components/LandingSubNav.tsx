"use client";

import { useEffect, useState } from "react";
import styles from "./LandingSubNav.module.css";

export type LandingSubNavLink = {
  href: `#${string}`;
  label: string;
};

type Props = {
  links: LandingSubNavLink[];
  ariaLabel: string;
  /** Ballroom: main header scrolls away, so subnav sticks closer to the top */
  variant?: "default" | "compact";
};

export default function LandingSubNav({
  links,
  ariaLabel,
  variant = "default",
}: Props) {
  const [active, setActive] = useState(links[0]?.href ?? "");

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActive(`#${visible.target.id}`);
        }
      },
      { rootMargin: "-42% 0px -46% 0px", threshold: [0, 0.2, 0.45, 0.7] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [links]);

  return (
    <nav
      className={`${styles.subNav} ${variant === "compact" ? styles.subNavCompact : ""}`}
      aria-label={ariaLabel}
    >
      <div className={styles.wrap}>
        <div className={styles.pill}>
          {links.map((link) => {
            const isActive = active === link.href;

            return (
              <a
                key={link.href}
                href={link.href}
                className={isActive ? styles.linkActive : styles.link}
                aria-current={isActive ? "true" : undefined}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
