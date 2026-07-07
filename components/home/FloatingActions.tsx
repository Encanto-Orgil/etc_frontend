"use client";

import Link from "next/link";
import type { IconType } from "react-icons";
import { FaCalendarCheck, FaFacebookMessenger } from "react-icons/fa6";
import { LuPhone } from "react-icons/lu";
import { project } from "@/lib/data";
import { useTranslations } from "@/lib/i18n";
import styles from "./FloatingActions.module.css";

type Action = {
  href: string;
  label: string;
  icon: IconType;
  external?: boolean;
};

export default function FloatingActions() {
  const copy = useTranslations().home.floatingActions;

  const actions: Action[] = [
    {
      href: "https://m.me/",
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
    <div className={styles.wrap} aria-label={copy.ariaLabel}>
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
