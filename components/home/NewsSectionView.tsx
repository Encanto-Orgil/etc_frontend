"use client";

import type { NewsItem } from "@/lib/i18n/types";
import { useTranslations } from "@/lib/i18n";
import shared from "./home.shared.module.css";
import styles from "./NewsSection.module.css";

function NewsCard({
  item,
  variant,
}: {
  item: NewsItem;
  variant: "featured" | "compact";
}) {
  const content =
    variant === "featured" ? (
      <>
        <div className={styles.featuredMedia}>
          <img src={item.image} alt={item.title} loading="eager" />
        </div>
        <div className={styles.featuredBody}>
          <div className={styles.featuredMeta}>
            <span className={styles.category}>{item.category}</span>
            <time>{item.date}</time>
          </div>
          <h3>{item.title}</h3>
          {item.excerpt ? <p className={styles.excerpt}>{item.excerpt}</p> : null}
        </div>
      </>
    ) : (
      <>
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
      </>
    );

  if (!item.url) {
    return variant === "featured" ? (
      <article className={styles.featured}>{content}</article>
    ) : (
      <article className={styles.compact}>{content}</article>
    );
  }

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className={variant === "featured" ? styles.featuredLink : styles.compactLink}
    >
      {variant === "featured" ? (
        <article className={styles.featured}>{content}</article>
      ) : (
        <article className={styles.compact}>{content}</article>
      )}
    </a>
  );
}

export default function NewsSectionView({ items }: { items: NewsItem[] }) {
  const copy = useTranslations().home.news;
  const [featured, ...rest] = items;

  return (
    <section className={shared.section} id="news">
      <div className={shared.container}>
        <div className={styles.header} data-home-reveal>
          <div>
            <p className={shared.eyebrow}>{copy.eyebrow}</p>
            <h2 className={shared.title}>{copy.title}</h2>
          </div>
          <p className={styles.headerNote}>{copy.headerNote}</p>
        </div>

        <div className={styles.layout}>
          <div data-home-reveal>
            <NewsCard item={featured} variant="featured" />
          </div>

          <div className={styles.secondaryList}>
            {rest.map((item) => (
              <div key={`${item.title}-${item.date}`} data-home-reveal>
                <NewsCard item={item} variant="compact" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
