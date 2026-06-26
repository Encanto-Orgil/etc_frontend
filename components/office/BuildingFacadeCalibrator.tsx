"use client";

import { useCallback, useRef, useState } from "react";
import {
  FACADE_VIEWBOX,
  FACADE_FLOOR_COUNT,
  getFacadeFloorPolygon,
  getFloorLabelFromPolygon,
  MIN_POLYGON_POINTS,
  moveFloorPolygon,
  OFFICE_FACADE_IMAGE,
  polygonToPoints,
  type FacadeCalibration,
} from "@/lib/officeFacadeFloors";
import { downloadFacadeCalibration } from "@/lib/officeFacadeCalibration";
import styles from "./BuildingFacadeCalibrator.module.css";

type Props = {
  calibration: FacadeCalibration;
  onChange: (next: FacadeCalibration) => void;
  onUpdatePoint: (floor: number, pointIndex: number, point: { x: number; y: number }) => void;
  onAddPoint: (floor: number, point: { x: number; y: number }) => void;
  onRemovePoint: (floor: number, pointIndex: number) => void;
  onNudgeFloor: (floor: number, dx: number, dy: number) => void;
  onNudgePoint: (floor: number, pointIndex: number, dx: number, dy: number) => void;
  onReset: () => void;
  onImport: (json: string) => void;
  onDone: () => void;
};

function clientToSvg(svg: SVGSVGElement, clientX: number, clientY: number) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const matrix = svg.getScreenCTM();
  if (!matrix) return { x: 0, y: 0 };
  const transformed = pt.matrixTransform(matrix.inverse());
  return {
    x: Math.round(transformed.x * 10) / 10,
    y: Math.round(transformed.y * 10) / 10,
  };
}

