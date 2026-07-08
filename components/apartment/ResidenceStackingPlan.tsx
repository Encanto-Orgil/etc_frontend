"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchApartmentStackingPlan } from "@/lib/api";
import { apartmentStackingIntro } from "@/lib/apartmentContent";
import { STATUS_META } from "@/lib/officeStacking";
import {
  RESIDENCE_FLOOR_MAX,
  RESIDENCE_FLOOR_MIN,
  RESIDENCE_ZONES,
  VIEW_FILTERS,
  availableCount,
  filterByView,
  floorsInZone,
  zoneForFloor,
  type ViewFilterId,
} from "@/lib/residenceZones";
import BuildingStackDiagram from "../office/BuildingStackDiagram";
import officeStyles from "../office/OfficeStackingPlan.module.css";
import styles from "./ResidenceStackingPlan.module.css";

export default function ResidenceStackingPlan() {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchApartmentStackingPlan>>>(null);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState(RESIDENCE_ZONES[1]);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [hoverFloor, setHoverFloor] = useState<number | null>(null);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [viewFilter, setViewFilter] = useState<ViewFilterId>("all");

  useEffect(() => {
    fetchApartmentStackingPlan().then((plan) => {
      setData(plan);
      if (plan?.floors.length) {
        const residenceFloors = plan.floors.filter(
          (f) => f.floor_number >= RESIDENCE_FLOOR_MIN && f.floor_number <= RESIDENCE_FLOOR_MAX,
        );
        const mid = residenceFloors.find((f) => f.floor_number === 18) ?? residenceFloors[0];
        if (mid) {
          setSelectedFloor(mid.floor_number);
          const zone = zoneForFloor(mid.floor_number);
          if (zone) setSelectedZone(zone);
        }
      }
      setLoading(false);
    });
  }, []);

  const floors = useMemo(
    () =>
      (data?.floors ?? []).filter(
        (f) => f.floor_number >= RESIDENCE_FLOOR_MIN && f.floor_number <= RESIDENCE_FLOOR_MAX,
      ),
    [data],
  );

  const activeFloor = useMemo(
    () => floors.find((f) => f.floor_number === (hoverFloor ?? selectedFloor)) ?? null,
    [floors, selectedFloor, hoverFloor],
  );

  const visibleFloors = useMemo(() => {
    let list = floorsInZone(floors, selectedZone);
    list = filterByView(list, viewFilter);
    if (availableOnly) list = list.filter((f) => availableCount(f) > 0);
    return list;
  }, [floors, selectedZone, availableOnly, viewFilter]);

  const displayUnits = activeFloor?.units ?? [];
  const filteredUnits = availableOnly
    ? displayUnits.filter((u) => u.status === "available")
    : displayUnits;

  const selectZone = (zone: typeof RESIDENCE_ZONES[number]) => {
    setSelectedZone(zone);
    const inZone = floorsInZone(floors, zone);
    const pick =
      inZone.find((f) => availableCount(f) > 0) ??
      inZone[Math.floor(inZone.length / 2)] ??
      inZone[0];
    if (pick) setSelectedFloor(pick.floor_number);
  };

  const selectFloor = (floorNumber: number) => {
    setSelectedFloor(floorNumber);
    const zone = zoneForFloor(floorNumber);
    if (zone) setSelectedZone(zone);
  };

  return (
    <section className={officeStyles.section} id="stacking-plan">
      <div className={officeStyles.bg} style={{ backgroundImage: "url(/images/renders/render-25.jpg)" }} />
      <div className={officeStyles.overlay} />

      <div className={officeStyles.inner}>
        <div className={officeStyles.heroCopy}>
          <span className={officeStyles.eyebrow}>{apartmentStackingIntro.eyebrow}</span>
          <h2 className={officeStyles.title}>{apartmentStackingIntro.title}</h2>
          <p className={officeStyles.sub}>{apartmentStackingIntro.subtitle}</p>
          <div className={styles.viewFilters}>
            {VIEW_FILTERS.map((view) => (
              <button
                key={view.id}
                type="button"
                className={`${styles.viewBtn} ${viewFilter === view.id ? styles.viewActive : ""}`}
                onClick={() => setViewFilter(view.id)}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className={officeStyles.loading}>Loading availability...</p>
        ) : !data || floors.length === 0 ? (
          <p className={officeStyles.loading}>
            Stacking plan unavailable. Run <code>python manage.py seed_apartment</code>
          </p>
        ) : (
          <div className={officeStyles.workspace}>
            <div className={officeStyles.diagramCard}>
              <h3 className={officeStyles.cardTitle}>Residence Tower</h3>
              <p className={officeStyles.cardSub}>
                Floors {RESIDENCE_FLOOR_MIN}–{RESIDENCE_FLOOR_MAX} · Available, Reserved, and Sold units
              </p>
              <BuildingStackDiagram
                floors={visibleFloors.length ? visibleFloors : floors}
                selectedFloor={selectedFloor}
                availableOnly={availableOnly}
                onSelectFloor={selectFloor}
                onHoverFloor={setHoverFloor}
              />
            </div>

            <div className={officeStyles.detailCard}>
              <div className={officeStyles.zoneGrid}>
                {RESIDENCE_ZONES.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    className={`${officeStyles.zoneBtn} ${
                      selectedZone.id === zone.id ? officeStyles.zoneActive : ""
                    }`}
                    onClick={() => selectZone(zone)}
                  >
                    <span className={officeStyles.zoneRange}>{zone.label}</span>
                    <span className={officeStyles.zoneName}>{zone.title}</span>
                  </button>
                ))}
                <button
                  type="button"
                  className={`${officeStyles.zoneBtn} ${officeStyles.zoneFilter} ${
                    availableOnly ? officeStyles.zoneFilterActive : ""
                  }`}
                  onClick={() => setAvailableOnly((v) => !v)}
                >
                  <span className={officeStyles.zoneRange}>Filter</span>
                  <span className={officeStyles.zoneName}>Available Only</span>
                </button>
              </div>

              <div className={officeStyles.detailHead}>
                <span className={officeStyles.badge}>
                  {activeFloor ? `Floor ${activeFloor.floor_number}` : selectedZone.label}
                </span>
                <h3>{activeFloor ? activeFloor.label : selectedZone.title}</h3>
                <p>{activeFloor ? activeFloor.layout_notes : selectedZone.description}</p>
              </div>

              {!activeFloor ? (
                <ul className={officeStyles.bullets}>
                  {selectedZone.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : filteredUnits.length === 0 ? (
                <p className={officeStyles.empty}>
                  {availableOnly ? "No available units on this floor." : "No unit data for this floor."}
                </p>
              ) : (
                <div className={officeStyles.unitRow}>
                  {filteredUnits.map((unit) => {
                    const meta = STATUS_META[unit.status];
                    return (
                      <Link
                        key={unit.id}
                        href={`#contact`}
                        className={`${officeStyles.unitChip} ${unit.status === "available" ? officeStyles.unitClickable : ""}`}
                        style={{ borderLeftColor: meta.color }}
                      >
                        <div className={officeStyles.chipTop}>
                          <strong>{unit.unit_code}</strong>
                          <span>{unit.area_sqm} m²</span>
                        </div>
                        <span style={{ color: meta.color }}>{unit.status_label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}

              <div className={officeStyles.detailFoot}>
                <Link href="#contact" className="btn-primary">
                  Book a Private Tour
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
