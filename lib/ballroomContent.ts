import { ballroomCapacitySetups, ballroomDimensions } from "./ballroomBrochure";

export const ballroomHero = {
  eyebrow: "Encanto Grande Ballroom",
  headline: "WHERE UNFORGETTABLE MOMENTS BEGIN",
  title: "Encanto Grande Ballroom",
  description:
    "A world-class venue crafted for weddings, galas, conferences, and extraordinary celebrations.",
  image: "/images/hero/ballroom.webp",
  primaryCta: { label: "Explore Venue", href: "#experience" },
  secondaryCta: { label: "Book a Tour", href: "#contact" },
};

export const ballroomExperience = {
  image: "/images/ballroom/ballroom-5.jpg",
  title: "Crafted for Extraordinary Events",
  body: "Whether you are hosting an elegant wedding, an international conference, or a prestigious gala dinner, Encanto Grande Ballroom delivers an exceptional experience through timeless design, advanced technology, and impeccable service.",
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

export const ballroomHighlightsSection = {
  eyebrow: "Venue Highlights",
  title: "Luxury in Every Detail",
  lead: "From the grand ballroom to guest-support spaces — every detail is designed for exceptional events.",
};

export const ballroomHighlights: {
  icon: BallroomHighlightIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: "ballroom",
    title: "Grand Ballroom",
    description: "Elegant interiors with premium finishes across 1,600 m².",
  },
  {
    icon: "capacity",
    title: "Large Capacity",
    description: "Flexible seating for intimate gatherings or large-scale events.",
  },
  {
    icon: "stage",
    title: "Professional Stage",
    description: "Built-in stage with modern AV infrastructure.",
  },
  {
    icon: "catering",
    title: "Premium Catering",
    description: "Curated dining experiences for every occasion.",
  },
  {
    icon: "av",
    title: "Intelligent Lighting & Sound",
    description: "Professional production lighting and sound systems.",
  },
  {
    icon: "vip",
    title: "VIP Room",
    description: "A dedicated room for specially invited honored guests.",
  },
  {
    icon: "bridal",
    title: "Bridal Room",
    description: "A private, comfortable suite prepared for the wedding couple.",
  },
  {
    icon: "wardrobe",
    title: "Dressing & Wardrobe Suite",
    description: "Dressing room, make-up room, and wardrobe for guest comfort.",
  },
  {
    icon: "smoking",
    title: "Smoking Room",
    description: "A dedicated smoking room for event guests.",
  },
  {
    icon: "motherBaby",
    title: "Mother & Baby Room",
    description: "A private room designed for childcare and nursing.",
  },
  {
    icon: "terrace",
    title: "9th Floor Open Terrace",
    description:
      "Host wedding ceremonies, receptions, and cocktail events on the open terrace.",
  },
  {
    icon: "parking",
    title: "Guest Parking",
    description: "Dedicated parking for ballroom event guests.",
  },
];

export type BallroomEventIcon =
  | "wedding"
  | "corporate"
  | "award"
  | "launch"
  | "gala"
  | "concert"
  | "celebration"
  | "fashion";

export const ballroomEventTypes: {
  icon: BallroomEventIcon;
  title: string;
  layout: string;
  image: string;
}[] = [
  {
    icon: "wedding",
    title: "Wedding Reception",
    layout: "Banquet",
    image: "/images/ballroom/ballroom-15.jpg",
  },
  {
    icon: "corporate",
    title: "Corporate Conference",
    layout: "Classroom",
    image: "/images/ballroom/ballroom-12.jpg",
  },
  {
    icon: "award",
    title: "Award Ceremony",
    layout: "Theatre",
    image: "/images/ballroom/ballroom-20.jpg",
  },
  {
    icon: "launch",
    title: "Product Launch",
    layout: "Cocktail",
    image: "/images/ballroom/ballroom-5.jpg",
  },
  {
    icon: "gala",
    title: "Luxury Gala Dinner",
    layout: "Banquet",
    image: "/images/ballroom/ballroom-8.jpg",
  },
  {
    icon: "concert",
    title: "Concert & Performance",
    layout: "Theatre",
    image: "/images/ballroom/ballroom-20.jpg",
  },
  {
    icon: "celebration",
    title: "Private Celebration",
    layout: "Banquet",
    image: "/images/ballroom/ballroom-1.jpg",
  },
  {
    icon: "fashion",
    title: "Fashion Show",
    layout: "Cocktail",
    image: "/images/ballroom/ballroom-22.jpg",
  },
];

