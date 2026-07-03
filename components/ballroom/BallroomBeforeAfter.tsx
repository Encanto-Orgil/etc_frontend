"use client";

import { useState } from "react";
import { ballroomBeforeAfter } from "@/lib/ballroomContent";
import styles from "./BallroomBeforeAfter.module.css";

export default function BallroomBeforeAfter() {
  const [position, setPosition] = useState(55);

  return (
    <div className={styles.wrap} data-ballroom-reveal>
      <div className={styles.frame}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ballroomBeforeAfter.before.image}
          alt={ballroomBeforeAfter.before.label}
          className={styles.image}
        />
        <div className={styles.afterClip} style={{ width: `${position}%` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ballroomBeforeAfter.after.image}
            alt={ballroomBeforeAfter.after.label}
            className={styles.imageAfter}
          />
        </div>
        <div className={styles.handle} style={{ left: `${position}%` }} aria-hidden />
        <span className={styles.labelBefore}>{ballroomBeforeAfter.before.label}</span>
        <span className={styles.labelAfter}>{ballroomBeforeAfter.after.label}</span>
      </div>
      <input
        type="range"
        min={8}
        max={92}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className={styles.slider}
        aria-label="Compare empty hall and wedding setup"
      />
    </div>
  );
}
