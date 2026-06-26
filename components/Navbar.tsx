"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Logo from "@/components/Logo";
import styles from "./Navbar.module.css";

const links = [
  { href: "/#about", label: "Танилцуулга" },
  { href: "/office", label: "Office" },
  { href: "/mall", label: "Mall" },
  { href: "/ballroom", label: "Ballroom" },
  { href: "/apartment", label: "Apartment" },
];

const SCROLL_THRESHOLD = 48;

const hashLinks = links.filter((l) => l.href.startsWith("/#"));

function isLinkActive(href: string, pathname: string, activeSection: string) {
  if (href.startsWith("/#")) {
    if (pathname !== "/") return false;
    return activeSection === href.slice(2);
  }
  return pathname === href;
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const updateScroll = useCallback(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateScroll();
        ticking = false;
      });
    };

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [updateScroll]);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sectionIds = hashLinks.map((l) => l.href.slice(2));

    const updateActiveSection = () => {
      const marker = window.scrollY + window.innerHeight * 0.35;
      const orderedIds = [...sectionIds].sort((a, b) => {
        const elA = document.getElementById(a);
        const elB = document.getElementById(b);
        return (elA?.offsetTop ?? 0) - (elB?.offsetTop ?? 0);
      });

      let current = "";

      for (const id of orderedIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= marker) current = id;
      }

      setActiveSection(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("hashchange", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [pathname]);

  const contactHref = "/#contact";

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.bar}>
          <div className={styles.shine} aria-hidden />
          <div className={styles.inner}>
            <Logo
              priority
              height={48}
              className={styles.logo}
              onClick={() => setOpen(false)}
            />

            <nav className={styles.nav} aria-label="Үндсэн цэс">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`${styles.navLink} ${
                    isLinkActive(l.href, pathname, activeSection) ? styles.active : ""
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className={styles.actions}>
              <Link href={contactHref} className={styles.cta}>
                Холбоо барих
              </Link>
            </div>

            <button
              type="button"
              className={styles.burger}
              aria-label="Цэс нээх"
              onClick={() => setOpen(true)}
            >
              <MenuOutlined />
            </button>
          </div>
        </div>
      </header>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement="right"
        width={300}
        className={styles.drawerRoot}
        styles={{
          header: { display: "none" },
          body: { padding: 0, background: "transparent" },
          mask: { backdropFilter: "blur(6px)" },
        }}
      >
        <div className={styles.drawer}>
          <Logo height={48} onClick={() => setOpen(false)} className={styles.drawerLogo} />
          <nav className={styles.drawerNav}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`${styles.drawerLink} ${
                  isLinkActive(l.href, pathname, activeSection) ? styles.active : ""
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link
            href={contactHref}
            onClick={() => setOpen(false)}
            className={styles.drawerCta}
          >
            Холбоо барих
          </Link>
        </div>
      </Drawer>
    </>
  );
}
