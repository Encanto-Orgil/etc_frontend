import type { Translations } from "../types";
import { ballroomMn } from "./ballroomMn";
import { mallMn } from "./mallMn";
import { officeMn } from "./officeMn";
import { residenceMn } from "./residenceMn";

export const mn: Translations = {
  nav: {
    project: "Төсөл",
    office: "Оффис",
    mall: "Молл",
    ballroom: "Ballroom",
    residences: "Орон сууц",
    location: "Байршил",
    contact: "Холбоо барих",
    bookTour: "Танилцуулга захиалах",
    openMenu: "Цэс нээх",
  },
  footer: {
    project: "Төсөл",
    company: "Компани",
    social: "Сошиал",
    address: "Хаяг",
    home: "Нүүр",
    about: "Танилцуулга",
    news: "Мэдээ",
    contact: "Холбоо барих",
    privacy: "Нууцлал",
    copyright: "Encanto Trade Center",
    headline: "МОНГОЛЫН ХАМГИН ӨНДӨР МЕТАЛЛ БҮТЭЭЦ",
    subtitle: "Орчин үеийн тансаг амьдрал, бизнесийг нэгтгэсэн хотын төвийн цогцолбор төсөл.",
    rightsReserved: "Бүх эрх хуулиар хамгаалагдсан.",
    towerOffice: "Оффис",
    towerMall: "Молл",
    towerBallroom: "Ballroom",
    towerResidence: "Орон сууц",
  },
  project: {
    tagline: "Тансаг. Амьдрал. Бизнес. Нэгдсэн.",
    location: "Баянзүрх дүүрэг, 26-р хороо, Улаанбаатар",
    contactAddress:
      "Улаанбаатар хот, Баянзүрх дүүрэг, 26-р хороо, Их Монгол Улсын гудамж, Энканто оффис 4 давхар",
    contactAddressLines: [
      "Улаанбаатар хот, Баянзүрх дүүрэг,",
      "26-р хороо, Их Монгол Улсын гудамж",
      "Энканто оффис 4 давхар",
    ],
    contactPhone: "+976 9919-1522",
  },
  home: {
    hero: {
      tag: "Premium Offices • Luxury Residences • Retail & Lifestyle",
      title: "Encanto",
      titleLine2: "Trade Center",
      subtitle:
        "Монголын хамгийн өндөр төмөр карказан барилга болох Encanto Trade Center нь худалдаа, үйлчилгээ, оффис, орон сууцыг нэг дор нэгтгэсэн шинэ үеийн цогцолбор юм.",
      ctaPrimary: "Уулзалт товлох",
      ctaSecondary: "Төслийн дэлгэрэнгүй",
      scrollDown: "Доош гүйлгэх",
      scrollAria: "Доош гүйлгэх",
    },
    brandStatement: {
      headline: "Encanto Trade Center.",
      body: "Бизнес, амьдралын хэв маяг, ирээдүйн үнэ цэнэ нэг дор нэгдсэн онцгой орчин.",
      stats: [
        { value: "Онцгой", label: "цар хүрээ" },
        { value: "Premium", label: "байршил" },
        { value: "Тансаг", label: "мэдрэмж" },
      ],
    },
    about: {
      eyebrow: "Төслийн танилцуулга",
      title:
        "Encanto Trade Center нь хотын төвд орших, дээд зэрэглэлийн бизнес болон амьдралын хэв маягийг нэгтгэсэн цогц төсөл юм.",
      body: "Grade-A оффис, тансаг зэрэглэлийн орон сууц, premium худалдаа үйлчилгээ, ресторан болон амьдралын тав тухыг бүрэн хангасан төсөл юм.",
      imageAlt: "Encanto Trade Center зураглал",
    },
    explore: {
      eyebrow: "Encanto Trade Center",
      title: "Дөрвөн үндсэн хэсэг, нэг нэгдсэн цогцолбор.",
      viewDetails: "Дэлгэрэнгүй",
      scrollHint: "Сүүлж үзэх",
      destinationLabels: {
        office: "Оффис",
        mall: "Молл",
        ballroom: "Ballroom",
        apartment: "Орон сууц",
      },
      towers: {
        office: {
          floors: "24 давхар",
          tagline: "Бизнесийн үнэ цэнийг тодорхойлох",
          summary:
            "4.5 м таазны өндөр, YUANDA шилэн фасад, FUJITEC ухаалаг лифт, 1,500 зогсоолтой A зэрэглэлийн оффис.",
        },
        mall: {
          floors: "6 давхар",
          tagline: "Нэг дор төвлөрсөн худалдаа, үйлчилгээ",
          summary:
            "Зургаан давхар худалдаа үйлчилгээний төвд брэнд дэлгүүр, ресторан, чөлөөт цагийн болон lifestyle үйлчилгээг нэг дор багтаана.",
        },
        ballroom: {
          floors: "7–8 давхар",
          tagline: "Мартагдашгүй мөчүүдэд зориулсан тансаг орчин",
          summary:
            "7–8 давхарт Encanto Grand Ballroom — хурим, гала, корпорацийн арга хэмжээнд зориулсан 1,600 м² танхим.",
        },
        apartment: {
          floors: "34 давхар",
          tagline: "Өндөр зэрэглэлийн орон сууцны шийдэл",
          summary:
            "Хотын өргөн харагдац, premium материал, орчин үеийн төлөвлөлт бүхий 34 давхар орон сууцны цамхаг.",
        },
      },
    },
    construction: {
      eyebrow: "Барилгын явц",
      title: "2026–2027 онд үе шаттайгаар ашиглалтад орно.",
      lead: "Оффис, Ballroom 2026 оны IV улиралд, орон сууц, молл 2027 оны IV улиралд ашиглалтад орно.",
      timeline: [
        {
          period: "2026 IV улирал",
          tower: "Оффис",
          detail: "Премиум оффисын давхрууд 2026 оны IV улиралд ашиглалтад орно.",
        },
        {
          period: "2026 IV улирал",
          tower: "Ballroom",
          detail: "Grand Ballroom болон арга хэмжээний танхимууд 2026 оны IV улиралд бэлэн.",
        },
        {
          period: "2027 IV улирал",
          tower: "Орон сууц",
          detail: "Орон сууц 2027 оны IV улиралд ашиглалтад орно.",
        },
        {
          period: "2027 IV улирал",
          tower: "Молл",
          detail: "Дэлгүүр, ресторанууд 2027 оны IV улиралд нээгдэнэ.",
        },
      ],
    },
    whyEncanto: {
      eyebrow: "Яагаад Encanto?",
      title: "Шинэ үеийн онцлох",
      titleLine2: "цогцолбор",
      lead: "Бизнес, амьдрал, тав тух, урт хугацааны үнэ цэнийг нэг дор хослуулсан mixed-use цамхаг. Бизнес эрхлэгчид, оршин суугчид, хөрөнгө оруулагчдын хэрэгцээнд нийцүүлэн төлөвлөгдсөн.",
      items: [
        {
          icon: "landmark",
          title: "Хотын онцлох архитектур",
          description:
            "Брэндийн үнэ цэнийг нэмэгдүүлж, тухайн бүсийн өнгө төрхийг тодорхойлох өвөрмөц архитектурын шийдэл.",
        },
        {
          icon: "office",
          title: "Premium оффис",
          description:
            "Байршлын үнэ цэн, орчин үеийн дэд бүтэц, өндөр стандарт шаарддаг байгууллагуудад зориулсан Grade-A оффисын орчин.",
        },
        {
          icon: "residence",
          title: "Тансаг зэрэглэлийн орон сууц",
          description:
            "Хувийн орон зай, тав тух, өндөр зэрэглэлийн амьдрах стандартыг хослуулсан орон сууцны шийдэл.",
        },
        {
          icon: "investment",
          title: "Ирээдүйн үнэ цэнэ",
          description:
            "Шилдэг байршил, mixed-use төлөвлөлт, хөгжиж буй бизнесийн бүс дэх өсөлтийн боломж.",
        },
      ],
    },
    location: {
      eyebrow: "Байршил",
      title: "Хотын тав тухтай орчинд",
      defaultPreviewAlt:
        "Encanto Trade Center болон Баянзүрх дүүргийн агаарын зураг",
      nearby: "Ойролцоох газар",
      nearbyLabel: "Алхах зай",
      requestBrief: "Зам заавар авах",
    },
    floorPlans: {
      eyebrow: "Төлөвлөлт",
      title: "Давхарын төлөвлөлттэй танилцах",
      tabs: [
        { id: "office", label: "Оффис" },
        { id: "mall", label: "Молл" },
        { id: "residence", label: "Орон сууц" },
      ],
      downloadPdf: "Давхарын төлөвлөлт татах",
      imageAlt: "давхрын төлөвлөгөө",
    },
    amenities: {
      eyebrow: "Тав тух, үйлчилгээ",
      title: "Таны амьдралын хэв маягт нийцсэн орчин.",
      lead: "Оффис, худалдаа үйлчилгээ, орон сууц болон lifestyle хэсгүүдийг нэг дор холбосон, тав тухтай, аюулгүй орчин. Дотоод гүүрэн холболтоор барилгын бүх хэсэгт хялбар хүрэх боломжтой.",
      ariaLabel: "Тав тух, үйлчилгээний хэсэг",
      items: [
        { title: "Тансаг лобби" },
        { title: "Террас" },
        { title: "Спорт цогцолбор" },
        { title: "Уулзалтын өрөө" },
        { title: "Ресторан" },
        { title: "Кофе шоп" },
        { title: "Дэлгүүр" },
        { title: "Зогсоол" },
        { title: "24/7 хамгаалалт" },
        { title: "Гүүрэн холболт" },
      ],
    },
    gallery: {
      eyebrow: "Зургийн цомог",
      title: "Encanto-ийн дүр төрх.",
      items: [
        { title: "3D дүрслэл" },
        { title: "Шөнийн харагдац" },
        { title: "Лобби" },
        { title: "Оффис" },
        { title: "Орон сууц" },
        { title: "Sky Lounge" },
        { title: "Дроноор авсан зураг" },
        { title: "360° харагдац" },
      ],
      lightbox: {
        close: "Зургийн цомог хаах",
        prev: "Өмнөх зураг",
        next: "Дараагийн зураг",
        viewImage: "Зураг харах",
      },
    },
    news: {
      eyebrow: "Сүүлийн мэдээ",
      title: "Encanto-ийн мэдээлэл",
      headerNote: "Төслийн онцлох мэдээ болон шинэ мэдээлэл.",
    },
    contact: {
      eyebrow: "Холбоо барих",
      title: "Төслийн танилцуулга авах",
      lead: "Та хүсэлтээ үлдээнэ үү. Манай борлуулалтын баг тантай холбогдож, Encanto-ийн оффис, орон сууц, худалдааны талбай болон бусад боломжуудын талаар дэлгэрэнгүй мэдээлэл өгнө.",
      formTitle: "Хүсэлт илгээх",
      formLead:
        "Сонирхож буй хэсэг болон холбоо барих мэдээллээ үлдээнэ үү. Бид ажлын 1 өдрийн дотор хариу өгнө.",
      salesTeam: "Борлуулалтын баг",
      alsoAvailable: "Холбогдох мэдээлэл",
      primaryContact: "Үндсэн хариуцагч",
      departmentName: "Борлуулалтын алба",
      departmentHours: "Даваа – Баасан: 09:00 – 18:00",
      departmentAddress: [
        "Улаанбаатар хот, Баянзүрх дүүрэг,",
        "26-р хороо, Их Монгол Улсын гудамж",
        "Энканто оффис, 4 давхар",
      ],
      interestOptions: [
        { value: "office", label: "Оффис" },
        { value: "apartment", label: "Орон сууц" },
        { value: "mall", label: "Худалдааны талбай" },
        { value: "general", label: "Ерөнхий мэдээлэл" },
      ],
    },
    floatingActions: {
      ariaLabel: "Түргэн холбоо",
      messenger: "Messenger",
      phone: "Утас",
      bookVisit: "Уулзалт товлох",
    },
    inquiry: {
      office: "Оффис",
      residence: "Орон сууц",
      retail: "Худалдааны талбай",
      investment: "Ерөнхий мэдээлэл",
    },
    interactiveBuilding: {
      eyebrow: "Интерактив барилга",
      title: "Төслийн бүтэцтэй танилцаарай.",
      ariaLabel: "Интерактив барилгын зураг",
      calibrateZones: "Бүс тохируулах",
      hoverHint: "Хэсэг дээр хулганаа байрлуулна уу",
      hoverLead:
        "Оффис, Молл, Ballroom, Encanto Tower, Орон сууц эсвэл Orgil Supermarket хэсгийг сонгон дэлгэрэнгүй мэдээлэл авна уу.",
      viewLabel: "Дэлгэрэнгүй үзэх",
    },
  },
  ballroom: ballroomMn,
  office: officeMn,
  mall: mallMn,
  residence: residenceMn,
};
