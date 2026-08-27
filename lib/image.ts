/** Image URL helpers — CDN resolution + Next.js Image Optimization. */

export const DEFAULT_IMAGE_QUALITY = 80;

const GALLERY_CDN_BASE = process.env.NEXT_PUBLIC_GALLERY_CDN_BASE?.replace(/\/$/, "") ?? "";

/**
 * Resolve a site-relative `/images/...` path to the R2/CDN URL when configured.
 * R2 object keys mirror public paths: `images/renders/render-8.jpg`
 */
export function resolveAssetUrl(src: string): string {
  if (!src) return src;
  if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  if (GALLERY_CDN_BASE && src.startsWith("/images/")) {
    return `${GALLERY_CDN_BASE}${src}`;
  }
  return src;
}

/** Alias used across components for CDN-aware asset URLs. */
export function assetUrl(src: string): string {
  return resolveAssetUrl(src);
}

export type OptimizeImageOptions = {
  width: number;
  quality?: number;
};

/**
 * Build a `/_next/image` URL (AVIF/WebP via Next.js optimizer).
 * When CDN is configured, the optimizer fetches from R2 (not local disk).
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

/**
 * Direct CDN URL for CSS `background-image`.
 * Do not use `/_next/image` here — it fails as a CSS background on Vercel.
 */
export function heroBackgroundUrl(src: string): string {
  return resolveAssetUrl(src);
}

/** Direct CDN URL for gallery CSS backgrounds. */
export function galleryImageUrl(src: string): string {
  return resolveAssetUrl(src);
}

/** True when gallery assets are served from R2/CDN. */
export function isGalleryCdnEnabled(): boolean {
  return Boolean(GALLERY_CDN_BASE);
}

/** Recursively resolve `/images/...` strings in static content objects (lib data). */
export function resolveImagePaths<T>(value: T): T {
  if (typeof value === "string") {
    return (value.startsWith("/images/") ? resolveAssetUrl(value) : value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => resolveImagePaths(item)) as T;
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      out[key] = resolveImagePaths(nested);
    }
    return out as T;
  }
  return value;
}
