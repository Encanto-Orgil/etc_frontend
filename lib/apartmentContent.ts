export const apartmentHero = {
  eyebrow: "Encanto Trade Center",
  headline: "LIVE ABOVE THE CITY",
  title: "Encanto Trade Center - Residence",
  image: "/images/drone/drone-6.jpg",
};

export const apartmentConcept = {
  title: "A New Standard of Vertical Living",
  body: "Encanto Trade Center - Residence redefines urban apartment living by merging architecture, comfort, and technology into a seamless residential experience above the city skyline.",
};

export type ApartmentHighlightIcon =
  | "views"
  | "interiors"
  | "smart"
  | "security"
  | "services"
  | "parking";

export const apartmentHighlights: {
  icon: ApartmentHighlightIcon;
  title: string;
  description: string;
}[] = [
  { icon: "views", title: "Panoramic Views", description: "Every apartment faces the city skyline." },
  { icon: "interiors", title: "Premium Interiors", description: "High-end materials and modern design." },
  { icon: "smart", title: "Smart Home System", description: "Full automation and intelligent control." },
  { icon: "security", title: "24/7 Security", description: "Advanced access control and monitoring." },
  { icon: "services", title: "Hotel-Grade Services", description: "Concierge, cleaning, maintenance." },
  { icon: "parking", title: "Private Parking", description: "Dedicated resident parking zones." },
];

export const apartmentTypesSection = {
  eyebrow: "Орон сууц",
  title: "10–30 давхар",
  note: "Давхартаа 2 айлтай",
};

export const apartmentLayoutTypes = [
  {
    title: "A загварын айл",
    orientations: ["Урагшаа", "Хойшоо", "Зүүн харууцтай"],
  },
  {
    title: "B загварын айл",
    orientations: ["Урагшаа", "Хойшоо харууцтай"],
  },
];

/** @deprecated Use apartmentLayoutTypes */
export const apartmentTypes = apartmentLayoutTypes.map((type) => ({
  title: type.title,
  size: type.orientations.join(" · "),
  note: "",
}));

export const apartmentSpecificationsSection = {
  eyebrow: "Барилгын онцлог",
  title: "Premium стандарт",
  lead: "Дэлхийн тэргүүлэгч брэнд, инженерийн шийдэл, luxury дотоод засал — бүх нь нэг орон сууцны стандарт.",
};

