"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FACADE_FLOOR_COUNT,
  generateDefaultCalibration,
  insertPointOnNearestEdge,
  moveFloorPolygon,
  removePolygonPoint,
  updatePolygonPoint,
  type FacadeCalibration,
  type FacadePoint,
} from "@/lib/officeFacadeFloors";
import {
  importFacadeCalibration,
  loadFacadeCalibration,
  saveFacadeCalibration,
} from "@/lib/officeFacadeCalibration";

export function useOfficeFacadeCalibration() {
  const [calibration, setCalibration] = useState<FacadeCalibration>(() =>
    generateDefaultCalibration(FACADE_FLOOR_COUNT)
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCalibration(loadFacadeCalibration());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveFacadeCalibration(calibration);
  }, [calibration, ready]);

  const reset = useCallback(() => {
    setCalibration(generateDefaultCalibration(FACADE_FLOOR_COUNT));
  }, []);

  const importJson = useCallback((json: string) => {
    setCalibration(importFacadeCalibration(json));
  }, []);

  const updatePoint = useCallback(
    (floorNumber: number, pointIndex: number, point: FacadePoint) => {
      setCalibration((prev) => updatePolygonPoint(prev, floorNumber, pointIndex, point));
    },
    []
  );

  const nudgeFloor = useCallback((floorNumber: number, dx: number, dy: number) => {
    setCalibration((prev) => moveFloorPolygon(prev, floorNumber, dx, dy));
  }, []);

  const nudgePoint = useCallback(
    (floorNumber: number, pointIndex: number, dx: number, dy: number) => {
      setCalibration((prev) => {
        const poly = prev.floors[String(floorNumber)];
        if (!poly?.[pointIndex]) return prev;
        return updatePolygonPoint(prev, floorNumber, pointIndex, {
          x: poly[pointIndex].x + dx,
          y: poly[pointIndex].y + dy,
        });
      });
    },
    []
  );

  const addPoint = useCallback((floorNumber: number, point: FacadePoint) => {
    setCalibration((prev) => insertPointOnNearestEdge(prev, floorNumber, point));
  }, []);

  const removePoint = useCallback((floorNumber: number, pointIndex: number) => {
    setCalibration((prev) => removePolygonPoint(prev, floorNumber, pointIndex));
  }, []);

  return {
    calibration,
    ready,
    reset,
    importJson,
    updatePoint,
    nudgeFloor,
    nudgePoint,
    addPoint,
    removePoint,
    setCalibration,
  };
}
