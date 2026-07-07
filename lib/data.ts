export type Stat = { label: string; value: string; unit?: string };
export type Feature = { title: string; description: string; image: string };
export type GalleryItem = { image: string; caption?: string };

export type Tower = {
  kind: "office" | "mall" | "ballroom" | "apartment";
  slug: string;
  name: string;
  nameMn: string;
  tagline: string;
  floors: string;
  summary: string;
  description: string;
  heroImage: string;
  accent: string;
  stats: Stat[];
  features: Feature[];
  gallery: GalleryItem[];
};

export const project = {
  name: "Encanto Trade Center",
  shortName: "ETC",
  tagline: "Монголын хамгийн өндөр шилэн фасадтай металл бүтээц",
  location: "26th Khoroo, Bayanzurkh District, Ulaanbaatar",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Encanto+Trade+Center+26th+khoroo+Bayanzurkh+Ulaanbaatar",
  mapDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Encanto+Trade+Center+26th+khoroo+Bayanzurkh+Ulaanbaatar",
  heroImage: "/images/renders/render-8.jpg",
  duskImage: "/images/renders/render-35.jpg",
  droneImage: "/images/drone/drone-3.jpg",
  intro:
    "Encanto Trade Center нь Баянзүрх дүүрэгт баригдаж буй 35 давхар, 135 метр өндөр металл бүтээц юм. Шилэн фасадтай, Монгол улсын хамгийн өндөр металл бүтээц байхаар архитектурын шийдлийг боловсруулсан. Барилгын суурь хэсэгт 8 давхар олон үйлчилгээтэй худалдаа үйлчилгээний төв болон далд автозогсоол, дээд хэсэгт оффисын болон орон сууцны цамхгуудыг төлөвлөсөн.",
  taglineEn: "Luxury. Living. Business. Connected.",
  taglineWords: ["Luxury", "Living", "Business", "Connected"] as const,
  heroStats: [
    { label: "Давхар", value: "35" },
    { label: "Өндөр", value: "135", unit: "м" },
    { label: "Цамхаг", value: "2" },
    { label: "Суурь давхар", value: "8" },
  ] as Stat[],
  contactPhone: "+976 9919-1522",
  contactEmail: "info@encanto.mn",
  contactAddress:
    "Улаанбаатар хот, Баянзүрх дүүрэг, 26-р хороо, Их Монгол Улсын гудамж, Энканто оффис 4 давхар",
};

