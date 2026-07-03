import LandingSubNav from "@/components/LandingSubNav";

const links = [
  { href: "#hero", label: "Overview" },
  { href: "#experience", label: "Experience" },
  { href: "#gallery", label: "Gallery" },
  { href: "#capacity", label: "Capacity" },
  { href: "#skyfold", label: "Skyfold" },
  { href: "#highlights", label: "Highlights" },
  { href: "#contact", label: "Contact" },
  { href: "#faq", label: "FAQ" },
] as const;

export default function BallroomSubNav() {
  return (
    <LandingSubNav
      links={[...links]}
      ariaLabel="Ballroom sections"
      variant="compact"
    />
  );
}
