import { amenities } from "@/lib/homeContent";
import shared from "./home.shared.module.css";
import styles from "./AmenitiesScroll.module.css";

const marqueeItems = [...amenities, ...amenities];

export default function AmenitiesScroll() {
  return (
    <section className={`${shared.section} ${styles.section}`} id="amenities">
      <div className={shared.container}>
        <div className={styles.header} data-home-reveal>
          <p className={shared.eyebrow}>Amenities</p>
          <h2 className={shared.title}>Curated lifestyle experiences.</h2>
        </div>
      </div>

      <div className={styles.marquee} data-home-reveal aria-label="Amenities gallery">
        <div className={styles.marqueeTrack}>
          {marqueeItems.map((item, index) => (
            <article key={`${item.title}-${index}`} className={styles.card}>
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className={styles.cardOverlay}>
                <h3>{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
