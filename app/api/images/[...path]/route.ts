import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const IMAGE_CACHE_CONTROL = "public, max-age=31536000, immutable";
const CDN_CACHE_CONTROL = "public, max-age=31536000";

/** Folders allowed under /api/images/{folder}/... */
const ALLOWED_PREFIXES = new Set([
  "renders",
  "drone",
  "mall",
  "ballroom",
  "nearby",
  "office",
  "apartment",
  "floor-plans",
  "icons",
]);

const MIME_BY_EXT: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function cacheHeaders(contentType: string): HeadersInit {
  return {
    "Content-Type": contentType,
    "Cache-Control": IMAGE_CACHE_CONTROL,
    "CDN-Cache-Control": CDN_CACHE_CONTROL,
    Vary: "Accept",
  };
}

function isSafePath(segments: string[]): boolean {
  if (!segments.length) return false;
  if (segments.some((segment) => segment === ".." || segment.includes("\0"))) return false;
  return ALLOWED_PREFIXES.has(segments[0]);
}

async function fetchFromCdn(relativePath: string): Promise<NextResponse | null> {
  const cdnBase = process.env.NEXT_PUBLIC_GALLERY_CDN_BASE?.replace(/\/$/, "");
  if (!cdnBase) return null;

  const remoteUrl = `${cdnBase}/${relativePath}`;
  const upstream = await fetch(remoteUrl, {
    next: { revalidate: 31_536_000 },
  });

  if (!upstream.ok) return null;

  const bytes = await upstream.arrayBuffer();
  const contentType =
    upstream.headers.get("content-type") ??
    MIME_BY_EXT[path.extname(relativePath).toLowerCase()] ??
    "application/octet-stream";

  return new NextResponse(bytes, {
    status: 200,
    headers: cacheHeaders(contentType),
  });
}

async function readFromPublic(relativePath: string): Promise<NextResponse | null> {
  const filePath = path.join(process.cwd(), "public", "images", relativePath);

  try {
    const bytes = await readFile(filePath);
    const contentType =
      MIME_BY_EXT[path.extname(relativePath).toLowerCase()] ?? "application/octet-stream";

    return new NextResponse(bytes, {
      status: 200,
      headers: cacheHeaders(contentType),
    });
  } catch {
    return null;
  }
}

/**
 * Serve gallery images with long-lived browser + CDN cache headers.
 *
 * GET /api/images/renders/render-8.jpg
 *   → R2/CDN (if NEXT_PUBLIC_GALLERY_CDN_BASE) or public/images/ fallback
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;
  const relativePath = segments.join("/");

  if (!isSafePath(segments)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const fromCdn = await fetchFromCdn(relativePath);
  if (fromCdn) return fromCdn;

  const fromDisk = await readFromPublic(relativePath);
  if (fromDisk) return fromDisk;

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
