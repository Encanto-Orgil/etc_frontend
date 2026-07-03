"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apartmentFloorPlanTabs } from "@/lib/apartmentContent";
import styles from "./ApartmentFloorPlans.module.css";

export default function ApartmentFloorPlans() {
  const [active, setActive] = useState(apartmentFloorPlanTabs[0].id);
  const plan = apartmentFloorPlanTabs.find((p) => p.id === active) ?? apartmentFloorPlanTabs[0];

  return (
    <section className={styles.section} id="floor-plans">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Floor Plans</p>
        <h2 className={styles.title}>Find Your Layout</h2>

        <div className={styles.tabs} data-apartment-reveal>
          {apartmentFloorPlanTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tab} ${active === tab.id ? styles.tabActive : ""}`}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <figure className={styles.preview} data-apartment-reveal>
          <Image src={plan.image} alt={`${plan.label} floor plan preview`} width={1000} height={640} />
        </figure>

        <div className={styles.actions}>
          <Link href="#contact" className={styles.btn}>
            View PDF
          </Link>
          <Link href="#contact" className={styles.btnGhost}>
            Download Brochure
          </Link>
          <Link href="#contact" className={styles.btnGhost}>
            Request Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
