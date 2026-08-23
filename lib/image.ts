/** Image URL helpers — CDN resolution + Next.js Image Optimization. */

export const DEFAULT_IMAGE_QUALITY = 80;

const GALLERY_CDN_BASE = process.env.NEXT_PUBLIC_GALLERY_CDN_BASE?.replace(/\/$/, "") ?? "";

/** Resolve a site-relative /images/... path to CDN when configured. */
export function resolveAssetUrl(src: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  if (GALLERY_CDN_BASE && src.startsWith("/images/")) {
    return `${GALLERY_CDN_BASE}/${src.slice("/images/".length)}`;
  }
  return src;
}

export type OptimizeImageOptions = {
  width: number;
  quality?: number;
};

/**
 * Build a `/_next/image` URL (AVIF/WebP via Next.js optimizer).
 * Works for local `/images/...` paths and remote CDN/API URLs.
 */
export function buildImageOptimizerUrl(
  src: string,
  { width, quality = DEFAULT_IMAGE_QUALITY }: OptimizeImageOptions,
): string {
  const resolved = resolveAssetUrl(src);
  const params = new URLSearchParams({
    url: resolved,
    w: String(width),
    q: String(quality),
  });
  return `/_next/image?${params.toString()}`;
}

/** Preset widths for common layout breakpoints. */
export const IMAGE_WIDTHS = {
  thumbnail: 384,
  card: 640,
  gallery: 1080,
  hero: 1920,
  full: 2560,
} as const;

export function heroBackgroundUrl(src: string, quality = DEFAULT_IMAGE_QUALITY): string {
  return buildImageOptimizerUrl(src, { width: IMAGE_WIDTHS.hero, quality });
}

export function galleryImageUrl(src: string, quality = DEFAULT_IMAGE_QUALITY): string {
  return buildImageOptimizerUrl(src, { width: IMAGE_WIDTHS.gallery, quality });
}
