import { authFetch } from "./auth";

export type SiteNewsArticle = {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  published_at: string;
  date_label: string;
  is_published: boolean;
  is_featured: boolean;
  external_url?: string;
  created_at: string;
  updated_at: string;
};

export type PublicSiteNewsItem = {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  is_featured: boolean;
  external_url?: string;
};

type ListEnvelope<T> = T[] | { results: T[] };
type Query = Record<string, string | number | boolean | null | undefined>;

function queryString(query?: Query) {
  const params = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "" || value === "all") return;
    params.set(key, String(value));
  });
  const text = params.toString();
  return text ? `?${text}` : "";
}

function unwrapList<T>(data: ListEnvelope<T>): T[] {
  return Array.isArray(data) ? data : data.results;
}

async function parseError(res: Response, fallback: string) {
  const data = await res.json().catch(() => ({}));
  if (typeof data.detail === "string") return data.detail;
  const first = Object.values(data).flat()[0];
  if (typeof first === "string") return first;
  return fallback;
}

async function fetchList<T>(path: string, query?: Query): Promise<T[]> {
  const res = await authFetch(`${path}${queryString(query)}`);
  if (!res.ok) throw new Error(await parseError(res, "Failed to load news."));
  return unwrapList<T>(await res.json());
}

async function fetchOne<T>(path: string, init?: RequestInit, fallback = "Request failed."): Promise<T> {
  const res = await authFetch(path, init);
  if (!res.ok) throw new Error(await parseError(res, fallback));
  return res.json();
}

async function send<T>(path: string, method: "POST" | "PATCH", payload: object, fallback: string) {
  return fetchOne<T>(path, { method, body: JSON.stringify(payload) }, fallback);
}

async function remove(path: string, fallback: string) {
  const res = await authFetch(path, { method: "DELETE" });
  if (!res.ok) throw new Error(await parseError(res, fallback));
}

export function fetchDashboardSiteNews(query?: Query) {
  return fetchList<SiteNewsArticle>("/dashboard/site/news/", query);
}

export function createDashboardSiteNews(payload: {
  category: string;
  title: string;
  excerpt?: string;
  image: string;
  published_at: string;
  is_published?: boolean;
  is_featured?: boolean;
}) {
  return send<SiteNewsArticle>("/dashboard/site/news/", "POST", payload, "Failed to create news article.");
}

export function updateDashboardSiteNews(
  id: number,
  payload: Partial<{
    category: string;
    title: string;
    excerpt: string;
    image: string;
    published_at: string;
    is_published: boolean;
    is_featured: boolean;
  }>,
) {
  return send<SiteNewsArticle>(`/dashboard/site/news/${id}/`, "PATCH", payload, "Failed to update news article.");
}

export function deleteDashboardSiteNews(id: number) {
  return remove(`/dashboard/site/news/${id}/`, "Failed to delete news article.");
}
