"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchOfficeStackingPlan } from "@/lib/api";
import {
  STATUS_META,
  type OfficeFloor,
  type OfficeUnit,
} from "@/lib/officeStacking";
import {
  OFFICE_ZONES,
  availableCount,
  floorsInZone,
  zoneForFloor,
  type OfficeZone,
} from "@/lib/officeZones";
import OfficeFacadeStack from "./OfficeFacadeStack";
import OfficeUnitModal from "./OfficeUnitModal";
import styles from "./OfficeStackingPlan.module.css";

const UNIT_ORDER = ["A", "B", "C", "D"];

function sortUnits(units: OfficeUnit[]) {
  return [...units].sort(
    (a, b) => UNIT_ORDER.indexOf(a.unit_code) - UNIT_ORDER.indexOf(b.unit_code)
  );
}

export default function OfficeStackingPlan() {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchOfficeStackingPlan>>>(null);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState<OfficeZone>(OFFICE_ZONES[1]);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [hoverFloor, setHoverFloor] = useState<number | null>(null);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [inquiryTarget, setInquiryTarget] = useState<{
    floor: OfficeFloor;
    unit: OfficeUnit;
  } | null>(null);

  useEffect(() => {
    fetchOfficeStackingPlan().then((plan) => {
      setData(plan);
      if (plan?.floors.length) {
        const mid = plan.floors.find((f) => f.floor_number === 12) ?? plan.floors[0];
        setSelectedFloor(mid.floor_number);
        const zone = zoneForFloor(mid.floor_number);
        if (zone) setSelectedZone(zone);
      }
      setLoading(false);
    });
  }, []);

  const floors = data?.floors ?? [];

  const activeFloor = useMemo(
    () => floors.find((f) => f.floor_number === (hoverFloor ?? selectedFloor)) ?? null,
    [floors, selectedFloor, hoverFloor]
  );

  const visibleFloors = useMemo(() => {
    let list = floorsInZone(floors, selectedZone);
    if (availableOnly) list = list.filter((f) => availableCount(f) > 0);
    return list;
  }, [floors, selectedZone, availableOnly]);

  const displayUnits = activeFloor ? sortUnits(activeFloor.units) : [];
  const filteredUnits = availableOnly
    ? displayUnits.filter((u) => u.status === "available")
    : displayUnits;

  const zoneAvailable = visibleFloors.reduce((n, f) => n + availableCount(f), 0);

  const selectZone = (zone: OfficeZone) => {
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
    <section className={styles.section} id="stacking-plan">
      <div className={styles.bg} style={{ backgroundImage: "url(/images/renders/render-3.jpg)" }} />
      <div className={styles.overlay} />

      <div className={styles.inner}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Stacking Plan</span>
          <h2 className={styles.title}>
            Давхарын
            <br />
            төлөвлөлт
          </h2>
          <p className={styles.sub}>
            Зүүн оффис барилга дээр давхар сонгоод, баруун талаас тухайн давхрын 4 оффисыг
            хараарай.
          </p>
        </div>

        {loading ? (
          <p className={styles.loading}>Ачааллаж байна...</p>
        ) : !data || floors.length === 0 ? (
          <p className={styles.loading}>
            Stacking plan мэдээлэл байхгүй. <code>python manage.py seed_office</code>
          </p>
        ) : (
          <div className={styles.workspace}>
            <div className={styles.diagramCard}>
              <h3 className={styles.cardTitle}>Давхарын интерактив хуваарилалт</h3>
              <p className={styles.cardSub}>
                Бодит render дээр давхар бүр ногоон (боломжит) эсвэл улаан (бүрэн түрээслэгдсэн)
                өнгөөр тодорно.
              </p>
              <OfficeFacadeStack
                floors={floors}
                selectedFloor={selectedFloor}
                hoverFloor={hoverFloor}
                selectedZone={selectedZone}
                availableOnly={availableOnly}
                onSelectFloor={selectFloor}
                onHoverFloor={setHoverFloor}
              />
            </div>

            <div className={styles.detailCard}>
              <div className={styles.zoneGrid}>
                {OFFICE_ZONES.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    className={`${styles.zoneBtn} ${
                      selectedZone.id === zone.id ? styles.zoneActive : ""
                    }`}
                    onClick={() => selectZone(zone)}
                  >
                    <span className={styles.zoneRange}>{zone.label}</span>
                    <span className={styles.zoneName}>{zone.title}</span>
                  </button>
                ))}
                <button
                  type="button"
                  className={`${styles.zoneBtn} ${styles.zoneFilter} ${
                    availableOnly ? styles.zoneFilterActive : ""
                  }`}
                  onClick={() => setAvailableOnly((v) => !v)}
                >
                  <span className={styles.zoneRange}>Filter</span>
                  <span className={styles.zoneName}>Боломжит л</span>
                </button>
              </div>

              <div className={styles.detailHead}>
                <span className={styles.badge}>
                  {activeFloor ? activeFloor.floor_number : selectedZone.label}
                </span>
                <h3>{activeFloor ? activeFloor.label : selectedZone.title}</h3>
                <p>
                  {activeFloor
                    ? activeFloor.layout_notes
                    : selectedZone.description}
                </p>
              </div>

              {!activeFloor ? (
                <ul className={styles.bullets}>
                  {selectedZone.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : filteredUnits.length === 0 ? (
                <p className={styles.empty}>
                  {availableOnly
                    ? "Энэ давхарт боломжит оффис байхгүй."
                    : "Оффисын мэдээлэл байхгүй."}
                </p>
              ) : (
                <>
                  <div className={styles.unitRow}>
                    {filteredUnits.map((unit) => {
                      const meta = STATUS_META[unit.status];
                      const isAvailable = unit.status === "available";
                      const content = (
                        <>
                          <div className={styles.chipTop}>
                            <strong>{unit.unit_code}</strong>
                            <span>{unit.area_sqm} м²</span>
                          </div>
                          <span style={{ color: meta.color }}>{unit.status_label}</span>
                          {isAvailable ? (
                            <small className={styles.chipHint}>Дарж хүсэлт илгээнэ үү</small>
                          ) : unit.tenant_name ? (
                            <small>{unit.tenant_name}</small>
                          ) : null}
                        </>
                      );

                      if (isAvailable && activeFloor) {
                        return (
                          <button
                            key={unit.id}
                            type="button"
                            className={`${styles.unitChip} ${styles.unitClickable}`}
                            style={{ borderLeftColor: meta.color }}
                            onClick={() =>
                              setInquiryTarget({ floor: activeFloor, unit })
                            }
                          >
                            {content}
                          </button>
                        );
                      }

                      return (
                        <div
                          key={unit.id}
                          className={styles.unitChip}
                          style={{ borderLeftColor: meta.color }}
                        >
                          {content}
                        </div>
                      );
                    })}
                  </div>

                  <div className={styles.metaRow}>
                    <span>{availableCount(activeFloor)}/4 чөлөөт</span>
                    <span>{selectedZone.label} бүс · {zoneAvailable} боломжит</span>
                  </div>
                </>
              )}

              <div className={styles.detailFoot}>
                <Link href="#contact" className="btn-primary">
                  Түрээсийн лавлагаа
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <OfficeUnitModal
        open={!!inquiryTarget}
        onClose={() => setInquiryTarget(null)}
        floor={inquiryTarget?.floor ?? null}
        unit={inquiryTarget?.unit ?? null}
      />
    </section>
  );
}
