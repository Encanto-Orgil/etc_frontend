/** Public static assets — do not use filesystem symlinks (breaks Vercel deploy). */

export const TRADE_VIDEO_SRC = "/videos/trade.mp4";

/** Set NEXT_PUBLIC_OFFICE_VIDEO_URL in Vercel for the 377MB office reel (too large for Git). */
export const OFFICE_VIDEO_SRC =
  process.env.NEXT_PUBLIC_OFFICE_VIDEO_URL?.trim() || "/videos/office.mp4";
