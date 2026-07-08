"use client";

import { BankOutlined, HomeOutlined, ReloadOutlined, ShopOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Segmented, Tag } from "antd";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import PropertyStackingDiagram from "@/components/dashboard/PropertyStackingDiagram";
import type {
  PropertyBuilding,
  PropertyFloor,
  PropertyUnit,
  PropertyUnitStatus,
} from "@/lib/propertyManagement";
import styles from "./PropertyStackingDashboard.module.css";

const BUILDING_ICONS = {
  office: <BankOutlined />,
  mall: <ShopOutlined />,
  apartment: <HomeOutlined />,
} as const;

const BUILDING_IMAGE_POSITIONS: Record<string, string> = {
  office: "42% 28%",
  mall: "48% 58%",
  apartment: "62% 30%",
};

const BUILDING_IMAGE_FALLBACKS: Record<PropertyBuilding["kind"], string> = {
  office: "/images/hero/office.webp",
  mall: "/images/hero/mall-day.webp",
  apartment: "/images/hero/residence-day.webp",
};

type PropertyStackingDashboardProps = {
  buildings: PropertyBuilding[];
  floors: PropertyFloor[];
  units: PropertyUnit[];
  onRefresh?: () => void;
};

function tenantLabel(unit: PropertyUnit) {
  const contract = unit.active_contract;
  if (!contract) return "";
  return contract.tenant_company || contract.tenant_name || "";
}

function tenantId(unit: PropertyUnit) {
  return unit.active_contract?.tenant ?? null;
}

export default function PropertyStackingDashboard({
  buildings,
  floors,
  units,
  onRefresh,
}: PropertyStackingDashboardProps) {
  const router = useRouter();
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(
    buildings[0]?.id ?? null,
  );
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<PropertyUnitStatus | "all">("all");

  const selectedBuilding =
    buildings.find((building) => building.id === selectedBuildingId) ?? buildings[0] ?? null;

  const buildingFloors = useMemo(() => {
    if (!selectedBuilding) return [];
    return floors.filter((floor) => floor.building === selectedBuilding.id);
  }, [floors, selectedBuilding]);

  const buildingUnits = useMemo(() => {
    if (!selectedBuilding) return [];
    return units.filter((unit) => unit.building === selectedBuilding.id);
  }, [selectedBuilding, units]);

  const activeFloor = useMemo(() => {
    if (!buildingFloors.length) return null;
    const picked = selectedFloorId
      ? buildingFloors.find((floor) => floor.id === selectedFloorId)
      : null;
    if (picked) return picked;
    return (
      buildingFloors.find((floor) => floor.available_count > 0) ?? buildingFloors[0] ?? null
    );
  }, [buildingFloors, selectedFloorId]);

  const floorUnits = useMemo(() => {
    if (!activeFloor) return [];
    const scoped = buildingUnits.filter((unit) => unit.floor === activeFloor.id);
    if (statusFilter === "all") return scoped;
    return scoped.filter((unit) => unit.status === statusFilter);
  }, [activeFloor, buildingUnits, statusFilter]);

  if (!buildings.length || !selectedBuilding) {
    return (
      <Card className={styles.panel}>
        <Empty description="No buildings found. Seed property data first." />
      </Card>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <div>
          <h2 className={styles.title}>Stacking Plan</h2>
          <p className={styles.subtitle}>
            Барилгын зураг, давхарын дугаар, unit grid — сул болон түрээслэгдсэн
            төлөвийг интерактив харах.
          </p>
        </div>
        <div className={styles.toolbarActions}>
          <Segmented
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as PropertyUnitStatus | "all")}
            options={[
              { label: "Бүгд", value: "all" },
              { label: "Сул", value: "available" },
              { label: "Түрээслэгдсэн", value: "rented" },
              { label: "Захиалсан", value: "reserved" },
            ]}
          />
          {onRefresh ? (
            <Button icon={<ReloadOutlined />} onClick={onRefresh}>
              Refresh
            </Button>
          ) : null}
        </div>
      </div>

      <div className={styles.buildingRow}>
        {buildings.map((building) => {
          const occupied = building.rented_count + building.reserved_count;
          const occupancy = building.unit_count
            ? Math.round((occupied / building.unit_count) * 100)
            : 0;
          const active = selectedBuilding.id === building.id;
          return (
            <button
              key={building.id}
              type="button"
              className={`${styles.buildingCard} ${active ? styles.buildingCardActive : ""}`}
              onClick={() => {
                setSelectedBuildingId(building.id);
                setSelectedFloorId(null);
              }}
            >
              <div className={styles.buildingThumb}>
                <img
                  src={building.image || BUILDING_IMAGE_FALLBACKS[building.kind] || "/images/hero/home.webp"}
                  alt={building.name}
                  style={{ objectPosition: BUILDING_IMAGE_POSITIONS[building.kind] ?? "50% 50%" }}
                />
                <span className={styles.buildingIcon}>{BUILDING_ICONS[building.kind]}</span>
              </div>
              <div className={styles.buildingMeta}>
                <strong>{building.name}</strong>
                <span>
                  {building.floor_count} давхар · {building.available_count} сул
                </span>
                <div className={styles.occupancyTrack}>
                  <span style={{ width: `${occupancy}%` }} />
                </div>
                <small>{occupancy}% түрээслэгдсэн</small>
              </div>
            </button>
          );
        })}
      </div>

      <PropertyStackingDiagram
        building={selectedBuilding}
        floors={buildingFloors}
        units={buildingUnits}
        selectedFloorId={activeFloor?.id ?? null}
        statusFilter={statusFilter}
        onSelectFloor={setSelectedFloorId}
      />

      {activeFloor ? (
        <Card
          className={styles.panel}
          title={`${activeFloor.label} — сонгогдсон давхар`}
          extra={<Tag color={activeFloor.available_count > 0 ? "green" : "default"}>{activeFloor.available_count} сул</Tag>}
        >
          <div className={styles.unitStripGrid}>
            {floorUnits.map((unit) => {
              const vacant = unit.status === "available";
              const rented = unit.status === "rented";
              const tenant = tenantLabel(unit);
              const id = tenantId(unit);
              const stripClass = `${styles.unitStrip} ${
                vacant
                  ? styles.unitStripVacant
                  : rented
                    ? styles.unitStripRented
                    : unit.status === "reserved"
                      ? styles.unitStripReserved
                      : styles.unitStripUnavailable
              }${rented && id ? ` ${styles.unitStripClickable}` : ""}`;

              const content = (
                <>
                  <div className={styles.unitStripCode}>
                    <strong>{unit.unit_code}</strong>
                    <span>{Number(unit.area_sqm).toLocaleString()} m²</span>
                  </div>
                  <div className={styles.unitStripStatus}>
                    <Tag color={vacant ? "green" : rented ? "blue" : "gold"}>
                      {vacant ? "Сул" : rented ? "Түрээслэгдсэн" : unit.status}
                    </Tag>
                  </div>
                  <div className={styles.unitStripTenant}>
                    {vacant ? (
                      <span className={styles.tenantVacant}>Түрээслэх боломжтой</span>
                    ) : (
                      <>
                        <span className={styles.tenantLabel}>Түрээслэгч</span>
                        <strong>{tenant || "—"}</strong>
                      </>
                    )}
                  </div>
                </>
              );

              if (rented && id) {
                return (
                  <button
                    key={unit.id}
                    type="button"
                    className={stripClass}
                    onClick={() => router.push(`/dashboard/property/tenants/${id}`)}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <div key={unit.id} className={stripClass}>
                  {content}
                </div>
              );
            })}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
