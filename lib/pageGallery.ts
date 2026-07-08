export type GallerySlide = {
  image: string;
  title: string;
};

function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shuffleWithSeed<T>(items: T[], seed: string): T[] {
  const result = [...items];
  let state = hashString(seed);

  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function getShuffledGallerySlides(images: string[], seed: string): GallerySlide[] {
  const slides = images.map((image) => ({ image, title: "" }));
  return shuffleWithSeed(slides, seed);
}
