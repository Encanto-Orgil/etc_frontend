import type { Metadata } from "next";
import NewsListView from "@/components/news/NewsListView";
import { fetchSiteNews } from "@/lib/api";
import { newsPageMetadata } from "@/lib/seo";

export const metadata: Metadata = newsPageMetadata();

export default async function NewsPage() {
  const articles = (await fetchSiteNews()) ?? [];
  return <NewsListView articles={articles} />;
}
