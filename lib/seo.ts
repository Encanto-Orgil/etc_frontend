import type { Metadata, Viewport } from "next";
import { project, towers, type Tower } from "@/lib/data";
import { assetUrl } from "@/lib/image";
import { SITE_SECTION_NAV } from "@/lib/site-nav";

export const SITE_NAME = project.name;
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://encantotrade.mn";

export const HOME_PAGE_TITLE =
  "Encanto Trade Center — Luxury Office, Mall, Ballroom & Residence in Ulaanbaatar";

/** Meta/OG only — keep under ~160 characters for search snippets */
export const HOME_PAGE_DESCRIPTION =
  "Mongolia's tallest steel-frame tower in Bayanzurkh, Ulaanbaatar — premium office, Central Mall, Grand Ballroom, and luxury residences at Encanto Trade Center.";

const DEFAULT_OG_IMAGE = assetUrl("/images/renders/render-8.jpg");

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

export const OFFICE_PAGE_TITLE =
  "Premium Office Spaces in Ulaanbaatar, Mongolia — Encanto Trade Center";

export const OFFICE_PAGE_DESCRIPTION =
  "Mongolia's tallest Grade-A office tower — luxury premium workspaces with 4.5 m ceilings, YUANDA glass facade, FUJITEC smart elevators, and 1,500 parking spaces in Ulaanbaatar.";

const OFFICE_KEYWORDS = [
  ...DEFAULT_KEYWORDS,
  "office leasing Mongolia",
  "office leasing Ulaanbaatar",
  "office rent Mongolia",
  "office rent Ulaanbaatar",
  "luxury office Ulaanbaatar",
  "luxury office Mongolia",
  "Grade-A office",
  "Grade-A office Mongolia",
  "commercial office space Ulaanbaatar",
  "office space for rent",
  "Encanto office",
  "оффис түрээс Улаанбаатар",
  "оффис түрээс",
] as const;

export const BALLROOM_PAGE_TITLE =
  "Encanto Grand Ballroom | Luxury Event Venue in Ulaanbaatar, Mongolia";

export const BALLROOM_PAGE_DESCRIPTION =
  "A world-class 1,600 m² ballroom and luxury event hall in Ulaanbaatar — premium venue for weddings, galas, New Year celebrations, conferences, and corporate events with 7.6 m ceilings and Skyfold flexible halls.";

const BALLROOM_KEYWORDS = [
  ...DEFAULT_KEYWORDS,
  "Encanto Grand Ballroom",
  "Ballroom",
  "ballroom Ulaanbaatar",
  "ballroom Mongolia",
  "Event hall",
  "event hall Ulaanbaatar",
  "event hall Mongolia",
  "Event room",
  "event room Ulaanbaatar",
  "event room Mongolia",
  "wedding venue Ulaanbaatar",
  "wedding venue Mongolia",
  "event venue Ulaanbaatar",
  "event venue Mongolia",
  "luxury ballroom Ulaanbaatar",
  "luxury event hall Ulaanbaatar",
  "luxury event venue Mongolia",
  "gala venue Ulaanbaatar",
  "conference venue Ulaanbaatar",
  "corporate event venue Mongolia",
  "banquet hall Ulaanbaatar",
  "function hall Ulaanbaatar",
  "хурим танхим",
  "хурим танхим Улаанбаатар",
  "ёслолын танхим",
  "ёслолын танхим Улаанбаатар",
  "event space Ulaanbaatar",
  // New Year & year-end season (Dec–Jan peak search)
  "New Year party venue Ulaanbaatar",
  "New Year event venue Mongolia",
  "New Year gala Ulaanbaatar",
  "NYE venue Ulaanbaatar",
  "corporate New Year party Ulaanbaatar",
  "year end party venue Ulaanbaatar",
  "holiday party venue Mongolia",
  "Christmas party venue Ulaanbaatar",
  "шинэ жилийн ёслол",
  "шинэ жилийн ёслол танхим",
  "шинэ жилийн танхим Улаанбаатар",
  "шинэ жилийн баяр танхим",
  "шинэ жилийн танхим түрээс",
  "компанийн шинэ жилийн ёслол",
  "жилийн төгсгөлийн ёслол танхим",
  "шинэ жилийн корпорат ёслол",
] as const;

