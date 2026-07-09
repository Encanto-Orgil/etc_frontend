import ballroomGalleryManifest from "./ballroomGallery.manifest.json";
import type { GallerySlide } from "./pageGallery";

export type { GallerySlide };

export function getBallroomGallerySlides(): GallerySlide[] {
  return ballroomGalleryManifest.images.map((image) => ({
    image,
    title: "",
  }));
}
