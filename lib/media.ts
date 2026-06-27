/** Video assets — hosted on R2/CDN (do not symlink local files into public/). */

export const TRADE_VIDEO_SRC =
  process.env.NEXT_PUBLIC_TRADE_VIDEO_URL?.trim() ||
  "https://pub-6c7c4c348453498291848eaef41bf007.r2.dev/trade.mp4";

/** Set NEXT_PUBLIC_OFFICE_VIDEO_URL in Vercel for the office presentation reel. */
export const OFFICE_VIDEO_SRC =
  process.env.NEXT_PUBLIC_OFFICE_VIDEO_URL?.trim() || "/videos/office.mp4";
