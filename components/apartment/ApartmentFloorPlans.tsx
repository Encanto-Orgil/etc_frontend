"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apartmentFloorPlanTabs } from "@/lib/apartmentContent";
import { useTranslations } from "@/lib/i18n";
import styles from "./ApartmentFloorPlans.module.css";

export default function ApartmentFloorPlans() {
  const copy = useTranslations().residence;
  const [active, setActive] = useState(apartmentFloorPlanTabs[0].id);
  const assetIndex = apartmentFloorPlanTabs.findIndex((p) => p.id === active);
  const plan = apartmentFloorPlanTabs[assetIndex] ?? apartmentFloorPlanTabs[0];
  const label = copy.floorPlanTabs[assetIndex]?.label ?? plan.label;

  return (
    <section className={styles.section} id="floor-plans">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.floorPlansSection.eyebrow}</p>
        <h2 className={styles.title}>{copy.floorPlansSection.title}</h2>

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
          <Image src={plan.image} alt={`${label} floor plan preview`} width={1000} height={640} />
        </figure>

        <div className={styles.actions}>
          <Link href="#contact" className={styles.btn}>
            PDF
          </Link>
          <Link href="#contact" className={styles.btnGhost}>
            Brochure
          </Link>
          <Link href="#contact" className={styles.btnGhost}>
            {copy.contact.title}
          </Link>
        </div>
      </div>
    </section>
  );
}
