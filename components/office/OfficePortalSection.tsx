import type { IconType } from "react-icons";
import Link from "next/link";
import { LuFileText, LuLayoutDashboard, LuMessageSquare, LuReceipt } from "react-icons/lu";
import {
  officePortalFeatures,
  officePortalSection,
  type OfficePortalFeatureIcon,
} from "@/lib/officeContent";
import styles from "./OfficePortalSection.module.css";

const iconMap: Record<OfficePortalFeatureIcon, IconType> = {
  overview: LuLayoutDashboard,
  invoices: LuReceipt,
  support: LuMessageSquare,
  status: LuFileText,
};

export default function OfficePortalSection() {
  return (
    <section className={styles.section} id="tenant-portal">
      <div className={styles.inner}>
        <div className={styles.layout}>
          <div className={styles.copy} data-office-reveal>
            <p className={styles.eyebrow}>{officePortalSection.eyebrow}</p>
            <h2 className={styles.title}>{officePortalSection.title}</h2>
            <p className={styles.lead}>{officePortalSection.lead}</p>
            <p className={styles.note}>{officePortalSection.note}</p>
            <Link href={officePortalSection.cta.href} className={styles.cta}>
              {officePortalSection.cta.label}
            </Link>
          </div>

          <div className={styles.panel} data-office-reveal>
            {officePortalFeatures.map((feature) => {
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
