"use client";

import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import type { IconType } from "react-icons";
import { FaCalendarCheck, FaFacebookMessenger } from "react-icons/fa6";
import { LuPhone } from "react-icons/lu";
import { project } from "@/lib/data";
import { useTranslations } from "@/lib/i18n";
import styles from "./FloatingActions.module.css";

const MOBILE_MQ = "(max-width: 768px)";
/** 2nd section anchor — FAB shows once BrandStatement enters view */
const REVEAL_SECTION_ID = "brand";

type Action = {
  href: string;
  label: string;
  icon: IconType;
  external?: boolean;
};

function useMobileFabVisible() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.matchMedia(MOBILE_MQ).matches;
  });

  useLayoutEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    let raf = 0;

    const update = () => {
      if (!mq.matches) {
        setVisible(true);
        return;
      }

      const section = document.getElementById(REVEAL_SECTION_ID);
      if (!section) {
        setVisible(false);
        return;
      }

      const top = section.getBoundingClientRect().top;
      setVisible(top <= window.innerHeight * 0.92);
    };

    const waitForSection = () => {
      if (!document.getElementById(REVEAL_SECTION_ID)) {
        raf = requestAnimationFrame(waitForSection);
        return;
      }
      update();
    };

    waitForSection();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    mq.addEventListener("change", update);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      mq.removeEventListener("change", update);
    };
  }, []);

  return visible;
}

export default function FloatingActions() {
  const copy = useTranslations().home.floatingActions;
  const visible = useMobileFabVisible();

  const actions: Action[] = [
    {
      href: project.messengerUrl,
      label: copy.messenger,
      icon: FaFacebookMessenger,
      external: true,
    },
    {
      href: `tel:${project.contactPhone.replace(/\s/g, "")}`,
      label: copy.phone,
      icon: LuPhone,
    },
    {
      href: "/#contact",
      label: copy.bookVisit,
      icon: FaCalendarCheck,
    },
  ];

  return (
    <div
      className={`${styles.wrap} ${visible ? styles.wrapVisible : styles.wrapHidden}`}
      aria-label={copy.ariaLabel}
      aria-hidden={!visible}
    >
      {actions.map((action) => {
        const Icon = action.icon;
        const className = styles.btn;

        const content = (
          <>
            <Icon className={styles.icon} aria-hidden />
            <span className={styles.label}>{action.label}</span>
          </>
        );

        return action.external ? (
          <a
            key={action.label}
            href={action.href}
            className={className}
            target="_blank"
            rel="noreferrer"
            aria-label={action.label}
            title={action.label}
          >
            {content}
          </a>
        ) : (
          <Link key={action.label} href={action.href} className={className} title={action.label}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}
