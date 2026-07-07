"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useInteractiveBuildingCalibration } from "@/hooks/useInteractiveBuildingCalibration";
import { interactiveBuilding } from "@/lib/interactiveBuildingConfig";
import {
  INTERACTIVE_BUILDING_VIEWBOX,
  mergeDestinationsWithCalibration,
  polygonToPoints,
} from "@/lib/interactiveBuildingZones";
import { useTranslations } from "@/lib/i18n";
import shared from "./home.shared.module.css";
import InteractiveBuildingZoneCalibrator from "./InteractiveBuildingZoneCalibrator";
import styles from "./InteractiveBuilding.module.css";

const DESTINATIONS_WITH_DESCRIPTION = new Set([
  "office",
  "mall",
  "ballroom",
  "residence",
]);

export default function InteractiveBuilding() {
  const copy = useTranslations().home.interactiveBuilding;
  const searchParams = useSearchParams();
  const settingsMode = searchParams.get("settings") === "True";
  const startCalibrating =
    settingsMode && searchParams.get("building-calibrate") === "1";
  const {
    calibration,
    ready,
    reset,
    importJson,
    updatePoint,
    nudgeZone,
    nudgePoint,
    addPoint,
    removePoint,
    setCalibration,
  } = useInteractiveBuildingCalibration();
  const [calibrateMode, setCalibrateMode] = useState(startCalibrating);
  const [activeId, setActiveId] = useState<string | null>(null);

  const destinations = useMemo(
    () => (ready ? mergeDestinationsWithCalibration(calibration) : []),
    [calibration, ready],
  );

  const active = destinations.find((item) => item.id === activeId) ?? null;

  if (!ready) {
    return null;
  }

  if (calibrateMode) {
    return (
      <section className={shared.section} id="building">
        <div className={shared.container}>
          <InteractiveBuildingZoneCalibrator
            calibration={calibration}
            onChange={setCalibration}
            onUpdatePoint={updatePoint}
            onAddPoint={addPoint}
            onRemovePoint={removePoint}
            onNudgeZone={nudgeZone}
            onNudgePoint={nudgePoint}
            onReset={reset}
            onImport={importJson}
            onDone={() => setCalibrateMode(false)}
          />
        </div>
      </section>
    );
  }

  return (
    <section className={shared.section} id="building">
      <div className={shared.container}>
        <div className={styles.header} data-home-reveal>
          <p className={shared.eyebrow}>{copy.eyebrow}</p>
          <h2 className={shared.title}>{copy.title}</h2>
          <p className={shared.lead}>{copy.lead}</p>
        </div>

        <div className={styles.stage} data-home-reveal>
          <div className={styles.facade}>
            {settingsMode ? (
              <div className={styles.facadeTopBar}>
                <button
                  type="button"
                  className={styles.calibrateBtn}
                  onClick={() => setCalibrateMode(true)}
                >
                  {copy.calibrateZones}
                </button>
              </div>
            ) : null}

            <img
              src={interactiveBuilding.image}
              alt={interactiveBuilding.imageAlt}
              className={styles.facadeImage}
              draggable={false}
            />
            <div className={styles.facadeOverlay} aria-hidden />

            <svg
              className={styles.zoneOverlay}
              viewBox={`0 0 ${INTERACTIVE_BUILDING_VIEWBOX.width} ${INTERACTIVE_BUILDING_VIEWBOX.height}`}
              preserveAspectRatio="xMidYMid meet"
              aria-label={copy.ariaLabel}
            >
              {destinations.map((destination) => {
                const isActive = activeId === destination.id;

                return (
                  <polygon
                    key={destination.id}
                    points={polygonToPoints(destination.zone)}
                    className={`${styles.zone} ${isActive ? styles.zoneActive : ""}`}
                    style={{ "--zone-color": destination.color } as CSSProperties}
                    onMouseEnter={() => setActiveId(destination.id)}
                    onMouseLeave={() => setActiveId(null)}
                    onFocus={() => setActiveId(destination.id)}
                    onBlur={() => setActiveId(null)}
                    onClick={() =>
                      setActiveId((current) =>
                        current === destination.id ? null : destination.id,
                      )
                    }
                    tabIndex={0}
                    role="button"
                    aria-label={destination.label}
                  />
                );
              })}
            </svg>
          </div>

          <aside className={styles.panel}>
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={active.id}
                  className={styles.panelBody}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span
                    className={styles.panelAccent}
                    style={{ background: active.color }}
                    aria-hidden
                  />
                  <h3>{active.detail.title}</h3>
                  {DESTINATIONS_WITH_DESCRIPTION.has(active.id) ? (
                    <p>{active.detail.description}</p>
                  ) : null}
                  {active.href ? (
                    <Link href={active.href} className={shared.btnDark}>
                      {copy.viewLabel} {active.label}
                    </Link>
                  ) : null}
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  className={styles.panelPlaceholder}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className={styles.panelHint}>{copy.hoverHint}</span>
                  <p>{copy.hoverLead}</p>
                  <ul className={styles.panelList}>
                    {destinations.map((destination) => (
                      <li key={destination.id}>
                        <span style={{ background: destination.color }} />
                        {destination.label}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>
        </div>
      </div>
    </section>
  );
}