export const MALL_PAGE_TITLE =
  "Encanto Trade Center Mall | Premium Retail & Shopping in Ulaanbaatar, Mongolia";

export const MALL_PAGE_DESCRIPTION =
  "Six floors of premium retail at Encanto Trade Center Mall in Ulaanbaatar — international luxury brands, gastronomy, and entertainment in a naturally lit atrium with 200+ stores, 8-level parking, and direct glass-bridge access to Encanto office and residence towers.";

const MALL_KEYWORDS = [
  ...DEFAULT_KEYWORDS,
  "Central Mall",
  "Central Mall Ulaanbaatar",
  "Encanto Mall",
  "Encanto Trade Center Mall",
  "shopping mall Ulaanbaatar",
  "shopping mall Mongolia",
  "shopping center Ulaanbaatar",
  "shopping center Mongolia",
  "luxury mall Ulaanbaatar",
  "luxury mall Mongolia",
  "premium retail Ulaanbaatar",
  "premium shopping Mongolia",
  "retail space for lease Ulaanbaatar",
  "retail space for rent Mongolia",
  "retail leasing Ulaanbaatar",
  "retail leasing Mongolia",
  "mall tenant space Ulaanbaatar",
  "store for rent Ulaanbaatar",
  "commercial retail space Mongolia",
  "flagship store Ulaanbaatar",
  "luxury brands mall Ulaanbaatar",
  "food court Ulaanbaatar",
  "retail podium Ulaanbaatar",
  "Bayanzurkh shopping mall",
  "худалдааны төв Улаанбаатар",
  "худалдааны төв",
  "дэлгүүр түрээс",
  "дэлгүүр түрээс Улаанбаатар",
  "tenant space mall Mongolia",
] as const;

export const RESIDENCE_PAGE_TITLE =
  "Encanto Trade Center - Residence | Luxury Apartments in Ulaanbaatar, Mongolia";

export const RESIDENCE_PAGE_DESCRIPTION =
  "A 34-floor luxury residential tower in Ulaanbaatar — panoramic skyline views, premium finishes, smart-home systems, concierge service, and direct access to Encanto Mall, Office, and Grand Ballroom. Reservations open on floors 10–30.";

const RESIDENCE_KEYWORDS = [
  ...DEFAULT_KEYWORDS,
  "Encanto Residence",
  "Encanto Trade Center - Residence",
  "luxury apartments Ulaanbaatar",
  "luxury apartments Mongolia",
  "premium residence Ulaanbaatar",
  "premium residence Mongolia",
  "luxury condo Ulaanbaatar",
  "new apartment Ulaanbaatar",
  "new apartment Mongolia",
  "apartment for sale Ulaanbaatar",
  "apartment for sale Mongolia",
  "skyline apartments Ulaanbaatar",
  "smart home apartment Mongolia",
  "high-rise residence Ulaanbaatar",
  "panoramic view apartment Mongolia",
  "Grade-A residence Ulaanbaatar",
  "Bayanzurkh apartment",
  "орон сууц Улаанбаатар",
  "тансаг орон сууц",
  "шинэ орон сууц",
  "орон сууц худалдан авах",
  "premium орон сууц",
] as const;

/** FAQ content for JSON-LD only — not shown on the residence page */
const RESIDENCE_FAQ = [
  {
    q: "Are reservations open?",
    a: "Yes. Reservations are open on floors 10–30 with Type A and Type B layouts, two units per floor.",
  },
  {
    q: "When is completion scheduled?",
    a: "Encanto Trade Center - Residence is scheduled for completion in Q4 2027.",
  },
  {
    q: "What unit types are available?",
    a: "Type A offers north, south, and east-facing orientations. Type B offers north and south-facing layouts.",
  },
  {
    q: "Is parking included?",
    a: "Yes. Accessible dedicated parking is available for every unit.",
  },
  {
    q: "What amenities are included?",
    a: "Residents enjoy concierge service, fitness center, sky lounge, smart-home systems, 24/7 security, and direct access to Encanto Mall, Office, and Grand Ballroom.",
  },
] as const;

