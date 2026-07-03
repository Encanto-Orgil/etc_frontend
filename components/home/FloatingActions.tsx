"use client";

import Link from "next/link";
import type { IconType } from "react-icons";
import { FaCalendarCheck, FaFacebookMessenger } from "react-icons/fa6";
import { LuPhone } from "react-icons/lu";
import { project } from "@/lib/data";
import styles from "./FloatingActions.module.css";

type Action = {
  href: string;
  label: string;
  icon: IconType;
  external?: boolean;
};

const actions: Action[] = [
  {
    href: "https://m.me/",
    label: "Messenger",
    icon: FaFacebookMessenger,
    external: true,
  },
  {
    href: `tel:${project.contactPhone.replace(/\s/g, "")}`,
    label: "Phone",
    icon: LuPhone,
  },
  {
    href: "/#contact",
    label: "Book Visit",
    icon: FaCalendarCheck,
  },
];

export default function FloatingActions() {
  return (
    <div className={styles.wrap} aria-label="Quick contact">
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
