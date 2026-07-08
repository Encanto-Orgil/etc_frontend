import galleryManifest from "./homeGallery.manifest.json";
import { getShuffledGallerySlides, type GallerySlide } from "./pageGallery";

export type { GallerySlide };

const OFFICE_GALLERY_SHUFFLE_SEED = "encanto-office-gallery";

export function getOfficeGallerySlides(): GallerySlide[] {
  return getShuffledGallerySlides(galleryManifest.renders, OFFICE_GALLERY_SHUFFLE_SEED);
}
