import { PortalShopProvider } from "@/components/portal/shop/PortalShopContext";

export default function PortalShopLayout({ children }: { children: React.ReactNode }) {
  return <PortalShopProvider>{children}</PortalShopProvider>;
}
