export const brandStatement = {
  headline: "Not Just Another Building.",
  body: "A destination where business,\nlifestyle and investment come together.",
  stats: [
    { value: "Iconic", label: "Scale" },
    { value: "Premium", label: "Location" },
    { value: "Luxury", label: "Experience" },
  ],
};

export const aboutProject = {
  image: "/images/renders/render-8.jpg",
  title: "Encanto Trade Center is designed to redefine urban living and premium business.",
  body: "Featuring luxury residences, Grade-A offices, premium retail, restaurants, and lifestyle amenities.",
};

export type WhyEncantoIcon = "landmark" | "office" | "residence" | "investment";

export const whyEncantoSection = {
  eyebrow: "Why Encanto?",
  title: "Designed for landmark",
  titleLine2: "living.",
  lead: "A mixed-use tower built around presence, performance, comfort, and long-term value — for businesses, residents, and investors alike.",
};

export const whyEncanto: {
  icon: WhyEncantoIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: "landmark",
    title: "Skyline Landmark",
    description: "A distinctive architectural presence that elevates your brand and reshapes the district skyline.",
  },
  {
    icon: "office",
    title: "Premium Offices",
    description: "Grade-A workspaces with modern infrastructure for companies that expect more from their address.",
  },
  {
    icon: "residence",
    title: "Luxury Residence",
    description: "Refined sky living with privacy, comfort, and the prestige of a landmark address.",
  },
  {
    icon: "investment",
    title: "Smart Investment",
    description: "Prime location, mixed-use demand, and strong growth potential in a rising business corridor.",
  },
];

export const amenities = [
  { title: "Luxury Lobby", image: "/images/renders/render-18.jpg" },
  { title: "Sky Garden", image: "/images/renders/render-25.jpg" },
  { title: "Fitness", image: "/images/renders/render-15.jpg" },
  { title: "Conference", image: "/images/renders/render-12.jpg" },
  { title: "Restaurant", image: "/images/mall/mall-12.jpg" },
  { title: "Coffee", image: "/images/mall/mall-5.jpg" },
  { title: "Retail", image: "/images/mall/mall-1.jpg" },
  { title: "Parking", image: "/images/drone/drone-2.jpg" },
  { title: "24/7 Security", image: "/images/renders/render-31.jpg" },
  { title: "Smart Access", image: "/images/renders/render-3.jpg" },
];

export const floorPlanTabs = [
  {
    id: "residential",
    label: "Residential",
    image: "/images/renders/render-20.jpg",
    pdf: "#",
  },
  {
    id: "office",
    label: "Office",
    image: "/images/renders/render-8.jpg",
    pdf: "#",
  },
  {
    id: "retail",
    label: "Retail",
    image: "/images/renders/render-40.jpg",
    pdf: "#",
  },
];

export const galleryItems = [
  { title: "Render", image: "/images/renders/render-8.jpg", tall: true },
  { title: "Night View", image: "/images/renders/render-35.jpg" },
  { title: "Lobby", image: "/images/renders/render-18.jpg" },
  { title: "Office", image: "/images/renders/render-3.jpg", wide: true },
  { title: "Residence", image: "/images/renders/render-20.jpg" },
  { title: "Sky Lounge", image: "/images/renders/render-25.jpg" },
  { title: "Drone", image: "/images/drone/drone-3.jpg", tall: true },
  { title: "360 View", image: "/images/drone/drone-1.jpg" },
];

export type NearbyPlace = {
  name: string;
  distance: string;
  image: string;
  imageAlt: string;
};

export const nearbyPlaces: NearbyPlace[] = [
  {
    name: "Sukhbaatar Square",
    distance: "900 m",
    image: "/images/nearby/sukhbaatar-square.jpg",
    imageAlt: "Sukhbaatar Square in central Ulaanbaatar",
  },
  {
    name: "National Culture and Recreation Center",
    distance: "500 m",
    image: "/images/drone/drone-2.jpg",
    imageAlt: "Aerial view near the National Culture and Recreation Center",
  },
  {
    name: "National Stadium of Mongolia",
    distance: "800 m",
    image: "/images/nearby/national-stadium.jpg",
    imageAlt: "National Sports Stadium, Ulaanbaatar",
  },
  {
    name: "National Garden Park",
    distance: "500 m",
    image: "/images/nearby/national-garden-park.jpg",
    imageAlt: "National Garden Park, Ulaanbaatar",
  },
  {
    name: "Orchlon School",
    distance: "100 m",
    image: "/images/drone/drone-5.jpg",
    imageAlt: "Aerial view near Orchlon School",
  },
  {
    name: "Hobby School",
    distance: "700 m",
    image: "/images/nearby/hobby-school.jpg",
    imageAlt: "Hobby School building, Ulaanbaatar",
  },
  {
    name: "International School of Mongolia",
    distance: "300 m",
    image: "/images/drone/drone-3.jpg",
    imageAlt: "Aerial view near International School of Mongolia",
  },
  {
    name: "Global Innova",
    distance: "900 m",
    image: "/images/drone/drone-4.jpg",
    imageAlt: "Aerial view near Global Innova",
  },
  {
    name: "Olonlog School",
    distance: "700 m",
    image: "/images/drone/drone-6.jpg",
    imageAlt: "Aerial view near Olonlog School",
  },
  {
    name: "School No. 130",
    distance: "300 m",
    image: "/images/drone/drone-2.jpg",
    imageAlt: "Aerial view near School No. 130",
  },
];

export type ConstructionMilestone = {
  period: string;
  tower: string;
  detail: string;
};

/** Operational handover schedule — each tower from autumn 2026. */
export const constructionTimeline: ConstructionMilestone[] = [
  {
    period: "Fall 2026",
    tower: "Office",
    detail: "Premium office floors ready for occupancy from autumn 2026.",
  },
  {
    period: "Fall 2026",
    tower: "Mall",
    detail: "Retail and dining destinations opening from autumn 2026.",
  },
  {
    period: "Fall 2026",
    tower: "Ballroom",
    detail: "Grand ballroom and event spaces available from autumn 2026.",
  },
  {
    period: "Fall 2026",
    tower: "Apartment",
    detail: "Residences ready for move-in from autumn 2026.",
  },
];

export const exploreSection = {
  eyebrow: "Explore Encanto",
  title: "Four destinations, one landmark.",
};

export const destinationLabels: Record<string, string> = {
  office: "Office",
  mall: "Mall",
  ballroom: "Ballroom",
  apartment: "Residence",
};

export type NewsItem = {
  category: string;
  title: string;
  date: string;
  image: string;
  excerpt?: string;
};

export const newsItems: NewsItem[] = [
  {
    category: "Construction Update",
    title: "Encanto Trade Center structural progress reaches new milestone",
    date: "Mar 2026",
    image: "/images/drone/drone-4.jpg",
    excerpt:
      "Core structure and facade installation advance ahead of schedule as the tower reshapes the Bayanzurkh skyline.",
  },
  {
    category: "Sales Launch",
    title: "Office and residence collections now open for private preview",
    date: "Feb 2026",
    image: "/images/renders/render-8.jpg",
  },
  {
    category: "Awards",
    title: "Recognized for architectural excellence and urban integration",
    date: "Jan 2026",
    image: "/images/renders/render-35.jpg",
  },
  {
    category: "Events",
    title: "Private investor presentation and skyline preview event",
    date: "Dec 2025",
    image: "/images/ballroom/ballroom-1.jpg",
  },
];
