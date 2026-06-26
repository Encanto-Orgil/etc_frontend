"use client";

import type { OfficeFloor } from "@/lib/officeStacking";
import {
  FACADE_VIEWBOX,
  getFacadeFloorLabel,
  getFacadeFloorPoints,
  OFFICE_FACADE_IMAGE,
  type FacadeCalibration,
} from "@/lib/officeFacadeFloors";
import { availableCount, isFullyRented, type OfficeZone } from "@/lib/officeZones";
import styles from "./BuildingFacadeOverlay.module.css";

type Props = {
  floors: OfficeFloor[];
  selectedFloor: number | null;
  hoverFloor: number | null;
  selectedZone: OfficeZone | null;
  availableOnly: boolean;
  calibration?: FacadeCalibration | null;
  onSelectFloor: (floorNumber: number) => void;
  onHoverFloor: (floorNumber: number | null) => void;
};

function floorState(
  floor: OfficeFloor,
  selectedFloor: number | null,
  selectedZone: OfficeZone | null,
  availableOnly: boolean
) {
  const inZone =
    selectedZone &&
    floor.floor_number >= selectedZone.min &&
    floor.floor_number <= selectedZone.max;
  const available = availableCount(floor);
  const fullyRented = isFullyRented(floor);
  const dimmed =
    availableOnly && available === 0 ? true : selectedZone ? !inZone : false;

  return {
    inZone: !!inZone,
    available,
    fullyRented,
    dimmed,
    selected: selectedFloor === floor.floor_number,
  };
}

export default function BuildingFacadeOverlay({
  floors,
  selectedFloor,
  hoverFloor,
  selectedZone,
  availableOnly,
  calibration,
  onSelectFloor,
  onHoverFloor,
}: Props) {
  const sorted = [...floors].sort((a, b) => b.floor_number - a.floor_number);
  const focusFloor = hoverFloor ?? selectedFloor;
  const focusData = focusFloor
    ? floors.find((f) => f.floor_number === focusFloor)
    : null;

  return (
    <div className={styles.wrap}>
      <div className={styles.stage}>
        <img
          src={OFFICE_FACADE_IMAGE}
          alt="Encanto Trade Center — Office Tower"
          className={styles.image}
          draggable={false}
        />

        <svg
          className={styles.overlay}
          viewBox={`0 0 ${FACADE_VIEWBOX.width} ${FACADE_VIEWBOX.height}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden={false}
          role="img"
          aria-label="Office Tower давхарын интерактив зураг"
        >
          {sorted.map((floor) => {
            const state = floorState(floor, selectedFloor, selectedZone, availableOnly);
            const isHovered = hoverFloor === floor.floor_number;
            const points = getFacadeFloorPoints(floor.floor_number, calibration);
            const label = getFacadeFloorLabel(floor.floor_number, calibration);

            return (
              <g key={floor.id}>
                <polygon
                  points={points}
                  className={[
                    styles.floor,
                    state.fullyRented ? styles.rented : state.available > 0 ? styles.available : "",
                    state.inZone && !state.selected ? styles.inZone : "",
                    state.selected ? styles.selected : "",
                    isHovered && !state.selected ? styles.hovered : "",
                    state.dimmed ? styles.dimmed : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => onSelectFloor(floor.floor_number)}
                  onMouseEnter={() => onHoverFloor(floor.floor_number)}
                  onMouseLeave={() => onHoverFloor(null)}
                />
                {(state.selected || hoverFloor === floor.floor_number) && (
                  <text
                    x={label.x}
                    y={label.y}
                    className={styles.floorLabel}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {floor.floor_number}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {focusData ? (
          <div className={styles.callout} aria-live="polite">
            <strong>{focusData.floor_number} давхар</strong>
            <span>{availableCount(focusData)}/4 боломжит</span>
          </div>
        ) : null}
      </div>

      <div className={styles.legend}>
        <span>
          <i className={styles.dotGreen} /> Боломжит
        </span>
        <span>
          <i className={styles.dotRed} /> Бүрэн түрээслэгдсэн
        </span>
        <span>
          <i className={styles.dotBlue} /> Сонгогдсон бүс
        </span>
      </div>

      <p className={styles.hint}>
        {selectedFloor
          ? `${selectedFloor} давхар сонгогдсон — баруун талаас оффис хараарай`
          : "Зүүн оффис барилга дээр давхар дарж сонгоно уу"}
      </p>
    </div>
  );
}
