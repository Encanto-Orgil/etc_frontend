import type { NewsItem } from "@/lib/homeContent";
import shared from "./home.shared.module.css";
import styles from "./NewsSection.module.css";

export default function NewsSectionView({ items }: { items: NewsItem[] }) {
  const [featured, ...rest] = items;

  return (
    <section className={shared.section} id="news">
      <div className={shared.container}>
        <div className={styles.header} data-home-reveal>
          <div>
            <p className={shared.eyebrow}>Latest News</p>
            <h2 className={shared.title}>Updates from Encanto.</h2>
          </div>
          <p className={styles.headerNote}>Featured story and recent announcements from the project.</p>
        </div>

        <div className={styles.layout}>
          <article className={styles.featured} data-home-reveal>
            <div className={styles.featuredMedia}>
              <img src={featured.image} alt={featured.title} loading="eager" />
              <div className={styles.featuredOverlay} />
              <div className={styles.featuredContent}>
                <div className={styles.featuredMeta}>
                  <span className={styles.category}>{featured.category}</span>
                  <time>{featured.date}</time>
                </div>
                <h3>{featured.title}</h3>
                {featured.excerpt ? <p className={styles.excerpt}>{featured.excerpt}</p> : null}
              </div>
            </div>
          </article>

          <div className={styles.secondaryList}>
            {rest.map((item) => (
              <article key={`${item.title}-${item.date}`} className={styles.compact} data-home-reveal>
                <div className={styles.compactMedia}>
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <div className={styles.compactBody}>
                  <div className={styles.compactMeta}>
                    <span className={styles.category}>{item.category}</span>
                    <time>{item.date}</time>
                  </div>
                  <h3>{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
