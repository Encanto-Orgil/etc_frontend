export const officeHero = {
  eyebrow: "Grade-A Business Destination",
  headline: "WHERE BUSINESS REACHES NEW HEIGHTS",
  title: "Premium Office Spaces",
  description:
    "Designed for forward-thinking businesses seeking prestige, efficiency, and an exceptional working environment in the heart of the city.",
  image: "/images/drone/drone-6.jpg",
  primaryCta: { label: "Explore Office", href: "#stacking-plan" },
  secondaryCta: { label: "Schedule a Tour", href: "#contact" },
};

export const officeBusinessIntro = {
  image: "/images/renders/render-3.jpg",
  title: "Built for Modern Business",
  body: "Whether you're a growing startup or an established enterprise, Encanto Trade Center provides premium office environments designed to elevate productivity, collaboration, and corporate identity.",
};

export const officeVideoSection = {
  eyebrow: "Project Film",
  title: "See Encanto in Motion",
  lead: "A cinematic look at Mongolia's tallest mixed-use tower — office, retail, and lifestyle in one landmark destination.",
};

export type OfficeHighlightIcon =
  | "office"
  | "location"
  | "parking"
  | "security"
  | "connectivity"
  | "energy";

export const officeHighlightsSection = {
  eyebrow: "Office Highlights",
  title: "Grade-A by Design",
  lead: "Six pillars of a workspace built for prestige, performance, and everyday convenience at Mongolia's tallest commercial tower.",
};

export const officeHighlightCards: {
  icon: OfficeHighlightIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: "office",
    title: "Grade-A Office",
    description: "Premium commercial spaces with flexible floorplates and refined finishes.",
  },
  {
    icon: "location",
    title: "Prime Location",
    description: "900 m from Sukhbaatar Square in Bayanzurkh's most connected district.",
  },
  {
    icon: "parking",
    title: "Ample Parking",
    description: "1,500 spaces including dedicated office tenant parking.",
  },
  {
    icon: "security",
    title: "Smart Security",
    description: "24/7 intelligent access control across lobby, lifts, and floors.",
  },
  {
    icon: "connectivity",
    title: "High-Speed Connectivity",
    description: "Enterprise-grade fiber infrastructure ready for modern operations.",
  },
  {
    icon: "energy",
    title: "Energy Efficient",
    description: "YUANDA facade and smart HVAC designed for year-round comfort.",
  },
];

export type OfficeType = {
  title: string;
  level: string;
  sizeLabel?: string;
  sizes: string[];
};

export const officeTypes: OfficeType[] = [
  {
    title: "OFFICE RENT",
    level: "10–14F",
    sizeLabel: "SIZE OPTIONS",
    sizes: ["344 m²", "333 m²", "340 m²", "308 m²"],
  },
  {
    title: "PLAN A",
    level: "15–22F",
    sizeLabel: "SIZE",
    sizes: ["1,565.07 m²"],
  },
  {
    title: "PLAN B, C",
    level: "15–22F",
    sizes: ["PLAN B SIZE: 784.34 m²", "PLAN C SIZE: 749.49 m²"],
  },
];

export const officeAmenitiesSection = {
  eyebrow: "Amenities",
  title: "Everything Your Business Needs",
  lead: "From a double-height lobby to podium dining, retail, and wellness — office tenants and their teams stay connected across the tower and Encanto Town without leaving the development.",
};

export type OfficeAmenity = {
  title: string;
  description: string;
  image: string;
};

