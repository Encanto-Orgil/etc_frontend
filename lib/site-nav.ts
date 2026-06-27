/** Primary sections surfaced in header, footer, and structured data for Google sitelinks. */
export type SiteSectionNav = {
  slug: string;
  href: `/${string}`;
  /** Label used in footer, JSON-LD, and Google sitelink targeting */
  label: string;
  /** Optional shorter label for the header on small screens */
  navLabel?: string;
};

export const SITE_SECTION_NAV: SiteSectionNav[] = [
  { slug: "office", href: "/office", label: "Office" },
  { slug: "mall", href: "/mall", label: "Mall" },
  {
    slug: "ballroom",
    href: "/ballroom",
    label: "Encanto Grand Ballroom",
    navLabel: "Ballroom",
  },
  { slug: "apartment", href: "/apartment", label: "Apartment" },
];

export const HOME_ANCHOR_NAV: SiteSectionNav[] = [
  { slug: "about", href: "/#about", label: "Танилцуулга" },
  { slug: "contact", href: "/#contact", label: "Холбоо барих" },
];

export function getSectionNavLabel(slug: string): string {
  return SITE_SECTION_NAV.find((item) => item.slug === slug)?.label ?? slug;
}

export function getSectionNavItem(slug: string): SiteSectionNav | undefined {
  return SITE_SECTION_NAV.find((item) => item.slug === slug);
}
