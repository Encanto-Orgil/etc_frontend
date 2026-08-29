"use client";

import Link from "next/link";
import type { PublicSiteNewsItem } from "@/lib/siteNewsManagement";
import { useTranslations } from "@/lib/i18n";
import styles from "./NewsListView.module.css";

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

function articleHref(item: PublicSiteNewsItem) {
  if (item.external_url) return item.external_url;
  if (item.slug) return `/news/${item.slug}`;
  return undefined;
}

function NewsCard({
  item,
  featured = false,
}: {
  item: PublicSiteNewsItem;
  featured?: boolean;
}) {
  const href = articleHref(item);
  const cardClass = featured ? styles.featuredCard : styles.card;

  const content = (
    <article className={cardClass}>
      <div className={featured ? styles.featuredMedia : styles.cardMedia}>
        <img src={item.image} alt={item.title} loading={featured ? "eager" : "lazy"} />
      </div>
      <div className={featured ? styles.featuredBody : styles.cardBody}>
        <div className={styles.meta}>
          <span className={styles.category}>{item.category}</span>
          <time>{item.date}</time>
        </div>
        <h2 className={featured ? styles.featuredTitle : styles.cardTitle}>{item.title}</h2>
        {item.excerpt ? <p className={styles.excerpt}>{item.excerpt}</p> : null}
      </div>
    </article>
  );

  if (!href) return content;

  if (isExternalUrl(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={styles.cardLink}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={styles.cardLink}>
      {content}
    </Link>
  );
}

export default function NewsListView({ articles }: { articles: PublicSiteNewsItem[] }) {
  const copy = useTranslations().newsPage;
  const [featured, ...rest] = articles;

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <Link href="/" className={styles.backHome}>
            {copy.backHome}
          </Link>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h1 className={styles.title}>{copy.title}</h1>
          <p className={styles.lead}>{copy.lead}</p>
        </div>
      </header>

      <div className={styles.container}>
        {articles.length === 0 ? (
          <p className={styles.empty}>{copy.empty}</p>
        ) : (
          <>
            {featured ? (
              <div className={styles.featuredWrap}>
                <NewsCard item={featured} featured />
              </div>
            ) : null}

            {rest.length > 0 ? (
              <div className={styles.grid}>
                {rest.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
