"use client";

import { useCallback, useEffect, useState } from "react";
import {
  generateDefaultCalibration,
  insertPointOnNearestEdge,
  moveDestinationZone,
  removeZonePoint,
  updateZonePoint,
  type BuildingZonePoint,
  type InteractiveBuildingCalibration,
} from "@/lib/interactiveBuildingZones";
import {
  importInteractiveBuildingCalibration,
  loadInteractiveBuildingCalibration,
  saveInteractiveBuildingCalibration,
} from "@/lib/interactiveBuildingCalibration";

export function useInteractiveBuildingCalibration() {
  const [calibration, setCalibration] = useState<InteractiveBuildingCalibration>(
    generateDefaultCalibration,
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCalibration(loadInteractiveBuildingCalibration());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveInteractiveBuildingCalibration(calibration);
  }, [calibration, ready]);

  const reset = useCallback(() => {
    setCalibration(generateDefaultCalibration());
  }, []);

  const importJson = useCallback((json: string) => {
    setCalibration(importInteractiveBuildingCalibration(json));
  }, []);

  const updatePoint = useCallback(
    (destinationId: string, pointIndex: number, point: BuildingZonePoint) => {
      setCalibration((current) => updateZonePoint(current, destinationId, pointIndex, point));
    },
    [],
  );

  const nudgeZone = useCallback((destinationId: string, dx: number, dy: number) => {
    setCalibration((current) => moveDestinationZone(current, destinationId, dx, dy));
  }, []);

  const nudgePoint = useCallback(
    (destinationId: string, pointIndex: number, dx: number, dy: number) => {
      setCalibration((current) => {
        const zone = current.zones[destinationId];
        if (!zone?.[pointIndex]) return current;
        return updateZonePoint(current, destinationId, pointIndex, {
          x: zone[pointIndex].x + dx,
          y: zone[pointIndex].y + dy,
        });
      });
    },
    [],
  );

  const addPoint = useCallback((destinationId: string, point: BuildingZonePoint) => {
    setCalibration((current) => insertPointOnNearestEdge(current, destinationId, point));
  }, []);

  const removePoint = useCallback((destinationId: string, pointIndex: number) => {
    setCalibration((current) => removeZonePoint(current, destinationId, pointIndex));
  }, []);

  return {
    calibration,
    ready,
    reset,
    importJson,
    updatePoint,
    nudgeZone,
    nudgePoint,
    addPoint,
    removePoint,
    setCalibration,
  };
}