export const apartmentSpecifications: {
  label: string;
  value: string;
  featured?: boolean;
}[] = [
  { label: "Давхрын өндөр", value: "3.75 м" },
  { label: "Хаалганы өндөр", value: "2.7 м" },
  {
    label: "Барилгын хийц",
    value:
      "БНХАУ-ын №1 Hangxiao брендийн метал төмөр 345 маркын ган карказ. Дотоодын тэргүүлэх үйлдвэрлэгч Премиум Конкрит ХХК-ийн M400–M450 маркын өндөр бат бэх бетоноор барилгын багана дотор хүчитгэлттэй.",
    featured: true,
  },
  {
    label: "Шилэн фасад",
    value:
      "Дэлхийн №1 Yuanda брэндийн шалнаас тааз хүртэлх өндөртэй Unitized фасадын систем — 3 давхар ганжуулсан шил, 4 давхар Low-E түрхлэг болон аргон хийн дулаан тусгаарлалттай. Халуун, хүйтэн, хэт ягаан туяа болон дуу чимээг өндөр түвшинд тусгаарлах чадвартай premium шилэн фасадын шийдэл.",
    featured: true,
  },
  {
    label: "Дотоод дизайн",
    value: "Luxury зэрэглэлийн дотор засалтай.",
  },
  { label: "Давхарын төлөвлөлт", value: "Давхартаа 2 айлтай" },
  {
    label: "Агаар цэвэршүүлэх систем",
    value:
      "Дотор орчинд буй таагүй үнэр, бохир агаарыг гадагшлуулж, аль ч улиралд цонхоо онгойлгох шаардлагагүйгээр тоос шороо, утаа, бохирдлыг бүрэн цэвэршүүлсэн цэвэр агаарыг нэвтрүүлэх агааржуулалтын систем.",
    featured: true,
  },
  { label: "Орцондоо", value: "Kone брендийн өндөр хурдны 2 лифттэй." },
  {
    label: "Ундны ус",
    value: "SEOWON (KOREA) брендийн усны чанарт үл нөлөөлөх SUS-304 стандартын зэвэрдэггүй никель хоолойгоор хийсэн.",
  },
  { label: "Халаалтын систем", value: "GENERAL FITTINGS (ITALY) брендийн шалны халаалтын системтэй." },
  { label: "Шал", value: "CLASSEN (GERMANY) брендийн паркетан шал." },
  {
    label: "Гадна хаалга",
    value:
      "ILJINGATE (KOREA) брендийн галын аюулаас хамгаалах, дуу чимээ бүрэн тусгаарлах ган хаалга, ASSA ABLOY брендийн ухаалаг цоожноос бүрдэнэ.",
  },
  { label: "Домофон систем", value: "Хяналтын системийн тэргүүлэгч HIKVISION бренд." },
  { label: "Air condition", value: "Дэд бүтэц бэлдсэн." },
  { label: "Гал тогоо", value: "Иж бүрэн тавилга, цахилгаан хэрэгслийн хамт бэлэглэнэ." },
  { label: "Доороо", value: "8 давхар бүх төрлийн үйлчилгээг цогцлоосон үйлчилгээний төвтэй." },
  { label: "Зогсоол", value: "Айл бүрт хүртээмжтэй авто зогсоолтой." },
];

export type ResidenceSpecCategory = "structure" | "comfort" | "systems" | "security" | "lifestyle";

export type ResidenceSpecIcon =
  | "height"
  | "door"
  | "structure"
  | "facade"
  | "interior"
  | "layout"
  | "air"
  | "elevator"
  | "water"
  | "heating"
  | "floor"
  | "entry"
  | "intercom"
  | "ac"
  | "kitchen"
  | "podium"
  | "parking";

export const residenceSpecCategoryOrder: ResidenceSpecCategory[] = [
  "structure",
  "comfort",
  "systems",
  "security",
  "lifestyle",
];

/** Layout metadata aligned with `residence.*.specifications` translation order. */
export const residenceSpecLayout: {
  category: ResidenceSpecCategory;
  icon: ResidenceSpecIcon;
  featured?: boolean;
}[] = [
  { category: "structure", icon: "height" },
  { category: "structure", icon: "door" },
  { category: "structure", icon: "structure", featured: true },
  { category: "structure", icon: "facade", featured: true },
  { category: "comfort", icon: "interior" },
  { category: "structure", icon: "layout" },
  { category: "systems", icon: "air", featured: true },
  { category: "systems", icon: "elevator" },
  { category: "systems", icon: "water" },
  { category: "systems", icon: "heating" },
  { category: "comfort", icon: "floor" },
  { category: "security", icon: "entry" },
  { category: "security", icon: "intercom" },
  { category: "systems", icon: "ac" },
  { category: "comfort", icon: "kitchen" },
  { category: "lifestyle", icon: "podium" },
  { category: "lifestyle", icon: "parking" },
];

export const apartmentStackingIntro = {
  eyebrow: "Interactive Stacking Plan",
  title: "Explore Encanto Trade Center - Residence Floors",
  subtitle:
    "Navigate floors 5–34 to discover residence availability, unit sizes, and premium views.",
};

export const apartmentInteriors = [
  { title: "Living Room", image: "/images/renders/render-20.jpg", note: "City view" },
  { title: "Bedroom", image: "/images/renders/render-15.jpg", note: "Sunset light" },
  { title: "Kitchen", image: "/images/renders/render-25.jpg", note: "Modern luxury" },
  { title: "Bathroom", image: "/images/renders/render-12.jpg", note: "Spa style" },
  { title: "Balcony", image: "/images/renders/render-35.jpg", note: "Skyline view" },
];

