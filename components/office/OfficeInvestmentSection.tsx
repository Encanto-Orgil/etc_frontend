import type { IconType } from "react-icons";
import Link from "next/link";
import { LuCalendarClock, LuMapPin, LuTrendingUp } from "react-icons/lu";
import {
  officeInvestment,
  type OfficeInvestmentPillarIcon,
} from "@/lib/officeContent";
import styles from "./OfficeInvestmentSection.module.css";

const iconMap: Record<OfficeInvestmentPillarIcon, IconType> = {
  value: LuTrendingUp,
  location: LuMapPin,
  timing: LuCalendarClock,
};

export default function OfficeInvestmentSection() {
  return (
    <section className={styles.section} id="investment">
      <div className={styles.glow} aria-hidden />

      <div className={styles.inner}>
        <header className={styles.header} data-office-reveal>
          <div className={styles.headerCopy}>
            <p className={styles.eyebrow}>{officeInvestment.eyebrow}</p>
            <h2 className={styles.title}>{officeInvestment.title}</h2>
          </div>
          <p className={styles.lead}>{officeInvestment.lead}</p>
        </header>

        <div className={styles.pillars}>
          {officeInvestment.pillars.map((pillar) => {
            const Icon = iconMap[pillar.icon];

            return (
              <article key={pillar.title} className={styles.pillar} data-office-reveal>
                <span className={styles.iconWrap} aria-hidden>
                  <Icon className={styles.icon} />
                </span>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            );
          })}
        </div>

        <div className={styles.timeline} data-office-reveal>
          {officeInvestment.timeline.map((item) => (
            <div key={item.step} className={styles.timelineStep}>
              <span className={styles.step}>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>

        <div className={styles.footer} data-office-reveal>
          <p className={styles.note}>
            Speak with our sales team for availability, pricing, and a tailored investment overview.
          </p>
          <Link href={officeInvestment.cta.href} className={styles.cta}>
            {officeInvestment.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
