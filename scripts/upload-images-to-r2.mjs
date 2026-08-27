#!/usr/bin/env node
/**
 * Upload etc_frontend/public/images → Cloudflare R2
 *
 * Usage:
 *   node scripts/upload-images-to-r2.mjs
 *   node scripts/upload-images-to-r2.mjs --dry-run
 *   node scripts/upload-images-to-r2.mjs --prefix images
 *
 * Credentials (same as Django backend):
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
 *   R2_BUCKET_NAME, R2_PUBLIC_BASE_URL
 *
 * Loads from env, or etc_backend/.env, or etc_frontend/.env.local
 */

import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(FRONTEND_ROOT, "..");
const IMAGES_DIR = path.join(FRONTEND_ROOT, "public", "images");

const CACHE_CONTROL = "public, max-age=31536000, immutable";
const MIME = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const PREFIX = args.has("--prefix")
  ? process.argv[process.argv.indexOf("--prefix") + 1] || "images"
  : "images";

async function loadEnvFile(filePath) {
  try {
    const text = await fs.readFile(filePath, "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env) || !process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    /* optional */
  }
}

function normalizePublicBase(raw) {
  const value = (raw || "").trim().replace(/\/$/, "");
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

async function walkFiles(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walkFiles(full)));
    } else if (entry.isFile()) {
      if (entry.name === ".DS_Store" || entry.name.startsWith("._")) continue;
      out.push(full);
    }
  }
  return out;
}

function contentTypeFor(filePath) {
  return MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

async function main() {
  await loadEnvFile(path.join(REPO_ROOT, "etc_backend", ".env"));
  await loadEnvFile(path.join(FRONTEND_ROOT, ".env.local"));
  await loadEnvFile(path.join(FRONTEND_ROOT, ".env"));

  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket = process.env.R2_BUCKET_NAME?.trim() || "encantotradecenter";
  const publicBase = normalizePublicBase(
    process.env.R2_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_GALLERY_CDN_BASE,
  );

  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.error(
      "Missing R2 credentials. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY",
    );
    process.exit(1);
  }

  if (!publicBase) {
    console.error("Missing R2_PUBLIC_BASE_URL (or NEXT_PUBLIC_GALLERY_CDN_BASE)");
    process.exit(1);
  }

  let S3Client;
  let PutObjectCommand;
  try {
    ({ S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3"));
  } catch {
    console.error(
      "Install AWS SDK first:\n  cd etc_frontend && npm install -D @aws-sdk/client-s3",
    );
    process.exit(1);
  }

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  const files = await walkFiles(IMAGES_DIR);
  console.log(`Found ${files.length} files in public/images`);
  console.log(`Bucket: ${bucket}`);
  console.log(`Prefix: ${PREFIX}/`);
  console.log(`Public: ${publicBase}`);
  console.log(DRY_RUN ? "Mode: dry-run\n" : "Mode: upload\n");

  let ok = 0;
  let fail = 0;

  for (const filePath of files) {
    const relative = path.relative(IMAGES_DIR, filePath).split(path.sep).join("/");
    const key = `${PREFIX}/${relative}`;
    const contentType = contentTypeFor(filePath);
    const stat = await fs.stat(filePath);
    const sizeMb = (stat.size / (1024 * 1024)).toFixed(2);

    if (DRY_RUN) {
      console.log(`[dry-run] ${key} (${sizeMb} MB) → ${publicBase}/${key}`);
      ok += 1;
      continue;
    }

    try {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: createReadStream(filePath),
          ContentType: contentType,
          CacheControl: CACHE_CONTROL,
        }),
      );
      ok += 1;
      console.log(`✓ ${key} (${sizeMb} MB)`);
    } catch (err) {
      fail += 1;
      console.error(`✗ ${key}: ${err.message || err}`);
    }
  }

  console.log(`\nDone. uploaded=${ok} failed=${fail}`);
  if (!DRY_RUN && ok > 0) {
    console.log(`\nSet in etc_frontend/.env.local and rebuild:\n`);
    console.log(`NEXT_PUBLIC_GALLERY_CDN_BASE=${publicBase}`);
    console.log(`\nExample URL:\n  ${publicBase}/${PREFIX}/renders/render-8.jpg`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
