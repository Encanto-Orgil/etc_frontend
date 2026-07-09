"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchPublicBallroomEventTypes } from "./ballroomManagement";
import { getBallroomBookingEventTypes, type Locale } from "./i18n";

export type BallroomEventTypeOption = {
  value: string;
  label: string;
};

export function useBallroomEventTypeOptions(locale: Locale) {
  const fallback = useMemo(() => getBallroomBookingEventTypes(locale), [locale]);
  const [options, setOptions] = useState<BallroomEventTypeOption[]>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOptions(fallback);
  }, [fallback]);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    fetchPublicBallroomEventTypes()
      .then((types) => {
        if (cancelled) return;
        const next = types.map((item) => ({ value: item.slug, label: item.label }));
        if (next.length) setOptions(next);
      })
      .catch(() => {
        // Keep translated fallback when the API is unavailable.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { options, loading };
}
