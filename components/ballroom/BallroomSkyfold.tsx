"use client";

import { useState } from "react";
import { ballroomSkyfold } from "@/lib/ballroomBrochure";
import styles from "./BallroomSkyfold.module.css";

type ModeId = (typeof ballroomSkyfold.modes)[number]["id"];

export default function BallroomSkyfold() {
  const [active, setActive] = useState<ModeId>("full");
  const activeMode = ballroomSkyfold.modes.find((m) => m.id === active) ?? ballroomSkyfold.modes[0];

  return (
    <section className={styles.section} id="skyfold">
      <div className={styles.inner}>
        <div className={styles.grid}>
          <figure className={styles.visual} data-ballroom-reveal>
            <img src={ballroomSkyfold.image} alt={ballroomSkyfold.imageAlt} />
            <div className={styles.shade} />
            <div className={styles.partition} data-halls={activeMode.halls} aria-hidden>
              {Array.from({ length: activeMode.halls }, (_, index) => (
                <span key={index} />
              ))}
            </div>
            <figcaption className={styles.caption}>
              <strong>{activeMode.label}</strong>
              <span>{activeMode.hint}</span>
            </figcaption>
          </figure>

          <div className={styles.copy} data-ballroom-reveal>
            <span className={styles.eyebrow}>{ballroomSkyfold.subtitle}</span>
            <h2 className={styles.title}>{ballroomSkyfold.title}</h2>
            <p className={styles.tagline}>{ballroomSkyfold.tagline}</p>

            <div className={styles.modes} role="tablist" aria-label="Skyfold partition modes">
              {ballroomSkyfold.modes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  role="tab"
                  aria-selected={active === mode.id}
                  className={active === mode.id ? styles.modeActive : styles.mode}
                  onClick={() => setActive(mode.id)}
                >
                  <span className={styles.modeBars} data-halls={mode.halls}>
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className={styles.modeLabel}>{mode.label}</span>
                </button>
              ))}
            </div>

            <ul className={styles.points}>
              {ballroomSkyfold.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