const TOWER_PAGE_TITLES: Partial<Record<string, string>> = {
  office: OFFICE_PAGE_TITLE,
  mall: MALL_PAGE_TITLE,
  ballroom: BALLROOM_PAGE_TITLE,
  residence: RESIDENCE_PAGE_TITLE,
};

export function canonicalUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

function absoluteUrl(path: string) {
  return canonicalUrl(path);
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

function buildAlternates(path: string): Metadata["alternates"] {
  const url = canonicalUrl(path);
  return {
    canonical: url,
    languages: {
      en: url,
      mn: url,
      "x-default": url,
    },
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
    image,
  } = input;

  const metaInput: PageMetaInput = {
    ...input,
    image: image ? assetUrl(image) : undefined,
  };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: keywords ?? [...DEFAULT_KEYWORDS],
    alternates: buildAlternates(path),
    openGraph: buildOpenGraph(metaInput),
    twitter: buildTwitter(metaInput),
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
  description: HOME_PAGE_DESCRIPTION,
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
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_DESCRIPTION,
    path: "/",
    image: project.heroImage,
  }),
  twitter: buildTwitter({
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_DESCRIPTION,
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
  alternates: buildAlternates("/"),
};

export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export function homeMetadata(): Metadata {
  return buildPageMetadata({
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_DESCRIPTION,
    path: "/",
    image: project.heroImage,
    absoluteTitle: true,
    keywords: [
      ...DEFAULT_KEYWORDS,
      "35 давхар",
      "135 метр",
      "Central Mall",
      "Encanto Trade Center - Residence",
    ],
  });
}

export function towerMetadata(tower: Tower): Metadata {
  if (tower.slug === "office") {
    return buildPageMetadata({
      title: OFFICE_PAGE_TITLE,
      description: OFFICE_PAGE_DESCRIPTION,
      path: "/office",
      image: tower.heroImage,
      keywords: [...OFFICE_KEYWORDS],
      absoluteTitle: true,
    });
  }

  if (tower.slug === "ballroom") {
    return buildPageMetadata({
      title: BALLROOM_PAGE_TITLE,
      description: BALLROOM_PAGE_DESCRIPTION,
      path: "/ballroom",
      image: tower.heroImage,
      keywords: [...BALLROOM_KEYWORDS],
      absoluteTitle: true,
    });
  }

  if (tower.slug === "mall") {
    return buildPageMetadata({
      title: MALL_PAGE_TITLE,
      description: MALL_PAGE_DESCRIPTION,
      path: "/mall",
      image: tower.heroImage,
      keywords: [...MALL_KEYWORDS],
      absoluteTitle: true,
    });
  }

  if (tower.slug === "residence") {
    return buildPageMetadata({
      title: RESIDENCE_PAGE_TITLE,
      description: RESIDENCE_PAGE_DESCRIPTION,
      path: "/residence",
      image: tower.heroImage,
      keywords: [...RESIDENCE_KEYWORDS],
      absoluteTitle: true,
    });
  }

  const customTitle = TOWER_PAGE_TITLES[tower.slug];
  const title = customTitle ?? `${tower.nameMn} — ${tower.tagline}`;
  const keywords = [
    ...DEFAULT_KEYWORDS,
    tower.name,
    tower.nameMn,
    tower.kind === "mall" ? "luxury mall" : "",
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

function privatePageMetadata(
  path: string,
  title: string,
  description: string,
): Metadata {
  return buildPageMetadata({
    title,
    description,
    path,
    noIndex: true,
  });
}

export function dashboardPageMetadata(path: string): Metadata {
  return privatePageMetadata(
    path,
    "Удирдлага",
    "Encanto Trade Center түрээсийн удирдлагын систем.",
  );
}

export const dashboardMetadata: Metadata = dashboardPageMetadata("/dashboard");

export const dashboardLoginMetadata: Metadata = privatePageMetadata(
  "/dashboard/login",
  "Нэвтрэх",
  "Encanto Trade Center удирдлагын системд нэвтрэх.",
);

export function portalPageMetadata(path: string): Metadata {
  return privatePageMetadata(
    path,
    "Tenant Portal",
    "Encanto Trade Center түрээслэгчийн портал.",
  );
}

export const portalLoginMetadata: Metadata = privatePageMetadata(
  "/portal/login",
  "Нэвтрэх",
  "Encanto Trade Center түрээслэгчийн порталд нэвтрэх.",
);

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

function towerEntityId(tower: Tower): string {
  const pageUrl = absoluteUrl(`/${tower.slug}`);
  switch (tower.kind) {
    case "office":
      return `${pageUrl}#listing`;
    case "mall":
      return `${pageUrl}#shopping-center`;
    case "ballroom":
      return `${pageUrl}#venue`;
    case "apartment":
      return `${pageUrl}#residence`;
  }
}

export function mainSectionsItemListJsonLd() {
  return {
    "@type": "ItemList",
    "@id": `${SITE_URL}/#main-sections`,
    name: `${SITE_NAME} — Office, Mall, Ballroom & Residence`,
    description:
      "Premium office, retail mall, event ballroom, and luxury residences at Encanto Trade Center, Ulaanbaatar.",
    itemListElement: SITE_SECTION_NAV.map((item, index) => {
      const tower = towers.find((t) => t.slug === item.slug);
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        url: absoluteUrl(item.href),
        ...(tower ? { item: { "@id": towerEntityId(tower) } } : {}),
      };
    }),
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
  const isOffice = tower.slug === "office";
  const isBallroom = tower.slug === "ballroom";
  const isMall = tower.slug === "mall";
  const isResidence = tower.slug === "residence";
  const sectionLabel = isOffice
    ? "Office"
    : isBallroom
      ? "Ballroom"
      : isMall
        ? "Mall"
        : isResidence
          ? "Residence"
          : TOWER_PAGE_TITLES[tower.slug]?.split(" — ")[0] ??
            TOWER_PAGE_TITLES[tower.slug]?.split(" | ")[0] ??
            SITE_SECTION_NAV.find((item) => item.slug === tower.slug)?.label ??
            tower.nameMn;
  const pageName = isOffice
    ? OFFICE_PAGE_TITLE
    : isBallroom
      ? BALLROOM_PAGE_TITLE
      : isMall
        ? MALL_PAGE_TITLE
        : isResidence
          ? RESIDENCE_PAGE_TITLE
          : TOWER_PAGE_TITLES[tower.slug] ?? `${sectionLabel} — ${SITE_NAME}`;
  const pageDescription = isOffice
    ? OFFICE_PAGE_DESCRIPTION
    : isBallroom
      ? BALLROOM_PAGE_DESCRIPTION
      : isMall
        ? MALL_PAGE_DESCRIPTION
        : isResidence
          ? RESIDENCE_PAGE_DESCRIPTION
          : tower.summary;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageName,
        description: pageDescription,
        inLanguage: ["en", "mn"],
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
            addressLocality: "Ulaanbaatar",
            addressRegion: "Bayanzurkh District",
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

function postalAddressJsonLd() {
  return {
    "@type": "PostalAddress" as const,
    addressLocality: "Ulaanbaatar",
    addressRegion: "Bayanzurkh District",
    addressCountry: "MN",
    streetAddress: project.contactAddress,
  };
}

export function officeTowerJsonLd(
  tower: Tower,
  faq: readonly { q: string; a: string }[] = [],
) {
  const pageUrl = absoluteUrl("/office");
  const baseGraph = (towerWebPageJsonLd(tower)["@graph"] as Record<string, unknown>[]).map(
    (node) => {
      if (node["@type"] === "WebPage") {
        return {
          ...node,
          about: { "@id": `${pageUrl}#listing` },
          mainEntity: { "@id": `${pageUrl}#listing` },
        };
      }
      return node;
    },
  );

  const listing = {
    "@type": "RealEstateListing",
    "@id": `${pageUrl}#listing`,
    name: "Premium Office Spaces — Encanto Trade Center",
    alternateName: [
      "Grade-A Office Ulaanbaatar",
      "Luxury Office Mongolia",
      "Encanto Office Tower",
    ],
    description: OFFICE_PAGE_DESCRIPTION,
    url: pageUrl,
    image: absoluteUrl(tower.heroImage),
    address: postalAddressJsonLd(),
    offers: {
      "@type": "Offer",
      businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
      category: "Office space for rent",
      areaServed: [
        {
          "@type": "City",
          name: "Ulaanbaatar",
          containedInPlace: {
            "@type": "Country",
            name: "Mongolia",
          },
        },
        {
          "@type": "Country",
          name: "Mongolia",
        },
      ],
    },
  };

  const faqNode =
    faq.length > 0
      ? {
          "@type": "FAQPage",
          "@id": `${pageUrl}#faq`,
          isPartOf: { "@id": `${pageUrl}#webpage` },
          mainEntity: faq.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: {
              "@type": "Answer",
              text: a,
            },
          })),
        }
      : null;

  return {
    "@context": "https://schema.org",
    "@graph": [...baseGraph, listing, ...(faqNode ? [faqNode] : [])],
  };
}

export function pageFaqJsonLd(
  path: string,
  faq: readonly { q: string; a: string }[],
) {
  const pageUrl = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };
}

