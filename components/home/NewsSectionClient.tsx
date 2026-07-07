"use client";

import { useEffect, useState } from "react";
import { fetchSiteNewsClient } from "@/lib/api";
import type { NewsItem } from "@/lib/i18n/types";
import type { PublicSiteNewsItem } from "@/lib/siteNewsManagement";
import NewsSectionView from "./NewsSectionView";

function mapNewsItem(item: PublicSiteNewsItem): NewsItem {
  return {
    category: item.category,
    title: item.title,
    date: item.date,
    image: item.image,
    excerpt: item.excerpt || undefined,
    url: item.external_url || undefined,
  };
}

export default function NewsSection() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchSiteNewsClient()
      .then((articles) => {
        if (!active) return;
        setItems(articles.map(mapNewsItem));
      })
      .catch(() => {
        if (!active) return;
        setItems([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading || !items.length) {
    return null;
  }

  return <NewsSectionView items={items} />;
}
