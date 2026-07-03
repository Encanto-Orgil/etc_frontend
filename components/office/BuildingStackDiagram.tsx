"use client";

import type { OfficeFloor } from "@/lib/officeStacking";
import { availableCount, isFullyRented, type OfficeZone } from "@/lib/officeZones";
import styles from "./BuildingStackDiagram.module.css";

type Props = {
  floors: OfficeFloor[];
  selectedFloor: number | null;
  selectedZone: OfficeZone | null;
  availableOnly: boolean;
  onSelectFloor: (floorNumber: number) => void;
  onHoverFloor: (floorNumber: number | null) => void;
};

export default function BuildingStackDiagram({
  floors,
  selectedFloor,
  selectedZone,
  availableOnly,
  onSelectFloor,
  onHoverFloor,
}: Props) {
  const sorted = [...floors].sort((a, b) => b.floor_number - a.floor_number);

  return (
    <div className={styles.wrap}>
      <div className={styles.tower}>
        <div className={styles.crown} aria-hidden />
        <div className={styles.stack}>
          {sorted.map((floor) => {
            const inZone =
              selectedZone &&
              floor.floor_number >= selectedZone.min &&
              floor.floor_number <= selectedZone.max;
            const available = availableCount(floor);
            const fullyRented = isFullyRented(floor);
            const dimmed =
              availableOnly && available === 0
                ? true
                : selectedZone
                  ? !inZone
                  : false;

            return (
              <button
                key={floor.id}
                type="button"
                className={`${styles.band} ${
                  selectedFloor === floor.floor_number ? styles.bandSelected : ""
                } ${inZone && !selectedFloor ? styles.bandInZone : ""} ${
                  fullyRented ? styles.bandFullyRented : available > 0 ? styles.bandHasAvailable : ""
                } ${dimmed ? styles.bandDimmed : ""}`}
                onClick={() => onSelectFloor(floor.floor_number)}
                onMouseEnter={() => onHoverFloor(floor.floor_number)}
                onMouseLeave={() => onHoverFloor(null)}
                aria-label={floor.label || `Floor ${floor.floor_number}`}
                aria-pressed={selectedFloor === floor.floor_number}
              >
                <span className={styles.bandFill} />
                <span className={styles.bandLabel}>{floor.floor_number}</span>
              </button>
            );
          })}
        </div>
        <div className={styles.base} aria-hidden />
      </div>

      <div className={styles.legend}>
        <span><i className={styles.dotGreen} /> Available</span>
        <span><i className={styles.dotRed} /> Fully leased</span>
      </div>

      <div className={styles.hint}>
        {selectedFloor
          ? `Floor ${selectedFloor} selected`
          : "Click a floor to view details"}
      </div>
    </div>
  );
}