/** Real capacities from project brochure data. */
export const ballroomLayouts = [
  {
    layout: "Banquet",
    capacity: ballroomCapacitySetups.find((r) => r.setup.startsWith("Banquet (10"))?.capacity ?? "800",
    note: "10 guests per table",
    eventTypes: ["Wedding Reception", "Luxury Gala Dinner", "Private Celebration"],
  },
  {
    layout: "Theatre",
    capacity: ballroomCapacitySetups.find((r) => r.setup === "Theatre")?.capacity ?? "1,200",
    note: "Theatre seating",
    eventTypes: ["Award Ceremony", "Concert & Performance"],
  },
  {
    layout: "Classroom",
    capacity: "750",
    note: "Conference & seminar",
    eventTypes: ["Corporate Conference"],
  },
  {
    layout: "Cocktail",
    capacity: ballroomCapacitySetups.find((r) => r.setup === "Reception")?.capacity ?? "1,600",
    note: "Reception layout",
    eventTypes: ["Product Launch", "Fashion Show"],
  },
  {
    layout: "U-Shape",
    capacity: "180",
    note: "Executive meetings",
    eventTypes: ["Board meetings", "Workshops"],
  },
] as const;

export type BallroomGalleryImage = {
  src: string;
  alt: string;
  caption?: string;
  wide?: boolean;
  tall?: boolean;
};

export type BallroomGalleryCategoryId =
  | "lobby"
  | "hall"
  | "reception"
  | "terrace"
  | "restroom";

export type BallroomGalleryCategory = {
  id: BallroomGalleryCategoryId;
  label: string;
  description?: string;
  images: BallroomGalleryImage[];
};

export const ballroomGalleryCategories: BallroomGalleryCategory[] = [
  {
    id: "lobby",
    label: "Lobby",
    images: [
      { src: "/images/ballroom/ballroom-18.jpg", alt: "Grand lobby seating area", caption: "Grand Lobby", wide: true },
      { src: "/images/ballroom/ballroom-22.jpg", alt: "Ballroom entrance", caption: "Main Entrance" },
      { src: "/images/ballroom/ballroom-5.jpg", alt: "Lobby lounge atmosphere", caption: "Pre-Event Lounge" },
    ],
  },
  {
    id: "hall",
    label: "Hall",
    images: [
      { src: "/images/ballroom/ballroom-1.jpg", alt: "Ballroom daytime setup", caption: "Daylight Setup", wide: true },
      { src: "/images/ballroom/ballroom-5.jpg", alt: "Ballroom evening lighting", caption: "Evening Ambience" },
      { src: "/images/ballroom/ballroom-15.jpg", alt: "Wedding banquet layout", caption: "Banquet Layout", tall: true },
      { src: "/images/ballroom/ballroom-12.jpg", alt: "Conference hall setup", caption: "Conference Setup" },
      { src: "/images/ballroom/ballroom-20.jpg", alt: "Stage and theatre seating", caption: "Stage & Theatre" },
      { src: "/images/ballroom/ballroom-8.jpg", alt: "Gala dinner arrangement", caption: "Gala Dinner" },
    ],
  },
  {
    id: "reception",
    label: "Reception",
    images: [
      { src: "/images/ballroom/ballroom-1.jpg", alt: "Wedding reception setup", caption: "Wedding Reception", wide: true },
      { src: "/images/ballroom/ballroom-8.jpg", alt: "Cocktail reception layout", caption: "Cocktail Reception" },
      { src: "/images/ballroom/ballroom-15.jpg", alt: "Banquet reception tables", caption: "Banquet Reception", tall: true },
      { src: "/images/ballroom/ballroom-5.jpg", alt: "Evening reception lighting", caption: "Evening Reception" },
      { src: "/images/ballroom/ballroom-22.jpg", alt: "Guest arrival reception", caption: "Guest Arrival" },
    ],
  },
  {
    id: "terrace",
    label: "Terrace",
    description:
      "The 9th floor open terrace extends Encanto Grand Ballroom beyond the main halls — ideal for wedding ceremonies, cocktail receptions, and evening celebrations with open-air ambience.",
    images: [
      {
        src: "/images/ballroom/ballroom-20.jpg",
        alt: "9th floor open terrace panorama",
        caption: "9th Floor Open Terrace",
        wide: true,
      },
      {
        src: "/images/ballroom/ballroom-8.jpg",
        alt: "Terrace cocktail reception setup",
        caption: "Cocktail Reception",
      },
      {
        src: "/images/ballroom/ballroom-5.jpg",
        alt: "Wedding ceremony on the open terrace",
        caption: "Wedding Ceremony",
      },
    ],
  },
  {
    id: "restroom",
    label: "Restroom",
    images: [
      { src: "/images/ballroom/ballroom-18.jpg", alt: "Premium restroom finishes", caption: "Premium Restroom", wide: true },
      { src: "/images/ballroom/ballroom-22.jpg", alt: "VIP lounge adjacent facilities", caption: "VIP Facilities" },
    ],
  },
];

