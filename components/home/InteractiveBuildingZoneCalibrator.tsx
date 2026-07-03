"use client";

import { useCallback, useRef, useState } from "react";
import { buildingDestinations, interactiveBuilding } from "@/lib/interactiveBuildingConfig";
import { downloadInteractiveBuildingCalibration } from "@/lib/interactiveBuildingCalibration";
import {
  getDestinationZone,
  getZoneCentroid,
  INTERACTIVE_BUILDING_VIEWBOX,
  MIN_ZONE_POINTS,
  moveDestinationZone,
  polygonToPoints,
  type InteractiveBuildingCalibration,
} from "@/lib/interactiveBuildingZones";
import styles from "./InteractiveBuildingZoneCalibrator.module.css";

type Props = {
  calibration: InteractiveBuildingCalibration;
  onChange: (next: InteractiveBuildingCalibration) => void;
  onUpdatePoint: (
    destinationId: string,
    pointIndex: number,
    point: { x: number; y: number },
  ) => void;
  onAddPoint: (destinationId: string, point: { x: number; y: number }) => void;
  onRemovePoint: (destinationId: string, pointIndex: number) => void;
  onNudgeZone: (destinationId: string, dx: number, dy: number) => void;
  onNudgePoint: (
    destinationId: string,
    pointIndex: number,
    dx: number,
    dy: number,
  ) => void;
  onReset: () => void;
  onImport: (json: string) => void;
  onDone: () => void;
};

function clientToSvg(svg: SVGSVGElement, clientX: number, clientY: number) {
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const matrix = svg.getScreenCTM();
  if (!matrix) return { x: 0, y: 0 };
  const transformed = point.matrixTransform(matrix.inverse());
  return {
    x: Math.round(transformed.x * 10) / 10,
    y: Math.round(transformed.y * 10) / 10,
  };
}