export const towers: Tower[] = [
  {
    kind: "office",
    slug: "office",
    name: "Office",
    nameMn: "Office",
    tagline: "Define your business value",
    floors: "24 floors",
    heroImage: "/images/renders/render-34.jpg",
    accent: "#C8A45C",
    summary:
      "Mongolia's tallest building — Grade-A office with 4.5 m ceilings, YUANDA glass facade, FUJITEC smart elevators, and 1,500 parking spaces.",
    description:
      "Encanto Trade Center - Office is Mongolia's tallest building in Ulaanbaatar's most valuable district. Features 4.5 m ceilings, panoramic views, 7 elevators, 1,500 parking spaces, and direct glass-bridge access to the mall and sport complex.",
    stats: [
      { label: "Floors", value: "24" },
      { label: "Ceiling height", value: "4.5", unit: "m" },
      { label: "Elevators", value: "7" },
      { label: "Parking", value: "1500" },
    ],
    features: [
      {
        title: "YUANDA glass facade",
        description:
          "World #1 YUANDA brand — panoramic views with UV, acoustic, and dust insulation and reduced thermal loss.",
        image: "/images/renders/render-3.jpg",
      },
      {
        title: "FUJITEC EZ Shuttle elevators",
        description:
          "Smart routing system reduces wait times — 6 passenger lifts plus 1 freight elevator.",
        image: "/images/renders/render-12.jpg",
      },
      {
        title: "Glass bridge & integrated services",
        description:
          "Direct connection to Encanto Mall, Sport Complex, Orgil Shopping Center, and heated parking without going outside.",
        image: "/images/renders/render-18.jpg",
      },
    ],
    gallery: [
      { image: "/images/renders/render-8.jpg" },
      { image: "/images/renders/render-3.jpg" },
      { image: "/images/renders/render-35.jpg" },
      { image: "/images/drone/drone-3.jpg" },
      { image: "/images/renders/render-12.jpg" },
      { image: "/images/renders/render-31.jpg" },
    ],
  },
  {
    kind: "mall",
    slug: "mall",
    name: "Mall",
    nameMn: "Mall",
    tagline: "Where global brands meet",
    floors: "6 floors",
    heroImage: "/images/renders/render-40.jpg",
    accent: "#B98E4C",
    summary:
      "Six floors uniting international luxury brands, gastronomy, and entertainment in one premium retail destination.",
    description:
      "Central Mall is a six-floor retail environment with a wide atrium, naturally lit passages, and premium finishes. From international luxury brands to family-friendly spaces, everything is brought together in one cohesive experience.",
    stats: [
      { label: "Давхар", value: "6" },
      { label: "Дэлгүүр", value: "200+" },
      { label: "Атриум", value: "Төв" },
      { label: "Авто зогсоол", value: "8 давхар" },
    ],
    features: [
      {
        title: "Тансаг атриум, passage",
        description:
          "Байгалийн гэрэлтэй өндөр атриум, чулуун заслын урсдаг шугаман нь дэлхийн жишигт нийцсэн орчныг бүрдүүлнэ.",
        image: "/images/mall/mall-1.jpg",
      },
      {
        title: "Luxury брэндүүд",
        description:
          "Олон улсын тансаг брэндүүдийн flagship дэлгүүрүүд эгнэн байрласан худалдааны давхрууд.",
        image: "/images/mall/mall-5.jpg",
      },
      {
        title: "Гастрономи ба зугаа цэнгэл",
        description:
          "Ресторан, кафе, кино театр болон гэр бүлийн зугаа цэнгэлийн бүсүүд.",
        image: "/images/mall/mall-12.jpg",
      },
    ],
    gallery: [
      { image: "/images/renders/render-40.jpg" },
      { image: "/images/mall/mall-1.jpg" },
      { image: "/images/mall/mall-5.jpg" },
      { image: "/images/mall/mall-9.jpg" },
      { image: "/images/mall/mall-12.jpg" },
      { image: "/images/mall/mall-18.jpg" },
    ],
  },
  {
    kind: "ballroom",
    slug: "ballroom",
    name: "Ballroom",
    nameMn: "Ballroom",
    tagline: "A luxurious setting for unforgettable moments",
    floors: "7–8 floors",
    heroImage: "/images/ballroom/ballroom-4.jpg",
    accent: "#A87E3E",
    summary:
      "Encanto Grand Ballroom on floors 7–8 — 1,600 m² of premium event space for weddings, galas, and corporate celebrations.",
    description:
      "Located on floors 7 and 8 of the retail podium, Encanto Grand Ballroom spans 1,600 m² with 7.6 m ceiling height and Skyfold automated partition walls. Weddings, banquets, corporate events, conferences, and exhibitions can all be hosted under one roof.",
    stats: [
      { label: "Талбай", value: "1,600 м²" },
      { label: "Давхар", value: "7–8" },
      { label: "Тааз", value: "7.6 м" },
      { label: "Reception", value: "1,600" },
    ],
    features: [
      {
        title: "Encanto Grand Ballroom",
        description:
          "1600 м² талбай, 7.6 м таазны өндөртэй гол ёслолын танхим. Theatre 1,200, reception 1,600 хүртэл багтаамжтай.",
        image: "/images/ballroom/ballroom-1.jpg",
      },
      {
        title: "Skyfold уян хатан шийдэл",
        description:
          "Автомат тусгаарлах ханын системээр 3 бие даасан танхим болгон хуваах боломжтой.",
        image: "/images/ballroom/ballroom-8.jpg",
      },
      {
        title: "Дагалдах премиум орчин",
        description:
          "VIP өрөө, bridal room, make-up room, 9-р давхрын open terrace, зогсоол.",
        image: "/images/ballroom/ballroom-15.jpg",
      },
    ],
    gallery: [
      { image: "/images/ballroom/ballroom-1.jpg" },
      { image: "/images/ballroom/ballroom-5.jpg" },
      { image: "/images/ballroom/ballroom-8.jpg" },
      { image: "/images/ballroom/ballroom-12.jpg" },
      { image: "/images/ballroom/ballroom-15.jpg" },
      { image: "/images/ballroom/ballroom-20.jpg" },
    ],
  },
  {
    kind: "apartment",
    slug: "apartment",
    name: "Apartment",
    nameMn: "Apartment",
    tagline: "The art of living above the skyline",
    floors: "34 floors",
    heroImage: "/images/renders/render-1.jpg",
    accent: "#C8A45C",
    summary:
      "A 34-floor residential tower with panoramic city views and premium finishes throughout.",
    description:
      "Encanto Trade Center - Residence rises 34 floors above the city, offering panoramic views from every home. Premium finishes, smart-home features, concierge service, and security meet the full expectations of contemporary luxury living.",
    stats: [
      { label: "Давхар", value: "34" },
      { label: "Үзэмж", value: "Панорам" },
      { label: "Заслал", value: "Premium" },
      { label: "Үйлчилгээ", value: "24/7" },
    ],
    features: [
      {
        title: "Панорам үзэмжтэй орон сууц",
        description:
          "Шилэн фасадаар хотын панорам үзэмж нээгдэх, байгалийн гэрэлд автсан амьдрах орчин.",
        image: "/images/renders/render-25.jpg",
      },
      {
        title: "Premium заслал",
        description:
          "Олон улсын чанарын стандартад нийцсэн заслал, ухаалаг гэрийн шийдэл бүхий орон сууцнууд.",
        image: "/images/renders/render-15.jpg",
      },
      {
        title: "Төвлөрсөн үйлчилгээ",
        description:
          "Concierge, аюулгүй байдал, fitness, амралт зугаалгын бүс бүхий нэгдсэн үйлчилгээ.",
        image: "/images/renders/render-20.jpg",
      },
    ],
    gallery: [
      { image: "/images/renders/render-20.jpg" },
      { image: "/images/renders/render-15.jpg" },
      { image: "/images/renders/render-25.jpg" },
      { image: "/images/renders/render-35.jpg" },
      { image: "/images/drone/drone-1.jpg" },
      { image: "/images/renders/render-8.jpg" },
    ],
  },
];

