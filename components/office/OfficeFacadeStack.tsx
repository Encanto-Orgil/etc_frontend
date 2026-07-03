"use client";

import { useState } from "react";
import type { OfficeFloor } from "@/lib/officeStacking";
import type { OfficeZone } from "@/lib/officeZones";
import { useOfficeFacadeCalibration } from "@/hooks/useOfficeFacadeCalibration";
import BuildingFacadeCalibrator from "./BuildingFacadeCalibrator";
import BuildingFacadeOverlay from "./BuildingFacadeOverlay";
import styles from "./OfficeFacadeStack.module.css";

type Props = {
  floors: OfficeFloor[];
  selectedFloor: number | null;
  hoverFloor: number | null;
  selectedZone: OfficeZone | null;
  availableOnly: boolean;
  onSelectFloor: (floorNumber: number) => void;
  onHoverFloor: (floorNumber: number | null) => void;
};

export default function OfficeFacadeStack(props: Props) {
  const {
    calibration,
    reset,
    importJson,
    updatePoint,
    nudgeFloor,
    nudgePoint,
    addPoint,
    removePoint,
    setCalibration,
  } = useOfficeFacadeCalibration();
  const [calibrateMode, setCalibrateMode] = useState(false);

  if (calibrateMode) {
    return (
      <BuildingFacadeCalibrator
        calibration={calibration}
        onChange={setCalibration}
        onUpdatePoint={updatePoint}
        onAddPoint={addPoint}
        onRemovePoint={removePoint}
        onNudgeFloor={nudgeFloor}
        onNudgePoint={nudgePoint}
        onReset={reset}
        onImport={importJson}
        onDone={() => setCalibrateMode(false)}
      />
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.calibrateBtn}
          onClick={() => setCalibrateMode(true)}
        >
          Calibrate floors
        </button>
      </div>
      <BuildingFacadeOverlay {...props} calibration={calibration} />
    </div>
  );
}