export default function BuildingFacadeCalibrator({
  calibration,
  onChange,
  onUpdatePoint,
  onAddPoint,
  onRemovePoint,
  onNudgeFloor,
  onNudgePoint,
  onReset,
  onImport,
  onDone,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [activeFloor, setActiveFloor] = useState(FACADE_FLOOR_COUNT);
  const [activePoint, setActivePoint] = useState(0);
  const [addMode, setAddMode] = useState(false);
  const [dragging, setDragging] = useState<
    | { kind: "point"; floor: number; pointIndex: number }
    | {
        kind: "floor";
        floor: number;
        start: { x: number; y: number };
        baseCalibration: FacadeCalibration;
      }
    | null
  >(null);

  const activePoly = getFacadeFloorPolygon(activeFloor, calibration);
  const canRemove = activePoly.length > MIN_POLYGON_POINTS;

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!dragging || !svgRef.current) return;
      const pt = clientToSvg(svgRef.current, e.clientX, e.clientY);

      if (dragging.kind === "point") {
        onUpdatePoint(dragging.floor, dragging.pointIndex, pt);
        return;
      }

      const dx = pt.x - dragging.start.x;
      const dy = pt.y - dragging.start.y;
      onChange(moveFloorPolygon(dragging.baseCalibration, dragging.floor, dx, dy));
    },
    [dragging, onChange, onUpdatePoint]
  );

  const endDrag = () => setDragging(null);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!addMode || !svgRef.current || dragging) return;
    if ((e.target as Element).closest("circle")) return;
    const pt = clientToSvg(svgRef.current, e.clientX, e.clientY);
    onAddPoint(activeFloor, pt);
    setAddMode(false);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        onImport(String(reader.result));
      } catch {
        alert("JSON файлыг уншиж чадсангүй.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const edgePath = (poly: typeof activePoly) => {
    if (poly.length < 2) return "";
    const parts = poly.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`);
    return `${parts.join(" ")} Z`;
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <div>
          <strong className={styles.toolbarTitle}>Давхар тохируулах</strong>
          <p className={styles.toolbarSub}>
            Олон цэг үүсгэж холбоно. Ирмэг дээр дарвал шинэ цэг нэмэгдэнэ — цэгүүд дарааллаар
            холбогдоно.
          </p>
        </div>
        <div className={styles.toolbarActions}>
          <button
            type="button"
            className={addMode ? styles.btnActive : styles.btnGhost}
            onClick={() => setAddMode((v) => !v)}
          >
            {addMode ? "Цэг тавих…" : "+ Цэг нэмэх"}
          </button>
          <button type="button" className={styles.btnGhost} onClick={() => fileRef.current?.click()}>
            Import
          </button>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={() => downloadFacadeCalibration(calibration)}
          >
            Export
          </button>
          <button type="button" className={styles.btnGhost} onClick={onReset}>
            Reset
          </button>
          <button type="button" className={styles.btnPrimary} onClick={onDone}>
            Дуусгах
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
          <img src={OFFICE_FACADE_IMAGE} alt="" className={styles.image} draggable={false} />
          <svg
            ref={svgRef}
            className={`${styles.svg} ${addMode ? styles.svgAddMode : ""}`}
            viewBox={`0 0 ${FACADE_VIEWBOX.width} ${FACADE_VIEWBOX.height}`}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onClick={handleSvgClick}
          >
            {Array.from({ length: FACADE_FLOOR_COUNT }, (_, i) => FACADE_FLOOR_COUNT - i).map(
              (floorNum) => {
                const poly = getFacadeFloorPolygon(floorNum, calibration);
                const isActive = floorNum === activeFloor;
                return (
                  <polygon
                    key={floorNum}
                    points={polygonToPoints(poly)}
                    className={`${styles.floorShape} ${isActive ? styles.floorActive : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveFloor(floorNum);
                    }}
                  />
                );
              }
            )}

            {activePoly.length >= 2 ? (
              <path d={edgePath(activePoly)} className={styles.edgePath} />
            ) : null}

            {activePoly.map((pt, i) => (
              <g key={`${activeFloor}-${i}`}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={activePoint === i ? 9 : 7}
                  className={`${styles.handle} ${activePoint === i ? styles.handleActive : ""}`}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setActivePoint(i);
                    setAddMode(false);
                    setDragging({ kind: "point", floor: activeFloor, pointIndex: i });
                    (e.target as Element).setPointerCapture(e.pointerId);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePoint(i);
                  }}
                />
                <text
                  x={pt.x}
                  y={pt.y - 14}
                  className={styles.pointIndex}
                  textAnchor="middle"
                >
                  {i + 1}
                </text>
              </g>
            ))}

            <text
              x={getFloorLabelFromPolygon(activePoly).x}
              y={getFloorLabelFromPolygon(activePoly).y}
              className={styles.floorNum}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {activeFloor}
            </text>
          </svg>
        </div>

        <aside className={styles.sidebar}>
          <p className={styles.sideLabel}>Давхар</p>
          <div className={styles.floorGrid}>
            {Array.from({ length: FACADE_FLOOR_COUNT }, (_, i) => FACADE_FLOOR_COUNT - i).map(
              (n) => (
                <button
                  key={n}
                  type="button"
                  className={activeFloor === n ? styles.floorBtnActive : styles.floorBtn}
                  onClick={() => {
                    setActiveFloor(n);
                    setActivePoint(0);
                  }}
                >
                  {n}
                </button>
              )
            )}
          </div>

          <p className={styles.sideLabel}>
            Цэг {activePoint + 1} / {activePoly.length}
          </p>
          <div className={styles.pointList}>
            {activePoly.map((pt, i) => (
              <button
                key={i}
                type="button"
                className={activePoint === i ? styles.pointRowActive : styles.pointRow}
                onClick={() => setActivePoint(i)}
              >
                <span>{i + 1}</span>
                <code>
                  {Math.round(pt.x)}, {Math.round(pt.y)}
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
                onRemovePoint(activeFloor, activePoint);
                setActivePoint(Math.max(0, activePoint - 1));
              }}
            >
              Цэг устгах
            </button>
          </div>

          <p className={styles.sideLabel}>Нарийвчлах</p>
          <div className={styles.nudge}>
            <button type="button" onClick={() => onNudgePoint(activeFloor, activePoint, 0, -2)}>
              ↑
            </button>
            <div className={styles.nudgeRow}>
              <button type="button" onClick={() => onNudgePoint(activeFloor, activePoint, -2, 0)}>
                ←
              </button>
              <button
                type="button"
                className={styles.nudgeCenter}
                title="Бүхэл давхрыг зөөнө"
                onPointerDown={(e) => {
                  if (!svgRef.current) return;
                  const pt = clientToSvg(svgRef.current, e.clientX, e.clientY);
                  setDragging({
                    kind: "floor",
                    floor: activeFloor,
                    start: pt,
                    baseCalibration: calibration,
                  });
                  (e.target as Element).setPointerCapture(e.pointerId);
                }}
              >
                ⊕
              </button>
              <button type="button" onClick={() => onNudgePoint(activeFloor, activePoint, 2, 0)}>
                →
              </button>
            </div>
            <button type="button" onClick={() => onNudgePoint(activeFloor, activePoint, 0, 2)}>
              ↓
            </button>
          </div>
          <button
            type="button"
            className={styles.nudgeAll}
            onClick={() => onNudgeFloor(activeFloor, 0, -2)}
          >
            Бүхэл давхар ↑
          </button>

          <ul className={styles.tips}>
            <li>«+ Цэг нэмэх» → зураг дээр дарна (ирмэг ойролцоо бол холбогдоно)</li>
            <li>Цэгүүд 1→2→3… дарааллаар хаалттай polygon болно</li>
            <li>⊕ — бүх цэгүүдийг хамтад нь зөөнө</li>
            <li>Хамгийн багадаа {MIN_POLYGON_POINTS} цэг үлдэнэ</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
