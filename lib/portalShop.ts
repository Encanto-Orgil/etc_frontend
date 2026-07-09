export type ShopCategory = "tea_coffee" | "cleaning" | "office" | "snacks";

export type ShopProduct = {
  id: string;
  name: string;
  nameMn: string;
  category: ShopCategory;
  price: number;
  unit: string;
  imageUrl: string;
  description: string;
};

export const SHOP_PARTNER = {
  name: "Orgil Supermarket",
  logoUrl:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC_GFiM6v-dEUsanXD8jqL7bMvsfAi9eN3PXCzyvZX_Wulc9qx4N_vsb4&s=10",
  tagline: "Оффисын хэрэгцээт материалаа захиалаад хүргүүлээрэй",
  discountPercent: 3,
  discountMessage: "Та бараагаа захиалаад 3%-ийн хөнгөлөлт эдлээрэй",
  deliveryNote: "Захиалга баталгаажсны дараа Orgil Supermarket-аас 24–48 цагийн дотор оффис руу хүргэнэ.",
  minOrder: 50000,
  deliveryFee: 5000,
  freeDeliveryFrom: 200000,
};

export const SHOP_CATEGORY_LABELS: Record<ShopCategory, string> = {
  tea_coffee: "Цай, кофе",
  cleaning: "Цэвэрлэгээ",
  office: "Оффисын хэрэгсэл",
  snacks: "Зайрмаг, ус",
};

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=480&h=480&q=80`;

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: "nescafe-gold",
    name: "Nescafe Gold 200g",
    nameMn: "Nescafe Gold 200г",
    category: "tea_coffee",
    price: 28900,
    unit: "ш",
    imageUrl: unsplash("photo-1559056199-641a0ac8b55e"),
    description: "Арабика кофены ууттай, оффисын өдрийн эхлэлд.",
  },
  {
    id: "mongol-tea",
    name: "Mongol Tea 100 bags",
    nameMn: "Монгол цай 100 уут",
    category: "tea_coffee",
    price: 12500,
    unit: "хайрцаг",
    imageUrl: unsplash("photo-1564890369478-c89ca6d877ce"),
    description: "Уламжлалт монгол цай, зочид буланд тохиромжтой.",
  },
  {
    id: "green-tea",
    name: "Green Tea 50 bags",
    nameMn: "Ногоон цай 50 уут",
    category: "tea_coffee",
    price: 9800,
    unit: "хайрцаг",
    imageUrl: unsplash("photo-1556673723-0629a7a66f89"),
    description: "Хөнгөн амттай ногоон цай.",
  },
  {
    id: "instant-coffee",
    name: "3-in-1 Coffee 20 sticks",
    nameMn: "3-in-1 кофе 20 ширхэг",
    category: "tea_coffee",
    price: 8900,
    unit: "сав",
    imageUrl: unsplash("photo-1495474472287-4d71bcdd2085"),
    description: "Хурдан бэлддэг 3-in-1 кофе.",
  },
  {
    id: "paper-cups",
    name: "Paper cups 50 pcs",
    nameMn: "Цаасан аяга 50 ш",
    category: "tea_coffee",
    price: 6500,
    unit: "багц",
    imageUrl: unsplash("photo-1511920170033-f8396924c10b"),
    description: "250 мл цаасан аяга, уулзалт болон зочидод.",
  },
  {
    id: "sugar-sticks",
    name: "Sugar sticks 200 pcs",
    nameMn: "Сахар 200 ширхэг",
    category: "tea_coffee",
    price: 7200,
    unit: "хайрцаг",
    imageUrl: unsplash("photo-1581441363686-90968d2fcfbd"),
    description: "Жижиг савтай сахар, цайны өрөөнд.",
  },
  {
    id: "dish-soap",
    name: "Dish soap 1L",
    nameMn: "Посын шингэн 1л",
    category: "cleaning",
    price: 5400,
    unit: "ш",
    imageUrl: unsplash("photo-1583947215250-0875e8453f61"),
    description: "Гал тогооны пос, аяга цэвэрлэгээнд.",
  },
  {
    id: "hand-soap",
    name: "Hand soap 500ml",
    nameMn: "Гарын шингэн 500мл",
    category: "cleaning",
    price: 4800,
    unit: "ш",
    imageUrl: unsplash("photo-1600857062246-154e64a307e9"),
    description: "Антибактери гарын шингэн.",
  },
  {
    id: "toilet-paper",
    name: "Toilet paper 12 rolls",
    nameMn: "00 цаас 12 ш",
    category: "cleaning",
    price: 18900,
    unit: "багц",
    imageUrl: unsplash("photo-1584438784890-1cf682d65ec7"),
    description: "3 давхар зөөлөн 00 цаас.",
  },
  {
    id: "trash-bags",
    name: "Trash bags large 30 pcs",
    nameMn: "Хогийн шуудай том 30ш",
    category: "cleaning",
    price: 7600,
    unit: "багц",
    imageUrl: unsplash("photo-1532996122724-e3c461a3d62f"),
    description: "60 литрийн хогийн шуудай.",
  },
  {
    id: "surface-cleaner",
    name: "Surface cleaner 750ml",
    nameMn: "Гадаргуу цэвэрлэгч 750мл",
    category: "cleaning",
    price: 6200,
    unit: "ш",
    imageUrl: unsplash("photo-1581578731548-c64695cc6952"),
    description: "Шил, ширээ, гадаргуу цэвэрлэх шингэн.",
  },
  {
    id: "wet-wipes",
    name: "Wet wipes 80 pcs",
    nameMn: "Чийгшүүлсэн алчуур 80ш",
    category: "cleaning",
    price: 4500,
    unit: "багц",
    imageUrl: unsplash("photo-1610701596007-11502861dcfa"),
    description: "Гар, ширээ цэвэрлэх алчуур.",
  },
  {
    id: "a4-paper",
    name: "A4 paper 500 sheets",
    nameMn: "A4 цаас 500 ш",
    category: "office",
    price: 14500,
    unit: "багц",
    imageUrl: unsplash("photo-1586281380349-632531db7ed4"),
    description: "80гр A4 цагаан цаас.",
  },
  {
    id: "ballpoint-pens",
    name: "Ballpoint pens 12 pcs",
    nameMn: "Үзэг 12 ш",
    category: "office",
    price: 3900,
    unit: "багц",
    imageUrl: unsplash("photo-1583485088034-695b96e37339"),
    description: "Хар хэсэгтэй үзгийн багц.",
  },
  {
    id: "sticky-notes",
    name: "Sticky notes 12 pads",
    nameMn: "Наалт 12 блок",
    category: "office",
    price: 8500,
    unit: "багц",
    imageUrl: unsplash("photo-1586075010923-2dd4579fb228"),
    description: "Өнгөт наалт, санах ойд.",
  },
  {
    id: "tissues",
    name: "Facial tissues 6 boxes",
    nameMn: "Салфетка 6 хайрцаг",
    category: "office",
    price: 11200,
    unit: "багц",
    imageUrl: unsplash("photo-1615485290382-441e4d049cb5"),
    description: "3 давхар салфетка, ажлын ширээнд.",
  },
  {
    id: "water-1.5l",
    name: "Mineral water 1.5L x6",
    nameMn: "Ус 1.5л x6",
    category: "snacks",
    price: 9900,
    unit: "багц",
    imageUrl: unsplash("photo-1548839140-29a7492991fd"),
    description: "Артезиан ус, уулзалтын өрөөнд.",
  },
  {
    id: "biscuits",
    name: "Assorted biscuits 400g",
    nameMn: "Жигнэмэг 400г",
    category: "snacks",
    price: 6800,
    unit: "ш",
    imageUrl: unsplash("photo-1558961363-fa8f2d551348"),
    description: "Зочид, ажилтнуудад зориулсан жигнэмэг.",
  },
];

export function getProductById(id: string) {
  return SHOP_PRODUCTS.find((product) => product.id === id);
}

export function calcDeliveryFee(subtotal: number) {
  if (subtotal >= SHOP_PARTNER.freeDeliveryFrom) return 0;
  return SHOP_PARTNER.deliveryFee;
}

export function calcDiscountAmount(subtotal: number) {
  if (subtotal <= 0) return 0;
  return Math.round(subtotal * (SHOP_PARTNER.discountPercent / 100));
}

export function calcOrderTotal(subtotal: number) {
  const discountAmount = calcDiscountAmount(subtotal);
  const deliveryFee = calcDeliveryFee(subtotal);
  return subtotal - discountAmount + deliveryFee;
}
