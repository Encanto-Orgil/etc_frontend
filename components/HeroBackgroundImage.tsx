import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";

type HeroBackgroundImageProps = {
  src: string;
  alt?: string;
  wrapperClassName?: string;
  imageClassName?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
} & Omit<ComponentPropsWithoutRef<"div">, "children">;

export default function HeroBackgroundImage({
  src,
  alt = "",
  wrapperClassName,
  imageClassName,
  priority = false,
  loading,
  ...wrapperProps
}: HeroBackgroundImageProps) {
  return (
    <div className={wrapperClassName} {...wrapperProps}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={loading ?? (priority ? undefined : "lazy")}
        sizes="100vw"
        className={imageClassName}
        quality={85}
      />
    </div>
  );
}
