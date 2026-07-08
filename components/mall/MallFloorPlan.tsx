"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { mallFloorPlanTabs } from "@/lib/mallContent";
import { mallLeasingBrochure } from "@/lib/mallBrochure";
import { useTranslations } from "@/lib/i18n";
import styles from "./MallFloorPlan.module.css";

export default function MallFloorPlan() {
  const copy = useTranslations().mall;
  const [active, setActive] = useState(mallFloorPlanTabs[0].id);
  const assetIndex = mallFloorPlanTabs.findIndex((tab) => tab.id === active);
  const planAsset = mallFloorPlanTabs[assetIndex] ?? mallFloorPlanTabs[0];
  const plan = copy.floorPlanTabs[assetIndex] ?? copy.floorPlanTabs[0];

  return (
    <section className={styles.section} id="floor-plan">
      <div className={styles.inner}>
        <header className={styles.header} data-mall-reveal>
          <div>
            <p className={styles.eyebrow}>{copy.floorPlanIntro.eyebrow}</p>
            <h2 className={styles.title}>{copy.floorPlanIntro.title}</h2>
          </div>
          <p className={styles.lead}>{copy.floorPlanIntro.lead}</p>
        </header>

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

        <div className={styles.panel} data-mall-reveal>
          <div className={styles.panelCopy}>
            <span className={styles.floorBadge}>{plan.label}</span>
            <h3>{plan.title}</h3>
            <p>{plan.description}</p>
            <ul className={styles.zoneList}>
              {plan.zones.map((zone) => (
                <li key={zone}>{zone}</li>
              ))}
            </ul>
          </div>

          <figure className={styles.preview}>
            <Image
              src={planAsset.image}
              alt={`${plan.label} floor plan`}
              width={1200}
              height={1700}
              className={styles.planImage}
            />
          </figure>
        </div>

        <div className={styles.actions} data-mall-reveal>
          <a href="/downloads/etc-mall-floorplan.pdf" className={styles.btn} download>
            {copy.floorPlanActions.downloadFloorPlan}
          </a>
          <a href={mallLeasingBrochure.brochurePdf} className={styles.btnGhost} download>
            {copy.floorPlanActions.downloadBrochure}
          </a>
          <Link href="#contact" className={styles.btnGhost}>
            {copy.floorPlanActions.requestLeasing}
          </Link>
        </div>
      </div>
    </section>
  );
}
