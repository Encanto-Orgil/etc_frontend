import JsonLd from "@/components/JsonLd";
import { siteWideJsonLd } from "@/lib/seo";

export default function SiteSchema() {
  return <JsonLd data={siteWideJsonLd()} />;
}
