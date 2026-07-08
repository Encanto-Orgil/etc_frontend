import type { MallTranslations, OfficeTranslations, ResidenceTranslations } from "./towerPageTypes";

export type { MallTranslations, OfficeTranslations, ResidenceTranslations } from "./towerPageTypes";

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
  id?: number;
  slug?: string;
  category: string;
  title: string;
  date: string;
  image: string;
  excerpt?: string;
  url?: string;
};

export type BallroomHighlightIcon =
  | "ballroom"
  | "capacity"
  | "stage"
  | "catering"
  | "av"
  | "vip"
  | "bridal"
  | "wardrobe"
  | "smoking"
  | "motherBaby"
  | "terrace"
  | "parking";

export type BallroomEventIcon =
  | "wedding"
  | "corporate"
  | "award"
  | "launch"
  | "gala"
  | "concert"
  | "celebration"
  | "fashion";

export type BallroomGalleryCategoryId =
  | "lobby"
  | "hall"
  | "reception"
  | "terrace"
  | "restroom";

export type BallroomLayoutKey =
  | "Banquet"
  | "Theatre"
  | "Classroom"
  | "Cocktail"
  | "U-Shape";

export type BallroomSkyfoldModeId = "full" | "split" | "triple";

export type BallroomTranslations = {
  hero: {
    eyebrow: string;
    headline: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  subNav: {
    overview: string;
    experience: string;
    gallery: string;
    capacity: string;
    skyfold: string;
    highlights: string;
    contact: string;
    faq: string;
    ariaLabel: string;
  };
  experience: {
    eyebrow: string;
    title: string;
    body: string;
    imageAlt: string;
  };
  highlightsSection: {
    eyebrow: string;
    title: string;
    lead: string;
  };
  highlights: Record<BallroomHighlightIcon, { title: string; description: string }>;
  gallery: {
    eyebrow: string;
    title: string;
    categories: Record<
      BallroomGalleryCategoryId,
      {
        label: string;
        description?: string;
        images: { alt: string; caption: string }[];
      }
    >;
  };
  capacity: {
    eyebrow: string;
    title: string;
    lead: string;
    eventType: string;
    guests: string;
    recommended: string;
    layouts: Record<BallroomLayoutKey, { label: string; note: string }>;
    eventTypes: Record<BallroomEventIcon, { title: string; layout: BallroomLayoutKey }>;
  };
  skyfold: {
    eyebrow: string;
    title: string;
    tagline: string;
    imageAlt: string;
    modes: Record<BallroomSkyfoldModeId, { label: string; hint: string }>;
    points: string[];
  };
  signature: {
    eyebrow: string;
    title: string;
    body: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: { q: string; a: string }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    footer: string;
    tabAvailability: string;
    tabProposal: string;
    tabAriaLabel: string;
    availabilityHint: string;
    proposalHint: string;
  };
  reservationForm: {
    thankYouTitle: string;
    thankYouBody: string;
    submitAnother: string;
    name: string;
    phone: string;
    email: string;
    eventType: string;
    eventDate: string;
    guestCount: string;
    message: string;
    required: string;
    invalidEmail: string;
    namePlaceholder: string;
    phonePlaceholder: string;
    emailPlaceholder: string;
    eventTypePlaceholder: string;
    guestCountPlaceholder: string;
    messagePlaceholder: string;
    submit: string;
    checkAvailability: string;
    successMessage: string;
    errorMessage: string;
  };
  availability: {
    prevMonth: string;
    nextMonth: string;
    weekdays: string[];
    available: string;
    fullyBooked: string;
    closed: string;
    selectDateTitle: string;
    selectDateBody: string;
    customTimeTitle: string;
    customTimeLead: string;
    customTimeHint: string;
    start: string;
    end: string;
    checkAvailability: string;
    checkError: string;
    submitWarning: string;
    requestSubmittedTitle: string;
    requestSubmittedBody: string;
    submitAnother: string;
    name: string;
    phone: string;
    email: string;
    guestCount: string;
    eventType: string;
    additionalDetails: string;
    nameRequired: string;
    phoneRequired: string;
    guestCountRequired: string;
    namePlaceholder: string;
    phonePlaceholder: string;
    emailPlaceholder: string;
    detailsPlaceholder: string;
    selectedSummary: string;
    submitBooking: string;
    bookingSuccess: string;
    bookingError: string;
    eventTypes: Record<
      "wedding" | "corporate" | "gala" | "conference" | "other",
      string
    >;
    checkTimeMessages: Record<string, string>;
    conflictPrefix: string;
  };
  explore: {
    eyebrow: string;
    title: string;
  };
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
      ariaLabel: string;
      calibrateZones: string;
      hoverHint: string;
      hoverLead: string;
      viewLabel: string;
    };
  };
  ballroom: BallroomTranslations;
  office: OfficeTranslations;
  mall: MallTranslations;
  residence: ResidenceTranslations;
};
