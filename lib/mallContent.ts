export const mallHero = {
  eyebrow: "An Integrated Retail & Service Complex",
  headline: "THE CITY'S NEW LIFESTYLE DESTINATION",
  title: "Encanto Trade Center Mall",
  description:
    "Strategically located in one of the city's most valuable districts — integrating retail, dining, sports, and daily services into a unified urban destination.",
  image: "/images/mall/mall-hero.png",
  primaryCta: { label: "Explore Mall", href: "#intro" },
  secondaryCta: { label: "Floor Plan", href: "#floor-plan" },
  tertiaryCta: { label: "Contact", href: "#contact" },
};

export type MallHighlightIcon =
  | "scale"
  | "flow"
  | "engineering"
  | "tenant"
  | "growth"
  | "location"
  | "parking";

export const mallHighlightsSection = {
  eyebrow: "Key Highlights",
  title: "Scale, Flow & Long-Term Value",
  lead: "A large-scale integrated retail environment with modern engineering, synergized tenants, and consistent customer activity.",
};

export const mallHighlightCards: {
  icon: MallHighlightIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: "scale",
    title: "Integrated Retail Scale",
    description: "Large-scale retail environment in one of the city's most valuable districts.",
  },
  {
    icon: "flow",
    title: "Consistent Customer Flow",
    description: "Strong and sustained foot traffic across retail, dining, and daily services.",
  },
  {
    icon: "engineering",
    title: "Modern Engineering",
    description: "Contemporary construction systems with 5-meter ceiling heights and efficient circulation.",
  },
  {
    icon: "tenant",
    title: "Synergized Tenants",
    description: "Balanced mix of franchise brands, restaurants, food court, and service operators.",
  },
  {
    icon: "growth",
    title: "Long-Term Value",
    description: "Structured leasing environment designed for stable operations and growth.",
  },
  {
    icon: "location",
    title: "Bridge Connectivity",
    description: "Direct connections to Encanto Mall, Orgil Supermarket, and Encanto Sport Complex.",
  },
];

export const mallFloorPlanIntro = {
  eyebrow: "Floor Plan",
  title: "Levels 1–4",
  lead: "Leasing floor plans for the mall's main retail levels — select a floor to view layout and zones.",
};

export const mallFloorPlanTabs = [
  {
    id: "l1",
    label: "1F",
    title: "First Floor · 1,815 m²",
    description: "Fashion and lifestyle retail around a central atrium with premium frontage units.",
    zones: ["Fashion brands", "Lifestyle retail", "Central atrium"],
    image: "/images/mall/floorplan/floorplan-01.png",
  },
  {
    id: "l2",
    label: "2F",
    title: "Second Floor",
    description: "Upper retail level with escalator core, dining adjacency, and flexible unit sizes.",
    zones: ["Lifestyle", "Beauty", "Specialty retail"],
    image: "/images/mall/floorplan/floorplan-02.png",
  },
  {
    id: "l3",
    label: "3F",
    title: "Third Floor",
    description: "Food court and service-oriented tenants with clearly zoned circulation.",
    zones: ["Food court", "Restaurants", "Cafés"],
    image: "/images/mall/floorplan/floorplan-03.png",
  },
  {
    id: "l4",
    label: "4F",
    title: "Fourth Floor · 2,284 m²",
    description: "Entertainment and event-ready floor with larger open zones.",
    zones: ["Cinema", "Events", "Family zones"],
    image: "/images/mall/floorplan/floorplan-04.png",
  },
];

export const mallFaq = {
  eyebrow: "FAQ",
  title: "Leasing & Visitor Questions",
  items: [
    {
      q: "Are retail spaces available for lease?",
      a: "Yes. Retail spaces are available through a structured leasing process designed for long-term business growth.",
    },
    {
      q: "What is the total mall area?",
      a: "The mall offers 23,707 sqm of retail space, connected to 55,682 sqm of integrated retail across the Encanto Town ecosystem.",
    },
    {
      q: "Is parking available?",
      a: "Yes. The project includes 400 dedicated parking spaces for retail and daily services.",
    },
    {
      q: "Which tenant categories are supported?",
      a: "Franchise and chain brands, restaurants and cafés, food court operators, and retail and service tenants.",
    },
    {
      q: "How do I request floor plan or pricing details?",
      a: "Contact our leasing team by phone or submit the inquiry form — we will share availability and floor plan details.",
    },
  ],
};

export const mallLeasing = {
  title: "Become a Part of Encanto Trade Center Mall",
  body: "Position your brand in a structured environment designed for long-term business growth and stable operations.",
  primary: { label: "Lease a Space", href: "#contact" },
  secondary: { label: "Download Brochure", href: "/downloads/etc-mall-brochure.pdf" },
  tertiary: { label: "Contact Leasing Team", href: "#contact" },
};

export const mallContact = {
  title: "Get in Touch",
  body: "Retail inquiries, leasing opportunities, or event partnerships — our team is ready to help.",
  footer: "Where City Life Comes Together",
  footerSub: "Encanto Trade Center Mall — The Heart of Urban Lifestyle",
};

export const mallInterestOptions = [
  { value: "retail", label: "Retail" },
  { value: "leasing", label: "Leasing" },
  { value: "event", label: "Event" },
];
