"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuArrowUpRight } from "react-icons/lu";
import { nearbyPlaces, type NearbyPlace } from "@/lib/homeContent";
import { project } from "@/lib/data";
import shared from "./home.shared.module.css";
import styles from "./LocationSection.module.css";

const defaultPreview = {
  image: "/images/drone/drone-1.jpg",
  imageAlt: "Aerial view of Encanto Trade Center and the surrounding Bayanzurkh district",
  name: "Encanto Trade Center",
  distance: null as string | null,
};

export default function LocationSection() {
  const [activePlace, setActivePlace] = useState<NearbyPlace | null>(null);
  const preview = activePlace ?? defaultPreview;

  return (
    <section className={`${shared.section} ${styles.section}`} id="location">
      <div className={shared.container}>
        <div className={styles.header} data-home-reveal>
          <p className={shared.eyebrow}>Location</p>
          <h2 className={shared.title}>Connected to the city.</h2>
          <p className={shared.lead}>
            <a
              href={project.mapUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.locationLink}
            >
              {project.location}
              <LuArrowUpRight className={styles.locationLinkIcon} aria-hidden />
            </a>
          </p>
        </div>

        <div className={styles.grid} data-home-reveal>
          <div className={styles.map}>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={preview.name}
                className={styles.mapFrame}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={preview.image}
                  alt={preview.imageAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 60vw"
                  className={styles.mapImage}
                />
              </motion.div>
            </AnimatePresence>
            <div className={styles.mapOverlay} aria-hidden />
            <div className={styles.mapCaption}>
              <span className={styles.mapCaptionName}>{preview.name}</span>
              {preview.distance ? (
                <span className={styles.mapCaptionDistance}>{preview.distance}</span>
              ) : null}
            </div>
          </div>

          <div className={styles.nearby}>
            <h3>Nearby</h3>
            <p className={styles.nearbyLabel}>Walking distance</p>
            <ul
              className={styles.nearbyList}
              onMouseLeave={() => setActivePlace(null)}
            >
              {nearbyPlaces.map((place) => {
                const isActive = activePlace?.name === place.name;

                return (
                  <li key={place.name}>
                    <button
                      type="button"
                      className={`${styles.nearbyItem} ${isActive ? styles.nearbyItemActive : ""}`}
                      onMouseEnter={() => setActivePlace(place)}
                      onFocus={() => setActivePlace(place)}
                      onBlur={() => setActivePlace(null)}
                      onClick={() => setActivePlace((current) => (current?.name === place.name ? null : place))}
                    >
                      <span className={styles.nearbyName}>{place.name}</span>
                      <strong>{place.distance}</strong>
                    </button>
                  </li>
                );
              })}
            </ul>
            <Link href="/#contact" className={shared.btnDark}>
              Request Location Brief
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
