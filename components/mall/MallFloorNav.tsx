"use client";

import { useState } from "react";
import { mallFloors } from "@/lib/mallContent";
import styles from "./MallFloorNav.module.css";

export default function MallFloorNav() {
  const [active, setActive] = useState(mallFloors[0].id);
  const floor = mallFloors.find((f) => f.id === active) ?? mallFloors[0];

  return (
    <section className={styles.section} id="floors">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Floor Access Overview</p>
        <h2 className={styles.title}>Navigate Every Level</h2>
        <p className={styles.lead}>
          Click a floor to explore retail categories and tenant mix at each level.
        </p>

        <div className={styles.tabs} data-mall-reveal>
          {mallFloors.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`${styles.tab} ${active === f.id ? styles.tabActive : ""}`}
              onClick={() => setActive(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className={styles.panel} data-mall-reveal>
          <div className={styles.panelHead}>
            <span className={styles.floorBadge}>{floor.label}</span>
            <h3>{floor.title}</h3>
          </div>
          <ul className={styles.tenantList}>
            {floor.tenants.map((tenant) => (
              <li key={tenant}>{tenant}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