export const officeAmenities: OfficeAmenity[] = [
  {
    title: "Luxury Lobby",
    description: "Double-height arrival with concierge service and refined finishes.",
    image: "/images/renders/render-18.jpg",
  },
  {
    title: "Meeting Rooms",
    description: "Private spaces for client presentations and team collaboration.",
    image: "/images/renders/render-12.jpg",
  },
  {
    title: "Conference Center",
    description: "Large-format venues for seminars, launches, and corporate events.",
    image: "/images/renders/render-31.jpg",
  },
  {
    title: "Business Lounge",
    description: "A quiet setting for informal meetings and focused work.",
    image: "/images/renders/render-15.jpg",
  },
  {
    title: "Restaurants",
    description: "Podium-level dining and food court for staff and guests.",
    image: "/images/mall/mall-12.jpg",
  },
  {
    title: "Retail & Mall",
    description: "Everyday services via Encanto Mall and connected retail podium.",
    image: "/images/mall/mall-1.jpg",
  },
  {
    title: "Sport Complex",
    description: "Wellness and fitness access through Encanto Sport Complex.",
    image: "/images/renders/render-25.jpg",
  },
  {
    title: "Smart Parking",
    description: "1,500 spaces with dedicated office tenant allocation.",
    image: "/images/drone/drone-2.jpg",
  },
];

export const officeWhySection = {
  eyebrow: "Why Businesses Choose Encanto",
  title: "A Tower Built for Leaders",
  lead: "More than an address — Encanto Trade Center positions your organization at the center of Ulaanbaatar's most connected business district.",
  image: "/images/renders/render-8.jpg",
  imageAlt: "Encanto Trade Center exterior at dusk",
};

export type OfficeWhyReasonIcon = "prestige" | "location" | "ecosystem" | "infrastructure";

export const officeWhyReasons: {
  icon: OfficeWhyReasonIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: "prestige",
    title: "Mongolia's tallest address",
    description:
      "Panoramic skyline views and a landmark presence that signals credibility to clients and partners.",
  },
  {
    icon: "location",
    title: "900 m from the city core",
    description:
      "Bayanzurkh's most connected district — minutes from government, banking, embassies, and hotels.",
  },
  {
    icon: "ecosystem",
    title: "All-in-one business ecosystem",
    description:
      "Office, retail podium, dining, and wellness linked via Encanto Mall and connected bridges.",
  },
  {
    icon: "infrastructure",
    title: "Enterprise-grade engineering",
    description:
      "Steel-frame structure, YUANDA curtain wall, Fujitec smart elevators, and 4.5 m ceiling heights.",
  },
];

export const officeWhyStats = [
  { value: "34", suffix: "", label: "Floors" },
  { value: "Premium", suffix: "", label: "Location" },
  { value: "Grade-A", suffix: "", label: "Standard" },
  { value: "24/7", suffix: "", label: "Access" },
];

export const officeFeatures = [
  "Flexible Floor Plans",
  "Floor-to-Ceiling Glass",
  "Raised Flooring",
  "Smart HVAC",
  "Backup Power",
  "Fiber Internet",
  "High Ceiling",
  "Natural Lighting",
  "Low-E Glass",
  "Access Control",
];

export type OfficePortalFeatureIcon = "overview" | "invoices" | "support" | "status";

export const officePortalSection = {
  eyebrow: "Tenant Portal",
  title: "Manage Your Lease Online",
  lead: "Encanto Trade Center tenants get a dedicated digital portal to view contracts, track rent invoices, and submit service requests — anytime, from any device.",
  note: "Portal access is enabled by the property team after lease signing.",
  cta: { label: "Tenant Login", href: "/portal/login" },
};

export const officePortalFeatures: {
  icon: OfficePortalFeatureIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: "overview",
    title: "Contract overview",
    description: "Active leases, unit details, and contract terms in one dashboard.",
  },
  {
    icon: "invoices",
    title: "Invoice tracking",
    description: "Rent schedules, due dates, amounts, and payment status at a glance.",
  },
  {
    icon: "support",
    title: "Support requests",
    description: "Submit maintenance, facilities, and billing requests with priority levels.",
  },
  {
    icon: "status",
    title: "Real-time status",
    description: "Monitor open tickets and outstanding balances without calling the office.",
  },
];

export const officeNearby = [
  { name: "Government", time: "5 min" },
  { name: "Banks", time: "5 min" },
  { name: "Embassies", time: "10 min" },
  { name: "Hotels", time: "5 min" },
  { name: "Restaurants", time: "3 min" },
  { name: "Airport", time: "15 min" },
  { name: "Business District", time: "5 min" },
];

