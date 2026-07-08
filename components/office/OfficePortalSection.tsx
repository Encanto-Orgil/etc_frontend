"use client";

import type { IconType } from "react-icons";
import Link from "next/link";
import { LuFileText, LuLayoutDashboard, LuMessageSquare, LuReceipt } from "react-icons/lu";
import { officePortalSection, type OfficePortalFeatureIcon } from "@/lib/officeContent";
import { useTranslations } from "@/lib/i18n";
import styles from "./OfficePortalSection.module.css";

const iconMap: Record<OfficePortalFeatureIcon, IconType> = {
  overview: LuLayoutDashboard,
  invoices: LuReceipt,
  support: LuMessageSquare,
  status: LuFileText,
};

export default function OfficePortalSection() {
  const copy = useTranslations().office;

  return (
    <section className={styles.section} id="tenant-portal">
      <div className={styles.inner}>
        <div className={styles.layout}>
          <div className={styles.copy} data-office-reveal>
            <p className={styles.eyebrow}>{copy.portalSection.eyebrow}</p>
            <h2 className={styles.title}>{copy.portalSection.title}</h2>
            <p className={styles.lead}>{copy.portalSection.lead}</p>
            <p className={styles.note}>{copy.portalSection.note}</p>
            <Link href={officePortalSection.cta.href} className={styles.cta}>
              {copy.portalSection.cta}
            </Link>
          </div>

          <div className={styles.panel} data-office-reveal>
            {copy.portalFeatures.map((feature) => {
              const Icon = iconMap[feature.icon];

              return (
                <article key={feature.title} className={styles.feature}>
                  <span className={styles.iconWrap} aria-hidden>
                    <Icon className={styles.icon} />
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
