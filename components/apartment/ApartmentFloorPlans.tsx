"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apartmentFloorPlanTabs } from "@/lib/apartmentContent";
import { useTranslations } from "@/lib/i18n";
import styles from "./ApartmentFloorPlans.module.css";

export default function ApartmentFloorPlans() {
  const copy = useTranslations().residence;
  const section = copy.floorPlansSection;
  const [active, setActive] = useState(apartmentFloorPlanTabs[0].id);
  const assetIndex = apartmentFloorPlanTabs.findIndex((plan) => plan.id === active);
  const plan = apartmentFloorPlanTabs[assetIndex] ?? apartmentFloorPlanTabs[0];
  const label = copy.floorPlanTabs[assetIndex]?.label ?? plan.label;

  return (
    <section className={styles.section} id="floor-plans">
      <div className={styles.inner}>
        <header className={styles.header} data-apartment-reveal>
          <div>
            <h2 className={styles.title}>{section.title}</h2>
            <p className={styles.lead}>{section.note}</p>
          </div>
          <span className={styles.completion}>{section.completion}</span>
        </header>

        <div className={styles.tabs} data-apartment-reveal>
          {apartmentFloorPlanTabs.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tab} ${active === tab.id ? styles.tabActive : ""}`}
              onClick={() => setActive(tab.id)}
            >
              {copy.floorPlanTabs[index]?.label ?? tab.label}
            </button>
          ))}
        </div>

        <figure className={styles.preview} data-apartment-reveal>
          <Image
            src={plan.image}
            alt={`${label} — ${plan.orientations.join(", ")}`}
            width={1200}
            height={800}
            priority={active === apartmentFloorPlanTabs[0].id}
          />
        </figure>

        <div className={styles.meta} data-apartment-reveal>
          <span className={styles.metaLabel}>{copy.typesSection.orientationLabel}</span>
          <ul className={styles.orientationList}>
            {plan.orientations.map((orientation) => (
              <li key={orientation}>{orientation}</li>
            ))}
          </ul>
        </div>

        <div className={styles.actions}>
          <Link href="#contact" className={styles.btn}>
            {copy.contact.title}
          </Link>
        </div>
      </div>
    </section>
  );
}
