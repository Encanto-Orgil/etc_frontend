import type { Translations } from "../types";
import { ballroomEn } from "./ballroomEn";
import { mallEn } from "./mallEn";
import { officeEn } from "./officeEn";
import { residenceEn } from "./residenceEn";

const amenityImages = [
  "/images/renders/render-18.jpg",
  "/images/renders/render-25.jpg",
  "/images/renders/render-15.jpg",
  "/images/renders/render-12.jpg",
  "/images/mall/mall-12.jpg",
  "/images/mall/mall-5.jpg",
  "/images/mall/mall-1.jpg",
  "/images/drone/drone-2.jpg",
  "/images/renders/render-31.jpg",
  "/images/renders/render-3.jpg",
];

const galleryImages = [
  { image: "/images/renders/render-8.jpg", tall: true },
  { image: "/images/renders/render-35.jpg" },
  { image: "/images/renders/render-18.jpg" },
  { image: "/images/renders/render-3.jpg", wide: true },
  { image: "/images/renders/render-20.jpg" },
  { image: "/images/renders/render-25.jpg" },
  { image: "/images/drone/drone-3.jpg", tall: true },
  { image: "/images/drone/drone-1.jpg" },
];

export const en: Translations = {
  nav: {
    project: "Project",
    office: "Office",
    mall: "Mall",
    ballroom: "Ballroom",
    residences: "Residences",
    location: "Location",
    contact: "Contact",
    bookTour: "Book Tour",
    openMenu: "Open menu",
  },
  footer: {
    project: "Project",
    company: "Company",
    social: "Social",
    address: "Address",
    home: "Home",
    about: "About",
    news: "News",
    contact: "Contact",
    privacy: "Privacy",
    copyright: "Encanto Trade Center",
    headline: "MONGOLIA'S TALLEST METAL STRUCTURE",
    subtitle: "A landmark mixed-use destination shaping the future of urban living and business.",
    rightsReserved: "All rights reserved.",
    towerOffice: "Office",
    towerMall: "Mall",
    towerBallroom: "Encanto Grand Ballroom",
    towerResidence: "Encanto Trade Center - Residence",
  },
  project: {
    tagline: "Luxury. Living. Business. Connected.",
    location: "26th Khoroo, Bayanzurkh District, Ulaanbaatar",
    contactAddress:
      "Ulaanbaatar, Bayanzurkh District, 26th khoroo, Ikh Mongol Uls Street, Encanto Office, 4th floor",
    contactAddressLines: [
      "Ulaanbaatar, Bayanzurkh District,",
      "26th khoroo, Ikh Mongol Uls Street",
      "Encanto Office, 4th floor",
    ],
    contactPhone: "+976 9919-1522",
  },
  home: {
    hero: {
      tag: "Premium Offices • Luxury Residences • Retail & Lifestyle",
      title: "Encanto",
      titleLine2: "Trade Center",
      subtitle:
        "A new-generation integrated business destination where commerce, lifestyle, and investment converge in one iconic development.",
      ctaPrimary: "Schedule Private Presentation",
      ctaSecondary: "Explore the Project",
      scrollDown: "Scroll Down",
      scrollAria: "Scroll down to explore",
    },
    brandStatement: {
      headline: "Not Just Another Building.",
      body: "A destination where business,\nlifestyle and investment come together.",
      stats: [
        { value: "Iconic", label: "Scale" },
        { value: "Premium", label: "Location" },
        { value: "Luxury", label: "Experience" },
      ],
    },
    about: {
      eyebrow: "About Project",
      title:
        "Encanto Trade Center is designed to redefine urban living and premium business.",
      body: "Featuring luxury residences, Grade-A offices, premium retail, restaurants, and lifestyle amenities.",
      imageAlt: "Encanto Trade Center render",
    },
    explore: {
      eyebrow: "Explore Encanto",
      title: "Four destinations, one landmark.",
      viewDetails: "View details",
      destinationLabels: {
        office: "Office",
        mall: "Mall",
        ballroom: "Ballroom",
        apartment: "Residence",
      },
      towers: {
        office: {
          floors: "24 floors",
          tagline: "Define your business value",
          summary:
            "Grade-A office with 4.5 m ceilings, YUANDA glass facade, FUJITEC smart elevators, and 1,500 parking spaces.",
        },
        mall: {
          floors: "6 floors",
          tagline: "Where global brands meet",
          summary:
            "Six floors uniting international luxury brands, gastronomy, and entertainment in one premium retail destination.",
        },
        ballroom: {
          floors: "7–8 floors",
          tagline: "A luxurious setting for unforgettable moments",
          summary:
            "Encanto Grand Ballroom on floors 7–8 — 1,600 m² of premium event space for weddings, galas, and corporate celebrations.",
        },
        apartment: {
          floors: "34 floors",
          tagline: "The art of living above the skyline",
          summary:
            "A 34-floor residential tower with panoramic city views and premium finishes throughout.",
        },
      },
    },
    construction: {
      eyebrow: "Construction Progress",
      title: "Phased opening through 2026–2027.",
      lead: "Office and Ballroom open in Q4 2026. Residence and Mall follow in Q4 2027.",
      timeline: [
        {
          period: "Q4 2026",
          tower: "Office",
          detail: "Premium office floors ready for occupancy in Q4 2026.",
        },
        {
          period: "Q4 2026",
          tower: "Ballroom",
          detail: "Grand ballroom and event spaces available in Q4 2026.",
        },
        {
          period: "Q4 2027",
          tower: "Residence",
          detail: "Residences ready for move-in in Q4 2027.",
        },
        {
          period: "Q4 2027",
          tower: "Mall",
          detail: "Retail and dining destinations opening in Q4 2027.",
        },
      ],
    },
    whyEncanto: {
      eyebrow: "Why Encanto?",
      title: "Designed for landmark",
      titleLine2: "living.",
      lead: "A mixed-use tower built around presence, performance, comfort, and long-term value — for businesses, residents, and investors alike.",
      items: [
        {
          icon: "landmark",
          title: "Skyline Landmark",
          description:
            "A distinctive architectural presence that elevates your brand and reshapes the district skyline.",
        },
        {
          icon: "office",
          title: "Premium Offices",
          description:
            "Grade-A workspaces with modern infrastructure for companies that expect more from their address.",
        },
        {
          icon: "residence",
          title: "Luxury Residence",
          description:
            "Refined sky living with privacy, comfort, and the prestige of a landmark address.",
        },
        {
          icon: "investment",
          title: "Smart Investment",
          description:
            "Prime location, mixed-use demand, and strong growth potential in a rising business corridor.",
        },
      ],
    },
    location: {
      eyebrow: "Location",
      title: "Connected to the city.",
      defaultPreviewAlt:
        "Aerial view of Encanto Trade Center and the surrounding Bayanzurkh district",
      nearby: "Nearby",
      nearbyLabel: "Walking distance",
      requestBrief: "Get Directions",
    },
    floorPlans: {
      eyebrow: "Floor Plans",
      title: "Explore the collection.",
      tabs: [
        { id: "office", label: "Office" },
        { id: "mall", label: "Mall" },
        { id: "residence", label: "Residence" },
      ],
      downloadPdf: "Download floor plan",
      imageAlt: "floor plan",
    },
    amenities: {
      eyebrow: "Amenities",
      title: "Curated lifestyle experiences.",
      lead: "From arrival to everyday living, every detail is designed to feel effortless, secure, and distinctly premium. Office, retail, residence, and lifestyle destinations are all linked via connected bridges — move through the development without stepping outside.",
      ariaLabel: "Amenities gallery",
      items: [
        { title: "Luxury Lobby" },
        { title: "Terrace" },
        { title: "Sport Complex" },
        { title: "Conference" },
        { title: "Restaurant" },
        { title: "Coffee" },
        { title: "Retail" },
        { title: "Parking" },
        { title: "24/7 Security" },
        { title: "Connected Bridge" },
      ],
    },
    gallery: {
      eyebrow: "Gallery",
      title: "Visual journey through Encanto.",
      items: [
        { title: "Render" },
        { title: "Night View" },
        { title: "Lobby" },
        { title: "Office" },
        { title: "Residence" },
        { title: "Sky Lounge" },
        { title: "Drone" },
        { title: "360 View" },
      ],
      lightbox: {
        close: "Close gallery",
        prev: "Previous image",
        next: "Next image",
        viewImage: "View image",
      },
    },
    news: {
      eyebrow: "Latest News",
      title: "Updates from Encanto.",
      headerNote: "Featured story and recent announcements from the project.",
    },
    contact: {
      eyebrow: "Contact",
      title: "Schedule Your Private Presentation",
      lead: "Meet our sales team and explore office, residence, retail, and investment opportunities.",
      formTitle: "Send an inquiry",
      formLead:
        "Share your interest, preferred timeline, or questions. Our team responds within one business day.",
      salesTeam: "Sales team",
      alsoAvailable: "Also available",
      primaryContact: "Primary contact",
      departmentName: "Sales department",
      departmentHours: "Monday – Friday: 09:00 – 18:00",
      departmentAddress: [
        "Ulaanbaatar, Bayanzurkh District,",
        "26th khoroo, Ikh Mongol Uls Street",
        "Encanto Office, 4th floor",
      ],
      interestOptions: [
        { value: "office", label: "Office" },
        { value: "apartment", label: "Residence" },
        { value: "mall", label: "Retail" },
        { value: "general", label: "Investment" },
      ],
    },
    floatingActions: {
      ariaLabel: "Quick contact",
      messenger: "Messenger",
      phone: "Phone",
      bookVisit: "Book Visit",
    },
    inquiry: {
      office: "Office",
      residence: "Residence",
      retail: "Retail",
      investment: "Investment",
    },
    interactiveBuilding: {
      eyebrow: "Interactive Building",
      title: "Explore the full development.",
      ariaLabel: "Interactive building map",
      calibrateZones: "Calibrate zones",
      hoverHint: "Hover a destination",
      hoverLead:
        "Select Office, Mall, Ballroom, Encanto Tower, Residence, or Orgil Supermarket on the render to view details.",
      viewLabel: "View",
    },
  },
  ballroom: ballroomEn,
  office: officeEn,
  mall: mallEn,
  residence: residenceEn,
};

export { amenityImages, galleryImages };