export function officeFaqJsonLd(faq: readonly { q: string; a: string }[]) {
  return pageFaqJsonLd("/office", faq);
}

export function ballroomFaqJsonLd(
  faq: readonly { q: string; a: string }[],
) {
  return pageFaqJsonLd("/ballroom", faq);
}

export function mallFaqJsonLd(faq: readonly { q: string; a: string }[]) {
  return pageFaqJsonLd("/mall", faq);
}

export function mallTowerJsonLd(
  tower: Tower,
  faq: readonly { q: string; a: string }[] = [],
) {
  const pageUrl = absoluteUrl("/mall");
  const baseGraph = (towerWebPageJsonLd(tower)["@graph"] as Record<string, unknown>[]).map(
    (node) => {
      if (node["@type"] === "WebPage") {
        return {
          ...node,
          about: { "@id": `${pageUrl}#shopping-center` },
          mainEntity: { "@id": `${pageUrl}#shopping-center` },
        };
      }
      return node;
    },
  );

  const shoppingCenter = {
    "@type": "ShoppingCenter",
    "@id": `${pageUrl}#shopping-center`,
    name: "Encanto Trade Center Mall",
    alternateName: [
      "Encanto Mall",
      "Central Mall",
      "Central Mall Ulaanbaatar",
      "Luxury Shopping Ulaanbaatar",
      "Premium Retail Mongolia",
      "Shopping Center Ulaanbaatar",
      "Shopping Center Mongolia",
      "Shopping Center Bayanzurkh District",
      "Shopping Center Ulaanbaatar Bayanzurkh District",
      "Shopping Center Ulaanbaatar Bayanzurkh District",
      "Central Shopping Center Ulaanbaatar",
    ],
    description: MALL_PAGE_DESCRIPTION,
    url: pageUrl,
    image: absoluteUrl(tower.heroImage),
    address: postalAddressJsonLd(),
    telephone: project.contactPhone,
    email: project.contactEmail,
    numberOfStores: 200,
    knowsAbout: [
      "International luxury brands",
      "Premium retail",
      "Gastronomy and dining",
      "Entertainment and cinema",
      "Food court",
      "Family-friendly retail",
      "Flagship stores",
    ],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Central atrium", value: true },
      { "@type": "LocationFeatureSpecification", name: "Naturally lit passages", value: true },
      { "@type": "LocationFeatureSpecification", name: "8-level parking", value: true },
      { "@type": "LocationFeatureSpecification", name: "Glass bridge to office tower", value: true },
      { "@type": "LocationFeatureSpecification", name: "Hypermarket B1–B2", value: true },
    ],
    containedInPlace: {
      "@type": "Place",
      name: SITE_NAME,
      url: SITE_URL,
      address: postalAddressJsonLd(),
    },
    areaServed: [
      {
        "@type": "City",
        name: "Ulaanbaatar",
        containedInPlace: {
          "@type": "Country",
          name: "Mongolia",
        },
      },
      {
        "@type": "Country",
        name: "Mongolia",
      },
    ],
    makesOffer: {
      "@type": "Offer",
      name: "Retail space & mall tenant leasing",
      description:
        "Premium retail and tenant space for lease at Encanto Trade Center Mall — luxury brands, restaurants, food court, and service operators in Ulaanbaatar.",
      url: `${pageUrl}#contact`,
      businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
      category: "Retail space for lease",
      areaServed: {
        "@type": "City",
        name: "Ulaanbaatar",
      },
    },
  };

  const faqNode =
    faq.length > 0
      ? {
          "@type": "FAQPage",
          "@id": `${pageUrl}#faq`,
          isPartOf: { "@id": `${pageUrl}#webpage` },
          mainEntity: faq.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: {
              "@type": "Answer",
              text: a,
            },
          })),
        }
      : null;

  return {
    "@context": "https://schema.org",
    "@graph": [...baseGraph, shoppingCenter, ...(faqNode ? [faqNode] : [])],
  };
}

