"use client";

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import { LuDownload, LuPhone } from "react-icons/lu";
import { HiCalendarDays } from "react-icons/hi2";
import { project } from "@/lib/data";
import styles from "./OfficeStickySidebar.module.css";

const items = [
  { href: "#stacking-plan", label: "Available Units", icon: HiCalendarDays },
  { href: "#", label: "Download Brochure", icon: LuDownload },
  { href: "#contact", label: "Book Meeting", icon: HiCalendarDays },
  {
    href: "https://wa.me/97699191522",
    label: "WhatsApp",
    icon: FaWhatsapp,
    external: true,
  },
  {
    href: `tel:${project.contactPhone.replace(/\s/g, "")}`,
    label: "Call Now",
    icon: LuPhone,
  },
];

export default function OfficeStickySidebar() {
  return (
    <aside className={styles.sidebar} aria-label="Office quick actions">
      {items.map((item) => {
        const Icon = item.icon;
        const className = styles.btn;

        if (item.external) {
          return (
            <a
              key={item.label}
              href={item.href}
              className={className}
              target="_blank"
              rel="noreferrer"
              title={item.label}
            >
              <Icon className={styles.icon} aria-hidden />
              <span>{item.label}</span>
            </a>
          );
        }

        return (
          <Link key={item.label} href={item.href} className={className} title={item.label}>
            <Icon className={styles.icon} aria-hidden />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}
