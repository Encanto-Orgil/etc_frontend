export const PORTAL_PAGES: Record<string, { eyebrow: string; title: string }> = {
  "/portal": { eyebrow: "Tenant Portal", title: "Overview" },
  "/portal/invoices": { eyebrow: "Tenant Portal", title: "Invoices" },
  "/portal/tickets": { eyebrow: "Tenant Portal", title: "Support" },
};

export function getPortalPageMeta(pathname: string) {
  return PORTAL_PAGES[pathname] ?? { eyebrow: "Tenant Portal", title: "Overview" };
}

export function getPortalSelectedKey(pathname: string) {
  if (pathname === "/portal") return "/portal";
  if (pathname.startsWith("/portal/invoices")) return "/portal/invoices";
  if (pathname.startsWith("/portal/tickets")) return "/portal/tickets";
  return "/portal";
}