export function residenceFaqJsonLd(
  faq: readonly { q: string; a: string }[] = RESIDENCE_FAQ,
) {
  return pageFaqJsonLd("/residence", faq);
}

export function residenceTowerJsonLd(
  tower: Tower,
  faq: readonly { q: string; a: string }[] = RESIDENCE_FAQ,
) {
  const pageUrl = absoluteUrl("/residence");
  const baseGraph = (towerWebPageJsonLd(tower)["@graph"] as Record<string, unknown>[]).map(
    (node) => {
      if (node["@type"] === "WebPage") {
        return {
          ...node,
          about: { "@id": `${pageUrl}#residence` },
          mainEntity: { "@id": `${pageUrl}#residence` },
        };
      }
      return node;
    },
  );

  const apartmentComplex = {
    "@type": "ApartmentComplex",
    "@id": `${pageUrl}#residence`,
    name: "Encanto Trade Center - Residence",
    alternateName: [
      "Encanto Residence",
      "Luxury Apartments Ulaanbaatar",
      "Premium Residence Mongolia",
      "Skyline Apartments Ulaanbaatar",
    ],
    description: RESIDENCE_PAGE_DESCRIPTION,
    url: pageUrl,
    image: absoluteUrl(tower.heroImage),
    address: postalAddressJsonLd(),
    telephone: project.contactPhone,
    email: project.contactEmail,
    numberOfBedrooms: { "@type": "QuantitativeValue", minValue: 1 },
    numberOfAccommodationUnits: 42,
    knowsAbout: [
      "Luxury residential living",
      "Panoramic city views",
      "Smart home systems",
      "Concierge service",
      "Premium interior finishes",
      "High-rise apartments",
    ],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Concierge service", value: true },
      { "@type": "LocationFeatureSpecification", name: "Fitness center", value: true },
      { "@type": "LocationFeatureSpecification", name: "Sky lounge", value: true },
      { "@type": "LocationFeatureSpecification", name: "Smart home system", value: true },
      { "@type": "LocationFeatureSpecification", name: "24/7 security", value: true },
      { "@type": "LocationFeatureSpecification", name: "Dedicated parking", value: true },
      { "@type": "LocationFeatureSpecification", name: "Direct mall access", value: true },
    ],
    containedInPlace: {
      "@type": "Place",
      name: SITE_NAME,
      url: SITE_URL,
      address: postalAddressJsonLd(),
    },
    areaServed: [
      {
        "@type": "City",
        name: "Ulaanbaatar",
        containedInPlace: {
          "@type": "Country",
          name: "Mongolia",
        },
      },
      {
        "@type": "Country",
        name: "Mongolia",
      },
    ],
    makesOffer: {
      "@type": "Offer",
      name: "Luxury apartment reservations",
      description:
        "Premium residential apartments for reservation on floors 10–30 — Type A and Type B layouts with panoramic views in Ulaanbaatar.",
      url: `${pageUrl}#contact`,
      category: "Luxury residential apartments",
      areaServed: {
        "@type": "City",
        name: "Ulaanbaatar",
      },
    },
  };

  const faqNode =
    faq.length > 0
      ? {
          "@type": "FAQPage",
          "@id": `${pageUrl}#faq`,
          isPartOf: { "@id": `${pageUrl}#webpage` },
          mainEntity: faq.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: {
              "@type": "Answer",
              text: a,
            },
          })),
        }
      : null;

  return {
    "@context": "https://schema.org",
    "@graph": [...baseGraph, apartmentComplex, ...(faqNode ? [faqNode] : [])],
  };
}