export const projectGallery: GalleryItem[] = [
  { image: "/images/renders/render-8.jpg", caption: "Цогцолборын ерөнхий харагдац" },
  { image: "/images/renders/render-35.jpg", caption: "Бүрэнхий үеийн skyline" },
  { image: "/images/renders/render-40.jpg", caption: "Central Mall — гол орц" },
  { image: "/images/renders/render-15.jpg", caption: "Мастер төлөвлөгөө" },
  { image: "/images/renders/render-25.jpg", caption: "Residence / Mall орц" },
  { image: "/images/renders/render-5.jpg", caption: "Барилгын фасад" },
  { image: "/images/renders/render-31.jpg", caption: "Гудамжны түвшний орчин" },
  { image: "/images/renders/render-18.jpg", caption: "Дотоод орчин" },
];

export const droneGallery: GalleryItem[] = [
  { image: "/images/drone/drone-3.jpg", caption: "Бодит барилгын явц" },
  { image: "/images/drone/drone-1.jpg", caption: "Агаараас харах төсөл" },
  { image: "/images/drone/drone-2.jpg", caption: "Хотын төвтэй холбоо" },
  { image: "/images/drone/drone-4.jpg", caption: "Барилгын талбай" },
  { image: "/images/drone/drone-5.jpg", caption: "Орчны байршил" },
  { image: "/images/drone/drone-6.jpg", caption: "Панорам агаарын зураг" },
];

export function getTower(slug: string): Tower | undefined {
  return towers.find((t) => t.slug === slug);
}