export type ApartmentSmartIcon = "control" | "climate" | "audio" | "windows" | "power";

export const apartmentSmartFeatures: {
  icon: ApartmentSmartIcon;
  title: string;
  description: string;
}[] = [
  { icon: "control", title: "Smart Control System", description: "Lighting, curtains, temperature" },
  { icon: "climate", title: "Climate Optimization", description: "Energy-efficient comfort" },
  { icon: "audio", title: "Smart Audio Integration", description: "Multi-room sound system" },
  { icon: "windows", title: "Floor-to-Ceiling Windows", description: "Natural light optimization" },
  { icon: "power", title: "Backup Power System", description: "Uninterrupted living" },
];

export const apartmentServices = {
  hotel: ["Concierge service", "Cleaning & maintenance", "Package handling", "Resident support desk"],
  lifestyle: ["Fitness center", "Sky lounge", "Private garden zones", "Residents' lounge", "Meeting rooms"],
};

export const apartmentNearby = [
  { name: "Business District", time: "5 min" },
  { name: "Encanto Mall", time: "Direct access" },
  { name: "Restaurants & Cafés", time: "3 min" },
  { name: "Schools & Hospitals", time: "10 min" },
  { name: "Transport Access", time: "5 min" },
];

export const apartmentTravel = [
  { label: "City Center", time: "5 min" },
  { label: "Business Core", time: "10 min" },
  { label: "Airport", time: "20 min" },
];

export const apartmentInvestment = {
  title: "A Smart Residential Investment",
  body: "Encanto Trade Center - Residence is not only a home — it is a high-value real estate asset in one of the city's most iconic developments.",
  points: ["High rental demand", "Central integrated ecosystem", "Premium resale value", "Limited unit supply"],
};

export const apartmentFloorPlanTabs = [
  {
    id: "a",
    label: "A загварын айл",
    image: "/images/residence/floor-plan-a.png",
    orientations: ["Урагшаа", "Хойшоо", "Зүүн харууцтай"],
  },
  {
    id: "b",
    label: "B загварын айл",
    image: "/images/residence/floor-plan-b.png",
    orientations: ["Урагшаа", "Хойшоо харууцтай"],
  },
];

export const apartmentGallery = [
  { title: "Night Skyline Balcony", image: "/images/renders/render-35.jpg", wide: true },
  { title: "Living Room", image: "/images/renders/render-20.jpg" },
  { title: "Lobby", image: "/images/renders/render-18.jpg" },
  { title: "Bedroom View", image: "/images/renders/render-15.jpg", tall: true },
  { title: "Rooftop Sky Lounge", image: "/images/renders/render-25.jpg" },
  { title: "Building Exterior", image: "/images/renders/render-8.jpg" },
  { title: "Sunrise View", image: "/images/drone/drone-1.jpg" },
];

export const apartmentWhy = [
  "Highest residential tower in the project",
  "Direct access to Mall, Office, Ballroom",
  "Fully integrated smart ecosystem",
  "Premium construction quality",
  "Iconic architectural identity",
];

export const apartmentCta = {
  title: "Your Life Above the Skyline Awaits",
  body: "Schedule a private viewing and experience Encanto Trade Center - Residence in person.",
  primary: { label: "Book a Tour", href: "#contact" },
  secondary: { label: "Contact Sales", href: "#contact" },
  tertiary: { label: "Download Brochure", href: "#contact" },
};

export const apartmentContact = {
  title: "Private Viewing Request",
  body: "Connect with our residence specialists for availability, pricing, and private tours.",
  footer: "Encanto Trade Center - Residence",
};

export const apartmentEcosystem = [
  { label: "Encanto Mall", detail: "Walking distance lifestyle & retail", href: "/mall" },
  { label: "Office Tower", detail: "Integrated weekday commute flow", href: "/office" },
  { label: "Grand Ballroom", detail: "Events & celebrations on-site", href: "/ballroom" },
];
