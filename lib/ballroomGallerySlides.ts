import { resolveAssetUrl } from "@/lib/image";
import ballroomGalleryManifest from "./ballroomGallery.manifest.json";
import type { GallerySlide } from "./pageGallery";

export type { GallerySlide };

export function getBallroomGallerySlides(): GallerySlide[] {
  return ballroomGalleryManifest.images.map((image) => ({
    image: resolveAssetUrl(image),
    title: "",
  }));
}
