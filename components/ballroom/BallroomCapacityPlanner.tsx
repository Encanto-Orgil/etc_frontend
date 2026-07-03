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
  ballroomEventTypes,
  ballroomLayouts,
  type BallroomEventIcon,
} from "@/lib/ballroomContent";
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
  const [selectedEvent, setSelectedEvent] = useState(ballroomEventTypes[0].title);

  const activeLayout = useMemo(() => {
    const event = ballroomEventTypes.find((e) => e.title === selectedEvent);
    const layoutName = event?.layout ?? "Banquet";
    return ballroomLayouts.find((l) => l.layout === layoutName) ?? ballroomLayouts[0];
  }, [selectedEvent]);

  return (
    <section className={styles.section} id="capacity">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Capacity & Layouts</p>
        <h2 className={styles.title}>Designed for Every Occasion</h2>
        <p className={styles.lead}>
          Select your event type to preview the recommended seating configuration and capacity.
        </p>

        <div className={styles.planner}>
          <div className={styles.eventPicker} data-ballroom-reveal>
            <p className={styles.pickerLabel}>Event Type</p>
            <div className={styles.eventChips}>
              {ballroomEventTypes.map((event) => {
                const Icon = eventIconMap[event.icon];

                return (
                  <button
                    key={event.title}
                    type="button"
                    className={`${styles.chip} ${selectedEvent === event.title ? styles.chipActive : ""}`}
                    onClick={() => setSelectedEvent(event.title)}
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
            {ballroomLayouts.map((layout) => {
              const isActive = layout.layout === activeLayout.layout;
              return (
                <article
                  key={layout.layout}
                  className={`${styles.layoutCard} ${isActive ? styles.layoutActive : ""}`}
                  data-ballroom-reveal
                >
                  <span className={styles.layoutName}>{layout.layout}</span>
                  <strong className={styles.capacity}>{layout.capacity}</strong>
                  <span className={styles.guests}>Guests</span>
                  <p className={styles.note}>{layout.note}</p>
                  {isActive ? <span className={styles.recommended}>Recommended</span> : null}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