export function ballroomTowerJsonLd(
  tower: Tower,
  faq: readonly { q: string; a: string }[] = [],
) {
  const pageUrl = absoluteUrl("/ballroom");
  const baseGraph = (towerWebPageJsonLd(tower)["@graph"] as Record<string, unknown>[]).map(
    (node) => {
      if (node["@type"] === "WebPage") {
        return {
          ...node,
          about: { "@id": `${pageUrl}#venue` },
          mainEntity: { "@id": `${pageUrl}#venue` },
        };
      }
      return node;
    },
  );

  const venue = {
    "@type": "EventVenue",
    "@id": `${pageUrl}#venue`,
    name: "Encanto Grand Ballroom",
    alternateName: [
      "Encanto Event Hall Ulaanbaatar",
      "Encanto Event Room",
      "Event Hall Ulaanbaatar",
      "Event Room Ulaanbaatar",
      "Luxury Ballroom Mongolia",
      "Ballroom Ulaanbaatar",
    ],
    description: BALLROOM_PAGE_DESCRIPTION,
    url: pageUrl,
    image: absoluteUrl(tower.heroImage),
    address: postalAddressJsonLd(),
    telephone: project.contactPhone,
    email: project.contactEmail,
    maximumAttendeeCapacity: 1600,
    knowsAbout: [
      "Wedding receptions",
      "Corporate conferences",
      "Gala dinners",
      "New Year celebrations",
      "Year-end corporate parties",
      "Product launches",
      "Award ceremonies",
      "Banquet events",
    ],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Skyfold partition halls", value: true },
      { "@type": "LocationFeatureSpecification", name: "Bridal suite", value: true },
      { "@type": "LocationFeatureSpecification", name: "Professional AV & lighting", value: true },
      { "@type": "LocationFeatureSpecification", name: "Guest parking", value: true },
      { "@type": "LocationFeatureSpecification", name: "9th floor open terrace", value: true },
    ],
    containedInPlace: {
      "@type": "Place",
      name: SITE_NAME,
      url: SITE_URL,
      address: postalAddressJsonLd(),
    },
    areaServed: [
      {
        "@type": "City",
        name: "Ulaanbaatar",
        containedInPlace: {
          "@type": "Country",
          name: "Mongolia",
        },
      },
      {
        "@type": "Country",
        name: "Mongolia",
      },
    ],
    makesOffer: {
      "@type": "Offer",
      name: "Event hall & ballroom venue hire",
      description:
        "Luxury ballroom and event hall rental for weddings, galas, New Year parties, and corporate events in Ulaanbaatar.",
      url: `${pageUrl}#contact`,
      areaServed: {
        "@type": "City",
        name: "Ulaanbaatar",
      },
    },
  };

  const faqNode =
    faq.length > 0
      ? {
          "@type": "FAQPage",
          "@id": `${pageUrl}#faq`,
          isPartOf: { "@id": `${pageUrl}#webpage` },
          mainEntity: faq.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: {
              "@type": "Answer",
              text: a,
            },
          })),
        }
      : null;

  return {
    "@context": "https://schema.org",
    "@graph": [...baseGraph, venue, ...(faqNode ? [faqNode] : [])],
  };
}

