import Image, { type ImageProps } from "next/image";
import { resolveAssetUrl } from "@/lib/image";

type OptimizedImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

/**
 * Thin wrapper around `next/image` with CDN resolution for `/images/...` paths.
 *
 * @example
 * <OptimizedImage src="/images/renders/render-8.jpg" alt="ETC" width={1200} height={800} />
 */
export default function OptimizedImage({ src, alt, ...props }: OptimizedImageProps) {
  const resolved = resolveAssetUrl(src);
  const isRemote = /^https?:\/\//i.test(resolved);

  return (
    <Image
      src={isRemote ? resolved : src}
      alt={alt}
      {...props}
    />
  );
}
