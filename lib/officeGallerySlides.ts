import galleryManifest from "./homeGallery.manifest.json";
import officeGalleryManifest from "./officeGallery.manifest.json";
import { getShuffledGallerySlides, type GallerySlide } from "./pageGallery";

export type { GallerySlide };

const OFFICE_GALLERY_SHUFFLE_SEED = "encanto-office-gallery";

export function getOfficeGallerySlides(): GallerySlide[] {
  const lobbySlides: GallerySlide[] = officeGalleryManifest.lobby.map((image) => ({
    image,
    title: "",
  }));
  const renderSlides = getShuffledGallerySlides(
    galleryManifest.renders,
    OFFICE_GALLERY_SHUFFLE_SEED,
  );

  return [...lobbySlides, ...renderSlides];
}