function towerHomeEntityJsonLd(tower: Tower): Record<string, unknown> {
  const pageUrl = absoluteUrl(`/${tower.slug}`);
  const address = postalAddressJsonLd();

  switch (tower.kind) {
    case "office":
      return {
        "@type": "RealEstateListing",
        "@id": towerEntityId(tower),
        name: "Premium Office Spaces — Encanto Trade Center",
        alternateName: [
          "Grade-A Office Ulaanbaatar",
          "Luxury Office Mongolia",
          "Encanto Office Tower",
        ],
        description: OFFICE_PAGE_DESCRIPTION,
        url: pageUrl,
        image: absoluteUrl(tower.heroImage),
        address,
        offers: {
          "@type": "Offer",
          businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
          category: "Office space for rent",
          areaServed: [
            {
              "@type": "City",
              name: "Ulaanbaatar",
              containedInPlace: {
                "@type": "Country",
                name: "Mongolia",
              },
            },
            {
              "@type": "Country",
              name: "Mongolia",
            },
          ],
        },
      };
    case "mall":
      return {
        "@type": "ShoppingCenter",
        "@id": towerEntityId(tower),
        name: "Encanto Trade Center Mall",
        alternateName: [
          "Encanto Mall",
          "Central Mall",
          "Central Mall Ulaanbaatar",
          "Luxury Shopping Ulaanbaatar",
        ],
        description: MALL_PAGE_DESCRIPTION,
        url: pageUrl,
        image: absoluteUrl(tower.heroImage),
        address,
        numberOfStores: 200,
        containedInPlace: {
          "@type": "Place",
          name: SITE_NAME,
          url: SITE_URL,
          address,
        },
        makesOffer: {
          "@type": "Offer",
          name: "Retail space & mall tenant leasing",
          url: `${pageUrl}#contact`,
          areaServed: {
            "@type": "City",
            name: "Ulaanbaatar",
          },
        },
      };
    case "ballroom":
      return {
        "@type": "EventVenue",
        "@id": towerEntityId(tower),
        name: "Encanto Grand Ballroom",
        alternateName: [
          "Encanto Event Hall Ulaanbaatar",
          "Encanto Event Room",
          "Event Hall Ulaanbaatar",
          "Luxury Ballroom Mongolia",
        ],
        description: BALLROOM_PAGE_DESCRIPTION,
        url: pageUrl,
        image: absoluteUrl(tower.heroImage),
        address,
        telephone: project.contactPhone,
        email: project.contactEmail,
        maximumAttendeeCapacity: 1600,
        containedInPlace: {
          "@type": "Place",
          name: SITE_NAME,
          url: SITE_URL,
          address,
        },
        makesOffer: {
          "@type": "Offer",
          name: "Event hall & ballroom venue hire",
          url: `${pageUrl}#contact`,
          areaServed: {
            "@type": "City",
            name: "Ulaanbaatar",
          },
        },
      };
    case "apartment":
      return {
        "@type": "ApartmentComplex",
        "@id": towerEntityId(tower),
        name: "Encanto Trade Center - Residence",
        alternateName: [
          "Encanto Residence",
          "Luxury Apartments Ulaanbaatar",
          "Premium Residence Mongolia",
        ],
        description: RESIDENCE_PAGE_DESCRIPTION,
        url: pageUrl,
        image: absoluteUrl(tower.heroImage),
        address,
        numberOfAccommodationUnits: 42,
        containedInPlace: {
          "@type": "Place",
          name: SITE_NAME,
          url: SITE_URL,
          address,
        },
        makesOffer: {
          "@type": "Offer",
          name: "Luxury apartment reservations",
          url: `${pageUrl}#contact`,
          category: "Luxury residential apartments",
          areaServed: {
            "@type": "City",
            name: "Ulaanbaatar",
          },
        },
      };
  }
}

