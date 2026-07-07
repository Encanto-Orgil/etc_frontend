export type HomeFloorPlanCard = {
  id: "office" | "mall" | "residence";
  image: string;
  pdf: string;
};

export const homeFloorPlanCards: HomeFloorPlanCard[] = [
  {
    id: "office",
    image: "/images/renders/render-34.jpg",
    pdf: "/downloads/etc-office-floorplan.pdf",
  },
  {
    id: "mall",
    image: "/images/mall/mall-12.jpg",
    pdf: "/downloads/etc-mall-floorplan.pdf",
  },
  {
    id: "residence",
    image: "/images/renders/render-20.jpg",
    pdf: "/#contact",
  },
];
