"use client";

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import { LuDownload, LuPhone } from "react-icons/lu";
import { HiCalendarDays } from "react-icons/hi2";
import { project } from "@/lib/data";
import { officeDownloads } from "@/lib/officeContent";
import styles from "./OfficeStickySidebar.module.css";

type SidebarItem = {
  href: string;
  label: string;
  icon: typeof HiCalendarDays;
  external?: boolean;
  download?: string;
};

const items: SidebarItem[] = [
  { href: "#stacking-plan", label: "Available Units", icon: HiCalendarDays },
  {
    href: officeDownloads.brochure,
    label: "Download Brochure",
    icon: LuDownload,
    download: "Encanto-Office-Brochure.pdf",
  },
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

        if (item.download) {
          return (
            <a
              key={item.label}
              href={item.href}
              className={className}
              download={item.download}
              title={item.label}
            >
              <Icon className={styles.icon} aria-hidden />
              <span>{item.label}</span>
            </a>
          );
        }

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
