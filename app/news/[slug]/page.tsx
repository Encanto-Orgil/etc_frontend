import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsArticleView from "@/components/news/NewsArticleView";
import { fetchSiteNewsDetail } from "@/lib/api";
import { newsArticleMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchSiteNewsDetail(slug);
  if (!article) {
    return { title: "News — Encanto Trade Center" };
  }
  return newsArticleMetadata(article);
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await fetchSiteNewsDetail(slug);
  if (!article) notFound();

  return <NewsArticleView article={article} />;
}
