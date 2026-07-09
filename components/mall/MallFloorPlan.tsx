"use client";

import { useState } from "react";
import Image from "next/image";
import { mallFloorPlanTabs } from "@/lib/mallContent";
import { useTranslations } from "@/lib/i18n";
import styles from "./MallFloorPlan.module.css";

export default function MallFloorPlan() {
  const copy = useTranslations().mall;
  const [active, setActive] = useState(mallFloorPlanTabs[0].id);
  const assetIndex = mallFloorPlanTabs.findIndex((tab) => tab.id === active);
  const planAsset = mallFloorPlanTabs[assetIndex] ?? mallFloorPlanTabs[0];
  const planLabel = copy.floorPlanTabs[assetIndex]?.label ?? planAsset.label;

  return (
    <section className={styles.section} id="floor-plan">
      <div className={styles.inner}>
        <div className={styles.tabs} data-mall-reveal>
          {mallFloorPlanTabs.map((tab, index) => (
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

        <figure className={styles.preview} data-mall-reveal>
          <Image
            src={planAsset.image}
            alt={`${planLabel} floor plan`}
            width={1200}
            height={1700}
            className={styles.planImage}
          />
        </figure>
      </div>
    </section>
  );
}
