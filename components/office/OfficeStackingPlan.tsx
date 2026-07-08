"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchOfficeStackingPlan } from "@/lib/api";
import {
  getOfficeUnitStatusMeta,
  type OfficeFloor,
  type OfficeUnit,
} from "@/lib/officeStacking";
import { availableCount } from "@/lib/officeZones";
import OfficeFacadeStack from "./OfficeFacadeStack";
import OfficeUnitModal from "./OfficeUnitModal";
import { officeLegend } from "@/lib/officeContent";
import { useTranslations } from "@/lib/i18n";
import styles from "./OfficeStackingPlan.module.css";

const UNIT_ORDER = ["A", "B", "C", "D"];

function sortUnits(units: OfficeUnit[]) {
  return [...units].sort(
    (a, b) => UNIT_ORDER.indexOf(a.unit_code) - UNIT_ORDER.indexOf(b.unit_code)
  );
}

export default function OfficeStackingPlan() {
  const stackingCopy = useTranslations().office.stackingIntro;
  const legendCopy = useTranslations().office.legend;
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchOfficeStackingPlan>>>(null);
  const [loading, setLoading] = useState(true);
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
        const pick =
          plan.floors.find((f) => f.units.some((u) => u.status === "available")) ??
          plan.floors.find((f) => f.floor_number === 12) ??
          plan.floors[0];
        setSelectedFloor(pick.floor_number);
      }
      setLoading(false);
    });
  }, []);

  const floors = data?.floors ?? [];

  const activeFloor = useMemo(
    () => floors.find((f) => f.floor_number === (hoverFloor ?? selectedFloor)) ?? null,
    [floors, selectedFloor, hoverFloor]
  );

  const displayUnits = activeFloor ? sortUnits(activeFloor.units) : [];
  const filteredUnits = availableOnly
    ? displayUnits.filter((u) => u.status === "available")
    : displayUnits;

  const totalAvailable = useMemo(
    () => floors.reduce((count, floor) => count + availableCount(floor), 0),
    [floors],
  );

  const selectFloor = (floorNumber: number) => {
    setSelectedFloor(floorNumber);
  };

  return (
    <section className={styles.section} id="stacking-plan">
      <div className={styles.bg} style={{ backgroundImage: "url(/images/renders/render-3.jpg)" }} />
      <div className={styles.overlay} />

      <div className={styles.inner}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>{stackingCopy.eyebrow}</span>
          <h2 className={styles.title}>{stackingCopy.title}</h2>
          <p className={styles.sub}>{stackingCopy.subtitle}</p>
          <ul className={styles.legend}>
            {officeLegend.map((item, index) => (
              <li key={item.label}>
                <span className={styles.legendDot} style={{ background: item.color }} />
                {legendCopy[index]?.label ?? item.label}
              </li>
            ))}
          </ul>
        </div>

        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : !data || floors.length === 0 ? (
          <p className={styles.loading}>
            No stacking plan data. Run <code>python manage.py seed_office</code>
          </p>
        ) : (
          <div className={styles.workspace}>
            <div className={styles.diagramCard}>
              <h3 className={styles.cardTitle}>Interactive floor allocation</h3>
              <p className={styles.cardSub}>
                Each floor on the render appears green (available) or red (fully leased).
              </p>
              <OfficeFacadeStack
                floors={floors}
                selectedFloor={selectedFloor}
                hoverFloor={hoverFloor}
                availableOnly={availableOnly}
                onSelectFloor={selectFloor}
                onHoverFloor={setHoverFloor}
              />
            </div>

            <div className={styles.detailCard}>
              <div className={styles.filterRow}>
                <button
                  type="button"
                  className={`${styles.filterBtn} ${availableOnly ? styles.filterBtnActive : ""}`}
                  onClick={() => setAvailableOnly((v) => !v)}
                >
                  {availableOnly ? "Showing available floors only" : "Show available floors only"}
                </button>
              </div>

              <div className={styles.detailHead}>
                <span className={styles.badge}>
                  {activeFloor ? activeFloor.floor_number : "—"}
                </span>
                <h3>{activeFloor ? activeFloor.label : "Select a floor"}</h3>
                <p>{activeFloor ? activeFloor.layout_notes : "Click a floor on the tower to view office units."}</p>
              </div>

              {!activeFloor ? (
                <p className={styles.empty}>Select a floor to view unit availability.</p>
              ) : filteredUnits.length === 0 ? (
                <p className={styles.empty}>
                  {availableOnly
                    ? "No available offices on this floor."
                    : "No office data available."}
                </p>
              ) : (
                <>
                  <div className={styles.unitRow}>
                    {filteredUnits.map((unit) => {
                      const meta = getOfficeUnitStatusMeta(activeFloor, unit);
                      const isAvailable = unit.status === "available";
                      const content = (
                        <>
                          <div className={styles.chipTop}>
                            <strong>{unit.unit_code}</strong>
                            <span>{unit.area_sqm} sqm</span>
                          </div>
                          <span style={{ color: meta.color }}>{meta.label}</span>
                          {isAvailable ? (
                            <small className={styles.chipHint}>Click to send inquiry</small>
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
                    <span>
                      {availableCount(activeFloor)}/{activeFloor.units.length} available
                    </span>
                    <span>{totalAvailable} available across tower</span>
                  </div>
                </>
              )}

              <div className={styles.detailFoot}>
                <Link href="#contact" className="btn-primary">
                  Book Tour
                </Link>
              </div>
            </div>
          </div>
        )}

        {!loading && data && floors.length > 0 ? (
          <div className={styles.sectionFoot}>
            <div>
              <h3>{stackingCopy.footerTitle}</h3>
              <p>{stackingCopy.footerBody}</p>
            </div>
            <Link href="#contact" className="btn-primary">
              Contact Sales
            </Link>
          </div>
        ) : null}
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
