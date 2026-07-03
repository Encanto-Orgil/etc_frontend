"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  officeAmenities,
  officeBusinessIntro,
  officeCta,
  officeFaq,
  officeFeatures,
  officeGallery,
  officeInvestment,
  officeNearby,
  officeTypes,
  officeWhyStats,
} from "@/lib/officeContent";
import { officeLocation } from "@/lib/officeBrochure";
import styles from "./office.landing.module.css";

function useCountUp(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;
    const target = Number(el.dataset.count ?? "0");
    if (!target) return;

    let frame = 0;
    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled, ref]);
}

function StatCounter({ value, suffix, label }: { value: string; suffix: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isNumeric = /^\d+$/.test(value);
  useCountUp(ref, isNumeric);

  return (
    <div className={styles.statItem}>
      <span className={styles.statValue}>
        {isNumeric ? (
          <>
            <span ref={ref} data-count={value}>
              0
            </span>
            {suffix}
          </>
        ) : (
          value
        )}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

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
              <span className={styles.typeSize}>{type.size}</span>
              <p>{type.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OfficeAmenitiesSection() {
  return (
    <section className={styles.sectionDark} id="amenities">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Amenities</p>
        <h2 className={styles.title}>Everything Your Business Needs</h2>
        <div className={styles.amenitiesTrack} data-office-amenities>
          {officeAmenities.map((item) => (
            <figure key={item.title} className={styles.amenityCard}>
              <Image src={item.image} alt={item.title} width={560} height={700} />
              <span>{item.title}</span>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OfficeWhySection() {
  return (
    <section className={styles.sectionCream} id="why-choose">
      <div className={styles.inner}>
        <div className={styles.split}>
          <div data-office-reveal>
            <p className={styles.eyebrow}>Why Businesses Choose Encanto</p>
            <h2 className={styles.title}>A Tower Built for Leaders</h2>
            <div className={styles.statsGrid}>
              {officeWhyStats.map((stat) => (
                <StatCounter key={stat.label} {...stat} />
              ))}
            </div>
          </div>
          <div className={styles.splitImage} data-office-reveal>
            <Image
              src="/images/renders/render-8.jpg"
              alt="Encanto Trade Center exterior"
              width={900}
              height={700}
            />
          </div>
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

export function OfficeInvestmentSection() {
  return (
    <section className={styles.sectionDark} id="investment">
      <div className={styles.inner}>
        <div className={styles.investmentInner} data-office-reveal>
          <p className={styles.eyebrow}>Investment Opportunity</p>
          <h2 className={styles.title}>{officeInvestment.title}</h2>
          <p className={styles.lead}>{officeInvestment.body}</p>
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

export function OfficeCtaSection() {
  return (
    <section className={styles.ctaSection} id="cta">
      <div className={styles.ctaGlass} data-office-parallax aria-hidden />
      <div className={`${styles.inner} ${styles.ctaInner}`}>
        <h2 className={styles.title}>{officeCta.title}</h2>
        <p className={styles.lead}>{officeCta.body}</p>
        <div className={styles.ctaActions}>
          <Link href={officeCta.primary.href} className={styles.ctaPrimary}>
            {officeCta.primary.label}
          </Link>
          <Link href={officeCta.secondary.href} className={styles.ctaSecondary}>
            {officeCta.secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
