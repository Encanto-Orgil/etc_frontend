import type { Metadata } from "next";
import { project, towers, type Tower } from "@/lib/data";
import { SITE_SECTION_NAV } from "@/lib/site-nav";

export const SITE_NAME = project.name;
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://encantotrade.mn";

const DEFAULT_OG_IMAGE = "/images/renders/render-8.jpg";

const DEFAULT_KEYWORDS = [
  "Encanto Trade Center",
  "ETC",
  "Баянзүрх",
  "Улаанбаатар",
  "оффис түрээс",
  "орон сууц",
  "худалдааны төв",
  "ballroom",
  "шилэн фасад",
  "barilga",
  "real estate Mongolia",
] as const;

type PageMetaInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  absoluteTitle?: boolean;
};

const TOWER_PAGE_TITLES: Partial<Record<string, string>> = {
  office: "Office — Define Your Business Value — Encanto Trade Center",
  mall: "Mall — Шилдэг брэндүүд нэг дор — Encanto Trade Center",
  ballroom: "Encanto Grand Ballroom",
};

function absoluteUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

function buildOpenGraph({
  title,
  description,
  path = "/",
  image = DEFAULT_OG_IMAGE,
}: PageMetaInput): Metadata["openGraph"] {
  return {
    type: "website",
    locale: "mn_MN",
    url: absoluteUrl(path),
    siteName: SITE_NAME,
    title,
    description,
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  };
}

function buildTwitter({
  title,
  description,
  image = DEFAULT_OG_IMAGE,
}: PageMetaInput): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title,
    description,
    images: [image],
  };
}

export function buildPageMetadata(input: PageMetaInput): Metadata {
  const {
    title,
    description,
    path = "/",
    keywords,
    noIndex = false,
    absoluteTitle = false,
  } = input;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: keywords ?? [...DEFAULT_KEYWORDS],
    alternates: {
      canonical: path,
    },
    openGraph: buildOpenGraph(input),
    twitter: buildTwitter(input),
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: project.intro,
  keywords: [...DEFAULT_KEYWORDS],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: buildOpenGraph({
    title: SITE_NAME,
    description: project.intro,
    path: "/",
    image: project.heroImage,
  }),
  twitter: buildTwitter({
    title: SITE_NAME,
    description: project.intro,
    image: project.heroImage,
  }),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export function homeMetadata(): Metadata {
  return buildPageMetadata({
    title: SITE_NAME,
    description: project.intro,
    path: "/",
    image: project.heroImage,
    absoluteTitle: true,
    keywords: [
      ...DEFAULT_KEYWORDS,
      "35 давхар",
      "135 метр",
      "Central Mall",
      "Sky Residence",
    ],
  });
}

export function towerMetadata(tower: Tower): Metadata {
  const customTitle = TOWER_PAGE_TITLES[tower.slug];
  const title = customTitle ?? `${tower.nameMn} — ${tower.tagline}`;
  const keywords = [
    ...DEFAULT_KEYWORDS,
    tower.name,
    tower.nameMn,
    tower.kind === "office" ? "Grade-A office" : "",
    tower.kind === "mall" ? "luxury mall" : "",
    tower.kind === "ballroom" ? "хурим танхим" : "",
    tower.kind === "apartment" ? "premium орон сууц" : "",
  ].filter(Boolean);

  return buildPageMetadata({
    title,
    description: tower.summary,
    path: `/${tower.slug}`,
    image: tower.heroImage,
    keywords,
    absoluteTitle: Boolean(customTitle),
  });
}

export const dashboardMetadata: Metadata = buildPageMetadata({
  title: "Удирдлага",
  description: "Encanto Trade Center түрээсийн удирдлагын систем.",
  path: "/dashboard",
  noIndex: true,
});

export const dashboardLoginMetadata: Metadata = buildPageMetadata({
  title: "Нэвтрэх",
  description: "Encanto Trade Center удирдлагын системд нэвтрэх.",
  path: "/dashboard/login",
  noIndex: true,
});

export function organizationJsonLd() {
  return {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/images/encanto-logo.png"),
    description: project.intro,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Улаанбаатар",
      addressRegion: "Баянзүрх дүүрэг",
      addressCountry: "MN",
      streetAddress: project.contactAddress,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: project.contactPhone,
      email: project.contactEmail,
      contactType: "sales",
      areaServed: "MN",
      availableLanguage: ["Mongolian", "English"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: ["Encantotrade.mn", "ETC"],
    url: SITE_URL,
    description: project.intro,
    inLanguage: "mn",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

export function siteNavigationJsonLd() {
  return SITE_SECTION_NAV.map((item, index) => ({
    "@type": "SiteNavigationElement",
    "@id": `${SITE_URL}${item.href}#navigation`,
    position: index + 1,
    name: item.label,
    url: absoluteUrl(item.href),
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
  }));
}

export function mainSectionsItemListJsonLd() {
  return {
    "@type": "ItemList",
    "@id": `${SITE_URL}/#main-sections`,
    name: `${SITE_NAME} — төслийн хэсгүүд`,
    itemListElement: SITE_SECTION_NAV.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: absoluteUrl(item.href),
    })),
  };
}

export function siteWideJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...organizationJsonLd(),
        "@id": `${SITE_URL}/#organization`,
      },
      websiteJsonLd(),
      ...siteNavigationJsonLd(),
      mainSectionsItemListJsonLd(),
    ],
  };
}

export function towerWebPageJsonLd(tower: Tower) {
  const pageUrl = absoluteUrl(`/${tower.slug}`);
  const sectionLabel =
    TOWER_PAGE_TITLES[tower.slug]?.split(" — ")[0] ??
    SITE_SECTION_NAV.find((item) => item.slug === tower.slug)?.label ??
    tower.nameMn;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: TOWER_PAGE_TITLES[tower.slug] ?? `${sectionLabel} — ${SITE_NAME}`,
        description: tower.summary,
        inLanguage: "mn",
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        about: {
          "@type": "Place",
          name: `${SITE_NAME} ${tower.name}`,
          description: tower.description,
          image: absoluteUrl(tower.heroImage),
          address: {
            "@type": "PostalAddress",
            addressLocality: "Улаанбаатар",
            addressRegion: "Баянзүрх дүүрэг",
            addressCountry: "MN",
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: SITE_NAME,
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: sectionLabel,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

export function homeListingJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${SITE_URL}/#listing`,
    name: SITE_NAME,
    description: project.intro,
    url: SITE_URL,
    image: absoluteUrl(project.heroImage),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Улаанбаатар",
      addressRegion: "Баянзүрх дүүрэг",
      addressCountry: "MN",
    },
  };
}

export function sitemapEntries() {
  const staticPages = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  ];

  const towerPages = towers.map((tower) => ({
    path: `/${tower.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...towerPages];
}