export const ballroomBeforeAfter = {
  before: { label: "Empty Hall", image: "/images/ballroom/ballroom-12.jpg" },
  after: { label: "Wedding Reception", image: "/images/ballroom/ballroom-1.jpg" },
};

export const ballroomFlexibleUses = [
  "Weddings",
  "Conferences",
  "Gala Dinner",
  "Exhibitions",
  "Product Launches",
];

export const ballroomSignature = {
  title: "Every Celebration Deserves a Grand Stage",
  body: "Elegant design, exceptional service, and unforgettable experiences come together at Encanto Grande Ballroom.",
  image: "/images/ballroom/ballroom-5.jpg",
};

export const ballroomTestimonials = [
  {
    role: "Wedding Couple",
    quote:
      "Our wedding felt like a scene from a film. The ballroom, lighting, and service exceeded every expectation.",
    name: "Sarah & James",
  },
  {
    role: "Corporate Client",
    quote:
      "We hosted 600 guests for our annual conference. The AV, layout flexibility, and team were world-class.",
    name: "Global Finance Group",
  },
  {
    role: "Event Organizer",
    quote:
      "Skyfold division let us run three events in one day. Encanto is now our go-to premium venue in Ulaanbaatar.",
    name: "Elite Events Mongolia",
  },
  {
    role: "Luxury Brand",
    quote:
      "The stage, lighting, and lobby experience created the perfect setting for our product launch.",
    name: "Maison Lumière",
  },
];

export const ballroomFaq = [
  { q: "Can I host a wedding?", a: "Yes. The ballroom supports full wedding receptions with bridal rooms and premium catering." },
  { q: "Do you provide catering?", a: "Yes. Curated dining experiences are available for all event formats." },
  { q: "Can I rent only the ballroom?", a: "Yes. Ballroom-only rental is available depending on date and configuration." },
  { q: "Is parking available?", a: "Yes. Ample parking is available for event guests." },
  { q: "Can the layout be customized?", a: "Yes. Multiple seating layouts and Skyfold room divisions are supported." },
];

export const ballroomContact = {
  title: "Plan Your Next Event",
  body: "Our event specialists are ready to help you create an unforgettable experience.",
  footer: "Extraordinary Events Begin at Encanto Grande Ballroom",
};

export const ballroomThemes = {
  wedding: {
    label: "Wedding",
    accent: "#D4AF37",
    image: "/images/ballroom/ballroom-1.jpg",
    glow: "rgba(212, 175, 55, 0.18)",
  },
  corporate: {
    label: "Corporate",
    accent: "#B8B8BC",
    image: "/images/ballroom/ballroom-12.jpg",
    glow: "rgba(184, 184, 188, 0.15)",
  },
  gala: {
    label: "Gala",
    accent: "#A87E3E",
    image: "/images/ballroom/ballroom-5.jpg",
    glow: "rgba(168, 126, 62, 0.2)",
  },
  conference: {
    label: "Conference",
    accent: "#6B8CAE",
    image: "/images/ballroom/ballroom-8.jpg",
    glow: "rgba(107, 140, 174, 0.18)",
  },
} as const;

export type BallroomThemeKey = keyof typeof ballroomThemes;

export const ballroomFloorPlan = {
  image: ballroomDimensions.floorPlanImage,
  caption: ballroomDimensions.floorPlanCaption,
};
