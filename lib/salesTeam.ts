export type SalesScope = "office" | "mall" | "ballroom" | "apartment" | "home";

export type SalesPerson = {
  id: string;
  name: string;
  phones: string[];
  email: string;
  scopes: SalesScope[];
};

export const SALES_TEAM: SalesPerson[] = [
  {
    id: "hetbold",
    name: "Хэтболд",
    phones: ["9919-1522"],
    email: "office@encanto.mn",
    scopes: ["office", "mall"],
  },
  {
    id: "nomin-erdene",
    name: "Номин-Эрдэнэ",
    phones: ["9401-8858"],
    email: "ballroom@encanto.mn",
    scopes: ["ballroom", "apartment"],
  },
  {
    id: "rolomjav",
    name: "Роломжав",
    phones: ["9405-8858"],
    email: "apartment@encanto.mn",
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
  return name
    .split(/[\s-]+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}
