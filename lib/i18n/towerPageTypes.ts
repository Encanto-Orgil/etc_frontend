export type TowerCta = { label: string; href: string };

export type TowerHighlightCard<I extends string = string> = {
  icon: I;
  title: string;
  description: string;
};

export type TowerFaqItem = { q: string; a: string };

export type TowerExploreSection = {
  eyebrow: string;
  title: string;
};

export type OfficeTranslations = {
  explore: TowerExploreSection;
  hero: {
    title: string;
    description: string;
  };
  businessIntro: {
    eyebrow: string;
    title: string;
    body: string;
    imageAlt: string;
  };
  videoSection: {
    eyebrow: string;
    title: string;
    lead: string;
  };
  highlightsSection: {
    eyebrow: string;
    title: string;
    lead: string;
  };
  highlightCards: TowerHighlightCard<
    "office" | "location" | "parking" | "security" | "connectivity" | "energy"
  >[];
  metrics: { label: string; value: string; unit?: string; note?: string }[];
  typesSection: {
    eyebrow: string;
    title: string;
    levelPrefix: string;
  };
  officeTypes: { title: string; level: string; sizeLabel?: string; sizes: string[] }[];
  amenitiesSection: {
    eyebrow: string;
    title: string;
    lead: string;
  };
  amenities: { title: string; description: string }[];
  whySection: {
    eyebrow: string;
    title: string;
    lead: string;
    featuresTitle: string;
    imageAlt: string;
    features: string[];
  };
  whyReasons: TowerHighlightCard<"prestige" | "location" | "ecosystem" | "infrastructure">[];
  whyStats: { value: string; suffix: string; label: string }[];
  portalSection: {
    eyebrow: string;
    title: string;
    lead: string;
    note: string;
    cta: string;
  };
  portalFeatures: TowerHighlightCard<"overview" | "invoices" | "support" | "status">[];
  locationSection: {
    eyebrow: string;
    title: string;
    mapTitle: string;
  };
  location: {
    intro: string;
    nearby: { name: string; time: string }[];
  };
  stackingIntro: {
    eyebrow: string;
    title: string;
    footerTitle: string;
    footerBody: string;
  };
  legend: { label: string }[];
  faqSection: { eyebrow: string; title: string };
  faq: TowerFaqItem[];
  cta: {
    eyebrow: string;
    title: string;
    body: string;
    highlights: string[];
    primary: string;
    secondary: string;
    tertiary: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    formTitle: string;
    formLead: string;
    primaryContact: string;
    alsoAvailable: string;
  };
};

export type MallTranslations = {
  explore: TowerExploreSection;
  hero: {
    eyebrow: string;
    headline: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    tertiaryCta: string;
  };
  intro: {
    eyebrow: string;
    title: string;
    body: string;
    imageAlt: string;
    stats: { value: string; unit?: string; label: string }[];
  };
  tenantSection: {
    eyebrow: string;
    title: string;
    body: string;
    categoriesLabel: string;
    categories: string[];
    outcomesLabel: string;
    outcomes: string[];
    imageAlt: string;
  };
  layoutSection: {
    eyebrow: string;
    title: string;
    body: string;
    features: string[];
    imageAlt: string;
  };
  highlightsSection: {
    eyebrow: string;
    title: string;
    lead: string;
  };
  highlightCards: TowerHighlightCard<
    "scale" | "flow" | "engineering" | "tenant" | "growth" | "location" | "parking"
  >[];
  floorPlanIntro: {
    eyebrow: string;
    title: string;
    lead: string;
  };
  floorPlanTabs: {
    label: string;
    title: string;
    description: string;
    zones: string[];
  }[];
  locationSection: {
    eyebrow: string;
    title: string;
    body: string;
    points: string[];
    landmarks: { name: string; note: string }[];
    address: string;
    imageAlt: string;
    getDirections: string;
  };
  floorPlanActions: {
    downloadFloorPlan: string;
    downloadBrochure: string;
    requestLeasing: string;
  };
  leasing: {
    title: string;
    body: string;
    primary: string;
    secondary: string;
    tertiary: string;
  };
  contact: {
    title: string;
    body: string;
    footer: string;
    footerSub: string;
  };
  faqSection: { eyebrow: string; title: string };
  faq: TowerFaqItem[];
};

export type ResidenceTranslations = {
  explore: TowerExploreSection;
  hero: {
    eyebrow: string;
    headline: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    tertiaryCta: string;
  };
  concept: {
    eyebrow: string;
    title: string;
    body: string;
  };
  aboutStats: { value: string; label: string }[];
  highlightsSection: {
    eyebrow: string;
    title: string;
  };
  highlights: TowerHighlightCard<
    "views" | "interiors" | "smart" | "security" | "services" | "parking"
  >[];
  typesSection: {
    eyebrow: string;
    title: string;
    note: string;
    orientationLabel: string;
  };
  layoutTypes: { title: string; orientations: string[] }[];
  specificationsSection: {
    eyebrow: string;
    title: string;
    lead: string;
    metrics: { value: string; unit?: string; label: string }[];
    categories: {
      structure: string;
      comfort: string;
      systems: string;
      security: string;
      lifestyle: string;
    };
  };
  specifications: { label: string; value: string }[];
  interiorsSection: {
    eyebrow: string;
    title: string;
  };
  interiors: { title: string; note: string }[];
  smartSection: {
    eyebrow: string;
    title: string;
  };
  smartFeatures: TowerHighlightCard<"control" | "climate" | "audio" | "windows" | "power">[];
  servicesSection: {
    eyebrow: string;
    title: string;
    hotelLabel: string;
    lifestyleLabel: string;
  };
  services: {
    hotel: string[];
    lifestyle: string[];
  };
  locationSection: {
    eyebrow: string;
    title: string;
    nearbyLabel: string;
    travelLabel: string;
  };
  nearby: { name: string; time: string }[];
  travel: { label: string; time: string }[];
  investment: {
    title: string;
    body: string;
    points: string[];
  };
  floorPlansSection: {
    eyebrow: string;
    title: string;
    note: string;
    completion: string;
  };
  floorPlanTabs: { label: string }[];
  gallerySection: {
    eyebrow: string;
    title: string;
  };
  gallery: { title: string }[];
  whySection: {
    eyebrow: string;
    title: string;
  };
  why: string[];
  ecosystemSection: {
    eyebrow: string;
    title: string;
  };
  ecosystem: { label: string; detail: string }[];
  cta: {
    title: string;
    body: string;
    primary: string;
    secondary: string;
    tertiary: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    formTitle: string;
    formLead: string;
    primaryContact: string;
    alsoAvailable: string;
    formSuccess: string;
    formError: string;
    submit: string;
    footer: string;
  };
  stackingIntro: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  pageFooter: string;
};
