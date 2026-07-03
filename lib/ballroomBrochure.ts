export const ballroomIntro = {
  name: "Encanto Grand Ballroom",
  location: "Худалдаа, үйлчилгээний төвийн 7, 8 давхар",
  areaSqm: 1600,
  ceilingHeightM: 7.6,
  lead:
    "Энэхүү төслийн хүрээнд худалдаа, үйлчилгээний төвийн 7 болон 8 давхарт байрлах, 1600 м² талбай бүхий Encanto Grand Ballroom нь хурим найр, хүндэтгэлийн зоог, байгууллагын арга хэмжээ, хурал семинар, үзэсгэлэн зэрэг олон төрлийн ёслолыг нэг дор багтаах премиум орчин юм.",
};

export const ballroomDimensions = {
  totalAreaSqm: 1600,
  mainHallSqm: 1600,
  preFunctionSqm: 0,
  vipLoungeSqm: 0,
  ceilingHeightM: 7.6,
  capacity: "1,600",
  floors: "7, 8 давхар",
  floorPlanImage: "/images/ballroom/ballroom-12.jpg",
  floorPlanCaption: "Encanto Grand Ballroom — 7, 8 давхрын төлөвлөлт",
};

export const ballroomSizeStats = [
  { label: "Нийт талбай", value: "1,600", unit: "м²" },
  { label: "Давхар", value: "7, 8", unit: "" },
  { label: "Таазны өндөр", value: "7.6", unit: "м" },
  { label: "Reception", value: "1,600", unit: "зочин" },
];

export const ballroomCapacitySetups = [
  { setup: "Theatre", setupMn: "Театр", capacity: "1,200", note: "Суудлын театр зохион байгуулалт" },
  { setup: "Classroom", setupMn: "Анги", capacity: "700–800", note: "Хурал, семинар, сургалт" },
  { setup: "Banquet (10/table)", setupMn: "Банкет (10 хүн)", capacity: "800", note: "10 хүний ширээ" },
  { setup: "Banquet (12/table)", setupMn: "Банкет (12 хүн)", capacity: "960", note: "12 хүний ширээ" },
  { setup: "Reception", setupMn: "Reception", capacity: "1,600", note: "Коктейль, хүлээн авалт" },
] as const;

export const ballroomSkyfold = {
  title: "1 → 3 Halls",
  subtitle: "Skyfold Automatic Partition System",
  tagline:
    "Automatically divide the 1,600 m² ballroom to host multiple events in a single day.",
  image: "/images/ballroom/ballroom-12.jpg",
  imageAlt: "Encanto Grand Ballroom — Skyfold partition",
  modes: [
    {
      id: "full",
      label: "Full Ballroom",
      halls: 1,
      hint: "Wedding · Gala · Reception",
    },
    {
      id: "split",
      label: "2 Sections",
      halls: 2,
      hint: "Meeting + Evening Event",
    },
    {
      id: "triple",
      label: "3 Halls",
      halls: 3,
      hint: "Parallel Events",
    },
  ],
  points: [
    "Motorized partitions descend from the ceiling",
    "Full acoustic and lighting isolation",
    "Host 2–3 simultaneous events",
  ],
} as const;

export const ballroomKeyAdvantages = [
  {
    id: "vip",
    title: "VIP өрөө",
    detail: "Тусгайлан уригдсан хүндэт зочдод зориулсан VIP өрөө.",
    image: "/images/ballroom/ballroom-15.jpg",
    size: "hero" as const,
  },
  {
    id: "terrace",
    title: "9-р давхрын Open Terrace",
    detail:
      "Хуримын ёслол, хүлээн авалт, коктейль арга хэмжээ зохион байгуулах боломжтой талбай.",
    image: "/images/ballroom/ballroom-20.jpg",
    size: "wide" as const,
  },
  {
    id: "bridal",
    title: "Bridal Room",
    detail: "Сүйт хосуудад зориулсан тохилог Bridal Room.",
    image: "/images/ballroom/ballroom-1.jpg",
    size: "standard" as const,
  },
  {
    id: "makeup",
    title: "Make-up & wardrobe",
    detail: "Зочдын тав тухыг хангах хувцас солих өрөө, make-up room, хувцасны өлгүүр.",
    image: "/images/ballroom/ballroom-5.jpg",
    size: "standard" as const,
  },
  {
    id: "mother",
    title: "Mother & Baby Room",
    detail: "Хүүхэд асрах, хөхүүлэх зориулалттай Mother & Baby Room.",
    image: "/images/ballroom/ballroom-12.jpg",
    size: "standard" as const,
  },
  {
    id: "smoking",
    title: "Тамхины өрөө",
    detail: "Ёслолын зочдод зориулсан тусдаа тамхины өрөө.",
    image: "/images/ballroom/ballroom-8.jpg",
    size: "standard" as const,
  },
  {
    id: "parking",
    title: "Зогсоол",
    detail: "Ballroom арга хэмжээний зочдод зориулсан авто машины зогсоол.",
    image: "/images/renders/render-40.jpg",
    size: "standard" as const,
  },
];

export const ballroomAdvantages = ballroomKeyAdvantages.map(({ title, detail }) => ({
  title,
  detail,
}));

export const ballroomRenderGalleries = [
  {
    floor: "6 давхар",
    caption: "Ballroom render — 6 давхар",
    images: [
      { src: "/images/ballroom/ballroom-5.jpg", alt: "Encanto Grand Ballroom — 6 давхар render 1" },
      { src: "/images/ballroom/ballroom-8.jpg", alt: "Encanto Grand Ballroom — 6 давхар render 2" },
    ],
  },
  {
    floor: "7 давхар",
    caption: "Ballroom render — 7 давхар",
    images: [
      { src: "/images/ballroom/ballroom-1.jpg", alt: "Encanto Grand Ballroom — 7 давхар render 1" },
      { src: "/images/ballroom/ballroom-12.jpg", alt: "Encanto Grand Ballroom — 7 давхар render 2" },
      { src: "/images/ballroom/ballroom-15.jpg", alt: "Encanto Grand Ballroom — 7 давхар render 3" },
    ],
  },
  {
    floor: "9 давхар",
    caption: "Open Terrace render — 9 давхар",
    images: [
      { src: "/images/ballroom/ballroom-20.jpg", alt: "Encanto Grand Ballroom — 9 давхар terrace render 1" },
      { src: "/images/ballroom/ballroom-8.jpg", alt: "Encanto Grand Ballroom — 9 давхар terrace render 2" },
    ],
  },
] as const;

export const ballroomAmenities = ballroomAdvantages;

export const ballroomFacilities = [
  {
    title: "Skyfold хуваалт",
    detail: "3 бие даасан танхим болгон хуваах автомат тусгаарлах систем.",
  },
  {
    title: "Олон төрлийн layout",
    detail: "Theatre, classroom, banquet, reception зохион байгуулалт.",
  },
  {
    title: "Дагалдах үйлчилгээ",
    detail: "VIP, bridal, make-up, wardrobe, зогсоол бүхий бүрэн дүүрэн орчин.",
  },
];

export const ballroomEventTypes = [
  { value: "wedding", label: "Хурим найр" },
  { value: "corporate", label: "Корпорацийн арга хэмжээ" },
  { value: "gala", label: "Гала үдэшлэг" },
  { value: "conference", label: "Уулзалт / Конференц" },
  { value: "other", label: "Бусад" },
] as const;

import { getSalesPhones } from "./salesTeam";

export const ballroomSalesPhones = getSalesPhones("ballroom");
