import type { NextConfig } from "next";
import path from "path";

/** Shared cache policy for optimized and static image responses. */
const IMAGE_CACHE_CONTROL = "public, max-age=31536000, immutable";
const CDN_CACHE_CONTROL = "public, max-age=31536000";

const galleryCdnHost = (() => {
  const base = process.env.NEXT_PUBLIC_GALLERY_CDN_BASE?.trim();
  if (!base) return null;
  try {
    return new URL(base).hostname;
  } catch {
    return null;
  }
})();

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: "https",
    hostname: "pub-6c7c4c348453498291848eaef41bf007.r2.dev",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "cdn.encantotrade.mn",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "api.encantotrade.mn",
    pathname: "/media/**",
  },
];

if (galleryCdnHost && !remotePatterns.some((p) => p.hostname === galleryCdnHost)) {
  remotePatterns.push({
    protocol: "https",
    hostname: galleryCdnHost,
    pathname: "/**",
  });
}

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31_536_000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns,
  },

  async redirects() {
    const cdnBase = process.env.NEXT_PUBLIC_GALLERY_CDN_BASE?.replace(/\/$/, "");
    if (!cdnBase) return [];
    return [
      {
        source: "/images/:path*",
        destination: `${cdnBase}/images/:path*`,
        permanent: true,
      },
    ];
  },

  async headers() {
    const imageHeaders = [
      { key: "Cache-Control", value: IMAGE_CACHE_CONTROL },
      { key: "CDN-Cache-Control", value: CDN_CACHE_CONTROL },
      { key: "Vary", value: "Accept" },
    ];

    return [
      {
        source: "/_next/image",
        headers: imageHeaders,
      },
      {
        source: "/_next/static/media/:path*",
        headers: imageHeaders,
      },
      {
        source: "/images/:path*",
        headers: imageHeaders,
      },
    ];
  },
};

export default nextConfig;
