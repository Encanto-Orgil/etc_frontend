"use client";

import LandingSubNav from "@/components/LandingSubNav";
import { useTranslations } from "@/lib/i18n";

export default function BallroomSubNav() {
  const copy = useTranslations().ballroom.subNav;

  const links = [
    { href: "#hero", label: copy.overview },
    { href: "#experience", label: copy.experience },
    { href: "#gallery", label: copy.gallery },
    { href: "#capacity", label: copy.capacity },
    { href: "#skyfold", label: copy.skyfold },
    { href: "#highlights", label: copy.highlights },
    { href: "#contact", label: copy.contact },
    { href: "#faq", label: copy.faq },
  ] as const;

  return (
    <LandingSubNav
      links={[...links]}
      ariaLabel={copy.ariaLabel}
      variant="compact"
    />
  );
}