export default function InteractiveBuildingZoneCalibrator({
  calibration,
  onChange,
  onUpdatePoint,
  onAddPoint,
  onRemovePoint,
  onNudgeZone,
  onNudgePoint,
  onReset,
  onImport,
  onDone,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [activeId, setActiveId] = useState(buildingDestinations[0]?.id ?? "");
  const [activePoint, setActivePoint] = useState(0);
  const [addMode, setAddMode] = useState(false);
  const [dragging, setDragging] = useState<
    | { kind: "point"; destinationId: string; pointIndex: number }
    | {
        kind: "zone";
        destinationId: string;
        start: { x: number; y: number };
        baseCalibration: InteractiveBuildingCalibration;
      }
    | null
  >(null);

  const activeZone = getDestinationZone(activeId, calibration);
  const activeDestination =
    buildingDestinations.find((item) => item.id === activeId) ?? buildingDestinations[0];
  const canRemove = activeZone.length > MIN_ZONE_POINTS;

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (!dragging || !svgRef.current) return;
      const point = clientToSvg(svgRef.current, event.clientX, event.clientY);

      if (dragging.kind === "point") {
        onUpdatePoint(dragging.destinationId, dragging.pointIndex, point);
        return;
      }

      const dx = point.x - dragging.start.x;
      const dy = point.y - dragging.start.y;
      onChange(moveDestinationZone(dragging.baseCalibration, dragging.destinationId, dx, dy));
    },
    [dragging, onChange, onUpdatePoint],
  );

  const endDrag = () => setDragging(null);

  const handleSvgClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!addMode || !svgRef.current || dragging) return;
    if ((event.target as Element).closest("circle")) return;
    const point = clientToSvg(svgRef.current, event.clientX, event.clientY);
    onAddPoint(activeId, point);
    setAddMode(false);
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        onImport(String(reader.result));
      } catch {
        alert("Could not read JSON file.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const edgePath = (zone: typeof activeZone) => {
    if (zone.length < 2) return "";
    const parts = zone.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`);
    return `${parts.join(" ")} Z`;
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <div>
          <strong className={styles.toolbarTitle}>Calibrate building zones</strong>
          <p className={styles.toolbarSub}>
            Draw polygon zones like the stacking plan. Add points, drag handles, and connect them in
            order around each destination.
          </p>
        </div>
        <div className={styles.toolbarActions}>
          <button
            type="button"
            className={addMode ? styles.btnActive : styles.btnGhost}
            onClick={() => setAddMode((value) => !value)}
          >
            {addMode ? "Place point…" : "+ Add point"}
          </button>
          <button type="button" className={styles.btnGhost} onClick={() => fileRef.current?.click()}>
            Import
          </button>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={() => downloadInteractiveBuildingCalibration(calibration)}
          >
            Export
          </button>
          <button type="button" className={styles.btnGhost} onClick={onReset}>
            Reset
          </button>
          <button type="button" className={styles.btnPrimary} onClick={onDone}>
            Done
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={handleImportFile}
        />
      </div>

      <div className={styles.body}>
        <div className={styles.stage}>
          <img
            src={interactiveBuilding.image}
            alt=""
            className={styles.image}
            draggable={false}
          />
          <svg
            ref={svgRef}
            className={`${styles.svg} ${addMode ? styles.svgAddMode : ""}`}
            viewBox={`0 0 ${INTERACTIVE_BUILDING_VIEWBOX.width} ${INTERACTIVE_BUILDING_VIEWBOX.height}`}
            preserveAspectRatio="xMidYMid meet"
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onClick={handleSvgClick}
          >
            {buildingDestinations.map((destination) => {
              const zone = getDestinationZone(destination.id, calibration);
              const isActive = destination.id === activeId;

              return (
                <polygon
                  key={destination.id}
                  points={polygonToPoints(zone)}
                  className={`${styles.zoneShape} ${isActive ? styles.zoneActive : ""}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveId(destination.id);
                  }}
                />
              );
            })}

            {activeZone.length >= 2 ? (
              <path d={edgePath(activeZone)} className={styles.edgePath} />
            ) : null}

            {activeZone.map((point, index) => (
              <g key={`${activeId}-${index}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={activePoint === index ? 9 : 7}
                  className={`${styles.handle} ${activePoint === index ? styles.handleActive : ""}`}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                    setActivePoint(index);
                    setAddMode(false);
                    setDragging({ kind: "point", destinationId: activeId, pointIndex: index });
                    (event.target as Element).setPointerCapture(event.pointerId);
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    setActivePoint(index);
                  }}
                />
                <text x={point.x} y={point.y - 14} className={styles.pointIndex} textAnchor="middle">
                  {index + 1}
                </text>
              </g>
            ))}

            <text
              x={getZoneCentroid(activeZone).x}
              y={getZoneCentroid(activeZone).y}
              className={styles.zoneLabel}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {activeDestination?.label}
            </text>
          </svg>
        </div>

        <aside className={styles.sidebar}>
          <p className={styles.sideLabel}>Destination</p>
          <div className={styles.zoneList}>
            {buildingDestinations.map((destination) => (
              <button
                key={destination.id}
                type="button"
                className={activeId === destination.id ? styles.zoneBtnActive : styles.zoneBtn}
                onClick={() => {
                  setActiveId(destination.id);
                  setActivePoint(0);
                }}
              >
                {destination.label}
              </button>
            ))}
          </div>

          <p className={styles.sideLabel}>
            Point {activePoint + 1} / {activeZone.length}
          </p>
          <div className={styles.pointList}>
            {activeZone.map((point, index) => (
              <button
                key={index}
                type="button"
                className={activePoint === index ? styles.pointRowActive : styles.pointRow}
                onClick={() => setActivePoint(index)}
              >
                <span>{index + 1}</span>
                <code>
                  {Math.round(point.x)}, {Math.round(point.y)}
                </code>
              </button>
            ))}
          </div>

          <div className={styles.pointActions}>
            <button
              type="button"
              className={styles.btnGhost}
              disabled={!canRemove}
              onClick={() => {
                onRemovePoint(activeId, activePoint);
                setActivePoint(Math.max(0, activePoint - 1));
              }}
            >
              Remove point
            </button>
          </div>

          <p className={styles.sideLabel}>Fine-tune</p>
          <div className={styles.nudge}>
            <button type="button" onClick={() => onNudgePoint(activeId, activePoint, 0, -2)}>
              ↑
            </button>
            <div className={styles.nudgeRow}>
              <button type="button" onClick={() => onNudgePoint(activeId, activePoint, -2, 0)}>
                ←
              </button>
              <button
                type="button"
                className={styles.nudgeCenter}
                title="Move entire zone"
                onPointerDown={(event) => {
                  if (!svgRef.current) return;
                  const point = clientToSvg(svgRef.current, event.clientX, event.clientY);
                  setDragging({
                    kind: "zone",
                    destinationId: activeId,
                    start: point,
                    baseCalibration: calibration,
                  });
                  (event.target as Element).setPointerCapture(event.pointerId);
                }}
              >
                ⊕
              </button>
              <button type="button" onClick={() => onNudgePoint(activeId, activePoint, 2, 0)}>
                →
              </button>
            </div>
            <button type="button" onClick={() => onNudgePoint(activeId, activePoint, 0, 2)}>
              ↓
            </button>
          </div>
          <button type="button" className={styles.nudgeAll} onClick={() => onNudgeZone(activeId, 0, -2)}>
            Move zone ↑
          </button>

          <ul className={styles.tips}>
            <li>«+ Add point» → click on the image (near an edge to connect)</li>
            <li>Points 1→2→3… form a closed polygon in order</li>
            <li>⊕ — move all points together</li>
            <li>Export saves zones to JSON — paste into config or keep in localStorage</li>
            <li>At least {MIN_ZONE_POINTS} points must remain</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
