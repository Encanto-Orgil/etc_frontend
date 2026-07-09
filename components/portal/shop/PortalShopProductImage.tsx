import { SHOP_PARTNER } from "@/lib/portalShop";
import shopStyles from "./PortalShop.module.css";

type Props = {
  src: string;
  alt: string;
  className?: string;
};

export default function PortalShopProductImage({ src, alt, className }: Props) {
  return (
    <div className={`${shopStyles.productImageWrap} ${className ?? ""}`}>
      <img src={src} alt={alt} className={shopStyles.productImage} loading="lazy" />
    </div>
  );
}

export function PortalShopPartnerLogo({ size = 56 }: { size?: number }) {
  return (
    <img
      src={SHOP_PARTNER.logoUrl}
      alt={SHOP_PARTNER.name}
      className={shopStyles.partnerLogo}
      width={size}
      height={size}
    />
  );
}
