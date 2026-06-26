"use client";

import { useEffect, useState } from "react";
import styles from "./BallroomSubNav.module.css";

const links = [
  { href: "#overview", label: "Танилцуулга" },
  { href: "#capacity", label: "Багтаамж" },
  { href: "#skyfold", label: "Skyfold" },
  { href: "#amenities", label: "Давуу тал" },
  { href: "#floor-plan", label: "Төлөвлөлт" },
  { href: "#availability", label: "Захиалга" },
  { href: "#gallery", label: "Render" },
  { href: "#contact", label: "Холбоо барих" },
];

export default function BallroomSubNav() {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const ids = links.map((link) => link.href.slice(1));
    const onScroll = () => {
      const marker = window.scrollY + window.innerHeight * 0.28;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= marker) current = id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={styles.subNav} aria-label="Ballroom хэсгүүд">
      <div className={styles.inner}>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={active === link.href.slice(1) ? styles.active : undefined}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
