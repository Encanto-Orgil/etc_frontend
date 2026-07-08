"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type {
  PropertyBuilding,
  PropertyFloor,
  PropertyUnit,
  PropertyUnitStatus,
} from "@/lib/propertyManagement";
import styles from "./PropertyStackingDiagram.module.css";

const FACADE_IMAGES: Record<PropertyBuilding["kind"], string> = {
  office: "/images/hero/office.webp",
  mall: "/images/hero/mall-day.webp",
  apartment: "/images/hero/residence-day.webp",
};

const FACADE_POSITION: Record<PropertyBuilding["kind"], string> = {
  office: "42% 28%",
  mall: "48% 58%",
  apartment: "62% 30%",
};

type PropertyStackingDiagramProps = {
  building: PropertyBuilding;
  floors: PropertyFloor[];
  units: PropertyUnit[];
  selectedFloorId: number | null;
  statusFilter: PropertyUnitStatus | "all";
  onSelectFloor: (floorId: number) => void;
};

function tenantLabel(unit: PropertyUnit) {
  const contract = unit.active_contract;
  if (!contract) return "";
  return contract.tenant_company || contract.tenant_name || "";
}

function tenantId(unit: PropertyUnit) {
  return unit.active_contract?.tenant ?? null;
}

function sortUnits(floorUnits: PropertyUnit[]) {
  return [...floorUnits].sort((a, b) =>
    a.unit_code.localeCompare(b.unit_code, undefined, { numeric: true }),
  );
}

export default function PropertyStackingDiagram({
  building,
  floors,
  units,
  selectedFloorId,
  statusFilter,
  onSelectFloor,
}: PropertyStackingDiagramProps) {
  const router = useRouter();
  const [hoverFloorId, setHoverFloorId] = useState<number | null>(null);

  const handleUnitClick = (unit: PropertyUnit, floorId: number) => {
    if (unit.status === "rented") {
      const id = tenantId(unit);
      if (id) {
        router.push(`/dashboard/property/tenants/${id}`);
        return;
      }
    }
    onSelectFloor(floorId);
  };

  const floorRows = useMemo(() => {
    return [...floors]
      .sort((a, b) => b.floor_number - a.floor_number)
      .map((floor) => {
        const floorUnits = sortUnits(units.filter((unit) => unit.floor === floor.id));
        const visibleUnits =
          statusFilter === "all"
            ? floorUnits
            : floorUnits.filter((unit) => unit.status === statusFilter);
        return { floor, floorUnits, visibleUnits };
      })
      .filter((row) => statusFilter === "all" || row.visibleUnits.length > 0);
  }, [floors, statusFilter, units]);

  const highlightFloorId = hoverFloorId ?? selectedFloorId;

  if (!floorRows.length) {
    return (
      <div className={styles.diagram}>
        <div className={styles.empty}>Энэ шүүлтүүрт тохирох давхар алга.</div>
      </div>
    );
  }

  return (
    <div className={styles.diagram}>
      <div className={styles.diagramHead}>
        <div>
          <h3>{building.name}</h3>
          <p>Interactive stacking plan</p>
        </div>
        <div className={styles.legend}>
          <span>
            <i className={styles.legendVacant} /> Сул
          </span>
          <span>
            <i className={styles.legendRented} /> Түрээслэгдсэн
          </span>
          <span>
            <i className={styles.legendReserved} /> Захиалсан
          </span>
        </div>
      </div>

      <div
        className={styles.board}
        style={{ gridTemplateRows: `36px repeat(${floorRows.length}, minmax(34px, auto))` }}
      >
        <div className={styles.facadePane} style={{ gridRow: `1 / span ${floorRows.length + 1}` }}>
          <img
            src={building.image || FACADE_IMAGES[building.kind]}
            alt={building.name}
            className={styles.facadeImage}
            style={{ objectPosition: FACADE_POSITION[building.kind] ?? "50% 40%" }}
          />
          <div className={styles.facadeShade} />
        </div>

        <div className={styles.floorHeader}>Floor No</div>
        <div className={styles.stackHeader}>Stacking plan</div>

        {floorRows.map(({ floor, floorUnits, visibleUnits }, index) => {
          const rowIndex = index + 2;
          const isHighlighted = highlightFloorId === floor.id;
          const displayUnits = statusFilter === "all" ? floorUnits : visibleUnits;

          return (
            <div key={floor.id} className={styles.rowPair}>
              <button
                type="button"
                className={`${styles.floorNo} ${isHighlighted ? styles.floorNoActive : ""}`}
                style={{ gridColumn: 2, gridRow: rowIndex }}
                onClick={() => onSelectFloor(floor.id)}
                onMouseEnter={() => setHoverFloorId(floor.id)}
                onMouseLeave={() => setHoverFloorId(null)}
              >
                {floor.floor_number}
              </button>

              <div
                className={`${styles.unitTrack} ${isHighlighted ? styles.unitTrackActive : ""}`}
                style={{ gridColumn: 3, gridRow: rowIndex }}
                onMouseEnter={() => setHoverFloorId(floor.id)}
                onMouseLeave={() => setHoverFloorId(null)}
              >
                <div
                  className={styles.unitRow}
                  style={{
                    gridTemplateColumns: `repeat(${Math.max(displayUnits.length, 1)}, minmax(0, 1fr))`,
                  }}
                >
                  {displayUnits.length === 0 ? (
                    <div className={styles.unitEmpty}>No units</div>
                  ) : (
                    displayUnits.map((unit) => {
                      const vacant = unit.status === "available";
                      const rented = unit.status === "rented";
                      const tenant = tenantLabel(unit);
                      const suiteLabel = unit.unit_code.match(/^\d/)
                        ? `Suite ${unit.unit_code}`
                        : `Suite ${floor.floor_number}${unit.unit_code}`;
                      const areaLabel = `${Number(unit.area_sqm).toLocaleString()} m²`;

                      return (
                        <button
                          key={unit.id}
                          type="button"
                          className={`${styles.unitBlock} ${styles[`unit_${unit.status}`]} ${
                            rented && tenantId(unit) ? styles.unitClickable : ""
                          }`}
                          onClick={() => handleUnitClick(unit, floor.id)}
                          title={
                            vacant
                              ? `${suiteLabel} — Сул`
                              : rented && tenantId(unit)
                                ? `${suiteLabel} — ${tenant || "Түрээслэгдсэн"} (tenant detail)`
                                : `${suiteLabel} — ${tenant || "Түрээслэгдсэн"}`
                          }
                        >
                          <strong>{suiteLabel}</strong>
                          <span>{vacant ? "Сул" : tenant || "Түрээслэгдсэн"}</span>
                          <small>{areaLabel}</small>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
