import Link from "next/link";
import type { PublicSiteNewsDetail } from "@/lib/siteNewsManagement";
import styles from "./NewsArticleView.module.css";

export default function NewsArticleView({ article }: { article: PublicSiteNewsDetail }) {
  return (
    <article className={styles.page}>
      <div className={styles.hero}>
        <img src={article.image} alt={article.title} className={styles.heroImage} />
        <div className={styles.heroOverlay} />
      </div>

      <div className={styles.container}>
        <Link href="/#news" className={styles.backLink}>
          ← Back to news
        </Link>

        <header className={styles.header}>
          <div className={styles.meta}>
            <span className={styles.category}>{article.category}</span>
            <time dateTime={article.published_at}>{article.date_label || article.date}</time>
          </div>
          <h1>{article.title}</h1>
          {article.excerpt ? <p className={styles.excerpt}>{article.excerpt}</p> : null}
        </header>

        {article.body ? (
          <div className={styles.body} dangerouslySetInnerHTML={{ __html: article.body }} />
        ) : article.excerpt ? (
          <div className={styles.body}>
            <p>{article.excerpt}</p>
          </div>
        ) : null}

        {article.external_url ? (
          <p className={styles.external}>
            <a href={article.external_url} target="_blank" rel="noreferrer">
              Read the original article
            </a>
          </p>
        ) : null}
      </div>
    </article>
  );
}
