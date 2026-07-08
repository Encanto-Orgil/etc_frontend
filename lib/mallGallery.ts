import galleryManifest from "./homeGallery.manifest.json";
import { getShuffledGallerySlides, type GallerySlide } from "./pageGallery";

export type { GallerySlide };

const MALL_GALLERY_SHUFFLE_SEED = "encanto-mall-gallery";

export function getMallGallerySlides(): GallerySlide[] {
  return getShuffledGallerySlides(galleryManifest.mall, MALL_GALLERY_SHUFFLE_SEED);
}