export function homePageJsonLd() {
  const towerEntities = towers.map(towerHomeEntityJsonLd);

  const listing = {
    "@type": "RealEstateListing",
    "@id": `${SITE_URL}/#listing`,
    name: SITE_NAME,
    alternateName: ["ETC", "Encanto Trade Center Ulaanbaatar"],
    description: project.intro,
    url: SITE_URL,
    image: absoluteUrl(project.heroImage),
    address: postalAddressJsonLd(),
    containsPlace: towers.map((tower) => ({ "@id": towerEntityId(tower) })),
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: SITE_NAME,
    description: project.intro,
    inLanguage: ["en", "mn"],
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    about: {
      "@id": `${SITE_URL}/#listing`,
    },
    mainEntity: {
      "@id": `${SITE_URL}/#main-sections`,
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [webPage, listing, ...towerEntities],
  };
}

/** @deprecated Use homePageJsonLd — kept for backwards compatibility */
export function homeListingJsonLd() {
  return homePageJsonLd();
}

export function sitemapEntries() {
  const staticPages = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  ];

  const towerPages = towers.map((tower) => ({
    path: `/${tower.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.95,
  }));

  return [...staticPages, ...towerPages];
}

export function newsArticleMetadata(article: {
  title: string;
  excerpt: string;
  image: string;
  slug: string;
}): Metadata {
  const description = article.excerpt || article.title;
  const image = /^https?:\/\//i.test(article.image)
    ? article.image
    : absoluteUrl(article.image);

  return buildPageMetadata({
    title: article.title,
    description,
    path: `/news/${article.slug}`,
    image,
    absoluteTitle: true,
  });
}