export const officeGallery = [
  { title: "Office Interior", image: "/images/renders/render-3.jpg", wide: true },
  { title: "Lobby", image: "/images/renders/render-18.jpg" },
  { title: "Meeting Room", image: "/images/renders/render-12.jpg" },
  { title: "Elevator Lobby", image: "/images/renders/render-31.jpg" },
  { title: "Business Lounge", image: "/images/renders/render-15.jpg" },
  { title: "Building Exterior", image: "/images/renders/render-8.jpg", tall: true },
  { title: "Night View", image: "/images/renders/render-35.jpg" },
];

export const officeFaq = [
  {
    q: "Can I purchase an entire floor?",
    a: "Yes. Entire-floor configurations are available for enterprise clients seeking a dedicated headquarters.",
  },
  {
    q: "Is parking included?",
    a: "Parking options are available depending on unit selection and lease structure.",
  },
  {
    q: "Can office layouts be customized?",
    a: "Selected units support customized interior planning to match your corporate requirements.",
  },
  {
    q: "Is the building operational 24/7?",
    a: "Yes. Secure 24/7 access is available for authorized tenants.",
  },
  {
    q: "What internet providers are available?",
    a: "Enterprise-grade fiber connectivity with redundant infrastructure is provided.",
  },
  {
    q: "Is there a tenant portal?",
    a: "Yes. Tenants can log in at /portal/login to view contracts, invoices, and submit support requests. Access is set up by the property management team after your lease is active.",
  },
];

export type OfficeInvestmentPillarIcon = "value" | "location" | "timing";

export const officeInvestment = {
  eyebrow: "Investment Opportunity",
  title: "An Address That Adds Value",
  lead: "Secure a premium office space in one of Ulaanbaatar's most distinguished mixed-use developments and position your business for long-term growth.",
  pillars: [
    {
      icon: "value" as OfficeInvestmentPillarIcon,
      title: "Landmark asset class",
      description:
        "Mongolia's tallest commercial tower delivers prestige, visibility, and a workplace that reinforces your brand.",
    },
    {
      icon: "location" as OfficeInvestmentPillarIcon,
      title: "Connected district",
      description:
        "900 m from Sukhbaatar Square — surrounded by government, banking, embassies, retail, and everyday services.",
    },
    {
      icon: "timing" as OfficeInvestmentPillarIcon,
      title: "Early tenant advantage",
      description:
        "Leasing is open now. Reserve your floor and plan a custom fit-out ahead of Q4 2026 handover.",
    },
  ],
  timeline: [
    {
      step: "01",
      title: "Leasing open",
      detail: "Choose your floor plan and secure availability today.",
    },
    {
      step: "02",
      title: "Custom fit-out",
      detail: "Plan interiors to match your corporate requirements.",
    },
    {
      step: "03",
      title: "Q4 2026 handover",
      detail: "Move into a Grade-A workspace built for the long term.",
    },
  ],
  cta: { label: "Request Investment Brief", href: "#contact" },
};

export const officeCta = {
  eyebrow: "Get Started",
  title: "Ready to Elevate Your Business?",
  body: "Schedule a private presentation with our sales consultants and explore Grade-A office spaces tailored to your organization.",
  image: "/images/renders/render-35.jpg",
  highlights: [
    "Private guided tours",
    "Flexible floor configurations",
    "Leasing open for Q4 2026",
  ],
  primary: { label: "Book a Tour", href: "#contact" },
  secondary: { label: "Contact Sales", href: "#contact" },
  tertiary: { label: "Explore Floor Plans", href: "#stacking-plan" },
};

export const officeStackingIntro = {
  eyebrow: "Interactive Stacking Plan",
  title: "Explore Every Floor",
  subtitle:
    "Navigate through the tower to discover office availability, floor layouts, unit sizes, and premium amenities.",
  footerTitle: "Can't Find the Right Office?",
  footerBody: "Our consultants will help you find the ideal workspace.",
};

export const officeLegend = [
  { color: "#4A7FD4", label: "Office" },
  { color: "#4CAF7A", label: "Retail" },
  { color: "#D4AF37", label: "Amenities" },
  { color: "#9B7FD4", label: "Residence" },
  { color: "#8E8E93", label: "Mechanical" },
];
