"use client";

import type { OfficeFloor } from "@/lib/officeStacking";
import { availableCount, isFullyRented } from "@/lib/officeZones";
import { isSoldOutFloor } from "@/lib/officeStacking";
import styles from "./BuildingStackDiagram.module.css";

type Props = {
  floors: OfficeFloor[];
  selectedFloor: number | null;
  availableOnly: boolean;
  onSelectFloor: (floorNumber: number) => void;
  onHoverFloor: (floorNumber: number | null) => void;
};

export default function BuildingStackDiagram({
  floors,
  selectedFloor,
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
            const available = availableCount(floor);
            const fullyRented = isFullyRented(floor);
            const soldOut = isSoldOutFloor(floor);
            const dimmed = availableOnly && available === 0;

            return (
              <button
                key={floor.id}
                type="button"
                className={`${styles.band} ${
                  selectedFloor === floor.floor_number ? styles.bandSelected : ""
                } ${
                  fullyRented || soldOut
                    ? styles.bandFullyRented
                    : available > 0
                      ? styles.bandHasAvailable
                      : ""
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
