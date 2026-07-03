import { galleryItems } from "@/lib/homeContent";
import shared from "./home.shared.module.css";
import styles from "./GalleryMasonry.module.css";

export default function GalleryMasonry() {
  return (
    <section className={shared.section} id="gallery">
      <div className={shared.container}>
        <div className={styles.header} data-home-reveal>
          <p className={shared.eyebrow}>Gallery</p>
          <h2 className={shared.title}>Visual journey through Encanto.</h2>
        </div>

        <div className={styles.grid}>
          {galleryItems.map((item) => (
            <figure
              key={item.title}
              className={`${styles.item} ${item.tall ? styles.tall : ""} ${item.wide ? styles.wide : ""}`}
              data-home-reveal
            >
              <img src={item.image} alt={item.title} loading="lazy" />
              <figcaption>{item.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
