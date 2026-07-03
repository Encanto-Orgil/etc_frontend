/**
 * Interactive Building — image + polygon zones.
 *
 * Edit zone coordinates below, or use «Calibrate zones» on the home page
 * (or `/?building-calibrate=1`) to draw polygons like the stacking plan.
 */

export type BuildingZonePoint = { x: number; y: number };

const VIEWBOX = { width: 1920, height: 1080 };

function rectPercentToZone(
  top: string,
  left: string,
  width: string,
  height: string,
): BuildingZonePoint[] {
  const x = (parseFloat(left) / 100) * VIEWBOX.width;
  const y = (parseFloat(top) / 100) * VIEWBOX.height;
  const x2 = x + (parseFloat(width) / 100) * VIEWBOX.width;
  const y2 = y + (parseFloat(height) / 100) * VIEWBOX.height;

  return [
    { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 },
    { x: Math.round(x2 * 10) / 10, y: Math.round(y * 10) / 10 },
    { x: Math.round(x2 * 10) / 10, y: Math.round(y2 * 10) / 10 },
    { x: Math.round(x * 10) / 10, y: Math.round(y2 * 10) / 10 },
  ];
}

export type BuildingDestination = {
  id: string;
  label: string;
  floors: string;
  color: string;
  href?: string;
  zone: BuildingZonePoint[];
  detail: {
    title: string;
    description: string;
  };
};

export const interactiveBuilding = {
  image: "/images/renders/render-41.jpg",
  imageAlt: "Exterior render of Encanto Trade Center",
};

export const buildingDestinations: BuildingDestination[] = [
  {
    id: "office",
    label: "Office",
    floors: "24 floors",
    color: "#8FA4B8",
    href: "/office",
    zone: rectPercentToZone("10%", "31%", "17%", "48%"),
    detail: {
      title: "Office",
      description:
        "Grade-A workspaces with 4.5 m ceilings, YUANDA glass facade, smart elevators, and direct access to mall and parking.",
    },
  },
  {
    id: "mall",
    label: "Mall",
    floors: "6 floors",
    color: "#B98E4C",
    href: "/mall",
    zone: rectPercentToZone("48%", "40%", "22%", "20%"),
    detail: {
      title: "Mall",
      description:
        "International luxury brands, dining, and lifestyle retail across a naturally lit atrium and premium passage.",
    },
  },
  {
    id: "ballroom",
    label: "Ballroom",
    floors: "7–8 floors",
    color: "#A87E3E",
    href: "/ballroom",
    zone: rectPercentToZone("36%", "44%", "14%", "14%"),
    detail: {
      title: "Ballroom",
      description:
        "1,600 m² Encanto Grand Ballroom with 7.6 m ceilings, Skyfold partitions, and premium event support spaces.",
    },
  },
  {
    id: "encanto-tower",
    label: "Encanto Tower",
    floors: "Landmark tower",
    color: "#5B7C99",
    zone: rectPercentToZone("4%", "39%", "13%", "56%"),
    detail: {
      title: "Encanto Tower",
      description:
        "The signature glass tower at the heart of the development — office, retail, and lifestyle stacked in one iconic silhouette.",
    },
  },
  {
    id: "residence",
    label: "Residence",
    floors: "34 floors",
    color: "#C8A45C",
    href: "/apartment",
    zone: rectPercentToZone("8%", "52%", "17%", "52%"),
    detail: {
      title: "Residence",
      description:
        "Sky living with panoramic views, premium finishes, concierge services, and the prestige of a landmark address.",
    },
  },
  {
    id: "orgil",
    label: "Orgil Supermarket",
    floors: "Connected",
    color: "#6B8F71",
    zone: rectPercentToZone("54%", "11%", "16%", "24%"),
    detail: {
      title: "Orgil Supermarket",
      description:
        "Everyday convenience next to the development — connected retail within walking distance of offices, residences, and the mall.",
    },
  },
];
