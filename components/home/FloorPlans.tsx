"use client";

import { useState } from "react";
import { floorPlanTabs } from "@/lib/homeContent";
import shared from "./home.shared.module.css";
import styles from "./FloorPlans.module.css";

export default function FloorPlans() {
  const [active, setActive] = useState(floorPlanTabs[0].id);
  const current = floorPlanTabs.find((t) => t.id === active) ?? floorPlanTabs[0];

  return (
    <section className={`${shared.section} ${styles.section}`} id="floor-plans">
      <div className={shared.container}>
        <div className={styles.header} data-home-reveal>
          <p className={shared.eyebrow}>Floor Plans</p>
          <h2 className={shared.title}>Explore the collection.</h2>
        </div>

        <div className={styles.tabs} data-home-reveal>
          {floorPlanTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={active === tab.id ? styles.tabActive : styles.tab}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.panel} data-home-reveal>
          <img src={current.image} alt={`${current.label} floor plan`} className={styles.image} />
          <div className={styles.actions}>
            <a href={current.pdf} className={shared.btnDark}>
              Download PDF
            </a>
            <a href={current.pdf} className={shared.btnGhost}>
              View Floor
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
