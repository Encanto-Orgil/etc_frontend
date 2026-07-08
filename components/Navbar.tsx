"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Drawer } from "antd";
import { MailOutlined, MenuOutlined } from "@ant-design/icons";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import Logo from "@/components/Logo";
import { useTranslations } from "@/lib/i18n";
import {
  GLOBAL_HEADER_NAV,
  getContactHref,
  isLandingPath,
  resolveNavHref,
} from "@/lib/site-nav";
import styles from "./Navbar.module.css";

const NAV_LABEL_KEYS: Record<string, keyof ReturnType<typeof useTranslations>["nav"]> = {
  project: "project",
  office: "office",
  mall: "mall",
  ballroom: "ballroom",
  residence: "residences",
  location: "location",
};

const SCROLL_THRESHOLD = 48;

function isLinkActive(
  resolvedHref: string,
  pathname: string,
  activeSection: string,
) {
  if (resolvedHref.startsWith("/#")) {
    if (pathname !== "/") return false;
    return activeSection === resolvedHref.slice(2);
  }

  if (resolvedHref.includes("#")) {
    const [path, hash] = resolvedHref.split("#");
    if (pathname === path || pathname === `${path}/`) {
      return activeSection === hash;
    }
    return false;
  }

  if (pathname === resolvedHref || pathname.startsWith(`${resolvedHref}/`)) {
    return true;
  }

  return false;
}

export default function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const isLanding = isLandingPath(pathname);
  const isScrollAwayHeader = pathname === "/ballroom";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const links = useMemo(
    () =>
      GLOBAL_HEADER_NAV.map((item) => {
        const href = resolveNavHref(item, pathname);
        const key = NAV_LABEL_KEYS[item.slug];
        const label = key ? t.nav[key] : item.navLabel ?? item.label;
        return {
          href,
          label,
          title: label,
          sectionId: item.sectionId,
        };
      }),
    [pathname, t],
  );

  const contactHref = getContactHref(pathname);
  const ctaLabel = t.nav.contact;
  const CtaIcon = MailOutlined;

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
    if (!isLanding) {
      setActiveSection("");
      return;
    }

    const sectionIds =
      pathname === "/"
        ? links.filter((l) => l.href.startsWith("/#")).map((l) => l.href.slice(2))
        : links
            .filter((l) => l.href.includes("#") && !l.href.startsWith("/#"))
            .map((l) => l.href.split("#")[1])
            .filter(Boolean);

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
  }, [isLanding, links, pathname]);

  return (
    <>
      <header
        className={`${styles.header} ${scrolled ? styles.scrolled : ""} ${
          isLanding ? styles.headerHome : ""
        } ${isLanding && !scrolled ? styles.headerTransparent : ""} ${
          isScrollAwayHeader ? styles.headerScrollAway : ""
        }`}
      >
        <div className={styles.bar}>
          <div className={styles.shine} aria-hidden />
          <div className={`${styles.inner} ${isLanding && scrolled ? styles.innerPill : ""}`}>
            <Logo
              priority
              height={52}
              className={styles.logo}
              onClick={() => setOpen(false)}
            />

            <nav className={styles.nav} aria-label="Main navigation">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  title={l.title}
                  className={`${styles.navLink} ${
                    isLinkActive(l.href, pathname, activeSection) ? styles.active : ""
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className={styles.actions}>
              <LocaleSwitcher />
              <Link href={contactHref} className={styles.cta} aria-label={ctaLabel}>
                <CtaIcon className={styles.ctaIcon} aria-hidden />
                <span>{ctaLabel}</span>
              </Link>
            </div>

            <button
              type="button"
              className={styles.burger}
              aria-label={t.nav.openMenu}
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
        size={300}
        className={styles.drawerRoot}
        styles={{
          header: { display: "none" },
          body: { padding: 0, background: "transparent" },
          mask: { backdropFilter: "blur(6px)" },
        }}
      >
        <div className={styles.drawer}>
          <Logo height={52} onClick={() => setOpen(false)} className={styles.drawerLogo} />
          <nav className={styles.drawerNav} aria-label="Main navigation">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                title={l.title}
                onClick={() => setOpen(false)}
                className={`${styles.drawerLink} ${
                  isLinkActive(l.href, pathname, activeSection) ? styles.active : ""
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <LocaleSwitcher className={styles.drawerLang} />
          <Link
            href={contactHref}
            onClick={() => setOpen(false)}
            className={styles.drawerCta}
            aria-label={ctaLabel}
          >
            <CtaIcon className={styles.ctaIcon} aria-hidden />
            <span>{ctaLabel}</span>
          </Link>
        </div>
      </Drawer>
    </>
  );
}
