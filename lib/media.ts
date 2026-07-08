/** Video assets — hosted on R2/CDN (do not symlink local files into public/). */

export const TRADE_VIDEO_SRC =
  process.env.NEXT_PUBLIC_TRADE_VIDEO_URL?.trim() ||
  "https://pub-6c7c4c348453498291848eaef41bf007.r2.dev/trade.mp4";

/** Office page project film. */
export const OFFICE_VIDEO_SRC =
  process.env.NEXT_PUBLIC_OFFICE_VIDEO_URL?.trim() ||
  "https://pub-6c7c4c348453498291848eaef41bf007.r2.dev/video/ETC-W%201080HD%20copy.mp4";

/** Ballroom hero reel — chandeliers, stage, banquet setups. Falls back to trade reel. */
export const BALLROOM_VIDEO_SRC =
  process.env.NEXT_PUBLIC_BALLROOM_VIDEO_URL?.trim() || TRADE_VIDEO_SRC;

/** Mall hero reel — day-to-night lifestyle flow. Falls back to trade reel. */
export const MALL_VIDEO_SRC =
  process.env.NEXT_PUBLIC_MALL_VIDEO_URL?.trim() || TRADE_VIDEO_SRC;
