"use client";

import { useMemo, useState } from "react";
import type { IconType } from "react-icons";
import {
  LuBuilding2,
  LuGem,
  LuPartyPopper,
  LuRocket,
  LuShirt,
  LuTheater,
  LuTrophy,
  LuWine,
} from "react-icons/lu";
import {
  getBallroomEventTypes,
  getBallroomLayouts,
  useLocale,
  useTranslations,
} from "@/lib/i18n";
import type { BallroomEventIcon } from "@/lib/i18n/types";
import styles from "./BallroomCapacityPlanner.module.css";

const eventIconMap: Record<BallroomEventIcon, IconType> = {
  wedding: LuGem,
  corporate: LuBuilding2,
  award: LuTrophy,
  launch: LuRocket,
  gala: LuWine,
  concert: LuTheater,
  celebration: LuPartyPopper,
  fashion: LuShirt,
};

export default function BallroomCapacityPlanner() {
  const { locale } = useLocale();
  const copy = useTranslations().ballroom.capacity;
  const eventTypes = getBallroomEventTypes(locale);
  const layouts = getBallroomLayouts(locale);
  const [selectedEvent, setSelectedEvent] = useState<BallroomEventIcon>(eventTypes[0].icon);

  const activeLayout = useMemo(() => {
    const event = eventTypes.find((item) => item.icon === selectedEvent);
    const layoutName = event?.layout ?? "Banquet";
    return layouts.find((layout) => layout.layout === layoutName) ?? layouts[0];
  }, [eventTypes, layouts, selectedEvent]);

  return (
    <section className={styles.section} id="capacity">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.title}>{copy.title}</h2>
        <p className={styles.lead}>{copy.lead}</p>

        <div className={styles.planner}>
          <div className={styles.eventPicker} data-ballroom-reveal>
            <p className={styles.pickerLabel}>{copy.eventType}</p>
            <div className={styles.eventChips}>
              {eventTypes.map((event) => {
                const Icon = eventIconMap[event.icon];

                return (
                  <button
                    key={event.icon}
                    type="button"
                    className={`${styles.chip} ${selectedEvent === event.icon ? styles.chipActive : ""}`}
                    onClick={() => setSelectedEvent(event.icon)}
                  >
                    <span className={styles.chipIconWrap} aria-hidden>
                      <Icon className={styles.chipIcon} />
                    </span>
                    {event.title}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.layoutGrid}>
            {layouts.map((layout) => {
              const isActive = layout.layout === activeLayout.layout;
              return (
                <article
                  key={layout.layout}
                  className={`${styles.layoutCard} ${isActive ? styles.layoutActive : ""}`}
                  data-ballroom-reveal
                >
                  <span className={styles.layoutName}>{layout.label}</span>
                  <strong className={styles.capacity}>{layout.capacity}</strong>
                  <span className={styles.guests}>{copy.guests}</span>
                  <p className={styles.note}>{layout.note}</p>
                  {isActive ? <span className={styles.recommended}>{copy.recommended}</span> : null}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
