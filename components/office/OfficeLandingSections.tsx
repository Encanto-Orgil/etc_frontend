"use client";

import Image from "next/image";
import Link from "next/link";
import {
  officeAmenities,
  officeAmenitiesSection,
  officeBusinessIntro,
  officeFaq,
  officeFeatures,
  officeGallery,
  officeNearby,
  officeTypes,
} from "@/lib/officeContent";
import { officeLocation } from "@/lib/officeBrochure";
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
  return (
    <section className={styles.sectionCream} id="business-starts">
      <div className={styles.inner}>
        <div className={styles.split}>
          <div className={styles.splitImage} data-office-reveal>
            <Image
              src={officeBusinessIntro.image}
              alt="Encanto Trade Center office interior"
              width={900}
              height={700}
            />
          </div>
          <div data-office-reveal>
            <p className={styles.eyebrow}>Business Starts Here</p>
            <h2 className={styles.title}>{officeBusinessIntro.title}</h2>
            <p className={styles.lead}>{officeBusinessIntro.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function OfficeTypesSection() {
  return (
    <section className={styles.sectionCream} id="office-types">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Available Office Types</p>
        <h2 className={styles.title}>Spaces for Every Scale</h2>
        <div className={styles.typeGrid}>
          {officeTypes.map((type) => (
            <article key={type.title} className={styles.typeCard} data-office-reveal>
              <h3>{type.title}</h3>
              <span className={styles.typeLevel}>LEVEL: {type.level}</span>
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
  return (
    <section className={`${styles.sectionDark} ${amenityStyles.section}`} id="amenities">
      <div className={amenityStyles.glow} aria-hidden />

      <div className={styles.inner}>
        <div className={amenityStyles.header} data-office-reveal>
          <div className={amenityStyles.headerCopy}>
            <p className={styles.eyebrow}>{officeAmenitiesSection.eyebrow}</p>
            <h2 className={`${styles.title} ${amenityStyles.title}`}>{officeAmenitiesSection.title}</h2>
          </div>
          <p className={amenityStyles.lead}>{officeAmenitiesSection.lead}</p>
        </div>

        <div className={amenityStyles.grid} data-office-reveal aria-label="Office amenities gallery">
          {officeAmenities.map((item, index) => {
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
                  alt={item.title}
                  fill
                  sizes="(max-width: 560px) 100vw, (max-width: 960px) 50vw, 25vw"
                  className={amenityStyles.image}
                />
                <div className={amenityStyles.overlay} aria-hidden />
                <div className={amenityStyles.cardBody}>
                  <span className={amenityStyles.index}>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p className={amenityStyles.description}>{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function OfficeFeaturesSection() {
  return (
    <section className={styles.sectionCream} id="features">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Office Features</p>
        <h2 className={styles.title}>Engineered for Excellence</h2>
        <div className={styles.featureGrid}>
          {officeFeatures.map((feature) => (
            <div key={feature} className={styles.featureItem} data-office-reveal>
              {feature}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OfficeLocationSection() {
  return (
    <section className={styles.sectionDark} id="location">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Location Advantage</p>
        <h2 className={styles.title}>At the Heart of the City</h2>
        <p className={styles.lead}>{officeLocation.intro}</p>
        <div className={styles.mapWrap} data-office-reveal>
          <iframe
            title="Encanto Trade Center location"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Encanto+Town+Ulaanbaatar&output=embed"
          />
        </div>
        <div className={styles.nearbyGrid}>
          {officeNearby.map((place) => (
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

export function OfficeGallerySection() {
  return (
    <section className={styles.sectionCream} id="gallery">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Gallery</p>
        <h2 className={styles.title}>Experience the Space</h2>
        <div className={styles.galleryGrid}>
          {officeGallery.map((item) => (
            <figure
              key={item.title}
              className={`${styles.galleryItem} ${item.wide ? styles.galleryWide : ""} ${item.tall ? styles.galleryTall : ""}`}
              data-office-reveal
            >
              <Image src={item.image} alt={item.title} width={800} height={600} />
              <span>{item.title}</span>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OfficeFaqSection() {
  return (
    <section className={styles.sectionCream} id="faq">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>FAQ</p>
        <h2 className={styles.title}>Common Questions</h2>
        <div className={styles.faqList}>
          {officeFaq.map((item) => (
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
