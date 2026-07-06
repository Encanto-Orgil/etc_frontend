/** Primary sections surfaced in header, footer, and structured data for Google sitelinks. */
export type SiteSectionNav = {
  slug: string;
  href: `/${string}` | `/#${string}` | `#${string}`;
  /** Label used in footer, JSON-LD, and Google sitelink targeting */
  label: string;
  /** Optional shorter label for the header on small screens */
  navLabel?: string;
  /** Section id for scroll spy on home page */
  sectionId?: string;
};

/** Pages with full-screen hero + transparent navbar at top. */
export const LANDING_PATHS = ["/", "/office", "/mall", "/ballroom", "/apartment"] as const;

export type LandingPath = (typeof LANDING_PATHS)[number];

export function isLandingPath(pathname: string): pathname is LandingPath {
  return (LANDING_PATHS as readonly string[]).includes(pathname);
}

/** Tower destination pages (each has own landing + #contact). */
export const TOWER_PATHS = ["/office", "/mall", "/ballroom", "/apartment"] as const;

export const SITE_SECTION_NAV: SiteSectionNav[] = [
  { slug: "office", href: "/office", label: "Office" },
  { slug: "mall", href: "/mall", label: "Mall", navLabel: "Mall" },
  {
    slug: "ballroom",
    href: "/ballroom",
    label: "Encanto Grand Ballroom",
    navLabel: "Ballroom",
  },
  { slug: "apartment", href: "/apartment", label: "Encanto Trade Center - Residence", navLabel: "Residences" },
];

/**
 * Global header — conversion-focused, max clarity:
 * Project overview → 4 destinations → location → contact
 */
export const GLOBAL_HEADER_NAV: SiteSectionNav[] = [
  { slug: "project", href: "/#about", label: "Project", sectionId: "about" },
  { slug: "office", href: "/office", label: "Office" },
  { slug: "mall", href: "/mall", label: "Mall" },
  { slug: "ballroom", href: "/ballroom", label: "Ballroom" },
  { slug: "apartment", href: "/apartment", label: "Residences", navLabel: "Residences" },
  { slug: "location", href: "/#location", label: "Location", sectionId: "location" },
  { slug: "contact", href: "/#contact", label: "Contact", sectionId: "contact" },
];

/** @deprecated Use GLOBAL_HEADER_NAV */
export const HOME_PAGE_NAV = GLOBAL_HEADER_NAV;

export const HOME_ANCHOR_NAV: SiteSectionNav[] = [
  { slug: "about", href: "/#about", label: "Танилцуулга", sectionId: "about" },
  { slug: "contact", href: "/#contact", label: "Холбоо барих", sectionId: "contact" },
];

/** Hash sections that exist on every tower landing page. */
const TOWER_LOCAL_SECTIONS = new Set(["location", "contact"]);

/**
 * Resolve nav href for current page — tower pages use in-page anchors where available.
 */
export function resolveNavHref(item: SiteSectionNav, pathname: string): string {
  if (item.href.startsWith("/#")) {
    const sectionId = item.sectionId ?? item.href.slice(2);
    if (isLandingPath(pathname) && pathname !== "/" && TOWER_LOCAL_SECTIONS.has(sectionId)) {
      return `${pathname}#${sectionId}`;
    }
    return item.href;
  }
  return item.href;
}

export function getContactHref(pathname: string): string {
  if (isLandingPath(pathname) && pathname !== "/") {
    return `${pathname}#contact`;
  }
  return "/#contact";
}

export function getSectionNavLabel(slug: string): string {
  return SITE_SECTION_NAV.find((item) => item.slug === slug)?.label ?? slug;
}

export function getSectionNavItem(slug: string): SiteSectionNav | undefined {
  return SITE_SECTION_NAV.find((item) => item.slug === slug);
}
