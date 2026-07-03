export type SalesScope = "office" | "mall" | "ballroom" | "apartment" | "home";

export type SalesPerson = {
  id: string;
  name: string;
  title: string;
  focus: string;
  phones: string[];
  email: string;
  image: string;
  scopes: SalesScope[];
};

export const SALES_DEPARTMENT = {
  name: "Борлуулалтын алба",
  addressLines: [
    "Улаанбаатар хот, Баянзүрх дүүрэг,",
    "26-р хороо Их Монгол Улсын гудамж",
    "Энканто оффис 4 давхар",
  ],
  hours: "Даваа - Баасан: 09:00 - 18:00",
};

export const SALES_TEAM: SalesPerson[] = [
  {
    id: "hetbold",
    name: "А.Хэтболд",
    title: "Ерөнхий менежер",
    focus: "Оффис, Үйлчилгээний талбайн түрээс",
    phones: ["9919-1522"],
    email: "khetbold@orgil.mn",
    image: "https://pub-6af6c7ad6eb64cf98a65d7fd500730d9.r2.dev/sales/hetbold.jpg",
    scopes: ["office", "mall"],
  },
  {
    id: "nomin-erdene",
    name: "Т.Номин-Эрдэнэ",
    title: "Борлуулалтын менежер",
    focus: "Байрны борлуулалт",
    phones: ["9405-8858"],
    email: "nominerdene@orgil.mn",
    image: "https://pub-6af6c7ad6eb64cf98a65d7fd500730d9.r2.dev/sales/nomin.jpg",
    scopes: ["apartment", "ballroom"],
  },
  {
    id: "rolomjav",
    name: "Роломжав",
    title: "Борлуулалтын менежер",
    focus: "Байрны борлуулалт",
    phones: ["9401-8858"],
    email: "encantotown1@gmail.com",
    image: "https://pub-6af6c7ad6eb64cf98a65d7fd500730d9.r2.dev/sales/rolomjav.jpg",
    scopes: ["apartment"],
  },
];

const HOME_ORDER: SalesPerson["id"][] = ["hetbold", "nomin-erdene", "rolomjav"];

function sortForScope(people: SalesPerson[], scope: SalesScope): SalesPerson[] {
  if (scope === "home") {
    return [...people].sort(
      (a, b) => HOME_ORDER.indexOf(a.id) - HOME_ORDER.indexOf(b.id),
    );
  }

  const primary = people.filter((person) => person.scopes.includes(scope));
  const secondary = people.filter((person) => !person.scopes.includes(scope));
  return [...primary, ...secondary];
}

export function getSalesContacts(scope: SalesScope): SalesPerson[] {
  if (scope === "office" || scope === "mall") {
    return SALES_TEAM.filter((person) => person.scopes.includes(scope));
  }

  if (scope === "ballroom") {
    return SALES_TEAM.filter((person) => person.scopes.includes(scope));
  }

  if (scope === "apartment") {
    return SALES_TEAM.filter((person) => person.scopes.includes(scope));
  }

  return sortForScope(SALES_TEAM, scope);
}

export function getPrimarySalesContact(scope: Exclude<SalesScope, "home">): SalesPerson {
  return getSalesContacts(scope)[0];
}

export function isPrimaryContact(person: SalesPerson, scope: SalesScope): boolean {
  return person.scopes.includes(scope);
}

export function getSalesPhones(scope: SalesScope): string[] {
  return [...new Set(getSalesContacts(scope).flatMap((person) => person.phones))];
}

export function salesInitials(name: string): string {
  const normalized = name.replace(/\./g, " ").trim();

  return normalized
    .split(/[\s-]+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}
