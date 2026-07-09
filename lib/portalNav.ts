export const PORTAL_PAGES: Record<string, { eyebrow: string; title: string }> = {
  "/portal": { eyebrow: "Tenant Portal", title: "Overview" },
  "/portal/invoices": { eyebrow: "Tenant Portal", title: "Invoices" },
  "/portal/tickets": { eyebrow: "Tenant Portal", title: "Support" },
  "/portal/elevator": { eyebrow: "Tenant Portal", title: "Elevator Access" },
  "/portal/usage": { eyebrow: "Tenant Portal", title: "Lease summary" },
  "/portal/shop": { eyebrow: "Tenant Portal", title: "Office Shop" },
  "/portal/shop/cart": { eyebrow: "Tenant Portal", title: "Cart" },
  "/portal/shop/checkout": { eyebrow: "Tenant Portal", title: "Checkout" },
};

export function getPortalPageMeta(pathname: string) {
  if (pathname.startsWith("/portal/invoices/")) {
    return { eyebrow: "Tenant Portal", title: "Invoice Detail" };
  }
  if (pathname.startsWith("/portal/tickets/")) {
    return { eyebrow: "Tenant Portal", title: "Support Detail" };
  }
  return PORTAL_PAGES[pathname] ?? { eyebrow: "Tenant Portal", title: "Overview" };
}

export function getPortalSelectedKey(pathname: string) {
  if (pathname === "/portal") return "/portal";
  if (pathname.startsWith("/portal/invoices")) return "/portal/invoices";
  if (pathname.startsWith("/portal/tickets")) return "/portal/tickets";
  if (pathname.startsWith("/portal/elevator")) return "/portal/elevator";
  if (pathname.startsWith("/portal/usage")) return "/portal/usage";
  if (pathname.startsWith("/portal/shop")) return "/portal/shop";
  return "/portal";
}
