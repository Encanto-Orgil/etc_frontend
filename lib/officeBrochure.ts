import { getSalesPhones } from "./salesTeam";

export type OfficeLandmark = { name: string; distance: string };

export const officeLocation = {
  address: "Bayanzurkh District, 26th Khoroo, Encanto Town",
  zone: "Grade-A district",
  fromCenter: "900 m",
  intro:
    "Encanto Trade Center is located in Encanto Town, 26th Khoroo, Bayanzurkh District — 900 m from Sukhbaatar Square. Mongolia's tallest steel-frame building, with 24 floors of office space and 34 floors of premium residential. Surrounded by government and private institutions, retail, schools, and kindergartens.",
  landmarks: [
    { name: "Sukhbaatar Square", distance: "900 m" },
    { name: "National Culture and Recreation Center", distance: "500 m" },
    { name: "National Garden Park", distance: "500 m" },
    { name: "National Stadium of Mongolia", distance: "800 m" },
  ] satisfies OfficeLandmark[],
  schools: [
    { name: "Orchlon School", distance: "100 m" },
    { name: "International School of Ulaanbaatar", distance: "300 m" },
    { name: "School No. 130", distance: "300 m" },
    { name: "Hobby School", distance: "700 m" },
    { name: "Olonlog Academy School", distance: "700 m" },
    { name: "Global Innova", distance: "900 m" },
  ] satisfies OfficeLandmark[],
};

export const officeIntro = {
  name: "Encanto Trade Center - Office",
  lead:
    "Introducing Encanto Trade Center - Office — Mongolia's tallest building in Ulaanbaatar's most valuable district.",
  closing: "Encanto Trade Center - Office — where your business defines its value.",
};

export type OfficeStoryPoint = {
  title: string;
  body: string;
};

export const officeStoryPoints: OfficeStoryPoint[] = [
  {
    title: "Panoramic views & integrated engineering",
    body: "This building offers many distinctive advantages. As Mongolia's tallest tower, office windows frame the entire city skyline. Features include 4.5 m ceiling heights, raised flooring, modern heating, full ventilation, and sprinkler fire protection — a complete engineering package.",
  },
  {
    title: "1,500 parking spaces",
    body: "The project includes 1,500 parking spaces in total, with 400 dedicated for office tenants.",
  },
  {
    title: "Podium-level services",
    body: "An 8-floor retail and services podium at the base houses restaurants, coffee shops, a food court, and everyday amenities. Connected via Encanto Mall, Orgil Shopping Center, Encanto Sport Complex, and a glass bridge with sauna access — meeting daily needs for your business and staff in one place.",
  },
  {
    title: "YUANDA world #1 glass facade",
    body: "The glass facade uses Yuanda — the world's leading curtain wall brand, also specified on premium towers in Japan and Australia. This technology debuts in Mongolia at Encanto Trade Center - Office. It reduces summer heat gain and winter heat loss, with superior acoustic insulation for comfortable work year-round.",
  },
  {
    title: "Steel structure & flexible planning",
    body: "The steel-frame structure offers high seismic resilience and long-term reliability. Its greatest advantage is large, column-free spans — enabling open, flexible layouts for office, retail, and public spaces.",
  },
  {
    title: "FUJITEC smart elevators",
    body: "Fujitec AI-driven elevator systems improve safety while significantly reducing wait times.",
  },
  {
    title: "Premium security & access",
    body: "Security is prioritized with 7 elevators, 2 escape staircases, a dedicated emergency lift, and helipad access.",
  },
  {
    title: "Q4 2026 — leasing now open",
    body: "Leasing for Encanto Trade Center - Office, opening in Q4 2026, is now available. Reserve today and customize your interior fit-out to your specifications.",
  },
];

export const officeHighlights = [
  { label: "Floor-to-ceiling height", value: "4.5", unit: "m" },
  { label: "Elevators", value: "7" },
  { label: "Parking spaces", value: "1500" },
  { label: "Parking", value: "Helicopter" },
  { label: "Office floors", value: "24" },
  { label: "Handover", value: "2026", note: "Q4" },
];

export const officeTimeline = [
  {
    label: "Leasing",
    value: "Open now",
    detail: "Reserve today and plan your interior fit-out.",
  },
  {
    label: "Handover",
    value: "Q4 2026",
    detail: "Encanto Trade Center - Office enters operation.",
  },
];

export const officeFloorPlans = [
  {
    level: "Floors 10–14",
    note: "Mid-rise — multiple layout options",
    sizes: ["344 sqm", "333 sqm", "340 sqm", "308 sqm"],
    parking: "Includes 10 heated parking spaces",
  },
  {
    level: "Floors 15–22",
    note: "Upper floors — large floorplates",
    plans: [
      { name: "Plan A", size: "1,565.07 sqm" },
      { name: "Plan B", size: "784.34 sqm" },
      { name: "Plan C", size: "749.49 sqm" },
    ],
    parking: "Includes 5 heated parking spaces",
  },
];

/** @deprecated Use officeStoryPoints — kept for type compatibility */
export type OfficeFeatureCard = {
  title: string;
  detail?: string;
};

export const officeRentalFeatures: OfficeFeatureCard[] = officeStoryPoints.map(({ title, body }) => ({
  title,
  detail: body,
}));

export const officeStandards = [
  {
    title: "Perimeter protection",
    description:
      "532 reinforced concrete piles, 14 m deep, installed to engineering drawings — meeting international perimeter protection standards.",
  },
  {
    title: "Groundwater protection",
    description:
      "Foundation fully sealed with temperature-resistant liquid membrane against groundwater ingress.",
  },
  {
    title: "Seismic resilience",
    description:
      "Q345B and Q235 steel frame, A500S rebar, Premium Building Materials concrete — rated for magnitude 8 earthquakes.",
  },
  {
    title: "High-density flooring",
    description:
      "2–3× denser than standard slabs (1 m³ = 1,650 kg) — excellent load bearing, vibration, and noise absorption.",
  },
  {
    title: "Curtain wall facade",
    description:
      "World #1 YUANDA brand — UV, acoustic, and dust insulation with reduced thermal loss.",
  },
  {
    title: "Smart elevators",
    description:
      "FUJITEC EZ Shuttle — optimizes passenger routing to reduce wait times.",
  },
];

export const glassBridge = {
  title: "Glass bridge",
  description:
    "A smart glass bridge connects Encanto Mall, Encanto Sport Complex, Orgil Shopping Center, and heated parking — access without stepping outside.",
  destinations: [
    "Encanto Mall",
    "Encanto Sport Complex",
    "Orgil Shopping Center",
    "Heated parking",
  ],
};

export const officeServices = [
  "Hypermarket",
  "Mall",
  "Restaurant",
  "Lounge",
  "Ballroom (1,000 guests)",
  "Cinema",
  "Sauna & spa",
  "Fitness",
  "Swimming pool",
  "Bank",
  "Children's play center",
  "Kindergarten",
];

export const officeSalesPhones = getSalesPhones("office");
