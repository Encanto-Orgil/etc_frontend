"use client";

import Image from "next/image";
import Link from "next/link";
import { officeAmenities, officeBusinessIntro } from "@/lib/officeContent";
import { useTranslations } from "@/lib/i18n";
import styles from "./office.landing.module.css";
import amenityStyles from "./OfficeAmenitiesSection.module.css";

const OFFICE_AMENITY_GRID = [
  { column: "1 / 3", row: "1 / 3" },
  { column: "3", row: "1" },
  { column: "4", row: "1" },
  { column: "3", row: "2" },
  { column: "4", row: "2" },
  { column: "1", row: "3" },
  { column: "2", row: "3" },
  { column: "3 / 5", row: "3" },
] as const;

export function OfficeBusinessSection() {
  const copy = useTranslations().office.businessIntro;

  return (
    <section className={styles.sectionCream} id="business-starts">
      <div className={styles.inner}>
        <div className={styles.split}>
          <div className={styles.splitImage} data-office-reveal>
            <Image
              src={officeBusinessIntro.image}
              alt={copy.imageAlt}
              width={900}
              height={700}
            />
          </div>
          <div data-office-reveal>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h2 className={styles.title}>{copy.title}</h2>
            <p className={styles.lead}>{copy.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function OfficeTypesSection() {
  const copy = useTranslations().office;

  return (
    <section className={styles.sectionDark} id="office-types">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.typesSection.eyebrow}</p>
        <h2 className={styles.title}>{copy.typesSection.title}</h2>
        <div className={styles.typeGrid}>
          {copy.officeTypes.map((type) => (
            <article key={type.title} className={styles.typeCard} data-office-reveal>
              <h3>{type.title}</h3>
              <span className={styles.typeLevel}>
                {copy.typesSection.levelPrefix}: {type.level}
              </span>
              {type.sizeLabel ? (
                <span className={styles.typeSizeLabel}>{type.sizeLabel}</span>
              ) : null}
              <ul className={styles.typeSizes}>
                {type.sizes.map((size) => (
                  <li key={size}>{size}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OfficeAmenitiesSection() {
  const copy = useTranslations().office;

  return (
    <section className={`${styles.sectionDark} ${amenityStyles.section}`} id="amenities">
      <div className={amenityStyles.glow} aria-hidden />

      <div className={styles.inner}>
        <div className={amenityStyles.header} data-office-reveal>
          <div className={amenityStyles.headerCopy}>
            <p className={styles.eyebrow}>{copy.amenitiesSection.eyebrow}</p>
            <h2 className={`${styles.title} ${amenityStyles.title}`}>{copy.amenitiesSection.title}</h2>
          </div>
          <p className={amenityStyles.lead}>{copy.amenitiesSection.lead}</p>
        </div>

        <div className={amenityStyles.grid} data-office-reveal aria-label="Office amenities gallery">
          {officeAmenities.map((item, index) => {
            const text = copy.amenities[index];
            const placement = OFFICE_AMENITY_GRID[index];
            const isFeatured = index === 0;

            return (
              <article
                key={item.title}
                className={`${amenityStyles.card} ${isFeatured ? amenityStyles.cardFeatured : ""}`}
                style={
                  placement
                    ? {
                        gridColumn: placement.column,
                        gridRow: placement.row,
                      }
                    : undefined
                }
              >
                <Image
                  src={item.image}
                  alt={text?.title ?? item.title}
                  fill
                  sizes="(max-width: 560px) 100vw, (max-width: 960px) 50vw, 25vw"
                  className={amenityStyles.image}
                />
                <div className={amenityStyles.overlay} aria-hidden />
                <div className={amenityStyles.cardBody}>
                  <span className={amenityStyles.index}>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{text?.title ?? item.title}</h3>
                  <p className={amenityStyles.description}>{text?.description ?? item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function OfficeLocationSection() {
  const copy = useTranslations().office;

  return (
    <section className={styles.sectionDark} id="location">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.locationSection.eyebrow}</p>
        <h2 className={styles.title}>{copy.locationSection.title}</h2>
        <p className={styles.lead}>{copy.location.intro}</p>
        <div className={styles.mapWrap} data-office-reveal>
          <iframe
            title={copy.locationSection.mapTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Encanto+Town+Ulaanbaatar&output=embed"
          />
        </div>
        <div className={styles.nearbyGrid}>
          {copy.location.nearby.map((place) => (
            <div key={place.name} className={styles.nearbyItem}>
              <strong>{place.name}</strong>
              <span>{place.time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OfficeFaqSection() {
  const copy = useTranslations().office;

  return (
    <section className={styles.sectionCream} id="faq">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{copy.faqSection.eyebrow}</p>
        <h2 className={styles.title}>{copy.faqSection.title}</h2>
        <div className={styles.faqList}>
          {copy.faq.map((item) => (
            <details key={item.q} className={styles.faqItem} data-office-reveal>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
