export type Locale = "en" | "mn";

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALES: Locale[] = ["en", "mn"];
export const LOCALE_COOKIE = "etc_locale";

export type WhyEncantoIcon = "landmark" | "office" | "residence" | "investment";

export type NearbyPlace = {
  name: string;
  distance: string;
  image: string;
  imageAlt: string;
};

export type ConstructionMilestone = {
  period: string;
  tower: string;
  detail: string;
};

export type NewsItem = {
  category: string;
  title: string;
  date: string;
  image: string;
  excerpt?: string;
  url?: string;
};

export type Translations = {
  nav: {
    project: string;
    office: string;
    mall: string;
    ballroom: string;
    residences: string;
    location: string;
    contact: string;
    bookTour: string;
    openMenu: string;
  };
  footer: {
    project: string;
    company: string;
    social: string;
    address: string;
    home: string;
    about: string;
    news: string;
    contact: string;
    privacy: string;
    copyright: string;
    headline: string;
    subtitle: string;
    rightsReserved: string;
    towerOffice: string;
    towerMall: string;
    towerBallroom: string;
    towerResidence: string;
  };
  project: {
    tagline: string;
    location: string;
    contactAddress: string;
    contactAddressLines: string[];
    contactPhone: string;
  };
  home: {
    hero: {
      tag: string;
      title: string;
      titleLine2: string;
      subtitle: string;
      ctaPrimary: string;
      ctaSecondary: string;
      scrollDown: string;
      scrollAria: string;
    };
    brandStatement: {
      headline: string;
      body: string;
      stats: { value: string; label: string }[];
    };
    about: {
      eyebrow: string;
      title: string;
      body: string;
      imageAlt: string;
    };
    explore: {
      eyebrow: string;
      title: string;
      viewDetails: string;
      destinationLabels: Record<string, string>;
      towers: Record<
        string,
        { floors: string; tagline: string; summary: string }
      >;
    };
    construction: {
      eyebrow: string;
      title: string;
      lead: string;
      timeline: ConstructionMilestone[];
    };
    whyEncanto: {
      eyebrow: string;
      title: string;
      titleLine2: string;
      lead: string;
      items: { icon: WhyEncantoIcon; title: string; description: string }[];
    };
    location: {
      eyebrow: string;
      title: string;
      defaultPreviewAlt: string;
      nearby: string;
      nearbyLabel: string;
      requestBrief: string;
    };
    floorPlans: {
      eyebrow: string;
      title: string;
      tabs: { id: string; label: string }[];
      downloadPdf: string;
      imageAlt: string;
    };
    amenities: {
      eyebrow: string;
      title: string;
      lead: string;
      ariaLabel: string;
      items: { title: string }[];
    };
    gallery: {
      eyebrow: string;
      title: string;
      items: { title: string }[];
      lightbox: {
        close: string;
        prev: string;
        next: string;
        viewImage: string;
      };
    };
    news: {
      eyebrow: string;
      title: string;
      headerNote: string;
    };
    contact: {
      eyebrow: string;
      title: string;
      lead: string;
      formTitle: string;
      formLead: string;
      salesTeam: string;
      alsoAvailable: string;
      primaryContact: string;
      departmentName: string;
      departmentHours: string;
      departmentAddress: string[];
      interestOptions: { value: string; label: string }[];
    };
    floatingActions: {
      ariaLabel: string;
      messenger: string;
      phone: string;
      bookVisit: string;
    };
    inquiry: {
      office: string;
      residence: string;
      retail: string;
      investment: string;
    };
    interactiveBuilding: {
      eyebrow: string;
      title: string;
      lead: string;
      ariaLabel: string;
      calibrateZones: string;
      hoverHint: string;
      hoverLead: string;
      viewLabel: string;
    };
  };
};
