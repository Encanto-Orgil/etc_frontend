import { fetchSiteNews } from "@/lib/api";
import { newsItems as fallbackNews } from "@/lib/homeContent";
import NewsSectionView from "./NewsSectionView";

export default async function NewsSection() {
  const apiNews = await fetchSiteNews();
  const items =
    apiNews && apiNews.length
      ? apiNews.map((item) => ({
          category: item.category,
          title: item.title,
          date: item.date,
          image: item.image,
          excerpt: item.excerpt || undefined,
        }))
      : fallbackNews;

  if (!items.length) {
    return null;
  }

  return <NewsSectionView items={items} />;
}
